/**支付页面 */
import React from 'react';
import {connect} from 'react-redux';
import './PayMoney.less';
import {dropByCacheKey} from 'react-router-cache-route';
import {baseActionCreator as actionCreator} from '../../../../../../redux/baseAction';
import {InputGrid} from '../../../../../common/input-grid/InputGrid';
import AppNavBar from '../../../../../common/navbar/NavBar';

const {
    appHistory,
    getUrlParam,
    native,
    systemApi: {getValue, removeValue},
    supple,
    showInfo,
    nativeCssDiff
} = Utils;
const {urlCfg} = Configs;
const mode = [
    // {
    //     title: 'CAM余额',
    //     value: 0,
    //     imgName: 'balance-cam'
    // },
    {
        title: '微信支付',
        value: 1,
        imgName: 'we-chat'
    },
    {
        title: '支付宝支付',
        value: 2,
        imgName: 'alipay'
    }
];

class PayMoney extends BaseComponent {
    constructor(props) {
        super(props);
        this.state = {
            pwsPopup: false, //CAM消费支付密码弹窗
            selectIndex: 1, //支付类型
            listArr: [], //支付数据
            orderId: decodeURI(
                getUrlParam('orderId', encodeURI(this.props.location.search))
            ), //支付所需订单id
            orderNum: decodeURI(
                getUrlParam('orderNum', encodeURI(this.props.location.search))
            ), //支付所需订单编号
            source: decodeURI(
                getUrlParam('source', encodeURI(this.props.location.search))
            ),
            money: decodeURI(
                getUrlParam('money', encodeURI(this.props.location.search))
            ),
            payInputBottom: '4.5rem' //cam密码输入框初始值
        };
        //这里是为了控制原生右滑退出
        props.setReturn(true);
        window.localStorage.setItem('close_key_board', '1');
    }

    componentDidMount() {
        const arrInfo = JSON.parse(getValue('orderInfo'));
        if (arrInfo) {
            //如果是有arrInfo代表是直接下单或者从购物车过来的
            const selfOrder = decodeURI(
                getUrlParam('selfOrder', encodeURI(this.props.location.search))
            );
            const date = (new Date().getTime() + 86400000) / 1000 - 1;
            const selfDate = (new Date().getTime() + 1800000) / 1000;
            this.getLastTime(selfOrder === 'null' ? date : selfDate); //是否是自提订单
            this.setState({
                orderNum: arrInfo.order,
                listArr: arrInfo,
                maturityTme: selfOrder === 'null' ? date : selfDate //到期时间
            });
        } else {
            //这里表示从线上订单点击付款过来的
            this.getList(true);
        }
    }

    componentWillReceiveProps(data, value) {
        //原生右滑退出处理
        if (!data.returnStatus) {
            this.goBackModal();
        }
    }

    //获取数据
    getList = onOff => {
        const {orderId, source} = this.state;
        this.fetch(urlCfg.payRightInfo, {
            data: {order_id: orderId},
            source //订单入口
        }).subscribe(res => {
            if (res && res.status === 0) {
                res.data.order = res.data.order_no;
                if (onOff) {
                    //这里是为了区分首次进来和继续支付
                    this.setState({
                        listArr: res.data,
                        orderNum: res.data.order_no
                    });
                }
                this.setState(
                    {
                        maturityTme: res.data.enddate //到期时间
                    },
                    () => this.getLastTime(res.data.enddate)
                );
            } else {
                appHistory.goBack();
            }
        });
    };

    //获取剩余时间
    getLastTime = time => {
        const that = this;
        const orderId = decodeURI(
            getUrlParam('orderId', encodeURI(this.props.location.search))
        );
        const arrInfo = JSON.parse(getValue('orderInfo'));
        const timeH = time * 1000;
        let timer = null;
        function getDate() {
            const oDate = new Date(); //获取日期对象
            const oldTime = oDate.getTime(); //现在距离1970年的毫秒数
            let second = Math.floor((timeH - oldTime) / 1000); //未来时间距离现在的秒数
            second %= 86400; //余数代表剩下的秒数；
            const hour = Math.floor(second / 3600); //整数部分代表小时；
            second %= 3600; //余数代表 剩下的秒数；
            const minute = Math.floor(second / 60);
            second %= 60;
            const str = supple(hour) + ':' + supple(minute) + ':' + supple(second);
            that.setState({
                remainingTime: str
            });
            if (
                (supple(hour) === '00'
                    && supple(minute) === '00'
                    && supple(second) === '00')
                || hour.toString().indexOf('-') !== -1
            ) {
                clearInterval(timer);
                if (arrInfo) {
                    //下单页过来的订单取消
                    that.fetch(urlCfg.dealMallorderbyno, {
                        data: {order_no: arrInfo.order}
                    }).subscribe(res => {
                        if (res && res.status === 0) {
                            showInfo('订单取消');
                            appHistory.goBack();
                        } else {
                            appHistory.goBack();
                        }
                    });
                } else if (orderId !== 'null') {
                    //订单列表过来的取消
                    that.fetch(urlCfg.delMallOrder, {
                        data: {
                            deal: 0,
                            id: orderId,
                            reason: '订单超时',
                            reason_id: 5
                        }
                    }).subscribe(res => {
                        if (res && res.status === 0) {
                            showInfo('订单取消');
                            appHistory.goBack();
                        } else {
                            appHistory.goBack();
                        }
                    });
                }
                //清除缓存
                removeValue('orderInfo');
                removeValue('orderArr');
            }
        }
        // getDate();
        timer = setInterval(getDate, 1000);
    };

