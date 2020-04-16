import React from 'react';
import {Route} from 'react-router-dom';
import RecommendList from './Recommend';

const RecommendListModal = () => (
    <React.Fragment>
        <Route path="/recommend" component={RecommendList}/>
    </React.Fragment>
);

export default RecommendListModal;
