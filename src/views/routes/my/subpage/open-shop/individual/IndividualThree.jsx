/**我要开店---个体页面 */


import React from 'react';
import './IndividualThree.less';
import {List, InputItem, ImagePicker, WingBlank, Flex} from 'antd-mobile';
import {createForm} from 'rc-form';
import AppNavBar from '../../../../../common/navbar/NavBar';
import {showFail} from '../../../../../../utils/mixin';
import IndividualFour from './IndividualFour';

const {urlCfg} = Configs;
const {dealImage, showInfo, native, validator} = Utils;
const {MESSAGE: {Form, Feedback}} = Constants;
// const RadioItem = Radio.RadioItem;
// const data = [
//     {value: 1, label: '是'},
//     {value: 0, label: '否'}
// ];
class IndividualThree extends BaseComponent {
    state ={
        file: [], //营业执照
        file2: [], //商户门头照
        file3: [],   //商户店内照
        multiple: false,
        threeInOne: '',  //是否三证合一
        shopLic: '',  //营业执照(统一信用代码)
        shopLicExp: '', //营业执照有效期
        value: '',
        flagArr: [false, false, false] //图片上传成功状态
    };

    componentDidMount() {
        this.getUpdateAudit();
    }

    //获取审核失败返回的数据
    getUpdateAudit= () => {
        this.fetch(urlCfg.updateAudit, {data: {type: 3}}).subscribe(res => {
            if (res.status === 0 && res.data.length !== 0) {
                const {flagArr} = this.state;
                const arr = flagArr;
                if (res.data.pics[2]) {
                    const file = [];
                    arr[0] = true;
                    file.push({url: res.data.pics[2]});
                    this.setState({
                        file,
                        flagArr: arr
                    });
                }
                if (res.data.pics[3]) {
                    const file2 = [];
                    arr[1] = true;
                    file2.push({url: res.data.pics[3]});
                    this.setState({
                        file2,
                        flagArr: arr
                    });
                }
                if (res.data.pics[5]) {
                    const file3 = [];
                    arr[2] = true;
                    file3.push({url: res.data.pics[5]});
                    this.setState({
                        file3,
                        flagArr: arr
                    });
                }
                this.setState({
                    shopLic: res.data.shop_lic,
                    shopLicExp: res.data.shop_lic_exp
                });
            }
        });
    };

    //获取图片信息
    onChange = (files, type) => {
        if (type === 'license') {
            this.setState(() => ({
                file: files
            }), () => {
                this.transImg(files[0], 2, 0);
            });
        }
        if (type === 'doorTop') {
            this.setState(() => ({
                file2: files
            }), () => {
                this.transImg(files[0], 3, 1);
            });
        } else if (type === 'shopInside') {
            this.setState(() => ({
                file3: files
            }), () => {
                this.transImg(files[0], 5, 2);
            });
        }
    };

    //图片转换和上传
    transImg = (file, ix, index) => {
        if (file) {
            let imgBD = '';
            let imgS = '';
            dealImage(file, 100, imgSX => {
                imgS = imgSX;
            });
            dealImage(file, 800, imgD => {
                imgBD = imgD;
            });
            const timerId = setTimeout(() => {
                if (imgS && imgBD) {
                    this.fetch(urlCfg.postIDcard, {
                        data: {
                            ix: ix,
                            file: encodeURIComponent(imgBD),
                            filex: encodeURIComponent(imgS)
                        }
                    }).subscribe((res) => {
                        if (res.status === 0) {
                            this.setState((prevState) => {
                                const arr = prevState.flagArr;
                                arr[index] = true;
                                return {
                                    flagArr: arr
                                };
                            });
                            if (res.data.pic_info && res.data.pic_info.status === 0) {
                                if (res.data.reg_num && res.data.exp) {
                                    this.setState({
                                        shopLic: res.data.reg_num,
                                        shopLicExp: res.data.exp
                                    });
                                }
                                showInfo(Form.Success_Lic_Info);
                            } else if (res.data.pic_info && res.data.pic_info.status === 1) {
                                if (ix === 2) {
                                    this.setState({
                                        file: [],
                                        shopLic: '',
                                        shopLicExp: ''
                                    });
                                }
                                showFail(Form.Fail_Lic_Info);
                            }
                            clearTimeout(timerId);
                        } else {
                            showInfo(Feedback.upload_failed);
                        }
                    });
                }
            }, 100);
        }
    };

