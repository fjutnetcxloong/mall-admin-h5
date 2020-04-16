/**
 *
 * 商品详情页面
 */
import {Carousel, Flex, Icon, List, Popover, Stepper} from 'antd-mobile';
import {connect} from 'react-redux';
import {Link, Element, scrollSpy, animateScroll} from 'react-scroll';
import Recommend from './components/Recommend';
import Evaluate from './components/Evaluate';
import Coupon from './components/Coupon';
// import Specification from './components/specification';
import Specification from './components/specification';
import {shopCartActionCreator as action} from '../../../shop-cart/actions';
import {baseActionCreator as actionCreator} from '../../../../../redux/baseAction';
import Sku from '../../../../common/sku/Sku';
import './GoodsDetail.less';

const {urlCfg} = Configs;
const {
    appHistory,
    getUrlParam,
    showFail,
    showInfo,
    native,
    TD,
    systemApi: {setValue, removeValue},
    nativeCssDiff
} = Utils;
const {
    MESSAGE: {Form, Feedback},
    TD_EVENT_ID
} = Constants;

const myImg = src => (
    <img
        src={require(`../../../../../assets/images/${src}`)}
        className="am-icon am-icon-xs"
    />
);
const listText = [
    {
        title: '商品',
        key: 'goods'
    },
    {
        title: '评价',
        key: 'evaluate'
    },
    {
        title: '推荐',
        key: 'recommend'
    },
    {
        title: '规格',
        key: 'specification'
    },
    {
        title: '详情',
        key: 'details'
    }
];
const Item = Popover.Item;
class GoodsDetail extends BaseComponent {
    state = {
        topSwithe: true,
        popup: false, //sku是否显示
        paginationNum: 1,
        goodsDetail: {}, //详情界面
        picPath: [], //轮播
        shop: {}, //  详情商店数据
        recommend: [], //店铺商品推荐
        goodsAttr: [],
        stocks: [],
        type: '',
        names: [], //选中商品属性
        collect: [], //商品收藏状态
        status: '1', //判断商品是否下架
        visible: false,
        text: '',
        lineStatus: false, //底部商品状态栏
        ids: [], //选中属性id
        goodsSku: [], //商品的结果集
        lineText: '', //商品状态栏文字
        pickType: {}, //配送方式
        selectType: '1', //选中配送方式 1快递 2自提
        clickType: 0, //打开sku的方式 0箭头 1购物车 2立即购买
        totalNUm: 0, //商品库存,
        goodId: decodeURI(
            getUrlParam('id', encodeURI(this.props.location.search))
        ),
        hasType: false,
        evalute: {},
        max: 0, //商品库存
        propsData: this.props,
        specification: [], // 京东商品参数
        list: [],
        specificationStatus: true,
        couponStatus: false, // 优惠券modal框
        isZM: true, // 判断当前是否是中卖
        couponList: {}, // 优惠券数据
        getCoupon: [], // 当前优惠券领取状态
        isDetail: true, // 判断页面
        maxNums: 0, // 优惠券最大面额
        sayNo: false, // 暂无优惠券
        maskStatus: false
    };

    componentDidMount() {
        this.init();
    }

    init = () => {
        this.getGoodsDetail();
        window.addEventListener('scroll', this.handleScroll);
        scrollSpy.update();
    };

    componentWillUnmount() {
        // 清除选中sku
        this.setState({
            ids: []
        });
    }

    //网页滚动
    handleScroll = e => {
        const scrollTop =            document.documentElement.scrollTop || document.body.scrollTop;
        if (scrollTop / window.devicePixelRatio > 50) {
            this.setState({topSwithe: false});
        } else if (scrollTop / window.devicePixelRatio <= 100) {
            this.setState({topSwithe: true});
        }
    };

    static getDerivedStateFromProps(nextProps, prevState) {
        return {
            propsData: nextProps
        };
    }

