/**
 * CAM提现记录
 */

import 'rxjs/add/operator/map';
import './Record.less';
import {List} from 'antd-mobile';
import AppNavBar from '../../../../../common/navbar/NavBar';
import Nothing from '../../../../../common/nothing/Nothing';
import MyListView from '../../../../../common/my-list-view/MyListView';

const {FIELD} = Constants;
const {urlCfg} = Configs;
const {showInfo} = Utils;

export default class Record extends BaseComponent {
    state = {
        refreshing: false, //是否在下拉刷新时显示指示器
        isLoading: false, //是否在上拉加载时显示提示
        hasMore: false, //是否有数据可请求
        page: 1, //当前页数
        pagesize: 20, //每页条数
        pageCount: 0, //一共多少页
        recordDtat: [] //当页数据源
    };

    componentDidMount() {
        this.withdrawList();
    }

    //获取提现数据
    withdrawList = (drawCircle = false) => {
        //drawCircle 是否显示转圈圈动画
        const {page, pagesize, pageCount} = this.state;
        this.fetch(urlCfg.myListOfAssets, {data: {tp: 7, page, pagesize, page_count: pageCount}}, drawCircle)
            .subscribe(res => {
                if (res) {
                    if (res.status === 0) {
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
                    } else if (res.status === 1) {
                        showInfo(res.message);
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
        const {recordDtat, refreshing, isLoading, hasMore} = this.state;

        //滚动容器高度
        const height = document.documentElement.clientHeight - (window.isWX ? 0 : window.rem * 1.08);

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
            <div data-component="record" data-role="page" className="record" >
                {/*<div className="record-title">提现记录</div>*/}
                <AppNavBar title="提现记录"/>
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
                            title=""
                            text={FIELD.No_News}
                        />
                    )}
                </div>
            </div>
        );
    }
}
