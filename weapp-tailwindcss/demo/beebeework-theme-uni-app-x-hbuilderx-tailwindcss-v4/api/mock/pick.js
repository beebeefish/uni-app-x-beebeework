// api/mock/topic.js
export const mockPickList = [
    {
        id: 101,
        date: '2026-06-01T12:00:00',
        posttype: 'beebee_pick',
        type: 'pick',
        title: { rendered: '为工作助力' },
        excerpt: { rendered: '<p>成为效率达人，精选高能工具与技巧集合</p>' },
        acf: {
            choose_topic: [
                {  
                    id: 201,
                    date: '2026-06-01T12:00:00',
                    cover: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&h=500&fit=crop',
                    posttype: 'beebee_topic',
                    type: 'topic',
                    // 💡 测试手动换行：用 " / " 分隔
                    title: { rendered: '比比工房 2026 春季修仙指南 / 与积分攻略' },
                    // 💡 测试多个标签：用逗号拼接展示
                    tag: [{ name: '释放创意' }, { name: '热门精选' }],
                    color: '#ffffff',
                    followdark: false,
                    excerpt: { rendered: '<p>修仙路上必备的积分与福利指南</p>' },
                    content: { rendered: '<p>这是一条用于前端开发调试的本地模拟话题内容，段位直接拉满！</p>' },
                    author: 1,
                    meta: {
                        views: 998,
                        likes: 66
                    },
                    acf: {
                        frame: 'move-addon',
                        addons: {
                            sharp: 'square', // square / circle / horizontal / vertical
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
                {
                    id: 202,
                    date: '2026-06-02T14:30:00',
                    cover: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?w=800&h=500&fit=crop',
                    posttype: 'beebee_topic',
                    type: 'topic',
                    // 💡 测试手动换行
                    title: { rendered: '如何通过幸运老虎机 / 抽中三个7？' },
                    tag: [{ name: '主打推荐' }, { name: '幸运抽奖' }],
                    color: '#ffffff',
                    followdark: false,
                    excerpt: { rendered: '<p>欧皇附体的抽奖技巧大公开</p>' },
                    content: { rendered: '<p>运气爆棚的秘诀其实在于每天按时签到领取积分……</p>' },
                    author: 1,
                    meta: {
                        block: 'block-card-mixed',
                        views: 1250,
                        likes: 128
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
                                    posttype: 'beebee_topic',type: 'topic',
                                    title: '【公告】比比工房 2026 年夏日积分商城上新预告',
                                    excerpt: '<p>海量虚拟道具与实体周边等你来兑换</p>',
                                    path: '/pages/topic/detail?id=99',
                                    cover: 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=800&h=500&fit=crop'
                                }
                            ]
                        },
                        video: null
                    }
                }
            ]
        },
        author: 1,
    },
    {
        id: 102,
        date: '2026-06-01T12:00:00',
        posttype: 'beebee_pick',
        type: 'pick',
        title: { rendered: '日常好工具' },
        excerpt: { rendered: '<p>发现生活中的高效神器</p>' },
        acf: {
            choose_topic: [
                {  
                    id: 301,
                    date: '2026-06-01T12:00:00',
                    cover: 'https://images.unsplash.com/photo-1584438784894-089d6a62b8fa?w=800&h=500&fit=crop',
                    posttype: 'beebee_topic',
                    type: 'topic',
                    title: { rendered: '独立开发者必备的 / 高效扩展插件' },
                    tag: [{ name: '编辑挚爱' }],
                    color: '#ffffff',
                    followdark: false,
                    excerpt: { rendered: '<p>让开发事半功倍的小工具</p>' },
                    content: { rendered: '<p>工欲善其事，必先利其器，快来挑选适合你的插件吧。</p>' },
                    author: 1,
                    meta: {
                        block: 'block-card-mixed',
                        views: 520,
                        likes: 42
                    },
                    acf: {
                        frame: 'none-addon',
                        addons: {
                            items: []
                        },
                        video: null
                    }
                }
            ]
        },
        author: 1,
    },
    {
        id: 103,
        date: '2026-06-01T12:00:00',
        posttype: 'beebee_pick',
        type: 'pick',
        title: { rendered: '我们喜欢的独立游戏' },
        excerpt: { rendered: '<p>小团队带来大乐趣，感受纯粹的游戏初心</p>' },
        acf: {
            choose_topic: [
                {
                    id: 401,
                    date: '2026-06-02T14:30:00',
                    cover: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=800&h=500&fit=crop',
                    posttype: 'beebee_topic',
                    type: 'topic',
                    title: { rendered: '像素风独立游戏 / 推荐大盘点' },
                    tag: [{ name: '编辑挚爱' }, { name: '像素怀旧' }],
                    color: '#ffffff',
                    followdark: false,
                    excerpt: { rendered: '<p>找回童年玩单机游戏的快乐</p>' },
                    content: { rendered: '<p>这些像素风游戏不仅画面精致，玩法也十分硬核。</p>' },
                    author: 1,
                    meta: {
                        block: 'block-card-mixed',
                        views: 1890,
                        likes: 215
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
                                    posttype: 'beebee_topic',type: 'topic',
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
            ]
        },
        author: 1,
    }
]