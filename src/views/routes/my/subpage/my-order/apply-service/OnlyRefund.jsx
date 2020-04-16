//申请退款 仅退款
import {connect} from 'react-redux';
import {dropByCacheKey} from 'react-router-cache-route';
import {TextareaItem, Button, ImagePicker} from 'antd-mobile';
import {baseActionCreator as actionCreator} from '../../../../../../redux/baseAction';
import AppNavBar from '../../../../../common/navbar/NavBar';
import './ApplyService.less';

const {appHistory, showInfo, dealImage, getUrlParam, TD} = Utils;
const {MESSAGE: {Form}, TD_EVENT_ID} = Constants;
const {urlCfg} = Configs;
//退货退款类型
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
const hybird = process.env.NATIVE;

class applyService extends BaseComponent {
    state = {
        Service: decodeURI(getUrlParam('onlyRefund', encodeURI(this.props.location.search))) === 'true' ? '1' : '2',  //整型(1仅退款(退运费) 2退款退货 3换货 4维修/true/1)
        files: [],
        fileInfo: [], //图片文件集合
        swith: true, //显示或隐藏问题原因
        question: '', //问题描述
        selectText: '', //退款原因
        selectIndex: null, //退款数组
        selectTexts: '', //退款原因赋值
        selectIndexs: null, //退款数组赋值
        nativePicNum: 9 //动态计算原生图片数量
    };

    //开启退款原因选择
    blockedOut = () => {
        this.setState(prevState => ({
            swith: !prevState.swith
        }));
    }

    //选择退款原因
    checkBlocked = (data, index) => {
        this.setState({
            selectTexts: data,
            selectIndexs: index
        });
    }

    //点击确定退款原因选择
    clickSelect = () => {
        this.setState((prevState) => ({
            selectText: prevState.selectTexts,
            swith: true
        }));
    }

    //问题描述
    questionMain = (res) => {
        this.setState({
            question: res
        });
    }

