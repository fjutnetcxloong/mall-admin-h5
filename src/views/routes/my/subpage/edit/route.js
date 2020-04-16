import React from 'react';
import {Route} from 'react-router-dom';
import Edit from './edit';
import PasswordPage from './password/Password';
import PasswordDetailPage from './password/password-detail/PasswordDetail';
import PasswordPayment from './password/password-detail-payment/PasswordPayment';
// import UserId from './userId/UserId';
import Addr from './address/Address';
import bankCardPage from './bank-card/BankCard';
import bankCardDetailPage from './bank-card/BankCardDetail';
// import InformationPage from './information/Information';
// import FeedbackRouters from './user-agreement/Feedback';
// import Account from './account/Account';//切换账号
// import AddAccount from './account/AddAccount';//添加账号
import Source from './source';/*确认源头*/
// import BlankPage from './blank';
import Agreement from './argeeMore';

// const Edit = Loadable({
//     loader: () => import(/* webpackChunkName: 'Edit' */ './edit'),
//     loading: () => null
// });
// const PasswordPage = Loadable({
//     loader: () => import(/* webpackChunkName: 'Edit' */ './password/Password'),
//     loading: () => null
// });
// const PasswordDetailPage = Loadable({
//     loader: () => import(/* webpackChunkName: 'Edit' */ './password/password-detail/PasswordDetail'),
//     loading: () => null
// });
// const PasswordPayment = Loadable({
//     loader: () => import(/* webpackChunkName: 'Edit' */ './password/password-detail-payment/PasswordPayment'),
//     loading: () => null
// });
// const Agreement = Loadable({
//     loader: () => import(/* webpackChunkName: 'Edit' */ './argeeMore'),
//     loading: () => null
// });
// const Addr = Loadable({
//     loader: () => import(/* webpackChunkName: 'Edit' */ './address/Address'),
//     loading: () => null
// });
// const bankCardPage = Loadable({
//     loader: () => import(/* webpackChunkName: 'Edit' */ './bank-card/BankCard'),
//     loading: () => null
// });
// const bankCardDetailPage = Loadable({
//     loader: () => import(/* webpackChunkName: 'Edit' */ './bank-card/BankCardDetail'),
//     loading: () => null
// });
// const Source = Loadable({
//     loader: () => import(/* webpackChunkName: 'Edit' */ './source'),
//     loading: () => null
// });
// const BlankPage = Loadable({
//     loader: () => import(/* webpackChunkName: 'Edit' */ './blank'),
//     loading: () => null
// });
const EditModal = () => (
    <React.Fragment>
        <Route path="/edit" component={Edit}/>
        <Route path="/password" component={PasswordPage}/> {/* 密码管理*/}
        <Route path="/passwordDetail" component={PasswordDetailPage}/> {/* 密码管理 手机验证*/}
        <Route path="/passwordPayment" component={PasswordPayment}/> {/*  密码管理  支付密码更改*/}

        <Route path="/enid" component={Agreement}/> {/*查看源头uid*/}
        <Route path="/extname" component={Agreement}/> {/*修改姓名*/}
        <Route path="/locationarea" component={Agreement}/> {/*所在区域管理*/}
        <Route path="/userAgreementDetail" component={Agreement}/> {/*关于中卖网*/}

        <Route path="/address" component={Addr}/> {/*地址管理*/}
        <Route path="/editAddress" component={Addr}/> {/*地址管理-编辑或新建*/}

        <Route path="/bankCard" component={bankCardPage}/> {/*我的银行卡*/}
        <Route path="/bankCardDetail" component={bankCardDetailPage}/> {/*我的银行卡-填写列表*/}
        {/* <Route path="/account" component={Account}/> 切换账户 */}
        {/* <Route path="/addAccount" component={AddAccount}/> 添加账户 */}
        <Route path="/source" component={Source}/> {/*确认源头*/}
        <Route path="/virSource" component={Source}/> {/*确认源头手动输入*/}
        <Route path="/sourceBrowse" component={Source}/> {/*确认源头-扫码*/}
        {/* <Route path="/blankPage" component={BlankPage}/> 空白页面原生使用 */}
    </React.Fragment>
);

export default EditModal;
