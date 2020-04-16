import PropTypes from 'prop-types';
import './Evaluate.less';

export default class Evaluate extends React.PureComponent {
    static propTypes = {
        Element: PropTypes.func.isRequired,
        names: PropTypes.array,
        goodsDetail: PropTypes.object.isRequired,
        shop: PropTypes.object.isRequired,
        evalute: PropTypes.object.isRequired,
        shopH: PropTypes.func.isRequired,
        openSku: PropTypes.func.isRequired,
        routeToEvalute: PropTypes.func.isRequired,
        hasType: PropTypes.bool.isRequired,
        isZM: PropTypes.bool.isRequired,
        openCoupon: PropTypes.func.isRequired,
        createStar: PropTypes.func.isRequired,
        returnLev: PropTypes.func.isRequired,
        max: PropTypes.number
    }

    static defaultProps = {
        names: [],
        max: null
    };

    render() {
        const {Element, openCoupon, names, isZM, max, goodsDetail, shop, shopH, openSku, hasType, evalute, routeToEvalute, createStar, returnLev} = this.props;
        return (
            <Element name="evaluate" className="goods-shop">
                {goodsDetail.app_type !== '3' && (
                    <div className="framing">
                        <div className="goods-select" onClick={openSku}>
                            <div className="select-left">
                                <div className="chose">选择</div>
                                <div className="attrs">
                                    <span>选择</span>
                                    {names
                                        && names.map((item, index) => (
                                            <span key={index.toString() + item}>
                                                {item}
                                            </span>
                                        ))}
                                </div>
                            </div>
                            <div className="select-right">
                                <span className="icon right-icon"/>
                            </div>
                        </div>
                    </div>
                )}

                {
                    isZM && (
                        <div className="coupon" onClick={openCoupon}>
                            <div className="coupon-left">
                                <span>领劵</span>
                                <span className="icon icon-scan">{max >= 0 ? `领取优惠券, 满${max}元可领劵` : '暂无优惠券可领取'}</span>
                            </div>
                            <div className="coupin-right">
                                <span className="icon right-icon"/>
                            </div>
                        </div>
                    )
                }

                {goodsDetail.app_type === '2'
                    && goodsDetail.effective_type === '0' && (
                    <div className="serve">
                        <div className="waiter">服务</div>
                        <div className="their">
                            {hasType && <span>门店可自提</span>}
                            <span className="dolt"/>
                        </div>
                    </div>
                )}
                <div className="evaluate">
                    <div className="eva-top">
                        <div>商品评价({(evalute && evalute.count) || 0})</div>
                        <div onClick={routeToEvalute}>查看全部</div>
                    </div>
                    {evalute && (
                        <div className="eva-content">
                            <div className="desc">
                                {evalute.avatarUrl && (
                                    <img
                                        className="eva-pic"
                                        src={evalute.avatarUrl}
                                    />
                                )}
                                <div className="eva-username">
                                    {evalute.nickname}
                                </div>
                            </div>
                            <p>{evalute.content}</p>
                        </div>
                    )}
                </div>
                <div className="shop-detali">
                    <div className="box1">
                        <div className="shop-logo">
                            <img
                                className="logo-img"
                                src={shop.picpath}
                                onError={e => {
                                    e.target.src = shop.df_logo;
                                }}
                                alt=""
                            />
                        </div>
                        <div className="shop-detail">
                            <div className="Star">
                                <span className="Shop-Nl">{shop.shopName}</span>
                                <div className="shop-btn">
                                    <div
                                        className="auxiliary-button red"
                                        onClick={() => shopH(shop.id)}
                                    >
                                        进店逛逛
                                    </div>
                                </div>
                            </div>
                            <div className="Shop-N">
                                {goodsDetail.app_type
                                    && goodsDetail.app_type === '2' && (
                                    <React.Fragment>
                                        <span className="Shop-Nr">
                                            人均消费
                                        </span>
                                        <span className="Shop-Nr">
                                            ￥{shop.average_consumption}
                                        </span>
                                    </React.Fragment>
                                )}
                                {}
                                {goodsDetail.app_type
                                    && goodsDetail.app_type === '3'
                                    && createStar()}
                            </div>
                        </div>
                    </div>
                    <div className="score">
                        <div className="score-left">
                            <div>店铺评分</div>
                            <div className="score-center">
                                {shop && shop.shop_mark}
                            </div>
                            {returnLev(shop.shop_mark)}
                        </div>
                        <div className="score-right">
                            <div>物流评分</div>
                            <div className="score-center">
                                {shop && shop.logistics_mark}
                            </div>
                            {returnLev(shop.logistics_mark)}
                        </div>
                    </div>
                </div>

            </Element>
        );
    }
}
