/*
* 取消订单弹窗
* */
// FIXME 弹窗组件为什么不用antd自带的呢？
// 没有想要的效果的组件
import {Radio} from 'antd-mobile';
import PropTypes from 'prop-types';
import './CancleOrder.less';

const RadioItem = Radio.RadioItem;
const {nativeCssDiff} = Utils;
class CancelOrder extends React.Component {
    state = {
        value: ''
    };

    canCelInfoArr = [
        {label: '信息填写错误', value: 1},
        {label: '拍多了重新下单', value: 2},
        {label: '不想要了', value: 3},
        {label: '其他原因', value: 4}
    ];

    static propTypes = {
        canStateChange: PropTypes.func.isRequired,
        propsData: PropTypes.array
    }

    static defaultProps = {
        propsData: []
    }

    //单选改变
    checkedChange = (data) => {
        this.setState({
            value: data
        });
    }

    //隐藏遮罩
    canCelMark = () => {
        this.props.canStateChange();
    }

    //确定按钮
    mastSure = () => {
        const {value} = this.state;
        const {propsData} = this.props;
        const arr = propsData.length > 0 ? propsData : this.canCelInfoArr;
        const info = arr.find(item => item.value === value);
        this.props.canStateChange('mastSure', info);
        this.setState({
            value: ''
        });
    }

    render() {
        const {value} = this.state;
        const {propsData} = this.props;
        const arr = propsData.length > 0 ? propsData : this.canCelInfoArr;
        return (
            <div className="mask-cancel">
                <div className="cancel-wrap">
                    <div className="choose-btn">
                        <span onClick={this.canCelMark}>取消</span>
                        <span onClick={this.mastSure}>确定</span>
                    </div>
                    <div className={`choose-info ${nativeCssDiff() ? 'general-other' : 'general'}`}>
                        {
                            arr.map((item, index) => (
                                <div
                                    key={item.value}
                                    onClick={() => this.checkedChange(item.value)}
                                >
                                    <RadioItem
                                        checked={value === item.value}
                                    >
                                        {item.label}
                                    </RadioItem>
                                </div>
                            ))
                        }
                    </div>
                </div>
            </div>
        );
    }
}
export default CancelOrder;
