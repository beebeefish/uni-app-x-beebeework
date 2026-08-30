export const mockTopicDetails = {
    // -------------------------------------------------------------------------
    // 1. ID: 201 - 长文 + 多图 + 复杂 Addons 混合排版测试
    // -------------------------------------------------------------------------
    201: {
        id: 201,
        date: '2026-06-01T12:00:00',
        cover: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&h=500&fit=crop',
        type: 'beebee_topic',
        title: { rendered: '比比工房 2026 春季修仙指南 / 与积分攻略' },
        tag: [{ name: '释放创意' }, { name: '热门精选' }],
        color: '#ffffff',
        followdark: false,
        excerpt: { rendered: '<p>修仙路上必备的积分与福利指南</p>' },
        author: 1,
        meta: {
            views: 998,
            likes: 66
        },
        // 核心：内页新增的长文 content 字段（包含 HTML 标签、多段落与插图）
        content: {
            rendered: `
                <p>这是一条用于前端开发调试的本地模拟话题内容，段位直接拉满！在本次春季修仙指南中，我们为你深度解析了如何高效获取积分、解锁各类高级源码与周边福利。</p>
                <h3>一、 什么是真正的“全栈修仙”？</h3>
                <p>工欲善其事，必先利其器。无论你是身经百战的资深架构师，还是刚入行的前端小白，在这个万物皆可卷的时代，拥有一套高效的工具箱是拉开与他人差距的关键。</p>
                <p>通过每日签到、参与社区问答、提交高质量源码，你的账号将从“练气期”一路飞升至“大乘期”。每一个阶段都能解锁专属的社区特权与定制实物周边。</p>
                <figure>
                    <img src="https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&h=500&fit=crop" alt="代码与灵感交织" />
                    <figcaption>图 1：代码与灵感交织的极客世界</figcaption>
                </figure>
                <h3>二、 积分获取与消耗指南</h3>
                <p>1. <strong>签到机制</strong>：连续签到 7 天可触发暴击奖励，随机获得 50~200 不等的灵石积分。<br>2. <strong>内容贡献</strong>：发布优质的源码、小说或独立游戏心得，一经采纳即可获得高额推荐曝光。</p>
                <p>快来看看下方我们为你精心挑选的扩展神器与好物推荐，开启你的极客修仙之旅吧！</p>
            `
        },
        acf: {
            frame: 'move-addon',
            addons: {
                sharp: 'square',
                items: [
                    {
                        type: 'beebee_source',
                        title: '【源码】Vue3 + Vite 极致秒开后台管理模板',
                        excerpt: '<p>开箱即用的企业级后台前端解决方案</p>',
                        path: '/pages/source/detail?id=301',
                        cover: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&h=500&fit=crop'
                    },
                    {
                        type: 'beebee_novel',
                        title: '【小说】修仙从每天签到领积分开始（连载）',
                        excerpt: '<p>废柴逆袭，打破天地桎梏的热血修真文</p>',
                        path: '/pages/novel/detail?id=102',
                        cover: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=800&h=500&fit=crop'
                    },
                    {
                        type: 'product',
                        title: '【商店】比比工房定制版机械键盘（极客黑）',
                        excerpt: '<p>定制轴体，敲击手感丝滑，程序员必备神器</p>',
                        path: '/pages/shop/detail?id=88',
                        cover: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&h=500&fit=crop'
                    },
                    {
                        type: 'bbpress_topic',
                        title: '【讨论】大家觉得这次社区段位积分改版合理吗？',
                        excerpt: '<p>探讨关于化神期与练气期的经验获取效率</p>',
                        path: '/pages/forum/detail?id=509',
                        cover: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800&h=500&fit=crop'
                    },
                    {
                        type: 'beebee_source',
                        title: '【插件】WordPress 免插件极速缓存优化脚本',
                        excerpt: '<p>让你的博客站点速度飙升至毫秒级</p>',
                        path: '/pages/source/detail?id=305',
                        cover: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=500&fit=crop'
                    }
                ]
            },
            video: {
                type: 'mp4',
                src: 'https://www.w3schools.com/html/mov_bbb.mp4'
            }
        }
    },

    // -------------------------------------------------------------------------
    // 2. ID: 202 - 趣味图文 + 互动抽奖短文测试
    // -------------------------------------------------------------------------
    202: {
        id: 202,
        date: '2026-06-02T14:30:00',
        cover: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?w=800&h=500&fit=crop',
        type: 'beebee_topic',
        title: { rendered: '如何通过幸运老虎机 / 抽中三个7？' },
        tag: [{ name: '主打推荐' }, { name: '幸运抽奖' }],
        color: '#ffffff',
        followdark: false,
        excerpt: { rendered: '<p>欧皇附体的抽奖技巧大公开</p>' },
        author: 1,
        meta: {
            block: 'block-card-mixed',
            views: 1250,
            likes: 128
        },
        content: {
            rendered: `
                <p>运气爆棚的秘诀其实在于每天按时签到领取积分……很多人觉得抽奖纯粹是概率问题，但根据社区几位“老欧皇”的玄学观测，其实里面大有门道。</p>
                <p><strong>秘诀一：卡点刷新。</strong> 经测试，在每天正午 12:00 和晚上 20:00 系统的奖池刚刚重置时，中奖率会有微幅的客观提升。</p>
                <p><strong>秘诀二：心态放平。</strong> 连抽不中时建议去逛逛社区论坛或者看看小说，转移注意力后再来一发，往往有意想不到的惊喜！</p>
            `
        },
        acf: {
            frame: 'list-image',
            addons: {
                items: [
                    {
                        type: 'product',
                        title: '【福利】春节限定财神公仔盲盒',
                        excerpt: '<p>欧气加持，手慢无的高人气社区周边</p>',
                        path: '/pages/shop/detail?id=12',
                        cover: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=800&h=500&fit=crop'
                    },
                    {
                        type: 'bbpress_topic',
                        title: '【求助】幸运老虎机有什么必中的玄学姿势吗？',
                        excerpt: '<p>在线等，急！连续3天没中奖了</p>',
                        path: '/pages/forum/detail?id=612',
                        cover: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800&h=500&fit=crop'
                    },
                    {
                        type: 'beebee_novel',
                        title: '【小说】我在网文世界当大咖（番外篇）',
                        excerpt: '<p>爆笑不断的异界日常与代码梗合集</p>',
                        path: '/pages/novel/detail?id=108',
                        cover: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=800&h=500&fit=crop'
                    },
                    {
                        type: 'beebee_source',
                        title: '【源码】uni-app 多端适配高颜值 UI 组件库',
                        excerpt: '<p>一套代码，多端编译无压力</p>',
                        path: '/pages/source/detail?id=402',
                        cover: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=800&h=500&fit=crop'
                    },
                    {
                        type: 'beebee_topic',
                        title: '【公告】比比工房 2026 年夏日积分商城上新预告',
                        excerpt: '<p>海量虚拟道具与实体周边等你来兑换</p>',
                        path: '/pages/topic/detail?id=99',
                        cover: 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=800&h=500&fit=crop'
                    }
                ]
            },
            video: null
        }
    },

    // -------------------------------------------------------------------------
    // 3. ID: 301 - 纯短文（无 Addons 关联项，测试极简内页排版）
    // -------------------------------------------------------------------------
    301: {
        id: 301,
        date: '2026-06-01T12:00:00',
        cover: 'https://images.unsplash.com/photo-1584438784894-089d6a62b8fa?w=800&h=500&fit=crop',
        type: 'beebee_topic',
        title: { rendered: '独立开发者必备的 / 高效扩展插件' },
        tag: [{ name: '编辑挚爱' }],
        color: '#ffffff',
        followdark: false,
        excerpt: { rendered: '<p>让开发事半功倍的小工具</p>' },
        author: 1,
        meta: {
            block: 'block-card-mixed',
            views: 520,
            likes: 42
        },
        content: {
            rendered: `
                <p>工欲善其事，必先利其器，快来挑选适合你的插件吧。作为独立开发者，时间就是生命，如何把重复的样板代码、繁琐的样式调试交给自动化工具，是每个开发者需要思考的课题。</p>
                <p>本期我们为大家精选了市面上口碑极佳的几款编辑器扩展与浏览器辅助插件，没有花哨的功能，每一款都能直击痛点，帮你把工作效率直接拉满两倍以上。</p>
            `
        },
        acf: {
            frame: 'none-addon',
            addons: {
                items: []
            },
            video: null
        }
    },

    // -------------------------------------------------------------------------
    // 4. ID: 401 - 视频 + 像素游戏独立盘点长文
    // -------------------------------------------------------------------------
    401: {
        id: 401,
        date: '2026-06-02T14:30:00',
        cover: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=800&h=500&fit=crop',
        type: 'beebee_topic',
        title: { rendered: '像素风独立游戏 / 推荐大盘点' },
        tag: [{ name: '编辑挚爱' }, { name: '像素怀旧' }],
        color: '#ffffff',
        followdark: false,
        excerpt: { rendered: '<p>找回童年玩单机游戏的快乐</p>' },
        author: 1,
        meta: {
            block: 'block-card-mixed',
            views: 1890,
            likes: 215
        },
        content: {
            rendered: `
                <p>这些像素风游戏不仅画面精致，玩法也十分硬核。在如今3D大作横行的时代，像素风以其独特的艺术表现力和纯粹的游戏内核，重新赢得了无数玩家的心。</p>
                <h3>为什么我们依然热爱像素？</h3>
                <p>像素不等于简陋，它是一种克制的艺术。开发者通过精妙的光影色彩和流畅的手感打击，在有限的颗粒感中营造出了无限的想象空间。</p>
                <p>观看上方的演示视频，感受独立游戏人对上世纪黄金时代致敬的满腔热血吧！</p>
            `
        },
        acf: {
            frame: 'list-video',
            addons: {
                items: [
                    {
                        type: 'beebee_source',
                        title: '【源码】独立游戏官网响应式展示模板',
                        excerpt: '<p>酷炫动效与全屏滚动支持</p>',
                        path: '/pages/source/detail?id=501',
                        cover: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&h=500&fit=crop'
                    },
                    {
                        type: 'bbpress_topic',
                        title: '【讨论】大家来安利一款你心目中的神作独立游戏',
                        excerpt: '<p>不看画面只看玩法，你推荐哪一款？</p>',
                        path: '/pages/forum/detail?id=789',
                        cover: 'https://images.unsplash.com/photo-1612287233302-6e2fd48a5840?w=800&h=500&fit=crop'
                    },
                    {
                        type: 'product',
                        title: '【商店】像素风复古游戏机手柄',
                        excerpt: '<p>支持多平台蓝牙无线连接</p>',
                        path: '/pages/shop/detail?id=45',
                        cover: 'https://images.unsplash.com/photo-1600080972464-8e5f35f63d08?w=800&h=500&fit=crop'
                    },
                    {
                        type: 'beebee_novel',
                        title: '【小说】游戏开发者的程序员日常',
                        excerpt: '<p>当代码遭遇Bug时的崩溃与灵感迸发</p>',
                        path: '/pages/novel/detail?id=210',
                        cover: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&h=500&fit=crop'
                    },
                    {
                        type: 'beebee_topic',
                        title: '【活动】比比工房第一届独立游戏创作大赛开启',
                        excerpt: '<p>丰厚奖金与社区荣誉等你来拿</p>',
                        path: '/pages/topic/detail?id=110',
                        cover: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800&h=500&fit=crop'
                    }
                ]
            },
            video: {
                type: 'mp4',
                src: 'https://www.w3schools.com/html/mov_bbb.mp4'
            }
        }
    }
};