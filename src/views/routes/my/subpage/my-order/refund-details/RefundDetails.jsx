//退款详情

import {connect} from 'react-redux';
import copy from 'copy-to-clipboard';
import {dropByCacheKey} from 'react-router-cache-route';
import AppNavBar from '../../../../../common/navbar/NavBar';
import BaseComponent from '../../../../../../components/base/BaseComponent';
import {baseActionCreator as actionCreator} from '../../../../../../redux/baseAction';
import './RefundDetails.less';

const {getUrlParam, appHistory, showInfo, native, showSuccess, nativeCssDiff} = Utils;
const {urlCfg} = Configs;

const {MESSAGE: {Form, Feedback}} = Constants;
class refundDetails extends BaseComponent {
    state = {
        refundArr: [] //退款详情数据
    };

    componentDidMount() {
        this.getInfo();
    }

    getInfo = () => {
        const id = decodeURI(getUrlParam('id', encodeURI(this.props.location.search)));
        this.fetch(urlCfg.refundDetail, {
            data: {id}
        }).subscribe(res => {
            if (res && res.status === 0) {
                this.setState({
                    refundArr: res.data
                });
            }
        });
    };

    //退货状态
    refundState = num => {
        const arr = new Map([
            ['0', '未审核'],
            ['1', '未审核'],
            ['2', '未审核'],
            ['3', '未审核']
        ]);
        return arr.get(num);
    };

    //售后状态
    afterSalesType = num => {
        const arr = new Map([
            ['1', '退款'],
            ['2', '退货']
        ]);
        return arr.get(num);
    };

    //点击撤销订单
    revoke = () => {
        const {showConfirm} = this.props;
        showConfirm({
            title: Form.Whether_Revocation_Apply,
            btnTexts: ['我再想想', '确认撤销'],
            callbacks: [null, () => {
                const {refundArr} = this.state;
                this.fetch(urlCfg.revokeOrder, {data: {id: refundArr.id}})
                    .subscribe(res => {
                        this.setState({
                            showModal: false,
                            modalTitle: ''
                        });
                        if (res && res.status === 0) {
                            showInfo(Feedback.Rovke_Success);
                            this.setState({
                                revoke: false
                            });
                            if (res.data.if_express === '1') {
                                dropByCacheKey('OrderPage');//清除我的订单的缓存
                                appHistory.go(-1);
                            } else {
                                dropByCacheKey('selfMentionOrderPage');//清除线下订单
                                appHistory.replace('/selfMention');
                            }
                        }
                    });
            }]
        });
    }

    //拨打电话
    shopPhone = () => {
        const {showConfirm} = this.props;
        showConfirm({
            title: '是否拨打电话',
            callbacks: [null, () => {
                const {refundArr} = this.state;
                this.fetch(urlCfg.getShopMain, {data: {shop_mid: refundArr.shop_mid}})
                    .subscribe(res => {
                        if (res && res.status === 0) {
                            if (process.env.NATIVE) {
                                native('callTel', {phoneNum: res.data.phone});
                            }
                        }
                    });
            }]
        });
    }

    //修改申请
    application = (data) => {
        const {refundArr} = this.state;
        const type = decodeURI(getUrlParam('type', encodeURI(this.props.location.search)));
        //type等于 2 时为线下订单修改申请
        appHistory.push(`/applyDrawback?id=${refundArr.id}&type=${type}&refurn=${data.order_status}`);
    }

    //投诉
    complaint = () => {
        const id = decodeURI(getUrlParam('id', encodeURI(this.props.location.search)));
        appHistory.push(`/myComplain?orderId=${id}`);
    }

    //填写物流
    fillInLogistics = () => {
        const {refundArr} = this.state;
        appHistory.push(`/returnGoods?id=${refundArr.id}&shopId=${refundArr.shop_mid}`);
    }

    //京东填写物流
    JDFillInLogistics = () => {
        const {refundArr} = this.state;
        appHistory.push(`/fillInLogistics?id=${refundArr.id}&shopperName=${refundArr.s_link_name}&shopperPhone=${refundArr.s_phone}&shopperArea=${encodeURIComponent(refundArr.s_address)}`);
    }

    //查看物流
    seeLogistics = (id) => {
        if (process.env.NATIVE) {
            native('goLogistics', {orderId: id});
        } else {
            appHistory.push(`/logistics?lgId=${id}&isReturn=1`);
        }
    }

