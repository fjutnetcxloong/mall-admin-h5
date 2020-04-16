/**我要开店页面 */


import React from 'react';
import './ScanDetermine.less';
import AppNavBar from '../../../../../common/navbar/NavBar';

const {appHistory} = Utils;

export default class ScanDetermine extends BaseComponent {
    constructor(props, context) {
        super(props, context);
    }

    routeTo = () => {
        appHistory.push('/agreement');
    }

    render() {
        return (
            <div data-component="scan-determine" data-role="page" className="scan-determine">
                <AppNavBar title="确认推荐人"/>
                <div className="recommend-content">
                    <div className="picture">
                        {/*<img src={require('../../../../../../assets/images/sheep.png')} alt=""/>*/}
                    </div>
                    <div className="information">
                        <p>庄漂亮</p>
                        <p>UID:888888</p>
                        <p>
                            <span>手机号：</span>
                            <span>175****8815</span>
                        </p>
                    </div>
                    <div className="button">
                        <div className="normal-button general">重新扫码</div>
                        <div className="normal-button important" onClick={this.routeTo}>下一步</div>
                    </div>
                </div>
            </div>
        );
    }
}
