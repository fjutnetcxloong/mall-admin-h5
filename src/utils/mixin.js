/**
 * @desc 混合工具函数
 */

import {Toast} from 'antd-mobile';


// 前端提示 content:提示内容  duration:延时关闭  mask:是否显示透明蒙层
export function showInfo(content, duration = 2, mask = true) {
    Toast.info(content, duration, null, mask);
}

// 后端提示成功
export function showSuccess(content, duration = 2, mask = true) {
    Toast.success(content, duration, null, mask);
}

// 后端提示
export function showFail(content, duration = 2, mask = true) {
    Toast.fail(content, duration, null, mask);
}

// 错误提示
export function errorType(data) {
    Toast.info(data.message);
    return ({
        type: null
    });
}

// key 镜像函数
export const keyMirror = (obj) => {
    let key;
    const mirrored = {};
    if (obj && typeof obj === 'object') {
        for (key in obj) {
            if ({}.hasOwnProperty.call(obj, key)) {
                mirrored[key] = key;
            }
        }
    }
    return mirrored;
};

/**
 * 生成 reducer 函数.
 *
 * @param {Object} initialState
 * @param {Object} handlers
 * @returns {function}
 */
export function createReducer(initialState, handlers) {
    return function reducer(state = initialState, action) {
        if ({}.hasOwnProperty.call(handlers, action.type)) {
            return handlers[action.type](state, action);
        }
        return state;
    };
}

// 获取url参数
export function getUrlParam(name, str) {
    str = str || window.location.search;
    const reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)'); //构造一个含有目标参数的正则表达式对象
    const r = str.substr(1).match(reg); //匹配目标参数
    if (r != null) return unescape(r[2]);
    return null;
}

// 图片压缩
export function dealImage(base64, w, callback) { //base64 当前图片信息 w 压缩图片大小 callback 返回图片路径
    const newImage = new Image();
    let quality = 0;
    if (base64.file.size / 1024 > 1025) { //判断图片是否大于1M
        quality = 0.5;    //压缩系数0-1之间
    } else {
        quality = 1;    //压缩系数0-1之间
    }
    newImage.src = base64.url;
    newImage.setAttribute('crossOrigin', 'Anonymous');
    let imgWidth,
        imgHeight;
    newImage.onload = function () {
        imgWidth = this.width;
        imgHeight = this.height;
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (Math.max(imgWidth, imgHeight) > w) {
            if (imgWidth > imgHeight) {
                canvas.width = w;
                canvas.height = w * imgHeight / imgWidth;
            } else {
                canvas.height = w;
                canvas.width = w * imgWidth / imgHeight;
            }
        } else {
            canvas.width = imgWidth;
            canvas.height = imgHeight;
            quality = 0.6;
        }
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(this, 0, 0, canvas.width, canvas.height);
        const wxbase64 = canvas.toDataURL('image/jpeg', quality); //压缩语句
        callback(wxbase64);
    };
}

// 深度比较
export function isEqual(one, other) {
    if (one instanceof Array && other instanceof Array) {
        if (one.length !== other.length) return false;
        for (let i = 0; i < one.length; i++) {
            if (!isEqual(one[i], other[i])) {
                return false;
            }
        }
        return true;
    }
    if (one instanceof Object && other instanceof Object) {
        for (const k in one) {
            if (one.hasOwnProperty(k) && !isEqual(one[k], other[k])) {
                return false;
            }
        }
        return true;
    }
    return one === other;
}

// 部分比较
export function isPartialEqual(one, other, list) {
    for (let i = 0; i < list.length; i++) {
        const k = list[i];
        if (!isEqual(one[k], other[k])) {
            return false;
        }
    }
    return true;
}

// 函数节流
export function throttle(handler, wait) {
    let lastTime = 0;
    return function (...args) {
        const nowTime = new Date().getTime();
        if (nowTime - lastTime > wait) {
            handler.apply(this, args);
            lastTime = nowTime;
        } else {
            console.log('请勿频繁点击！');
        }
    };
}

// 函数防抖
export function debounce(handler, delay) {
    let timer = null;
    return function (...args) {
        clearTimeout(timer);
        timer = setTimeout(() => {
            handler.apply(this, args);
        }, delay);
    };
}

// 获取像素密度, 解决canvas锯齿问题
export function getPixelRatio(context) {
    const backingStore = context.backingStorePixelRatio
        || context.webkitBackingStorePixelRatio
        || context.mozBackingStorePixelRatio
        || context.msBackingStorePixelRatio
        || context.oBackingStorePixelRatio
        || context.backingStorePixelRatio
        || 1;
    return (window.devicePixelRatio || 1) / backingStore;
}

//判断传入日期是否为今天
export function confirmDate(date) {
    const newDate = new Date();
    const y = newDate.getFullYear();
    let m = newDate.getMonth() + 1;
    m = m < 10 ? '0' + m : m;
    let d = newDate.getDate();
    d = d < 10 ? ('0' + d) : d;
    const current = y + '-' + m + '-' + d;
    if (current === date) {
        return '今天';
    }
    return date;
}

//按位补零
export function supple(num) {
    return num >= 0 && num < 10 ? '0' + num : '' + num;
}

//两数组去重
export function spliceArr(arr, arr2) {
    const tempArr = arr2;
    arr.forEach(item => {
        arr2.forEach((data, num) => {
            if (data.id === item) {
                tempArr.splice(tempArr.indexOf(arr2[num]), 1);
            }
        });
    });
    return tempArr;
}

//切割金额，变成一大一小
export function moneyDot(money) {
    let arr = ['00', '00'];
    if (money) {
        arr = money.toString().split('.');
        if (!arr[1]) {
            arr[1] = '00';
        }
    }
    return arr;
}


//设置tab颜色 1 =  #ff2d51 ; 2 = #F20C00;
export function navColor(obj) {
    const routerArr = ['myOrder', 'selfMention', 'shop-detail', 'self-list'];
    const routerPassWordArr = ['password'];
    let onOff = false;
    if (obj) {
        routerArr.forEach(item => {
            if (obj.includes(item)) {
                onOff = 1;
            }
        });
        routerPassWordArr.forEach(item => {
            if (obj.includes(item)) {
                onOff = 2;
            }
        });
    }
    return onOff;
}