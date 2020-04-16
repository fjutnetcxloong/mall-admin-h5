/**订单详情页面 */
import copy from 'copy-to-clipboard';
import {connect} from 'react-redux';
import {dropByCacheKey} from 'react-router-cache-route';
import {baseActionCreator as actionCreator} from '../../../../../../redux/baseAction';
import AppNavBar from '../../../../../common/navbar/NavBar';
import CancelOrder from '../../../../../common/cancel-order/CancleOrder';
import './ListDetails.less';

const {
    appHistory,
    getUrlParam,
    showSuccess,
    native,
    showInfo,
    nativeCssDiff,
    systemApi: {removeValue},
    moneyDot
} = Utils;
const {
    MESSAGE: {Form, Feedback}
} = Constants;
const {urlCfg} = Configs;
let keyNum = 0.001;
class ListDetails extends BaseComponent {
    state = {
        canInfo: {} //数据容器
    };

    componentDidMount() {
        this.getList();
    }

    getList = () => {
        const id = decodeURI(
            getUrlParam('id', encodeURI(this.props.location.search))
        );
        this.fetch(urlCfg.orderDetailInfo, {data: {id}}).subscribe(
            (res) => {
                if (res && res.status === 0) {
                    this.setState({
                        canInfo: res.data
                    });
                }
            }
        );
    };

    //收藏、取消收藏
    collectDoIt = (value, status) => {
        //添加收藏
        if (status === 'add') {
            this.fetch(urlCfg.addCollectShop, {
                data: {shop_id: value.id, shop_name: value.name}
            }).subscribe((res) => {
                if (res && res.status === 0) {
                    showSuccess(Feedback.Collect_Success);
                    this.getList();
                }
            });
        } else {
            //取消收藏
            this.fetch(urlCfg.cancelCollect, {
                data: {ids: [value.id], type: 2}
            }).subscribe((res) => {
                if (res && res.status === 0) {
                    showSuccess(Feedback.Cancel_Success);
                    this.getList();
                }
            });
        }
    };

    //申请售后  单个商品进行售后退款
    serviceRefund = (data, value, ev) => {
        appHistory.push(
            `/applyService?orderId=${data.order_id}&shopId=${
                data.shop_id
            }&returnType=2&prId=${value.pr_id}&arrInfo=${
                value.property_content
            }&onlyReturnMoney=${data.status === '1' ? 1 : ''}`
        );
        ev.stopPropagation();
    };

    //复制
    duplicate = (no) => {
        copy(no);
        showSuccess(Feedback.Copy_Success);
    };

    //进店
    goShopHome = (id, ev) => {
        appHistory.push(`/shopHome?id=${id}`);
        ev.stopPropagation();
    };

    //去往商品
    goToShopping = (id) => {
        appHistory.push(`/goodsDetail?id=${id}`);
    };

    //确认收货
    confirmTake = () => {
        const {
            showConfirm,
            location: {search}
        } = this.props;
        const id = decodeURI(getUrlParam('id', encodeURI(search)));
        showConfirm({
            title: Form.No_Error_Take,
            callbacks: [
                null,
                () => {
                    this.fetch(urlCfg.confirmOrder, {data: {id}}).subscribe(
                        (res) => {
                            if (res && res.status === 0) {
                                appHistory.goBack();
                                dropByCacheKey('OrderPage'); //清除我的订单的缓存
                            }
                        }
                    );
                }
            ]
        });
    };

    //删除订单
    deleteOrder = () => {
        const {
            showConfirm,
            location: {search}
        } = this.props;
        const id = decodeURI(getUrlParam('id', encodeURI(search)));
        showConfirm({
            title: Form.Whether_delete,
            callbacks: [
                null,
                () => {
                    this.fetch(urlCfg.delMallOrder, {
                        data: {id, deal: 1}
                    }).subscribe((res) => {
                        if (res && res.status === 0) {
                            showSuccess(Feedback.Del_Success);
                            dropByCacheKey('OrderPage'); //清除我的订单的缓存
                            appHistory.goBack();
                        }
                    });
                }
            ]
        });
    };

