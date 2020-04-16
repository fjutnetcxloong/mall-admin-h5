/**我的收藏页面 */
import {connect} from 'react-redux';
import {Tabs, ListView, PullToRefresh} from 'antd-mobile';
import {baseActionCreator as actionCreator} from '../../../../../redux/baseAction';
import AppNavBar from '../../../../common/navbar/NavBar';
import Nothing from '../../../../common/nothing/Nothing';
import LazyLoad from '../../../../common/lazy-load/LazyLoad';
import Animation from '../../../../common/animation/Animation';
import {ListFooter} from '../../../../common/list-footer';
import './Collect.less';

const tabs = [{title: '商品'}, {title: '店铺'}];
const {appHistory, native, showInfo, nativeCssDiff, spliceArr} = Utils;
const {urlCfg} = Configs;
const {
    MESSAGE: {Form, Feedback},
    FIELD
} = Constants;
class Collect extends BaseComponent {
    constructor(props) {
        super(props);
        const goodsSource = new ListView.DataSource({
            rowHasChanged: (row1, row2) => row1 !== row2
        });
        const shopSource = new ListView.DataSource({
            rowHasChanged: (row1, row2) => row1 !== row2
        });
        this.temp = {
            stackData: [],
            stackShopData: [],
            pagesize: 5
        };
        const {tabValue} = this.props;
        this.state = {
            goodsSource, //商品列表
            shopSource, //店铺列表
            pageShop: 1, //初始化当前页码
            pageCountShop: -1, //总页码初始
            refreshing: false, //刷新状态是否可见
            statusNum: tabValue || 1, //返回时tab状态
            tabKey: tabValue ? tabValue - 1 : 0, //tab状态
            hasMore: true, // 是否有更多数据
            height:
                document.documentElement.clientHeight
                - (window.isWX ? window.rem * 1.08 : window.rem * 1.98)
        };
    }

    componentDidMount() {
        this.getCollectionList();
    }

    //获取列表数据
    getCollectionList = (noLoading = false) => {
        const {statusNum, pageShop} = this.state;
        this.fetch(
            urlCfg.CollectionList,
            {
                data: {
                    type: statusNum,
                    page: pageShop,
                    pagesize: this.temp.pagesize
                }
            },
            noLoading
        ).subscribe(res => {
            if (res && res.status === 0) {
                if (pageShop === 1) {
                    this.temp.stackData = res.data;
                } else {
                    this.temp.stackData = this.temp.stackData.concat(res.data);
                    let result = [];
                    const obj = {};
                    result = this.temp.stackData.reduce((item, next) => {
                        if (!obj[next.id]) {
                            item.push(next);
                            obj[next.id] = true;
                        }
                        return item;
                    }, []);
                    this.temp.stackData = result;
                }
                if (pageShop >= res.page_count) {
                    this.setState({
                        hasMore: false
                    });
                }
                this.setState(prevState => ({
                    shopSource: prevState.shopSource.cloneWithRows(
                        this.temp.stackData
                    ),
                    pageCountShop: res.page_count,
                    refreshing: false
                }));
            } else {
                this.setState({
                    hasMore: false
                });
            }
        });
    };

    //下拉刷新
    onRefresh = () => {
        this.setState(
            {
                pageShop: 1,
                hasMore: true
            },
            () => {
                this.getCollectionList(true);
            }
        );
    };

    //上拉加载
    onEndReached = () => {
        const {hasMore} = this.state;
        if (!hasMore) return;
        this.setState(
            pervState => ({
                pageShop: pervState.pageShop + 1,
                hasMore: true
            }),
            () => {
                this.getCollectionList();
            }
        );
    };

    //切换tab
    tabChange = (data, index) => {
        this.setState(
            {
                pageShop: 1,
                isEdit: false,
                shopState: true,
                hasMore: true
            },
            () => {
                this.setState(
                    {
                        tabKey: index === 1 ? 1 : 0,
                        statusNum: index === 1 ? 2 : 1
                    },
                    () => {
                        this.getCollectionList();
                    }
                );
            }
        );
    };

    //跳往商品详情页增加字段判断；以便回来的时候找到状态
    shopGoods = value => {
        const {statusNum} = this.state;
        this.props.setTab(statusNum);
        appHistory.push({pathname: `/goodsDetail?id=${value}`});
    };

    //去往商店
    shopHome = (event, id) => {
        const {statusNum} = this.state;
        this.props.setTab(statusNum);
        appHistory.push(`/shopHome?id=${id}`);
        event.stopPropagation();
    };

