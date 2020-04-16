/**
 * 登录页面
 */
import {connect} from 'react-redux';
import {Button, InputItem, Modal, List, Icon} from 'antd-mobile';
import {baseActionCreator as actionCreator} from '../../../redux/baseAction';
// import VerBtn from '../../common/verification-code/index';
import './Register.less';

const {MESSAGE: {LOGIN, Form}, COUNTERNUM, LOCALSTORAGE, TD_EVENT_ID, WEB_NAME} = Constants;
const {appHistory, validator, showInfo, systemApi: {setValue}, TD} = Utils;
const {urlCfg, appCfg} = Configs;

class Register extends BaseComponent {
    state = {
        convert: true, //登陆页面显示内容
        phone: '',
        code: '',
        lineText: '', //登录状态文字显示内容
        forgotText: '', // 忘记？
        time: COUNTERNUM,
        text: LOGIN.GET_CODE,
        resetTime: COUNTERNUM, //倒计时
        getCode: false,
        maxLength: 4, //验证码最大长度
        verification: '', //placeholder
        pssStatus: 0, //用户是否已经设置了密码
        textType: 'number', //input输入类型
        shadow: false,
        eyes: false, //密码显示状态
        modal1: false,
        userNum: [], //多个账号
        currentIndex: -1,
        currentUser: {},
        fouceShow: '',
        agreementStatus: false, // 协议状态
        agreeType: 0
    };

    componentDidMount() {
        const {showMenu} = this.props;
        showMenu(false);
    }

    componentWillUnmount() {
        super.componentWillUnmount();
        const {showMenu} = this.props;
        showMenu(true);
    }

    //手机号
    onPhoneChange = (value) => {
        if (validator.wipeOut(value).length < 11) {
            this.setState({
                phoneNumError: true
            });
        } else {
            this.setState({
                phoneNumError: false
            });
        }
        this.setState({
            phone: value
        }, () => {
            this.changeDisabled();
        });
    };

    fouceShow = (ev) => {
        ev.stopPropagation();
        this.setState({
            fouceShow: '1'
        });
    }

    fouceShowOne = (ev) => {
        ev.stopPropagation();
        this.setState({
            fouceShow: '2'
        });
    }

    fouceShowTwo = (ev) => {
        ev.stopPropagation();
        this.setState({
            fouceShow: ''
        });
    }

    //获取验证码
    getCode = () => {
        const {resetTime} = this.state;
        const phone = validator.wipeOut(this.state.phone);
        const myPhone = parseInt(phone, 10);
        if (!validator.checkPhone(myPhone)) {
            showInfo(Form.Phone_Input_Err, 1);
            return;
        }
        this.fetch(urlCfg.getCode, {data: {phone: myPhone}})
            .subscribe((res) => {
                if (res.status === 0) {
                    this.setTime(resetTime);
                }
            });
    };

    //保存用户登录信息
    saveUser = (item, index) => {
        this.setState({
            currentIndex: index,
            currentUser: item
        });
    }

    setTime = (countdown) => {
        if (countdown === 0) {
            this.setState({
                text: LOGIN.SEND_AGAIN,
                disabled: false
            });
            countdown = COUNTERNUM;
            return;
        }
        this.setState({
            text: `${LOGIN.SEND_AGAIN}${countdown}`,
            disabled: true
        });
        countdown--;

        setTimeout(() => {
            this.setTime(countdown);
        }, 1000);
    };

    //登录弹框
    loginModal = () => (
        <Modal
            className="login-modal"
            visible={this.state.modal1}
            transparent
            maskClosable={false}
            footer={[
                {text: '取消', onPress: () =>  this.onClose()},
                {text: '确定', onPress: () => this.onSure()}
            ]}
        >
            <List style={{height: 100, overflow: 'scroll'}}>
                {
                    this.state.userNum && this.state.userNum.map((item, index) => (
                        <List.Item onClick={() => this.saveUser(item, index)} key={item.no.toString()}>
                            <img src={item.avatarUrl} className="logo" alt=""/>
                            <div className="icon-logo"/>
                            <p className="user-info"><span>UID:</span>{item.no}</p>
                            <Icon type={this.state.currentIndex === index ? 'check-circle' : 'check-circle-o'} size="xxs"/>
                        </List.Item>
                    ))
                }
            </List>
        </Modal>
    )

