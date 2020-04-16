/**支付完成页面 */

import React from 'react';
import {connect} from 'react-redux';
import {dropByCacheKey} from 'react-router-cache-route';
import AppNavBar from '../../../../../common/navbar/NavBar';
import {baseActionCreator as actionCreator} from '../../../../../../redux/baseAction';
import './PaymentCompleted.less';

const {appHistory, getUrlParam, native, systemApi: {getValue, removeValue}} = Utils;
const mode = [
    {
        title: 'CAM余额',
        value: '0',
        imgName: 'we-chat'
    },
    {
        title: '微信支付',
        value: '1',
        imgName: 'we-chat'
    },
    {
        title: '支付宝支付',
        value: '2',
        imgName: 'alipay'
    }
];

class PaymentCompleted extends BaseComponent {
    componentWillMOunt() {
        dropByCacheKey('OrderPage');//清除我的订单的缓存
        dropByCacheKey('selfMentionOrderPage');//清除线下订单
        //清除缓存
        removeValue('orderInfo');
        removeValue('orderArr');
    }

    goToHome = () => {
        if (process.env.NATIVE) {
            native('goHome');
        } else {
            appHistory.replace('/home');
        }
    }

    //查看订单
    seeOrderInfo = () => {
        const id = decodeURI(getUrlParam('id', encodeURI(this.props.location.search))); //订单id
        const express = decodeURI(getUrlParam('if_express', encodeURI(this.props.location.search))); //订单购买方式 线上 线下
        const batch = decodeURI(getUrlParam('batch', encodeURI(this.props.location.search))); //订单购买方式 线上 线下
        if (express === '1') { //线上
            if (batch === '1') { //线上批量付款
                appHistory.replace('/myOrder/fhp');
            } else {
                appHistory.replace(`/listDetails?id=${id}`);
            }
        } else if (batch === '1') { //线下付款或线下批量付款
            appHistory.replace('/selfMention?type=home');
        } else {
            appHistory.replace(`/selfOrderingDetails?id=${id}`);
        }
        appHistory.reduction();
    }

    //前往优惠券页面
    goToCoupon = () => {
        appHistory.replace('/cardVoucher');
    }

    render() {
        const {location: {search}} = this.props;
        const allPrice = decodeURI(getUrlParam('allPrice', encodeURI(search)));
        const deposit = decodeURI(getUrlParam('deposit', encodeURI(search)));
        const types = decodeURI(getUrlParam('types', encodeURI(search)));
        const card = decodeURI(getUrlParam('card', encodeURI(search)));
        const cardPrice = decodeURI(getUrlParam('cardPrice', encodeURI(search)));
        let str = '';
        mode.forEach(item => {
            if (item.value === types) {
                str = item.title;
            }
        });
        return (
            <div data-component="Payment-completed" data-role="page" className="Payment-completed">
                <AppNavBar goBackModal={this.seeOrderInfo} rightShow title="支付成功"/>
                <div className="finish">
                    <img src={require('../../../../../../assets/images/finish.png')} alt=""/>
                    <div className="finish-bottom">订单支付成功</div>
                </div>
                <div className="bill">
                    <div className={(card === 'null') ? 'frame-jd' : 'frame-success'}>
                        <div className="bill-top">
                            <span>C米</span>
                            <span>+{deposit || getValue('orderInfo').all_deposit}</span>
                        </div>
                        <div className="bill-top center">
                            <span>支付方式</span>
                            <span>{str}</span>
                        </div>
                        <div className="bill-top">
                            <span>支付金额</span>
                            <span>￥{allPrice || getValue('orderInfo').all_price}</span>
                        </div>
                    </div>
                </div>
                {
                    card !== 'null' && (
                        <div className="red-env">
                            <div className="env-money"><span>￥</span>{cardPrice}</div>
                            <div className="env-main">
                                <p>恭喜您获得{cardPrice}元购物券</p>
                                <span>请到<span className="my-coupon icon" onClick={this.goToCoupon}>我的优惠券</span>中查看</span>
                            </div>
                        </div>
                    )
                }
                <div className="remider">
                    <span>温馨提示：</span>
                    <p>中卖网不会以订单异常、系统升级为由要求您点击任何网址链接进行退款操作。</p>
                </div>
                <div className="instructions">
                    <div className="see" onClick={this.seeOrderInfo}>查看订单</div>
                    <div className="return" onClick={this.goToHome}>返回首页</div>
                </div>
            </div>
        );
    }
}

const mapDidpatchToProps = {
    setReturn: actionCreator.setReturn
};
export default connect(null, mapDidpatchToProps)(PaymentCompleted);
