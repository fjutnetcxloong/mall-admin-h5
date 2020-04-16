
/**我的收入页面 */

import {InputItem} from 'antd-mobile';
import AppNavBar from '../../../../../common/navbar/NavBar';
import './MyIncome.less';

const {appHistory, native} = Utils;
export default class MyAssets extends BaseComponent {
    //去往我的收入页面
    goToIcome = (value) => {
        appHistory.push(`/icome?status=${value}`);
    }

    goBackModal = () => {
        if (process.env.NATIVE && appHistory.length() === 0) {
            native('goBack');
        } else {
            appHistory.goBack();
        }
    }

    render() {
        return (
            <div data-component="cash" data-role="page" className="cash">
                <div className="cash-content">
                    {
                        window.isWX ? (<AppNavBar title="我的收入"/>) : (
                            <div className="cash-content-navbar">
                                <AppNavBar
                                    title="我的收入"
                                    rightShow
                                    goBackModal={this.goBackModal}
                                />
                            </div>
                        )
                    }
                    <div
                        className="menu-line two-inco"
                        onClick={() => this.goToIcome(6)}
                    >
                        <div className="icon assets-img yellow-logo"/>
                        <InputItem
                            editable={false}
                            value=""
                            className="symb"
                        >
                            营业收入<span className="right icon"/>
                        </InputItem>
                    </div>
                    <div
                        className="menu-line two-inco"
                        onClick={() => this.goToIcome(4)}
                    >
                        <div className="icon assets-img red-money-logo"/>
                        <InputItem
                            editable={false}
                            value=""
                            className="symb"
                        >
                            业务转入<span className="right icon"/>
                        </InputItem>
                    </div>
                </div>
                <div className="cash-bg"/>
            </div>
        );
    }
}
