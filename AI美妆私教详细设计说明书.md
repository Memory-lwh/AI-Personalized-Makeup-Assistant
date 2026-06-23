**AI美妆私教详细设计说明书**

文档编号： DM-LLD-20260510-001

项目名称： AI美妆私教——基于面部特征检测的个性化妆容推荐与指导系统

产品版本： V1.0

编制人： 罗文惠

编制人学号： 2408090602013

编制日期： 2026年5月10日

审核人： 课程指导教师

批准人： 课程指导教师

保密等级： 内部公开

适用范围： 湖南工业大学数字媒体技术专业软件工程课程设计、开发与验收

合规依据： GB/T 8567-2006《计算机软件文档编制规范》

**版本修订记录**

|     |     |     |     |     |
| --- | --- | --- | --- | --- |
| 版本号 | 修订日期 | 修订内容 | 修订人 | 审核人 |
| V1.0 | 2026-05-10 | 完成全套详细设计，对齐需求规格说明书，覆盖全部模块细节、逻辑与异常规则，补充接口定义与测试细则 | 罗文惠（2408090602013） | 课程指导教师 |

目录

版本修订记录 1

一、导言 3

1.1 目的 3

1.2 范围 4

1.3 编写说明 4

1.4 引用标准 5

1.5 参考资料 5

1.6 版本更新信息 5

二、系统设计概述 6

2.1 系统总体概述 6

2.2 系统维护者功能需求 6

2.3 普通用户功能需求 7

2.4 系统设计原则 8

三、 详细设计概述 8

3.1 整体设计思路 8

3.2 系统业务流程 8

3.3 模块划分原则 9

四、详细设计 9

4.1 UML建模 9

4.1.1 用例图 9

4.1.2 类图 10

4.1.3 状态图 12

4.1.4 时序图 13

4.1.5 系统架构图 14

4.2 对象设计 15

4.2.1 FaceData（面部特征数据对象） 16

4.2.2 MakeupAdvice（妆容建议对象） 16

4.2.3 HistoryRecord（历史记录对象） 17

4.3 E-R图设计 17

4.4 数据库建模 19

4.5 数据库详细设计 19

4.5.1 历史记录表（DM_HISTORY） 19

4.6 数据操作函数（等价存储过程） 20

4.6.1 新增历史记录 20

4.6.2 查询历史记录 21

4.6.3 删除单条历史记录 21

4.6.4 清空全部历史记录 21

4.7 系统页面结构与通用模块 22

4.7.1 网站页面结构 22

4.7.2 全局通用模块 22

五、功能模块详细设计 24

5.1 M01 场景选择模块 24

5.1.1 模块基本信息 24

5.1.2 核心逻辑 24

5.1.3 核心方法 25

5.2 M02 图片上传与校验模块 25

5.2.1 模块基本信息 25

5.2.2 校验逻辑 25

5.2.3 核心方法 25

5.3 M03 面部特征分析模块 26

5.3.1 模块基本信息 26

5.3.2 分析流程 26

5.3.3 核心方法 26

5.4 M04 妆容建议生成模块 27

5.4.1 模块基本信息 27

5.4.2 核心逻辑 27

5.4.3 核心规则示例 27

5.5 M05 视频推荐模块 27

5.5.1 模块基本信息 27

5.5.2 核心逻辑 28

5.5.3 关键词匹配规则 28

5.6 M06 历史记录模块 28

5.6.1 模块基本信息 28

5.6.2 核心逻辑 28

5.6.3 核心方法 28

5.7 M07 异常处理与提示模块 29

5.7.1 模块基本信息 29

5.7.2 异常处理逻辑 29

5.7.3 异常码与处理方式 29

5.8 M08 本地数据存储模块 30

5.8.1 模块基本信息 30

5.8.2 核心逻辑 30

5.8.3 核心方法 30

六、系统调试与测试环境搭建 30

6.1 开发调试环境配置 30

6.2 项目文件目录结构 31

6.3 系统测试方案 31

6.3.1 功能测试 31

6.3.2 兼容性测试 32

6.3.3 性能测试 32

6.3.4 易用性测试 32

七、 附录 32

7.1 异常码对照表 32

7.2 核心数据结构JSON示例 32

7.2.1 面部特征数据示例 32

7.2.2 历史记录示例 33

**一、导言**

**1.1 目的**

本文档为《AI美妆私教——基于面部特征检测的个性化妆容推荐与指导系统》V1.0版本的详细设计说明书，严格依据软件需求规格说明书与概要设计说明书编制，对系统各功能模块的内部逻辑、数据结构、接口规范、界面交互、异常处理机制、核心算法流程进行精细化定义。

本文档是前端开发人员进行代码编写、测试人员开展单元测试与功能测试、课程验收人员进行项目审核、后续系统迭代维护的核心技术依据，确保系统开发全程标准化、规范化，实现需求与开发的无缝对接。

**1.2 范围**

本详细设计说明书覆盖系统V1.0版本全流程功能，涵盖**8大核心功能模块**，具体模块优先级如下：

|     |     |     |
| --- | --- | --- |
| 模块编号 | 模块名称 | 优先级 |
| M01 | 场景选择模块 | P0  |
| M02 | 图片上传与校验模块 | P0  |
| M03 | 面部特征分析模块 | P0  |
| M04 | 妆容建议生成模块 | P0  |
| M05 | 视频推荐模块 | P0  |
| M06 | 历史记录模块 | P1  |
| M07 | 异常处理与提示模块 | P0  |
| M08 | 本地数据存储模块 | P0  |

