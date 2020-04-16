import React from 'react';
import {Route} from 'react-router-dom';
import ShopPage from './NoCart';

const ShopCart = () => (
    <React.Fragment>
        {/* <Route path="/shopCart" component={ShopPage}/> */}
        <Route path="/shopCart" component={ShopPage}/>
    </React.Fragment>
);

export default ShopCart;