    componentDidUpdate(prevProps, prevState) {
        if (process.env.NATIVE) {
            const id = decodeURI(
                getUrlParam(
                    'id',
                    encodeURI(this.state.propsData.location.search)
                )
            );
            const {goodId} = this.state;
            if (id !== goodId) {
                // eslint-disable-next-line react/no-did-update-set-state
                this.setState(
                    {
                        topSwithe: true,
                        popup: false, //sku是否显示
                        paginationNum: 1,
                        goodsDetail: {}, //详情界面
                        picPath: [], //轮播
                        shop: {}, //  详情商店数据
                        recommend: [], //店铺商品推荐
                        goodsAttr: [],
                        stocks: [], // sku属性
                        type: '',
                        names: [], //选中商品属性
                        collect: [], //商品收藏状态
                        status: '1', //判断商品是否下架
                        visible: false,
                        text: '',
                        lineStatus: false, //底部商品状态栏
                        ids: [], //选中属性id
                        goodsSku: [], //商品的结果集
                        // shopAddress: '', // 店铺位置
                        lineText: '', //商品状态栏文字
                        pickType: {}, //配送方式
                        selectType: '1', //选中配送方式 1快递 2自提
                        clickType: 0, //打开sku的方式 0箭头 1购物车 2立即购买
                        totalNUm: 0, //商品库存,
                        goodId: id,
                        couponStatus: false
                    },
                    () => {
                        this.init();
                    }
                );
            }
        }
    }

    //获取商品详情
    getGoodsDetail = () => {
        const {goodId} = this.state;
        this.fetch(urlCfg.getGoodsDetail, {data: {id: goodId}}).subscribe(
            res => {
                if (res.status === 0) {
                    animateScroll.scrollToTop();
                    const stocks = [];
                    res.sku.forEach(item => {
                        stocks.push({
                            attribute: item.attribute,
                            original_price: item.price_original,
                            price: item.price,
                            stock: item.stock,
                            deposit: item.deposit
                        });
                    });
                    const evalute = res.pingjia ? res.pingjia : {};
                    evalute.count = res.pingjia_count;
                    const specification = [];
                    res.data.jd_parameter
                        && Object.keys(res.data.jd_parameter).forEach(item => {
                            specification.push(res.data.jd_parameter[item]);
                        });
                    this.setState(
                        {
                            goodsDetail: res.data,
                            picPath: res.data.picpath,
                            shop: res.shop, // 店铺信息,
                            recommend: res.recommend_pr, // 商品推荐
                            collect: res.had_coll,
                            status: res.data.status,
                            goodsSku: res.sku,
                            goodsAttr: res.data.attr_arr, //商品属性
                            stocks: stocks,
                            pickType: res.data.distribution_mode,
                            totalNUm: res.data.num_stock,
                            list:
                                res.data.app_type && res.data.app_type === '2'
                                    ? listText.filter(
                                        item => item.title !== '规格'
                                    )
                                    : listText.filter(item => item.title !== '推荐'),
                            evalute: evalute,
                            hasType: res.data.distribution_mode.data.some(
                                item => item.value === '到店自提'
                            ),
                            specification,
                            ids: res.data.app_type === '3'
                                ? res.data.attr_arr_list[0][0]
                                : [],
                            isZM: res.data.app_type === '2'
                        },
                        () => {
                            this.getGoodsStatus();
                            this.getCoupon();
                        }
                    );
                }
            }
        );
    };

    //开启sku
    openSku = () => {
        this.setState({
            popup: true,
            clickType: 0
        });
    };

    //关闭sku
    closeSku = () => {
        this.setState({
            popup: false
        });
    };

    //确定按钮点击
    confirmSku = (type, ids, names, clickType) => {
        const {goodsAttr} = this.state;
        if (ids.length < goodsAttr.length) {
            showFail('请选择完整的商品属性');
            return;
        }
        this.setState({
            selectType: type,
            clickType,
            ids: ids,
            names,
            popup: false
        }, () => {
            if (this.state.clickType === 1) {
                TD.log(TD_EVENT_ID.STORE.ID, TD_EVENT_ID.STORE.LABEL.STORE_HOME);
                this.addCart();
            } else if (this.state.clickType === 2) {
                this.emption();
            }
        });
    };