系统定位为免安装、免登录、纯本地运行的轻量化Web应用，基于HTML5+CSS3+JavaScript技术栈开发，通过浏览器LocalStorage实现数据持久化，V1.0版本采用模拟数据完成面部特征分析逻辑。本文档设计粒度细化至函数级、字段级、交互级，明确各模块输入输出、调用关系与异常恢复策略。

**1.3 编写说明**

1.  本文档严格遵循GB/T 8567-2006《计算机软件文档编制规范》的章节结构、内容要求与格式规范编制，符合高校软件工程课程设计文档提交标准；
2.  文档中UML建模全部采用PlantUML语法编写，可直接在PlantUML在线编辑器、VS Code相关插件中渲染生成可视化图表；
3.  数据结构采用JSON Schema与表格对照形式定义，模块逻辑采用流程图+文字说明结合方式阐述，清晰易懂；
4.  文档中所有模块编号、功能点、需求项均与《软件需求规格说明书》一一对应，实现需求全追溯，无遗漏、无冗余；
5.  代码片段均为可直接运行的JavaScript代码，适配前端开发环境，无环境兼容问题。

**1.4 引用标准**

|     |     |     |
| --- | --- | --- |
| 标准编号 | 标准名称 | 发布年份 |
| GB/T 8567-2006 | 计算机软件文档编制规范 | 2006 |
| GB/T 9385-2008 | 计算机软件需求规格说明规范 | 2008 |
| GB/T 25000.51-2016 | 系统与软件工程 系统与软件质量模型 | 2016 |
| W3C HTML5/CSS3/JavaScript ES6+规范 | 前端开发行业通用技术规范 | 2024修订版 |

**1.5 参考资料**

|     |     |     |
| --- | --- | --- |
| 资料名称 | 文档编号 | 编制日期 |
| AI美妆私教系统软件需求规格说明书 | DM-SRS-20260501-001 | 2026-05-01 |
| AI美妆私教系统可行性分析报告 | DM-FAR-20260510-001 | 2026-05-10 |
| 前端模块化开发实战教程 | /   | 2024 |
| LocalStorage数据持久化技术文档 | /   | 2024 |

**1.6 版本更新信息**

|     |     |     |     |     |
| --- | --- | --- | --- | --- |
| 版本号 | 修订日期 | 修订内容 | 修订人 | 审核人 |
| V1.0 | 2026-05-10 | 完成全套详细设计，补充模块接口、测试细则、异常处理细节，优化文档格式与逻辑层级 | 罗文惠 | 课程指导教师 |

**二、系统设计概述**

**2.1 系统总体概述**

本系统是一款面向普通用户的**轻量化AI美妆指导Web应用**，无需下载安装、无需注册登录，打开浏览器即可使用，核心解决用户日常场景妆容选择困难、化妆手法不专业的问题。

系统围绕**场景选择→图片上传→面部分析→妆容推荐→教程指导→历史留存**的完整业务闭环，提供通勤、约会、面试、上学四类高频日常场景的个性化妆容服务。技术上采用纯前端架构，通过Canvas实现图片渲染，LocalStorage完成本地数据存储，V1.0版本通过模拟面部特征检测算法实现核心功能，界面简洁、操作便捷、响应迅速，适配各类主流浏览器。

系统采用三层架构设计：

1.  **前端交互层**：负责页面渲染、用户操作接收、视觉效果反馈，提升用户操作体验；
2.  **业务逻辑层**：承载所有核心业务逻辑，实现各模块功能运算与数据处理；
3.  **数据存储层**：负责系统配置数据、用户历史记录的本地持久化管理。

**2.2 系统维护者功能需求**

|     |     |     |
| --- | --- | --- |
| 需求编号 | 需求描述 | 设计实现方案 |
| MR-001 | 妆容规则独立维护，新增检测项无需修改业务核心代码 | 将妆容规则库封装为独立JS对象，与业务逻辑解耦，支持单独配置修改 |
| MR-002 | 模块间标准化接口通信，支持单独调试与模块替换 | 每个模块对外暴露统一的入参、出参接口，降低模块耦合度 |
| MR-003 | 核心逻辑、校验规则添加规范注释，便于后期维护 | 采用JSDoc规范编写代码注释，明确函数功能、参数含义与返回值 |
| MR-004 | 全局统一异常处理，便于异常排查与提示优化 | 所有业务异常统一汇入M07模块，建立异常码-提示信息映射表 |
| MR-005 | 系统配置可灵活修改，无需改动前端页面代码 | 将场景配置、文件限制、存储容量等参数封装为全局配置项 |

**2.3 普通用户功能需求**

|     |     |     |
| --- | --- | --- |
| 需求编号 | 需求描述 | 验收标准 |
| UR-001 | 免登录、免安装，快速上手使用 | 打开网页即可操作，核心流程操作步骤≤3步，30秒内完成首次体验 |
| UR-002 | 上传照片并完成面部特征智能分析 | 上传有效照片后，自动输出12项面部特征检测结果 |
| UR-003 | 根据面部特征+场景生成个性化妆容建议 | 妆容建议包含化妆重点、弱化部位、分步教程，贴合场景与面部特点 |
| UR-004 | 获取对应的化妆视频教程 | 自动匹配B站专业化妆教程链接，支持直接跳转查看 |
| UR-005 | 查看历史妆容分析记录 | 可查看、删除本地历史记录，最多保存10条近期数据 |
| UR-006 | 操作异常得到清晰提示 | 所有异常场景均有中文友好提示，引导用户修正操作 |

**2.4 系统设计原则**

1.  **轻量化原则**：纯前端实现，无后端服务依赖，打开即用；
2.  **易用性原则**：界面简洁直观，操作流程简单，无专业门槛；
3.  **解耦性原则**：模块独立开发、独立调用，降低耦合度；
4.  **稳定性原则**：全流程异常捕获处理，系统不会因操作异常崩溃；
5.  **安全性原则**：数据仅存储在本地浏览器，不上传至服务器，保护用户隐私；
6.  **可扩展性原则**：预留接口，便于后续接入真实AI面部检测接口、新增妆容场景。

