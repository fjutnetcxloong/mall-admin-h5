/**
 * 用于定义local storage名称
 */
//我的模块
const MY = {
    ORDERID_PAY: 'orderIdPay', //支付时订单的id
    ORDER_NUM: 'orderNum' //支付时订单编号
};

export const LOCALSTORAGE = {
    USER_TOKEN: 'userToken',
    APP_VERSION: 'appVersion', // app版本
    ...MY
};
