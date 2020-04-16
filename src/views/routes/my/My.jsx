/**
 * 我的  页面
 * type 为2 商户
 * type 为1 grade 为1   身份为消费者
 * type 为1 grade 为3    身份为推广员
 *
 * 只有商家有两种身份,可以进行切换，商家和消费者；
 * iden_type 为 1 普通消费者；为2 商家， 为3 推广员，为4，双重身份中的消费者
 */
import {WhiteSpace, Badge, Grid, Carousel, WingBlank, List} from 'antd-mobile';
import {connect} from 'react-redux';
import {dropByCacheKey} from 'react-router-cache-route';
import {baseActionCreator} from '../../../redux/baseAction';
import {myActionCreator} from './actions/index';
import {FooterBar} from '../../common/foot-bar/FooterBar';
import MyLogistics from './subpage/my-logistics/MyLogistics';
import './My.less';

const {appHistory, rollStatus: {offRoll, openRoll, getScrollTop}} = Utils;

//商家顶部导航模块
const shopOrder = [
    {
        text: '核销订单',
        className: 'icon indent'
    },
    /*{
        text: '评价中心',
        className: 'icon merchant-evaluate'
    },*/
    {
        text: '二维码',
        className: 'icon qr-code'
    }
];
//消费者或推广员顶部导航模块
const consumerOrder = [
    {
        text: '收藏夹',
        className: 'icon sharing'
    },
    {
        text: '浏览历史',
        className: 'icon history'
    },
    {
        text: '评价中心',
        className: 'icon assessment-center'
    },
    {
        text: '二维码',
        className: 'icon qr-code'
    },
    {
        text: '优惠券',
        className: 'icon coupon'
    }
];

class My extends BaseComponent {
    constructor(props) {
        super(props);
        this.state = {
            userInfo: [], //用户个人信息
            logistics: [], //物流信息
            imgHeight: 140,
            position: 0,
            openShopStatus: '' //开店状态
        };
        dropByCacheKey('OrderPage');//清除我的订单的缓存
        dropByCacheKey('selfMentionOrderPage');//清除线下订单
        dropByCacheKey('PossessEvaluate');//清除我的评价的缓存
        dropByCacheKey('History');//清除浏览历史的缓存
    }

    componentDidMount() {
        const {showMenu, myInfo, getMyInfo} = this.props;
        showMenu(false);
        if (!myInfo) {
            getMyInfo({iden_type: 0});
        }
    }

    componentWillUnmount() {
        super.componentWillUnmount();
        const {showMenu} = this.props;
        showMenu(true);
    }

    //消费者或推广员cam信息
    consumer = [
        // {
        //     title: 'CAM转出',
        //     icon: 'tOut',
        //     event: '/rollOut'
        // },
        // {
        //     title: '资产管理',
        //     icon: 'asset',
        //     event: `/myAssets?userToken=${this.props.myInfo && this.props.myInfo.info.iden_type}`
        // },
        {
            title: '区域总量',
            icon: 'custer',
            event: '/customer'
        },
        {
            title: '我的客户',
            icon: 'busin',
            event: '/business'
        }
    ];

    //核销订单评价中心等跳转
    switchTo = (index) => {
        const {myInfo} = this.props;
        let url = '';
        if (myInfo && myInfo.info.iden_type === '2') {
            url = new Map([
                [0, '/inspectOrder'],
                // [1, `/possessEvaluate?userType=${myInfo.info.iden_type}`],
                [1, '/invitation']
            ]);
        } else {
            url = new Map([
                [0, '/collect'],
                [1, '/browseHistory'],
                // [2, `/possessEvaluate?userType=${myInfo.info.iden_type}`],
                [2, '/possessEvaluate'],
                [3, '/invitation'],
                [4, '/cardVoucher/dl']
            ]);
        }
        appHistory.push(url.get(index));
    };

    //消息或者设置跳转
    routeTo = (type) => {
        const {myInfo} = this.props;
        if (type === 'notice') {
            appHistory.push('/notice');
        } else {
            appHistory.push(`/edit?userType=${myInfo.info.iden_type}`);
        }
    };

