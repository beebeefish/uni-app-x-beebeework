// api/mock/shuoshuo.js

// 随机生成一个常见 QQ 号前缀，利用腾讯 CDN 保证国内秒开
const getRandomQQAvatar = (seed) => {
  // 用简单的哈希或者固定几个高质量的测试 QQ 号段来保证头像稳定
  const qqList = [
    '10001', '10002', '10003', '123456', '888888', 
    '11223344', '55667788', '99887766', '135792468', '246813579',
    '3333334', '5555556', '7777778', '9999990', '12121212'
  ]
  const qq = qqList[seed % qqList.length]
  return `https://q1.qlogo.cn/g?b=qq&nk=${qq}&s=100`
}

const users = [
  // --- 管理员与版主/编辑 ---
  { nickname: '小鱼哥', role: '管理员', niceid: true, level: '化神期', avatar: 'https://q1.qlogo.cn/g?b=qq&nk=10001&s=100' },
  { nickname: '极客大咖', role: '版主', niceid: true, level: '大乘期', avatar: 'https://q1.qlogo.cn/g?b=qq&nk=888888&s=100' },
  { nickname: '霓虹夜行者', role: '编辑', niceid: true, level: '大乘期', avatar: 'https://q1.qlogo.cn/g?b=qq&nk=123456&s=100' },

  // --- 大量普通用户（全部换成国内秒开的 QQ 镜像头像） ---
  { nickname: '森林秘境', role: '', niceid: true, level: '元婴期', avatar: getRandomQQAvatar(1) },
  { nickname: '极光捕手', role: '', niceid: true, level: '化神期', avatar: getRandomQQAvatar(2) },
  { nickname: '向阳而生', role: '', niceid: false, level: '筑基期', avatar: getRandomQQAvatar(3) },
  { nickname: '矩阵代码', role: '', niceid: true, level: '化神期', avatar: getRandomQQAvatar(4) },
  { nickname: '合成人9号', role: '', niceid: true, level: '金丹期', avatar: getRandomQQAvatar(5) },
  { nickname: '摸鱼大王', role: '', niceid: false, level: '练气期1层', avatar: getRandomQQAvatar(6) },
  { nickname: '头发掉光了', role: '', niceid: false, level: '金丹期9层', avatar: getRandomQQAvatar(7) },
  { nickname: '今天吃什么', role: '', niceid: true, level: '筑基期', avatar: getRandomQQAvatar(8) },
  { nickname: '°籽萝卜蹲@', role: '', niceid: false, level: '练气期7层', avatar: getRandomQQAvatar(9) },
  { nickname: '修仙小萌新', role: '', niceid: false, level: '筑基期3层', avatar: getRandomQQAvatar(10) },
  { nickname: '代码搬运工', role: '', niceid: true, level: '金丹期', avatar: getRandomQQAvatar(11) },
  { nickname: '卡牌收集控', role: '', niceid: false, level: '化神期', avatar: getRandomQQAvatar(12) },
  { nickname: '声望大佬', role: '', niceid: true, level: '大乘期', avatar: getRandomQQAvatar(13) }
]

const actions = [
  // --- 第一页 (第 1 - 10 条) ---
  (name) => `${name} 购买成为了 MAX VIP，享受全站最高尊贵特权与专属折扣。`,
  (name) => `${name} 做任务幸运老虎机抽中了3个7，运气爆棚。积分 +100`,
  (name) => `${name} 发表的话题点赞超过了 100，成功登顶今日社区热门讨论榜首！`,
  (name) => `${name} 积分连续签到 30 天，获得系统额外发放的奖励 100 积分。`,
  (name) => `${name} 修为境界顺利突破了金丹期，感悟天地法则，解锁全新社区权限。`,
  (name) => `${name} 在商城购买了“比比工房定制版机械键盘”，消耗 3200 比比币。`,
  (name) => `${name} 卡卡合成了神话级别的 PRO VIP 卡，全服金光特效闪耀登场！`,
  (name) => `${name} 累计发表高质量评论达到 1000 条，荣获“评论达人”荣誉勋章。`,
  (name) => `${name} 参与迎春接福活动，手气极佳，抽中了价值 200 元的精美礼品卡。`,
  (name) => `${name} 全站个人声望值正式达到了 1000 大关，受万众敬仰。`,

  // --- 第二页 (第 11 - 20 条) ---
  (name) => `${name} 在开源专区分享了一套极品后台管理源码，被 500+ 人点赞收藏。`,
  (name) => `${name} 开启了闭关修炼模式，成功将功法提升至大圆满境界。`,
  (name) => `${name} 成功创建了“前端极客联盟”圈子，吸引了众多道友共同探讨技术。`,
  (name) => `${name} 在跳蚤市场成功出掉了闲置的机械键盘，回血 450 元。`,
  (name) => `${name} 参与了社区每周问答挑战，荣获“本周答题状元”称号。`,
  (name) => `${name} 炼制出了绝品筑基丹，在坊市中被群友一抢而空。`,
  (name) => `${name} 邀请了 5 位好友加入社区，获得了丰厚的引流奖励。`,
  (name) => `${name} 发布的动态被管理员加精置顶，全服通报表扬。`,
  (name) => `${name} 消耗 500 积分兑换了 50 元无门槛优惠券，准备开启大采购。`,
  (name) => `${name} 成功击退了入侵宗门的域外天魔，获得“护宗长老”称号。`
]

// 自动生成 15 条新鲜事数据
export const mockShuoshuoList = Array.from({ length: 15 }, (_, index) => {
  const randomUserIndex = Math.floor(Math.random() * users.length)
  const user = users[randomUserIndex]
  
  const actionFn = actions[index % actions.length]
  const id = index + 1
  
  let timeStr = ''
  if (id <= 5) {
    timeStr = `${id * 3}分钟前`
  } else if (id <= 20) {
    timeStr = `${id - 2}小时前`
  } else {
    timeStr = `3天前`
  }

  return {
    id,
    ...user,
    frame: 'feed-easy',
    time: timeStr,
    content: actionFn(user.nickname)
  }
})