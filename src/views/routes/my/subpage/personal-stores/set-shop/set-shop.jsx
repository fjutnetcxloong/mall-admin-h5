import React from 'react';
import {List} from 'antd-mobile';
import AppNavBar from '../../../../../common/navbar/NavBar';
import './index.less';

class SetShop extends BaseComponent {
    render() {
        const {shopInfo} = this.props;
        return (
            <div data-component="set-shop" className="set-shop">
                <AppNavBar goBackModal={this.props.goBack} title="店铺信息"/>
                <div className="shop-main">
                    <div>
                        <img src={shopInfo.shopPic}/>
                        <p className="shop-name">{shopInfo.shopName}</p>
                        <p className="shop-id">UID:{shopInfo.no}</p>
                        <span>优质商家</span>
                    </div>
                </div>
                <List>
                    <List.Item extra={shopInfo.discount}>折扣</List.Item>
                    <List.Item extra={shopInfo.linkName}>联系人</List.Item>
                    <List.Item extra={shopInfo.phone}>联系电话</List.Item>
                </List>
            </div>
        );
    }
}

export default SetShop;
