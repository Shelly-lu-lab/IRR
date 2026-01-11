# IRR测算系统 - 网页版详细设计方案 V2.0

## 一、系统概述

本系统是一个基于Web的IRR（内部收益率）测算工具，完全对标专业财务测算需求，覆盖项目投资全周期数据录入和计算。

### 1.1 技术架构

| 模块 | 技术选型 |
|-----|---------|
| 前端框架 | React 18 + TypeScript |
| UI组件库 | Ant Design 5.x |
| 状态管理 | Zustand（支持持久化） |
| 路由 | React Router 6 |
| 构建工具 | Vite 5 |

### 1.2 系统特点

- ✅ 完整的四大模块（投资、营收、成本、融资）
- ✅ 详细的二级、三级目录结构
- ✅ 实时数据校验和自动计算
- ✅ 数据持久化到本地存储
- ✅ 支持多产品/多品类录入
- ✅ 动态表格支持年度数据录入
- ✅ 专业的IRR/NPV计算引擎

---

## 二、数据结构设计（完整版）

### 2.1 一、投资情况

> 核心属性：初始现金流出 + 建设期资本投入，决定模型的期初现金流基数

#### 2.1.1 建设投资

**1.1.1 固定资产投资**

| 字段 | 类型 | 说明 |
|-----|------|------|
| landCost | number | 土地使用权购置成本（含契税、印花税） |
| engineeringCost | number | 工程建设费用（土建工程、设备安装工程） |
| equipmentCost.production | number | 生产设备购置成本 |
| equipmentCost.office | number | 办公设备购置成本 |
| equipmentCost.transport | number | 运输设备购置成本 |
| reserveFund.priceIncrease | number | 涨价预备费 |
| reserveFund.basic | number | 基本预备费 |
| residualRate | number | 固定资产残值率（%） |
| depreciationMethod | enum | 折旧方法（直线法/双倍余额递减法） |
| depreciationYears.building | number | 房屋建筑物折旧年限 |
| depreciationYears.machinery | number | 机器设备折旧年限 |
| depreciationYears.transport | number | 运输工具折旧年限 |
| depreciationYears.other | number | 其他设备折旧年限 |

**1.1.2 无形资产投资**

| 字段 | 类型 | 说明 |
|-----|------|------|
| patentCost | number | 专利/非专利技术购置费用 |
| trademarkCost | number | 商标权/特许经营权费用 |
| softwareCost | number | 软件系统开发/采购费用 |
| amortizationYears | number | 无形资产摊销年限 |

**1.1.3 其他资产投资**

| 字段 | 类型 | 说明 |
|-----|------|------|
| startupCost | number | 开办费（筹备期人员工资、办公费、差旅费） |
| leaseImprovements | number | 长期待摊费用（装修费、租赁改良支出） |
| amortizationYears | number | 其他资产摊销年限 |

#### 2.1.2 流动资金投资

**1.2.1 铺底流动资金**

| 字段 | 类型 | 说明 |
|-----|------|------|
| minimumCash | number | 运营期最低货币资金保有量 |
| receivablesDays | number | 应收账款周转天数 |
| inventoryDays | number | 存货周转天数 |
| payablesDays | number | 应付账款周转天数 |

**1.2.2 流动资金增减额**

| 字段 | 类型 | 说明 |
|-----|------|------|
| constructionPeriodInput | number | 建设期流动资金投入额 |
| operationPeriodChanges | number[] | 运营期各年流动资金追加/收回额 |
| recoverAtEnd | boolean | 运营期末流动资金全额回收标记 |

#### 2.1.3 建设期相关参数

| 字段 | 类型 | 说明 |
|-----|------|------|
| constructionMonths | number | 建设期时长（月） |
| paymentSchedule | number[] | 各年度投资支付比例 |
| paymentTiming | enum | 资金支付时点（期初/期中/期末） |
| capitalizedInterest | number | 可资本化的债务融资利息金额 |
| capitalizeToFixedAssets | boolean | 资本化利息计入固定资产原值标记 |

---

### 2.2 二、营收情况

> 核心属性：运营期现金流入核心来源，决定各期现金流的流入规模

#### 2.2.1 主营业务收入

**2.1.1 产品/服务品类**

