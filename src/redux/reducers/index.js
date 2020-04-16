/**
 * rootReducer
 */
import baseReducer from './baseReducer';
import routeReducer from './routerReducer';
import categoryReducer from '../../views/routes/category/reducers';
import shopCartReducer from '../../views/routes/shop-cart/reducers/index';
import findReducer from '../../views/routes/find/reducers/index';
import MyReducer from '../../views/routes/my/reducers';
import homeReducer from '../../views/routes/home/reducers/index';

export const rootReducer = {
    ...baseReducer,
    ...routeReducer,
    ...categoryReducer,
    ...shopCartReducer,
    ...findReducer,
    ...MyReducer,
    ...homeReducer
};
