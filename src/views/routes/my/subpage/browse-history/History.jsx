/**
 * 浏览历史
 */
import {connect} from 'react-redux';
import {Tabs, ListView} from 'antd-mobile';
import {baseActionCreator as actionCreator} from '../../../../../redux/baseAction';
import Nothing from '../../../../common/nothing/Nothing';
import LazyLoad from '../../../../common/lazy-load/LazyLoad';
import AppNavBar from '../../../../common/navbar/NavBar';
import {ListFooter} from '../../../../common/list-footer';
import './History.less';

const {urlCfg} = Configs;
const {appHistory, showInfo, confirmDate, native} = Utils;
const {MESSAGE: {Feedback, Form}, FIELD} = Constants;
const hybirid = process.env.NATIVE;
//tab配置信息
const tabs = [
    {title: '商品历史', type: 1},
    {title: '店铺历史', type: 2}
];
const getSectionData = (dataBlob, sectionID) => sectionID;//将数据按日期分块，返回块id
const getRowData = (dataBlob, sectionID, rowID) => rowID[sectionID];//获取每行数据id
//创建dataSource对象
//rowHasChanged: prev和next不相等时更新row
//sectionHeaderHasChanged: prev和next不相等时更新section
const dataSource = new ListView.DataSource({
    getRowData,
    getSectionHeaderData: getSectionData,
    // rowHasChanged: (row1, row2) => row1 !== row2,
    rowHasChanged: () => true,
    sectionHeaderHasChanged: (s1, s2) => s1 !== s2
});

class History extends BaseComponent {
    constructor(props) {
        super(props);
        this.dataBlobs = {};//数据源
        this.sectionIDs = [];//存放分组id
        this.rowIDs = [];//存放分组数据
        this.stackData = [];//存放不分组数据
        this.checkedIds = [];//存放选中id
    }

    state = {
        data: dataSource, //数据源
        type: this.props.tabValue ? 2 : 1, //请求参数：历史类型
        tabKey: this.props.tabValue || 0, //当前选中tab
        page: 1, //当前选中tab页码
        pageCount: -1, //当前选中tab总页数
        isLoading: false, //是否在上拉加载时显示提示
        hasMore: true, //是否有数据可请求
        isEdit: false, //底部编辑菜单是否显示
        checkedIds: [] //存放选中的行id
    };

    componentDidMount() {
        this.getHistoryList();
    }

    //获取历史列表
    getHistoryList = () => {
        const {type, page} = this.state;
        this.fetch(urlCfg.getHistory, {
            data: {
                type,
                page,
                pagesize: 8
            }
        }).subscribe(res => {
            if (res && res.status === 0 && res.data.length > 0) {
                this.handleResult(res);
            } else {
                this.setState({
                    hasMore: false
                });
            }
        });
    }

    //处理接口请求结果
    handleResult = (res) => {
        const {page} = this.state;
        res.data.forEach(item => {
            //判断后一页是否有和前一页同一天的数据
            if (this.sectionIDs.includes(item.day)) {
                this.rowIDs[this.rowIDs.length - 1] = [{
                    [`${item.day}`]: [...this.rowIDs[this.rowIDs.length - 1][0][`${item.day}`], ...item.data]
                }];
                this.stackData = [...this.stackData, ...item.data];
            } else {
                this.sectionIDs = [...this.sectionIDs, item.day];
                this.rowIDs = [...this.rowIDs, [{[`${item.day}`]: [...item.data]}]];
                this.stackData = [...this.stackData, ...item.data];
            }
        });
        // console.log('数据源', this.sectionIDs, this.rowIDs);
        this.setState((prevState) => ({
            data: prevState.data.cloneWithRowsAndSections(this.dataBlobs, this.sectionIDs, this.rowIDs),
            pageCount: res.page_count,
            isLoading: false
            // isEdit: window.isWX
        }), () => {
            // console.log(this.state.data);
            if (page >= this.state.pageCount) {
                this.setState({
                    hasMore: false
                });
            }
        });
    }

    //切换tab回调，重置状态
    onTabChange = (tab, index) => {
        this.sectionIDs = [];
        this.rowIDs = [];
        this.stackData = [];
        this.checkedIds = [];
        this.setState({
            data: dataSource,
            type: tab.type,
            tabKey: index,
            page: 1,
            pageCount: -1,
            isLoading: false,
            hasMore: true,
            checkedIds: [],
            isEdit: false
        }, () => {
            this.getHistoryList();
        });
    };

    //上拉加载列表回调，
    onEndReached = () => {
        const {hasMore} = this.state;
        if (!hasMore) return;
        this.setState(prevState => ({
            isLoading: true,
            hasMore: true,
            page: prevState.page + 1
        }), () => {
            this.getHistoryList();
        });
    };

