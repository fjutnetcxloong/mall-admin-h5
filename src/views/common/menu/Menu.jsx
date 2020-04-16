/*
* 浮动按钮
* */
import './Menu.less';

const {appHistory, native} = Utils;
let timer = null;

class Menu extends React.PureComponent {
    state = {
        text: '快速导航',
        rightNum: -2
    };

   show = (num) => {
       if (!process.env.NATIVE) {
           const {text} = this.state;
           clearInterval(timer);
           const speed = 0.5;
           if (text === '快速导航') {
               timer = setInterval(() => {
                   num += speed;
                   if (num >= 0) {
                       clearInterval(timer);
                       this.setState({
                           rightNum: 0,
                           text: '收起导航'
                       });
                   } else {
                       this.setState({
                           rightNum: num
                       });
                   }
               }, 30);
           } else {
               timer = setInterval(() => {
                   num -= speed;
                   if (this.state.rightNum <= -2) {
                       clearInterval(timer);
                       this.setState({
                           rightNum: -2,
                           text: '快速导航'
                       });
                   } else {
                       this.setState({
                           rightNum: num
                       });
                   }
               }, 30);
           }
       }
   };

    //按钮跳转
    switchTo = (type) => {
        this.menu.style.right = 38 + 'px';
        this.setState({
            text: '快速导航',
            rightNum: -2
        });
        if (process.env.NATIVE && type === '/home') {
            native('goHome');
        } else {
            appHistory.push(type);
        }
    };

    render() {
        const {text, rightNum} = this.state;
        const rights = {
            right: rightNum + 'rem'
        };
        if (!process.env.NATIVE) {
            return window.isWX && (
                <div className="menu-list" style={rights} ref={ref => { this.menu = ref }}>
                    <div className="menu" onClick={() => this.show(rightNum)}>
                        <div className={`icon ${text === '收起导航' ? 'icon-right' : 'icon-left'}`}/>
                        <div>{text}</div>
                    </div>
                    <ul className="menu-right">
                        <li onClick={() => this.switchTo('/home')}>
                            <div className="icon icon-home"/>
                            <div className="text">首页</div>
                        </li>
                        <li onClick={() => this.switchTo('/collect')}>
                            <div className="icon icon-collect"/>
                            <div className="text">收藏</div>
                        </li>
                        <li onClick={() => this.switchTo('/shopCart')}>
                            <div className="icon icon-cart"/>
                            <div className="text">购物车</div>
                        </li>
                        <li>
                            <div className="icon icon-notice"/>
                            <div className="text">消息</div>
                        </li>
                    </ul>
                </div>
            );
        }
        return null;
    }
}

export default Menu;
