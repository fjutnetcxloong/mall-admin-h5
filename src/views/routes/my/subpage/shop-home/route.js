import React from 'react';
import {Route} from 'react-router-dom';
import ShopHome from './ShopHome';
import ShopHomeIndexOnePage from './shop-home-index-one/ShopHomeIndex';
import ShopHomeIndexTwoPage from './shop-home-index-two/ShopHomeIndexTwo';
import ShopHomeIndexThirdPage from './shop-home-index-third/ShopHomeIndexThird';
import ShopHomeIndexFourPage from './shop-home-index-four/ShopHomeIndexFour';
import ShopHomeIndexFivePage from './shop-home-index-five/ShopHomeIndexFive';
import ShopHomeDetailPage from './shop-modal/ShopHomeDetail';

// const ShopHome = Loadable({
//     loader: () => import(/* webpackChunkName: 'orderMains' */ './ShopHome'),
//     loading: () => null
// });
// const ShopHomeIndexOnePage = Loadable({
//     loader: () => import(/* webpackChunkName: 'orderMains' */ './shop-home-index-one/ShopHomeIndex'),
//     loading: () => null
// });
// const ShopHomeIndexTwoPage = Loadable({
//     loader: () => import(/* webpackChunkName: 'orderMains' */ './shop-home-index-two/ShopHomeIndexTwo'),
//     loading: () => null
// });
// const ShopHomeIndexThirdPage = Loadable({
//     loader: () => import(/* webpackChunkName: 'orderMains' */ './shop-home-index-third/ShopHomeIndexThird'),
//     loading: () => null
// });
// const ShopHomeIndexFourPage = Loadable({
//     loader: () => import(/* webpackChunkName: 'orderMains' */ './shop-home-index-four/ShopHomeIndexFour'),
//     loading: () => null
// });
// const ShopHomeIndexFivePage = Loadable({
//     loader: () => import(/* webpackChunkName: 'orderMains' */ './shop-home-index-five/ShopHomeIndexFive'),
//     loading: () => null
// });
// const ShopHomeDetailPage = Loadable({
//     loader: () => import(/* webpackChunkName: 'orderMains' */ './ShopHomeDetail'),
//     loading: () => null
// });
const ShopHomeModal = () => (
    <React.Fragment>
        <Route path="/shopHome" component={ShopHome}/>
        <Route path="/shopHomeIndexOne" component={ShopHomeIndexOnePage}/> {/*我的店铺-模板1*/}
        <Route path="/shopHomeIndexTwo" component={ShopHomeIndexTwoPage}/> {/*我的店铺-模板2*/}
        <Route path="/shopHomeIndexThird" component={ShopHomeIndexThirdPage}/> {/*我的店铺-模板3*/}
        <Route path="/shopHomeIndexFour" component={ShopHomeIndexFourPage}/> {/*我的店铺-模板4*/}
        <Route path="/shopHomeIndexFive" component={ShopHomeIndexFivePage}/> {/*我的店铺-模板5*/}
        <Route path="/shopHomeDetail" component={ShopHomeDetailPage}/> {/*我的店铺-商家信息*/}
    </React.Fragment>
);

export default ShopHomeModal;
