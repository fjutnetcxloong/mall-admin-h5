/**我的订单页面 */

import {connect} from 'react-redux';
import {Tabs, PullToRefresh, ListView} from 'antd-mobile';
import {baseActionCreator as actionCreator} from '../../../../../redux/baseAction';
import AppNavBar from '../../../../common/navbar/NavBar';
import Nothing from '../../../../common/nothing/Nothing';
import LazyLoadIndex from '../../../../common/lazy-load/LazyLoad';
import CancelOrder from '../../../../common/cancel-order/CancleOrder';
import Animation from '../../../../common/animation/Animation';
import {ListFooter} from '../../../../common/list-footer';
import './myOrder.less';

const {
    appHistory,
    showSuccess,
    getUrlParam,
    showInfo,
    moneyDot,
    native,
    systemApi: {removeValue},
    TD,
    nativeCssDiff
} = Utils;
const {TD_EVENT_ID} = Constants;
const {
    MESSAGE: {Form, Feedback},
    FIELD,
    navColorR
} = Constants;
const {urlCfg} = Configs;

const temp = {
    stackData: [],
    pagesize: 5
};

const tabs = [
    {title: '全部'},
    {title: '待付款'},
    {title: '待发货'},
    {title: '待收货'},
    {title: '待评价'},
    {title: '售后'}
];

class MyOrder extends BaseComponent {
    constructor(props) {
        super(props);
        this.state = {
            dataSource: new ListView.DataSource({
                rowHasChanged: (row1, row2) => row1 !== row2
            }), //长列表容器
            refreshing: false, //是否显示刷新状态
            height:
                document.documentElement.clientHeight
                - (window.isWX ? window.rem * 1.08 : window.rem * 1.78),
            status: -1, //tab状态
            delOrder: null, //删除订单id
            remind: null, //提醒状态
            page: 1, //当前页数
            pagesize: 10, //每页条数
            pageCount: -1,
            hasMore: true, //底部请求状态文字显示情况
            propsData: props
        };
        removeValue('orderInfo'); //清除下单流程留下来的订单信息
        removeValue('orderArr');
    }

    componentDidMount() {
        const num = this.statusChoose(this.props.location.pathname.split('/')[2]) || -1;
        this.init(num);
    }

    static getDerivedStateFromProps(prevProps, prevState) {
        return {
            propsData: prevProps
        };
    }

    componentDidUpdate(prev, data) {
        const numPrev = this.statusChoose(
            this.state.propsData.location.pathname.split('/')[2]
        ) || -1;
        const numPrev2 = this.statusChoose(data.propsData.location.pathname.split('/')[2])
            || -1;
        if (numPrev !== numPrev2) {
            const dataSource2 = new ListView.DataSource({
                rowHasChanged: (row1, row2) => row1 !== row2
            });
            // eslint-disable-next-line react/no-did-update-set-state
            this.setState(
                {
                    page: 1,
                    // status,
                    pageCount: -1,
                    dataSource: dataSource2,
                    hasMore: true,
                    status: numPrev
                },
                () => {
                    temp.stackData = [];
                    this.init(numPrev);
                    removeValue('orderInfo'); //清除下单流程留下来的订单信息
                    removeValue('orderArr');
                }
            );
        }
    }

    init = num => {
        this.setState(
            {
                status: num
            },
            () => {
                this.getInfo();
            }
        );
    };

    //请求数据
    getInfo = () => {
        const {status} = this.state;
        if (status === '4') {
            //退款申请成功后，返回售后列表
            this.refundMllOder();
        } else {
            this.getMallOrder();
        }
    };

    //进入订单页面，判断为什么状态
    statusChoose = str => {
        const arr = new Map([
            ['qb', '-1'],
            ['fk', '0'],
            ['fh', '1'],
            ['fhp', '1'],
            ['sh', '2'],
            ['pj', '3'],
            ['ssh', '4']
        ]);
        return arr.get(str);
    };

