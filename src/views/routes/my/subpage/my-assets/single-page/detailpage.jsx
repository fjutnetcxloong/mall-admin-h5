//**收入详情 */


import {InputItem} from 'antd-mobile';
import './index.less';
import AppNavBar from '../../../../../common/navbar/NavBar';

const {urlCfg} = Configs;
export default class Detailpage extends BaseComponent {
    state = {
        detailArr: {}
    };

    componentDidMount() {
        this.getAmount(this.props.currentData.id);
    }

    getAmount = (id) => {
        this.fetch(urlCfg.detailsOfAmount, {data: {id}})
            .subscribe(res => {
                if (res && res.status === 0) {
                    this.setState({
                        detailArr: res.data
                    });
                }
            });
    }

    //收入与否
    payMoney = (detailArr) => {
        let str = '';
        if (detailArr.types === '1') {
            str = '收入';
        } else if (detailArr.types === '0') {
            str = '支出';
        }
        return str;
    }

    //支付状态
    payState = (detailArr) => {
        let str = '';
        if (detailArr.pay_status === '1') {
            str = '已支付';
        } else if (detailArr.pay_status === '0') {
            str = '未支付';
        }
        return str;
    }

    render() {
        const {detailArr} = this.state;
        return (
            <div data-component="cash" data-role="page" className="cash">
                <div className="cash-content">
                    <div className="cash-content-navbar">
                        <AppNavBar
                            goBackModal={() => this.props.getBackChange('detail')}
                            title="收支详情"
                            rightShow
                        />
                    </div>

                    <div className="amount">
                        <p>{detailArr.types === '1' ? '+' : '-'}{detailArr.scalar}元</p>
                        <span>{this.payMoney(detailArr)}金额</span>
                    </div>
                    <div className="other">
                        <InputItem
                            editable={false}
                            value={this.payState(detailArr)}
                        >交易状态：
                        </InputItem>
                        <InputItem
                            value={detailArr.pay_date}
                            editable={false}
                        >交易时间：
                        </InputItem>
                        <InputItem
                            value={detailArr.intro}
                            editable={false}
                        >收支类型:
                        </InputItem>
                        <InputItem
                            editable={false}
                            value={detailArr.order_no}
                        >交易单号:
                        </InputItem>
                        <InputItem
                            editable={false}
                            value={detailArr.UID}
                        >U I D:
                        </InputItem>
                    </div>
                </div>
                <div className="cash-bg"/>
            </div>
        );
    }
}
