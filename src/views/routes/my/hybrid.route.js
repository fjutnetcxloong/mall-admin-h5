import {Route} from 'react-router-dom';
import MyCustomerModal from './subpage/customer/route';
import MyBusinessModal from './subpage/business/route';
import InspectModal from './subpage/inspect/route';


const OrderPage = Loadable({
    loader: () => import(/* webpackChunkName: 'orderMains' */ './subpage/my-order/route'),
    loading: () => null
});
const MyInvitation = Loadable({
    loader: () => import(/* webpackChunkName: 'My' */ './subpage/Invitation/route'),
    loading: () => null
});
const MyCollect = Loadable({
    loader: () => import(/* webpackChunkName: 'My' */ './subpage/my-collect/route'),
    loading: () => null
});
const AppendOrder = Loadable({
    loader: () => import(/* webpackChunkName: 'My' */ './subpage/append-order/route'),
    loading: () => null
});
const SelfMention = Loadable({
    loader: () => import(/* webpackChunkName: 'My' */ './subpage/self-mention/route'),
    loading: () => null
});

const Edit = Loadable({
    loader: () => import(/* webpackChunkName: 'Edit' */ './subpage/edit/route'),
    loading: () => null
});
const WithdrawalRouters = Loadable({
    loader: () => import(/* webpackChunkName: 'My' */ './subpage/withdrawal/route'),
    loading: () => null
});
const RecordPage = Loadable({
    loader: () => import(/* webpackChunkName: 'My' */ './subpage/withdrawal/record/route'),
    loading: () => null
});
const ShopHomePage = Loadable({
    loader: () => import(/* webpackChunkName: 'My' */ './subpage/shop-home/route'),
    loading: () => null
});
const OpenShopPage = Loadable({
    loader: () => import(/* webpackChunkName: 'My' */ './subpage/open-shop/route'),
    loading: () => null
});
const PeraonalSotes = Loadable({
    loader: () => import(/* webpackChunkName: 'My' */ './subpage/personal-stores/route'),
    loading: () => null
});
const BrowseHistory = Loadable({
    loader: () => import(/* webpackChunkName: 'My' */ './subpage/browse-history/route'),
    loading: () => null
});
// const InspectModal = Loadable({
//     loader: () => import(/* webpackChunkName: 'My' */ './subpage/inspect/route'),
//     loading: () => null
// });

const My = () => (
    <React.Fragment>
        <Route path="/collect" component={MyCollect}/>
        <Route path="/appendorder" component={AppendOrder}/>
        <Route path="/withdrawal" component={WithdrawalRouters}/>
        <Route path="/shopHome" component={ShopHomePage}/>
        <Route path="/invitation" component={MyInvitation}/>
        <Route path="/record" component={RecordPage}/>
        <Route path="/openShopPage" component={OpenShopPage}/>
        <Route path="/personalStores" component={PeraonalSotes}/>
        <Route path="/browseHistory" component={BrowseHistory}/>
        <InspectModal/>
        <MyBusinessModal/>
        <MyCustomerModal/>
        <SelfMention/>
        <Edit/>
        <OrderPage/>
    </React.Fragment>
);
export default My;
