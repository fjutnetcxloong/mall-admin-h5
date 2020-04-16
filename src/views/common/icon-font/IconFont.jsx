/*
* iconfont 图标是多种颜色， 以无状态组件形式定义
* */

import PropTypes from 'prop-types';

export const IconFont = (props) => (
    <i>
        <svg className="icon-symbol" aria-hidden="true"><use xlinkHref={'#' + props.iconText}/></svg>
    </i>
);

IconFont.propTypes  = {
    iconText: PropTypes.string.isRequired
};
