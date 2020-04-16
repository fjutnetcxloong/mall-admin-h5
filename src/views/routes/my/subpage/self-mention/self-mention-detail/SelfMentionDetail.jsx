import React from 'react';
import {connect} from 'react-redux';
import './SelfMentionDetail.less';
import {List, Radio, TextareaItem, Modal, Tabs, InputItem} from 'antd-mobile';
import {myActionCreator as ActionCreator} from '../../../actions/index';
import {baseActionCreator} from '../../../../../../redux/baseAction';
import {shopCartActionCreator} from '../../../../shop-cart/actions/index';
import AppNavBar from '../../../../../common/navbar/NavBar';
import OrderPageCard from '../../../../../common/order-page-card';
import BaseComponent from '../../../../../../components/base/BaseComponent';

const {urlCfg} = Configs;
const {
    validator,
    showInfo,
    appHistory,
    getUrlParam,
    systemApi: {setValue, getValue, removeValue},
    native
} = Utils;
const Item = List.Item;

class ReDetail extends BaseComponent {
    constructor(props, context) {
        super(props, context);
    }

    state = {
        modal: false, //自提弹窗是否弹出
        currentTab: 0, //当前自提日期的key
        valueItem: 0, //当前自提时间的key
        value: '请选择', //当前自提时间
        rdata: [{list: []}], //获取所有自提时间
        tabsr: [], //获取所有自提日期
        radioTreaty: false, //自提协议是否勾选
        OrderSelf: [], //获取自提数据
        alertPhone: 0, //自提手机号
        showPhone: true, //是否显示修改自提手机号
        goodsArr: [], //订单商品遍历
        shopdata: [], //店铺
        address: '', //门店地址
        textarea: '', //获取备注信息
        protocolModal: false, //协议弹出框
        propsData: this.props,
        showCardList: false, //是否展示优惠券列表
        priceArr: [], //获取红包数据
        isRender: true //判断是否重新渲染红包列表
    };

    componentDidMount() {
        const {
            setOrder,
            location: {search},
            setIds
        } = this.props;
        const timer = decodeURI(getUrlParam('time', encodeURI(search)));
        if (process.env.NATIVE) {
            if (timer === 'null') {
                //非购物车进入时
                this.getOrderSelf();
            } else {
                //这里的情况是，原生那边跳转的时候，需要处理一些问题，所以就购物车过来的时候，存数据，这边取数据
                native('getSelfMentio', {'': ''}, data => {
                    const res = data ? JSON.parse(data) : '';
                    if (res && (res.status === 0 || res.status === '0')) {
                        setOrder(res.data.arr);
                        setIds(res.data.cartArr);
                        this.getOrderSelf();
                    }
                });
            }
        } else {
            this.getOrderSelf();
        }
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        return {
            propsData: nextProps
        };
    }

    componentDidUptate(prevProps, prevState) {
        const {
            propsData: {
                setOrder,
                location: {search}
            }
        } = this.state;
        const timerNext = decodeURI(
            getUrlParam('time', encodeURI(prevState.propsData.location.search))
        );
        const timer = decodeURI(getUrlParam('time', encodeURI(search)));
        if (timerNext !== timer && process.env.NATIVE) {
            this.setState(
                {
                    modal: false, //自提弹窗是否弹出
                    currentTab: 0, //当前自提日期的key
                    valueItem: 0, //当前自提时间的key
                    value: '请选择', //当前自提时间
                    rdata: [{list: []}], //获取所有自提时间
                    tabsr: [], //获取所有自提日期
                    radioTreaty: false, //自提协议是否勾选
                    OrderSelf: [], //获取自提数据
                    alertPhone: 0, //自提手机号
                    showPhone: true, //是否显示修改自提手机号
                    goodsArr: [], //订单商品遍历
                    shopdata: [], //店铺
                    address: '', //门店地址
                    textarea: '' //获取备注信息
                },
                () => {
                    native('getSelfMentio', {'': ''}, data => {
                        const res = data ? JSON.parse(data) : '';
                        if (res && res.status === 0) {
                            setOrder(res.data.arr);
                            this.getOrderSelf();
                        }
                    });
                }
            );
        }
    }

    //自提数据获取
    getOrderSelf = () => {
        const {arr} = this.props;
        this.fetch(urlCfg.orderSelf, {
            data: {
                pr_arr: arr,
                type: arr[0].if_express === '3' ? '2' : '1'
            }
        }).subscribe(res => {
            if (res && res.status === 0) {
                this.setState(
                    {
                        OrderSelf: res,
                        rdata: res.sufficiency.sufficiency_time,
                        tabsr: res.sufficiency.tabs,
                        alertPhone: res.phone,
                        goodsArr: res.data.data,
                        shopdata: res.data,
                        address: res.sufficiency.sufficiency_address
                    },
                    () => {
                        this.cardTicket(res.data);
                    }
                );
            }
        });
    };

