import React from 'react';
import CacheRoute from 'react-router-cache-route';
import {Route} from 'react-router-dom';

const OrderPage = Loadable({
    loader: () => import(/* webpackChunkName: 'orderMains' */ './myOrder'),
    loading: () => null
});
const PossessEvaluate = Loadable({
    loader: () => import(/* webpackChunkName: 'orderMains' */ './possess-evaluate/PossessEvaluate'),
    loading: () => null
});
const ListDetails = Loadable({
    loader: () => import(/* webpackChunkName: 'orderMains' */ './List-details/ListDetails'),
    loading: () => null
});
const payMoney = Loadable({
    loader: () => import(/* webpackChunkName: 'orderMains' */ './pay-money/PayMoney'),
    loading: () => null
});
const PaymentCompleted = Loadable({
    loader: () => import(/* webpackChunkName: 'orderMains' */ './payment-completed/PaymentCompleted'),
    loading: () => null
});
const Logistics = Loadable({
    loader: () => import(/* webpackChunkName: 'orderMains' */ './logistics/Logistics'),
    loading: () => null
});
const MyEvaluatePage = Loadable({
    loader: () => import(/* webpackChunkName: 'orderMains' */ './my-evaluation-detail/MyEvaluate'),
    loading: () => null
});
const EvaluationSuccessPage = Loadable({
    loader: () => import(/* webpackChunkName: 'orderMains' */ './my-evaluation-detail/EvaluationSuccess'),
    loading: () => null
});
const publishReview = Loadable({
    loader: () => import(/* webpackChunkName: 'orderMains' */ './publish-review/PublishReview'),
    loading: () => null
});

const refundDetailsPage = Loadable({
    loader: () => import(/* webpackChunkName: 'orderMains' */ './refund-details/RefundDetails'),
    loading: () => null
});
const ApplyServicePage = Loadable({
    loader: () => import(/* webpackChunkName: 'orderMains' */ './apply-service/ApplyService'),
    loading: () => null
});
const OnlyRefund = Loadable({
    loader: () => import(/* webpackChunkName: 'orderMains' */ './apply-service/OnlyRefund'),
    loading: () => null
});
const ReturnGoods = Loadable({
    loader: () => import(/* webpackChunkName: 'orderMains' */ './apply-service/ReturnGoods'),
    loading: () => null
});
const JDLogistics = Loadable({
    loader: () => import(/* webpackChunkName: 'orderMains' */ './apply-service/fillInLogistics'),
    loading: () => null
});
const JDSaveSuccess = Loadable({
    loader: () => import(/* webpackChunkName: 'orderMains' */ './apply-service/JDSaveSuccess'),
    loading: () => null
});
const ApplyDrawback = Loadable({
    loader: () => import(/* webpackChunkName: 'orderMains' */ './apply-drawback/ApplyDrawback'),
    loading: () => null
});
const ShopSearch = Loadable({
    loader: () => import(/* webpackChunkName: 'orderMains' */ './shop-search/ShopSearch'),
    loading: () => null
});
const shopDetail = Loadable({
    loader: () => import(/* webpackChunkName: 'orderMains' */ './shop-search/shopDetail'),
    loading: () => null
});
const MyComplain = Loadable({
    loader: () => import(/* webpackChunkName: 'orderMains' */ './my-complain/MyComplain'),
    loading: () => null
});
const JDService = Loadable({
    loader: () => import(/* webpackChunkName: 'orderMains' */ './apply-service/JDService'),
    loading: () => null
});


const OrderModalOther = () => (
    <React.Fragment>
        <CacheRoute path="/myOrder" when="back" cacheKey="OrderPage" component={OrderPage}/>
        <Route path="/listDetails" component={ListDetails}/> {/* 订单详情-(5.3.1)*/}
        <Route path="/payMoney" component={payMoney}/> {/* 订单支付*/}
        <Route path="/paymentCompleted" component={PaymentCompleted}/> {/* 支付成功*/}
        <CacheRoute path="/possessEvaluate" when="back" cacheKey="PossessEvaluate" component={PossessEvaluate}/> {/**我的所有评价 */}
        <CacheRoute path="/myEvaluate" component={MyEvaluatePage} when="forward"/> {/* 立即评论*/}
        <Route path="/evaluationSuccess" component={EvaluationSuccessPage}/> {/* 评论成功*/}
        <Route path="/publishReview" component={publishReview}/> {/* 发表追评*/}
        <Route path="/applyService" component={ApplyServicePage}/> {/* 选择售后类型*/}
        <Route path="/onlyRefund" component={OnlyRefund}/> {/* 仅退款*/}
        <Route path="/returnGoods" component={ReturnGoods}/> {/* 退货退款*/}
        <Route path="/fillInLogistics" component={JDLogistics}/> {/*京东填写物流*/}
        <Route path="/jdsSaveSuccess" component={JDSaveSuccess}/> {/*京东售后提交成功*/}
        <Route path="/refundDetails" component={refundDetailsPage}/> {/* 售后退款详情页*/}
        <Route path="/JDService" component={JDService}/> {/* 京东 售后退款申请*/}
        <Route path="/logistics" component={Logistics}/> {/* 我的 物流*/}
        <Route path="/myComplain" component={MyComplain}/> {/* 我要投诉 */}
        <Route path="/applyDrawback" component={ApplyDrawback}/> {/* 修改申请*/}
        <Route path="/shop-search" component={ShopSearch}/> {/*商品搜索*/}
        <Route path="/shop-detail" component={shopDetail}/> {/*商品搜索详情*/}
    </React.Fragment>
);

export default OrderModalOther;
