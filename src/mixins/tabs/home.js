import wepy from 'wepy'

export default class extends wepy.mixin {
  data = {
    swiperList: [],
    cateList: [],
    floorList: [],
  }

  onLoad() {
    this.getSwiperData()
    this.getcatesData()
    this.getfloorData()
  }

  methods = {
    goGoodsPage(url) {
      wepy.navigateTo({
        url,
      })
    },
  }

  // 获取轮播图数据
  async getSwiperData() {
    // 发起get请求
    const { data: res } = await wepy.get('/home/swiperdata')

    if (res.meta.status !== 200) {
      return wepy.showToast()
    }

    // 请求成功
    this.swiperList = res.message
    // 必须调用这个方法 重新渲染页面
    this.$apply()
  }

  // 获取 分类导航数据
  async getcatesData() {
    const { data: res } = await wepy.get('/home/catitems')

    if (res.meta.status !== 200) {
      return wepy.showToast()
    }

    this.cateList = res.message
    this.$apply()
  }

  // 获取楼层数据
  async getfloorData() {
    const { data: res } = await wepy.get('/home/floordata')

    if (res.meta.status !== 200) {
      return wepy.showToast()
    }

    this.floorList = res.message
    this.$apply()
    console.log(this.floorList)
  }
}
