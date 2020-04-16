/**我要开店---个体页面 */
import React from 'react';
import './PersonalThree.less';
import {ImagePicker, WingBlank, Picker, List, Flex} from 'antd-mobile';
import {createForm} from 'rc-form';
import AppNavBar from '../../../../../common/navbar/NavBar';

const {MESSAGE: {Form}} = Constants;
const {urlCfg} = Configs;
const {dealImage, showInfo, validator, native} = Utils;
const seasons = [
    {
        label: '租赁协议',
        value: '8'
    },
    {
        label: '产权证明',
        value: '9'
    },
    {
        label: '执业资质证照',
        value: '10'
    },
    {
        label: '第三方证明',
        value: '11'
    },
    {
        label: '其他证明材料',
        value: '12'
    }
];
class PersonalThree extends BaseComponent {
    state = {
        files: [],
        multiple: false,
        file1: [],
        file2: [],
        file3: [],
        file4: [],
        sValue: [], //商家证明照片类型
        flagArr: [false, false, false, false] //图片上传成功状态
        // sValue: ['2013']
    };

    componentDidMount = () => {
        console.log('第三步');
        this.updateAudit();
    };

    //获取返回的数据
    updateAudit = () => {
        this.fetch(urlCfg.updateAudit, {data: {
            type: 3
        }}).subscribe(res => {
            if (res.status === 0 && res.data.length !== 0) {
                const {flagArr} = this.state;
                const arr = flagArr;
                const arr2 = [];
                let index = '';
                if (res.prove_type) {
                    index = res.prove_type;
                    arr2.push(index.toString());
                }
                this.setState({
                    sValue: arr2
                });
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
                if (res.data.pics[7]) {
                    const file4 = [];
                    arr[3] = true;
                    file4.push({url: res.data.pics[7]});
                    this.setState({
                        file4,
                        flagArr: arr
                    });
                }
                if (res.data.pics[index]) {
                    const file1 = [];
                    arr[0] = true;
                    file1.push({url: res.data.pics[index]});
                    this.setState({
                        file1,
                        flagArr: arr
                    });
                }
            }
        });
    };

    uploadPictures = () => {
        const {form: {validateFields}} = this.props;
        const {that} = this.props;
        // that.getChildren('four');
        validateFields({first: true, force: true}, (error, val) => {
            if (!error) {
                this.fetch(urlCfg.shopapplyBusi).subscribe(res => {
                    that.getChildren('four');
                });
            } else {
                console.log('错误', error, val);
            }
        });
    };

    //检验照片一
    checkProve = (rule, value, callback) => {
        const {flagArr} = this.state;
        if (!validator.isEmpty(flagArr[0], Form.No_Merchant_Prove, callback)) return;
        callback();
    };

    //检验照片二
    checkShop = (rule, value, callback) => {
        const {flagArr} = this.state;
        if (!validator.isEmpty(flagArr[1], Form.No_Booth, callback)) return;
        callback();
    };

    //检验照片三
    checkEnvironment = (rule, value, callback) => {
        const {flagArr} = this.state;
        if (!validator.isEmpty(flagArr[2], Form.No_Booth_Environment, callback)) return;
        callback();
    };

    //检验照片四
    checkProduct = (rule, value, callback) => {
        const {flagArr} = this.state;
        if (!validator.isEmpty(flagArr[3], Form.No_Sell_Commodity, callback)) return;
        callback();
    };

    onChange = (files, type) => {
        if (type === 'prove') {
            const {sValue} = this.state;
            const result = seasons.some(item => item.value === sValue[0]);
            if (!result) {
                showInfo(Form.No_Prove_type);
                return;
            }
            this.setState({
                file1: files
            }, () => {
                const {file1} = this.state;
                this.transImg(file1, Number(sValue[0]), 0);
            });
        } else if (type === 'shop') {
            this.setState({
                file2: files
            }, () => {
                const {file2} = this.state;
                this.transImg(file2, 3, 1);
            });
        } else if (type === 'environment') {
            this.setState({
                file3: files
            }, () => {
                const {file3} = this.state;
                this.transImg(file3, 5, 2);
            });
        } else {
            this.setState({
                file4: files
            }, () => {
                const {file4} = this.state;
                this.transImg(file4, 7, 3);
            });
        }
    };

