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
      { value: '能帮什么', label: '高频场景' },
      { value: '怎样更稳', label: '工作流' },
      { value: '边界在哪', label: '风险与验收' }
    ]
  },
  {
    id: 'agenda',
    navLabel: '三件事',
    variant: 'grid',
    eyebrow: 'THREE QUESTIONS',
    title: '三个问题',
    summary: '我刚开始用 AI 协作的时候，有三个问题：',
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
    id: 'agent-collab',
    navLabel: '协作方式',
    variant: 'grid',
    eyebrow: 'AGENT COLLABORATION',
    title: '和 Agent 高效协作：三个动作',
    summary: '把任务说清楚，按 plan -> diff -> verify 跑闭环，再围绕主线逐轮补差。',
    cards: [
      {
        title: '保留主线，逐轮补差',
        body: '先让 Agent 给出当前最优版本，再明确指出“距离理想结果还差什么”。每轮只补一个残差，比整段推倒重来更快。',
        guide: {
          trigger: 'agent-residual-connection',
          ariaLabel: '查看 保留主线，逐轮补差 的图解说明',
          linkLabel: '点击查看图解',
          modalTitle: '保留主线，逐轮补差：从残差连接到 Agent 协作',
          sections: [
            {
              title: '深度学习中的残差连接',
              body: '每个残差块会保留当前输入，并让堆叠层学习一个修正量 F(x)，所以块输出常写成 y = x + F(x)。连续堆叠时，下一块会在上一块输出基础上继续补修正，而不是从零重写全部表示。',
              diagram: {
                type: 'residual-connection',
                blocks: [
                  {
                    title: '残差块 1',
                    inputLabel: '输入 x',
                    shortcutLabel: '保留路径 x',
                    residualLabel: '残差分支 F1(x)',
                    outputLabel: '输出 y = x + F1(x)'
                  },
                  {
                    title: '残差块 2',
                    inputLabel: '输入 y',
                    shortcutLabel: '保留路径 y',
                    residualLabel: '残差分支 F2(y)',
                    outputLabel: '输出 y2 = y + F2(y)'
                  }
                ],
                note: '没有残差连接时，网络更依赖层层重写表示，原始信息更难保留，深层训练时梯度也更容易变弱。'
              }
            },
            {
              title: 'Agent 协作中的类比操作',
              body: '和 Agent 协作时，也不要每轮都推倒重来。更稳的做法是先保留已经确认正确的主线，再只指出这轮还差什么。',
              items: [
                '先明确哪些结论、约束、方向已经对了，不要让模型全部重算。',
                '把本轮要补的差值说清楚：少了什么、错了什么、下一步要补什么。',
                '如果上下文已经变脏，就先由人提炼主线，再用新的任务描述重新启动推理。',
                '目标不是让 Agent 每轮都更会猜，而是让它围绕主线持续收敛。'
              ]
            },
            {
              title: '推荐提问方式',
              body: '把需求拆成“分析方案 -> 落实现步骤 -> 回到代码复核 -> 分批执行”四段，会比一口气让 Agent 全做完更稳。',
              prompts: [
                {
                  label: '1. 需求分析与最小方案',
                  text: '这是我的需求：xxxx，涉及 shop API。请你分析需求，基于现有代码，设计出最小改动的实现方案。'
                },
                {
                  label: '2. 从方案到实现步骤',
                  text: '这是需求 xxxx，方案是 A。请你列出具体的实现步骤 B，以及对应的代码位置。'
                },
                {
                  label: '3. 回到代码确认可行性',
                  text: '这是需求 xxxx，实现步骤 B。请你基于当前代码，确认这些实现步骤是否可行，并指出风险点。'
                },
                {
                  label: '4. 分批执行步骤',
                  text: '请按步骤 B 分批执行。每完成一批，都说明改了哪些文件、为什么这样改、还剩哪些步骤。'
                }
              ]
            }
          ]
        }
      },
      {
        title: '结构化输入',
        body: '把问题拆成：目标、上下文、约束、输出格式、验收标准。输入越像任务合同，输出越稳定。',
        guide: {
          trigger: 'agent-structured-input',
          ariaLabel: '查看 结构化输入 的详细说明',
          linkLabel: '点击查看详解',
          modalTitle: '结构化输入：把任务说成可执行合同',
          sections: [
            {
              title: '什么叫结构化输入',
              body: '不是把问题说得更长，而是把任务拆成清晰字段，让 Agent 明白目标、上下文、约束、输出格式和验收标准。这样它不是在猜你的意图，而是在执行一份更明确的任务合同。'
            },
            {
              title: '为什么这样更稳',
              items: [
                '少猜：先说清目标和上下文，模型不容易自己脑补需求。',
                '少偏：先写约束，能减少“改着改着跑远了”。',
                '好检查：提前定义输出格式和验收标准，结果更容易 review。',
                '好复用：同一个模板可以套到很多研发任务里。'
              ]
            },
            {
              title: '模糊提问 vs 结构化提问',
              body: '同样是让 Agent 帮忙，输入结构不同，输出稳定性会差很多。',
              prompts: [
                {
                  label: '模糊提问',
                  text: '帮我改一下 shop 接口。'
                },
                {
                  label: '结构化提问',
                  text: '这是我的任务：为 shop 订单查询接口增加按 userId 过滤能力。\n\n目标：\n在现有接口上支持按 userId 查询订单。\n\n上下文：\n项目已经有 order service，接口通过 shop API 暴露。\n请基于当前代码分析，不要脱离现有实现猜新架构。\n\n约束：\n最小改动；\n不要改数据库结构；\n保持旧接口兼容；\n如果有风险点，请明确指出。\n\n输出格式：\n1. 先分析需求\n2. 给出最小改动实现方案\n3. 列出涉及的代码位置\n4. 标出风险点和待确认项\n\n验收标准：\n接口支持按 userId 过滤；\n旧调用方式不受影响；\n改动范围清晰，可分步实施。'
                }
              ]
            },
            {
              title: '推荐提问模板',
              body: '这份模板可以直接套到需求分析、代码修改、测试设计和 review 任务里。',
              prompts: [
                {
                  label: '可复用模板',
                  text: '这是我的任务：____\n\n目标：\n____\n\n上下文：\n____\n\n约束：\n____\n\n输出格式：\n____\n\n验收标准：\n____\n\n请先基于当前代码分析，再给出最小改动方案。'
                }
              ]
            }
          ]
        }
      },
      {
        title: '迭代循环',
        body: '更有效的方式不是让 AI 一次做完，而是“人先给初稿或方向，AI 放大优化，人再筛选修正，AI 继续迭代”，并在每轮都看 diff 和验证结果。',
        guide: {
          trigger: 'agent-iteration-loop',
          ariaLabel: '查看 迭代循环 的详细说明',
          linkLabel: '点击查看详解',
          modalTitle: '迭代循环：人和 AI 如何多轮收敛',
          sections: [
            {
              title: '什么叫迭代循环',
              body: '不是一次提问拿最终答案，而是让人和 AI 轮流推进：人定方向，AI 扩展，人做判断，AI 再继续优化。重点不是让 AI 一轮做完，而是让结果在多轮里持续收敛。'
            },
            {
              title: '为什么这样更有效',
              items: [
                '人负责方向、边界和判断，不把最终拍板外包给模型。',
                'AI 负责扩展、补全和发散，降低从 0 到 1 的成本。',
                '人每轮都可以筛掉不合适的部分，避免错误一路滚大。',
                '多轮下来，通常比单轮硬做到底更容易收敛到可用结果。'
              ]
            },
            {
              title: '一个典型循环',
              items: [
                '我先给一个初稿 / 想法 / 草案。',
                'AI 帮我补全、优化、展开。',
                '我筛掉不合适的部分，补充新约束或新判断。',
                'AI 基于新版本继续优化。',
                '重复几轮，直到结果满足目标。'
              ]
            },
            {
              title: '推荐提问方式',
              body: '重点是明确告诉 Agent：保留哪些、强化哪些、删掉哪些，再在这个基础上继续下一轮。',
              prompts: [
                {
                  label: '1. 基于初稿优化',
                  text: '这是我现在的初稿，请先不要推倒重来，在这个基础上优化。'
                },
                {
                  label: '2. 保留主线，局部增强',
                  text: '保留这些部分不变：____；重点帮我加强：____。'
                },
                {
                  label: '3. 人先筛选，再继续迭代',
                  text: '我已经筛掉了这些方向，请基于剩下的版本继续优化。'
                },
                {
                  label: '4. 明确下一轮目标',
                  text: '这是第 2 轮结果，请继续迭代，目标是更清晰 / 更完整 / 更适合落地。'
                }
              ]
            }
          ]
        }
      }
    ]
  },
  {
    id: 'backend',
    navLabel: '场景分享',
    variant: 'grid',
    eyebrow: 'SCENARIO SHARING',
    title: '场景分享',
    summary: '共同点不是“AI 替你做完”，而是更快形成第一版判断、方案和清单。',
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
          story: {
            tag: '排查样本',
            imageSrc: '/temp.png',
            imageAlt: 'temp.json 排查过程截图'
          },
          howToAsk: '把报错现象、最近变更和关键日志一起给 AI，要求它先做“可能原因排序”，再给最小验证步骤. 比如： xx方法出现NPE，排查一下哪一行可能会出现。 xx方法没有返回某字段，有开xxx feature key，排查一下',
          example: [
            '> 根据 temp.json 排查问题',
            '',
            '• 我会先基于 temp.json 收集错误线索，复现或定位触发路径，再给出明确的根因和修复建议。先快速读取该文件和相关调用代码。',
            '',
            '• Explored',
            '  └ Read temp.json',
            '    Search temp\\.json|traceId|http.status_code|exception in project',
            '',
            '────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────',
            '',
            '• temp.json 当前看起来是独立日志样本，代码里没有直接引用它。我会从日志本身提取错误事件、状态码和调用链，先还原一次请求链路再定位根因。',
            '',
            '• Ran jq -r \'.. | objects | select(has("events")) | .events[]? | [.name, (.attributes[]? | select(.key=="exception.message") | .value.stringValue)] | @tsv\' public/temp.json',
            '  └ exception    ApiProductSearch failed',
            '',
            '• Ran jq -r \'.. | objects | select(has("attributes")) | .attributes[]? | select(.key=="http.status_code") | .value.intValue\' public/temp.json | sort | uniq -c',
            '  └    6 200',
            '     2 302',
            '',
            '• Ran jq -r \'.batches[] | (.resource.attributes // []) as $attrs | ($attrs[]? | select(.key=="service.name") | .value.stringValue) as $svc | (.instrumentationLibrarySpans[]?.spans[]? | [$svc, .name, (.status.code|tostring)] | @tsv)\' public/temp.json',
            '  └ openresty                                 ^/.../(products|categories|pages|promotions)    0',
            '    shop.shoplineapp.com (Production)         ProductsController#index                         0',
            '    product-core-service-prod                  sl_tracerid_mw                                   2',
            '    api.shoplineapp.com (Production)           V1::LinkRedirectionsController#index             0',
            '',
            '────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────',
            '',
            '• 已定位核心异常：product-core-service-prod 里 `ApiProductSearch failed`，且同 trace 内 HTTP 只有 200/302，没有 5xx。',
            '',
            '• Ran node -e "...timestamp..."',
            '  └ 2026-03-20T01:20:37.150Z',
            '',
            '• 根因判断：请求参数 `sort_by=%27`（单引号）触发搜索失败，系统随后走了 link_redirections 的降级/重定向链路，所以外部表现是 302 而非服务不可用。',
            '',
            '• 建议：',
            '  1) 对 sort_by 做白名单校验（非法值忽略或 400）；',
            '  2) 参数非法类错误降级日志级别，减少误报警；',
            '  3) 固定用 traceId 回查业务日志，补齐失败字段与校验规则。'
          ].join('\n')
        }
      },
      {
        title: 'Code Review',
        body: '让 AI 先做一轮结构化审查，帮你更快聚焦高风险改动点。',
        guide: {
          trigger: 'backend-code-review',
          theme: 'codex-cli',
          alwaysScrollExample: true,
          howToAsk: '把 PR 链接和“根据 PR 描述 CR 一下”的目标直接给 AI，要求它结合描述与 diff 输出按严重级别排序的 findings、开放问题和 merge 建议。',
          example: [
            '> https://bitbucket.org/starlinglabs/product-core-service/pull-requests/1939 根据PR描述 CR一下',
            '',
            '• 我会按 bitbucket-pr-reviewer 技能流程来做这次 CR：先读取技能说明并拉取 PR product-core-service#1939 的描述和 diff，再基于 PR 描述做逐项风险审查并给出可执行的 review 结论。',
            '',
            '• 已拉取完整 patch（共 309 行），重点核对 ConvertSkuPriceTiers 和 handleUpdateProductPriceTier 的行为变化，检查是否引入数据回写丢失、等级集合不完整和 SamePrice 场景回归。',
            '',
            '• CR 结论：',
            '  1. High：default sku 和 DB 都没有 tier 时会直接 return nil, nil，导致“其他 sku 里带了 tier 也不处理”。这与“从所有 SKU 收集会员等级继续处理”的目标冲突。',
            '     文件参考：product_base_biz.new.go:1040, product_base_biz.new.go:1043',
            '  2. Medium：创建流程里的会员等级顺序变为非确定性（map + lo.Keys），ConvertSkuPriceTiers 落库顺序可能在不同请求间抖动。',
            '     文件参考：product_base_biz.new.go:560, product_base_biz.new.go:575, product_base_biz.new.go:702',
            '  3. Medium：核心逻辑改动缺少可回归单测。新增的是本地 RPC 脚本式测试（硬编码 host/数据、无断言），无法有效兜底。',
            '     文件参考：product_test.new.go:688, product_test.new.go:707',
            '',
            '• 开放问题：',
            '  1. PR 描述写“MemberPrice == nil 时置 0”，但 create 路径仍保留 nil（不赋值），描述与实现不一致，建议明确 nil 与 0 的语义。',
            '     文件参考：product_base_biz.new.go:705',
            '',
            '• 当前建议：Request changes，先修第 1 条，再补最小单测覆盖后再合入。'
          ].join('\n')
        }
      },
      {
        title: '设计实现方案',
        body: '先把实现方案拆清楚再动手，避免直接写代码导致反复返工。',
        guide: {
          trigger: 'backend-design-plan',
          alwaysScrollExample: true,
          howToAsk: '给出 Jira 链接和明确目标（分析需求 + 最小改动方案 + 改动步骤），要求先做边界收敛再给可执行清单；如果步骤有歧义，先修订后再落评论。',
          example: [
            '> https://shopline.atlassian.net/browse/PDRV-1679 分析需求，设计最小改动实现方案，列出改动步骤',
            '',
            '• 我会直接拉取 PDRV-1679 工单详情，先提炼需求和边界，再给你最小改动实现方案与可执行步骤清单。',
            '• 我正在从工单字段提取与销量排序相关的信息，避免漏掉验收口径。',
            '• 字段名已确认：核心内容在 Dev Remarks (customfield_14994)。',
            '',
            '• 使用 jira-issue-reader 读取后，需求结论如下：',
            '  1) PLP 商品搜索“销量排序”支持新字段；',
            '  2) feature key = pdp_product_sold_count 开启时，quantity_sold -> quantity_sold_total；',
            '  3) key 关闭时保持 quantity_sold；',
            '  4) quantity_sold_total 由搜索中台计算，product-core-service 仅做排序字段映射。',
            '',
            '• 最小改动方案：只改排序映射层，不改接口入参协议、不改返回结构、不改数据写入逻辑。',
            '',
            '• 改动步骤：',
            '  1) 在 search_field.go 新增 quantity_sold_total 常量，保留 quantity_sold；',
            '  2) 在 search.go 增加销量排序字段选择 helper（按 merchant feature key 判断）；',
            '  3) 在 AnalyzeSort / AnalyzeSorts 统一应用 helper；',
            '  4) key on 时将所有来源的 quantity_sold 转为 quantity_sold_total：',
            '     - sort_by=quantity_sold',
            '     - sorts=quantity_sold:asc|desc',
            '     - 分类配置 sortSetting=quantity_sold:asc|desc',
            '     key off 时全部保持 quantity_sold；',
            '  5) 增加 on/off 单测，覆盖 sort_by 与 sorts+sortSetting 两条路径；',
            '  6) 回归执行 product_search_test 和搜索相关测试集；',
            '  7) 灰度比对 feature on/off 商家下发给搜索中台的 sort 字符串。',
            '',
            '> 我认为4需要调整，key on需要将quantity_sold转变',
            '• 已修订步骤 4，并将修订版作为 Jira 评论发布到 PDRV-1679。'
          ].join('\n')
        }
      },
      {
        title: '方案落地',
        body: '方案确认后，把实施步骤、改动边界和验证路径一次性拉齐。',
        guide: {
          trigger: 'backend-rollout',
          howToAsk: '给 AI 明确“已确认方案”，要求它按落地顺序输出任务拆分、文件改动范围、灰度发布和验证命令，确保可以直接执行。',
          example: [
            '> 方案已确认，开始落地。请按可执行清单输出：',
            '> 1) 实施步骤（按顺序）',
            '> 2) 每步涉及文件与模块',
            '> 3) 预期 diff 范围',
            '> 4) 测试与构建命令',
            '> 5) 灰度发布检查点与回滚动作',
            '> 先给计划，等我确认后再开始改代码。'
          ].join('\n')
        }
      },
      { title: '组件初稿', body: '根据需求描述先给出页面结构、状态拆分和组件边界，再自己收口。' },
      { title: '代码阅读与重构拆分', body: '快速解释状态流转、样式冲突、接口字段语义，并把大改拆成 reviewable diff。' },
      { title: '测试点与回归清单', body: '从需求、bug 和接口定义里更快拉出测试点、复现路径和回归 checklist。' }
    ]
  },
  {
    id: 'pitfalls',
    navLabel: '常见坑',
    variant: 'risk',
    eyebrow: 'RISK SURFACE',
    title: '天才程序员陨落',
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
    title: '刚开始，先把基本动作跑顺更重要',
    summary: '先把最小闭环统一起来，通常会比一开始追求 MCP、多 Agent 更实用。',
    cards: [
      { title: '常用工具', body: '把团队里常用的路径讲清楚：Claude Code / Codex / OpenCode / OpenClaw / IDE 插件。重点不是全都精通，而是先知道自己从哪条路径开始。' },
      { title: '一个工作流', body: '先统一 plan -> diff -> verify，再慢慢加更复杂的自动化。' },
      {
        title: '一个说明文件',
        body: '把怎么运行、怎么验证、哪些地方要注意写进协作说明。',
        guide: {
          trigger: 'team-starter-readme',
          title: '项目说明文件',
          markdown: [
            '# AGENTS.md / Project Memory 示例',
            '',
            '## 基本动作',
            '- 启动：`npm install`、`npm run dev`',
            '- 验证：`npm test`、`npm run build`',
            '',
            '## 哪些命令别直接跑',
            '- 不要直接执行高风险生产命令',
            '- 不要跳过 diff 和验证就宣称完成',
            '- 不要在没确认前做大范围删除、重置或覆盖',
            '',
            '## 哪些事情必须人工确认',
            '- 最终验收',
            '- 高风险操作',
            '- 涉及敏感信息、数据写入、发布动作的步骤',
            '',
            '## 为什么我的 Agent 会更懂我',
            '- 除了规则，还要给它项目上下文和链路信息',
            '- 这样它读代码、推断调用关系和收敛方案会更快',
            '',
            '# Project Memory Index',
            '',
            '- Source root: `/Users/SL_1/workspaces/projects`',
            '- Memory root: `/Users/SL_1/.agents/projects`',
            '- Generated: 2026-03-20',
            '',
            '## Repositories',
            '- `agent-service` - gRPC microservice for response data field verification.',
            '- `api.shoplineapp.com` - Main API service that supports most Shopline projects.',
            '- `data-migrate` - Data migration parent project with migrate-core and diff modules.',
            '- `open-api` - Shopline Open API project.',
            '- `open-api-node` - Developer-facing Open API backend with Swagger generation.',
            '- `product-core-service` - Product-domain microservice for business logic.',
            '- `product-dao` - Product database DDL and generation repo.',
            '- `product-helper` - Shared helper library for the product domain.',
            '- `product-import-review-service` - Product import review service.',
            '- `product-infra` - Shared infrastructure/support repo for the product domain.',
            '- `product-service-sdk` - SDK for calling product-core-service and agent-service.',
            '- `promotion-core-service` - Promotion-domain core service.',
            '- `qa-load-test` - Performance testing repository.',
            '- `search.shoplineapp.com` - Search service for Shopline projects.',
            '- `shop.shoplineapp.com` - Storefront rendering application.',
            '- `shopline-comment` - Bulk product import UI for SHOPLINE Admin.',
            '- `shopline-web` - Legacy admin panel application.',
            '- `sl-feature` - Feature-flag SDK and centralized feature dataset.',
            '- `sl-job-api` - Job API service.',
            '- `sl-product-review` - Product review service.',
            '- `sl-skills` - Cross-agent skill repository for Codex, Claude Code, OpenCode, and OpenClaw.',
            '- `sr_script` - Argo Workflows Cronjob script repository.',
            '- `superpowers` - Workflow framework for coding agents.',
            '',
            '## 链路',
            'single read',
            '',
            'shop -> product-service-sdk -> product-core-service -> promotion-core-service',
            '',
            'single write ',
            '',
            'admin -> product-service-sdk -> product-core-service',
            '',
            'double write ',
            '',
            'admin -> api -> product-service-sdk -> product-core-service'
          ].join('\n')
        }
      }
    ]
  },
  {
    id: 'summary',
    navLabel: '立即开始',
    variant: 'summary',
    eyebrow: 'TAKEAWAYS',
    title: '马上冻手',
    summary: '先开始，再慢慢收敛。先把顺手的用法跑起来，比追求最复杂的玩法更重要。',
    takeaways: ['先从高频、小任务、可验证的场景开始', '复杂任务先 plan，再让 AI 开始改', 'AI 是协作者，最终验收还是要靠人'],
    resources: [
      {
        label: 'Getting Started With Vibe Coding',
        href: 'https://shopline.atlassian.net/wiki/spaces/EN/pages/4884037704/Getting+Started+With+Vibe+Coding'
      }
    ]
  },
  {
    id: 'qna',
    navLabel: 'Q & A',
    variant: 'quote',
    eyebrow: 'Q & A',
    title: 'Q & A',
    summary: '欢迎提问：可以是今天内容，也可以是你们团队在 AI 协作里的实际问题。',
    image: {
      src: '/banana.jpg',
      alt: 'Q&A banana'
    },
    notebook: {
      title: 'Q & A Notepad',
      hint: '随时记录参会人员的 Q 和 A，结束后可直接整理成会后纪要。'
    }
  }
];

// Keep the presentation flow scenario-first, then explain collaboration methods,
// and fold the former standalone pitfalls slide into the collaboration section.
const agentCollabIndex = slides.findIndex((slide) => slide.id === 'agent-collab');
const pitfallsIndex = slides.findIndex((slide) => slide.id === 'pitfalls');

if (agentCollabIndex !== -1 && pitfallsIndex !== -1) {
  slides[agentCollabIndex].risks = slides[pitfallsIndex].risks;
  slides.splice(pitfallsIndex, 1);
}

const nextAgentCollabIndex = slides.findIndex((slide) => slide.id === 'agent-collab');
const nextBackendIndex = slides.findIndex((slide) => slide.id === 'backend');

if (
  nextAgentCollabIndex !== -1 &&
  nextBackendIndex !== -1 &&
  nextBackendIndex > nextAgentCollabIndex
) {
  const [backendSlide] = slides.splice(nextBackendIndex, 1);
  slides.splice(nextAgentCollabIndex, 0, backendSlide);
}