    //跳转我的订单
    gotoMyOrder = (index) => {
        const url = new Map([
            [0, '/myOrder/fk'],
            [1, '/myOrder/fh'],
            [2, '/myOrder/sh'],
            [3, '/myOrder/pj'],
            [4, '/myOrder/ssh']
        ]);
        appHistory.push(url.get(index));
    };

    //线下订单跳转
    gotoSelfMyOrder=(index) => {
        const url = new Map([
            [0, '/selfMention/ww'],
            [1, '/selfMention/yw'],
            [2, '/selfMention/sh']
        ]);
        appHistory.push(url.get(index));
    }

    //页面跳转
    jumpRouter = (url) => {
        if (url === '/selectType') {
            appHistory.push('/openShopPage');
            // if (window.isWX) {
            //     this.props.history.push('/openShopPage');
            //     console.log(this.props.history, 'props');
            // } else {
            //     appHistory.push('/openShopPage');
            // }
            // showInfo('等等');
            // removeValue('shopStatus');
            // this.fetch(urlCfg.applyForRight).subscribe(res => {
            //     if (res && res.status === 0) {
            //         // setValue('shopStatus', JSON.stringify(res.data.status));
            //         this.setState({
            //             openShopStatus: res.data.status
            //         }, () => {
            //             const {openShopStatus} = this.state;
            //             if (openShopStatus === 9) {
            //                 appHistory.push(`/openShopPage?shopType=${res.data.shop_type}&auditStatus=${'now'}`);
            //             } else if (openShopStatus === 6) {
            //                 showInfo('您已提交过开店申请，请不要重复提交！');
            //                 return;
            //             } else if (openShopStatus === 4) {
            //                 appHistory.push(`/openShopPage?shopType=${res.data.shop_type}&auditStatus=${'filed'}`);
            //             } else if (openShopStatus === 3) {
            //                 // if (res.data.shop_type === 2 || res.data.shop_type === 0) {
            //                 //     appHistory.push(`/personal?shopType=${res.data.shop_type}&auditStatus=${'three'}`);
            //                 // } else {
            //                 //     appHistory.push(`/individual?shopType=${res.data.shop_type}&auditStatus=${'three'}`);
            //                 // }
            //                 appHistory.push(`/selectType?shopType=${res.data.shop_type}&auditStatus=${''}`);
            //             } else if (openShopStatus === 7) {
            //                 if (res.data.shop_type === 2 || res.data.shop_type === 0) {
            //                     appHistory.push(`/personal?shopType=${res.data.shop_type}&auditStatus=${'four'}`);
            //                 } else {
            //                     appHistory.push(`/individual?shopType=${res.data.shop_type}&auditStatus=${'four'}`);
            //                 }
            //             } else {
            //                 appHistory.push(`${url}?status=${this.state.openShopStatus}&cerType=${res.data.shop_type}`);
            //             }
            //         });
            //     }
            // });
        } else {
            appHistory.push(url);
        }
    }

    //点击展开物流信息
    logisticsInfo = (id) => {
        const {logistics} = this.state;
        this.setState({
            selectIndex: logistics.findIndex(item => item.id === id),
            logInfo: logistics,
            showLogistics: true
        }, () => {
            this.position = getScrollTop();
            offRoll(this.position);
        });
    };

    //物流信息关闭
    closeLogitasce = () => {
        this.setState({
            showLogistics: false
        });
        openRoll(this.position);
    };

    //物流状态
    logisticsStatus = (num) => {
        let str = '';
        switch (num) {
        case '0':
            str = '物流单号暂无结果';
            break;
        case '3':
            str = '在途';
            break;
        case '4':
            str = '揽件';
            break;
        case '5':
            str = '疑难';
            break;
        case '6':
            str = '签收';
            break;
        case '7':
            str = '退签';
            break;
        case '8':
            str = '派件';
            break;
        case '9':
            str = '退回';
            break;
        default:
            str = '物流单号暂无结果';
        }
        return str;
    }

