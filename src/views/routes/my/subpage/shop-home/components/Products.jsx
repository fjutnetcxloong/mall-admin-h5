//店铺模板商品组件，2019/10/21，楚小龙
import './Products.less';

export default class Products extends BaseComponent {
    render() {
        const {newSellList, content, picurl, sort, mode2, goToGoods} = this.props;
        return (
            <div className="newImgShow">
                {
                    content && picurl && newSellList && newSellList.map(item => item && (
                        <div className="bottomImgLeft" key={item}>
                            <div className="marginBot">
                                <img onClick={() => goToGoods(content[`sort${sort}_pr${item - mode2}_id`])} src={picurl[item]} alt=""/>
                                <div className="margin-bot-box">
                                    <div className="margin-bot-content-top">{content[`sort${sort}_pr${item - mode2}_title1`]}</div>
                                    <div className="margin-bot-content-bot">
                                        <span className="money-ZH">￥</span>
                                        <span className="money-now">{content[`sort${sort}_pr${item - mode2}_title2`]}</span>
                                        <span className="money-before">{content[`sort${sort}_pr${item - mode2}_title3`]}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))

                }
            </div>
        );
    }
}