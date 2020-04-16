/**
 * SKU组件
 */
import PropTypes from 'prop-types';
import {Modal, Button} from 'antd-mobile';
import './Sku.less';

const {showInfo, nativeCssDiff} = Utils;
const {MESSAGE: {Feedback}} = Constants;
class Sku extends React.PureComponent {
    //组件API类型
    static propTypes = {
        visible: PropTypes.bool, //sku是否显示
        isZM: PropTypes.bool.isRequired, //sku是否显示
        detail: PropTypes.object, //商品详情
        attributes: PropTypes.array, //商品属性
        stocks: PropTypes.array, //商品库存
        cover: PropTypes.string, //商品图
        select: PropTypes.array, //选中商品属性id
        onClose: PropTypes.func, //点击关闭按钮时调用
        onSubmit: PropTypes.func, //点击确认按钮时调用
        extra: PropTypes.oneOfType([//附加内容
            PropTypes.node,
            PropTypes.func
        ]),
        goods: PropTypes.array, //更新购物车所需属性
        type: PropTypes.object, //配送方式
        selectType: PropTypes.string//选中配送方式id
    };

    //组件API默认值
    static defaultProps = {
        visible: true,
        detail: {},
        attributes: [],
        stocks: [],
        cover: '',
        select: [],
        onClose() {},
        onSubmit() {},
        extra: null,
        goods: [],
        type: {},
        selectType: ''
    };

    state = {
        selectType: this.props.selectType, //存放被选中的配送方式
        selectedTemp: {}, // 存放被选中的属性组合
        Ids: this.props.select, //存放被选中的属性id
        price: this.props.detail.price, // 价格
        originalPrice: '0.00', //原价
        deposit: '0.00', //C米
        submitalbe: false//确认按钮是否可点击
    };

    componentDidMount() {
        this.getSkuResult();
    }

    //获取字典
    getSkuResult = () => {
        const {Ids} = this.state;
        const skuResult =  this.initSKU();//字典
        this.setState({
            skuResult: skuResult
        }, () => {
            this.skuHandler();//字典生成后处理sku属性是否可选择
            if (Ids) {
                Ids.forEach((value, index) => {
                    this.clickHandler(value, index);
                });
            }
        });
    }

    //生成字典
    initSKU= () => {
        const {stocks} = this.props;
        // console.log(stocks, '手机卡和第三届');
        // console.log('库存信息stocks:', stocks);
        const data = stocks.reduce((obj, item) => {
            const object = Object.assign({}, obj);
            const total = item.attribute.reduce((arr, value) => {
                arr.push(value.childAttr.id);
                return arr;
            }, []);
            object[total.join(';')] = Object.assign({}, item);
            return object;
        }, {});
        // console.log('所有sku组合：', data);
        const SKUResult = {};
        // 需要剔除stock为 0 的库存
        const skuKeys = Object.keys(data).reduce((arr, key) => {
            if (parseInt(data[key].stock, 10) > 0) {
                arr.push(key);
            }
            return arr;
        }, []);
        // console.log('库存不为0的sku组合：', skuKeys);
        const _this = this;
        skuKeys.forEach(skuKey => {
            const sku = data[skuKey];
            const skuKeyAttrs = skuKey.split(';');
            const combArr = _this.arrayCombine(skuKeyAttrs);
            for (let j = 0; j < combArr.length; j++) {
                const key = combArr[j].join(';');
                //为拆开的每个字典key生成对应的value
                if (SKUResult[key]) {
                    // console.log(SKUResult, '萨克都卡时间段卡萨');

                    // SKUResult[key].prices.push(sku.price);
                    // SKUResult[key].originalPrices.push(sku.original_price);
                    // SKUResult[key].deposits.push(sku.deposit);
                    SKUResult[key].stocks += parseInt(sku.stock, 10);
                } else {
                    SKUResult[key] = {
                        // prices: [sku.price],
                        // originalPrices: [sku.original_price],
                        // deposits: [sku.deposit],
                        stocks: parseInt(sku.stock, 10)
                    };
                    // console.log(SKUResult, '萨克都卡时间段卡萨');
                }
            }
            // console.log(skuKey, '萨克都卡时间段卡萨');
            SKUResult[skuKey] = {
                price: sku.price,
                originalPrice: sku.original_price,
                deposit: sku.deposit,
                stocks: parseInt(sku.stock, 10)
            };
        });
        // console.log('字典：', SKUResult);
        return SKUResult;
    };