    //图片转换
    transImg = (file, ix, index) => {
        const {flagArr} = this.state;
        const arr = flagArr;
        if (file.length === 0) {
            arr[index] = false;
            this.setState({
                flagArr: arr
            });
        }
        if (file && file.length > 0) {
            const img = file[0];
            const wxUrls = [];
            let imgBD = '';
            let imgS = '';
            dealImage(img, 100, imgSX => {
                imgS = imgSX;
            });
            dealImage(img, 800, imgD => {
                imgBD = imgD;
            });
            setTimeout(() => {
                wxUrls.push({
                    imgB: encodeURIComponent(imgBD),
                    imgS: encodeURIComponent(imgS)
                });
                this.setState({
                    wxUrl: wxUrls
                }, () => {
                    const {wxUrl} = this.state;
                    this.fetch(urlCfg.postIDcard, {
                        data: {
                            ix: ix,
                            file: wxUrl[0].imgB,
                            filex: wxUrl[0].imgS
                        }
                    }).subscribe(res => {
                        if (res && res.status === 0) {
                            arr[index] = true;
                            if (res.data.name && res.data.id_num) {
                                this.setState({
                                    flagArr: arr,
                                    userName: res.data.name,
                                    ID: res.data.id_num
                                });
                            }
                            if (res.data.exp) {
                                this.setState({
                                    flagArr: arr,
                                    date: res.data.exp
                                });
                            }
                            showInfo('上传成功');
                        }
                    });
                });
            }, 100);
        }
    };

    //原生点击添加图片
    addPictrue = (type) => {
        const arrInfo = [];
        if (process.env.NATIVE) {
            if (type === 'prove') {
                const {sValue} = this.state;
                const result = seasons.some(item => item.value === sValue[0]);
                if (!result) {
                    showInfo(Form.No_Prove_type);
                    return;
                }
                native('picCallback', {num: 1}).then(res => {
                    res.data.img.forEach(item => {
                        arrInfo.push({imgB: item[0], imgS: item[1], id: new Date()});
                    });
                    this.setState({
                        file1: arrInfo
                    });
                    this.pasGass(arrInfo, Number(sValue[0]), 0);
                });
            } else if (type === 'shop') {
                native('picCallback', {num: 1}).then(res => {
                    res.data.img.forEach(item => {
                        arrInfo.push({imgB: item[0], imgS: item[1], id: new Date()});
                    });
                    this.setState({
                        file2: arrInfo
                    });
                    this.pasGass(arrInfo, 3, 1);
                });
            } else if (type === 'environment') {
                native('picCallback', {num: 1}).then(res => {
                    res.data.img.forEach(item => {
                        arrInfo.push({imgB: item[0], imgS: item[1], id: new Date()});
                    });
                    this.setState({
                        file3: arrInfo
                    });
                    this.pasGass(arrInfo, 5, 2);
                });
            } else {
                native('picCallback', {num: 1}).then(res => {
                    res.data.img.forEach(item => {
                        arrInfo.push({imgB: item[0], imgS: item[1], id: new Date()});
                    });
                    this.setState({
                        file4: arrInfo
                    });
                    this.pasGass(arrInfo, 7, 3);
                });
            }
        }
    };

    //原生点击删除图片
    deleteImg = (type, id) => {
        if (type === 'prove') {
            this.setState({
                file1: []
            });
        } else if (type === 'shop') {
            this.setState({
                file2: []
            });
        } else if (type === 'environment') {
            this.setState({
                file3: []
            });
        } else {
            this.setState({
                file4: []
            });
        }
    };

