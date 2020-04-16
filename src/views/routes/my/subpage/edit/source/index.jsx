//确认源头码页面
import {connect} from 'react-redux';
import {List, InputItem, Button} from 'antd-mobile';
import {myActionCreator as actionCreator} from '../../../actions/index';
import AppNavBar from '../../../../../common/navbar/NavBar';
import './index.less';

const article = [
    {
        text: '扫码确认',
        value: 0
    },
    {
        text: '手动输入确认',
        value: 2
    }
];
const {showInfo, validator, getUrlParam, appHistory, native, nativeCssDiff} = Utils;
const {urlCfg} = Configs;
const {MESSAGE: {Form, Feedback}} = Constants;

class SourceBrowse extends BaseComponent {
    state = {
        height: document.documentElement.clientHeight - (window.isWX ? window.rem * null : window.rem * 1.08),
        edit: decodeURI(getUrlParam('router', encodeURI(this.props.location.search))), //路由状态
        nickname: decodeURI(getUrlParam('nickname', encodeURI(this.props.location.search))),
        phone: decodeURI(getUrlParam('phone', encodeURI(this.props.location.search))),
        uid: decodeURI(getUrlParam('uid', encodeURI(this.props.location.search))),
        avatarUrl: decodeURI(getUrlParam('avatarUrl', encodeURI(this.props.location.search)))
    }

    componentWillReceiveProps(next) {
        const timerNext = decodeURI(getUrlParam('time', encodeURI(next.location.search)));
        const timer = decodeURI(getUrlParam('time', encodeURI(this.props.location.search)));
        if (process.env.NATIVE && timer && timerNext !== timer) {
            this.setState({
                nickname: decodeURI(getUrlParam('nickname', encodeURI(next.location.search))),
                phone: decodeURI(getUrlParam('phone', encodeURI(next.location.search))),
                uid: decodeURI(getUrlParam('uid', encodeURI(next.location.search))),
                avatarUrl: decodeURI(getUrlParam('avatarUrl', encodeURI(next.location.search)))
            });
        }
    }

    //点击扫一扫
    sureSaoCode = () => {
        if (process.env.NATIVE) {
            const obj = {
                pay: urlCfg.importSum,
                write: urlCfg.consumer,
                source: urlCfg.sourceBrowse
            };
            native('qrCodeScanCallback', obj);
        }
    }

    //跳转扫码对应页面
    serviceList = (value) => {
        if (value === 2) {
            appHistory.push('/virSource?router=virSource');
        } else if (window.isWX) {
            window.wx.ready(() => {
                window.wx.scanQRCode({
                    needResult: 0, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
                    scanType: ['qrCode', 'barCode'], // 可以指定扫二维码还是一维码，默认二者都有
                    success: function (res) {
                        console.log(res); // 当needResult 为 1 时，扫码返回的结果
                    }
                });
            });
        } else {
            this.sureSaoCode();
        }
    }

    goBackModal = () => {
        if (appHistory.length() === 0) {
            appHistory.push('/edit');
        } else {
            appHistory.goBack();
        }
    }


    //初始页面
    sureSource = (height) => (
        <div data-component="apply-service" data-role="page" className="source-index">
            <AppNavBar goBackModal={this.goBackModal} title="确认源头UID"/>
            <div style={{height: height}} className="services">
                {article.map((item, index) => (
                    <div className="service-list" key={index.toString()} onClick={() => this.serviceList(item.value)}>
                        <div className="service-left" onClick={() => this.looklook(index)}>
                            <div className="service-text">{item.text}</div>
                        </div>
                        <div className="service-right"><span className="icon icon-right"/></div>
                    </div>
                ))}
            </div>
        </div>
    )

    //验证
    virSource = (height) => (
        <div data-component="source" data-role="page" className="source">
            <AppNavBar title="确认源头UID" goBackModal={this.goBackModal}/>
            <div style={{height: height}} className="source-box">
                <List>
                    <InputItem
                        clear
                        type="number"
                        placeholder="请输入推荐人UID"
                        onChange={this.setUid}
                        maxLength={6}
                    >推荐人UID
                    </InputItem>
                    <InputItem
                        clear
                        type="phone"
                        placeholder="请输入推荐人手机号"
                        onChange={this.setPhone}
                    >推荐人手机号
                    </InputItem>
                </List>
                <div className="cozy">
                    <p>温馨提示</p>
                    <p>输入的UID与手机号要是同一用户才可验证成哦</p>
                </div>
                <div className="next">
                    <Button className="normal-button" onClick={this.verification}>验证</Button>
                </div>
            </div>
        </div>
    )

