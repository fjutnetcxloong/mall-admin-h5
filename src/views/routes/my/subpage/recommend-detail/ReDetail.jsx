/**每日分享详情页面 */

import {ActionSheet, Button, Icon, Popover, NavBar} from 'antd-mobile';
import React from 'react';
import './ReDetail.less';

const Item = Popover.Item;
const {appHistory, getUrlParam, showSuccess, native, showInfo} = Utils;
const {MESSAGE: {Feedback}} = Constants;
const {urlCfg} = Configs;
const hybird = process.env.NATIVE;
const myImg = src => (
    <img src={require(`./../../../../../assets/images/${src}`)} className="am-icon am-icon-xs"/>
);

// const myImg = src => <img src={`https://gw.alipayobjects.com/zos/rmsportal/${src}.svg`} className="am-icon am-icon-xs" alt="" />
export default class ReDetail extends BaseComponent {
    constructor() {
        super();
        this.state = {
            visible: false, //nav右侧按钮显示与否
            maskStatus: false, //显示分享选择按钮
            recommendDetail: {}
        };
    }

    componentDidMount() {
        this.getRecomDetail();
    }

    getRecomDetail() {
        const orderId = decodeURI(getUrlParam('id', encodeURI(this.props.location.search)));
        this.fetch(urlCfg.getRecomDetail, {data: {id: orderId}})
            .subscribe((res) => {
                if (res) {
                    if (res.status === 0) {
                        this.setState({
                            recommendDetail: res.data
                        });
                    }
                }
            });
    }

    dataList = [
        {
            name: 'QQ',
            title: 'QQ'
        },
        {
            name: 'VX',
            title: '微信'
        },
        {
            name: 'PYQ',
            title: '朋友圈'
        },
        {
            name: 'WB',
            title: '微博'
        }
    ].map(obj => ({
        icon: <div className={obj.name}/>,
        title: obj.title
    }));

    //右侧按钮点击
    onSelect = (opt) => {
        if (opt.key === '2') {
            appHistory.push('/collect');
        } else if (opt.key === '1') {
            if (process.env.NATIVE) {
                native('goHome');
                appHistory.reduction();//重置路由
            } else {
                appHistory.push('/home');
            }
        } else if (opt.key === '3') {
            if (process.env.NATIVE) {
                native('goShop');
                appHistory.reduction();//重置路由
            } else {
                appHistory.push('/shopCart');
            }
        } else if (opt.key === '4') {
            showInfo('im');
        } else if (opt.key === '5') {
            appHistory.push('/invitation');
        }
    };

    //我的收藏
    Collection = () => {
        const {recommendDetail} = this.state;
        this.fetch(urlCfg.commodityCollection,
            {
                method: 'post',
                data: {
                    shop_id: recommendDetail.shopId,
                    shop_name: recommendDetail.shopName,
                    pr_id: recommendDetail.pr_id,
                    price: recommendDetail.price,
                    deposit: recommendDetail.deposit,
                    pr_title: recommendDetail.title
                }
            }).subscribe(res => {
            if (res.status === 0) {
                showSuccess(Feedback.Collect_Success);
            }
            this.setState({visible: false});
        });
    };

    //切换右边tab是否显示
    handleVisibleChange = (visible) => {
        this.setState({
            visible
        });
    };

    shareTrue = (value) => {
        this.setState(prevState => ({
            maskStatus: !prevState.maskStatus
        }));
        if (hybird) {
            const {recommendDetail} = this.state;
            const obj = {
                type: value + 1,
                title: recommendDetail.title,
                content: recommendDetail.intro,
                url: recommendDetail.url,
                imgUrl: recommendDetail.picpath
            };
            native('showShare', obj);
        } else {
            const {href} = this.state;
            if (value === 0) {
                window.wx.ready(() => {   //需在用户可能点击分享按钮前就先调用
                    window.wx.onMenuShareQQ({
                        title: '这是一个QQ分享', // 分享标题
                        desc: '这是企鹅号哦', // 分享描述
                        link: href, // 分享链接
                        imgUrl: 'https://img.zzha.vip/cam/mall/pr/00/00/00/00/72d7eb854a4d0d17_0.jpg?6566', // 分享图标
                        success: function () {
                        },
                        cancel: function () {
                        }
                    });
                });
            } else if (value === 3) {
                window.wx.onMenuShareTimeline({
                    title: '', // 分享描述
                    desc: '分享描述', // 分享描述
                    link: href, // 分享链接
                    imgUrl: 'https://img.zzha.vip/cam/mall/pr/00/00/00/00/72d7eb854a4d0d17_0.jpg?6566', // 分享图标
                    success: function () {
                    },
                    cancel: function () {
                        console.log(222);
                    }
                });
            } else if (value === 0) {
                //拍照
                window.wx.ready(() => {
                    window.wx.chooseImage({
                        count: 1, // 默认9
                        sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
                        sourceType: ['camera'], // 可以指定来源是相册还是相机，默认二者都有
                        success: function (res) {
                            // var localIds = res.localIds; // 返回选定照片的本地ID列表，localId可以作为img标签的src属性显示图片
                        }
                    });
                });
            } else {
                // window.wx.showAllNonBaseMenuItem();
            }
            this.setState({
                maskStatus: false
            });
        }
    };

