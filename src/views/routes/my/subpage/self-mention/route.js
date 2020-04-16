import React from 'react';
import {Route} from 'react-router-dom';
import CacheRoute from 'react-router-cache-route';
// import SelfMention from './SelfMention';
// import SelfAddress from './self-address/SelfAddress';
// import PaySuccess from './pay-success/PaySuccess';
// import SelfOrderingDetails from './self-ordering-detail/SelfOrderingDetails';
// import SelfMentionDetail from './self-mention-detail/SelfMentionDetail';
// import seleSearch from './self-search/SelfSearch';
// import seleList from './self-search/SelfDetail';


const SelfMention = Loadable({
    loader: () => import(/* webpackChunkName: 'My' */ './SelfMention'),
    loading: () => null
});
const SelfMentionDetail = Loadable({
    loader: () => import(/* webpackChunkName: 'My' */ './self-mention-detail/SelfMentionDetail'),
    loading: () => null
});
const SelfOrderingDetails = Loadable({
    loader: () => import(/* webpackChunkName: 'My' */ './self-ordering-detail/SelfOrderingDetails'),
    loading: () => null
});
const PaySuccess = Loadable({
    loader: () => import(/* webpackChunkName: 'My' */ './pay-success/PaySuccess'),
    loading: () => null
});
const SelfAddress = Loadable({
    loader: () => import(/* webpackChunkName: 'My' */ './self-address/SelfAddress'),
    loading: () => null
});
const seleSearch = Loadable({
    loader: () => import(/* webpackChunkName: 'My' */  './self-search/SelfSearch'),
    loading: () => null
});
const seleList = Loadable({
    loader: () => import(/* webpackChunkName: 'My' */ './self-search/SelfDetail'),
    loading: () => null
});
const SelfMentionModal = () => (
    <React.Fragment>
        <CacheRoute path="/selfMention" when="back" cacheKey="selfMentionOrderPage" component={SelfMention}/>
        <Route path="/selfMentionDetail" component={SelfMentionDetail}/> {/* 自提*/}
        <Route path="/selfOrderingDetails" component={SelfOrderingDetails}/> {/* 自提订单详情*/}
        <Route path="/paySuccess" component={PaySuccess}/> {/* 自提支付成功*/}
        <Route path="/selfAddress" component={SelfAddress}/> {/* 自提地址*/}
        <Route path="/self-search" component={seleSearch}/> {/* 线下订单搜索*/}
        <Route path="/self-list" component={seleList}/> {/* 线下订单搜索列表*/}
    </React.Fragment>
);

export default SelfMentionModal;
