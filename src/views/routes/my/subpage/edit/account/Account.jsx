/**账号切换 */

import React from 'react';
import {connect} from 'react-redux';
import {List, Button, Radio, SwipeAction, InputItem} from 'antd-mobile';
import AppNavBar from '../../../../../common/navbar/NavBar';
import {myActionCreator as actionCreator} from '../../../actions/index';
import {baseActionCreator} from '../../../../../../redux/baseAction';
import './Account.less';

const RadioItem = Radio.RadioItem;

const {urlCfg} = Configs;
const {showInfo, appHistory, systemApi: {setValue}} = Utils;
const {MESSAGE: {Feedback}} = Constants;

class Account extends BaseComponent {
    state = {
        dataList: [], //账号集合
        editModal: '', //状态切换
        loginShow: false, //切换账号过期的时候，弹框控制
        loginAgain: false //账号过期，点击确定去登录时的控制
    };

    componentDidMount() {
        const {accoutList, switchAccountList} = this.props;
        if (!accoutList) {
            switchAccountList();
        }
    }

    //添加地址
    addAounted =() => {
        appHistory.push('/addAccount');
    }

    //切换账号
    switchingAccounts = (id, password = '') => {
        const {showConfirm, switchAccountList, removeUserInfo, removebankInfo, removeNickNameInfo, removeAressInfo, removeRegionInfo, removeUserIdInfo} = this.props;
        this.fetch(urlCfg.switchAccountInfo, {data: {id, password}})
            .subscribe(res => {
                if (res && res.status === 0) {
                    if (res.data.status === 1) {
                        showInfo(res.data.message);
                        if (res.message === 'success') {
                            this.setState({
                                loginAgain: false
                            });
                        } else {
                            showConfirm({
                                title: '您的账号密码已更改，为了您的账户安全需要重新登录验证您的身份',
                                callbacks: [null, () => {
                                    this.setState({
                                        loginAgain: true,
                                        loginId: res.data.id,
                                        loginUid: res.data.uid
                                    });
                                }]
                            });
                        }
                    } else {
                        this.loginCel();//关闭弹框
                        //切换账号需要重新设置userToken
                        setValue(res.data.LoginSessionKey);
                        this.props.setUserToken(res.data.LoginSessionKey);
                        switchAccountList();
                        //清除当前页面redux
                        removeUserInfo();
                        removebankInfo();
                        removeNickNameInfo();
                        removeAressInfo();
                        removeRegionInfo();
                        removeUserIdInfo();
                    }
                }
            });
    }

    //切换账号时，账号过期。弹框取消
    cancel = ()  => {
        this.setState({
            loginShow: false,
            deleteShow: false
        });
    }

    //切换账号时，账号过期，前往输入密码
    confirm = () => {
        this.setState({
            loginShow: false, //提示登录过期弹框关闭
            loginAgain: true //密码输入框弹出
        });
    }

    //登录密码框按钮点击取消
    loginCel = () => {
        this.setState({
            loginAgain: false
        });
    }

    //立即登录
    loginRight = () => {
        // FIXME: 尽量不操作DOM
        //已优化
        const {loginId, password} = this.state; //登录所需id
        this.switchingAccounts(loginId, password);
    }

    //删除用户弹框
    deleteList = (value, id, num) => {
        const {showAlert, switchAccountList, showConfirm} = this.props;
        if (num === '1') {
            showAlert({
                title: '主账号不能删除',
                btnText: '好'
            });
            return;
        }
        showConfirm({
            title: `是否删除账号 ${value}`,
            callbacks: [null, () => {
                this.fetch(urlCfg.deleteAccount, {data: {id: value}})
                    .subscribe(res => {
                        if (res && res.status === 0) {
                            showInfo(Feedback.Account_Delete_Success);
                            switchAccountList();
                        }
                    });
            }]
        });
    }

    //默认结构
    defaultModal = () => {
        const {accoutList} = this.props;
        return  (
            <div data-component="aount" data-role="aount" className="aount">
                <AppNavBar goBackModal={this.props.goBackModal} title="账户管理"/>
                <div className="aountIndex">
                    <List>
                        {accoutList && accoutList.map(item => (
                            <SwipeAction
                                key={item.id}
                                right={[
                                    {
                                        text: '删除',
                                        style: {backgroundColor: '#E21E13', color: '@white', borderBottom: '1px solid #ccc'},
                                        onPress: () => this.deleteList(item.no, item.id, item.if_owner)
                                    }
                                ]}
                            >
                                <RadioItem
                                    onClick={() => this.switchingAccounts(item.id)}
                                    key={item.id}
                                    checked={item.iflogin}
                                >
                                    <div className="every-one">
                                        <img src={item.avatarUrl}/>
                                        <div>
                                            <p>UID:<span>{item.no}</span></p>
                                            类别:<span>{item.typeName}</span>
                                        </div>
                                    </div>
                                </RadioItem>
                            </SwipeAction>
                        ))}
                    </List>
                </div>
                <div className="add-button">
                    <Button onClick={this.addAounted}><i className="add-icon icon"/>添加账号</Button>
                </div>
            </div>
        );
    }

    render() {
        const {editModal, loginAgain, loginUid} = this.state;
        return (
            <div className="account-main">
                {
                    !editModal && this.defaultModal()
                }
                {   //账号过期，输入密码弹框
                    loginAgain && (
                        <div className="login-again">
                            <div className="login-second">
                                <p>账号<span>{loginUid}</span></p>
                                <p><span>密码</span><InputItem type="password" onChange={(data) => this.setState({password: data})}/></p>
                                <p className="must-sure">
                                    <span onClick={this.loginCel}>取消</span>
                                    <span onClick={this.loginRight}>确定</span>
                                </p>
                            </div>
                        </div>
                    )
                }
            </div>
        );
    }
}


const mapStateToProps = state => {
    const EditInfo = state.get('my');
    return {
        accoutList: EditInfo.get('accoutList')
    };
};
const mapDispatchToProps = {
    setUserToken: baseActionCreator.setUserToken,
    showConfirm: baseActionCreator.showConfirm,
    showAlert: baseActionCreator.showAlert,
    switchAccountList: actionCreator.switchAccountList,
    removeUserInfo: actionCreator.removeUserInfo,
    removebankInfo: actionCreator.removebankInfo,
    removeNickNameInfo: actionCreator.removeNickNameInfo,
    removeAressInfo: actionCreator.removeAressInfo,
    removeRegionInfo: actionCreator.removeRegionInfo,
    removeUserIdInfo: actionCreator.removeUserIdInfo
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Account);
