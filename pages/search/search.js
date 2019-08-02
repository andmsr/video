// pages/search/search.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    movie: {},
    keyword: '',
    page: 1,
    is_show: false,
    show_up: false,
    score: {},
  },
  /**
   * 搜索
   */
  searchFun: function(e){
    this.searchVideo()
  },
  /**
   * 获取输入的内容
   */
  getKeyword: function(e){
    var value = e.detail.value;
    this.setData({
      keyword: value
    });
    this.searchVideo();
  },
  /**
   * 清空数据
   */
  clearData: function(){
    this.setData({
      movie: {},
      page: 1
    });
  },
  /**
   * 获取搜索的影片
   */
  searchVideo: function(){
    var _this = this;
    if(!_this.data.keyword){
      wx.showToast({
        title: '输入为空',
        icon: 'success',
        duration: 1000,
        mask: true
      })
      return false;
    }
    wx.showToast({
      title: '加载中',
      icon: 'loading',
      duration: app.globalData.settime
    })
    wx.request({
      url: app.globalData.postUrl +'/searchVideo',
      data: { keyword: _this.data.keyword, page: _this.data.page, search: app.globalData.searchTrue},
      success: function(data){
        console.log(app.globalData.searchTrue);
        if(_this.data.page > 1){
          _this.setData({
            movie: _this.data.movie.concat(data.data),
            is_show: true,
            score: {}
          })
        }else{
          _this.setData({
            movie: data.data,
            is_show: true,
            score: {}
          })
        }
        wx.hideToast()
      }
    })
  },
  /**
   * 继续搜索，过滤后，可能返回数据不满足出现滚动条
   */
  searchNext: function(){

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if(this.data.is_show){
      var i = this.data.page;
      this.setData({
        page: i+1
      });
      this.searchVideo();
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  },
  /**
   * 监听滚动条
   */
  onPageScroll: function (e) {

  },
  /**
   * 回到顶部
   */
  goTop: function(){

  },
  /**
   * 排行
   */
  scoreList: function(){
    let _this = this;
    wx.showToast({
      title: '加载中',
      icon: 'loading',
      duration: app.globalData.settime,
      mask: true
    })
    wx.request({
      url: app.globalData.postUrl + '/getMovieRank',
      success: function (data) {
        _this.setData({
          score: data.data,
          is_show: false
        })
        wx.hideToast()
      }
    })
  }
})