<template>
  <view class="app-container">
    <!-- 启动过渡界面 -->
    <view class="splash-screen" v-if="showSplash">
      <view class="splash-logo">💄</view>
      <text class="splash-title">AI美妆私教</text>
      <text class="splash-subtitle">面部特征检测与妆容指导</text>
      <view class="splash-loading">
        <view class="splash-dot"></view>
        <view class="splash-dot"></view>
        <view class="splash-dot"></view>
      </view>
    </view>

    <!-- 主应用界面 -->
    <template v-if="!showSplash">
      <view class="header">
        <text class="header-title">💄 AI美妆私教</text>
        <text class="header-subtitle">面部特征检测与妆容指导</text>
      </view>

      <scroll-view class="main-scroll" scroll-y="true" :style="{ height: scrollHeight + 'px' }">
        <view class="card">
          <text class="card-title">📌 选择场景</text>
          <view class="scene-buttons">
            <button 
              v-for="scene in scenes" 
              :key="scene.value"
              :class="['scene-btn', selectedScene === scene.value ? 'active' : '']"
              @click="selectScene(scene.value)">
              {{ scene.icon }} {{ scene.label }}
            </button>
          </view>
        </view>

        <view class="card">
          <text class="card-title">📷 上传正面自拍</text>
          <view class="upload-actions">
            <button class="btn-camera" @click="takePhoto">
              <text class="btn-icon">📸</text>
              <text>拍摄</text>
            </button>
            <button class="btn-gallery" @click="pickFromAlbum">
              <text class="btn-icon">🖼️</text>
              <text>相册</text>
            </button>
          </view>
          <text class="hint-text">⚠️ 请上传正面、清晰、无遮挡的正面自拍照片</text>
          <text class="hint-text">支持JPG/PNG格式，大小不超过5MB</text>
          <view v-if="imageSrc" class="preview-box">
            <image :src="imageSrc" mode="widthFix" class="preview-image"></image>
          </view>
        </view>

        <view class="card">
          <button 
            :class="['btn-analyze', !imageSrc ? 'disabled' : '']" 
            @click="startAnalysis"
            :disabled="!imageSrc">
            🔍 开始面部分析
          </button>
          <button class="btn-reset" @click="resetAll">🔄 重新上传</button>
        </view>

        <view v-if="showResult" class="result-area">
          <view class="scene-tag">
            <text>当前场景：{{ sceneLabel }}</text>
          </view>

          <view class="card">
            <text class="card-title">🤖 AI面部分析结果</text>
            <view class="result-grid">
              <view class="result-item" v-for="(value, key) in faceData" :key="key">
                <text class="result-label">{{ labelMap[key] }}</text>
                <text class="result-value">{{ value }}</text>
              </view>
            </view>
          </view>

          <view class="card">
            <text class="card-title">💄 {{ sceneLabel }}妆容建议</text>
            <view class="advice-card">
              <text class="advice-text">{{ makeupAdvice.baseAdvice }}</text>
            </view>
            <view class="advice-card highlight" v-for="(item, index) in makeupAdvice.highlights" :key="'h'+index">
              <text class="advice-text">✅ {{ item }}</text>
            </view>
            <view class="advice-card warning" v-for="(item, index) in makeupAdvice.weaknesses" :key="'w'+index">
              <text class="advice-text">⚠️ {{ item }}</text>
            </view>
          </view>

          <view class="card">
            <text class="card-title">🎬 推荐视频教程</text>
            <view class="video-link" v-for="(link, index) in videoLinks" :key="index" @click="openLink(link.url)">
              <text class="video-text">📺 {{ link.keyword }}</text>
            </view>
          </view>
        </view>
        <view style="height: 100rpx;"></view>
      </scroll-view>

      <view class="footer">
        <button class="btn-history" @click="showHistory">📋 历史 ({{ historyCount }})</button>
        <text class="status-text">{{ statusText }}</text>
      </view>
    </template>

    <view class="loading-overlay" v-if="isLoading">
      <view class="loading-spinner"></view>
      <text class="loading-text">🤖 AI正在分析你的面部特征...</text>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      showSplash: true,
      selectedScene: 'commute',
      scenes: [
        { value: 'commute', label: '通勤', icon: '💼' },
        { value: 'date', label: '约会', icon: '🌹' },
        { value: 'interview', label: '面试', icon: '📄' },
        { value: 'school', label: '上学', icon: '📚' }
      ],
      imageSrc: '',
      isLoading: false,
      showResult: false,
      statusText: '就绪 - 请上传正面自拍照片',
      historyCount: 0,
      scrollHeight: 600,
      faceData: {
        faceShape: '未知',
        skinColor: '未知',
        eyeDistance: '标准',
        eyeSize: '中',
        browThickness: '中',
        eyebrowType: '未知',
        foreheadLength: '标准',
        faceProportion: '均衡',
        eyelidType: '未知',
        noseType: '未知',
        mouthType: '未知',
        overallStyle: '自然'
      },
      makeupAdvice: {},
      videoLinks: [],
      apiBaseUrl: 'http://localhost:3000',
      labelMap: {
        faceShape: '脸型',
        skinColor: '肤色',
        eyeDistance: '眼距',
        eyeSize: '眼睛大小',
        browThickness: '眉毛粗细',
        eyebrowType: '眉毛形状',
        foreheadLength: '额头长短',
        faceProportion: '三庭长短',
        eyelidType: '单双眼皮',
        noseType: '鼻型',
        mouthType: '嘴型',
        overallStyle: '综合风格'
      }
    }
  },
  computed: {
    sceneLabel() {
      const scene = this.scenes.find(s => s.value === this.selectedScene);
      return scene ? scene.label : '通用';
    }
  },
  mounted() {
    setTimeout(() => {
      this.showSplash = false;
      this.$nextTick(() => {
        const systemInfo = uni.getSystemInfoSync();
        this.scrollHeight = systemInfo.windowHeight - 160;
        this.updateHistoryCount();
      });
    }, 2000);
  },
  methods: {
    selectScene(scene) {
      this.selectedScene = scene;
      this.statusText = `已选择场景：${this.sceneLabel}，请上传照片`;
    },
    takePhoto() {
      uni.chooseImage({
        count: 1,
        sizeType: ['compressed'],
        sourceType: ['camera'],
        success: (res) => this.processImage(res.tempFilePaths[0]),
        fail: () => uni.showToast({ title: '拍摄失败，请重试', icon: 'none' })
      });
    },
    pickFromAlbum() {
      uni.chooseImage({
        count: 1,
        sizeType: ['compressed'],
        sourceType: ['album'],
        success: (res) => this.processImage(res.tempFilePaths[0]),
        fail: () => uni.showToast({ title: '选择失败，请重试', icon: 'none' })
      });
    },
    processImage(filePath) {
      uni.getFileInfo({
        filePath: filePath,
        success: (info) => {
          if (info.size > 5 * 1024 * 1024) {
            uni.showToast({ title: '图片大小不能超过5MB，请压缩后重新上传', icon: 'none' });
            return;
          }
          this.imageSrc = filePath;
          this.showResult = false;
          this.statusText = `✅ 照片已上传，场景：${this.sceneLabel}`;
        },
        fail: () => uni.showToast({ title: '无法读取图片信息，请重新选择', icon: 'none' })
      });
    },
    async startAnalysis() {
      if (!this.imageSrc) {
        uni.showToast({ title: '请先上传照片', icon: 'none' });
        return;
      }
      this.isLoading = true;
      this.showResult = false;
      this.statusText = '🔍 正在上传照片并分析...';
      try {
        const res = await uni.uploadFile({
          url: this.apiBaseUrl + '/api',
          filePath: this.imageSrc,
          name: 'image',
          formData: { scene: this.selectedScene }
        });
        const result = JSON.parse(res.data);
        if (result.error) {
          this.isLoading = false;
          this.imageSrc = '';
          uni.showToast({ title: result.error || '分析失败，请重试', icon: 'none' });
          this.statusText = '❌ 检测失败，请重新上传正面人脸照片';
          return;
        }
        if (result.faceData) {
          this.faceData = { ...this.faceData, ...result.faceData };
        }
        this.makeupAdvice = this.generateAdvice(this.faceData, this.selectedScene);
        this.videoLinks = this.generateVideoLinks(this.faceData, this.selectedScene);
        this.saveHistory();
        this.isLoading = false;
        this.showResult = true;
        this.statusText = `✅ 分析完成！${this.sceneLabel}场景 · ${this.faceData.faceShape || '已检测'}`;
      } catch (e) {
        console.error('API调用失败:', e);
        this.isLoading = false;
        uni.showToast({ title: '分析失败，请检查后端服务是否启动', icon: 'none' });
        this.statusText = '❌ 分析失败，请检查后端服务';
      }
    },

    // ========== 丰富后的妆容建议（结合更多特征） ==========
    generateAdvice(data, scene) {
      const advice = { highlights: [], weaknesses: [], baseAdvice: '' };

      // ---- 场景基础建议（保留原有） ----
      if (scene === 'commute') {
        advice.baseAdvice = '通勤妆容以“干净、效率”为主，5-10分钟快速完妆，大地色系最安全。';
        advice.highlights.push('底妆轻薄透气，避免假面感');
        advice.highlights.push('眼妆以哑光大地色为主，消肿又自然');
        advice.weaknesses.push('避免浓重眼线和亮片，通勤场合不宜过于张扬');
      } else if (scene === 'date') {
        advice.baseAdvice = '约会妆容可以稍显甜美，粉嫩色系提升气色。';
        advice.highlights.push('腮红可以比平时多打一点，增加可爱度');
        advice.highlights.push('选择水光感唇釉，打造嘟嘟唇效果');
        advice.weaknesses.push('避免浓重修容，近距离接触会显得妆感重');
      } else if (scene === 'interview') {
        advice.baseAdvice = '面试妆容以“稳重、专业”为主，哑光底妆+豆沙色口红最稳妥。';
        advice.highlights.push('眉毛画出清晰有力的眉峰，体现自信');
        advice.highlights.push('口红选择豆沙色或裸粉色，亲和力强');
        advice.weaknesses.push('避免大红唇和亮片眼影，面试需要低调专业');
      } else if (scene === 'school') {
        advice.baseAdvice = '上学妆容追求“伪素颜”，轻薄透气，仿佛天生好皮肤。';
        advice.highlights.push('用BB霜或素颜霜代替粉底，保留皮肤质感');
        advice.highlights.push('睫毛夹翘刷一层睫毛打底，眼睛立刻有神');
        advice.weaknesses.push('避免浓妆和夸张修容，学生妆以清纯自然为主');
      }

      // ---- 脸型叠加（原有） ----
      if (data.faceShape === '圆脸') {
        advice.highlights.push('修容重点在下颌角，从耳朵向嘴角方向扫');
        advice.weaknesses.push('避免圆形腮红，应斜向上打');
      } else if (data.faceShape === '方脸') {
        advice.highlights.push('修容重点在额角和下颌角，向内晕染柔和线条');
        advice.weaknesses.push('避免折线眉，会强调脸型棱角');
      } else if (data.faceShape === '长脸') {
        advice.highlights.push('腮红横向打在面中，视觉缩短脸型');
        advice.weaknesses.push('眉毛不要画太高，适当压低眉头');
      }

      // ---- 肤色叠加（新增） ----
      if (data.skinColor === '油性') {
        advice.highlights.push('使用控油妆前乳和哑光粉底，定妆要扎实');
        advice.weaknesses.push('避免过于滋润的底妆产品，容易脱妆');
      } else if (data.skinColor === '干性') {
        advice.highlights.push('选择滋润型妆前乳和保湿粉底，妆前做好保湿');
        advice.weaknesses.push('避免使用散粉过多，易卡粉起皮');
      } else if (data.skinColor === '混合性') {
        advice.highlights.push('T区控油，U区保湿，分区上妆');
      } else if (data.skinColor === '中性') {
        advice.highlights.push('中性皮肤选择范围广，可根据季节调整');
      }

      // ---- 眉毛形状（新增） ----
      if (data.eyebrowType === '弯眉') {
        advice.highlights.push('弯眉适合温柔风格，眉峰略挑更显精神');
      } else if (data.eyebrowType === '平眉') {
        advice.highlights.push('平眉显得年轻无辜，注意眉头晕染自然');
      } else if (data.eyebrowType === '挑眉') {
        advice.highlights.push('挑眉增强气场，适合职场或正式场合');
      }

      // ---- 眼皮类型（新增） ----
      if (data.eyelidType === '单眼皮') {
        advice.highlights.push('用大地色眼影消肿，加深眼尾，避免闪光大亮片');
        advice.highlights.push('画半截眼线或只画眼尾，眼睛更有神');
        advice.weaknesses.push('避免内眼线画太粗，容易显得眼睛更小');
      } else if (data.eyelidType === '双眼皮') {
        advice.highlights.push('双眼皮可尝试多种眼妆，但注意眼影范围不超过眼窝');
        advice.weaknesses.push('避免亮片色涂满整个眼皮，显肿');
      }

      // ---- 鼻型叠加（原有，并扩展） ----
      if (data.noseType === '塌鼻' || data.noseType === '蒜头鼻') {
        advice.highlights.push('鼻影从眉头延伸到鼻翼，立体感立现');
        advice.highlights.push('鼻梁高光从山根轻扫至鼻尖，视觉拉长');
      } else if (data.noseType === '鹰钩鼻') {
        advice.highlights.push('鼻梁高光打在鼻骨上方，避免突出鼻头');
        advice.weaknesses.push('避免在鼻尖打高光，会强调鹰钩');
      }

      // ---- 嘴型叠加（原有） ----
      if (data.mouthType === '厚唇') {
        advice.highlights.push('用遮瑕模糊唇线，唇中加深打造渐变效果');
        advice.weaknesses.push('避免全涂深色口红，会使嘴唇更突出');
      } else if (data.mouthType === '薄唇') {
        advice.highlights.push('用唇线笔外扩1mm，浅色唇釉增加丰满感');
        advice.weaknesses.push('避免深色哑光唇，会让嘴唇更显薄');
      }

      // ---- 综合风格（通用） ----
      advice.highlights.push('妆容整体要协调，突出一个重点（眼妆或唇妆）');

      // 限制建议数量（保留重要项）
      if (advice.highlights.length > 8) advice.highlights = advice.highlights.slice(0, 8);
      if (advice.weaknesses.length > 6) advice.weaknesses = advice.weaknesses.slice(0, 6);

      return advice;
    },

    // ========== 丰富后的视频推荐（结合更多特征） ==========
    generateVideoLinks(data, scene) {
      const keywords = [];

      // ---- 场景 ----
      const sceneMap = {
        commute: '通勤妆教程',
        date: '约会妆教程',
        interview: '面试妆教程',
        school: '学生伪素颜教程'
      };
      if (sceneMap[scene]) {
        keywords.push({ keyword: sceneMap[scene], url: `https://search.bilibili.com/all?keyword=${encodeURIComponent(sceneMap[scene])}` });
      }

      // ---- 脸型 ----
      if (data.faceShape && data.faceShape !== '未知') {
        keywords.push({ keyword: `${data.faceShape}修容教程`, url: `https://search.bilibili.com/all?keyword=${encodeURIComponent(data.faceShape + '修容教程')}` });
      }

      // ---- 肤色 ----
      if (data.skinColor && data.skinColor !== '未知') {
        if (data.skinColor === '油性') {
          keywords.push({ keyword: '油皮底妆教程', url: 'https://search.bilibili.com/all?keyword=油皮底妆教程' });
          keywords.push({ keyword: '控油定妆技巧', url: 'https://search.bilibili.com/all?keyword=控油定妆技巧' });
        } else if (data.skinColor === '干性') {
          keywords.push({ keyword: '干皮底妆教程', url: 'https://search.bilibili.com/all?keyword=干皮底妆教程' });
          keywords.push({ keyword: '干皮保湿妆前', url: 'https://search.bilibili.com/all?keyword=干皮保湿妆前' });
        } else if (data.skinColor === '混合性') {
          keywords.push({ keyword: '混合皮底妆技巧', url: 'https://search.bilibili.com/all?keyword=混合皮底妆技巧' });
        }
      }

      // ---- 眉毛形状 ----
      if (data.eyebrowType && data.eyebrowType !== '未知') {
        if (data.eyebrowType === '弯眉') {
          keywords.push({ keyword: '弯眉画法教程', url: 'https://search.bilibili.com/all?keyword=弯眉画法教程' });
        } else if (data.eyebrowType === '平眉') {
          keywords.push({ keyword: '平眉画法教程', url: 'https://search.bilibili.com/all?keyword=平眉画法教程' });
        } else if (data.eyebrowType === '挑眉') {
          keywords.push({ keyword: '挑眉画法教程', url: 'https://search.bilibili.com/all?keyword=挑眉画法教程' });
        }
      }

      // ---- 眼皮类型 ----
      if (data.eyelidType && data.eyelidType !== '未知') {
        if (data.eyelidType === '单眼皮') {
          keywords.push({ keyword: '单眼皮眼妆教程', url: 'https://search.bilibili.com/all?keyword=单眼皮眼妆教程' });
          keywords.push({ keyword: '单眼皮消肿眼妆', url: 'https://search.bilibili.com/all?keyword=单眼皮消肿眼妆' });
        } else if (data.eyelidType === '双眼皮') {
          keywords.push({ keyword: '双眼皮眼妆教程', url: 'https://search.bilibili.com/all?keyword=双眼皮眼妆教程' });
        }
      }

      // ---- 鼻型 ----
      if (data.noseType && data.noseType !== '未知') {
        if (data.noseType === '塌鼻' || data.noseType === '蒜头鼻') {
          keywords.push({ keyword: '鼻影修容教程', url: 'https://search.bilibili.com/all?keyword=鼻影修容教程' });
        } else if (data.noseType === '鹰钩鼻') {
          keywords.push({ keyword: '鹰钩鼻修饰教程', url: 'https://search.bilibili.com/all?keyword=鹰钩鼻修饰教程' });
        }
      }

      // ---- 嘴型 ----
      if (data.mouthType && data.mouthType !== '未知') {
        if (data.mouthType === '厚唇') {
          keywords.push({ keyword: '厚唇妆容教程', url: 'https://search.bilibili.com/all?keyword=厚唇妆容教程' });
        } else if (data.mouthType === '薄唇') {
          keywords.push({ keyword: '薄唇丰唇教程', url: 'https://search.bilibili.com/all?keyword=薄唇丰唇教程' });
        }
      }

      // ---- 综合风格（额外） ----
      if (scene === 'commute' || scene === 'interview') {
        keywords.push({ keyword: '职场日常妆容', url: 'https://search.bilibili.com/all?keyword=职场日常妆容' });
      } else if (scene === 'date') {
        keywords.push({ keyword: '甜美约会妆容', url: 'https://search.bilibili.com/all?keyword=甜美约会妆容' });
      } else if (scene === 'school') {
        keywords.push({ keyword: '学生清新妆容', url: 'https://search.bilibili.com/all?keyword=学生清新妆容' });
      }

      // 去重
      const unique = [];
      const seen = new Set();
      for (const item of keywords) {
        if (!seen.has(item.keyword)) {
          seen.add(item.keyword);
          unique.push(item);
        }
      }
      // 最多返回8个（原为6，增加至8以容纳更多内容）
      return unique.slice(0, 8);
    },

    saveHistory() {
      const history = uni.getStorageSync('DM_HISTORY') || [];
      history.unshift({
        recordId: 'rec_' + Date.now(),
        scene: this.selectedScene,
        faceShape: this.faceData.faceShape || '未知',
        overallStyle: this.faceData.overallStyle || '自然',
        tryTime: new Date().toISOString().replace('T', ' ').substring(0, 19)
      });
      while (history.length > 10) history.pop();
      uni.setStorageSync('DM_HISTORY', history);
      this.updateHistoryCount();
    },
    updateHistoryCount() {
      const history = uni.getStorageSync('DM_HISTORY') || [];
      this.historyCount = history.length;
    },
    showHistory() {
      const history = uni.getStorageSync('DM_HISTORY') || [];
      if (history.length === 0) {
        uni.showToast({ title: '暂无历史记录', icon: 'none' });
        return;
      }
      const items = history.slice(0, 5).map(r => `[${r.scene}] ${r.faceShape} · ${r.overallStyle}\n${r.tryTime}`).join('\n\n');
      uni.showModal({ title: '最近分析记录', content: items, showCancel: false });
    },
    openLink(url) {
      if (typeof plus !== 'undefined' && plus.runtime) {
        plus.runtime.openURL(url);
      } else {
        window.open(url, '_blank');
      }
    },
    resetAll() {
      this.imageSrc = '';
      this.showResult = false;
      this.statusText = '就绪 - 请上传正面自拍照片';
    }
  }
}
</script>