    //查看是否有红包
    cardTicket = data => {
        const prArr = [],
            priceArr = [];
        if (data.data && data.data.length) {
            data.data.forEach(item => {
                prArr.push(item.id);
                priceArr.push(item.price);
            });
        }
        const arr = JSON.parse(getValue('orderArr'));
        const no = arr ? arr[0].no : '';
        this.fetch(urlCfg.cardUseList, {
            data: {
                shop_no: no,
                pr: prArr.join(','),
                price: priceArr.join(',')
            }
        }).subscribe(res => {
            if (res && res.status === 0) {
                const dataValue = res.data.card_list;
                this.setState({
                    cardInfo:
                        dataValue.length > 0
                            ? dataValue.filter(item => item.available === 1)
                            : [],
                    priceArr:
                        dataValue.length > 0
                            ? dataValue.filter(item => item.selected === 1)
                            : []
                });
            }
        });
    };

    //自提协议radio是否勾选
    radioTreaty = () => {
        this.setState(prveState => ({
            radioTreaty: !prveState.radioTreaty
        }));
    };

    //选择自提时间
    radioChange = (value, valueItem) => {
        this.setState({
            value,
            valueItem,
            modal: false
        });
    };

    //选择自提日期
    onChangeTab = tab => {
        this.setState({
            valueItem: null,
            currentTab: tab.key
        });
    };

    //切换修改预留手机号
    alertPhone = () => {
        this.setState(prevState => ({
            showPhone: !prevState.showPhone
        }));
    };

    //修改预留手机号
    getPhone = res => {
        this.setState({
            alertPhone: res
        });
    };

    //获取订单备注
    textarea = data => {
        this.setState({
            textarea: data
        });
    };

    renderContent = key => {
        key = Number(key);
        return (
            <div className="render-content-wrap">
                {this.state.OrderSelf.sufficiency && (
                    <List>
                        {this.state.rdata[key].list
                            && this.state.rdata[key].list.map(item => (
                                <div
                                    className="render-content"
                                    key={item.value}
                                    onClick={() => this.radioChange(item.label, item.value)
                                    }
                                >
                                    {item.label}
                                    <Radio
                                        checked={
                                            this.state.valueItem === item.value
                                        }
                                    />
                                </div>
                            ))}
                    </List>
                )}
            </div>
        );
    };

    //立即付款
    submitSelf = () => {
        const {
            value,
            radioTreaty,
            alertPhone,
            currentTab,
            textarea,
            shopdata,
            address,
            priceArr
        } = this.state;
        const {
            setOrderInfo,
            arr,
            carId,
            location: {search}
        } = this.props;
        const shopArr = [];
        // console.log(shopdata);
        shopArr.push({shop_id: shopdata.shop_id});
        if (shopdata.data.length > 0) {
            shopdata.data.forEach(items => {
                shopArr.forEach(data => {
                    if (Array.isArray(data.pr_arr)) {
                        data.pr_arr.push({
                            pr_id: items.id,
                            values: items.values,
                            num: items.num,
                            values_name: items.values_name
                        });
                    } else {
                        data.pr_arr = [
                            {
                                pr_id: items.id,
                                values: items.values,
                                num: items.num,
                                values_name: items.values_name
                            }
                        ];
                    }
                });
            });
        }
        if (!address) {
            showInfo('店家没有自提的门店地址');
        } else if (value === '请选择' && arr[0].if_express !== '3') {
            showInfo('请选择使用时间');
        } else if (!validator.checkPhone(alertPhone)) {
            showInfo('请输入正确的手机号');
        } else if (!radioTreaty) {
            showInfo('到店自提协议未同意');
        } else {
            //后端判断自提从哪里进入 类型
            let sou = 2;
            const source = decodeURI(getUrlParam('source', encodeURI(search)));
            if (source !== 'null') {
                sou = source;
            }
            this.fetch(urlCfg.orderSubmit, {
                data: {
                    shop_arr: shopArr,
                    white_phone: alertPhone,
                    day: currentTab,
                    timer: arr[0].if_express === '3' ? '' : value,
                    source: sou,
                    remarks: textarea,
                    car_id: carId,
                    type: arr[0].if_express === '3' ? '2' : '1',
                    cards: priceArr.length ? priceArr.map(item => item.id) : []
                }
            }).subscribe(res => {
                if (res && res.status === 0) {
                    setOrderInfo(res);
                    appHistory.replace(`/payMoney?source=${sou}&selfOrder=1`);
                    setValue('orderInfo', JSON.stringify(res));
                }
            });
        }
    };

