
/**
 * 系统功能：物流弹框出现时控制背景不可滚动，关闭弹框恢复滚动
 * @type {{getScrollTop(): *, offRoll(*): void, openRoll(*=): void, mobileTyp(): *}}
 */
const rollStatus = {
    // 判断是移动端还是PC端
    mobileTyp() {
        const userAgentInfo = navigator.userAgent;
        const Agents = ['Android', 'iPhone', 'SymbianOS', 'Windows Phone', 'iPod'];
        let flag = true;
        for (let v = 0; v < Agents.length; v++) {
            if (userAgentInfo.indexOf(Agents[v]) > 0) {
                flag = true;
                break;
            }
        }
        if (window.screen.width >= 768) {
            flag = false;
        }
        return flag;
    },

    // 出现弹框页面禁止滚动
    offRoll(position) {
        if (rollStatus.mobileTyp()) {
            document.body.style.overflow = 'hidden';
            document.body.style.position = 'fixed';
            document.body.style.width = '100%';
            document.body.style.top = `-${position}px`;
        } else {
            document.body.style.overflow = 'hidden';
        }
    },

    // 弹框关闭恢复滚动
    openRoll(position) {
        if (rollStatus.mobileTyp()) {
            document.body.style.overflow = 'auto';
            document.body.style.position = 'static';
            document.body.style.top = 'initial';
        } else {
            document.body.style.overflow = 'auto';
        }
        window.scrollTo(0, position);
    },

    // 获取滚动条位置
    getScrollTop() {
        return document.documentElement.scrollTop || document.body.scrollTop;
    }
};
export {rollStatus};
