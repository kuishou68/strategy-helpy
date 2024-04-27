Page({
    data: {
      currTab: 'home',
      list: [
        { value: 'home', label: '首页' },
        { value: 'app', label: '应用' },
        { value: 'user', label: '我的' },
      ],
      current: 0,
      autoplay: false,
      duration: 500,
      interval: 5000,
      swiperList: [
        `https://tdesign.gtimg.com/mobile/demos/swiper1.png`,
        `https://tdesign.gtimg.com/mobile/demos/swiper2.png`,
        `https://tdesign.gtimg.com/mobile/demos/swiper1.png`,
      ]
    },
  
    onSwiper(e) {
      const {
        detail: { current, source },
      } = e;
      console.log(current, source);
    },
    onTabs(e) {
        this.setData({
          currTab: e.detail.value,
        });
        console.log("currTab--->", this.data.currTab);
    },
  });
  