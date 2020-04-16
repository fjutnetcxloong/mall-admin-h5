//店铺模板轮播图组件，2019/10/21，楚小龙
import {WingBlank, Carousel} from 'antd-mobile';
import './CarouselComponent.less';

export default class CarouselComponent extends BaseComponent {
    render() {
        const {content, cHeight, goToGoods} = this.props;
        return (
            <div style={{background: content.bg_color}} className="shopHomeBanner">
                {
                    (content && content.banner && content.banner.length > 0) ? (
                        <WingBlank>
                            <Carousel
                                className="my-carousel"
                                autoplay
                                infinite
                                speed={2000}
                            >
                                {
                                    content.banner.map(item => (
                                        <div key={item}>
                                            <img style={{height: cHeight + 'px'}} src={item.url} onClick={() => goToGoods(item.id)}/>
                                        </div>
                                    ))
                                }
                            </Carousel>
                        </WingBlank>
                    ) : <img title="图片"/>
                }
            </div>
        );
    }
}