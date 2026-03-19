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
      { tag: '02', title: 'IDE 插件', body: '局部补全、边看边改、降低微观修改成本。' },
      {
        tag: '03',
        title: 'CLI / Agent',
        body: '读项目、跑命令、看 diff、执行完整闭环。',
        demo: {
          trigger: 'codex-live-terminal',
          mode: 'live-terminal',
          title: 'Live Codex Demo',
          summary: '真实 shell 已连接到当前仓库目录，现场可以直接输入命令并启动 Codex。',
          badge: 'LOCAL SHELL',
          label: 'Live Codex Demo',
          ariaLabel: '打开 Codex 实时终端演示',
          cwdLabel: 'Working directory: current repository'
        }
      }
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
      {
        title: '调用链理解',
        body: '快速定位 handler、service、repository 之间的职责和边界。',
        guide: {
          trigger: 'backend-call-chain',
          theme: 'codex-cli',
          story: {
            tag: '现身说法',
            imageSrc: '/jaker.png',
            imageAlt: 'Jaker Lu(QA) 的微信提问截图'
          },
          howToAsk: '直接给出服务名 + 接口名 + 你想确认的具体字段，然后要求 AI 输出“定位过程 + 调用链 + 最终结论 + 文件行号”。',
          example: [
            '> product core service GetProductV1接口中，flashPrice的缓存时间是多少',
            '',
            '• 我会先按技能规则读取 using-superpowers 的 SKILL.md，然后在代码里定位 GetProductV1 和 flashPrice 的缓存配置，确认准确时长后直接给你结论。',
            '',
            '• Explored',
            '  └ Read SKILL.md',
            '',
            '────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────',
            '',
            '• 我已加载 using-superpowers。下一步我会全局搜索 GetProductV1 和 flashPrice，定位具体缓存逻辑与 TTL 配置。',
            '',
            '• Explored',
            '  └ Search flashPrice|flash_price|FlashPrice in projects',
            '    Search GetProductV1 in projects',
            '',
            '────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────',
            '',
            '• 已定位到 product-core-service 的 GetProductV1 实现文件。现在我会只在这个服务内查 flashPrice 的缓存 key/TTL，避免被其他项目干扰。',
            '',
            '• Explored',
            '  └ Search cache|ttl|expire|expiration|redis in service',
            '    Search flashPrice|flash_price|FlashPrice in product-core-service',
            '',
            '────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────',
            '',
            '• 已经找到 GetProductV1 -> getPromotionFlashPrice -> GetFlashPricesCache 这条链路。接下来我读取 promotion_client 和常量定义，确认 flashPrice 的过期时间。',
            '',
            '• Explored',
            '  └ Search GetFlashPricesCache|FlashPrice.*Cache|FormatProductFlashPriceCacheKey|flash.*cache in promotionclient',
            '    Read promotion_client.go',
            '',
            '────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────',
            '',
            '• 我已在 promotion_client 里看到 FetchBatch2(..., 30*time.Second, ...)。我再快速确认 GetProductV1 走的确实是这条调用链，避免答错接口版本。',
            '',
            '• Explored',
            '  └ Read price_biz.go, combine_service.go, promotion_client.go',
            '',
            '────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────',
            '',
            '• GetProductV1 这条链路里，flashPrice 的缓存时间是 30 秒。',
            '',
            '  关键代码在：',
            '  /Users/SL_1/workspaces/projects/product-core-service/internal/client/promotionclient/promotion_client.go:237',
            '',
            '  调用链确认：',
            '  /Users/SL_1/workspaces/projects/product-core-service/internal/service/combine_service.go:689 → /Users/SL_1/workspaces/projects/product-core-service/internal/biz/price_biz.go:47 → /Users/SL_1/workspaces/projects/product-core-service/internal/biz/price_biz.go:1249 → FetchBatch2(..., 30*time.Second, ...)。'
          ].join('\n')
        }
      },
      {
        title: '单测草案',
        body: '根据逻辑先列应该覆盖的输入、分支和失败路径。',
        guide: {
          trigger: 'backend-test-draft',
          howToAsk: '先给函数职责和边界条件，再要求 AI 按正常流/异常流/边界流输出测试清单，并标明每个 case 的断言重点。',
          example: '下面是 createPaymentIntent(service) 的实现。请先输出测试矩阵（正常流、参数缺失、第三方超时、重复请求），再给出 node:test 风格的测试样例骨架，包含 mock 位置与关键断言。'
        }
      },
      {
        title: '排查辅助',
        body: '结合日志、错误栈、请求链路给出更有结构的排障入口。',
        guide: {
          trigger: 'backend-debug-assist',
          howToAsk: '把报错现象、最近变更和关键日志一起给 AI，要求它先做“可能原因排序”，再给最小验证步骤，避免直接大改。',
          example: '线上偶发 502，错误栈指向 inventory reserve 接口，近两天改过 Redis 锁逻辑。请基于附带日志，按“最可能 -> 次可能”列出原因，并给每个原因对应的最小验证命令或排查步骤。'
        }
      }
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
