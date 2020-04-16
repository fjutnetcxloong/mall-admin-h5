/**我要开店页面 */


import React from 'react';
import PropTypes from 'prop-types';
import './Agreement.less';
import AppNavBar from '../../../../../common/navbar/NavBar';

export default class Agreement extends React.PureComponent {
    static defaultProps = {
        close: () => {}
    };

    static propTypes = {
        close: PropTypes.func
    }

    render() {
        const {close} = this.props;
        return (
            <div data-component="agreement" data-role="page" className="agreement">
                <AppNavBar title="开店说明" goBackModal={close}/>
                <h1 className="agree-title">开店相关说明</h1>
                <span>1.可开店用户：</span>
                <p>1.1您已确认源头UID，如您未确认，可前往手动输入确认或扫码确认。</p>
                <span>开店流程</span>
                <img src={require('../../../../../../assets/images/ds.png')} alt=""/>
                <span>1.2如何开店</span>
                <p><span>第一步</span>:登陆后进入我的页面，点击我要开店</p>
                <p><span>第二步</span>:（如您已有推荐人则无此步骤，请查看第三步）跳转验证页面，可选择手动输入或者扫码验证</p>
                <img src={require('../../../../../../assets/images/dd.png')} alt=""/>
                <p><span>①手动输入：</span>输入您推荐人的手机号以及UID，点击验证，如证成功则可点击下一步进行开店</p>
                <img src={require('../../../../../../assets/images/sd.png')} alt=""/>
                <p><span>②扫码验证：</span>调取扫一扫功能，扫描您推荐人的二维码后跳转信息确认页，如您确认无误点击下一步即可进入开店流程</p>
                <img src={require('../../../../../../assets/images/sure.png')} alt=""/>
                <p><span>第三步</span>选择店铺类型，请按您实际情况选择。个人店和网店仅需提供个人身份证和商家证明照片。
个体工商店需要提供身份证及营业执照。
                </p>
                <img src={require('../../../../../../assets/images/select.png')} alt=""/>
                <img src={require('../../../../../../assets/images/open.png')} alt=""/>
                <img src={require('../../../../../../assets/images/style.png')} alt=""/>
                <p><span>第四步</span>进入资料填写阶段，请根据您的实际情况填写，每项都为必填项。开店人信息需与个体工商户信息（如为个人店则无需填写）以及绑定银行卡的所属人信息一致。。
                </p>
                <img src={require('../../../../../../assets/images/info.png')} alt=""/>
                <p><span className="light">收款码折扣</span>指商家进行二维码收款时的实际到账比例及相应的消费者的C米比例。如商家设置9.5折，消费者扫二维码付款10元，将累计0.5C米，收款商家实际到账9.5元。</p>
                <p>个人店申请入驻体验商家享有5,000体验额度，个体店申请入驻体验商家享有10000额度。在额度内商家折扣不生效且没有跨界收益；如您体验期超一个月或营业总额超过体验金额，将转为正式商家。成为正式商家后，您此时设置的折扣自动生效且将享有跨界收益，商家折扣可在店铺设置内修改。</p>
                <p><span>第五步</span>资料填写完毕后点击确定即提交开店申请，审核通过后您可以上传商品、张贴二维码等进行正式营业。</p>
            </div>
        );
    }
}
