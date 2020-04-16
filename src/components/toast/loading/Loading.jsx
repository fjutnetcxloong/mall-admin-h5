/**
 * 加载动画
 */
import PropTypes from 'prop-types';
import * as svgSources from './svg';
import {LayeredComponentMixin} from '../../hoc/LayeredComponentMixin';


class Loading extends React.PureComponent {
    static propTypes = {
        visible: PropTypes.bool,
        delay: PropTypes.number,
        color: PropTypes.string,
        type: PropTypes.string,
        height: PropTypes.oneOfType([
            PropTypes.number,
            PropTypes.string
        ]),
        width: PropTypes.oneOfType([
            PropTypes.number,
            PropTypes.string
        ])
    };

    static defaultProps = {
        visible: false,
        color: '#fff',
        delay: 300,
        type: 'balls',
        height: 16,
        width: 16
    };

    constructor(props, context) {
        super(props, context);
        this.state = {
            delayed: this.props.delay > 0
        };
    }

    componentDidMount() {
        const {delay} = this.props,
            {delayed} = this.state;
        if (delayed) {
            this.timeout = setTimeout(() => {
                this.setState({
                    delayed: false
                });
            }, delay);
        }
    }

    componentWillUnmount() {
        const {timeout} = this;

        if (timeout) {
            clearTimeout(timeout);
        }
    }

    renderLayer() {
        const {visible, color, type, ...restProps} = this.props;
        let {
            height, width
        } = this.props;
        height = (height / 100) + 'rem';
        width = (width / 100) + 'rem';

        const selectedType = this.state.delayed ? 'blank' : type,
            svg = svgSources[selectedType],
            style = {
                fill: color,
                height,
                width,
                textAlign: 'center'
            };
        // console.log('Loading render');
        return (
            <div style={{display: visible ? 'block' : 'none'}}>
                <div className="am-modal-wrap">
                    <div
                        style={style}
                        dangerouslySetInnerHTML={{__html: svg}}
                        {...restProps}
                    />
                </div>
            </div>

        );
    }
}

export default LayeredComponentMixin(Loading);