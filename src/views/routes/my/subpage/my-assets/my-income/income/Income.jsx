
/**营业收入或者业务转入页面 */

import {Button, ListView} from 'antd-mobile';
import Income from '../../single-page/income';
import Myincome from '../../single-page/myincone';
import AppNavBar from '../../../../../../common/navbar/NavBar';
import Detailpage from '../../single-page/detailpage';
import {ListFooter} from '../../../../../../common/list-footer';
import './Income.less';


const {urlCfg} = Configs;
const {getUrlParam} = Utils;

const temp = {
    stackData: [],
    isLoading: true,
    pagesize: 5
};

export default class MyAssets extends BaseComponent {
    constructor(props, context) {
        super(props, context);
        const dataSource = new ListView.DataSource({
            rowHasChanged: (row1, row2) => row1 !== row2
        });
        this.state = {
            dataSource,
            height: document.documentElement.clientHeight - (window.isWX ? window.rem * 6.18 : window.rem * 6.3),
            statusNum: decodeURI(getUrlParam('status', encodeURI(props.location.search))),
            editModal: '', //当前状态
            todayArr: [], //我的收入的数据
            userInfo: {},
            page: 1,
            pageCount: -1,
            exceed: false, //是否展示更多
            hasMore: false //底部加载状态
        };
    }

    componentDidMount() {
        this.getDaril();
        this.getEveryData();
    }

    //当天收入
    getDaril = () => {
        const {statusNum, page} = this.state;
        temp.isLoading = true;
        this.fetch(urlCfg.dailyIncome, {data: {page, pagesize: 10000000, types: statusNum}})
            .subscribe(res => {
                temp.isLoading = false;
                if (res && res.status === 0) {
                    this.setState({
                        userInfo: res.data,
                        todayArr: res.data.today_data
                    });
                }
            });
    }

    //每一天的收入
    getEveryData = () => {
        const {statusNum, page} = this.state;
        temp.isLoading = true;
        this.setState({
            hasMore: true
        });
        this.fetch(urlCfg.dailyIncomeAll, {data: {page, pagesize: temp.pagesize, types: statusNum}})
            .subscribe(res => {
                temp.isLoading = false;
                if (res && res.status === 0) {
                    if (res.data) {
                        if (page === 1) {
                            temp.stackData = res.data.other_list;
                        } else {
                            temp.stackData = temp.stackData.concat(res.data.other_list);
                        }
                        if (page >= res.data.page_count) {
                            this.setState({
                                hasMore: false
                            });
                        }
                        this.setState((prevState) => ({
                            dataSource: prevState.dataSource.cloneWithRows(temp.stackData),
                            pageCount: res.data.page_count
                        }));
                    }
                }
            });
    }

    //上拉加载
    onEndReached = () => {
        const {page, pageCount} = this.state;
        if (temp.isLoading) return;
        if (page >= pageCount) {
            //加载完成
            this.setState({hasMore: false});
        } else {
            this.setState((pervState) => ({
                page: pervState.page + 1
            }), () => {
                this.getEveryData();
            });
        }
    };

    //子页面返回的回调
    getBackChange = () => {
        this.setState({
            editModal: ''
        });
    };

    //单笔收入详情回调
    detailedPage = (data) => {
        this.setState({
            editModal: 'detail',
            currentData: data
        });
    };

    //每日收入页面回调
    myincomeJump = (data) => {
        this.setState({
            editModal: 'myIncome',
            currentData: data
        });
    };

    //底部结构
    defaultModel = (row) => {
        const {todayArr, exceed, dataSource, height, userInfo, statusNum, hasMore} = this.state;
        return (
            <div data-component="cash" data-role="page" className="cash">
                <div className="cash-content">
                    {
                        window.isWX ? (<AppNavBar title={statusNum === '4' ? '业务转入' : '业务收入'}/>) : (
                            <div className="cash-content-navbar">
                                <AppNavBar
                                    goBackModal={this.props.getBackChange}
                                    title={statusNum === '4' ? '业务转入' : '业务收入'}
                                    rightShow
                                />
                            </div>
                        )
                    }
                    <div className="cash-content-tabs">
                        <img src={require('../../../../../../../assets/images/banner.png')}/>
                    </div>
                    <div className="altogether">
                        <div className="altogether-name a-equally">
                            <span>{userInfo.realname}</span>
                            <span>今日{statusNum === '4' ? '收款' : '订单'} 共{userInfo.num}笔</span>
                        </div>
                        <div className="altogether-UID a-equally">
                            <span>UID:{userInfo.no}</span>
                            <div><span className="price">{userInfo.total_price}</span><span>元</span></div>
                        </div>
                    </div>
                    <div className="asset-info-wrap">
                        {((todayArr.length > 0 && exceed) ?  (
                            <div className="totday-wrap">
                                {todayArr.map(item =>  (
                                    <div onClick={() => this.detailedPage(item)}>
                                        <div className="asset-info unde-line">
                                            <p><span>{item.desc}</span><span>{item.types === '1' ? '+' : '-'}{item.scalar}</span></p>
                                            <p><span>{item.crtdate}</span></p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : '')}
                        {((todayArr.length > 0 && todayArr.length > 6 && !exceed) ?  (
                            <div className="totday-wrap">
                                {todayArr.map((item, index) => {
                                    if (index < 6) {
                                        return  (
                                            <div onClick={() => this.detailedPage(item)}>
                                                <div className="asset-info unde-line">
                                                    <p><span>{item.desc}</span><span>{item.types === '1' ? '+' : '-'}{item.scalar}</span></p>
                                                    <p><span>{item.crtdate}</span></p>
                                                </div>
                                            </div>
                                        );
                                    }
                                    return '';
                                })}
                                <Button className="see-more" onClick={() => this.setState({exceed: true})}>查看更多</Button>
                            </div>
                        ) : '')}
                        <ListView
                            dataSource={dataSource}
                            initialListSize={temp.pagesize}
                            // renderBodyComponent={() => <ListBody/>}
                            renderRow={row}
                            style={{
                                height: height
                            }}
                            pageSize={temp.pagesize}
                            onEndReachedThreshold={10}
                            onEndReached={this.onEndReached}
                            renderFooter={() => ListFooter(hasMore)}
                        />
                    </div>
                </div>
                <div className="cash-bg"/>
            </div>
        );
    }

    render() {
        const {editModal} = this.state;
        const row = item => (
            <div onClick={() => this.myincomeJump(item)}>
                <div className="asset-info">
                    <p><span>{item.crtdate}</span></p>
                    <p><span>收款{item.num}笔</span><p className="total-money-icom"><i className="small">￥</i><span className="total_price">{item.total_price}</span></p></p>
                </div>
            </div>
        );
        return (
            <React.Fragment>
                {editModal === 'myIncome' && <Myincome getBackChange={this.getBackChange} {...this.state}/>}
                {editModal === 'detail' && <Detailpage getBackChange={this.getBackChange} {...this.state}/>}
                {editModal === 'income' && <Income getBackChange={this.getBackChange}/>}
                {!editModal && this.defaultModel(row)}
            </React.Fragment>
        );
    }
}
