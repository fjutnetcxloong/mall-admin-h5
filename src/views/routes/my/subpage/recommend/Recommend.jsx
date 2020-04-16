/**每日分享页面 */

import React from 'react';
import './Recommend.less';
import {ListView, PullToRefresh} from 'antd-mobile';
import AppNavBar from '../../../../common/navbar/NavBar';
import LazyLoad from '../../../../common/lazy-load/LazyLoad';
import Animation from '../../../../common/animation/Animation';

const {appHistory} = Utils;
const {urlCfg} = Configs;

export default class Recommend extends BaseComponent {
    constructor(props, context) {
        super(props, context);
        const dataSource = new ListView.DataSource({
            rowHasChanged: (row1, row2) => row1 !== row2
        });
        this.temp = {
            stackData: [],
            isLoading: true,
            pagesize: 5
        };
        this.state = {
            refreshing: false, //是否显示上拉刷新信息
            dataSource,
            pageCount: -1,
            page: 1,
            height: document.documentElement.clientHeight - (window.isWX ? document.documentElement.clientWidth / 7.5 * 0.88 : document.documentElement.clientWidth / 7.5 * 0.88)
        };
    }

    componentDidMount() {
        this.getRecomList();
    }

    //去往信息详情
    switchTo = (id) => {
        appHistory.push(`/redetail?id=${id}`);
    };

    //请求推荐列表数据
    getRecomList() {
        const {page} = this.state;
        this.fetch(urlCfg.getRecomList)
            .subscribe((res) => {
                if (res) {
                    if (res.status === 0) {
                        if (page === 1) {
                            this.temp.stackData = res.data;
                        } else {
                            this.temp.stackData = this.temp.stackData.concat(res.data);
                        }
                        if (page >= res.page_count) {
                            this.setState({
                                hasMore: false
                            });
                        }
                        this.setState((prevState) => ({
                            dataSource: prevState.dataSource.cloneWithRows(this.temp.stackData),
                            pageCount: res.page_count,
                            refreshing: false
                        }));
                    }
                }
            });
    }

    //下拉刷新
    onRefresh = () => {
        this.setState({
            refreshing: true,
            isLoading: true
        }, () => {
            this.getRecomList();
        });
    };

    //上拉加载
    onEndReached = (event) => {
        const {page, pageCount} = this.state;
        if (this.temp.isLoading) return;
        if (page >= pageCount) {
            this.setState({
                hasMore: false
            });
        } else {
            this.setState((pervState) => ({
                page: pervState.page + 1
            }), () => {
                this.getRecomList();
            });
        }
    };

    render() {
        const {dataSource, height, refreshing} = this.state;
        const row = (item, index) => (
            <div className="recommend-list" onClick={() => this.switchTo(item.id)} key={index.toString()}>
                <div className="image">
                    <LazyLoad key={item.banner} src={item.banner}/>
                </div>
                <div className="desc">
                    <div className="desc-title">
                        {item.title}
                    </div>
                    <div className="date">
                        <div className="share"><span className="icon icon-share"/>分享（{item.share_num}）</div>
                        <div className="time">{item.crtdate.split(' ')[0]}</div>
                    </div>
                </div>
            </div>
        );
        return (
            <div data-component="recommend" data-role="page" className="recommend">
                <AppNavBar nativeGoBack title="每日推荐"/>
                <div className="list-wrap">
                    <ListView
                        dataSource={dataSource}
                        initialListSize={this.temp.pagesize}
                        renderRow={row}
                        style={{
                            height: height
                        }}
                        pageSize={this.temp.pagesize}
                        onEndReachedThreshold={20}
                        onEndReached={this.onEndReached}
                        renderFooter={() => (
                            <p>
                                {this.state.hasMore ? '正在加载更多的数据...' : ''}
                            </p>
                        )
                        }
                        pullToRefresh={(
                            <PullToRefresh
                                refreshing={refreshing}
                                onRefresh={this.onRefresh}
                                damping={70}
                                indicator={{
                                    // activate: <Animation ref={ref => { this.Animation = ref }}/>,
                                    // deactivate: ' ',
                                    release: <Animation ref={ref => { this.Animation = ref }}/>
                                    // finish: <Animation ref={ref => { this.Animation = ref }}/>
                                }}
                            />
                        )}
                    />
                </div>
            </div>
        );
    }
}
