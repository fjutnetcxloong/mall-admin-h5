
import React from 'react';
import {InputItem, Button} from 'antd-mobile';
import {connect} from 'react-redux';
import {createForm} from 'rc-form';
import classnames from 'classnames';
import AppNavBar from '../../../../../../common/navbar/NavBar';
import VerificationCode from '../../../../../../common/verification-code';
import GeisInputItem from '../../../../../../common/form/input/GeisInputItem';
import {baseActionCreator as actionCreator} from '../../../../../../../redux/baseAction';
import './PasswordDetail.less';

const {appHistory, validator, showInfo, showSuccess, getUrlParam, native} = Utils;
const {urlCfg} = Configs;
const {MESSAGE: {Form, Feedback}, gradation} = Constants;
const getPass = { //获取验证码按钮的样式
    float: 'right',
    marginRight: '18px',
    color: '#de1212',
    border: 'none',
    // marginTop: '18px',
    background: '@white',
    lineHeight: '44px'
};

class passwordDetail extends BaseComponent {
    constructor(props) {
        super(props);
        this.state = {
            countdown: Constants.COUNTERNUM,
            phoneShow: true, //显示手机验证
            passShow: false, //显示密码验证
            phoneCode: '', //验证码初始值
            phoneNum: '', //电话号码初始值
            password: '', //密码初始值
            passwordAgain: '', //二次密码初始值
            sentPay: '', //是否设置支付密码,
            getOff: false, //点击获取验证码是否可以获取，默认不可以，除非输入的电话号码符合要求
            moreAccount: false, // 展示更多账号供其选择，忘记密码的时候
            accountList: [], //更多账号的列表
            passType: true, //第一个密码框的状态
            passAType: true, //第二个密码框的状态
            isLoagin: decodeURI(getUrlParam('login', encodeURI(this.props.location.search))) !== 'null' ? decodeURI(getUrlParam('login', encodeURI(this.props.location.search))) : 0
        };
    }

    //验证支付密码是否设置
    verifyPayword = () => {
        const {isLoagin, uid} = this.state;
        this.fetch(urlCfg.memberStatus, {data: {types: 0, chk_pass: isLoagin || 0, no: uid}}, true)
            .subscribe(res => {
                if (res && res.status === 0) {
                    if (res.data.status !== 0) { //status为0为已设置，其他都是未设置
                        this.setState({
                            statusPay: 1 //
                        });
                    }
                }
            });
    };

    //获取验证码
    getPhoneCode = () => {
        const {form: {getFieldValue}} = this.props;
        const phoneNum = getFieldValue('phone');
        if (!phoneNum) {
            showInfo(Form.No_Phone);
            return;
        }
        if (!validator.checkPhone(validator.wipeOut(phoneNum))) {
            showInfo(Form.Error_Phone);
            return;
        }
        this.fetch(urlCfg.getTheAuthenticationCode, {data: {phone: validator.wipeOut(phoneNum)}})
            .subscribe(res => {
                if (res && res.status === 0) {
                    showSuccess(Feedback.Send_Success);
                }
            });
    };

    //点击下一步的时候
    getNext = () => {
        const {form: {validateFields}} = this.props;
        const {isLoagin, phoneNum} = this.state;
        if (isLoagin === '1') {
            validateFields({first: true}, (error, value) => {
                if (!error) {
                    this.fetch(urlCfg.getMoreAccounts, {data: {phone: validator.wipeOut(phoneNum)}})
                        .subscribe(res => {
                            if (res && res.status === 0) {
                                if (res.data.length > 1) { //账号超过一个的时候展示选择框
                                    this.setState({
                                        moreAccount: true,
                                        accountList: res.data
                                    });
                                } else {
                                    this.setState({
                                        uid: res.data[0].no,
                                        phoneShow: false,
                                        passShow: true
                                    });
                                }
                            }
                        });
                }
            });
        } else {
            this.nextPage();
            //验证是否设置过支付密码
            this.verifyPayword();
        }
    }