| 字段 | 类型 | 说明 |
|-----|------|------|
| products[].name | string | 品类名称 |
| products[].salesByYear | number[] | 预计销量（分年度） |
| products[].priceByYear | number[] | 单位售价（分年度） |

**2.1.2 收入确认与回款节奏**

| 字段 | 类型 | 说明 |
|-----|------|------|
| recognitionPrinciple | enum | 收入确认原则（权责发生制/收付实现制） |
| paymentRatios.currentYear | number | 当年回款比例（%） |
| paymentRatios.nextYear | number | 次年回款比例（%） |
| creditDays | number | 赊销政策（应收账款账期天数） |

**2.1.3 产能利用率**

| 字段 | 类型 | 说明 |
|-----|------|------|
| capacityUtilization | number[] | 各年度产能利用率目标（%） |

#### 2.2.2 其他业务收入

**2.2.1 材料销售/废料处置收入**

| 字段 | 类型 | 说明 |
|-----|------|------|
| materialSales.amountByYear | number[] | 预计年度收入金额 |
| materialSales.paymentRatio | number | 回款比例（%） |

**2.2.2 租金收入**

| 字段 | 类型 | 说明 |
|-----|------|------|
| rentalIncome.leaseTerm | number | 租赁期限（年） |
| rentalIncome.annualRent | number | 年度租金金额 |
| rentalIncome.paymentMethod | enum | 租金支付方式（年付/季付） |
| rentalIncome.paymentTiming | enum | 预付/后付 |

**2.2.3 技术服务/授权收入**

| 字段 | 类型 | 说明 |
|-----|------|------|
| techService.amount | number | 收入金额 |
| techService.receiptYear | number | 收款年度 |

#### 2.2.3 营业外收入

**2.3.1 政府补贴收入**

| 字段 | 类型 | 说明 |
|-----|------|------|
| subsidies[].type | enum | 补贴类型（与资产相关/与收益相关） |
| subsidies[].amount | number | 补贴金额 |
| subsidies[].receiptYear | number | 到账年度 |

**2.3.2 资产处置利得**

| 字段 | 类型 | 说明 |
|-----|------|------|
| assetDisposal[].assetType | string | 处置资产类型 |
| assetDisposal[].disposalYear | number | 预计处置年度 |
| assetDisposal[].grossAmount | number | 处置收入金额 |
| assetDisposal[].netAmount | number | 税费扣除后净额 |

**2.3.3 其他营业外收入**

| 字段 | 类型 | 说明 |
|-----|------|------|
| otherIncome | number[] | 各年度其他营业外收入 |

---

### 2.3 三、成本与费用

> 核心属性：运营期现金流出核心来源，区分付现成本与非付现成本，影响税后现金流

#### 2.3.1 营业成本

**3.1.1 直接成本**

| 字段 | 类型 | 说明 |
|-----|------|------|
| directCost.material.consumptionPerUnit | number | 单位产品材料耗用量 |
| directCost.material.priceByYear | number[] | 材料单价（分年度） |
| directCost.labor.hoursPerUnit | number | 单位产品人工工时 |
| directCost.labor.hourlyRateByYear | number[] | 小时人工成本（分年度） |
| directCost.energy.consumptionPerUnit | number | 单位产品能耗 |
| directCost.energy.priceByYear | number[] | 能源单价（分年度） |

**3.1.2 制造费用**

| 字段 | 类型 | 说明 |
|-----|------|------|
| manufacturingOverhead.variablePerUnit | number | 变动制造费用（单位产品分摊额） |
| manufacturingOverhead.fixedByYear | number[] | 固定制造费用（年度总金额） |

**3.1.3 成本核算参数**

| 字段 | 类型 | 说明 |
|-----|------|------|
| accountingParams.inventoryMethod | enum | 存货计价方式（先进先出/加权平均） |
| accountingParams.productionSalesRatio | number | 产销比（%） |

#### 2.3.2 期间费用

**3.2.1 销售费用**

| 字段 | 类型 | 说明 |
|-----|------|------|
| selling.variableRatio | number | 变动销售费用比例（按营收计提%） |
| selling.fixedByYear | number[] | 固定销售费用（年度总金额） |

**3.2.2 管理费用**

