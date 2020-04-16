/**
 * 页面出错显示
 */
import './Error.less';
import {NavBar, Icon} from 'antd-mobile';

import '../../../redux/reducers/baseReducer';
import PropTypes from 'prop-types';


const {goBackModal} = Utils;
export default class Error extends BaseComponent {
    static defaultProps = {
        title: '404',
        className: 'error404',
        prompting: '页面出错'
    };

    static propTypes = {
        title: PropTypes.string,
        className: PropTypes.string,
        prompting: PropTypes.string
    };

    constructor(props, context) {
        super(props, context);
    }

    render() {
        // const {title, className, prompting} = this.props;
        const data = this.props.location.state;
        const {title = '404', className = 'error404', prompting = '页面出错'} = data;
        return (
            <div data-component="error" data-role="page" className="error">

                <NavBar
                    className="error-title"
                    mode="light"
                    icon={<Icon type="left" size="lg"/>}
                    onLeftClick={goBackModal}
                >
                    {title}
                </NavBar>

                <div className={className}/>

                <p className="error-prompting">{prompting}</p>
            </div>
        );
    }
}