    //下一步
    nextPage = () => {
        const {form: {validateFields, getFieldValue}, showConfirm} = this.props;
        const {passShow, phoneNum, statusPay, isLoagin, uid} = this.state;
        !passShow && validateFields({first: true, force: true}, (error, value) => {
            if (!error) {
                const phoneCode = getFieldValue('authCode');
                this.fetch(urlCfg.verificationVerificationCode, {data: {phone: validator.wipeOut(phoneNum), uid, vcode: validator.wipeOut(phoneCode), chk_pass: isLoagin || 0}})
                    .subscribe(res => {
                        if (res && res.status === 0) {
                            this.setState({
                                phoneShow: false,
                                passShow: true
                            });
                        }
                    });
            }
        });
        passShow && validateFields({first: true}, (error, value) => {
            const firstPass = getFieldValue('firstPass');
            const nextPass = getFieldValue('nextPass');
            if (!error) {
                if (firstPass !== nextPass) {
                    showInfo(Form.Error_Password_Confirm);
                    return;
                }
                this.fetch(urlCfg.modifyLoginPassword, {data: {pwd: firstPass, no: uid, phone: validator.wipeOut(phoneNum), chk_pass: isLoagin || 0}})
                    .subscribe(res => {
                        if (res && res.status === 0) {
                            if (isLoagin === '1') { //忘记密码状态下设置成功
                                if (process.env.NATIVE) {
                                    native('loginout');
                                } else {
                                    appHistory.replace('/login');
                                }
                            } else if (statusPay === 1) { //正常情况下设置成功
                                showConfirm({ //如果没设置就弹出弹框
                                    title: '登入密码设置成功，是否现在去设置支付密码',
                                    btnTexts: ['稍后', '好的'],
                                    callbacks: [() => appHistory.goBack(), () => {
                                        appHistory.replace('/passwordPayment');
                                    }]
                                });
                            } else {
                                showInfo(Feedback.Change_Password_Success);
                                appHistory.go(-2);
                            }
                        }
                    });
            }
        });
    };

    //验证手机号码
    checkPhone = (rule, value, callback) => {
        if (!validator.isEmpty(value, Form.No_Phone, callback)) return;
        if (!validator.checkPhone(validator.wipeOut(value))) {
            validator.showMessage(Form.Error_Phone, callback);
            return;
        }
        callback();
    };

    //检验验证码
    checkPhoneCode = (rule, value, callback) => {
        if (!validator.isEmpty(value, Form.No_Captcha, callback)) return;
        if (value.length < 4) {
            validator.showMessage(Form.Error_Captcha, callback);
            return;
        }
        callback();
    };

    //检验密码
    checkfirstPass = (rule, value, callback) => {
        if (!validator.isEmpty(value, Form.Error_Password_Required, callback)) return;
        if (value.length < 6 || value.length > 18) {
            validator.showMessage(Form.Error_Password_Length, callback);
            return;
        }
        callback();
    };

    //确认密码检验
    checkNextPass = (rule, value, callback) => {
        const {form: {getFieldValue}} = this.props;
        if (!validator.isEmpty(value, Form.No_nextPass, callback)) return;
        if (value !== getFieldValue('firstPass')) {
            validator.showMessage(Form.Error_Password_Same, callback);
            return;
        }
        callback();
    };

    //输入电话号码
    phoneChange = (data) => {
        this.setState({
            phoneNum: data,
            getOff: !!validator.checkPhone(validator.wipeOut(data)) //验证手机号是否正确
        });
    };

    //校验密码
    checkPwd = () => {
        const {password} = this.state;
        if (password.length > 0) {
            if (!validator.checkPassWord(password)) {
                showInfo(Form.Error_Password_Length);
            }
            this.setState({
                reEdit: !!validator.checkPassWord(password)
            });
        } else {
            showInfo(Form.No_Password);
        }
    };

    //选择某一个账号
    checkOne = (index) => {
        const {accountList} = this.state;
        let uid = '';
        accountList.forEach((item, num) => {
            if (index === num) {
                uid = item.no;
            }
            item.check = index === num;
        });
        this.setState({
            accountList,
            uid
        });
    };

    //点击确定
    mastSure = () => {
        const {uid} = this.state;
        if (!uid) {
            showInfo(Form.No_Account);
        } else {
            this.setState({
                moreAccount: false
            });
            this.nextPage();
        }
    };

    goBackModal = () => {
        if (process.env.NATIVE && appHistory.length() === 0) {
            native('goBack');
        } else {
            appHistory.goBack();
        }
    }

    //控制眼睛
    changeEyes = (onOff) => {
        if (onOff === '1') {
            this.setState((prevState) => ({
                passAType: !prevState.passAType
            }));
        } else {
            this.setState((prevState) => ({
                passType: !prevState.passType
            }));
        }
    }

