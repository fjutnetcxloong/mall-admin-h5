import React from 'react';
import {Route} from 'react-router-dom';
import RecommendDetail from './ReDetail';

const RecommendDetailModal = () => (
    <React.Fragment>
        <Route path="/redetail" component={RecommendDetail}/>
    </React.Fragment>
);

export default RecommendDetailModal;
