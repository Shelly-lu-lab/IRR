# IRR 测算系统 - 网页版完整设计方案

## 一、系统架构设计

### 1.1 技术栈选择

| 层级 | 技术选型 | 说明 |
|-----|---------|------|
| **前端框架** | React 18 + TypeScript | 组件化开发，类型安全 |
| **UI组件库** | Ant Design 5.x | 企业级UI组件，表单验证完善 |
| **状态管理** | Zustand / React Context | 轻量级状态管理 |
| **图表库** | ECharts / Recharts | 数据可视化 |
| **表单处理** | React Hook Form + Zod | 表单验证和数据处理 |
| **计算引擎** | 自研IRR计算库 | JavaScript实现IRR/NPV计算 |
| **数据持久化** | LocalStorage + IndexedDB | 本地存储，支持导出Excel |
| **构建工具** | Vite | 快速构建，热更新 |
| **样式方案** | Tailwind CSS + CSS Modules | 原子化CSS，模块化样式 |

### 1.2 系统架构图

```
┌─────────────────────────────────────────┐
│           用户界面层 (UI Layer)           │
│  ┌──────────┐  ┌──────────┐  ┌────────┐ │
│  │ 表单输入  │  │ 数据展示  │  │ 图表分析│ │
│  └──────────┘  └──────────┘  └────────┘ │
└─────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────┐
│         业务逻辑层 (Business Layer)      │
│  ┌──────────┐  ┌──────────┐  ┌────────┐ │
│  │ 数据校验  │  │ 计算引擎  │  │ 状态管理│ │
│  └──────────┘  └──────────┘  └────────┘ │
└─────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────┐
│         数据持久层 (Data Layer)          │
│  ┌──────────┐  ┌──────────┐  ┌────────┐ │
│  │LocalStorage│ │IndexedDB │  │Excel导出│ │
│  └──────────┘  └──────────┘  └────────┘ │
└─────────────────────────────────────────┘
```

---

## 二、页面结构设计

### 2.1 路由设计

| 路由路径 | 页面组件 | 功能说明 |
|---------|---------|---------|
| `/` | HomePage | 首页/使用说明 |
| `/basic-info` | BasicInfoPage | 基础信息录入 |
| `/investment` | InvestmentPage | 投资情况录入 |
| `/revenue` | RevenuePage | 营收情况录入 |
| `/cost` | CostPage | 成本与费用录入 |
| `/financing` | FinancingPage | 融资与税率录入 |
| `/calculation` | CalculationPage | 现金流&IRR计算 |
| `/summary` | SummaryPage | 结果汇总展示 |

### 2.2 页面布局结构

```
┌─────────────────────────────────────────────┐
│           顶部导航栏 (Header)                │
│  [Logo] [项目名称] [保存] [导出] [帮助]      │
└─────────────────────────────────────────────┘
┌──────────┬──────────────────────────────────┐
│          │                                  │
│  侧边栏   │        主内容区                   │
│  (导航)   │      (表单/表格/图表)             │
│          │                                  │
│  - 基础信息│                                  │
│  - 投资情况│                                  │
│  - 营收情况│                                  │
│  - 成本费用│                                  │
│  - 融资税率│                                  │
│  - 现金流  │                                  │
│  - 结果汇总│                                  │
│          │                                  │
└──────────┴──────────────────────────────────┘
┌─────────────────────────────────────────────┐
│           底部状态栏 (Footer)                │
│  版本号 | 数据校验状态 | 最后保存时间          │
└─────────────────────────────────────────────┘
```

---

## 三、核心功能模块设计

### 3.1 数据模型设计

#### 3.1.1 TypeScript 类型定义

