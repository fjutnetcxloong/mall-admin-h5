//店铺模板热门商品组件，2019/10/23，楚小龙
import './HotProducts.less';

export default class HotProducts extends BaseComponent {
    render() {
        const {hotSellList, content, picurl, sort, mode2, goToGoods} = this.props;
        return (
            <div className="hotImgShow">
                {
                    content && picurl && hotSellList &&  hotSellList.map(item => item && (
                        <div className="top" key={item}>
                            <img onClick={() => goToGoods(content[`sort${sort}_pr${item - mode2}_id`])} src={picurl[item]} alt=""/>
                            <div className="priceInfo">
                                <div className="infoLeft">
                                    <p className="shopTitleSmall">{content[`sort${sort}_pr${item - mode2}_title1`]}</p>
                                    <div className="shopPeiceSmall">
                                        <span className="money-ZH">￥</span>
                                        <span className="money-now">{content[`sort${sort}_pr${item - mode2}_title2`]}</span>
                                        <span className="money-before">{content[`sort${sort}_pr${item - mode2}_title3`]}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
            </div>
        );
    }
}