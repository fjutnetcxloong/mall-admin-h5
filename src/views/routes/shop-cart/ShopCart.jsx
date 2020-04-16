// /*
// * 购物车页面
// * */
// import React from 'react';
// import {connect} from 'react-redux';
// import {SwipeAction} from 'antd-mobile';
// import classNames from 'classnames';
// import {baseActionCreator as actionCreator} from '../../../redux/baseAction';
// import {shopCartActionCreator} from './actions/index';
// import {FooterBar} from '../../common/foot-bar/FooterBar';
// import Nothing from '../../common/nothing/Nothing';
// import Sku from '../../common/sku/Sku';
// import './shopCart.less';

// const {urlCfg} = Configs;
// const {appHistory, showInfo, showSuccess, native, systemApi: {setValue}, getUrlParam, native} = Utils;
// const {MESSAGE: {Form, Feedback}, FIELD, navColorR} = Constants;

// let payInNum = 0;
// class ShopCart extends BaseComponent {
//     state = {
//         toggle: true, //头部编辑状态
//         singleSelect: false, //全部单选状态
//         allSelect: false, //单个商店商品全部选中
//         shopList: [], //商品列表
//         valid: [], //未失效商品
//         invalid: [], //失效商品
//         totalSelect: false, //全部商品选中
//         // invalidSelect: false, //失效商品选中状态
//         ware: false, //中断
//         count: 0, //结算数量
//         goodsCount: 0, // 商品数量
//         popup: false, //sku是否显示
//         ids: [], //选中属性id
//         res: {},
//         pickType: {}, //配送方式
//         selectType: '', //选中配送方式 1快递 2自提
//         loadDown: false, // 线下订单功能键显示
//         updateStatus: 1, //跟新接口if_express
//         hide: true, //隐藏底部
//         currentIndex: 0
//     };

//     componentWillMount() {
//         if (process.env.NATIVE) { //设置tab颜色
//             native('setNavColor', {color: navColorR});
//         }
//         this.getCart();
//     }

//     componentDidMount() {
//         const {showMenu} = this.props;
//         showMenu(false);
//     }

//     componentWillReceiveProps(next) {
//         if (process.env.NATIVE) {
//             native('setNavColor', {color: navColorR});
//             const timerNext = decodeURI(getUrlParam('time', encodeURI(next.location.search)));
//             const timer = decodeURI(getUrlParam('time', encodeURI(this.props.location.search)));
//             if (timer !== timerNext) {
//                 this.changeCart(this.state.currentIndex);
//             }
//         }
//     }

//     componentWillUnmount() {
//         const {showMenu} = this.props;
//         showMenu(true);
//         super.componentWillUnmount();
//     }

//     //空页面跳转
//     emptyGoTo = () => {
//         if (process.env.NATIVE) {
//             native('goHome');
//         } else {
//             appHistory.replace('/home');
//         }
//     };

//     //获取购物车数据 初始化状态
//     getCart = (status) => {
//         this.fetch(urlCfg.showCateValue, {data: {
//             if_express: status || 1
//         }}).subscribe(res => {
//             if (res && res.status === 0) {
//                 this.setState({
//                     valid: res.data.valid,
//                     invalid: res.data.invalid,
//                     selects: res.data.valid.map(item => item.data.map(i => {
//                         i.select = false;
//                     })),
//                     allSelect: res.data.valid.map(item => {
//                         item.select = false;
//                     }),
//                     totalSelect: false
//                 });
//             }
//         });
//     };

//     //添加商品收藏
//     addCollect = type => {
//         const {valid, invalid} = this.state;
//         if (type === 'valid') {
//             const validGoods = [];
//             valid.forEach(item => item.data.forEach(goods => {
//                 if (goods.select) {
//                     validGoods.push(parseInt(goods.id, 10));
//                 }
//             }));
//             if (validGoods.length > 0) {
//                 this.fetch(urlCfg.addCollect, {
//                     data: {
//                         ids: validGoods
//                     }
//                 }).subscribe(res => {
//                     if (res.status === 0) {
//                         this.publicDelete(validGoods);
//                         showSuccess(Feedback.Collect_Success);
//                     }
//                 });
//             } else {
//                 showInfo(Feedback.Select_Add);
//             }
//         } else {
//             const invalidArr = [];
//             invalid.forEach(item => {
//                 invalidArr.push(parseInt(item.id, 10));
//             });
//             this.fetch(urlCfg.addCollect, {
//                 data: {
//                     ids: invalidArr
//                 }
//             }).subscribe(res => {
//                 if (res.status === 0) {
//                     this.publicDelete(invalidArr);
//                     showSuccess(Feedback.Collect_Success);
//                 }
//             });
//         }
//     };

