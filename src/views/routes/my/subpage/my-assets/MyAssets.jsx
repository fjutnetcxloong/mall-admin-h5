/**
 * 资产管理
 */

import {List} from 'antd-mobile';
import {connect} from 'react-redux';
import classnames from 'classnames';
import {baseActionCreator as actionCreator} from '../../../../../redux/baseAction';
import AppNavBar from '../../../../common/navbar/NavBar';
import './MyAssets.less';

const Item = List.Item;
const {urlCfg} = Configs;
const {appHistory} = Utils;
const {MESSAGE: {Form}} = Constants;

class MyAssets extends BaseComponent {
    state = {
        editModal: '', //当前状态
        Detailed: [] //我的资产首页数据
    };

    componentDidMount() {
        this.getRecord();
        this.getUserNew();
    }

    //获取用户身份
    getUserNew = () => {
        this.fetch(urlCfg.personalCenter)
            .subscribe(res => {
                if (res && res.status === 0) {
                    this.setState({
                        userType: res.data.info.iden_type
                    });
                }
            });
    }

    //获取数据
    getRecord = () => {
        this.fetch(urlCfg.myDetailed)
            .subscribe(res => {
                if (res && res.status === 0) {
                    this.setState({
                        Detailed: res.data
                    });
                }
            });
    }

    //子页面返回的回调
    getBackChange = () => {
        this.setState({
            editModal: ''
        });
    };

    //跳转明细页面
    detailed = () => {
        appHistory.push('/myDetailed');
    }

    //新的我的收入 芳芳说这么改
    newMyIcom = () => {
        appHistory.push('/icome?status=6');
    }

    //点击我的收入的各种弹框提示
    goToMyIcome = () => {
        const {showConfirm, showAlert, userTypes} = this.props;
        const comeArr = new Map([
            ['1', Form.No_Merchant],
            ['3', Form.You_Extension_Agent],
            ['4', Form.Switching_Businessmen]
        ]);
        if (userTypes === '2') {
            appHistory.push('/icome?status=6');
        } else if (userTypes === '1') {
            showConfirm({
                title: comeArr.get(userTypes),
                callbacks: [null, () => {
                    appHistory.push('/openShopPage');//前往开店页面
                }]
            });
        } else {
            showAlert({
                title: comeArr.get(userTypes)
            });
        }
    }

    //底部结构
    defaultModel = () => {
        const {Detailed} = this.state;
        return (
            <div data-component="cash" data-role="page" className="cash">
                <div className="cash-content">
                    {
                        window.isWX ? (<AppNavBar title="资产管理"/>) : (
                            <div className="cash-content-navbar">
                                <AppNavBar
                                    nativeGoBack
                                    title="资产管理"
                                />
                                {/* <div className="detailed" onClick={this.detailed}>明细</div>  芳芳说先屏蔽*/}
                            </div>
                        )
                    }
                    <div className="money-show">
                        <div onClick={this.newMyIcom} style={{border: '1px soldi #ededed'}}>
                            <span>{Detailed.all_taking || '0'}</span>
                            <p>业务收入</p>
                        </div>
                        <div onClick={() => appHistory.push('/preparatory-mounth')}>
                            <span><i>￥</i><span className="money">{Detailed.dividend || 0}</span></span>
                            <p>月结预算</p>
                        </div>
                    </div>
                    <List>
                        <Item extra={Detailed.capital || 0} onClick={() => appHistory.push('/projected-revenue')}>记账余额<span className="icon arrows-icon"/></Item>
                        <Item extra={Detailed.exp_point || 0} onClick={() => appHistory.push('/cam-balance')}>CAM余额<span className="icon arrows-icon"/></Item>
                        <Item extra="" onClick={() => appHistory.push('/preparatory-income')}>预备收益<span className="icon arrows-icon"/></Item>
                        <Item extra="" onClick={() => appHistory.push('/withdrawal')}>CAM提现<span className="icon arrows-icon"/></Item>
                    </List>
                </div>
                {/* <div className="cash-bg"/> */}
            </div>
        );
    }

    render() {
        const {editModal} = this.state;
        return (
            <div className={classnames('my-ass', {'wx-my-ass': window.isWX})}>
                {!editModal && this.defaultModel()}
            </div>
        );
    }
}

const mapStateToProps = state => {
    const info = state.get('base');
    return {
        userTypes: info.get('userTypes')
    };
};

const mapDispatchToProps = {
    showConfirm: actionCreator.showConfirm,
    showAlert: actionCreator.showAlert,
    setUseType: actionCreator.setUseType
};

export default connect(mapStateToProps, mapDispatchToProps)(MyAssets);
