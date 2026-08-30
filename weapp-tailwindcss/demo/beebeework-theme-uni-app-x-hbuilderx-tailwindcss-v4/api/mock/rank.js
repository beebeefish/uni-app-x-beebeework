// api/mock/rank.js

const getQQAvatar = (seed) => {
  const qq = 10001 + (seed % 50)
  return `https://q1.qlogo.cn/g?b=qq&nk=${qq}&s=100`
}

// 1. 榜单大卡片封面（准备 25 张以应对 5*5 的数据量）
const cardCovers = [
  'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=60',
  'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=800&auto=format&fit=crop&q=60',
  'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?w=800&auto=format&fit=crop&q=60',
  'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=800&auto=format&fit=crop&q=60',
  'https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=800&auto=format&fit=crop&q=60',
  'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=800&auto=format&fit=crop&q=60',
  'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop&q=60',
  'https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&auto=format&fit=crop&q=60',
  'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&auto=format&fit=crop&q=60',
  'https://images.unsplash.com/photo-1537432376769-00f5c6f4c8d2?w=800&auto=format&fit=crop&q=60',
  'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&auto=format&fit=crop&q=60',
  'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&auto=format&fit=crop&q=60',
  'https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=800&auto=format&fit=crop&q=60',
  'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&auto=format&fit=crop&q=60',
  'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&auto=format&fit=crop&q=60',
  'https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?w=800&auto=format&fit=crop&q=60',
  'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&auto=format&fit=crop&q=60',
  'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800&auto=format&fit=crop&q=60',
  'https://images.unsplash.com/photo-1556742049-0a67d553c2a5?w=800&auto=format&fit=crop&q=60',
  'https://images.unsplash.com/photo-1521737852567-6949f3f9f2b5?w=800&auto=format&fit=crop&q=60',
  'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&auto=format&fit=crop&q=60',
  'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=800&auto=format&fit=crop&q=60',
  'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=800&auto=format&fit=crop&q=60',
  'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=60',
  'https://images.unsplash.com/photo-1526738549149-8e07eca6c147?w=800&auto=format&fit=crop&q=60'
]

// 2. 作品封面（UI/界面设计图）
const workCovers = [
  'https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?w=400&auto=format&fit=crop&q=60',
  'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=400&auto=format&fit=crop&q=60',
  'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&auto=format&fit=crop&q=60',
  'https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&auto=format&fit=crop&q=60',
  'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=400&auto=format&fit=crop&q=60',
  'https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=400&auto=format&fit=crop&q=60',
  'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&auto=format&fit=crop&q=60',
  'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400&auto=format&fit=crop&q=60',
  'https://images.unsplash.com/photo-1537432376769-00f5c6f4c8d2?w=400&auto=format&fit=crop&q=60',
  'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400&auto=format&fit=crop&q=60',
  'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400&auto=format&fit=crop&q=60',
  'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=400&auto=format&fit=crop&q=60',
  'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=400&auto=format&fit=crop&q=60',
  'https://images.unsplash.com/photo-1556742049-0a67d553c2a5?w=400&auto=format&fit=crop&q=60',
  'https://images.unsplash.com/photo-1521737852567-6949f3f9f2b5?w=400&auto=format&fit=crop&q=60'
]

// 3. 商品封面（实物数码）
const productCovers = [
  'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&auto=format&fit=crop&q=60',
  'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=400&auto=format&fit=crop&q=60',
  'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400&auto=format&fit=crop&q=60',
  'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=400&auto=format&fit=crop&q=60',
  'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&auto=format&fit=crop&q=60',
  'https://images.unsplash.com/photo-1526738549149-8e07eca6c147?w=400&auto=format&fit=crop&q=60',
  'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=400&auto=format&fit=crop&q=60',
  'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=400&auto=format&fit=crop&q=60',
  'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=400&auto=format&fit=crop&q=60',
  'https://images.unsplash.com/photo-1563245372-f21724e3856d?w=400&auto=format&fit=crop&q=60',
  'https://images.unsplash.com/photo-1544816155-12df9643f363?w=400&auto=format&fit=crop&q=60',
  'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&auto=format&fit=crop&q=60',
  'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400&auto=format&fit=crop&q=60',
  'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=400&auto=format&fit=crop&q=60',
  'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&auto=format&fit=crop&q=60'
]

const names = [
  '小鱼哥', '°籽萝卜蹲@', '极客大咖', '修仙小萌新', '代码搬运工',
  '财神爷下凡', '摸鱼大王', '森林秘境', '霓虹夜行者', '卡牌收集控',
  '非酋克星', '独孤求败', '推广小达人', '开源先锋', '灵感大王',
  '追风少年', '暴富小诸葛', '深夜食堂掌柜', '漫步云端', '银河系护卫'
]

