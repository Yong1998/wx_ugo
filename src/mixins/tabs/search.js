import wepy from 'wepy'

export default class extends wepy.mixin {
  data = {
    // 文本框的值
    value: '',
    // 搜索建议列表
    suggestList: [],
    // 搜索历史关键词
    kwList: [],
  }

  onLoad() {
    //  页面加载期间读取本地存储的搜索关键词
    // 如果本地存储为空 返回一个空数组
    const kwList = wx.getStorageSync('kw') || []
    this.kwList = kwList
  }

  methods = {
    //   监听 搜索文本改变事件
    onChange(e) {
      //   console.log(e.detail)
      this.value = e.detail.trim()
      // 发送请求搜索建议列表
      if (e.detail.trim().length <= 0) {
        this.suggestList = []
        return
      }
      this.getSuggestList(e.detail)
    },
    // search 事件在用户点击键盘上的搜索按钮触发。
    onSearch(e) {
      //  console.log(e.detail)
      // 最新的搜索关键字
      const kw = e.detail.trim()
      // console.log(kw)
      // 搜索关键字为空 阻止跳转
      if (kw.length <= 0) {
        return
      }

      // 将用户的搜索关键词保存在本地Storage
      // this.kwList.indexOf(kw) 将最新关键词和数组对比
      // 如果数组存在相同的返回 0 不相同返回 -1
      if (this.kwList.indexOf(kw) === -1) {
        this.kwList.unshift(kw)
      }

      // 数组的 slice 方法，不会修改原数组，而是返回一个新的数组
      // 只允许数组内关键词个数保留10 因此
      this.kwList = this.kwList.slice(0, 10)
      wepy.setStorageSync('kw', this.kwList)

      // 跳转至商品列表页面
      wepy.navigateTo({
        url: '/pages/goods_list?query=' + kw,
      })
    },
    // cancel 事件在用户点击搜索框右侧取消按钮时触发
    onCancel() {
      this.suggestList = []
    },
    // 点击搜索建议 跳转至商品详情页面
    goGoodsdetail(id) {
      wepy.navigateTo({
        url: '/pages/goods_detail/main?goods_id=' + id,
      })
    },
    // 点击历史标签 跳转至商品列表页面
    goGoodsList(query) {
      wepy.navigateTo({
        url: '/pages/goods_list?query=' + query,
      })
    },
    // 点击清除按钮 清除搜索历史
    clearTag() {
      this.kwList = []
      wepy.setStorageSync('kw', [])
    },
  }
  computed = {
    isShowHistory() {
      // 如果输入框输入了文字，返回false 显示搜索建议
      if (this.value.length <= 0) {
        return true
      }
      // 显示搜索历史
      return false
    },
  }
  // 根据搜索参数 查询搜索列表
  async getSuggestList(searchText) {
    const { data: res } = await wepy.get('/goods/qsearch', { query: searchText })

    if (res.meta.status !== 200) {
      return wepy.showToast()
    }

    this.suggestList = res.message
    this.$apply()
    // console.log(this.suggestList)
  }
}