    //根据当前tab判断渲染样式
    renderListItem = (item, checkout) => {
        const {tabKey, isEdit} = this.state;
        return (
            tabKey === 0
                ? (
                    <div
                        className={`goods-row${isEdit ? '' : ' unedit'}`}
                        onClick={() => (checkout ? this.onChangeCheck(item) : this.goToGoodsDetail(item.pr_id))}
                    >
                        <div className="goods-row-left">
                            <LazyLoad key={item.picpath} src={item.picpath}/>
                        </div>
                        <div className="goods-row-right">
                            <div className="goods-row-right-zeroth">
                                {item.title}
                            </div>
                            <div className="goods-row-right-first">
                                <span>C米：{item.deposit}</span>
                                {
                                    !isEdit
                                        ? item.status === '0' && <span className="goods-row-right-isout">已下架</span> : null
                                }
                                <span className="goods-row-right-city">{item.city[0]}</span>
                            </div>
                            <div className="goods-row-right-second">
                                <span>{item.num_sold}人付款</span>
                                {
                                    !isEdit
                                        ? <span className="goods-row-right-original">￥{item.price_original}</span>
                                        : item.status === '0' && <span className="goods-row-right-isout">已下架</span>
                                }
                            </div>
                            <div className="goods-row-right-third">
                                <span>{item.shopName}</span>
                                <span className="icon icon-arrow" onClick={(e) => (checkout ? this.onChangeCheck(item) : this.goToShopHome(e, item.shop_id))}>进店</span>
                                <span>￥{item.price}</span>
                            </div>
                        </div>
                    </div>
                )
                : (
                    <div className="shop-row-box">
                        <div className="shop-row-first">
                            {item.open_time !== '' && <span>{`营业时间：${item.open_time}`}</span>}
                        </div>
                        <div className="shop-row">
                            <div
                                className="shop-row-second"
                                onClick={(e) => (checkout ? this.onChangeCheck(item) : this.goToShopHome(e, item.shop_id))}
                            >
                                <div className="shop-row-left">
                                    <img
                                        src={item.picpath}
                                        onError={(e) => { e.target.src = item.df_logo }}
                                    />
                                    {/* <span>休息中</span> */}
                                </div>
                                <div className="shop-row-right">
                                    {/*    <div className="shop-row-right-first">
                                        {this.renderStar(item.shop_mark)}
                                    </div>*/}
                                    <div className="shop-row-right-second">
                                        <span className="store-name">{item.shopName}</span>
                                        <span>人均消费 <span>￥{item.average}</span></span>
                                    </div>
                                    <div className="shop-row-right-third">
                                        <span className="icon icon-third">{item.address}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )
        );
    }

    //跳转到商品详情
    goToGoodsDetail = id => {
        const {tabKey} = this.state;
        this.props.setTab(tabKey);//缓存选中tab
        appHistory.push(`/goodsDetail?id=${id}`);
    };

    //跳转到店铺首页
    goToShopHome = (e, id) => {
        e.stopPropagation();
        const {tabKey} = this.state;
        this.props.setTab(tabKey);//缓存选中tab
        appHistory.push(`/shopHome?id=${id}`);
    };

    //渲染店铺评分
    renderStar = (num) => {
        const slot = num.split('.')[1];
        const value = Number(num);
        const arr = [];
        for (let i = 0; i < Math.floor(value); i++) {
            const star = <div className="icon icon-tiny" key={i}/>;
            arr.push(star);
        }
        if (slot >= 5) {
            const stars = <div className="icon icon-stars"/>;
            arr.push(stars);
        }
        return arr;
    }

    //返回键回调
    goBackModal = () => {
        if (hybirid) {
            native('goBack');
        } else {
            appHistory.goBack();
        }
        this.props.setTab('');//清空
    };

    //点击顶部导航右侧按钮
    changeNavRight = (isEdit) => {
        this.setState((prevState) => ({
            data: prevState.data.cloneWithRowsAndSections(this.dataBlobs, this.sectionIDs, this.rowIDs),
            isEdit,
            isLoading: false
            // isEdit: window.isWX
        }));
    };

    //点击每行复选框
    onChangeCheck = (item) => {
        if (this.checkedIds.includes(item.id)) {
            this.stackData.map(v => {
                if (v.id === item.id) {
                    v.select = false;
                }
            });
            const newArr = this.checkedIds.filter(id => id !== item.id);
            this.setState({
                checkedIds: [...newArr]
            }, () => {
                this.checkedIds = newArr;
                // console.log('移除选中id', this.state.checkedIds);
            });
        } else {
            this.stackData.map(v => {
                if (v.id === item.id) {
                    v.select = true;
                }
            });
            this.checkedIds = this.checkedIds.concat(item.id);
            this.setState({
                checkedIds: [...this.checkedIds]
            }, () => {
                // console.log('添加选中id', this.state.checkedIds);
            });
        }
        this.setState((prevState) => ({
            data: prevState.data.cloneWithRowsAndSections(this.dataBlobs, this.sectionIDs, this.rowIDs)
        }));
    };

