
/**
 * 基础组件，加载全局控制的组件，Loading、alert、confirm
 */

import {connect} from 'react-redux';
import {Alert, Confirm} from '../../../components/modal/index';
import CircleLoading from '../animation/circleLoading';
import Menu from '../menu/Menu';

const {native} = Utils;

class BasePageHybrid extends BaseComponent {
    componentDidMount() {
        if (process.env.NATIVE) {
            const timeClear = setTimeout(() => {
                const skelon = document.getElementById('skelon');
                skelon.style.display = 'none';
                clearTimeout(timeClear);
            }, 1000);
        }
    }

    componentWillUpdate() {
        if (!window.localStorage.getItem('close_key_board') && process.env.NATIVE) { //控制是否使用此方法
            //关闭键盘
            native('closeKeyboard');
        }
    }

    renderAlert = () => {
        const {
            alertShow, alertTitle, alertMsg, alertCallback,
            alertBtnText
        } = this.props;
        return (
            <Alert
                visible={alertShow}
                title={alertTitle}
                message={alertMsg}
                btnText={alertBtnText}
                callback={alertCallback}
            />
        );
    };

    renderConfirm = () => {
        const {
            confirmShow, cfmTitle, cfmMsg, cfmBtnTexts,
            cfmCallbacks
        } = this.props;
        return (
            <Confirm
                visible={confirmShow}
                title={cfmTitle}
                message={cfmMsg}
                btnTexts={cfmBtnTexts}
                callbacks={cfmCallbacks}
            />
        );
    };

    //导航菜单

    render() {
        const {showMenu, loadingShow} = this.props;
        return (
            <div data-component="base" data-role="page">
                {loadingShow && <CircleLoading/>}
                {this.renderAlert()}
                {this.renderConfirm()}
                {
                    showMenu ? <Menu/> : null
                }
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    const base = state.get('base');
    return {
        loadingShow: base.get('loadingShow'),
        alertShow: base.get('alertShow'),
        alertTitle: base.get('alertTitle'),
        alertMsg: base.get('alertMsg'),
        alertSubMsg: base.get('alertSubMsg'),
        alertCallback: base.get('alertCallback'),
        alertBtnText: base.get('alertBtnText'),
        confirmShow: base.get('confirmShow'),
        cfmTitle: base.get('cfmTitle'),
        cfmMsg: base.get('cfmMsg'),
        cfmBtnTexts: base.get('cfmBtnTexts'),
        cfmCallbacks: base.get('cfmCallbacks'),
        showMenu: base.get('showMenu')
    };
};


export default connect(mapStateToProps, null)(BasePageHybrid);
