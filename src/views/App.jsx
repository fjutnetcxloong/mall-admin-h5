/**
 * app 路口文件
 */
import {Fragment} from 'react';
import {Provider} from 'react-redux';
import {hot} from 'react-hot-loader';
import initReactFastclick from 'react-fastclick';
import {store} from '../redux/store';
import {baseActionCreator} from '../redux/baseAction';
import BasePage from './common/base/BasePage';
import {ViewRoutes} from './routes/index';
import {getUrlParam} from '../utils/mixin';
import './App.less';

initReactFastclick();

const App = () => {
    // 微信公众号登陆
    const code = getUrlParam('code');
    // window.loading.style = 'display:none';
    if (window.isWX && code) {
        store.dispatch(baseActionCreator.setCode(code));
    }
    return (
        <Provider store={store}>
            <Fragment>
                <BasePage/>
                <ViewRoutes/>
            </Fragment>
        </Provider>
    );
};

export default hot(module)(App);
