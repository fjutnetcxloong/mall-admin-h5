/**
 *  demoReducer函数定义
 */

import Immutable from 'immutable';
import {shopCartActionTypes as actionTypes} from '../actions/index';

const {createReducer} = Utils;
const indexState = {
    orderArr: [],
    ids: []
};

/**
 * baseState 初始化
 * @type {state}
 */
const shopCartState = Immutable.fromJS({
    ...indexState
});

export default {
    shopCart: createReducer(shopCartState, {
        [actionTypes.SET_SHOP_CART_ORDER_INFO](state, action) {
            const {arr} = action.payload;
            return state.set('orderArr', arr);
        },
        [actionTypes.SET_SHOP_CART_IDS](state, action) {
            const {ids} = action.payload;
            return state.set('ids', ids);
        }
    })
};
