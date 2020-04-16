/**
 * 根组件  封装组件一些逻辑通用方法
 */
import PropTypes from 'prop-types';
import {is} from 'immutable';
import {baseActionCreator as actionCreator} from '../../redux/baseAction';

class BaseComponent extends React.Component {
    static propTypes = {
        children: PropTypes.array
    };


    static contextTypes = {
        store: PropTypes.object
    };

    static defaultProps = {
        children: null
    };


    constructor(props, context) {
        super(props, context);
        if (process.env.NATIVE) {
            window.DsBridge.call('wxLoginCallback', (data) => { //设置userToken
                const obj = data ? JSON.parse(data) : '';
                if (obj && obj.status === '0') {
                    window.localStorage.setItem('zpyg_userToken', obj.data.usertoken);
                    this.context.store.dispatch(actionCreator.setUserToken(obj.data.usertoken));
                }
            });
        }
    }

    componentDidMount() {
        // window.timeClear = setTimeout(() => {
        //     const skelon = document.getElementById('skelon');
        //     skelon.style.display = 'none';
        // }, 1500);
        if (process.env.NATIVE) {
            const innerHeight = window.innerHeight;
            window.addEventListener('resize', () => {
                const root = document.getElementById('root');
                const newInnerHeight = window.innerHeight;
                if (innerHeight - newInnerHeight > 200) { //弹出键盘时触发
                    root.setAttribute('style', 'overflow-y:auto;height:330px');
                } else {
                    root.setAttribute('style', 'overflow-y:"";height:""');
                }
            });
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        const thisProps = this.props || {},
            thisState = this.state || {},
            newProps = nextProps || {},
            newState = nextState || {};
        if (Object.keys(thisProps).length !== Object.keys(newProps).length
            || Object.keys(thisState).length !== Object.keys(newState).length) {
            return true;
        }
        for (const key in newProps) {
            if (newProps.hasOwnProperty(key) && !is(thisProps[key], nextProps[key])) {
                return true;
            }
        }
        for (const key in newState) {
            if (newState.hasOwnProperty(key) && !is(thisState[key], nextState[key])) {
                return true;
            }
        }
        return false;
    }

    // 元素销毁时，清掉未完成Ajax回调函数, 关闭alert、confirm弹窗
    componentWillUnmount() {
        const {store} = this.context,
            base = store.getState().get('base');
        base.get('alertShow') && store.dispatch(actionCreator.hideAlert());
        base.get('confirmShow') && store.dispatch(actionCreator.hideConfirm());
        // console.log(XHR.ajaxQueue);
        if (XHR.ajaxQueue.length > 0) {
            XHR.abort();
        }
        //不能在已经被销毁的组件中执行setState，防止出现内存泄漏的情况
        this.setState((prevState) => ({
            prevState
        }));
        // clearTimeout(window.timeClear);
    }

    // 获取组件名称
    getComponnetName() {
        try {
            return this.__proto__.constructor.name;
        } catch (e) {
            return '';
        }
    }

    // 获取子元素, 返回正确的子元素
    getChildren() {
        const children = [];
        React.Children.forEach(this.props.children, (child) => {
            if (React.isValidElement(child)) {
                children.push(child);
            }
        });
        return children;
    }

    /**
     * 发送http请求
     *
     * @param url
     * @param params
     * @returns {observable}
     */
    fetch(url, params, noShowLoading) {
        return XHR.fetch(url, params, noShowLoading);
    }

    // 终止http请求
    abort(url) {
        XHR.abort(url);
    }
}

export default BaseComponent;