    //添加商品到购物车
    addCart = () => {
        const {shop, goodsDetail, paginationNum, ids, selectType, status, max, goodsAttr} = this.state;
        // console.log('点击了购买', ids);
        if (shop.shoper_open_status === '0' || status === '0' || status === '2') {
            return;
        }
        if (paginationNum === 0 || ids.length !== goodsAttr.length) {
            this.setState({
                popup: true,
                clickType: 1
            });
            return;
        }
        if (selectType === '3') {
            showInfo(Feedback.Select_Consume);
            return;
        }
        if (paginationNum > max) {
            console.log(max, paginationNum);
            showFail('商品库存不足');
            return;
        }
        this.fetch(urlCfg.addShopCart, {
            data: {
                if_express: selectType,
                shop_id: shop.id,
                shop_no: shop.no,
                shop_name: shop.shopName,
                picnum: 1,
                pr_id: goodsDetail.id,
                deposit: goodsDetail.deposit,
                num: paginationNum,
                sku: ids.join(',')
            }
        }).subscribe(res => {
            if (res && res.status === 0) {
                if (res.data) {
                    if (res.data.status === 2) {
                        showFail(Feedback.Not_Allow_Repeat);
                    } else if (res.data.status === 6) {
                        showFail(Feedback.Failed_Property);
                    } else if (res.data.status === 5) {
                        showFail(res.message);
                    }
                } else {
                    showInfo(Feedback.Add_Success);
                    this.setState({
                        ids: []
                    });
                }
            }
        });
    };

    //立即购买
    emption = () => {
        const {
            shop,
            status,
            goodsDetail,
            paginationNum,
            ids,
            selectType
        } = this.state;
        if (
            shop.shoper_open_status === '0'
            || status === '0'
            || status === '2'
        ) {
            return;
        }
        if (!paginationNum) {
            showFail('请输入购买商品数量!');
            return;
        }
        const str = ids.toString();
        if (str.length === 0) {
            this.setState({
                popup: true,
                clickType: 2
            });
            return;
        }
        const arr = [];
        arr.push({
            if_express: selectType,
            pr_id: parseInt(goodsDetail.id, 10),
            property: str,
            num: paginationNum,
            no: shop.no
        });
        console.log(arr, 'asdjksahdkj');
        const {setOrder} = this.props;
        setOrder(arr);
        setValue('orderArr', JSON.stringify(arr));
        if (selectType === '1') {
            appHistory.push(`/appendorder?source=${2}`);
        } else {
            appHistory.push('/selfMentionDetail');
        }
    };

    //收藏商品
    collect = () => {
        const {shop, goodsDetail, collect} = this.state;
        const id = goodsDetail.id;
        if (collect.length > 0) {
            this.delCollect();
        } else {
            this.fetch(urlCfg.addCollectSingle, {
                data: {
                    pr_id: id,
                    shop_id: shop.id,
                    shop_name: shop.shopName,
                    price: goodsDetail.price,
                    deposit: goodsDetail.deposit,
                    pr_title: goodsDetail.title
                }
            }).subscribe(res => {
                if (res && res.status === 0) {
                    showInfo('收藏成功！');
                    this.getGoodsDetail();
                }
            });
        }
    };

    //取消商品收藏
    delCollect = () => {
        const {collect} = this.state;
        this.fetch(urlCfg.cancelCollect, {
            data: {
                type: 1,
                ids: collect
            }
        }).subscribe(res => {
            if (res && res.status === 0) {
                showInfo('取消收藏成功!');
                this.getGoodsDetail();
            }
        });
    };

    //图片放大
    openMask = pic => {
        this.setState({
            maskPic: pic,
            maskStatus: true
        });
    };

    // 关闭图片mask
    maskClose = () => {
        this.setState({
            maskPic: '',
            maskStatus: false
        });
    };

    //跳转店铺首页
    shopH = id => {
        appHistory.push(`/shopHome?id=${id}`);
    };

    // 跳转购物车
    shopCart = () => {
        //判断订单状态
        this.props.setOrderStatus('');
        //店铺里面判断状态的id
        this.props.setshoppingId('');
        //清除收藏状态
        this.props.setTab('');
        if (process.env.NATIVE) {
            native('goShop');
            appHistory.reduction(); //重置路由
        } else {
            appHistory.push('/shopCart');
        }
    };

