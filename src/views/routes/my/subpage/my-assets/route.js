import {Route} from 'react-router-dom';
import myAssetsPage from './MyAssets';
import myIcome from './my-income/MyIncome';
import Icome from './my-income/income/Income';
// import MyDetailed from './my-detailed/MyDetailed';
import ProjectedRevenue from './projected-revenue/ProjectedRevenue';
import ProjectedIncome from './preparatory-income/PreparatoryIncome';
import ProjectedMounth from './projected-mounth/ProjectedMounth';
import CamBalance from './cam-balance/CamBalance';

const myAssets = () => (
    <React.Fragment>
        <Route path="/myAssets" component={myAssetsPage}/>
        <Route path="/projected-revenue" component={ProjectedRevenue}/> {/*记账余额*/}
        <Route path="/preparatory-income" component={ProjectedIncome}/> {/*预备收益*/}
        <Route path="/cam-balance" component={CamBalance}/> {/*cam余额*/}
        <Route path="/preparatory-mounth" component={ProjectedMounth}/> {/*月结预算*/}
        <Route path="/myIcome" component={myIcome}/>{/*我的收入*/}
        <Route path="/icome" component={Icome}/>{/*营业收入或业务转入*/}
        {/* <Route path="/myDetailed" component={MyDetailed}/> 我的明细 */}
    </React.Fragment>
);

export default myAssets;
