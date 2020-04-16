
import React from 'react';
import {Route} from 'react-router-dom';
import Personal from './PersonalStores';

const persoanlModal = () => (
    <React.Fragment>
        <Route path="/personalStores" component={Personal}/>
    </React.Fragment>
);


export default persoanlModal;
