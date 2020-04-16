/*
* 首页
* */
import {connect} from 'react-redux';
import {Carousel, Grid, SearchBar, Toast} from 'antd-mobile';
import {dropByCacheKey} from 'react-router-cache-route';
import {systemApi} from '../../../utils/systemApi';
import {FooterBar} from '../../common/foot-bar/FooterBar';
import {baseActionCreator as actionCreator} from '../../../redux/baseAction';
import {myActionCreator as ActionCreator} from '../my/actions/index';
import {homeActionCreator} from './actions/index';
import HomeList from './home-list/homeList';
import CouponOne from './CouponOne';
import CouponTwo from './CouponTwo';
import './Home.less';


const {TD_EVENT_ID, LOCALSTORAGE} = Constants;
const {urlCfg, appCfg} = Configs;
const {appHistory, TD, systemApi: {setValue}} = Utils;
class Home extends BaseComponent {
    constructor(props, context) {
        super(props, context);
    }

    state = {
        showPopup: false,
        userToken: '',
        pages: [],
        show: false,
        show1: false,
        goodStuff: [],
        pouponOneStatus: false, // 控制优惠券1显示隐藏
        pouponTwoStatus: false, // 控制优惠券1显示隐藏
        pouponText: [], // 优惠券右侧文字
        couponList: {}, // 优惠券数据
        getStatus: false || [], // 优惠券领取状态
        cardNo: []
    };

    componentWillMount() {
        dropByCacheKey('CategoryListPage');
    }

    componentDidMount() {
        const {showMenu, setOrder, userToken, getNav, getBanner} = this.props;
        this.setState({
            userToken: systemApi.getValue('userToken')
        });
        TD.log(TD_EVENT_ID.HOME.ID, TD_EVENT_ID.HOME.LABEL.LOOK_HOME);
        setOrder(null);
        showMenu(false);
        getBanner();
        getNav();
        if (window.isWX && !userToken) {
            this.login();
        }
        this.goodStuff();
        this.getCoupon();
    }

    componentWillUnmount() {
        super.componentWillUnmount();
        const {showMenu} = this.props;
        showMenu(true);
    }

    // 判断是否是登录状态 如果不是前往登录
    goToLogin = () => {
        const {userToken} = this.props;
        if (userToken && userToken.length > 0) {
            return;
        }
        appHistory.push('/login');
    };

    //微信跳转 跳转登陆
    login() {
        return this.fetch(urlCfg.login, {
            data: {
                token: appCfg.wxToken,
                code: this.props.code,
                type: 0
            }
        })
            .subscribe((res) => {
                if (res) {
                    if (res.status === 0) {
                        const {setUserToken} = this.props;
                        setUserToken(res.LoginSessionKey);
                        setValue(LOCALSTORAGE.USER_TOKEN, res.LoginSessionKey);
                    }
                }
            }, err => {
                Toast.info(err.message);
            });
    }

    //跳转分类列表
    goToCategory = (el, index) => {
        TD.log(TD_EVENT_ID.HOME.ID, TD_EVENT_ID.HOME.LABEL.LOOK_MAIN_CLASSIFY);
        // console.log(TD);
        if (index === 9) {
            appHistory.push({pathname: '/category'});
        } else {
            appHistory.push({pathname: `/categoryList?id=${el.id}&title=${el.text}&keywords=${''}&flag=${false}`});
        }
    };

    //有好货
    goodStuff = () => {
        this.fetch(urlCfg.getHomeGoods)
            .subscribe((res) => {
                if (res) {
                    TD.log(TD_EVENT_ID.HOME.ID, TD_EVENT_ID.HOME.LABEL.LOOK_AREA);
                    if (res.status === 0) {
                        this.setState({
                            goodStuff: res.data
                        });
                    }
                }
            });
    }

