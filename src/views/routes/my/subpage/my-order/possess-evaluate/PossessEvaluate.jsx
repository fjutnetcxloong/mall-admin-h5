/**评价中心和商家评价中心 */

import React from 'react';
import {connect} from 'react-redux';
import {Tabs, ListView, PullToRefresh} from 'antd-mobile';
import {baseActionCreator as actionCreator} from '../../../../../../redux/baseAction';
import AppNavBar from '../../../../../common/navbar/NavBar';
import LazyLoadIndex  from '../../../../../common/lazy-load/LazyLoad';
import Nothing from '../../../../../common/nothing/Nothing';
import BigImg from '../../../../../common/big-picture/BigPicture';
import Animation from '../../../../../common/animation/Animation';
import {ListFooter} from '../../../../../common/list-footer';
import './PossessEvaluate.less';

const tabs = [
    {title: '待评价'},
    {title: '已评价'}
];

const temp = {
    stackData: [], //待评价的数据储存
    stackDataAlready: [], //已评价的数据储存
    pagesize: 5,
    isLoading: true
};
let keyNum = 0.11211212;
const {FIELD} = Constants;
const {urlCfg} = Configs;
const {appHistory, native, getUrlParam} = Utils;
const arr = [{
    title: '全部',
    value: 0,
    checked: false
}, {
    title: '好评',
    value: 0,
    checked: false
}, {
    title: '中评',
    value: 0,
    checked: false
}, {
    title: '差评',
    value: 0,
    checked: false
}, {
    title: '有图',
    value: 0,
    checked: false
}, {
    title: '追评',
    value: 0,
    checked: false
}];
class PossessEvaluate extends BaseComponent {
    constructor(props) {
        super(props);
        arr.forEach((item, index) => {
            if (index === this.props.evaStatus) {
                item.checked = true;
            }
        });
        this.state = {
            dataSource: new ListView.DataSource({
                rowHasChanged: (row1, row2) => row1 !== row2
            }),
            alerdeyData: new ListView.DataSource({
                rowHasChanged: (row1, row2) => row1 !== row2
            }),
            page: 1, //已评价页码
            pageToBe: 1, //待评价页码
            types: props.evaStatus, //tab类型 默认进入页面为全部
            pageCount: -1,
            pageCountToBe: -1,
            tabkey: props.tabValue || 0, //tab状态
            refreshing: false, //是否显示刷新状态
            height: document.documentElement.clientHeight - (window.isWX ? window.rem * 1.08 : window.rem * 1.96),
            heightAlready: document.documentElement.clientHeight - (window.isWX ? window.rem * 2.98 : window.rem * 4.07), //已评价的列表高
            arrChecked: arr, //已评价按钮状态切换集合
            userType: decodeURI(getUrlParam('userType', encodeURI(this.props.location.search))), //用户身份
            hasMore: false, //底部请求状态文字显示情况
            requestOne: false, //判断tab切换的时候是否请求接口
            propsData: props
        };
    }

    componentDidMount() {
        this.sentPas();
    }

    static getDerivedStateFromProps(prevProps, prevState) {
        return {
            propsData: prevProps
        };
    }

    componentDidUpdate(data, value) {
        const userType = value.propsData.location.search.split('=')[1];
        if (process.env.NATIVE && (userType !== this.state.userType)) {
            // eslint-disable-next-line react/no-did-update-set-state
            this.setState({
                dataSource: new ListView.DataSource({
                    rowHasChanged: (row1, row2) => row1 !== row2
                }),
                alerdeyData: new ListView.DataSource({
                    rowHasChanged: (row1, row2) => row1 !== row2
                }),
                page: 1, //已评价页码
                pageToBe: 1, //待评价页码
                types: this.props.evaStatus, //tab类型 默认进入页面为全部
                pageCount: -1,
                pageCountToBe: -1,
                tabkey: this.props.tabValue || 0, //tab状态
                refreshing: false, //是否显示刷新状态
                height: document.documentElement.clientHeight - (window.isWX ? window.rem * 1.08 : window.rem * 2),
                heightAlready: document.documentElement.clientHeight - (window.isWX ? window.rem * 2.98 : window.rem * 4.06), //已评价的列表高
                arrChecked: arr, //已评价按钮状态切换集合
                userType: userType, //用户身份
                hasMore: false, //底部请求状态文字显示情况
                requestOne: false //判断tab切换的时候是否请求接口
            }, () => {
                this.sentPas();
            });
        }
    }

