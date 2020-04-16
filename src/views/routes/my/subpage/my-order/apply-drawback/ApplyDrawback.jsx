/**修改申请 */
import {TextareaItem, Button, ImagePicker} from 'antd-mobile';
import AppNavBar from '../../../../../common/navbar/NavBar';
import './ApplyDrawback.less';

const {dealImage, appHistory, getUrlParam, showSuccess, native} = Utils;
const  {urlCfg} = Configs;
const {MESSAGE: {Feedback}} = Constants;

//退款类型
const refundType = [
    {
        title: '仅退款',
        index: '1'
    },
    {
        title: '退货退款',
        index: '2'
    }
];

//仅线下退款类型
const offlineType = [
    {
        title: '仅退款',
        index: '1'
    }
];

//退货原因
const molds = [
    {
        title: '多拍拍错不想要'
    },
    {
        title: '和商家协商一致'
    },
    {
        title: '产品与实际不符合'
    }
];

export default class applyDrawback extends BaseComponent {
    state = {
        files: [],
        filesArr: [], //图片请求成功
        typeSelectIndexs: '', //退款类型的index
        typeSelectIndexsTime: '', //临时退款类型的index
        selectIndexs: '', //退款原因的index
        typeSelectText: '', //退款类型内容
        typeSelectTextTime: '', //临时退款类型内容
        selectText: '', //退款原因的内容
        swith1: true,
        swith2: true,
        dataList: [],
        nativePicNum: 9 //原生照片选择数量
    };

    componentDidMount() {
        this.getList();
    }

    //获取数据
    getList = () => {
        const id = decodeURI(getUrlParam('id', encodeURI(this.props.location.search)));
        this.fetch(urlCfg.returnOrderInfo, {data: {id}})
            .subscribe(res => {
                if (res && res.status === 0) {
                    this.setState({
                        dataList: res.data,
                        typeSelectIndexs: res.data.types,
                        typeSelectIndexsTime: res.data.types,
                        typeSelectText: res.data.types === '1' ? '仅退款' : '退货退款',
                        selectText: res.data.return_reason,
                        questionInfo: res.data.describe
                    });
                }
            });
    }

    //退款原因取消以及箭头切换
    blockedOut = () => {
        this.setState(prevState => ({
            swith1: !prevState.swith1
        }));
    };

    //退款原因选择
    resonChoose = (title, index) => {
        this.setState(() => ({
            selectIndexsTime: index,
            selectTextTime: title
        }));
    };

    //确定退款原因
    clickSelect = () => {
        this.setState(prevState => ({
            swith1: !prevState.swith1,
            selectText: prevState.selectTextTime,
            selectIndexs: prevState.selectIndexsTime
        }));
    };

    //退款类型取消以及箭头切换
    typeBlockedOut = () => {
        this.setState((prevState) => ({
            swith2: !prevState.swith2
        }));
    };

    //退款类型选择
    typeChoose = (title, index) => {
        this.setState({
            typeSelectIndexsTime: index,
            typeSelectTextTime: title
        });
    };

    //退款类型确定
    typeClickSelect = () => {
        this.setState((prevState) => ({
            swith2: !prevState.swith2,
            typeSelectText: prevState.typeSelectTextTime,
            typeSelectIndexs: prevState.typeSelectIndexsTime
        }));
    };

    //描述内容
    questionMain = (value) => {
        this.setState({
            questionInfo: value
        });
    }

    //点击添加、删除图片
    onChangeImg = (files) => {
        const filesArr = files.map((imgB) => {
            const objTemp = {
                url: '',
                urlB: ''
            };
            dealImage(imgB, 100, (imgSX) => {
                objTemp.url = imgSX;
            });
            dealImage(imgB, 800, (imgD) => {
                objTemp.urlB = imgD;
            });
            return objTemp;
        });
        this.setState({
            files,
            filesArr
        });
    }

    //原生图片选择
    addPictrue = () => {
        const {nativePicNum, filesArr} = this.state;
        native('picCallback', {num: nativePicNum}, (dataList) => {
            const res = dataList ? JSON.parse(dataList) : '';
            const arr = filesArr;
            if (res && res.status  === '0') {
                res.data.img.forEach(item => {
                    arr.push({urlB: item[0], url: item[1], id: new Date()});
                });
                this.setState({
                    filesArr: arr,
                    nativePicNum: 9 - arr.length
                });
            }
        });
    };

    //点击删除图片
    deleteImg = (id) => {
        const {filesArr} = this.state;
        const arr = filesArr.filter(item => item.id !== id);
        this.setState({
            filesArr: [...arr],
            nativePicNum: 9 - arr.length
        });
    };

