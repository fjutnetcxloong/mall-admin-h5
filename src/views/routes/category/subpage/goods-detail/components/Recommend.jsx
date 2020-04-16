
import PropTypes from 'prop-types';
import './Recommend.less';

export default class Recommend extends React.PureComponent {
    static propTypes = {
        recommend: PropTypes.array.isRequired,
        Element: PropTypes.func.isRequired,
        goToShopRecom: PropTypes.func.isRequired
    }

    render() {
        const {recommend, Element, goToShopRecom} = this.props;

        return (
            <Element name="recommend" className="home-recommends">
                <h2 className="recommend-commodity-names">店铺推荐</h2>
                <div className="Scroll-infeed">
                    <div className="home-recommend-main">
                        {recommend.map(item => (
                            <div
                                className="home-recommend-individual"
                                key={item.id}
                                onClick={() => goToShopRecom(item.id)}
                            >
                                <div className="recommend-individual-imgParent">
                                    <img
                                        className="recommend-individual-img"
                                        src={item.picpath}
                                        alt=""
                                    />
                                </div>
                                <h3 className="recommend-individual-title">
                                    {item.title}
                                </h3>
                                <div className="recommend-concessional-box">
                                    <div className="recommend-concessional-rate">
                                        {item.price}
                                    </div>
                                    <div className="recommend-original-price">
                                        ￥{item.price_original}
                                    </div>
                                </div>
                                <div className="recommend-accounting-volume">
                                    C米：{item.deposit}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </Element>
        );
    }
}