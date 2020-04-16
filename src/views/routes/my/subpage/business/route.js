import {Route} from 'react-router-dom';
import Business from './Business';
// import BusinessInfo from './BusinessInfo';
// import OrderList from './OrderList';

const BusinessInfo = Loadable({
    loader: () => import(/* webpackChunkName: 'My' */ './BusinessInfo'),
    loading: () => null
});

const OrderList = Loadable({
    loader: () => import(/* webpackChunkName: 'My' */ './OrderList'),
    loading: () => null
});
const MyBusinessModal = () => (
    <React.Fragment>
        <Route path="/business" component={Business}/>
        <Route path="/business-info" component={BusinessInfo}/>
        <Route path="/business-order-list" component={OrderList}/>
    </React.Fragment>
);

export default MyBusinessModal;