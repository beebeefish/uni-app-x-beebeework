// api/data.js
import { request } from '@/.cool/service'
import { mockPickList } from './mock/pick.js'
import { mockRankDatabase, getMockRankCategories } from './mock/rank.js'
import { mockShuoshuoList } from './mock/shuoshuo.js'
import { mockPointsBuyList } from './mock/pointsbuy.js'

const IS_DEV_MOCK = true


/**
 * 【本地渐进式骨架模板】
 * 特点：
 * 1. 静态固化的骨架（如乐园、消息、我的等），不需要天天改后台的直接放这，极致秒开。
 * 2. 预留了 iconImage 字段，未来 WordPress 后台如果支持自定义上传图标，直接覆盖即可，前端零修改。
 */
const LOCAL_THEME_TEMPLATE = {
  site_name: '比比工房',
  
  // 全局加号弹窗菜单
  addActionList: [
    { label: '发布作品', icon: 'i-[mingcute--board-line]', path: '',meta: { isAuth: true } },
    { label: '发布话题', icon: 'i-[mingcute--comment-line]', path: '',meta: { isAuth: true } },
    { label: '卖闲置', icon: 'i-[mingcute--rocket-line]', path: '',meta: { isAuth: true } },
    { label: '创作者中心', icon: 'i-[mingcute--edit-4-line]', color: '#ff4d4f', path: '',meta: { isAuth: true } }
  ],

  // AI 助手配置
  ai_config: {
    enabled: true,
    welcome_tip: '看到好的文章/商品，先收藏网页端购买',
    model_name: 'GPT-4o-Mini'
  },

  // 各主页面静态结构与“摸索期”字段（这是一个数组！）
  pagesConfig: [
    // 1. 探索页
    {
      bar: {
        viewKey: 'index',
        name: '探索',
        path: '/pages/index/index',
        icon: 'i-[mingcute--compass-fill]',
        navbar: {
          leftBtns: ['drawer', 'search'], 
          content: 'tablist'              
        },
        fabbar: ['pub','backtop'], 
      },
      addons: [],
      tabs: [
        {
          label: '探索',
          value: 'discover',
          showLargeTitle:  true,
          modules: [
            {
              type: 'card-list',
              title: '',
              data: [
                { name: '灵感', iconImage: '', icon: 'i-[mingcute--board-line]', mark: '', count: 10, path: '/pages/inspiration/inspiration' },
                { name: '源码', iconImage: '', icon: 'i-[mingcute--shopping-bag-3-line]', mark: '', count: 3, path: '/pages/source/source' },
                { name: '商店', iconImage: '', icon: 'i-[mingcute--shopping-bag-1-line]', mark: '', count: 0, path: '/pages/shop/shop' },
                { name: '学院', iconImage: '', icon: 'i-[mingcute--planet-line]', mark: '', count: 1, path: '/pages/academy/academy' },
                { name: '活动', iconImage: '', icon: 'i-[mingcute--target-line]', mark: '', count: 0, path: '/pages/activity/activity' },
                { name: '广场', iconImage: '', icon: 'i-[mingcute--comment-line]', mark: '', count: 28, path: '/pages/activity/activity' }
              ]
            },
            {
              type: 'article-list',
              block: 'block-card-mixed',
              title: '新鲜事',
              apiKey: 'posts',
              params: {
                posttype: 'shuoshuo',
                per_page: 5
              }
            }
          ]
        },
        {
          label: '精选',
          value: 'aggregate',
          showLargeTitle:  true,
          modules: [
            {
              type: 'article-list',           // 声明这是一个文章长列表模块
              block: 'block-card-mixed',
              title: '',               // 模块标题
              apiKey: 'posts', 
              params: {
                posttype: 'pick',
                per_page: 5
              }
            }
          ]
        },
        {
          label: '榜单',
          value: 'rank',
          showLargeTitle:  true,
          modules: [
            {
              type: 'article-list',           // 榜单也可以是文章长列表
              block: 'block-card-rank',
              title: '',               // 模块标题
              apiKey: 'posts',     // 如果榜单是另一个类型，也可以单独配置
              params: {
                posttype: 'rank',
                per_page: 5
              }
            }
          ]
        }
      ]
    },
    // 2. 乐园页
    {
      bar: {
        viewKey: 'park',
        name: '乐园',
        path: '/pages/park/park',
        icon: 'i-[mingcute--game-2-fill]',
        navbar: {
          leftBtns: ['drawer', 'search'], 
          content: 'tablist'
        },
        fabbar: ['backtop'], 
      },
      addons: [
        { 
          statsList: [
            { name: '积分', value: 3265, path:'' },
            { name: '星星', value: 60, path:'' },
            { name: '道具', value: 5, path:'' },
          ],
        },
      ],
      tabs: [
        { 
          label: '乐园', 
          value: 'park', 
          showLargeTitle:  true,
          modules: [
            { 
              type: 'card-list', 
              title: '日常福利', 
              data: [
                { name: '迎财神接福', iconImage: '', mark: '限春节', count: 0, path: '' },
                { name: '烟花许愿好礼来', iconImage: '', mark: '限春节', count: 0, path: '' },
                { name: '每日签到得积分', iconImage: '', mark: '', count: 0, path: '' },
                { name: '幸运老虎机抽积分', iconImage: '', mark: '', count: 0, path: '' },
                { name: '每日任务奖积分', iconImage: '', mark: '', count: 0, path: '' }
              ] 
            },
            { 
              type: 'card-list', 
              title: '高级福利', 
              data: [
                { name: '会员积分每日领', iconImage: '', mark: '', count: 0, path: '' },
                { name: '卡卡合成高阶卡', iconImage: '', mark: 'HOT', count: 0, path: '' },
                { name: '星星造物集瓶子', iconImage: '', mark: '', count: 0, path: '' },
                { name: '个性头像动起来', iconImage: '', mark: '', count: 0, path: '' },
                { name: '6位靓号显身份', iconImage: '', mark: 'HOT', count: 0, path: '' }
              ] 
            },
            { 
              type: 'card-list', 
              title: '微信生态福利', 
              data: [
                { name: '看小程序广告得积分', iconImage: '', mark: '', count: 0, path: '' },
                { name: '玩小程序游戏奖积分', iconImage: '', mark: 'NEW', count: 0, path: '' },
                { name: '推广好友购物赚积分', iconImage: '', mark: '', count: 0, path: '' }
              ] 
            }
          ]
        },
        { 
          label: '积分购', 
          value: 'activity', 
          showLargeTitle: true,
          modules: [
            {
              type: 'article-list',           // 声明这是一个长列表模块
              block: 'block-points-shop',      // 指定对应的单个卡片 UI 模块
              title: '',               // 模块标题
              apiKey: 'posts', 
              params: {
                posttype: 'points_shop',      // 对应拦截标识
                per_page: 10
              }
            }
          ]
        }
      ]
    },
    // 3. 收件箱页
    {
      bar: {
        viewKey: 'inbox',
        name: '收件箱',
        path: '/pages/inbox/inbox',
        icon: 'i-[mingcute--inbox-fill]',
        navbar: {
          leftBtns: ['drawer', 'search'], 
          content: ''
        },
        fabbar: ['backtop'], 
      },
      addons: [],
      tabs: [
        { 
          label: '消息', 
          value: 'message', 
          showLargeTitle:  true,
          modules: [
            { 
              type: 'card-list', 
              title: '', 
              data: [
                { name: '系统消息', icon: 'i-[mingcute--notification-line]', mark: '', count: 2, path: '' },
                { name: '评论', icon: 'i-[mingcute--chat-3-line]', mark: '', count: 0, path: '' },
                { name: '赞', icon: 'i-[mingcute--heart-line]', mark: '', count: 0, path: '' },
                { name: '卡片消息', icon: 'i-[mingcute--wallet-5-line]', mark: '', count: 1, path: '' },
                { name: '订单消息', icon: 'i-[mingcute--bill-line]', mark: '', count: 0, path: '' }
              ] 
            }
          ]
        }
      ]
    },
    // 4. 我的页
    {
      bar: {
        viewKey: 'my',
        name: '我的',
        path: '/pages/my/my',
        icon: 'i-[mingcute--user-2-fill]',
        navbar: {
          leftBtns: ['setting', 'share'], 
          content: ''
        },
        fabbar: ['backtop'], 
      },
      addons: [
        { 
          userInfo: {
            avatar: 'https://beebee.work/wp-content/uploads/beephoto/1778115203_16da695b227271d0.png',
            nickname: '小鱼哥',
            username: 'gamch2',
            description: '我在比比网修仙！！',
            role: '管理员',
            niceid: true,
            level: '化神期',
            item: [
              { title: '主页', value: 'https://beebee.work/user/100000' },
              { title: 'IP属地', value: '湖北' },
              { title: '时长', value: '使用比比网1年5个月' }
            ]
          },
          statsList: [
            { name: 'VIP等级', value: 'MAX VIP', path:'' },
            { name: '比比币', value: 3132, path:'' },
            { name: '积分', value: 3265, path:'' },
            { name: '勋章', value: 5, path:'' },
            { name: '收益豆', value: 5, path:'' },
            { name: '段位', value: '化神期', path:'' },
            { name: '认证', value: '已认证', path:'' },
          ],
          actionsBtn: [
            { name: '编辑个人资料', path:'' },
            { name: '查看我的主页', path:'' },
          ],
        },
      ],
      tabs: [
        { 
          label: '我的', 
          value: 'mylist', 
          showLargeTitle:  false,
          modules: [
            { 
              type: 'card-list', 
              title: '', 
              data: [
                { name: '我的订单', icon: 'i-[mingcute--bill-line]', mark: '', count: 0, path: '' },
                { name: '我的卡包', icon: 'i-[mingcute--wallet-5-line]', mark: '', count: 1, path: '' },
                { name: '我喜欢的', icon: 'i-[mingcute--heart-line]', mark: '', count: 0, path: '' },
                { name: '我评论的', icon: 'i-[mingcute--chat-3-line]', mark: '', count: 0, path: '' },
                { name: '我的瓶罐', icon: 'i-[mingcute--bottle-line]', mark: '', count: 2, path: '' }
              ] 
            }
          ]
        }
      ]
    }
  ]
}

