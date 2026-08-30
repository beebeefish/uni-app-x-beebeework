// api/mock/pointsbuy.js
export const mockPointsBuyList = [
    {
        id: 501,
        date: '2026-06-01T12:00:00',
        type: 'points_shop_group',
        title: { rendered: '限量段位直升专区' },
        excerpt: { rendered: '<p>消耗积分直接兑换段位分，突破社区瓶颈，每款限量 5 个</p>' },
        acf: {
            shop_items: [
                {
                    id: 601,
                    type: 'rank_boost',
                    title: '初级段位突破包',
                    subtitle: '1000 积分兑换 100 段位分',
                    price: 1000,
                    currency: 'points',
                    stock: 5,
                    limit: 5,
                    expireDays: null,
                    attribute: '+100 段位积分',
                    cover: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&h=500&fit=crop'
                },
                {
                    id: 602,
                    type: 'rank_boost',
                    title: '中级段位跃升包',
                    subtitle: '10000 积分兑换 1000 段位分',
                    price: 10000,
                    currency: 'points',
                    stock: 3,
                    limit: 5,
                    expireDays: null,
                    attribute: '+1000 段位积分',
                    cover: 'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?w=800&h=500&fit=crop'
                },
                {
                    id: 603,
                    type: 'rank_boost',
                    title: '高级段位飞升礼包',
                    subtitle: '30000 积分兑换 3000 段位分',
                    price: 30000,
                    currency: 'points',
                    stock: 1,
                    limit: 5,
                    expireDays: null,
                    attribute: '+3000 段位积分',
                    cover: 'https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?w=800&h=500&fit=crop'
                }
            ]
        }
    },
    {
        id: 502,
        date: '2026-06-01T12:00:00',
        type: 'points_shop_group',
        title: { rendered: '社区声望·头像挂件专区' },
        excerpt: { rendered: '<p>佩戴后发帖被评为优秀可获得额外声望加成，有效期 30 天</p>' },
        acf: {
            shop_items: [
                { id: 701, type: 'avatar_frame', title: '赛博霓虹', subtitle: '佩戴后发帖声望增值', price: 2000, currency: 'points', stock: 99, expireDays: 30, attribute: '声望加成 +10%', cover: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&h=500&fit=crop' },
                { id: 702, type: 'avatar_frame', title: '深空矩阵', subtitle: '佩戴后发帖声望增值', price: 4000, currency: 'points', stock: 88, expireDays: 30, attribute: '声望加成 +20%', cover: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&h=500&fit=crop' },
                { id: 703, type: 'avatar_frame', title: '烈焰金龙', subtitle: '佩戴后发帖声望增值', price: 6000, currency: 'points', stock: 50, expireDays: 30, attribute: '声望加成 +35%', cover: 'https://images.unsplash.com/photo-1563089145-599997674d42?w=800&h=500&fit=crop' },
                { id: 704, type: 'avatar_frame', title: '极客代码', subtitle: '佩戴后发帖声望增值', price: 8000, currency: 'points', stock: 30, expireDays: 30, attribute: '声望加成 +50%', cover: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&h=500&fit=crop' },
                { id: 705, type: 'avatar_frame', title: '暗夜星辰', subtitle: '佩戴后发帖声望增值', price: 10000, currency: 'points', stock: 25, expireDays: 30, attribute: '声望加成 +60%', cover: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=800&h=500&fit=crop' },
                { id: 706, type: 'avatar_frame', title: '机械之心', subtitle: '佩戴后发帖声望增值', price: 12000, currency: 'points', stock: 20, expireDays: 30, attribute: '声望加成 +70%', cover: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&h=500&fit=crop' },
                { id: 707, type: 'avatar_frame', title: '薄荷之夏', subtitle: '佩戴后发帖声望增值', price: 15000, currency: 'points', stock: 15, expireDays: 30, attribute: '声望加成 +80%', cover: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=800&h=500&fit=crop' },
                { id: 708, type: 'avatar_frame', title: '绯红之月', subtitle: '佩戴后发帖声望增值', price: 18000, currency: 'points', stock: 10, expireDays: 30, attribute: '声望加成 +90%', cover: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&h=500&fit=crop' },
                { id: 709, type: 'avatar_frame', title: '至尊皇冠', subtitle: '佩戴后发帖声望增值', price: 25000, currency: 'points', stock: 5, expireDays: 30, attribute: '声望加成 +100%', cover: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=800&h=500&fit=crop' },
                { id: 710, type: 'avatar_frame', title: '无限虚空', subtitle: '佩戴后发帖声望增值', price: 30000, currency: 'points', stock: 3, expireDays: 30, attribute: '声望加成 +100% 暴击', cover: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=800&h=500&fit=crop' }
            ]
        }
    },
    {
        id: 503,
        date: '2026-06-01T12:00:00',
        type: 'points_shop_group',
        title: { rendered: '黑科技合成与炼制专区' },
        excerpt: { rendered: '<p>稀有特权道具：加速卡及星星炼制瓶，助力资产变现与极速合成</p>' },
        acf: {
            shop_items: [
                {
                    id: 801,
                    type: 'special_tool',
                    title: '会员卡合成加速卡',
                    subtitle: '加速合成时间',
                    price: 5000,
                    currency: 'points',
                    stock: 10,
                    limit: 2,
                    attribute: '合成效率提升 1%-5%',
                    cover: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&h=500&fit=crop'
                },
                {
                    id: 802,
                    type: 'special_tool',
                    title: '星芒炼制瓶·标准型（炼制炉A）',
                    subtitle: '炼制积分瓶',
                    price: 8888,
                    currency: 'points',
                    stock: 8,
                    limit: 1,
                    attribute: '容量 1000 / 周期 12h',
                    cover: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=800&h=500&fit=crop'
                },
                {
                    id: 803,
                    type: 'special_tool',
                    title: '星芒炼制瓶·深渊型（炼制炉B）',
                    subtitle: '炼制余额瓶',
                    price: 28888,
                    currency: 'points',
                    stock: 3,
                    limit: 1,
                    attribute: '容量 100 / 周期 24h',
                    cover: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&h=500&fit=crop'
                }
            ]
        }
    }
]