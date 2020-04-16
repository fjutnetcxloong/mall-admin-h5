
import React from 'react';
import './shopList.less';

export default class shopList extends BaseComponent {
    state = {
        name: '',
        status: '',
        delete: '',
        look: '',
        evaluate: '',
        desc: '',
        color: '',
        size: '',
        price: 1,
        count: 2,
        account: 3,
        totalAccount: 4,
        goodsNum: 5,
        totalPrice: 6,
        deleted: ''
    };

    //跳转到详情页
    skipDetail = () => {
        const {history} = this.props;
        history.push('/orderDetail');
    }

    //跳转到申请售後页
    goApplyService = () => {
        const {history} = this.props;
        history.push('/applyService');
    }

    render() {
        const {name, status, look, evaluate, desc, price, size, count, color, account, totalAccount, goodsNum, totalPrice, deleted} = this.state;
        return (
            <div className="shop-lists">
                <div className="shop-name">
                    <div className="shop-title">
                        <img src="http://www.pptok.com/wp-content/uploads/2012/08/xunguang-4.jpg" alt=""/>
                        <p>{this.props.name || name}</p>
                        <div className="icon"/>
                    </div>
                    <div className="right">{this.props.status || status}</div>
                </div>
                <div className="goods">
                    <div className="goods-left" onClick={this.skipDetail}>
                        <div>
                            <img
                                src="http://www.pptok.com/wp-content/uploads/2012/08/xunguang-4.jpg"
                            />
                        </div>
                    </div>
                    <div className="goods-right">
                        <div className="goods-desc" onClick={this.skipDetail}>
                            <div className="desc-title">{this.props.desc || desc}</div>
                            <div className="price">￥{this.props.price || price}</div>
                        </div>
                        <div className="goods-sku" onClick={this.skipDetail}>
                            <div className="sku-left">
                                <div>{this.props.color || color}</div>
                                <div className="goods-size">{this.props.size || size}</div>
                                <div>规格</div>
                            </div>
                            <div className="sku-right">x{this.props.count || count}</div>
                        </div>
                        <div className="goods-count">记账量：{this.props.account || account}</div>
                        <div className="right-bottom">
                            <div className="total-count" onClick={this.skipDetail}>
                                总记账量：<span>{this.props.totalAccount || totalAccount}</span>
                            </div>
                            <div className="total-price">
                                <div className="total-price-left">共{this.props.goodsNum || goodsNum}件商品</div>
                                <div className="total-price-right">合计：<span>{this.props.totalPrice || totalPrice}元</span></div>
                            </div>
                            <div className="buttons">
                                <div className="delete-button" onClick={this.props.deleteOrder}>{this.props.deleted || deleted}</div>
                                {
                                    (this.props.status === '等待发货')
                                        ? (
                                            <div className="look-button" onClick={this.goApplyService}>{this.props.look || look}</div>
                                        )
                                        : (
                                            (this.props.status === '等待付款')
                                                ? (
                                                    <div className="look-button" onClick={() => console.log('quxiaodingdan')}>{this.props.look || look}</div>
                                                )
                                                : (
                                                    <div className="look-button" onClick={() => console.log('chakanwuliu')}>{this.props.look || look}</div>
                                                )
                                        )
                                }
                                {
                                    (this.props.status === '等待发货')
                                        ? (
                                            <div className="evaluate-button" style={this.props.style} onClick={() => console.log('tixingfahuo')}>{this.props.evaluate || evaluate}</div>
                                        )
                                        : (
                                            (this.props.status === '等待付款')
                                                ? (
                                                    <div className="evaluate-button" style={this.props.style} oncClick={() => console.log('lijifukuan')}>{this.props.evaluate || evaluate}</div>
                                                )
                                                : (
                                                    (this.props.status === '卖家已发货')
                                                        ? (
                                                            <div className="evaluate-button" style={this.props.style} onClick={() => console.log('querenshouhuo')}>{this.props.evaluate || evaluate}</div>
                                                        )
                                                        : (
                                                            <div className="evaluate-button" style={this.props.style} onClick={() => console.log('lijipingjia')}>{this.props.evaluate || evaluate}</div>
                                                        )
                                                )
                                        )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