    arrayCombine=(targetArr) => {
        if (!targetArr || !targetArr.length) {
            return [];
        }
        const len = targetArr.length;
        const resultArrs = [];
        for (let n = 1; n < len; n++) {
            const flagArrs = this.getFlagArrs(len, n);
            while (flagArrs.length) {
                const flagArr = flagArrs.shift();
                const combArr = targetArr.reduce((comb = combArr, value, index) => {
                    flagArr[index] && comb.push(value);
                    return comb;
                }, []);
                resultArrs.push(combArr);
            }
        }
        // console.log('将库存不为0的sku组合拆开生成字典的key', resultArrs);
        return resultArrs;
    }

    //从m中属性中选择n个属性值
    getFlagArrs=(m, n) => {
        if (!n || n < 1) {
            return [];
        }
        const resultArrs = [];
        const flagArr = [];
        let isEnd = false;
        let leftCnt;
        for (let i = 0; i < m; i++) {
            flagArr[i] = i < n ? 1 : 0;
        }
        resultArrs.push(flagArr.concat());
        while (!isEnd) {
            leftCnt = 0;
            for (let i = 0; i < m - 1; i++) {
                if (flagArr[i] === 1 && flagArr[i + 1] === 0) {
                    for (let j = 0; j < i; j++) {
                        flagArr[j] = j < leftCnt ? 1 : 0;
                    }
                    flagArr[i] = 0;
                    flagArr[i + 1] = 1;
                    const aTmp = flagArr.concat();
                    resultArrs.push(aTmp);
                    if (
                        aTmp
                            .slice(-n)
                            .join('')
                            .indexOf('0') === -1
                    ) {
                        isEnd = true;
                    }
                    break;
                }
                flagArr[i] === 1 && leftCnt++;
            }
        }
        return resultArrs;
    }

    // 处理sku数据
    skuHandler= () => {
        const {detail, attributes} = this.props;
        const {selectedTemp, skuResult} = this.state;
        // console.log('商品属性attributes:', skuResult);
        // 根据已选中的selectedTemp，生成字典查询selectedIdsTemp
        const selectedIdsTemp = Object.keys(selectedTemp).reduce((arr, value) => {
            if (selectedTemp[value]) {
                arr[selectedTemp[value].index] = selectedTemp[value].id;
            }
            return arr;
        }, []);
        const selectedIds = selectedIdsTemp.filter(item => item);
        // console.log('当前选中属性值', selectedIds);
        // 处理attributes数据，根据字典查询结果计算当前选择情况的价格范围以及总数量。
        // 并添加selected和unselectable属性，用于render判断。
        attributes.forEach((attribute, index) => {
            attribute.data.forEach(item => {
                //将选中的规格值的selected设为true
                item.selected = !!(selectedTemp[attribute.name] && selectedTemp[attribute.name].id === item.id);
                if (!item.selected) {
                    let testAttrIds = [...selectedIdsTemp];
                    testAttrIds[index] = item.id;
                    testAttrIds = testAttrIds.filter(v => v);
                    // console.log('testAttrIds', testAttrIds.join(';'));
                    item.unselectable = !(Object.keys(skuResult).indexOf(testAttrIds.join(';')) !== -1);
                    // console.log('下一步可选的属性值:', item);
                }
            });
        });
        const nextState = {};
        nextState.submitalbe = false;
        if (skuResult[selectedIds.join(';')]) {
            if (selectedIds.length === attributes.length) {
                nextState.submitalbe = true;
                nextState.originalPrice = skuResult[selectedIds.join(';')].originalPrice;
                nextState.price = skuResult[selectedIds.join(';')].price;
                nextState.deposit = skuResult[selectedIds.join(';')].deposit;
            }
            nextState.stock = skuResult[selectedIds.join(';')].stocks;
        } else {
            nextState.stock = detail.num_stock;
        }
        this.setState({
            Ids: selectedIds
        });
        Object.keys(nextState).length > 0 && this.setState(nextState);
    };

    //选择配送方式
    clickPickType= (tId) => {
        // console.log('选择配送方式', tId);
        this.setState({
            selectType: tId
        });
    }

    //选择商品属性
    clickHandler= (clickId, index) => {
        const {attributes} = this.props;
        const {selectedTemp} = this.state;
        // console.log('选中项：', clickId, '选中第几行规格：', index);
        attributes.forEach((info) => {
            if (selectedTemp[info.name] && selectedTemp[info.name].id === clickId) {
                //删除已选中项
                delete (selectedTemp[info.name]);
            } else {
                info.data.forEach(item => {
                    if (item.id === clickId) {
                        item.selected = true;
                        selectedTemp[info.name] = {};
                        selectedTemp[info.name].id = item.id;
                        selectedTemp[info.name].index = index;
                        selectedTemp[info.name].value = item.value;
                    }
                });
            }
        });
        this.setState({
            selectedTemp
        }, () => {
            this.skuHandler();
        });
    };