    //拨打商家电话
    shopPhone = (tel) => {
        const {showConfirm} = this.props;
        showConfirm({
            title: `拨打商家电话：${tel}`,
            callbacks: [
                null,
                () => {
                    if (process.env.NATIVE) {
                        native('callTel', {phoneNum: tel});
                    }
                }
            ]
        });
    };

    //立即评价
    promptlyEstimate = () => {
        const id = decodeURI(
            getUrlParam('id', encodeURI(this.props.location.search))
        );
        appHistory.push(`/myEvaluate?id=${id}`);
    };

    //提醒发货
    remindDelivery = (data) => {
        const {canInfo} = this.state;
        this.fetch(urlCfg.remindOrder, {
            data: {id: canInfo.order_id}
        }).subscribe((res) => {
            if (res && res.status === 0) {
                showSuccess(res.message);
            }
        });
    };

    //前往售后页面
    afterSale = (ev, id) => {
        const refurn = decodeURI(
            getUrlParam('refurn', encodeURI(this.props.location.search))
        );
        appHistory.push(`/refundDetails?id=${id}&refurn=${refurn}`);
        ev.stopPropagation();
    };

    //立即支付
    payNow = () => {
        removeValue('orderInfo'); //先清除一下，正常流程下单页面的缓存数据，以免冲突
        removeValue('orderArr'); //先清除一下，正常流程下单页面的缓存数据，以免冲突
        const id = decodeURI(
            getUrlParam('id', encodeURI(this.props.location.search))
        );
        appHistory.push(
            `/payMoney?orderId=${id}&orderNum=${this.state.canInfo.order_no}`
        );
    };

    //底部按钮内容
    bottomButton = (num) => {
        const {canInfo} = this.state;
        const blockMadel = new Map([
            [
                '0',
                <React.Fragment>
                    <div
                        className="cancel-order"
                        onClick={() => this.setState({
                            canStatus: true,
                            canCelId: canInfo.pr_id
                        })
                        }
                    >
                        取消订单
                    </div>
                    <div
                        className="immediate-evaluation new-style-paynow"
                        style={{
                            border: nativeCssDiff()
                                ? '1PX solid #ff2d51'
                                : '0.02rem solid #ff2d51'
                        }}
                        onClick={this.payNow}
                    >
                    立即付款
                    </div>
                </React.Fragment>
            ],
            [
                '1',
                canInfo.app_type === '3' ? (
                    ''
                ) : (
                    <div
                        className="immediate-evaluation deliver"
                        style={{
                            border: nativeCssDiff()
                                ? '1PX solid #ff2d51'
                                : '0.02rem solid #ff2d51'
                        }}
                        onClick={this.remindDelivery}
                    >
                        提醒发货
                    </div>
                )
            ],
            [
                '2',
                canInfo.app_type === '3' ? (
                    ''
                ) : (
                    <div
                        className="immediate-evaluation"
                        style={{
                            border: nativeCssDiff()
                                ? '1PX solid #ff2d51'
                                : '0.02rem solid #ff2d51'
                        }}
                        onClick={this.confirmTake}
                    >
                        确认收货
                    </div>
                )
            ],
            [
                '3',
                <React.Fragment>
                    <div
                        className="cancel-order"
                        style={{
                            border: nativeCssDiff()
                                ? '1PX solid #666'
                                : '0.02rem solid #666'
                        }}
                        onClick={this.deleteOrder}
                    >
                        删除订单
                    </div>
                    <div
                        className="immediate-evaluation"
                        style={{
                            border: nativeCssDiff()
                                ? '1PX solid #ff2d51'
                                : '0.02rem solid #ff2d51'
                        }}
                        onClick={this.promptlyEstimate}
                    >
                    立即评价
                    </div>
                </React.Fragment>
            ],
            [
                '4',
                <div
                    className="cancel-order"
                    style={{
                        border: nativeCssDiff()
                            ? '1PX solid #666'
                            : '0.02rem solid #666'
                    }}
                    onClick={this.deleteOrder}
                >
                    删除订单
                </div>
            ],
            [
                '6',
                <div
                    className="cancel-order"
                    style={{
                        border: nativeCssDiff()
                            ? '1PX solid #666'
                            : '0.02rem solid #666'
                    }}
                    onClick={this.deleteOrder}
                >
                    删除订单
                </div>
            ],
            [
                '10',
                <div
                    className="cancel-order"
                    style={{
                        border: nativeCssDiff()
                            ? '1PX solid #666'
                            : '0.02rem solid #666'
                    }}
                    onClick={this.deleteOrder}
                >
                    删除订单
                </div>
            ]
        ]);
        return blockMadel.get(num);
    };

