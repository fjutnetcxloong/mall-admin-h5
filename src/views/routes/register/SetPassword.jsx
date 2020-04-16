/*
* 设置密码
* */
import React from 'react';
import {InputItem, Button} from 'antd-mobile';
import AppNavBar from '../../common/navbar/NavBar';
import './SetPassword.less';

const {urlCfg} = Configs;
const {getUrlParam, appHistory, showInfo, showSuccess, native} = Utils;
const {MESSAGE: {Form, Feedback}} = Constants;

export default class SetPassWord extends BaseComponent {
    state = {
        password: '', // 输入密码
        rePwd: '', // 确认密码// 输入框的禁用状态
        type: true, // 密码输入内容的状态
        reType: true, //确认密码内容状态
        reEdit: false //确认密码输入状态
    };

    //保存输入密码
    getPwd = (val) => {
        this.setState({
            password: val
        });
    };

    //校验密码
    checkPwd = () => {
        const {password} = this.state;
        if (password.length < 6 || password.length > 20) {
            showInfo(Form.Error_Password_Length);
            this.setState({
                reEdit: false
            });
        } else {
            this.setState({
                reEdit: true
            });
        }
    };

    //获取确认密码
    getRePwd = (val) => {
        this.setState({
            rePwd: val
        });
    };

    //校验两次密码是否相等
    checkTrue = () => {
        const {rePwd, password} = this.state;
        const phone = decodeURI(getUrlParam('phone', encodeURI(this.props.location.search)));
        if (rePwd !== '' && password !== '') {
            if (rePwd !== password) {
                showInfo(Form.Error_Password_Confirm);
            } else {
                this.fetch(urlCfg.modifyLoginPassword, {
                    data: {
                        pwd: password,
                        phone: phone
                    }
                }).subscribe((res) => {
                    if (res && res.status === 0) {
                        showSuccess(Feedback.Set_Success);
                        if (process.env.NATIVE) {
                            native('goHome');
                        } else {
                            appHistory.replace('/home');
                        }
                    }
                });
            }
        } else {
            showInfo(Form.Set_Your_Password);
        }
    };

    //修改文字的隐藏显示状态
    changeStatus = (status) => {
        if (status === 'pass') {
            this.setState((pervState) => ({
                type: !pervState.type
            }));
        } else {
            this.setState((pervState) => ({
                reType: !pervState.reType
            }));
        }
    };

    //暂不设置返回首页
    notSet = () => {
        // appHistory.go(-2);
        if (process.env.NATIVE) {
            native('goHome');
        } else {
            appHistory.replace('/home');
        }
    };

    //确认密码是否输入
    infoRepass = () => {
        const {reEdit} = this.state;
        if (!reEdit) {
            showInfo(Form.No_Password);
        }
    }

    goBackModal = () => {
        if (process.env.NATIVE) {
            native('goHome');
        } else {
            appHistory.replace('/home');
        }
    }

    render() {
        const {reType, type, reEdit} = this.state;
        return (
            <div data-component="set-passWord" data-role="page" className="set-passWord">
                <AppNavBar goBackModal={this.goBackModal} title="设置密码"/>
                <div className="set-content">
                    <p className="set-title">设置登陆密码</p>
                    <p className="set-notice">设置登录密码后，您可使用手机号+密码或UID+密码登录</p>
                    <div className="input-box">
                        <div className="inner-pass">
                            <InputItem
                                type={type ? 'password' : 'text'}
                                placeholder="请输入6~20位密码"
                                maxLength="20"
                                onBlur={this.checkPwd}
                                onChange={(val) => this.getPwd(val)}
                            ><span className="text">输入密码</span>
                            </InputItem>
                            <span className={`icon ${type ? 'icon-close' : 'icon-open'}`} onClick={() => this.changeStatus('pass')}/>
                        </div>
                        <div className="sure-pass">
                            <InputItem
                                type={reType ? 'password' : 'text'}
                                placeholder="请再次输入密码"
                                maxLength="18"
                                editable={reEdit}
                                onClick={this.infoRepass}
                                onChange={(val) => this.getRePwd(val)}
                            ><span className="text">确认密码</span>
                            </InputItem>
                            <span className={`icon ${reType ? 'icon-close' : 'icon-open'}`} onClick={() => this.changeStatus('repass')}/>
                        </div>
                    </div>
                    <div className="btn-box">
                        <Button onClick={this.notSet}>暂不设置</Button>
                        <Button type="primary" onClick={this.checkTrue}>设置完成</Button>
                    </div>
                </div>
            </div>
        );
    }
}
