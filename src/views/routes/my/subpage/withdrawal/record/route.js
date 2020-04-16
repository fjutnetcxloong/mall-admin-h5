
import React from 'react';
import {Route} from 'react-router-dom';
import Record from './Record';

const RecordModal = () => (
    <React.Fragment>
        <Route path="/record" component={Record}/>
    </React.Fragment>
);

export default RecordModal;
