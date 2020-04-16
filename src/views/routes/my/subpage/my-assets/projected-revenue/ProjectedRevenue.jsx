
/**记账余额 */

import {ListView} from 'antd-mobile';
import AppNavBar from '../../../../../common/navbar/NavBar';
import Detailpage from '../single-page/detailpage';
import {ListFooter} from '../../../../../common/list-footer';
import './ProjectedRevenue.less';


const {urlCfg} = Configs;
export default class MyAssets extends BaseComponent {
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
            height: document.documentElement.clientHeight - (window.isWX ? window.rem * 6.18 : window.rem * 6.3),
            editModal: '', //当前状态
            page: 1,
            pageCount: -1,
            hasMore: false //底部加载状态
        };
    }

    componentDidMount() {
        this.getAssetList();
    }

    getAssetList = () => {
        this.temp.isLoading = true;
        const {page} = this.state;
        this.setState({
            hasMore: true
        }, () => {
            this.fetch(urlCfg.myListOfAssets, {data: {page,  pagesize: this.temp.pagesize, tp: 2}})
                .subscribe(res => {
                    this.temp.isLoading = false;
                    if (res && res.status === 0) {
                        if (page === 1) {
                            this.temp.stackData = res.data.data;
                        } else {
                            this.temp.stackData = this.temp.stackData.concat(res.data.data);
                        }
                        if (page >= res.data.page_count) {
                            this.setState({
                                hasMore: false
                            });
                        }
                        this.setState((prevState) => ({
                            dataSource: prevState.dataSource.cloneWithRows(this.temp.stackData),
                            pageCount: res.data.page_count,
                            shopInfo: res.data
                        }));
                    }
                });
        });
    }

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
                this.getAssetList();
            });
        }
    };

    //底部结构
    defaultModel = (row) => {
        const {dataSource, height, hasMore, shopInfo} = this.state;
        return (
            <div data-component="cash" data-role="page" className="cash">
                <div className="cash-content">
                    {
                        window.isWX ? (<AppNavBar title="记账余额"/>) : (
                            <div className="cash-content-navbar">
                                <AppNavBar
                                    goBackModal={this.props.getBackChange}
                                    title="记账余额"
                                    rightShow
                                />
                            </div>
                        )
                    }
                    <div className="cash-content-tabs">
                        <img src={require('../../../../../../assets/images/banner.png')}/>
                    </div>
                    <div className="asset-info-wrap">
                        <div className="altogether">
                            <div className="altogether-name a-equally">
                                <span>{shopInfo && shopInfo.realname}</span>
                                <span>总余额</span>
                            </div>
                            <div className="altogether-UID a-equally">
                                <span>UID:{shopInfo && shopInfo.uid}</span>
                                <div><span className="price">{shopInfo && shopInfo.money}</span><span>元</span></div>
                            </div>
                        </div>
                        <div>
                            {
                                dataSource.getRowCount() > 0 ? (
                                    <ListView
                                        dataSource={dataSource}
                                        initialListSize={this.temp.pagesize}
                                        // renderBodyComponent={() => <ListBody/>}
                                        renderRow={row}
                                        style={{
                                            height: height
                                        }}
                                        pageSize={this.temp.pagesize}
                                        onEndReachedThreshold={20}
                                        onEndReached={this.onEndReached}
                                        renderFooter={() => ListFooter(hasMore)}
                                    />
                                ) : ''
                            }
                        </div>
                    </div>
                </div>
                <div className="cash-bg"/>
            </div>
        );
    }

    render() {
        const row = (item) => (
            <div onClick={() => this.detailedPage(item)}>
                <div className="asset-info unde-line">
                    <p><span>{item.desc}</span><span>{item.types === '1' ? '+' : '-'}{item.scalar}</span></p>
                    <p><span>{item.crtdate}</span><span>余额：{item.remain}</span></p>
                </div>
            </div>
        );
        const {editModal} = this.state;
        return (
            <React.Fragment>
                {editModal === 'detail' && <Detailpage getBackChange={this.getBackChange} {...this.state}/>}
                {!editModal && this.defaultModel(row)}
            </React.Fragment>
        );
    }
}
