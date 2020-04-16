import {Checkbox, Button} from 'antd-mobile';
import PropTypes from 'prop-types';
import './index.less';
import {showInfo} from '../../../utils/mixin';

const CheckboxItem = Checkbox.CheckboxItem;

class OrderPageCard extends React.PureComponent {
    static propTypes = {
        cardLList: PropTypes.array,
        closeCardList: PropTypes.func.isRequired,
        title: PropTypes.string,
        showCardList: PropTypes.bool,
        getCardValue: PropTypes.func.isRequired,
        isRender: PropTypes.bool
    };

    static defaultProps = {
        cardLList: [],
        title: '优惠券',
        showCardList: false,
        isRender: false
    };

    state = {
        dataList: [],
        dotUse: false
    };

    componentWillReceiveProps(nextProps) {
        if (nextProps.isRender) {
            this.findTheMaxCard(nextProps.cardLList);
        }
    }

    //获取请求完后的数据，保存到本页面的state里
    findTheMaxCard = data => {
        if (data.length) {
            this.setState({
                dataList: data
            });
        }
    };

    //判断是否选中
    showCheckout = data => {
        let str = false;
        if (data.selected === 1) {
            str = true;
        } else if (data.checkoutAble) {
            str = true;
        }
        return str;
    };

    //单选
    checkedSomeOne = id => {
        const {dataList} = this.state;
        const checkoutOne = []; //选中的那个数据
        dataList.forEach(value => {
            value.selected = 0;
            if (value.id === id) {
                value.checkoutAble = !value.checkoutAble;
                checkoutOne.push(value);
            }
        });
        const checkedArr = []; //已有选中的数据
        dataList.forEach(item => {
            if (item.checkoutAble) {
                checkedArr.push(item);
            }
        });
        let onOff = true; //判断是不是选择同一类型的了，如果为false就是选择同一类型了
        if (checkedArr.length) {
            //当已经有选中的数据的时候才判断是否选同一类型了
            checkedArr.forEach(item => {
                checkoutOne.forEach(data => {
                    //首先，操作的是选中，其次判断选择的id不能等于其他以选择的数据，最后，判断这两个不同的数据，类型是否相同
                    if (
                        data.checkoutAble
                        && item.id !== data.id
                        && data.acc_types === item.acc_types
                    ) {
                        showInfo('同一类型的优惠券不能重复使用');
                        dataList.forEach(values => {
                            if (values.id === checkoutOne[0].id) {
                                values.checkoutAble = false;
                            }
                        });
                        onOff = false;
                        return;
                    }
                });
            });
        }
        if (onOff) {
            this.setState({
                dotUse: false,
                dataList: [...dataList]
            });
        }
    };

    //点击不使用优惠券
    dontUserCard = () => {
        const {dataList} = this.state;
        const arr = dataList;
        arr.forEach(item => {
            item.selected = 0;
            item.checkoutAble = false;
        });
        this.setState(prevState => ({
            dotUse: !prevState.dotUse,
            dataList: [...arr]
        }));
    };

    //点击确定按钮
    mustSureCard = () => {
        const {dataList} = this.state;
        const arr = dataList.filter(item => item.checkoutAble);
        this.props.getCardValue(arr);
    };

    render() {
        const {closeCardList, title, showCardList} = this.props;
        const {dataList, dotUse} = this.state;
        return (
            <div
                className="card_page_wrap"
                style={{display: showCardList ? 'block' : 'none'}}
            >
                <div className="card_main">
                    <div className="card_title">
                        <sapn className="card_name">{title}</sapn>
                        <span
                            className="card_icon icon"
                            onClick={closeCardList}
                        />
                    </div>
                    <div
                        className="did_user"
                        onClick={this.dontUserCard}
                    >
                        <CheckboxItem
                            onChange={this.dontUserCard}
                            checked={dotUse}
                        >
                            不使用优惠券
                        </CheckboxItem>
                    </div>
                    <div className="card_line">
                        {dataList && dataList.length > 0
                            ? dataList.map(item => (
                                <div className="card_ones" key={item.id}>
                                    <div className="card_left">
                                        <div className="card_money">
                                              ￥
                                            <span className="card_pirce">
                                                {item.price}
                                            </span>
                                        </div>
                                        <p className="card_rules">
                                            {item.price_limit}
                                        </p>
                                    </div>
                                    <div
                                        className="card_right"
                                        onClick={() => {
                                            this.checkedSomeOne(item.id);
                                        }}
                                    >
                                        <CheckboxItem
                                            checked={this.showCheckout(item)}
                                            onChange={e => {
                                                this.checkedSomeOne(item.id);
                                            }}
                                        >
                                            <div className="card_describe">
                                                <p className="card_limit">
                                                    {item.card_title}
                                                </p>
                                                <p className="card_limit_direct">
                                                    {item.limit_tip}
                                                </p>
                                                <span className="card_times">
                                                    {item.term_validity}
                                                </span>
                                            </div>
                                        </CheckboxItem>
                                    </div>
                                </div>
                            ))
                            : ''}
                    </div>
                    <Button className="must-sure" onClick={this.mustSureCard}>
                        确定
                    </Button>
                </div>
            </div>
        );
    }
}

export default OrderPageCard;
