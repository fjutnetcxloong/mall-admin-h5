/**
 * 对接原生方法
 */
import {store} from '../redux/store';
import {baseActionCreator} from '../redux/baseAction';
import {appHistory} from './appHistory';

const {systemApi: {removeValue, isAndroid}} = Utils;
const {LOCALSTORAGE} = Constants;
//统一封装原生接口请求
export const native = (str, obj, callBack = () => {}) => {
    if (!obj && isAndroid) {
        obj = 'null';
    } else if (!obj) {
        obj = {};
    }
    if (process.env.NATIVE) { window.DsBridge.call(str, obj, callBack) }
};

//在点击返回的时候可以根据页面的不同做一些处理
function doSomeing() {
    const href = window.location.href;
    if (href.includes('shopHome')) { //我的店铺退出的时候，清除掉一个店铺id，为了，优惠券到分类页面的时候的判断，
        store.dispatch(baseActionCreator.setshoppingId(''));
    } else if (href.includes('myOrder')) {
        window.DsBridge.call('setNavColor', {
            color: '#ff2d51'
        });
    }
}

//安卓底部回退按钮 // APP右滑
global.goBack = function () {
    const onOff = store.getState().get('base').get('returnStatus');
    if (!onOff) {
        doSomeing();
        if (appHistory.length() === 0 && process.env.NATIVE) {
            if (!window.location.href.includes('userAgreementDetail')) {
                window.DsBridge.call('goBack', isAndroid ? 'null' : {}, () => {});
            }
        } else {
            appHistory.goBack();
        }
    } else {
        store.dispatch(baseActionCreator.setReturn(false));
    }
    return 1;
};


//h5跳原生登录页时，清除缓存
global.clearCache = function () {
    removeValue(LOCALSTORAGE.USER_TOKEN); // 清除token,localstorage
    store.dispatch(baseActionCreator.setUserToken('')); // 清除redux的userToken
};


//原生跳h5重置历史
global.restHistory = function () {
// appHistory.reduction();
};

global.goBackApp = function () {
    // 跳回app时调用;
};


//返回封装
export function goBackModal() {
    if (process.env.NATIVE && appHistory.length() === 0) {
        // native('goBack');
        window.DsBridge.call('goBack', isAndroid ? 'null' : {}, () => {});
    } else {
        appHistory.goBack();
    }
}

//判断部分机型边框样式不兼容
export function nativeCssDiff() {
    const str = navigator.userAgent;
    // console.log(str, '型号参数查看');
    const phoneModal =  ['OPPO R7sm', 'm1 note', 'Letv X501', 'Redmi Note 4X', 'OPPO A59m', 'COL-AL10', 'HONOR'];
    let onOff = false;
    phoneModal.forEach(item => {
        if (str.indexOf(item) > -1) {
            onOff = true;
        }
    });
    return onOff;
}