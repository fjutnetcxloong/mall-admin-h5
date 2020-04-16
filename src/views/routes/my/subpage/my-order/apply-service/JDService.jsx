// 京东售后 退货退款维修换货
import {connect} from 'react-redux';
import {Button, ImagePicker} from 'antd-mobile';
import Region from '../../../../../common/region/Region';
import {baseActionCreator as actionCreator} from '../../../../../../redux/baseAction';
import AppNavBar from '../../../../../common/navbar/NavBar';
import CancelOrder from '../../../../../common/cancel-order/CancleOrder';
import './JDService.less';

const {showInfo, appHistory, getUrlParam} = Utils;
const {urlCfg} = Configs;
let resultInfoArr = [
    // {label: '质量问题', value: 1},
    // {label: '商品与描述不符', value: 2},
    // {label: '误购（不喜欢/大小不合适）', value: 3},
    // {label: '卖家发错货', value: 4},
    // {label: '其他', value: 5}
];
class JDService extends BaseComponent {
    constructor(props) {
        super(props);
        this.state = {
            applyTitle: '请选择',
            addressArr: {}, //寄件地址信息
            returnaddressArr: {}, //返件地址信息
            logistArr: [], //物流集合
            bowOnfo: false, //原因选择弹框
            imgFiles: [], //图片集合
            resultValue: {}, //退款原因
            applyNum: 1, //申请数量
            returnMoney: '', //退款金额
            qusetDecrie: '', //问题描述
            linkName: '', //联系人姓名
            linkPhone: '', //联系人电话
            adressDetail: '', //详细地址
            returnAdressDetail: '', //返件详细地址
            type: this.getParameter('type'),
            orderId: this.getParameter('orderId'),
            dataInfo: {}, //接口请求数据
            province: '', //取件省的名字
            city: '', //取件市辖区的名字
            county: '', //取件城市的名字
            town: '', //取件街道的名字
            provinceReturn: '', //返件省的名字
            cityReturn: '', //返件市辖区的名字
            countyReturn: '', //返件城市的名字
            townReturn: '', //返件街道的名字
            editStatus: true, //地址选择显示与否
            packArr: [
                {
                    title: '是',
                    value: 1,
                    click: false
                }, {
                    title: '否',
                    value: 0,
                    click: false
                }
            ], // 是否包装数据
            describeArr: [
                {
                    title: '无包装',
                    value: 0,
                    click: false
                },
                {
                    title: '包装完整',
                    value: 10,
                    click: false
                },
                {
                    title: '包装破损',
                    value: 20,
                    click: false
                }
            ], //包装描述
            pickArr: [
                {
                    title: '上门取件',
                    click: false
                }, {
                    title: '客户发货',
                    click: false
                }
            ], //取件信息,
            returnPart: [
                {
                    title: '自营配送',
                    click: false,
                    value: 10
                }, {
                    title: '第三方配送',
                    click: false,
                    value: 20
                }
            ] //返件方式
        };
    }


    componentDidMount() {
        this.getList();
    }

    //获取参数
    getParameter = (value) => decodeURI(getUrlParam(value, encodeURI(this.props.location.search)))

    //获取申请信息
    getList = () => {
        const {type, orderId} = this.state;
        this.fetch(urlCfg.jdRefundPage, {data: {order_id: orderId, return_type: type}})
            .subscribe(res => {
                if (res && res.status === 0) {
                    resultInfoArr = res.data.reason;
                    this.setState({
                        dataInfo: res.data,
                        linkName: res.data.linkname,
                        linkPhone: res.data.linktel,
                        adressDetail: res.data.address,
                        addressArr: Object.assign({}, res.data.area),
                        province: res.data.area.province,
                        city: res.data.area.city,
                        county: res.data.area.county,
                        town: res.data.area.town,
                        returnMoney: res.data.single_price,
                        pickArr: res.data.ware_type.map(item => { item.click = false; return item })
                    });
                    if (type !== 'null' && type !== '2') {
                        this.setState({
                            returnaddressArr: Object.assign({}, res.data.area),
                            provinceReturn: res.data.area.province,
                            cityReturn: res.data.area.city,
                            countyReturn: res.data.area.county,
                            townReturn: res.data.area.town,
                            returnAdressDetail: res.data.address
                            // pickArr: res.data.ware_type.map(item => { item.click = false })
                        });
                    }
                }
            });
    }

