/* 转出页面*/
import React from 'react';
import './RollOut.less';
import {List, InputItem} from 'antd-mobile';
import AppNavBar from '../../../../common/navbar/NavBar';

const {urlCfg} = Configs;
const {showInfo, validator, appHistory, native, nativeCssDiff} = Utils;
const {MESSAGE: {Form}} = Constants;

export default class ReDetail extends BaseComponent {
    state = {
        uidList: [], //最近转出记录列表
        uid: '' //获取uid
    }

    componentDidMount() {
        this.rollOutList();
    }

    //获取最近转出记录列表
    rollOutList = () => {
        this.fetch(urlCfg.getRollout).subscribe(res => {
            if (res && res.status === 0) {
                this.setState({
                    uidList: res.data
                });
            }
        });
    }

    //获取UID
    getUid = (res) => {
        this.setState({
            uid: res
        });
    }

    //跳转CAM转出-支付
    importSum = () => {
        const {uid} = this.state;
        if ((!validator.floatType(uid) || !uid)) {
            showInfo(Form.No_Uid);
        } else {
            this.fetch(urlCfg.dfinfo, {data: {no: uid}}).subscribe(res => {
                if (res && res.status === 0) {
                    this.skipSum(uid, res.data.shopName);
                }
            });
        }
    }

    //列表跳转到支付页面
    skipSum = (uid, name) => {
        appHistory.push(`/importSum?uid=${uid}&shopName=${encodeURI(name)}`);
    }

    //跳转转出记录
    transferRecord = () => {
        appHistory.push('transferRecord');
    }

    //点击扫一扫
    sweepCode = () => {
        if (process.env.NATIVE) {
            const obj = {
                pay: urlCfg.importSum,
                write: urlCfg.consumer,
                source: urlCfg.sourceBrowse
            };
            native('qrCodeScanCallback', obj);
        } else if (window.isWX) {
            window.wx.ready(() => {
                window.wx.scanQRCode({
                    needResult: 0, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
                    scanType: ['qrCode', 'barCode'] // 可以指定扫二维码还是一维码，默认二者都有
                });
            });
        }
    }

    render() {
        const {uidList} = this.state;
        return (
            <div data-component="roll-out" data-role="page" className="roll-out">
                <AppNavBar title="CAM转出" nativeGoBack/>
                <div className="import-box">
                    <div className={`import-UID ${nativeCssDiff() ? 'general-other' : 'general'}`}>
                        <List>
                            <InputItem
                                type="number"
                                maxLength="6"
                                clear
                                placeholder="请输入对方UID"
                                onChange={(res) => this.getUid(res)}
                            />
                        </List>
                        <div onClick={this.sweepCode} className="icon icon-scan"/>
                    </div>
                    <span>请确认无误后转款，转出后无法退款。</span>
                    <div className="large-button important" onClick={this.importSum}>下一步</div>
                </div>
                <div className={`transfer ${window.isWX ? 'transfer-clear' : ''}`}>
                    <span className="record">
                        <span>最近转出</span>
                        <span onClick={this.transferRecord}>转出记录</span>
                    </span>
                    {(uidList && uidList.length > 0) ? (
                        <div>
                            {uidList.slice(0, 10).map(item => (
                                <div className="message" key={item.UID} onClick={() => this.skipSum(item.UID, item.shopName)}>
                                    <img
                                        src={item.picpath}
                                        alt=""
                                    />
                                    <div className="message-bottom">
                                        <div>{item.shopName}</div>
                                        <div>UID：{item.UID}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (<div className="piteraTake">暂无最近转出记录</div>)}
                </div>
            </div>
        );
    }
}