```typescript
// 基础信息
interface BasicInfo {
  projectName: string;           // 项目名称
  version: string;               // 版本号
  calculateDate: string;         // 测算日期
  totalPeriod: number;            // 测算周期（年）
  constructionPeriod: number;     // 建设期（年）
  operationPeriod: number;       // 运营期（年，自动计算）
  cashFlowTiming: 'year-end' | 'mid-year'; // 现金流时点
  benchmarkRate: number;          // 基准收益率（%）
  discountBaseYear: number;      // 折现基准年
}

// 投资情况
interface Investment {
  fixedAssets: {
    landCost: number;            // 土地使用权成本
    constructionCost: number;    // 工程建设费用
    equipmentCost: number;        // 设备购置成本
    reserveFund: number;          // 预备费
    totalValue: number;           // 固定资产原值合计
    residualRate: number;          // 残值率（%）
    depreciationDetails: {
      building: { value: number; years: number; };
      machinery: { value: number; years: number; };
      vehicle: { value: number; years: number; };
      other: { value: number; years: number; };
    };
    method: 'straight-line' | 'double-declining';
    acceleratedDepreciation: boolean;
  };
  intangibleAssets: {
    patentCost: number;
    softwareCost: number;
    totalValue: number;
    amortizationYears: number;
  };
  otherAssets: {
    startupCost: number;
    amortizationYears: number;
  };
  workingCapital: {
    minCash: number;
    receivablesDays: number;
    inventoryDays: number;
    payablesDays: number;
  };
  constructionParams: {
    paymentSchedule: '60-40' | 'equal' | 'one-time';
    capitalizedInterest: number;
  };
  additionalInvestment: Array<{
    year: number;
    amount: number;
    type: 'fixed' | 'intangible' | 'other';
  }>;
}

// 营收情况
interface Revenue {
  mainBusiness: Array<{
    name: string;
    sales: number[];              // 年度销量
    price: number[];              // 年度单价
    revenue: number[];            // 年度收入（自动计算）
  }>;
  paymentTerms: {
    currentYearRatio: number;    // 当年回款比例（%）
    nextYearRatio: number;        // 次年回款比例（%）
    paymentDays: number;           // 回款账期（天）
  };
  otherBusiness: number[];        // 其他业务收入（年度）
  nonOperating: {
    subsidy: { amount: number; year: number; };
    disposal: { amount: number; year: number; };
  };
}

// 成本与费用
interface Cost {
  operatingCost: {
    materialCost: number[];      // 单位材料成本
    laborCost: number[];           // 单位人工成本
    manufacturingCost: number[];  // 单位制造费用
    total: number[];               // 营业成本合计
  };
  periodExpenses: {
    sales: {
      variableRatio: number;      // 变动费用比例（%）
      fixed: number[];             // 固定费用
      total: number[];             // 销售费用合计
    };
    management: number[];          // 管理费用
    finance: number[];             // 财务费用
  };
  nonOperatingExpense: number[]; // 营业外支出
  nonCashCost: {
    depreciation: number[];       // 固定资产折旧
    amortization: number[];        // 无形资产摊销
    otherAmortization: number[];  // 其他资产摊销
    total: number[];               // 非付现成本合计
  };
}

// 融资与税率
interface Financing {
  equity: {
    amount: number;
    investmentYear: number;
    dividendRatio: number;
    dividendStartYear: number;
  };
  debt: {
    amount: number;
    arrivalYear: number;
    term: number;
    rate: number;
    repaymentMethod: 'equal-payment' | 'equal-principal' | 'bullet';
    repaymentStartYear: number;
    capitalizationEndYear: number;
    repaymentPlan: Array<{ principal: number; interest: number; }>;
  };
  tax: {
    incomeTaxRate: number;        // 所得税税率（%）
    taxIncentive: boolean;
    taxIncentiveDetail: string;
    lossCarryForwardYears: 5 | 10;
    vatOutputRate: number;        // 增值税销项税率（%）
    vatInputRate: number;          // 增值税进项税率（%）
    vatIncentive: boolean;
    urbanMaintenanceRate: number;  // 城建税税率（%）
    educationSurchargeRate: number; // 教育费附加税率（%）
    localEducationRate: number;    // 地方教育附加税率（%）
  };
}

// 现金流数据
interface CashFlow {
  year: number;
  inflow: {
    mainBusiness: number;         // 主营业务收入回款
    otherBusiness: number;         // 其他业务收入
    nonOperating: number;         // 营业外收入
    residualValue: number;         // 残值回收
    workingCapitalRecovery: number; // 流动资金回收
    total: number;                 // 现金流入小计
  };
  outflow: {
    constructionInvestment: number; // 建设投资支出
    additionalInvestment: number;   // 运营期追加投资
    workingCapital: number;         // 流动资金投入
    operatingCost: number;          // 营业成本（付现）
    periodExpenses: number;         // 期间费用（付现）
    vatAndSurcharge: number;        // 增值税及附加
    incomeTax: number;              // 所得税
    principalRepayment: number;     // 借款本金偿还
    interestPayment: number;         // 借款利息支付
    dividend: number;               // 股东分红
    nonOperatingExpense: number;    // 营业外支出
    total: number;                  // 现金流出小计
  };
  netCashFlow: number;             // 净现金流
  cumulativeCashFlow: number;      // 累计净现金流
}

// 计算结果
interface CalculationResult {
  irr: number;                      // 内部收益率（%）
  npv: number;                       // 净现值（万元）
  paybackPeriod: number;            // 投资回收期（年）
  isQualified: boolean;             // 是否达标
  cashFlows: CashFlow[];            // 年度现金流明细
  sensitivityAnalysis: {
    scenario: string;
    salesChange: number;
    priceChange: number;
    investmentChange: number;
    costChange: number;
    irr: number;
    npv: number;
  }[];
  breakEvenAnalysis: {
    breakEvenSales: number;         // 盈亏平衡销量
    breakEvenPrice: number;         // 盈亏平衡单价
    safetyMargin: number;           // 安全边际率（%）
  };
}

// 完整项目数据
interface ProjectData {
  basicInfo: BasicInfo;
  investment: Investment;
  revenue: Revenue;
  cost: Cost;
  financing: Financing;
  calculation: CalculationResult;
}
```

