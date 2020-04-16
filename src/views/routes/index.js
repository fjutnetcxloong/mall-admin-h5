import {Fragment} from 'react';
import {HashRouter as Router} from 'react-router-dom';
import {historyStore} from '../../redux/store';
import ScrollToTop from '../common/scroll-to-top/ScrollToTop'; // 页面跳转后滚动条恢复到顶部
import HomeRouters from './home/route'; // 商城首页
import RegisterRouters from './register/route'; // 登陆页面
import CategoryRouters from './category/route'; // 分类
import FindRouters from './find/route'; // 发现
import MyRouters from './my/route'; // 我的页面
import ShopRouters from './shop-cart/route'; // 购物车
import ErrorRouters from './error/route'; // 错误页面

export const ViewRoutes = () => (
    <Router hashHistory={historyStore}>
        <ScrollToTop>
            <Fragment>
                <RegisterRouters/>
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
