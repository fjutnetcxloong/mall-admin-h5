/**我要开店---个体页面 */
import React from 'react';
import {List, InputItem, ImagePicker, WingBlank, Flex} from 'antd-mobile';
import {createForm} from 'rc-form';
import AppNavBar from '../../../../../common/navbar/NavBar';
import IndividualThree from './IndividualThree';
import {showFail} from '../../../../../../utils/mixin';
import './IndividualTwo.less';

const {dealImage, showInfo, validator, native} = Utils;
const {MESSAGE: {Form, Feedback}} = Constants;
const {urlCfg} = Configs;


const data = [
    {
        id: 1,
        info: '填写店铺信息'
    },
    {
        id: 2,
        info: '填写开店人信息'
    },
    {
        id: 3,
        info: '填写工商信息'
    },
    {
        id: 4,
        info: '绑定银行卡'}
];
class IndividualTwo extends BaseComponent {
    state ={
        file: [],  //身份证正面
        file3: [], //身份证仿反面
        file2: [],  //手持身份证
        multiple: false,
        userName: '', //开店人姓名
        idCard: '', //身份证
        validDate: '', //身份证有效期
        flagArr: [false, false, false] //图片上传成功状态
    };

    componentDidMount() {
        this.getUpdateAudit();
    }

    //设置开店人姓名
    setUserName = (val) => {
        this.setState({
            userName: val
        });
    };

    //获取审核失败返回的数据
    getUpdateAudit = () => {
        this.fetch(urlCfg.updateAudit, {data: {type: 2}}).subscribe(res => {
            if (res.status === 0 && res.data.length !== 0) {
                const {flagArr} = this.state;
                const arr = flagArr;
                if (res.data.pics[0]) {
                    const file = [];
                    arr[0] = true;
                    file.push({url: res.data.pics[0]});
                    this.setState({
                        file,
                        flagArr: arr
                    });
                }
                if (res.data.pics[1]) {
                    const file3 = [];
                    arr[1] = true;
                    file3.push({url: res.data.pics[1]});
                    this.setState({
                        file3,
                        flagArr: arr
                    });
                }
                if (res.data.pics[4]) {
                    const file2 = [];
                    arr[2] = true;
                    file2.push({url: res.data.pics[4]});
                    this.setState({
                        file2,
                        flagArr: arr
                    });
                }
                this.setState({
                    userName: res.data.mastar_name,
                    idCard: res.data.idcard,
                    validDate: res.data.idcard_exp
                });
            }
        });
    };

