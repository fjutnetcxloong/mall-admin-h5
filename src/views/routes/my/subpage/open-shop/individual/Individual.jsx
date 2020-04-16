/**
 * 我要开店---个体页面
 * */
import {List, InputItem, Picker, Modal, Flex, TextareaItem} from 'antd-mobile';
import {createForm} from 'rc-form';
import AppNavBar from '../../../../../common/navbar/NavBar';
import IndividualTwo from './IndividualTwo';
import IndividualThree from './IndividualThree';
import IndividualFour from './IndividualFour';
import Region from '../../../../../common/region/Region';
import GeisInputItem from '../../../../../common/form/input/GeisInputItem';
import './Individual.less';

const {urlCfg} = Configs;
const {MESSAGE: {Form}} = Constants;
const {showInfo, validator} = Utils;
// const RadioItem = Radio.RadioItem;
const data = [
    {value: 1, label: '正式商户'},
    {value: 2, label: '体验商户'}
];
const datas = [
    {value: 1, label: '是'},
    {value: 0, label: '否'}
];
const typeOne = '选择直接入驻，您将直接成为正式商家，设置的折扣在审核通过后即生效并享有跨界收益';
const typeTwo = '您申请入驻体验商家享有5,000体验额度，此额度内商家折扣不生效且没有跨界收益；如您体验期超一个月或营业总额超过体验金额，将转为正式商家。成为正式商家后，您此时设置的折扣自动生效且将享有跨界收益，商家折扣可在店铺设置内修改。';
class Individual extends BaseComponent {
    state = {
        editModal: '',
        values: 1,
        value: 1,
        discount: '', // 浮点型 (折扣率/true/1-9.5)
        shopName: '',  //字符串 (商店名称/true/1-100)
        address: '', //详细地址
        linkName: '', //负责人名字(/true/2-5)
        isExp: '', //1：正式商户；2：体验商户
        phone: '', //负责人手机号 (手机号/true/11)
        cshPhone: '',   //客服手机号 (手机号/true/11)
        pickUpSelf: '',  //是否支持自提 (验证码/true/0：不支持；1：支持)
        cValue: [],
        cate1: '', //字符串 (分类名/true/1-100)
        cate1Id: '', //整型 (分类ID/true/1-9999)
        shopType: '', //整型 (开店类型/true/1-2)（0：个体户；1：个体工商户）
        category: [], //主营行业数组
        modal1: false,
        openTime: '',  //营业时间
        closeTime: '',  //打烊时间
        date: [],
        oTValue: '',
        cTValue: '',
        text: '',
        province: '', //省的名字
        urban: '', //市辖区的名字
        county: '', //城市名字
        updateAudit: '',
        editStatus: true,
        addressStatus: ''
    };

    //提交店铺信息
    postInformation = () => {
        // this.setState({editModal: 'two'});
        const {cate1, cate1Id, province, urban, county, pickUpSelf, isExp, openTime, closeTime} = this.state;
        const {form: {validateFields}} = this.props;
        const pca = [province, urban, county];
        validateFields({first: true, force: true}, (error, val) => {
            if (!error) {
                this.fetch(urlCfg.postShopapply, {data: {
                    shopName: val.shopName,
                    linkName: val.linkName,
                    phone: validator.wipeOut(val.phone),
                    csh_phone: validator.wipeOut(val.cshPhone),
                    discount: val.discount,
                    pca: pca,
                    pick_up_self: pickUpSelf,
                    shop_type: 1,
                    cate1_id: Number(cate1Id),
                    cate1: cate1,
                    is_exp: isExp,
                    address: val.detailArea,
                    open_time: openTime,
                    close_time: closeTime
                }}).subscribe(res => {
                    if (res.status === 0) {
                        this.setState({editModal: 'two'});
                    }
                });
                return;
            }
            console.log('错误', error, val);
        });
    };

    componentDidMount() {
        this.getCategorys();
        this.getdoBusinessTime();
        this.getUpdateAudit();
        // this.setExp();
        // this.setPickupSelf();
    }

