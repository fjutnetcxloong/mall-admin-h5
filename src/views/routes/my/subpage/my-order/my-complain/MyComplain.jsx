/**我要投诉 */
import {TextareaItem, ImagePicker} from 'antd-mobile';
import AppNavBar from '../../../../../common/navbar/NavBar';
import './MyComplain.less';

const {dealImage, showInfo, appHistory, showSuccess, getUrlParam, native} = Utils;
const {urlCfg} = Configs;
const {MESSAGE: {Form, Feedback}} = Constants;
export default class MyComplain extends BaseComponent {
    state = {
        files: [],
        fileMain: []
    };

    //问题反馈内容
    questionMain = (value) => {
        this.setState({
            questionInfo: value
        });
    }

    //图片选择
    uploadPictures = (files) => {
        this.setState({
            files
        }, () => {
            const fileMain = [];
            files.forEach((imgB) => {
                let imgBD = '';
                let imgS = '';
                dealImage(imgB, 100, (imgSX) => {
                    imgS = imgSX;
                });
                dealImage(imgB, 800, (imgD) => {
                    imgBD = imgD;
                });
                setTimeout(() => {
                    fileMain.push({
                        imgB: imgBD,
                        imgS
                    });
                }, 100);
            });
            this.setState({
                fileMain
            }, () => {
                // console.log(fileMain);
            });
        });
    }

    //提交投诉
    submit = () => {
        const {questionInfo, fileMain} = this.state;
        const orderId = decodeURI(getUrlParam('orderId', encodeURI(this.props.location.search)));
        if (!questionInfo) return showInfo(Form.No_Complain);
        this.fetch(urlCfg.doComplain, {data: {reason: questionInfo, orderid: orderId}})
            .subscribe(res => {
                if (res && res.status === 0) {
                    fileMain.forEach(item => {
                        item.url = encodeURIComponent(item.imgB);
                    });
                    if (fileMain.length > 0) {
                        const fileArrPro = [];
                        fileMain.forEach((item, index) => {
                            if (item) {
                                fileArrPro.push(new Promise((resolve, reject) => {
                                    this.fetch(urlCfg.pictureUploadBase, {
                                        data: {
                                            id: res.data.id,
                                            type: 4,
                                            ix: index,
                                            num: fileMain.length,
                                            file: item.url
                                        }
                                    }).subscribe(value => {
                                        if (value && value.status === 0) {
                                            resolve(value);
                                        }
                                    });
                                }));
                            }
                        });
                        Promise.all(fileArrPro).then(ooo => {
                            showSuccess(Feedback.submit_Success);
                            if (process.env.NATIVE) {
                                setTimeout(() => {
                                    native('goHome');
                                }, 2000);
                                // native('goHome');
                            } else {
                                appHistory.push('/home');
                            }
                        }).catch(err => {
                            console.log(err);
                        });
                    } else {
                        showSuccess(Feedback.submit_Success);
                        if (process.env.NATIVE) {
                            setTimeout(() => {
                                native('goHome');
                            }, 2000);
                        } else {
                            appHistory.push('/home');
                        }
                    }
                }
            });
        return undefined;
    }

    //原生图片选择
    addPictrue = () => {
        const {fileMain} = this.state;
        if (process.env.NATIVE) {
            window.DsBridge.call('picCallback', {num: 9 - fileMain.length}, (dataList => {
                const res = dataList ? JSON.parse(dataList) : '';
                const arr = [];
                if (res && res.status === '0') {
                    res.data.img.forEach(item => {
                        arr.push({imgB: item[0], imgS: item[1], id: new Date()});
                    });
                    this.setState((proveState) => ({
                        fileMain: proveState.fileMain.concat(arr)
                    }));
                }
            }));
            // native('picCallback', {num: 9 - fileMain.length}).then(res => {
            //     const arr = [];
            //     res.data.img.forEach(item => {
            //         arr.push({imgB: item[0], imgS: item[1], id: new Date()});
            //     });
            //     this.setState((proveState) => ({
            //         fileMain: proveState.fileMain.concat(arr)
            //     }));
            // });
        }
    };

    //点击删除图片
    deleteImg = (id) => {
        this.setState((proveState) => ({
            fileMain: proveState.fileMain.filter(item => item.id !== id)
        }));
    };

    render() {
        const {files, fileMain} = this.state;
        return (
            <div className="my-Complain">
                <AppNavBar title="我要投诉"/>
                <div className="button-box">
                    <div className="complain-wrap">
                        <div className="complain-content">
                            <div className="complain-text">投诉内容</div>
                            <TextareaItem
                                placeholder="请填写您要投诉的内容"
                                autoHeight
                                rows="4"
                                onChange={this.questionMain}
                            />
                        </div>
                        <div className="complain-img">
                            <div className="img-text">添加图片（选填）</div>
                            {
                                process.env.NATIVE ? (
                                    <div className="picture-area">
                                        <ul>
                                            {
                                                fileMain && fileMain.map(value => (
                                                    <li id={value.id}>
                                                        <span onClick={() => this.deleteImg(value.id)}>×</span>
                                                        <img src={value.imgS}/>
                                                    </li>
                                                ))
                                            }
                                            {
                                                fileMain && fileMain.length < 9 && (
                                                    <li className="imgAdd-button" onClick={() => this.addPictrue()}>
                                                        <span>+</span>
                                                    </li>
                                                )
                                            }
                                        </ul>
                                    </div>
                                ) : (
                                    <ImagePicker
                                        files={files}
                                        onChange={this.uploadPictures}
                                        selectable={files.length < 9}
                                    />
                                )
                            }
                        </div>
                    </div>
                    <div className="complain-btn">
                        <div className="button large-button important" onClick={this.submit}>
                            <span>立即提交</span>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
