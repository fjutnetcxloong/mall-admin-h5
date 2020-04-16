import {Route} from 'react-router-dom';
import React from 'react';
import shopListPage from './shopList';

// const shopListPage = Loadable({
//     loader: () => import(/* webpackChunkName: 'Home' */ './shopList'),
//     loading: () => null
// });

const Find = () => (
    <React.Fragment>
        <Route path="/shop-list" component={shopListPage}/>
    </React.Fragment>
);


export default Find;
