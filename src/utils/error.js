/**
 * 错误处理
 * msg 错误
 * srcMsg 原始错误
 * dealMode 错误处理模式，0 bypass不处理 1 toast提示 2 alert提示 3 confirm提示 4 tipview
 * errNo 错误号
 * srcErrNo 原始错误号
 */
/* eslint-disable */
class ErrObj {
    constructor(msg, srcMsg, dealMode, errNo, srcErrNo, respbody, callbacks) {
        this.msg = msg || '';
        this.srcMsg = srcMsg || '';
        this.dealMode = dealMode || ErrUtil.D_MODE_BYPASS;
        this.errNo = errNo || '-9999';// -9999表示本地错误
        this.srcErrNo = srcErrNo || '';
        this.respbody = respbody || {};
        this.callbacks = callbacks || [];
    }
}

export const ErrUtil = {
    D_MODE_BYPASS: 0,
    D_MODE_TOAST: 1,
    D_MODE_ALERT: 2,
    D_MODE_CFM: 3,
    D_MODE_TIPVIEW: 4,
    /**
     * 生成统一错误对象
     * @param msg 一级错误说明
     * @param srcMsg 二级错误说明
     * @param isFatal 是否致命错误 如果是致命错误，
     * @returns {{msg: *, srcMsg: *, isFatal: (*|boolean)}}
     */
    genErr: function (msg, srcMsg, dealMode, errNo, srcErrNo, callbacks) {
        return new ErrObj(msg, srcMsg, dealMode, errNo, srcErrNo, callbacks);
    },
    /**
     * 生成前段错误
     * @param errNo
     * @param isFatal
     * @returns {Error}
     */
    genFErr(errNo, dealMode, callbacks) {
        let msg = this.msgMapping[errNo];
        // if (msg == null || msg == '') {
        //     msg = this.msgMapping[this.errDef.ERR_OTHER];
        //     errNo = this.errDef.ERR_OTHER;
        // }
        return new ErrObj(msg, '', dealMode, errNo, '', callbacks);
    },
    /**
     * 根据ajax请求返回结果，生产统一错误对象
     * @param ajaxErr
     * @returns {ErrObj}
     */
    genAjaxErr(ajaxErr, dealMode, callbacks) {
        const {respHead, resphead} = ajaxErr;
        let respCode, respMsg, respDetails;
        let respbody = ajaxErr.respbody || ajaxErr.respBody;
        if (resphead) {
            respCode = resphead.respcode;
            respDetails = resphead.respdetails;
        } else if (respHead) {
            respCode = respHead.respCode;
            respMsg = respHead.respMsg;
            respDetails = respHead.respDetails;
        }
        let srcErrNo = '',
            srcMsg = '';
        if (!respDetails) {
            srcMsg = '请求异常';
        } else if (Object.prototype.toString.call(respDetails) === '[object String]') {
            srcErrNo = respCode;
            srcMsg = respDetails;
        } else {
            srcErrNo = respDetails[0];
            if (respDetails.length > 1) srcMsg = respDetails[1];
        }
        return new ErrObj(respMsg, srcMsg, dealMode, respCode, srcErrNo, respbody, callbacks);
    },

    errDef: {
        // 错误定义
        ERR_HTTP_STATUS_404: '404',
        ERR_HTTP_STATUS_500: '500',
        ERR_NETWORK: 'FE_000001',

        ERR_CORDOVA: 'FE_001001',
        ERR_CORDOVA_SIGN_MSG: 'FE_001002',
        ERR_CORDOVA_GEN_CSR: 'FE_001003',
        ERR_CORDOVA_IMPORT_CSR: 'FE_001004',
        ERR_CORDOVA_GET_CERT: 'FE_001005',
        ERR_CORDOVA_GET_LOCATION: 'FE_001006',
        ERR_CORDOVA_PHOTO: 'FE_001007',
        ERR_CORDOVA_CALL_CAMERA: 'FE_001008',
        ERR_CORDOVA_GET_TRADE_ACCOUNT: 'FE_001009',
        ERR_NO_HANDLE: 'FE_999998',
        ERR_OTHER: 'FE_999999',
        // 消息定义
        INFO_NO_LOGIN: 'FI_000001',
        INFO_RISK_OVERTIME: 'FI_000002',
        // 客户在登录页点击回退
        INFO_CORDOVA_LOGIN_BACK: 'FI_001001',
        INFO_CORDOVA_NO_CERT: 'FI_001002',
        INFO_CORDOVA_HAS_CERT: 'FI_001003',

        INFO_CORDOVA_NO_PIC_DATA: 'FI_001004',

        INFO_NO_HANDLE: 'FI_999998'

    },

    msgMapping: {
        404: '您的网络好像有问题',
        500: '服务器开小差了，请稍后',

        FE_000001: '抱歉，网络请求异常，请稍后再试',
        FE_001001: '抱歉，处理异常，请稍后再试',
        FE_001002: '抱歉，CA证书加密失败，请退出并重试',
        FE_001003: '抱歉，CA证书生成失败，请退出并重试',
        FE_001004: '抱歉，CA证书导入失败，请退出并重试',
        FE_001005: '抱歉，暂时无法获取证书',
        FE_001006: '抱歉，暂时无法获取您的位置信息，请确认是否开启',
        FE_001007: '抱歉，暂时无法拍摄，请稍后再试',
        FE_001008: '抱歉，调用摄像头失败，请确认是否允许访问摄像头',
        FE_001009: '抱歉，获取交易账号列表失败，请稍后再试',
        FE_999999: '抱歉，处理异常，请稍后再试',

        FI_000002: '抱歉，您的风险测评已经过期，请重新测评',
        FI_001002: '您尚未安装CA证书，请先安装',
        FI_001003: '您已经安装了CA证书'
    },
    /**
     * 统一处理错误
     * @param e
     * @returns {boolean}
     */
    process: (e) => {
        const {errNo, srcErrNo, msg, srcMsg} = e;
        if (errNo === '0703' || errNo == 'I100032' || errNo == 'W100024' || errNo == 'I100001'
            || errNo == 'I100010') {
            // 全局处理未登录情况
            EventUtil.showToast(['', msg, 2]);
            hashHistory.push(HashCfg.login);
            return true;
        } else if (errNo === 'o021') {
            EventUtil.showToast(['', msg, 2]);
            hashHistory.push(HashCfg.unionacclogin);
            return true;
        }
        return false;
    },
    genNoHandleErr: () => {
        return new ErrObj('', '', null, ErrUtil.errDef.INFO_NO_HANDLE, '', null);
    },
    /**
     * 判断是否是无需处理的错误
     * @param e
     * @returns {boolean}
     */
    isNoHandle: (e) => {
        let {errNo} = e;
        return errNo == ErrUtil.errDef.INFO_NO_HANDLE ||
        errNo == ErrUtil.errDef.ERR_NO_HANDLE ?
            true : false;
    },
    /**
     * 是否是需要处理的错误
     * @param e
     * @returns {boolean}
     */
    needHandle: (e) => {
        return !ErrUtil.isNoHandle(e);
    }
};

