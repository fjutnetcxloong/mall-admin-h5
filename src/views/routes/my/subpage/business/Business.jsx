/**
 * 我的客户
 */
import {connect} from 'react-redux';
import {Tabs, List} from 'antd-mobile';
import {baseActionCreator as actionCreator} from '../../../../../redux/baseAction';
import Nothing from '../../../../common/nothing/Nothing';
import AppNavBar from '../../../../common/navbar/NavBar';
import MyListView from '../../../../common/my-list-view/MyListView';
import './Business.less';

const Item = List.Item;
const Brief = Item.Brief;
const {urlCfg} = Configs;
const {FIELD} = Constants;
const {appHistory, native, nativeCssDiff, getUrlParam} = Utils;
//tab配置信息
const tabs = [
    {title: '全部', type: 0},
    {title: '商店', type: 2},
    {title: '职工', type: 3},
    {title: '会员', type: 1}
];

class Customer extends BaseComponent {
    constructor(props) {
        super(props);
        this.stackData = []; //数据堆，暂存业务列表
        this.state = {
            data: null, //数据源
            type: 0, //请求参数：业务类型
            tabKey: this.props.tabValue || 0, //当前选中tab
            page: 1, //当前选中tab页码
            pageCount: -1, //当前选中tab总页数
            refreshing: false, //是否在下拉刷新时显示指示器
            isLoading: false, //是否在上拉加载时显示提示
            hasMore: false, //是否有数据可请求
            totalNum: 0, //当前选中tab总人数
            propsData: props
        };
    }


    componentDidMount() {
        this.getCustomerList();
    }

    //获取业务数据，第一页需记录总页数和总人数，并在翻页时回传后端。noLoading为true时不显示菊花图
    getCustomerList = (noLoading = false) => {
        const {type, page, totalNum} = this.state;
        const param = [
            {
                type,
                page,
                pagesize: 10
            },
            {
                type,
                page,
                number: totalNum,
                pagesize: 10
            }
        ];
        this.fetch(urlCfg.myBusiness, {data: param[page === 1 ? 0 : 1]}, page === 1 ? noLoading : '').subscribe(res => {
            if (res && res.status === 0) {
                this.handleResult(res, page === 1);
            } else {
                this.setState({
                    totalNum: 0
                });
            }
        });
        // if (page === 1) {
        //     this.fetch(urlCfg.myBusiness, {data: param[0]}, noLoading).subscribe(res => {
        //         if (res.status === 0) {
        //             this.handleResult(res, true);
        //         } else {
        //             this.setState({
        //                 totalNum: 0
        //             });
        //         }
        //     });
        // } else {
        //     this.fetch(urlCfg.myBusiness, {data: param[1]}).subscribe(res => {
        //         if (res.status === 0) {
        //             this.handleResult(res, false);
        //         } else {
        //             this.setState({
        //                 totalNum: 0
        //             });
        //         }
        //     });
        // }
    };

    static getDerivedStateFromProps(prevProps, prevState) {
        return {
            propsData: prevProps
        };
    }

    componentDidUpdate(prev, data) {
        if (process.env.NATIVE) {
            const timer = decodeURI(getUrlParam('time', encodeURI(this.state.propsData.location.search)));
            const timerNext = decodeURI(getUrlParam('time', encodeURI(prev.location.search)));
            if (timer !== timerNext) {
                this.getCustomerList();
            }
        }
    }

    //处理接口请求结果.isFirst：是否第一页
    handleResult = (res, isFirst) => {
        const {page} = this.state;
        const extra = (isFirst && {
            pageCount: res.data.page_count,
            totalNum: res.data.count
        });
        this.stackData = this.stackData.concat(res.data.list);
        this.setState({
            data: this.stackData,
            refreshing: false,
            isLoading: false,
            ...extra
        }, () => {
            if (page < this.state.pageCount) {
                this.setState({
                    hasMore: true
                });
            }
        });
    }

    //切换tab回调，重置状态
    onTabChange = (tab, index) => {
        this.stackData = [];
        this.setState({
            data: this.stackData,
            type: tab.type,
            tabKey: index,
            page: 1,
            pageCount: 0,
            refreshing: false,
            isLoading: false,
            hasMore: false
        }, () => {
            this.getCustomerList();
        });
    };

    //下拉刷新列表回调，重置stackData和page
    onRefresh = () => {
        this.stackData = [];
        this.setState({
            refreshing: true,
            page: 1
        }, () => {
            this.getCustomerList(true);
        });
    };

    //上拉加载列表回调，
    onEndReached = () => {
        const {hasMore} = this.state;
        if (!hasMore) {
            return;
        }
        this.setState(prevState => ({
            isLoading: true,
            hasMore: false,
            page: prevState.page + 1
        }), () => {
            this.getCustomerList();
        });
    };

    //打开商户详情
    openShopInfo = (uid) => {
        const {tabKey} = this.state;
        this.props.setTab(tabKey);//缓存选中tab
        appHistory.push({pathname: `/customer-info?uid=${uid}`});
    };

    //返回键回调
    goBackModal = () => {
        if (process.env.NATIVE) {
            native('goBack');
        } else {
            appHistory.goBack();
        }
        this.props.setTab('');//清空
    };

    render() {
        const {
            totalNum,
            data,
            tabKey,
            isLoading,
            hasMore,
            refreshing
        } = this.state;
        //滚动容器高度
        const height = document.documentElement.clientHeight - (window.isWX ? window.rem * 4.16 : window.rem * 5.04);
        //每行渲染样式
        const row = item => (
            <Item
                {...item.type === '2' && {
                    arrow: 'horizontal',
                    onClick: () => this.openShopInfo(item.no)
                }}
            >
                <div className="customer-uid">
                    <span>UID:{item.no}</span>
                    {item.type === '4' && <div className="customer-tag">异常期</div>}
                </div>
                <Brief>
                    <span>{item.crtdate}</span>
                    <span>{item.realname}</span>
                </Brief>
            </Item>
        );
        return (
            <React.Fragment>
                {window.isWX ? null : (
                    <AppNavBar
                        title="我的客户"
                        goBackModal={this.goBackModal}
                    />
                )}
                <div className="customer-count">
                    <p> {totalNum || 0}人</p>
                    <span>总人数</span>
                </div>
                <div className={`customer-list ${nativeCssDiff() ? 'general-other' : 'general'}`}>
                    <Tabs
                        tabs={tabs}
                        initialPage={tabKey}
                        onChange={this.onTabChange}
                        swipeable={false}
                    >
                        {data && data.length > 0 ? (
                            <MyListView
                                data={data}
                                height={height}
                                initSize={10}
                                size={5}
                                row={row}
                                onEndReached={this.onEndReached}
                                loding={isLoading}
                                more={hasMore}
                                refreshing={refreshing}
                                onRefresh={this.onRefresh}
                            />
                        ) : (
                            <Nothing
                                title=""
                                text={FIELD.No_Business}
                            />
                        )}
                    </Tabs>
                </div>
            </React.Fragment>
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
    setTab: actionCreator.setTab
};
export default connect(mapStateToProps, mapDispatchToProps)(Customer);
