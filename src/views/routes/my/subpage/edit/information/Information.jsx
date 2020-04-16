//消息设置页面

import React from 'react';
import {List, Switch} from 'antd-mobile';
import AppNavBar from '../../../../../common/navbar/NavBar';
import './Information.less';

const {urlCfg} = Configs;

export default class Information extends BaseComponent {
    state = {
        height: document.documentElement.clientHeight - (window.isWX ? window.rem * null : window.rem * 1.08), //是微信扣除头部高度
        data: {
            message: 0, //初始信息状态
            customer: 0//初始信息状态
        }
    };

    componentDidMount() {
        this.getMessage();
    }

    getMessage = () => {
        this.fetch(urlCfg.messageSetupStatus).subscribe(res => {
            if (res && res.status === 0) {
                //判断初始是否有值
                if (res.data.length) {
                    this.setState({
                        data: res.data
                    });
                }
            }
        });
    }

    //消息设置
    message = () => {
        const {data} = this.state;
        data.message = !data.message ? 1 : 0;
        this.setState({
            data: {...data}
        });
        this.fetch(urlCfg.setMessageSetupStatus, {data})
            .subscribe(res => {});
    }

    //收益消息设置
    profit = () => {
        const {data} = this.state;
        data.income = !data.income ? 1 : 0;
        this.setState({
            data: {...data}
        });
        this.fetch(urlCfg.setMessageSetupStatus, {data})
            .subscribe(res => {});
    }

    //新客户设置
    newOrder = () => {
        const {data} = this.state;
        data.customer = !data.customer ? 1 : 0;
        this.setState({
            data: {...data}
        });
        this.fetch(urlCfg.setMessageSetupStatus, {data})
            .subscribe(res => {});
    }

    render() {
        const {height} = this.state;
        return (
            <div data-component="information" data-role="page" className="information">
                <AppNavBar title="消息通知"/>
                <div style={{height: height}} className="tidings-box">
                    <List>
                        <List.Item
                            extra={(
                                <Switch
                                    checked={this.state.data.message}
                                    color="red"
                                    onClick={this.message}
                                />
                            )}
                        >接收消息通知
                        </List.Item>
                        {/* <List.Item
                        extra={(
                            <Switch
                                checked={this.state.data.income}
                                color="red"
                                onClick={this.profit}
                            />
                        )}
                    >收益消息
                    </List.Item> */}
                        <List.Item
                            extra={(
                                <Switch
                                    checked={this.state.data.customer}
                                    color="red"
                                    onClick={this.newOrder}
                                />
                            )}
                        >新客户消息
                        </List.Item>
                    </List>
                </div>
            </div>
        );
    }
}
