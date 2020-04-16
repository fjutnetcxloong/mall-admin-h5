import 'rxjs/operators/switchMap';
import 'rxjs/operators/map';
import {homeActionTypes} from '../index';

const {urlCfg} = Configs;
const {errorType} = Utils;

export function getHomeBanner(action$) {
    return action$.ofType(homeActionTypes.GET_BANNER)
        .switchMap(
            (action) => XHR.fetch(urlCfg.homeBanner, {data: action.data})
                .map(res => {
                    if (res.status !== 0) {
                        return errorType(res);
                    }
                    return ({
                        type: homeActionTypes.SET_BANNER,
                        payload: {
                            banner: res.data,
                            logo: res.home_pic.pic1
                        }
                    });
                })
        );
}

export function getNav(action$) {
    return action$.ofType(homeActionTypes.GET_NAV)
        .switchMap(
            (action) => XHR.fetch(urlCfg.homeGetCategoryOne)
                .map(res => {
                    if (res.status !== 0) {
                        return errorType(res);
                    }
                    return ({
                        type: homeActionTypes.SET_NAV,
                        payload: {
                            nav: res.data
                        }
                    });
                })
        );
}

// export function getCoupon(action$) {
//     return action$.ofType(homeActionTypes.GET_COUPON)
//         .switchMap(action => XHR.fetch(urlCfg.getCoupon))
//         .map(res => {
//             if (res.status !== 0) {
//                 return errorType(res);
//             }
//             return ({
//                 type: homeActionTypes.SET_COUPON,
//                 payload: {
//                     data: res.data
//                 }
//             });
//         });
// }