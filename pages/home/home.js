import { METHOD, request } from "../../utils/request";

Page({
    data: {
        noteText: "",
        requestUrl: "",
        requestValue: "GET",
        dateText: "",
        curlText: "",
        currTabPanel: "params",
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
                { title: "key", dataIndex: "key", width: 200, sowBodySlot: true },
                { title: "value", dataIndex: "value", width: 200, sowBodySlot: true }
            ],
            headerColumns: [
                { title: "key", dataIndex: "key", width: 160, sowBodySlot: true },
                { title: "value", dataIndex: "value", width: 240, sowBodySlot: true }
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
        },
        resColumns:{
            header: [
                { title: "key", dataIndex: "key", width: 200, sowBodySlot: true },
                { title: "value", dataIndex: "value", width: 200, sowBodySlot: true }
            ]
        },
        resForm:{
            body: undefined,
            header:[
                {key: "", value: ""},
                {key: "", value: ""},
                {key: "", value: ""},
            ]
        },

    },
    onLoad(options) {
    },
    /**
     * 发送请求
     */
    sendRequest(){
        let { urlForm, requestValue, requestUrl, currTabPanel} = this.data;

        let params = {};
        urlForm[currTabPanel].map((res) =>{
            let { key, value } = res;
            if(key && value){
                params[key] = value;
            }
        });
        console.log("params==>", params);
        request(requestUrl, METHOD[requestValue], params).then((res) => {
            let { header, data } = res;
            let { resForm } = this.data;

            if(header){
                let arr = [];
                resForm.header = [];

                if(header.Authorization){
                    let token = header.Authorization;
                    wx.setStorageSync("Authorization", token);
                }

                Object.keys(header).forEach(key => {
                    arr.push({
                        key: key,
                        value: header[key]
                    })
                });

                resForm.header = arr;
                this.setData({
                    resForm: resForm
                });

            }

            if(data){
                resForm.body = JSON.stringify(data);
                this.setData({
                    resForm: resForm
                })
            }
        });
    },
    onUrlInput(e){
        let { detail:{value} } = e;
        this.setData({
            requestUrl: value
        })
    },
    /**
     * 解析curl
     */
    curlChange(e){
        let { detail:{value} } = e;
        let curlCmd = value;
        let { urlForm } = this.data;
        let lines = curlCmd.split(/\r?\n/);
        let regex = /'~?.+'/g;
        // let method = "";
        let headers = [];
        // let data = "";
        let url = "";

        lines.map((line) => {
            if(regex.test(line)){
                let line_str = line.match(regex)[0].replace(/\'/g, "");
                let headerStr = line_str.split(":", 2);
                // 带curl的为http .replace(/\'|: /g, ""); .replace(/\'|: /g, "");
                if(line.indexOf("curl") !== -1){
                    url = line_str;
                } else if(headerStr) {
                    // 将文本以 ： 分隔成2部分作为键值，同时去除多余 ' :  [0].replace(/\: /g, "")
                    let headerKey = line_str.match(/~?.+: /g)[0].replace(/\: /g, "");
                    let headerValue = line_str.match(/: ?.+/g)[0].replace(/\: /g, "");
                    headers.push({
                        key: headerKey,
                        value: headerValue
                    })
                }
            }
        })
        // console.log(headers);

        urlForm.header = headers;
        this.setData({
            requestUrl: url,
            urlForm: urlForm
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