/**
 * 💡 从数组中直接 map 提取 bar 作为底部 TabBar 列表
 */
export function getTabList(pagesConfig) {
  if (!Array.isArray(pagesConfig)) return []
  return pagesConfig.map(page => page.bar).filter(Boolean)
}
/**
 * 💡 从 pagesConfig 中聚合提取每个页面的左侧按钮配置，或者返回以 viewKey 为键的映射字典
 */
export function getLeftBtnsMap(pagesConfig) {
  if (!Array.isArray(pagesConfig)) return {}
  const map = {}
  pagesConfig.forEach(page => {
    const viewKey = page?.bar?.viewKey
    const leftBtns = page?.bar?.navbar?.leftBtns
    if (viewKey) {
      map[viewKey] = Array.isArray(leftBtns) ? leftBtns : []
    }
  })
  return map
}

/**
 * 聚合配置接口：智能混血逻辑
 */
export async function fetchThemeConfig() {
  try {
    const remoteData = await request({
      url: '/wp/v2/settings',
      method: 'GET'
    })

    if (remoteData != null) {
      return {
        ...LOCAL_THEME_TEMPLATE,
        ...remoteData,
        // 💡 修复点：pagesConfig 是数组，不能用大括号 {} 解构，否则会变成对象导致数组方法失效
        pagesConfig: Array.isArray(remoteData.pagesConfig) && remoteData.pagesConfig.length > 0 
          ? remoteData.pagesConfig 
          : LOCAL_THEME_TEMPLATE.pagesConfig
      }
    }
  } catch (e) {
    console.warn('未连接远程或后端接口未就绪，平滑降级使用本地全套模板', e)
  }

  return LOCAL_THEME_TEMPLATE
}

