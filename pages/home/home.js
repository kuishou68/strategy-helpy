import { METHOD, request } from "../../utils/request";

const XLSX = require("../../utils/excel.js");

Page({
  data: {
    noteText: "",
    requestUrl: "",
    requestValue: "GET",
    curlText: "",
    currTabPanel: "params",
    scroll: {},
    requestMethod: [
      { label: "GET", value: "GET" },
      { label: "POST", value: "POST" },
      { label: "PUT", value: "PUT" },
      { label: "DELETE", value: "DELETE" },
    ],
    urlColumns: {
      paramsColumns: [
        { title: "key", dataIndex: "key", width: 200, sowBodySlot: true },
        { title: "value", dataIndex: "value", width: 200, sowBodySlot: true },
      ],
      headerColumns: [
        { title: "key", dataIndex: "key", width: 160, sowBodySlot: true },
        { title: "value", dataIndex: "value", width: 240, sowBodySlot: true },
      ],
    },
    urlForm: {
      params: [
        { key: "", value: "", description: "" },
        { key: "", value: "", description: "" },
        { key: "", value: "", description: "" },
      ],
      header: [
        { key: "", value: "", description: "" },
        { key: "", value: "", description: "" },
        { key: "", value: "", description: "" },
      ],
      body: undefined,
    },
    resColumns: {
      header: [
        { title: "key", dataIndex: "key", width: 200, sowBodySlot: true },
        { title: "value", dataIndex: "value", width: 200, sowBodySlot: true },
      ],
    },
    resForm: {
      body: undefined,
      header: [
        { key: "", value: "" },
        { key: "", value: "" },
        { key: "", value: "" },
      ],
    },
  },
  onLoad(options) {},
  clear() {
    this.setData({
      curlText: "",
      requestUrl: "",
      requestValue: "GET",
      currTabPanel: "params",
      urlForm: {
        params: [
          { key: "", value: "", description: "" },
          { key: "", value: "", description: "" },
          { key: "", value: "", description: "" },
        ],
        header: [
          { key: "", value: "", description: "" },
          { key: "", value: "", description: "" },
          { key: "", value: "", description: "" },
        ],
        body: undefined,
      },
      resForm: {
        body: undefined,
        header: [
          { key: "", value: "" },
          { key: "", value: "" },
          { key: "", value: "" },
        ],
      },
    });
  },
  /**
   * 清空curl
   */
  clearCurl() {
    this.clear();
  },
  /**
   * 解析curl
   */
  curlChange(e) {
    let { detail: { value } } = e;
    let curlCmd = value;
    let { urlForm } = this.data;
    // 1.以换行空格，切割成一个数组
    let lines = curlCmd.split(/\r?\n/);
    // 2.匹配单引号中间关键信息
    let regex = /'~?.+'/g;
    // let method = "";
    let headers = [];
    // let data = "";
    let url = "";
    // 3.数组的每一项内容都是独立的
    lines.map((line) => {
      if (regex.test(line)) {
        // 4.去除将单引号，避免干扰后续的提取
        let line_str = line.match(regex)[0].replace(/\'/g, "");
        let headerStr = line_str.split(":", 2);
        // 5.带curl的为http 内容;
        if (line.indexOf("curl") !== -1) {
          url = line_str;
        } else if (line.indexOf("data-raw") !== -1) {
          // 6.带data-raw 暂且设置为post请求方式，其他请求方式一样的提取方式
          urlForm.body = line_str;
          this.setData({
            requestValue: "POST",
            urlForm: urlForm,
          });
        } else if (headerStr) {
          // 7.将文本以 ： 分隔成2部分作为键值，同时去除多余 ' :
          let headerKey = line_str.match(/~?.+: /g)[0].replace(/\: /g, "");
          let headerValue = line_str.match(/: ?.+/g)[0].replace(/\: /g, "");
          headers.push({
            key: headerKey,
            value: headerValue,
          });
        }
      }
    });
    urlForm.header = headers;
    this.setData({
      requestUrl: url,
      urlForm: urlForm,
    });
  },
  /**
   * 发送请求
   */
  sendRequest() {
    let { urlForm, requestValue, requestUrl, currTabPanel } = this.data;
    let { params, header, body } = urlForm;
    let props = {};
    header.map((res) => {
      let { key, value } = res;
      if (key && value) {
        props[key] = value;
      }
    });
    console.log("props==>", props);
    request(requestUrl, METHOD[requestValue], body, props).then((res) => {
      let { header, data } = res;
      let { resForm } = this.data;

      if (header) {
        let arr = [];
        resForm.header = [];

        if (header.Authorization) {
          let token = header.Authorization;
          wx.setStorageSync("Authorization", token);
        }

        Object.keys(header).forEach((key) => {
          arr.push({
            key: key,
            value: header[key],
          });
        });

        resForm.header = arr;
        this.setData({
          resForm: resForm,
        });
      }

      if (data) {
        resForm.body = JSON.stringify(data);
        this.setData({
          resForm: resForm,
        });
      }
    });
  },
  /**
   * 导出 excel
   */
  toExportExcel() {
    let { resForm: { body } } = this.data;
    let timestamp = Date.parse(new Date()) / 1000;
    let data = JSON.parse(body);
    let sheet = [];
    let title = ['trade_type', 'stock_code', 'stock_name', 'cur_price', 'trade_dt', 'trade_status', 'create_time']
    sheet.push(title)
    data.forEach(item => {
        let rowcontent = []
        rowcontent.push(item.trade_type);
        rowcontent.push(item.stock_code);
        rowcontent.push(item.stock_name);
        rowcontent.push(item.cur_price);
        rowcontent.push(item.trade_dt);
        rowcontent.push(item.trade_status);
        rowcontent.push(item.create_time);
        sheet.push(rowcontent)
    })
    console.log(sheet);
    // XLSX插件使用
    let ws = XLSX.utils.aoa_to_sheet(sheet);
    let wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, `${timestamp}`);
    let fileData = XLSX.write(wb, {
      bookType: "xlsx",
      type: "base64",
    });

    let filePath = `${wx.env.USER_DATA_PATH}/${timestamp}.xlsx`;
    // let filePath = `111.xlsx`;
    // 写文件
    const fs = wx.getFileSystemManager();
    fs.writeFile({
      filePath: filePath,
      data: fileData,
      encoding: "base64",
      success(res) {
        console.log(res);
        const sysInfo = wx.getSystemInfoSync();
        // 导出
        if (sysInfo.platform.toLowerCase().indexOf("windows") >= 0) {
          // 电脑PC端导出
          wx.saveFileToDisk({
            filePath: filePath,
            success(res) {
              console.log(res);
            },
            fail(res) {
              console.error(res);
              util.tips("导出失败");
            },
          });
        } else {
          // 手机端导出 打开文档
          wx.openDocument({
            filePath: filePath,
            success: function (res) {
              console.log("打开文档成功");
            },
            fail: console.error,
          });
        }
      },
      fail(res) {
        console.error(res);
        if (res.errMsg.indexOf("locked")) {
          wx.showModal({
            title: "提示",
            content: "文档已打开，请先关闭",
          });
        }
      },
    });
  },
  onUrlInput(e) {
    let { detail: { value } } = e;
    this.setData({
      requestUrl: value,
    });
  },
  /**
   * 填写表格完成
   */
  onTableChange(e) {
    let { detail } = e;
    let { currTabPanel } = this.data;
    this.data.urlForm[currTabPanel] = detail;
  },
  onTitlePicker() {
    this.setData({ visible: true, title: "请求方式" });
  },
  onPickerChange(e) {
    let { detail } = e;
    console.log(detail.value[0]);
    this.setData({
      requestValue: detail.value[0],
    });
  },
  onTabsChange(e) {
    let { detail: { value } } = e;
    this.setData({
      currTabPanel: value,
    });
  },
});
