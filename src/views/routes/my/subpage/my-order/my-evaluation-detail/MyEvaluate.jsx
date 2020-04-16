/**发表评论 */
import React from 'react';
import Immutable from 'immutable';
import './MyEvaluate.less';
import {dropByCacheKey} from 'react-router-cache-route';
import {Radio, Flex, TextareaItem, ImagePicker} from 'antd-mobile';
import AppNavBar from '../../../../../common/navbar/NavBar';

const {urlCfg} = Configs;
const {appHistory, getUrlParam, showInfo, showSuccess, native, nativeCssDiff} = Utils;
const {MESSAGE: {Form, Feedback}, IMGSIZE} = Constants;
//评价 好评 中评 差评
const evaluates = [
    {value: 1, title: '好评'},
    {value: 2, title: '中评'},
    {value: 3, title: '差评'}
];

//店铺评价、物流评分
const appraises = [
    {index: 1},
    {index: 2},
    {index: 3},
    {index: 4},
    {index: 5}
];

export default class MyEvaluate extends BaseComponent {
    state = {
        files: Immutable.List([]), //上传图片张数（最多）二维数组
        evaluate: Immutable.List([]), //评价商品集合
        estimate: [], //不同商品评价状态、好评、中评、差评
        discuss: [], //获取评价内容
        anonymous: true, //是否匿名评价
        shop: 0, //店铺评分
        logistics: 0, //物流评分
        filerAll: [], //请求图片提交集合
        selfHelp: ''//判断是否是从自提页面过来评价 2 是
    };

    componentDidMount() {
        this.getMoreList();
    }

    //获取信息
    getMoreList = () => {
        //获取订单ID
        const id = decodeURI(getUrlParam('id', encodeURI(this.props.location.search)));
        const assess = decodeURI(getUrlParam('assess', encodeURI(this.props.location.search)));
        this.fetch(urlCfg.orderAppraise, {data: {id}}).subscribe((res) => {
            if (res && res.status === 0) {
                const arrly = [];
                const array = [];
                const pic = [];
                for (let i = 0; i < res.list.length; i++) {
                    arrly.push(1);
                    array.push('');
                    pic.push([]);
                }
                res.list.forEach(item => {
                    item.nativePicNum = 9; //设置原生状态下，可以选择图片的数量
                });
                this.setState((prevState) => ({
                    evaluate: prevState.evaluate.merge(res.list), //获取订单商品
                    estimate: arrly, //获取订单的 商品数量 不同商品评价状态先默认为1
                    discuss: array, //获取商品的评价内容数量 先以空字符串push进去相对应的数量
                    selfHelp: assess //等于2 为是从自提过来的评价
                }));
            }
        });
    }

    //获取商品评价状态、好评、中评、差评
    onChange = (data) => {
        const {estimate} = this.state;
        const array = estimate.concat([]);
        array.splice(data[1], 1, data[0]);
        this.setState({
            estimate: array
        });
    }

    //获取商品评价内容
    discuss = (index, data) => {
        const {discuss} = this.state;
        const array = discuss.concat([]);
        array.splice(index, 1, data);
        this.setState({
            discuss: array
        });
    }

    //商品上传图片
    increase = (index, filer) => {
        //限制图片上传大小
        filer = filer.filter(item => {
            if (item.file.size < IMGSIZE) {
                return item;
            }
            return showInfo(Feedback.DOT_TWOM);
        });
        const {files} = this.state;
        const newFiles = files.set(index, filer);
        this.setState({
            files: newFiles
        });
    }