    //底部按钮
    allButton = (item) => {
        let blockModal = <div/>;
        const {refundArr} = this.state;
        switch (item.status) {
        case '1'://退款申请中
            blockModal = (
                <div className="buttons">
                    <div onClick={this.revoke} className="look-button">撤销申请</div>
                    <div onClick={() => this.application(item)} className="evaluate-button">修改申请</div>
                </div>
            );
            break;
        case '2'://退款退货才有这个状态   退货中
            blockModal = (
                <div className="buttons">
                    <div className="look-button" onClick={this.revoke}>撤销申请</div>
                    {
                        refundArr.types !== '0' && !refundArr.express_no && <div className="evaluate-button" onClick={this.fillInLogistics}>填写物流</div>
                    }
                    {
                        refundArr.types !== '0' && refundArr.express_no && <div className="evaluate-button" onClick={() => this.seeLogistics(refundArr.id)}>查看物流</div>
                    }
                </div>
            );
            break;
        case '3'://退款成功
        case '4'://商家拒绝 售后关闭
        case '5'://自己撤销 售后关闭
            blockModal = (
                <div className="buttons">
                    <div className="look-button" onClick={this.complaint}>投诉</div>
                </div>
            );
            break;
        default:
            blockModal = (<div/>);
        }
        return blockModal;
    }

    //前往协商历史
    goToConsultHistory = () => {
        appHistory.push('/consultHistory');
    }

    //联系商家
    goToShoper = () => {
        const {refundArr} = this.state;
        if (process.env.NATIVE) {
            native('goToShoper', {shopNo: refundArr.shop_no, id: refundArr.order_id, type: '1', shopNickName: refundArr.nickname, imType: '2', groud: '0'});//groud 为0 单聊，1群聊 imType 1商品2订单3空白  type 1商品 2订单
        } else {
            showInfo('联系商家');
        }
    }

    //复制订单号
    copyNo = () => {
        const {refundArr} = this.state;
        copy(refundArr.return_no);
        showSuccess('复制成功');
    }

    //底部按钮
    bottomButton = (num) => {
        const {refundArr} = this.state;
        const blockModal = new Map([
            [
                '1',
                <React.Fragment>
                    <div style={{border: nativeCssDiff() ? '1PX solid #666' : '0.01rem solid #666'}} onClick={this.revoke} className="immediate-evaluation-c">撤销申请</div>
                    <div style={{border: nativeCssDiff() ? '1PX solid #ff2d51' : '0.01rem solid #ff2d51'}} onClick={() => this.application(refundArr)} className="immediate-evaluation">修改申请</div>
                </React.Fragment>
            ],

            [
                '1',
                <React.Fragment>
                    <div style={{border: nativeCssDiff() ? '1PX solid #666' : '0.01rem solid #666'}} onClick={this.revoke} className="immediate-evaluation-c">撤销申请</div>
                    <div style={{border: nativeCssDiff() ? '1PX solid #ff2d51' : '0.01rem solid #ff2d51'}} onClick={this.complaint} className="immediate-evaluation">投诉</div>
                </React.Fragment>
            ]
        ]);
        return blockModal.get(num);
    }