    //确定选择登录
    onSure = () => {
        const {currentUser, code} = this.state;
        this.fetch(urlCfg.login, {
            data: {
                token: appCfg.token,
                code: `${currentUser.phone}UUUUUUUUUU${code}`,
                type: this.state.type || 3,
                no: Number(currentUser.no)
            }
        }).subscribe(res => {
            if (res && res.status === 0) {
                const {setUserToken} = this.props;
                setUserToken(res.LoginSessionKey);
                setValue(LOCALSTORAGE.USER_TOKEN, res.LoginSessionKey);
                if (appHistory.length() === 0) {
                    appHistory.replace('/home');
                } else {
                    appHistory.goBack();
                }
            }
        });
    }

    //关闭登录账号
    onClose = () => {
        this.setState({
            modal1: false
        });
    }

    //短信验证码登陆
    login = (e) => {
        e.stopPropagation();
        const phone = validator.wipeOut(this.state.phone);
        const code = this.state.code;
        if (!phone) {
            showInfo(Form.Phone_Err);
            return;
        }
        if (!code) {
            showInfo(Form.Code_Error);
            return;
        }
        const {verification} = this.state;
        if (verification && verification.length > 0) {
            if (verification === LOGIN.SET_YOUR_CODE) {
                this.fetch(urlCfg.login, {
                    data: {
                        token: appCfg.token,
                        code: `${phone}UUUUUUUUUU${code}`,
                        type: 3
                    }
                })
                    .subscribe((res) => {
                        if (res && res.status === 0) {
                            if (res.data) {
                                this.setState({
                                    modal1: true,
                                    userNum: res.data
                                });
                            } else {
                                this.setState({
                                    pssStatus: res.pass
                                }, () => {
                                    if (this.state.pssStatus === 0) {
                                        Modal.alert('提示', Form.Would_You_Set_Password, [
                                            {
                                                text: '取消',
                                                style: 'default',
                                                onPress: () => {
                                                    const {setUserToken} = this.props;
                                                    setUserToken(res.LoginSessionKey);
                                                    setValue(LOCALSTORAGE.USER_TOKEN, res.LoginSessionKey);
                                                    if (appHistory.length() === 0) {
                                                        appHistory.replace('/home');
                                                    } else {
                                                        appHistory.goBack();
                                                    }
                                                }
                                            },
                                            {
                                                text: '确定',
                                                onPress: () => {
                                                    appHistory.push(`/setpassword?phone=${phone}`);
                                                    const {setUserToken} = this.props;
                                                    setUserToken(res.LoginSessionKey);
                                                    setValue(LOCALSTORAGE.USER_TOKEN, res.LoginSessionKey);
                                                }
                                            }
                                        ]);
                                    } else {
                                        const {setUserToken} = this.props;
                                        setUserToken(res.LoginSessionKey);
                                        setValue(LOCALSTORAGE.USER_TOKEN, res.LoginSessionKey);
                                        if (appHistory.length() === 0) {
                                            appHistory.replace('/home');
                                        } else {
                                            appHistory.goBack();
                                        }
                                    }
                                });
                            }
                        }
                    });
            } else if (verification === LOGIN.SET_YOUR_PASSWORD) {
                this.pwdLogin(phone, code);
            }
        }
    };

    //账号密码登陆
    pwdLogin = (phone, code) => {
        this.fetch(urlCfg.login, {
            data: {
                token: appCfg.token,
                type: 1,
                code: `${phone}UUUUUUUUUU${code}`
            }
        }).subscribe((res) => {
            if (res && res.status === 0) {
                if (res.data) {
                    this.setState({
                        modal1: true,
                        userNum: res.data,
                        type: 1
                    });
                } else {
                    showInfo(Form.Login_Success);
                    const {setUserToken} = this.props;
                    setUserToken(res.LoginSessionKey);
                    setValue(LOCALSTORAGE.USER_TOKEN, res.LoginSessionKey);
                    if (appHistory.length() === 0) {
                        appHistory.replace('/home');
                    } else {
                        appHistory.goBack();
                    }
                }
            }
        });
    };

    goToOnce = () => {
        const {convert} = this.state;
        if (convert) {
            if (appHistory.length() === 0) {
                appHistory.replace('/home');
            } else {
                appHistory.goBack();
            }
        } else {
            this.setState({
                convert: true
            });
        }
    };

    //跳转到短信登陆页面
    loginByPassWord = (type) => {
        this.setState({
            convert: false
        });
        if (type === 'password') {
            TD.log(TD_EVENT_ID.LOGIN.ID, TD_EVENT_ID.LOGIN.LABEL.PASSWORD_LOGIN);
            this.setState({
                lineText: LOGIN.LODE_BY_CODE,
                forgotText: LOGIN.FORGOT_PASSWORD,
                verification: LOGIN.SET_YOUR_PASSWORD,
                maxLength: 18,
                code: '',
                textType: 'password'
            });
        } else {
            this.setState({
                lineText: LOGIN.LODE_BY_PASSWORD,
                forgotText: LOGIN.GET_ANY,
                verification: LOGIN.SET_YOUR_CODE,
                phone: '',
                textType: 'number'
            });
        }
    };

