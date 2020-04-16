/**
 *  demoReducer函数定义
 */

import Immutable from 'immutable';
import {myActionTypes as ActionTypes} from '../actions/index';

const {createReducer} = Utils;
const indexState = {
    orderState: null,
    verification: null,
    orderInfo: null
};

const openShop = {
    editModal: ''
};

const address = {
    addressList: null,
    defaultAddress: null //用户默认地址信息
};

/**
 * myState 初始化
 * @type {state}
 */
const myStates = Immutable.fromJS({
    ...indexState,
    ...openShop,
    ...address
});

export default {
    my: createReducer(myStates, {
        [ActionTypes.SET_ORDER_INFORMATION](state, action) {
            const {data} = action.payload;
            return state.set('orderState', data);
        },
        [ActionTypes.SET_VERIFICATION](state, action) {
            const {data} = action.payload;
            return state.set('verification', data);
        },
        [ActionTypes.SET_ORDERS_INFO](state, action) {
            const {data} = action.payload;
            return state.set('orderInfo', data);
        },
        [ActionTypes.SET_PAGE_STATUS](state, action) {
            const {data} = action.payload;
            return state.set('editModal', data);
        },
        [ActionTypes.SET_ADDRESS](state, action) {
            const {data} = action.payload;
            return state.set('addressList', data);
        },
        [ActionTypes.SET_MYINFO](state, action) {
            const {data} = action.payload;
            return state.set('myInfo', data);
        },
        [ActionTypes.DEL_MYINFO](state, action) {
            return state.set('myInfo', '');
        },
        [ActionTypes.SET_USERINFO](state, action) {
            const {data} = action.payload;
            return state.set('userInfo', data);
        },
        [ActionTypes.DEL_USERINFO](state, action) {
            return state.set('userInfo', '');
        },
        [ActionTypes.SET_NICKNAME](state, action) {
            const {data} = action.payload;
            return state.set('nickname', data);
        },
        [ActionTypes.SET_AREA](state, action) {
            const {data} = action.payload;
            return state.set('areaInfo', data);
        },
        [ActionTypes.SET_UID](state, action) {
            const {data} = action.payload;
            return state.set('uidInfo', data);
        },
        [ActionTypes.SET_BANK](state, action) {
            const {data} = action.payload;
            return state.set('bankInfo', data);
        },
        [ActionTypes.SAVE_ADDRESS](state, action) {
            const {obj} = action.payload;
            return state.set('defaultAddress', obj);
        },
        [ActionTypes.SET_ACCOUT](state, action) {
            const {obj} = action.payload;
            return state.set('accoutList', obj);
        }
    })
};
