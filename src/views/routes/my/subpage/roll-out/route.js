import React from 'react';
import {Route} from 'react-router-dom';
import RollOut from './RollOut';
import ImportSum from './import-sum/ImportSum';
import TransferRecord from './transfer-record/TransferRecord';
import Paycamsucess from './import-sum/PayCamsucess';

const RollOutModal = () => (
    <React.Fragment>
        <Route path="/rollOut" component={RollOut}/>{/*CAM转出*/}
        <Route path="/importSum" component={ImportSum}/>{/*CAM转出-支付*/}
        <Route path="/transferRecord" component={TransferRecord}/>{/*转出记录*/}
        <Route path="/pay-camsucess" component={Paycamsucess}/>{/*支付成功*/}
    </React.Fragment>
);

export default RollOutModal;
