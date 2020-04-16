/*
* 缺省页面
* */
import {Button} from 'antd-mobile';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import './Nothing.less';

const {FIELD} = Constants;
class Nothing extends React.PureComponent {
    static propTypes = {
        title: PropTypes.string,
        text: PropTypes.string.isRequired,
        onClick: PropTypes.func,
        loadingShow: PropTypes.bool.isRequired
    }

    static defaultProps = {
        title: '',
        onClick() {}
    };

    state = {
        noThing: ''
    };

    componentDidMount() {
        this.found();
    }

    found = () => {
        const {text} = this.props;
        console.log(typeof (text));
        let str = '';
        switch (text) {
        case FIELD.No_Card:
            str = 'no-card';
            break;
        case FIELD.No_Order:
            str = 'no-order';
            break;
        case FIELD.No_Shopping:
        case FIELD.No_Commodity:
            str = 'no-order';
            break;
        case FIELD.No_EvaluationL:
            str = 'no-evaluation';
            break;
        case FIELD.No_Comment:
            str = 'no-evaluation';
            break;
        case FIELD.Not_Found:
            str = 'not-found';
            break;
        case FIELD.No_Template:
            str = 'no-order';
            break;
        case FIELD.No_Collection:
            str = 'no-collection';
            break;
        case FIELD.No_News:
            str = 'no-news';
            break;
        case FIELD.Await:
            str = 'await';
            break;
        case FIELD.No_Goods:
            str = 'no-goods';
            break;
        case FIELD.Succeed:
            str = 'succeed';
            break;
        case FIELD.No_Customer:
            str = 'no-customer';
            break;
        case FIELD.No_Evaluation:
            str = 'no-evaluation';
            break;
        case FIELD.No_Business:
            str = 'no-customer';
            break;
        case FIELD.Audit_Failure:
            str = 'audit-failure';
            break;
        case FIELD.Page_Crash:
            str = 'audit-failure';
            break;
        case FIELD.Net_Error:
            str = 'net-error';
            break;
        case FIELD.Server_Error:
            str = 'server-error';
            break;
        default: str = '';
        }
        this.setState({
            noThing: str
        });
    };

    renderEle = (title, onClick) => (
        <div data-component="nothing" data-role="page" className="nothing">
            <div className="bg" >
                <div className={this.state.noThing}/>
            </div>
            <p className="text" >{this.props.text}</p>
            {
                title ? (<Button onClick={onClick}>{title}</Button>) : null
            }
        </div>
    )

    render() {
        const {title, onClick} = this.props;
        const {loadingShow} = this.props;
        // console.log(loadingShow);
        return (
            loadingShow ? null : this.renderEle(title, onClick)
        );
    }
}

const mapStateToProps = state => {
    const base = state.get('base');
    return {
        loadingShow: base.get('loadingShow')
    };
};

export default connect(mapStateToProps, null)(Nothing);
