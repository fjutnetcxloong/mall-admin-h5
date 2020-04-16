import {Fragment} from 'react';
import {HashRouter as Router} from 'react-router-dom';
import {syncHistoryWithStore} from 'react-router-redux';
import {store, historyStore} from '../../redux/store';
import ScrollToTop from '../common/scroll-to-top/ScrollToTop'; // 页面跳转后滚动条恢复到顶部
import HomeRouters from './home/hybrid.route'; // 商城首页
import CategoryRouters from './category/hybrid.route'; // 分类
import FindRouters from './find/hybrid.route'; // 发现
import MyRouters from './my/hybrid.route'; // 我的页面
import ShopRouters from './shop-cart/route'; // 购物车
import ErrorRouters from './error/route'; // 错误页面


// syncHistoryWithStore 把history挂到store下
const history = syncHistoryWithStore(historyStore, store, {
    selectLocationState(state) {
        return state.get('routing').toObject();
    }
});

// http://8dou5che.com/2017/10/24/react-router-redux/
history.listen((location, action) => {
    console.log(
        `hybrid The current URL is ${location && location.pathname}`
    );
    console.log(`The last navigation action was ${action}`);
});

export const ViewRoutesHybrid = () => (
    <Router hashHistory={history}>
        <ScrollToTop>
            <Fragment>
                <HomeRouters/>
                <CategoryRouters/>
                <FindRouters/>
                <ShopRouters/>
                <MyRouters/>
                <ErrorRouters/>
            </Fragment>
        </ScrollToTop>
    </Router>

);
