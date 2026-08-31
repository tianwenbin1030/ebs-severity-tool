/**
 * Severity Assessment Criteria Configuration (EN / ZH bilingual)
 * Update this file to keep the criteria current.
 */
const SEVERITY_DATA = {
  lastUpdated: "2026-08-31",
  levels: [
    {
      level: 1,
      title: "Potential impact on technical compliance & Safety Risk",
      titleZh: "潜在的技术合规与安全风险影响",
      shortTitle: "Technical Compliance & Safety Risk",
      shortTitleZh: "技术合规与安全风险",
      color: "#dc2626",
      bg: "#fef2f2",
      criteria: [
        {
          en: "Failure, malfunction or violation of Product Safety, Product Conformity, Product Environmental Compliance, Product Cyber Security and Privacy and Intellectual Property causing uncontrollable conditions, breakdown of safety systems or safety control systems, sudden loss of power, nonconformities of products according to legal regulations or applicable international standards, etc. (\"P0207713 technical Compliance\", \"P0207624 technical Compliance Case Management\").",
          zh: "产品安全、产品一致性、产品环保合规、产品网络安全与隐私以及知识产权的失效、故障或违反，导致不可控状况、安全系统或安全控制系统失效、突然断电、产品不符合法律法规或适用国际标准等（\"P0207713 technical Compliance\"、\"P0207624 technical Compliance Case Management\"）。"
        },
        {
          en: "Occurrences where authorities or customers decided on or likely will decide on a recall.",
          zh: "官方机构或客户已经决定或可能决定发起召回的情况。"
        },
        {
          en: "Field service actions & recalls related to technical compliance categories.",
          zh: "与技术合规类别相关的现场服务措施及召回。"
        },
        {
          en: "Any reporting obligation as stipulated by respective legislation or authorities.",
          zh: "根据相应法律法规或官方机构规定产生的任何报告义务。"
        }
      ],
      keywords: [
        { en: "product safety", zh: "产品安全" },
        { en: "product conformity", zh: "产品一致性" },
        { en: "environmental compliance", zh: "环保合规" },
        { en: "cyber security", zh: "网络安全" },
        { en: "privacy", zh: "隐私" },
        { en: "intellectual property", zh: "知识产权" },
        { en: "safety system", zh: "安全系统" },
        { en: "breakdown", zh: "失效" },
        { en: "uncontrollable", zh: "不可控" },
        { en: "sudden loss of power", zh: "突然断电" },
        { en: "nonconformity", zh: "不符合" },
        { en: "legal regulation", zh: "法律法规" },
        { en: "international standard", zh: "国际标准" },
        { en: "authority", zh: "官方机构" },
        { en: "recall", zh: "召回" },
        { en: "field service action", zh: "现场服务措施" },
        { en: "reporting obligation", zh: "报告义务" },
        { en: "legislation", zh: "立法" },
        { en: "accident", zh: "事故" },
        { en: "fire", zh: "起火" },
        { en: "injury", zh: "人身伤害" },
        { en: "police report", zh: "警方报告" },
        { en: "loss of drivability", zh: "丧失行驶能力" },
        { en: "immobilized", zh: "车辆无法移动" },
        { en: "brake failure", zh: "制动失效" },
        { en: "loss of control", zh: "失控" },
        { en: "safety-critical", zh: "安全关键" },
        { en: "towing", zh: "拖车" },
        { en: "workshop visit", zh: "进厂维修" },
        { en: "field trend", zh: "现场趋势" },
        { en: "type-approval", zh: "型式认证" },
        { en: "regulatory", zh: "监管" },
        { en: "EBD warning light", zh: "EBD警告灯" },
        { en: "ABS disabled", zh: "ABS失效" },
        { en: "AYC disabled", zh: "AYC失效" },
        { en: "ESC disabled", zh: "ESC失效" },
        { en: "red warning light", zh: "红色警告灯" },
        { en: "sudden loss of air pressure", zh: "气压突然下降" },
        { en: "critical niveau", zh: "临界高度水平" }
      ]
    },
    {
      level: 2,
      title: "Major customer dissatisfaction, Source-ability & Certification Risk",
      titleZh: "重大客户不满、可采购性（供货资格）与认证风险",
      shortTitle: "Customer / Source-ability / Certification Risk",
      shortTitleZh: "客户 / 可采购性 / 认证风险",
      color: "#ea580c",
      bg: "#fff7ed",
      criteria: [
        {
          en: "Escalation to customer top management (e.g., board members, heads of purchasing, quality, R&D).",
          zh: "升级至客户最高管理层（如董事会成员、采购/质量/研发负责人）。"
        },
        {
          en: "Formal customer escalation processes triggered by OEMs or Negative customer decisions affecting supplier status. Examples of OEM escalation systems (for reference): Mercedes-Benz: Q-Help 1/2/3; Ford Motor Company: Q1 Revocation; Stellantis: Supplier escalation processes; General Motors: SPPS (Structured Practical Problem Solving) Escalation Process; Volkswagen AG: Formel-Q escalation levels.",
          zh: "由 OEM 触发的正式客户升级流程，或影响供应商地位的负面客户决定。OEM 升级体系示例（供参考）：梅赛德斯-奔驰：Q-Help 1/2/3；福特汽车公司：Q1 撤销；Stellantis：供应商升级流程；通用汽车：SPPS（结构化实际问题解决）升级流程；大众汽车：Formel-Q 升级等级。"
        },
        {
          en: "Financial impact exceeding € 0.5 million.",
          zh: "财务影响超过 50 万欧元。"
        },
        {
          en: "IATF or other Business-Critical Certification impact (suspension or withdrawal of certificates).",
          zh: "影响 IATF 或其他关键业务认证（证书暂停或撤销）。"
        },
        {
          en: "Significant reputational damage or strained customer relationships.",
          zh: "重大声誉损害或客户关系紧张。"
        },
        {
          en: "Field service actions not related to technical compliance categories.",
          zh: "与技术合规类别无关的现场服务措施。"
        },
        {
          en: "Organization blocked from new projects (e.g.: new business on hold) or supplier ranking downgrade.",
          zh: "组织被阻止参与新项目（如新业务暂停）或供应商评级下调。"
        },
        {
          en: "Production interruption, stop shipment, yard hold or downtime at the organization's site.",
          zh: "组织现场的生产中断、停止发货、货场扣留或停机。"
        },
        {
          en: "Repeated failures or unresolved complaints.",
          zh: "反复发生的失效或未解决的投诉。"
        },
        {
          en: "Failures or complaints affecting multiple customers or multiple AUMOVIO locations.",
          zh: "影响多个客户或多个 AUMOVIO 地点的失效或投诉。"
        }
      ],
      keywords: [
        { en: "top management", zh: "最高管理层" },
        { en: "board member", zh: "董事会成员" },
        { en: "head of purchasing", zh: "采购负责人" },
        { en: "head of quality", zh: "质量负责人" },
        { en: "head of R&D", zh: "研发负责人" },
        { en: "OEM escalation", zh: "OEM升级" },
        { en: "Q-Help", zh: "Q-Help" },
        { en: "Q1 Revocation", zh: "Q1撤销" },
        { en: "Stellantis", zh: "Stellantis" },
        { en: "SPPS", zh: "SPPS" },
        { en: "Formel-Q", zh: "Formel-Q" },
        { en: "supplier status", zh: "供应商地位" },
        { en: "negative customer decision", zh: "负面客户决定" },
        { en: "financial impact", zh: "财务影响" },
        { en: "0.5 million", zh: "50万欧元" },
        { en: "IATF", zh: "IATF" },
        { en: "certification impact", zh: "认证影响" },
        { en: "suspension of certificate", zh: "证书暂停" },
        { en: "withdrawal of certificate", zh: "证书撤销" },
        { en: "reputational damage", zh: "声誉损害" },
        { en: "strained customer relationship", zh: "客户关系紧张" },
        { en: "field service action", zh: "现场服务措施" },
        { en: "new project blocked", zh: "新项目受阻" },
        { en: "new business on hold", zh: "新业务暂停" },
        { en: "supplier ranking downgrade", zh: "供应商评级下调" },
        { en: "production interruption", zh: "生产中断" },
        { en: "stop shipment", zh: "停止发货" },
        { en: "yard hold", zh: "货场扣留" },
        { en: "downtime", zh: "停机" },
        { en: "repeated failure", zh: "反复失效" },
        { en: "unresolved complaint", zh: "未解决投诉" },
        { en: "multiple customers", zh: "多个客户" },
        { en: "multiple AUMOVIO locations", zh: "多个AUMOVIO地点" }
      ]
    },
    {
      level: 3,
      title: "Operational Disruption",
      titleZh: "生产中断",
      shortTitle: "Operational Disruption",
      shortTitleZh: "生产中断",
      color: "#ca8a04",
      bg: "#fefce8",
      criteria: [
        {
          en: "Full lot rejection or sorting due to quality issues.",
          zh: "因质量问题导致整批拒收或分选。"
        },
        {
          en: "Controlled Shipping Level or equivalent containment actions.",
          zh: "受控发运等级（CSL）或等效围堵措施。"
        },
        {
          en: "The quality problem significantly interferes with the output of the production.",
          zh: "质量问题严重影响生产产出。"
        },
        {
          en: "Customers required to contain the suspect product and to perform a redundant 100% inspection process. This may be done by this organization or a third party's employees.",
          zh: "客户要求对可疑产品进行围堵，并执行冗余的 100% 全检流程，可由本组织或第三方员工执行。"
        },
        {
          en: "Mandatory third-party inspections.",
          zh: "强制第三方检验。"
        }
      ],
      keywords: [
        { en: "full lot rejection", zh: "整批拒收" },
        { en: "sorting", zh: "分选" },
        { en: "controlled shipping level", zh: "受控发运等级" },
        { en: "containment action", zh: "围堵措施" },
        { en: "production output", zh: "生产产出" },
        { en: "interfere with production", zh: "影响生产" },
        { en: "100% inspection", zh: "全检" },
        { en: "redundant inspection", zh: "冗余检验" },
        { en: "third party inspection", zh: "第三方检验" },
        { en: "mandatory inspection", zh: "强制检验" },
        { en: "suspect product", zh: "可疑产品" }
      ]
    },
    {
      level: 4,
      title: "Minor & Isolated Issues / Disruptions",
      titleZh: "轻微及孤立的问题 / 干扰",
      shortTitle: "Minor & Isolated Issues",
      shortTitleZh: "轻微及孤立问题",
      color: "#16a34a",
      bg: "#f0fdf4",
      criteria: [
        {
          en: "Single, rare quality issues with limited impact.",
          zh: "单一、偶发且影响有限的轻微质量问题。"
        },
        {
          en: "Problems resolved through standard processes.",
          zh: "通过标准流程即可解决的问题。"
        },
        {
          en: "No significant customer or operational escalation.",
          zh: "无重大客户或运营升级。"
        }
      ],
      keywords: [
        { en: "single", zh: "单一" },
        { en: "rare", zh: "偶发" },
        { en: "limited impact", zh: "影响有限" },
        { en: "standard process", zh: "标准流程" },
        { en: "no escalation", zh: "无升级" },
        { en: "minor issue", zh: "轻微问题" },
        { en: "isolated issue", zh: "孤立问题" }
      ]
    }
  ],
  severity1Symptoms: {
    title: "Severity 1 based on product symptoms",
    titleZh: "严重度1基于产品表现",
    categories: [
      {
        name: "EBS",
        nameZh: "EBS",
        items: [
          {
            en: "Relevant customer indications as e.g.: accident, fire, injury, or involvement of authorities (e.g., police report).",
            zh: "相关的客户迹象，例如：事故、起火、人身伤害或涉及官方机构（如警方报告）。"
          },
          {
            en: "Loss of drivability or the vehicle becomes immobilized.",
            zh: "车辆丧失行驶能力或无法移动。"
          },
          {
            en: "Brake failure without warning or loss of control over long or lat acceleration.",
            zh: "无预警的制动失效，或在纵/横向加速度下失控。"
          },
          {
            en: "Safety-critical vehicle functions are affected.",
            zh: "影响车辆安全关键功能。"
          },
          {
            en: "Customer is instructed not to continue operating the vehicle; towing or an immediate workshop visit is required.",
            zh: "客户被告知不得继续驾驶车辆；需要拖车或立即进厂维修。"
          },
          {
            en: "Multiple comparable field cases or an identifiable field trend.",
            zh: "多个相似的现场案例或可识别的现场趋势。"
          },
          {
            en: "Potential recall implications or regulatory/type-approval relevance.",
            zh: "潜在的召回影响或监管/型式认证相关性。"
          },
          {
            en: "EBD warning Light (Red) or ABS disabled (yellow) or AYC/ESC disabled (yellow) with relevant customer indication for safety criticality.",
            zh: "EBD 警告灯（红色）或 ABS 失效（黄色）或 AYC/ESC 失效（黄色），并伴有与安全关键性相关的客户迹象。"
          }
        ]
      }
    ]
  }
};

