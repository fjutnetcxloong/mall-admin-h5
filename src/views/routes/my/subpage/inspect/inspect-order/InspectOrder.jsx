/* 核销订单页面*/

import AppNavBar from '../../../../../common/navbar/NavBar';
import './InspectOrder.less';

const {urlCfg} = Configs;
const {appHistory, native} = Utils;
const {navColorR} = Constants;

export default class InspectOrder extends BaseComponent {
    state = {
        list: [],
        status: '',
        navColor: '@fiery-red' //标题头部颜色
    }

    componentDidMount() {
        this.whiteList();
    }

    //跳珠核销扫码
    goTo = (id) => {
        appHistory.push(`/inspect?id=${id}`);
    };

    whiteList = () => {
        this.fetch(urlCfg.whiteList).subscribe(res => {
            if (res && res.status === 0) {
                this.setState({
                    list: res.list
                });
            }
        });
    }

    getOrderStatus = (num) => {
        const titleArr = new Map([
            ['0', '未付款'],
            ['1', '已付款'],
            ['2', '已发货'],
            ['3', '未发货']
        ]);
        return titleArr.get(num);
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

    //搜索点击
    goToSearch = () => {
        appHistory.push('/consumer-search');
    }

    render() {
        const {list, navColor} = this.state;
        return (
            <div className="inspect-order">
                <AppNavBar title="核销订单" nativeGoBack goToSearch={this.goToSearch} backgroundColor={navColor} rightShow redBackground search color={navColorR}/>
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
                                        <img src={item.avatarUrl} alt=""/>
                                        <span>{item.nickname}</span>
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
                                                        <span>x{goods.num}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    }
                                    <div>
                                        <p className="altogether">总C米：<span>{item.all_deposit}</span></p>
                                        <p className="total">
                                            <span>共{item.pr_num}件商品</span>
                                            <span>合计：<span>￥{item.all_price}</span></span>
                                        </p>
                                        <p className="immediately"><span onClick={() => this.goTo(item.id)}>立即核销</span></p>
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