    render() {
        const {showLogistics, imgHeight, selectIndex} = this.state;
        const {myInfo} = this.props;
        const userInfo = myInfo && myInfo.info;//用戶相关信息
        const picArr = myInfo && myInfo.pic; //广告位
        const logistics = myInfo && myInfo.logistics; //物流信息
        return (
            <div data-component="my" data-role="page" className="my">
                <div className="aroundBlank">
                    <div className="my-top">
                        <div className="my-top-info">
                            <div className="my-info-icon">
                                <WhiteSpace size="xl"/>
                                <div className="icon icon-notice" onClick={() => this.routeTo('set')}/>
                                {
                                    !window.isWX && (
                                        <div className="icon icon-notice-l" onClick={() => this.routeTo('notice')}/>
                                    )
                                }
                            </div>
                            <div className="my-info-basic">
                                <div className="info-basic-portrait">
                                    <div className="basic-basic-img-parent">
                                        <img
                                            onClick={this.routeTo}
                                            src={myInfo && (userInfo.avatarUrl || require('../../../assets/images/avatar.png'))}
                                            className="basic-basic-img"
                                            alt=""
                                        />
                                    </div>
                                </div>
                                <div className="info-basic-data">
                                    <div className="designation">
                                        <span className="basic-data-name">{myInfo && (userInfo.nickname || '')}</span>
                                        <Badge
                                            text={myInfo && (userInfo.typeName)}
                                        />
                                    </div>
                                    <div className="basic-data-UID" onClick={this.routeTo}>UID:{myInfo && (userInfo.no)}</div>
                                </div>
                            </div>
                        </div>
                        <div className="my-top-icon">
                            <Grid
                                data={(myInfo && myInfo.info.iden_type === '2') ? shopOrder : consumerOrder}
                                // columnNum={(myInfo && myInfo.info.iden_type === '2') ? 3 : 3}
                                columnNum={consumerOrder.length}
                                hasLine={false}
                                activeStyle={false}
                                renderItem={dataItem => (
                                    <div className="navigation-bar">
                                        <div className={dataItem.className}/>
                                        <div>{dataItem.text}</div>
                                    </div>
                                )}
                                onClick={(el, index) => this.switchTo(index)}
                            />
                        </div>
                    </div>

                    <div className="setUpShop" onClick={() => this.jumpRouter((myInfo && myInfo.info.iden_type === '1') ? '/selectType' : myInfo.info.url.split('#')[1])}>
                        <img src={myInfo && (userInfo.shop_url)} alt=""/>
                    </div>
                    {   //用户身份不为消费者时展示
                        myInfo && myInfo.info.iden_type === '1' && myInfo.info.iden_type === '4' && (
                            <div className="reven">
                                <div>
                                    <span><i>￥</i>{(myInfo && myInfo.info.iden_type === '2') ? myInfo && userInfo.this_day : myInfo && userInfo.this_month}</span>
                                    <p>{(myInfo && myInfo.info.iden_type === '2') ? '今日总收入' : '本月收入'}</p>
                                </div>
                                <div>
                                    <span><i>￥</i>{(myInfo && myInfo.info.iden_type === '2') ? myInfo &&  userInfo.last_day : myInfo &&  userInfo.last_month}</span>
                                    <p>{(myInfo && myInfo.info.iden_type === '2') ? '昨日总收入' : '上月收入'}</p>
                                </div>
                            </div>
                        )
                    }
                    <div className="my-order-form">
                        <div className="my-order-box">
                            <div className="order-box-name">线下订单</div>
                            <div onClick={() => this.jumpRouter('/selfMention')} className="order-box-see">查看全部<span className="icon Arrow"/></div>
                        </div>
                        <div className="my-selfOrder-icon">
                            <Grid
                                data={myInfo && myInfo.menuc}
                                columnNum={myInfo && myInfo.menuc.length}
                                hasLine={false}
                                activeStyle={false}
                                renderItem={dataItem => (
                                    <div className="orderInfo">
                                        <img src={dataItem.image} className="orderLogo"/>
                                        {/* <div className={dataItem.className + ' orderLogo selfOrder'}/> */}
                                        <Badge text={dataItem.num !== '0' ? dataItem.num : ''}/>
                                        <div>{dataItem.value}</div>
                                    </div>
                                )}
                                onClick={(ev, index) => this.gotoSelfMyOrder(index)}
                            />
                        </div>
                    </div>
                    <div className="my-order-form">
                        <div className="my-order-box">
                            <div className="order-box-name">线上订单</div>
                            <div onClick={() => this.jumpRouter('/myOrder/qb')} className="order-box-see">查看全部<span className="icon Arrow"/></div>
                        </div>
                        <div className="my-order-icon">
                            <Grid
                                data={myInfo && myInfo.menub}
                                columnNum={myInfo && myInfo.menub.length}
                                hasLine={false}
                                activeStyle={false}
                                renderItem={dataItem => (
                                    <div className="orderInfo">
                                        <img src={dataItem.image} className="orderLogo"/>
                                        {/* <div className={dataItem.className + ' orderLogo'}/> */}
                                        <Badge text={dataItem.num !== '0' ? dataItem.num : ''}/>
                                        <div>{dataItem.value}</div>
                                    </div>
                                )}
                                onClick={(ev, index) => this.gotoMyOrder(index)}
                            />
                            {
                                (myInfo && logistics.length) ? (
                                    <div className="logistics-box">
                                        <WingBlank>
                                            <Carousel
                                                autoplay
                                                infinite
                                                autoplayInterval={3000}
                                            >
                                                { logistics.map(val => (
                                                    <div
                                                        key={val}
                                                        style={{display: 'inline-block', width: '100%', height: imgHeight}}
                                                        onClick={() => this.logisticsInfo(val.id)}
                                                    >
                                                        <div className="logistics">
                                                            <div className="l-newest">
                                                                <span>最新物流</span>
                                                                <span>{val.push_time}</span>
                                                            </div>
                                                            <div className="l-position">
                                                                <span className="lp-left">
                                                                    <img src={val.picpath} alt=""/>
                                                                </span>
                                                                <span className="lp-right">
                                                                    <div className="state">
                                                                        <span className="icon state-left"/>
                                                                        <span className="state-right">{this.logisticsStatus(val.status)}</span>
                                                                    </div>
                                                                    {val.express_content && <div className="location">{(val.express_content.data && val.express_content.data.length > 0) ? val.express_content.data[0].context : ''}</div>}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </Carousel>
                                        </WingBlank>
                                    </div>
                                ) : null
                            }
                        </div>
                    </div>
                    <div className="my-order-form">
                        <div className="my-order-box">
                            {/* <div className="order-box-name">CAM系统</div> */}
                        </div>
                        <div>
                            <div className="conumer-info">
                                <List>
                                    {this.consumer.map((item, index) => (
                                        index === 0 && (<List.Item arrow="horizontal" key={item.title} onClick={() => this.jumpRouter(item.event)}> <span className={'icon ' + item.icon}/><p>{item.title}</p></List.Item>)
                                    ))}
                                </List>
                            </div>
                            <div className="conumer-info">
                                <List>
                                    {this.consumer.map((item, index) => (
                                        index === 1 && (<List.Item arrow="horizontal" key={item.title} onClick={() => this.jumpRouter(item.event)}> <span className={'icon ' + item.icon}/> <p>{item.title}</p></List.Item>)
                                    ))}
                                </List>
                            </div>
                        </div>
                        {
                            myInfo && picArr && picArr.length > 0 &&  (
                                <div className="my-banner">
                                    <WingBlank>
                                        <Carousel
                                            autoplay
                                            infinite
                                            autoplayInterval={3000}
                                        >
                                            { picArr.map(val => (
                                                <img key={val.url} src={val.url}/>
                                            ))}
                                        </Carousel>
                                    </WingBlank>
                                </div>
                            )
                        }
                    </div>
                </div>
                {
                    showLogistics && <MyLogistics closeLogitasce={this.closeLogitasce} logInfo={logistics} selectIndex={selectIndex}/>
                }
                <FooterBar active="my"/>
            </div>
        );
    }
}

const mapStateToProps = state => {
    const edit = state.get('my');
    return {
        myInfo: edit.get('myInfo')
    };
};
const mapDispatchToProps = {
    showMenu: baseActionCreator.showMenu,
    setUserToken: baseActionCreator.setUserToken,
    setUseType: baseActionCreator.setUseType,
    showConfirm: baseActionCreator.showConfirm,
    delEdit: myActionCreator.delEdit,
    getMyInfo: myActionCreator.getMyInfo
};

export default connect(mapStateToProps, mapDispatchToProps)(My);