### 3.2 计算引擎设计

#### 3.2.1 IRR计算算法

```typescript
/**
 * IRR计算（使用牛顿-拉夫逊法）
 * @param cashFlows 现金流数组（包含初始投资）
 * @param guess 初始猜测值（默认0.1）
 * @param maxIterations 最大迭代次数
 * @returns IRR（小数形式，如0.12表示12%）
 */
function calculateIRR(
  cashFlows: number[],
  guess: number = 0.1,
  maxIterations: number = 100
): number {
  const tolerance = 1e-6;
  let rate = guess;
  
  for (let i = 0; i < maxIterations; i++) {
    const npv = calculateNPV(cashFlows, rate);
    const npvDerivative = calculateNPVDerivative(cashFlows, rate);
    
    if (Math.abs(npvDerivative) < tolerance) {
      throw new Error('IRR计算失败：导数接近0');
    }
    
    const newRate = rate - npv / npvDerivative;
    
    if (Math.abs(newRate - rate) < tolerance) {
      return newRate;
    }
    
    rate = newRate;
    
    // 防止负利率或过高利率
    if (rate < -0.99 || rate > 10) {
      throw new Error('IRR计算失败：利率超出合理范围');
    }
  }
  
  throw new Error('IRR计算失败：超过最大迭代次数');
}

/**
 * NPV计算
 */
function calculateNPV(cashFlows: number[], rate: number): number {
  return cashFlows.reduce((sum, cashFlow, index) => {
    return sum + cashFlow / Math.pow(1 + rate, index);
  }, 0);
}

/**
 * NPV导数计算
 */
function calculateNPVDerivative(cashFlows: number[], rate: number): number {
  return cashFlows.reduce((sum, cashFlow, index) => {
    return sum - (index * cashFlow) / Math.pow(1 + rate, index + 1);
  }, 0);
}
```