<style scoped>
/* ========== 启动过渡界面 ========== */
.splash-screen {
  position: fixed;
  top: 0; left: 0;
  width: 100vw;
  height: 100vh;
  background: linear-gradient(135deg, #ff6b8a, #ff8e9e);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 99999;
}
.splash-logo {
  font-size: 120rpx;
  margin-bottom: 30rpx;
  animation: bounce 1s ease infinite;
}
@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-20rpx); }
}
.splash-title {
  color: white;
  font-size: 48rpx;
  font-weight: bold;
  margin-bottom: 10rpx;
}
.splash-subtitle {
  color: rgba(255,255,255,0.8);
  font-size: 26rpx;
  margin-bottom: 60rpx;
}
.splash-loading { display: flex; gap: 15rpx; }
.splash-dot {
  width: 16rpx; height: 16rpx;
  background: white;
  border-radius: 50%;
  animation: dotBounce 1.4s ease infinite;
}
.splash-dot:nth-child(2) { animation-delay: 0.2s; }
.splash-dot:nth-child(3) { animation-delay: 0.4s; }
@keyframes dotBounce {
  0%, 80%, 100% { transform: scale(0); }
  40% { transform: scale(1); }
}

/* ========== 主界面 ========== */
.app-container { width: 100vw; min-height: 100vh; background: #f5f5f5; display: flex; flex-direction: column; overflow-x: hidden; }
.header { background: linear-gradient(135deg, #ff6b8a, #ff8e9e); padding: 15rpx 20rpx; text-align: center; box-shadow: 0 2rpx 10rpx rgba(255,107,138,0.3); flex-shrink: 0; width: 100%; }
.header-title { color: white; font-size: 36rpx; font-weight: bold; display: block; }
.header-subtitle { color: rgba(255,255,255,0.8); font-size: 22rpx; display: block; }
.main-scroll { width: 100%; flex: 1; padding: 15rpx; box-sizing: border-box; }
.card { background: white; border-radius: 16rpx; padding: 20rpx; margin-bottom: 15rpx; box-shadow: 0 2rpx 8rpx rgba(0,0,0,0.05); width: 100%; box-sizing: border-box; }
.card-title { font-size: 28rpx; font-weight: bold; color: #333; margin-bottom: 15rpx; display: block; }
.scene-buttons { display: flex; gap: 8rpx; flex-wrap: wrap; width: 100%; }
.scene-btn { flex: 1; min-width: 120rpx; padding: 14rpx 6rpx; border: 2rpx solid #eee; border-radius: 10rpx; background: white; font-size: 24rpx; transition: all 0.2s; text-align: center; box-sizing: border-box; }
.scene-btn.active { border-color: #ff6b8a; background: #fff0f3; font-weight: bold; }
.upload-actions { display: flex; gap: 15rpx; margin-bottom: 10rpx; }
.btn-camera, .btn-gallery { flex: 1; padding: 22rpx; border-radius: 12rpx; border: 2rpx dashed #ffb6c1; background: #fff5f7; text-align: center; font-size: 26rpx; color: #d4446a; display: flex; flex-direction: column; align-items: center; gap: 6rpx; }
.btn-icon { font-size: 44rpx; }
.hint-text { font-size: 20rpx; color: #999; margin-top: 6rpx; display: block; text-align: center; word-wrap: break-word; }
.preview-box { margin-top: 15rpx; border-radius: 12rpx; overflow: hidden; border: 2rpx solid #eee; width: 100%; }
.preview-image { width: 100%; display: block; }
.btn-analyze { width: 100%; padding: 24rpx; background: linear-gradient(135deg, #ff6b8a, #ff8e9e); color: white; border: none; border-radius: 12rpx; font-size: 32rpx; font-weight: bold; margin-bottom: 12rpx; box-sizing: border-box; }
.btn-analyze.disabled { background: #ccc; }
.btn-reset { width: 100%; padding: 18rpx; background: #f0f0f0; border: none; border-radius: 12rpx; font-size: 26rpx; color: #666; box-sizing: border-box; }
.scene-tag { background: #fff0f3; padding: 10rpx 20rpx; border-radius: 20rpx; display: inline-block; margin-bottom: 10rpx; border: 2rpx solid #ffb6c1; }
.scene-tag text { font-size: 24rpx; color: #d4446a; font-weight: bold; }
.result-area { width: 100%; box-sizing: border-box; }
.result-grid { display: flex; flex-wrap: wrap; gap: 8rpx; width: 100%; }
.result-item { width: calc(50% - 4rpx); background: #fff5f7; border-radius: 10rpx; padding: 12rpx; display: flex; flex-direction: column; align-items: center; box-sizing: border-box; }
.result-label { font-size: 20rpx; color: #999; margin-bottom: 4rpx; }
.result-value { font-size: 26rpx; font-weight: bold; color: #d4446a; }
.advice-card { background: #fff5f7; border-radius: 10rpx; padding: 15rpx; margin-bottom: 10rpx; border-left: 5rpx solid #ff6b8a; width: 100%; box-sizing: border-box; }
.advice-card.warning { background: #fff8e1; border-left: 5rpx solid #ff9800; }
.advice-text { font-size: 24rpx; color: #555; line-height: 1.6; word-wrap: break-word; }
.video-link { background: #fff0f3; border-radius: 10rpx; padding: 15rpx; margin-bottom: 10rpx; border: 2rpx dashed #ffb6c1; width: 100%; box-sizing: border-box; }
.video-text { font-size: 24rpx; color: #ff6b8a; }
.footer { background: white; padding: 15rpx 20rpx; border-top: 2rpx solid #eee; display: flex; align-items: center; justify-content: space-between; flex-shrink: 0; width: 100%; box-sizing: border-box; }
.btn-history { background: #f0f0f0; border: none; border-radius: 8rpx; padding: 10rpx 18rpx; font-size: 22rpx; color: #666; }
.status-text { font-size: 20rpx; color: #aaa; }
.loading-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); display: flex; flex-direction: column; justify-content: center; align-items: center; z-index: 9999; }
.loading-spinner { width: 70rpx; height: 70rpx; border: 5rpx solid #fff; border-top-color: #ff6b8a; border-radius: 50%; animation: spin 1s linear infinite; margin-bottom: 25rpx; }
@keyframes spin { to { transform: rotate(360deg); } }
.loading-text { color: white; font-size: 30rpx; }
</style>