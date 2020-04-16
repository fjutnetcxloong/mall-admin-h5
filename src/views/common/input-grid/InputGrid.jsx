/*
* 6位密码框
* */
import PropTypes from 'prop-types';
import './InputGrid.less';
import {showFail} from '../../../utils/mixin';

// TODO: 考虑用Immutable数据结构
class InputGrid extends React.PureComponent {
    static propTypes = {
        onInputGrid: PropTypes.func.isRequired,
        focus: PropTypes.bool,
        clearPropsInput: PropTypes.func, //父级清除value
        num: PropTypes.number, //第几个input
        propsType: PropTypes.string,
        callBackFoucs: PropTypes.func,
        callBackBlur: PropTypes.func
    };

    static defaultProps = {
        focus: false,
        clearPropsInput: () => {},
        callBackFoucs: () => {},
        callBackBlur: () => {},
        num: 0,
        propsType: 'text'
    }

    state = {
        valueGrid: [],
        value: ''
    }

    componentDidMount() {
        if (this.props.focus) {
            this.numInput.focus();
        }
    }

    inputGrid = (e) => {
        const {propsType} = this.props;
        const {valueGrid} = this.state;
        const val = e.target.value;
        const str = e.target;
        const aa = val.charAt(val.length - 1);
        const bb = [];
        if (valueGrid.length > val.length) { //点击删除时
            this.setState({
                value: '',
                valueGrid: []
            });
        } else {
            if (propsType === 'number' && !/^[0-9]*$/.test(val.slice(val.length - 1))) {
                showFail('请输入数字');
                return;
            }
            for (let i = 0;  i < val.length; i++) {
                bb.push('*');
            }
            if (valueGrid.length > val.length) {
                valueGrid.pop();
                this.setState({
                    value: bb.join(''),
                    valueGrid: valueGrid
                });
            } else {
                this.setState(prevState => ({
                    value: bb.join(''),
                    valueGrid: prevState.valueGrid.splice(val.length - 1, 1, aa).concat(valueGrid)
                }), () => {
                    if (valueGrid.length === 6) {
                        str.blur();
                        this.props.onInputGrid(valueGrid.join(''));
                    }
                });
            }
        }
    }

    //单击时清除value值
    clearInput = () => {
        const {clearPropsInput, num} = this.props;
        this.setState({
            value: '',
            valueGrid: []
        });
        if (clearPropsInput) {
            clearPropsInput(num);
        }
    }

    inputFocus = () => {
        this.props.callBackFoucs();
    }

    inputBlur = () => {
        this.props.callBackBlur();
    }

    //渲染函数
    render() {
        const {value} = this.state;
        return (
            <div className="frame">
                <div className="frame-biu">
                    <div className="frame-biu-one"/>
                    <div className="frame-biu-one"/>
                    <div className="frame-biu-one"/>
                    <div className="frame-biu-one"/>
                    <div className="frame-biu-one"/>
                </div>
                <input className="input-pws" onFocus={this.inputFocus} onBlur={this.inputBlur} maxLength="6" value={value} type="text" ref={number => { this.numInput = number }} onChange={this.inputGrid} onClick={this.clearInput}/>
            </div>
        );
    }
}

export {InputGrid};
