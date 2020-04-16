import {Route} from 'react-router-dom';
import Customer from './Customer';
// import CustomerInfo from './CustomerInfo';
// import OrderList from './OrderList';

const CustomerInfo = Loadable({
    loader: () => import(/* webpackChunkName: 'My' */ './CustomerInfo'),
    loading: () => null
});
const OrderList = Loadable({
    loader: () => import(/* webpackChunkName: 'My' */ './OrderList'),
    loading: () => null
});
const MyCustomerModal = () => (
    <React.Fragment>
        <Route path="/customer" component={Customer}/>
        <Route path="/customer-info" component={CustomerInfo}/>
        <Route path="/customer-order-list" component={OrderList}/>
    </React.Fragment>
);

export default MyCustomerModal;