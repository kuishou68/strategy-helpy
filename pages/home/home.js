// import list from './data/index';
Page({
    data: {
        noteText: "",
        requestUrl: "",
        requestValue: "GET",
        dateText: '',
        dateValue: [],
        scroll: {},
        requestMethod: [
            { label: 'GET', value: 'GET' },
            { label: 'POST', value: 'POST' },
            { label: 'PUT', value: 'PUT' },
            { label: 'DELETE', value: 'DELETE' },
        ],
        urlColumns:{
            paramsColumns: [
                { title: "key", dataIndex: "key", width: 110, sowBodySlot: true },
                { title: "value", dataIndex: "value", width: 150, sowBodySlot: true },
                { title: "description", dataIndex: "description", width: 150, sowBodySlot: true }
            ],
            headerColumns: [
                { title: "健", dataIndex: "key", width: 110, sowBodySlot: true },
                { title: "值", dataIndex: "value", width: 150, sowBodySlot: true },
                { title: "描述", dataIndex: "description", width: 150, sowBodySlot: true }
            ]
        },
        urlForm:{
            params:[
                {key: "", value: "", description: ""},
                {key: "", value: "", description: ""},
                {key: "", value: "", description: ""},
            ],
            header:[
                {key: "", value: "", description: ""},
                {key: "", value: "", description: ""},
                {key: "", value: "", description: ""},
            ]
        }

    },
    onLoad(options) {
    },
    sendRequest(){
        let { urlForm, requestValue, requestUrl, currTabPanel} = this.data;
        console.log(requestValue);
        console.log(requestUrl);
        console.log(urlForm[currTabPanel]);
    },
    onUrlInput(e){
        let { detail:{value} } = e;
        this.setData({
            requestUrl: value
        })
    },
    /**
     * 填写表格完成
     */
    onTableChange(e){
        let { detail } = e;
        let { currTabPanel } = this.data;
        this.data.urlForm[currTabPanel] = detail;
    },
    onTitlePicker() {
        this.setData({ visible: true, title: '请求方式' });
    },
    onPickerChange(e){
        let { detail } = e;
        console.log(detail.value[0]);
        this.setData({
            requestValue: detail.value[0]
        })
    },
    onTabsChange(event) {
      console.log(`Change tab, tab-panel value is ${event.detail.value}.`);
      this.setData({
        currTabPanel: event.detail.value
      })
    },
    onTabsClick(event) {
      console.log(`Click tab, tab-panel value is ${event.detail.value}.`);
    },
});
