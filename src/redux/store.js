import {createLogger} from 'redux-logger';
import {applyMiddleware, createStore} from 'redux';
import {routerMiddleware, syncHistoryWithStore} from 'react-router-redux';
import {createEpicMiddleware} from 'redux-observable';
import {combineReducers} from 'redux-immutable'; // 使用redux-immutable替换原来 Redux提供的combineReducers
import {rootEpic} from './rootEpic';
import {rootReducer} from './reducers';


// 创建 history 单例
const hashHistory = require('history').createHashHistory();

const epicMiddleware = createEpicMiddleware(rootEpic),
    routersMiddleware = routerMiddleware(hashHistory),
    middleware = [epicMiddleware, routersMiddleware];
const reducers = combineReducers({
    ...rootReducer
});
if (process.env.NODE_ENV !== 'production') {
    middleware.push(createLogger());
}

const store = createStore(reducers, applyMiddleware(...middleware));

/**
 * 添加 reducer 函数
 * @param reducer
 */
function injectReducer(reducer) {
    store.replaceReducer(combineReducers({
        ...rootReducer,
        ...reducer
    }));
}

// syncHistoryWithStore 把history挂到store下
const historyStore = syncHistoryWithStore(hashHistory, store, {
    selectLocationState(state) {
        return state.get('routing').toObject();
    }
});

// http://8dou5che.com/2017/10/24/react-router-redux/
historyStore.listen((location, action) => {
    console.log(
        `The current URL is ${location && location.pathname}`
    );
    console.log(`The last navigation action was ${action}`);
});

export {store, injectReducer, historyStore};