    //立即分享
    showShareActionSheet = () => {
        this.setState(prevState => ({
            maskStatus: !prevState.maskStatus
        }));
        ActionSheet.showShareActionSheetWithOptions({
            options: this.dataList,
            message: '分享'
        }, this.shareTrue);
    };

    //保存图片
    saveImage = (pic) => {
        const {recommendDetail} = this.state;
        if (hybird) {
            native('savePicCallback', {type: 2, imgUrl: recommendDetail.picpath});
        } else {
            window.wx.ready(() => {   //需在用户可能点击分享按钮前就先调用
                window.wx.downloadImage({
                    serverId: '', // 需要下载的图片的服务器端ID，由uploadImage接口获得
                    isShowProgressTips: 1, // 默认为1，显示进度提示
                    success: function (res) {
                        // const localId = res.localId; // 返回图片下载后的本地ID
                    }
                });
            });
        }
    };

    //公共气泡
    popover = () => (
        <Popover
            mask
            overlayClassName="fortest"
            visible={this.state.visible}
            overlay={[
                (<Item style={{float: 'left'}} key="1" icon={myImg('family.svg')}><p>首页</p></Item>),
                // (<Item style={{float: 'left'}} key="2" icon={myImg('star.svg')}>收藏</Item>),
                // (<Item style={{float: 'left'}} key="3" icon={myImg('shop-cart.svg')}>购物车</Item>),
                (<Item style={{float: 'left'}} key="4" icon={myImg('info.svg')}><p>消息</p></Item>)
                // (<Item style={{float: 'left'}} key="5" icon={myImg('share.svg')}>分享</Item>)
            ]}
            align={{
                overflow: {
                    adjustY: 0,
                    adjustX: 0
                },
                offset: [0, 0]
            }}
            onVisibleChange={this.handleVisibleChange}
            onSelect={this.onSelect}
        >
            <div style={{
                height: '100%',
                marginRight: '-15px',
                display: 'flex',
                alignItems: 'center'
            }}
            >
                <Icon type="ellipsis"/>
            </div>
        </Popover>
    );

    render() {
        const {maskStatus, recommendDetail} = this.state;
        return (
            <div data-component="re-detail" data-role="page" className="re-detail">
                {
                    window.isWX ? null : (
                        <div className="re-header">
                            <NavBar
                                icon={<Icon type="left" size="lg" onClick={() => appHistory.goBack()}/>}
                                rightContent={
                                    <span className="tab-right">{this.popover()}</span>
                                }
                            >
                                每日推荐
                            </NavBar>
                        </div>
                    )
                }
                <div className={`detail-lists ${window.isWX ? 'detail-lists-clear' : ''}`}>
                    <div className="list">
                        <div className="text">
                            <p>{recommendDetail.intro}</p>
                            <p>特惠价格
                                <span
                                    className="price"
                                >￥{recommendDetail.price}
                                </span>商品可记账<span>{recommendDetail.deposit}</span>
                            </p>
                        </div>
                        <img src={recommendDetail.picpath} alt=""/>
                        {
                            window.isWX ? null : (
                                <Button className="button" onClick={this.showShareActionSheet}>立即分享</Button>
                            )
                        }
                    </div>
                </div>
                <div className="mask" style={maskStatus ? {display: 'block'} : {display: 'none'}}>
                    <img src={recommendDetail.picpath} alt=""/>
                    <p className="mask-title">{recommendDetail.intro}</p>
                    <div className="mask-price">
                        <p>￥{recommendDetail.price}</p>
                        <span>C米 : {recommendDetail.deposit}</span>
                        <img src={recommendDetail.picpath} alt=""/>
                    </div>
                    <Button onClick={this.saveImage}>保存图片</Button>
                </div>
            </div>
        );
    }
}
