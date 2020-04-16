import React from 'react';
import {List} from 'antd-mobile';
import {connect} from 'react-redux';
import {baseActionCreator as actionCreator} from '../../../../../redux/baseAction';
import AppNavBar from '../../../../common/navbar/NavBar';
import './PersonalStores.less';
import SetShop from './set-shop/set-shop';
import SetWorder from './set-shop/set-worder';
import CheckBank from './check/check';

const {urlCfg} = Configs;
const {appHistory, native} = Utils;


class PersonalStores extends BaseComponent {
    state = {
        editModal: '',
        shopInfo: {},
        url: ''
    }

    componentDidMount() {
        this.getShopInfo();
    }

    //获取店铺信息
    getShopInfo = () => {
        const {showConfirm} = this.props;
        this.fetch(urlCfg.getShopSet).subscribe(res => {
            if (res && res.status === 0) {
                if (res.data.status && res.data.status === 10) {
                    this.setState({
                        url: res.data.url
                    });
                    showConfirm({
                        title: '审核通过',
                        message: '审核通过请前去验证银行卡和签约。',
                        btnText: ['取消', '验证'],
                        callbacks: [() => { process.env.NATIVE ? native('goBack') : appHistory.goBack() }, () => { this.checkBank() }]
                    });
                } else {
                    this.setState({
                        shopInfo: {
                            shopName: res.data.shopName,
                            shopPic: res.data.picpath,
                            no: res.data.no,
                            linkName: res.data.linkName,
                            phone: res.data.phone,
                            discount: res.data.discount
                        }
                    });
                }
            }
        });
    }

    //跳轉銀行
    checkBank = () => {
        this.setState({
            editModal: 'banks'
        });
    }

    bottomModal = () => {
        const {shopInfo} = this.state;
        return (
            <div>
                <AppNavBar title="我的店铺" nativeGoBack/>
                <div className="shop-main">
                    <div>
                        <img src={shopInfo.shopPic}/>
                        <p className="shop-name">{shopInfo.shopName}</p>
                        <p className="shop-id">UID:{shopInfo.no}</p>
                        <span>优质商家</span>
                    </div>
                </div>
                <List>
                    <List.Item extra={<span className="icon shop-set"/>} onClick={() => this.setState({editModal: 'setShop'})}>店铺信息</List.Item>
                    <List.Item extra={<span className="icon shop-set"/>} onClick={() => this.setState({editModal: 'setWorder'})}>我的员工</List.Item>
                </List>
            </div>
        );
    }

    goBack = () => {
        this.setState({
            editModal: ''
        });
    }

    render() {
        const {editModal, shopInfo, url} = this.state;
        return (
            <div data-component="personal-store" className="peosonal-store">
                {!editModal && this.bottomModal()}
                {editModal === 'setShop' && <SetShop goBack={this.goBack} shopInfo={shopInfo}/>}
                {editModal === 'setWorder' && <SetWorder goBack={this.goBack}/>}
                {editModal === 'banks' && <CheckBank goBack={this.goBack} url={url}/>}
            </div>
        );
    }
}

const mapMethods = {
    showConfirm: actionCreator.showConfirm
};

export default connect(null, mapMethods)(PersonalStores);
