/*
* 店铺页面
* */
import {connect} from 'react-redux';
import {baseActionCreator as actionCreator} from '../../../redux/baseAction';
import ShowButton from '../top-show-button';
import './ShopHome.less';

const {urlCfg} = Configs;

const {appHistory, showInfo, TD, goBackModal, nativeCssDiff} = Utils;
const {TD_EVENT_ID} = Constants;
const {MESSAGE: {Feedback}} = Constants;

class ShopHome extends BaseComponent {
    state = {
        visible: false, //右侧按钮显示与否
        shopInfo: []
    };

    componentWillReceiveProps(nextProps) {
        if (process.env.NATIVE) {
            const {id} = nextProps;
            if (id !== this.props.id) {
                this.getList(id);
            }
        }
    }

    componentDidMount() {
        TD.log(TD_EVENT_ID.SHOPPING_CAR.ID, TD_EVENT_ID.SHOPPING_CAR.LABEL.ADD_SHOPPING_CAR);
        const {id, shoppingId} = this.props;
        this.getList(id || shoppingId);
    }

    getList = (id) => {
        this.fetch(urlCfg.storeDetails, {data: {id}})
            .subscribe(res => {
                if (res && res.status === 0) {
                    this.starsShow(res.data.shop_mark);
                    this.setState({
                        shopInfo: res.data
                    });
                }
            });
    }

    //店内搜索
    shopSearch = () => {
        appHistory.push('/search?shopSearch=1');
    }

    //收藏商店
    shopCollextion = () => {
        const {shopInfo} = this.state;
        const {id} = this.props;
        this.fetch(urlCfg.addCollectShop, {data: {shop_id: shopInfo.id, shop_name: shopInfo.shopName}})
            .subscribe(res => {
                if (res && res.status === 0) {
                    showInfo(Feedback.Collect_Success);
                    this.getList(id);
                }
            });
    }

    //取消收藏
    cancelShopCollextion = () => {
        const {shopInfo} = this.state;
        const {id} = this.props;
        this.fetch(urlCfg.cancelCollect, {data: {ids: [shopInfo.collection], type: 2}})
            .subscribe(res => {
                if (res && res.status === 0) {
                    showInfo(Feedback.Cancel_Success);
                    this.getList(id);
                }
            });
    }

    //切换右上角按钮
    handleVisibleChange = (visible) => {
        this.setState({
            visible
        });
    };

    //分享选择项
    dataList = [
        {
            name: 'QQ',
            title: 'QQ'
        },
        {
            name: 'VX',
            title: '微信'
        },
        {
            name: 'PYQ',
            title: '朋友圈'
        },
        {
            name: 'WB',
            title: '微博'
        }
    ].map(obj => ({
        icon: <div className={obj.name}/>,
        title: obj.title
    }));

    //星星显示
    starsShow = (num) => {
        num = num.toString();
        const a = num.slice(0, 1);
        const b = num.slice(2, 3);
        const arr = Array.from({length: a}, (v, k) => k);
        if (Number(b) <= 9 && Number(b) > 0) {
            this.setState({
                half: true
            });
        }
        this.setState({
            starsArr: arr
        });
    }

    //返回
    backAway = () => {
        this.props.setshoppingId('');
        goBackModal();
    };

    render() {
        const {shopModelArr, show} = this.props;
        const {shopInfo, visible, half} = this.state;
        const starsArr = [1, 2, 3, 4, 5];
        return (
            show ? '' : (
                <div className="home-bar">
                    {
                        shopInfo.is_jdshop ? <div className="shade jd-shade"/> : <div className="shade" style={{background: `url(${shopModelArr ? shopModelArr.picurl[0] : 'images/shop-home-bar.png'}) no-repeat`}}/>
                    }

                    <div className={shopInfo.is_jdshop ? 'home-bar-top-jd' : 'home-bar-top'}>
                        <div className="bar-top">
                            {
                                window.isWX ? null : (
                                    <div className="icon bar-icon-left" onClick={this.backAway}/>
                                )
                            }
                            <div className={`home-search ${window.isWX ? 'WXce' : ''}`} onClick={() => { this.shopSearch(shopInfo.id) }}>
                                <div className="icon icon-search"/>
                                <div className="search-title">店内搜索</div>
                            </div>
                            {
                                window.isWX ? null : (
                                    <div className="icon bar-icon-right" onClick={this.handleVisibleChange}>
                                        <ShowButton visible={visible}/>
                                    </div>
                                )
                            }
                        </div>
                        <div className="home-bar-bottom">
                            <div className="home-logo">
                                <img
                                    src={shopInfo && shopInfo.picpath}
                                    onError={(e) => { e.target.src = shopInfo.df_logo }}
                                    alt=""
                                />
                            </div>
                            <div className="home-title">
                                <div className="home-icons">
                                    <span className="text">{shopInfo && shopInfo.shopName}</span>
                                    {//确定是京东商品就展示星星
                                        (shopInfo.is_jdshop && shopInfo.shoper_open_status !== '0' && starsArr) ? starsArr.map((item, index) => <div key={item} className="icon icon-tiny"/>) : ''
                                    }
                                    {
                                        (shopInfo.is_jdshop && shopInfo.shoper_open_status !== '0' && half) ? <div className="icon icon-ban"/> : ''
                                    }
                                    {/* <span style={{color: '@duckling-yellow'}}>{shopInfo.shop_mark}分</span> */}
                                </div>
                                {
                                    !shopInfo.is_jdshop && (//不是京东商品就展示
                                        <div className="home-text">
                                            {/*<span className="text">{shopInfo && shopInfo.shopName}</span>*/}
                                            <span className="text-num">人均消费 ￥{shopInfo && shopInfo.conper}元</span>
                                            {
                                                shopInfo && shopInfo.shoper_open_status === '0' && <span className="reatIng">休息中</span>
                                            }
                                        </div>
                                    )
                                }
                            </div>
                            {
                                shopInfo && shopInfo.collection > 0
                                    ? (
                                        <div className="collection" style={{border: nativeCssDiff() ? '1PX solid #fff' : '0.02rem solid #fff'}} onClick={this.cancelShopCollextion}>
                                            <span>取消收藏</span>
                                        </div>
                                    )
                                    : (
                                        <div className="collection" style={{border: nativeCssDiff() ? '1PX solid #fff' : '0.02rem solid #fff'}} onClick={this.shopCollextion}>
                                            <span>+收藏</span>
                                        </div>
                                    )
                            }
                        </div>
                    </div>
                </div>
            )
        );
    }
}

const mapStateToProps = state => {
    const base = state.get('base');
    return {
        shoppingId: base.get('shoppingId')
    };
};

const mapDispatchToProps = {
    setshoppingId: actionCreator.setshoppingId
};

export default connect(mapStateToProps, mapDispatchToProps)(ShopHome);
