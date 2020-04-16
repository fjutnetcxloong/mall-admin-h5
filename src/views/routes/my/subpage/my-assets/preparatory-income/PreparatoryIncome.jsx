
/**预备收益 */

import {InputItem} from 'antd-mobile';
import 'rxjs/add/operator/map';
import './PreparatoryIncome.less';
import Income from '../single-page/income';
import AppNavBar from '../../../../../common/navbar/NavBar';

const {urlCfg} = Configs;
export default class MyAssets extends BaseComponent {
    state = {
        editModal: '', //当前状态
        reserveArr: [], //预计收益
        hasMore: true, //底部加载状态
        height: document.documentElement.clientHeight - (window.isWX ? window.rem * 1.08 : window.rem * 1.08) //扣除已占高度
    };

    componentDidMount() {
        this.getReserve();
    }

    //预收收益
    getReserve = () => {
        this.fetch(urlCfg.reserveIncome)
            .subscribe(res => {
                if (res && res.status === 0) {
                    this.setState({
                        reserveArr: res.data
                    });
                }
            });
    };

    //子页面返回的回调
    getBackChange = () => {
        this.setState({
            editModal: ''
        });
    };

    //单笔收入详情回调
    detailedPage = (data) => {
        this.setState({
            editModal: 'detail',
            currentData: data
        });
    };

    //每日收入页面回调
    myincomeJump = (data) => {
        this.setState({
            editModal: 'myIncome',
            currentData: data
        });
    };

    //金额前的正负号
    paySymbol = (value) => {
        if (value === '1') {
            return '+';
        } if (value === '0') {
            return '-';
        }
        return '';
    };

    //底部结构
    defaultModel = (row) => {
        const {reserveArr, height} = this.state;
        return (
            <div data-component="cash" data-role="page" className="cash-icom">
                <div className="cash-content">
                    {
                        window.isWX ? (<AppNavBar title="预备收益"/>) : (
                            <div className="cash-content-navbar">
                                <AppNavBar
                                    goBackModal={this.props.getBackChange}
                                    title="预备收益"
                                    rightShow
                                />
                            </div>
                        )
                    }
                    <div style={{height: height}} className="asset-info-wrap">
                        <div className="cash-content-tabs"/>
                        <div className="bottom-modal">
                            <div className="menu-line">
                                <div className="icon assets-img yellow-logo"/>
                                <InputItem
                                    value={reserveArr.cash_limit}
                                    editable={false}
                                    className="line"
                                    type="money"
                                    moneyKeyboardAlign="right"
                                    style={{borderBottom: '1px solid #CCC'}}
                                >预备收益
                                </InputItem>
                            </div>
                            <div className="menu-line">
                                <div className="icon assets-img red-logo"/>
                                <InputItem
                                    value={reserveArr.point_add}
                                    editable={false}
                                    className="line"
                                    type="money"
                                    moneyKeyboardAlign="right"
                                    style={{borderBottom: '1px solid #CCC'}}
                                >追加总量
                                </InputItem>
                            </div>
                            <div className="menu-line">
                                <div className="icon assets-img lilac-logo"/>
                                {
                                    reserveArr && (reserveArr.point_ori ? (
                                        <InputItem
                                            editable={false}
                                            value={reserveArr.point_ori}
                                            className="line-small"
                                        >原始定量
                                        </InputItem>
                                    ) : (
                                        <InputItem
                                            onClick={() => this.setState({editModal: 'income'})}
                                            editable={false}
                                            value="去设置"
                                            className="line-small"
                                        >原始定量<span className="right icon"/>
                                        </InputItem>
                                    ))
                                }
                            </div>
                        </div>
                    </div>
                </div>
                <div className="cash-bg"/>
            </div>
        );
    }

    render() {
        const row = (item) => (
            <div onClick={() => this.detailedPage(item)}>
                <div className="asset-info unde-line">
                    <p><span>{item.desc}</span><span>{this.paySymbol(item.types) }{item.scalar}</span></p>
                    <p><span>{item.crtdate}</span><span>余额：{item.remain}</span></p>
                </div>
            </div>
        );
        const {editModal} = this.state;
        return (
            <React.Fragment>
                {editModal === 'income' && <Income getBackChange={this.getBackChange}/>}
                {!editModal && this.defaultModel(row)}
            </React.Fragment>
        );
    }
}
