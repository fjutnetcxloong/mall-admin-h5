/**
 * @desc 表单验证公用函数
 */
/* eslint-disable no-restricted-globals*/
/* eslint-disable  no-useless-escape */
const {VERIFY_FAILED} = Constants;
const {showInfo} = Utils;
// 验证手机号
export function checkPhone(phone) {
    return /^[1](([3][0-9])|([4][5-9])|([5][0-3,5-9])|([6][5,6])|([7][0-8])|([8][0-9])|([9][1,8,9]))[0-9]{8}$/.test(phone);
}
// 验证固定电话
export function checkLandline(value) {
    return /^(([0\+]\d{2,3}-?)?(0\d{2,3})-?)?(\d{7,8})(-(\d{3,}))?$/.test(value);
}

// 验证邮箱
export function checkEmail(value) {
    return /^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/.test(value);
}

// 验证区间值
export function checkMinMax(value, vMin, vMax) {
    vMin = parseFloat(vMin);
    vMax = parseFloat(vMax);
    value = parseFloat(value);
    const minFlag = isNaN(vMin) ? true : vMin <= value;
    const maxFlag = isNaN(vMax) ? true : vMax >= value;
    return minFlag && maxFlag;
}

// 验证字符串长度区间
export function checkStr(value, minLen, maxLen) {
    return /^\S+/.test(value) && checkMinMax(value.length, minLen, maxLen);
}

export function checkInt(value, vMin, vMax) {
    return /^[-\+]?\d+$/.test(value) && checkMinMax(value, vMin, vMax);
}

export function checkFloat(value, vMin, vMax) {
    return /^[-\+]?\d+(\.\d+)?$/.test(value) && checkMinMax(value, vMin, vMax);
}

// 验证字母
export function checkEN(value) {
    return /^\w+$/.test(value);
}

/*export function checkCn(value) {
    return /^[\u0391-\uFFE5]+$/.test(value);
}*/

// 验证是否汉字
export function checkCN(strValue) {
    return /^[\u4e00-\u9fa5]+$/gi.test(strValue);
}

// 去掉汉字
export function removeCN(strValue) {
    if (strValue !== null && strValue !== '') {
        const reg = /[\u4e00-\u9fa5]/g;
        return strValue.replace(reg, '');
    }
    return '';
}

// 只提取汉字
export function getCN(strValue) {
    if (strValue !== null && strValue !== '') {
        const reg = /[\u4e00-\u9fa5]/g;
        if (strValue.match(reg)) return strValue.match(reg).join('');
        return '';
    }
    return '';
}

// 验证小数位
export function checkDigits(numValue, len) {
    const re = /^[0-9]+.?[0-9]*$/;
    if (re.test(Number(numValue))) {
        const dis = numValue.toString().split('.')[1];
        if (dis) {
            if (dis.length <= len) return true;
            return false;
        }
        return true;
    }
    return false;
}

//验证密码是否合适
export function checkPassWord(str) {
    const regex = new RegExp('^[0-9a-zA-Z]+$');
    return regex.test(str);
}

// 保留小数点后几位
export function toFixed(strValue, num) {
    const re = new RegExp('([0-9]+.[0-9]{' + num + '})[0-9]*', 'g');
    return strValue.replace(re, '$1');
}

// 判断是否是整数类型
export function isInteger(obj) {
    //是整数，则返回true，否则返回false
    return typeof obj === 'number' && obj % 1 === 0;
}

// 判断是数字且位数
export function floatType(numValue, len) {
    const re = /^[0-9]+.?[0-9]*$/;
    if (re.test(Number(numValue))) {
        const dis = numValue.toString().split('.')[1];
        if (dis) {
            if (dis.length <= len) return true;
            return false;
        }
        return true;
    }
    return false;
}

// 判断是否n的倍数
export function multipleIntenger(num, mul) {
    return Number(num) % mul === 0;
}


//身份证号验证
export function ID(num) {
    return /^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/.test(num);
}

//银行卡号验证
export function bankCard(num) {
    return /^\d{16,22}$/.test(num);
}

//uid验证
export function UID(num) {
    return num > 9926;
}

//去除字符串空格
export function wipeOut(str) {
    return str.replace(/\s+/g, '');
}

//检验[min-max]个中文字符
export function checkRange(min, max, value) {
    const re = new RegExp(`^[\u4E00-\u9FA5]{${min},${max}}$`);
    return re.test(value);
}

//判断字符串、对象、数组、是否为空,判断bool型,undefined
export function isEmpty(value, message, callback) {
    const type =  Object.prototype.toString.call(value);
    let arrayVerify = false;
    let objectVerify = false;
    //判断数字
    const numVerify = type.indexOf('Number') !== -1 && value;
    //判断字符串
    const stringVerify = type.indexOf('String') !== -1 && value;
    //判断bool型
    const boolVerify = type.indexOf('Boolean') !== -1 && value;
    //判断数组
    if (type.indexOf('Array') !== -1) {
        arrayVerify = value.every(item => item !== '');
    }
    //判断对象
    if (type.indexOf('Object') !== -1) {
        objectVerify = JSON.stringify(value) !== '{}';
    }
    if (stringVerify || arrayVerify || objectVerify || boolVerify || numVerify) {
        return true;
    }
    callback(VERIFY_FAILED);
    showInfo(message);
    return false;
}

//提示语
export function showMessage(message, callback) {
    callback(VERIFY_FAILED);
    showInfo(message);
}
export function checkShopName(value) {
    const reg = /^[0-9a-zA-Z\u4e00-\u9fa5]+$/;
    return reg.test(value);
}
//校验纯数字并且位数
export function checkNum(value, m, n) {
    const reg = /^\d{m,n}$/;
    return reg.test(value);
}

//校验仅包含数字字母和中文
export function ckeckShopName(value) {
    const reg = /^[0-9a-zA-Z\u4e00-\u9fa5]+$/;
    return reg.test(value);
}
