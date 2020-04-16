import {Modal, Button} from 'antd-mobile';
import Proptypes from 'prop-types';
import './CouponOne.less';

export default class CouponOne extends React.PureComponent {
    static propTypes = {
        onClose: Proptypes.func.isRequired,
        getCoup: Proptypes.func.isRequired,
        pouponOneStatus: Proptypes.bool.isRequired,
        title: Proptypes.string,
        couponList: Proptypes.array
    }

    static defaultProps = {
        title: '',
        couponList: []
    }

    render() {
        const {onClose, pouponOneStatus, title, couponList, getCoup} = this.props;
        return (
            <Modal
                visible={pouponOneStatus}
                transparent
                maskClosable={false}
                className="coupon-one"
            >
                {
                    couponList[0] && (
                        <React.Fragment>
                            <div className="icon-close icon" onClick={onClose}/>
                            <div className="coupon-one-container">
                                <div className="price">￥
                                    <span>{couponList[0].price}</span>
                                </div>
                                <div className="title">{!!title && title}</div>
                                <div className="get" onClick={() => getCoup(couponList[0].card_no)}>
                                    <Button>立即领取</Button>
                                </div>
                                <div className="date">有效期：{couponList[0].term_validity}</div>
                            </div>
                        </React.Fragment>
                    )
                }
            </Modal>

        );
    }
}