    //我的评价页面的请求
    sentPas = () => {
        //追评之后，从新返回的时候，。请求
        if (this.props.tabValue && this.props.tabValue === 1) {
            this.getList();
        } else {
            this.getToBeEvaluated();
        }
    }

    //获取待评价信息
    getToBeEvaluated = (noLoading = false) => {
        const {pageToBe, pageCount, userType} = this.state;
        temp.isLoading = true;
        this.setState({hasMore: true});
        this.fetch(userType === '2' ? urlCfg.busiMallOrder : urlCfg.mallOrder, {data: {status: 3, all: userType === '2' ? '' : 1,  page: pageToBe, pagesize: temp.pagesize, pageCount}}, noLoading)
            .subscribe(res => {
                if (res && res.status === 0) {
                    temp.isLoading = false;
                    if (pageToBe === 1) {
                        temp.stackData = res.list;
                    } else {
                        temp.stackData = temp.stackData.concat(res.list);
                    }
                    if (pageToBe >= res.pageCount) {
                        this.setState({
                            hasMore: false
                        });
                    }
                    this.setState((prevState) => ({
                        dataSource: prevState.dataSource.cloneWithRows(temp.stackData),
                        pageCountToBe: res.pageCount,
                        refreshing: false
                    }));
                    //全局储存用户身份
                    this.props.setUseType(userType);
                }
            });
    }

    //获取已评价信息
    getList = (noLoading = false) => {
        const {page, types, arrChecked, userType} = this.state;
        temp.isLoading = true;
        this.setState({hasMore: true});
        this.fetch(userType === '2' ? urlCfg.busiAppraiselist : urlCfg.myAppraiseList, {data: {page, pagesize: temp.pagesize, types}}, noLoading)
            .subscribe(res => {
                if (res && res.status === 0) {
                    temp.isLoading = false;
                    if (page === 1) {
                        temp.stackDataAlready = res.data;
                    } else {
                        temp.stackDataAlready = temp.stackDataAlready.concat(res.data);
                    }
                    if (page >= res.page_count) {
                        this.setState({
                            hasMore: false
                        });
                    }
                    //将各个评价的数量一一赋值
                    arrChecked[0].value = res.member ? res.member.pingjia_num : '0';
                    arrChecked[1].value = res.member ? res.member.pingjia_good : '0';
                    arrChecked[2].value = res.member ? res.member.pingjia_middle : '0';
                    arrChecked[3].value = res.member ? res.member.pingjia_bad : '0';
                    arrChecked[4].value = res.member ? res.member.pingjia_pic_num : '0';
                    arrChecked[5].value = res.member ? res.member.pingjia_add : '0';
                    this.setState((prevState) => ({
                        arrChecked,
                        member: res.member,
                        alerdeyData: prevState.alerdeyData.cloneWithRows(temp.stackDataAlready),
                        pageCount: res.page_count,
                        refreshing: false
                    }));
                }
            });
    }

    //上拉加载
    onEndReached = (event) => {
        const {tabkey, pageToBe, page, pageCount, pageCountToBe} = this.state;
        if (temp.isLoading) return;
        if (tabkey === 0) {
            if (pageCountToBe > pageToBe) {
                this.setState((pervState) => ({
                    pageToBe: pervState.pageToBe + 1
                }), () => {
                    this.getToBeEvaluated();
                });
            } else {
                this.setState({
                    hasMore: false
                });
            }
        } else if (page >= pageCount) {
            this.setState({
                hasMore: false
            });
        } else {
            this.setState((pervState) => ({
                page: pervState.page + 1
            }), () => {
                this.getList();
            });
        }
    };

    //下拉刷新
    onRefresh = () => {
        this.setState({
            refreshing: true
        });
        const {tabkey} = this.state;
        if (tabkey === 0) {
            this.setState({
                pageToBe: 1
            }, () => {
                temp.stackData = [];
                this.getToBeEvaluated(true);
            });
        } else {
            this.setState({
                page: 1
            }, () => {
                temp.stackDataAlready = [];
                this.getList(true);
            });
        }
    };

