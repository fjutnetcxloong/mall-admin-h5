/*
* 银行卡详情页面
* */
import {connect} from 'react-redux';
import {List, InputItem, Picker} from 'antd-mobile';
import {createForm} from 'rc-form';
import VerificationCode from '../../../../../common/verification-code';
import {baseActionCreator as actionCreator} from '../../../../../../redux/baseAction';
import {myActionCreator} from '../../../actions/index';
import AppNavBar from '../../../../../common/navbar/NavBar';
import './BankCardDetail.less';

const {appHistory, getUrlParam, validator, showInfo, showSuccess} = Utils;
const {MESSAGE: {Form, Feedback}} = Constants;
const {urlCfg} = Configs;
const getPass = {
    width: '120px',
    color: '#de1212',
    fontSize: '0.3rem',
    border: 'none',
    marginTop: '18px',
    background: '@white'
};
class BankCardDetail extends BaseComponent {
    state = {
        height: document.documentElement.clientHeight - (window.isWX ? window.rem * null : window.rem * 1.08), //是微信扣除头部高度
        countdown: Constants.COUNTERNUM,
        bankArr: [], //銀行卡内容
        userInfo: {}, //用戶信息
        getOff: false, //点击获取验证码是否可以获取，默认不可以，除非输入的电话号码符合要求
        userTypes: this.props.userTypes
    };

    //获取银行卡信息
    editBank = () => {
        const realname = decodeURI(getUrlParam('realname', encodeURI(this.props.location.search)));
        const idcard = decodeURI(getUrlParam('idcard', encodeURI(this.props.location.search)));
        const bankId = decodeURI(getUrlParam('bankId', encodeURI(this.props.location.search)));
        const bankNo = decodeURI(getUrlParam('bankNo', encodeURI(this.props.location.search)));
        const phone = decodeURI(getUrlParam('phone', encodeURI(this.props.location.search)));
        let obj = {};
        if (realname !== 'null') {
            obj = {realname, idcard, bankId, bankNo, phone};
        }
        this.setState({
            userInfo: obj
        });
    }

    componentDidMount() {
        const {userTypes} = this.state;
        const {showAlert} = this.props;
        if (userTypes === '2') { //商家身份进入时提示
            showAlert({
                title: Form.No_Difference,
                btnText: '好'
            });
        }
        this.getBank();
    }

    //获取银行卡
    getBank = () => {
        this.fetch(urlCfg.getBank, {}, true).subscribe(res => {
            if (res && res.status === 0) {
                if (res.data.length) {
                    res.data.forEach(item => {
                        item.label = item.name;
                        item.value = item.id;
                    });
                }
                this.setState({
                    bankArr: res.data
                });
            }
        });
    }

    //保存
     successToast = () => {
         const {form: {validateFields, getFieldValue}, getBankCardList, location} = this.props;
         const {bankArr} = this.state;
         validateFields({first: true, force: true}, (error, value) => {
             if (!error) {
                 const userName = getFieldValue('name');
                 const userIdCard = getFieldValue('idCard');
                 const bank = getFieldValue('bank');
                 const bankNo = getFieldValue('bankNo');
                 const phone = getFieldValue('phone');
                 const authCode = getFieldValue('authCode');
                 this.fetch(urlCfg.addBankCard, {
                     data: {
                         id: location.query ? location.query.id : 0,
                         bank_id: bank[0],
                         real_name: userName,
                         idcard: userIdCard,
                         bank_name: bankArr.find(item => item.id === bank[0]).name,
                         bank_number: validator.wipeOut(bankNo),
                         phone: validator.wipeOut(phone),
                         accType: 0,
                         userType: 0,
                         re_commit: 0,
                         vcode: authCode
                     }}).subscribe(res => {
                     if (res && res.status === 0) {
                         showSuccess(Feedback.Bind_Success);
                         getBankCardList();
                         appHistory.goBack();
                     }
                 });
             }
         });
     };

    //校验姓名
    checkName=(rule, value, callback) => {
        if (!validator.checkRange(2, 8, value)) {
            validator.showMessage(Form.No_Name, callback);
            return;
        }
        callback();
    };

    //效验身份证
    checkIdcard = (rule, value, callback) => {
        if (!validator.ID(value)) {
            validator.showMessage(Form.Error_ID, callback);
            return;
        }
        callback();
    };

    //验证开户银行
    checkBank = (rule, value, callback) => {
        if (!validator.isEmpty(value, Form.No_Bank, callback)) return;
        callback();
    };

    //检验银行卡号
    checkBankNo = (rule, value, callback) => {
        if (!validator.isEmpty(value, Form.No_BankNumber, callback)) return;
        if (!validator.bankCard(validator.wipeOut(value))) {
            validator.showMessage(Form.Error_Bank, callback);
            return;
        }
        callback();
    };

    //验证手机号
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