    //获取订单列表
    getMallOrder(noLoading = false) {
        const {status, page, pageCount} = this.state;
        this.fetch(
            urlCfg.mallOrder,
            {data: {status, page, pagesize: temp.pagesize, pageCount}},
            noLoading
        ).subscribe(res => {
            if (res && res.status === 0) {
                if (page === 1) {
                    temp.stackData = res.list;
                } else {
                    const arr = res.list.filter(val => {
                        let result = true;
                        temp.stackData.forEach(v => {
                            if (v.id === val.id) {
                                result = false;
                            }
                        });
                        return result;
                    });
                    temp.stackData = temp.stackData.concat(arr);
                    //数组去重，这里的主要目的是为了，当点击立即领取之后，会出现一个位置的空缺，数据库会将这条数据移除
                    //后面的数据会补上来，这时，请求当页的数据，会将补上来的那条数据请求过来，不过也会因此多请求重复的数据
                    //所以去重就可以达到将新数据请求过来的目的
                    /*const obj = {};
                    let result = [];
                    result = temp.stackData.reduce((item, next) => {
                        if (!obj[next.id]) {
                            item.push(next);
                            obj[next.id] = true;
                        }
                        return item;
                    }, []);
                    temp.stackData = result;*/
                }
                if (page >= res.pageCount) {
                    this.setState({
                        hasMore: false
                    });
                }
                const otherData =  new ListView.DataSource({
                    rowHasChanged: (row1, row2) => row1 !== row2
                });
                this.setState(prevState => ({
                    dataSource: otherData.cloneWithRows(
                        [...temp.stackData]
                    ),
                    pageCount: res.pageCount,
                    refreshing: false
                }));
            } else {
                this.setState({
                    hasMore: false,
                    refreshing: false
                });
            }
        });
    }

    //售后接口请求
    refundMllOder = (noLoading = false) => {
        const {pageCount, page} = this.state;
        this.fetch(
            urlCfg.refundMllOder,
            {data: {page, pageCount, pagesize: temp.pagesize}},
            noLoading
        ).subscribe(res => {
            if (res && res.status === 0) {
                if (page === 1) {
                    temp.stackData = res.list;
                } else {
                    temp.stackData = temp.stackData.concat(res.list);
                }
                if (page >= res.pageCount) {
                    this.setState({
                        hasMore: false
                    });
                }
                this.setState(prevState => ({
                    dataSource: prevState.dataSource.cloneWithRows(
                        temp.stackData
                    ),
                    pageCount: res.pageCount,
                    refreshing: false
                }));
            } else {
                this.setState({
                    hasMore: false,
                    refreshing: false
                });
            }
        });
    };

    //跳转我的订单
    gotoMyOrder = index => {
        const url = new Map([
            [0, '/myOrder/qb?color=#ff2d51'],
            [1, '/myOrder/fk?color=#ff2d51'],
            [2, '/myOrder/fh?color=#ff2d51'],
            [3, '/myOrder/sh?color=#ff2d51'],
            [4, '/myOrder/pj?color=#ff2d51'],
            [5, '/myOrder/ssh?color=#ff2d51']
        ]);
        appHistory.replace(url.get(index));
    };

    //tab状态变更
    tabChange = (data, index) => {
        const dataSource2 = new ListView.DataSource({
            rowHasChanged: (row1, row2) => row1 !== row2
        });
        this.setState(
            {
                page: 1,
                status: index - 1,
                pageCount: -1,
                dataSource: dataSource2,
                hasMore: true
            },
            () => {
                temp.stackData = [];
                this.gotoMyOrder(index);
            }
        );
    };

    //进店
    goShopHome = id => {
        appHistory.push(`/shopHome?id=${id}`);
    };

    //状态判断
    tabTopName = num => {
        // "0待付款;1待发货;2待收货;3待评价"
        const nameAll = new Map([
            ['0', '等待付款'],
            ['1', '等待发货'],
            ['2', '卖家已发货'],
            ['3', '交易完成'],
            ['4', '交易完成'],
            ['5', '退款中'],
            ['10', '已取消'],
            ['11', '已删除'],
            ['12', '申请退款成功关闭订单'],
            ['13', '商家关闭订单'],
            ['14', '商家删除订单']
        ]);
        return nameAll.get(num);
    };

    //删除订单
    deleteOrder = id => {
        const {showConfirm} = this.props;
        showConfirm({
            title: Form.Whether_delete,
            callbacks: [
                null,
                () => {
                    this.fetch(urlCfg.delMallOrder, {
                        data: {deal: 1, id}
                    }).subscribe(res => {
                        if (res && res.status === 0) {
                            //操作数据，将已经选中取消的id进行去除
                            temp.stackData = temp.stackData.filter(item => item.id !== id);
                            this.getMallOrder();
                        }
                    });
                }
            ]
        });
    };

