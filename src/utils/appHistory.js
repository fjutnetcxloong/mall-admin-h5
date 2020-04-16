/**
 * 场景使用: window.history 回退时，window.history.length 无法改变
 * * @type {Array}
 */
import {push, goBack, replace, go, goForward} from 'react-router-redux'; //将react-router托管到redux
import {store} from '../redux/store';
import {isInteger} from './validator';

// 历史访问记录栈
let historyStack = [];
const tempStack = [];

function getPathname(params) {
    if (!params) {
        return null;
    }
    // 字符串
    if (typeof params === 'string') {
        return params;
    }

    // 字符串
    if (typeof params === 'object') {
        return params.pathname;
    }
    return null;
}

const appHistory = {
    push: (location) => {
        const url = getPathname(location);
        if (!url) return;
        const len = historyStack.length;
        if (len > 0) {
            const topUrl = historyStack[len - 1];
            if (window.isWX) {
                historyStack.pop();
            } else {
                console.log('topUrl === url', topUrl === url);
                if (topUrl === url) return;
            }
        }
        historyStack.push(url);
        tempStack.push(url);
        store.dispatch(push(location));
    },
    replace: (location) => {
        const url = getPathname(location);
        if (!url) return;
        const len = historyStack.length;
        if (len > 0) {
            const topUrl = historyStack[len - 1];
            if (topUrl === url) return;
        }
        historyStack[len - 1] = url;
        tempStack[len - 1] = url;
        store.dispatch(replace(location));
    },
    go: (number) => {
        if (!isInteger(number)) return;
        const hl = historyStack.length,
            tl = tempStack.length;
        if (hl + number >= tl) {
            historyStack = tempStack.slice(0, tempStack.length - number);
        } else {
            historyStack = tempStack.slice(0, hl + number);
        }
        store.dispatch(go(number));
    },
    goBack: () => {
        const hl = historyStack.length;
        if (hl <= 0) return;
        historyStack.pop();
        store.dispatch(goBack());
    },
    goForward: () => {
        const hl = historyStack.length,
            tl = tempStack.length;
        if (hl >= tl) return;
        historyStack = tempStack.slice(0, historyStack.length + 1);
        store.dispatch(goForward());
    },
    length: () => historyStack.length,
    reduction: () => {
        historyStack.length = 0;
    }
};

export {appHistory};
