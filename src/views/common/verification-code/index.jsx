import './index.less';

/**
 * styleProps 需要的样式
 * getCode 父级点击获取时的方法，父级里需要先验证是否有手机号之类的
 * getOff 判断输入的内容是否符合要求，符合要求就可以进行点击获取验证码
 */

// TODO：考虑用rxjs来重写
export default class verCode extends BaseComponent {
    state={
        verName: '获取验证码',
        countdown: Constants.COUNTERNUM,
        pasing: false //验证码倒计时是否进行中
    }

    //点击获取事件
    countDown = (time) => { //点击倒计时
        const {getCode} = this.props;
        this.setState({
            pasing: true
        }, () => {
            this.getCodeOn(time);
            getCode();
        });
    }

    //倒计时
    getCodeOn = (time) => {
        let timers = null;
        clearTimeout(timers);
        if (time === 1) {
            this.setState({
                countdown: Constants.COUNTERNUM,
                verName: '获取验证码',
                pasing: false
            });
        } else {
            time--;
            this.setState({
                countdown: time,
                verName: '重新发送 ' + time
            });
            timers = setTimeout(() => {
                this.getCodeOn(time);
            }, 1000);
        }
    }

    render() {
        const {verName, countdown, pasing} = this.state;
        const {styleProps, getCode, getOff} = this.props;
        return (
            <React.Fragment>
                {
                    getOff ? <div style={{...styleProps}} className={pasing ? 'verificartioncode' : ''} onClick={pasing ? '' : () => this.countDown(countdown)}>{verName}</div>
                        : <div style={{...styleProps}} className={pasing ? 'verificartioncode' : ''} onClick={getCode}>{verName}</div>
                }
            </React.Fragment>
        );
    }
}
