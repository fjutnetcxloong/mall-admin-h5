//选择售后类型
import AppNavBar from '../../../../../common/navbar/NavBar';
import './ApplyService.less';
import {urlCfg} from '../../../../../../configs/urlCfg';

const {getUrlParam, appHistory, showInfo} = Utils;
// const article = [
//     {
//         text: '仅退款',
//         title: '未收到货（包含未签收），或已与卖家协商',
//         value: 0
//     },
//     {
//         text: '退货退款',
//         title: '已收货，需要退还商品',
//         value: 2
//     },
//     {
//         text: '换货',
//         title: '已收货，需要更换收到的商品',
//         value: 3,
//         isJingDong: true
//     },
//     {
//         text: '维修',
//         title: '已收货，需要维修收到的商品',
//         value: 4,
//         isJingDong: true
//     }
// ];

export default class applyService extends BaseComponent {
    //获取参数
    getParameter = (value) => decodeURI(getUrlParam(value, encodeURI(this.props.location.search)))

    state = {
        onlyRefund: false, //是否是 仅退款
        Id: this.getParameter('orderId'), //退款所需参数 订单id
        returnType: this.getParameter('returnType'), //退款所需参数 单个商品进行退款还是整条订单进行退款
        prId: this.getParameter('prId'), //退款所需参数 商品id
        arrInfo: this.getParameter('arrInfo'), //退款所需参数 标签
        onlyReturnMoney: this.getParameter('onlyReturnMoney'), //待发货过来的退款，不让他点击退货退款给提示
        shopId: this.getParameter('shopId'), //店铺id
        articleArr: []//退款申请选项
    }

    componentDidMount() {
        this.getType();
    }

    //获取退款的方式
    getType = () => {
        this.fetch(urlCfg.selectAftersalestype, {data: {order_id: this.getParameter('orderId')}}).subscribe(res => {
            if (res && res.status === 0) {
                this.setState({
                    articleArr: res.returnType_arr
                });
            }
        });
    }

    //售后申请类型
    // serviceList = (value) => {
    //     const {Id, returnType, prId, arrInfo, onlyReturnMoney} = this.state;
    //     if (onlyReturnMoney === '1' && value === 2) {
    //         showInfo('商家还未发货，请选择“仅退款”');
    //     } else {
    //         let onOff = false;
    //         if (!value) { //判断是否仅退款，true是
    //             onOff = true;
    //         }
    //         appHistory.push(`/onlyRefund?orderId=${Id}&prId=${prId}&returnType=${returnType}&arrInfo=${arrInfo}&onlyRefund=${onOff}`);
    //     }
    // }

    //售后申请类型
    serviceList = (value) => {
        const {Id, returnType, prId, arrInfo, onlyReturnMoney, shopId} = this.state;
        if (onlyReturnMoney === '1' && value.value === 2) {
            showInfo('商家还未发货，请选择“仅退款”');
        } else {
            let onOff = false;
            if (value.value === 1) { //判断是否仅退款，true是
                onOff = true;
            }
            if (value.value === 1) { //仅退款
                appHistory.push(`/onlyRefund?orderId=${Id}&prId=${prId}&returnType=${returnType}&arrInfo=${arrInfo}&onlyRefund=${onOff}`);
            } else if (value.value === 10) { //退货退款
                appHistory.push(`/returnGoods?id=${shopId}`);
            } else { //京东售后
                appHistory.push(`/JDService?orderId=${Id}&&type=${value.value}`);
            }
            // if (articleArr.length === 2) {
            //     appHistory.push(`/onlyRefund?orderId=${Id}&prId=${prId}&returnType=${returnType}&arrInfo=${arrInfo}&onlyRefund=${onOff}`);
            // } else if (articleArr.length === 4) {
            //     if (value.value === 1) {
            //         appHistory.push(`/onlyRefund?orderId=${Id}&prId=${prId}&returnType=${returnType}&arrInfo=${arrInfo}&onlyRefund=${onOff}`);
            //     } else {
            //         appHistory.push(`/JDService?orderId=${Id}&&type=${value.value}`);
            //     }
            // }
        }
    }

    render() {
        const {articleArr} = this.state;
        return (
            <div data-component="apply-service" data-role="page" className="apply-service">
                <AppNavBar title="选择售后类型"/>
                <div className="services">
                    {/* {
                        article.map((item, index) => {
                            if (isJD === 'null' ? !item.isJingDong : 1) {
                                return (
                                    <div className="service-list" key={index.toString()} onClick={() => this.serviceList(item.value)}>
                                        <div className="service-left">
                                            <div className="service-text">{item.text}</div>
                                            <div className="service-title">{item.title}</div>
                                        </div>
                                        <div className="service-right"><span className="icon icon-right"/></div>
                                    </div>
                                );
                            }
                            return null;
                        })
                    } */}
                    {
                        articleArr.length > 0 ? articleArr.map((item, index) => (
                            <div className="service-list" key={index.toString()} onClick={() => this.serviceList(item)}>
                                <div className="service-left">
                                    <div className="service-text">{item.text}</div>
                                    <div className="service-title">{item.title}</div>
                                </div>
                                <div className="service-right"><span className="icon icon-right"/></div>
                            </div>
                        )) : ''
                    }
                    {/*温馨提示信息*/}
                    <div className="prompt">
                        <div className="prompt-text">温馨提示</div>
                        <div className="prompt-title">
                            <div>售后均需要提前与卖家协商</div>
                            <div>自行寄回无效</div>
                            {/* <div>平台不介入售后服务</div> */}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
