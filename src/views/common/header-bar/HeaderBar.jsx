/**
 *  app头部组件
 */
import {Icon, NavBar, Popover} from 'antd-mobile';
import PropTypes from 'prop-types';
import './HeaderBar.less';

const {appHistory} = Utils;

class HeaderBar extends React.PureComponent {
    static defaultProps = {
        withoutIcon: false,
        title: '',
        handleGoBack: null,
        backNum: 1
    };

    static propTypes = {
        withoutIcon: PropTypes.bool,
        title: PropTypes.string,
        handleGoBack: PropTypes.func,
        backNum: PropTypes.number
    };

    state = {
        visible: false
    }

    componentWillReceiveProps(nextProps) {
        /* const {withoutUpdate, title} = nextProps;
         if (!withoutUpdate) {
             native.setTitle(title);
         }
         */
    }

    handleGoBack = () => {
        const {backNum, handleGoBack} = this.props;
        let flag = true;
        if (handleGoBack) {
            flag = handleGoBack();
        }
        if (backNum && flag) {
            appHistory.go(0 - backNum);
        }
    }

    popoverIcon = str => (
        <span className={`popover-icon popover-icon-${str}`}/>
    )

    handleVisibleChange = visible => {
        this.setState({
            visible
        });
    }

    onSelect = opt => {
        console.log(opt.props);
        this.setState({
            visible: false
        });
        appHistory.push(opt.props.path);
    }

    //渲染函数
    render() {
        const {title, withoutIcon} = this.props;
        if (!window.isWX) {
            document.title = title;
            return null;
        }
        return (
            <NavBar
                className="header-bar"
                mode="dark"
                icon={<Icon type="left"/>}
                onLeftClick={this.handleGoBack}
                rightContent={
                    withoutIcon
                        ? null
                        : [
                            <Popover
                                key="1"
                                mask
                                overlayClassName="fortest"
                                overlayStyle={{color: 'currentColor'}}
                                visible={this.state.visible}
                                overlay={[
                                    (<Popover.Item path="/home" value="首页" icon={this.popoverIcon('home')}>首页</Popover.Item>),
                                    (<Popover.Item path="/share" value="分享" icon={this.popoverIcon('share')}>分享</Popover.Item>),
                                    (<Popover.Item path="/my" value="我的" icon={this.popoverIcon('my')}>我的</Popover.Item>)
                                ]}
                                align={{
                                    overflow: {adjustY: 0, adjustX: 0}
                                }}
                                onVisibleChange={this.handleVisibleChange}
                                onSelect={this.onSelect}
                            >
                                <Icon
                                    type="ellipsis"
                                    onClick={() => {
                                        this.setState({
                                            visible: true
                                        });
                                    }}
                                />
                            </Popover>
                        ]
                }
            >
                {title}
            </NavBar>
        );
    }
}

export {HeaderBar};
