
//线下订单
import React from 'react';
import './SelfMention.less';
import {Tabs} from 'antd-mobile';
import {connect} from 'react-redux';
import {baseActionCreator as actionCreator} from '../../../../../redux/baseAction';
import LazyLoadIndex  from '../../../../common/lazy-load/LazyLoad';
import Nothing from '../../../../common/nothing/Nothing';
import CancelOrder from '../../../../common/cancel-order/CancleOrder';
import MyListView from '../../../../common/my-list-view/MyListView';
import AppNavBar from '../../../../common/navbar/NavBar';

const {appHistory, showInfo, native, getUrlParam, systemApi: {removeValue}, nativeCssDiff, moneyDot} = Utils;
const {urlCfg} = Configs;
const {MESSAGE: {Feedback}, FIELD, navColorR} = Constants;
const tabs = [
    {title: '全部'},
    {title: '未完成'},
    {title: '已完成'},
    {title: '售后'}
];
class ReDetail extends BaseComponent {
    constructor(props) {
        super(props);
        this.state = {
            refreshing: false, //是否在下拉刷新时显示指示器
            isLoading: false, //是否在上拉加载时显示提示
            hasMore: true, //是否有数据可请求
            status: 0, //tab状态
            page: 1, //列表第几页
            pageSize: 10, //每页多少条
            pageCount: -1, //一共有多少页
            pageList: [], //列表信息
            orderId: 0, //订单id
            canStatus: false, //是否弹出取消框
            navColor: '@fiery-red', //nav背景颜色
            height: document.documentElement.clientHeight - (window.isWX ? 0.75 : window.rem * 1.8),
            propsData: props
        };
    }

    componentDidMount() {
        const num = this.statusChoose(this.props.location.pathname.split('/')[2]);
        this.init(num);
    }

    static getDerivedStateFromProps(prevProps, prevState) {
        return {
            propsData: prevProps
        };
    }

    componentDidUpdate(prev, data) {
        // 父组件重传props时就会调用这个方
        const numNext = this.statusChoose(this.state.propsData.location.pathname.split('/')[2]);
        const numPrev = this.statusChoose(data.propsData.location.pathname.split('/')[2]);
        if (numNext !== numPrev) {
            // eslint-disable-next-line react/no-did-update-set-state
            this.setState({
                status: numNext
            }, () => {
                this.init(numNext);
            });
        }
    }

    init = (num) => {
        this.setState({
            status: num
        }, () => {
            this.getList();
        });
    }

    //进入订单页面，判断为什么状态
    statusChoose = (str) => {
        const arr = new Map([
            ['ww', 1],
            ['yw', 2],
            ['sh', 3]
        ]);
        return arr.get(str) || 0;
    }

    //获取订单列表信息
    getList = (drawCircle = false) => {
        //drawCircle 是否显示转圈圈动画 false 不显示  true 显示
        const {pageSize, pageCount, page, status, pageList} = this.state;
        this.fetch(urlCfg.mallSelfOrder, {data: {page, pagesize: pageSize, pageCount, status}}, drawCircle)
            .subscribe(res => {
                if (res && res.status === 0) {
                    //判断是否为最后一页
                    if (page >= res.pageCount) {
                        this.setState({
                            hasMore: false
                        });
                    }
                    if (page === 1) {
                        this.setState({
                            refreshing: false,
                            pageList: res.list,
                            pageCount: res.pageCount
                        });
                    } else {
                        const obj = {};
                        const result = pageList.concat(res.list).reduce((item, next) => {
                            if (!obj[next.id]) {
                                item.push(next);
                                obj[next.id] = true;
                            }
                            return item;
                        }, []);
                        this.setState({
                            pageList: result
                        });
                    }
                } else {
                    this.setState({
                        hasMore: false
                    });
                }
            });
    }

    //线下订单跳转
    gotoSelfMyOrder=(index) => {
        const url = new Map([
            [0, '/selfMention'],
            [1, '/selfMention/ww'],
            [2, '/selfMention/yw'],
            [3, '/selfMention/sh']
        ]);
        appHistory.replace(url.get(index));
    }

    //选择列表状态
    tabChange = (data, index) => {
        this.setState({
            page: 1,
            hasMore: false,
            pageCount: -1
        }, () => {
            this.gotoSelfMyOrder(index);
        });
    }

    //下拉刷新
    onRefresh = () => {
        this.setState({
            page: 1,
            hasMore: false,
            refreshing: true,
            pageCount: -1
        }, () => {
            this.getList(true);
        });
    }

    //上拉列表回调函数
    onEndReached = () => {
        const {hasMore} = this.state;
        if (!hasMore) return;
        this.setState(prevState => ({
            page: prevState.page + 1,
            hasMore: true
        }), () => {
            this.getList();
        });
    }

    //取消订单
    cancelOrder = (e, id) => {
        this.setState({
            orderId: id,
            canStatus: true
        });
        e.stopPropagation();
    }

