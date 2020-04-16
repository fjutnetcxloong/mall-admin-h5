import React from 'react';
import {Route} from 'react-router-dom';
import MyNotice from './Notice';

const MyNoticeModal = () => (
    <React.Fragment>
        <Route path="/notice" component={MyNotice}/>
    </React.Fragment>
);

export default MyNoticeModal;