    //设置uid
    setUid = (value) => {
        this.setState({
            uid: value
        });
    }

    //设置电话
    setPhone = (value) => {
        this.setState({
            phone: value
        });
    }

    //验证信息
    verification = () => {
        const {uid, phone} = this.state;
        //uid判断
        if (!uid) {
            showInfo(Form.No_UID);
            return;
        }
        if (!validator.UID(uid)) {
            showInfo(Form.Error_UID);
            return;
        }
        if (!phone) {
            showInfo(Form.No_Phone);
            return;
        }
        if (!validator.checkPhone(validator.wipeOut(phone))) {
            showInfo(Form.Error_Phone);
            return;
        }
        //1表示验证
        this.submit(1);
    };

    //请求
    submit = (type) => {
        const {uid, phone} = this.state;
        this.fetch(urlCfg.confirmationReferees, {data: {no: uid, type, phone: validator.wipeOut(phone)}})
            .subscribe(res => {
                if (res && res.status === 0) {
                    this.setState({
                        showButton: true
                    }, () => {
                        showInfo(Feedback.Ver_Success);
                        this.fetch(urlCfg.getDfinfor, {data: {no: uid}})
                            .subscribe(data => {
                                if (data && data.status === 0) {
                                    appHistory.push(`/sourceBrowse?nickname=${encodeURI(data.data.nickname)}&phone=${validator.wipeOut(phone)}&uid=${uid}&avatarUrl=${data.data.avatarUrl}&router=sourceBrowse`);
                                }
                            });
                    });
                }
            });
    };

    goBackModal =() => {
        if (appHistory.length() === 0) {
            appHistory.replace('/edit');
        } else {
            appHistory.goBack();
        }
    };


    //绑定
    sourceBrowse = (avatarUrl, nickname, uid, phone) => (
        <div data-component="source-browse" data-role="page" className="source-browse">
            <AppNavBar goBackModal={this.goBackModalBind} title="确认源头UID"/>
            <div className="recommend-content">
                <div className="picture">
                    <img src={avatarUrl || require('../../../../../../assets/images/avatar.png')} alt=""/>
                </div>
                <div className="information">
                    <p>{decodeURI(nickname)}</p>
                    <p>UID:{uid}</p>
                    <p>
                        <span>手机号：</span>
                        <span>{phone.slice(0, 4)}****{phone.slice(-4)}</span>
                    </p>
                </div>
                <div className="button">
                    {/* <Button className="normal-button general" onClick={this.sureSaoAgain}>重新扫码</Button> */}
                    <Button className={`normal-button ${nativeCssDiff() ? 'general-other' : 'general'}`} onClick={this.goBackModal}>取消</Button>
                    <Button className="normal-button important" onClick={this.sureBind}>确认绑定</Button>
                </div>
            </div>
        </div>
    )

    //重新扫码
    sureSaoAgain = () => {
        if (process.env.NATIVE) {
            native('qrCodeScanCallback', {
                pay: urlCfg.importSum,
                write: urlCfg.consumer,
                source: urlCfg.sourceBrowse
            });
        }
    }

    //确认绑定
    sureBind = () => {
        const {uid, phone} = this.state;
        const {getUserInfo} = this.props;
        this.fetch(urlCfg.confirmationReferees, {data: {no: uid, type: 0, phone}})
            .subscribe(res => {
                if (res && res.status === 0) {
                    showInfo(Feedback.Bind_Success);
                    if (process.env.NATIVE && appHistory.length() === 0) {
                        native('goBack');
                    } else {
                        appHistory.go(-3);
                    }
                    getUserInfo();
                }
            });
    }

    //返回
    goBackModalBind = () => {
        if (process.env.NATIVE && appHistory.length() === 0) {
            native('goBack');
        } else {
            appHistory.goBack();
        }
    }

    render() {
        const {height, edit, avatarUrl, nickname, uid, phone} = this.state;
        let blockModal = <div/>;
        switch (edit) {
        case 'source':
            blockModal = this.sureSource(height);
            break;
        case 'virSource':
            blockModal = this.virSource(height);
            break;
        case 'sourceBrowse':
            blockModal = this.sourceBrowse(avatarUrl, nickname, uid, phone);
            break;
        default:
            blockModal = '';
            break;
        }
        return blockModal;
    }
}

const mapDispatchToProps = {
    getUserInfo: actionCreator.getUserInfo
};

export default connect(null, mapDispatchToProps)(SourceBrowse);