| 字段 | 类型 | 说明 |
|-----|------|------|
| administrative.variableRatio | number | 变动管理费用比例（按营收计提%） |
| administrative.fixedByYear | number[] | 固定管理费用（年度总金额） |

**3.2.3 财务费用**

| 字段 | 类型 | 说明 |
|-----|------|------|
| financial.shortTermInterest | number[] | 短期借款利息支出 |
| financial.longTermInterest | number[] | 长期借款利息支出（费用化部分） |
| financial.depositInterest | number[] | 存款利息收入（冲减） |
| financial.exchangeGainLoss | number[] | 汇兑损益 |

#### 2.3.3 税金及附加

**3.3.1 流转税附加**

| 字段 | 类型 | 说明 |
|-----|------|------|
| urbanMaintenance | number | 城市维护建设税率（%） |
| educationSurcharge | number | 教育费附加率（%） |
| localEducation | number | 地方教育附加率（%） |

**3.3.2 其他税金**

| 字段 | 类型 | 说明 |
|-----|------|------|
| propertyTax | number[] | 房产税（各年度） |
| landUseTax | number[] | 土地使用税（各年度） |
| stampDuty | number[] | 印花税（各年度） |
| resourceTax | number[] | 资源税（各年度） |

#### 2.3.4 营业外支出

| 字段 | 类型 | 说明 |
|-----|------|------|
| assetDisposalLoss | Array | 资产处置损失 |
| finesAndDonations | number[] | 罚款支出、捐赠支出 |
| otherExpenses | number[] | 其他营业外支出 |

#### 2.3.5 非付现成本明细

> 关键税盾项，不影响现金流但影响所得税

**3.5.1 固定资产折旧**

| 字段 | 类型 | 说明 |
|-----|------|------|
| depreciation.method | enum | 折旧方法 |
| depreciation.years | number | 折旧年限 |
| depreciation.residualRate | number | 残值率 |
| depreciation.amountByYear | number[] | 各年度折旧额（自动计算） |

**3.5.2 无形资产摊销**

| 字段 | 类型 | 说明 |
|-----|------|------|
| intangibleAmortization.years | number | 摊销年限 |
| intangibleAmortization.amountByYear | number[] | 各年度摊销额（自动计算） |

**3.5.3 长期待摊费用摊销**

| 字段 | 类型 | 说明 |
|-----|------|------|
| deferredAmortization.years | number | 摊销年限 |
| deferredAmortization.amountByYear | number[] | 各年度摊销额（自动计算） |

---

### 2.4 四、融资与税率

> 核心属性：税后现金流调整核心因素，融资成本影响利息支出，税率影响所得税金额

#### 2.4.1 融资结构

**4.1.1 权益融资**

| 字段 | 类型 | 说明 |
|-----|------|------|
| equity.registeredCapital | number | 注册资本投入金额 |
| equity.capitalReserve | number | 资本公积投入金额（溢价部分） |
| equity.investmentYear | number | 投入年度 |
| equity.dividendPolicy.ratio | number | 分红比例（%） |
| equity.dividendPolicy.startYear | number | 分红起始年度 |

**4.1.2 债务融资**

| 字段 | 类型 | 说明 |
|-----|------|------|
| debt.longTermLoan.amount | number | 长期借款金额 |
| debt.longTermLoan.term | number | 借款期限（年） |
| debt.longTermLoan.rate | number | 借款利率（%） |
| debt.longTermLoan.repaymentMethod | enum | 还款方式（等额本息/等额本金/到期还本付息） |
| debt.longTermLoan.startYear | number | 起始年度 |
| debt.shortTermLoan.amount | number | 短期借款金额 |
| debt.shortTermLoan.term | number | 借款期限（月） |
| debt.shortTermLoan.rate | number | 借款利率（%） |
| debt.shortTermLoan.frequency | enum | 还款频率 |
| debt.otherDebt.type | enum | 其他债务类型 |
| debt.otherDebt.amount | number | 债务金额 |
| debt.otherDebt.term | number | 期限 |
| debt.otherDebt.rate | number | 利率 |

#### 2.4.2 利率与利息支付

