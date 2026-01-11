# IRR测算系统 - 网页版

基于React + TypeScript + Ant Design开发的IRR（内部收益率）测算系统。

## 功能特性

- ✅ 完整的数据录入流程（基础信息、投资、营收、成本、融资）
- ✅ 自动计算IRR、NPV、投资回收期
- ✅ 实时数据校验
- ✅ 数据持久化（LocalStorage）
- ✅ 现金流明细表展示
- ✅ 结果汇总和可视化

## 技术栈

- **前端框架**: React 18 + TypeScript
- **UI组件库**: Ant Design 5.x
- **状态管理**: Zustand
- **路由**: React Router
- **构建工具**: Vite
- **样式**: CSS Modules

## 快速开始

### 安装依赖

```bash
npm install
```

### 启动开发服务器

```bash
npm run dev
```

访问 http://localhost:3000

### 构建生产版本

```bash
npm run build
```

## 项目结构

```
src/
├── components/       # 公共组件
│   └── Layout.tsx    # 布局组件
├── pages/            # 页面组件
│   ├── HomePage.tsx          # 首页/使用说明
│   ├── BasicInfoPage.tsx      # 基础信息
│   ├── InvestmentPage.tsx    # 投资情况
│   ├── RevenuePage.tsx       # 营收情况
│   ├── CostPage.tsx          # 成本与费用
│   ├── FinancingPage.tsx     # 融资与税率
│   ├── CalculationPage.tsx  # 现金流计算
│   └── SummaryPage.tsx       # 结果汇总
├── store/            # 状态管理
│   └── index.ts      # Zustand store
├── types/            # TypeScript类型定义
│   └── index.ts
├── utils/            # 工具函数
│   └── calculations.ts  # 计算引擎
├── App.tsx           # 根组件
├── main.tsx          # 入口文件
└── index.css         # 全局样式
```

## 使用说明

1. **基础信息**: 填写项目名称、测算周期、建设期、基准收益率
2. **投资情况**: 录入建设投资、流动资金等
3. **营收情况**: 填写主营业务收入、回款节奏
4. **成本与费用**: 录入营业成本、期间费用
5. **融资与税率**: 填写融资结构、税率政策
6. **现金流计算**: 自动计算IRR、NPV等指标
7. **结果汇总**: 查看关键指标和现金流汇总

## 数据单位

- 金额单位：万元
- 利率/比例单位：%（直接填数字，如12%填12）
- 时间单位：年

## 浏览器支持

- Chrome/Edge（最新2个版本）
- Firefox（最新2个版本）
- Safari（最新2个版本）

## 许可证

MIT

