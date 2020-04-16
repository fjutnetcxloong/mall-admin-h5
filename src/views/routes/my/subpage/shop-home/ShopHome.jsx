/**
 * 我的店铺
 */
import {ListView, PullToRefresh} from 'antd-mobile';
import {connect} from 'react-redux';
import {dropByCacheKey} from 'react-router-cache-route';
import ShopHomes from '../../../../common/shop-home-nav/ShopHome';
import {baseActionCreator as actionCreator} from '../../../../../redux/baseAction';
import {ShopFooter} from '../../../../common/shop-footer/ShopFooter';
import ShopHomeOne from './shop-home-index-one/ShopHomeIndex';
import ShopHomeTwo from './shop-home-index-two/ShopHomeIndexTwo';
import ShopHomeThird from './shop-home-index-third/ShopHomeIndexThird';
import ShopHomeFour from './shop-home-index-four/ShopHomeIndexFour';
import ShopHomeFive from './shop-home-index-five/ShopHomeIndexFive';
import ShopHomeDetail from './shop-modal/ShopHomeDetail';
import LazyLoadIndex from '../../../../common/lazy-load/LazyLoad';
import Top from '../../../../common/top/Top';
import Nothing from '../../../../common/nothing/Nothing';
import Animation from '../../../../common/animation/Animation';
import ShopEnvlope from '../../../../common/shop-envelope';
import {ListFooter} from '../../../../common/list-footer';
import './ShopHome.less';

const {FIELD} = Constants;
const {urlCfg} = Configs;
const {appHistory, getUrlParam, showInfo, native, showSuccess, moneyDot} = Utils;

const heightArr = [
    3.5, //( (115+50)*2+20 )/100
    2.5, //( 115*2+20 )/100
    4.4 //( (115+50)*2+20 + 90)/100
];//商品列表高度集合

class ShopHome extends BaseComponent {
    constructor(props) {
        super(props);
        const dataSource = new ListView.DataSource({
            rowHasChanged: (row1, row2) => row1 !== row2
        });
        this.temp = {
            stackData: [],
            pagesize: 5
        };
        this.state = {
            dataSource,
            height: document.documentElement.clientHeight - (window.isWX ? window.rem * 2.7 : window.rem * heightArr[0]), //如果有优惠券信息就变成4.3
            page: 1,
            pageCount: -1,
            currentState: decodeURI(getUrlParam('business', encodeURI(props.location.search))) === '1' ? 'business' : '', //判断当前点击状态对应的页面展示
            refreshing: false,
            modelShow: false, //判断有无模板
            hasPage: true, //有无更多数据
            lat: '',
            lon: '',
            hasMore: true, //底部请求状态文字显示情况
            business: decodeURI(getUrlParam('business', encodeURI(props.location.search))) === '1', //表示从发现页面过来的，需要直接展示商家信息
            shopCardShow: false, //是否显示红包列表
            isJingDong: false, //判断是否是京东商品过来的
            isCardShow: false, // 是否有红包可以领取
            cardData: [] //红包储存
        };
    }

    componentDidMount() {
        const shoppingId = decodeURI(getUrlParam('id', encodeURI(this.props.location.search)));
        this.getShop(shoppingId);
        this.getShopModel(shoppingId);
    }

    //计算商品列的高度
    calculationHeight = (wx = 2.7, h) => document.documentElement.clientHeight - (window.isWX ? window.rem * wx : window.rem * h)

    componentWillReceiveProps(prevProps, prevState) {
        if (process.env.NATIVE) {
            const shoppingId = decodeURI(getUrlParam('id', encodeURI(this.props.location.search)));
            const nextId = decodeURI(getUrlParam('id', encodeURI(prevProps.location.search)));
            if (shoppingId !== nextId) {
                this.getShop(nextId);
                this.getShopModel(nextId);
            }
        }
    }

    //获取模板信息
    getShopModel = (id) => {
        this.fetch(urlCfg.shopModel, {data: {shop_id: id}})
            .subscribe(res => {
                if (res && res.status === 0) {
                    //判断有无模板
                    this.setState({
                        currentState: res.data ? 'homePage' : 'modal',
                        shopModelArr: res.data,
                        modelShow: !!res.data
                    });
                }
            });
    }