    //获取标题名字
    getTabName = (num) => {
        const arr = new Map([
            ['2', '申请退货/退款'],
            ['3', '申请换货'],
            ['4', '申请维修']
        ]);
        return arr.get(num);
    }

    //提交申请
    onSubmit = () => {
        const {packArr, describeArr, pickArr, resultValue, imgFiles, returnPart, orderId,
            applyNum, qusetDecrie, linkName, linkPhone, adressDetail, type, returnAdressDetail, returnaddressArr,
            addressArr
        } = this.state;
        const adArr = [addressArr.provinceId, addressArr.cityId, addressArr.countyId, addressArr.townId];//取件地址集合
        const reArr = [returnaddressArr.provinceId, returnaddressArr.cityId, returnaddressArr.countyId, returnaddressArr.townId];//返件地址集合
        if (!resultValue.label) {
            showInfo('请选择申请原因');
            return;
        }
        if (!applyNum) {
            showInfo('请填写申请数量');
            return;
        }
        if (!qusetDecrie) {
            showInfo('请填写问题描述');
            return;
        }
        if (packArr.every(item => !item.click)) {
            showInfo('请选择是否有包装');
            return;
        }
        if (describeArr.every(item => !item.click)) {
            showInfo('请选择包装描述');
            return;
        }
        if (pickArr.every(item => !item.click)) {
            showInfo('请选择取件方式');
            return;
        }
        if (adArr.some(item => !item)) {
            showInfo('请选择取件地址');
            return;
        }
        if (!linkName) {
            showInfo('请填写联系人');
            return;
        }
        if (!linkPhone) {
            showInfo('请填写联系人电话');
            return;
        }
        if (!adressDetail) {
            showInfo('请填写取件详细地址');
            return;
        }
        if (reArr.some(item => !item)) {
            showInfo('请选择返件地址');
            return;
        }
        if (!returnAdressDetail) {
            showInfo('请填写返件详细地址');
            return;
        }
        if (returnPart.every(item => !item.click)) {
            showInfo('请选择返件方式');
            return;
        }
        let bar = '';//是否包装
        let dec = '';//是否包装
        let getType = '';//取件方式
        let reType = '';//返件方式
        packArr.forEach(item => {
            if (item.click) {
                bar = item.value;
            }
        });
        describeArr.forEach(item => {
            if (item.click) {
                dec = item.value;
            }
        });
        pickArr.forEach(item => {
            if (item.click) {
                getType = item.code;
            }
        });
        returnPart.forEach(item => {
            if (item.click) {
                reType = item.value;
            }
        });
        this.fetch(urlCfg.jdRefundApply, {
            data: {
                type,
                order_id: orderId,
                reasons: resultValue.label,
                skunum: applyNum,
                describe: qusetDecrie,
                ispackage: bar,
                package: dec,
                picktype: getType,
                name: linkName,
                tel: linkPhone,
                pick_pca: adArr,
                pick_address: adressDetail,
                re_pca: reArr,
                re_address: returnAdressDetail,
                retype: reType}})
            .subscribe(res => {
                if (res && res.status === 0) {
                    if (imgFiles.length > 0) {
                        const imgArr = [];
                        imgFiles.forEach((item, index) => {
                            imgArr.push(new Promise((resolve, reject) => {
                                this.fetch(urlCfg.pictureUploadBase, {data: {type: 2, id: res.data.id, ix: index, file: encodeURIComponent(item.url)}})
                                    .subscribe(data => {
                                        if (data && data.status === 0) {
                                            resolve();
                                        }
                                    });
                            }));
                        });
                        Promise.all(imgArr).then(dataRes => {
                            this.jingDongInfo();
                        });
                    } else {
                        this.jingDongInfo();
                    }
                }
            });
    }

    //成功跳转
    jingDongInfo = (id) => {
        this.fetch(urlCfg.jdCreateAfsApply, {data: {return_id: id}}).subscribe(dataValue => {
            if (dataValue && dataValue.status === 0) {
                appHistory.replace(`/jdsSaveSuccess?id=${id}`);
            }
        });
    }

    //  省市县的赋值
    setProvince = (str, num) => {
        const {addressArr, returnaddressArr} = this.state;
        if (num === 1) {
            addressArr.provinceId = str;
            addressArr.cityId = '';
            addressArr.countyId = '';
            addressArr.townId = '';
            this.setState({
                addressArr
            });
        } else {
            returnaddressArr.provinceId = str;
            returnaddressArr.cityId = '';
            returnaddressArr.countyId = '';
            returnaddressArr.townId = '';
            this.setState({
                returnaddressArr
            });
        }
    };