    //点击加入收藏夹回调
    addCollect = () => {
        const {type, checkedIds} = this.state;
        if (checkedIds && checkedIds.length === 0) {
            showInfo(Form.No_Select_Select);
            return;
        }
        this.fetch(urlCfg.addCollect, {
            data: {
                type,
                ids: checkedIds
            }
        }).subscribe(res => {
            if (res.status === 0) {
                showInfo(Feedback.Collect_Success);
            }
        });
    };

    //点击清空回调
    onDelList = (clear = false) => {
        const {type, tabKey, checkedIds} = this.state;
        const {showConfirm} = this.props;
        let arr = [];
        if (!clear) {
            if (checkedIds && checkedIds.length === 0) {
                showInfo(Form.No_Select_Select);
                return;
            }
            arr = checkedIds;
        }
        showConfirm({
            title: `确定${clear ? '清空' : '删除选中'}${tabKey === 0 ? '商品' : '店铺'}历史?`,
            btnTexts: ['否', '是'],
            callbacks: [null, () => {
                this.fetch(urlCfg.delHistory, {
                    data: {
                        type,
                        id: arr
                    }
                }).subscribe(res => {
                    if (res.status === 0) {
                        showInfo(Feedback.Del_Success);
                        this.onRefresh();
                    }
                });
            }]
        });
    };

    //删除历史后回调，刷新列表
    onRefresh = () => {
        this.sectionIDs = [];
        this.rowIDs = [];
        this.stackData = [];
        this.checkedIds = [];
        this.setState({
            data: dataSource,
            page: 1,
            pageCount: -1,
            isLoading: false,
            hasMore: true,
            isEdit: false,
            checkedIds: []
        }, () => {
            this.getHistoryList();
        });
    };

    render() {
        const {data, tabKey, isEdit, checkedIds, hasMore} = this.state;
        //滚动容器高度
        const height = document.documentElement.clientHeight - (window.isWX ? window.rem * 1.07 : window.rem * 1.95);
        //每行渲染样式
        const row = v => (
            v.map((item) => (
                <span key={item.id} className={isEdit ? 'history-list-show' : 'history-list-hide'}>
                    {isEdit && (
                        <div className="history-list-show-select">
                            <span
                                className={checkedIds.includes(item.id) ? 'icon select' : 'icon unselect'}
                                onClick={() => this.onChangeCheck(item)}
                            />
                        </div>
                    )}
                    {this.renderListItem(item, isEdit)}
                </span>
            ))
        );
        return (
            <div className="browsing-history">
                <AppNavBar
                    status="2"
                    title={window.isWX ? '' : '浏览历史'}
                    show={!window.isWX}
                    goBackModal={this.goBackModal}
                    {...(data && data.getRowCount() > 0)
                        ? {
                            rightEdit: true,
                            isEdit,
                            changeNavRight: this.changeNavRight
                        } : null
                    }
                />
                <div className={tabKey === 0 ? `history-list-goods ${isEdit ? 'base' : ''}` : `history-list-shop ${isEdit ? 'base' : ''}`}>
                    <Tabs
                        tabs={tabs}
                        initialPage={tabKey}
                        onChange={this.onTabChange}
                        swipeable={false}
                    >
                        {(data && data.getRowCount() > 0) ? (
                            // listView滚动后renderRow里的状态不会刷新，只能直接重新渲染listView
                            <React.Fragment>
                                <ListView
                                    dataSource={data}
                                    style={{height}}
                                    initialListSize={5}
                                    renderSectionHeader={(sectionData) => (
                                        <div className="history-list-section">
                                            {confirmDate(sectionData)}
                                        </div>
                                    )}
                                    pageSize={5}
                                    renderRow={row}
                                    onEndReachedThreshold={50}
                                    onEndReached={this.onEndReached}
                                    renderFooter={() => ListFooter(hasMore)}
                                />
                            </React.Fragment>
                        ) : (
                            <Nothing
                                title=""
                                text={FIELD.No_Evaluation}
                            />
                        )}
                    </Tabs>
                </div>
                {!isEdit ? null : (
                    <div className="history-menu">
                        <span
                            className="history-menu-left"
                            onClick={this.addCollect}
                        >
                            加入收藏夹
                        </span>
                        <span
                            className="history-menu-center"
                            onClick={() => this.onDelList(true)}
                        >
                            清空
                        </span>
                        <span
                            className="history-menu-right"
                            onClick={() => this.onDelList()}
                        >
                            删除
                        </span>
                    </div>
                )}
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
export default connect(mapStateToProps, mapDispatchToProps)(History);
