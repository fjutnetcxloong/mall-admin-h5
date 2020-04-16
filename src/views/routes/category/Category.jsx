/**
 *
 * 分类页面
 */
import {Grid, Tabs} from 'antd-mobile';
import classNames from 'classnames';
import {connect} from 'react-redux';
import {dropByCacheKey} from 'react-router-cache-route';
import {FooterBar} from '../../common/foot-bar/FooterBar';
import AppNavBar from '../../common/navbar/NavBar';
import {categoryActionCreator} from './actions/index';
import {baseActionCreator} from '../../../redux/baseAction';
import './Category.less';

const {urlCfg} = Configs;
const {appHistory} = Utils;


class Category extends BaseComponent {
    state = {
        currentIndex: this.props.currentIndex
    };

    componentDidMount() {
        dropByCacheKey('CategoryListPage');  // 手动清除缓存
        const {showMenu, categoryData} = this.props;
        showMenu(false);
        if (!categoryData) {
            this.getCatGateory();
        }
    }

    componentWillUnmount() {
        super.componentWillUnmount();
        const {currentIndex} = this.state;
        const {showMenu, setIndex} = this.props;
        showMenu(true);
        setIndex(currentIndex);
    }

    // tabs切换方法
    changeTabs = (el, index) => {
        this.setState({
            currentIndex: index
        });
    };

    // 获取分类数据
    getCatGateory = () => {
        this.fetch(urlCfg.classify, {data: {id: 0, types: 1}})
            .subscribe((res) => {
                if (res && res.status === 0) {
                    this.props.setCategory(res.data);
                }
            });
    };

    // 跳转分类商品列表页
    gotoClassfyList = (el) => {
        appHistory.push({pathname: `/categoryList?id=${el.id}&title=${el.text}&keywords=${''}&flag=${false}`});
    };

    goSearch = () => {
        appHistory.push('/search');
    }

    render() {
        const {categoryData} = this.props;
        const {currentIndex} = this.state;
        return (
            <div data-component="category" data-role="page" className={classNames('category', {WX: window.isWX})}>
                <AppNavBar title="分类" show={false} rightSearch goSearch={this.goSearch}/>
                <div className="category-main content-box">
                    {categoryData && (
                        <Tabs
                            tabs={categoryData.map((item) => ({title: item.cate_name}))}
                            initalPage="t2"
                            useOnPan="true"
                            initialPage={currentIndex}
                            tabBarPosition="left"
                            tabDirection="vertical"
                            goToTab={false}
                            onTabClick={(el, index) => this.changeTabs(el, index)}
                            renderTabBar={props => <Tabs.DefaultTabBar {...props} page={10}/>}
                        >
                            {
                                categoryData.map(item => (
                                    <div className="category-main-content" key={item.id1}>
                                        {
                                            item.pic && (
                                                <div className="category-banner"><img src={item.pic} alt=""/></div>
                                            )
                                        }

                                        <div className="category-list">
                                            <div className="category-title">
                                                <p className="line"/>
                                                <p className="cate-name" key={item.cate_name}>{item.cate_name}</p>
                                                <p className="line"/>
                                            </div>
                                            <Grid
                                                data={item.cate2.map(value => ({
                                                    icon: value.img_url,
                                                    text: value.cate_name,
                                                    id: value.id2
                                                }))}
                                                columnNum={3}
                                                hasLine={false}
                                                itemStyle={{marginBottom: '20px'}}
                                                onClick={(el, index) => this.gotoClassfyList(el, index)}
                                            />
                                        </div>
                                    </div>
                                ))
                            }
                        </Tabs>
                    )}
                </div>
                <FooterBar active="category"/>
            </div>
        );
    }
}

const mapStateToProps = state => {
    const category = state.get('category');
    return {
        categoryData: category.get('categoryData'),
        currentIndex: category.get('currentIndex')
    };
};

const mapDispatchToProps = {
    showMenu: baseActionCreator.showMenu,
    setCategory: categoryActionCreator.setCategory,
    setIndex: categoryActionCreator.setIndex
};

export default connect(mapStateToProps, mapDispatchToProps)(Category);
