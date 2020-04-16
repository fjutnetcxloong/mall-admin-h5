/**
 *  categoryReducer函数定义
 */

import Immutable from 'immutable';
import {categoryActionTypes as ActionTypes} from '../actions';


const {createReducer} = Utils;
const categoryData = {
    categoryData: null,
    currentIndex: 0,
    fresh: false
};

/**
 * categoryState 初始化
 * @type {state}
 */
const categoryState = Immutable.fromJS({
    ...categoryData
});

export default {
    category: createReducer(categoryState, {
        [ActionTypes.SET_CATEGORY](state, action) {
            const {data} = action.playload;
            return state.set('categoryData', data);
        },
        [ActionTypes.SET_INDEX](state, action) {
            const {currentIndex} = action.playload;
            return state.set('currentIndex', currentIndex);
        },
        [ActionTypes.SET_REFRESH](state, action) {
            const {freshing} = action.playload;
            // console.log('refreshing');
            return state.set('fresh', freshing);
        }
    })
};
