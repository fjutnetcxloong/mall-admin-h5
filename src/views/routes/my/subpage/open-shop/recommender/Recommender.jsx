/**我要开店页面 */


import React from 'react';
import './Recommender.less';
import {List, InputItem} from 'antd-mobile';
import AppNavBar from '../../../../../common/navbar/NavBar';

const {urlCfg} = Configs;

const {appHistory, showInfo, native, systemApi: {setValue}} = Utils;
export default class Recommender extends BaseComponent {
    constructor(props, context) {
        super(props, context);
    }

    state = {
        height: document.documentElement.clientHeight - (window.isWX ? window.rem * null : window.rem * 1.08), //判断是否使用微信登入
        UID: '',
        phone: '',
        verification: false
    }

    routeTo = () => {
        const {verification} = this.state;
        if (verification) {
            appHistory.push('/selectType');
        } else {
            showInfo('请先去验证推荐人');
            return;
        }
    }

    //获取输入内容
    onChange = (el, type) => {
        if (type === 'uid') {
            this.setState({
                UID: el
            });
        } else if (type === 'phone') {
            this.setState({
                phone: el
            });
        }
    }

    //验证
    verification = () => {
        const {UID, phone} = this.state;
        const myPhone = Number(phone.replace(/\s+/g, ''));
        this.fetch(urlCfg.setparent, {data: {
            no: Number(UID),
            phone: myPhone,
            type: 0
        }}).subscribe(res => {
            if (res) {
                if (res.status === 0) {
                    showInfo('验证成功');
                    this.setState({
                        verification: true
                    });
                    this.shopInfo();
                }
            }
        });
    }

    goBack = () => {
        appHistory.goBack();
    }

    shopInfo = () => {
        this.fetch(urlCfg.applyForRight).subscribe(res => {
            if (res && res.status === 0) {
                setValue('shopStatus', JSON.stringify(res.data.status));
            }
        });
    }

    //点击扫一扫
    nativeSaoMa = () => {
        if (process.env.NATIVE) {
            const obj = {
                pay: urlCfg.importSum,
                write: urlCfg.consumer,
                source: urlCfg.sourceBrowse
            };
            native('qrCodeScanCallback', obj);
        }
    }

    render() {
        const {height} = this.state;
        return (
            <div data-component="recommender" data-role="page" className="recommender">
                <AppNavBar title="确认推荐人"/>
                <div style={{height: height}} className="recommender-box">
                    <List>
                        <div className="survey-icon icon" onClick={this.nativeSaoMa}>1.扫码确认</div>
                        <div className="manual">2.手动输入确认</div>
                        <InputItem
                            clear
                            type="number"
                            placeholder="请输入推荐人UID"
                            onChange={(el) => { this.onChange(el, 'uid') }}
                        >推荐人UID
                        </InputItem>
                        <InputItem
                            clear
                            type="phone"
                            placeholder="请输入推荐人手机号"
                            onChange={(el) => { this.onChange(el, 'phone') }}
                        >推荐人手机号
                        </InputItem>
                    </List>
                    <div className="cozy">
                        <p>温馨提示</p>
                        <p>输入的UID与手机号要是同一用户才可验证成哦</p>
                    </div>
                    <div className="testing">
                        <div className="large-button general" onClick={this.verification}>验证</div>
                    </div>
                    <div className="next">
                        <div className="normal-button general" onClick={this.goBack}>取消</div>
                        <div className="normal-button important" onClick={this.routeTo}>下一步</div>
                    </div>
                </div>
            </div>
        );
    }
}
