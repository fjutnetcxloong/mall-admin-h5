/**
 * 图片放大
 * */

import {Carousel} from 'antd-mobile';
import PropTypes from 'prop-types';
import './BigPicture.less';

class BigImg extends React.PureComponent {
    static propTypes = {
        imgUrl: PropTypes.array.isRequired,
        closeBigImg: PropTypes.func.isRequired,
        selectedIndex: PropTypes.number.isRequired
    }

    doClose = () => {
        this.props.closeBigImg();
    }

    render() {
        const {imgUrl, selectedIndex} = this.props;
        return (
            <div className="pic-mask" onClick={this.doClose}>
                <Carousel autoplay={false} infinite={false} selectedIndex={selectedIndex}>
                    {imgUrl.map(item => (
                        <div key={item}>
                            <img
                                src={item}
                                className="banner-img"
                            />
                        </div>
                    ))}
                </Carousel>
            </div>
        );
    }
}
export default BigImg;
