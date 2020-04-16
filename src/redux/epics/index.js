import {baseActionTypes} from '../baseAction';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/map';

const {urlCfg} = Configs;
const {errorType} = Utils;

//获取协议内容
export function getAgreement(action$) {
    return action$.ofType(baseActionTypes.GET_AGREEMENT)
        .switchMap(
            (action) => XHR.fetch(urlCfg.getAgreement, {data: action.payload.data})
                .map(res => {
                    if (res.status !== 0) {
                        return errorType(res);
                    }
                    return ({
                        type: baseActionTypes.SET_AGREEMENT,
                        payload: {
                            data: res.data
                        }
                    });
                })
        );
}