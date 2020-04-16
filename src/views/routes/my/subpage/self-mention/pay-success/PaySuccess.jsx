//核销码，立即使用 页面
import React from 'react';
import './PaySuccess.less';
import {urlCfg} from '../../../../../../configs';
import AppNavBar from '../../../../../common/navbar/NavBar';

const {getUrlParam} = Utils;

export default class PaySuccess extends BaseComponent {
    state = {
        orderDetail: [] //数据
    }

    componentDidMount() {
        this.getSufficiency();
    }

    //获取数据
    getSufficiency = () => {
        const id = decodeURI(getUrlParam('id', encodeURI(this.props.location.search)));
        this.fetch(urlCfg.sufficiencyCode, {data: {id}})
            .subscribe(res => {
                if (res && res.status === 0) {
                    this.setState({
                        orderDetail: res.data
                    });
                }
            });
    }

    render() {
        const {orderDetail} = this.state;
        return (
            <div data-component="Pay-success" data-role="page" className="Pay-success">
                <AppNavBar rightShow title="立即使用"/>
                <div className="number">
                    <span className="number-left">核销验证码</span>
                    <span className="number-right">
                        <span className="digit">{orderDetail.white_off}</span>
                    </span>
                </div>

                <div className="shop-plan">
                    <div className="shop-plan-top">
                        <span className="left-show">核销二维码</span>
                    </div>
                    <div className="shop-plan-center">
                        {/* <img src={orderDetail.white_off_code} alt=""/> */}
                        <img src="https://pic.zzha.vip/mall/white/qr/00/00/00/03/86246d8d53e682d4.jpg" alt=""/>
                    </div>
                    <div className="shop-plan-bottom">使用方法：核销时出示消费码给商家即可也可以到店扫码完成核销</div>
                </div>
                <div className="footer-tip">
                    <span>温馨提示</span>
                    <p>在我的订单待发货页面也可查看核销验证码哦</p>
                </div>
            </div>
        );
    }
}
