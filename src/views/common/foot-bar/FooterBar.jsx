/*
* 底部Tab栏
* */
import {TabBar} from 'antd-mobile';
import PropTypes from 'prop-types';
// import {IconFont} from '../icon-font/IconFont';
import './FooterBar.less';

const {appHistory} = Utils;

class FooterBar extends React.PureComponent {
    static propTypes = {
        active: PropTypes.string.isRequired
    };

    state = {
        selectedTab: this.props.active
    };

    gotoPage = (path) => {
        appHistory.replace(`/${path}`);
    };

    render() {
        if (!process.env.NATIVE) {
            return (
                <div className="footer-bar">
                    <TabBar
                        unselectedTintColor="#595959"
                        tintColor="@darker-black"
                        barTintColor="white"
                        hidden={false}
                        tabBarPosition="bottom"
                    >
                        <TabBar.Item
                            title="首页"
                            key="home"
                            icon={<img style={{width: '25px', height: '25px'}} src={require('../../../assets/images/homes.svg')}/>}
                            selectedIcon={<img style={{width: '25px', height: '25px'}} src={require('../../../assets/images/home.svg')}/>}
                            selected={this.state.selectedTab === 'home'}
                            onPress={() => this.gotoPage('home')}
                        />
                        <TabBar.Item
                            title="分类"
                            key="category"
                            icon={<img style={{width: '25px', height: '25px'}} src={require('../../../assets/images/cates.svg')}/>}
                            selectedIcon={<img style={{width: '25px', height: '25px'}} src={require('../../../assets/images/cate.svg')}/>}
                            selected={this.state.selectedTab === 'category'}
                            onPress={() => this.gotoPage('category')}
                        />
                        <TabBar.Item
                            title="发现"
                            key="find"
                            icon={<img style={{width: '25px', height: '25px'}} src={require('../../../assets/images/searchs.svg')}/>}
                            selectedIcon={<img style={{width: '25px', height: '25px'}} src={require('../../../assets/images/search.svg')}/>}
                            selected={this.state.selectedTab === 'find'}
                            onPress={() => this.gotoPage('find')}
                        />
                        <TabBar.Item
                            title="购物车"
                            key="shopCart"
                            icon={<img style={{width: '25px', height: '25px'}} src={require('../../../assets/images/carts.svg')}/>}
                            selectedIcon={<img style={{width: '25px', height: '25px'}} src={require('../../../assets/images/cart.svg')}/>}
                            selected={this.state.selectedTab === 'shopCart'}
                            onPress={() => this.gotoPage('shopCart')}
                        />
                        <TabBar.Item
                            title="我的"
                            key="my"
                            icon={<img style={{width: '25px', height: '25px'}} src={require('../../../assets/images/users.svg')}/>}
                            selectedIcon={<img style={{width: '25px', height: '25px'}} src={require('../../../assets/images/user.svg')}/>}
                            selected={this.state.selectedTab === 'my'}
                            onPress={() => this.gotoPage('my')}
                        />
                    </TabBar>
                </div>
            );
        }
        return null;
    }
}

export {FooterBar};
