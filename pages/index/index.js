//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    movie: {},
    keyword: '',
    open: false,
    imgShow:true,
    cate: '',
    showColor: '',
    showSlide: true,
    noMovie: true,
    markLayer: true
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  /**
 * 获取输入的内容
 */
  getKeyword: function (e) {
    var value = e.detail.value;
    this.setData({
      keyword: value
    });
    this.searchVideo();
  },
  /**
 * 清空数据
 */
  clearData: function () {
      this.setData({
        movie: {}
      });
  },
  /**
   * 获取搜索的影片
   */
  searchVideo: function () {
    var _this = this;
    if (!_this.data.keyword) {
      this.getMovieInfo()
      return false;
    }
    wx.showToast({
      title: '加载中',
      icon: 'loading',
      mask:true,
      duration: app.globalData.settime
    })
    wx.request({
      url: app.globalData.postUrl + '/searchVideoIn',
      data: { keyword: _this.data.keyword, page: _this.data.page},
      success: function (data) {
        _this.setData({
          movie: data.data
        })
        wx.hideToast()
      }
    })
  },
  //监听加载
  onLoad: function () {

    wx.getSystemInfo({
      success: function (res) {
        app.globalData.phoneModel = res.model;
      }
    })

    this.getMovieInfo()
  },
  getMovieInfo: function(page = 1){
    let that = this;
    wx.showToast({
      title: '加载中',
      icon: 'loading',
      mask: true,
      duration: app.globalData.settime
    })
    wx.request({
      url: app.globalData.postUrl+"/getVideo",
      data: { cate: that.data.cate,model: app.globalData.phoneModel},
      success: function(data){
        if(page == 2){
          that.setData({
            movie: that.data.movie.concat(data.data)
          })
        }else{
          that.setData({
            movie: data.data
          })
        }
        setTimeout(function () {
          wx.hideToast()
          that.setData({
            noMovie: that.data.movie.length == 0 ? false : true,
          })
        }, 1000)
      }
   })
  },
  /**
* 页面上拉触底事件的处理函数
*/
  onReachBottom: function () {
    this.getMovieInfo(2)
  },
  /**
   * 刷新
   */
  refreshFun: function(){
    this.getMovieInfo(2)
  },
  /**
 * 页面相关事件处理函数--监听用户下拉动作
 */
  onPullDownRefresh: function () {
    if(this.data.keyword != ''){
      return;
    }
    wx.showNavigationBarLoading();
    let that = this;
    wx.showToast({
      title: '加载中',
      icon: 'loading',
      mask: true,
      duration: app.globalData.settime
    })
    wx.request({
      url: app.globalData.postUrl + "/getVideo",
      data: { cate: that.data.cate },
      success: function (data) {
        that.setData({
          movie: data.data
        })
      },
      complete: function(){
        setTimeout(function () {
          wx.hideToast()
          wx.hideNavigationBarLoading() //完成停止加载
          wx.stopPullDownRefresh() //停止下拉刷新
        }, 1000)
      }
    })
  },
  /**
 * 监听滚动条
 */
  onPageScroll: function (e) {

  },
  tap_ch: function (e) {
    var _this = this;
    if (_this.data.open) {
      _this.setData({
        open: false
      });
    } else {
      _this.setData({
        open: true
      });
    }
    _this.setData({
      imgShow: _this.data.imgShow ? false : true,
      markLayer: _this.data.markLayer ? false : true
    });
  },
  /**
   * 选择类型
   */
  cateInfo:function(e){
    this.setData({
      cate: e.target.dataset.type,
      movie: {},
      open: false,
      imgShow: true,
      showColor: e.target.dataset.type,
      markLayer: true
    });
    this.getMovieInfo();
  }
})