const workTitles = [
  'Vue3+Vite后台管理系统UI','React18+TypeScript后台模板',
  '微信小程序电商UI视觉设计稿','Flutter跨平台社交App界面',
  'Node.js微服务架构设计图解','Python数据可视化大屏UI',
  'Unity3D独立游戏UI设计','AI绘画Prompt管理面板',
  'Docker可视化运维面板UI','Go语言高并发秒杀系统原型',
  'Three.js 3D酷炫大屏UI','Electron桌面端应用皮肤',
  '移动端金融App高保真原型','大厂设计系统DesignSystem',
  '响应式数据看板可视化UI'
]

const productTitles = [
  '比比工房定制机械键盘Pro','RGB电竞游戏鼠标套装',
  '4K超高清显示器支架臂','Type-C扩展坞十合一',
  '降噪头戴式蓝牙耳机','立式无线手机充电器',
  '人体工学护腰办公椅','智能温控保温杯',
  '便携折叠笔记本支架','机械硬盘外置盒Type-C',
  '氮化镓65W快充头','蓝牙机械键盘青轴版',
  '护眼LED屏幕挂灯','超大号鼠标垫RGB发光',
  '桌面收纳理线盒套装'
]

const topicTitles = [
  '大家觉得这次社区改版怎么样？','分享一个Vue3性能优化技巧',
  '求助：微信小程序审核被拒怎么办','独立开发者如何做到月入过万？',
  '推荐几款好用的VSCode插件','2026年前端技术趋势预测',
  '从零搭建个人博客的经验分享','面试被问闭包怎么答最好？',
  '大家觉得AI会取代程序员吗','分享我的远程办公桌面 setup'
]

// 【核心改进】：Fisher-Yates 随机洗牌算法，确保每次生成的列表顺序完全随机且错落有致
function shuffleArray(array) {
  const arr = [...array]
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr
}

const generateRankData = (count = 15, type = 'user', basePoints = 100000, step = 1800, label = '积分', seedOffset = 0) => {
  // 先通过乱序数组或添加随机偏移量，使每次生成的榜单名字与头像彻底错开
  let shuffledNames = shuffleArray(names)
  let shuffledWorks = shuffleArray(workTitles)
  let shuffledProducts = shuffleArray(productTitles)
  let shuffledTopics = shuffleArray(topicTitles)

  return Array.from({ length: count }, (_, index) => {
    // 基础积分加入随机浮动，看起来更真实
    const randomOffset = Math.floor(Math.random() * 350)
    const points = Math.max(basePoints - index * step + randomOffset, 10)
    
    if (type === 'user') {
      return {
        user: { name: shuffledNames[index % shuffledNames.length], avatar: getQQAvatar(index + seedOffset * 7) },
        data: { rank: index + 1, points, label }
      }
    }
    if (type === 'work') {
      return {
        user: { name: shuffledWorks[index % shuffledWorks.length], avatar: workCovers[(index + seedOffset * 3) % workCovers.length] },
        data: { rank: index + 1, points, label, extra: shuffledNames[(index + 5) % shuffledNames.length] }
      }
    }
    if (type === 'product') {
      return {
        user: { name: shuffledProducts[index % shuffledProducts.length], avatar: productCovers[(index + seedOffset * 4) % productCovers.length] },
        data: { rank: index + 1, points, label, extra: `¥${(index + seedOffset + 1) * 29 + 9}` }
      }
    }
    if (type === 'topic') {
      return {
        user: { name: shuffledTopics[index % shuffledTopics.length], avatar: getQQAvatar(index + seedOffset * 11) },
        data: { rank: index + 1, points, label, extra: shuffledNames[(index + 3) % shuffledNames.length] }
      }
    }
    return { user: { name: '未知', avatar: '' }, data: { rank: index + 1, points, label } }
  })
}

// ==================== 每个分类严格配置 5 个子榜单 ====================

const talentRanks = [
  { title: '8月全站财富总榜', desc: '亿万身家，傲视群雄的财富象征' },
  { title: '修仙社区活跃达人周榜', desc: '肝度拉满，日夜在线的修仙劳模' },
  { title: '发帖贡献先锋榜', desc: '干货满满，引领社区讨论风向' },
  { title: '新星创作潜力黑马榜', desc: '初露锋芒，备受瞩目的明日之星' },
  { title: '全能答题积分王者榜', desc: '博学多才，问答板块的智多星' }
].map((item, index) => ({
  id: 100 + index,
  date: `2026-08-01T12:00:00`,
  cover: cardCovers[index % cardCovers.length],
  type: 'beebee_rank',
  ranktype: 'user',
  title: { rendered: item.title },
  description: item.desc,
  categories: [{ name: '达人', id: 1 }],
  rankdata: generateRankData(15, 'user', 100000, 1800, '积分', index + 1),
  meta: { views: 3000, likes: 200 }
}))

