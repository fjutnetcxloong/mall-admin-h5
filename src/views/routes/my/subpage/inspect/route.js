import React from 'react';
import {Route} from 'react-router-dom';

const Inspect = Loadable({
    loader: () => import(/* webpackChunkName: 'My' */ './Inspect'),
    loading: () => null
});
const InspectOrder = Loadable({
    loader: () => import(/* webpackChunkName: 'My' */ './inspect-order/InspectOrder'),
    loading: () => null
});
const Consumer = Loadable({
    loader: () => import(/* webpackChunkName: 'My' */ './consumer/Consumer'),
    loading: () => null
});
const Succcess = Loadable({
    loader: () => import(/* webpackChunkName: 'My' */ './success-file/SuccessFile'),
    loading: () => null
});
const consumerSearch = Loadable({
    loader: () => import(/* webpackChunkName: 'My' */ './consumer-search/ConsumerSearch'),
    loading: () => null
});
const consumerDetail = Loadable({
    loader: () => import(/* webpackChunkName: 'My' */ './consumer-search/ConsumerDetail'),
    loading: () => null
});
// const FailWrite = Loadable({
//     loader: () => import(/* webpackChunkName: 'My' */ './fail-write/FailWrite'),
//     loading: () => null
// });
const InspectModal = () => (
    <React.Fragment>
        <Route path="/inspect" component={Inspect}/>{/*立即核销*/}
        <Route path="/inspectOrder" component={InspectOrder}/>{/*核销订单*/}
        <Route path="/consumer" component={Consumer}/>{/*确认核销*/}
        <Route path="/success-file" component={Succcess}/>{/*确认核销*/}
        <Route path="/consumer-search" component={consumerSearch}/>{/*核销订单搜索*/}
        <Route path="/consumer-detail" component={consumerDetail}/>{/*核销订单搜索详情*/}
        {/*<Route path="/fail-write" component={FailWrite}/>核销失败*/}
    </React.Fragment>
);

export default InspectModal;
