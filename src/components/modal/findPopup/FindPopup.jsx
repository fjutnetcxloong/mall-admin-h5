/**
 * alter 弹窗
 */

import {Modal} from 'antd-mobile';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {baseActionCreator as actionCreator} from '../../../redux/baseAction';
import './FindPopup.less';
// let n = 0;

class FindPopup extends React.PureComponent {
    static propTypes = {
        visible: PropTypes.bool,
        className: PropTypes.string,
        children: PropTypes.element.isRequired
    };

    static defaultProps = {
        visible: false,
        className: ''
    };

    constructor(props, context) {
        super(props, context);
    }

    render() {
        // console.log('alter render');
        const {visible, className} = this.props;
        return (
            <Modal
                visible={visible}
                transparent
                maskClosable={false}
                platform="ios"
                // onClose={this.onClose('modal2')}
                animationType="fade"
                // onClose={hidePopup}
                // afterClose={() => { alert('afterClose') }}
                className={className}
            >
                {this.props.children}
            </Modal>
        );
    }
}

const mapDispatchToProps = {
    hideAlert: actionCreator.hideAlert
};

export default connect(null, mapDispatchToProps)(FindPopup);