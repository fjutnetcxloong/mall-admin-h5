/**
 * CAM转出记录
 */
import {List} from 'antd-mobile';
import AppNavBar from '../../../../../common/navbar/NavBar';
import Nothing from '../../../../../common/nothing/Nothing';
import MyListView from '../../../../../common/my-list-view/MyListView';
import './TransferRecord.less';

const {FIELD} = Constants;
const {urlCfg} = Configs;

export default class transferRecord extends BaseComponent {
    state = {
        refreshing: false, //是否在下拉刷新时显示指示器
        isLoading: false, //是否在上拉加载时显示提示
        hasMore: false, //是否有数据可请求
        page: 1, //当前页数
        pagesize: 20, //每页条数
        pageCount: 0, //一共多少页
        recordDtat: [], //当页数据源
        height: document.documentElement.clientHeight - (window.isWX ? 0 : window.rem * 1.08) //滚动容器高度
    };

    componentDidMount() {
        this.withdrawList();
    }

    //获取提现数据
    withdrawList = (drawCircle = false) => {
        //drawCircle 是否显示转圈圈动画
        const {page, pagesize, pageCount} = this.state;
        this.fetch(urlCfg.myListOfAssets, {data: {tp: 3, page, pagesize, page_count: pageCount}}, drawCircle)
            .subscribe(res => {
                if (res && res.status === 0) {
                    if (page === 1) {
                        this.setState({
                            refreshing: false,
                            recordDtat: res.data.data,
                            pageCount: res.data.page_count
                        });
                    } else {
                        this.setState(prevState => ({
                            recordDtat: prevState.recordDtat.concat(res.data.data)
                        }));
                    }
                }
            });
    }

    //上拉列表回调函数
    onEndReached = () => {
        const {pageCount, page} = this.state;
        //判断是否为最后一页
        if (page >= pageCount) {
            this.setState({
                hasMore: true
            });
            return;
        }
        this.setState(prevState => ({
            page: prevState.page + 1
        }), () => {
            this.withdrawList();
        });
    }

    //下拉刷新
    onRefresh = () => {
        this.setState({
            page: 1,
            refreshing: true,
            pageCount: 0
        }, () => {
            this.withdrawList(true);
        });
    }

    render() {
        const {recordDtat, refreshing, isLoading, hasMore, height} = this.state;

        //每行渲染样式
        const row = item => (
            <List className="record-list">
                <div className="record-list-left">
                    <p className="list-left-source">{item.desc}</p>
                    <p className="list-left-time">{item.crtdate}</p>
                </div>
                <div className="record-list-right">
                    <p className="list-left-source">{item.types === '0' ? '-' : '+'}{item.scalar}</p>
                    <p className="list-left-time">余额：{item.remain}</p>
                </div>
            </List>
        );

        return (
            <div className="transferRecord">
                {/*<div className="record-title">提现记录</div>*/}
                <AppNavBar title="转出记录"/>
                <div>
                    {recordDtat && recordDtat.length > 0 ? (
                        <MyListView
                            data={recordDtat}
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
                            text={FIELD.No_News}
                        />
                    )}
                </div>
            </div>
        );
    }
}
