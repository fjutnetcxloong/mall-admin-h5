import CacheRoute from 'react-router-cache-route';
import React from 'react';
import {Route} from 'react-router-dom';

const EvaluatePage = Loadable({
    loader: () => import(/* webpackChunkName: 'My' */ './subpage/evaluate/Evaluate'),
    loading: () => null
});

const EvaluateDetailPage = Loadable({
    loader: () => import(/* webpackChunkName: 'My' */ './subpage/evaluate-detail/EvaluateDetail'),
    loading: () => null
});

const CategoryListPage = Loadable({
    loader: () => import(/* webpackChunkName: 'My' */ './subpage/category-list/CategoryList'),
    loading: () => null
});

const GoodsDetailPage = Loadable({
    loader: () => import(/* webpackChunkName: 'My' */ './subpage/goods-detail/GoodsDetail'),
    loading: () => null
});

const CShareCard = Loadable({
    loader: () => import(/*webpackChunkName: 'hybird'*/'./subpage/goods-detail/cshare'),
    loading: () => null
});

const Classify = () => (
    <React.Fragment>
        <CacheRoute path="/categoryList" cacheKey="CategoryListPage" component={CategoryListPage} when="back"/>
        <CacheRoute path="/goodsDetail" cacheKey="GoodsDetailPage" component={GoodsDetailPage}/>
        <CacheRoute path="/evaluate" component={EvaluatePage}/>
        <Route path="/evaluateDetail" component={EvaluateDetailPage}/>
        <Route path="/cshare-card" component={CShareCard}/>
    </React.Fragment>
);
export default Classify;
