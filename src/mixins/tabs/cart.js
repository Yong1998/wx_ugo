import wepy from 'wepy'

export default class extends wepy.mixin {
  data = {
    // 购物车数据
    cart: [],
  }
  onLoad() {
    // 获取全局共享的购物车数据
    this.cart = this.$parent.globalData.cart
  }

  methods = {
    // 监听计数器变化
    countChange(e) {
      // console.log(e)
      // 选中数量变化的商品id
      const id = e.target.dataset.id
      // 数量变化值
      const count = e.detail
      this.$parent.upDataGoodsCount(id, count)
    },
    // 监听复选框的变化
    statusChange(e) {
      // console.log(e)
      // 选中复选框的商品id
      const id = e.target.dataset.id
      // 复选框的状态
      const status = e.detail
      this.$parent.upDataGoodsStatus(id, status)
    },
    // 点击删除商品
    close(id) {
      // console.log(id)
      this.$parent.removeGoodsByid(id)
    },
    // 监听全选状态变化
    fullCheckedChange(e) {
      // console.log(e)
      this.$parent.fullCheckedStatus(e.detail)
    },
    // 提交订单 跳转至订单页面
    submitOrder() {
      if (this.totalPrice <= 0) {
        return wepy.showToast({
          title: '订单金额不能为零',
          icon: '',
        })
      }
      wepy.navigateTo({
        url: '/pages/order',
      })
    },
  }

  computed = {
    // 判断是否是空购物车
    isEmpty() {
      if (this.cart.length <= 0) {
        return true
      }
      return false
    },
    // 计算 购物总的价格
    totalPrice() {
      let total = 0
      this.cart.forEach((x) => {
        if (x.isCheck) {
          total += x.price * x.count
        }
      })
      return total * 100
    },
    // 判断是否是全选状态
    isFullChecked() {
      let c = 0
      let cartsNum = this.cart.length
      // 循环数组 计算选中的商品个数
      this.cart.forEach((x) => {
        if (x.isCheck) {
          c++
        }
      })
      // 如果商品个数 和 选中个数一致 则为全选
      return cartsNum === c
    },
  }
}
