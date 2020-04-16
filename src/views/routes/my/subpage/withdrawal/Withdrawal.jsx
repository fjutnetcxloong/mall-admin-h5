/**
 * CAM提现--微信
 */
import {Tabs, Picker, List, Flex, Checkbox, Button} from 'antd-mobile';
import {Link} from 'react-router-dom';
import {connect} from 'react-redux';
import NativeInput from '../../../../common/native-input';
import './Withdrawal.less';
import {baseActionCreator as actionCreator} from '../../../../../redux/baseAction';
import {InputGrid} from '../../../../common/input-grid/InputGrid';
import AppNavBar from '../../../../common/navbar/NavBar';

const {urlCfg} = Configs;
const {showInfo, validator, appHistory} = Utils;
const {MESSAGE: {Form, Feedback}} = Constants;

const tabs = [
    {title: '微信零钱'},
    {title: '银行卡'}
];
const bankImg = {
    1: [0, 0],
    2: [-75, 0],
    3: [-150, 0],
    4: [-225, 0],
    5: [-300, 0],
    6: [-375, 0],
    7: [-450, 0],
    14: [-525, 0],
    9: [-600, 0],
    13: [-625, 0],
    8: [-700, 0],
    10: [-825, 0],
    11: [-900, 0],
    15: [0, -75], //第二排
    16: [-75, -75],
    17: [-150, -75],
    12: [-225, -75]
}; //银行图标雪碧图位置

class Withdrawal extends BaseComponent {
    state = {
        height: document.documentElement.clientHeight - (window.isWX ? window.rem * null : window.rem * 0.88),
        district: [], //获取提现类型列表
        incomeData: null, //获取income 信息
        bankIndex: 0, //获取银行卡名字 （id）
        selectorIndexName: [], //提现类别名字
        selectorIndex: '', //提现类别Id
        withdrawId: 0, //微信、银行卡转换获取Id
        checkedWit: false, //是否同意提现
        money: null, //提现金额
        bankId: 0, //银行卡Id
        pwsPopup: false //是否弹出支付框
    };

    componentDidMount() {
        this.income();
        this.payPassWord();
    }

    //获取初始值信息
    income = () => {
        this.fetch(urlCfg.income)
            .subscribe(res => {
                if (res && res.status === 0) {
                    const ary = res.data.items;
                    const aryTemp = ary.map((item) => {
                        const temp = {};
                        temp.label = item.name;
                        temp.value = `${item.value}`;
                        temp.desc = '最低提现金额' + item.min + '元';
                        temp.min = item.min;
                        temp.max = item.max;
                        return temp;
                    });
                    this.setState({
                        incomeData: res.data,
                        district: aryTemp,
                        isWx: res.data.is_wx
                    });
                }
            });
    }

    payPassWord = () => {
        this.fetch(urlCfg.memberStatus)
            .subscribe(res => {
                if (res && res.status === 0) {
                    if (res.data.status !== 0) { //status为0为已设置，其他都是未设置
                        this.setState({
                            statusPay: 1
                        });
                    }
                }
            });
    }

    // 是否有绑定银行卡
    bindingBank = () => {
        const {withdrawId, incomeData, selectorIndex} = this.state;
        const {showConfirm} = this.props;
        if (withdrawId === 1) {
            this.fetch(urlCfg.memberStatus, {data: {types: 7}})
                .subscribe(res => {
                    if (res && res.status === 0) {
                        if (res.data) {
                            if (res.data.status === 7) {
                                showConfirm({
                                    title: '您还没绑定银行卡，是否去绑定？',
                                    callbacks: [() => {
                                        this.setState({
                                            selectorIndexName: [], //提现类别名字
                                            selectorIndex: '' //提现类别Id
                                        });
                                    }, () => {
                                        appHistory.push('/bankCardDetail');
                                    }]
                                });
                            } else {
                                for (let i = 0; i < incomeData.banks.length; i++) {
                                    if (selectorIndex === '0') {
                                        if (incomeData.banks[i].userType !== '2') {
                                            this.setState({
                                                bankId: incomeData.banks[i].id,
                                                bankIndex: i
                                            });
                                        }
                                    } else if (selectorIndex === '1') {
                                        if (incomeData.banks[i].userType === '2') {
                                            this.setState({
                                                bankId: incomeData.banks[i].id,
                                                bankIndex: i
                                            });
                                        }
                                    }
                                }
                            }
                        }
                    }
                });
        }
    }