const httpGet = (url, options = {}) => {
  return request({
    url,
    method: 'GET',
    ...options
  })
}

export async function fetchPosts(params = { page: 1, per_page: 5, posttype: 'posts' }) {
  const { posttype = 'posts', ...queryParams } = params
  const page = Number(queryParams.page) || 1
  const perPage = Number(queryParams.per_page) || 10
  const start = (page - 1) * perPage
  const end = start + perPage

  let rawList = []
  let total = 0

  // ==================== 1. 本地 Mock 拦截阶段 ====================
  if (IS_DEV_MOCK) {
    if (posttype === 'pick' || posttype === 'aggregate') {
      rawList = mockPickList.slice(start, end)
      total = mockPickList.length
    }else if (posttype === 'rank') {
      // ✅ 内联 rank 逻辑：先按 categoryId 过滤全量数据，再分页
      const categoryId = Number(queryParams.categoryId) || 1
      const filtered = mockRankDatabase.filter(item => 
        (item.categories || []).some(c => c.id === categoryId)
      )
      rawList = filtered.slice(start, end)
      total = filtered.length
    } else if (posttype === 'shuoshuo') {
      rawList = mockShuoshuoList.slice(start, end)
      total = mockShuoshuoList.length
    } else if (posttype === 'points_shop') {
      // ✅ 新增：积分购长列表数据支持
      rawList = mockPointsBuyList.slice(start, end)
      total = mockPointsBuyList.length
    } else {
      // 💡 如果 Mock 模式下请求标准的 posts，也可以给个默认兜底
      rawList = mockShuoshuoList.slice(start, end)
      total = mockShuoshuoList.length
    }

    // 统一走格式化适配器
    return Promise.resolve({
      code: 1000,
      message: 'success',
      data: {
        list: formatPostList(rawList),
        pagination: { page, size: perPage, total }
      }
    })
  }

  // ==================== 2. 真实生产环境请求阶段 ====================
  let targetUrl = ''

  if (posttype === 'pick' || posttype === 'aggregate') {
    targetUrl = `/bee/v1/picklist`
  } else if (posttype === 'rank') {
    targetUrl = `/bee/v1/ranklist`
  } else if (posttype === 'shuoshuo') {
    targetUrl = `/bee/v1/shuoshuolist`
  } else {
    targetUrl = `/wp/v2/${posttype}`
  }

  try {
    const res = await request({
      url: targetUrl,
      method: 'GET',
      params: queryParams
    })

    let listData = []
    let paginationData = null

    if (Array.isArray(res)) {
      listData = res
      total = res.length
    } else if (res?.data && Array.isArray(res.data.list)) {
      listData = res.data.list
      paginationData = res.data.pagination
      total = res.data.pagination?.total || listData.length
    } else if (res?.data && Array.isArray(res.data)) {
      listData = res.data
      total = res.total || listData.length
    } else if (res?.list && Array.isArray(res.list)) {
      listData = res.list
      paginationData = res.pagination
      total = res.pagination?.total || listData.length
    }

    return {
      code: 1000,
      message: 'success',
      data: {
        list: formatPostList(listData),
        pagination: paginationData || { page, size: perPage, total }
      }
    }
  } catch (error) {
    console.error('fetchPosts 真实请求出错:', error)
    return { 
      code: 500, 
      message: '请求失败', 
      data: { list: [], pagination: { page, size: perPage, total: 0 } } 
    }
  }
}