    //  市辖区赋值
    setCity = (str, num) => {
        const {addressArr, returnaddressArr} = this.state;
        if (num === 1) {
            alert(2);
            addressArr.cityId = str;
            addressArr.countyId = '';
            addressArr.townId = '';
            this.setState({
                addressArr
            });
        } else {
            alert(1);
            returnaddressArr.cityId = str;
            returnaddressArr.countyId = '';
            returnaddressArr.townId = '';
            this.setState({
                returnaddressArr
            });
        }
    };

    //  城市赋值
    setCounty = (str, num) => {
        const {addressArr, returnaddressArr} = this.state;
        if (num === 1) {
            addressArr.countyId = str;
            addressArr.townId = '';
            this.setState({
                addressArr
            });
        } else {
            returnaddressArr.countyId = str;
            returnaddressArr.townId = '';
            this.setState({
                returnaddressArr
            });
        }
    };

    //  街道赋值
    setStreet = (str, num) => {
        const {addressArr, returnaddressArr} = this.state;
        if (num === 1) {
            addressArr.townId = str;
            this.setState({
                addressArr
            });
        } else {
            returnaddressArr.townId = str;
            this.setState({
                returnaddressArr
            });
        }
    };

    //单选事件
    changeRaio = (id, num, arr) => {
        arr.forEach(item => { item.click = false });
        const arrNew = arr.map((item, index) => {
            if (index === num) {
                item.click = true;
            }
            return item;
        });
        let obj = {};
        if (id === 1) {
            obj = {packArr: arrNew};
        } else if (id === 2) {
            obj = {describeArr: arrNew};
        } else if (id === 3) {
            obj = {pickArr: arrNew};
        } else {
            obj = {returnPart: arrNew};
        }
        this.setState(obj);
    }

    //控制退款原因弹框
    canStateChange = (data, value) => {
        this.setState({
            bowOnfo: false,
            resultValue: value
        });
    }

    //图片选择
    onImgChange = (file) => {
        this.setState({
            imgFiles: file
        });
    }

    //父级数据变更
    editStatusChange = () => {
        this.setState({
            editStatus: false
        });
    };


