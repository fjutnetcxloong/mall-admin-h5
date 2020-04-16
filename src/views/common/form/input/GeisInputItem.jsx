/*
* 限制输入框
* */
import React from 'react';
import PropTypes from 'prop-types';
import {InputItem} from 'antd-mobile';

class GeisInputItem extends React.PureComponent {
    static propTypes = {
        placeholder: PropTypes.string,   //inputItem的placeholder
        value: PropTypes.string,  //Form表单的默认值
        type: PropTypes.string,   //限制类型
        editable: PropTypes.bool,   //是否可编辑
        isStyle: PropTypes.bool,   //是否自定义样式
        showPass: PropTypes.bool, //是否显示密码输入框
        itemTitle: PropTypes.string,     //inputItem的标题
        clear: PropTypes.bool,   //是否可清除
        itemStyle: PropTypes.element,
        maxLength: PropTypes.number,  //inputItem的最大长度
        onChange: PropTypes.func     //表单的onChange事件
    };

    static defaultProps = {
        clear: false,
        showPass: false,
        editable: true,
        isStyle: false,
        placeholder: '',
        value: '',  //form表单传过来的默认值
        itemTitle: '',
        maxLength: 30,
        onChange() {},
        type: '',
        itemStyle: null
    };

    constructor(props) {
        super(props);
        this.state = {
            inputValue: '',
            data: ''
        };
    }

    componentWillReceiveProps(nextProps) {
        const {value} = nextProps;
        const {inputValue} = this.state;
        if (value !== inputValue) {
            this.setState({
                inputValue: value
            });
        }
    }

    itemChange = e => {
        const {type} = this.props;
        const reg = new Map([
            ['any', /^(\b).*\S\s?$/], //不能空格或符号开头，中间只能输入一个空格
            ['amount', /^((0)|([1-9]{1}\d{0,7}))(\.\d{0,2})?$/], //金额 邮费 0~99999999.99
            ['discount', /^([8-9]{1})(\.{0,1}\d{1,2})$/], //折扣 8~9.5
            ['stock', /^\d+$/], //输入商品库存
            ['num',  /^\d+$/], //数字输入
            ['numAndBar', /^[\d-]*$/],  //数字和中横线(客服电话)
            ['cn', /^[a-zA-Z\u4e00-\u9fa5]+$/], //中文以及英文字母
            ['numEn', /^[0-9a-zA-Z]+$/],  //数字和英文
            ['es', /^\w+$/], //英文输入
            ['nonSpace', /^[^\s]*$/], //限制不能输入空格
            ['cnEnNum', /^[\u4E00-\u9FA5A-Za-z0-9_]+$/],  //中英文数字
            ['float', /^[0-9]+.?[0-9]*$/]    //可以输入小数的数字
        ]);
        if (!reg.get(type).test(e) && e !== '') {
            if (type === 'nonSpace') {
                this.setState({//设置这个是为了输入空格的时候可以更新，这样空格就会被过滤了
                    data: new Date()
                });
            }
            return;
        }
        const {onChange} = this.props;
        if (onChange) {
            onChange(e);
            this.setState({
                inputValue: e
            });
        }
    };

    render() {
        const {clear, placeholder, editable, itemTitle, showPass, isStyle, maxLength, itemStyle} = this.props;
        const {inputValue, data} = this.state;
        console.log(data, '打印');
        return (
            <InputItem
                value={inputValue}
                clear={clear}
                type={showPass ? 'password' : 'text'}
                placeholder={placeholder}
                editable={editable}
                onChange={this.itemChange}
                maxLength={maxLength}
                {...isStyle && {className: 'add-input'}}
            >{itemTitle}{itemStyle}
            </InputItem>
        );
    }
}
export default GeisInputItem;