    //点击顶部导航右侧按钮 编辑按钮
    changeNavRight = () => {
        const arr = this.temp.stackData.map(item => Object.assign({}, item));
        this.setState(prevState => ({
            isEdit: !prevState.isEdit,
            shopSource: prevState.shopSource.cloneWithRows(arr)
        }));
    };

    //点击单选
    onChangeCheck = id => {
        const arr = [];
        this.temp.stackData.forEach(data => {
            if (data.id === id) {
                data.select = !data.select;
            }
            arr.push(Object.assign({}, data));
        });
        this.setState(prevState => ({
            shopSource: prevState.shopSource.cloneWithRows(arr)
        }));
    };

    //删除商品或者店铺
    onDelList = () => {
        const {tabKey} = this.state;
        if (this.temp.stackData.some(item => item.select)) {
            this.deleteFn(tabKey + 1, this.temp.stackData);
        } else {
            showInfo(Form.No_Select_Select);
        }
    };

    //清空
    emptyFn = () => {
        const {tabKey} = this.state;
        const arr = [];
        const {showConfirm} = this.props;
        this.temp.stackData.forEach(data => {
            data.select = true;
            arr.push(Object.assign({}, data));
        });
        this.setState(prevState => ({
            shopSource: prevState.shopSource.cloneWithRows(arr)
        }));
        showConfirm({
            title: Form.Whether_Empty_Favorite,
            callbacks: [
                () => {
                    const arrCancel = [];
                    this.temp.stackData.forEach(data => {
                        data.select = false;
                        arrCancel.push(Object.assign({}, data));
                    });
                    this.setState(prevState => ({
                        shopSource: prevState.shopSource.cloneWithRows(arrCancel)
                    }));
                },
                () => {
                    this.deleteFn(tabKey + 1, this.temp.stackData);
                }
            ]
        });
    };

    //删除函数
    deleteFn = (type, arrAll) => {
        const ids = [];
        if (arrAll) {
            arrAll.forEach(item => {
                if (item.select) {
                    ids.push(item.id);
                }
            });
        }
        this.fetch(urlCfg.cancelCollect, {data: {ids, type}}).subscribe(
            res => {
                if (res && res.status === 0) {
                    if (ids.length > 0) {
                        showInfo(Feedback.Del_Success);
                    } else {
                        showInfo(Feedback.Empty_Success);
                    }
                    this.temp.stackData = spliceArr(
                        ids,
                        this.temp.stackData
                    );
                    this.setState(
                        prevState => ({
                            shopSource: prevState.shopSource.cloneWithRows(
                                this.temp.stackData
                            )
                        }), () => {
                            this.getCollectionList();
                        }
                    );
                }
            }
        );
    };

    //底部主体内容
    messageMain = (row, row2) => {
        const {isEdit, height, shopSource, refreshing, hasMore} = this.state;
        let blockModal = <div/>;
        if (shopSource.getRowCount() > 0) {
            blockModal = (
                <ListView
                    dataSource={shopSource}
                    initialListSize={this.temp.pagesize}
                    // renderBodyComponent={() => <ListBody/>}
                    renderRow={isEdit ? row : row2}
                    style={{
                        height: height
                    }}
                    pageSize={this.temp.pagesize}
                    onEndReachedThreshold={20}
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
            );
        } else {
            blockModal = <Nothing text={FIELD.No_Collection}/>;
        }
        return blockModal;
    };

