/** 评价成功*/
import {connect} from 'react-redux';
import {ListView} from 'antd-mobile';
import {dropByCacheKey} from 'react-router-cache-route';
import LazyLoadIndex from '../../../../../common/lazy-load/LazyLoad';
import {baseActionCreator as actionCreator} from '../../../../../../redux/baseAction';
import AppNavBar from '../../../../../common/navbar/NavBar';
import {ListFooter} from '../../../../../common/list-footer';
import './EvaluationSuccess.less';

const {appHistory} = Utils;
const {urlCfg} = Configs;
const temp = {
    stackData: [],
    isLoading: true,
    pagesize: 20
};
class EvaluationSuccess extends BaseComponent {
    state = {
        dataSource: new ListView.DataSource({
            rowHasChanged: (row1, row2) => row1 !== row2
        }), //长列表容器
        height: document.documentElement.clientHeight - (window.isWX ?  window.rem * 1.08 : window.rem * 1.78),
        recommend: [], //获取评价列表
        greatDemand: [], //热门商品列表
        refreshing: false, //是否显示刷新状态
        hasMore: false, //底部请求状态文字显示情况
        pageDem: 1, //热门推荐页码
        pageCount: -1
    };

    componentDidMount() {
        this.recommend();
        this.greatDemand();
    }

    //获取订单列表
    recommend = () => {
        this.fetch(urlCfg.mallOrder,
            {data: {status: 3, page: 1, pagesize: 5}}).subscribe((res) => {
            if (res && res.status === 0) {
                this.setState({
                    recommend: res.list
                });
            }
        });
    }

    //热门推荐
    greatDemand = (pageDem) => {
        const {pageCount} = this.state;
        temp.isLoading = true;
        this.fetch(urlCfg.homeRecommendPr,
            {data: {status: 3, page: 1, pagesize: 20, pageCount, pageDem}}).subscribe((res) => {
            if (res && res.status === 0) {
                temp.isLoading = false;
                if (pageDem === 1) {
                    temp.stackData = res.list;
                } else {
                    temp.stackData = temp.stackData.concat(res.list);
                }
                if (pageDem >= res.pageCount) {
                    this.setState({
                        hasMore: false
                    });
                }
                this.setState((prevState) => ({
                    dataSource: prevState.dataSource.cloneWithRows(temp.stackData),
                    pageCount: res.pageCount,
                    refreshing: false
                }));
            }
        });
    }

    //跳转全部商品
    shopHome = (id) => {
        appHistory.push(`/shopHome?id=${id}`);
    }

    //跳转当个商品页
    goToGooods = (id) => {
        appHistory.push(`/goodsDetail?id=${id}`);
    }

    //查看我的评价
    myEvaluate = () => {
        this.props.setTab(1);//到查看页面，需要跳到已评价内容
        dropByCacheKey('PossessEvaluate');//清除我的评价页面缓存
        appHistory.replace('/possessEvaluate');
    }

    //继续评价
    continueAppraise = (id) => {
        appHistory.push(`/myEvaluate?id=${id}`);
    }

    //上拉加载
    onEndReached = () => {
        const {pageDem, pageCount} = this.state;
        if (temp.isLoading) return;
        if (pageCount > pageDem) {
            this.setState((pervState) => ({
                pageDem: pervState.pageDem + 1,
                hasMore: true
            }), () => {
                this.greatDemand(this.state.pageDem);
            });
        } else {
            this.setState({
                hasMore: false
            });
        }
    };

