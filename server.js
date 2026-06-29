const express = require('express');
const multer = require('multer');
const cors = require('cors');
const fs = require('fs');
const tencentcloud = require('tencentcloud-sdk-nodejs');

require('dotenv').config();

const app = express();
const upload = multer({ dest: 'uploads/' });
app.use(cors());
app.use(express.json({ limit: '10mb' }));

const SECRET_ID = process.env.SECRET_ID;
const SECRET_KEY = process.env.SECRET_KEY;
if (!SECRET_ID || !SECRET_KEY) {
    console.error('❌ 错误：请在 .env 文件中设置 SECRET_ID 和 SECRET_KEY');
    process.exit(1);
}

const IaiClient = tencentcloud.iai.v20200303.Client;

const client = new IaiClient({
    credential: { secretId: SECRET_ID, secretKey: SECRET_KEY },
    region: 'ap-guangzhou',
    profile: { httpProfile: { endpoint: 'iai.tencentcloudapi.com' } }
});

// ---------- 1. DetectFaceAttributes ----------
async function detectFaceAttributes(base64Image) {
    const params = {
        Image: base64Image,
        FaceAttributesType: 'FaceShape,Eyebrow,Eye,Nose,Mouth,Skin',
        FaceModelVersion: '3.0'
    };
    try {
        const response = await client.DetectFaceAttributes(params);
        console.log('✅ DetectFaceAttributes 返回:', JSON.stringify(response, null, 2));
        return response;
    } catch (error) {
        console.error('❌ DetectFaceAttributes 失败:', error);
        throw error;
    }
}

// ---------- 2. AnalyzeFace ----------
async function analyzeFace(base64Image) {
    const params = { Image: base64Image, Mode: 1 };
    try {
        const response = await client.AnalyzeFace(params);
        console.log('✅ AnalyzeFace 返回:', JSON.stringify(response, null, 2));
        return response;
    } catch (error) {
        console.error('❌ AnalyzeFace 失败:', error);
        throw error;
    }
}

// ---------- 3. AnalyzeDenseLandmarks ----------
async function analyzeDenseLandmarks(base64Image) {
    const params = { Image: base64Image, Mode: 1 };
    try {
        const response = await client.AnalyzeDenseLandmarks(params);
        console.log('✅ AnalyzeDenseLandmarks 返回:', JSON.stringify(response, null, 2));
        return response;
    } catch (error) {
        console.error('❌ AnalyzeDenseLandmarks 失败:', error);
        throw error;
    }
}

// ---------- 辅助：从关键点计算脸型 ----------
function calcFaceShapeFromPoints(facePoints) {
    if (!facePoints || !facePoints.Contour || facePoints.Contour.length < 10) return null;
    const contour = facePoints.Contour; // 脸型轮廓点（21个点）
    let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
    for (const p of contour) {
        if (p.X < minX) minX = p.X;
        if (p.X > maxX) maxX = p.X;
        if (p.Y < minY) minY = p.Y;
        if (p.Y > maxY) maxY = p.Y;
    }
    const width = maxX - minX;
    const height = maxY - minY;
    if (width === 0) return null;
    const ratio = height / width;
    // 阈值可调：鹅蛋脸 ~1.3-1.5，圆脸 <1.2，长脸 >1.6，方脸接近1.2-1.4且轮廓棱角分明
    if (ratio < 1.15) return '圆脸';
    if (ratio > 1.6) return '长脸';
    // 判断方脸：轮廓点中下颌角是否明显（检测左右下颌角角度）
    // 简化：若宽高比在1.2-1.5且轮廓点标准差大，可能为方脸，这里粗略返回鹅蛋脸
    return '鹅蛋脸';
}

// ---------- 辅助：从关键点计算鼻型 ----------
function calcNoseTypeFromPoints(facePoints) {
    if (!facePoints || !facePoints.Nose || facePoints.Nose.length < 5) return null;
    const nose = facePoints.Nose; // 鼻子关键点（13个点）
    // 取鼻梁上端（可能第一个点）和鼻尖（中间点）
    const top = nose[0];          // 近似鼻根
    const tip = nose[4];          // 近似鼻尖（可根据实际索引调整）
    const left = nose[2];         // 左鼻翼
    const right = nose[6];        // 右鼻翼
    // 计算鼻梁高度（垂直距离）
    const height = tip.Y - top.Y;
    // 计算鼻翼宽度
    const width = right.X - left.X;
    if (width === 0) return null;
    const ratio = height / width;
    // 经验阈值：塌鼻 height 较小，鹰钩鼻 鼻尖突出，蒜头鼻 宽度大
    if (ratio < 0.5) return '塌鼻';
    if (ratio > 1.0) return '鹰钩鼻';
    // 如果宽度较大（>某值）则为蒜头鼻
    if (width > 30) return '蒜头鼻'; // 像素值，相对值
    return '直鼻';
}