    //渲染的结构
    defauleModal = (item, checkoutId) => {
        const {tabKey} = this.state;
        return tabKey === 0 ? (
            <div
                className="goods"
                key={item.id}
                onClick={() => (checkoutId ? this.onChangeCheck(checkoutId) : this.shopGoods(item.pr_id))}
            >
                <div className="goods-box">
                    <div>
                        <LazyLoad key={item.picpath} src={item.picpath}/>
                    </div>
                    <div className="desc">
                        <div className="desc-title">{item.title}</div>
                        <div className="goods-sku">
                            {item.mark
                                && item.mark.length
                                && item.mark.map((data, index) => {
                                    if (index < item.mark.length - 1) {
                                        return (
                                            <div>
                                                {data}
                                                <span>|</span>
                                            </div>
                                        );
                                    }
                                    return data;
                                })}
                        </div>
                        <div className="count">
                            <div className="num">C米：{item.deposit}</div>
                            {item.status === '0' && <span>已下架</span>}
                            <div className="city">{item.city || '北京'}</div>
                        </div>
                        <div className="pay">
                            <div>销售量：{item.num_sold}</div>
                            <div className="dele">￥{item.price_original}</div>
                        </div>
                        <div className="shop-name">
                            <div className="s-name">
                                <span className="store-name">
                                    {item.shop_name}
                                </span>
                                <span
                                    className="enter-shop"
                                    onClick={event => this.shopHome(event, item.shop_id)
                                    }
                                >
                                    <span>进店</span>
                                    <div className="icon get-into"/>
                                </span>
                            </div>
                            <div className="goods-price">￥{item.price}</div>
                        </div>
                    </div>
                </div>
            </div>
        ) : (
            <div className="shop-content" key={item.id}>
                <div
                    className="shop-name"
                    onClick={event => (checkoutId ? this.onChangeCheck(checkoutId) : this.shopHome(event, item.shop_id))}
                >
                    <img
                        src={item.picpath}
                        onError={e => {
                            e.target.src = item.df_logo;
                        }}
                    />
                    <div className="shop-space ">
                        <p>{item.shop_name}</p>
                        <span className="Shop-Nr">人均消费</span>
                        <span className="Shop-Nr wide">
                            ￥{item.consume_per}
                        </span>
                    </div>
                    <div
                        className="button"
                        style={{
                            border: nativeCssDiff()
                                ? '1PX solid #ff2d51'
                                : '0.02rem solid #ff2d51'
                        }}
                    >
                        进店
                    </div>
                </div>
                <div className="shop-goods">
                    {item.pr && item.pr.length
                        ? item.pr.map(data => (
                            <div className="item" key={data.title}>
                                <div
                                    className="image"
                                    onClick={() => (checkoutId ? this.onChangeCheck(checkoutId) : this.shopGoods(data.id))}
                                >
                                    <LazyLoad
                                        key={data.picpath}
                                        src={data.picpath}
                                    />
                                    <span>{data.price}</span>
                                </div>
                                <p onClick={() => (checkoutId ? this.onChangeCheck(checkoutId) : this.shopGoods(data.id))}>
                                    {data.title}
                                </p>
                            </div>
                        ))
                        : ''}
                </div>
            </div>
        );
    };

    goBackModal = () => {
        if (process.env.NATIVE) {
            native('goBack');
        } else {
            appHistory.goBack();
        }
        //将tab选中状态清除
        this.props.setTab('');
    };

    render() {
        const {isEdit, shopSource, height} = this.state;
        const row = item => (
            <span key={item.id} className="callect-list-show">
                <div className="callect-list-show-select">
                    <span
                        className={
                            item.select ? 'icon select' : 'icon unselect'
                        }
                        onClick={() => this.onChangeCheck(item.id)}
                    />
                </div>
                {this.defauleModal(item, item.id)}
            </span>
        );
        const row2 = item => (
            <span key={item.id} className="callect-list-hide">
                {this.defauleModal(item)}
            </span>
        );
        return (
            <div
                data-component="collect"
                data-role="page"
                className={`collect ${window.isWX ? 'WX-CL' : ''}`}
            >
                <AppNavBar
                    status="2"
                    title={window.isWX ? '' : '我的收藏'}
                    show={!window.isWX}
                    {...(shopSource.getRowCount() > 0
                        ? {
                            isEdit,
                            rightEdit: true,
                            changeNavRight: this.changeNavRight
                        }
                        : null)}
                    goBackModal={this.goBackModal}
                />
                <Tabs
                    tabs={tabs}
                    swipeable={false}
                    initialPage={this.state.tabKey}
                    onTabClick={this.tabChange}
                >
                    <div className="mainInfo" style={{height: height}}>
                        {this.messageMain(row, row2)}
                        {!isEdit ? null : (
                            <div className="callect-menu">
                                <span
                                    className="callect-menu-left"
                                    onClick={this.emptyFn}
                                >
                                    清空
                                </span>
                                <span
                                    className="callect-menu-right"
                                    onClick={this.onDelList}
                                >
                                    删除
                                </span>
                            </div>
                        )}
                    </div>
                </Tabs>
            </div>
        );
    }
}

const mapStateToProps = state => {
    const base = state.get('base');
    return {
        tabValue: base.get('tabValue')
    };
};

const mapDispatchToProps = {
    setTab: actionCreator.setTab,
    showConfirm: actionCreator.showConfirm
};

export default connect(mapStateToProps, mapDispatchToProps)(Collect);