    // 跳转回首页
    goHome = (val, key) => {
        if (process.env.NATIVE && key === 0) {
            native('goHome');
        }
        if (key === 0) {
            appHistory.replace('/home');
            this.setState({
                visible: false
            });
        }
        //判断订单状态
        this.props.setOrderStatus('');
        //店铺里面判断状态的id
        this.props.setshoppingId('');
        //清除收藏状态
        this.props.setTab('');
    };

    //获取商品状态
    getGoodsStatus = () => {
        const {status} = this.state;
        switch (status) {
        case '0':
            this.setState({
                lineStatus: true,
                lineText: '已下架'
            });
            break;
        case '2':
            this.setState({
                lineStatus: true,
                lineText: '商品已下架'
            });
            break;
        default:
            this.setState({
                lineStatus: false,
                lineText: ''
            });
        }
    };

    // 返回上一级
    goBackModal = () => {
        if (process.env.NATIVE && appHistory.length() === 0) {
            native('goBack');
        } else {
            appHistory.goBack();
        }
        //清除缓存
        removeValue('orderArr');
    };

    //改变购买数量
    onChangeCount = value => {
        const {max} = this.state;
        if (value > max) {
            showFail(Form.No_Stocks);
            this.setState({
                paginationNum: max
            });
        } else {
            this.setState({
                paginationNum: value
            });
        }
    };

    //切换右边tab是否显示
    handleVisibleChange = visible => {
        this.setState({
            visible
        });
    };

    //右侧按钮点击
    onSelect = opt => {
        if (opt.key === '2') {
            appHistory.push('/collect'); //收藏页面
        } else if (opt.key === '1') {
            if (process.env.NATIVE) {
                native('goHome');
                appHistory.reduction(); //重置路由
            } else {
                appHistory.push('/home');
            }
        } else if (opt.key === '3') {
            if (process.env.NATIVE) {
                native('goShop');
                appHistory.reduction(); //重置路由
            } else {
                appHistory.push('/shopCart');
            }
        } else if (opt.key === '4') {
            if (process.env.NATIVE) {
                const obj = {'': ''};
                native('goToIm', obj);
            } else {
                showInfo('im');
            }
        } else if (opt.key === '5') {
            appHistory.push('/invitation?share=1'); //分享页面
        }
    };

    //联系商家
    goToShoper = () => {
        const {shop, goodsDetail} = this.state;
        const id = goodsDetail.id;
        if (process.env.NATIVE) {
            native('goToShoper', {
                shopNo: shop.no,
                id,
                type: '1',
                shopNickName: shop.nickname,
                imType: '1',
                groud: '0'
            }); //groud 为0 单聊，1群聊 imType 1商品2订单3空白  type 1商品 2订单
        } else {
            showInfo('联系商家');
        }
    };

    //分享按钮
    popover = () => (
        <Popover
            onSelect={opt => this.onSelect(opt)}
            visible={this.state.visible}
            onVisibleChange={this.handleVisibleChange}
            overlay={[
                <Item key="1" icon={myImg('family.svg')}>
                    <p>首页</p>
                </Item>,
                <Item key="2" icon={myImg('star.svg')}>
                    收藏
                </Item>, //产品说C端屏蔽了
                !window.isWX && (
                    <Item key="3" icon={myImg('shop-cart.svg')}>
                        购物车
                    </Item>
                ),
                !window.isWX && (
                    <Item key="4" icon={myImg('info.svg')}>
                        <p>消息</p>
                    </Item>
                )
            ]}
        >
            <Icon type="ellipsis"/>
        </Popover>
    );

    // 推荐商品点击
    goToShopRecom = id => {
        if (process.env.NATIVE) {
            appHistory.replace(`/goodsDetail?id=${id}`);
        } else {
            this.setState(
                {
                    goodId: id
                },
                () => {
                    this.getGoodsDetail();
                }
            );
        }
    };

    // 跳转评价
    routeToEvalute = id => {
        appHistory.push(`/evaluate?id=${id}`);
    };

    changeSpecification = () => {
        this.setState(prevState => ({
            specificationStatus: !prevState.specificationStatus
        }));
    };

