/**
 * 系统功能：数据存储，系统环境
 * @type {Storage}
 */
const storage = window.localStorage,
    PRE_NAME = 'zpyg_';

const systemApi = {
    getValue(name) { // 获取数据
        return storage.getItem(PRE_NAME + name);
    },
    setValue(name, value) { // 设置数据
        storage.setItem(PRE_NAME + name, value);
    },
    removeValue(name) { // 删除数据
        storage.removeItem(PRE_NAME + name);
    },
    isProdEnv() { // 生产环境
        return this.__chkEnv('production');
    },
    ispreProdEnv() { // 预生产环境
        return this.__chkEnv('prev');
    },
    isTestEnv() { // 测试环境
        return this.__chkEnv('test');
    },
    isDevEnv() { // 开发环境
        return this.__chkEnv('development');
    },
    __chkEnv(envName) {
        const env = process.env.NODE_ENV || '';
        if (env === envName) return true;
        return false;
    },
    getFullHeight() {
        return (window.innerHeight > 0)
            ? window.innerHeight : window.screen.height;
    },

    getFullWidth() {
        return (window.innerWidth > 0)
            ? window.innerWidth : window.screen.width;
    },

    getScreenHeight() {
        return window.screen.height;
    },

    getFullRemWidth() {
        const pxWidth = this.getFullWidth();
        let deviceWidth = document.documentElement.clientWidth;
        if (deviceWidth > 750) deviceWidth = 750;
        const ratio = deviceWidth / 7.5;
        return pxWidth / ratio;
    },
    getFullRemHeight() {
        const pxHeight = this.getFullHeight();
        let deviceWidth = document.documentElement.clientWidth;
        if (deviceWidth > 750) deviceWidth = 750;
        const ratio = deviceWidth / 7.5;
        return pxHeight / ratio;
    },
    isAndroid: (/android/gi).test(navigator.appVersion),
    isIPhone: (/iphone|ipad/gi).test(navigator.platform),
    fullHeight: null,
    fullRemHeight: null
};
systemApi.fullHeight = systemApi.getFullHeight();
systemApi.fullRemHeight = systemApi.getFullRemHeight();

export {systemApi};