#### 3.2.2 折旧计算

```typescript
/**
 * 直线法折旧
 */
function straightLineDepreciation(
  value: number,
  residualValue: number,
  years: number
): number[] {
  const annualDepreciation = (value - residualValue) / years;
  return Array(years).fill(annualDepreciation);
}

/**
 * 双倍余额递减法折旧
 */
function doubleDecliningDepreciation(
  value: number,
  residualValue: number,
  years: number
): number[] {
  const depreciation: number[] = [];
  let bookValue = value;
  const rate = 2 / years;
  
  for (let i = 0; i < years; i++) {
    const remainingYears = years - i;
    
    // 剩余年限≤2年时转为直线法
    if (remainingYears <= 2) {
      const remainingDepreciation = (bookValue - residualValue) / remainingYears;
      depreciation.push(...Array(remainingYears).fill(remainingDepreciation));
      break;
    }
    
    const annualDepreciation = bookValue * rate;
    const minBookValue = residualValue;
    
    if (bookValue - annualDepreciation < minBookValue) {
      depreciation.push(bookValue - minBookValue);
      bookValue = minBookValue;
    } else {
      depreciation.push(annualDepreciation);
      bookValue -= annualDepreciation;
    }
  }
  
  return depreciation;
}
```

#### 3.2.3 还款计划计算

```typescript
/**
 * 等额本息还款
 */
function equalPaymentRepayment(
  principal: number,
  rate: number,
  years: number
): Array<{ principal: number; interest: number; total: number }> {
  const monthlyRate = rate / 12;
  const months = years * 12;
  const monthlyPayment = principal * monthlyRate * Math.pow(1 + monthlyRate, months) /
    (Math.pow(1 + monthlyRate, months) - 1);
  
  const plan: Array<{ principal: number; interest: number; total: number }> = [];
  let remainingPrincipal = principal;
  
  for (let i = 0; i < years; i++) {
    let yearPrincipal = 0;
    let yearInterest = 0;
    
    for (let j = 0; j < 12; j++) {
      const interest = remainingPrincipal * monthlyRate;
      const principal = monthlyPayment - interest;
      yearInterest += interest;
      yearPrincipal += principal;
      remainingPrincipal -= principal;
    }
    
    plan.push({
      principal: yearPrincipal,
      interest: yearInterest,
      total: yearPrincipal + yearInterest
    });
  }
  
  return plan;
}
```

### 3.3 数据校验设计

#### 3.3.1 校验规则定义（Zod Schema）

```typescript
import { z } from 'zod';

const basicInfoSchema = z.object({
  projectName: z.string().min(1, '项目名称不能为空'),
  totalPeriod: z.number().int().min(3).max(50),
  constructionPeriod: z.number().int().min(1),
  benchmarkRate: z.number().min(0).max(30),
}).refine(
  (data) => data.constructionPeriod < data.totalPeriod,
  { message: '建设期必须小于测算周期', path: ['constructionPeriod'] }
);

const investmentSchema = z.object({
  fixedAssets: z.object({
    landCost: z.number().min(0),
    constructionCost: z.number().min(0),
    equipmentCost: z.number().min(0),
    residualRate: z.number().min(0).max(10),
  }),
  // ... 其他字段
});

const revenueSchema = z.object({
  paymentTerms: z.object({
    currentYearRatio: z.number().min(0).max(100),
    nextYearRatio: z.number().min(0).max(100),
  }).refine(
    (data) => data.currentYearRatio + data.nextYearRatio === 100,
    { message: '回款比例合计必须为100%' }
  ),
});
```

### 3.4 状态管理设计

