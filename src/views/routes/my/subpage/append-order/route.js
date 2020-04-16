import React from 'react';
import {Route} from 'react-router-dom';
import AppendOrder from './AppendOrder';

const AppendOrderModal = () => (
    <React.Fragment>
        <Route path="/appendorder" component={AppendOrder}/>
    </React.Fragment>
);

export default AppendOrderModal;
