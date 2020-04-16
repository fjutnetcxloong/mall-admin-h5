/** 协商历史*/
import AppNavBar from '../../../../../common/navbar/NavBar';
import {IconFont} from '../../../../../common/icon-font/IconFont';
import './ConsultHistory.less';

// FIXME: 使用无状态函数
// 已优化
export default class ConsultHistory extends React.PureComponent {
    render() {
        return (
            <div className="consult-history">
                <AppNavBar title="协商历史"/>
                <div className="consult-center">
                    <div className="consult-list">
                        <div className="consult-top">
                            {/*<img src={require('../../../../../../assets/images/sheep.png')} alt="" className="sculpture"/>*/}
                            <div className="consult-wrap">
                                <div className="consult-name">用户名</div>
                                <div className="consult-timer">2019-04-27 15:23:15</div>
                            </div>
                        </div>
                        <div className="consult-bottom">
                            发起了仅退款申请，货物状态：未发货，原因：多拍/拍错/不想要，金额：100.00元。
                        </div>
                    </div>
                    <div className="consult-list">
                        <div className="consult-top">
                            {/*<img src={require('../../../../../../assets/images/sheep.png')} alt="" className="sculpture"/>*/}
                            <div className="consult-wrap">
                                <div className="consult-name">用户名</div>
                                <div className="consult-timer">2019-04-27 15:23:15</div>
                            </div>
                        </div>
                        <div className="consult-bottom">
                            发起了仅退款申请，货物状态：未发货，原因：多拍/拍错/不想要，金额：100.00元。
                        </div>
                    </div>
                </div>
                <div className="consult-btn">
                    <IconFont iconText="iconIM-zhutou"/>
                    <div className="consult-text">联系商家</div>
                </div>
            </div>
        );
    }
}
