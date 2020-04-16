/**
 * @desc base --actionTypes、actionCreator定义,调用actionCreator函数返回action对象或函数
 * @returns {baseActionTypes, baseActionCreator}
 */

import {keyMirror} from '../utils/mixin';

const baseActionTypes = keyMirror({
    SHOW_LOADING: '',
    HIDE_LOADING: '',
    HIDE_ALL_LOADING: '',
    SHOW_ALERT: '',
    HIDE_ALERT: '',
    SHOW_CONFIRM: '',
    HIDE_CONFIRM: '',
    SHOW_POPUP: '',
    HIDE_POPUP: '',
    SET_CODE: '',
    SET_USER_TOKEN: '',
    SHOW_MENU: '',
    HIDE_MENU: '',
    SET_TAB: '', //tab切换状态
    SET_SHOPPINGID: '', //设置商店id
    SET_ORDERSTATUS: '', //我的订单的tab状态
    SET_EVA: '', //全部评价的评价状态
    SET_USER_TYPE: '', //全部评价的评价状态
    SET_RETURN: '', //与原生右滑交互
    GET_AGREEMENT: '',
    SET_AGREEMENT: ''
});

/**
 * 显示加载中动画
 * @returns {action}
 */
function _showLoading() {
    return {
        type: baseActionTypes.SHOW_LOADING
    };
}

/**
 * 取消加载中动画
 *
 * @returns {action}
 */
function _hideLoading() {
    return {
        type: baseActionTypes.HIDE_LOADING
    };
}

/**
 * 取消全部加载中动画
 *
 * @returns {action}
 */
function _hideAllLoading() {
    return {
        type: baseActionTypes.HIDE_ALL_LOADING
    };
}

/**
 * 显示alert弹窗
 *
 * @param param
 * @returns {Function}
 *
 */
function _showAlert(params = {}) {
    const {title, message, btnText, callback} = params;
    return {
        type: baseActionTypes.SHOW_ALERT,
        playload: {
            alertTitle: title,
            alertMsg: message,
            alertBtnText: btnText,
            alertCb: callback
        }
    };
}

/**
 * 关闭alert弹窗
 *
 * @param param
 * @returns {action}
 *
 */
function _hideAlert() {
    return {
        type: baseActionTypes.HIDE_ALERT
    };
}

/**
 * 显示 confirm 弹窗
 *
 * @param param
 * @returns {Function}
 *
 */
function _showConfirm(params) {
    const {title, message, btnTexts, callbacks} = params;
    return {
        type: baseActionTypes.SHOW_CONFIRM,
        playload: {
            cfmTitle: title,
            cfmMsg: message,
            cfmBtnTexts: btnTexts,
            cfmCallbacks: callbacks
        }
    };
}

/**
 * 关闭confirm弹窗
 *
 * @return {action}
 */
function _hideConfirm() {
    return {
        type: baseActionTypes.HIDE_CONFIRM
    };
}

function _showMenu(flag) {
    return {
        type: baseActionTypes.SHOW_MENU,
        playload: {
            isShowMenu: flag
        }
    };
}

// function _showNothing(flag) {
//     return {
//         type: baseActionTypes.SHOW_NOTHING,
//         playload: {
//             isShowNothing: flag
//         }
//     };
// }

/**
 * 展示消息提示view
 * @param param
 *  type : 'error' | ‘success’ 默认 error,
 *  btnValue : 按钮上文字,
 *  onBtnClick : 按钮点击事件，
 *  msg : 提示消息,
 *  srcMsg : 原始消息
 * @returns {function}
 */
/*function _showTipView(param) {
    return function (dispatch, getState) {
        param.onBtnClick = param.onBtnClick || function () {
            dispatch(hideTipView());
        };
        dispatch(__showTipView(param));
    };
}*/

/*function __showTipView(param) {
    const {
        type, btnValue = '确定', onBtnClick,
        msg, srcMsg, btnClassName, btns, title, replacePattern
    } = param;
    return {
        type: SHOW_TIP_VIEW,
        playload: {
            tipViewType: type,
            tipViewBtnVal: btnValue,
            onTipViewBtnClick: onBtnClick,
            tipViewMsg: msg,
            tipViewSrcMsg: srcMsg,
            tipViewBtnClassName: btnClassName,
            tipViewBtns: btns,
            tipViewTitle: title,
            tipViewReplacePattern: replacePattern
        }
    };
}*/

/**
 * 隐藏消息提示view
 * @returns {action}
 */
/*function _hideTipView() {
    return {
        type: HIDE_TIP_VIEW
    };
}*/

function _setCode(code) {
    return {
        type: baseActionTypes.SET_CODE,
        playload: {
            code
        }
    };
}

function _setUserToken(userToken) {
    return {
        type: baseActionTypes.SET_USER_TOKEN,
        payload: {
            userToken
        }
    };
}

function  _setTab(value) {
    return {
        type: baseActionTypes.SET_TAB,
        playload: {
            value
        }
    };
}

function  _setShoppingId(id) {
    return {
        type: baseActionTypes.SET_SHOPPINGID,
        playload: {
            id
        }
    };
}

function  _setOrderStatus(id) {
    return {
        type: baseActionTypes.SET_ORDERSTATUS,
        playload: {
            id
        }
    };
}

function  _setEvaStatus(num) {
    return {
        type: baseActionTypes.SET_EVA,
        playload: {
            num
        }
    };
}
//设置用户当前的身份状态
function  _setUseType(num) {
    return {
        type: baseActionTypes.SET_USER_TYPE,
        playload: {
            num
        }
    };
}

//设置用户当前的身份状态
function  _setReturn(onOff) {
    return {
        type: baseActionTypes.SET_RETURN,
        playload: {
            onOff
        }
    };
}

function  _getAgreement(data) {
    // console.log(data);
    return {
        type: baseActionTypes.GET_AGREEMENT,
        payload: {
            data
        }
    };
}

function  _setAgreement(data) {
    return {
        type: baseActionTypes.SET_AGREEMENT,
        payload: {
            data
        }
    };
}

const baseActionCreator = {
    showLoading: _showLoading,
    hideLoading: _hideLoading,
    hideAllLoading: _hideAllLoading,
    showAlert: _showAlert,
    hideAlert: _hideAlert,
    showConfirm: _showConfirm,
    hideConfirm: _hideConfirm,
    setCode: _setCode,
    setUserToken: _setUserToken,
    showMenu: _showMenu,
    setTab: _setTab,
    setshoppingId: _setShoppingId,
    setOrderStatus: _setOrderStatus,
    setEvaStatus: _setEvaStatus,
    setUseType: _setUseType,
    setReturn: _setReturn,
    getAgreement: _getAgreement,
    setAgreement: _setAgreement
};


export {baseActionTypes, baseActionCreator};