    //点击添加图片
    addPictrue = (data, index) => {
        if (process.env.NATIVE) {
            native('picCallback', {num: data.get('nativePicNum') || 9}, (dataList) => {
                const res = dataList ? JSON.parse(dataList) : '';
                const {files, evaluate} = this.state;
                const arr = [];
                if (res && res.status === '0') {
                    res.data.img.forEach(item => {
                        arr.push({urlB: item[0], url: item[1], id: new Date(), nativePicNum: 9});
                    });
                    let oldData = files;//设置初始值
                    let oldDataEv = evaluate;//设置初始值
                    if (files.get(index)) { //超过一张图片的时候走这里
                        oldData = files.map((item, num) => {
                            oldDataEv = evaluate.map((value, i) => { //遍历最初数据，让其可选图片数量做出改变
                                if (i === index) {
                                    const newData = value.set('nativePicNum', 9 - item.length - arr.length);
                                    return newData;
                                }
                                return value;
                            });
                            if (num === index) { //超过一张时候的处理
                                item = item.concat(...arr);
                                return item;
                            }
                            return item;
                        });
                    } else {
                        oldData = files.set(index, arr);//某条数据第一次添加的时候
                        oldDataEv = evaluate.setIn([index, 'nativePicNum'], 9 - arr.length);//动态计算原生可选择图片的数量
                    }
                    this.setState({
                        files: oldData,
                        evaluate: oldDataEv
                    });
                }
            });
        }
    };

    //点击删除图片
    deleteImg = (id, index) => {
        const {files, evaluate} = this.state;
        const nnn = files.map((item, num) => {
            item.forEach((dataValue, numData) => {
                if (dataValue.id === id) {
                    evaluate.setIn([numData, 'nativePicNum'], 9 - item.length);
                }
            });
            if (num === index) {
                return item.filter(data => data.id !== id);
            }
            return item;
        });
        this.setState({
            files: nnn,
            evaluate
        });
    };

    //是否匿名评价
    anonymous = () => {
        this.setState(prevState => ({
            anonymous: !prevState.anonymous
        }));
    }

    //店铺评分 星级
    grade = (index) => {
        this.setState({
            shop: index
        });
    }

    //物流评分 星级
    logistics = (index) => {
        this.setState({
            logistics: index
        });
    }

    //发布评价
    evaluationSuccess = () => {
        const {evaluate, estimate, discuss, anonymous, shop, logistics, files, selfHelp} = this.state;
        const id = decodeURI(getUrlParam('id', encodeURI(this.props.location.search)));
        //判断店铺 物流是否评分
        if (!shop) {
            showInfo(Form.No_EvaluateShop);
            return;
        }
        if ((!logistics && selfHelp !== '2')) {
            showInfo(Form.No_EvaluateLogistics);
            return;
        }
        const pasArr = [];//文字请求集合
        const picArr = [];//图片请求集合
        evaluate.forEach((item, index) => {
            if (item.get('pr_id')) { //先将所有的文字评价先保存
                pasArr.push({
                    pr_id: item.get('pr_id'),
                    mark_type: estimate[index],
                    types: 0,
                    content: discuss[index],
                    pr_title: item.get('pr_title'),
                    anonymous: anonymous ? '1' : '0',
                    shop_mark: shop,
                    logistics_mark: selfHelp === '2' ? '' : logistics,
                    property_content: item.get('property_content'),
                    have_pic: (files.get(index) && files.get(index).length > 0) ? 1 : '',
                    goods_id: item.get('id')
                });
            }
        });
        this.fetch(urlCfg.publishAssess, {data: {
            order_id: id,
            pingjia_content: pasArr.slice(0, 8)
        }}).subscribe((res) => {
            if (res && res.status === 0) {
                if (files.some(item => item && item.length > 0) && res.id && res.id.length > 0) { //有图片先请求
                    files.forEach((item, index) => {
                        if (item) {
                            item.forEach(data => {
                                if (data.url) {
                                    data.url = encodeURIComponent(data.url);
                                }
                            });
                            picArr.push(new Promise((resolve, reject) => {
                                this.fetch(urlCfg.picSave, {data: {
                                    type: 1,
                                    id: res.id[index],
                                    file: files.get(index)
                                }}).subscribe((resr) => {
                                    if (resr && resr.status === 0) {
                                        resolve(resr);
                                    }
                                });
                            }));
                            Promise.all(picArr).then(dataRes => {
                                showSuccess(Feedback.Evaluate_Success);
                                dropByCacheKey('OrderPage');
                                setTimeout(() => { appHistory.replace('/evaluationSuccess') }, 1000);
                            });
                        }
                    });
                } else {
                    showSuccess(Feedback.Evaluate_Success);
                    dropByCacheKey('OrderPage');
                    setTimeout(() => { appHistory.replace('/evaluationSuccess') }, 1000);
                }
            }
        });
    };

