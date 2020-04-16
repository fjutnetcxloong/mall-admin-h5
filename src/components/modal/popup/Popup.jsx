/**
 * 全局 popup 弹窗
 */

import {Modal} from 'antd-mobile';
import PropTypes from 'prop-types';
import './Popup.less';

class Popup extends BaseComponent {
    static defaultProps = {
        visible: false,
        popupName: ''
    };

    static propTypes = {
        visible: PropTypes.bool,
        popupName: PropTypes.string
    };

    constructor(props, context) {
        super(props, context);
    }

    render() {
        const {
            visible,
            popupName
        } = this.props;
        return (
            <Modal
                popup
                visible={visible}
                maskClosable={false}
                animationType="slide-up"
                platform="ios"
                className={popupName}
            >
                {this.props.children}
            </Modal>
        );
    }
}

export default Popup;