    //切换登陆方式
    changeMethods = () => {
        const {lineText} = this.state;
        if (lineText === LOGIN.LODE_BY_PASSWORD) {
            this.setState({
                lineText: LOGIN.LODE_BY_CODE,
                forgotText: LOGIN.FORGOT_PASSWORD,
                verification: LOGIN.SET_YOUR_PASSWORD,
                phone: '',
                code: '',
                maxLength: 18,
                textType: 'password'
            });
        } else {
            this.setState({
                lineText: LOGIN.LODE_BY_PASSWORD,
                forgotText: LOGIN.GET_ANY,
                verification: LOGIN.SET_YOUR_CODE,
                phone: '',
                code: '',
                maxLength: 4,
                textType: 'number'
            });
        }
    };

    //手机号报错
    onPhoneNumError = () => {
        if (this.state.phoneNumError) {
            showInfo(Form.Phone_Input_Err);
        }
    };

    //验证码
    onCodeChange = (value) => {
        this.setState({
            zhj: '1'
        });
        this.setState({
            code: value
        }, () => {
            this.changeDisabled();
        });
    };

    //改变登录按钮状态
    changeDisabled = () => {
        const {phone, code} = this.state;
        if (phone && code) {
            this.setState({
                disable: false
            });
        }
    };


    //微信登录
    wxLogin = () => {
        TD.log(TD_EVENT_ID.LOGIN.ID, TD_EVENT_ID.LOGIN.LABEL.WX_LOGIN);
    };

    //忘记密码或者验证码获取失败
    forgotStatus = () => {
        const {forgotText} = this.state;
        if (forgotText && forgotText.length > 0) {
            if (forgotText === LOGIN.FORGOT_PASSWORD) {
                appHistory.push('/passwordDetail?login=1');
            } else {
                this.setState({
                    shadow: true
                });
            }
        }
    };

    //关闭弹窗
    closeShow = () => {
        this.setState({
            shadow: false
        });
    };

    //修改密码显示状态
    changeEyes = () => {
        this.setState(prevState => ({
            eyes: !prevState.eyes
        }), () => {
            if (this.state.eyes) {
                this.setState({
                    textType: 'text'
                });
            } else {
                this.setState({
                    textType: 'password'
                });
            }
        });
    }

    //协议窗口弹出
    getAgreement = (type) => {
        const {getAgreement, agreement} = this.props;
        this.setState({
            agreementStatus: true,
            agreeType: type
        });
        if (!agreement.has('member_content') && type === 4) {
            getAgreement({type});
        }
        if (!agreement.has('secret_content') && type === 3) {
            getAgreement({type});
        }
    }

    // 关闭协议弹窗
    closeAgree = () => {
        this.setState({
            agreementStatus: false
        });
    }

