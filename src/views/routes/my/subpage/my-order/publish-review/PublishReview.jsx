/**发表追评 */

import React from 'react';
import {List, TextareaItem, ImagePicker, WingBlank} from 'antd-mobile';
import {dropByCacheKey} from 'react-router-cache-route';
import AppNavBar from '../../../../../common/navbar/NavBar';
import './PublishReview.less';

const {getUrlParam, dealImage, showInfo, showSuccess, appHistory, native} = Utils;
const {MESSAGE: {Form, Feedback}, IMGSIZE} = Constants;
const {urlCfg} = Configs;
export default class PublishReview extends BaseComponent {
    state = {
        files: [], //展示图片集合
        fileArr: [], //请求图片集合
        publishInfo: [], //商品信息集合
        nativePicNum: 9 //原生选择图片的数量
    };

    componentDidMount() {
        this.getList();
    }

    getList = () => {
        const id = decodeURI(getUrlParam('id', encodeURI(this.props.location.search)));
        this.fetch(urlCfg.rublishReview, {data: {id}})
            .subscribe(res => {
                if (res && res.status === 0) {
                    this.setState({
                        publishInfo: res.data
                    });
                }
            });
    }

    //图片选择
    onChange = (files) => {
        //限制图片上传大小
        files = files.filter(item => {
            if (item.file.size < IMGSIZE) {
                return item;
            }
            return showInfo(Feedback.DOT_TWOM);
        });

        const fileArr = files.map((imgB) => {
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
            fileArr
        });
    }

    //原生图片选择
    addPictrue = () => {
        const {nativePicNum, fileArr} = this.state;
        if (process.env.NATIVE) {
            native('picCallback', {num: nativePicNum}, (dataList) => {
                const arr = fileArr;
                const res = dataList ? JSON.parse(dataList) : '';
                if (res && res.status === '0') {
                    res.data.img.forEach((item, index) => {
                        arr.push({url: item[0], urlB: item[1], id: new Date()});
                    });
                    this.setState({
                        fileArr: arr,
                        nativePicNum: 9 - arr.length
                    });
                }
            });
        }
    };

    //点击删除图片
    deleteImg = (id) => {
        const {fileArr} = this.state;
        const arr = fileArr.filter(item => item.id !== id);
        this.setState({
            fileArr: [...arr],
            nativePicNum: 9 - arr.length
        });
    };

    //发表追评
    submit = () => {
        const {fileArr, textValue}  = this.state;
        if (!textValue) {
            showInfo(Form.No_Evaluate);
            return;
        }
        const id = decodeURI(getUrlParam('id', encodeURI(this.props.location.search)));
        this.fetch(urlCfg.publishAReview, {data: {pingjia_id: id, content: textValue, have_pic: fileArr.length > 0 ? 1 : ''}})
            .subscribe(res => {
                if (res && res.status === 0) {
                    if (fileArr.length > 0) {
                        fileArr.forEach(itemImg => {
                            itemImg.url = encodeURIComponent(itemImg.urlB);
                            delete itemImg.urlB;
                        });
                        this.fetch(urlCfg.picSave, {data: {
                            type: 1,
                            id: res.id,
                            file: fileArr
                        }}).subscribe((resr) => {
                            if (res && resr.status === 0) {
                                showSuccess(Feedback.Evaluate_Success);
                                dropByCacheKey('PossessEvaluate');
                                appHistory.replace('/evaluationSuccess');
                            }
                        });
                    } else {
                        showSuccess(Feedback.Evaluate_Success);
                        dropByCacheKey('PossessEvaluate');
                        appHistory.replace('/evaluationSuccess');
                    }
                }
            });
    }

    goToGoods = () => {
        appHistory.push(`/goodsDetail?id=${this.state.publishInfo.pr_id}`);
    }

    textValue = (value) => {
        this.setState({
            textValue: value
        });
    }

    render() {
        const {files, publishInfo, fileArr} = this.state;
        return (
            <div data-component="publish-review" data-role="page" className="publish-review">
                <AppNavBar title="发表追评"/>
                <div className="shared-margin-box">
                    <div className="shared-margin">
                        <div className="commodity" onClick={this.goToGoods}>
                            <img src={publishInfo.picpath} alt=""/>
                            <div className="commodity-right">{publishInfo.pr_title}</div>
                        </div>
                        <List>
                            <TextareaItem
                                placeholder="已经用了一段时间了，有更多的惊喜发现？分享给想买的他们吧"
                                data-seed="logId"
                                autoHeight
                                onChange={this.textValue}
                                count={200}
                            />
                        </List>
                        <WingBlank>
                            {
                                process.env.NATIVE ? (
                                    <div className="picture-area">
                                        <ul>
                                            {
                                                fileArr && fileArr.map((value, index) => index < 9 && (
                                                    <li id={value.id}>
                                                        <span onClick={() => this.deleteImg(value.id)}>×</span>
                                                        <img src={value.url}/>
                                                    </li>
                                                ))
                                            }
                                            {
                                                fileArr && fileArr.length < 9 && (
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
                                        onChange={this.onChange}
                                        selectable={files.length < 9}
                                        multiple
                                        onAddImageClick={(data, value) => true}
                                    />
                                )}
                        </WingBlank>
                    </div>
                </div>
                <div className="button-box">
                    <div className="button large-button important" onClick={this.submit}>
                        <span>发布追评</span>
                    </div>
                </div>
            </div>
        );
    }
}