    //确认取消订单
    canStateChange = (state, value) => {
        const id = decodeURI(
            getUrlParam('id', encodeURI(this.props.location.search))
        );
        if (state === 'mastSure' && value) {
            this.fetch(urlCfg.delMallOrder, {
                data: {
                    deal: 0,
                    id,
                    reason: value.label,
                    reason_id: value.value
                }
            }).subscribe((res) => {
                if (res && res.status === 0) {
                    showSuccess(Feedback.Cancel_Success);
                    dropByCacheKey('OrderPage'); //清除我的订单的缓存
                    appHistory.goBack();
                }
            });
        }
        this.setState({canStatus: false});
    };

    //查看物流信息
    goToLocaice = () => {
        const id = decodeURI(
            getUrlParam('id', encodeURI(this.props.location.search))
        );
        native('goLogistics', {orderId: id});
        // appHistory.push(`/logistics?lgId=${id}`);
    };

    goBackModal = () => {
        if (appHistory.length() === 0) {
            appHistory.replace('/myOrder/fh');
        } else {
            appHistory.goBack();
        }
    };

    //联系商家
    goToShoper = () => {
        const {canInfo} = this.state;
        if (process.env.NATIVE) {
            native('goToShoper', {
                shopNo: canInfo.shop_no,
                id: canInfo.order_id,
                type: '2',
                shopNickName: canInfo.nickname,
                imType: '2',
                groud: '0'
            }); //groud 为0 单聊，1群聊 imType 1商品2订单3空白  type 1商品 2订单
        } else {
            showInfo('联系商家');
        }
    };

    //京东商品申请售后
    JDService = () => {
        const id = decodeURI(
            getUrlParam('id', encodeURI(this.props.location.search))
        );
        appHistory.push(
            `/applyService?orderId=${id}&shopId=${this.state.canInfo.shop_id}&returnType=1&onlyReturnMoney=`
        );
    };

    //京东商品申请售后中
    JDServiceIng = () => {
        const {canInfo} = this.state;
        appHistory.push(`/refundDetails?id=${canInfo.return_id}`);
    };

