/**账号切换 */
import {List, InputItem, Button} from 'antd-mobile';
import {createForm} from 'rc-form';
import AppNavBar from '../../../../../common/navbar/NavBar';
import VerificationCode from '../../../../../common/verification-code';
import './Account.less';

const {showInfo, validator, appHistory, showSuccess} = Utils;
const {urlCfg} = Configs;
const {MESSAGE: {Form, Feedback}, VERIFY_FAILED} = Constants;

const getPass = { //获取验证码按钮的样式
    border: 'none',
    background: '@white',
    color: 'red',
    float: 'right',
    lineHeight: '44px'
};

class AddAounted extends BaseComponent {
    state={
        getOff: false //点击获取验证码是否可以获取，默认不可以，除非输入的电话号码符合要求
    }

     //获取验证码
     getPhoneCode = () => {
         const phone = this.props.form.getFieldsValue().phone;
         if (!phone) {
             showInfo(Form.No_Phone);
             return;
         }
         if (!validator.checkPhone(phone.replace(/\s*/g, ''))) {
             showInfo(Form.Error_Phone);
             return;
         }
         this.fetch(urlCfg.getTheAuthenticationCode, {method: 'post', data: {phone: phone.replace(/\s*/g, '')}})
             .subscribe(res => {
                 if (res && res.status === 0) {
                     showSuccess(Feedback.Send_Success);
                 }
             });
     }

     //uid验证
     uidFn = (rules, value, callback) => {
         if (!value) {
             callback(VERIFY_FAILED);
             showInfo(Form.No_UID);
             return;
         }

         if (!validator.UID(value)) {
             callback(VERIFY_FAILED);
             showInfo(Form.No_Uid);
             return;
         }
         callback();
     }

    //密码验证
    passFn = (rules, value, callback) => {
        if (!value) {
            callback(VERIFY_FAILED);
            showInfo(Form.Error_Password_Required);
            return;
        }
        if (value.length < 6 || value.length > 18) {
            callback(VERIFY_FAILED);
            showInfo(Form.Error_Password_Length);
            return;
        }
        callback();
    }

    //手机号验证
    phoneFn = (rules, value, callback) => {
        if (!value) {
            callback(VERIFY_FAILED);
            showInfo(Form.No_Phone);
            return;
        }
        if (!validator.checkPhone(value.replace(/\s*/g, ''))) {
            callback(VERIFY_FAILED);
            showInfo(Form.Error_Phone);
            return;
        }
        callback();
    }

    //输入电话号码
    phoneChange = (value) => {
        this.setState({
            phoneNum: value
        });
        if (validator.checkPhone(value.replace(/\s*/g, ''))) {
            this.setState({//手机号码符合要求，就可以点击获取验证码
                getOff: true
            });
        } else {
            this.setState({//不符合则点击无效
                getOff: false
            });
        }
    }

    //检验验证码
    checkPhoneCode = (rule, value, callback) => {
        if (value.length === 0) {
            callback(VERIFY_FAILED);
            showInfo(Form.No_Captcha);
            return;
        }
        if (value.length < 4) {
            callback(VERIFY_FAILED);
            showInfo(Form.Error_Captcha);
            return;
        }
        callback();
    };

    //提交添加
    submit = () => {
        const {form: {validateFields, getFieldValue}} = this.props;
        //请求
        validateFields({first: true}, (error, value) => {
            if (!error) {
                const uid = getFieldValue('uid');
                const password = getFieldValue('password');
                const phone = getFieldValue('phone');
                const phoneCode = getFieldValue('authCode');
                this.fetch(urlCfg.addAccountInfo, {
                    data: {
                        no: uid,
                        pwd: password,
                        phone: phone.replace(/\s*/g, ''),
                        vcode: phoneCode
                    }
                })
                    .subscribe(res => {
                        if (res && res.status === 0) {
                            showInfo(Form.Account_Add_Success);
                            appHistory.replace('/account');
                        }
                    });
            } else {
                console.log('错误');
                console.log(error, value);
            }
        });
    }

    render() {
        const {getFieldDecorator} = this.props.form;
        const {getOff} = this.state;
        return (
            <div data-component="aount" data-role="aount" className="account-main">
                <AppNavBar goBackModal={this.props.goBackModal} title="添加账户"/>
                <div className="addacount">
                    <List>
                        {
                            getFieldDecorator('uid', {
                                initialValue: '',
                                rules: [
                                    //validator自定义校验规则 (rule, value, cb) => (value === true ? cb() : cb(true))
                                    {validator: this.uidFn}
                                ],
                                validateTrigger: 'onSubmit'//校验值的时机
                            })(
                                <InputItem
                                    type="number"
                                    clear
                                    placeholder="请输入UID"
                                >UID
                                </InputItem>
                            )
                        }
                        {
                            getFieldDecorator('password', {
                                initialValue: '',
                                rules: [
                                    //validator自定义校验规则 (rule, value, cb) => (value === true ? cb() : cb(true))
                                    {validator: this.passFn}
                                ],
                                validateTrigger: 'onSubmit'//校验值的时机
                            })(
                                <InputItem
                                    type="password"
                                    clear
                                    //  ref={ref => { this.phoneCode = ref }}
                                    placeholder="请输入登陆密码"
                                >登陆密码
                                </InputItem>
                            )
                        }
                        {
                            getFieldDecorator('phone', {
                                initialValue: '',
                                rules: [
                                    //validator自定义校验规则 (rule, value, cb) => (value === true ? cb() : cb(true))
                                    {validator: this.phoneFn}
                                ],
                                validateTrigger: 'onSubmit'//校验值的时机
                            })(
                                <InputItem
                                    type="phone"
                                    clear
                                    placeholder="请输入手机号"
                                >手机号
                                </InputItem>
                            )
                        }
                        <div className="getNumber">
                            {
                                getFieldDecorator('authCode', {
                                    initialValue: '',
                                    rules: [
                                        //validator自定义校验规则 (rule, value, cb) => (value === true ? cb() : cb(true))
                                        {validator: this.checkPhoneCode}
                                    ],
                                    validateTrigger: 'onSubmit'//校验值的时机
                                })(
                                    <InputItem
                                        type="number"
                                        //  ref={ref => { this.phoneCode = ref }}
                                        maxLength={4}
                                    >验证码
                                    </InputItem>

                                )
                            }<VerificationCode
                                styleProps={getPass} //需要的样式
                                getCode={this.getPhoneCode} //点击获取事件
                                getOff={getOff}
                            />
                        </div>
                    </List>
                    <Button
                        className="save"
                        onClick={this.submit}
                    >
                        保存
                    </Button>
                </div>
            </div>
        );
    }
}

export default createForm()(AddAounted);