| 字段 | 类型 | 说明 |
|-----|------|------|
| interestPayment.rateType | enum | 借款利率类型（固定/浮动） |
| interestPayment.baseRate | number | 基准利率 |
| interestPayment.spread | number | 浮动点数 |
| interestPayment.paymentFrequency | enum | 付息频率（按月/按季/按年） |
| interestPayment.paymentTiming | enum | 付息时点（期初/期末） |

#### 2.4.3 税率与税费政策

**4.3.1 所得税相关**

| 字段 | 类型 | 说明 |
|-----|------|------|
| incomeTax.statutoryRate | number | 企业所得税法定税率 |
| incomeTax.preferentialRate | number | 优惠税率 |
| incomeTax.hasPreferential | boolean | 是否享受税收优惠 |
| incomeTax.preferentialType | string | 优惠类型 |
| incomeTax.rdDeduction | boolean | 是否享受研发费用加计扣除 |
| incomeTax.rdDeductionRatio | number | 加计扣除比例 |
| incomeTax.lossCarryForward | enum | 亏损弥补年限（5年/10年） |

**4.3.2 流转税相关**

| 字段 | 类型 | 说明 |
|-----|------|------|
| vat.taxpayerType | enum | 纳税人类型（一般/小规模） |
| vat.rate | number | 增值税税率 |
| vat.hasExemption | boolean | 是否享受减免政策 |
| vat.exemptionType | string | 减免类型 |
| consumptionTax.applicable | boolean | 是否适用消费税 |
| consumptionTax.rate | number | 消费税税率 |

**4.3.3 其他税费**

| 字段 | 类型 | 说明 |
|-----|------|------|
| stampDutyRates.purchaseSales | number | 购销合同税率（‰） |
| stampDutyRates.loan | number | 借款合同税率（‰） |
| landValueAddedTax.applicable | boolean | 是否涉及土地增值税 |
| landValueAddedTax.rate | number | 土地增值税税率 |

---

## 三、页面结构设计

### 3.1 页面列表

| 路由 | 页面名称 | 功能说明 |
|-----|---------|---------|
| `/` | 首页 | 使用说明和导航 |
| `/basic-info` | 基础信息 | 项目名称、测算周期、基准收益率 |
| `/investment` | 投资情况 | 建设投资、流动资金、建设期参数 |
| `/revenue` | 营收情况 | 主营业务、其他业务、营业外收入 |
| `/cost` | 成本与费用 | 营业成本、期间费用、税金、非付现成本 |
| `/financing` | 融资与税率 | 融资结构、利率、税率政策 |
| `/calculation` | 现金流计算 | IRR/NPV计算、现金流明细表 |
| `/summary` | 结果汇总 | 关键指标展示、敏感性分析 |

### 3.2 投资情况页面结构

```
投资情况
├── 1.1 建设投资
│   ├── 1.1.1 固定资产投资
│   │   ├── 土地使用权购置成本
│   │   ├── 工程建设费用
│   │   ├── 设备购置成本（生产/办公/运输）
│   │   ├── 固定资产预备费（涨价/基本）
│   │   ├── 固定资产残值率
│   │   └── 折旧参数（方法、年限）
│   ├── 1.1.2 无形资产投资
│   │   ├── 专利/非专利技术费用
│   │   ├── 商标权/特许经营权费用
│   │   ├── 软件系统费用
│   │   └── 摊销年限
│   └── 1.1.3 其他资产投资
│       ├── 开办费
│       ├── 长期待摊费用
│       └── 摊销年限
├── 1.2 流动资金投资
│   ├── 1.2.1 铺底流动资金
│   │   ├── 最低货币资金
│   │   ├── 应收账款周转天数
│   │   ├── 存货周转天数
│   │   └── 应付账款周转天数
│   └── 1.2.2 流动资金增减额
│       ├── 建设期投入
│       ├── 运营期各年增减
│       └── 期末回收标记
└── 1.3 建设期相关参数
    ├── 1.3.1 建设期时长
    ├── 1.3.2 投资支付节奏
    │   ├── 各年度支付比例
    │   └── 支付时点
    └── 1.3.3 建设期资本化利息
```

### 3.3 营收情况页面结构

