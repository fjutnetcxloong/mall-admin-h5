/**
 * 封装 Rx-Http-Request 用于请求服务器数据
 */
import axios from 'axios';
import jsonp from 'jsonp';
// import {Observable} from 'rxjs';
import {defer} from 'rxjs/Observable/defer';
import {Subject} from 'rxjs/Subject';
import 'rxjs/add/operator/do';
import {store} from '../redux/store';
import {native} from '../utils/native';

import {baseActionCreator as actionCreator} from '../redux/baseAction';


const {CancelToken} = axios;
const {systemApi: {removeValue}, appHistory, showFail} = Utils;
const {MESSAGE, LOCALSTORAGE} = Constants;

// http request 拦截器
axios.interceptors.request.use(
    config => {
        const state = store.getState();
        const userToken = state.get('base').get(LOCALSTORAGE.USER_TOKEN);
        if (!config.data) config.data = {};
        config.data.userToken = userToken || (window.localStorage.getItem('zpyg_userToken') === 'null' ? '' : window.localStorage.getItem('zpyg_userToken'));
        return config;
    },
    error => {
        console.log(error);
    }
);

// http response 拦截器
axios.interceptors.response.use(
    response => {
        if (response.data.status === 100 || response.data.status === 101) {
            if (process.env.NATIVE) {
                removeValue(LOCALSTORAGE.USER_TOKEN); // 清除token,localstorage
                store.dispatch(actionCreator.setUserToken('')); // 清除redux的userToken
                //重定向到原生登录页
                native('loginout');
            } else {
                appHistory.push('/login');
            }
        }
        return response;
    }
);


class Rxios {
    // singleton 单例
    static instance() {
        if (!(Rxios._instance instanceof Rxios)) {
            Rxios._instance = new Rxios();
        }
        return Rxios._instance;
    }

    constructor() {
        this.ajaxNum = 0;    // ajax请求队列数
        this.ajaxQueue = []; // ajax请求队列
        this.delay = 500; // 延迟关闭loading
    }

    /**
     * http请求数据的总路口
     * @param url
     * @param params
     * @returns {observable}
     */
    fetch(url, params = {}, noLoading) {
        const num = this.ajaxNum++,
            {ajaxQueue} = this;
        ajaxQueue[num] = {
            type: url
        };
        params.url = url;
        params.method = params.method || 'post';
        params.noLoading = noLoading || false;
        params.cancelToken = new CancelToken((c) => {
            ajaxQueue[num].cancel = c;
        });
        return defer(() => {
            const subject = new Subject();   // 创建subject,
            if (params.url) {
                if (!params.noLoading) {
                    store.dispatch(actionCreator.showLoading());
                }
                // ajaxQueue[num].undo = true;
                if (params.method === 'jsonp') {
                    jsonp(params.url, {name: params.jsonpCb}, (err, data) => {
                        ajaxQueue[num].undo = false;
                        setTimeout(() => {
                            store.dispatch(actionCreator.hideLoading());
                        }, this.delay);
                        if (err) {
                            console.error(err.message);
                            subject.error(err);
                        } else {
                            // console.log(data);
                            subject.next(data);
                        }
                    });
                } else {
                    axios.request(params)
                        .then(res => {
                            ajaxQueue[num].undo = false;
                            if (res) {
                                if (res.data.status === 0) {
                                    subject.next(res.data);
                                } else if (res.data.status === 1) {
                                    showFail(res.data.message);
                                    subject.next(res.data);
                                }
                            }
                        })
                        .catch(err => {
                            console.log(err); // 错误捕获统一处理
                            const code = [500, 501, 502, 503, 504, 505];
                            setTimeout(() => {
                                store.dispatch(actionCreator.hideLoading());
                            }, this.delay);
                            if (err.message === 'Network Error') {
                                showFail(MESSAGE.Network_Error);
                                appHistory.replace('/network-error');
                            } else if (err.response && code.indexOf(err.response.status) !== -1) {
                                appHistory.replace('/server-error');
                            }
                            subject.error(err);
                        })
                        .then(() => {
                            ajaxQueue[num].undo = false;
                            setTimeout(() => {
                                store.dispatch(actionCreator.hideLoading());
                            }, this.delay);
                            subject.complete();
                        });
                }
            } else {
                subject.error(MESSAGE.No_Url);
            }
            return subject;
        });
    }

    /**
     * 终止http请求
     *
     * @param url
     */
    abort(url) {
        this.ajaxQueue.forEach((item) => {
            if (url && url !== item.type) return;
            item.undo && item.cancel(MESSAGE.Network_Cancel);
        });
        // 重置
        this.ajaxQueue = [];
        this.ajaxNum = 0;
    }
}

const rxios = Rxios.instance();

export default rxios;