    //确认收货
    confirmTake = (id, ev, refund) => {
        const {showConfirm} = this.props;
        showConfirm({
            title:
                refund === 1 || refund === 2
                    ? Form.No_Error_Has_Return
                    : Form.No_Error_Take,
            callbacks: [
                null,
                () => {
                    this.fetch(urlCfg.confirmOrder, {data: {id}}).subscribe(
                        res => {
                            if (res && res.status === 0) {
                                const dataSource = new ListView.DataSource({
                                    rowHasChanged: (row1, row2) => row1 !== row2
                                });
                                temp.stackData = [];
                                this.setState(
                                    {
                                        page: 1,
                                        dataSource
                                    },
                                    () => {
                                        this.getMallOrder();
                                    }
                                );
                            }
                        }
                    );
                }
            ]
        });
        ev.stopPropagation();
    };

    //取消订单状态改变  确认取消
    canStateChange = (data, value) => {
        const {canCelId} = this.state;
        TD.log(TD_EVENT_ID.MY.ID, TD_EVENT_ID.MY.LABEL.CANCEL_ORDER);
        if (data === 'mastSure' && value) {
            this.fetch(urlCfg.delMallOrder, {
                data: {
                    deal: 0,
                    id: canCelId,
                    reason: value.label,
                    reason_id: value.value
                }
            }).subscribe(res => {
                if (res && res.status === 0) {
                    showSuccess(Feedback.Cancel_Success);
                    temp.stackData = temp.stackData.filter(item => item.id !== canCelId);
                    this.getMallOrder();
                }
            });
        }
        this.setState({
            canStatus: false
        });
    };

    //点击订单的时候的跳转
    goToOrderDetail = (id, state, returnId, returnType, ev) => {
        //return_status也就是这里的status大于0就是申请售后的订单了
        if (state > 0) {
            this.refundDetails(returnId, ev);
        } else {
            this.skipDetail(id, returnType, ev);
        }
        ev.stopPropagation();
    };

    //跳转到订单详情页
    skipDetail = (id, returnType, ev) => {
        appHistory.push(
            `/listDetails?id=${id}&refurn=${returnType ? '1' : ''}`
        );
        ev.stopPropagation();
    };

    //立即支付
    payNow = (id, orderNum) => {
        removeValue('orderInfo'); //先清除一下，正常流程下单页面的缓存数据，以免冲突
        removeValue('orderArr'); //先清除一下，正常流程下单页面的缓存数据，以免冲突
        appHistory.push(
            `/payMoney?orderId=${id}&orderNum=${orderNum}&source=${4}`
        );
    };

    //申请售后/退款
    serviceRefund = (id, shopId, ev, yes) => {
        appHistory.push(
            `/applyService?orderId=${id}&shopId=${shopId}&returnType=1&onlyReturnMoney=${yes}`
        );
        ev.stopPropagation();
    };

    //延长收货
    extendedReceipt = (id, ev) => {
        const {showConfirm} = this.props;
        showConfirm({
            title: Form.Whether_Lengthen,
            callbacks: [
                null,
                () => {
                    this.fetch(urlCfg.delayedReceipt, {
                        data: {order_id: id}
                    }).subscribe(res => {
                        if (res && res.status === 0) {
                            showSuccess(Feedback.receipt_Success);
                            temp.stackData.forEach(item => {
                                if (item.id === id) {
                                    item.delayed_receiving = '1';
                                }
                                item.showButton = false;
                            });
                            this.setState(prevState => ({
                                dataSource: prevState.dataSource.cloneWithRows(
                                    temp.stackData
                                )
                            }));
                        }
                    });
                }
            ]
        });
        ev.stopPropagation();
    };

    //查看物流
    goApplyService = (id, ev) => {
        if (process.env.NATIVE) {
            native('goLogistics', {orderId: id});
        } else {
            appHistory.push(`/logistics?lgId=${id}`);
        }
        ev.stopPropagation();
    };