    //原生图片上传的时候的请求
    pasGass = (arrInfo, ix, index) => {
        this.fetch(urlCfg.postIDcard, {data: {
            ix,
            file: encodeURIComponent(arrInfo[0].imgB),
            filex: encodeURIComponent(arrInfo[0].imgS)
        }}).subscribe(res => {
            if (res.status === 0) {
                this.setState((prevState) => {
                    const arr = prevState.flagArr;
                    arr[index] = true;
                    return {
                        flagArr: arr
                    };
                });
                if (res.data.pic_info && res.data.pic_info.status === 0) {
                    if (res.data.reg_num && res.data.exp) {
                        this.setState({
                            shopLic: res.data.reg_num,
                            shopLicExp: res.data.exp
                        });
                    }
                    showInfo(Form.Success_Lic_Info);
                } else if (res.data.pic_info && res.data.pic_info.status === 1) {
                    if (ix === 2) {
                        this.setState({
                            file: [],
                            shopLic: '',
                            shopLicExp: ''
                        });
                    }
                    showFail(Form.Fail_Lic_Info);
                }
            }
        });
    }

    //原生点击添加图片
    addPictrue = (type) => {
        const arrInfo = [];
        if (process.env.NATIVE) {
            if (type === 'license') {
                native('picCallback', {num: 1}).then(res => {
                    res.data.img.forEach(item => {
                        arrInfo.push({imgB: item[0], imgS: item[1], id: new Date()});
                    });
                    this.setState({
                        file: arrInfo
                    });
                    this.pasGass(arrInfo, 2, 0);
                });
            } else if (type === 'doorTop') {
                native('picCallback', {num: 1}).then(res => {
                    res.data.img.forEach(item => {
                        arrInfo.push({imgB: item[0], imgS: item[1], id: new Date()});
                    });
                    this.setState({
                        file2: arrInfo
                    });
                    this.pasGass(arrInfo, 3, 1);
                });
            } else {
                native('picCallback', {num: 1}).then(res => {
                    res.data.img.forEach(item => {
                        arrInfo.push({imgB: item[0], imgS: item[1], id: new Date()});
                    });
                    this.setState({
                        file3: arrInfo
                    });
                    this.pasGass(arrInfo, 5, 2);
                });
            }
        }
    };

    //原生点击删除图片
    deleteImg = (type, id) => {
        if (type === 'license') {
            this.setState({
                file: []
            });
        } else if (type === 'doorTop') {
            this.setState({
                file2: []
            });
        } else {
            this.setState({
                file3: []
            });
        }
    };

    //提交用户信息
    gotoNext = () => {
        // this.setState({editModal: 'four'});
        const {form: {validateFields}} = this.props;
        const {threeInOne} = this.state;
        validateFields({first: true, force: true}, (error, val) => {
            if (!error) {
                this.fetch(urlCfg.entityBusinessInfo, {
                    data: {
                        shop_lic: val.shopLic,
                        three_in_one: threeInOne,
                        shop_lic_exp: val.shopLicExp
                    }}).subscribe(res => {
                    if (res.status === 0) {
                        showInfo(Feedback.Handle_Success, 1);
                        this.setState({editModal: 'four'});
                    } else {
                        showInfo(Form.No_correctInfo);
                    }
                });
                return;
            }
            console.log('错误', error, val);
        });
    };

    //检验营业执照
    checkLicense = (rule, value, callback) => {
        const {flagArr} = this.state;
        if (!validator.isEmpty(flagArr[0], Form.No_businessLicense, callback)) return;
        callback();
    };

