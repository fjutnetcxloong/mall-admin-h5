const {systemApi} = Utils;
const hrefCfg = {
    // 测境
    dev: {
        apiPath: 'https://csapi.zzha.vip/mall',
        apiShopPath: 'https://csapi.zzha.vip/rui',
        scan: 'https://csapp.zzha.vip/mall.html#'
    },
    // 预生产环境
    preProd: {
        apiPath: 'https://yapi.zzha.vip/mall',
        scan: 'https://yapp.zzha.vip/mall.html#'
    },
    // 生产环境
    production: {
        apiPath: 'https://api.zzha.vip/mall',
        scan: 'https://www.zzha.vip/mall.html#'
    },
    // 本地环境
    mock: {
        rootPath: 'https://csapi.zzha.vip/mall/'
    }
};
const currentHref = (function () {
    let url;
    if (systemApi.isProdEnv()) {
        url = hrefCfg.production;
    } else if (systemApi.ispreProdEnv()) {
        url = hrefCfg.preProd;
    } else {
        url = hrefCfg.dev;
    }
    return url;
}());

export {currentHref, hrefCfg};