    //立即评价
    promptlyEstimate = (id, ev) => {
        appHistory.push(`/myEvaluate?id=${id}`);
        ev.stopPropagation();
    };

    //提醒发货
    remindDelivery = data => {
        if (data[1] === 1) {
            this.fetch(urlCfg.remindOrder, {data: {id: data[0]}}).subscribe(
                res => {
                    if (res && res.status === 0) {
                        showInfo(res.message);
                    }
                }
            );
        } else {
            showInfo(Feedback.Waiting);
        }
    };

    //跳转到退款详情页
    refundDetails = (id, ev) => {
        appHistory.push(`/refundDetails?id=${id}`);
        ev.stopPropagation();
    };

    //控制显示与否申请退款按钮
    showRetunButton = (item, ev) => {
        temp.stackData.forEach(value => {
            if (item.id === value.id) {
                value.showButton = !value.showButton;
            } else {
                value.showButton = false;
            }
        });

        this.setState(prevState => ({
            dataSource: prevState.dataSource.cloneWithRows(temp.stackData)
        }));
        ev.stopPropagation();
    };

    //点击其他位置，将弹出的 申请退款 按钮隐藏
    closeButton = () => {
        temp.stackData.forEach(value => {
            value.showButton = false;
        });
        this.setState(prevState => ({
            dataSource: prevState.dataSource.cloneWithRows(temp.stackData)
        }));
    };

    //发表追评
    publishReview = (id, ev) => {
        appHistory.push(`/publishReview?id=${id}`);
        ev.stopPropagation();
    };

    //点击撤销申请
    revoke = (id, ev) => {
        const {showConfirm} = this.props;
        showConfirm({
            title: Form.Whether_Revocation_Apply,
            btnTexts: ['我再想想', '确认撤销'],
            callbacks: [
                null,
                () => {
                    this.fetch(urlCfg.revokeOrder, {data: {id}}).subscribe(
                        res => {
                            if (res && res.status === 0) {
                                showInfo(Feedback.Rovke_Success);
                                this.setState(
                                    {
                                        showModal: false,
                                        modalTitle: '',
                                        status: 2,
                                        page: 1
                                    },
                                    () => {
                                        if (
                                            this.statusChoose(
                                                this.props.location.pathname.split('/')[2]
                                            ) === '2'
                                        ) {
                                            //这里是为了判断撤销完后回退的还是收货页面时不请求，手动请求
                                            this.getMallOrder();
                                            return;
                                        }
                                    }
                                );
                                //确定撤销后，跳转到待收货那列
                                this.gotoMyOrder(3);
                            }
                        }
                    );
                }
            ]
        });
        ev.stopPropagation();
    };

    //样式兼容统一封装
    styleCompatible = () => (nativeCssDiff() ? '1PX solid #666' : '0.02rem solid #666');