    //原生图片上传的时候的请求
    pasGass = (arrInfo, ix, index) => {
        const {flagArr} = this.state;
        const arr = flagArr;
        this.fetch(urlCfg.postIDcard, {data: {
            ix,
            file: encodeURIComponent(arrInfo[0].imgB),
            filex: encodeURIComponent(arrInfo[0].imgS)
        }}).subscribe(res => {
            if (res && res.status === 0) {
                arr[index] = true;
                if (res.data.name && res.data.id_num) {
                    this.setState({
                        flagArr: arr,
                        userName: res.data.name,
                        ID: res.data.id_num
                    });
                }
                if (res.data.exp) {
                    this.setState({
                        flagArr: arr,
                        date: res.data.exp
                    });
                }
                showInfo('上传成功');
            }
        });
    }

    render() {
        const {form: {getFieldDecorator}} = this.props;
        const steps = ['填写店铺信息', '填写开店人信息', '填写工商信息', '绑定银行卡'];
        const {file1, file2, file3, file4} = this.state;
        const {that} = this.props;
        return (
            <div data-component="personal-three" data-role="page" className="personal-three">
                <AppNavBar title="开店人信息" goBackModal={() => this.props.goBack('two')}/>
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
                    <div className="ID-photo">
                        <List style={{backgroundColor: 'white'}} className="picker-list">
                            <Picker
                                cols={1}
                                data={seasons}
                                value={this.state.sValue}
                                extra="请选择照片类型"
                                // onChange={v => this.setState({sValue: v})}
                                onOk={v => this.setState({sValue: v})}
                            >
                                <List.Item arrow="horizontal">商家证明照片</List.Item>
                            </Picker>
                        </List>
                        <div className="upload-box">
                            <div>
                                <WingBlank>
                                    {
                                        process.env.NATIVE ? (
                                            <div className="picture-area">
                                                <ul>
                                                    {
                                                        file1 && file1.map(item => (
                                                            <li id={item.id}>
                                                                {/* <span className="delete-icon" onClick={() => this.deleteImg('prove', item.id)}>×</span> */}
                                                                <img onClick={() => this.addPictrue('prove')} src={item.imgS || item.url}/>
                                                            </li>
                                                        ))
                                                    }
                                                    {
                                                        file1.length === 0 && (
                                                            <li className="imgAdd-button" onClick={() => this.addPictrue('prove')}>
                                                                <span className="imgAdd-icon">+</span>
                                                            </li>
                                                        )
                                                    }
                                                </ul>
                                            </div>
                                        ) : getFieldDecorator('prove', {
                                            rules: [
                                                {validator: this.checkProve}
                                            ],
                                            validateTrigger: 'submit'//校验值的时机
                                        })(
                                            <ImagePicker
                                                files={file1}
                                                onChange={(files) => {
                                                    this.onChange(files, 'prove');
                                                }}
                                                onImageClick={(index, fs) => console.log(index, fs)}
                                                selectable={file1.length < 1}
                                                length={1}
                                            />
                                        )
                                    }
                                </WingBlank>
                                <span>上传商家证明照片</span>
                            </div>
                        </div>
                        <p>您可选择租赁协议、产权证明、执业资质证照、第三方证明及其他证明材料中之一上传即可</p>
                    </div>
                    <div className="ID-photo">
                        <div className="headline">{that.state.urlParams === '0' ? '摊位照' : '店铺照'}</div>
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
                                                                {/* <span className="delete-icon" onClick={() => this.deleteImg('shop', item.id)}>×</span> */}
                                                                <img onClick={() => this.addPictrue('shop')} src={item.imgS || item.url}/>
                                                            </li>
                                                        ))
                                                    }
                                                    {
                                                        file2.length === 0 && (
                                                            <li className="imgAdd-button" onClick={() => this.addPictrue('shop')}>
                                                                <span className="imgAdd-icon">+</span>
                                                            </li>
                                                        )
                                                    }
                                                </ul>
                                            </div>
                                        )
                                            : getFieldDecorator('shop', {
                                                rules: [
                                                    {validator: this.checkShop}
                                                ],
                                                validateTrigger: 'submit'//校验值的时机
                                            })(
                                                <ImagePicker
                                                    files={file2}
                                                    onChange={(files) => {
                                                        this.onChange(files, 'shop');
                                                    }}
                                                    onImageClick={(index, fs) => console.log(index, fs)}
                                                    selectable={file2.length < 1}
                                                    length={1}
                                                />
                                            )
                                    }
                                </WingBlank>
                                <span>{that.state.urlParams === '0' ? '上传门头照/摊位照' : '上传店铺照'}</span>
                            </div>
                        </div>
                        <div className="headline">{that.state.urlParams === '0' ? '摊位环境照' : '环境照'}</div>
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
                                                                {/* <span className="delete-icon" onClick={() => this.deleteImg('environment', item.id)}>×</span> */}
                                                                <img onClick={() => this.addPictrue('environment')} src={item.imgS || item.url}/>
                                                            </li>
                                                        ))
                                                    }
                                                    {
                                                        file3.length === 0 && (
                                                            <li className="imgAdd-button" onClick={() => this.addPictrue('environment')}>
                                                                <span className="imgAdd-icon">+</span>
                                                            </li>
                                                        )
                                                    }
                                                </ul>
                                            </div>
                                        )
                                            : getFieldDecorator('environment', {
                                                rules: [
                                                    {validator: this.checkEnvironment}
                                                ],
                                                validateTrigger: 'submit'//校验值的时机
                                            })(
                                                <ImagePicker
                                                    files={file3}
                                                    onChange={(files) => {
                                                        this.onChange(files, 'environment');
                                                    }}
                                                    onImageClick={(index, fs) => console.log(index, fs)}
                                                    selectable={file3.length < 1}
                                                    length={1}
                                                />
                                            )
                                    }
                                </WingBlank>
                                <span>{that.state.urlParams === '0' ? '上传门店/摊位环境照' : '上传环境照'}</span>
                            </div>
                        </div>
                    </div>
                    <div className="ID-photo">
                        <div className="start">售卖商品照片</div>
                        <div className="upload-box">
                            <div>
                                <WingBlank>
                                    {
                                        process.env.NATIVE ? (
                                            <div className="picture-area">
                                                <ul>
                                                    {
                                                        file4 && file4.map(item => (
                                                            <li id={item.id}>
                                                                {/* <span className="delete-icon" onClick={() => this.deleteImg('product', item.id)}>×</span> */}
                                                                <img onClick={() => this.addPictrue('product')} src={item.imgS || item.url}/>
                                                            </li>
                                                        ))
                                                    }
                                                    {
                                                        file4.length === 0 && (
                                                            <li className="imgAdd-button" onClick={() => this.addPictrue('product')}>
                                                                <span className="imgAdd-icon">+</span>
                                                            </li>
                                                        )
                                                    }
                                                </ul>
                                            </div>
                                        )
                                            : getFieldDecorator('product', {
                                                rules: [
                                                    {validator: this.checkProduct}
                                                ],
                                                validateTrigger: 'submit'//校验值的时机
                                            })(
                                                <ImagePicker
                                                    files={file4}
                                                    onChange={(files) => {
                                                        this.onChange(files, 'product');
                                                    }}
                                                    onImageClick={(index, fs) => console.log(index, fs)}
                                                    selectable={file4.length < 1}
                                                    length={1}
                                                />
                                            )
                                    }
                                </WingBlank>
                                <span>上传售卖商品照片</span>
                            </div>
                        </div>
                    </div>
                    <div className="hint">点击下一步将自动保存已填写信息</div>
                </div>
                <div className="button">
                    {/*<div className="large-button general">先保存，下次填</div>*/}
                    <div className="large-button important" onClick={() => this.uploadPictures()}>填好了，下一步</div>
                </div>
            </div>
        );
    }
}
export default createForm()(PersonalThree);