    //选择支付方式
    choicePay = num => {
        this.setState({
            selectIndex: num
        });
    };

    //立即支付
    payRightNow = () => {
        const {listArr, selectIndex, orderNum} = this.state;
        //判断是否第三方支付还是CAM消费
        if (selectIndex === 0) {
            this.verifyPayword();
        } else if (selectIndex === 1) {
            this.wxPay(listArr, orderNum, selectIndex);
        } else if (selectIndex === 2) {
            this.alipay(listArr, orderNum, selectIndex);
        }
    };

    //微信支付
    wxPay = (listArr, orderNum, selectIndex) => {
        // alert('微信支付');
        this.fetch(urlCfg.payAppPay, {
            data: {order_no: orderNum[0], type: 1}
        }).subscribe(res => {
            if (res && res.status === 0) {
                if (process.env.NATIVE) {
                    native(
                        'wxPayCallback',
                        res.data ? res.data.arr : null,
                        dataList => {
                            native('goH5', {'': ''});
                            const data = dataList ? JSON.parse(dataList) : '';
                            if (
                                data
                                && (data.status === '0' || data.status === 0)
                            ) {
                                appHistory.replace(
                                    `/paymentCompleted?allPrice=${
                                        listArr.all_price
                                    }&id=${
                                        res.data.order_id
                                    }&types=${selectIndex}&deposit=${listArr.deposit
                                        || listArr.all_deposit}&if_express=${
                                        res.data.if_express
                                    }&card=${res.data.card.card_no}&cardPrice=${res.data.card.price}`
                                );
                            }
                        }
                    );
                } else {
                    // window.location.href = res.data.mweb_url;
                }
            }
        });
    };

    //支付宝支付
    alipay = (listArr, orderNum, selectIndex) => {
        // alert('支付宝支付');
        this.fetch(urlCfg.payAppPay, {
            data: {order_no: orderNum[0], type: 2}
        }).subscribe(res => {
            if (res && res.status === 0) {
                if (process.env.NATIVE) {
                    native('authInfo',
                        res.data ? res.data.arr : null, dataList => {
                            native('goH5', {'': ''});
                            const data = dataList ? JSON.parse(dataList) : '';
                            if (
                                data
                            && (data.status === '0' || data.status === 0)
                            ) {
                                appHistory.replace(
                                    `/paymentCompleted?allPrice=${
                                        listArr.all_price
                                    }&id=${
                                        res.data.order_id
                                    }&types=${selectIndex}&deposit=${listArr.deposit
                                    || listArr.all_deposit}&if_express=${
                                        res.data.if_express
                                    }&card=${res.data.card.card_no}&cardPrice=${res.data.card.price}`
                                );
                            }
                        });
                } else {
                    // window.location.href = res.data.mweb_url;
                }
            }
        });
    };

    //合并付款
    batchPayMoney = (listArr, selectIndex) => {
        // alert('合并付款');
        this.fetch(urlCfg.batchPayment, {
            data: {
                type: 1,
                payType: selectIndex === 1 ? 2 : 1,
                order_no: listArr.order
            }
        }).subscribe(res => {
            if (res && res.status === 0) {
                window.DsBridge.call(
                    selectIndex === 1 ? 'payWX' : 'payAliPay',
                    {
                        qrCode: res.data.appPayRequest.qrCode,
                        order_no: listArr.order[0],
                        type: process.env.NATIVE ? 1 : 2,
                        payType: selectIndex === 1 ? 2 : 1
                    },
                    dataList => {
                        native('goH5', {'': ''});
                        const data = dataList ? JSON.parse(dataList) : '';
                        if (data && data.status === '0') {
                            appHistory.replace(
                                `/paymentCompleted?allPrice=${listArr.all_price}&types=${selectIndex}&deposit=${listArr.all_deposit}&if_express=${res.if_express}&batch=1`
                            );
                        }
                    }
                );
                if (res.data.status === 1) {
                    showInfo(res.data.message);
                }
            }
        });
    };