    render() {
        const {recommend, dataSource, hasMore, height} = this.state;
        const row = item => (
            <div className="goods">
                {
                    item && (
                        <div className="goods-name">
                            <div className="goods-picture" onClick={() => this.goToGooods(item.pr_id)}>
                                <img src={item.picpath}/>
                            </div>
                            <div className="goods-information">
                                <div className="goods-explain" onClick={() => this.goToGooods(item.pr_id)}>{item.title}</div>
                                <div className="bookkeeping" onClick={() => this.goToGooods(item.pr_id)}>
                                    <span className="bookkeeping-l">C米：{item.deposit}</span>
                                    <span className="bookkeeping-r">{item.city}</span>
                                </div>
                                <div className="payment">
                                    <span>{item.num_sold}人付款</span>
                                    {/*<span className="payment-r">￥9999</span>*/}
                                </div>
                                <div className="price" onClick={this.shopHome.bind(this, item.shop_id)}>
                                    <div className="price-l">
                                        <span className="enter-l">{item.shopName}</span>
                                        <span className="enter-r">进店<span className="icon"/></span>
                                    </div>
                                    <div className="price-r">￥{item.price}</div>
                                </div>
                            </div>
                        </div>
                    )
                }
            </div>
        );
        return (
            <div className="Evaluation-success">
                <AppNavBar title="评价成功"/>
                {/*<div className="comment">*/}
                {/*<span className="icon comment-r">发表评价</span>*/}
                {/*</div>*/}
                <div className="loogEvaluation">
                    <div className="Evaluation-t">评价成功</div>
                    <div className="Evaluation-c">您的言论将会帮助更多人！</div>
                    <div className="Evaluation-b" onClick={this.myEvaluate}>查看评价</div>
                </div>
                <div className="reEvaluation">
                    <div className="Evaluation">
                        <div className="Evaluation-t" onClick={this.myEvaluate}>继续评论</div>
                    </div>
                    {(recommend && recommend.length > 0) ? recommend.map(item => (
                        <div className="goods">
                            {
                                item.pr_list && item.pr_list.map(data => (
                                    <div className="goods-name">
                                        <div className="goods-picture">
                                            {/* <img src={data.pr_picpath} alt=""/> */}
                                            <LazyLoadIndex key={item.pr_picpath} src={item.pr_picpath}/>
                                        </div>
                                        <div className="goods-information">
                                            <div className="goods-explain explain-appraise" onClick={() => this.goToGooods(data.pr_id)}>{data.pr_title}</div>
                                            <div className="money-appraise" onClick={() => this.goToGooods(data.pr_id)}>￥{data.price}</div>
                                            <ul className="goods-label" onClick={() => this.goToGooods(data.pr_id)}>
                                                {data.property_content.map(items => (
                                                    <li key={items}>{items}</li>
                                                ))}
                                            </ul>
                                            <div className="num-appraise" onClick={() => this.goToGooods(data.pr_id)}>x{data.pr_num}</div>
                                            <div className="bookkeeping" onClick={() => this.goToGooods(data.pr_id)}>
                                                <span className="bookkeeping-l">C米：{data.deposit}</span>
                                            </div>
                                            <div className="price">
                                                <div className="price-l">
                                                    {/* <span className="enter-l">{data.shopName}</span>
                                                <span className="enter-r" onClick={this.shopHome}>进店<span className="icon"/></span> */}
                                                </div>
                                                <div className="btn-appraise">
                                                    <div className="buttons">
                                                        <div className="evaluate-button" onClick={() => this.continueAppraise(item.id)}>立即评价</div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            }
                        </div>
                    )) : ''}
                </div>
                <div className="recommend">
                    <div className="recommend-text">热门推荐</div>
                    {
                        dataSource.getRowCount() > 0 ? (
                            <ListView
                                dataSource={dataSource}
                                initialListSize={temp.pagesize}
                                renderRow={row}
                                style={{
                                    height: height
                                }}
                                pageSize={temp.pagesize}
                                onEndReachedThreshold={30}
                                onEndReached={this.onEndReached}
                                renderFooter={() => ListFooter(hasMore)}
                            />
                        ) : ''
                    }
                </div>
            </div>
        );
    }
}

const mapDispatchToProps = {
    setTab: actionCreator.setTab,
    showConfirm: actionCreator.showConfirm
};

export default connect(
    null,
    mapDispatchToProps
)(EvaluationSuccess);
