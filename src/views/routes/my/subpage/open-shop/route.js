import React from 'react';
import {Route} from 'react-router-dom';
import OpenShop from './new-page/NewOpenShop';
// import Personal from './personal/Personal';
// import Individual from './individual/Individual';
// import Agreement from './agreement/Agreement';
// import Recommender from './recommender/Recommender';
// import ScanDetermine from './scan-determine/ScanDetermine';
// import Index from './component';
// import Check from './components/check/check';

const OpenShopPage = () => (
    <React.Fragment>
        {/* <Route path="/selectType" component={Index}/>选择开店类型 */}
        <Route path="/openShopPage" component={OpenShop}/>{/*我要开店*/}
        {/* <Route path="/personal" component={Personal}/>{/*我要开店-个人*/}
        {/* <Route path="/individual" component={Individual}/>我要开店-个体 */}
        {/* <Route path="/agreement" component={Agreement}/>开店协议 */}
        {/* <Route path="/recommender" component={Recommender}/>确定推荐人 */}
        {/* <Route path="/scanDetermine" component={ScanDetermine}/>我要开店-扫码确认 */}
    </React.Fragment>
);

export default OpenShopPage;
