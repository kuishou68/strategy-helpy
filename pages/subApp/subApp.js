Page({
    data: {
      appList: [
        { text: "Curl解析", imgUrl: "https://tdesign.gtimg.com/mobile/demos/example1.png", pageUrl: "subpackages/curlTool/curlTool" },
        { text: "族谱", imgUrl: "https://tdesign.gtimg.com/mobile/demos/example2.png", pageUrl:"subpackages/genealogy/genealogy" },
        { text: "策略助手", imgUrl: "https://tdesign.gtimg.com/mobile/demos/example3.png", pageUrl:"" },
        { text: "算法", imgUrl: "https://tdesign.gtimg.com/mobile/demos/example1.png", pageUrl:"" },
      ]
    },
    onClickItem(e){
      let { item={} } = e.target.dataset;
      console.log("item---->", item);
      wx.navigateTo({
        url: item.pageUrl
      })
    }
  });