    //获取审核失败返回的数据
    getUpdateAudit = () => {
        this.fetch(urlCfg.updateAudit, {data: {type: 1}})
            .subscribe(res => {
                console.log(res.data.length);
                if (res && res.status === 0 && res.data.length !== 0) {
                    this.setState({
                        updateAudit: res.data,
                        shopName: res.data.shopName,
                        cate1: res.data.cate1,
                        cate1Id: res.data.cate1_id,
                        cValue: Array(res.data.cate1_id),
                        address: res.data.address,
                        openTime: res.data.open_time,
                        closeTime: res.data.close_time,
                        discount: parseInt(res.data.discount, 10),
                        isExp: Number(res.data.type),
                        value: res.data.type - 1,
                        pickUpSelf: Number(res.data.pick_up_self),
                        values: Number(res.data.pick_up_self),
                        cshPhone: res.data.csh_phone,
                        linkName: res.data.linkName,
                        phone: res.data.phone,
                        province: res.data.city_name && res.data.city_name[0],
                        urban: res.data.city_name && res.data.city_name[1],
                        county: res.data.city_name && res.data.city_name[2],
                        provinceId: res.data.province_id,
                        cityId: res.data.city_id,
                        countyId: res.data.county_id,
                        addressStatus: '1',
                        text: Number(res.data.type) === 1 ? typeOne : typeTwo
                    });
                }
            });
    };

    //创建营业时间
    getdoBusinessTime = () => {
        const arr1 = [];
        const arr2 = [];
        for (let i = 0; i < 24; i++) {
            if (i < 10) {
                arr1.push({label: '0' + i + '时', value: '0' + i + ':'});
            } else {
                arr1.push({label: i.toString() + '时', value: i.toString() + ':'});
            }
        }
        for (let i = 0; i <= 59; i++) {
            if (i < 10) {
                arr2.push({label: '0' + i + '分', value: '0' + i});
            } else {
                arr2.push({label: i.toString() + '分', value: i.toString()});
            }
        }
        this.setState((prevState) => {
            const arr = prevState.date.concat([arr1, arr2]);
            return {
                date: arr
            };
        });
    };

    //  省市县的赋值
    setProvince = str => {
        this.setState({
            province: str,
            urban: '',
            county: ''
        });
    };

    //设置城市
    setCity = str => {
        console.log(str);
        this.setState({
            urban: str,
            county: ''
        });
    };

    //设置市辖区
    setCounty = str => {
        this.setState({
            county: str
        });
    };

    onClose = () => {
        this.setState({
            modal1: false
        });
    };

    openMod = () => {
        this.setState({
            modal1: true
        });
    };

    //设置主营行业类型
    setCategory = (val) => {
        // e.preventDefault();
        const {category} = this.state;
        const result = category.find(item => item.value === val.toString());
        this.setState(() => ({
            cValue: val,
            cate1: result.label,
            cate1Id: result.value
        }));
    };

    //获取主营行业类型
    getCategorys = () => {
        this.fetch(urlCfg.getCategory, {
            data: {
                type: 1
            }
        }).subscribe(res => {
            if (res) {
                if (res.status === 0) {
                    const category = res.data.map(item => ({
                        label: item.cate_name,
                        value: item.id1
                    }));
                    this.setState({
                        category
                    });
                }
            }
        });
    };

    //设置商户状态
    setExp = (value) => {
        console.log(value);
        this.setState({
            isExp: value
        }, () => {
            const {isExp} = this.state;
            if (isExp === 1) {
                this.setState({
                    text: typeOne
                });
            } else if (isExp === 2) {
                this.setState({
                    text: typeTwo
                });
            }
        });
    };

    //设置是否支持自提
    setPickupSelf = (values) => {
        console.log(values);
        this.setState({
            pickUpSelf: values
        });
    };

    //设置开店时间
    setOpenTime = (val, type) => {
        const {date} = this.state;
        const result1 = date[0].find(item => item.value === val[0].toString());
        const result2 = date[1].find(item => item.value === val[1].toString());
        const arr = [result1.value, result2.value];
        this.setState({
            oTValue: val,
            [type]: arr.join('')
        });
    };

    //校验商店名称
    checkShopName = (rule, value, callback) => {
        if (!validator.isEmpty(value, Form.No_StoreName, callback)) return;
        if (!validator.ckeckShopName(value)) {
            validator.showMessage(Form.Error_ShopName, callback);
            return;
        }
        if (value.length < 2 || value.length > 30) {
            showInfo(Form.Error_ShopName);
            return;
        }
        callback();
    };

    //校验是否选择行业
    checkCategory = (rule, value, callback) => {
        const {cate1} = this.state;
        if (!validator.isEmpty(cate1, Form.No_cate1, callback)) return;
        callback();
    };