**三、 详细设计概述**

**3.1 整体设计思路**

系统采用**事件驱动+模块化**开发模式，将整体功能拆分为8个独立功能模块，模块间通过全局事件总线实现通信，避免直接依赖，提升系统灵活性与可维护性。

以用户操作流程为核心主线，各模块按业务顺序依次调用，数据单向流转，逻辑清晰易懂。所有数据处理、逻辑运算均在本地完成，无需网络请求（视频教程跳转除外），保证系统运行速度与数据安全性。

**3.2 系统业务流程**

1.  用户打开系统页面，系统自动初始化本地存储，加载全局配置；
2.  用户选择妆容使用场景（通勤/约会/面试/上学）；
3.  用户上传本地正面自拍照片，系统自动校验文件格式、大小；
4.  校验通过后，照片在Canvas画布渲染展示；
5.  用户触发面部分析指令，系统执行模拟分析逻辑；
6.  分析完成后，生成面部特征报告、个性化妆容建议、化妆视频链接；
7.  系统自动将本次分析记录保存至本地存储；
8.  用户可查看历史记录、删除单条记录或重置系统重新操作。

**3.3 模块划分原则**

1.  **功能单一性**：每个模块只负责一项核心功能，职责明确；
2.  **独立性**：模块内部逻辑封闭，不依赖其他模块内部实现；
3.  **高内聚低耦合**：模块内部元素关联紧密，模块间仅通过接口交互；
4.  **可复用性**：通用功能封装为独立模块，可在系统内多处调用；
5.  **可测试性**：每个模块可单独进行单元测试，便于问题排查。

**四、详细设计**

**4.1 UML建模**

**4.1.1 用例图**

Plain Text  
@startuml 系统用例图  
left to right direction  
skinparam packageStyle rectangle  
<br/>actor "普通用户" as User #lightblue  
actor "系统维护者" as Admin #lightgreen  
<br/>rectangle "AI美妆私教系统" {  
usecase "UC01 选择日常场景" as UC01  
usecase "UC02 上传正面自拍" as UC02  
usecase "UC03 面部特征检测" as UC03  
usecase "UC04 查看检测结果" as UC04  
usecase "UC05 获取妆容建议" as UC05  
usecase "UC06 获取视频推荐" as UC06  
usecase "UC07 查看历史记录" as UC07  
usecase "UC08 删除历史记录" as UC08  
usecase "UC09 页面重置" as UC09  
<br/>usecase "UC10 妆容规则维护" as UC10  
usecase "UC11 系统配置维护" as UC11  
}  
<br/>User --> UC01  
User --> UC02  
User --> UC03  
User --> UC04  
User --> UC05  
User --> UC06  
User --> UC07  
User --> UC08  
User --> UC09  
<br/>Admin --> UC10  
Admin --> UC11  
<br/>UC02 ..> UC0&lt;include&gt;>  
UC03 ..> UC&lt;include&gt;>  
UC03 ..>&lt;include&gt;>  
UC03 ..> UC06 : &lt;<include&gt;>  
UC03 ..> UC07 :&lt;include&gt;>  
@enduml

**用例图说明**：

- 系统核心参与者为普通用户与系统维护者，两类角色操作权限完全分离；
- 采用包含关系明确业务执行顺序，上传照片为面部分析的前置条件，面部分析为结果展示、妆容推荐、历史保存的前置条件；
- 普通用户核心操作覆盖全业务流程，系统维护者仅负责后台规则与配置维护，无前端业务操作权限。

**4.1.2 类图**

Plain Text  
@startuml 系统模块类图  
skinparam classAttributeIconSize 0  
<br/>class M01_SceneModule {  
\+ selectedScene: String  
\+ setScene(sceneId): void  
\+ getSelectedScene(): String  
\+ reset(): void  
}  
<br/>class M02_UploadModule {  
\+ currentImage: String(base64)  
\- validateFormat(file): Boolean  
\- validateSize(file): Boolean  
\+ handleUpload(file): String  
\+ clearImage(): void  
\+ reset(): void  
}  
<br/>class M03_AnalysisModule {  
\+ faceData: Object  
\+ isAnalyzing: Boolean  
\- simulateAnalysis(): Object  
\+ startAnalysis(imageData): Object  
\+ getResult(): Object  
\+ reset(): void  
}  
<br/>class M04_AdviceModule {  
\- makeupRuleDB: Object  
\- generateHighlights(data): Array  
\- generateWeaknesses(data): Array  
\- generateSteps(data): Array  
\+ getAdvice(faceData): Object  
\+ reset(): void  
}  
<br/>class M05_VideoModule {  
\- keywordMap: Object  
\- matchKeywords(faceData): Array  
\- generateBilibiliLinks(keywords): Array  
\+ getRecommendations(faceData): Array  
}  
<br/>class M06_HistoryModule {  
\+ historyList: Array  
\+ addRecord(data): void  
\+ deleteRecord(id): void  
\+ getHistory(): Array  
\+ getCount(): Number  
}  
<br/>class M07_ErrorModule {  
\- errorCodeMap: Object  
\+ handleError(code): void  
\+ showPrompt(message): void  
\+ resetToIdle(): void  
}  
<br/>class M08_StorageModule {  
\- STORAGE_KEY: String  
\+ getItem(key): Object  
\+ setItem(key, value): Boolean  
\+ removeItem(key): Boolean  
\- validate(data): Boolean  
}  
<br/>M02 --> M07 : 异常报告  
M03 --> M04 : 触发建议  
M03 --> M05 : 触发视频推荐  
M03 --> M06 : 触发保存  
M06 --> M08 : 数据持久化  
M03 --> M07 : 异常报告  
M01 --> M03 : 传递场景参数  
@enduml

