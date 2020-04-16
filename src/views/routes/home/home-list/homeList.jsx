/*
* 首页tab栏列表
* */
import {ListView, Tabs} from 'antd-mobile';
import {scrollSpy} from 'react-scroll';
import './homeList.less';

const {appHistory, showInfo, systemApi: {getValue, setValue}} = Utils;
const {urlCfg} = Configs;
const {MESSAGE: {Form}} = Constants;

export default class HomeList extends BaseComponent {
    constructor(props) {
        super(props);
        this.goodsData = []; //数据堆，暂存客户列表
        this.exemptionData = []; //包邮商品
        this.hotShopData = []; //星级商店数据
        this.dataSource = new ListView.DataSource({
            rowHasChanged: (row1, row2) => row1 !== row2
        });
        this.exemptionDataSource = new ListView.DataSource({
            rowHasChanged: (row1, row2) => row1 !== row2
        }); //包邮商品
        this.hotShopDataSource = new ListView.DataSource({
            rowHasChanged: (row1, row2) => row1 !== row2
        }); //星级商店
    }

    state = {
        hotGoods: [], //热销商品
        latitude: '', //经纬度
        longitude: '', //经纬度
        exemption: [], //包邮商品
        hotShops: [], //星级商店
        goodsPage: 1, //热销page页
        exPage: 1, //包邮page页
        shopPage: 1, //热门店铺page页
        useBodyScroll: true, // body滚动
        currentIndex: 0, //当前tab索引
        tabStatus: false, // tab头部是否显示状态
        tabTop: 0, // tap头部距离顶部距离
        goodsPageCount: -1, //热销商品页数
        exPageCount: -1, //包邮商品页数
        shopPageCount: -1, //星店商品页数
        hotStatus: false, // 热销商品加载状态
        exStatus: false, // 包邮商品加载状态
        shopStatus: false // 星店加载状态
    }

    componentDidMount() {
        const local = JSON.parse(getValue('local'));
        scrollSpy.mount(document);
        scrollSpy.addSpyHandler(this.handleScroll, document);
        scrollSpy.update();
        this.getGoodsList();
        if (!local) {
            this.getLocation();
        } else {
            this.setState({
                longitude: local.lon,
                latitude: local.lat
            });
        }
        this.getExGoodsList();
        this.getHotShops();
    }

    componentWillUnmount() {
        super.componentWillUnmount();
        scrollSpy.unmount();
    }

    //网页滚动
    handleScroll=(e) => {
        const tabTop = this.tabsList.offsetTop;
        if (e > tabTop) {
            this.setState({
                tabStatus: true
            });
        } else {
            this.setState({
                tabStatus: false
            });
        }
    };

    //获取位置
    getLocation = () => {
        if (window.isWX) {
            window.wx.getLocation({
                type: 'wgs84', // 默认为wgs84的gps坐标，如果要返回直接给openLocation用的火星坐标，可传入'gcj02'
                success: (res) => {
                    this.setState({
                        latitude: res.latitude,
                        longitude: res.longitude
                    }, () => {
                        const {latitude, longitude} = this.state;
                        if (latitude && longitude) {
                            this.getHotShops();
                        } else {
                            showInfo(Form.Feedback.Address_Err);
                        }
                    });
                    setValue('local', JSON.stringify({lon: res.longitude, lat: res.latitude}));
                }
            });
        } else {
            const geolocation = new window.BMap.Geolocation();
            geolocation.getCurrentPosition((res) => {
                setValue('local', JSON.stringify({lon: res.longitude, lat: res.latitude}));
                this.setState({
                    latitude: res.latitude,
                    longitude: res.longitude
                }, () => {
                    const {latitude, longitude} = this.state;
                    if (latitude && longitude) {
                        this.getHotShops();
                    } else {
                        showInfo(Form.Feedback.Address_Err);
                    }
                });
            });
        }
    };