    // 生成星星
    createStar = () => {
        const {shop} = this.state;
        // console.log(shop.shop_mark);
        const slot = shop.shop_mark && shop.shop_mark.split('.')[1];
        const value = Number(shop.shop_mark);
        // console.log(value);
        const arr = [];
        for (let i = 0; i < Math.floor(value); i++) {
            const star = <div className="icon icon-tiny" key={i}/>;
            arr.push(star);
        }
        if (slot >= 5) {
            const stars = <div className="icon icon-stars"/>;
            arr.push(stars);
        }
        return arr;
    };

    // 生成评分等级
    returnLev = num => {
        const score = num && Number(num);
        const base = {
            width: '20px',
            height: '20px',
            lineHeight: '20px',
            textAlign: 'center',
            color: '#fff'
        };
        let ele;
        if (score > 4) {
            ele = <div style={{...base, background: '#FF2D51'}}>高</div>;
        } else if (score > 2.5 && score < 4) {
            ele = <div style={{...base, background: 'orange'}}>中</div>;
        } else if (score < 2.5) {
            ele = <div style={{...base, background: '#999'}}>低</div>;
        } else {
            ele = <div/>;
        }
        return ele;
    };

    // 打开优惠券
    openCoupon = () => {
        console.log('object');
        this.setState({
            couponStatus: true
        });
    }

    // 关闭优惠券
    closeCoupon = () => {
        this.setState({
            couponStatus: false
        });
    }

    // 领取优惠券
    useCoupon = (index, no) => {
        const {getCoupon} = this.state;
        if (getCoupon[index]) {
            this.setState({
                couponStatus: false
            });
            return;
        }
        const status = [...getCoupon];

        this.fetch(urlCfg.reciveCard, {data: {card_no: no}}).subscribe(res => {
            if (res && res.status === 0) {
                this.setState(pre => {
                    status.splice(index, 1, true);
                    return {
                        getCoupon: status
                    };
                });
            }
        });
    }

    // 获取优惠券
    getCoupon = () => {
        const {goodId, shop} = this.state;
        this.fetch(urlCfg.getCoupon, {data: {type: 3, pr_id: parseInt(goodId, 10), shop_id: parseInt(shop.id, 10)}}).subscribe(res => {
            if (res && res.status === 0) {
                const nums = res.data.card_list.map(item => parseInt(item.price_limit.replace(/[^0-9]/ig, ''), 10));
                const max = nums.length > 0 ? Math.min.apply(null, nums) : null;
                this.setState({
                    couponList: res.data,
                    getCoupon: res.data && Array(res.data.card_num).fill(false),
                    maxNums: max
                });
            }
        });
    }

