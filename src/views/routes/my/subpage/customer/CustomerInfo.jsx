/**
 * 我的客户详情
 */
import {List} from 'antd-mobile';
import AppNavBar from '../../../../common/navbar/NavBar';
import './Customer.less';

const Item = List.Item;
const {urlCfg} = Configs;
const {appHistory, getUrlParam, goBackModal} = Utils;

export default class CustomerInfo extends BaseComponent {
    constructor(props) {
        super(props);
        this.uid = decodeURI(getUrlParam('uid', encodeURI(props.location.search)));
    }

    state = {
        info: {}
    }

    componentDidMount() {
        this.getCustomerInfo();
    }

    //获取客户信息
    getCustomerInfo=() => {
        this.fetch(urlCfg.customerInfo, {
            data: {
                uid: this.uid
            }
        }).subscribe(res => {
            if (res && res.status === 0) {
                this.setState({
                    info: res.data
                });
            }
        });
    }

    //打开订单量列表
    openOrderList=(uid) => {
        appHistory.push({pathname: `/customer-order-list?uid=${uid}`});
    }

    render() {
        const {info} = this.state;
        const row = [
            {
                title: '手机号', extra: info.phone || ''
            },
            {
                title: '所在区域', extra: info.address || ''
            },
            {
                title: '订单量',  arrow: true, onClick: () => this.openOrderList(info.no)
            }
        ];
        return (
            <React.Fragment>
                {window.isWX ? null : (
                    <AppNavBar
                        title="我的客户"
                        goBackModal={goBackModal}
                    />
                )}
                <div className="info-title">
                    <img
                        {...info.avatarUrl
                            ? {src: info.avatarUrl} : {className: 'basic-avatar'}}
                        alt=""
                    />
                    <div className="info-name">
                        <div>{info.realname}</div>
                        <div>UID:{info.no}</div>
                    </div>
                </div>
                <List className="info-list">
                    {
                        row.map(item => (
                            <Item
                                key={item.title}
                                {...item.extra && {extra: item.extra}}
                                {...item.arrow && {arrow: 'horizontal'}}
                                {...item.onClick && {onClick: item.onClick}}
                            >
                                {item.title}
                            </Item>
                        ))
                    }
                </List>
            </React.Fragment>
        );
    }
}