    //点击弹出到店协议
    viewShopFile = (protocolModal, ev) => {
        this.setState({
            protocolModal
        });
        ev.stopPropagation();
    };

    goBackModal = () => {
        const timer = decodeURI(
            getUrlParam('time', encodeURI(this.props.location.search))
        );
        if (timer !== 'null') {
            native('goBack');
        } else if (appHistory.length() === 0) {
            appHistory.replace('/selfMention/yw');
        } else {
            appHistory.goBack();
        }
        //清除缓存
        removeValue('orderArr');
    };

    timeClick = e => {
        this.setState({modal: true});
        e.stopPropagation();
    };

    //开启或关闭优惠券选择
    choiseCardList = () => {
        this.setState(prevState => ({
            isRender: false,
            showCardList: !prevState.showCardList
        }));
    };

    //开启或关闭优惠券选择
    closeCardList = () => {
        this.setState(prevState => ({
            showCardList: !prevState.showCardList
        }));
    };

    //点击确定
    sureCheck = () => {
        this.setState({
            couponStatus: false
        });
    };

    //点击确定按钮，获取数据
    getCardValue = data => {
        this.setState({
            showCardList: false,
            priceArr: data
        });
    };

    //计算出需要扣除的红包总额
    getCardPrice = data => {
        let num = 0;
        if (data.length) {
            data.forEach(item => {
                num += item.price;
            });
        }
        return num;
    };