**类图说明**：

- 类图完整展示8大模块的属性与方法，公有方法对外提供调用接口，私有方法仅模块内部调用；
- 明确模块间调用关系与数据传递方向，体现系统模块化设计思路；
- 每个模块均包含reset重置方法，支持系统流程回退与重新操作。

**4.1.3 状态图**

Plain Text  
@startuml 系统状态图  
\[\*\] --> Idle: 页面初始化完成  
<br/>Idle --> SceneSelected: 用户选择场景  
SceneSelected --> ImageUploaded: 用户上传照片  
ImageUploaded --> Idle: 上传失败/格式错误  
ImageUploaded --> Analyzing: 用户点击开始分析  
<br/>state Analyzing {  
\[\*\] --> 加载中: 显示Loading动画  
加载中 --> 模拟检测: 1.5秒后  
模拟检测 --> 生成结果: 随机生成12项数据  
}  
<br/>Analyzing --> Completed: 分析成功  
Analyzing --> Error: 分析异常  
<br/>Completed --> Idle: 用户点击重置  
Completed --> SceneSelected: 用户更换场景  
Error --> Idle: 用户重试/重置  
<br/>@enduml

**状态图说明**：

- 系统核心状态分为：空闲（Idle）、场景已选（SceneSelected）、图片已上传（ImageUploaded）、分析中（Analyzing）、分析完成（Completed）、异常（Error）；
- Analyzing为复合状态，内部包含加载中、模拟检测、生成结果三个子状态，还原面部分析全流程；
- 所有异常、完成状态均可回退至空闲状态，保证系统状态闭环，不会出现卡死情况。

**4.1.4 时序图**

Plain Text  
@startuml 面部分析时序图  
actor "用户" as User  
participant "M01 场景模块" as Scene  
participant "M02 上传模块" as Upload  
participant "M03 分析模块" as Analysis  
participant "M04 建议模块" as Advice  
participant "M05 视频模块" as Video  
participant "M06 历史模块" as History  
participant "M08 存储模块" as Storage  
participant "M07 异常模块" as Error  
<br/>User -> Scene: 选择妆容场景  
Scene --> User: 高亮显示选中场景  
<br/>User -> Upload: 选择本地照片文件  
Upload -> Upload: 校验文件格式  
Upload -> Upload: 校验文件大小  
Upload --> Error: 校验失败，上报异常  
Error --> User: 弹出错误提示  
Upload -> Upload: 校验通过，转为Base64  
Upload -> User: Canvas渲染原图  
<br/>User -> Analysis: 点击"开始面部分析"  
Analysis -> Analysis: 显示Loading动画  
Analysis -> Analysis: 执行模拟面部分析  
Analysis -> Advice: 传递面部特征数据  
Advice -> Advice: 匹配妆容规则  
Advice --> Analysis: 返回妆容建议  
Analysis -> Video: 传递面部特征数据  
Video -> Video: 匹配教程关键词  
Video --> Analysis: 返回视频链接  
Analysis -> History: 触发保存记录  
History -> History: 组装记录数据  
History -> Storage: 调用存储接口  
Storage -> Storage: 本地数据写入  
Storage --> History: 返回保存结果  
History --> Analysis: 记录保存完成  
<br/>Analysis -> User: 展示分析结果+妆容建议+视频链接  
@enduml

**时序图说明**：

- 完整还原用户从场景选择到获取结果的全流程时序，明确各模块调用时机；
- 标注异常处理分支，覆盖校验失败、分析异常等特殊场景；
- 清晰体现数据在各模块间的传递流程，符合系统实际运行逻辑。

**4.1.5 系统架构图**

Plain Text  
@startuml 系统架构图  
skinparam packageStyle rectangle  
<br/>package "前端交互层" {  
\[页面渲染引擎\]  
\[Canvas图像展示\]  
\[事件处理器\]  
\[全局提示组件\]  
}  
<br/>package "业务逻辑层" {  
\[M01 场景选择\]  
\[M02 图片校验\]  
\[M03 面部分析\]  
\[M04 妆容建议\]  
\[M05 视频推荐\]  
\[M06 历史管理\]  
\[M07 异常处理\]  
}  
<br/>package "数据存储层" {  
\[M08 LocalStorage封装\]  
database "妆容规则库" as Rules  
database "用户历史记录" as History  
}  
<br/>\[前端交互层\] --> \[业务逻辑层\] : 用户操作/指令传递  
\[业务逻辑层\] --> \[前端交互层\] : 数据反馈/页面更新  
\[业务逻辑层\] --> \[数据存储层\] : 数据读写请求  
\[M08 LocalStorage封装\] --> Rules : 规则读取  
\[M08 LocalStorage封装\] --> History : 记录增删改查  
@enduml

**架构图说明**：

- 系统采用三层架构，层级职责清晰，上层调用下层接口，下层为上层提供服务；
- 前端交互层负责用户交互，业务逻辑层承载核心功能，数据存储层负责数据持久化；
- 明确各层级内部组件与调用关系，体现系统整体技术架构。

**4.2 对象设计**

系统核心数据对象采用JSON格式定义，与本地存储数据结构完全一致，便于数据读写与传输。

**4.2.1 FaceData（面部特征数据对象）**

