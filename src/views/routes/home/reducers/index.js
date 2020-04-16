/**
 *  demoReducer函数定义
 */

import Immutable from 'immutable';
import {homeActionTypes as ActionsTypes} from '../actions/index';

const {createReducer} = Utils;
const initState = {
    banner: null,
    logo: null,
    nav: null,
    count: 0,
    coupon: null
};

/**
 * baseState 初始化
 * @type {state}
 */
const homeState =  Immutable.fromJS({
    ...initState
});
export default {
    home: createReducer(homeState, {
        [ActionsTypes.SET_BANNER](state, action) {
            const {banner, logo} = action.payload;
            return state.set('banner', banner)
                .set('logo', logo);
        },
        [ActionsTypes.SET_NAV](state, action) {
            const {nav} = action.payload;
            return state.set('nav', nav);
        },
        [ActionsTypes.SET_COUPON](state, action) {
            const {data} = action.payload;
            return state.set('coupon', data);
        }
    })
};