    //微信、银行卡转换获取名字 切换Tabs
    TabClick = (res, value) => {
        this.setState({
            withdrawId: value,
            selectorIndex: '',
            selectorIndexName: [],
            checkedWit: false,
            money: null
        });
        //清除金额输入框中的值
        if (value) {
            this.nativeinput.clearDeafult();
        } else {
            this.nativeinputTwo.clearDeafult();
        }
    }

    //获取提现类别
    getCategory = (res) => {
        const {showAlert} = this.props;
        this.setState({
            selectorIndex: res[0],
            selectorIndexName: res
        }, () => {
            if (this.state.withdrawId === 1) {
                this.bindingBank();
            } else if (!this.state.isWx) {
                showAlert({
                    title: '您还没有绑定微信，请先绑定微信',
                    btnText: '好'
                });
            }
        });
    }

    //获取提现金额
    getInput = (res) => {
        this.setState({
            money: res
        });
    }

    //是否同意提现
    agreeItem = (res) => {
        const {showAlert} = this.props;
        this.setState({
            checkedWit: res.target.checked
        }, () => {
            if (this.state.checkedWit) {
                showAlert({
                    title: (Feedback.WeChat_Popup),
                    btnText: '好'
                });
            }
        });
    }

    //提交、微信、银行卡
    submit = () => {
        const {selectorIndex, checkedWit, money, statusPay} = this.state;
        const {showConfirm} = this.props;
        if (money === '0' || money === '0.0' || money === '0.00' || money.slice(0, 1) === '.') {
            showInfo(Form.No_Money);
            return;
        }
        if (selectorIndex === '') {
            showInfo(Form.No_GenRe);
        } else if (!validator.removeCN(money)) {
            showInfo(Form.No_Money);
        } else if (!validator.floatType(money, 3)) {
            showInfo(Form.No_Money);
        } else if (!checkedWit) {
            showInfo(Form.No_Withdraw);
        } else if (statusPay === 1) {
            showConfirm({
                title: '您还未设置支付密码，前往设置？',
                callbacks: [null, () => {
                    appHistory.push('/passwordPayment');
                }]
            });
        } else {
            this.setState({
                pwsPopup: true
            });
        }
    }

    //关闭支付弹窗
    closePopup = () => {
        this.setState({
            pwsPopup: false
        });
    }

    //密码支付
    inputGrid = (psw) => {
        const {selectorIndex, money, withdrawId, bankId} = this.state;
        if (!validator.floatType(psw, 6)) {
            showInfo(Form.Error_PayPassword);
        } else {
            this.fetch(urlCfg.withdraw, {data: {money, types: selectorIndex, typeIndex: withdrawId, psw, bankId}})
                .subscribe(res => {
                });
        }
    }

    //忘记密码跳转
    forgetPws = () => {
        appHistory.push('/password');
    }

