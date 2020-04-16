/**右上角分享按钮 */

import {Popover} from 'antd-mobile';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import {baseActionCreator as actionCreator} from '../../../redux/baseAction';
import './index.less';

const Item = Popover.Item;

const myImg = src => (
    <img src={require(`./../../../assets/images/${src}`)} className="am-icon am-icon-xs"/>
);

const {appHistory, native, showInfo} = Utils;

class showButton extends BaseComponent {
    static propTypes = {
        visible: PropTypes.object.isRequired
    }

    //选择分享类型
    onSelect = (opt) => {
        if (opt.key === '2') {
            appHistory.push('/collect');//我的收藏
        } else if (opt.key === '1') {
            if (process.env.NATIVE) {
                native('goHome');
            } else {
                appHistory.push('/home');
            }
            //判断订单状态
            this.props.setOrderStatus('');
            //店铺里面判断状态的id
            this.props.setshoppingId('');
            //清除收藏状态
            this.props.setTab('');
            appHistory.reduction();
        } if (opt.key === '3') {
            if (process.env.NATIVE) {
                native('goShop');
                appHistory.reduction();//重置路由
            } else {
                appHistory.push('/shopCart');
            }
        } else if (opt.key === '4') {
            if (process.env.NATIVE) {
                const obj  = {'': ''};
                native('goToIm', obj);
            } else {
                showInfo('im');
            }
        } else if (opt.key === '5') {
            appHistory.push('/invitation?share=1');
        }
    };

    render() {
        const {visible} = this.props;
        return (
            <Popover
                mask
                className="fortest"
                overlayClassName="fortest"
                visible={visible}
                overlay={[
                    (<Item key="1" icon={myImg('family.svg')}><p>首页</p></Item>),
                    (<Item key="2" icon={myImg('star.svg')}>收藏</Item>),
                    (<Item key="3" icon={myImg('shop-cart.svg')}>购物车</Item>),
                    (<Item key="4" icon={myImg('info.svg')}><p>消息</p></Item>)
                    // (<Item key="5" icon={myImg('share.svg')}>分享</Item>) //余丽
                ]}
                align={{
                    overflow: {
                        adjustY: 0,
                        adjustX: 0
                    },
                    offset: [0, 0]
                }}
                onVisibleChange={this.handleVisibleChange}
                onSelect={this.onSelect}
            >
                <div style={{
                    height: '100%',
                    padding: '0 15px',
                    marginRight: '-15px',
                    display: 'flex',
                    alignItems: 'center'
                }}
                >
                    {/* <Icon type="ellipsis"/> */}
                </div>
            </Popover>
        );
    }
}

const mapDispatchToProps = {
    setshoppingId: actionCreator.setshoppingId,
    setTab: actionCreator.setTab,
    setOrderStatus: actionCreator.setOrderStatus
};

export default connect(null, mapDispatchToProps)(showButton);
