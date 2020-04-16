
/**
 * 店铺模板3
 */
import PropTypes from 'prop-types';
import './ShopHomeIndexThird.less';
import GoodsTitle from '../components/GoodsTitle';
import CarouselComponent from '../components/CarouselComponent';
import Products from '../components/Products';

const {appHistory} = Utils;

class ShopHomeIndexThird extends React.PureComponent {
    static propTypes = {
        shopModelArr: PropTypes.object.isRequired
    };

    goToGoods = (num) => {
        appHistory.push(`/goodsDetail?id=${num}`);
    }

    render() {
        const {shopModelArr: {content, picurl}} = this.props;
        const GoodsList3 = [
            content.sort2_pr1_ix,
            content.sort2_pr2_ix
        ];
        const GoodsList1 = [
            content.sort2_pr3_ix,
            content.sort2_pr4_ix,
            content.sort2_pr5_ix,
            content.sort2_pr6_ix,
            content.sort2_pr7_ix,
            content.sort2_pr8_ix
        ];
        const GoodsList2 = [content.sort1_pr1_ix, content.sort1_pr2_ix];
        return (
            <div data-component="ShopHomeIndex" data-role="page" className="ShopHomeIndex">
                <div className="shopHomeThirdContent shopHomeContent">
                    <CarouselComponent
                        content={content}
                        cHeight={248}
                        goToGoods={this.goToGoods}
                    />
                    <div className="compile-box items" style={{marginTop: '30px'}}>
                        <GoodsTitle
                            title1={content.sort1_title1}
                            title2={content.sort1_title2}
                            modalId={3}
                        />
                        <Products
                            newSellList={GoodsList2}
                            content={content}
                            picurl={picurl}
                            sort={1}
                            mode2={0}
                            goToGoods={this.goToGoods}
                        />
                    </div>
                    <div className="items compile-box compile-box-second">
                        <GoodsTitle
                            title1={content.sort2_title1}
                            title2={content.sort2_title2}
                            modalId={3}
                        />
                        <Products
                            newSellList={GoodsList3}
                            content={content}
                            picurl={picurl}
                            sort={2}
                            mode2={2}
                            goToGoods={this.goToGoods}
                        />
                    </div>
                    <div className="items compile-box">
                        <Products
                            newSellList={GoodsList1}
                            content={content}
                            picurl={picurl}
                            sort={2}
                            mode2={2}
                            goToGoods={this.goToGoods}
                        />
                    </div>
                </div>
            </div>
        );
    }
}


export default ShopHomeIndexThird;
