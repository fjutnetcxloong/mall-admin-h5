import CacheRoute from 'react-router-cache-route';
import React from 'react';
import {Route} from 'react-router-dom';

const CategoryPage = Loadable({
    loader: () => import(/* webpackChunkName: 'wechat' */ './Category'),
    loading: () => null
});

const EvaluatePage = Loadable({
    loader: () => import(/* webpackChunkName: 'hybird' */ './subpage/evaluate/Evaluate'),
    loading: () => null
});

const EvaluateDetailPage = Loadable({
    loader: () => import(/* webpackChunkName: 'hybird' */ './subpage/evaluate-detail/EvaluateDetail'),
    loading: () => null
});

const CategoryListPage = Loadable({
    loader: () => import(/* webpackChunkName: 'hybird' */ './subpage/category-list/CategoryList'),
    loading: () => null
});

const GoodsDetailPage = Loadable({
    loader: () => import(/* webpackChunkName: 'hybird' */ './subpage/goods-detail/GoodsDetail'),
    loading: () => null
});

const CShareCard = Loadable({
    loader: () => import(/*webpackChunkName: 'hybird'*/'./subpage/goods-detail/cshare'),
    loading: () => null
});

const Classify = () =>  (
    <React.Fragment>
        <Route path="/category" component={CategoryPage}/>
        <CacheRoute path="/categoryList" cacheKey="CategoryListPage" component={CategoryListPage} when="back"/>
        <CacheRoute path="/goodsDetail" cacheKey="GoodsDetailPage" component={GoodsDetailPage}/>
        <CacheRoute path="/evaluate" component={EvaluatePage}/>
        <Route path="/evaluateDetail" component={EvaluateDetailPage}/>
        <Route path="/cshare-card" component={CShareCard}/>
    </React.Fragment>
);

export default Classify;
