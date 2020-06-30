import wepy from 'wepy'

export default class extends wepy.mixin {
  data = {
    // 分类页面数据
    cateList: [],
    // 二级分类数据
    secondCate: [],
    // 左侧导航栏选中
    activeKey: 0,
    // 当前设备屏幕可视高度
    Windowheigth: '',
  }

  onLoad() {
    this.getWindowHeight()
    this.getCateList()
  }
  // 监听事件
  methods = {
    // 监听 侧边栏 选中事件
    onChange(event) {
      // 当前选中的索引
      console.log(event.detail)
      this.secondCate = this.cateList[event.detail].children
      console.log(this.secondCate)
    },
    // 监听点击事件 跳转至商品详情页 传入三级分类id
    goGoodPage(id) {
      wepy.navigateTo({
        url: '/pages/goods_list?cid=' + id,
      })
    },
  }
  // 获取分类页面数据
  async getCateList() {
    const { data: res } = await wepy.get('/categories')
    if (res.meta.status !== 200) {
      return wepy.showToast()
    }

    this.cateList = res.message
    this.secondCate = this.cateList[0].children
    this.$apply()

    // console.log(this.cateList)
  }

  // 动态获取屏幕可视高度
  async getWindowHeight() {
    // 获取设备信息
    const res = await wepy.getSystemInfo()

    if (res.errMsg === 'getSystemInfo:ok') {
      // 屏幕高度
      this.Windowheigth = res.windowHeight
      this.$apply()
    }
  }
}
