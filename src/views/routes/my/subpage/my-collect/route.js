import React from 'react';
import {Route} from 'react-router-dom';
import MyCollect from './Collect';

const MyCollectModal = () => (
    <React.Fragment>
        <Route path="/collect" component={MyCollect}/>
    </React.Fragment>
);

export default MyCollectModal;
