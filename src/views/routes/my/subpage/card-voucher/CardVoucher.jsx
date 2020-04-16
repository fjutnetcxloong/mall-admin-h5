//卡券包页面  2020.3.11
import {Tabs, ListView, PullToRefresh} from 'antd-mobile';
import {dropByCacheKey} from 'react-router-cache-route';
import AppNavBar from '../../../../common/navbar/NavBar';
import {ListFooter} from '../../../../common/list-footer';
import Nothing from '../../../../common/nothing/Nothing';
import Animation from '../../../../common/animation/Animation';
import './CardVoucher.less';


const {FIELD} = Constants;
const {urlCfg} = Configs;
const {appHistory, showSuccess} = Utils;
const tabsData = [
    {title: '待领取'},
    {title: '未使用'},
    {title: '已使用'},
    {title: '已过期'}
];

const temp = {
    stackData: [],
    pagesize: 6
};
export default class CardVoucher extends BaseComponent {
    constructor(props) {
        super(props);
        this.state = {
            dataSource: new ListView.DataSource({
                rowHasChanged: (row1, row2) => row1 !== row2
            }), //长列表容器
            tabsKey: this.statusChoose(props.location.pathname.split('/')[2]) || 0,
            hasMore: true, //底部请求状态文字显示情况
            refreshing: false, //下拉刷新  是否显示刷新状态
            page: 1,
            pageCount: -1,
            height:
                document.documentElement.clientHeight
                - (window.isWX ? window.rem * 1.08 : window.rem * 1.94)
        };
    }

    componentDidMount() {
        this.getList();
    }

    //进入优惠券页面，判断为什么状态
    statusChoose = str => {
        const arr = new Map([
            ['dl', 0],
            ['ws', 1],
            ['ys', 2],
            ['yg', 3]
        ]);
        return arr.get(str);
    };

    //获取列表数据
    getList = () => {
        const {tabsKey, page, pageCount} = this.state;
        this.fetch(urlCfg.getCardList, {data: {status: tabsKey, page, pagesize: temp.pagesize, page_count: pageCount}}).subscribe(res => {
            if (res && res.status === 0 && res.data.card_list && res.data.card_list.length) {
                const {data} = res;
                if (page === 1) {
                    temp.stackData = data.card_list;
                } else {
                    temp.stackData = temp.stackData.concat(data.card_list);
                    //数组去重，这里的主要目的是为了，当点击立即领取之后，会出现一个位置的空缺，数据库会将这条数据移除
                    //后面的数据会补上来，这时，请求当页的数据，会将补上来的那条数据请求过来，不过也会因此多请求重复的数据
                    //所以去重就可以达到将新数据请求过来的目的
                    const obj = {};
                    temp.stackData = temp.stackData.reduce((item, next) => {
                        if (!obj[next.card_no]) {
                            item.push(next);
                            obj[next.card_no] = true;
                        }
                        return item;
                    }, []);
                }
                if (page >= data.pageCount) {
                    this.setState({
                        hasMore: false
                    });
                }
                this.setState((prevState) => ({
                    dataSource: prevState.dataSource.cloneWithRows(temp.stackData),
                    pageCount: data.pageCount,
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

    //切换table
    tabChange = (data, index) => {
        this.setState({
            tabsKey: index,
            page: 1,
            pageCount: -1,
            hasMore: true
        }, () => {
            this.getList();
        });
    };

    //滚动加载
    onEndReached = () => {
        const {pageCount, page, hasMore} = this.state;
        if (!hasMore) return;//没有更多了，就阻止往下走
        if (page < pageCount) {
            this.setState((prevState) => ({
                page: prevState.page + 1,
                hasMore: true
            }), () => {
                this.getList();
            });
        } else {
            this.setState({
                hasMore: false
            });
        }
    }

    //下拉刷新
    onRefresh = () => {
        this.setState({
            page: 1,
            refreshing: true,
            pageCount: -1
        }, () => {
            this.getList();
        });
    }

    //点击立即领取
    getCardReceive = (no) => {
        this.fetch(urlCfg.reciveCard, {data: {card_no: no}}, true).subscribe(res => {
            if (res && res.status === 0) {
                showSuccess('领取成功');
                temp.stackData = temp.stackData.filter(item => item.card_no !== no);
                this.getList();
            }
        });
    }

    //去使用
    goToUse = (value) => {
        if (value.types === '1') { //如果是商城平台券，则跳转到分类页面
            dropByCacheKey('CategoryListPage');
            appHistory.push(`/categoryList?cardNo=${value.card_id}&title=${'优惠券可用商品'}`);
        } else if (value.types === '2') {
            appHistory.push(`/shopHome?id=${value.jump_id}`);
        } else {
            appHistory.push(`/goodsDetail?id=${value.jump_id}`);
        }
    }

    render() {
        const {tabsKey, dataSource, height, hasMore, refreshing} = this.state;
        const row = item => (
            <div className={tabsKey === 3 ? 'already-wrap' : 'card-view'}>
                <div className="card-money">
                    <p>
                        <span>￥</span>{item.price}
                    </p>
                    <span className="full">{item.price_limit}</span>
                </div>
                <div className="card-main">
                    <p>{item.card_title}</p>
                    <p>{item.limit_tip}</p>
                    <p>{item.term_validity}</p>
                    {tabsKey === 0 && <span className="card-receive" onClick={() => this.getCardReceive(item.card_no)}>立即领取</span>}
                    {tabsKey === 1 && <span className="card-use" onClick={() => this.goToUse(item)}>去使用</span>}
                    {tabsKey === 1 && item.time_status !== 0 && <span className="card-status">{item.time_status === 1 ? '将过期' : '新到' }</span>}
                    {tabsKey === 2 && <span className="already-used">已使用</span>}
                    {tabsKey === 3 && <span className="already-used">已过期</span>}
                </div>
            </div>
        );
        return (
            <div className="card-wrap">
                <AppNavBar title="我的优惠券" rightShow show/>
                <div className="tabs-card">
                    <Tabs
                        tabs={tabsData}
                        page={Number(tabsKey)}
                        onChange={this.tabChange}
                        swipeable={false}
                    >
                        <div className="card-list">
                            {
                                dataSource.getRowCount() > 0
                                    ? (
                                        <ListView
                                            initialListSize={temp.pagesize + 1}
                                            dataSource={dataSource}
                                            renderRow={row}
                                            style={{
                                                height
                                            }}
                                            onEndReached={this.onEndReached}
                                            onEndReachedThreshold={30}
                                            pageSize={temp.pagesize}
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
                                    )
                                    : <Nothing text={FIELD.No_Card}/>
                            }
                        </div>
                    </Tabs>
                </div>
            </div>
        );
    }
}