    render() {
        const {packArr, describeArr, pickArr, returnPart, bowOnfo, resultValue, imgFiles, returnMoney,
            applyNum, qusetDecrie, linkName, linkPhone, adressDetail, type, dataInfo, addressArr,
            province, city, county, town, editStatus, returnaddressArr, provinceReturn, cityReturn,
            countyReturn, townReturn, returnAdressDetail
        } = this.state;
        return (
            <div data-component="JDSerivce" data-role="page" className="JDSerivce">
                <AppNavBar title={this.getTabName(type)}/>
                <div className="main-top">
                    <div className="shop-info">
                        <img src={dataInfo.pr_picpath}/>
                        <p>{dataInfo.pr_title}</p>
                    </div>
                    <div className="apply-info">
                        <div className="apply" onClick={() => { this.setState({bowOnfo: true}) }}>
                            <p><span>*</span>申请原因</p>
                            <input placeholder="请选择申请原因" disabled value={resultValue && resultValue.label}/>
                            <div className="icon inp"/>
                        </div>
                        <div className="apply">
                            <p><span>*</span>商品数量</p>
                            <input placeholder="请输入商品数量" type="number" value={applyNum} onChange={(data) => { this.setState({applyNum: data.target.value, returnMoney: dataInfo.single_price * data.target.value}) }}/>
                        </div>
                        <div className="apply">
                            <p><span>*</span>问题描述</p>
                            <input placeholder="请填写您要描述的内容" value={qusetDecrie} onChange={(data) => { this.setState({qusetDecrie: data.target.value}) }}/>
                        </div>
                        {
                            process.env.NATIVE ? (
                                <div className="apply-img">
                                    <div><span>+</span></div>
                                    <p>请添加图片</p>
                                </div>
                            ) : (
                                <ImagePicker
                                    files={imgFiles}
                                    onChange={this.onImgChange}
                                    selectable={imgFiles.length < 9}
                                    multiple
                                    onAddImageClick={(data, value) => true}
                                />
                            )
                        }
                        {
                            type === '10' && (
                                <div className="apply-money">
                                    <span className="info-left">退款金额：</span>
                                    <span className="info-right">￥{returnMoney}</span>
                                </div>
                            )
                        }
                    </div>
                </div>
                <div className="main-center">
                    <div className="center-info">
                        <p><span>*</span>是否有包装</p>
                        {
                            packArr.map((item, index) => (
                                <div key={item.title} className={'choise' + (item.click ? ' activeJD' : '')} onClick={() => this.changeRaio(1, index, packArr)}>
                                    <i className="icon hook"/>
                                    <span>{item.title}</span>
                                </div>
                            ))
                        }
                    </div>
                    <div className="center-info">
                        <p><span>*</span>包装描述</p>
                        {
                            describeArr.map((item, index) => (
                                <div key={item.title} className={'choise' + (item.click ? ' activeJD' : '')} onClick={() => this.changeRaio(2, index, describeArr)}>
                                    <i className="icon hook"/>
                                    <span>{item.title}</span>
                                </div>
                            ))
                        }
                    </div>
                    <div className="center-info">
                        <p><span>*</span>取件方式</p>
                        {
                            pickArr.map((item, index) => (
                                <div key={item.name} className={'choise' + (item.click ? ' activeJD' : '')} onClick={() => this.changeRaio(3, index, pickArr)}>
                                    <i className="icon hook"/>
                                    <span>{item.name}</span>
                                </div>
                            ))
                        }
                    </div>
                    <div className="pick-info">
                        <p><span>*</span>取件信息</p>
                        <input placeholder="请输入联系人姓名" value={linkName} onChange={(data) => { this.setState({linkName: data.target.value}) }}/>
                        <input placeholder="请输入联系人电话" type="number" value={linkPhone} onChange={(data) => { this.setState({linkPhone: data.target.value}) }}/>
                        <div className="region-style">
                            <Region
                                onSetProvince={(data) => { this.setProvince(data, 1) }}
                                onSetCity={(data) => { this.setCity(data, 1) }}
                                onSetCounty={(data) => { this.setCounty(data, 1) }}
                                onSetStreet={(data) => { this.setStreet(data, 1) }}
                                provinceValue={province}
                                cityValue={city}
                                countyValue={county}
                                townValue={town}
                                provinceId={addressArr.provinceId}
                                cityId={addressArr.cityId}
                                countyId={addressArr.countyId}
                                townId={addressArr.townId}
                                editStatus={editStatus}
                                editStatusChange={this.editStatusChange}
                                typeFour
                                textAlign="left"
                            />
                            <div className="icon inp"/>
                        </div>
                        <input placeholder="请输入详细地址" value={adressDetail} onChange={(data) => { this.setState({adressDetail: data.target.value}) }}/>
                    </div>
                    <div className="return-parts">
                        <p><span>*</span>返件地址</p>
                        <div className="region-style">
                            <Region
                                onSetProvince={this.setProvince}
                                onSetCity={this.setCity}
                                onSetCounty={this.setCounty}
                                onSetStreet={this.setStreet}
                                provinceValue={provinceReturn}
                                cityValue={cityReturn}
                                countyValue={countyReturn}
                                townValue={townReturn}
                                provinceId={returnaddressArr.provinceId}
                                cityId={returnaddressArr.cityId}
                                countyId={returnaddressArr.countyId}
                                townId={returnaddressArr.townId}
                                editStatus={editStatus}
                                editStatusChange={this.editStatusChange}
                                typeFour
                                textAlign="left"
                            />
                            <div className="icon inp"/>
                        </div>
                        <input placeholder="请输入详细地址" value={returnAdressDetail} onChange={(data) => { this.setState({returnAdressDetail: data.target.value}) }}/>
                    </div>
                    <div className="center-info return-info">
                        <p><span>*</span>返件方式</p>
                        {
                            returnPart.map((item, index) => (
                                <div key={item.title} className={'choise' + (item.click ? ' activeJD' : '')} onClick={() => this.changeRaio(4, index, returnPart)}>
                                    <i className="icon hook"/>
                                    <span>{item.title}</span>
                                </div>
                            ))
                        }
                    </div>
                    {
                        bowOnfo && <CancelOrder propsData={resultInfoArr} canStateChange={this.canStateChange}/>
                    }
                </div>
                <Button className="sub-btn" onClick={this.onSubmit}>提交</Button>
            </div>
        );
    }
}


const mapStateToProps = state => {
    const base = state.get('base');
    return {
        orderStatus: base.get('orderStatus')
    };
};

const mapDispatchToProps = {
    setOrderStatus: actionCreator.setOrderStatus
};

export default connect(mapStateToProps, mapDispatchToProps)(JDService);