    //校验是否选择地址
    checkArea = (rule, value, callback) => {
        const {province, urban, county} = this.state;
        const pca = [province, urban, county];
        if (!validator.isEmpty(pca, Form.No_pca, callback)) return;
        callback();
    };

    //判断是否填写详细地址
    checkDetailArea = (rule, value, callback) => {
        if (!validator.isEmpty(value, Form.No_address, callback)) return;
        callback();
    };

    //验证折扣信息
    checkDiscount = (rule, value, callback) => {
        const dis = Number(value);
        // 判断折扣是否为空
        if (!dis && !Number.isNaN(dis)) {
            validator.showMessage(Form.No_disRange, callback);
            return;
        }
        //判断折扣是否为8~9.5
        if (Number.isNaN(dis) || !(dis >= 8 && dis <= 9.5)) {
            validator.showMessage(Form.No_disNum, callback);
            return;
        }
        callback();
    };

    //校验商户状态
    checkIsExp = (rule, value, callback) => {
        if (!validator.isEmpty(value, Form.No_isExp, callback)) return;
        callback();
    };

    //检验是否支持自提
    checkPickUpSelf = (rule, value, callback) => {
        const {pickUpSelf} = this.state;
        if (!validator.isEmpty(pickUpSelf, Form.No_pickUpSelf, callback)) return;
        callback();
    };

    //验证开店时间
    checkOpenTime = (rule, value, callback) => {
        const {openTime, closeTime} = this.state;
        if (!openTime || !closeTime) {
            validator.showMessage(Form.Error_Open_Time, callback);
            return;
        }
        callback();
    };

    //校验客服电话
    checkCshPhone = (rule, value, callback) => {
        const myCshPhone = validator.wipeOut(value);
        if (!validator.isEmpty(myCshPhone, Form.No_cshPhone, callback)) return;
        callback();
    };

    //校验负责人
    checkLinkName = (rule, value, callback) => {
        if (!validator.isEmpty(value, Form.No_linkName, callback)) return;
        if (!validator.checkRange(2, 10, value)) {
            validator.showMessage(Form.No_OpenShopName, callback);
            return;
        }
        callback();
    };

    //父级数据变更
    editStatusChange = () => {
        this.setState({
            editStatus: false
        });
    };

    //校验负责人电话
    checkPhone = (rule, value, callback) => {
        const myPhone = validator.wipeOut(value);
        if (!validator.isEmpty(myPhone, Form.No_Principal_Phone, callback)) return;
        if (!validator.checkPhone(myPhone)) {
            showInfo(Form.Error_Phone);
            return;
        }
        callback();
    };