//     //公共删除
//     publicDelete = idArr => {
//         const {currentIndex} = this.state;
//         this.fetch(urlCfg.deleteCartShop, {
//             data: {
//                 car_id: idArr
//             }
//         }).subscribe(res => {
//             if (res.status === 0) {
//                 this.getCart(currentIndex + 1);
//             }
//         });
//     };

//     //s删除商品
//     deleteGoods = id => {
//         const {showConfirm} = this.props;
//         showConfirm({
//             title: '删除',
//             message: '确定删除这些商品吗',
//             cfmBtnTexts: ['取消', '确定'],
//             callbacks: [null, () => { this.publicDelete([id]) }]
//         });
//     };

//     //清空过期产品
//     empty = () => {
//         const {invalid} = this.state;
//         const idArr = invalid.map(item => Number(item.id));
//         this.fetch(urlCfg.deleteCartShop, {
//             data: {
//                 car_id: idArr
//             }
//         }).subscribe(res => {
//             if (res.status === 0) {
//                 this.getCart();
//                 // this.setState({
//                 //     invalidSelect: false
//                 // });
//             }
//         });
//     };

//     // 清空购物车所有商品
//     totalEmpty = () => {
//         const {valid} = this.state;
//         const {showConfirm} = this.props;
//         const goodsArr = [];
//         valid.map(shop => shop.data.map(goods => {
//             if (goods.select === true) {
//                 goodsArr.push(Number(goods.id));
//             }
//         }));
//         if (goodsArr.length === 0) {
//             showInfo(Feedback.Select_Del);
//         } else {
//             showConfirm({
//                 title: '删除',
//                 message: '确定删除这些商品吗',
//                 text: ['取消', '确定'],
//                 callbacks: [null, () => { this.publicDelete(goodsArr) }]
//             });
//         }
//     };

//     //切换顶部按钮
//     toggle = () => {
//         this.setState(prevState => ({
//             toggle: !prevState.toggle
//         }));
//     };

//     //切换单选状态
//     checkSingleSelect = (e, item, list) => {
//         e.stopPropagation(); //阻止冒泡
//         const {valid} = this.state;
//         list.select = !list.select;
//         const singles = item.data.map(goods => goods.select);
//         const singleSelect = singles.find(single => single === false);
//         item.select = singleSelect !== false;
//         const allSingleSelect = [];
//         valid.map(shop => shop.data.map(value => allSingleSelect.push(value.select)));
//         const totalSelect = allSingleSelect.find(select => select === false);
//         this.setState({
//             singleSelect: list.select,
//             ware: item.data.map(i => i.select), //这里有毒  再修改状态中间加一层 可以初始化前一个状态
//             allSelect: item.select,
//             totalSelect: totalSelect !== false
//         });
//     };

//     //单个商店商品全选(完美)
//     checkAllStatus = item => {
//         const {valid} = this.state;
//         const SingleStatus = item.data.map(value => {
//             value.select = !item.select;
//         });
//         const allSingleSelect = [];
//         valid.map(shop => shop.data.map(value => allSingleSelect.push(value.select)));
//         const result = allSingleSelect.find(data => data === false);
//         this.setState({
//             allSelect: !item.select,
//             singleSelect: SingleStatus,
//             totalSelect: result !== false
//         });
//         item.select = !item.select;
//     };

//     //总全选
//     totalSelect = () => {
//         const {valid, totalSelect} = this.state;
//         const result = valid.map(item => item.data.map(value => {
//             value.select = !totalSelect;
//         }));
//         const allSelect = valid.map(item => {
//             item.select = !totalSelect;
//         });
//         this.setState({
//             totalSelect: !totalSelect,
//             selects: result,
//             allSelect: allSelect
//         });
//     };