    //获取商品列表
    getGoodsList = (page) => {
        this.fetch(urlCfg.getGoods, {
            data: {
                type: 1,
                select: 0,
                page: page || 1,
                pagesize: 4
            }
        }).subscribe(res => {
            if (res && res.status === 0) {
                this.goodsData = this.goodsData.concat(res.data);
                this.setState(prevState => ({
                    hotGoods: this.goodsData,
                    goodsPage: prevState.goodsPage + 1,
                    goodsPageCount: res.page_count
                }));
            }
        });
    };

    //获取包郵商品列表
    getExGoodsList = (page) => {
        this.fetch(urlCfg.getGoods, {
            data: {
                type: 1,
                select: 1,
                page: page || 1,
                pagesize: 4
            }
        }).subscribe(res => {
            if (res && res.status === 0) {
                this.exemptionData = this.exemptionData.concat(res.data);
                this.setState(prevState => ({
                    exemption: this.exemptionData,
                    exPage: prevState.exPage + 1,
                    exPageCount: res.page_count
                }));
            }
        });
    };

    //获取首页商店
    getHotShops = (page) => {
        const {latitude, longitude} = this.state;
        const local = JSON.parse(getValue('local'));
        this.fetch(urlCfg.getHomeShops, {
            data: {
                type: 2,
                page: page || 1,
                pagesize: 4,
                latitude: (local && local.lat) || latitude,
                longitude: (local && local.lon) || longitude
            }
        }).subscribe(res => {
            this.hotShopData = this.hotShopData.concat(res.data);
            if (res && res.status === 0) {
                this.setState(prevState => ({
                    hotShops: this.hotShopData,
                    shopPage: prevState.shopPage + 1,
                    shopPageCount: res.page_count
                }));
            }
        });
    };

    //tab选项卡点击切换
    tabClick = (tab, index) => {
        this[`listViewCon${index}`] && this[`listViewCon${index}`].scrollTo(0, this.tabsList.offsetTop); // 切换标签的时候滚动回滚到标签顶部
        this.setState({
            currentIndex: index
        });
        if (index === 1) {
            const {exPage, exPageCount} = this.state;
            if (exPage >= exPageCount) {
                return;
            }
            this.getExGoodsList(exPage);
        } else if (index === 2) {
            const {shopPage, shopPageCount} = this.state;
            if (shopPage >= shopPageCount) {
                return;
            }
            this.getHotShops(shopPage);
        } else {
            const {goodsPage, goodsPageCount} = this.state;
            if (goodsPage >= goodsPageCount) {
                return;
            }
            this.getGoodsList(goodsPage);
        }
    };

     //热销商品上拉加载
     goodReached = (e) => {
         const {currentIndex, goodsPageCount} = this.state;
         if (currentIndex === 0) {
             if (this.state.goodsPage > goodsPageCount) {
                 this.setState({
                     hotStatus: true
                 });
                 return;
             }
             const {goodsPage} = this.state;
             this.getGoodsList(goodsPage);
         }
     };

    //包邮商品上拉加载
    exReached = () => {
        const {currentIndex, exPageCount} = this.state;
        if (currentIndex === 1) {
            if (this.state.exPage > exPageCount) {
                this.setState({
                    exStatus: true
                });
                return;
            }
            const {exPage} = this.state;
            this.getExGoodsList(exPage);
        }
    };

    //星店上拉加载
    hotShopReached = () => {
        const {currentIndex} = this.state;
        if (currentIndex === 2) {
            const {shopPage, latitude, longitude, shopPageCount} = this.state;
            if (shopPage > shopPageCount) {
                this.setState({
                    shopStatus: true
                });
                return;
            }
            if (latitude && longitude) {
                this.getHotShops(shopPage);
            }
        }
    };

    //星星评价
    // renderStar = (num) => {
    //     const slot = num.split('.')[1];
    //     const value = Number(num);
    //     const arr = [];
    //     for (let i = 0; i < Math.floor(value); i++) {
    //         const star = <div className="icon icon-star"/>;
    //         arr.push(star);
    //     }
    //     if (slot >= 5) {
    //         const stars = <div className="icon icon-ban"/>;
    //         arr.push(stars);
    //     }
    //     return arr;
    // };

    //跳转商品详情页
    goCate = (id) => {
        appHistory.push(`/goodsDetail?id=${id}`);
    };

