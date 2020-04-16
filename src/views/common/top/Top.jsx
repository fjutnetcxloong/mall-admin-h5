import React from 'react';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/fromEvent';
import 'rxjs/add/operator/debounceTime';
import './Top.less';

class Top extends React.PureComponent {
    constructor(props, context) {
        super(props, context);
    }

    state = {
        show: false
    };

    componentDidMount() {
        // 滚动事件防止抖动
        this.observalbe = Observable.fromEvent(document, 'scroll')
            .debounceTime(250)
            .subscribe(() => {
                const scrollTop = document.body.scrollTop || document.documentElement.scrollTop;
                if (scrollTop >= 200) {
                    this.setState({
                        show: true
                    });
                } else {
                    this.setState({
                        show: false
                    });
                }
            });
    }

    componentWillUnmount() {
        this.observalbe.unsubscribe(); // 停止訂閱(退訂)
    }

    goTop = () => {
        const timerId = setInterval(() => {
            const top = document.body.scrollTop || document.documentElement.scrollTop;
            const speed = top / 4;
            if (document.body.scrollTop !== 0) {
                document.body.scrollTop -= speed;
            } else {
                //用scrollTop的值循环减去speed会慢慢减速因为speed会一次比一次小
                document.documentElement.scrollTop -= speed;
            }
            if (top <= 0) {
                clearInterval(timerId);
            }
        }, 30);
    };

    render() {
        const {show} = this.state;
        return (
            <div className="icon come-back" onClick={this.goTop} style={{display: show ? 'block' : 'none'}}>
                <div className="icon come-back"/>
            </div>
        );
    }
}

export default Top;
