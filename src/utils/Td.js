/**
 * 埋点数据
 */
import {systemApi} from './systemApi';

const basekv = {
    xuid: systemApi.getValue('xuid') || '',
    tel: systemApi.getValue('activiedMobile') || '',
    acc: systemApi.getValue('loginAcc') || ''
};

export const TD = {
    log: (eventId, label = '', kv = {}) => {
        if (process.env.NATIVE || window.isWX) {
            console.log(eventId);
        } else {
            const newKv = Object.assign({}, basekv, kv);
            window.TDAPP.onEvent(eventId, label, newKv);
        }
    }
};
