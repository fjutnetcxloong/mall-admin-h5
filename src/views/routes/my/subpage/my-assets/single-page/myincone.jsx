//**当日收入 */
import {ListView, PullToRefresh} from 'antd-mobile';
import Detailpage from './detailpage';
import AppNavBar from '../../../../../common/navbar/NavBar';
import Animation from '../../../../../common/animation/Animation';
import {ListFooter} from '../../../../../common/list-footer';
import './index.less';

const {urlCfg} = Configs;
export default class Myincone extends BaseComponent {
    constructor(props, context) {
        super(props, context);
        const dataSource = new ListView.DataSource({
            rowHasChanged: (row1, row2) => row1 !== row2
        });
        this.temp = {
            stackData: [],
            isLoading: true,
            pagesize: 10
        };
        this.state = {
            dataSource,
            hasMore: false,
            height: document.documentElement.clientHeight - (window.isWX ? window.rem : window.rem * 1),
            editModal: '',
            page: 1
        };
    }

    componentDidMount() {
        this.getReserve();
    }

    //我的收入
    getReserve = (noLoading = false) => {
        this.temp.isLoading = true;
        const {currentData: {crtdate}, statusNum, noClick} = this.props;
        const {page} = this.state;
        //判断是我的收入过来的还是预算收益过来的

        this.setState({
            hasMore: true
        }, () => {
            this.fetch(noClick ? urlCfg.budgetaryRevenue : urlCfg.dailyIncome, {
                data: {types: noClick ? '' : statusNum, page, pagesize: this.temp.pageSize, time: crtdate}}, noLoading)
                .subscribe(res => {
                    this.temp.isLoading = false;
                    this.setState({
                        hasMore: false
                    });
                    if (res && res.status === 0) {
                        if (page === 1) {
                            this.temp.stackData = res.data.today_data;
                        } else {
                            this.temp.stackData = this.temp.stackData.concat(res.data.today_data);
                        }
                        if (page >= res.data.page_count) {
                            this.setState({
                                hasMore: false
                            });
                        }
                        this.setState((prevState) => ({
                            dataSource: prevState.dataSource.cloneWithRows(this.temp.stackData),
                            pageCount: res.data.page_count,
                            dataMoney: res.data.date
                        }));
                    }
                });
        });
    }

    //跳转详情页
    detailedPage = (data) => {
        this.setState({
            editModal: 'detail',
            currentData: data
        });
    }

    getBackChange = () => {
        this.setState({
            editModal: ''
        });
    }

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
                this.getReserve();
            });
        }
    };

    //下拉刷新
    onRefresh = () => {
        this.setState({
            page: 1,
            hasMore: true,
            pageCount: -1
        }, () => {
            this.temp.stackData = [];
            this.getReserve(true);
        });
    };

    //标题名称
    titleShowEnd = () => {
        const {statusNum} = this.props;
        const {dataMoney} = this.state;
        let str = '';
        switch (statusNum) {
        case '4':
            str = '业务转入';
            break;
        case '6':
            str = '营业收入';
            break;
        default:
            str = dataMoney;
        }
        return str;
    }

    //底部结构
    defaultModal = (row) => {
        const {navTtile} = this.props;
        const {dataSource, height, hasMore, refreshing} = this.state;
        return (
            <div data-component="cash" data-role="page" className="cash">
                <div className="cash-content">
                    <div className="cash-content-navbar">
                        <AppNavBar
                            goBackModal={() => this.props.getBackChange()}
                            title={navTtile || '当日收入'}
                        />
                    </div>
                    <ListView
                        dataSource={dataSource}
                        initialListSize={this.temp.pageSize}
                        // renderBodyComponent={() => <ListBody/>}
                        renderRow={row}
                        style={{
                            height
                        }}
                        pageSize={this.temp.pageSize}
                        onEndReachedThreshold={20}
                        onEndReached={this.onEndReached}
                        renderFooter={() => ListFooter(hasMore)}
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
                <div className="cash-bg"/>
            </div>
        );
    }

    render() {
        const {editModal} = this.state;
        const {noClick} = this.props;
        const row = (item) => (
            <div className="asset-info-wrap" onClick={noClick ? '' : () => this.detailedPage(item)}>
                <div className="asset-info unde-line">
                    <p><span>{item.desc}</span><span>{item.types === '1' ? '+' : '-'}{item.scalar}</span></p>
                    <p><span>{item.crtdate}</span><span>余额: {item.remain}</span></p>
                </div>
            </div>
        );
        const row2 = (item) => (
            <div className="asset-info-wrap" onClick={noClick ? '' : () => this.detailedPage(item)}>
                <div className="asset-info unde-line">
                    <p><span>{item.desc}</span><span className="no-end">{item.types === '1' ? '+' : '-'}{item.scalar}</span></p>
                    <p><span>{item.crtdate}</span></p>
                </div>
            </div>
        );
        return (
            <React.Fragment>
                {!editModal && this.defaultModal(noClick ? row2 : row)}
                {editModal === 'detail' && <Detailpage getBackChange={this.getBackChange} {...this.state}/>}
            </React.Fragment>
        );
    }
}
