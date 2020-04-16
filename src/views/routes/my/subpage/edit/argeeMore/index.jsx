import React from 'react';
import {connect} from 'react-redux';
import {createForm} from 'rc-form';
import {List, InputItem, Button, Modal} from 'antd-mobile';
import {myActionCreator as actionCreator} from '../../../actions/index';
import Region from '../../../../../common/region/Region';
import AppNavBar from '../../../../../common/navbar/NavBar';
import './index.less';

const Item = List.Item;
const {appHistory, showSuccess, showInfo, validator, getUrlParam, native, nativeCssDiff} = Utils;
const {urlCfg} = Configs;
const {MESSAGE: {Feedback}, MESSAGE: {Form}} = Constants;

const itemLists = [
    {title: '版权信息', params: 'none'},
    {title: '软件许可使用协议', params: 1},
    {title: '特别说明', params: 3},
    {title: '平台服务协议', params: 2},
    {title: '版本信息隐私权政策', params: 4},
    {title: '证照信息', params: null}
];

class Agreement extends BaseComponent {
    state = {
        nickname: '', ///初始昵称
        height: document.documentElement.clientHeight - (window.isWX ? window.rem * null : window.rem * 1.08), //是微信扣除头部高度
        address: [], //初始地址
        province: '', //初始省
        urban: '', //初始市
        county: '', //初始县
        protocol: {}, //协议内容
        protocolTitle: '', //协议标题
        modal: false,
        edit: ''//路由
    };

    componentDidMount() {
        const {uidInfo, getUid, areaInfo, getArea, nickname, getNickName, location: {search}} = this.props;
        const type = decodeURI(getUrlParam('type', encodeURI(search)));
        const router = decodeURI(getUrlParam('router', encodeURI(search)));
        // const type = decodeURI(getUrlParam('type', encodeURI(search)));
        if (type === 'null') { //非登录页跳转过来查看的时候
            if (!uidInfo) {
                getUid();
            }
            if (!nickname) {
                getNickName();
            }
            if (!areaInfo) {
                getArea();
            }
            this.setState({edit: router});
        } else { //登录页跳过来的时候
            this.setState({
                edit: 'userAgreementDetail'
            }, () => {
                this.getProtocol(Number(type));
            });
        }
    }

    //源头uid
    userId = (uidInfo) => (
        <div data-component="userId" data-role="page" className="user-id">
            <AppNavBar title="源头UID"/>
            <div className="banner">
                <img src={uidInfo && uidInfo.avatarUrl} alt=""/>
            </div>
            <List className={`my-list ${window.isWX ? 'my-list-clear' : ''}`}>
                <Item
                    extra={uidInfo && uidInfo.nickname}
                >昵称
                </Item>
                <Item
                    extra={(uidInfo && uidInfo.no) || '无'}
                >UID
                </Item>
            </List>
        </div>
    )


    //修改昵称
    userName = (getFieldDecorator, nickname) => (
        <div data-component="username" data-role="page" className="username">
            <AppNavBar title="修改昵称"/>
            <div className={`nickname ${window.isWX ? 'nickname-clear' : ''}`}>
                {
                    getFieldDecorator('nickname', {
                        initialValue: nickname,
                        rules: [
                            {validator: this.lockingName}
                        ],
                        validateTrigger: 'onSubmit'//校验值的时机
                    })(
                        <InputItem
                            className={`inpt ${nativeCssDiff() ? 'general-other' : 'general'}`}
                            style={{textAlign: 'left'}}
                            maxLength={10}
                        />
                    )
                }
                <Button onClick={this.modifyname}>确认修改</Button>
            </div>
        </div>
    )

    //修改昵称更改昵称
    lockingName = (rule, value, callback) => {
        if (!value) {
            callback('\u0020');
            showInfo(Form.No_NickName);
            return;
        }
        callback();
    }

    //修改昵称校验输入值
    modifyname = () => {
        const {form: {validateFields}, getUserInfo, getNickName, getMyInfo} = this.props;
        validateFields({first: true, force: true}, (error, val) => {
            if (!error) {
                this.fetch(urlCfg.modifyNickname, {data: {nickname: val.nickname}})
                    .subscribe((res) => {
                        if (res && res.status === 0) {
                            showSuccess(Feedback.Edit_Success);
                            getNickName();//当前页面
                            getUserInfo();//设置页面
                            getMyInfo();//我的页面
                            appHistory.goBack();
                        }
                    });
                return;
            }
        });
    }


    //所在区域管理
    regicon = (height, areaInfo, getFieldDecorator) => (
        <div data-component="regicon" data-role="page" className="regicon">
            <AppNavBar title="所在区域管理"/>
            <List className="my-list">
                <div style={{height: height}} className="receiving-reg">
                    {/* <Item
                        extra={areaInfo && areaInfo.join('-')}
                    >当前区域
                    </Item> */}
                    <InputItem>
                        <div className="area">修改区域</div>
                        {
                            getFieldDecorator('area', {
                                rules: [
                                    {validator: this.checkArea}
                                ],
                                validateTrigger: 'submit'//校验值的时机
                            })(
                                <Region
                                    onSetProvince={this.setProvince}
                                    onSetCity={this.setCity}
                                    onSetCounty={this.setCounty}
                                    onSetStreet={this.setStreet}
                                    add
                                />
                            )
                        }
                    </InputItem>
                    <Button className="button" onClick={this.submit}>确认修改</Button>
                </div>
            </List>
        </div>
    )

