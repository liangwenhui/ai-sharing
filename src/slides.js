export const slides = [
  {
    id: 'hero',
    navLabel: '开场',
    variant: 'hero',
    eyebrow: 'TEAM AI SHARING / 2026',
    title: '从网页问答到研发协作',
    subtitle: 'AI 提效入门',
    summary: '今天不展开模型原理，也不追求工具全覆盖，主要结合前端、后端、QA 的日常工作聊聊 AI 协作方式。',
    metrics: [
      { value: '高频场景', label: '' },
      { value: '稳妥工作流', label: '' },
      { value: '边界与风险', label: '' }
    ]
  },
  {
    id: 'agenda',
    navLabel: '三件事',
    variant: 'grid',
    eyebrow: 'THREE QUESTIONS',
    title: '三个问题',
    summary: '我刚开始用AI协作的时候,有三个问题:',
    cards: [
      { title: 'AI 能帮什么', body: '更聚焦研发工作里的具体任务，少谈抽象能力。' },
      { title: '怎样用更稳', body: '把 AI 放进流程里配合，用起来会比让它自由发挥更稳。' },
      { title: '边界在哪里', body: '知道哪些地方要多做一步验证，决定了它是否真的好用。' }
    ]
  },
  {
    id: 'ladder',
    navLabel: '网页端到协作',
    variant: 'ladder',
    eyebrow: 'MATURITY LADDER',
    title: 'AI 在研发中的三个阶段',
    summary: '可以把它理解成从问答，到辅助，再到协作。能力越强，对可控性的要求也会更高。',
    levels: [
      {
        tag: '01',
        title: '网页端',
        body: '解释概念、快速问答、整理思路。',
        demo: {
          trigger: 'web-ai',
          title: 'Web AI Demo',
          prompt: '这段代码怎么优化？',
          code: [
            'function formatActiveUsers(users) {',
            '  const activeUsers = users.filter((user) => user.active === true);',
            '  const namedUsers = activeUsers.filter((user) => user.name && user.name.trim() !== "");',
            '  return namedUsers.map((user) => ({',
            '    id: user.id,',
            '    name: user.name.trim(),',
            '    email: user.email ? user.email.toLowerCase() : ""',
            '  }));',
            '}'
          ],
          responses: [
            {
              label: '问题分析',
              text: '这段代码做了两次 filter 再 map，数组被重复遍历，而且判空和格式化逻辑比较分散。'
            },
            {
              label: '优化建议',
              text: '可以把过滤、清洗和结果组装合并成一次遍历，减少中间数组，也更容易补充提前返回。'
            },
            {
              label: '参考改写',
              code: [
                'function formatActiveUsers(users) {',
                '  return users.reduce((result, user) => {',
                '    if (!user.active || !user.name?.trim()) return result;',
                '',
                '    result.push({',
                '      id: user.id,',
                '      name: user.name.trim(),',
                '      email: user.email?.toLowerCase() ?? ""',
                '    });',
                '',
                '    return result;',
                '  }, []);',
                '}'
              ]
            }
          ]
        }
      },
      { tag: '02', title: 'IDE', body: '局部补全、边看边改、降低微观修改成本。' },
      { tag: '03', title: 'CLI / Agent', body: '读项目、跑命令、看 diff、执行完整闭环。' }
    ]
  },
  {
    id: 'fit',
    navLabel: '适合先用',
    variant: 'columns',
    eyebrow: 'FIT TEST',
    title: '先从高频、低风险、可验证的任务开始',
    summary: '把 AI 当成副驾驶和放大器，通常会更顺手；最后拍板还是留给人。',
    columns: [
      {
        title: '适合先让 AI 参与',
        tone: 'good',
        items: ['读代码、解释逻辑、总结上下文', '文档 / 注释 / 测试样例初稿', '测试点、边界条件、排查路径枚举', '重构建议和方案比较']
      },
      {
        title: '更适合自己把关',
        tone: 'risk',
        items: ['最终验收', '高风险生产操作', '缺少上下文的大改动', '敏感信息的随意粘贴']
      }
    ]
  },
  {
    id: 'frontend',
    navLabel: '前端',
    variant: 'grid',
    eyebrow: 'FRONTEND',
    title: '前端和 AI 配合，通常先在执行层见效',
    summary: '更常见的价值是：更快给出初稿、解释陌生代码、拆分改动路径。',
    cards: [
      { title: '组件初稿', body: '根据需求描述给出页面结构、状态拆分、组件边界。' },
      { title: '代码阅读', body: '快速解释状态流转、样式冲突、接口字段语义。' },
      { title: '重构拆分', body: '先把大改拆成几步，再做 reviewable diff。' }
    ]
  },
  {
    id: 'backend',
    navLabel: '后端',
    variant: 'grid',
    eyebrow: 'BACKEND',
    title: '后端里，AI 很适合帮你压缩理解成本',
    summary: '尤其是在读陌生模块、梳理调用链、组织复杂改动方案的时候。',
    cards: [
      { title: '调用链理解', body: '快速定位 handler、service、repository 之间的职责和边界。' },
      { title: '单测草案', body: '根据逻辑先列应该覆盖的输入、分支和失败路径。' },
      { title: '排查辅助', body: '结合日志、错误栈、请求链路给出更有结构的排障入口。' }
    ]
  },
  {
    id: 'qa',
    navLabel: 'QA',
    variant: 'grid',
    eyebrow: 'QA',
    title: 'QA 和 AI 配合，重点是把验证视角铺开',
    summary: '它更适合帮你更快展开测试视角、组织验证清单、补全回归路径。',
    cards: [
      { title: '测试点枚举', body: '从需求文档快速拉出正常流、异常流、边界流。' },
      { title: '复现路径整理', body: '根据 bug 描述补全操作步骤、前置条件和影响范围。' },
      { title: '回归 checklist', body: '把分散的验证点整理成可执行的回归清单。' }
    ]
  },
  {
    id: 'prompting',
    navLabel: '提需求',
    variant: 'quote',
    eyebrow: 'PROMPT SHAPE',
    title: '提问方式，决定输出质量',
    summary: '这四句不算复杂 prompt，更像一个顺手的最小闭环。',
    checklist: [
      '先分析需求，只输出方案，不要开始实施',
      '确认后再开始修改',
      '修改后给我看 diff',
      '最后跑测试 / 构建 / lint'
    ]
  },
  {
    id: 'demo',
    navLabel: '闭环 demo',
    variant: 'demo',
    eyebrow: 'WORKFLOW DEMO',
    title: '一个更稳的协作闭环',
    summary: '先分析，再执行，再看 diff，最后验证。复杂任务先把方案聊清楚，再让 AI 动手会更稳。',
    steps: ['先分析方案', '确认后开始修改', '看 diff', '测试/构建/lint'],
    terminal: [
      { tone: 'prompt', text: '> 先分析需求，只输出方案，不要开始实施。' },
      { tone: 'output', text: 'Plan: 识别改动文件、风险点、验证路径。' },
      { tone: 'prompt', text: '> 方案可以，开始修改，修改后给我看 diff。' },
      { tone: 'output', text: 'Diff ready: 2 files changed, 1 test added, 0 unrelated edits.' },
      { tone: 'meta', text: 'Verify: npm test && npm run build' }
    ]
  },
  {
    id: 'pitfalls',
    navLabel: '常见坑',
    variant: 'risk',
    eyebrow: 'RISK SURFACE',
    title: 'AI 很能帮忙，但这几类问题确实很常见',
    summary: '真正需要留意的，不只是 AI 会犯错，而是我们在顺手之后容易少做验证。',
    risks: [
      '幻觉：回答看起来很完整，实际可能不对',
      '偏航：多轮对话后慢慢偏离原本目标',
      '假完成：命令失败了，也可能继续往下说',
      '上下文漂移：任务一复杂，改着改着就散了',
      '盲信结果：这是最需要警惕的一点'
    ]
  },
  {
    id: 'team',
    navLabel: '团队起步',
    variant: 'grid',
    eyebrow: 'TEAM STARTER KIT',
    title: '团队起步时，先把基本动作跑顺更重要',
    summary: '先把最小闭环统一起来，通常会比一开始追求 MCP、多 Agent 更实用。',
    cards: [
      { title: '一个主工具', body: '先让大家共用一种主路径，比每个人各自摸索更容易沉淀经验。' },
      { title: '一个工作流', body: '先统一 plan -> diff -> verify，再慢慢加更复杂的自动化。' },
      { title: '一个说明文件', body: '把怎么运行、怎么验证、哪些地方要注意写进协作说明。' }
    ]
  },
  {
    id: 'summary',
    navLabel: '立即开始',
    variant: 'summary',
    eyebrow: 'TAKEAWAYS',
    title: '今天希望大家先带走这三句话',
    summary: '先开始，再慢慢收敛。先把顺手的用法跑起来，比追求最复杂的玩法更重要。',
    takeaways: ['先从高频、小任务、可验证的场景开始', '复杂任务先 plan，再让 AI 开始改', 'AI 是协作者，最终验收还是要靠人'],
    resources: [
      {
        label: 'Getting Started With Vibe Coding',
        href: 'https://shopline.atlassian.net/wiki/spaces/EN/pages/4884037704/Getting+Started+With+Vibe+Coding'
      }
    ]
  }
];
