/*
* 页面跳转，滚动条返回顶部
* 错误边界
* */
import PropTypes from 'prop-types';
import {withRouter} from 'react-router-dom';
import AppNavBar from '../navbar/NavBar';
import Nothing from '../nothing/Nothing';

const {appHistory, native} = Utils;
const {FIELD} = Constants;
class ScrollToTop extends React.PureComponent {
    static propTypes = {
        children: PropTypes.object,
        location: PropTypes.object
    };

    static defaultProps = {
        children: null,
        location: null
    };

    state = {
        hasError: false
    }

    componentDidUpdate(prevProps) {
        if (this.props.location.pathname !== prevProps.location.pathname) {
            window.scrollTo(0, 0);
        }
    }

    static getDerivedStateFromError(a, v) {
        return {hasError: true};
    }

    goBackModal = () => {
        if (process.env.NATIVE && appHistory.length() === 0) {
            native('goFinish');
        } else {
            appHistory.goBack();
        }
    }

    render() {
        const {hasError} = this.state;
        if (hasError) {
            return (
                <React.Fragment>
                    <AppNavBar title="页面崩溃" goBackModal={this.goBackModal}/>
                    <Nothing
                        text={FIELD.Page_Crash}
                        title="返回"
                        onClick={this.goBackModal}
                    />
                </React.Fragment>
            );
        }
        return this.props.children;
    }
}

export default withRouter(ScrollToTop);