//     //结算
//     payin = () => {
//         const {valid} = this.state;
//         //跳转订单详情界面
//         if (payInNum === 0) {
//             showInfo(Feedback.Select_Pay);
//         } else {
//             const arr = [];
//             const cartArr = [];
//             valid.map(item => item.data.map(goods => {
//                 if (goods.select === true) {
//                     arr.push({
//                         pr_id: parseInt(goods.pr_id, 10),
//                         property: goods.property_content,
//                         num: goods.num,
//                         values_name: goods.property_name,
//                         if_express: this.state.updateStatus.toString()
//                     });
//                     cartArr.push(goods.id);
//                 }
//             }));
//             const {setOrderInfo, setIds} = this.props;
//             setValue('orderArr', JSON.stringify(arr));
//             setOrderInfo(arr);
//             setIds(cartArr);
//             if (process.env.NATIVE) { ////这里的情况是，原生那边跳转的时候，需要处理一些问题，所以就购物车过来的时候，存数据，这边取数据
//                 const obj = {arr, cartArr};//储存redux
//                 native('settlement', obj);//app点击结算的时候
//             } else {
//                 appHistory.push(`/appendorder?source=${1}`);
//             }
//         }
//     };

//     // //失效商品选中
//     // checkInvalidSelect = () => {
//     //     const {invalidSelect} = this.state;
//     //     this.setState({
//     //         invalidSelect: !invalidSelect
//     //     });
//     // };

//     //结算商品数量
//     getGoodsCount = () => {
//         const {valid} = this.state;
//         const arr = [];
//         valid.map(item => item.data.map(goods => {
//             if (goods.select === true) {
//                 arr.push(Number(goods.num));
//             }
//         }));
//         let num = 0;
//         arr.forEach(item => {
//             num += item;
//         });
//         payInNum = num;
//         return num;
//     };

//     //总C米
//     getTotalCount = () => {
//         const {valid} = this.state;
//         const deposit = [];
//         const nums = [];
//         valid.map(item => item.data.map(goods => {
//             if (goods.select === true) {
//                 deposit.push(Number(goods.deposit));
//                 nums.push(Number(goods.num));
//             }
//         }));
//         let count = 0;
//         for (let i = 0; i < nums.length; i++) {
//             count += ((deposit[i] * 100) * (nums[i] * 100));
//         }
//         return parseFloat(count / 10000);
//     };

//     //获取总价格
//     getTotalPrice = () => {
//         const {valid} = this.state;
//         const arr = [];
//         const num = [];
//         valid.map(item => item.data.map(goods => {
//             if (goods.select === true) {
//                 arr.push(Number(goods.price));
//                 num.push(Number(goods.num));
//             }
//         }));
//         let price = 0;
//         for (let i = 0; i < arr.length; i++) {
//             price += ((arr[i] * 100)  * (num[i] * 100));
//         }
//         return (price / 10000) === 0 ? 0 : `￥${price / 10000}`;
//     };

//     //总共几件商品
//     totalShop = () => {
//         const {valid} = this.state;
//         let num = 0;
//         valid.forEach(item => item.data.forEach(goods => {
//             num += Number(goods.num);
//         }));
//         return num;
//     };

//     //单个商品数量加减
//     changeNum = (e, type, goods) => {
//         e.stopPropagation(); //阻止冒泡
//         const {updateStatus} = this.state;
//         const {showConfirm} = this.props;
//         if (type === 'sub') {
//             goods.num = (Number(goods.num) - 1).toString();
//             if (Number(goods.num) === 0) {
//                 showConfirm({
//                     title: '删除',
//                     message: '确定删除这件商品吗',
//                     cfmBtnTexts: ['取消', '确定'],
//                     callbacks: [null, () => { this.publicDelete([goods.id]) }]
//                 });
//                 goods.num = '1';
//                 // this.updateCart(goods.id, goods.pr_id, parseInt(goods.num, 10), updateStatus);
//             }
//             this.fetch(urlCfg.updateCart, {
//                 data: {
//                     car_id: goods.id,
//                     pr_id: goods.pr_id,
//                     num: parseInt(goods.num, 10),
//                     if_express: updateStatus,
//                     sku: goods.property_content
//                 }
//             }).subscribe(res => {
//                 if (res.status === 0) {
//                     this.setState({
//                         goodsCount: goods.num
//                     });
//                 } else {
//                     showInfo(Form.No_Stocks);
//                 }
//             });
//             this.setState({
//                 goodsCount: goods.num
//             });
//         } else {
//             goods.num = (Number(goods.num) + 1).toString();
//             this.fetch(urlCfg.updateCart, {
//                 data: {
//                     car_id: goods.id,
//                     pr_id: goods.pr_id,
//                     num: parseInt(goods.num, 10),
//                     if_express: updateStatus,
//                     sku: goods.property_content
//                 }
//             }).subscribe(res => {
//                 if (res.status === 0) {
//                     if (res.data) {
//                         if (res.data.status === 6) {
//                             goods.num = (Number(goods.num) - 1).toString();
//                             this.setState({
//                                 goodsCount: goods.num
//                             });
//                             showInfo(res.message);
//                         }
//                     } else {
//                         this.setState({
//                             goodsCount: goods.num
//                         });
//                     }
//                 }
//             });
//         }
//     };

