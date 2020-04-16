/**
 *  findReducer函数定义
 */

import Immutable from 'immutable';
import {findActionTypes} from '../actions/index';

const {createReducer} = Utils;
const indexState = {
    shopListData: []
};

/**
 * baseState 初始化
 * @type {state}
 */
const findState = Immutable.fromJS({
    ...indexState
});

export default {
    find: createReducer(findState, {
        [findActionTypes.SET_SHOP_LIST](state, actions) {
            const {data} = actions.payload;
            console.log(data);
            return state.set('shopListData', data);
        }
    })
};