    //检验三证合一
    checkThreeInOne = (rule, value, callback) => {
        if (!validator.isEmpty(value, Form.No_threeInOne, callback)) {
            return;
        }
        callback();
    };

    //检验统一信用代码
    checkShopLic = (rule, value, callback) => {
        if (!validator.isEmpty(value, Form.No_shopLic, callback)) {
            return;
        }
        callback();
    };

    //检验营业执照有效期
    checkShopLicExp = (rule, value, callback) => {
        if (!validator.isEmpty(value, Form.No_shopLicExp, callback)) {
            return;
        }
        callback();
    };

    //检验门头照
    checkDoorTop = (rule, value, callback) => {
        const {flagArr} = this.state;
        if (!validator.isEmpty(flagArr[1], Form.No_shopDoorTop, callback)) return;
        callback();
    };

    //检验店内照
    checkShopInside = (rule, value, callback) => {
        const {flagArr} = this.state;
        if (!validator.isEmpty(flagArr[2], Form.No_shopPhoto, callback)) return;
        callback();
    };

    editModalMain = () => {
        const {form: {getFieldDecorator}} = this.props;
        const steps = ['填写店铺信息', '填写开店人信息', '填写工商信息', '绑定银行卡'];
        const {file, file2, file3, shopLicExp, shopLic} = this.state;
        return (
            <div>
                <AppNavBar goBackModal={this.props.goBack} title="个体工商户信息"/>
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
                    <div>
                        <div>
                            <div className="business-photo">
                                <div className="start">营业执照</div>
                                <div className="upload-box">
                                    <div>
                                        <WingBlank>
                                            {
                                                process.env.NATIVE ? (
                                                    <div className="picture-area">
                                                        <ul>
                                                            {
                                                                file && file.map(item => (
                                                                    <li id={item.id}>
                                                                        {/* <span className="delete-icon" onClick={() => this.deleteImg('license', item.id)}>×</span> */}
                                                                        <img onClick={() => this.addPictrue('license')} src={item.imgS || item.url}/>
                                                                    </li>
                                                                ))
                                                            }
                                                            {
                                                                file.length === 0 && (
                                                                    <li className="imgAdd-button" onClick={() => this.addPictrue('license')}>
                                                                        <span className="imgAdd-icon">+</span>
                                                                    </li>
                                                                )
                                                            }
                                                        </ul>
                                                    </div>
                                                ) : getFieldDecorator('license', {
                                                    // initialValue: '',
                                                    rules: [
                                                        {validator: this.checkLicense}
                                                    ],
                                                    validateTrigger: 'submit'//校验值的时机
                                                })(
                                                    <ImagePicker
                                                        files={file}
                                                        onChange={(files) => { this.onChange(files, 'license') }}
                                                        selectable={file.length < 1}
                                                        length={1}
                                                    />
                                                )
                                            }
                                        </WingBlank>
                                        <span>上传营业执照</span>
                                    </div>
                                </div>
                            </div>
                            <div className="margin">
                                <List>
                                    {/* <div className="merchant-state">
                                        <span className="state-left">是否三证合一</span>
                                        {
                                            getFieldDecorator('threeInOne', {
                                                initialValue: value,
                                                rules: [
                                                    {validator: this.checkThreeInOne}
                                                ],
                                                validateTrigger: 'submit'//校验值的时机
                                            })(
                                                <span className="state-right">
                                                    {data.map(i => (
                                                        <RadioItem key={i.value} checked={value === i.value} onChange={() => this.setThreeInOne(i.value)}>
                                                            {i.label}
                                                        </RadioItem>
                                                    ))}
                                                </span>
                                            )
                                        }
                                    </div> */}
                                    {
                                        getFieldDecorator('shopLic', {
                                            initialValue: shopLic,
                                            rules: [
                                                {validator: this.checkShopLic}
                                            ],
                                            validateTrigger: 'submit'//校验值的时机
                                        })(
                                            <InputItem
                                                clear
                                                disabled
                                                placeholder="统一社会信用代码"
                                                // onChange={(val) => this.setShopLic(val)}
                                            >统一社会信用代码
                                            </InputItem>
                                        )
                                    }
                                    {
                                        getFieldDecorator('shopLicExp', {
                                            initialValue: shopLicExp,
                                            rules: [
                                                {validator: this.checkShopLicExp}
                                            ],
                                            validateTrigger: 'submit'//校验值的时机
                                        })(
                                            <InputItem
                                                clear
                                                disabled
                                                placeholder="营业执照有效期"
                                            >营业执照有效期
                                            </InputItem>
                                        )
                                    }
                                </List>
                            </div>
                        </div>
                        <div className="ID-photo">
                            <div className="start">商户门头照</div>
                            <div className="upload-box">
                                <div>
                                    <WingBlank>
                                        {
                                            process.env.NATIVE ? (
                                                <div className="picture-area">
                                                    <ul>
                                                        {
                                                            file2 && file2.map(item => (
                                                                <li id={item.id}>
                                                                    {/* <span className="delete-icon" onClick={() => this.deleteImg('doorTop', item.id)}>×</span> */}
                                                                    <img onClick={() => this.addPictrue('doorTop')} src={item.imgS || item.url}/>
                                                                </li>
                                                            ))
                                                        }
                                                        {
                                                            file2.length === 0 && (
                                                                <li className="imgAdd-button" onClick={() => this.addPictrue('doorTop')}>
                                                                    <span className="imgAdd-icon">+</span>
                                                                </li>
                                                            )
                                                        }
                                                    </ul>
                                                </div>
                                            ) : getFieldDecorator('doorTop', {
                                                rules: [
                                                    {validator: this.checkDoorTop}
                                                ],
                                                validateTrigger: 'submit'//校验值的时机
                                            })(
                                                <ImagePicker
                                                    files={file2}
                                                    onChange={(files) => { this.onChange(files, 'doorTop') }}
                                                    selectable={file2.length < 1}
                                                    length={1}
                                                />
                                            )
                                        }
                                    </WingBlank>
                                    <span>上传门头照片</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="ID-photo">
                        <div className="start">商户店内照</div>
                        <div className="upload-box">
                            <div>
                                <WingBlank>
                                    {
                                        process.env.NATIVE ? (
                                            <div className="picture-area">
                                                <ul>
                                                    {
                                                        file3 && file3.map(item => (
                                                            <li id={item.id}>
                                                                {/* <span className="delete-icon" onClick={() => this.deleteImg('shopInside', item.id)}>×</span> */}
                                                                <img onClick={() => this.addPictrue('shopInside')} src={item.imgS || item.url}/>
                                                            </li>
                                                        ))
                                                    }
                                                    {
                                                        file3.length === 0 && (
                                                            <li className="imgAdd-button" onClick={() => this.addPictrue('shopInside')}>
                                                                <span className="imgAdd-icon">+</span>
                                                            </li>
                                                        )
                                                    }
                                                </ul>
                                            </div>
                                        ) : getFieldDecorator('shopInside', {
                                            rules: [
                                                {validator: this.checkShopInside}
                                            ],
                                            validateTrigger: 'submit'//校验值的时机
                                        })(
                                            <ImagePicker
                                                files={file3}
                                                onChange={(files) => { this.onChange(files, 'shopInside') }}
                                                selectable={file3.length < 1}
                                                length={1}
                                            />
                                        )
                                    }
                                </WingBlank>
                                <span>上传店内照片</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="button">
                    <div className="large-button important" onClick={() => this.gotoNext()}>填好了，下一步</div>
                </div>
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

    render() {
        const {editModal} = this.state;
        return (
            <div data-component="individual-three" data-role="page" className="individual-three">
                {
                    !editModal && this.editModalMain()
                }
                {
                    editModal && <IndividualFour goBack={this.goBack}/>
                }
            </div>
        );
    }
}
export default  createForm()(IndividualThree);