//     //跳转到商品详情
//     goToGoodsDetail = id => {
//         if (process.env.NATIVE) {
//             native('goodsDetail', {id});
//         } else {
//             appHistory.push(`/goodsDetail?id=${id}`);
//         }
//     };

//     //进入店铺
//     goToShopHome = (shop) => {
//         const id = shop.data ? shop.data[0].shop_id : shop.shop_id;
//         if (process.env.NATIVE) {
//             native('shopHome', {id});
//         } else {
//             appHistory.push(`/shopHome?id=${id}`);
//         }
//     };

//     //数据过滤
//     numFormat = num => num.split('.')[0];

//     //开启sku
//     openSku = (e, goods) => {
//         // console.log('openSkuopenSkuopenSku', goods);
//         e.stopPropagation(); //阻止冒泡
//         this.fetch(urlCfg.getCartSku, {
//             data: {
//                 id: goods.pr_id
//             }
//         }).subscribe(res => {
//             if (res.status === 0) {
//                 const stocks = [];
//                 const goodsSku = [];
//                 goodsSku.push(goods.id, goods.pr_id, parseInt(goods.num, 10));
//                 res.sku.forEach(item => {
//                     stocks.push({
//                         attribute: item.attribute,
//                         original_price: item.original_price,
//                         price: item.price,
//                         stock: item.stock,
//                         deposit: item.deposit
//                     });
//                 });
//                 this.setState({
//                     popup: true, //sku显示状态
//                     attributes: res.attr, //商品属性
//                     stocks, //库存信息
//                     cover: goods.picpath, //照片
//                     select: goods.property_content.split(','), //选中属性
//                     goodsSku, //更新购物车所需参数
//                     pickType: res.distribution_mode, //配送方式
//                     selectType: goods.if_express//选中配送方式
//                 });
//             }
//         });
//     };

//     //关闭sku
//     closeSku = () => {
//         this.setState({
//             popup: false
//         });
//     };

//     //确定按钮点击
//     confirmSku = (type, ids, goods) => {
//         // console.log('选中商品属性ID：', ids);
//         this.setState({
//             popup: false
//         }, () => {
//             this.updateCart(goods[0], goods[1], goods[2], type, ids.join(','));
//         });
//     };

//     //更新购物车数据
//     updateCart = (cartId, goodsId, num, type, sku) => {
//         const {updateStatus} = this.state;
//         this.fetch(urlCfg.updateCart, {
//             data: {
//                 car_id: cartId,
//                 pr_id: goodsId,
//                 num: num,
//                 if_express: type,
//                 sku
//             }
//         }).subscribe(res => {
//             if (res.status !== 0) {
//                 showInfo(Form.No_Stocks);
//             } else {
//                 this.getCart(updateStatus);
//             }
//         });
//     };

//     //切换购物车类型
//     changeCart = (index) => {
//         if (index === 1) {
//             this.setState({
//                 currentIndex: index,
//                 loadDown: true,
//                 updateStatus: 2,
//                 hide: false
//             }, () => {
//                 this.getCart(2);
//             });
//         } else {
//             this.setState({
//                 currentIndex: index,
//                 loadDown: false,
//                 updateStatus: 1,
//                 hide: true
//             }, () => {
//                 this.getCart();
//             });
//         }
//     }

