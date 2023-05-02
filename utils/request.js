import constant from "../constant";

const METHOD = {
    GET: "GET",
    POST: "POST",
    PUT: "PUT",
    DELETE: "DELETE",
};
/**
 * request封装
 * @param {*} url
 * @param {*} method
 * @param {*} params
 * @returns
 */
async function request(url, method, params,header={}) {
    const app = getApp();
    let token = wx.getStorageSync(constant.xsrfHeaderName);
    let tokenHeader = token ? {[constant.xsrfHeaderName]: token} : {};
    let momHeaders = Object.assign({
        device_id:constant.product,
        product:constant.product,
        tenant: "",
        Authorization: token
    }, header);
    let headers = Object.assign(tokenHeader, momHeaders);
    return new Promise((resolve, rejects) => {
        wx.request({
            url: url,
            data: params,
            method: method,
            header: headers,
            dataType:"json",
            success(res){
                resolve(res);
            },
            fail(err){
                let {status} = err;
                let msg = "";
                switch (status) {
                    case 401:
                    case 403:
                        msg = "已过期，请重新登录！";
                        app.loginOut();
                        break;
                    case 404:
                        msg = "接口不存在";
                        break;
                    case 500:
                    case 501:
                    case 502:
                    case 503:
                        msg = "服务器异常，请稍后重试";
                        break;
                    default:
                        msg = "请求异常，请稍后重试";
                        break;
                }
                wx.showToast({title:msg});
                rejects(err);
            }
        });
    });
}
export{
    METHOD,
    request
};
