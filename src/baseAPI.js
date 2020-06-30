import wepy from 'wepy'

// 配置请求根路径
const baseURL = 'https://www.uinav.com/api/public/v1'

// 消息弹框
// 在es6中可以直接为参数赋值 
wepy.showToast = function (str = '请求数据失败') {
    wepy.showToast({
        // 提示框文字
        title: str,
        // 提示框icon
        icon: 'none',
        // 提示延迟时间
        duration: 1500,
    })
}

// get请求API
// @data 请求参数对象
// @url 必须以 / 开头的字符串
wepy.get = function (url, data = {}) {
    return wepy.request({
        url: baseURL + url,
        method: 'GET',
        data
    })
}

// POST请求API
// @data 请求参数对象
// @url 必须以 / 开头的字符串
wepy.post = function (url, data = {}) {
    return wepy.request({
        url: baseURL + url,
        method: 'POST',
        data
    })
}