    //扫一扫
    lookLook = () => {
        const {userToken} = this.props;
        if (window.isWX) {
            window.wx.ready(() => {
                window.wx.scanQRCode({
                    needResult: 0, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
                    scanType: ['qrCode', 'barCode'] // 可以指定扫二维码还是一维码，默认二者都有
                });
            });
        } else {
            if (userToken && userToken.length > 0 && !window.isWX) {
                return;
            }
            if (!userToken) {
                appHistory.push('/login');
            }
        }
    };

    //跳转到搜索页面
    gotoSearch = () => {
        appHistory.push({pathname: '/search'});
    };

    // 跳转商品详情
    switchTo = (item) => {
        appHistory.push(`/goodsDetail?id=${item.id1}`);
    };

    //有推荐跳转
    jumpOther = (id, index, shopId) => {
        if (index === 0) {
            appHistory.push(`/shopHome?id=${id}`);
        } else {
            appHistory.push(`/goodsDetail?id=${id}&shopId${shopId}`);
        }
    }

    onClose = () => {
        this.setState({
            pouponOneStatus: false
        });
    }

    onCloseTwo = () => {
        this.setState({
            pouponTwoStatus: false
        });
    }

    // 获取优惠券
    getCoupon = () => {
        // const {setCoupon} = this.props;
        this.fetch(urlCfg.getCoupon, {data: {type: 0}}).subscribe(res => {
            if (res && res.status === 0) {
                // setCoupon(res.data);
                this.setState({
                    couponList: res.data,
                    pouponOneStatus: res.data && res.data.card_num === 1,
                    pouponTwoStatus: res.data && res.data.card_num > 1,
                    getStatus: res.data && res.data.card_num > 1 ?  Array.from({length: res.data.card_num}).fill(false) : false,
                    pouponText: res.data && res.data.card_num > 1 ?  Array.from({length: res.data.card_num}).fill('立即领取') : '立即领取'
                });
            }
        });
    }

    //领取优惠券
    reciveCard = (no, index, id, type) => {
        const {userToken, cardNo} = this.state;

        if (!userToken) {
            appHistory.push('/login');
        }

        const {getStatus, pouponText} = this.state;
        if (getStatus[index]) {
            if (type && type === '2') {
                appHistory.push(`/goodsDetail?id=${id}`);
            } else if (type && type === '1') {
                appHistory.push(`/categoryList?flag=${''}&keywords=${''}&id=${''}&cardId=${cardNo}&title=${'优惠券适用商品'}`);
            }
            return;
        }
        const status = [...getStatus];
        const text = [...pouponText];
        this.fetch(urlCfg.reciveCard, {data: {card_no: no}}).subscribe(res => {
            if (res && res.status === 0) {
                this.setState(pre => {
                    status.splice(index, 1, true);
                    text.splice(index, 1, '立即使用');
                    return {
                        getStatus: status,
                        pouponText: text,
                        cardNo: res.data.card_id
                    };
                });
                Toast.info('优惠券领取成功', 1);
            }
        });
    }

    // appHistory.push(`/categoryList?flag=${true}&keywords=${encodeURIComponent(keywords)}&id=${''}`);
    getCoup =(no) => {
        this.fetch(urlCfg.reciveCard, {data: {card_no: no}}).subscribe(res => {
            if (res && res.status === 0) {
                // Toast('优惠券领取成功', 1);
                this.setState({
                    pouponOneStatus: false
                });
                Toast.info('优惠券领取成功', 1);
            }
        });
    }

