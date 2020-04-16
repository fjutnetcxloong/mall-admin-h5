/**
 *  routerReducer函数定义
 */

import Immutable from 'immutable';
import {LOCATION_CHANGE} from 'react-router-redux';

const {createReducer} = Utils,
    /**
     * routerState 初始化
     * @type {state}
     */
    routerState = Immutable.fromJS({
        locationState: null
    });


export default {
    routing: createReducer(routerState, {
        [LOCATION_CHANGE](state, action) {
            return state.set('locationState', action.payload);
        }
    })
};