    //取消订单状态改变  确认取消
    canStateChange = (state, value) => {
        const {orderId} = this.state;
        if (state === 'mastSure') {
            if (value) {
                this.fetch(urlCfg.delMallOrder, {data: {deal: 0, id: orderId, reason: value.label, reason_id: value.value}})
                    .subscribe(res => {
                        if (res && res.status === 0) {
                            showInfo(Feedback.Cancel_Success);
                            this.setState((prevState) => ({
                                pageList: prevState.pageList.filter(item => item.id !== orderId)
                            }), () => {
                                this.getList();
                            });
                        }
                    });
                this.setState({
                    canStatus: false
                });
            } else {
                showInfo(Feedback.Select);
            }
        } else {
            this.setState({
                canStatus: false
            });
        }
    }

    //删除、取消订单
    deleteOrder = (e, id) => {
        const {showConfirm} = this.props;
        showConfirm({
            title: '是否删除该订单',
            callbacks: [null, () => {
                this.fetch(urlCfg.delMallOrder, {data: {deal: 1, id}})
                    .subscribe(res => {
                        if (res && res.status === 0) {
                            showInfo(Feedback.Del_Success);
                            this.setState((prevState) => ({
                                pageList: prevState.pageList.filter(item => item.id !== id)
                            }), () => {
                                this.getList();
                            });
                        }
                    });
            }]
        });
        e.stopPropagation();
    }

    //立即评价
    promptlyAssess = (e, id) => {
        e.stopPropagation();
        appHistory.push(`/myEvaluate?id=${id}&assess=2`);
    }

    //跳转立即自提
    skipSelf = (e, id) => {
        e.stopPropagation();
        appHistory.push('/paySuccess?id=' + id);
    }

    //跳转到详情页面
    skipDetail = (e, id, returnId) => {
        //判断 status === 3 不为空时跳转售后详情页
        const {status} = this.state;
        if (status === 3) {
            appHistory.push(`/refundDetails?id=${returnId}&type=2`);
        } else {
            appHistory.push('/selfOrderingDetails?id=' + id);
        }
        e.stopPropagation();
    }

    //申请售后/退款
    serviceRefund = (e, id) => {
        e.stopPropagation();
        appHistory.push(`/onlyRefund?orderId=${id}&returnType=1&onlyRefund=true&down=1&returnType=1`);
    }

    //进店
    goShopHome = (e, id) => {
        appHistory.push(`/shopHome?id=${id}`);
        e.stopPropagation();
    }

    //立即支付
    payNow = (e, item) => {
        removeValue('orderInfo');//先清除一下，正常流程下单页面的缓存数据，以免冲突
        removeValue('orderArr');//先清除一下，正常流程下单页面的缓存数据，以免冲突
        appHistory.push(`/payMoney?orderId=${item.id}&orderNum=${item.order_no}&source=${4}&down=1`);
        e.stopPropagation();
    }

    //前往售后详情页
    skipAfterSale = (e, id) => { //type为2表示线下订单过去的
        appHistory.push(`/refundDetails?id=${id}&type=2`);
        e.stopPropagation();
    }

    //前往搜索页面
    goToSearch = () => {
        appHistory.push('/self-search');
    }

    //左上角返回上一级
    goBackModal = () => {
        const type = decodeURI(getUrlParam('type', encodeURI(this.props.location.search)));
        if (process.env.NATIVE) {
            native('goBack');
        } else if (type === 'home') {
            appHistory.replace('/home');
        } else if (appHistory.length() === 0) {
            appHistory.push('/my');
        } else {
            appHistory.goBack();
        }
    }