    //已评价 评价切换
    checkedDo = (num) => {
        if (this.lv) { //切换的时候重新回到第一页
            this.lv.scrollTo(0, 0);
        }
        this.setState({
            page: 1
        }, () => {
            const {arrChecked} = this.state;
            arrChecked.forEach(item => { item.checked = false });
            arrChecked.forEach((item, index) => { if (index === num) { item.checked = true } });
            this.props.setEvaStatus(num);//储存评价的选择状态
            temp.stackDataAlready = [];
            this.setState({
                arrChecked: [...arrChecked],
                types: num
            }, () => {
                this.getList();
            });
        });
    };

    //立即评价
    promptlyEstimate = (id, express) => {
        //express 1 快递  2、3 线下 到店消费
        if (express === '1') {
            appHistory.push(`/myEvaluate?id=${id}`);
        } else {
            appHistory.push(`/myEvaluate?id=${id}&assess=2`);
        }
        //将状态改为false，这样返回的时候，tab切换就可以请求接口
        this.setState({
            requestOne: false
        });
    }

    //发表追评
    publishReview = (id) => {
        appHistory.push(`/publishReview?id=${id}`);
        //将状态改为false，这样返回的时候，tab切换就可以请求接口
        this.setState({
            requestOne: false
        });
    }

    //跳转到订单详情页
    skipDetail = (id, express) => {
        if (express === '1') { //跳转线上
            appHistory.push(`/listDetails?id=${id}`);
        } else {
            appHistory.push('/selfOrderingDetails?id=' + id);
        }
        //将状态改为false，这样返回的时候，tab切换就可以请求接口
        this.setState({
            requestOne: false
        });
    }

    //进店
    goShopHome = (id) => {
        appHistory.push(`/shopHome?id=${id}`);
        //将状态改为false，这样返回的时候，tab切换就可以请求接口
        this.setState({
            requestOne: false
        });
    }

    //评价类型
    evalute = (num) => {
        const arrList = new Map([
            ['1', '好评'],
            ['2', '中评'],
            ['3', '差评']
        ]);
        return arrList.get(num);
    }

    //状态判断
    tabTopName = (index) => {
        // "0待付款;1待发货;2待收货;3待评价"
        const arrStatus = new Map([
            ['0', '等待付款'],
            ['1', '等待发货'],
            ['2', '卖家已发货'],
            ['3', '待评价'],
            ['4', '交易完成']
        ]);
        return arrStatus.get(index);
    }

    //底部结构
    bottomModal = () => {
        const {tabkey, dataSource, height, heightAlready, alerdeyData, refreshing, hasMore} = this.state;
        let blockModal = <div/>;
        if (tabkey === 0) {
            blockModal = dataSource.getRowCount() > 0 ? (
                <ListView
                    dataSource={dataSource}
                    initialListSize={temp.pagesize}
                    // renderBodyComponent={() => <ListBody/>}
                    renderRow={this.toBeEvaluatedRow}
                    style={{
                        height: height
                    }}
                    pageSize={temp.pagesize}
                    onEndReachedThreshold={20}
                    onEndReached={this.onEndReached}
                    renderFooter={() => ListFooter(hasMore)}
                    pullToRefresh={(
                        <PullToRefresh
                            refreshing={refreshing}
                            onRefresh={this.onRefresh}
                            damping={70}
                            indicator={{
                                release: <Animation ref={ref => { this.Animation = ref }}/>
                            }}
                        />
                    )}
                />
            ) : <Nothing text={FIELD.No_EvaluationL}/>;
        } else {
            blockModal = (
                <div>
                    { alerdeyData.getRowCount() > 0 ? (
                        <ListView
                            dataSource={alerdeyData}
                            initialListSize={temp.pagesize}
                            // renderBodyComponent={() => <ListBody/>}
                            renderRow={this.alreadyEvalutedRow}
                            style={{
                                height: heightAlready
                            }}
                            pageSize={temp.pagesize}
                            onEndReachedThreshold={20}
                            onEndReached={this.onEndReached}
                            renderFooter={() => ListFooter(hasMore)}
                            ref={el => { this.lv = el }}
                            pullToRefresh={(
                                <PullToRefresh
                                    refreshing={refreshing}
                                    onRefresh={this.onRefresh}
                                    damping={70}
                                    indicator={{
                                        release: <Animation ref={ref => { this.Animation = ref }}/>
                                    }}
                                />
                            )}
                        />
                    ) : <Nothing text={FIELD.No_EvaluationL}/>}
                </div>
            );
        }
        return blockModal;
    }