    render() {
        const {convert, agreementStatus, phone, maxLength, code, text, lineText, forgotText, verification, textType, shadow, eyes, fouceShow, agreeType} = this.state;
        const {agreement} = this.props;
        return (
            <div className="login-register">
                {this.loginModal()}
                <div onClick={this.fouceShowTwo} className={`${convert ? 'register' : 'login-code'}`}>
                    <div className="register-del">
                        <div className="icon del-icon" onClick={this.goToOnce}/>
                    </div>
                    {convert && (
                        <div>
                            <div className="register-icon">
                                <div className="logo-icon"/>
                                <p className="reg-title">优质商品 快乐选购</p>
                            </div>
                            <div className="register-btn">
                                <div className="weChat-button">
                                    <Button
                                        onClick={this.wxLogin}
                                        type="primary"
                                        className="large-button touch-button"
                                    ><span className="icon icon-weixin"/>微信登录
                                    </Button>
                                </div>
                            </div>
                            <div className="vcode-button">
                                <div className="pass" onClick={() => this.loginByPassWord('password')}>密码登录</div>
                                <div className="pass pass-right" onClick={() => this.loginByPassWord('code')}>验证码登陆
                                </div>
                            </div>
                            <div className="register-bottom">
                                <div className="register-title">
                                    登录即注册，且代表同意
                                    <p className="bottom-red" onClick={() => this.getAgreement(4)}>《用户协议》、
                                    </p>
                                    <p
                                        className="bottom-red"
                                        onClick={() => this.getAgreement(3)}
                                    >《隐私政策》
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                    {!convert && (
                        <div className="enter-box">
                            <div className="login-title">欢迎登录{WEB_NAME}</div>
                            <div className="login-inp">
                                <div className={`inp-item ${fouceShow === '1' ? 'border-color' : ''}`}>
                                    <div className="icon inp-icon-t"/>
                                    <InputItem
                                        type="phone"
                                        placeholder={lineText === LOGIN.LODE_BY_PASSWORD ? LOGIN.PLACEHOLDER_DEFAULT : LOGIN.PLACEHOLDER}
                                        onErrorClick={this.onPhoneNumError}
                                        onChange={this.onPhoneChange}
                                        value={phone}
                                        onClick={this.fouceShow}
                                    />
                                </div>
                                <div className={`inp-item ${fouceShow === '2' ? 'border-color' : ''}`}>
                                    <div className="icon inp-icon-b"/>
                                    <InputItem
                                        type={textType}
                                        placeholder={verification}
                                        maxLength={maxLength}
                                        onChange={this.onCodeChange}
                                        value={code}
                                        onClick={this.fouceShowOne}
                                    />
                                    {
                                        verification.length > 0 && verification === LOGIN.SET_YOUR_PASSWORD ? (
                                            <div className="icon-box" onClick={this.changeEyes}>
                                                <div className={`icon ${eyes ? 'icon-open' : 'icon-close'}`}/>
                                            </div>
                                        ) : (
                                            <Button className={`btn-code ${phone.length === 13 ?  'highlight' : ''}`} onClick={this.getCode}>
                                                <span
                                                    className="code-text"
                                                >{text}
                                                </span>
                                            </Button>
                                        )
                                    }
                                </div>
                            </div>
                            <div className="checkMethods">
                                <div onClick={this.changeMethods}>{lineText}</div>
                                <div onClick={this.forgotStatus}>{forgotText}?</div>
                            </div>
                            <div className="log-button">
                                <Button
                                    type="primary"
                                    className="large-button"
                                    onClick={this.login}
                                >登录
                                </Button>
                            </div>
                            <div className="register-bottom">
                                <div className="register-title">
                                    登录即注册，且代表同意
                                    <p className="bottom-red" onClick={() => this.getAgreement(4)}>《用户协议》、
                                    </p>
                                    <p
                                        className="bottom-red"
                                        onClick={() => this.getAgreement(3)}
                                    >《隐私政策》
                                    </p>
                                </div>
                            </div>
                            <div className="thirdparty">
                                <div className="others">
                                    {/*<div className="line"/>*/}
                                    <div className="line">第三方登录</div>
                                    {/*<div className="line"/>*/}
                                </div>
                                <div className="wxLogin"/>
                            </div>
                        </div>
                    )}
                </div>

                {
                    shadow ? (
                        <div className="shadow">
                            <div className="unaccessible">
                                <div className="icon icon-close" onClick={this.closeShow}/>
                                <div className="rule">
                                    <div className="rule-top">如您收不到验证码，请参考以下情形</div>
                                    <div className="rule-bottom">
                                        <div className="details">1.检查您的手机号是否输入正确。</div>
                                        <div className="details">2.检查您的手机是否已经停机/关机/没有信号。</div>
                                        <div className="details">3.检查您的垃圾箱短信，确保短信没有被屏蔽。</div>
                                        <div className="details">4.如您在境外使用或使用境外手机，建议更换手机尝试。</div>
                                        <div className="details">如您尝试以上方法后仍然无法收到，请点击下方联系我们进行反馈，我们会尽快查看。</div>
                                    </div>
                                    <div className="contact-us">联系我们</div>
                                </div>
                            </div>
                        </div>
                    ) : null
                }
                <Modal
                    visible={agreementStatus}
                    transparent
                    closable
                    onClose={this.closeAgree}
                    className="agreement-leijiang"
                >
                    <div style={{height: 500, width: '100%'}}>
                        {agreeType === 4 ? agreement.get('member_content') : agreement.get('secret_content')}
                    </div>
                </Modal>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    const base = state.get('base');
    return {
        token: base.get('token'),
        agreement: base.get('agreementInfo')
    };
};

const mapDispatchToProps = {
    setUserToken: actionCreator.setUserToken,
    getAgreement: actionCreator.getAgreement,
    showMenu: actionCreator.showMenu
};

export default connect(mapStateToProps, mapDispatchToProps)(Register);