```
营收情况
├── 2.1 主营业务收入
│   ├── 2.1.1 产品/服务品类（支持多品类）
│   │   ├── 品类名称
│   │   ├── 年度销量
│   │   └── 年度单价
│   ├── 2.1.2 收入确认与回款节奏
│   │   ├── 收入确认原则
│   │   ├── 当年/次年回款比例
│   │   └── 应收账款账期
│   └── 2.1.3 产能利用率
├── 2.2 其他业务收入
│   ├── 2.2.1 材料销售/废料处置收入
│   ├── 2.2.2 租金收入
│   └── 2.2.3 技术服务/授权收入
└── 2.3 营业外收入
    ├── 2.3.1 政府补贴收入（支持多笔）
    ├── 2.3.2 资产处置利得
    └── 2.3.3 其他营业外收入
```

### 3.4 成本与费用页面结构

```
成本与费用
├── 3.1 营业成本
│   ├── 3.1.1 直接成本
│   │   ├── 直接材料成本
│   │   ├── 直接人工成本
│   │   └── 燃料动力成本
│   ├── 3.1.2 制造费用
│   │   ├── 变动制造费用
│   │   └── 固定制造费用
│   └── 3.1.3 成本核算参数
│       ├── 存货计价方式
│       └── 产销比
├── 3.2 期间费用
│   ├── 3.2.1 销售费用
│   ├── 3.2.2 管理费用
│   └── 3.2.3 财务费用
├── 3.3 税金及附加
│   ├── 3.3.1 流转税附加
│   └── 3.3.2 其他税金
├── 3.4 营业外支出
└── 3.5 非付现成本明细
    ├── 3.5.1 固定资产折旧
    ├── 3.5.2 无形资产摊销
    └── 3.5.3 长期待摊费用摊销
```

### 3.5 融资与税率页面结构

```
融资与税率
├── 4.1 融资结构
│   ├── 4.1.1 权益融资
│   │   ├── 注册资本
│   │   ├── 资本公积
│   │   └── 分红政策
│   └── 4.1.2 债务融资
│       ├── 长期借款
│       ├── 短期借款
│       └── 其他债务
├── 4.2 利率与利息支付
│   ├── 4.2.1 借款利率类型
│   └── 4.2.2 利息支付节奏
└── 4.3 税率与税费政策
    ├── 4.3.1 所得税相关
    ├── 4.3.2 流转税相关
    └── 4.3.3 其他税费
```

---

## 四、计算逻辑

### 4.1 IRR计算

使用牛顿-拉夫逊法（Newton-Raphson）迭代求解：

```
IRR = 使得 NPV = 0 的折现率

NPV = Σ (CFt / (1 + r)^t) = 0
```

### 4.2 现金流计算

**现金流入 = 主营业务收入回款 + 其他业务收入 + 营业外收入 + 残值回收 + 流动资金回收**

**现金流出 = 建设投资支出 + 追加投资 + 流动资金投入 + 营业成本（付现）+ 期间费用 + 税费 + 借款本息偿还 + 股东分红**

**净现金流 = 现金流入 - 现金流出**

### 4.3 折旧计算

**直线法：**
```
年度折旧 = (原值 - 残值) / 折旧年限
```

**双倍余额递减法：**
```
年度折旧 = 账面价值 × (2 / 折旧年限)
（剩余年限≤2年时转为直线法）
```

---

## 五、使用说明

### 5.1 数据录入顺序

1. **基础信息** - 设置测算周期、建设期、基准收益率
2. **投资情况** - 录入建设投资、流动资金
3. **营收情况** - 录入主营业务收入、其他收入
4. **成本与费用** - 录入成本、费用、税金
5. **融资与税率** - 录入融资结构、税率
6. **现金流计算** - 点击计算按钮查看结果

### 5.2 数据单位

- **金额单位**：万元
- **利率/比例单位**：%（直接填数字，如12%填12）
- **时间单位**：年/月/天

### 5.3 数据保存

- 数据自动保存到浏览器本地存储
- 点击"导出数据"可导出JSON文件
- 点击"重置"可清空所有数据

---

## 六、版本信息

- **版本号**：V2.0
- **更新日期**：2024年
- **主要更新**：
  - 完整对标IRR文档四大模块结构
  - 新增详细的二级、三级目录
  - 支持多产品/多品类动态录入
  - 支持政府补贴等项目的动态添加
  - 优化表单布局和用户体验

---

**适用场景**：项目投资IRR测算、财务可行性分析、投资决策支持