//     // //自提商品总C米
//     selfTotalCount = (shop, index) => {
//         const {valid} = this.state;
//         let num = 0;
//         valid[index].data.forEach(item => {
//             if (item.select === true) {
//                 num += (Number(item.deposit) *  100) * (Number(item.num) * 100);
//             }
//         });
//         return (num / 10000);
//     }

//     //自提总价
//     selfPrice = (index) => {
//         const {valid} = this.state;
//         // let selfPrice = 0;
//         let price = 0;
//         valid[index].data.forEach(item => {
//             if (item.select === true) {
//                 price += (Number(item.price) * 100) * (Number(item.num) * 100);
//                 // selfPrice += Number(item.price) * Number(item.num);
//             }
//         });
//         return (price / 10000);
//     }

//     //自提商品总数量
//     selfNum = (index) => {
//         const {valid} = this.state;
//         let num = 0;
//         valid[index].data.forEach(item => {
//             num += Number(item.num);
//         });
//         return num;
//     }

//     //自提订单提交
//     selfOrder = (index) => {
//         const {valid} = this.state;
//         const result = valid[index].data.find(item => item.select === true);
//         if (!result) {
//             showInfo(Feedback.Select_Pay);
//             return;
//         }
//         console.log(result);
//         const arr = [];
//         const cartArr = [];
//         valid[index].data.map(item => {
//             if (item.select === true) {
//                 arr.push({
//                     pr_id: parseInt(item.pr_id, 10),
//                     property: item.property_content,
//                     num: item.num
//                 });
//                 cartArr.push(item.id);
//             }
//         });
//         // console.log(cartArr);
//         const {setOrderInfo, setIds} = this.props;
//         setOrderInfo(arr);
//         setIds(cartArr);
//         setValue('orderArr', JSON.stringify(arr));
//         if (process.env.NATIVE) { //这里的情况是，原生那边跳转的时候，需要处理一些问题，所以就购物车过来的时候，存数据，这边取数据
//             const obj = {arr, cartArr};//储存redux
//             native('setSelfMention', obj);//app点击结算的时候
//         } else {
//             appHistory.push(`/selfMentionDetail?source=${1}`);
//         }
//     }

//     render() {
//         const {
//             toggle,
//             totalSelect,
//             valid,
//             invalid,
//             // invalidSelect,
//             popup,
//             attributes,
//             stocks,
//             cover,
//             select,
//             goodsSku,
//             pickType,
//             selectType,
//             loadDown,
//             hide,
//             currentIndex
//         } = this.state;
//         const textStyle = [
//             {
//                 title: '线上订单'
//             },
//             {
//                 title: '线下订单'
//             }
//         ];
//         return (
//             <div
//                 data-component="shop-cart"
//                 data-role="page"
//                 className={classNames('shop-cart', {hybird: process.env.NATIVE})}
//             >
//                 <div className="shop-cart-top">
//                     <div className="shop-title">
//                         <p>购物车</p>
//                         <p>共{this.totalShop()}件商品</p>
//                     </div>
//                     {currentIndex === 0 && (valid.length > 0 || invalid.length > 0) ? (
//                         <div className="shop-edit" onClick={this.toggle}>
//                             {toggle ? '编辑' : '完成'}
//                         </div>
//                     ) : null}
//                 </div>
//                 <div className="shop-tabs">
//                     {
//                         textStyle.map((item, index) => (
//                             <div className={`top ${index === currentIndex ? 'active-text' : ''}`} onClick={() => this.changeCart(index)} key={item.title}>{item.title}</div>
//                         ))
//                     }
//                 </div>
//                 {(invalid.length > 0 || valid.length) > 0 ? (
//                     <div className={`shop-container${!hide ? 'hide-bottom' : ''}`}>
//                         <div className="shopCart-content">
//                             {valid.map((shop, index) => (
//                                 <div
//                                     className="shopCart-goods"
//                                     key={index.toString()}
//                                 >
//                                     <div className="goods-top">
//                                         <span
//                                             className={`icon ${shop.select ? 'icon-select-z' : 'icon-unselect-z'}`}
//                                             onClick={() => this.checkAllStatus(shop)}
//                                         />
//                                         <div className="shop-avatar">
//                                             <div className="avatar">
//                                                 <img
//                                                     src={shop.shop_logo}
//                                                     onError={(e) => { e.target.src = shop.df_logo }}
//                                                     alt=""
//                                                     className="image"
//                                                 />
//                                             </div>
//                                             <span className="avatar-name">{shop.shop_name}</span>
//                                         </div>
//                                         <div className="top-enter">
//                                             <span onClick={() => this.goToShopHome(shop)}>进店</span>
//                                         </div>
//                                     </div>
//                                     {shop.data.map((goods, i) => (
//                                         <SwipeAction
//                                             autoClose
//                                             key={goods.id}
//                                             right={[
//                                                 {
//                                                     text: '删除',
//                                                     style: {
//                                                         backgroundColor: '#E21E13',
//                                                         color: 'white'
//                                                     },
//                                                     onPress: () => this.deleteGoods(goods.id)
//                                                 }
//                                             ]}
//                                         >
//                                             <div className="goods-desc" onClick={() => this.goToGoodsDetail(goods.pr_id)}>
//                                                 <div className="desc-left">
//                                                     <span
//                                                         className={`icon ${goods.select ? 'icon-select' : 'icon-unselect'}`}
//                                                         onClick={(e) => this.checkSingleSelect(e, shop, goods)}
//                                                     />
//                                                     <img
//                                                         src={goods.picpath}
//                                                         alt=""
//                                                         className="thumb-img"

