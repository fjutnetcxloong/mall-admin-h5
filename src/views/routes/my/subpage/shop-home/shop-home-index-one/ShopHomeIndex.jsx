/**
 * @desc 店铺模板1
 */
import PropTypes from 'prop-types';
import './ShopHomeIndex.less';
// import {Carousel, WingBlank} from 'antd-mobile';
import GoodsTitle from '../components/GoodsTitle';
import CarouselComponent from '../components/CarouselComponent';
import Products from '../components/Products';
import HotProducts from '../components/HotProducts';

const {appHistory} = Utils;

class ShopHomeIndex extends React.PureComponent {
    static propTypes = {
        shopModelArr: PropTypes.object.isRequired
    };

    goToGoods = (num) => {
        appHistory.push(`/goodsDetail?id=${num}`);
    }

    render() {
        const {shopModelArr: {content, picurl}} = this.props;
        const hotSellList = [
            content.sort1_pr1_ix,
            content.sort1_pr2_ix
        ];
        //新品商品第一部分ix值
        const newSellList1 = [
            content.sort2_pr1_ix,
            content.sort2_pr2_ix,
            content.sort2_pr3_ix,
            content.sort2_pr4_ix
        ];
        //新品商品第二部分ix值
        const newSellList2 = [
            content.sort2_pr5_ix,
            content.sort2_pr6_ix,
            content.sort2_pr7_ix,
            content.sort2_pr8_ix
        ];
        return (
            <div data-component="ShopHomeIndex" data-role="page" className="ShopHomeIndex">
                <div className="shopHomeContent shopHomeOneContent">
                    <CarouselComponent
                        content={content}
                        cHeight={475}
                        goToGoods={this.goToGoods}
                    />
                    <div className="items">
                        <GoodsTitle
                            title1={content.sort1_title1}
                            title2={content.sort1_title2}
                            title3={content.sort1_title3}
                            modalId={1}
                        />
                        <HotProducts
                            content={content}
                            sort={1}
                            hotSellList={hotSellList}
                            picurl={picurl}
                            mode2={0}
                            goToGoods={this.goToGoods}
                        />
                    </div>
                    <div className="items">
                        <GoodsTitle
                            title2={content.sort2_title1}
                            title3={content.sort2_title2}
                            modalId={1}
                        />
                        <Products
                            content={content}
                            sort={2}
                            newSellList={newSellList1}
                            picurl={picurl}
                            mode2={2}
                            goToGoods={this.goToGoods}
                        />
                        <Products
                            content={content}
                            sort={2}
                            newSellList={newSellList2}
                            picurl={picurl}
                            mode2={2}
                            goToGoods={this.goToGoods}
                        />
                    </div>
                </div>
            </div>

        );
    }
}


export default ShopHomeIndex;