    //跳转店铺首页
    goShopHome = (id, lat, lon) => {
        appHistory.push(`/shopHome?id=${id}&lat=${lat}&lon=${lon}`);
    };

    // 底部渲染
    renderFooter = (bool) => (bool ? (<div>我是有底线的</div>) : (<div>正在加载</div>))

    render() {
        const tabs = [
            {title: '热销'},
            {title: '包邮'},
            {title: '星店'}
        ];
        const hotGoodsRow = item => (
            <div className="hot" key={item.rs_id} onClick={(e) => this.goCate(item.rs_id)}>
                <img src={item.picpath} alt={item.title}/>
                <div className="hot-content">
                    <p>{item.title}</p>
                    <span className="tally">C米：{item.deposit}</span>
                    <div className="original">{item.price_ori === '0.00' ?  '' : '￥' + item.price_ori}</div>
                    <div className="current">
                        <span>￥<span>{item.price}</span></span>
                        <span>
                            <span>{item.num_sold}</span>
                            <span>人付款</span>
                        </span>
                    </div>
                </div>
            </div>
        );
        const ex = (item, index) => (
            <div className="hot" key={index.toString()} onClick={(e) => this.goCate(item.rs_id, item)}>
                <img src={item.picpath} alt=""/>
                <div className="hot-content">
                    <p>{item.title}</p>
                    <span className="tally">C米：{item.deposit}</span>
                    <div className="original-box">
                        <div className="original">{item.price_ori === '0.00' ?  '' : '￥' + item.price_ori}</div>
                    </div>
                    <div className="current">
                        <span>￥<span>{item.price}</span></span>
                        <span>
                            <span>{item.num_sold}</span>
                            <span>人付款</span>
                        </span>
                    </div>
                </div>
            </div>
        );
        const shopData = item => (
            <div className="store-items" key={item.id} onClick={() => this.goShopHome(item.id, item.latitude, item.longitude)}>
                <div className="details">
                    <img src={item.picpath} alt=""/>
                    <div className="details-bottom">
                        <p>{item.shopName}</p >
                        <div className="place region">
                            <span>{item.address}</span>
                        </div>
                        <div className="place">
                            <span>{item.distance}km</span>
                        </div>
                    </div>
                </div>
            </div>
        );
        const {hotGoods, exemption, hotShops, useBodyScroll, tabStatus, hotStatus, shopStatus, exStatus} = this.state;
        return (
            <div ref={ref => { this.tabsList = ref }} className={`tabs-list ${tabStatus ? 'fiexd-tabs' : ''}`}>
                <Tabs
                    tabs={tabs}
                    swipeable={false}
                    initialPage={0}
                    onChange={(tab, index) => this.tabClick(tab, index)}
                >
                    <ListView
                        ref={ref => { this[`listViewCon${0}`] = ref }}
                        dataSource={this.dataSource.cloneWithRows(hotGoods)}
                        initialListSize={4}
                        renderFooter={() => this.renderFooter(hotStatus)}
                        renderRow={hotGoodsRow}
                        useBodyScroll={useBodyScroll}
                        onEndReached={this.goodReached}
                    />
                    <ListView
                        ref={ref => { this[`listViewCon${1}`] = ref }}
                        dataSource={this.dataSource.cloneWithRows(exemption)}
                        initialListSize={4}
                        renderFooter={() => this.renderFooter(exStatus)}
                        renderRow={ex}
                        useBodyScroll={useBodyScroll}
                        onEndReachedThreshold={50}
                        onEndReached={this.exReached}
                    />
                    <ListView
                        ref={ref => { this[`listViewCon${2}`] = ref }}
                        dataSource={this.dataSource.cloneWithRows(hotShops)}
                        initialListSize={4}
                        renderRow={shopData}
                        renderFooter={() => this.renderFooter(shopStatus)}
                        useBodyScroll={useBodyScroll}
                        onEndReachedThreshold={50}
                        onEndReached={this.hotShopReached}
                    />
                </Tabs>
            </div>
        );
    }
}
