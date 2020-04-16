import './index.less';
import PropTypes from 'prop-types';

class ShopEnvlope extends React.PureComponent {
    static propTypes = {
        changeBox: PropTypes.func.isRequired,
        cardData: PropTypes.array.isRequired,
        getCardProps: PropTypes.func.isRequired,
        userCard: PropTypes.func.isRequired
    };

    //关闭弹框
    changeBox = () => {
        this.props.changeBox();
    };

    //立即领取
    getCard = no => {
        this.props.getCardProps(no);
    };

    //立即使用
    userCard = value => {
        this.props.userCard(value);
    };

    render() {
        const {cardData} = this.props;
        return (
            <div className="shop-env-wrap">
                <div className="shop-env-main">
                    <div className="shop-env-title">
                        <p>领取优惠券</p>
                        <span className="icon" onClick={this.changeBox}/>
                    </div>
                    <div className="shop-env-list">
                        {cardData.map(item => (
                            <div className="card-view" key={item.card_no}>
                                <div className="card-money">
                                    <p>
                                        <span>￥</span>
                                        {item.price}
                                    </p>
                                    <span className="full">
                                        {item.price_limit}
                                    </span>
                                </div>
                                <div className="card-main">
                                    <p>{item.limit_tip}</p>
                                    <p>{item.card_title}</p>
                                    <p>{item.term_validity}</p>
                                    {item.btnCode === 1 ? (
                                        <span
                                            className="card-receive"
                                            onClick={() => this.getCard(item.card_no)
                                            }
                                        >
                                            立即领取
                                        </span>
                                    ) : (
                                        <span
                                            className="card-use"
                                            onClick={() => this.userCard(item)}
                                        >
                                            去使用
                                        </span>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }
}

export default ShopEnvlope;
