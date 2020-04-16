//核销失败，2019-12-19，楚小龙
import {Button} from 'antd-mobile';
import './FailWrite.less';

const {appHistory, native} = Utils;
export default class FailWrite extends BaseComponent {
    //返回
    turnBack = () => {
        if (process.env.NATIVE && appHistory.length() === 0) {
            native('goBack');
        } else {
            appHistory.goBack();
        }
    }

    render() {
        const {errCode} = this.props;
        return (
            <div className="fail-write-container">
                {/* {
                    errCode === 1 && (
                        <div className="item-container">
                            <div className="item-code-wrong"/>
                            <p className="wrong-desc">二维码出错</p>
                            <Button>重新扫描</Button>
                        </div>
                    )
                } */}
                {
                    errCode === 3 && (
                        <div className="item-container">
                            <div className="item-sys-wrong"/>
                            <p className="wrong-desc">系统开小差了，请稍后再试</p>
                            <Button onClick={this.turnBack}>返回</Button>
                        </div>
                    )
                }
                {
                    errCode === 1 && (
                        <div className="item-container">
                            <div className="item-order-wrong"/>
                            <p className="wrong-desc">非本店订单</p>
                            <Button onClick={this.turnBack}>返回</Button>
                        </div>
                    )
                }
                {
                    errCode === 2 && (
                        <div className="item-container">
                            <div className="item-order-timeout"/>
                            <p className="wrong-desc">订单已过期</p>
                            <Button onClick={this.turnBack}>返回</Button>
                        </div>
                    )
                }
            </div>
        );
    }
}