    //提示信息
    showToast = (selectedTemp) => {
        const {attributes} = this.props;
        // console.log('已选择', selectedTemp, Object.keys(selectedTemp));
        const arr = [];
        attributes.forEach(item => {
            console.log(item, '德生科技啊哈撒读后感');
            if (!Object.keys(selectedTemp).includes(item.name)) arr.push(item.name);
        });
        showInfo(Feedback.Select + arr);
    };

    //提交选中的商品属性
    onSubmit=(clickType) => {
        const {selectType, Ids, selectedTemp} = this.state;
        const {goods, type, onSubmit} = this.props;
        //配送方式不能为空
        if (selectType === '') {
            showInfo(Feedback.Select + type.name);
            return;
        }
        const valueArr = Object.values(selectedTemp).map(item => item.value);
        if (goods.length === 0) {
            onSubmit(selectType, Ids, valueArr, clickType); //商品详情
        } else {
            onSubmit(selectType, Ids, goods, clickType); //购物车
        }
    };

    //渲染额外内容
    getExtraElement=(a) => {
        const {extra} = this.props;
        let extraElement;
        if (typeof extra === 'function') {
            extraElement = extra(a);
        } else {
            extraElement = extra;
        }
        return extraElement;
    }

    render() {
        const {selectedTemp, selectType, submitalbe, price, originalPrice, deposit, stock} = this.state;
        const {type, attributes, cover, visible, onClose, isZM} = this.props;
        return (
            <Modal
                className="panel-mask"
                popup
                visible={visible}
                onClose={onClose}
                animationType="slide-up"
            >
                <div className="panel">
                    <div className="panel-top">
                        <div className="panel-left">
                            <img src={cover} alt=""/>
                        </div>
                        <div className="panel-right">
                            <div className="price">
                                <span>￥{price}</span>
                                <span>￥{originalPrice}</span>
                            </div>
                            <div className="residue">库存{stock < 10000 ? stock : '充足'}</div>
                            <div className="inventory-box">
                                <div className="count">
                                    C米：{deposit}
                                </div>
                            </div>
                            <div className="close icon" onClick={onClose}/>
                        </div>
                    </div>
                    <div className="panel-bot">
                        <div className="panel-content-box">
                            <div className="panel-content">
                                <div className={`methods ${nativeCssDiff() ? 'general-other' : 'general'}`} key={type.name}>
                                    <div className="heading">{type.name}</div>
                                    <div className="select">
                                        {type.data.map(item => (
                                            <Button
                                                className={item.id.toString() === selectType ? 'active-att' : 'select-att'}
                                                key={item.id}
                                                onClick={() => this.clickPickType(item.id.toString())}
                                            >
                                                {item.value}
                                            </Button>
                                        ))}
                                    </div>
                                </div>
                                {attributes.map((attribute, index) => (
                                    <div className={`methods ${nativeCssDiff() ? 'general-other' : 'general'}`} key={attribute.name}>
                                        <div className="heading">{attribute.name}</div>
                                        <div className="select">
                                            {attribute.data.map(item => {
                                                const styleName = item.selected
                                                    ? 'active-att'//选中
                                                    : 'select-att'; //未选中
                                                return (
                                                    <Button
                                                        className={styleName}
                                                        key={item.id}
                                                        disabled={!!item.unselectable}
                                                        onClick={() => this.clickHandler(item.id, index)}
                                                    >
                                                        {item.value}
                                                    </Button>
                                                );
                                            })}
                                        </div>
                                    </div>
                                ))}
                            </div>
                            {this.getExtraElement(stock)}
                        </div>
                    </div>
                    {isZM ? (
                        <div className="sku-btn">
                            <div style={{border: nativeCssDiff() ? '1PX solid #FF2D51' : '0.01rem solid #FF2D51'}} onClick={() => this.onSubmit(1)}>加入购物车</div>
                            <div onClick={() => this.onSubmit(2)}>立即购买</div>
                        </div>
                    ) : (
                        <Button
                            style={{width: '93%', margin: 'auto'}}
                            onClick={submitalbe
                                ? this.onSubmit
                                : () => this.showToast(selectedTemp)
                            }
                        >确定
                        </Button>
                    )}
                </div>
            </Modal>
        );
    }
}

export default Sku;
