
import {connect} from 'react-redux';
import AppNavBar from '../../../../../common/navbar/NavBar';
import './Password.less';

const {appHistory} = Utils;
const {navColorR, gradation} = Constants;
class Password extends BaseComponent {
    //修改登录密码
    passwordDetail = () => {
        appHistory.push('/passwordDetail');
    }

    //修改支付密码
    passwordPayment = () => {
        appHistory.push('/passwordPayment');
    }

    render() {
        return (
            <div data-component="Password" data-role="page" className="password">
                <AppNavBar title="密码管理" backgroundColor={gradation} redBackground color={navColorR}/>
                <div className="land" onClick={this.passwordDetail}>
                    <div className="icon land-lo"/>
                    <div className="land-c">
                        <span>修改登入密码</span>
                    </div>
                    <div className="icon land-r"/>
                </div>
                <div className="land" onClick={this.passwordPayment}>
                    <div className="icon land-lt"/>
                    <div className="land-c">
                        <span>修改支付密码</span>
                    </div>
                    <div className="icon land-r"/>
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => {
    const EditInfo = state.get('my');
    return {
        editInfo: EditInfo.get('editInfo')
    };
};
export default connect(
    mapStateToProps,
    null
)(Password);