|     |     |     |     |
| --- | --- | --- | --- |
| 属性  | 类型  | 说明  | 取值示例 |
| faceShape | String | 脸型  | 圆脸/方脸/长脸/心形脸/鹅蛋脸 |
| skinColor | String | 肤色  | 白皙/自然/小麦 |
| eyeDistance | String | 眼距  | 宽/标准/窄 |
| eyeSize | String | 眼睛大小 | 大/中/小 |
| browThickness | String | 眉毛粗细 | 粗/中/细 |
| browShape | String | 眉毛形状 | 弯眉/平眉/挑眉 |
| foreheadLength | String | 额头长短 | 长/标准/短 |
| faceProportion | String | 三庭比例 | 上庭长/中庭长/下庭长/均衡 |
| eyelidType | String | 眼型  | 单眼皮/双眼皮/内双 |
| noseType | String | 鼻型  | 塌鼻/高鼻/宽鼻翼/标准 |
| mouthType | String | 嘴型  | 厚唇/薄唇/标准 |
| overallStyle | String | 综合风格 | 甜美可人/温柔优雅/元气清新/干练知性 |

**4.2.2 MakeupAdvice（妆容建议对象）**

|     |     |     |
| --- | --- | --- |
| 属性  | 类型  | 说明  |
| highlights | Array | 化妆重点建议（3-4条） |
| weaknesses | Array | 需要弱化的部位（2-3条） |
| steps | Array | 化妆步骤拆解（5步） |
| videoLinks | Array | Bilibili视频教程链接（3个） |
| baseAdvice | String | 底妆适配建议 |

**4.2.3 HistoryRecord（历史记录对象）**

|     |     |     |
| --- | --- | --- |
| 属性  | 类型  | 说明  |
| recordId | String | 唯一标识，时间戳生成 |
| scene | String | 妆容使用场景 |
| faceShape | String | 检测脸型 |
| skinColor | String | 检测肤色 |
| overallStyle | String | 综合风格标签 |
| tryTime | String | 分析时间（YYYY-MM-DD HH:MM:SS） |

**4.3 E-R图设计**

系统基于LocalStorage文档型存储，无传统关系型数据库，以下为逻辑实体关系设计：