    //获取商店内的所有商品
    getShop = (id, noShowLoading = false) => {
        const {setshoppingId} = this.props;
        const {page} = this.state;
        setshoppingId(id);
        this.fetch(urlCfg.allGoodsInTheShop, {data: {id, page, pagesize: this.temp.pagesize}}, noShowLoading).subscribe(res => {
            if (res && res.status === 0) {
                const {data} = res;

                if (page === 1) {
                    this.temp.stackData = data.data;
                } else {
                    this.temp.stackData = this.temp.stackData.concat(data.data);
                }

                if (page >= data.page_count) {
                    this.setState({
                        hasMore: false
                    });
                }
                this.setState((prevState) => (
                    {
                        dataSource: prevState.dataSource.cloneWithRows(this.temp.stackData),
                        pageCount: data.page_count,
                        shopOnsInfo: data.shop_info,
                        isJingDong: data.shop_info.is_jdshop === 1,
                        refreshing: false,
                        height: data.shop_info.is_jdshop === 1 ? this.calculationHeight('', heightArr[1]) : this.calculationHeight('', heightArr[0])
                    }
                ), () => {
                    //如果不是京东商品则进行请求，获取红包信息
                    if (data.shop_info.is_jdshop !== 1) {
                        this.getCard(id);
                    }
                });
            }
        });
    }

    //获取红包信息
    getCard = (id) => {
        this.fetch(urlCfg.getCoupon, {data: {type: 2, id}}).subscribe(res => {
            if (res && res.status === 0) {
                res.data.card_list.forEach(item => {
                    item.btnCode = 1; //设置按钮 ， 1为未领取 2为已领取 默认为 1
                });
                this.setState({
                    isCardShow: res.data.card_num > 0,
                    cardData: res.data.card_list,
                    height: res.data.card_num > 0 ? this.calculationHeight('', heightArr[2]) : this.calculationHeight('', heightArr[0])
                });
            }
        });
    }

    //红包，点击立即领取
    getCardProps = (no) => {
        this.fetch(urlCfg.reciveCard, {data: {card_no: no}}, true).subscribe(res => {
            if (res && res.status === 0) {
                showSuccess('领取成功');
                const {cardData} = this.state;
                cardData.forEach(item => {
                    if (item.card_no === no) {
                        item.btnCode = 2;
                    }
                });
                this.setState({
                    cardData: [...cardData]
                });
            }
        });
    }

    //立即使用
    userCard = value => {
        if (value.types === 1) { //如果是商城平台券，则跳转到分类页面
            dropByCacheKey('CategoryListPage');
            appHistory.push(`/categoryList?cardNo=${value.card_id}&title=${'优惠券可用商品'}`);
        } else if (value.types === 3) {
            appHistory.push(`/goodsDetail?id=${value.jump_id}`);
        } else {
            this.setState({
                shopCardShow: false
            });
        }
    }

    //商品详情
    allgoods = (id) => {
        appHistory.push(`/goodsDetail?id=${id}`);
    };

    //模板
    template = (num) => {
        let block = '';
        const {shopModelArr} = this.state;
        switch (num) {
        case '1':
            block = <ShopHomeOne shopModelArr={shopModelArr}/>;
            break;
        case '2':
            block = <ShopHomeTwo shopModelArr={shopModelArr}/>;
            break;
        case '3':
            block = <ShopHomeThird shopModelArr={shopModelArr}/>;
            break;
        case '4':
            block = <ShopHomeFour shopModelArr={shopModelArr}/>;
            break;
        case '5':
            block = <ShopHomeFive shopModelArr={shopModelArr}/>;
            break;
        default:
            block = <Nothing text={FIELD.No_Template} title=""/>;
        }
        return block;
    }

    //上拉刷新
    onEndReached = () => {
        const {page, pageCount, hasMore} = this.state;
        const shoppingId = decodeURI(getUrlParam('id', encodeURI(this.props.location.search)));
        if (!hasMore) return;
        if (pageCount > page) {
            this.setState((pervState) => ({
                page: pervState.page + 1,
                hasMore: true
            }), () => {
                this.getShop(shoppingId);
            });
        } else {
            this.setState({
                hasMore: false
            });
        }
    };

    //下拉加载
    onRefresh = () => {
        const shoppingId = decodeURI(getUrlParam('id', encodeURI(this.props.location.search)));
        this.setState({
            refreshing: true
        }, () => {
            this.getShop(shoppingId, true);
        });
    };

    //切换红包列表是否显示
    changeBox = () => {
        this.setState((prevState) => ({
            shopCardShow: !prevState.shopCardShow
        }));
    }

