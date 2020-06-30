import wepy from 'wepy'
export default class extends wepy.mixin {
  data = {
    // 商品详情id
    goods_id: '',
    // 商品详情数据
    goodsDetail: [],
    // 商品标签页选中
    active: 0,
    // 收货地址
    addressInfo: [],
  }
  onLoad(optain) {
    console.log(optain)
    this.goods_id = optain.goods_id
    this.getGoodsDetailList()
  }

  methods = {
    // 点击预览图片
    preview(current) {
      // 调用小程序图片预览API
      wx.previewImage({
        // 当前显示图片的http链接
        current: current,
        // 需要预览的图片http链接列表
        // map 方法可以循环该数组 拿到所需的item项 组成新数组
        urls: this.goodsDetail.pics.map((x) => x.pics_big),
      })
    },

    // 点击获取收获地址
    async chooseAddress() {
      // 通过 wepy.chooseAddress()函数，选择收货地址 返回promise
      // catch 获取返回结果的抛出异常
      const res = await wepy.chooseAddress().catch((err) => err)
      // console.log(res)
      if (res.errMsg !== 'chooseAddress:ok') {
        return wepy.showToast('获取收货地址失败')
      }
      this.addressInfo = res
      // 将选择的收获地址，存储到本地 Storage 中
      wepy.setStorageSync('address', res)
      this.$apply()
    },
    // 客服 购物车
    onClickIcon() {},
    //  加入购物车
    addToCart() {
      this.$parent.addGoodsToCart(this.goodsDetail)
      // console.log(this.goodsDetail)
      wepy.showToast({
        title: '已加入购物车',
        icon: 'success',
      })
    },
  }
  // 计算属性
  computed = {
    // 拼接 收货地址
    addressStr() {
      if (this.addressInfo === null) {
        return '请选择收货地址'
      }
      const addr = this.addressInfo
      const str = addr.provinceName + addr.cityName + addr.countyName + addr.detailInfo
      return str
    },
    // 所有已勾选的商品数量
    total() {
      return this.$parent.globalData.total
    },
  }

  // 获取商品详情数据
  async getGoodsDetailList() {
    const { data: res } = await wepy.get('/goods/detail', { goods_id: this.goods_id })
    if (res.meta.status !== 200) {
      return wepy.showToast()
    }
    console.log(res)
    this.goodsDetail = res.message
    this.$apply()
  }
}