    render() {
        const {reEdit, passShow, phoneShow, getOff, moreAccount, accountList, passType, passAType} = this.state;
        const {getFieldDecorator} = this.props.form;//getFieldDecorator用于和表单进行双向绑定

        return (
            <div data-component="passwordDetail" data-role="page" className="password-detail">
                {
                    phoneShow && (
                        <div>
                            {
                                !window.isWX && (
                                    <AppNavBar backgroundColor={gradation} redBackground title="身份验证"/>
                                )
                            }
                            <div className={classnames('input-box', {'wx-input-box': window.isWX})}>
                                {
                                    getFieldDecorator('phone', {
                                        initialValue: '',
                                        rules: [
                                            //validator自定义校验规则 (rule, value, cb) => (value === true ? cb() : cb(true))
                                            {validator: this.checkPhone}
                                        ],
                                        validateTrigger: 'onSubmit'//校验值的时机
                                    })(
                                        <InputItem
                                            type="phone"
                                            clear
                                            placeholder="请输手机号码"
                                            onChange={this.phoneChange}
                                        >输入手机号
                                        </InputItem>
                                    )}
                                <div className="get-number">
                                    {
                                        getFieldDecorator('authCode', {
                                            initialValue: '',
                                            rules: [
                                                {validator: this.checkPhoneCode}
                                            ],
                                            validateTrigger: 'onSubmit'
                                        })(
                                            <InputItem
                                                type="number"
                                                placeholder=""
                                                clear
                                                className="sure-pass"
                                                ref={ref => { this.yzm = ref }}
                                                maxLength={4}
                                            >验证码
                                            </InputItem>
                                        )
                                    }
                                    <VerificationCode
                                        styleProps={getPass} //需要的样式
                                        getCode={this.getPhoneCode} //点击获取事件
                                        getOff={getOff} //判断获取验证码前，所需要的内容是否符合要求，如手机号是否正确
                                    />
                                </div>
                                <Button className="next-button" onClick={this.getNext}>下一步</Button>
                            </div>
                        </div>
                    )
                }
                {
                    passShow && (
                        <div>
                            <AppNavBar backgroundColor={gradation} redBackground title="设置登录密码" goBackModal={() => { this.setState({passShow: false, phoneShow: true}) }}/>
                            <div className="cipher-box">
                                <div>
                                    <div className="icon-box" onClick={this.changeEyes}>
                                        <div className={`icon ${passType ? 'icon-close' : 'icon-open'} `}/>
                                    </div>
                                    {
                                        getFieldDecorator('firstPass', {
                                            initialValue: '',
                                            rules: [
                                                {validator: this.checkfirstPass}
                                            ],
                                            validateTrigger: 'onSubmit'//校验值的时机
                                        })(
                                            <GeisInputItem
                                                type="nonSpace"
                                                itemTitle="输入密码"
                                                clear
                                                showPass={passType}
                                                placeholder="******"
                                                maxLength={18}
                                            />
                                        )
                                    }
                                </div>
                                <div>
                                    <div className="icon-box" onClick={() => this.changeEyes('1')}>
                                        <div className={`icon ${passAType ? 'icon-close' : 'icon-open'} `}/>
                                    </div>
                                    {
                                        getFieldDecorator('nextPass', {
                                            initialValue: '',
                                            rules: [
                                                {validator: this.checkANextPass}
                                            ],
                                            validateTrigger: 'onSubmit'//校验值的时机
                                        })(
                                            <GeisInputItem
                                                type="nonSpace"
                                                showPass={passAType}
                                                clear
                                                placeholder="******"
                                                editable={reEdit}
                                                itemTitle="确认密码"
                                            />
                                        )
                                    }
                                </div>

                                <Button className="next-button" onClick={this.nextPage}>确定</Button>
                            </div>
                        </div>
                    )
                }
                {
                    moreAccount && (
                        <div className="retrieve-account">
                            <div className="retri-main">
                                {/* <p>请选择您要找回的账号</p> */}
                                <ul>
                                    {
                                        accountList && accountList.map((item, idnex) => (
                                            <li className={item.check ? 'check' : ''} onClick={() => this.checkOne(idnex)}>
                                                <img src={item.avatarUrl}/>
                                                <span className="check-second">
                                                    {/* <img className="check-bd" src={item.logo} alt=""/> */}
                                                    <span>uid：{item.no}</span>
                                                </span>
                                                <span className="icon check-last"/>
                                            </li>
                                        ))
                                    }
                                </ul>
                                <div className="retri-btn-box">
                                    <div className="retri-btn">
                                        <span onClick={() => this.setState({
                                            moreAccount: false
                                        })}
                                        >取消
                                        </span>
                                        <span
                                            onClick={this.mastSure}
                                        >确定
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )
                }
            </div>
        );
    }
}

const mapDispatchToProps = {
    showConfirm: actionCreator.showConfirm
};
export default connect(
    null,
    mapDispatchToProps
)(createForm()(passwordDetail));
