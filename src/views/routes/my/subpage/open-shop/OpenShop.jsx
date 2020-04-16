/*
* 我要开店页面
* auditStatus：开店步骤状态
* shopType： 已有填写资料店铺类型： 网店--2, 个人店 -- 0， 个体工商店 -- 1
* auditStatus： 新开店店铺类型： 网店--2, 个人店 -- 0， 个体工商店 -- 1
* */
import React, {Fragment} from 'react';
import {connect} from 'react-redux';
import {Button} from 'antd-mobile';
import {baseActionCreator as actionCreator} from '../../../../../redux/baseAction';
import AppNavBar from '../../../../common/navbar/NavBar';
import Agree from './agreement/Agreement';
import FailureAudit from './FailureAudit';
import Audit from './personal/Audit';
import './OpenShop.less';

const {appHistory, getUrlParam, showFail} = Utils;
const {MESSAGE: {Feedback}} = Constants;

class OpenShop extends BaseComponent {
    state = {
        auditStatus: 'nomal',
        cerType: '',
        read: false, //是否同意开店协议
        shopType: '', //开店类型
        shopStatus: -1  //店铺类型
    };

    componentDidMount() {
        const shopType = decodeURI(getUrlParam('shopType', encodeURI(this.props.location.search)));
        const shopStatus = decodeURI(getUrlParam('shopStatus', encodeURI(this.props.location.search)));
        if (window.location.href.includes('auditStatus')) {
            const auditStatus = decodeURI(getUrlParam('auditStatus', encodeURI(this.props.location.search)));
            this.setState({
                auditStatus
            });
        }
        this.setState({
            shopType,
            shopStatus
        });
    }

    //开店
    openShop = () => {
        const {read, shopStatus, shopType} = this.state;
        if (!read) {
            showFail(Feedback.Sure_Read);
            return;
        }
        if (shopType === 'net' || shopType === 'self') {
            appHistory.push(`/personal?type=${shopStatus}`);
        } else {
            appHistory.push(`/individual?type=${shopStatus}`);
        }
    };

    //阅读协议
    checked = () => {
        this.setState(prevState => ({
            read: !prevState.read
        }));
    };

    show = () => {
        this.setState({
            auditStatus: 'agree'
        });
    }

    close = () => {
        this.setState({
            auditStatus: 'nomal'
        });
    }

    render() {
        const {auditStatus, read, shopType} = this.state;
        return (
            <Fragment>
                {auditStatus === 'nomal' && (
                    <div data-component="openShop" data-role="page" className="openShop">
                        <AppNavBar
                            rightExplain
                            title="我要开店"
                            nativeGoBack
                            rightExplainClick={this.show}
                        />
                        <div className={`store-sort ${window.isWX ? 'store-sort-clear' : ''}`}>
                            {
                                shopType === 'net' && (
                                    <div className="online-store">
                                        <span className="individual-left">
                                            <div>网店</div>
                                            <div>需提供个人身份证</div>
                                        </span>
                                    </div>
                                )
                            }
                            {
                                shopType === 'self' && (
                                    <div className="personal">
                                        <span className="personal-left">
                                            <div>个人店</div>
                                            <div>需提供个人身份证和摊位照片</div>
                                        </span>
                                    </div>
                                )
                            }
                            {
                                shopType === 'other' && (
                                    <div className="individual" >
                                        <span className="individual-left">
                                            <div>个体工商店</div>
                                            <div>需提供个人身份证和营业执照</div>
                                        </span>
                                    </div>
                                )
                            }
                        </div>
                        <div className="other-btn">
                            <p onClick={this.checked} className={read ? 'sure-read' : ''}>我已阅读并同意<span>《开店协议》</span></p>
                            <Button onClick={this.openShop}>立即开店</Button>
                        </div>
                    </div>
                )}
                {
                    auditStatus === 'filed' && (
                        <FailureAudit type={shopType}/>
                    )
                }
                {
                    auditStatus === 'now' && (
                        <Audit/>
                    )
                }
                {
                    auditStatus === 'agree' && (
                        <Agree close={this.close}/>
                    )
                }
            </Fragment>

        );
    }
}

const mapToDispatchProps = {
    showConfirm: actionCreator.showConfirm
};
export default connect(null, mapToDispatchProps)(OpenShop);