    render() {
        const {goodStuff, pouponOneStatus, pouponText, pouponTwoStatus, couponList, getStatus} = this.state;
        const {userToken, logo, banner, nav} = this.props;
        return (
            <div className="home">
                <div className="home-main">
                    <div className="home-content">
                        <div className="home-searchBar">
                            <div>
                                {
                                    window.isWX || (userToken && userToken.length > 0) ? null : (
                                        <div className="icon-right icon" onClick={this.goToLogin}/>
                                    )
                                }
                            </div>
                            <div className={`home-searchBar-fence ${userToken && userToken.length > 0 ? 'search-login' : ''}`} style={{color: '@white'}}>
                                <SearchBar
                                    placeholder="输入您要搜索的商品"
                                    showCancelButton
                                    cancelText=" "
                                    onFocus={this.gotoSearch}
                                />
                            </div>
                            {
                                userToken && userToken.length > 0 ? (
                                    <div className="home-searchBar-icon">
                                        {!window.isWX && (<div className="icon msg"/>)}
                                        <div className="icon qrcode" onClick={this.lookLook}/>
                                    </div>
                                ) : (
                                    <div className="home-searchBar-icon" onClick={this.lookLook}>
                                        <div className="icon information"/>
                                    </div>
                                )
                            }
                        </div>
                        {/* <WhiteSpace/> */}

                        {
                            banner && (
                                <div className="home-banner">
                                    <Carousel
                                        infinite
                                    >
                                        {banner.map((item) => (
                                            <div key={item}>
                                                <img
                                                    src={item}
                                                    className="banner-img"
                                                />
                                            </div>
                                        ))}
                                    </Carousel>
                                </div>
                            )
                        }
                        {/* <WhiteSpace size="xl"/> */}
                        {
                            nav && (
                                <div className="home-nav">
                                    <Grid
                                        data={nav.map((item) => ({icon: item.img_url, text: item.cate_name, id: item.id1}))}
                                        activeStyle
                                        columnNum={5}
                                        square
                                        hasLine={false}
                                        onClick={(el, idx) => this.goToCategory(el, idx)}
                                    />
                                </div>
                            )
                        }
                        {/* <WhiteSpace/> */}
                        {
                            logo && (
                                <div className="home-logo">
                                    <img src={logo} alt=""/>
                                </div>
                            )
                        }
                        {/* <WhiteSpace/> */}
                        {/* <WhiteSpace/> */}
                        <div className="recommend">
                            <div className="edge-style"/>
                            <ul>
                                {
                                    goodStuff && goodStuff.map((item, index) => (
                                        <li key={index.toString()}>
                                            <p className="list-title">{item.title}</p>
                                            <p className="list-desc">
                                                <span>{item.intro.split(' ')[0]}</span>
                                                <span>{item.intro.split(' ')[1]}</span>
                                            </p>
                                            <div className="img-box">
                                                {
                                                    item.data.map((value, i) => (
                                                        <div className="show-img" key={i.toString()} onClick={() => this.jumpOther(value.rs_id, index, value.rs_id)}>
                                                            <img src={value.picpath} alt=""/>
                                                        </div>
                                                    ))
                                                }
                                            </div>
                                        </li>
                                    ))
                                }
                            </ul>
                        </div>
                    </div>
                    <HomeList/>
                    <CouponOne
                        pouponOneStatus={pouponOneStatus}
                        onClose={this.onClose}
                        title={couponList && couponList.title}
                        couponList={couponList && couponList.card_list}
                        getCoup={this.getCoup}
                    />
                    <CouponTwo
                        pouponText={pouponText}
                        onCloseTwo={this.onCloseTwo}
                        pouponTwoStatus={pouponTwoStatus}
                        couponList={couponList && couponList.card_list}
                        reciveCard={this.reciveCard}
                        getStatus={getStatus}
                    />
                </div>
                <FooterBar active="home"/>
            </div>
        );
    }
}


const mapStateToProps = state => {
    const base = state.get('base');
    const home = state.get('home');
    return {
        code: base.get('code'),
        userToken: base.get('userToken'),
        banner: home.get('banner'),
        logo: home.get('logo'),
        nav: home.get('nav'),
        coupon: home.get('coupon')
    };
};

const mapDispatchToProps = {
    setUserToken: actionCreator.setUserToken,
    showMenu: actionCreator.showMenu,
    setOrder: ActionCreator.setOrderInformation,
    getBanner: homeActionCreator.getBanner,
    getNav: homeActionCreator.getNav,
    setCoupon: homeActionCreator.setCoupon
};

export default connect(mapStateToProps, mapDispatchToProps)(Home);