    render() {
        const {refundArr} = this.state;
        const type = decodeURI(getUrlParam('type', encodeURI(this.props.location.search)));
        return (
            <div
                data-component="after-service"
                data-role="page"
                className="after-service"
            >
                {/*标题头部*/}
                <div className="refund-top">
                    <AppNavBar title="退款详情"/>
                    <div className="refund-bottom">
                        <div className="refund-success">
                            {refundArr.status_name}
                        </div>
                        {/* <div className="refund-success">{refundArr.msg}</div> */}
                        <div className="refund-time">
                            <span className="time-l">{refundArr.msg}</span>
                            {/*<span>00:00:00</span>*/}
                        </div>
                    </div>
                    <div className="refund-money-all">
                        <span className="list-left">退回总金额：</span>
                        <span className="list-right">
                            ￥{refundArr.return_price}
                        </span>
                    </div>
                    {
                        refundArr.status === '3'
                        && (
                            <div className="logistics-info">
                                <div className="detail-list">
                                    <span className="list-left">店家姓名：</span>
                                    <span className="list-center">{refundArr.s_link_name}</span>
                                    <span>
                                        {refundArr.s_phone}
                                    </span>
                                </div>
                                {//types为1的时候不展示
                                    refundArr.types !== '1'
                                    && (
                                        <div className="detail-list">
                                            <span className="list-left">店家地址：</span>
                                            <span className="list-right">
                                                {refundArr.s_address}
                                            </span>
                                        </div>
                                    )
                                }
                                <p>{refundArr.tips_msg}</p>
                            </div>
                        )
                    }
                </div>
                {/*商品*/}
                {/* <div className="consult-his" onClick={this.goToConsultHistory}><span>协商历史</span><span className="icon history"/></div> */}
                <div className="refund-content">
                    <div className="refund-box">
                        {
                            refundArr.pr && refundArr.pr.map(value => (
                                <div key={value.pr_id}>
                                    <div className="details">
                                        <div className="details-l">
                                            <img src={value.picpath} alt=""/>
                                        </div>
                                        <div className="details-r">
                                            <div className="introduce">
                                                <span className="introduce-l">
                                                    {value.pr_title}
                                                </span>
                                                <span className="introduce-r">
                                                    ￥{value.price}
                                                </span>
                                            </div>
                                            <div className="label">
                                                <div className="label-l">
                                                    {value.values_name.split(',').map(itemDiv => (
                                                        <div key={itemDiv} className="goods-size">{itemDiv}</div>
                                                    ))}
                                                </div>
                                                <span className="label-r">
                                                x{value.pr_num }
                                                </span>
                                            </div>
                                            {refundArr.is_shoper === 0 && type !== '2' && this.allButton(refundArr)}
                                            {refundArr.write_express === 1 && <div className="buttons"><div className="evaluate-button" onClick={this.JDFillInLogistics}>填写物流</div></div>}
                                        </div>
                                    </div>
                                </div>
                            ))
                        }
                    </div>
                </div>
                {/*退货问题*/}
                <div className="refund-details">
                    <div className="detail-list">
                        <span className="list-left">退款编号：</span>
                        <span>
                            {refundArr.return_no}
                            <span className="list-copy" onClick={this.copyNo}>复制</span>
                        </span>
                    </div>
                    <div className="detail-list">
                        <span className="list-left">退款金额：</span>
                        <span>￥{refundArr.return_price}</span>
                    </div>
                    <div className="detail-list">
                        <span className="list-left">申请时间：</span>
                        <span>
                            {refundArr.crtdate}
                        </span>
                    </div>
                    <div className="detail-list">
                        <span className="list-left">申请原因：</span>
                        <span>{refundArr.reason ? refundArr.reason.split(',').join('|') : '' }</span>
                    </div>
                    <div className="detail-list-quest">
                        <span className="list-left">问题描述：</span>
                        <div className="list-right">
                            <p>{refundArr.describe}</p>
                            {
                                (refundArr.return_picpath && refundArr.return_picpath.length > 0) ? refundArr.return_picpath.map(item => <img src={item}/>) : ''
                            }
                        </div>
                    </div>
                    <div className="detail-list">
                        <span className="list-left">申请数量：</span>
                        <span>{refundArr.num}件</span>
                    </div>
                    <div className="detail-list">
                        <span className="list-left">申请时间：</span>
                        <span>{refundArr.crtdate}</span>
                    </div>
                    {
                        refundArr.pickwareType && (
                            <div className="detail-list">
                                <span className="list-left">取件方式：</span>
                                <span>{refundArr.pickwareType}</span>
                            </div>
                        )
                    }
                    {
                        refundArr.returnwareType && (
                            <div className="detail-list">
                                <span className="list-left">返件方式：</span>
                                <span>{refundArr.returnwareType}</span>
                            </div>
                        )
                    }
                    {
                        refundArr.status === '3' && (
                            <div>
                                <div className="refund-details">
                                    <div className="detail-list">
                                        <span className="list-left">问题描述</span>
                                        <span>{refundArr.describe}</span>
                                    </div>
                                </div>
                                <div className="refund-details">
                                    <div className="detail-list">
                                        <span className="list-left">实退金额：</span>
                                        <span>{refundArr.return_money}</span>
                                    </div>
                                </div>
                            </div>
                        )
                    }
                    {
                        refundArr.express_no && (
                            <div className="detail-list">
                                <span className="list-left">物流订单号</span>
                                <span>
                                    {refundArr.express_no}
                                </span>
                            </div>
                        )
                    }
                    <div className="business-box">
                        <div className="business">
                            <div className="business-left icon" onClick={this.goToShoper}><span>联系商家</span></div>
                            {/* <span className="business-right icon" onClick={() => this.shopPhone()}>商家电话</span> */}
                        </div>
                    </div>
                </div>
                <div/>
                {
                    (type === '2' && refundArr && this.bottomButton(refundArr.status)) ? (//type为2表示线下订单过来的
                        <div className="cancel-order-box">
                            {this.bottomButton(refundArr.status)}
                        </div>
                    ) : ''
                }
            </div>
        );
    }
}

const mapDidpatchToProps = {
    showConfirm: actionCreator.showConfirm
};

export default connect(
    null,
    mapDidpatchToProps
)(refundDetails);
