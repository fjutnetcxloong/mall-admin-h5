import {Modal} from 'antd-mobile';
import Proptypes from 'prop-types';
import './CouponTwo.less';

export default class CouponTwo extends React.PureComponent {
    static propTypes = {
        pouponText: Proptypes.oneOfType([Proptypes.array, Proptypes.bool]).isRequired,
        getStatus: Proptypes.oneOfType([Proptypes.array, Proptypes.bool]).isRequired,
        pouponTwoStatus: Proptypes.bool.isRequired,
        onCloseTwo: Proptypes.func.isRequired,
        reciveCard: Proptypes.func.isRequired,
        couponList: Proptypes.array
    }

    static defaultProps = {
        couponList: []
    }

    render() {
        const {pouponText, pouponTwoStatus, onCloseTwo, couponList, reciveCard, getStatus} = this.props;
        return (
            <Modal
                visible={pouponTwoStatus}
                transparent
                maskClosable={false}
                className="coupon-two"
            >
                <div className="icon icon-close" onClick={onCloseTwo}/>
                <div className="coupon-two-container">
                    <ul className="coupon-two-list">
                        {
                            couponList && couponList.length > 0 && couponList.map((item, index) => (
                                <li className={getStatus[index] ? 'list-item' : 'list-item-active'} key={`${item.card_no + index}`}>
                                    <div className="list-left">
                                        <div className="left-top">￥<span>{item.price}</span></div>
                                        <div className="left-bottom">{item.price_limit}</div>
                                    </div>
                                    <div className="list-center">
                                        <div className="center-top">{item.limit_tip}</div>
                                        <div className="center">{item.card_title}</div>
                                        <div className="center-bottom">{item.term_validity}</div>
                                    </div>
                                    <div className="list-right" onClick={() => reciveCard(item.card_no, index, item.jump_id, item.types)}>{pouponText[index]}</div>
                                </li>
                            ))
                        }
                    </ul>
                </div>
            </Modal>

        );
    }
}