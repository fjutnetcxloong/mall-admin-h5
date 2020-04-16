/*
* 店铺底部TAB栏
* */
import PropTypes from 'prop-types';
import {TabBar} from 'antd-mobile';
import './ShopFooter.less';

class ShopFooter extends React.PureComponent {
    static propTypes = {
        onTabChange: PropTypes.func.isRequired,
        haveModalAll: PropTypes.bool.isRequired,
        active: PropTypes.string.isRequired
    };


    gotoPage = (path) => {
        this.props.onTabChange(path);
    }

    //底部tab按钮
    dataList = () => {
        const {haveModalAll, active} = this.props;
        const arr = [
            {
                title: '店铺首页',
                key: 'home',
                icon: <span className="icon bar-icon home-icon"/>,
                selectedIcon: <span className="icon bar-icon home-icon-active"/>,
                selected: active === 'shopHome',
                onPress: this.gotoPage.bind(this, 'shopHome')
            },
            {
                title: '全部商品',
                key: 'category',
                icon: <span className="icon bar-icon share-icon"/>,
                selectedIcon: <span className="icon bar-icon share-icon-active"/>,
                selected: active === 'category',
                onPress: this.gotoPage.bind(this, 'category')
            },
            {
                title: '商家信息',
                key: 'find',
                icon: <span className="icon bar-icon find-icon"/>,
                selectedIcon: <span className="icon bar-icon find-icon-active"/>,
                selected: active === 'find',
                onPress: this.gotoPage.bind(this, 'find')
            },
            {
                title: '联系商家',
                key: 'im',
                icon: <span className="icon bar-icon im-icon"/>,
                selectedIcon: <span className="icon bar-icon im-icon-active"/>,
                selected: active === 'im',
                onPress: this.gotoPage.bind(this, 'im')
            }
        ];
        if (!haveModalAll) { //false表示没有模板
            arr.splice(0, 1);
        }
        return arr;
    }

    render() {
        return (
            <div className="footer-bar">
                <TabBar
                    unselectedTintColor="#595959"
                    tintColor="@darker-black"
                    barTintColor="white"
                    hidden={false}
                    tabBarPosition="bottom"
                >
                    {
                        this.dataList().map(item => (
                            <TabBar.Item
                                title={item.title}
                                key={item.key}
                                icon={item.icon}
                                selectedIcon={item.selectedIcon}
                                selected={item.selected}
                                onPress={item.onPress}
                            />
                        ))
                    }
                </TabBar>
            </div>
        );
    }
}

export {ShopFooter};