    render() {
        const {
            topSwithe, popup, paginationNum, ids, maskStatus,
            picPath, goodsDetail, shop, recommend, collect, status, evalute,
            goodsAttr, stocks, lineStatus, lineText, specification, specificationStatus, isZM, isDetail, couponList, pickType, selectType, names, hasType, list, couponStatus
        } = this.state;

        // console.log(specification);
        const renderCount = max => {
            this.setState(() => ({
                max
            }));
            return (
                <List>
                    <List.Item
                        wrap
                        extra={(
                            <Stepper
                                style={{width: '100%', minWidth: '100px'}}
                                showNumber
                                max={max}
                                min={1}
                                value={paginationNum}
                                onChange={this.onChangeCount}
                            />
                        )}
                    >
                        数量
                    </List.Item>
                </List>
            );
        };
        return (
            <div
                data-component="goodsDetail"
                data-role="page"
                className={
                    this.state.popup ? 'goods-detail ido' : 'goods-detail'
                }
            >
                {topSwithe ? (
                    <div className="navBar-title-top">
                        <Flex>
                            <Flex.Item>
                                {window.isWX ? null : (
                                    <div
                                        className="back-left"
                                        onClick={this.goBackModal}
                                    >
                                        <div className="icon icon-back"/>
                                    </div>
                                )}
                            </Flex.Item>
                            <Flex.Item>
                                <div className="back-right">
                                    {this.popover()}
                                </div>
                            </Flex.Item>
                        </Flex>
                    </div>
                ) : (
                    <div className="navBar-title">
                        <ul className="list-wrapper">
                            <li className="list">
                                <div className="back">
                                    {window.isWX ? null : (
                                        <div
                                            className="icon icon-back"
                                            onClick={this.goBackModal}
                                        />
                                    )}
                                </div>
                            </li>
                            <li className="list">
                                <ul>
                                    {list.length > 0
                                        && list.map(item => (
                                            <li
                                                key={item.title}
                                                className="items"
                                            >
                                                <Link
                                                    activeClass="on on-tab"
                                                    to={item.key}
                                                    spy
                                                    smooth
                                                    duration={500}
                                                >
                                                    {item.title}
                                                </Link>
                                            </li>
                                        ))}
                                </ul>
                            </li>
                            <li className="list">
                                <div className="back">{this.popover()}</div>
                            </li>
                        </ul>
                    </div>
                )}
                <Carousel autoplay infinite>
                    {picPath.map(item => (
                        <div key={item} onClick={e => this.openMask(e)}>
                            <img src={item} className="banner-img"/>
                        </div>
                    ))}
                </Carousel>
                {/* </Element> */}
                {/*商品详情规格*/}
                <div className="goods-norms">
                    <div className="norms-money" name="goods">
                        <div className="money">
                            ￥{goodsDetail.price}{' '}
                            <p className="money-max">
                                ￥{goodsDetail.price_original}
                            </p>
                        </div>
                        <div className="money-keep">
                            <div className="btn-keep">
                                C米：{goodsDetail.deposit}
                            </div>
                        </div>
                        <div
                            className={
                                goodsDetail.app_type === '3'
                                    ? 'norms-title norms-type'
                                    : 'norms-title'
                            }
                        >
                            {goodsDetail.title}
                        </div>
                        {goodsDetail && goodsDetail.app_type === '2' && (
                            <div className="norms-bottom">
                                <Flex>
                                    <Flex.Item>
                                        <div className="bot-left">
                                            邮费：
                                            {goodsDetail.express_money && (
                                                <span>
                                                    {'￥'
                                                        + goodsDetail.express_money
                                                        || '免邮'}
                                                </span>
                                            )}
                                        </div>
                                    </Flex.Item>
                                    <Flex.Item>
                                        <div className="bot-center">
                                            销量：{goodsDetail.num_sold}
                                        </div>
                                    </Flex.Item>
                                    <Flex.Item>
                                        <div className="bot-right">
                                            {/* {shopAddress} */}
                                            {shop.area}
                                        </div>
                                    </Flex.Item>
                                </Flex>
                            </div>
                        )}
                    </div>

                    {/*店铺、商品规格*/}
                    <Evaluate
                        names={names}
                        isZM={isZM}
                        routeToEvalute={() => this.routeToEvalute(evalute.id)}
                        evalute={evalute}
                        hasType={hasType}
                        goodsDetail={goodsDetail}
                        Element={Element}
                        shop={shop}
                        shopH={this.shopH}
                        openSku={this.openSku}
                        openCoupon={this.openCoupon}
                        createStar={this.createStar}
                        returnLev={this.returnLev}
                        max={this.state.maxNums}
                    />

                    {/*店铺推荐*/}
                    {goodsDetail && goodsDetail.app_type === '2' && (
                        <Recommend
                            recommend={recommend}
                            Element={Element}
                            goToShopRecom={this.goToShopRecom}
                        />
                    )}

                    {/**  优惠券弹框 */}
                    <Coupon
                        couponStatus={couponStatus}
                        closeCoupon={this.closeCoupon}
                        couponList={couponList && couponList.card_list}
                        title="领取优惠券"
                        useCoupon={this.useCoupon}
                        getCoupon={this.state.getCoupon}
                        isDetail={isDetail}
                    />
                    {goodsDetail && goodsDetail.app_type === '3' && (
                        <Specification
                            Element={Element}
                            specification={specification}
                            specificationStatus={specificationStatus}
                            changeSpecification={this.changeSpecification}
                            Link={Link}
                        />
                    )}

                    {/*商品详情*/}
                    <div className="recommend-commodity-detail">
                        <div className="currency-detail">
                            <Flex className="currency-detail-title">
                                <Flex.Item className="title-border"/>
                                <Flex.Item className="title-center">
                                    商品详情
                                </Flex.Item>
                                <Flex.Item className="title-border"/>
                            </Flex>
                        </div>
                    </div>
                    <Element
                        name="details"
                        className="detail-img lis"
                        dangerouslySetInnerHTML={{__html: goodsDetail.intro}}
                    />

                    {lineStatus ? (
                        <div className="timeout">{lineText}</div>
                    ) : null}
                    {/*底部固定购买栏*/}
                    {shop.shoper_open_status === '0' && (
                        <div className="rest">该店暂未营业</div>
                    )}
                    {/*底部弹出选择商品框*/}
                    {popup && (
                        <Sku
                            detail={goodsDetail}
                            isZM={isZM}
                            paginationNum={paginationNum}
                            attributes={goodsAttr}
                            stocks={stocks}
                            cover={picPath[0]}
                            select={ids}
                            onClose={this.closeSku}
                            onSubmit={this.confirmSku}
                            extra={renderCount}
                            type={pickType}
                            selectType={selectType}
                        />
                    )}
                    {maskStatus && (
                        <div className="picMask" onClick={this.maskClose}>
                            <Carousel autoplay={false} infinite>
                                {picPath.map(item => (
                                    <div key={item}>
                                        <img
                                            src={item}
                                            className="banner-img"
                                            alt=""
                                        />
                                    </div>
                                ))}
                            </Carousel>
                        </div>
                    )}
                </div>
                <div className="goodsDetail-bottom">
                    <div
                        className="icons-warp"
                        style={{width: nativeCssDiff() ? '2.6rem' : '3rem'}}
                    >
                        <div className="icons">
                            <div
                                className="phone-cart"
                                onClick={this.goToShoper}
                            >
                                <div className="icon icon-phone"/>
                                <div className="phone-text">联系卖家</div>
                            </div>
                            <div className="phone-cart" onClick={this.collect}>
                                <div
                                    className={`icon ${
                                        collect.length > 0
                                            ? 'icon-collect-active'
                                            : 'icon-collect'
                                    }`}
                                />
                                <div className="phone-text">收藏</div>
                            </div>
                            <div className="phone-cart" onClick={this.shopCart}>
                                <div className="icon icon-cart"/>
                                <div className="phone-text">购物车</div>
                            </div>
                        </div>
                    </div>
                    {goodsDetail.effective_type === '0'
                        || goodsDetail.app_type === '2' ? (
                            <div
                                className={`${
                                    status === '0' || status === '2'
                                        ? 'disble-btn'
                                        : 'bottom-btn'
                                }`}
                                style={{
                                    border: nativeCssDiff()
                                        ? '1PX solid #ff2d51'
                                        : '0.02rem solid #ff2d51'
                                }}
                            >
                                <Flex>
                                    <Flex.Item
                                        className={`${
                                            status === '0' || status === '2'
                                                ? 'disable-cart'
                                                : 'cart'
                                        }`}
                                        onClick={this.addCart}
                                    >
                                        加入购物车
                                    </Flex.Item>
                                    <Flex.Item
                                        className={`${
                                            status === '0' || status === '2'
                                                ? 'disable-emption'
                                                : 'emption'
                                        }`}
                                        onClick={() => this.emption('pay')}
                                    >
                                        立即购买
                                    </Flex.Item>
                                </Flex>
                            </div>
                        ) : (
                            <div
                                className="pay-now"
                                onClick={() => this.emption('pay')}
                            >
                                立即购买
                            </div>
                        )}
                    {/* <div className="pay-now" onClick={() => this.emption('pay')}>立即购买</div> */}
                </div>
            </div>
        );
    }
}

const mapDispatchToProps = {
    setOrder: action.setOrder,
    setshoppingId: actionCreator.setshoppingId,
    setTab: actionCreator.setTab,
    setOrderStatus: actionCreator.setOrderStatus
};
export default connect(null, mapDispatchToProps)(GoodsDetail);
