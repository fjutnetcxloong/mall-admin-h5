import React from 'react';
import {Route} from 'react-router-dom';
import Withdrawal from './Withdrawal';

const WithdrawalModal = () => (
    <React.Fragment>
        <Route path="/withdrawal" component={Withdrawal}/>
    </React.Fragment>
);

export default WithdrawalModal;
