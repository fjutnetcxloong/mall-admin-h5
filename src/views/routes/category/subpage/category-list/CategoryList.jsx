/**
 * 分类页面---商品列表，商品搜索列表页
 */
import {InputItem} from 'antd-mobile';
import classNames from 'classnames';
import {connect} from 'react-redux';
import AppNavBar from '../../../../common/navbar/NavBar';
import CategoryListView from './CategoryListView';
import './CategoryList.less';

const {getUrlParam, TD, goBackModal} = Utils;
const {TD_EVENT_ID} = Constants;

class CategoryList extends BaseComponent {
    state = {
        Header: false,
        showPopup: false,
        text: 'text',
        flag: false,
        page: 1, //当前页数
        currentIndex: null,
        changeNav: 'false', //顶部当行状态
        keywords: '', //搜索关键字
        pageCount: 0, //总共页数
        keywords1: '',
        textStatus: false,
        shopId:
            parseInt(getUrlParam('id', this.props.location.search), 10) || '',
        cardNo: getUrlParam('cardNo', this.props.location.search), //优惠券页面跳转过来所需的参数
        isOriginal: getUrlParam('isOriginal', this.props.location.search),
        cardID: getUrlParam('cardId', this.props.location.search)
    };

    componentWillMount() {
        this.init();
    }

    componentWillReceiveProps(nextProps, value) {
        const {shopId, cardNo} = this.state;
        //路由跳转时的判断，id有变化就请求
        if (
            (shopId
                !== decodeURI(getUrlParam('id', encodeURI(nextProps.location.search)))) || (
                cardNo
                !== decodeURI(getUrlParam('cardNo', encodeURI(nextProps.location.search)))
            )
        ) {
            this.setState(
                {
                    shopId:
                        decodeURI(
                            getUrlParam(
                                'id',
                                encodeURI(nextProps.location.search)
                            )
                        ) === 'null'
                            ? ''
                            : decodeURI(
                                getUrlParam(
                                    'id',
                                    encodeURI(nextProps.location.search)
                                )
                            ),
                    cardNo: decodeURI(
                        getUrlParam(
                            'cardNo',
                            encodeURI(nextProps.location.search)
                        )
                    ) === 'null'
                        ? ''
                        : decodeURI(
                            getUrlParam(
                                'cardNo',
                                encodeURI(nextProps.location.search)
                            )
                        )
                },
                () => {
                    this.init();
                }
            );
        }
    }

    init = () => {
        const title = decodeURI(
            getUrlParam('title', encodeURI(this.props.location.search))
        );
        const flag = decodeURI(
            getUrlParam('flag', encodeURI(this.props.location.search))
        );
        const keywords = decodeURI(
            getUrlParam('keywords', encodeURI(this.props.location.search))
        );
        TD.log(
            TD_EVENT_ID.GOODS_CLASSIFY.ID,
            TD_EVENT_ID.GOODS_CLASSIFY.LABEL.LOOK_GOODS_DETAILS
        );
        this.setState({
            keywords: decodeURIComponent(keywords),
            changeNav: flag,
            text: decodeURI(title)
        });
    };

    //当前页面关键字搜索
    searchGoods = () => {
        const {keywords, keywords1} = this.state;
        if (keywords !== keywords1) {
            return;
        }
        this.child.getCategoryList();
    };

    //获取当前页面搜索框的keywords
    getThisKeyWords = (val) => {
        if (val && val.length > 0) {
            this.setState({
                textStatus: true
            });
        } else if (val.length === 0) {
            this.setState({
                textStatus: false
            });
        }
        this.setState({
            keywords: val,
            keywords1: val
        });
    };

    //父组件传子组件方法
    onRef = (ref) => {
        this.child = ref;
    };

    //右侧搜索文字点击
    textClick = () => {
        const {textStatus} = this.state;
        TD.log(TD_EVENT_ID.SEEK.ID, TD_EVENT_ID.SEEK.LABEL.SEEK_STUFF);
        if (textStatus) {
            this.searchGoods();
        } else {
            goBackModal();
        }
    };

    // 键盘点击事件
    keyDown = (e) => {
        if (e.keyCode === 13) {
            const {textStatus} = this.state;
            TD.log(TD_EVENT_ID.SEEK.ID, TD_EVENT_ID.SEEK.LABEL.SEEK_STUFF);
            if (textStatus) {
                this.searchGoods();
            } else {
                goBackModal();
            }
        }
    };

    render() {
        const {text, changeNav, textStatus, shopId, cardNo} = this.state;
        return (
            <div
                data-component="classify-list"
                data-role="page"
                className={classNames('classify-list', {WX: window.isWX})}
            >
                {!window.isWX
                    && (changeNav === 'true' ? (
                        <div className="seek">
                            <div className="seek-left">
                                <InputItem
                                    type="search"
                                    clear
                                    maxLength={20}
                                    placeholder="搜索商品"
                                    onKeyDown={this.keyDown}
                                    onChange={(val) => this.getThisKeyWords(val)
                                    }
                                >
                                    <div className="icon icon-lookup"/>
                                </InputItem>
                            </div>
                            <div
                                className="seek-right"
                                onClick={this.textClick}
                            >
                                {textStatus ? '搜索' : '取消'}
                            </div>
                        </div>
                    ) : (
                        <AppNavBar
                            title={text}
                            goBackModal={goBackModal}
                            status="123"
                        />
                    ))}
                <CategoryListView
                    id={shopId}
                    that={this}
                    onRef={this.onRef}
                    keywords={this.state.keywords}
                    cardNo={cardNo}
                    cardID={this.state.cardID}
                />
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    const routing = state.get('routing');
    const base = state.get('base');
    return {
        locationState: routing.get('locationState'),
        shoppingId: base.get('shoppingId')
    };
};

export default connect(mapStateToProps, null)(CategoryList);
