
/**
 * 店铺模板5
 */
import PropTypes from 'prop-types';
import './ShopHomeIndexFive.less';
import GoodsTitle from '../components/GoodsTitle';
import Products from '../components/Products';
import CarouselComponent from '../components/CarouselComponent';

const {appHistory} = Utils;

class ShopHomeIndexFive extends React.PureComponent {
    static propTypes = {
        shopModelArr: PropTypes.object.isRequired
    };

    goToGoods = (num) => {
        appHistory.push(`/goodsDetail?id=${num}`);
    }

    //精选商品组件
    hotSellComponent = (ix, id, pic, title1, title2, title3) => (
        <div className="sell-well">
            <img onClick={() => this.goToGoods(id)} src={pic} alt="" className="thing-big"/>
            <div className="thing-center">
                <p className="introduce-left">{title1}</p>
                <div>
                    <span className="money-ZH">￥</span>
                    <span className="money-now">{title2}</span>
                    <span className="money-before">{title3}</span>
                </div>
            </div>
        </div>
    )

    render() {
        const {shopModelArr: {content, picurl}} = this.props;
        const popularList = [
            content.sort1_pr1_ix,
            content.sort1_pr2_ix,
            content.sort1_pr3_ix,
            content.sort1_pr4_ix
        ];
        return (
            <div data-component="ShopHomeIndexFive" data-role="page" className="ShopHomeIndex">
                <div className="shopHomeFiveContent shopHomeContent">
                    <CarouselComponent
                        content={content}
                        cHeight={386}
                        goToGoods={this.goToGoods}
                    />
                    <div className="boutique items">
                        <GoodsTitle
                            title1={content.sort1_title1}
                            title2={content.sort1_title2}
                            modalId={5}
                        />
                        <Products
                            content={content}
                            sort={1}
                            newSellList={popularList}
                            picurl={picurl}
                            mode2={0}
                            goToGoods={this.goToGoods}
                        />
                    </div>
                    <div className="boutique items">
                        <GoodsTitle
                            title1={content.sort2_title1}
                            title2={content.sort2_title2}
                            modalId={5}
                        />
                        <div className="popular-one">
                            <div className="popular-one-top">
                                <img onClick={() => this.goToGoods(content.sort2_pr1_id)} src={picurl[content.sort2_pr1_ix]} alt=""/>
                            </div>
                            <div className="popular-one-bottom">
                                <div className="introduce-left">{content.sort2_pr1_title1}</div>
                                <div className="popular-one-bottom-price">
                                    <span className="money-ZH">￥</span>
                                    <span className="money-now">{content.sort2_pr1_title2}</span>
                                    <span className="money-before">{content.sort2_pr1_title3}</span>
                                </div>
                            </div>
                        </div>
                        <div className="popular-three">
                            <div style={{background: '#a52f15'}} className="popular-three-left"/>
                            <div className="popular-three-right">
                                <img onClick={() => this.goToGoods(content.sort2_pr2_id)} src={picurl[content.sort2_pr2_ix]} alt=""/>
                                <div className="introduce">
                                    <div className="introduce-left">{content.sort2_pr2_title1}</div>
                                    <div className="price">
                                        <span className="money-ZH">￥</span>
                                        <span className="money-now">{content.sort2_pr2_title2}</span>
                                        <span className="money-before">{content.sort2_pr2_title3}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="popular-two-copy">
                            <div className="popular-two-left">
                                <div className="popular-two-left-top">
                                    {/* <div>
                                        <div className="inner">
                                            <span>The Winter</span>
                                            <span>冬季热销</span>
                                        </div>
                                    </div> */}
                                    <img onClick={() => this.goToGoods(content.sort2_pr3_id)} src={picurl[content.sort2_pr3_ix]} alt=""/>
                                </div>
                                <div className="popular-two-left-bot">
                                    <div className="introduce-left">{content.sort2_pr3_title1}</div>
                                    <div className="popular-two-left-bot-price">
                                        <span className="money-ZH">￥</span>
                                        <span className="money-now">{content.sort2_pr3_title2}</span>
                                        <span className="money-before">{content.sort2_pr3_title3}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="popular-four">
                            <div className="winter">
                                <div className="popular-four-right">
                                    <img onClick={() => this.goToGoods(content.sort2_pr4_id)} src={picurl[content.sort2_pr4_ix]} alt=""/>
                                </div>
                                <div className="introduce">
                                    <div className="introduce-left">{content.sort2_pr4_title1}</div>
                                    <div className="introduce-right">
                                        <span className="money-ZH">￥</span>
                                        <span className="money-now">{content.sort2_pr4_title2}</span>
                                        <span className="money-before">{content.sort2_pr4_title3}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="empty-container-four"/>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}


export default ShopHomeIndexFive;