    render() {
        const arr = JSON.parse(getValue('orderArr'));
        const {
            OrderSelf,
            protocolModal,
            radioTreaty,
            modal,
            tabsr,
            currentTab,
            value,
            alertPhone,
            showPhone,
            shopdata,
            goodsArr,
            address,
            textarea,
            cardInfo,
            showCardList,
            priceArr,
            isRender
        } = this.state;
        return (
            <div
                data-component="Self-mentionDetail"
                data-role="page"
                className="Self-mentionDetail"
            >
                <AppNavBar
                    goBackModal={this.goBackModal}
                    rightShow
                    title="确认订单"
                />
                <div className="store-address">
                    <div className="frame">
                        <div className="address-left">门店地址：</div>
                        <div className="address-center">
                            {address || '暂无'}
                        </div>
                    </div>
                    <div className="appointment">
                        {arr && arr[0].if_express === '3' ? (
                            <div className="time-number">
                                <div className="time-top">有效时间</div>
                                {OrderSelf.effective && (
                                    <div className="time-bottom-tow">
                                        {OrderSelf.effective.effective_time}
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="time-number">
                                <div className="time-top">使用时间</div>
                                <div
                                    className="icon time-bottom"
                                    onClick={() => {
                                        this.setState({modal: true});
                                    }}
                                >
                                    {value}
                                </div>
                            </div>
                        )}
                        <div className="time-number number">
                            <div className="time-top">预留手机</div>
                            {showPhone ? (
                                <div
                                    className="icon time-alter"
                                    onClick={this.alertPhone}
                                >
                                    <p className="time-alter-text">
                                        {alertPhone}
                                    </p>
                                </div>
                            ) : (
                                <div>
                                    <InputItem
                                        className="showPhone"
                                        type="number"
                                        placeholder="请输入手机号"
                                        onChange={this.getPhone}
                                        onBlur={this.alertPhone}
                                        maxLength={11}
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                    <div
                        className={`my-radio icon ${
                            radioTreaty === true ? 'endorse' : ''
                        }`}
                        onClick={this.radioTreaty}
                    >
                        同意
                        <span
                            className="agreement"
                            onClick={e => this.viewShopFile(true, e)}
                        >
                            《到店自提协议》
                        </span>
                    </div>
                </div>

                <div className="shop-lists">
                    <div className="shop-name">
                        <div className="shop-title">
                            <img
                                src={shopdata.picpath}
                                onError={e => {
                                    e.target.src = shopdata.df_logo;
                                }}
                                alt=""
                            />
                            <p>{shopdata.shopName}</p>
                            <div className="icon enter"/>
                        </div>
                        <div className="shop-name-right">
                            营业时间{shopdata.open_time || '暂无'}
                        </div>
                    </div>
                    {goodsArr
                        && goodsArr.map(item => (
                            <div className="goods" key={item.id}>
                                <div className="goods-left">
                                    <div>
                                        <img src={item.picpath}/>
                                    </div>
                                </div>
                                <div className="goods-right">
                                    <div className="goods-desc">
                                        <div className="desc-title">
                                            {item.title}
                                        </div>
                                        <div className="price">
                                            ￥{item.price}
                                        </div>
                                    </div>
                                    <div className="goods-sku">
                                        <div className="sku-left">
                                            {item.values_name
                                                .split(',')
                                                .map(vaName => (
                                                    <div
                                                        key={vaName}
                                                        className="goods-size"
                                                    >
                                                        {vaName}
                                                    </div>
                                                ))}
                                        </div>
                                        <div className="sku-right">
                                            x{item.num}
                                        </div>
                                    </div>
                                    <div className="btn-keep">
                                        C米：{item.deposit}
                                    </div>
                                </div>
                            </div>
                        ))}
                    <List className="list-line">
                        <Item
                            extra={(
                                <TextareaItem
                                    value={textarea}
                                    clear
                                    title=""
                                    placeholder="请和商家协商一致"
                                    onChange={this.textarea}
                                />
                            )}
                        >
                            订单备注
                        </Item>
                        <Item
                            onClick={this.choiseCardList}
                            extra={(
                                <span
                                    className={
                                        this.getCardPrice(priceArr)
                                            ? 'ishas-card icon'
                                            : 'no-has-cord icon'
                                    }
                                >
                                    {this.getCardPrice(priceArr)
                                        ? '- ' + this.getCardPrice(priceArr)
                                        : '暂无可用抵扣'}
                                </span>
                            )}
                        >
                            优惠券抵扣
                        </Item>
                    </List>
                    <div className="shop-bottom">
                        <div className="right-bottom">
                            <div className="total-count">
                                总C米：<span>{OrderSelf.all_deposit}</span>
                            </div>
                            <div className="total-price">
                                <div className="total-price-left">
                                    共{OrderSelf.all_pr_num}件商品
                                </div>
                                <div className="total-price-right">
                                    <span>合计：</span>
                                    <span className="money">
                                        ￥
                                        {OrderSelf.all_price
                                            - this.getCardPrice(priceArr)}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="altogether">
                    <div className="altogether-left">
                        共{OrderSelf.all_pr_num}件
                    </div>
                    <div className="altogether-center">
                        <span className="total-left">合计：</span>
                        <span className="total-right">
                            ￥
                            {OrderSelf.all_price - this.getCardPrice(priceArr)}
                        </span>
                    </div>
                    <div className="altogether-right" onClick={this.submitSelf}>
                        立即付款
                    </div>
                </div>
                {arr && arr[0].if_express !== '3' && (
                    <Modal
                        popup
                        visible={modal}
                        onClose={() => this.setState({modal: false})}
                        animationType="slide-up"
                        title="选择自提时间"
                        className="selection-time"
                    >
                        <Tabs
                            tabs={tabsr}
                            initialPage={currentTab}
                            tabBarPosition="left"
                            tabDirection="vertical"
                            onChange={tab => this.onChangeTab(tab)}
                        >
                            {this.renderContent(currentTab)}
                        </Tabs>
                    </Modal>
                )}
                {/*到店自提协议模态框*/}
                <Modal
                    visible={protocolModal}
                    className="protocol-modal"
                    title="到店自提协议"
                    footer={[
                        {
                            text: '确定',
                            onPress: () => {
                                const type = decodeURI(
                                    getUrlParam(
                                        'type',
                                        encodeURI(this.props.location.search)
                                    )
                                );
                                if (type !== 'null') {
                                    native('loginout');
                                }
                                this.viewShopFile(false);
                            }
                        }
                    ]}
                >
                    <div className="protocol-content">{OrderSelf.agree}</div>
                </Modal>

                {/**优惠券 */}
                <OrderPageCard
                    showCardList={showCardList}
                    closeCardList={this.closeCardList}
                    cardLList={cardInfo}
                    title="优惠券"
                    getCardValue={this.getCardValue}
                    isRender={isRender}
                />
            </div>
        );
    }
}

const mapStateToProps = state => {
    const shopCartState = state.get('shopCart');
    return {
        arr: shopCartState.get('orderArr'),
        carId: shopCartState.get('ids')
    };
};

const mapDispatchToProps = {
    setOrder: shopCartActionCreator.setOrder,
    setOrderInfo: ActionCreator.setOrderInformation,
    setIds: shopCartActionCreator.setIds,
    showAlert: baseActionCreator.showAlert
};

export default connect(mapStateToProps, mapDispatchToProps)(ReDetail);