/**
 * ============================================================================
 * Document-integrated criteria — clear decision criteria from:
 *   P0207713 Technical Compliance Policy (2025-09-19, v1.0)
 *   P0207715 tCMS Manual (v2.0 effective 2026-08-01)
 *   P0207624 tC Case Management (2025-09-19, v1.0)
 * ============================================================================
 */
const DOC_INTEGRATION = {
  lastUpdated: "2026-08-31",
  docRefs: [
    { id: "P0207713", en: "Technical Compliance Policy — corporate policy, effective 2025-09-19 (v1.0)", zh: "技术合规政策 — 公司级政策，2025-09-19 生效（v1.0）" },
    { id: "P0207715", en: "tCMS Manual — v2.0 effective 2026-08-01", zh: "技术合规管理体系手册 — v2.0 于 2026-08-01 生效" },
    { id: "P0207624", en: "tC Case Management — standard, effective 2025-09-19 (v1.0)", zh: "技术合规案例管理 — 标准，2025-09-19 生效（v1.0）" }
  ],
  categories: [
    { key: "safety", en: "Product Safety", zh: "产品安全", aspects: { en: "Active safety, passive safety, field monitoring & support", zh: "主动安全、被动安全、现场运行监控与支持" } },
    { key: "conformity", en: "Product Conformity", zh: "产品符合性", aspects: { en: "Actual vs. documented/advertised attributes, type approval & certification procedures", zh: "实际属性 vs 文档/广告属性、型式认证与认证程序" } },
    { key: "environmental", en: "Product Environmental Compliance", zh: "产品环境合规", aspects: { en: "Emissions, consumption, resource efficiency, materials, circular economy", zh: "排放、消耗、资源效率、材料、循环经济" } },
    { key: "cybersecurity", en: "Product Cybersecurity & Privacy", zh: "产品网络安全与隐私", aspects: { en: "SW/HW/system cybersecurity, data privacy, IT security", zh: "软件/硬件/系统网络安全、数据隐私、IT 网络安全" } },
    { key: "ip", en: "Intellectual Property", zh: "知识产权", aspects: { en: "Patents (incl. SEP), trademarks (incl. domain), designs, 3rd-party SW licenses (incl. FOSS), copyright, know-how", zh: "专利（含标准必要专利）、商标（含域名）、设计、第三方软件许可（含开源）、版权、专有技术" } }
  ],
  obligationSources: [
    { key: "A", en: "Legal technical regulations of exporting/importing countries", zh: "出口/进口国法律技术法规" },
    { key: "B", en: "Applicable external standards", zh: "适用的外部标准" },
    { key: "C", en: "Applicable internal rules", zh: "适用的内部规则" },
    { key: "D", en: "Contractually agreed technical customer requirements related to A/B/C", zh: "与 A/B/C 相关的合同约定的技术客户要求" },
    { key: "E", en: "AUMOVIO's self-commitments in external communication", zh: "AUMOVIO 对外沟通的自承诺" }
  ],
  probImpact: {
    title: { en: "Probability × Impact — L1 initial assessment", zh: "发生概率 × 影响严重程度 — L1 初始评估" },
    probability: { en: "Likelihood that the issue causes the product to be non-compliant", zh: "问题导致产品不合规的可能性" },
    impact: { en: "Potential severity of consequences and effects of the issue", zh: "问题后果和影响的潜在严重性" },
    note: { en: "If the team cannot reach agreement at L1 → escalate to L2 by default; if signs are already confirmed → transfer directly to L3.", zh: "L1 无法达成一致 → 默认升级 L2；迹象已确认 → 直接转 L3。" }
  },
  escalationLevels: [
    {
      level: "L1",
      title: { en: "Initial assessment", zh: "初始评估" },
      decision: { en: "BA tC representative / issue manager + AUMOVIO tC issue manager + BA Q/tC lead", zh: "BA tC 代表/问题经理 + AUMOVIO tC 问题经理 + BA Q/tC 主管" },
      rules: [
        { en: "Unanimous approval to escalate or close; if no agreement → default escalate to L2", zh: "一致批准升级或关闭；无法一致 → 默认升级 L2" },
        { en: "Signs already confirmed → transfer directly to L3", zh: "迹象已确认 → 直接转 L3" }
      ]
    },
    {
      level: "L2",
      title: { en: "Confirmation", zh: "确认" },
      decision: { en: "AUMOVIO tC lead + issue manager", zh: "AUMOVIO tC 主管 + 问题经理" },
      rules: [
        { en: "Can stay at L2 until closure ONLY if: no product safety risk, no recall expected, containment/mitigation fully effective", zh: "仅在满足以下条件时可留在 L2 管理至关闭：无产品安全风险、不需召回、遏制/缓解完全有效" },
        { en: "Legal tC representative must attend L2/L3 meetings", zh: "L2/L3 会议必须有法律 tC 代表在场" }
      ]
    },
    {
      level: "L3",
      title: { en: "tC Committee", zh: "tC 委员会" },
      decision: { en: "AUMOVIO tC lead + Q/tC lead + legal tC representative + BA lead", zh: "AUMOVIO tC 主管 + Q/tC 主管 + 法律 tC 代表 + BA 主管" },
      rules: [
        { en: "Unanimous approval of containment/mitigation/recidivism-prevention plans; veto → escalate to Executive Committee", zh: "一致批准遏制/缓解/复发预防计划；否决 → 升级执行委员会" }
      ]
    }
  ],
  detectionChannels: [
    { en: "CQTS severity level 1 (CA1000203 quality alert & escalation)", zh: "CQTS 严重度 1 级（CA1000203 质量警报和升级）" },
    { en: "PSCR escalation", zh: "PSCR 升级" },
    { en: "SQM red alert", zh: "SQM 红色警报" },
    { en: "External stakeholders (media, customers, legal bodies)", zh: "外部利益相关方（媒体、客户、法律机构）" },
    { en: "tC checks in PLC, tC risk management process, integrity hotline/platform/email, daily business", zh: "PLC 中的 tC 检查、tC 风险管理流程、诚信热线/平台/邮件、日常业务" }
  ],
  l2DowngradeConditions: [
    { en: "No product safety risk (no personal injury / environmental harm)", zh: "无产品安全风险（无人员伤害/环境影响）" },
    { en: "Recall not expected", zh: "预计不需要召回" },
    { en: "Containment/mitigation fully effective", zh: "遏制/缓解措施完全有效" }
  ],
  closingCriteria: [
    { level: "L3", en: "Risk consequences and recidivism risk mitigated to an acceptable level", zh: "风险后果与复发风险均已缓解至可接受水平" },
    { level: "L2", en: "Signs not confirmed, or risk mitigated and recidivism risk confirmed controllable by tC lead", zh: "迹象未确认，或风险已缓解且复发风险经 tC 主管确认可控" }
  ],
  severityMapping: [
    { severity: 1, en: "tC Case Management L3 / escalate to Executive Committee; recall decided or likely; authorities involved; safety risk with personal injury; field signs confirmed & out of control", zh: "tC 案例管理 L3 / 上达执行委员会；已决定或可能召回；官方机构介入；含人身伤害的安全风险；现场迹象已确认且失控" },
    { severity: 2, en: "tC Case Management L2 (confirmed, contained, no recall expected); major customer/business impact: line stop, stop shipment, certification risk, ≥ €0.5M, customer top-management escalation", zh: "tC 案例管理 L2（已确认、已遏制、不需召回）；重大客户/业务影响：停线、停止发货、认证风险、≥50万欧元、升级客户最高管理层" },
    { severity: 3, en: "Localized issue handled via standard process; e.g., full lot rejection, sorting, CSL, 100% inspection, mandatory 3rd-party inspection", zh: "局部问题、标准流程处理；如整批拒收、分选、CSL、100% 全检、强制第三方检验" },
    { severity: 4, en: "Single rare issue with limited impact, resolved via standard process, no customer/operational escalation", zh: "单一偶发、影响有限，标准流程解决，无客户/运营升级" }
  ],
  checklist: {
    groupNote: {
      en: "Check all that apply. Any S1 item → Severity 1. Otherwise, the highest matched level applies. If the checklist differs from the keyword suggestion, follow the stricter level.",
      zh: "勾选所有适用项。命中任一 S1 项 → 严重度 1。否则按命中的最高等级定级。若清单建议与关键词初判不一致，按更严重等级从严处理。"
    },
    groups: [
      {
        key: "s1",
        title: { en: "S1 red lines (any one → S1)", zh: "S1 红线（任一命中 → 严重度 1）" },
        color: "#dc2626",
        items: [
          { en: "Product safety risk: possible personal injury (accident, fire, injury)", zh: "产品安全风险：可能造成人身伤害（事故、起火、受伤）", ref: "P0207624 L3 / 工具 S1" },
          { en: "Recall decided or likely", zh: "已决定或可能决定发起召回", ref: "工具 S1 ①" },
          { en: "Authorities involved or statutory reporting obligation exists", zh: "官方机构介入，或存在法定报告义务", ref: "工具 S1 ④" },
          { en: "Field signs confirmed and product out of control (direct L3 condition)", zh: "现场迹象已确认且产品不受管控（直接 L3 条件）", ref: "P0207624 L1→L3" },
          { en: "CQTS severity 1 / PSCR escalation / SQM red alert triggered", zh: "已触发 CQTS 严重度 1 级 / PSCR 升级 / SQM 红色警报", ref: "P0207624 检测渠道" },
          { en: "Violation of legal technical regulations (obligation source A)", zh: "违反出口/进口国法律技术法规（义务来源 A）", ref: "P0207713 义务来源 A" }
        ]
      },
      {
        key: "s2",
        title: { en: "S2 signals", zh: "S2 信号" },
        color: "#ea580c",
        items: [
          { en: "Risk confirmed but no personal injury risk", zh: "风险已确认，但无人员伤害风险", ref: "P0207624 L2" },
          { en: "Major customer/business impact: line stop, stop shipment, certification risk, ≥ €0.5M", zh: "重大客户/业务影响：停线、停止发货、认证风险、≥50万欧元", ref: "工具 S2" },
          { en: "Escalation to customer top management / OEM escalation process", zh: "升级至客户最高管理层 / OEM 升级流程", ref: "工具 S2" },
          { en: "Repeated failures or complaints affecting multiple customers/locations", zh: "影响多个客户/地点的反复失效或投诉", ref: "工具 S2" }
        ]
      },
      {
        key: "s3",
        title: { en: "S3 signals", zh: "S3 信号" },
        color: "#ca8a04",
        items: [
          { en: "Full lot rejection, sorting, CSL, or 100% inspection required", zh: "整批拒收、分选、CSL 或 100% 全检", ref: "工具 S3" },
          { en: "Mandatory third-party inspection / significant production interference", zh: "强制第三方检验 / 严重影响生产产出", ref: "工具 S3" }
        ]
      },
      {
        key: "s4",
        title: { en: "S4 signals", zh: "S4 信号" },
        color: "#16a34a",
        items: [
          { en: "Single rare issue, limited impact, resolved via standard process", zh: "单一偶发、影响有限、标准流程解决", ref: "工具 S4" }
        ]
      }
    ],
    l2Downgrade: {
      title: { en: "L2 downgrade conditions (P0207624) — all three must be YES to stay below S1", zh: "L2 降级条件（P0207624）— 三条件全部为「是」才可低于 S1" },
      questions: [
        { key: "d1", en: "No product safety risk?", zh: "无产品安全风险？" },
        { key: "d2", en: "Recall not expected?", zh: "预计不需要召回？" },
        { key: "d3", en: "Containment/mitigation fully effective?", zh: "遏制/缓解措施完全有效？" }
      ]
    }
  }
};