    //获取验证码
     getPhoneCode = () => {
         const phone = this.props.form.getFieldsValue().phone;
         if (!phone) {
             showInfo(Form.No_Phone);
             return;
         }
         if (!validator.checkPhone(validator.wipeOut(phone))) {
             showInfo(Form.Error_Phone);
             return;
         }
         this.fetch(urlCfg.getTheAuthenticationCode, {data: {phone: validator.wipeOut(phone)}})
             .subscribe(res => {
                 if (res && res.status === 0) {
                     showSuccess(Feedback.Send_Success);
                 }
             });
     }

     //输入电话号码
     phoneChange = (data) => {
         this.setState({
             phoneNum: data
         });
         if (validator.checkPhone(validator.wipeOut(data))) {
             this.setState({//手机号码符合要求，就可以点击获取验证码
                 getOff: true
             });
         } else {
             this.setState({//不符合则点击无效
                 getOff: false
             });
         }
     };


     //选择银行
     onOkPicker = (data) => {
         const {userInfo} = this.state;
         userInfo.bankId = data[0];
         this.setState({
             userInfo
         });
     };

     render() {
         const {userInfo, getOff, bankArr} = this.state;
         const {getFieldDecorator} = this.props.form;
         return (
             <div data-component="bankCardDetail" data-role="page" className="bank-card-detail">
                 <AppNavBar title="我的银行卡"/>
                 <div className="bank-box">
                     <div className={`mainInfo ${userInfo.bankId === undefined ? 'no-font-color' : 'font-color'}`}>
                         {
                             getFieldDecorator('name', {
                                 rules: [
                                     {validator: this.checkName}
                                 ],
                                 validateTrigger: 'onSubmit'//校验值的时机
                             })(
                                 <InputItem
                                     clear
                                     placeholder="请输入户主名称"
                                     editable={!userInfo.realname}
                                     maxLength={8}
                                 >户主姓名
                                 </InputItem>
                             )
                         }
                         {
                             getFieldDecorator('idCard', {
                                 rules: [
                                     {validator: this.checkIdcard}
                                 ],
                                 validateTrigger: 'onSubmit'//校验值的时机
                             })(
                                 <InputItem
                                     clear
                                     maxLength={18}
                                     editable={!userInfo.idcard}
                                     type="text"
                                     placeholder="请输入户主身份证号"
                                 >身份证号
                                 </InputItem>
                             )
                         }
                         {
                             getFieldDecorator('bank', {
                                 rules: [
                                     {validator: this.checkBank}
                                 ],
                                 validateTrigger: 'onSubmit'//校验值的时机
                             })(
                                 <Picker
                                     extra="请选择"
                                     data={bankArr}
                                     onOk={(data) => this.onOkPicker(data)}
                                     cols={1}
                                 >
                                     <List.Item arrow="horizontal" >开户银行</List.Item>
                                 </Picker>
                             )
                         }
                         {
                             getFieldDecorator('bankNo', {
                                 rules: [
                                     {validator: this.checkBankNo}
                                 ],
                                 validateTrigger: 'onSubmit'//校验值的时机
                             })(
                                 <InputItem
                                     clear
                                     type="bankCard"
                                     placeholder="请输入银行卡号"
                                     maxLength={27}
                                 >银行卡号
                                 </InputItem>
                             )
                         }
                         {
                             getFieldDecorator('phone', {
                                 rules: [
                                     {validator: this.checkPhone}
                                 ],
                                 validateTrigger: 'onSubmit'//校验值的时机
                             })(
                                 <InputItem
                                     clear
                                     type="phone"
                                     placeholder="请输入手机号码"
                                     onChange={this.phoneChange}
                                 >银行预留手机号
                                 </InputItem>
                             )
                         }
                         <div className="getNumber">
                             {
                                 getFieldDecorator('authCode', {
                                     rules: [
                                         {validator: this.checkPhoneCode}
                                     ],
                                     validateTrigger: 'onSubmit'//校验值的时机
                                 })(
                                     <InputItem
                                         type="number"
                                         placeholder=""
                                         className="surePass"
                                         ref={ref => { this.phoneCode = ref }}
                                         maxLength={4}
                                     >验证码
                                     </InputItem>
                                 )
                             }
                             <VerificationCode
                                 styleProps={getPass} //需要的样式
                                 getCode={this.getPhoneCode} //点击获取事件
                                 getOff={getOff}
                             />
                         </div>
                     </div>
                     <div className="Sure">
                         <div onClick={this.successToast}>确认绑定</div>
                     </div>
                 </div>
             </div>
         );
     }
}

const mapStateToProps = state => {
    const base = state.get('base');
    return {
        userTypes: base.get('userTypes')
    };
};

const mapDispatchToProps = {
    showConfirm: actionCreator.showConfirm,
    showAlert: actionCreator.showAlert,
    getBankCardList: myActionCreator.getBankCardList
};

const BasicInputWrapper = createForm()(BankCardDetail);

export default connect(mapStateToProps, mapDispatchToProps)(BasicInputWrapper);