    //提交申请
    editApply = () => {
        const {filesArr, selectText, typeSelectIndexs, questionInfo} = this.state;
        const id = decodeURI(getUrlParam('id', encodeURI(this.props.location.search)));
        this.fetch(urlCfg.returnOrderEdit, {data: {id, reasons: selectText, describe: questionInfo, type: typeSelectIndexs}})
            .subscribe(res => {
                if (res && res.status === 0) {
                    filesArr.forEach(item => {
                        item.url = encodeURIComponent(item.urlB);
                    });
                    if (filesArr.length > 0) {
                        const fileArrPro = [];
                        filesArr.forEach((item, index) => {
                            if (item) {
                                fileArrPro.push(new Promise((resolve, reject) => {
                                    this.fetch(urlCfg.pictureUploadBase, {
                                        data: {
                                            id,
                                            type: 2,
                                            ix: index,
                                            num: filesArr.length,
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
                            appHistory.goBack();
                            showSuccess(Feedback.Edit_Success);
                        }).catch(err => {
                            console.log(err);
                        });
                    } else {
                        showSuccess(Feedback.Edit_Success);
                        appHistory.goBack();
                    }
                }
            });
    }

    render() {
        const {files, filesArr, swith1, selectText, typeSelectText, selectIndexsTime, swith2, typeSelectIndexsTime, dataList, questionInfo} = this.state;
        const type = decodeURI(getUrlParam('type', encodeURI(this.props.location.search)));
        const refurn = decodeURI(getUrlParam('refurn', encodeURI(this.props.location.search)));//为1表示仅退款
        return (
            <div className="apply-drawback">
                <AppNavBar title="修改申请"/>
                <div className="services">
                    <div className="service-inp">
                        {/*商品信息*/}
                        <div className="trade-info">
                            <img src={dataList.picpath} className="trade-img" alt=""/>
                            <div className="trade-describe">{dataList.pr_title}</div>
                        </div>
                        {/*退款类型*/}
                        <div className="drawback">
                            <div className="drawback-text"><span>*</span>退款类型</div>
                            <div className="select-frame" onClick={this.typeBlockedOut}>
                                {(type === '2' || refurn === '1') ? (
                                    <span className="select-text">仅退款</span>
                                )
                                    : (
                                        <span className="select-text">{typeSelectText}</span>
                                    )}
                                <span className={swith2 ? 'select-icon' : 'select-icon-max'}>
                                    <span className="icon select-icon-right"/>
                                </span>
                            </div>
                            {!swith2 && (
                                <div className="abs-bottom">
                                    <div className="closedAngle">
                                        <div className="closedAngle-btn">
                                            <div className="btn-left" onClick={this.typeBlockedOut}>取消</div>
                                            <div className="btn-right" onClick={this.typeClickSelect}>确定</div>
                                        </div>
                                        {/*type == 2  线下  refurn 为1 表示仅退款*/}
                                        {(type === '2' || refurn === '1') ? (
                                            <div className="closedAngle-list">
                                                {offlineType.map(item => (
                                                    <div className="list-item" key={item.index} onClick={() => this.typeChoose(item.title, item.index)}>
                                                        <div className="item-text">{item.title}</div>
                                                        <div className={`icon ${item.index === typeSelectIndexsTime ? 'icon-celetes' : 'icon-hollow'}`}/>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="closedAngle-list">
                                                {refundType.map(item => (
                                                    <div className="list-item" key={item.index} onClick={() => this.typeChoose(item.title, item.index)}>
                                                        <div className="item-text">{item.title}</div>
                                                        <div className={`icon ${item.index === typeSelectIndexsTime ? 'icon-celetes' : 'icon-hollow'}`}/>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                        {/*退款原因*/}
                        <div className="drawback">
                            <div className="drawback-text"><span>*</span> 退款原因</div>
                            <div className="select-frame" onClick={this.blockedOut}>
                                <span className="select-text">{selectText}</span>
                                <span className={swith1 ? 'select-icon' : 'select-icon-max'}>
                                    <span className="icon select-icon-right"/>
                                </span>
                            </div>
                            {!swith1 && (
                                <div className="abs-bottom">
                                    <div className="closedAngle">
                                        <div className="closedAngle-btn">
                                            <div className="btn-left" onClick={this.blockedOut}>取消</div>
                                            <div className="btn-right" onClick={this.clickSelect}>确定</div>
                                        </div>
                                        <div className="closedAngle-list">
                                            {molds.map((item, index) => (
                                                <div className="list-item" key={index.toString()} onClick={() => this.resonChoose(item.title, index)}>
                                                    <div className="item-text">{item.title}</div>
                                                    <div className={`icon ${index === selectIndexsTime ? 'icon-celetes' : 'icon-hollow'}`}/>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                        {/*问题描述*/}
                        <div className="describes">
                            <div className="describe-text">问题描述</div>
                            <TextareaItem
                                placeholder="请输入文字"
                                autoHeight
                                rows="4"
                                value={questionInfo}
                                onChange={this.questionMain}
                            />
                        </div>
                        {/*上传图片*/}
                        <div className="upload-img">
                            <div className="upload-text">上传图片</div>
                            <div className="img-list">
                                {
                                    process.env.NATIVE ? (
                                        <div className="picture-area">
                                            <ul>
                                                {
                                                    filesArr && filesArr.map((value, index) => index < 9 && (
                                                        <li id={value.id}>
                                                            <span onClick={() => this.deleteImg(value.id)}>×</span>
                                                            <img src={value.url}/>
                                                        </li>
                                                    ))
                                                }
                                                {
                                                    filesArr && filesArr.length < 9 && (
                                                        <li className="imgAdd-button" onClick={() => this.addPictrue()}>
                                                            <span>+</span>
                                                        </li>
                                                    )
                                                }
                                            </ul>
                                        </div>
                                    )
                                        : (
                                            <ImagePicker
                                                files={files}
                                                onChange={this.onChangeImg}
                                                selectable={files.length < 9}
                                                multiple
                                            />
                                        )
                                }
                            </div>
                        </div>
                        {/*提交*/}
                        <Button className="large-button disable-button" onClick={this.editApply}>提交申请</Button>
                    </div>
                </div>
            </div>
        );
    }
}