/**
 * ============================================================================
 * Semantic enhancement data — expands keyword matching with automotive
 * synonyms and multi-word phrases, enabling "meaning-based" assessment that
 * does not rely purely on exact keywords. Update as field language evolves.
 *
 * synonyms[].term  : a canonical keyword already defined in SEVERITY_DATA
 *                    (matched by its EN or ZH form).
 * synonyms[].alts  : equivalent expressions (EN + ZH) treated as the same term.
 * phrases[]        : whole-phrase patterns that map directly to a severity.
 * ============================================================================
 */
const SEMANTIC = {
  synonyms: [
    { term: "brake failure", alts: ["brake malfunction", "braking failure", "loss of braking", "no braking", "brake pedal to the floor", "pedal to the floor", "brake pedal travel", "brake not working", "brakes not working", "brake ineffective", "brake fade", "braking performance", "braking distance", "stopping distance", "制动失效", "刹车失灵", "制动失灵", "无制动", "刹车无效", "制动性能", "刹车性能", "刹车距离", "制动距离", "制动踏板", "刹车踏板"] },
    { term: "sudden loss of power", alts: ["sudden power loss", "loss of power while driving", "engine shut down", "engine stall", "engine stops", "power cut while driving", "失去动力", "突然熄火", "发动机熄火", "动力中断", "动力丢失", "突然断电", "行驶中熄火"] },
    { term: "loss of control", alts: ["uncontrollable", "vehicle swerved", "swerving", "skidding", "lost control", "无法控制", "失控", "车辆跑偏", "打滑"] },
    { term: "accident", alts: ["crash", "collision", "traffic accident", "vehicle crash", "交通事故", "碰撞", "撞车", "车祸"] },
    { term: "fire", alts: ["burning", "smoke", "burned", "ignition", "起火", "冒烟", "燃烧", "着火"] },
    { term: "injury", alts: ["injured", "hurt", "personal injury", "casualty", "受伤", "人身伤害", "伤亡"] },
    { term: "recall", alts: ["campaign", "recall campaign", "rework campaign", "召回", "召回活动", "召回行动"] },
    { term: "production interruption", alts: ["line stop", "production stop", "line down", "assembly line stop", "生产中断", "停线", "停产", "产线停线", "产线停止"] },
    { term: "stop shipment", alts: ["shipment hold", "delivery stop", "dispatch stop", "停止发货", "停发货", "出货停止", "暂停出货"] },
    { term: "100% inspection", alts: ["100 percent inspection", "full inspection", "screening", "sorting", "全检", "100%全检", "筛选", "分选"] },
    { term: "containment action", alts: ["containment", "contain", "block stock", "quarantine", "围堵", "围堵措施", "隔离库存", "封存"] },
    { term: "full lot rejection", alts: ["lot rejection", "reject lot", "整批拒收", "批次拒收", "拒收整批"] },
    { term: "cyber security", alts: ["hacking", "hacked", "data breach", "remote attack", "unauthorized access", "网络安全", "黑客", "数据泄露", "远程攻击", "未授权访问"] },
    { term: "privacy", alts: ["personal data", "data privacy", "gdpr", "隐私", "个人数据", "数据隐私"] },
    { term: "field service action", alts: ["field action", "service action", "after-sales measure", "现场服务措施", "现场措施", "服务行动", "售后措施"] },
    { term: "reporting obligation", alts: ["report to authority", "must report", "statutory reporting", "报告义务", "法定报告", "须上报", "上报官方"] },
    { term: "authority", alts: ["regulator", "government agency", "authorities involved", "官方机构", "监管部门", "政府机构", "当局"] },
    { term: "top management", alts: ["executive board", "top executive", "plant manager escalated", "最高管理层", "高管", "总经理升级", "副总裁"] },
    { term: "financial impact", alts: ["cost impact", "monetary impact", "claim", "chargeback", "penalty", "fines", "财务影响", "费用影响", "索赔", "罚款", "扣款", "赔偿"] },
    { term: "downtime", alts: ["machine down", "equipment down", "line down", "停机", "设备停机", "产线停机"] },
    { term: "type-approval", alts: ["type approval", "homologation", "型式认证", "型式批准"] },
    { term: "EBD warning light", alts: ["red warning lamp", "brake warning light", "EBD 警告灯", "红色警告灯", "制动警告灯"] },
    { term: "ABS disabled", alts: ["abs fault", "abs warning", "abs light", "abs失效", "abs故障", "abs灯亮"] },
    { term: "AYC disabled", alts: ["ayc fault", "ayc失效", "ayc故障"] },
    { term: "ESC disabled", alts: ["esc fault", "esc warning", "esp fault", "esc失效", "esc故障", "esp故障"] },
    { term: "sudden loss of air pressure", alts: ["air pressure drop", "pressure loss", "air leak", "deflated", "deflation", "气压下降", "气压突然下降", "漏气", "泄压", "空气弹簧泄气"] },
    { term: "critical niveau", alts: ["critical level", "low ride height", "vehicle dropped", "vehicle sagging", "临界高度", "车身高低", "车辆下沉", "车辆趴下"] },
    { term: "intellectual property", alts: ["patent", "trademark", "copyright", "trade secret", "知识产权", "专利", "商标", "版权", "商业秘密"] },
    { term: "legal regulation", alts: ["law", "statute", "regulation", "regulatory requirement", "法律法规", "法律规定", "法规", "监管要求"] },
    { term: "international standard", alts: ["iso standard", "european regulation", "un regulation", "ece", "国际标准", "iso标准", "欧盟法规", "联合国法规"] },
    { term: "repeated failure", alts: ["recurring issue", "repeat complaint", "repeated complaint", "反复失效", "重复投诉", "反复投诉", "复发"] },
    { term: "multiple customers", alts: ["several customers", "more than one customer", "多个客户", "几家客户", "不止一个客户"] },
    { term: "controlled shipping level", alts: ["csl", "受控发运", "csl等级"] },
    { term: "third party inspection", alts: ["external inspection", "independent inspection", "第三方检验", "外部检验", "独立检验"] },
    { term: "unresolved complaint", alts: ["open complaint", "complaint not resolved", "未解决投诉", "投诉未解决", "投诉未关闭"] }
  ],
  phrases: [
    { severity: 1, en: "brake pedal goes to the floor", zh: "制动踏板踩到底", text: "pedal to the floor" },
    { severity: 1, en: "unexpected braking / vehicle suddenly stops", zh: "非预期制动 / 车辆突然急停", text: "unexpected braking" },
    { severity: 1, en: "air suspension collapse / vehicle dropped", zh: "空气悬架塌陷 / 车身下沉", text: "suspension collapsed" },
    { severity: 1, en: "vehicle cannot be driven", zh: "车辆无法行驶", text: "cannot be driven" },
    { severity: 1, en: "steering wheel locked while driving", zh: "行驶中方向盘锁死", text: "steering locked" },
    { severity: 1, en: "unexpected acceleration", zh: "非预期加速", text: "unexpected acceleration" },
    { severity: 1, en: "battery thermal runaway / fire", zh: "电池热失控 / 起火", text: "thermal runaway" },
    { severity: 1, en: "airbag deploys without a crash", zh: "无碰撞气囊展开", text: "airbag deployed" },
    { severity: 1, en: "vehicle self-ignition / spontaneous combustion", zh: "车辆自燃", text: "self ignition" },
    { severity: 2, en: "customer plant line stop caused by our part", zh: "因我方零件导致客户停线", text: "customer line stop" },
    { severity: 2, en: "customer demanded containment & 100% screening", zh: "客户要求围堵并 100% 筛选", text: "100% screening" },
    { severity: 3, en: "sorting at customer site", zh: "客户现场分选", text: "sorting at customer" }
  ]
};