    //获取图片信息
    onChange = (files, type) => {
        console.log('object');
        if (type === 'forward') {
            this.setState(() => ({
                file: files
            }), () => {
                this.transImg(files[0], 0, 0);
            });
        }
        if (type === 'hand') {
            this.setState(() => ({
                file2: files
            }), () => {
                this.transImg(files[0], 4, 2);
            });
        } else  if (type === 'back') {
            this.setState(() => ({
                file3: files
            }), () => {
                this.transImg(files[0], 1, 1);
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
            // FIXME: 为什么要用setTimeout， 用了后有没有清除
            const timerId = setTimeout(() => {
                if (imgS && imgBD) {
                    this.fetch(urlCfg.postIDcard, {data: {
                        ix: ix,
                        file: encodeURIComponent(imgBD),
                        filex: encodeURIComponent(imgS)
                    }}).subscribe((res) => {
                        if (res.status === 0) {
                            this.setState((prevState) => {
                                const arr = prevState.flagArr;
                                arr[index] = true;
                                return {
                                    flagArr: arr
                                };
                            });
                            if (res.data.pic_info && res.data.pic_info.status === 0) {
                                if (res.data.name && res.data.id_num) {
                                    this.setState({
                                        userName: res.data.name,
                                        idCard: res.data.id_num
                                    });
                                } else if (res.data.exp) {
                                    this.setState({
                                        validDate: res.data.exp
                                    });
                                }
                                showInfo(Form.Success_Lic_Info);
                            } else if (res.data.pic_info && res.data.pic_info.status === 1) {
                                if (ix === 0) {
                                    this.setState({
                                        file: [],
                                        userName: '',
                                        idCard: ''
                                    });
                                } else if (ix === 1) {
                                    this.setState({
                                        file2: [],
                                        validDate: ''
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

    //提交用户信息
    gotoNext = () => {
        // this.setState({editModal: 'three'});
        const {form: {validateFields}} = this.props;
        validateFields({first: true, force: true}, (error, val) => {
            if (!error) {
                this.fetch(urlCfg.peopleInformati0n, {
                    data: {
                        mastar_name: val.userName,
                        idcard: val.idCard,
                        idcard_exp: val.validDate
                    }}).subscribe(res => {
                    if (res.status === 0) {
                        showInfo(Feedback.Handle_Success, 1);
                        this.setState({editModal: 'three'});
                    } else {
                        console.log('请填写正确信息');
                        showInfo(Form.No_correctInfo, 1);
                    }
                });
                return;
            }
            console.log('错误', error, val);
        });
    };

    //检验身份证正面
    checkForward = (rule, value, callback) => {
        const {flagArr} = this.state;
        if (!validator.isEmpty(flagArr[0], Form.No_cardForward, callback)) return;
        callback();
    };

    //检验身份证反面
    checkBack = (rule, value, callback) => {
        const {flagArr} = this.state;
        if (!validator.isEmpty(flagArr[1], Form.No_cardBack, callback)) return;
        callback();
    };

    //j检验手持身份证
    checkHand = (rule, value, callback) => {
        const {flagArr} = this.state;
        if (!validator.isEmpty(flagArr[2], Form.No_cardHand, callback)) return;
        callback();
    };

    //检验用户名
    checkUserName = (rule, value, callback) => {
        if (!validator.isEmpty(value, Form.No_cardHolderName, callback)) {
            return;
        }
        if (!validator.checkRange(2, 10, value)) {
            validator.showMessage(Form.Error_UserName, callback);
            return;
        }
        callback();
    };

    //效验身份证
    checkIdcard = (rule, value, callback) => {
        if (!validator.ID(value)) {
            validator.showMessage(Form.Error_ID, callback);
            return;
        }
        callback();
    };

    //检验身份证有效期
    checkValidDate = (rule, value, callback) => {
        if (!validator.isEmpty(value, Form.No_validDate, callback)) {
            return;
        }
        callback();
    }

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
                if (res.data) {
                    if (res.data.hasOwnProperty('name')) {
                        this.setState({
                            userName: res.data.name,
                            idCard: res.data.id_num
                        });
                    } else if (res.data.hasOwnProperty('exp')) {
                        this.setState({
                            validDate: res.data.exp
                        });
                    }
                }
                showInfo(Feedback.upload_Success);
            } else {
                showInfo(Feedback.upload_failed);
            }
        });
    }

    //点击添加图片
    addPictrue = (type) => {
        const arrInfo = [];
        if (process.env.NATIVE) {
            if (type === 'forward') {
                native('picCallback', {num: 1}).then(res => {
                    res.data.img.forEach(item => {
                        arrInfo.push({imgB: item[0], imgS: item[1], id: new Date()});
                    });
                    this.setState({
                        file: arrInfo
                    });
                    this.pasGass(arrInfo, 0, 0);
                });
            } else if (type === 'hand') {
                native('picCallback', {num: 1}).then(res => {
                    res.data.img.forEach(item => {
                        arrInfo.push({imgB: item[0], imgS: item[1], id: new Date()});
                    });
                    this.setState({
                        file2: arrInfo
                    });
                    this.pasGass(arrInfo, 4, 2);
                });
            } else if (type === 'back') {
                native('picCallback', {num: 1}).then(res => {
                    res.data.img.forEach(item => {
                        arrInfo.push({imgB: item[0], imgS: item[1], id: new Date()});
                    });
                    this.setState({
                        file3: arrInfo
                    });
                    this.pasGass(arrInfo, 1, 1);
                });
            }
        }
    };

    //点击删除图片
    deleteImg = (type, id) => {
        if (type === 'forward') {
            this.setState({
                file: []
            });
        } else if (type === 'back') {
            this.setState({
                file3: []
            });
        } else {
            this.setState({
                file2: []
            });
        }
    };

    //设置身份证有效期
    setValidDate = (date) => {
        console.log(date);
    };

    editModalMain = () => {
        const {form: {getFieldDecorator}} = this.props;
        const {file, file2, file3, validDate, idCard, userName} = this.state;
        return (
            <div>
                <AppNavBar goBackModal={this.props.goBack} title="开店人信息"/>
                <div className={`step-box ${window.isWX ? 'step-box-clear' : ''}`}>
                    {
                        data.map((item) => (
                            <div className={`step ${item.id === 4 ? 'range' : ''}`}>
                                <span>{item.id}</span>
                                <span>{item.info}</span>
                            </div>
                        ))
                    }
                    {
                        data.map((item) => (
                            <Flex className="dotted">
                                <Flex.Item/>
                                <Flex.Item/>
                                <Flex.Item/>
                            </Flex>
                        ))
                    }
                </div>
                <div className="list-content">
                    <div className="ID-photo">
                        <div className="start">开店人证件照</div>
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
                                                                {/* <span className="delete-icon" onClick={() => this.deleteImg('forward', item.id)}>×</span> */}
                                                                <img onClick={() => this.addPictrue('forward')} src={item.imgS || item.url}/>
                                                            </li>
                                                        ))
                                                    }
                                                    {
                                                        file.length === 0 && (
                                                            <li className="imgAdd-button" onClick={() => this.addPictrue('forward')}>
                                                                <span className="imgAdd-icon">+</span>
                                                            </li>
                                                        )
                                                    }
                                                </ul>
                                            </div>
                                        ) : getFieldDecorator('forward', {
                                            // initialValue: '',
                                            rules: [
                                                {validator: this.checkForward}
                                            ],
                                            validateTrigger: 'submit'//校验值的时机
                                        })(
                                            <ImagePicker
                                                files={file}
                                                onChange={(files) => { this.onChange(files, 'forward') }}
                                                selectable={file.length < 1}
                                                length={1}
                                            />
                                        )
                                    }
                                </WingBlank>
                                <span>上传身份证正面</span>
                            </div>
                        </div>
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
                                                                {/* <span className="delete-icon" onClick={() => this.deleteImg('back', item.id)}>×</span> */}
                                                                <img onClick={() => this.addPictrue('back')} src={item.imgS || item.url}/>
                                                            </li>
                                                        ))
                                                    }
                                                    {
                                                        file3.length === 0 && (
                                                            <li className="imgAdd-button" onClick={() => this.addPictrue('back')}>
                                                                <span className="imgAdd-icon">+</span>
                                                            </li>
                                                        )
                                                    }
                                                </ul>
                                            </div>
                                        ) : getFieldDecorator('back', {
                                            // initialValue: '',
                                            rules: [
                                                {validator: this.checkBack}
                                            ],
                                            validateTrigger: 'submit'//校验值的时机
                                        })(
                                            <ImagePicker
                                                files={file3}
                                                onChange={(files) => { this.onChange(files, 'back') }}
                                                selectable={file3.length < 1}
                                                length={1}
                                            />
                                        )
                                    }
                                </WingBlank>
                                <span>上传身份证反面</span>
                            </div>
                        </div>
                    </div>
                    <div>
                        <div className="ID-photo">
                            <div className="start">开店人手持身份证照</div>
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
                                                                    {/* <span className="delete-icon" onClick={() => this.deleteImg('handle', item.id)}>×</span> */}
                                                                    <img onClick={() => this.addPictrue('hand')} src={item.imgS || item.url}/>
                                                                </li>
                                                            ))
                                                        }
                                                        {
                                                            file2.length === 0 && (
                                                                <li className="imgAdd-button" onClick={() => this.addPictrue('hand')}>
                                                                    <span className="imgAdd-icon">+</span>
                                                                </li>
                                                            )
                                                        }
                                                    </ul>
                                                </div>
                                            ) : getFieldDecorator('hand', {
                                                // initialValue: '',
                                                rules: [
                                                    {validator: this.checkHand}
                                                ],
                                                validateTrigger: 'submit'//校验值的时机
                                            })(
                                                <ImagePicker
                                                    files={file2}
                                                    onChange={(files) => { this.onChange(files, 'hand') }}
                                                    selectable={file2.length < 1}
                                                    length={1}
                                                />
                                            )
                                        }
                                    </WingBlank>
                                    <span>上传手持身份证照</span>
                                </div>
                            </div>
                        </div>
                        <div>
                            <div className="margin">
                                <List>
                                    {
                                        getFieldDecorator('userName', {
                                            initialValue: userName,
                                            rules: [
                                                {validator: this.checkUserName}
                                            ],
                                            validateTrigger: 'submit'//校验值的时机
                                        })(
                                            <InputItem
                                                clear
                                                disabled
                                                placeholder="请输入真实姓名"
                                                // onChange={(val) => this.setUserName(val)}
                                            >姓名
                                            </InputItem>
                                        )
                                    }
                                    {
                                        getFieldDecorator('idCard', {
                                            initialValue: idCard,
                                            rules: [
                                                {validator: this.checkIdcard}
                                            ],
                                            validateTrigger: 'submit'//校验值的时机
                                        })(
                                            <InputItem
                                                maxLength={18}
                                                clear
                                                disabled
                                                placeholder="请输入身份证号"
                                                // onChange={(val) => this.setIdCard(val)}
                                            >身份证号
                                            </InputItem>
                                        )
                                    }
                                    {
                                        getFieldDecorator('validDate', {
                                            initialValue: validDate,
                                            rules: [
                                                {validator: this.checkValidDate}
                                            ],
                                            validateTrigger: 'submit'//校验值的时机
                                        })(
                                            <InputItem
                                                maxLength={18}
                                                clear
                                                disabled
                                                placeholder="身份证有效期"
                                                // onChange={(val) => this.setIdCard(val)}
                                            >身份证有效期
                                            </InputItem>
                                        )
                                    }
                                </List>
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
            // const that = this.props;
            return (
                <div data-component="individual-two" data-role="page" className="individual-two">

                    {
                        !editModal && this.editModalMain()
                    }
                    {
                        editModal && <IndividualThree goBack={this.goBack}/>
                    }
                </div>
            );
        }
}
export default createForm()(IndividualTwo);