```typescript
// 使用Zustand管理全局状态
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AppState {
  projectData: ProjectData;
  currentStep: number;
  validationErrors: Record<string, string[]>;
  
  // Actions
  updateBasicInfo: (data: Partial<BasicInfo>) => void;
  updateInvestment: (data: Partial<Investment>) => void;
  updateRevenue: (data: Partial<Revenue>) => void;
  updateCost: (data: Partial<Cost>) => void;
  updateFinancing: (data: Partial<Financing>) => void;
  calculate: () => void;
  validate: () => boolean;
  reset: () => void;
}

const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      projectData: getInitialData(),
      currentStep: 0,
      validationErrors: {},
      
      updateBasicInfo: (data) => {
        set((state) => ({
          projectData: {
            ...state.projectData,
            basicInfo: { ...state.projectData.basicInfo, ...data }
          }
        }));
      },
      
      calculate: () => {
        const { projectData } = get();
        const result = calculateIRRResult(projectData);
        set((state) => ({
          projectData: {
            ...state.projectData,
            calculation: result
          }
        }));
      },
      
      // ... 其他actions
    }),
    {
      name: 'irr-calculator-storage',
    }
  )
);
```

---

## 四、UI/UX设计规范

### 4.1 设计系统

#### 4.1.1 颜色规范

```css
:root {
  /* 主色调 */
  --primary-color: #1890ff;
  --primary-hover: #40a9ff;
  --primary-active: #096dd9;
  
  /* 功能色 */
  --success-color: #52c41a;
  --warning-color: #faad14;
  --error-color: #ff4d4f;
  --info-color: #1890ff;
  
  /* 中性色 */
  --text-primary: #262626;
  --text-secondary: #595959;
  --text-disabled: #bfbfbf;
  --border-color: #d9d9d9;
  --bg-color: #fafafa;
  
  /* 特殊标识 */
  --required-color: #ff4d4f;
  --calculated-bg: #fffbe6;
  --error-border: #ff4d4f;
}
```

#### 4.1.2 字体规范

- 主标题：20px / 28px，加粗
- 二级标题：16px / 24px，加粗
- 三级标题：14px / 22px，加粗
- 正文：14px / 22px，常规
- 辅助文字：12px / 20px，常规

#### 4.1.3 间距规范

- 页面边距：24px
- 区块间距：16px
- 表单项间距：12px
- 表单项内间距：8px

### 4.2 组件设计

#### 4.2.1 表单输入组件

```typescript
// 必填项输入框
<Form.Item
  label={
    <>
      项目名称 <span style={{ color: 'red' }}>*</span>
    </>
  }
  name="projectName"
  rules={[{ required: true, message: '请输入项目名称' }]}
>
  <Input placeholder="请输入项目名称" />
</Form.Item>

// 金额输入框（带单位）
<Form.Item label="投资金额" name="amount">
  <InputNumber
    min={0}
    precision={2}
    formatter={(value) => `${value} 万元`}
    parser={(value) => value!.replace(' 万元', '')}
    style={{ width: '100%' }}
  />
</Form.Item>

// 百分比输入框
<Form.Item label="基准收益率" name="rate">
  <InputNumber
    min={0}
    max={30}
    precision={2}
    formatter={(value) => `${value}%`}
    parser={(value) => value!.replace('%', '')}
    style={{ width: '100%' }}
  />
</Form.Item>
```

#### 4.2.2 年度数据表格组件

```typescript
// 动态年度列
const YearColumns = (totalPeriod: number) => {
  const columns = [
    { title: '项目', dataIndex: 'item', fixed: 'left', width: 150 }
  ];
  
  for (let i = 1; i <= totalPeriod; i++) {
    columns.push({
      title: `年度${i}`,
      dataIndex: `year${i}`,
      width: 120,
      render: (value: number) => formatCurrency(value)
    });
  }
  
  return columns;
};
```

#### 4.2.3 数据校验提示组件

```typescript
<Alert
  type="error"
  message="数据校验失败"
  description={
    <ul>
      {validationErrors.map((error, index) => (
        <li key={index}>{error}</li>
      ))}
    </ul>
  }
  showIcon
  closable
/>
```

### 4.3 响应式设计