    //底部按钮
    bottomModal = item => {
        let blockModal = <div/>;
        switch (item.status) {
        case '0': //待付款
            blockModal = (
                <div className="buttons">
                    <div
                        onClick={() => this.setState({
                            canStatus: true,
                            canCelId: item.id
                        })
                        }
                        className="look-button"
                        style={{border: this.styleCompatible()}}
                    >
                            取消订单
                    </div>
                    <div
                        onClick={() => this.payNow(item.id, item.order_no)}
                        className="evaluate-button"
                        style={{
                            border: nativeCssDiff()
                                ? '1PX solid #ff2d51'
                                : '0.02rem solid #ff2d51'
                        }}
                    >
                            立即付款
                    </div>
                </div>
            );
            break;
        case '1': //待发货
            blockModal = (
                <div className="buttons">
                    {//余丽  暂时屏蔽  is_reservice 为0 不支持售后 为1 支持售后
                        item.showButton && item.refund_button === 1 && (
                            <div
                                className="button-more icon"
                                onClick={ev => this.showRetunButton(item, ev)}
                            >
                                <span
                                    onClick={ev => this.serviceRefund(
                                        item.id,
                                        item.shop_id,
                                        ev,
                                        1
                                    )
                                    }
                                >
                                    申请退款
                                </span>
                            </div>
                        )}
                    {//is_reservice 为0 不支持售后 为1 支持售后   京东商品
                        item.showButton
                            && item.is_reservice === 1
                            && item.app_type === '3' && (
                            <div
                                className="button-more icon"
                                onClick={ev => this.showRetunButton(item, ev)
                                }
                            >
                                <span
                                    onClick={ev => this.serviceRefund(
                                        item.id,
                                        item.shop_id,
                                        ev
                                    )
                                    }
                                >
                                        申请售后
                                </span>
                            </div>
                        )}
                    {!item.all_refund && (
                        <div
                            className="evaluate-button"
                            style={{
                                border: nativeCssDiff()
                                    ? '1PX solid #ff2d51'
                                    : '0.02rem solid #ff2d51'
                            }}
                            onClick={() => this.remindDelivery([item.id, item.can_tip])
                            }
                        >
                                提醒发货
                        </div>
                    )}
                </div>
            );
            break;
        case '2': //待收货
            blockModal = (
                <div className="buttons">
                    {item.showButton && item.refund_button === 1 && (
                        <div
                            className="button-more icon"
                            onClick={ev => this.showRetunButton(item, ev)}
                        >
                            <span
                                onClick={ev => this.serviceRefund(
                                    item.id,
                                    item.shop_id,
                                    ev
                                )
                                }
                            >
                                    申请退款
                            </span>
                        </div>
                    )}
                    {//is_reservice 为0 不支持售后 为1 支持售后  京东商品
                        item.showButton
                            && item.is_reservice === 1
                            && item.app_type === '3' && (
                            <div
                                className="button-more icon"
                                onClick={ev => this.showRetunButton(item, ev)
                                }
                            >
                                <span
                                    onClick={ev => this.serviceRefund(
                                        item.id,
                                        item.shop_id,
                                        ev
                                    )
                                    }
                                >
                                        申请售后
                                </span>
                            </div>
                        )}
                    <div
                        className="look-button"
                        onClick={ev => this.extendedReceipt(item.id, ev)}
                        style={{border: this.styleCompatible()}}
                    >
                            延长收货
                    </div>
                    <div
                        className="look-button"
                        onClick={ev => this.goApplyService(item.id, ev)}
                        style={{border: this.styleCompatible()}}
                    >
                            查看物流
                    </div>
                    {item.app_type !== '3'
                            && (item.all_refund === 1 ? (
                                <div
                                    className="evaluate-button"
                                    onClick={ev => this.revoke(
                                        item.pr_list[0].return_id,
                                        ev
                                    )
                                    }
                                >
                                    撤销申请
                                </div>
                            ) : (
                                <div
                                    className="evaluate-button"
                                    onClick={ev => this.confirmTake(item.id, ev)
                                    }
                                    style={{
                                        border: nativeCssDiff()
                                            ? '1PX solid #ff2d51'
                                            : '0.02rem solid #ff2d51'
                                    }}
                                >
                                    确认收货
                                </div>
                            ))}
                </div>
            );
            break;
        case '3': //待评价
            blockModal = (
                <div className="buttons">
                    <div
                        className="look-button"
                        onClick={ev => this.goApplyService(item.id, ev)}
                        style={{border: this.styleCompatible()}}
                    >
                            查看物流
                    </div>
                    <div
                        className="delete-button"
                        onClick={() => this.deleteOrder(item.id)}
                        style={{border: this.styleCompatible()}}
                    >
                            删除
                    </div>
                    {item.have_add && (
                        <div
                            className="delete-button"
                            onClick={() => this.publishReview(item.id)}
                            style={{border: this.styleCompatible()}}
                        >
                                追加评论
                        </div>
                    )}
                    <div
                        className="evaluate-button"
                        onClick={ev => this.promptlyEstimate(item.id, ev)}
                        style={{
                            border: nativeCssDiff()
                                ? '1PX solid #ff2d51'
                                : '0.02rem solid #ff2d51'
                        }}
                    >
                            立即评价
                    </div>
                </div>
            );
            break;
            // case '12'://售后
        case '4':
        case '10': //已取消
        case '13': //商家取消
            blockModal = (
                <div className="buttons">
                    <div
                        className="delete-button"
                        onClick={() => this.deleteOrder(item.id)}
                        style={{border: this.styleCompatible()}}
                    >
                            删除
                    </div>
                </div>
            );
            break;
        default:
            blockModal = <div/>;
        }
        return blockModal;
    };