    //点击添加、删除图片
    onChange = (files) => {
        const imgArr = [];
        const that = this;
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
                imgArr.push({
                    urlB: imgBD,
                    url: imgS
                });
                that.setState((prevState) => ({
                    fileInfo: imgArr
                }));
            }, 100);
        });
        this.setState({
            files
        });
    }

    //提交申请
    editApply = () => {
        const {selectText, Service, question, fileInfo} = this.state;
        const {location: {search}} = this.props;
        const orderId = decodeURI(getUrlParam('orderId', encodeURI(search)));
        const prId = decodeURI(getUrlParam('prId', encodeURI(search)));
        const returnType = decodeURI(getUrlParam('returnType', encodeURI(search)));
        const arrInfo = decodeURI(getUrlParam('arrInfo', encodeURI(search)));
        const down = decodeURI(getUrlParam('down', encodeURI(search)));
        let timer = null;
        TD.log(TD_EVENT_ID.AFTER_SALE.ID, TD_EVENT_ID.AFTER_SALE.LABEL.APPLY_REFUND);
        if (!selectText) {
            showInfo(Form.Error_Reason_Required);
        } else {
            this.fetch(urlCfg.applicationForRefund,
                {data:
                    {
                        order_id: orderId,
                        reasons: selectText,
                        type: Service,
                        describe: question,
                        return_type: returnType,
                        property_content: arrInfo === 'null' ? null : arrInfo,
                        pr_id: prId !== 'null' ? prId : null
                    }
                }).subscribe((res) => {
                if (res && res.status === 0) {
                    if (fileInfo.length > 0) {
                        const pasArr = [];
                        fileInfo.forEach((item, index) => {
                            pasArr.push(new Promise((resolve, reject) => {
                                this.fetch(urlCfg.pictureUploadBase, {data: {
                                    type: 2,
                                    id: res.id,
                                    ix: index,
                                    num: item.length,
                                    filex: encodeURIComponent(item.url),
                                    file: encodeURIComponent(item.urlB)
                                }}).subscribe((value) => {
                                    if (value && value.status === 0) {
                                        resolve(value);
                                    } else {
                                        reject(value);
                                    }
                                });
                            }));
                        });
                        Promise.all(pasArr).then(ooo => {
                            // showInfo(Feedback.Apply_Success);
                            if (down === '1') { //线下订单申请
                                if (returnType === '1') {
                                    appHistory.go(-1);
                                } else {
                                    appHistory.go(-2);
                                }
                                dropByCacheKey('selfMentionOrderPage');//清除线下订单
                                timer = setTimeout(() => {
                                    clearTimeout(timer);
                                    // appHistory.push(`/selfOrderingDetails?id=${orderId}`);
                                    appHistory.replace(`/jdsSaveSuccess?id=${orderId}&self=1&orderId=${res.id}`);
                                });
                                // setOrderStatus(3);
                            } else {
                                //将我的订单的tab状态设置为售后
                                if (returnType === '1') { //整条订单退款
                                    appHistory.go(-1);
                                } else { //非整条订单退款
                                    appHistory.go(-3);
                                }
                                //清除我的订单的缓存
                                dropByCacheKey('OrderPage');
                                timer = setTimeout(() => {
                                    clearTimeout(timer);
                                    // appHistory.push(`/refundDetails?id=${res.id}`);
                                    appHistory.replace(`/jdsSaveSuccess?id=${orderId}&orderId=${res.id}`);
                                });
                                // setOrderStatus(0);
                            }
                        }, err => {
                            console.log(err);
                        });
                    } else {
                        // showInfo(Feedback.Apply_Success);
                        // eslint-disable-next-line no-lonely-if
                        if (down === '1') { //线下订单申请
                            if (returnType === '1') {
                                appHistory.go(-1);
                            } else {
                                appHistory.go(-2);
                            }
                            dropByCacheKey('selfMentionOrderPage');//清除线下订单
                            timer = setTimeout(() => {
                                clearTimeout(timer);
                                // appHistory.push(`/selfOrderingDetails?id=${orderId}`);
                                appHistory.replace(`/jdsSaveSuccess?id=${orderId}&self=1&orderId=${res.id}`);
                            });
                            // setOrderStatus(3);
                        } else {
                            if (returnType === '1') { //整条订单退款
                                appHistory.go(-1);
                            } else { //非整条订单退款
                                appHistory.go(-3);
                            }
                            //清除我的订单的缓存
                            dropByCacheKey('OrderPage');
                            timer = setTimeout(() => {
                                // appHistory.push(`/refundDetails?id=${res.id}`);
                                clearTimeout(timer);
                                appHistory.replace(`/jdsSaveSuccess?id=${orderId}&orderId=${res.id}`);
                            });
                            // setOrderStatus(0);
                        }
                    }
                }
            });
        }
    }

    //点击添加图片
    addPictrue = () => {
        const {nativePicNum, fileInfo} = this.state;
        if (hybird) {
            window.DsBridge.call('picCallback', {num: nativePicNum}, (dataList) => {
                const res = dataList ? JSON.parse(dataList) : '';
                const arr = fileInfo;
                if (res && res.status === '0') {
                    res.data.img.forEach(item => {
                        arr.push({urlB: item[0], url: item[1], id: new Date()});
                    });
                    this.setState({
                        fileInfo: arr,
                        nativePicNum: 9 - arr.length
                    });
                }
            });
            // native('picCallback', {num: nativePicNum}).then(res => {
            //     const arr = fileInfo;
            //     res.data.img.forEach(item => {
            //         arr.push({urlB: item[0], url: item[1], id: new Date()});
            //     });
            //     this.setState({
            //         fileInfo: arr,
            //         nativePicNum: 9 - arr.length
            //     });
            // });
        }
    };

    //点击删除图片
    deleteImg = (id) => {
        const {fileInfo} = this.state;
        const arr = fileInfo.filter(item => item.id !== id);
        this.setState({
            fileInfo: [...arr],
            nativePicNum: 9 - arr.length
        });
    };

    render() {
        const {files, swith, selectText, selectIndexs, fileInfo} = this.state;
        return (
            <div data-component="apply-service" data-role="page" className="apply-service">
                <AppNavBar title="申请退款"/>
                <div className="services">
                    <div className="service-inp">
                        {/*退款原因*/}
                        <div className="drawback">
                            <div className="drawback-text"><span>*</span> 退款原因</div>
                            <div className="select-frame" onClick={this.blockedOut}>
                                <span className="select-text">{selectText || '请选择退款原因'}</span>
                                <span className={swith ? 'select-icon' : 'select-icon-max'}>
                                    <span className="icon select-icon-right"/>
                                </span>
                            </div>
                            {!swith && (
                                <div className="abs-bottom">
                                    <div className="closedAngle">
                                        <div className="closedAngle-btn">
                                            <div className="btn-left" onClick={this.blockedOut}>取消</div>
                                            <div className="btn-right" onClick={this.clickSelect}>确定</div>
                                        </div>
                                        <div className="closedAngle-list">
                                            {molds.map((item, index) => (
                                                <div className="list-item" key={index.toString()} onClick={() => this.checkBlocked(item.title, index)}>
                                                    <div className="item-text">{item.title}</div>
                                                    <div className={`icon ${index === selectIndexs ? 'icon-celetes' : 'icon-hollow'}`}/>
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
                                                    fileInfo && fileInfo.map((item, index) => index < 9 && (
                                                        <li key={item.id} id={item.id}>
                                                            <span onClick={() => this.deleteImg(item.id)}>×</span>
                                                            <img src={item.url}/>
                                                        </li>
                                                    ))
                                                }
                                                {
                                                    fileInfo && fileInfo.length < 9 && (
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
                                                onChange={this.onChange}
                                                selectable={files.length < 6}
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


const mapStateToProps = state => {
    const base = state.get('base');
    return {
        orderStatus: base.get('orderStatus')
    };
};

const mapDispatchToProps = {
    setOrderStatus: actionCreator.setOrderStatus
};

export default connect(mapStateToProps, mapDispatchToProps)(applyService);