    //全部商品
    structure = () => {
        const {height, dataSource, refreshing, hasMore, isJingDong, shopCardShow, isCardShow, cardData} = this.state;
        const row = (item) => (
            <div className="goods">
                <div className="goods-name" onClick={() => this.allgoods(item.id)}>
                    <div className="goods-picture">
                        <LazyLoadIndex
                            key={item.picpath}
                            src={item.picpath}
                        />
                    </div>
                    <div className="goods-information">
                        <div className="goods-explain">{item.title}</div>
                        <span className="shop-c">C米：{item.deposit}</span>
                        <div className="payment">
                            <span>销量：{item.num_sold}</span>
                            <span className="payment-r">￥{item.price_original}</span>
                        </div>
                        <div className="price">￥{item.price}</div>
                    </div>
                </div>
            </div>
        );
        const jdRow = (item) => (
            <div className="goods">
                <div className="goods-name" onClick={() => this.allgoods(item.id)}>
                    <div className="goods-picture">
                        <LazyLoadIndex
                            key={item.picpath}
                            src={item.picpath}
                        />
                    </div>
                    <div className="goods-information">
                        <div className="goods-explain">{item.title}</div>
                        <span className="shop-c btn-jd">C米：{item.deposit}</span>
                        <div className="price-jd">￥{moneyDot(item.price)[0]}.<span>{moneyDot(item.price)[1]}</span></div>
                    </div>
                </div>
            </div>
        );
        return (
            <div data-component="shopHome" data-role="page" className="all-merchandise">
                {
                    isCardShow && (
                        <div className="shop-coupon">
                            <div className="tips">
                                <div/>
                                <p>您有优惠券待领取哦！</p>
                            </div>
                            <span className="icon" onClick={this.changeBox}>立即领取</span>
                        </div>
                    )
                }
                <div className="all-goods">
                    {
                        dataSource.getRowCount() > 0 ? (
                            <ListView
                                dataSource={dataSource}
                                initialListSize={this.temp.pagesize}
                                renderRow={isJingDong ? jdRow : row}
                                style={{height}}
                                pageSize={this.temp.pagesize}
                                onEndReachedThreshold={100}
                                onEndReached={this.onEndReached}
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
                                renderFooter={() => ListFooter(hasMore)}
                            />
                        ) : <Nothing text={FIELD.No_Commodity}/>
                    }
                    {
                        shopCardShow && (
                            <ShopEnvlope
                                cardData={cardData}
                                changeBox={this.changeBox}
                                getCardProps={this.getCardProps}
                                userCard={this.userCard}
                            />
                        )
                    }

                </div>
            </div>
        );
    }

    //底部tab
    onTabChange = (data) => {
        const {shopOnsInfo, shopCardShow} = this.state;
        if (shopCardShow && data !== 'category') {
            this.changeBox();
        }
        this.setState({
            business: false
        }, () => {
            let info = '';
            switch (data) {
            case 'category':
                info = 'modal';
                break;
            case 'find':
                info = 'business';
                break;
            case 'shopHome':
                info = 'homePage';
                break;
            default:
                if (process.env.NATIVE) {
                    native('goToShoper', {shopNo: shopOnsInfo.no, id: '', type: '1', shopNickName: shopOnsInfo.nickname, imType: '3', groud: '0'});//groud 为0 单聊，1群聊 imType 1商品2订单3空白  type 1商品 2订单
                } else {
                    showInfo('联系商家');
                }
                break;
            }
            if (data !== 'im') {
                this.setState({
                    currentState: info
                });
            }
        });
    }

    //判断底部显示的状态
    activeFn = (onOff, type) => {
        let str = '';
        if (type === 'business') {
            str = 'find';
        } else if (type === 'modal') {
            str = 'category';
        } else if (onOff) {
            str = 'shopHome';
        } else {
            str = 'category';
        }
        return str;
    }

    render() {
        const {currentState, modelShow, shopModelArr, lat, lon, business, isJingDong} = this.state;
        const shoppingId = decodeURI(getUrlParam('id', encodeURI(this.props.location.search)));
        let blockModel = <div/>;
        if (business) {
            blockModel = <ShopHomeDetail id={shoppingId} lat={lat} lon={lon}/>;
        } else {
            switch (currentState) {
            case 'homePage':
                blockModel = modelShow && this.template(shopModelArr.mol_id);
                break;
            case 'business':
                blockModel = <ShopHomeDetail id={shoppingId} lat={lat} lon={lon}/>;
                break;
            case 'modal':
                blockModel = this.structure();
                break;
            default:
                blockModel = '';
            }
        }
        return (
            <React.Fragment>
                <ShopHomes id={shoppingId} shopModelArr={shopModelArr} show={currentState === 'business' || business}/>
                <Top/>
                {blockModel}
                {
                    !isJingDong && currentState && <ShopFooter onTabChange={(data) => { this.onTabChange(data) }} active={this.activeFn(modelShow, currentState)} haveModalAll={modelShow}/>
                }
            </React.Fragment>
        );
    }
}

const mapStateToProps = state => {
    const base = state.get('base');
    return {
        shoppingId: base.get('shoppingId'),
        shopInfos: base.get('shopInfos'),
        shopModal: base.get('shopModal')
    };
};

const mapDispatchToProps = {
    setshoppingId: actionCreator.setshoppingId
};

export default connect(mapStateToProps, mapDispatchToProps)(ShopHome);