    //点击下一步，跳转开店人信息
    editModalMain = () => {
        const {phone, isExp, pickUpSelf, linkName, discount, cValue, shopName, category,  text, date,  openTime, closeTime, provinceId, cityId, province, urban, county,  address, cshPhone, oTValue, cTValue, addressStatus} = this.state;
        const {getFieldDecorator} = this.props.form;
        const steps = ['填写店铺信息', '填写开店人信息', '填写工商信息', '绑定银行卡'];
        return (
            <div>
                <AppNavBar title="店铺信息"/>
                <div className={`step-box ${window.isWX ? 'step-box-clear' : ''}`}>
                    {steps.map((item, index) => (
                        <div className="step" key={item}>
                            <span>{index + 1}</span>
                            <span>{item}</span>
                        </div>
                    ))}
                    <Flex className="dotted"><Flex.Item/><Flex.Item/><Flex.Item/></Flex>
                </div>
                <div className="list-content">
                    <div className="margin">
                        <List>
                            {
                                getFieldDecorator('shopName', {
                                    initialValue: shopName,
                                    rules: [
                                        {validator: this.checkShopName}
                                    ],
                                    validateTrigger: 'onSubmit'//校验值的时机
                                })(
                                    <InputItem
                                        clear
                                        placeholder="请输入2-30位的店铺名称"
                                    />
                                )}
                            {
                                getFieldDecorator('category', {
                                    initialValue: cValue,
                                    rules: [
                                        {validator: this.checkCategory}
                                    ],
                                    validateTrigger: 'onSubmit'
                                })(
                                    <Picker
                                        data={category}
                                        cols={1}
                                        onOk={(val) => this.setCategory(val)}
                                    >
                                        <List.Item arrow="horizontal">主营行业</List.Item>
                                    </Picker>
                                )
                            }
                            <List.Item arrow="horizontal" onClick={this.onClick} className="area">
                                <span>区域选择</span>
                                {
                                    getFieldDecorator('area', {
                                        // initialValue: '',
                                        rules: [
                                            {validator: this.checkArea}
                                        ],
                                        validateTrigger: 'onSubmit'
                                    })(
                                        <div className="region-select">
                                            {
                                                addressStatus === '1' && (
                                                    <Region
                                                        onSetProvince={this.setProvince}
                                                        onSetCity={this.setCity}
                                                        onSetCounty={this.setCounty}
                                                        provinceValue={province}
                                                        cityValue={urban}
                                                        countyValue={county}
                                                        provinceId={provinceId}
                                                        cityId={cityId}
                                                    />
                                                )
                                            }
                                            {
                                                addressStatus === '' && (
                                                    <Region
                                                        onSetProvince={this.setProvince}
                                                        onSetCity={this.setCity}
                                                        onSetCounty={this.setCounty}
                                                        add
                                                    />
                                                )
                                            }
                                        </div>
                                    )
                                }
                            </List.Item>
                            {
                                getFieldDecorator('detailArea', {
                                    initialValue: address,
                                    rules: [
                                        {validator: this.checkDetailArea}
                                    ],
                                    validateTrigger: 'onSubmit'
                                })(
                                    <TextareaItem
                                        placeholder="请填写店铺详细地址"
                                        rows={5}
                                        labelNumber={5}
                                        className="detail-address"
                                        // onChange={(val) => this.setDetailAddress(val)}
                                    />
                                )
                            }
                            {
                                getFieldDecorator('pickUpSelf', {
                                    initialValue: pickUpSelf,
                                    rules: [
                                        {validator: this.checkPickUpSelf}
                                    ],
                                    validateTrigger: 'onSubmit'
                                })(
                                    <div className="merchant-state own">
                                        <span className="state-left">是否支持自提</span>
                                        <span className="state-right">
                                            {/*  {datas.map(i => (
                                                <RadioItem
                                                    key={i.value}
                                                    checked={values === i.value}
                                                    onChange={() => this.setPickupSelf(i.value)}
                                                >
                                                    {i.label}
                                                </RadioItem>
                                            ))}*/}
                                            {
                                                datas.map(i => (
                                                    <div onClick={() => this.setPickupSelf(i.value)} className="merchant" key={i.value}>
                                                        <span className={`switch-icon icon ${i.value === pickUpSelf ? 'switch-red' : ''}`}/>
                                                        <span>{i.label}</span>
                                                    </div>
                                                ))
                                            }
                                        </span>
                                    </div>
                                )
                            }
                            <List.Item onClick={this.onClick} className="doBusiness-time">
                                <span>营业时间</span>
                                <div className="select-openTime">
                                    {
                                        getFieldDecorator('openTime', {
                                            initialValue: oTValue,
                                            rules: [
                                                {validator: this.checkOpenTime}
                                            ],
                                            validateTrigger: 'onSubmit'
                                        })(
                                            <Picker
                                                data={date}
                                                title="开店时间"
                                                extra="请选择(可选)"
                                                cascade={false}
                                                onOk={v => this.setOpenTime(v, 'openTime')}
                                            >
                                                <span
                                                    className={this.state.openTime ? 'chose' : 'select'}
                                                >{openTime || '请选择'}
                                                </span>
                                            </Picker>
                                        )
                                    }
                                </div>
                                <span className="curved-line">~</span>
                                <div className="select-closeTime">
                                    {
                                        getFieldDecorator('closeTime', {
                                            initialValue: cTValue,
                                            rules: [
                                                {validator: this.checkOpenTime}
                                            ],
                                            validateTrigger: 'onSubmit'
                                        })(
                                            <Picker
                                                data={date}
                                                title="打烊时间"
                                                extra="请选择(可选)"
                                                cascade={false}
                                                onOk={v => this.setOpenTime(v, 'closeTime')}
                                            >
                                                <span
                                                    className={this.state.closeTime ? 'chose' : 'select'}
                                                >{closeTime || '请选择'}
                                                </span>
                                            </Picker>
                                        )
                                    }
                                </div>
                            </List.Item>
                            {
                                getFieldDecorator('discount', {
                                    initialValue: discount,
                                    rules: [
                                        {validator: this.checkDiscount}
                                    ],
                                    validateTrigger: 'onSubmit'
                                })(
                                    <GeisInputItem
                                        type="float"
                                        itemTitle="收款码折扣"
                                        clear
                                        placeholder="请设置8 ~ 9.5折"
                                        itemStyle={(<span className="nani" onClick={this.openMod}>?</span>)}
                                    />
                                    // <InputItem
                                    //     clear
                                    //     placeholder="请设置8 ~ 9.5折"
                                    // >收款码折扣
                                    //     <span className="nani" onClick={this.openMod}>?</span>
                                    // </InputItem>
                                )
                            }
                            {
                                getFieldDecorator('isExp', {
                                    initialValue: isExp,
                                    rules: [
                                        {validator: this.checkIsExp}
                                    ],
                                    validateTrigger: 'onSubmit'
                                })(
                                    <div className="merchant-state">
                                        <span className="state-left">商户状态</span>
                                        <span className="state-right">
                                            {/* {data.map(i => (
                                                <RadioItem
                                                    key={i.value}
                                                    checked={isExp === i.value}
                                                    onChange={() => this.setExp(i.value)}
                                                >
                                                    {i.label}
                                                </RadioItem>
                                            ))}*/}
                                            {
                                                data.map(i => (
                                                    <div onClick={() => this.setExp(i.value)} className="merchant" key={i.value}>
                                                        <span className={`switch-icon icon ${i.value === isExp ? 'switch-red' : ''}`}/>
                                                        <span>{i.label}</span>
                                                    </div>
                                                ))
                                            }
                                        </span>
                                    </div>
                                )
                            }
                            <div className="show-info">
                                {text}
                            </div>
                        </List>
                    </div>
                    <List>
                        {
                            getFieldDecorator('cshPhone', {
                                initialValue: cshPhone,
                                rules: [
                                    {validator: this.checkCshPhone}
                                ],
                                validateTrigger: 'onSubmit'
                            })(
                                <InputItem
                                    clear
                                    maxLength={14}
                                    placeholder="请输入客服电话"
                                    type="phone"
                                >客服电话
                                </InputItem>
                            )
                        }
                        {
                            getFieldDecorator('linkName', {
                                initialValue: linkName,
                                rules: [
                                    {validator: this.checkLinkName}
                                ],
                                validateTrigger: 'onSubmit'
                            })(
                                <InputItem
                                    clear
                                    maxLength={10}
                                    placeholder="请输入开店人姓名"
                                >开店人姓名
                                </InputItem>
                            )
                        }
                        {
                            getFieldDecorator('phone', {
                                initialValue: phone,
                                rules: [
                                    {validator: this.checkPhone}
                                ],
                                validateTrigger: 'onSubmit'
                            })(
                                <InputItem
                                    clear
                                    placeholder="请输入开店人手机号"
                                    type="phone"
                                >开店人手机号
                                </InputItem>
                            )
                        }
                    </List>
                </div>
                <div className="button">
                    {/*<div className="large-button general">先保存，下次填</div>*/}
                    <div className="large-button important" onClick={() => this.postInformation()}>填好了，下一步
                    </div>
                </div>
                <Modal
                    className="modal-text"
                    visible={this.state.modal1}
                    transparent
                    maskClosable={false}
                    footer={[{
                        text: '知道了',
                        onPress: () => {
                            this.onClose();
                        }
                    }]}
                >
                    <div>
                        收款码折扣指商家进行二维码收款时的实际到账比例及相应的消费者的C米比例。如商家设置9.5折，消费者扫二维码付款10元，将累计5C米，收款商家实际到账9.5元。
                    </div>
                </Modal>
            </div>

        );
    };

    goBack = () => {
        this.setState({
            editModal: ''
        }, () => {
            this.getUpdateAudit();
        });
    };

    getChildren = (res) => {
        console.log('执行了');
        console.log(res);
        this.setState({
            editModal: res
        });
    };

    render() {
        const {editModal} = this.state;
        return (
            <div data-component="individual" data-role="page" className="individual">
                {
                    !editModal && this.editModalMain()
                }
                {
                    editModal === 'two' &&  <IndividualTwo goBack={this.goBack}/>
                }
                {
                    editModal === 'three' &&  <IndividualThree goBack={this.goBack}/>
                }
                {
                    editModal === 'four' &&  <IndividualFour goBack={this.goBack} that={this}/>
                }
            </div>
        );
    }
}
export default createForm()(Individual);