Plain Text  
@startuml 系统E-R图  
entity "FaceData\\n（面部特征数据）" as FaceData {  
\* sessionId :&lt;PK&gt;>  
\--  
faceShape : string  
skinColor : string  
eyeDistance : string  
eyeSize : string  
browThickness : string  
browShape : string  
foreheadLength : string  
faceProportion : string  
eyelidType : string  
noseType : string  
mouthType : string  
overallStyle : string  
}  
<br/>entity "MakeupAdvice\\n（妆容建议）" as MakeupAdvice {  
\* adviceId :&lt;PK&gt;>  
\--  
sessionId :&lt;FK&gt;>  
highlights : Array  
weaknesses : Array  
steps : Array  
videoLinks : Array  
baseAdvice : string  
}  
<br/>entity "HistoryRecord\\n（历史记录）" as HistoryRecord {  
\* recordId&lt;PK&gt;>  
\--  
scene : string  
faceShape : string  
skinColor : string  
overallStyle : string  
tryTime : string  
}  
<br/>FaceData ||--|| MakeupAdvice : "一对一关联"  
FaceData ||--o{ HistoryRecord : "一对多关联"  
@enduml

**E-R图说明**：

- 面部特征数据与妆容建议为一对一关系，一次分析对应一组专属妆容建议；
- 面部特征数据与历史记录为一对多关系，单个用户可生成多条历史分析记录；
- 系统为单用户场景，无需设计用户实体，简化数据结构。

**4.4 数据库建模**

本系统无后端关系型数据库，采用浏览器**LocalStorage**实现数据本地持久化，仅存储用户历史记录与系统配置数据，建模信息如下：

|     |     |     |     |     |
| --- | --- | --- | --- | --- |
| 逻辑表名 | Storage Key | 数据类型 | 初始值 | 读写权限 |
| 系统配置表 | DM_CONFIG | Object | {maxHistory:10,fileSize:5MB} | 系统只读 |
| 历史记录表 | DM_HISTORY | Array | \[\]空数组 | 系统可增删改，用户可查删 |

**4.5 数据库详细设计**

仅对历史记录表进行详细字段设计，系统配置表为固定全局参数：

**4.5.1 历史记录表（DM_HISTORY）**

|     |     |     |     |     |     |
| --- | --- | --- | --- | --- | --- |
| 字段名 | 类型  | 必填  | 约束规则 | 示例值 | 字段说明 |
| recordId | String | 是   | 主键，前缀rec_+13位时间戳，全局唯一 | rec_1715328000000 | 历史记录唯一标识 |
| scene | String | 是   | 枚举值：commute/date/interview/school | date | 妆容使用场景编码 |
| faceShape | String | 是   | 枚举值：圆脸/方脸/长脸/心形脸/鹅蛋脸 | 鹅蛋脸 | 检测生成脸型 |
| skinColor | String | 是   | 枚举值：白皙/自然/小麦 | 白皙  | 检测生成肤色 |
| overallStyle | String | 是   | 固定风格文本 | 温柔优雅 | 综合妆容风格 |
| tryTime | String | 是   | 时间格式：YYYY-MM-DD HH:MM:SS | 2026-05-10 16:00:00 | 分析操作时间 |

**4.6 数据操作函数（等价存储过程）**

系统无数据库存储过程，通过JavaScript封装数据操作函数，实现LocalStorage增删改查：

**4.6.1 新增历史记录**

JavaScript  
function addHistoryRecord(record) {  
try {  
// 获取本地历史数据  
const history = StorageModule.getItem('DM_HISTORY') || \[\];  
// 生成唯一记录ID与时间  
const newRecord = {  
recordId: 'rec_' + Date.now(),  
...record,  
tryTime: new Date().toISOString().replace('T', ' ').substring(0, 19)  
};  
// 头部插入最新记录  
history.unshift(newRecord);  
// 容量限制：最多保存10条，删除最早记录  
while (history.length > 10) {  
history.pop();  
}  
// 写入本地存储  
return StorageModule.setItem('DM_HISTORY', history);  
} catch (e) {  
// 异常捕获并上报  
M07_ErrorModule.handleError('STORAGE_ERROR');  
return false;  
}  
}

**4.6.2 查询历史记录**

JavaScript  
function getHistoryList() {  
try {  
// 读取并返回历史数据，无数据返回空数组  
return StorageModule.getItem('DM_HISTORY') || \[\];  
} catch (e) {  
M07_ErrorModule.handleError('STORAGE_ERROR');  
return \[\];  
}  
}

**4.6.3 删除单条历史记录**

JavaScript  
function deleteHistoryRecord(recordId) {  
try {  
const history = StorageModule.getItem('DM_HISTORY') || \[\];  
// 过滤掉目标记录  
const updatedHistory = history.filter(item => item.recordId !== recordId);  
return StorageModule.setItem('DM_HISTORY', updatedHistory);  
} catch (e) {  
M07_ErrorModule.handleError('STORAGE_ERROR');  
return false;  
}  
}

**4.6.4 清空全部历史记录**

JavaScript  
function clearAllHistory() {  
try {  
return StorageModule.setItem('DM_HISTORY', \[\]);  
} catch (e) {  
M07_ErrorModule.handleError('STORAGE_ERROR');  
return false;  
}  
}

**4.7 系统页面结构与通用模块**

**4.7.1 网站页面结构**

系统为单页面应用（SPA），采用**左右分栏响应式布局**，适配PC端浏览器，页面结构如下：

Plain Text  
┌─────────────────────────────────────────────────┐  
│ \[顶部标题栏\] 💄 AI美妆私教 - 面部特征检测 │  
├──────────────────────┬──────────────────────────┤  
│ \[左侧 60%：内容展示区\] │ \[右侧 40%：操作面板区\] │  
│ │ │  
│ ┌────────────────┐ │ 1. 场景选择按钮组 │  
│ │ 📷 原图展示区 │ │ 💼通勤 🌹约会 │  
│ │ Canvas渲染 │ │ 📄面试 📚上学 │  
│ └────────────────┘ │ │  
│ │ 2. 图片上传区域 │  
│ ┌────────────────┐ │ 📷 上传正面自拍 │  
│ │ 💄 分析结果区 │ │ ⚠️ 格式/大小提示 │  
│ │ 12项特征表格 │ │ │  
│ │ 妆容建议文案 │ │ 3. 核心操作按钮 │  
│ │ 视频教程链接 │ │ 🔍 开始面部分析 │  
│ └────────────────┘ │ 🔄 重置操作 │  
│ │ │  
│ │ 4. 历史记录模块 │  
├──────────────────────┴──────────────────────────┤  
│ \[底部状态栏\] 操作提示信息 | 版权声明 │  
└─────────────────────────────────────────────────┘

**4.7.2 全局通用模块**

**\[4.7.2.1\](4.7.2.1) 全局事件总线**

实现模块间解耦通信，统一管理系统事件：

JavaScript  
const EventBus = {  
// 存储事件与回调函数  
\_events: new Map(),  
// 绑定事件  
on(event, callback) {  
if (!this.\_events.has(event)) {  
this.\_events.set(event, \[\]);  
}  
this.\_events.get(event).push(callback);  
},  
// 触发事件  
emit(event, data) {  
const callbacks = this.\_events.get(event);  
if (callbacks && callbacks.length > 0) {  
callbacks.forEach(cb => cb(data));  
}  
},  
// 移除事件  
off(event, callback) {  
const callbacks = this.\_events.get(event);  
if (callbacks) {  
this.\_events.set(event, callbacks.filter(cb => cb !== callback));  
}  
}  
};  
<br/>// 系统全局事件常量  
const SYSTEM_EVENTS = {  
ANALYSIS_COMPLETE: 'analysisComplete',  
ANALYSIS_FAILED: 'analysisFailed',  
SYSTEM_RESET: 'systemReset',  
HISTORY_UPDATED: 'historyUpdated'  
};

**\[4.7.2.2\](4.7.2.2) 全局提示组件（Toast）**

实现系统统一的成功/错误/提示弹窗，提升交互体验：

JavaScript  
function showToast(message, type = 'info') {  
// 创建提示元素  
const toast = document.createElement('div');  
// 样式设置  
toast.style.cssText = \`  
position: fixed; top: 20px; left: 50%; transform: translateX(-50%);  
padding: 12px 24px; border-radius: 8px; z-index: 9999;  
font-size: 14px; font-weight: 500; color: #fff;  
box-shadow: 0 2px 10px rgba(0,0,0,0.1);  
background: ${type === 'error' ? '#F56C6C' : type === 'success' ? '#67C23A' : '#E6A23C'};  
transition: all 0.3s ease;  
\`;  
toast.textContent = message;  
document.body.appendChild(toast);  
// 3秒后自动移除  
setTimeout(() => {  
toast.style.opacity = '0';  
setTimeout(() => toast.remove(), 300);  
}, 3000);  
}

**五、功能模块详细设计**

**5.1 M01 场景选择模块**

**5.1.1 模块基本信息**

- 模块定位：完成用户妆容使用场景选择，为后续妆容推荐提供场景参数
- 输入：用户点击场景按钮操作
- 输出：选中场景编码与名称
- 依赖模块：无
- 被依赖模块：M03面部特征分析模块

**5.1.2 核心逻辑**

1.  页面加载完成后，默认选中“通勤”场景，按钮高亮显示；
2.  用户点击场景按钮时，取消所有按钮高亮状态，为当前点击按钮添加高亮样式；
3.  记录选中场景编码（commute/date/interview/school），存入全局状态；
4.  支持切换场景，切换后自动清空已上传图片与分析结果。

**5.1.3 核心方法**

- setScene(sceneId)：设置选中场景，更新页面样式与全局状态
- getSelectedScene()：获取当前选中场景参数
- reset()：重置场景为默认通勤场景

**5.2 M02 图片上传与校验模块**

**5.2.1 模块基本信息**

- 模块定位：接收用户上传图片，完成合法性校验，实现图片渲染
- 输入：用户本地图片文件
- 输出：Base64格式图片数据、Canvas渲染结果
- 依赖模块：M07异常处理模块
- 被依赖模块：M03面部特征分析模块

**5.2.2 校验逻辑**

Plain Text  
用户选择图片文件  
↓  
格式校验：判断文件类型是否为image/jpeg、image/png  
↓ 不通过  
调用M07模块抛出格式异常，清空上传框  
↓ 通过  
大小校验：判断文件大小≤5MB  
↓ 不通过  
调用M07模块抛出大小异常，清空上传框  
↓ 通过  
FileReader将图片转为Base64格式  
↓  
Canvas画布渲染图片，展示给用户

**5.2.3 核心方法**

- validateFormat(file)：校验图片格式，返回布尔值
- validateSize(file)：校验图片大小，返回布尔值
- handleUpload(file)：处理上传流程，返回Base64图片数据
- clearImage()：清空已上传图片与Canvas内容
- reset()：重置模块状态

**5.3 M03 面部特征分析模块**

**5.3.1 模块基本信息**

- 模块定位：系统核心模块，执行面部特征模拟分析，生成面部数据
- 输入：Base64格式图片数据、选中场景参数
- 输出：FaceData面部特征对象
- 依赖模块：M04、M05、M06、M07
- 被依赖模块：无

**5.3.2 分析流程**

Plain Text  
用户点击“开始分析”按钮  
↓  
校验场景、图片是否完整，缺失则抛出异常  
↓  
页面显示Loading加载动画，禁止重复操作  
↓  
延时1.5秒模拟AI分析过程  
↓  
调用simulateAnalysis()随机生成12项面部特征数据  
↓  
将面部数据传递至M04、M05、M06模块  
↓  
隐藏Loading，触发分析完成事件，展示结果

**5.3.3 核心方法**

- simulateAnalysis()：模拟生成面部特征数据
- startAnalysis(imageData)：启动分析流程
- getResult()：获取分析结果
- reset()：重置模块状态，清空分析数据

**5.4 M04 妆容建议生成模块**

**5.4.1 模块基本信息**

- 模块定位：根据面部特征+场景，生成个性化妆容建议
- 输入：FaceData面部特征对象、场景参数
- 输出：MakeupAdvice妆容建议对象
- 依赖模块：无
- 被依赖模块：M03

**5.4.2 核心逻辑**

1.  加载内置妆容规则库，匹配面部特征与场景；
2.  生成化妆重点：针对面部优势部位，强化美化建议；
3.  生成弱化建议：针对面部待优化部位，修饰建议；
4.  生成分步化妆步骤，通俗易懂，适配新手；
5.  生成底妆适配建议，贴合肤色与场景需求。

**5.4.3 核心规则示例**

- 圆脸：下颌角打修容，腮红斜向上提拉，视觉拉长脸型
- 宽眼距：眼线向内眼角延伸，眉头加深，拉近双眼间距
- 塌鼻：鼻影从眉头至鼻翼渐变晕染，鼻尖提亮，增强立体感
- 厚唇：遮瑕模糊唇线，仅唇中填色，打造视觉薄唇效果

**5.5 M05 视频推荐模块**

**5.5.1 模块基本信息**

- 模块定位：根据面部特征匹配化妆教程，生成可跳转视频链接
- 输入：FaceData面部特征对象
- 输出：Bilibili视频教程链接数组
- 依赖模块：无
- 被依赖模块：M03

**5.5.2 核心逻辑**

1.  根据面部特征提取关键词；
2.  匹配内置关键词-B站搜索链接映射表；
3.  筛选3条最贴合的教程链接；
4.  前端展示链接，支持点击跳转至B站观看。

**5.5.3 关键词匹配规则**

- 圆脸→圆脸修容教程、圆脸适配妆容
- 单眼皮→单眼皮日常眼妆、单眼皮消肿画法
- 塌鼻→鼻影新手教程、立体鼻型化妆技巧
- 约会场景→温柔氛围感妆容、日常淡妆教程

**5.6 M06 历史记录模块**

**5.6.1 模块基本信息**

- 模块定位：管理用户历史分析记录，实现记录查、增、删
- 输入：分析完成的面部数据、用户删除操作
- 输出：历史记录列表、存储更新结果
- 依赖模块：M08本地存储模块
- 被依赖模块：M03

**5.6.2 核心逻辑**

1.  分析完成后自动保存记录至本地；
2.  支持用户查看所有历史记录；
3.  支持单条记录删除、全部记录清空；
4.  自动管控存储容量，最多保存10条记录，超出自动删除最早记录。

**5.6.3 核心方法**

- addRecord(data)：新增历史记录
- deleteRecord(recordId)：删除单条记录
- getHistory()：获取全部历史记录
- clearHistory()：清空所有记录

**5.7 M07 异常处理与提示模块**

**5.7.1 模块基本信息**

- 模块定位：全局异常处理中心，统一捕获、提示、处理异常
- 输入：各模块上报的异常码
- 输出：友好中文提示、异常恢复操作
- 依赖模块：无
- 被依赖模块：所有功能模块

**5.7.2 异常处理逻辑**

1.  接收各模块传递的异常码；
2.  匹配异常码-提示信息映射表；
3.  调用Toast组件展示提示信息；
4.  执行对应恢复操作，引导用户重新操作。

**5.7.3 异常码与处理方式**

|     |     |     |
| --- | --- | --- |
| 异常码 | 提示信息 | 处理方式 |
| INVALID_FORMAT | 请上传JPG/PNG格式图片 | 清空上传文件，重置上传区域 |
| FILE_TOO_LARGE | 图片大小不能超过5MB，请压缩后上传 | 清空上传文件，提示重新上传 |
| NO_IMAGE | 请先上传正面自拍图片 | 引导用户完成图片上传 |
| NO_SCENE | 请先选择妆容使用场景 | 高亮场景选择区域 |
| STORAGE_ERROR | 本地存储异常，请刷新页面重试 | 提示页面刷新，重置系统 |
| ANALYSIS_ERROR | 面部分析失败，请重新操作 | 清空分析结果，允许重新分析 |

**5.8 M08 本地数据存储模块**

**5.8.1 模块基本信息**

- 模块定位：LocalStorage封装模块，统一数据读写操作
- 输入：存储键名、待存储数据
- 输出：读取数据、操作结果布尔值
- 依赖模块：无
- 被依赖模块：M06

**5.8.2 核心逻辑**

1.  封装LocalStorage原生API，添加异常捕获；
2.  实现数据JSON序列化与反序列化；
3.  校验数据合法性，避免存储异常；
4.  统一处理存储溢出、数据格式错误等问题。

**5.8.3 核心方法**

- getItem(key)：读取指定键名数据，返回解析后对象
- setItem(key, value)：写入数据，返回操作结果
- removeItem(key)：删除指定键名数据
- clear()：清空系统相关存储数据

**六、系统调试与测试环境搭建**

**6.1 开发调试环境配置**

1.  **开发工具**：VS Code（最新版本）
2.  **必备插件**：Live Server（本地服务启动）、PlantUML（图表渲染）、ESLint（代码规范）
3.  **运行浏览器**：Chrome、Edge、Firefox（最新版本）
4.  **调试工具**：浏览器开发者工具（F12）、Lighthouse（性能检测）

**6.2 项目文件目录结构**

Plain Text  
ai-makeup-advisor/  
├── index.html # 系统主页面  
├── css/  
│ └── style.css # 全局样式文件  
├── js/  
│ ├── main.js # 系统入口文件  
│ ├── eventBus.js # 全局事件总线  
│ └── modules/ # 功能模块目录  
│ ├── m01_scene.js  
│ ├── m02_upload.js  
│ ├── m03_analysis.js  
│ ├── m04_advice.js  
│ ├── m05_video.js  
│ ├── m06_history.js  
│ ├── m07_error.js  
│ └── m08_storage.js  
├── assets/ # 静态资源  
│ └── images/ # 图标、示例图片  
└── README.md # 项目说明文档

**6.3 系统测试方案**

**6.3.1 功能测试**

1.  场景选择测试：验证4类场景选择、切换、默认选中功能
2.  图片上传测试：验证合法/非法图片上传、校验逻辑
3.  面部分析测试：验证分析流程、结果生成、数据准确性
4.  妆容推荐测试：验证建议匹配、视频链接生成功能
5.  历史记录测试：验证记录保存、查看、删除、容量管控
6.  异常测试：验证各类异常提示与恢复逻辑

**6.3.2 兼容性测试**

在Chrome、Edge、Firefox三大主流浏览器中，验证系统功能、页面展示、交互逻辑一致性。

**6.3.3 性能测试**

1.  页面加载速度：首次加载≤2秒
2.  分析响应速度：模拟分析≤2秒
3.  存储操作速度：历史记录读写无延迟

**6.3.4 易用性测试**

验证操作流程简洁性、提示信息友好性、页面布局合理性。

**七、 附录**

**7.1 异常码对照表**

|     |     |     |
| --- | --- | --- |
| 异常码 | 异常类型 | 触发场景 |
| INVALID_FORMAT | 格式异常 | 上传非JPG/PNG图片 |
| FILE_TOO_LARGE | 大小异常 | 上传超过5MB图片 |
| NO_IMAGE | 参数异常 | 未上传图片点击分析 |
| NO_SCENE | 参数异常 | 未选场景点击分析 |
| STORAGE_ERROR | 存储异常 | LocalStorage读写失败 |
| ANALYSIS_ERROR | 业务异常 | 面部模拟分析失败 |

**7.2 核心数据结构JSON示例**

**7.2.1 面部特征数据示例**

JSON  
{  
"faceShape": "鹅蛋脸",  
"skinColor": "白皙",  
"eyeDistance": "标准",  
"eyeSize": "中",  
"browThickness": "中",  
"browShape": "弯眉",  
"foreheadLength": "标准",  
"faceProportion": "均衡",  
"eyelidType": "双眼皮",  
"noseType": "标准",  
"mouthType": "标准",  
"overallStyle": "温柔优雅"  
}

**7.2.2 历史记录示例**

JSON  
{  
"recordId": "rec_1715328000000",  
"scene": "date",  
"faceShape": "鹅蛋脸",  
"skinColor": "白皙",  
"overallStyle": "温柔优雅",  
"tryTime": "2026-05-10 16:00:00"  
}

**编制人**：罗文惠

**学号**：2408090602013

**完成日期**：2026年5月10日

**归属单位**：湖南工业大学包装工程学院数字媒体技术专业