    //关闭支付弹窗 弹出信息弹窗
    closePopup = () => {
        this.setState({
            pwsPopup: false
        });
    };

    //忘记密码跳转
    forgetPws = () => {
        appHistory.push(`/passwordPayment?pay=${1}`);
    };

    //CAM消费 支付
    inputGrid = pwd => {
        const {listArr, selectIndex, money} = this.state;
        this.setState(
            {
                pwsPopup: false
            },
            () => {
                this.fetch(urlCfg.campay, {
                    data: {
                        order_no: listArr.order,
                        pwd,
                        money: listArr.all_price || money
                    }
                }).subscribe(res => {
                    if (res && res.status === 0) {
                        appHistory.replace(
                            `/paymentCompleted?&deposit=${
                                res.data.capital
                            }&id=${res.data.id}&allPrice=${
                                res.data.total_fee
                            }&types=${selectIndex}&if_express=${
                                res.data.if_express
                            }&batch=${res.data.id ? '0' : '1'}`
                        );
                    }
                });
            }
        );
    };

    //验证支付密码是否设置
    verifyPayword = pwd => {
        const {showConfirm} = this.props;
        this.fetch(urlCfg.memberStatus, {
            data: {types: 0, chk_pass: 0}
        }).subscribe(res => {
            if (res && res.status === 0) {
                if (res.data.status !== 0) {
                    //status为0为已设置，其他都是未设置
                    showConfirm({
                        title: '您还未设置支付密码，是否前往设置',
                        callbacks: [
                            null,
                            () => {
                                appHistory.push(`/passwordPayment?pay=${1}`);
                            }
                        ]
                    });
                } else {
                    this.setState({
                        pwsPopup: true
                    });
                }
            }
        });
    };

    //页面卸载
    componentWillUnmount() {
        const {setReturn, hideConfirm} = this.props;
        //返回弹框的回调是否显示
        setTimeout(() => {
            setReturn(false);
        });
        hideConfirm(); //关闭弹窗
        //清除关闭键盘的方法
        window.localStorage.removeItem('close_key_board');
    }

    //兼容部分机型样式判断
    radiusCssShow = () => (nativeCssDiff() ? '1PX solid #999' : '0.01rem solid #999');

    //返回
    goBackModal = () => {
        const {maturityTme, listArr} = this.state;
        const {
            showConfirm,
            location: {search},
            setReturn
        } = this.props;
        const down = decodeURI(getUrlParam('down', encodeURI(search))); //线下订单过来标识
        const oDate = new Date(); //获取日期对象
        const oldTime = oDate.getTime(); //现在距离1970年的毫秒数
        let second = Math.floor((maturityTme * 1000 - oldTime) / 1000); //未来时间距离现在的秒数
        second %= 86400; //余数代表剩下的秒数；
        const hour = Math.floor(second / 3600); //整数部分代表小时；
        second %= 3600; //余数代表 剩下的秒数；
        const minute = Math.floor(second / 60);
        second %= 60;
        const appLength = appHistory.length();

        showConfirm({
            title: `您的订单在${supple(hour)}小时${supple(
                minute
            )}分钟内未支付将被取消，请尽快完成支付`,
            btnTexts: ['残忍拒绝', '继续支付'],
            callbacks: [
                () => {
                    const arrInfo = JSON.parse(getValue('orderInfo'));
                    const arr = JSON.parse(getValue('orderArr'));
                    dropByCacheKey('OrderPage');//清除我的订单的缓存
                    dropByCacheKey('selfMentionOrderPage');//清除线下订单
                    //清除缓存
                    removeValue('orderInfo');
                    removeValue('orderArr');
                    if (arrInfo) {
                        if (arr && arr[0] && arr[0].if_express === '1') {
                            if (appLength === 0) {
                                //线上订单，用户取消支付的时候，路由都没了，就走这里
                                appHistory.push('/myOrder/fk');
                                appHistory.reduction();
                            } else {
                                appHistory.replace('/myOrder/fk?type=home'); //type这里取消的时候，在列表页面点击返回应该回到首页。为h5提供的
                            }
                        } else if (appLength === 0) {
                            //用户取消支付的时候，路由都没了，就走这里
                            appHistory.push('/selfMention/ww');
                            appHistory.reduction();
                        } else {
                            appHistory.replace('/selfMention/ww?type=home');
                        }
                    } else if (appLength === 0) {
                        //用户取消支付的时候，路由都没了，就走这里
                        if (down === '1') {
                            appHistory.push('/selfMention/ww');
                        } else {
                            appHistory.push('/myOrder/fk');
                        }
                        appHistory.reduction();
                    } else {
                        appHistory.goBack();
                    }
                },
                () => {
                    if (listArr.order) {
                        this.getLastTime(maturityTme);
                    } else {
                        this.getList();
                    }
                }
            ]
        });
        setReturn(true);
    };

