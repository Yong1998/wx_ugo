import wepy from 'wepy'

export default class extends wepy.mixin {
  data = {
    addressInfo: {},
    cart: [],
  }
  onLoad() {
    // 页面一渲染 获取收货地址
    this.addressInfo = wepy.getStorageSync('address') || null
    const newArr = this.$parent.globalData.cart.filter((x) => x.isCheck)
    this.cart = newArr
  }

  methods = {
    // 点击选择收货地址
    async chooseAddressBtn() {
      const res = await wepy.chooseAddress().catch((err) => err)
      // console.log(res)
      if (res.errMsg !== 'chooseAddress:ok') {
        return
      }
      this.addressInfo = res
      // 存储收货地址
      wepy.setStorageSync('address', res)
      this.$apply()
    },
    // 点击登陆 获取用户信息
    async getUserInfo(userInfo) {
      if (userInfo.detail.errMsg !== 'getUserInfo:ok') {
        return wepy.showToast('获取用户信息失败!')
      }
      console.log(userInfo)

      // 换取用户登录凭证code 返回promise
      const loginRes = await wx.login()
      if (loginRes.errMsg !== 'login:ok') {
        return wepy.showToast({
          title: '微信登陆失败-login',
        })
      }
      console.log(loginRes)

      // 微信用户登陆API 发起请求所需参数
      const loginParams = {
        code: loginRes.code,
        encryptedData: userInfo.detail.encryptedData,
        iv: userInfo.detail.iv,
        rawData: userInfo.detail.rawData,
        signature: userInfo.detail.signature,
      }
      console.log(loginParams)

      // 发起请求 换取登陆成功后的token
      const { data: res } = await wepy.request({
        url: 'https://www.uinav.com/api/public/v1/users/wxlogin',
        method: 'POST',
        data: loginParams,
      })
      console.log(res)
      return
      if (res.meta.status !== 200) {
        return wepy.showToast({ title: '微信登陆失败-token' })
      }
      console.log(res)
    },
  }

  computed = {
    isAddress() {
      if (this.addressInfo === null) {
        return false
      }
      return true
    },
    // 拼接收货地址
    addStr() {
      if (this.addressInfo === null) {
        return ''
      }
      let str =
        this.addressInfo.provinceName +
        this.addressInfo.cityName +
        this.addressInfo.countyName +
        this.addressInfo.detailInfo
      return str
    },
  }
}