- 桌面端（≥1200px）：侧边栏 + 主内容区
- 平板端（768px-1199px）：可折叠侧边栏
- 移动端（<768px）：底部导航栏，单页面切换

---

## 五、功能特性

### 5.1 数据持久化

- **自动保存**：每次输入后3秒自动保存到LocalStorage
- **手动保存**：点击保存按钮立即保存
- **导出Excel**：使用SheetJS库导出为.xlsx文件
- **导入Excel**：支持导入已有Excel模板数据

### 5.2 实时计算

- 输入数据后自动触发相关计算
- 使用防抖（debounce）优化性能
- 计算结果实时更新到结果页面

### 5.3 数据校验

- **实时校验**：输入时即时校验
- **提交校验**：切换页面时完整校验
- **错误提示**：红色边框 + 错误信息
- **校验汇总**：页面底部显示所有错误

### 5.4 敏感性分析

- 场景切换：下拉选择预设场景
- 参数调整：滑块调整变化幅度
- 结果对比：表格 + 图表展示
- 一键重置：恢复基准场景

### 5.5 数据可视化

- **现金流趋势图**：折线图展示年度现金流
- **IRR敏感性分析**：热力图/雷达图
- **盈亏平衡分析**：散点图 + 趋势线
- **关键指标卡片**：大数字展示IRR、NPV等

---

## 六、性能优化

### 6.1 计算优化

- 使用Web Worker处理复杂计算
- 计算结果缓存，避免重复计算
- 增量更新，只计算变化部分

### 6.2 渲染优化

- 虚拟滚动：大表格使用虚拟滚动
- 懒加载：图表按需加载
- 代码分割：路由级别代码分割

### 6.3 存储优化

- 数据压缩：存储前压缩JSON数据
- 增量保存：只保存变化的数据
- 清理策略：定期清理过期数据

---

## 七、部署方案

### 7.1 构建配置

```javascript
// vite.config.js
export default {
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
          'antd-vendor': ['antd'],
          'chart-vendor': ['echarts', 'recharts'],
        }
      }
    }
  }
}
```

### 7.2 部署环境

- **开发环境**：本地开发服务器
- **测试环境**：测试服务器
- **生产环境**：CDN + 静态托管（如Vercel、Netlify）

### 7.3 浏览器兼容性

- Chrome/Edge：最新2个版本
- Firefox：最新2个版本
- Safari：最新2个版本
- 不支持IE

---

## 八、开发计划

### 8.1 开发阶段

| 阶段 | 时间 | 任务 |
|-----|------|------|
| **阶段1：基础搭建** | 1周 | 项目初始化、路由配置、基础组件 |
| **阶段2：数据录入** | 2周 | 6个数据录入页面开发 |
| **阶段3：计算引擎** | 1周 | IRR/NPV计算、折旧摊销、还款计划 |
| **阶段4：结果展示** | 1周 | 现金流表、敏感性分析、图表 |
| **阶段5：优化完善** | 1周 | 性能优化、测试、文档 |

### 8.2 技术难点

1. **IRR计算精度**：需要实现高精度IRR算法
2. **复杂公式计算**：现金流计算逻辑复杂
3. **大数据量处理**：年度数据可能较多
4. **实时计算性能**：需要优化计算性能

---

## 九、测试方案

### 9.1 单元测试

- 计算函数测试（IRR、NPV、折旧等）
- 数据校验测试
- 工具函数测试

### 9.2 集成测试

- 页面流程测试
- 数据流转测试
- 计算结果准确性测试

### 9.3 端到端测试

- 完整业务流程测试
- 浏览器兼容性测试
- 性能测试

---

## 十、文档要求

### 10.1 用户文档

- 使用手册
- 常见问题
- 视频教程

### 10.2 开发文档

- API文档
- 组件文档
- 部署文档

---

**方案版本：V1.0**  
**创建日期：2024年**  
**适用场景：Web端IRR测算系统开发**