    //cam输入框聚焦
    callBackFoucs = () => {
        if (process.env.NATIVE) {
            this.setState({
                payInputBottom: '0.8rem'
            });
        }
    };

    //cam输入框失焦
    callBackBlur = () => {
        if (process.env.NATIVE) {
            this.setState({
                payInputBottom: '4.5rem'
            });
        }
    };

    render() {
        const {
            selectIndex,
            listArr,
            pwsPopup,
            remainingTime,
            payInputBottom
        } = this.state;
        return (
            <div
                data-component="pay-money"
                data-role="page"
                className="pay-money"
            >
                <AppNavBar
                    rightShow
                    title="订单支付"
                    goBackModal={this.goBackModal}
                />
                <div className="surplus">
                    <div className="surplus-top">
                        ￥<span>{listArr.price || listArr.all_price}</span>
                    </div>
                    <div className="surplus-bottom">
                        <span className="remaining-time">支付剩余时间</span>
                        <span className="reciprocal">{
                            remainingTime && remainingTime.split(':').map((item, index) => {
                                if (index !== 2) {
                                    return (<div className="have_dot"><span className="time-box">{item}</span><span className="dot">:</span></div>);
                                }
                                return <span className="time-box">{item}</span>;
                            })
                        }
                        </span>
                    </div>
                </div>

                <div className="payment-method-box">
                    {mode.map((item, index) => (
                        <div
                            key={item.value}
                            className="payment-method"
                            onClick={() => this.choicePay(item.value)}
                        >
                            <div className="distance">
                                <div className="pm-left">
                                    <div className={item.imgName}/>
                                    {/*<img src={item.Imgs}/>*/}
                                </div>
                                <div className="pm-center">{item.title}</div>
                                <div
                                    className={`icon ${
                                        item.value === selectIndex
                                            ? 'icon-Selection'
                                            : 'icon-Unselected'
                                    }`}
                                    style={{
                                        border:
                                            item.value !== selectIndex
                                                ? this.radiusCssShow()
                                                : ''
                                    }}
                                />
                            </div>
                        </div>
                    ))}
                </div>
                {/* <div className="binding">
                    <div className="binding-left">其他付款方式</div>
                    <div className="icon binding-right">绑定新卡</div>
                </div> */}

                <div className="promptly" onClick={this.payRightNow}>
                    立即支付￥{listArr.price || listArr.all_price}{' '}
                </div>
                {/*CAM消费支付密码弹窗*/}
                {pwsPopup && (
                    <div className="enter-password-box">
                        <div
                            className="enter-password"
                            style={{paddingBottom: payInputBottom}}
                        >
                            <div className="command">
                                <span
                                    className="icon command-left"
                                    onClick={this.closePopup}
                                />
                                <span className="icon command-center">
                                    请输入支付密码
                                </span>
                                <span
                                    className="icon command-right"
                                    onClick={this.closePopup}
                                />
                            </div>
                            <InputGrid
                                callBackBlur={this.callBackBlur}
                                callBackFoucs={this.callBackFoucs}
                                focus
                                onInputGrid={this.inputGrid}
                                propsType="number"
                            />
                            <p onClick={() => this.forgetPws()}>忘记密码</p>
                        </div>
                    </div>
                )}
            </div>
        );
    }
}

const mapStateToProps = state => {
    const my = state.get('my');
    const base = state.get('base');
    const shopCartState = state.get('shopCart');
    return {
        arr: shopCartState.get('orderArr'),
        orderInfo: my.get('orderState'),
        returnStatus: base.get('returnStatus')
    };
};

const mapDidpatchToProps = {
    showConfirm: actionCreator.showConfirm,
    setReturn: actionCreator.setReturn,
    hideConfirm: actionCreator.hideConfirm
};

export default connect(mapStateToProps, mapDidpatchToProps)(PayMoney);