    //修改申请
    application = (ev, id) => {
        appHistory.push(`/applyDrawback?id=${id}&type=0&refurn=1`); //refurn 退款状态下，修改时仅可以选择 仅退款
        ev.stopPropagation();
    };

    //点击多选
    checkAllStatus = (data, ev) => {
        const checkArr = []; //选中的订单集合
        temp.stackData.forEach(item => {
            if (data.id === item.id) {
                item.select = !item.select;
            }
            if (item.select) {
                checkArr.push(item);
            }
        });
        this.setState(prevState => ({
            dataSource: prevState.dataSource.cloneWithRows(temp.stackData),
            checkArr
        }));

        ev.stopPropagation();
    };

    //搜索点击
    goToSearch = () => {
        appHistory.push('/shop-search');
    };

    //下拉刷新
    onRefresh = () => {
        const {status} = this.state;
        this.setState(
            {
                page: 1,
                refreshing: true,
                pageCount: -1
            },
            () => {
                if (status === '4') {
                    this.refundMllOder(true);
                } else {
                    this.getMallOrder(true);
                }
            }
        );
    };

    //上拉加载
    onEndReached = () => {
        const {page, pageCount, status, hasMore} = this.state;
        if (!hasMore) return;
        if (pageCount > page) {
            this.setState(
                pervState => ({
                    page: pervState.page + 1,
                    hasMore: true
                }),
                () => {
                    if (status === '4') {
                        this.refundMllOder();
                    } else {
                        this.getMallOrder();
                    }
                }
            );
        } else {
            this.setState({
                hasMore: false
            });
        }
    };

    //返回到我的页面
    goToBack = () => {
        const type = decodeURI(
            getUrlParam('type', encodeURI(this.props.location.search))
        );
        if (process.env.NATIVE) {
            native('goBack');
        } else if (type === 'home') {
            appHistory.replace('/home');
        } else if (appHistory.length() === 0) {
            appHistory.push('/my');
        } else {
            appHistory.goBack();
        }
    };