    render() {
        const {estimate, files, evaluate, anonymous, shop, logistics, selfHelp} = this.state;
        return (
            <div data-component="MyEvaluate" data-role="page" className="MyEvaluate">
                {/*评论头部*/}
                <AppNavBar title="发表评论"/>
                <div className="contents">
                    {evaluate.size > 0 ? evaluate.map((item, index) => (
                        <div className="appraise" key={item.get('id')}>
                            <div className="trade-box">
                                <div className="trade-name">
                                    <img src={item.get('picpath')} alt=""/>
                                    <div className="choice">
                                        {evaluates.map(items => (
                                            <Flex key={items.title}>
                                                <Flex.Item style={{padding: '15px 0', color: '@darker-black', flex: 'none'}}></Flex.Item>
                                                <Flex.Item>
                                                    <Radio checked={estimate[index] === items.value} onChange={this.onChange.bind(this, [items.value, index])}>{items.title}</Radio>
                                                </Flex.Item>
                                            </Flex>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <div className="side-margin">
                                <div className="describes">
                                    <TextareaItem
                                        placeholder="请输入您对该商品的评价"
                                        rows="3"
                                        count={500}
                                        onChange={(data) => this.discuss(index, data)}
                                    />
                                    <div className="upload-img">
                                        <div className="img-list">
                                            {
                                                process.env.NATIVE ? (
                                                    <div className="picture-area">
                                                        <ul>
                                                            {
                                                                files.get(index) && files.get(index).map((value, num) => num < 9 && (
                                                                    <li key={value.id}>
                                                                        <span onClick={() => this.deleteImg(value.id, index)}>×</span>
                                                                        <img src={value.url}/>
                                                                    </li>
                                                                ))
                                                            }
                                                            {
                                                                (!files.get(index) || files.get(index).length < 9) && (
                                                                    <li className="imgAdd-button" style={{border: nativeCssDiff() ? '1PX solid #e5e5e5' : '0.02rem solid #e5e5e5'}} onClick={() => this.addPictrue(item, index)}>
                                                                        <span>+</span>
                                                                    </li>
                                                                )
                                                            }
                                                        </ul>
                                                    </div>
                                                ) : (
                                                    <ImagePicker
                                                        files={files.get(index)}
                                                        onChange={(file) => this.increase(index, file)}
                                                        selectable={(files.get(index) ? files.get(index).length : 1) < 9}
                                                    />
                                                )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )) : ''}
                    <div className="Comment-content">
                        <div className="side-margin">
                            <div className="anonymous">
                                <Flex>
                                    <Flex.Item style={{padding: '15px 0', color: '@darker-black', flex: 'none'}}></Flex.Item>
                                    <Flex.Item>
                                        <Radio checked={anonymous} onClick={this.anonymous}>匿名评价</Radio>
                                    </Flex.Item>
                                </Flex>
                            </div>
                        </div>
                        <div className="score-box">
                            <div className="side-margin">
                                <div className="score">
                                    <span className="score-left">店铺评价</span>
                                    <span className="score-right">
                                        {appraises.map((item) => (
                                            <span key={item.index} className={`icon ${shop >= item.index ? 'stars' : 'starsRight'}`} onClick={() => this.grade(item.index)}/>
                                        ))}
                                    </span>
                                </div>
                            </div>
                            {/*selfHelp 等于2为自提评价*/}
                            {selfHelp !== '2' && (
                                <div className="side-margin">
                                    <div className="score">
                                        <span className="score-left">物流评分</span>
                                        <span className="score-right">
                                            {appraises.map((item) => (
                                                <span key={item.index} className={`icon ${logistics >= item.index ? 'stars' : 'starsRight'}`} onClick={() => this.logistics(item.index)}/>
                                            ))}
                                        </span>
                                    </div>
                                </div>
                            )}
                        </div>
                        <span className="Release">
                            <span className="Release-right" onClick={this.evaluationSuccess}>发布</span>
                        </span>
                    </div>
                </div>
            </div>
        );
    }
}