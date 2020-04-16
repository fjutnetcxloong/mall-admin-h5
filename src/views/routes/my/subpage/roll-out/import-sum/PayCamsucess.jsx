import React from 'react';
import './ImportSum.less';
import {Button, NavBar} from 'antd-mobile';

const {native, appHistory, getUrlParam} = Utils;

export default class importSum extends BaseComponent {
    state = {
        newsPopup: false, //支付信息是否弹窗
        pwsPopup: false, //支付密码是否弹窗
        money: 0, //转出金额
        sValueName: [], //转出方式名字
        uid: '', //获取uid
        shopName: '', //获取名称
        Nothings: false, //转出成功后显示页面
        sValue: 0 //转出方式id
    };

    //确认按钮
    camSucessFn = () => {
        if (process.env.NATIVE) {
            native('goHome');
        } else {
            appHistory.push('home');
        }
    }

    render() {
        const uid = decodeURI(getUrlParam('uid', encodeURI(this.props.location.search)));
        const money = decodeURI(getUrlParam('money', encodeURI(this.props.location.search)));
        return (
            <div data-component="import-sum" data-role="page" className="import-success">
                <NavBar>转出成功</NavBar>
                <div className="main">
                    <p className="cam-uid">uid:{uid}</p>
                    <div className="succeed-bg"/>
                    <p className="cam-pay">成功支付:{money}</p>
                    <Button onClick={this.camSucessFn} className="cam-sure">确定</Button>
                </div>
            </div>
        );
    }
}