    render() {
        const {
            dataSource,
            hasMore,
            height,
            status,
            canStatus,
            refreshing
        } = this.state;
        const row = item => (
            <div className="shop-lists" onClick={this.closeButton} key={item.id}>
                <div
                    className="shop-name"
                    onClick={() => this.goShopHome(item.shop_id)}
                >
                    <div className="shop-title">
                        {/* { 是否多条订单一起付款
                            item.status === '0' && (
                                <span
                                    className={`icon ${item.select ? 'icon-select-z' : 'icon-unselect-z'}`}
                                    onClick={(ev) => this.checkAllStatus(item, ev)}
                                />
                            )
                        } */}
                        <img
                            src={item.picpath}
                            onError={e => {
                                e.target.src = item.df_logo;
                            }}
                        />
                        <p>{item.shopName}</p>
                        <div className="icon enter"/>
                    </div>
                    <div className="right">
                        {item.return_name || this.tabTopName(item.status)}
                    </div>
                    {/* <div className="right">{item.return_status !== '0' ? item.return_name : this.tabTopName(item.status)}</div> */}
                </div>
                {item.pr_list && item.pr_list.length > 0
                    ? item.pr_list.map(items => (
                        <div
                            className="goods"
                            key={items.id}
                            onClick={ev => this.goToOrderDetail(
                                item.id,
                                item.return_status,
                                item.return_id,
                                items.return_types,
                                ev
                            )
                            }
                        >
                            <div className="goods-left">
                                <div>
                                    <LazyLoadIndex
                                        key={items.pr_picpath}
                                        src={items.pr_picpath}
                                    />
                                </div>
                            </div>
                            <div className="goods-right">
                                <div className="goods-desc">
                                    <div className="desc-title">
                                        {items.pr_title}
                                    </div>
                                    <div className="price">
                                          ￥{moneyDot(items.price)[0] + '.'}
                                        <span className="samll-money">
                                            {moneyDot(items.price)[1]}
                                        </span>
                                    </div>
                                </div>
                                <div className="goods-sku">
                                    <div className="sku-left">
                                        {items.property_content
                                              && items.property_content.map(
                                                  pro => (
                                                      <div
                                                          className="goods-size"
                                                          key={pro}
                                                      >
                                                          {pro}
                                                      </div>
                                                  )
                                              )}
                                    </div>
                                    <div className="sku-right">
                                          x{items.num}
                                    </div>
                                </div>
                                <div className="btn-keep">
                                      C米：{items.deposit}
                                </div>
                                <div className="buttons">
                                    {items.return_name}
                                </div>
                                <div className="buttons drawback">
                                    {item.status === '5' && (
                                        <div
                                            style={{
                                                border: '1px solid #666'
                                            }}
                                            className="evaluate-button"
                                            onClick={ev => this.refundDetails(
                                                item.id,
                                                ev
                                            )
                                            }
                                        >
                                              查看详情
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))
                    : ''}
                <div className="shop-bottom">
                    <div className="right-bottom">
                        <div className="total-count">
                            总C米：<span>{item.all_deposit}</span>
                        </div>
                        <div className="total-price">
                            <div className="total-price-left"/>
                            <div className="total-price-right">
                                共{item.pr_count}件商品 合计：
                                <span className="zxa">
                                    ￥{moneyDot(item.all_price)[0] + '.'}
                                    <span className="samll-money">
                                        {moneyDot(item.all_price)[1]}
                                    </span>
                                    <span> (运费￥{item.express_money})</span>
                                </span>
                            </div>
                        </div>
                        {//售后状态下 退款申请中
                            item.return_status === '1' && (
                                <div className="buttons">
                                    <div
                                        className="look-button"
                                        onClick={ev => this.revoke(item.return_id, ev)
                                        }
                                    >
                                    撤销申请
                                    </div>
                                    <div
                                        onClick={ev => this.application(ev, item.return_id)
                                        }
                                        className="evaluate-button"
                                    >
                                    修改申请
                                    </div>
                                </div>
                            )}
                        {item.return_status === '2' && (
                            <div className="buttons">
                                <div
                                    className="evaluate-button"
                                    onClick={ev => this.revoke(item.return_id, ev)
                                    }
                                >
                                    撤销申请
                                </div>
                            </div>
                        )}
                        {this.bottomModal(item)}
                    </div>
                </div>
            </div>
        );
        return (
            <div
                data-component="my-order"
                data-role="page"
                className={`my-order ${window.isWX ? 'WX' : ''}`}
            >
                {window.isWX ? null : (
                    <AppNavBar
                        title="线上订单"
                        backgroundColor={navColorR}
                        goBackModal={this.goToBack}
                        redBackground
                        goToSearch={this.goToSearch}
                        rightShow
                        search
                        color={navColorR}
                    />
                )}
                {//弹出取消弹框
                    canStatus && (
                        <CancelOrder canStateChange={this.canStateChange}/>
                    )}
                <div
                    className={`tabs ${
                        nativeCssDiff() ? 'general-other' : 'general'
                    }`}
                >
                    <Tabs
                        tabs={tabs}
                        page={Number(status) + 1}
                        animated={false}
                        useOnPan
                        swipeable={false}
                        onChange={this.tabChange}
                        activeKey={new Date()}
                    >
                        <div className="shop-list">
                            {dataSource.getRowCount() > 0 ? (
                                <ListView
                                    dataSource={dataSource}
                                    initialListSize={temp.pagesize}
                                    renderRow={row}
                                    style={{
                                        height: height
                                    }}
                                    pageSize={temp.pagesize}
                                    onEndReachedThreshold={30}
                                    onEndReached={this.onEndReached}
                                    renderFooter={() => ListFooter(hasMore)}
                                    pullToRefresh={(
                                        <PullToRefresh
                                            refreshing={refreshing}
                                            onRefresh={this.onRefresh}
                                            damping={70}
                                            indicator={{
                                                release: (
                                                    <Animation
                                                        ref={ref => {
                                                            this.Animation = ref;
                                                        }}
                                                    />
                                                )
                                            }}
                                        />
                                    )}
                                />
                            ) : (
                                <Nothing text={FIELD.No_Order}/>
                            )}
                        </div>
                    </Tabs>
                </div>
            </div>
        );
    }
}

const mapDispatchToProps = {
    setOrderStatus: actionCreator.setOrderStatus,
    showConfirm: actionCreator.showConfirm
};

export default connect(null, mapDispatchToProps)(MyOrder);
