// import list from './data/index';
Page({
    data: {
        // list,
        cityText: '',
        cityValue: [],
        dateText: '',
        dateValue: [],
        scroll: {},
        citys: [
            { label: 'GET', value: 'GET' },
            { label: 'POST', value: 'POST' },
            { label: 'PUT', value: 'PUT' },
            { label: 'DELETE', value: 'DELETE' },
        ],
        urlColumns:{
            paramsColumns: [
                { title: "key", dataIndex: "key", width: 120, sowBodySlot: true },
                { title: "value", dataIndex: "value", width: 100, sowBodySlot: true },
                { title: "description", dataIndex: "description", width: 100, sowBodySlot: true }
            ],
        },
        urlForm:{
            paramsList:[
                {key: "111", value: "222", description: "333"}
            ]
        }

    },
    onLoad(options) {
        /* const { path, q } = options;
        console.log(path);
        if (q) {
            const str = this.getQueryByUrl(decodeURIComponent(q));
            console.log(str, str.page);
            wx.navigateTo({
                url: `/pages/${str.page}/${str.page}`,
            });
        } */
    },
    onTitlePicker() {
        this.setData({ cityVisible: true, cityTitle: '请求方式' });
    },
    onTabsChange(event) {
      console.log(`Change tab, tab-panel value is ${event.detail.value}.`);
    },
    onTabsClick(event) {
      console.log(`Click tab, tab-panel value is ${event.detail.value}.`);
    },

    clickHandle(e) {
        let { name, path = '' } = e.detail.item;
        if (!path) {
            name = name.replace(/^[A-Z]/, (match) => `${match}`.toLocaleLowerCase());
            name = name.replace(/[A-Z]/g, (match) => {
                return `-${match.toLowerCase()}`;
            });
            path = `/pages/${name}/${name}`;
        }
        wx.navigateTo({
            url: path,
            fail: () => {
                wx.navigateTo({
                    url: '/pages/home/navigateFail/navigateFail',
                });
            },
        });
    },
    onShareAppMessage() {
        return {
            title: 'TDesign UI',
            path: '/pages/home/home',
        };
    },
    getQueryByUrl(url) {
        const data = {};
        const queryArr = `${url}`.match(/([^=&#?]+)=[^&#]+/g) || [];
        if (queryArr.length) {
            queryArr.forEach((para) => {
                const d = para.split('=');
                const val = decodeURIComponent(d[1]);
                if (data[d[0]] !== undefined) {
                    data[d[0]] += `,${val}`;
                }
                else {
                    data[d[0]] = val;
                }
            });
        }
        return data;
    },
});
