/*
* 限制输入框
* */
import React from 'react';
import PropTypes from 'prop-types';
import {TextareaItem} from 'antd-mobile';

class GeisTextareaItem extends React.PureComponent {
    static defaultProps = {
        isStyle: false,
        placeholder: '',
        itemTitle: '',
        count: 0,
        rows: 1,
        onChange() {},
        type: ''
    };

    static propTypes = {
        placeholder: PropTypes.string,   //inputItem的placeholder
        type: PropTypes.string,   //限制类型
        isStyle: PropTypes.bool,   //是否自定义样式
        itemTitle: PropTypes.string,     //inputItem的标题
        count: PropTypes.number,   //
        rows: PropTypes.number,
        onChange: PropTypes.func     //表单的onChange事件
    };

    state = {
        value: ''
    };

    componentWillReceiveProps(Props) {
        const {value} = Props;
        if (value) {
            this.setState({
                value
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
        if (!reg.get(type).test(e) && e !== '') return;
        const {onChange} = this.props;
        if (onChange) {
            onChange(e);
            this.setState({
                value: e
            });
        }
    };

    render() {
        const {placeholder, itemTitle, isStyle, count, rows} = this.props;
        const {value} = this.state;
        return (
            <TextareaItem
                value={value}
                placeholder={placeholder}
                onChange={this.itemChange}
                {...isStyle && {className: 'detail-address'}}
                count={count}
                rows={rows}
            >{itemTitle}
            </TextareaItem>
        );
    }
}
export default GeisTextareaItem;