    render() {
        const {canInfo, canStatus} = this.state;
        return (
            <div
                data-component="List-details"
                data-role="page"
                className="List-details"
                style={{paddingBottom: this.bottomButton(canInfo.status) ? '1rem' : '0'}}
            >
                <AppNavBar
                    goBackModal={this.goBackModal}
                    rightShow
                    title="订单详情"
                    redBackground
                    backgroundColor="#F20C00"
                />
                {canInfo.status ? (
                    <div>
                        <div className="wait-box">
                            <div className="wait-top">
                                {canInfo.status_title}
                            </div>
                            <div className="wait-center">
                                {canInfo.status_msg}
                            </div>
                            {/* <div className="wait-bottom" onClick={() => appHistory.push(`/goodsDetail/?id=${canInfo.pr_id}`)}>再下一单</div> */}
                        </div>
                        {canInfo.logistics && (
                            <div className="message" onClick={this.goToLocaice}>
                                <div className="message-left icon"/>
                                <div className="message-center">
                                    <div className="logistics">
                                        {canInfo.logistics.msg}
                                    </div>
                                    <div className="datetime">
                                        <div className="datetime-left">
                                            {canInfo.logistics.time}
                                        </div>
                                    </div>
                                </div>
                                <div className="message-right icon"/>
                            </div>
                        )}
                        <div className="address">
                            <div className="address-top">
                                <div className="name">{canInfo.linkname}</div>
                                <div className="number">{canInfo.linktel}</div>
                            </div>
                            <div className="address-bottom">
                                {canInfo.area} {canInfo.address}
                            </div>
                        </div>
                        <div>
                            <div className="shop-lists">
                                <div className="common-margin">
                                    <div className="shop-name">
                                        <div
                                            className="shop-title"
                                            onClick={(ev) => this.goShopHome(
                                                canInfo.shop_id,
                                                ev
                                            )
                                            }
                                        >
                                            <img
                                                src={canInfo.shoper_pic}
                                                onError={(e) => {
                                                    e.target.src = canInfo.df_logo;
                                                }}
                                                alt=""
                                            />
                                            <p>{canInfo.shopName}</p>
                                            {canInfo.app_type === '3' && (
                                                <span className="enter icon"/>
                                            )}
                                        </div>
                                        {canInfo.app_type !== '3' && (
                                            <span>
                                                <div
                                                    className="right"
                                                    style={{
                                                        border: nativeCssDiff()
                                                            ? '1PX solid #ff2d51'
                                                            : '0.02rem solid #ff2d51'
                                                    }}
                                                    onClick={(ev) => this.goShopHome(
                                                        canInfo.shop_id,
                                                        ev
                                                    )
                                                    }
                                                >
                                                    进店
                                                </div>
                                            </span>
                                        )}
                                    </div>
                                    {canInfo.pr_list
                                        && canInfo.pr_list.map((item, index) => (
                                            <div
                                                key={item.id}
                                                className="goods"
                                                onClick={() => this.goToShopping(
                                                    item.pr_id
                                                )
                                                }
                                            >
                                                <div className="goods-left">
                                                    <div>
                                                        <img
                                                            src={
                                                                item.pr_picpath
                                                            }
                                                            alt=""
                                                        />
                                                    </div>
                                                </div>
                                                <div className="goods-right">
                                                    <div className="goods-desc">
                                                        <div className="desc-title">
                                                            {item.pr_title}
                                                        </div>
                                                        <div className="desc_price">
                                                            ￥
                                                            {moneyDot(
                                                                item.price
                                                            )[0] + '.'}
                                                            <span className="small_money">
                                                                {
                                                                    moneyDot(
                                                                        item.price
                                                                    )[1]
                                                                }
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <div className="goods-sku">
                                                        <div className="sku-left">
                                                            {item.values_name.map(
                                                                (value) => (
                                                                    <div key={keyNum++} className="goods-size">
                                                                        {value}
                                                                    </div>
                                                                )
                                                            )}
                                                        </div>
                                                        <div className="local">
                                                            x{item.num}
                                                        </div>
                                                    </div>
                                                    <div className="accounting">
                                                        <div className="btn-keep">
                                                            C米：{item.deposit}
                                                        </div>
                                                    </div>
                                                    {/* {   //订单为待评价的时候
                                                            (canInfo.status === '3' || canInfo.status === '4') && <div className="after-service" onClick={(ev) => this.goToIm(ev)}>申请售后</div>
                                                        }
                                                        {   //退款中，按钮
                                                            item.button_name && <div className="after-service" onClick={(ev) => this.afterSale(ev, item.return_id)}>{item.button_name}</div>
                                                        }
                                                        {   //订单为待发货或待收货时
                                                            !item.return_name && (canInfo.status === '1' || canInfo.status === '2') && <div className="after-service" onClick={(ev) => this.serviceRefund(canInfo, item, ev)}>申请退款</div>
                                                        } 暂时屏蔽*/}
                                                </div>
                                            </div>
                                        ))}
                                </div>
                            </div>
                            <div className="total-price">
                                <div className="common-margin">
                                    <div className="total">
                                        <span>优惠券</span>
                                        <span className="card-value">
                                            -￥{canInfo.card_dic}
                                        </span>
                                    </div>
                                    <div className="total total-center">
                                        <span>C米</span>
                                        <span>{canInfo.all_deposit}</span>
                                    </div>
                                    <div className="total total-center">
                                        <div>商品总价</div>
                                        <div>￥{canInfo.all_price}</div>
                                    </div>
                                    <div className="total">
                                        <div>运费</div>
                                        <div>{canInfo.express_money}</div>
                                    </div>
                                </div>
                            </div>
                            <div className="payable">
                                <span>实付款</span>
                                <span>
                                    ￥{moneyDot(canInfo.countprice)[0] + '.'}
                                    <span className="small_money">
                                        {moneyDot(canInfo.countprice)[1]}
                                    </span>
                                </span>
                            </div>
                            <div className="order common-margin">
                                <div className="number">
                                    <span className="number-left">
                                        订单编号：
                                    </span>
                                    <span className="number-center">
                                        {canInfo.order_no}
                                    </span>
                                    <span
                                        className="number-right"
                                        onClick={() => this.duplicate(canInfo.order_no)
                                        }
                                    >
                                        复制
                                    </span>
                                </div>
                                <div className="order-time">
                                    <span className="order-time-left">
                                        下单时间：
                                    </span>
                                    <span className="order-time-center">
                                        {canInfo.crtdate}
                                    </span>
                                </div>
                                <div className="payment-time">
                                    <span className="payment-time-left">
                                        支付时间：
                                    </span>
                                    <span className="payment-time-center">
                                        {canInfo.pay_date
                                        && canInfo.pay_date === '0'
                                            ? ''
                                            : canInfo.pay_date || ''}
                                    </span>
                                </div>
                                <div className="order-remarks">
                                    <span className="order-remarks-left">
                                        订单备注：
                                    </span>
                                    <span>{canInfo.remarks}</span>
                                </div>
                            </div>
                        </div>

                        <div className="business-box">
                            <div className="business">
                                <div
                                    className="business-left icon"
                                    onClick={this.goToShoper}
                                >
                                    <span>联系商家</span>
                                </div>
                                {window.isWX ? (
                                    <div className="business-right icon">
                                        <a href={`tel:${canInfo.shop_tel}`}>
                                            商家电话
                                        </a>
                                    </div>
                                ) : (
                                    <span
                                        className="business-right icon"
                                        style={{
                                            borderRight: nativeCssDiff()
                                                ? '1PX solid #eee'
                                                : '0.02rem solid #eee'
                                        }}
                                        onClick={() => this.shopPhone(canInfo.shop_tel)
                                        }
                                    >
                                        商家电话
                                    </span>
                                )}
                            </div>
                        </div>
                        {canInfo.app_type !== '3' && (
                            <div className="collection common-margin">
                                <div className="collection-left">
                                    <img
                                        src={canInfo.shoper_pic}
                                        alt=""
                                        onError={(e) => {
                                            e.target.src = canInfo.df_logo;
                                        }}
                                    />
                                </div>
                                <div className="collection-center">
                                    {canInfo.shopName}
                                </div>
                                {canInfo.shop_collect === '0' ? (
                                    <div
                                        onClick={() => this.collectDoIt(
                                            {
                                                id: canInfo.shop_id,
                                                name: canInfo.shopName
                                            },
                                            'add'
                                        )
                                        }
                                        style={{
                                            border: nativeCssDiff()
                                                ? '1PX solid #ff2d51'
                                                : '0.02rem solid #ff2d51'
                                        }}
                                        className="collection-right"
                                    >
                                        +收藏
                                    </div>
                                ) : (
                                    <div
                                        onClick={() => this.collectDoIt({
                                            id: canInfo.shop_collect,
                                            name: canInfo.shopName
                                        })
                                        }
                                        className="removeCollect"
                                        style={{
                                            border: nativeCssDiff()
                                                ? '1PX solid #ccc'
                                                : '0.02rem solid #ccc'
                                        }}
                                    >
                                        已收藏
                                    </div>
                                )}
                            </div>
                        )}
                        <div className="recommend-box">
                            {/* <div className="recommend common-margin">热门推荐</div>
                                <div className="hot-push-goods">
                                    {
                                        (canInfo.recommend && canInfo.recommend.length > 0) ? canInfo.recommend.map(item => (
                                            <div className="shop-lists">
                                                <div className="common-margin">
                                                    <div className="goods" onClick={() => this.goToShopping(item.pr_id)}>
                                                        <div className="goods-left">
                                                            <div>
                                                                <img src={item.picpath}/>
                                                            </div>
                                                        </div>
                                                        <div className="goods-right">
                                                            <div className="goods-desc">
                                                                <div className="desc-title">{item.title}</div>
                                                            </div>
                                                            <div className="goods-sku">
                                                                <div className="sku-left">
                                                                    {
                                                                        item.property ? item.property.values_name.split(',').map(value => <div className="goods-size">{value}</div>) : ''
                                                                    }
                                                                </div>
                                                            </div>
                                                            <div className="accounting">
                                                                <div className="btn-keep accounting-left">C米：{item.property.deposit}</div>
                                                                <div className="accounting-right">{item.area}</div>
                                                            </div>
                                                            <div className="drawee">
                                                                <div className="drawee-left">{item.order_num}付款</div>
                                                                <div className="drawee-right">￥{item.property.original_price}</div>
                                                            </div>
                                                            <div className="name-price">
                                                                <div className="name-price-left" onClick={(ev) => this.goShopHome(item.shop_id, ev)}>{item.shopName}</div>
                                                                <div className="icon name-price-center" onClick={(ev) => this.goShopHome(item.shop_id, ev)}>进店</div>
                                                                <div className="name-price-right">￥{item.property.price}</div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )) : ''
                                    }
                                </div> */}
                            {canStatus && (
                                <CancelOrder
                                    canStateChange={this.canStateChange}
                                />
                            )}
                        </div>
                        {
                            this.bottomButton(canInfo.status)
                                ? (
                                    <div className="cancel-order-box">
                                        {
                                            //京东商品可以申请售后   is_reservice 为0 不支持售后 为1 支持售后
                                            // canInfo.app_type === '3' && canInfo.is_reservice === 1 && canInfo.status && canInfo.return_status === 1 && <div className="server-order" style={{border: nativeCssDiff() ? '1PX solid rgba(102,102,102,1)' : '0.02rem solid rgba(102,102,102,1)'}} onClick={this.JDService}>申请售后</div>暂时屏蔽  余丽
                                        }
                                        {
                                            //京东商品已申请售后可以查看
                                            // canInfo.app_type === '3' && canInfo.is_reservice === 1 && canInfo.return_status && canInfo.return_status === 2 && <div className="server-order" style={{border: nativeCssDiff() ? '1PX solid rgba(102,102,102,1)' : '0.02rem solid rgba(102,102,102,1)'}} onClick={this.JDServiceIng}>售后中</div>暂时屏蔽  余丽
                                        }
                                        {this.bottomButton(canInfo.status)}
                                    </div>
                                ) : ''
                        }
                    </div>
                ) : (
                    ''
                )}
            </div>
        );
    }
}

const mapDidpatchToProps = {
    showConfirm: actionCreator.showConfirm
};
export default connect(null, mapDidpatchToProps)(ListDetails);
