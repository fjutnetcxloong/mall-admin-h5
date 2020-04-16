import {Carousel, Popover, Icon} from 'antd-mobile';

import './index.less';
import {urlCfg} from '../../../../../../configs/urlCfg';

const {
    goBackModal,
    showSuccess,
    appHistory,
    native,
    showInfo,
    getUrlParam
} = Utils;
const Item = Popover.Item;
const myImg = src => (
    <img
        src={require(`../../../../../../assets/images/${src}`)}
        className="am-icon am-icon-xs"
    />
);

export default class CShareCard extends BaseComponent {
    constructor(props) {
        super(props);
        this.state = {
            visible: false, //控制右上角三个点的显隐
            starsArr: [], //星星的储存
            half: false, //是否有半星
            dataAll: {} //所有数据
        };
    }

    componentDidMount() {
        const no = decodeURI(
            getUrlParam('cardNo', encodeURI(this.props.location.search))
        );
        this.getInfoData(no === 'null' ? '' : no);
    }

    //获取数据
    getInfoData = no => {
        this.fetch(urlCfg.cardDetail, {
            data: {card_no: no}
        }).subscribe(res => {
            if (res.status === 0) {
                res.data.firstPr = res.data.first_pr;
                res.data.otherPr = res.data.other_pr;
                this.starsShow(res.data.shop.shop_mark);
                this.setState({
                    dataAll: res.data
                });
            }
        });
    };

    //切换右边tab是否显示
    handleVisibleChange = visible => {
        this.setState({
            visible
        });
    };

    //分享按钮
    popover = () => (
        <Popover
            onSelect={opt => this.onSelect(opt)}
            visible={this.state.visible}
            onVisibleChange={this.handleVisibleChange}
            overlay={[
                <Item key="1" icon={myImg('family.svg')}>
                    <p>首页</p>
                </Item>,
                <Item key="2" icon={myImg('star.svg')}>
                    收藏
                </Item>, //产品说C端屏蔽了
                !window.isWX && (
                    <Item key="3" icon={myImg('shop-cart.svg')}>
                        购物车
                    </Item>
                ),
                !window.isWX && (
                    <Item key="4" icon={myImg('info.svg')}>
                        <p>消息</p>
                    </Item>
                )
            ]}
        >
            <Icon type="ellipsis"/>
        </Popover>
    );

    //右侧按钮点击
    onSelect = opt => {
        if (opt.key === '2') {
            appHistory.push('/collect'); //收藏页面
        } else if (opt.key === '1') {
            if (process.env.NATIVE) {
                native('goHome');
                appHistory.reduction(); //重置路由
            } else {
                appHistory.push('/home');
            }
        } else if (opt.key === '3') {
            if (process.env.NATIVE) {
                native('goShop');
                appHistory.reduction(); //重置路由
            } else {
                appHistory.push('/shopCart');
            }
        } else if (opt.key === '4') {
            if (process.env.NATIVE) {
                const obj = {'': ''};
                native('goToIm', obj);
            } else {
                showInfo('im');
            }
        } else if (opt.key === '5') {
            appHistory.push('/invitation?share=1'); //分享页面
        }
    };

    //星星显示
    starsShow = num => {
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
    };

    //进店逛逛
    goToShoper = id => {
        if (id) {
            appHistory.push(`/shopHome?id=${id}`);
        }
    };

    //前往商品详情页
    goToGoods = id => {
        if (id) {
            appHistory.push(`/goodsDetail?id=${id}`);
        }
    };

    //立即领取
    getTheCard = (no, id) => {
        this.fetch(urlCfg.reciveCard, {data: {card_no: no}}).subscribe(
            res => {
                if (res.status === 0) {
                    showSuccess(res.message);
                    setTimeout(() => {
                        this.goToGoods(id);
                    }, 1000);
                }
            }
        );
    };

    render() {
        const {
            starsArr,
            half,
            dataAll: {shop, card, firstPr, otherPr}
        } = this.state;
        return (
            <div className="cshare-wrap">
                <div className="header">
                    <div
                        onClick={() => this.goToGoods(firstPr && firstPr.pr_id)}
                    >
                        <Carousel autoplay infinite>
                            <img src={firstPr && firstPr.picpath}/>
                        </Carousel>
                    </div>
                    <div>
                        <span className="go-back icon" onClick={goBackModal}/>
                        <span className="more icon">{this.popover()}</span>
                    </div>
                </div>
                <div className="cshare-main">
                    <div
                        className="cshare-pirce"
                        onClick={() => this.goToGoods(firstPr && firstPr.pr_id)}
                    >
                        <div className="main-price-info">
                            <span className="main-symbol">￥</span>
                            <span className="main-pirce">
                                {firstPr && firstPr.pre_price}
                            </span>
                            <span className="main-pirce-name">优惠价</span>
                            <span className="main-old-pirce">
                                原价：<span>￥{firstPr && firstPr.pr_price}</span>
                            </span>
                        </div>
                        <div className="main-volume">
                            C米：{firstPr && firstPr.deposit}
                        </div>
                    </div>
                    <p
                        className="goods-describe"
                        onClick={() => this.goToGoods(firstPr && firstPr.pr_id)}
                    >
                        {firstPr && firstPr.title}
                    </p>
                    <div className="coupon">
                        <div>
                            <span className="detail-money">
                                {card && card.card_price}
                            </span>
                            <span className="detail-title">元优惠券</span>
                            <p>{card && card.term_validity}</p>
                        </div>
                        <span
                            className="get-right-now"
                            onClick={() => this.getTheCard(
                                card && card.card_no,
                                shop && shop.shop_id
                            )
                            }
                        >
                            立即领取
                        </span>
                    </div>
                    <div className="cshare-shop">
                        <div className="shop-info">
                            <img src={shop && shop.logo}/>
                            <span className="shop-name">
                                {shop && shop.name}
                            </span>
                            <div className="shop-start">
                                {starsArr.length
                                    ? starsArr.map(item => (
                                        <div
                                            key={item}
                                            className="icon icon-tiny"
                                        />
                                    ))
                                    : ''}
                                {half && <div className="icon icon-ban"/>}
                            </div>
                        </div>
                        <div
                            className="go-to-shop"
                            onClick={() => this.goToShoper(shop && shop.shop_id)
                            }
                        >
                            进店逛逛
                        </div>
                    </div>
                </div>
                <div className="cshare-goods">
                    <div className="some-desceribe">
                        <span/>
                        <p>该优惠券还适用以下商品</p>
                        <span/>
                    </div>
                    <div className="goods">
                        {otherPr
                            && otherPr.map(item => (
                                <div
                                    className="some-goods"
                                    onClick={() => this.goToGoods(item.pr_id)}
                                    key={item.pr_id}
                                >
                                    <img src={item.picpath}/>
                                    <p>{item.title}</p>
                                    <span className="goods-volume">￥</span>
                                    <span className="goods-money">
                                        {item.pr_price}
                                    </span>
                                </div>
                            ))}
                    </div>
                </div>
            </div>
        );
    }
}
