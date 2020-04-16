/**
 * 我的客户订单量
 */
import {List} from 'antd-mobile';
import AppNavBar from '../../../../common/navbar/NavBar';
import MyListView from '../../../../common/my-list-view/MyListView';
import './Customer.less';

const Item = List.Item;
const {urlCfg} = Configs;
const {getUrlParam, goBackModal} = Utils;
export default class OrderList extends BaseComponent {
    constructor(props) {
        super(props);
        this.uid = decodeURI(getUrlParam('uid', encodeURI(props.location.search)));
        this.stackData = []; //数据堆，暂存订单列表
    }

    state = {
        data: null, //数据源
        page: 1, //当前页码
        pageCount: -1, //总页数
        refreshing: false, //是否在下拉刷新时显示指示器
        isLoading: false, //是否在上拉加载时显示提示
        hasMore: false //是否有数据可请求
    }

    componentDidMount() {
        this.getOrderList();
    }

    //获取订单列表
    getOrderList = (noLoading = false) => {
        const {page} = this.state;
        this.fetch(urlCfg.customerOrder, {
            data: {
                no: this.uid,
                page
            }
        }, noLoading).subscribe(res => {
            if (res && res.status === 0) {
                this.stackData = this.stackData.concat(res.data.data);
                this.setState({
                    data: this.stackData,
                    pageCount: res.data.page_count,
                    refreshing: false,
                    isLoading: false
                }, () => {
                    if (page < this.state.pageCount) {
                        this.setState({
                            hasMore: true
                        });
                    }
                });
            }
        });
    };

    //下拉刷新列表回调，重置stackData和page
    onRefresh = () => {
        this.stackData = [];
        this.setState({
            refreshing: true,
            page: 1
        }, () => {
            this.getOrderList(true);
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
            this.getOrderList();
        });
    };

    render() {
        const {
            data,
            isLoading,
            hasMore,
            refreshing
        } = this.state;
        //滚动容器高度
        const height = document.documentElement.clientHeight - (window.isWX ? null : window.rem * 0.88);
        //每行渲染样式
        const row = item => (
            <Item extra={`成交${item.count}笔`}>{item.date}</Item>
        );
        return (
            <React.Fragment>
                {window.isWX ? null : (
                    <AppNavBar
                        title="我的客户"
                        goBackModal={goBackModal}
                    />
                )}

                {data
                    && (
                        <MyListView
                            data={data}
                            height={height}
                            initSize={20}
                            size={15}
                            row={row}
                            onEndReached={this.onEndReached}
                            loding={isLoading}
                            more={hasMore}
                            refreshing={refreshing}
                            onRefresh={this.onRefresh}
                        />
                    )
                }
            </React.Fragment>
        );
    }
}
