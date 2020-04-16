/**
 *  my模块 epics
 */
import {myActionTypes as actionTypes} from '../index';
import 'rxjs/add/operator/switchMap';

const {urlCfg} = Configs;
const {errorType} = Utils;

// 我的页面
export function getMyInfo(action$) {
    return action$.ofType(actionTypes.GET_MYINFO)
        .switchMap(
            (action) => XHR.fetch(urlCfg.personalCenter, {data: action.payload.data})
                .map(res => {
                    if (res && res.status !== 0) {
                        return errorType(res);
                    }
                    return ({
                        type: actionTypes.SET_MYINFO,
                        payload: {
                            data: res.data
                        }
                    });
                })
        );
}
// 用户信息
export function getUserInfo(action$) {
    return action$.ofType(actionTypes.GET_USERINFO)
        .switchMap(
            (action) => XHR.fetch(urlCfg.settingPageData)
                .map(res => {
                    if (res && res.status !== 0) {
                        return errorType(res);
                    }
                    return ({
                        type: actionTypes.SET_USERINFO,
                        payload: {
                            data: res.data
                        }
                    });
                })
        );
}
// 收货地址
export function getAddress(action$) {
    return action$.ofType(actionTypes.GET_ADDRESS)
        .switchMap(
            (action) => XHR.fetch(urlCfg.addressManagement)
                .map(res => {
                    if (res && res.status !== 0) {
                        return errorType(res);
                    }
                    return ({
                        type: actionTypes.SET_ADDRESS,
                        payload: {
                            data: res.data
                        }
                    });
                })
        );
}

// 修改昵称
export function getNickName(action$) {
    return action$.ofType(actionTypes.GET_NICKNAME)
        .switchMap(
            (action) => XHR.fetch(urlCfg.personalCenter)
                .map(res => {
                    if (res && res.status !== 0) {
                        return errorType(res);
                    }
                    return ({
                        type: actionTypes.SET_NICKNAME,
                        payload: {
                            data: res.data.info.nickname
                        }
                    });
                })
        );
}

// 获取当前区域
export function getArea(action$) {
    return action$.ofType(actionTypes.GET_AREA)
        .switchMap(
            (action) => XHR.fetch(urlCfg.settingPageData)
                .map(res => {
                    if (res && res.status !== 0) {
                        return errorType(res);
                    }
                    return ({
                        type: actionTypes.SET_AREA,
                        payload: {
                            data: res.data.address
                        }
                    });
                })
        );
}

// 获取UID
export function getUid(action$) {
    return action$.ofType(actionTypes.GET_UID)
        .switchMap(
            (action) => XHR.fetch(urlCfg.getOriginalID)
                .map(res => {
                    if (res && res.status !== 0) {
                        return errorType(res);
                    }
                    return ({
                        type: actionTypes.SET_UID,
                        payload: {
                            data: res.data
                        }
                    });
                })
        );
}


// 获取银行卡
export function getBankCardList(action$) {
    return action$.ofType(actionTypes.GET_BANK)
        .switchMap(
            (action) => XHR.fetch(urlCfg.getTheBankCardList)
                .map(res => {
                    if (res && res.status !== 0) {
                        return errorType(res);
                    }
                    return ({
                        type: actionTypes.SET_BANK,
                        payload: {
                            data: res.data
                        }
                    });
                })
        );
}

// 获取更多账户
export function switchAccountList(action$) {
    return action$.ofType(actionTypes.GET_ACCOUT)
        .switchMap(
            (action) => XHR.fetch(urlCfg.getAccountInfo)
                .map(res => {
                    if (res && res.status !== 0) {
                        return errorType(res);
                    }
                    return ({
                        type: actionTypes.SET_ACCOUT,
                        payload: {
                            obj: res.data.list
                        }
                    });
                })
        );
}
// 会员登录
/*export function login(action$) {
    return action$.ofType(actionTypes.LOGIN)
        .switchMap(
            (action) => XHR.fetch(urlCfg.login, {method: 'post', data: action.payload.data})
                .map(data => {
                    if (data.status !== 0) {
                        return errorType(data);
                    }
                    return ({
                        type: actionTypes.SET_TOKEN,
                        payload: {
                            token: data.data.token
                        }
                    });
                })
        );
}*/

/*export function login2(action$) {
    return action$.ofType(actionTypes.LOGIN2)
        .switchMap(
            (action) => XHR.fetch(urlCfg.login2, {method: 'post', data: action.payload.data})
                .map(data => {
                    if (data.status !== 0) {
                        return errorType(data);
                    }
                    return ({
                        type: actionTypes.SET_TOKEN,
                        payload: {
                            token: data.token
                        }
                    });
                })
        );
}*/

// 短信接口
/*export function getAuthCode(action$) {
    return action$.ofType(actionTypes.GET_AUTH_CODE)
        .switchMap(
            (action) => XHR.fetch(urlCfg.checkcode, {method: 'post', data: action.payload.data})
                .map(data => {
                    if (data.status !== 0) {
                        return errorType(data);
                    }
                    return ({
                        type: actionTypes.SET_AUTH_CODE,
                        payload: {
                            bool: true
                        }
                    });
                })
        );
}*/

// 获取姓名和二维码
/*export function getQrCode(action$) {
    console.log('获取姓名和二维码');
    return action$.ofType(actionTypes.GET_QRCODE)
        .switchMap(
            (action) => XHR.fetch(urlCfg.qrcode, {method: 'post', data: {token: action.payload.token}})
                .map(data => {
                    if (data.status !== 0) {
                        return errorType(data);
                    }
                    return ({
                        type: actionTypes.SET_QRCODE,
                        payload: {
                            userName: data.data.realname,
                            qrcode: data.data.source
                        }
                    });
                })
        );
}*/
