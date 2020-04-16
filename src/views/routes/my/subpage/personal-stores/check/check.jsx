/**核对银行卡页面 */


import React from 'react';
import './check.less';
import {InputItem} from 'antd-mobile';
import AppNavBar from '../../../../../common/navbar/NavBar';

const {urlCfg} = Configs;
export default class Check extends BaseComponent {
    constructor(props, context) {
        super(props, context);
    }

    state = {
        money: '',
        bankId: ''
    }

    getBank = (val, type) => {
        if (type === '1') {
            this.setState({
                bankId: val
            });
        } else {
            this.setState({
                money: val
            });
        }
    }

    checkBank = () => {
        const {money} = this.state;
        const {url} = this.props;
        this.fetch(urlCfg.checkBank, {data: {
            money: parseFloat(money)
        }}).subscribe(res => {
            if (res && res.status === 0) {
                window.location.href = url;
            }
        });
    }

    render() {
        return (
            <div className="check">
                <AppNavBar title="验证银行卡"/>
                <div className={`bank-box ${window.isWX ? 'bank-box-clear' : ''}`}>
                    <div className="input-field">
                        <div className="bank-num">
                            <InputItem
                                clear
                                placeholder="请输入银行卡号"
                                onChange={val => this.getBank(val, '1')}
                            >银行卡号
                            </InputItem>
                        </div>
                        <div className="amount">
                            <InputItem
                                clear
                                placeholder="请输入收到的金额数字"
                                onChange={val => this.getBank(val, '2')}
                            />
                            <span>发送验证金额</span>
                        </div>
                    </div>
                    <div className="hint">
                        <p>温馨提示</p>
                        <p>您需在发送验证金额的48小时内完成验证，请确保您的银行卡处于正常使用状态。</p>
                    </div>
                    <div className="next" onClick={this.checkBank}>下一步</div>
                </div>
            </div>
        );
    }
}