//                                                     />
//                                                 </div>
//                                                 <div className="desc-right">
//                                                     <div className="desc-title">{goods.pr_title}</div>
//                                                     <div className="desc-sku">
//                                                         <div className="sku-left">
//                                                             {

//                                                                 goods.property_name && goods.property_name.split(',').map(item => (
//                                                                     <span key={item}>{item}</span>
//                                                                 ))
//                                                             }
//                                                         </div>
//                                                         <span
//                                                             className="sku-right icon icon-down"
//                                                             // style={{marginRight: '20px'}}
//                                                             onClick={(e) => this.openSku(e, goods)}
//                                                         />
//                                                     </div>
//                                                     <div className="num-add">
//                                                         <div className="desc-count">
//                                                             C米：
//                                                             {goods.deposit}
//                                                         </div>
//                                                         <div className="num-right">
//                                                             <span
//                                                                 className="icon icon-sub"
//                                                                 onClick={(e) => this.changeNum(e, 'sub', goods)}
//                                                             />
//                                                             <span className="goods-count">
//                                                                 {goods.num}
//                                                             </span>
//                                                             <span
//                                                                 className="icon icon-sum"
//                                                                 onClick={(e) => this.changeNum(e, 'add', goods)}
//                                                             />
//                                                         </div>
//                                                     </div>
//                                                     <div className="goods-price">
//                                                         ￥{goods.price}
//                                                     </div>
//                                                 </div>
//                                             </div>
//                                         </SwipeAction>
//                                     ))}
//                                     {
//                                         loadDown && (
//                                             <div className="self">
//                                                 <div className="total-count">总C米：<span>{this.selfTotalCount(shop, index)}</span></div>
//                                                 <div className="total-goods">
//                                                     <div>共{this.selfNum(index)}件商品</div>
//                                                     <div>合计：<span>￥{this.selfPrice(index)}</span></div>
//                                                 </div>
//                                                 <div className="join">
//                                                     <span onClick={() => this.selfOrder(index)}>结算</span>
//                                                 </div>
//                                             </div>
//                                         )
//                                     }
//                                 </div>
//                             ))}
//                             <div
//                                 className="timeout-goods"
//                                 style={{
//                                     display:
//                                     invalid.length > 0 ? 'block' : 'none'
//                                 }}
//                             >
//                                 <div
//                                     className="timeout-top"
//                                 >
//                                     {/* <span
//                                         className={`icon ${invalidSelect ? 'icon-select-z' : 'icon-unselect-z'}`}
//                                         onClick={this.checkInvalidSelect}
//                                     /> */}
//                                     <p className="timeout-text">失效商品</p>
//                                     <div className="title-right">
//                                         <span
//                                             className="public"
//                                             onClick={() => this.addCollect('invalid')}
//                                         >
//                                             移入收藏
//                                         </span>
//                                         <span
//                                             className="public"
//                                             onClick={this.empty}
//                                         >
//                                             清空
//                                         </span>
//                                     </div>
//                                 </div>
//                                 {invalid.map((shop, index) => (
//                                     <SwipeAction
//                                         autoClose
//                                         key={shop.id}
//                                         right={[
//                                             {
//                                                 text: '删除',
//                                                 style: {
//                                                     backgroundColor: '#E21E13',
//                                                     color: 'white'
//                                                 },
//                                                 onPress: () => this.deleteGoods(shop.id)
//                                             }
//                                         ]}
//                                     >
//                                         <div className="timeout-desc">
//                                             <div
//                                                 className="desc-left"
//                                                 onClick={() => this.goToGoodsDetail(shop.pr_id)}
//                                             >
//                                                 <span className="reset">失效</span>
//                                                 <img
//                                                     src={shop.picpath}
//                                                     alt=""
//                                                     className="thumb-img"
//                                                 />
//                                             </div>
//                                             <div className="desc-right">
//                                                 <div className="desc-title">
//                                                     {shop.pr_title}
//                                                 </div>
//                                                 <div className="text">
//                                                     商品已不能购买，您可以进店查看相关商品
//                                                 </div>
//                                                 <div className="shop-name">
//                                                     <span>{shop.shop_name}</span>
//                                                     <span
//                                                         onClick={() => this.goToShopHome(shop)}
//                                                     >
//                                                         进店
//                                                     </span>
//                                                     <span className="icon icon-enter"/>
//                                                 </div>
//                                             </div>
//                                         </div>
//                                     </SwipeAction>
//                                 ))}
//                             </div>
//                         </div>
//                         {
//                             hide && (
//                                 <div className="shop-bottom" style={process.env.NATIVE && {bottom: '0px'}}>
//                                     <div className="bottom-left">
//                                         <div
//                                             className={`icon ${totalSelect ? 'icon-select-z' : 'icon-unselect-z'}`}
//                                             onClick={this.totalSelect}
//                                         />
//                                         <span>全选</span>
//                                     </div>
//                                     {toggle ? (
//                                         <div className="bottom-right">
//                                             <div className="total">
//                                                 <div className="total-price">
//                                             合计：
//                                                     <span>{this.getTotalPrice()}</span>
//                                                 </div>
//                                                 <div className="total-count">
//                                             总计账量：
//                                                     <span>{this.getTotalCount()}</span>
//                                                 </div>
//                                             </div>
//                                             <div className="clear" onClick={this.payin}>
//                                         结算{' '}
//                                                 <span>{this.getGoodsCount()}</span>
//                                             </div>
//                                         </div>
//                                     ) : (
//                                         <div className="bottom-right">
//                                             <div className="title-right">
//                                                 <span
//                                                     className="public enter"
//                                                     onClick={() => this.addCollect('valid')}
//                                                 >
//                                             移入收藏
//                                                 </span>
//                                                 <span
//                                                     className="public"
//                                                     onClick={this.totalEmpty}
//                                                 >
//                                             删除
//                                                 </span>
//                                             </div>
//                                         </div>
//                                     )}
//                                 </div>
//                             )
//                         }
//                     </div>
//                 ) : (
//                     <Nothing
//                         text={FIELD.No_Goods}
//                         onClick={this.emptyGoTo}
//                         title="咱们购物去"
//                     />
//                 )}
//                 {!process.env.NATIVE ? <FooterBar active="shopCart"/> : '' }

//                 {popup && (
//                     <Sku
//                         visible={popup}
//                         attributes={attributes}
//                         stocks={stocks}
//                         cover={cover}
//                         select={select}
//                         goods={goodsSku}
//                         onClose={this.closeSku}
//                         onSubmit={this.confirmSku}
//                         type={pickType}
//                         selectType={selectType}
//                     />
//                 )}
//             </div>
//         );
//     }
// }

// const mapToDispatchProps = {
//     showMenu: actionCreator.showMenu,
//     setOrderInfo: shopCartActionCreator.setOrder,
//     setIds: shopCartActionCreator.setIds,
//     showConfirm: actionCreator.showConfirm
// };
// export default connect(null, mapToDispatchProps)(ShopCart);