    render() {
        const {selectorIndexName, money, pwsPopup, withdrawId, district, bankId, incomeData, bankIndex, height} = this.state;
        return (
            <div className={`Withdrawal extract ${withdrawId === 0 ? 'withdrawColor' : ''}`}>
                <div className="cash-content">
                    <div className="cash-content-navbar">
                        <AppNavBar nativeGoBack title="CAM提现"/>
                    </div>
                    <div style={{height: height}} className="cash-content-tabs">
                        <Tabs
                            tabs={tabs}
                            initialPage={0}
                            swipeable={false}
                            onTabClick={(res, index) => this.TabClick(res, index)}
                        >
                            {/*微信提现*/}
                            <div>
                                <div className="weChat-picker">
                                    <Picker
                                        data={district}
                                        cols={1}
                                        className="forss"
                                        value={selectorIndexName}
                                        onChange={(res) => this.getCategory(res)}
                                    >
                                        <List.Item style={{border: '1px solid #e5e5e5'}} arrow="horizontal">提现类别</List.Item>
                                    </Picker>
                                </div>
                                <div>
                                    <div className="weChat-inputItem">
                                        <NativeInput
                                            nativeType="text"
                                            nativeValue={money}
                                            nativePla="请输入提现金额"
                                            ref={(res) => { this.nativeinput = res }}
                                            nativeChange={this.getInput}
                                        />
                                    </div>

                                    <div className="weChat-flex">
                                        <Flex>
                                            <Flex.Item>
                                                <Checkbox.AgreeItem onChange={(res) => this.agreeItem(res)}>
                                                    <span>请认真阅读</span>《提现提示》
                                                </Checkbox.AgreeItem>
                                            </Flex.Item>
                                        </Flex>
                                    </div>

                                    <div className="weChat-button">
                                        <Button type="primary" className="large-button important" onClick={this.submit}>确定</Button>
                                    </div>
                                </div>
                            </div>
                            {/*银行卡提现*/}
                            <div>
                                {(bankId !== 0) && (
                                    <div className="bank-card">
                                        <div className="logo" style={{backgroundPosition: bankImg[incomeData.banks[bankIndex].bankId] ? `${bankImg[incomeData.banks[bankIndex].bankId][0] / 50}rem ${bankImg[incomeData.banks[bankIndex].bankId][1] / 50}rem` : '0px 0px'}}/>
                                        {/*<div src={require('../../../../../assets/images/' + incomeData.banks[bankIndex].bankId + '.png')}/>*/}
                                        <div className="bank-title">{incomeData.banks[bankIndex].show_info}</div>
                                    </div>
                                )}
                                <div className="bank-wraps">
                                    <div className="weChat-picker">
                                        <Picker
                                            data={district}
                                            cols={1}
                                            className="forss"
                                            value={selectorIndexName}
                                            onChange={(res) => this.getCategory(res)}
                                        >
                                            <List.Item style={{border: '1px solid #e5e5e5'}} arrow="horizontal">提现类别</List.Item>
                                        </Picker>
                                    </div>
                                    <div>
                                        <div className="weChat-inputItem">
                                            <NativeInput
                                                nativeType="text"
                                                nativeValue={money}
                                                nativePla="请输入提现金额"
                                                nativeChange={this.getInput}
                                                ref={(res) => { this.nativeinputTwo = res }}
                                            />
                                        </div>

                                        <div className="weChat-flex">
                                            <Flex>
                                                <Flex.Item>
                                                    <Checkbox.AgreeItem onChange={(res) => this.agreeItem(res)}>
                                                        <span className="">请认真阅读</span>《提现提示》
                                                    </Checkbox.AgreeItem>
                                                </Flex.Item>
                                            </Flex>
                                        </div>

                                        <div className="weChat-button">
                                            <Button type="primary" className="large-button important" onClick={() => this.submit()}>确定</Button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Tabs>
                        <div className="weChat-record">
                            <p className="weChat-record-p">
                                <Link to="/record" className="weChat-record-p">提现记录</Link>
                            </p>
                        </div>
                    </div>
                </div>
                {/*顶部颜色*/}
                <div className={`cash-bg ${window.isWX ? 'cash-bg-WX' : ''}`}/>
                {/*弹窗支付密码*/}
                {pwsPopup && (
                    <div className="popups">
                        <div className="popup-wrap">
                            <div className="popup-top">
                                <div onClick={this.closePopup}>
                                    <span className="icon command-left" onClick={this.closePopup}/>
                                </div>
                                <div className="popup-title">请输入支付密码</div>
                                <div onClick={this.closePopup}>
                                    <span className="icon command-right" onClick={this.closePopup}/>
                                </div>
                            </div>
                            <div className="popup-bottom">
                                <div className="poupu-pws">
                                    <InputGrid onInputGrid={this.inputGrid}/>
                                </div>
                                <div className="popup-forget" onClick={this.forgetPws}>忘记密码</div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        );
    }
}

const mapDidpatchToProps = {
    showConfirm: actionCreator.showConfirm,
    showAlert: actionCreator.showAlert
};
export default connect(null, mapDidpatchToProps)(Withdrawal);