// ---------- 综合解析 ----------
function parseCombinedData(attrResult, faceResult, denseResult) {
    let faceData = {
        faceShape: '未知',
        skinColor: '未知',
        eyebrowType: '未知',
        eyelidType: '未知',
        noseType: '未知',
        mouthType: '未知',
        overallStyle: '自然'
    };

    // 1. 从 DetectFaceAttributes 解析属性
    if (attrResult && attrResult.FaceDetailInfos && attrResult.FaceDetailInfos.length > 0) {
        const attr = attrResult.FaceDetailInfos[0].FaceDetailAttributesInfo || {};

        // ---- 脸型（接口） ----
        const shape = attr.Shape || {};
        const shapeMap = { 0: '未知', 1: '方脸', 2: '圆脸', 3: '鹅蛋脸', 4: '心形脸', 5: '三角形脸' };
        let shapeType = shapeMap[shape.Type] || '未知';
        // 如果接口返回未知，尝试用关键点计算
        if (shapeType === '未知' && faceResult && faceResult.FaceInfos && faceResult.FaceInfos.length > 0) {
            const facePoints = faceResult.FaceInfos[0].FacePoints;
            const calcShape = calcFaceShapeFromPoints(facePoints);
            if (calcShape) shapeType = calcShape;
        }
        faceData.faceShape = shapeType;

        // ---- 肤质（原肤色） ----
        const skin = attr.Skin || {};
        const skinMap = { 0: '未知', 1: '油性', 2: '干性', 3: '中性', 4: '混合性' };
        faceData.skinColor = skinMap[skin.Type] || '未知';

        // ---- 眉毛形状 ----
        const eyebrow = attr.Eyebrow || {};
        const curve = eyebrow.EyebrowCurve || {};
        const eyebrowMap = { 0: '未知', 1: '弯眉', 2: '平眉', 3: '挑眉' };
        faceData.eyebrowType = eyebrowMap[curve.Type] || '未知';

        // ---- 单双眼皮 ----
        const eye = attr.Eye || {};
        const eyelid = eye.EyelidType || {};
        if (eyelid.Type !== undefined) {
            faceData.eyelidType = eyelid.Type === 1 ? '双眼皮' : (eyelid.Type === 0 ? '单眼皮' : '未知');
        }

        // ---- 鼻型（接口） ----
        const nose = attr.Nose || {};
        const noseMap = { 0: '未知', 1: '鹰钩鼻', 2: '直鼻', 3: '蒜头鼻' };
        let noseType = noseMap[nose.Type] || '未知';
        // 如果接口返回未知，尝试用关键点计算
        if (noseType === '未知' && faceResult && faceResult.FaceInfos && faceResult.FaceInfos.length > 0) {
            const facePoints = faceResult.FaceInfos[0].FacePoints;
            const calcNose = calcNoseTypeFromPoints(facePoints);
            if (calcNose) noseType = calcNose;
        }
        faceData.noseType = noseType;

        // ---- 嘴型（保留未知，因为接口无直接字段） ----
        faceData.mouthType = '未知';
    }

    // 关键点（可选）
    let keypoints90 = null;
    if (faceResult && faceResult.FaceInfos && faceResult.FaceInfos.length > 0) {
        keypoints90 = faceResult.FaceInfos[0].FacePoints || null;
    }
    let keypoints888 = null;
    if (denseResult && denseResult.FaceInfos && denseResult.FaceInfos.length > 0) {
        keypoints888 = denseResult.FaceInfos[0].DenseLandmarks || null;
    }

    return { faceData, keypoints90, keypoints888 };
}

// ---------- 接口 ----------
app.post('/api', upload.single('image'), async (req, res) => {
    console.log('📩 收到分析请求');

    let base64Image = null;

    if (req.file) {
        console.log('📎 上传文件:', req.file.filename);
        try {
            const imageBuffer = fs.readFileSync(req.file.path);
            base64Image = imageBuffer.toString('base64');
            fs.unlinkSync(req.file.path);
        } catch (err) {
            console.error('读取文件失败:', err);
            return res.status(500).json({ error: '读取图片失败' });
        }
    } else if (req.body.image) {
        base64Image = req.body.image;
        console.log('📎 收到 Base64 图片');
    }

    if (!base64Image) {
        return res.status(400).json({ error: '未收到图片' });
    }

    try {
        const [attrResult, faceResult, denseResult] = await Promise.all([
            detectFaceAttributes(base64Image),
            analyzeFace(base64Image),
            analyzeDenseLandmarks(base64Image)
        ]);

        console.log('✅ 所有接口调用成功');
        const result = parseCombinedData(attrResult, faceResult, denseResult);
        res.json(result);
    } catch (error) {
        console.error('❌ 处理失败:', error.message);
        res.status(500).json({ error: error.message || '分析失败，请稍后重试' });
    }
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`🚀 后端服务已启动: http://localhost:${PORT}`);
});