/*
* 物流页面
* */
import React from 'react';
import {Accordion, List} from 'antd-mobile';
import AppNavBar from '../../../../../common/navbar/NavBar';
import './Logistics.less';

const {getUrlParam, native, appHistory} = Utils;
const {urlCfg} = Configs;
export default class MyOrder extends BaseComponent {
    state = {
        orderInfo: [], //物流信息数组
        ordertatus: '', //订单状态
        expressNo: '', //物流单号
        text: '', //订单状态描述
        pic: '', //物流图片
        area: '', //收货地址
        phone: 0 //电话
    }

    componentDidMount() {
        const id = decodeURI(getUrlParam('lgId', encodeURI(this.props.location.search)));
        this.getLog(id);
        this.initMap();
    }

    initMap = () => {
        const map = new window.BMap.Map('home');
        const point = new window.BMap.Point(116.404, 39.915);
        map.centerAndZoom(point, 15);
    };

    header = () => {
        const {area} = this.state;
        return (
            <div className="header-wrapper">
                <div className="header-left"/>
                <div className="circular"/>
                <div className="header-right">
                [收货地址]{area}
                </div>
            </div>
        );
    }

    getLog = (id) => {
        const isReturn = decodeURI(getUrlParam('isReturn', encodeURI(this.props.location.search)));
        if (id) {
            this.fetch(isReturn === '1' ? urlCfg.returnLogisticsTrack : urlCfg.logisticsTrack, {data: {
                order_id: Number(id)
            }}).subscribe(res => {
                if (res && res.status === 0) {
                    if (res.data) {
                        this.setState({
                            orderInfo: res.data.express_content ? JSON.parse(res.data.express_content).data : [],
                            ordertatus: res.data.status,
                            expressNo: res.data.express_no,
                            pic: res.data.picpath,
                            area: res.data.area,
                            phone: res.data.phone
                        }, () => {
                            this.setOrderStatus(this.state.ordertatus);
                        });
                    }
                }
            });
        }
    }

    //处理订单状态
    setOrderStatus = (status) => {
        const arr = new Map([
            ['3', '在途'],
            ['4', '揽件'],
            ['5', '疑难'],
            ['6', '签收'],
            ['7', '退签'],
            ['8', '派件'],
            ['9', '退回']
        ]);
        this.setState({
            text: arr.get(status) || '物流单号暂无结果'
        });
    }

    //拨打电话
    callPhone = () => {
        if (process.env.NATIVE) {
            native('callTel', {phoneNum: this.state.phone});
        }
    }

    goBackModal = () => {
        if (process.env.NATIVE) {
            native('goBack');
        } else {
            appHistory.goBack();
        }
    }

    render() {
        const {text, expressNo, orderInfo, pic, ordertatus, phone} = this.state;
        return (
            <div data-component="logistics" data-role="page" className="logistics">
                <AppNavBar title="物流跟踪" clannName="navbar" goBackModal={this.goBackModal}/>
                <div className="container">
                    <div id="home" style={{height: '100vh'}}/>
                    <div className="status">
                        <div className="avatar"><img src={pic} alt=""/></div>
                        <div className="info">
                            <div className="info-status">订单状态: {text}</div>
                            <div className="info-num">订单号：{expressNo}</div>
                        </div>
                        {phone && (
                            <div className="phone">
                                <div className="icon icon-phone"/>
                                <div className="phone-num" onClick={this.callPhone}>联系物流</div>
                            </div>
                        )}
                    </div>
                    <Accordion className="address">
                        <Accordion.Panel header={this.header()}>
                            {
                                orderInfo.length > 0 ? orderInfo.map((item, index) => (
                                    <List key={item}>
                                        <div className="logistics-box">
                                            <div className="logistics-left">
                                                <div className="time">{item.time.substr(5, 5)}</div>
                                                <div className="date">{item.time.substr(11, 5)}</div>
                                            </div>
                                            <div className="dot"/>
                                            <div className="logistics-right">
                                                <div className="collect">{index  === 0 && ordertatus === '6' ? '已签收' : ''}</div>
                                                <div className="news">{item.context}</div>
                                            </div>
                                        </div>
                                    </List>
                                )) : ''
                            }
                        </Accordion.Panel>
                    </Accordion>
                </div>
            </div>
        );
    }
}