/**
 * 💡 核心数据清洗适配器（同时兼容 WP 标准接口与各种 Mock 结构）
 */
function formatPostList(rawList) {
  if (!Array.isArray(rawList)) return []

  return rawList
    .filter(item => item != null)
    .map(item => {
      const frame = item.frame 
        || item.acf?.frame 
        || item.acf?.choose_topic?.[0]?.acf?.frame 
        || 'feed-easy'

      const displayTitle = typeof item.title === 'object' 
        ? (item.title?.rendered || '') 
        : (item.title || item.content || '无标题')

      return {
        ...item,               // 保留原始字段（包括 title 对象、rankdata 等）
        frame,
        displayTitle,
        rankdata: Array.isArray(item.rankdata) ? item.rankdata : [],
        acf: item.acf || {},
        addons: item.acf?.addons || { items: [] }
      }
    })
}

export function fetchCategories(params = { per_page: 5 }) {
  return httpGet('/wp/v2/categories', { params })
}

export function fetchTags(params = { per_page: 15 }) {
  return httpGet('/wp/v2/tags', { params })
}

export function fetchPage(pageId) {
  return httpGet(`/wp/v2/pages/${pageId}`)
}

export function fetchPostDetail(id, type = 'posts') {
  return httpGet(`/wp/v2/${type}/${id}`)
}

export function fetchUserProfile() {
  return httpGet('/wp/v2/users/me')
}


export const apiRegistry = {
  posts: fetchPosts,
  categories: fetchCategories,
  tags: fetchTags,
  rankCategories: getMockRankCategories,  // 从全量数据动态聚合分类
}