const workRanks = [
  { title: '全站最受欢迎UI设计作品榜', desc: '大众所爱，百看不厌的优质视觉内容' },
  { title: '社区最多点赞精选源码榜', desc: '双击不断，好评如潮的封神之作' },
  { title: '开源组件与高分架构设计榜', desc: '硬核代码，开发者必备的效率神器' },
  { title: '创意前端动效视觉秀场榜', desc: '炫酷交互，让人眼前一亮的前端视觉' },
  { title: '高保真原型交互设计精选榜', desc: '逻辑严密，体验丝滑的原型大作' }
].map((item, index) => ({
  id: 200 + index,
  date: `2026-08-01T12:00:00`,
  cover: cardCovers[(index + 5) % cardCovers.length],
  type: 'beebee_rank',
  ranktype: 'work',
  title: { rendered: item.title },
  description: item.desc,
  categories: [{ name: '作品', id: 2 }],
  rankdata: generateRankData(15, 'work', 5000, 200, '点赞', index + 2),
  meta: { views: 5000, likes: 600 }
}))

const productRanks = [
  { title: '商城最多人抢购爆款实物榜', desc: '手慢无，全网疯抢的明星级数码好物' },
  { title: '比比工房定制外设热销榜', desc: '机械手感，码字如飞的打工人神器' },
  { title: '桌面数码与极客装备好物榜', desc: '提升幸福感的生产力外设合集' },
  { title: '极客精选智能穿戴设备榜', desc: '科技随身，潮流与实用兼备的智能好物' },
  { title: '程序员护眼与人体工学专区榜', desc: '关爱脊椎与视力，久坐办公必备' }
].map((item, index) => ({
  id: 300 + index,
  date: `2026-08-01T12:00:00`,
  cover: cardCovers[(index + 10) % cardCovers.length],
  type: 'beebee_rank',
  ranktype: 'product',
  title: { rendered: item.title },
  description: item.desc,
  categories: [{ name: '商品', id: 3 }],
  rankdata: generateRankData(15, 'product', 2000, 100, '销量', index + 3),
  meta: { views: 1800, likes: 150 }
}))

const topicRanks = [
  { title: '全站热门话题热度总榜', desc: '千万网友围观吃瓜的神级讨论区' },
  { title: '修仙吐槽大会高能讨论榜', desc: '金句频出，笑料不断的快乐源泉' },
  { title: '独立开发者副业交流热榜', desc: '探讨如何破局、搞钱与独立开发' },
  { title: '前端技术求职与面试避坑榜', desc: '直击面试痛点，分享真实求职经验' },
  { title: '摸鱼日常与整活分享茶话会', desc: '轻松休闲，释放工作压力的吐槽天地' }
].map((item, index) => ({
  id: 400 + index,
  date: `2026-08-01T12:00:00`,
  cover: cardCovers[(index + 15) % cardCovers.length],
  type: 'beebee_rank',
  ranktype: 'topic',
  title: { rendered: item.title },
  description: item.desc,
  categories: [{ name: '话题', id: 4 }],
  rankdata: generateRankData(15, 'topic', 10000, 500, '热度', index + 4),
  meta: { views: 4000, likes: 300 }
}))

const coinRanks = [
  { title: '社区富豪金币资产总榜', desc: '腰缠万贯，比比网最强土豪集合地' },
  { title: '每日赏金猎人高额收益榜', desc: '靠实力与智慧赚取丰厚赏金的达人' },
  { title: '社区土豪打赏周榜', desc: '一掷千金，慷慨解囊的魅力大佬' },
  { title: '金币理财与投资收益龙虎榜', desc: '钱生钱的高手，资产增值风向标' },
  { title: '悬赏大厅发单土豪积分榜', desc: '豪掷千金求贤若渴的优质雇主集合' }
].map((item, index) => ({
  id: 500 + index,
  date: `2026-08-01T12:00:00`,
  cover: cardCovers[(index + 20) % cardCovers.length],
  type: 'beebee_rank',
  ranktype: 'user',
  title: { rendered: item.title },
  description: item.desc,
  categories: [{ name: '金币', id: 5 }],
  rankdata: generateRankData(15, 'user', 200000, 3000, '金币', index + 5),
  meta: { views: 6000, likes: 800 }
}))

export const mockRankDatabase = [
  ...talentRanks,
  ...workRanks,
  ...productRanks,
  ...topicRanks,
  ...coinRanks
]

export function getMockRankCategories() {
  const map = new Map()
  mockRankDatabase.forEach(item => {
    const cats = item.categories || []
    cats.forEach(c => {
      if (c && c.id != null && c.name && !map.has(c.id)) {
        map.set(c.id, { id: c.id, label: c.name })
      }
    })
  })
  return Array.from(map.values()).sort((a, b) => a.id - b.id)
}