    //待评价结构
    toBeEvaluatedRow = (item) => {
        const {userType} = this.state;
        return (
            <div className="unevaluated-box">
                <div className="unevaluated">
                    <div className="shop-lists">
                        <div className="shop-name" onClick={userType === '2' ? '' : () => this.goShopHome(item.shop_id)}>
                            <div className="shop-title">
                                <LazyLoadIndex key={item.picpath} src={userType === '2' ? item.avatarUrl : item.df_logo}/>
                                <p>{userType === '2' ? item.nickname : item.shopName }</p>
                                <div className="icon enter"/>
                            </div>
                            <div className="right">{this.tabTopName(item.status)}</div>
                        </div>
                        {item.pr_list && item.pr_list.map(items => (
                            <div key={items.id} className="goods" onClick={userType === '2' ? '' : () => this.skipDetail(item.id, item.all_deposit)}>
                                <div className="goods-left">
                                    <div>
                                        <LazyLoadIndex src={item.pr_list[0].pr_picpath}/>
                                    </div>
                                </div>
                                <div className="goods-right">
                                    <div className="goods-desc">
                                        <div className="desc-title">{items.pr_title}</div>
                                        <div className="price">￥{items.price}</div>
                                    </div>
                                    <div className="goods-sku">
                                        <div className="sku-left">
                                            {items.property_content.map(pro => <div key={pro} className="goods-size">{pro}</div>)}
                                        </div>
                                        <div className="sku-right">x{items.num}</div>
                                    </div>
                                    <div className="btn-keep">C米：{items.deposit}</div>
                                </div>
                            </div>
                        ))}
                        <div className="shop-bottom">
                            <div className="right-bottom">
                                <div className="total-count">
                                总C米：<span>{item.all_price}</span>
                                </div>
                                <div className="total-price">
                                    <div className="total-price-left">共{item.pr_count}件商品</div>
                                    <div className="total-price-right"><span>合计：</span><span className="money">{item.all_price}元</span></div>
                                </div>
                                {
                                    userType === '2' ? '' : (
                                        <div className="buttons">
                                            <div className="evaluate-button" onClick={() => this.promptlyEstimate(item.id, item.if_express)}>立即评价</div>
                                        </div>
                                    )
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    //已评价结构
    alreadyEvalutedRow = (item) => {
        const {userType} = this.state;
        return (
            <div className="have-evaluation">
                <div className="discuss">
                    <div className="discuss-user">
                        <LazyLoadIndex src={item.avatarUrl}/>
                        <div className="user-center">{item.nickname}</div>
                        <div className="user-right">{this.evalute(item.mark_type)}</div>
                    </div>
                    <div className="discuss-tidings">
                        <div className="specs">
                            <span>{item.crtdate}</span>
                            <span>{item.mark.length > 0 && item.mark.join(' ')}</span>
                        </div>
                        <div className="consult">{item.content}</div>
                        <div className="picture">
                            {
                                item.pics.length > 0 && item.pics.map((value, index) => <LazyLoadIndex key={value} src={value} bigPicture={() => this.bigPicture(item.pics, index)}/>)
                            }
                        </div>
                        {
                            item.return_content && <div>商家回复：{item.return_content}</div>
                        }
                        {item.have_add === '1' && (
                            <div className="append">
                                <div className="append-chase">追评</div>
                                <div className="append-theory">{item.add.content}</div>
                                {item.add && item.add.pics && item.add.pics.length > 0 && item.add.pics.map((data, index) => <LazyLoadIndex key={data} src={data} bigPicture={() => this.bigPicture(item.add.pics, index)}/>)}
                                {item.add && item.add.return_content && <div className="reply">商家回复：{item.add.return_content}</div>}
                            </div>
                        )}
                        {/*<div onClick={() => appHistory.push(`/evaluateDetail?id=${item.id}`)}>查看</div>*/}
                    </div>
                </div>
                <div className="write-comment">
                    <div className="wares" onClick={() => this.skipDetail(item.order_id, item.if_express)}>
                        <img src={item.pr_pic} alt=""/>
                        <div className="wares-right">
                            <div className="introduce">{item.pr_title}</div>
                            <div className="price">￥{item.price}</div>
                        </div>
                    </div>
                    <div className="frequency">
                        {
                            userType !== '2' && (
                                <div>
                                    <span>浏览{item.hits}次</span>
                                    <span>点赞{item.zan_num}次</span>
                                    <span>评论{item.talk_num}次</span>
                                </div>
                            )
                        }
                        {
                            userType !== '2' &&  (item.have_add === '1' ? <div>已追评</div> : <div className="depict" onClick={() => this.publishReview(item.id)}>写追评</div>)
                        }
                        {
                            userType === '2' ? this.shopModalStarts(item) : ''
                        }
                    </div>
                </div>
            </div>
        );
    }

    //店铺评价和物流评价
    shopModalStarts = (item) => <div className="business"><p>店铺评价{this.starsShow(item.shop_mark).map(value => <div className="icon icon-tiny"/>)}</p><p>物流评价{item.logistics_mark !== '0' ? this.starsShow(item.logistics_mark).map(value => <div className="icon icon-tiny"/>) : ''}</p></div>

    //打开大图
    bigPicture = (data, index) => {
        this.setState({
            showBigImg: true, //打开大图
            picArr: data, //所以图片的集合
            selectedIndex: index //选中的图片
        });
    }

    //关闭大图
    closeBigImg = () => {
        this.setState({
            showBigImg: false
        });
    }

    //tab切换
    tabChange = (value, index) => {
        const {requestOne, tabkey} = this.state;
        if (tabkey === 0 && !requestOne) {
            this.getList();
        } else if (!requestOne) {
            this.getToBeEvaluated();
        }
        this.setState({
            tabkey: index,
            refreshing: true,
            requestOne: true,
            hasMore: false,
            pageCount: -1
        });
        //储存tab选中状态，以便子级返回本页面时，选中
        this.props.setTab(index);
    }

    goBackModal = () => {
        this.props.setTab('');
        if (process.env.NATIVE && appHistory.length() === 0) {
            native('goBack');
        }
        appHistory.goBack();
    }

    //星星显示
    starsShow = (num) => {
        const a = num.slice(0, 1);
        const b = num.slice(2, 3);
        const startsArr = Array.from({length: a}, (v, k) => k);
        if (Number(b) <= 9 && Number(b) > 0) {
            this.setState({
                half: true
            });
        }
        return startsArr;
    }

    render() {
        const {showBigImg, picArr, selectedIndex, arrChecked, tabkey} = this.state;
        return (
            <div data-component="possess-evaluate" data-role="page" className="possess-evaluate">
                <AppNavBar title="评价中心" goBackModal={this.goBackModal}/>
                <div className="evaluate-abs">
                    <div className="tabs">
                        <Tabs
                            tabs={tabs}
                            initialPage={this.state.tabkey}
                            animated
                            useOnPan
                            swipeable={false}
                            onChange={this.tabChange}
                        >
                            {
                                tabkey === 1 ? (
                                    <div>
                                        <div className="total-box">
                                            {
                                                arrChecked.map((item, index) => (
                                                    <div key={keyNum++} className="total">
                                                        <div className={item.checked ? 'content attive' : 'content'} onClick={() => this.checkedDo(index)}>{item.title}({item.value})</div>
                                                    </div>
                                                ))
                                            }
                                        </div>
                                        {this.bottomModal()}
                                    </div>
                                ) : this.bottomModal()
                            }
                        </Tabs>
                        {
                            showBigImg && <BigImg imgUrl={picArr} selectedIndex={selectedIndex} closeBigImg={this.closeBigImg}/>
                        }
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => {
    const base = state.get('base');
    return {
        tabValue: base.get('tabValue'),
        evaStatus: base.get('evaStatus')
    };
};

const mapDispatchToProps = {
    setTab: actionCreator.setTab,
    setEvaStatus: actionCreator.setEvaStatus,
    setUseType: actionCreator.setUseType
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(PossessEvaluate);