    //  省市县的赋值
    setProvince = str => {
        this.setState({
            province: str,
            urban: '',
            county: ''
        });
    };

    //设置城市
    setCity = str => {
        this.setState({
            urban: str,
            county: ''
        });
    };

    //设置市辖区
    setCounty = str => {
        this.setState({
            county: str
        });
    };

    //校验是否选择地址
    checkArea = (rule, value, callback) => {
        const {province, urban, county} = this.state;
        if (!province || !urban || !county) {
            validator.showMessage(Form.No_pca, callback);
            return;
        }
        callback();
    };

    //确认修改
    submit = () => {
        const {form: {validateFields}, getArea, getUserInfo} = this.props;
        const {province, urban, county} = this.state;
        validateFields({first: true, force: true}, (error, val) => {
            if (!error) {
                const arr = [province, urban, county];
                this.fetch(urlCfg.personalAddress, {data: {pca: arr}})
                    .subscribe(res => {
                        if (res && res.status === 0) {
                            showInfo(Feedback.Handle_Success);
                            getArea();
                            getUserInfo();
                            appHistory.goBack();
                        }
                    });
                return;
            }
        });
    };


    //关于中品优购
    aboutCam = (protocol, modal, protocolTitle, type) => (
        <div data-component="UserAgreementDetail" data-role="page" className="UserAgreementDetail">
            {
                type === 'null' && (
                    <React.Fragment>
                        <AppNavBar title="关于"/>
                        {/* {
                                !window.isWX && (
                                    <List>
                                        {(/iphone|ipad/gi).test(navigator.platform) && <Item arrow="horizontal" onClick={() => { process.env.NATIVE && native('evalMe') }}>给我评价</Item>}
                                    </List>
                                )
                            } */}
                        <List>
                            <div className="about-information">
                                {
                                    itemLists.map(item => (
                                        <Item arrow="horizontal" key={item.title} onClick={() => this.getProtocol(item.params)}>{item.title}</Item>
                                    ))
                                }
                            </div>
                        </List>
                        {
                            !window.isWX && (
                                <List>
                                    <Item extra="" arrow="horizontal" onClick={() => process.env.NATIVE && native('checkVersion', {'': ''}, () => {})}>检测</Item>
                                </List>
                            )
                        }
                        <span className="corporate">中战华安控股集团有限公司</span>
                        <span className="edition">当前版本号：1.0</span>
                    </React.Fragment>
                )
            }
            <Modal
                visible={modal}
                className="protocol-modal"
                title={protocolTitle}
                footer={[{text: '确定',
                    onPress: () => {
                        if (process.env.NATIVE && type !== 'null') {
                            native('goBack', 'goLogin');
                        }
                        this.showModal(false);
                    }}]}
            >
                <div className="protocol-content">
                    {protocol}
                </div>
            </Modal>
        </div>
    )

    //协议弹窗
    getProtocol = (num) => {
        if (num > 0) {
            this.fetch(urlCfg.getAgreement, {data: {type: num}}).subscribe(res => {
                if (res && res.status === 0) {
                    if (res.data) {
                        const proArr = new Map([
                            [1, res.data.pr_content],
                            [2, res.data.card_content],
                            [3, res.data.secret_content],
                            [4, res.data.member_content]
                        ]);
                        const proArrTitle = new Map([
                            [1, '软件许可使用协议'],
                            [2, '平台服务协议'],
                            [3, '特别说明'],
                            [4, '版本信息隐私权政策']
                        ]);
                        this.setState({
                            protocol: proArr.get(num) || '',
                            protocolTitle: proArrTitle.get(num) || ''
                        }, () => {
                            this.showModal(true);
                        });
                    }
                }
            });
        } else if (num !== 'none') {
            this.setState({
                protocol: (
                    <div className="version-info">
                        <p className="allow-number">增值电信业务经营许可证编号：鲁B2-20190240</p>
                    </div>
                ),
                protocolTitle: '证照信息'
            }, () => {
                this.showModal(true);
            });
        }
    }

    showModal = (modal) => {
        this.setState({
            modal
        });
    }

    render() {
        const {uidInfo, form: {getFieldDecorator}, nickname, areaInfo, location: {search}} = this.props;
        const {edit, height, protocol, modal, protocolTitle} = this.state;
        const type = decodeURI(getUrlParam('type', encodeURI(search)));
        let blockModal = <div/>;
        switch (edit) {
        case 'enid'://源头uid
            blockModal = this.userId(uidInfo);
            break;
        case 'extname'://昵称
            blockModal = this.userName(getFieldDecorator, nickname);
            break;
        case 'locationarea'://所在区域
            blockModal = this.regicon(height, areaInfo, getFieldDecorator);
            break;
        case 'userAgreementDetail'://关于中卖网
            blockModal = this.aboutCam(protocol, modal, protocolTitle, type);
            break;
        default:
            blockModal = '';
            break;
        }
        return blockModal;
    }
}

const mapStateToProps = state => {
    const EditInfo = state.get('my');
    return {
        uidInfo: EditInfo.get('uidInfo'),
        areaInfo: EditInfo.get('areaInfo'),
        nickname: EditInfo.get('nickname')
    };
};

const mapDispatchToProps = {
    getUserInfo: actionCreator.getUserInfo,
    getUid: actionCreator.getUid,
    getArea: actionCreator.getArea,
    getNickName: actionCreator.getNickName,
    getMyInfo: actionCreator.getMyInfo
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(createForm()(Agreement));
