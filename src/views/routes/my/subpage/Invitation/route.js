import React from 'react';
import {Route} from 'react-router-dom';
import MyInvitation from './Invitation';

const MyInvitationModal = () => (
    <React.Fragment>
        <Route path="/invitation" component={MyInvitation}/>
    </React.Fragment>
);

export default MyInvitationModal;
