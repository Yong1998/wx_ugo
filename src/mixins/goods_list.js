import wepy from 'wepy'

export default class extends wepy.mixin {
  data = {
    // 商品列表参数
    // 查询关键词
    query: '',
    // 分类ID
    cid: '',
    // 当前页数
    pagenum: 1,
    // 当前显示数据条数
    pagesize: 10,
    // 总数据条数
    total: 0,
    // 商品列表数据
    goodsList: [],
    // 判断商品列表是否加载完毕
    isover: false,
    // 判断商品列表是否正在请求
    isloading: false,
  }
  // options  跳转地址所传递的参数
  onLoad(options) {
    // console.log(options)
    this.query = options.query || ''
    this.cid = options.cid || ''
    this.getGoodsList()
  }

  // 获取商品列表数据
  async getGoodsList(cb) {
    // 说明正在请求商品列表数据
    this.isloading = true
    const { data: res } = await wepy.get('/goods/search', {
      query: this.query,
      cid: this.cid,
      pagenum: this.pagenum,
      pagesize: this.pagesize,
    })
    if (res.meta.status !== 200) {
      return wepy.showToast()
    }
    // console.log(res)
    this.goodsList = [...this.goodsList, ...res.message.goods]
    this.total = res.message.total
    // 数据请求完成
    this.isloading = false
    // console.log(this.goodsList)
    this.$apply()
    // 只有当外界传递了 cb 回调函数之后，才调用 cb()
    cb && cb()
  }
  // 上拉触底才会触发本次事件
  onReachBottom() {
    // 先判断当前是否正在请求 防止网络卡顿造成重复发起数据请求
    // 如果isloading为true 说明正在发起数据请求 阻止后续操作
    if (this.isloading) {
      return
    }
    // 先判断加载数据是否有下一页
    // 如果页码乘以当前页显示条数的值大于等于 总的数据条数
    // 说明没有下一页，直接return出去
    if (this.pagenum * this.pagesize >= this.total) {
      // 数据记载完毕
      this.isover = true
      return
    }
    this.pagenum++
    this.getGoodsList()
  }

  // 下拉刷新操作
  onPullDownRefresh() {
    // 初始化基本参数
    ;(this.pagenum = 1), (this.total = 0), (this.goodsList = []), (this.isover = this.isloading = false)
    // 重新发起数据请求 传递一个回调函数
    this.getGoodsList(() => {
      // 停止下拉刷新的行为
      wepy.stopPullDownRefresh()
    })
  }
}
