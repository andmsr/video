// pages/video/video.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
      mark: '',
      name: '',
      movie: {},
      video_url: '',
      _select: 0,
      is_like: {},
      is_show_info: false,
      is_show_thunder: false,
      start_time: 120,//开始视频播放位置
      videoContext:'',
      cImg: '../image/collection_n.png',
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var mark  = options.mark;
    var title = options.title;
    var _this = this; 
    _this.videoContext = wx.createVideoContext('myVideo');
    wx.showToast({
      title: '加载中',
      icon: 'loading',
      mask: true,
      duration: app.globalData.settime
    })
    wx.request({
      url: app.globalData.postUrl +"/getVideoInfo",
      data: { search_url: mark, model: app.globalData.phoneModel},
      success: function (data) {
        var no_close = 0;
        _this.setData({
          movie: data.data,
          name: title,
          is_show_info: true,
          mark: mark,
          cImg: data.data.collect ? '../image/collection_i.png' : '../image/collection_n.png'
        })
        if (data.data.thunder.length>0){
          _this.setData({
            is_show_thunder: true,
          })
        }
        if(!data.data.video_url){
          wx.showToast({
            title: '没有资源',
            icon: 'success',
            duration: 3000
          })
          no_close = 1;
        }else{
          _this.setData({
            video_url: data.data.video_url
          })
        }
        if(no_close == 0){
          wx.hideToast()
        }
      }
    })
    wx.request({
      url: app.globalData.postUrl +"/getRand",
      data: { mark: mark },
      success: function (data) {
        _this.setData({
          is_like: data.data,
        })
      }
    })

  },
  changePlay: function(e){
    var mark  = e.target.dataset.mark;
    var num   = e.target.dataset.id;
    var _this = this;
    wx.showToast({
      title: '加载中',
      icon: 'loading',
      mask: true,
      duration: app.globalData.settime
    })
    wx.request({
      url: app.globalData.postUrl +"/getVideoInfo",
      data: { video_url: mark },
      success: function (data) {
        console.log(data.data)
        _this.setData({
          video_url: data.data.video_url,
          _select: num
        })
        setTimeout(function () {
          wx.hideToast()
        }, 1000)
      }
    })
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
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  },
  /**
   * 复制链接
   */
  copyThunder: function(e){
    var copy = e.target.dataset.copy;
    wx.setClipboardData({
      data: copy,
      success: function (res) {
        wx.getClipboardData({
          success: function (res) {
            wx.showToast({
              title: '复制成功',
              icon: 'success',
              duration: 2000
            })
          }
        })
      }
    })
  },
  /**
   * 收藏
   */
  collectionFun: function(){
    var _this = this;
    var mark  = _this.data.mark;
    wx.request({
      url: app.globalData.postUrl +'/collectionVideo',
      data: { mark: mark, model: app.globalData.phoneModel},
      success: function(data){
          _this.setData({
            cImg: data.data.code == 200 ? '../image/collection_i.png' : '../image/collection_n.png'
          })
          wx.showToast({
            title: data.data.msg,
            icon: 'success',
            duration: 2000
          })
      }
    })
  }
})