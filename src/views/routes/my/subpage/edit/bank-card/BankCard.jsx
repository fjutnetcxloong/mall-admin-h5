
import {connect} from 'react-redux';
import AppNavBar from '../../../../../common/navbar/NavBar';
import {baseActionCreator as actionCreator} from '../../../../../../redux/baseAction';
import {InputGrid} from '../../../../../common/input-grid/InputGrid';
import {myActionCreator} from '../../../actions/index';
import './BankCard.less';

const {appHistory, showSuccess} = Utils;
const {urlCfg} = Configs;
const {MESSAGE: {Feedback}} = Constants;
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

class BankCard extends BaseComponent {
    state = {
        userBankArr: [], //用户信息
        shopBankArr: [] //消費者銀行卡
    };

    componentDidMount() {
        const {bankInfo, getBankCardList} = this.props;
        if (!bankInfo) {
            getBankCardList();
        }
    }

    //添加或者编辑银行卡
    editBankCode = (data) => {
        if (data.realname) {
            appHistory.push(`/bankCardDetail?realname=${data.realname}&idcard=${data.idcard}&bankId=${data.bankId}&bankNo=${data.bankNo}&phone=${data.phone}`);
        } else {
            appHistory.push('/bankCardDetail');
        }
    }

    //银行卡背景 蓝底
    backgroundImng = (num) => {
        num = Number(num);
        if (num === 19 || num === 21 || num === 23 || num === 24 || num === 25 || num === 26 || num === 27 || num === 28) {
            return true;
        }
        return false;
    }

    //点击解除绑定，弹出弹框
    untyingCode = (id) => {
        const {showConfirm} = this.props;
        showConfirm({
            title: Feedback.Relieve_Binding,
            btnTexts: ['取消', '解除绑定'],
            callbacks: [null, () => {
                this.setState({
                    pwsPopup: true
                });
            }]
        });
        this.setState({
            untId: id
        });
    }

    //关闭密码输入弹窗
    closePopupUp = () => {
        this.setState({
            pwsPopup: false
        });
    }

    //忘记密码跳转
    forgetPws = () => {
        appHistory.push('/password');
    }

    //密码输入 支付完成 （CAM消费）
    inputGrid = (pwd) => {
        const {untId} = this.state;
        const {getBankCardList} = this.props;
        this.fetch(urlCfg.verifyPaymentPassword, {data: {pay_pwd: pwd}})
            .subscribe(res => {
                if (res && res.status === 0) {
                    this.setState({
                        pwsPopup: false //关闭密码输入框
                    });
                    //解绑银行卡
                    this.fetch(urlCfg.delBankInfo, {data: {id: untId}})
                        .subscribe(data => {
                            if (data && data.status === 0) {
                                showSuccess(Feedback.Unbind_Success);
                                getBankCardList();
                            }
                        });
                }
            });
    }

    render() {
        const {pwsPopup} = this.state;
        const {bankInfo} = this.props;
        return (
            <div data-component="bankCard" data-role="page" className="bank-card">
                <AppNavBar title="我的银行卡"/>
                <div className={`increase-box ${window.isWX ? 'WX' : ''}`}>
                    {
                        (bankInfo && bankInfo.user.length > 0) ? bankInfo.user.map(item => (
                            <div className="card-box" key={item.id}>
                                <p className="explain">CAM余额提现卡</p>
                                <div className={this.backgroundImng(item.bankId) ? 'background-blue' : 'background-red'}>
                                    <div className="background-t">
                                        <div className="logo" style={{backgroundPosition: bankImg[item.bankId] ? `${bankImg[item.bankId][0] / 50}rem ${bankImg[item.bankId][1] / 50}rem` : '1000px 1000px'}}/>
                                        <div className="background-tl">{item.bankArea}</div>
                                    </div>
                                    <div className="card">
                                        <span>{item.bankNo.slice(0, 4)}</span>
                                        <span>****</span>
                                        <span>****</span>
                                        <span>****</span>
                                        <span>{item.bankNo.slice(-3)}</span>
                                    </div>
                                </div>
                                <span className="untying" onClick={() => this.untyingCode(item.id)}>解绑</span>
                            </div>
                        )) : (
                            <div>
                                <p className="explain">CAM余额提现卡</p>
                                <div className="no-card" style={{border: '1px solid #e5e5e5'}} onClick={this.editBankCode}>
                                    <div className="icon noCard-t"/>
                                    <span className="noCard-b">添加银行卡</span>
                                </div>
                            </div>
                        )
                    }
                    {
                        bankInfo && (bankInfo.shoper.length > 0 ? (
                            <div className="card-box">
                                <p className="explain">营业提现卡</p>
                                {bankInfo.shoper.map(item => (
                                    <div key={item.id} className={this.backgroundImng(item.bankId) ? 'background-blue' : 'background-red'}>
                                        <div className="background-t">
                                            <div className="logo" style={{backgroundPosition: bankImg[item.bankId] ? `${bankImg[item.bankId][0] / 50}rem ${bankImg[item.bankId][1] / 50}rem` : '1000px 1000px'}}/>
                                            <div className="background-tl">{item.bankArea}</div>
                                        </div>
                                        <div className="card">
                                            <span>{item.bankNo.slice(0, 4)}</span>
                                            <span>****</span>
                                            <span>****</span>
                                            <span>****</span>
                                            <span>{item.bankNo.substring(item.bankNo.length - 3)}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : null)
                    }
                </div>
                {pwsPopup && (
                    <div className="enter-password-box">
                        <div className="enter-password">
                            <div className="command">
                                <span className="icon command-left" onClick={this.closePopupUp}/>
                                <span className="icon command-center">请输入密码</span>
                                <span className="icon command-right" onClick={this.closePopupUp}/>
                            </div>
                            <InputGrid onInputGrid={this.inputGrid}/>
                            <p onClick={this.forgetPws}>忘记密码</p>
                        </div>
                    </div>
                )}
            </div>
        );
    }
}

const mapStateToProps = state => {
    const edit = state.get('my');
    return {
        bankInfo: edit.get('bankInfo')
    };
};

const mapDispatchToProps = {
    showConfirm: actionCreator.showConfirm,
    getBankCardList: myActionCreator.getBankCardList
};
export default connect(mapStateToProps, mapDispatchToProps)(BankCard);
