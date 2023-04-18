// pages/subPackages/home/empPerformance/tdBody/tdBody.js
Component({
    properties: {
        item: {
            type: Object,
            default: {}
        },
        col: {
            type: Object,
            default: {}
        },
        index: {
            type: Number,
            default: 0
        }
    },
    data: {},
    lifetimes: {},
    methods: {
        toDetail() {
            let { item } = this.properties;
            console.log("item---", item);
            // this.triggerEvent('click', { value: item })
            // wx.navigateTo({
            //     url: `/pages/subPackages/mine/memberDetail/customerInfo/customerInfo?memberId=${item.fkMemberId}`
            // })
        }
    }
})
