import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import AppNavBar from '../../../../../common/navbar/NavBar';
import Agree from '../agreement/Agreement';
import './selectType.less';

const {appHistory} = Utils;

class SelfType extends React.PureComponent {
    state = {
        agree: false
    }

    static defaultProps = {
        intro: {},
        checkParentStatus: () => {}
    };

    static propTypes = {
        intro: PropTypes.object,
        checkParentStatus: PropTypes.func
    }

    //跳转开店
    routeTo = (type, num) => {
        appHistory.push(`/openShopPage?shopType=${type}&shopStatus=${num}`);
    };

    show = () => {
        this.setState({
            agree: true
        });
    }

    close = () => {
        this.setState({
            agree: false
        });
    }

    render() {
        const {intro, checkParentStatus} = this.props;
        const {agree} = this.state;
        return (
            <div className="chose-type">
                {
                    agree ? (<Agree close={this.close}/>) : (
                        <React.Fragment>
                            <AppNavBar
                                title="选择开店类型"
                                rightExplain
                                goBackModal={checkParentStatus}
                                rightExplainClick={this.show}
                                nativeGoBack
                            />
                            <div className="type-box" onClick={() => this.routeTo('self', 0)}>
                                <h3 className="type-title">个人店</h3>
                                <p className="type-body">
                                    {intro.person}
                                </p>
                            </div>
                            <div className="type-box" onClick={() => this.routeTo('net', 2)}>
                                <h3 className="type-title shop">网店</h3>
                                <p className="type-body">
                                    {intro.net}
                                </p>
                            </div>
                        </React.Fragment>
                    )
                }
            </div>
        );
    }
}

const mapState = state => {
    const my = state.get('my');
    return {
        message: my.get('message')
    };
};

export default connect(mapState, null)(SelfType);