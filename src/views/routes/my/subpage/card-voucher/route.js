//卡券包页面  2020.3.11

import CacheRoute from 'react-router-cache-route';


const CardVoucherModal = Loadable({
    loader: () => import(/* webpackChunkName: 'My' */ './CardVoucher'),
    loading: () => null
});


const MyCardVoucherModal = () => (
    <React.Fragment>
        <CacheRoute path="/cardVoucher" when="back" cacheKey="OrderPage" component={CardVoucherModal}/>
    </React.Fragment>
);

export default MyCardVoucherModal;