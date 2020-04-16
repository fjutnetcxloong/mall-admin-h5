/**
 *  baseReducer函数定义
 */

import Immutable from 'immutable';
import {baseActionTypes as ActionTypes} from '../baseAction';

const {LOCALSTORAGE} = Constants;
const {createReducer} = Utils,
    userType = {
        userType: '' //用户当前的身份证状态
    },
    loadingState = {
        loadingShow: false,
        loadingNum: 0
    },
    alertState = {
        alertShow: false,
        alertTitle: '',
        alertMsg: '',
        alertBtnText: '',
        alertCallback: null
    },
    confirmState = {
        confirmShow: false,
        cfmTitle: '',
        cfmMsg: '',
        cfmBtnTexts: [],
        cfmCallbacks: null
    },
    popupState = {
        popupShow: false,
        popAnimationType: ''
    },
    acctState = {
        code: null,
        userToken: null
    },
    menuState = {
        showMenu: true
    },
    tabValue = {
        tabValue: '', //tab栏状态
        evaStatus: 0
    },
    shoppingId = {
        shoppingId: '' //进入店铺储存商店id
    },
    orderStatus = {
        orderStatus: '' //我的订单的tab状态 默认全部
    },
    returnStatus = {
        returnStatus: false //与原生右滑交互
    },
    agreement = {
        agreementInfo: {}
    };
/**
 * baseState 初始化 1
 * @type {state}
 */
const baseState = Immutable.fromJS({
    ...userType,
    ...loadingState,
    ...alertState,
    ...confirmState,
    ...popupState,
    ...acctState,
    ...menuState,
    ...tabValue,
    ...shoppingId,
    ...orderStatus,
    ...returnStatus,
    ...agreement
});

export function resetLoadingNum() {
    // loadingNum = 0;
}

export default {
    base: createReducer(baseState, {
        [ActionTypes.SHOW_LOADING](state) {
            let loadingNum = state.get('loadingNum');
            return state.set('loadingShow', true)
                .set('loadingNum', ++loadingNum);
        },
        [ActionTypes.HIDE_LOADING](state) {
            let loadingNum = state.get('loadingNum');
            // console.log(loadingNum);
            loadingNum = loadingNum > 0 ? --loadingNum : 0;
            if (loadingNum === 0) {
                return state.set('loadingShow', false)
                    .set('loadingNum', loadingNum);
            }
            return state.set('loadingNum', loadingNum);
        },
        [ActionTypes.HIDE_ALL_LOADING](state) {
            return state.set('loadingShow', false)
                .set('loadingNum', 0);
        },
        [ActionTypes.SHOW_ALERT](state, action) {
            const {
                alertTitle,
                alertMsg,
                alertCb,
                alertBtnText
            } = action.playload;
            return state.merge({
                alertShow: true,
                alertTitle,
                alertMsg,
                alertCb,
                alertBtnText
            });
        },
        [ActionTypes.HIDE_ALERT](state) {
            return state.set('alertShow', false);
        },
        [ActionTypes.SHOW_CONFIRM](state, action) {
            const {
                cfmTitle,
                cfmMsg,
                cfmBtnTexts,
                cfmCallbacks
            } = action.playload;
            return state.merge({
                confirmShow: true,
                cfmTitle,
                cfmMsg,
                cfmBtnTexts,
                cfmCallbacks
            });
        },
        [ActionTypes.HIDE_CONFIRM](state) {
            return state.set('confirmShow', false);
        },
        [ActionTypes.SHOW_POPUP](state, action) {
            const {
                popAnimationType
            } = action.playload;
            return state.merge({
                popupShow: true,
                popAnimationType
            });
        },
        [ActionTypes.HIDE_POPUP](state) {
            return state.set('popupShow', false);
        },
        [ActionTypes.SET_CODE](state, action) {
            const {code} = action.playload;
            // console.log('code', code);
            return state.set('code', code);
        },
        [ActionTypes.SET_USER_TOKEN](state, action) {
            const {userToken} = action.payload;
            return state.set(LOCALSTORAGE.USER_TOKEN, userToken);
        },
        [ActionTypes.SHOW_MENU](state, action) {
            const {isShowMenu} = action.playload;
            return state.set('showMenu', isShowMenu);
        },
        [ActionTypes.SET_TAB](state, action) {
            return state.set('tabValue', action.playload.value);
        },
        [ActionTypes.SET_EVA](state, action) {
            return state.set('evaStatus', action.playload.num);
        },
        [ActionTypes.SET_SHOPPINGID](state, action) {
            return state.set('shoppingId', action.playload.id);
        },
        [ActionTypes.SET_ORDERSTATUS](state, action) {
            return state.set('orderStatus', action.playload.id);
        },
        [ActionTypes.SET_USER_TYPE](state, action) {
            return state.set('userTypes', action.playload.num);
        },
        [ActionTypes.SET_RETURN](state, action) {
            return state.set('returnStatus', action.playload.onOff);
        },
        [ActionTypes.SET_AGREEMENT](state, action) {
            const {data} = action.payload;
            const agreementInfo = state.get('agreementInfo').merge(data);
            return state.set('agreementInfo', agreementInfo);
        }
    })
};