    render() {
        const {pageList, status, refreshing, isLoading, hasMore, canStatus, navColor, height} = this.state;
        //每行渲染样式
        const row = item => (
            <div className="shop-lists" key={item.id} onClick={(e) => this.skipDetail(e, item.id, item.return_id)}>
                <div className="shop-name">
                    <div
                        className="shop-title"
                        onClick={(e) => this.goShopHome(e, item.shop_id)}
                    >
                        <img src={item.picpath} onError={(e) => { e.target.src = item.df_logo }} alt=""/>
                        <p>{item.shopName}</p>
                        <div className="icon enter"/>
                    </div>
                    <div className="right">{item.status_name}</div>
                </div>
                {(item.pr_list && item.pr_list.length > 0) ? item.pr_list.map(items => (
                    <div className="goods" key={items.id}>
                        <div className="goods-left">
                            <div>
                                <LazyLoadIndex key={items.pr_picpath} src={items.pr_picpath}/>
                            </div>
                        </div>
                        <div className="goods-right">
                            <div className="goods-desc">
                                <div className="desc-title">{items.pr_title}</div>
                                <span className="price">￥{moneyDot(items.price)[0] + '.'}<span className="samll-money">{moneyDot(items.price)[1]}</span></span>
                            </div>
                            <div className="goods-sku">
                                <div className="sku-left">
                                    {(items.property_content && items.property_content.length > 0) ? items.property_content.map(data => (
                                        <div key={data} className="goods-size">{data}</div>
                                    )) : ''}
                                    {/*<div>规格</div>*/}
                                </div>
                                <div className="sku-right">x{items.num}</div>
                            </div>
                            <div className="btn-keep">C米：{items.deposit}</div>
                        </div>
                    </div>
                )) : ''}
                <div className="shop-bottom">
                    <div className="right-bottom">
                        <div className="total-count">
                            总C米：<span>{item.all_deposit}</span>
                        </div>
                        <div className="total-price">
                            {/* <div className="total-price-left">共{item.pr_num}件商品</div> */}
                            <div className="total-price-left"/>
                            <div className="total-price-right">共{item.pr_count}件商品 合计：<span className="money">￥{moneyDot(item.all_price)[0] + '.'}<span className="samll-money">{moneyDot(item.all_price)[1]}</span></span></div>
                            {/* <div className="total-price-right"><span>合计：</span><span className="money">{item.all_price}元</span></div> */}
                        </div>
                        {/*等待付款*/}
                        {(item.status === '0' && !item.return_status) && (
                            <div className="buttons">
                                <span className="look-button delete" onClick={(e) => this.cancelOrder(e, item.id)} style={{border: nativeCssDiff() ? '1PX solid #666' : '0.02rem solid #666'}}>取消</span>
                                <div className="evaluate-button" onClick={(e) => this.payNow(e, item)} style={{border: nativeCssDiff() ? '1PX solid #ff2d51' : '0.02rem solid #ff2d51'}}>立即付款</div>
                            </div>
                        )}
                        {/*等待使用*/}
                        {(item.status === '1' || item.return_status === '1') && (
                            <div className="buttons">
                                {!item.return_status && (
                                    <div onClick={(e) => this.serviceRefund(e, item.id)}>退款</div>
                                )}
                                <div className="evaluate-button" onClick={(e) => this.skipSelf(e, item.id)} style={{border: nativeCssDiff() ? '1PX solid #ff2d51' : '0.02rem solid #ff2d51'}}>立即使用</div>
                                {item.return_status === '1' && (
                                    <div className="evaluate-button" onClick={(e) => this.skipAfterSale(e, item.return_id)} style={{border: nativeCssDiff() ? '1PX solid #ff2d51' : '0.02rem solid #ff2d51'}}>查看详情</div>
                                )}
                            </div>
                        )}
                        {/*订单完成，等待评价*/}
                        {((item.status === '3') && !item.return_status) && (
                            <div className="buttons">
                                <span className="look-button delete" onClick={(e) => this.deleteOrder(e, item.id)}>删除</span>
                                <div className="evaluate-button" onClick={(e) => this.promptlyAssess(e, item.id)} style={{border: nativeCssDiff() ? '1PX solid #ff2d51' : '0.02rem solid #ff2d51'}}>待评价</div>
                            </div>
                        )}
                        {/*订单完成*/}
                        {(item.status === '4' && !item.return_status) && (
                            <div className="buttons">
                                <span className="look-button delete" onClick={(e) => this.deleteOrder(e, item.id)} >删除</span>
                                <div className="evaluate-button" onClick={(e) => this.skipDetail(e, item.id)} style={{border: nativeCssDiff() ? '1PX solid #ff2d51' : '0.02rem solid #ff2d51'}}>查看详情</div>
                            </div>
                        )}
                        {/*退款中  1 退款成功 3  退款失败 4 退款关闭 5*/}
                        { (item.status === '10' || item.status === '12' || item.status === '13') && (item.return_status === '3' || item.return_status === '4') && (
                            <div className="buttons">
                                <div className="evaluate-button" onClick={(e) => this.skipAfterSale(e, item.return_id)} style={{border: nativeCssDiff() ? '1PX solid #ff2d51' : '0.02rem solid #ff2d51'}}>查看详情</div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );
        return (
            <div data-component="Self-mention" data-role="page" className="Self-mention">
                <AppNavBar title="线下订单" backgroundColor={navColor} goBackModal={this.goBackModal} goToSearch={this.goToSearch} rightShow redBackground search color={navColorR}/>
                <div className={`${nativeCssDiff() ? 'general-other' : 'general'}`}>
                    <Tabs
                        tabs={tabs}
                        page={status}
                        animated={false}
                        useOnPan
                        swipeable={false}
                        onChange={this.tabChange}
                    >
                        <div>
                            {pageList && pageList.length > 0 ? (
                                <MyListView
                                    data={pageList}
                                    height={height}
                                    initSize={10}
                                    size={5}
                                    row={row}
                                    onEndReached={this.onEndReached}  //上拉列表回调函数
                                    loding={isLoading}
                                    more={hasMore}
                                    refreshing={refreshing}
                                    onRefresh={this.onRefresh}  //下拉刷新
                                />
                            ) : (
                                <Nothing
                                    title=""
                                    text={FIELD.No_Order}
                                />
                            )}
                        </div>
                    </Tabs>
                </div>
                {   //弹出取消弹框
                    canStatus &&  (<CancelOrder canStateChange={this.canStateChange}/>)
                }
            </div>
        );
    }
}

const mapDidpatchToProps = {
    showConfirm: actionCreator.showConfirm
};
export default connect(null, mapDidpatchToProps)(ReDetail);
