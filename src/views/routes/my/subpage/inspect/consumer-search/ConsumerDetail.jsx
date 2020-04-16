/*  订单页面*/

import AppNavBar from '../../../../../common/navbar/NavBar';
import './ConsumerSearch.less';

const {urlCfg} = Configs;

const {appHistory, native, getUrlParam} = Utils;
const {navColorR} = Constants;

export default class InspectOrder extends BaseComponent {
    state = {
        list: [],
        status: ''
    }

    componentDidMount() {
        this.whiteList();
    }

    //跳珠核销扫码
    goTo = () => {
        appHistory.push('/inspect');
    }

    whiteList = () => {
        this.fetch(urlCfg.whiteList, {data: {key: decodeURI(getUrlParam('keywords', encodeURI(this.props.location.search)))}}).subscribe(res => {
            if (res && res.status === 0) {
                this.setState({
                    list: res.list
                });
            }
        });
    }

    getOrderStatus = (num) => {
        let str = '';
        switch (num) {
        case '0':
            str = '未付款';
            break;
        case '1':
            str = '已付款';
            break;
        case '2':
            str = '已发货';
            break;
        case '3':
            str = '未发货';
            break;
        default:
            str = '';
        }
        return str;
    }

    //点击扫一扫
    sureSaoCode = () => {
        if (process.env.NATIVE) {
            native('qrCodeScanCallback', {
                pay: urlCfg.importSum,
                write: urlCfg.consumer,
                source: urlCfg.sourceBrowse
            });
        }
    }

    render() {
        const {list} = this.state;
        return (
            <div className="inspect-order">
                <AppNavBar rightShow title="核销订单" nativeGoBack color={navColorR}/>
                <div className="shortcut">
                    <span>快捷核销</span>
                    <span onClick={this.sureSaoCode} className="icon icon-shortcut"/>
                </div>
                <div>
                    {
                        list.map(item => (
                            <div className="indent-box" key={item.id}>
                                <div className="indent">
                                    <div className="picture">
                                        <img src={item.picpath} alt=""/>
                                        <span>{item.shopName}</span>
                                        <span>{this.getOrderStatus(item.status)}</span>
                                    </div>
                                    {
                                        item.pr_list.map(goods => (
                                            <div className="content" key={goods.pr_id}>
                                                <img src={goods.pr_picpath} alt=""/>
                                                <div className="content-right">
                                                    <div className="value">
                                                        <span>{goods.pr_title}</span>
                                                        <span>￥{goods.price}</span>
                                                    </div>
                                                    <div className="specification">
                                                        <span>{goods.property_content[0]}</span>
                                                        <span>{goods.property_content[1]}</span>
                                                        <span>规格</span>
                                                    </div>
                                                    <div className="accounts">
                                                        <span>C米：{goods.deposit}</span>
                                                        <span>x{goods.pr_num}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    }
                                    <div>
                                        <p className="altogether">总C米：<span>{item.all_deposit}</span></p>
                                        <p className="total">
                                            <span>共{item.pr_count}件商品</span>
                                            <span>合计：<span>￥{item.all_price}</span></span>
                                        </p>
                                        <p className="immediately"><span onClick={this.goTo}>立即核销</span></p>
                                    </div>
                                </div>
                            </div>
                        ))
                    }
                </div>
            </div>
        );
    }
}
