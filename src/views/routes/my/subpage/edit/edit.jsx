/**我的设置页面 */

import React from 'react';
import {connect} from 'react-redux';
import {List, Button} from 'antd-mobile';
import AppNavBar from '../../../../common/navbar/NavBar';
import {myActionCreator as actionCreator} from '../../actions/index';
import {baseActionCreator} from '../../../../../redux/baseAction';
import './edit.less';

const Item = List.Item;
const {appHistory, systemApi: {removeValue}, native, showInfo} = Utils;
const {urlCfg} = Configs;
const {LOCALSTORAGE, MESSAGE: {Feedback}, WEB_NAME} = Constants;
class Edit extends BaseComponent {
    componentDidMount() {
        const {userInfo, getUserInfo} = this.props;
        if (!userInfo) {
            getUserInfo();
        }
    }

    //初始化列表数据
    initListData = () => {
        const {userInfo} = this.props;
        const itemList = [
            {
                key: '1',
                name: 'margin',
                child: [
                    {
                        key: '1-1',
                        extra: '修改',
                        param: '/extname?router=extname',
                        subName: 'pig',
                        value: '昵称',
                        moredes: userInfo && userInfo.nickname
                    },
                    {
                        key: '1-2',
                        name: 'pho',
                        extra: '暂不可修改',
                        subName: 'phone',
                        value: '手机号',
                        moredes: userInfo && userInfo.phone
                    },
                    {
                        key: '1-3',
                        name: 'pass',
                        arrow: 'horizontal',
                        param: '/password',
                        subName: 'lock',
                        value: '密码管理'
                    },
                    {
                        key: '1-4',
                        name: 'see',
                        arrow: 'horizontal',
                        param: '/enid?router=enid',
                        subName: 'before',
                        more: true,
                        value: '源头UID'
                    },
                    {
                        key: '1-5',
                        name: 'adr',
                        arrow: 'horizontal',
                        param: '/address',
                        subName: 'address',
                        value: '地址管理'
                    }
                ]
            },
            !window.isWX ? {
                key: '2',
                name: 'wec',
                extra: '去绑定',
                hybird: process.env.NATIVE,
                subName: 'binding',
                value: '微信绑定'
            } : null,
            {
                key: '3',
                name: 'margin',
                child: [
                    {
                        key: '3-1',
                        extra: (userInfo && userInfo.etone_acc_user && userInfo.etone_acc_shopper) ? '修改' : '绑定',
                        param: '/bankCard',
                        subName: 'bankCard',
                        value: '我的银行卡'
                    },
                    {
                        key: '3-2',
                        extra: (userInfo && userInfo.address.length > 0) ? userInfo.address : '修改', //只允许修改一次
                        param: (userInfo && userInfo.address.length > 0) ? '' : '/locationarea?router=locationarea', //只允许修改一次
                        subName: 'locationarea',
                        name: 'area',
                        value: '当前区域'
                        // moredes: userInfo && (userInfo.address ? userInfo.address.join('-') : '')
                    }
                ]
            },
            // {
            //     key: '4',
            //     name: 'margin margin-one',
            //     child: [
            //         {
            //             key: '5-1',
            //             name: 'not',
            //             arrow: 'horizontal',
            //             param: '/information',
            //             subName: 'news',
            //             value: '消息通知'
            //         }
            //     ]
            // },甘泽龙说先隐藏 ，，10.24
            // {
            //     key: '5',
            //     name: 'not',
            //     arrow: 'horizontal',
            //     param: '/feedback',
            //     subName: 'feedback',
            //     value: '问题反馈'
            // },//问题反馈暂时不要，说是有im，暂时先放着
            {
                key: '5',
                name: 'not',
                arrow: 'horizontal',
                param: '/userAgreementDetail?router=userAgreementDetail',
                subName: 'about',
                value: '关于' + WEB_NAME
            }
        ];
        if (userInfo && userInfo.wxid !== 0) {
            itemList.splice(1, 1);
        }
        return this.renderListItem(itemList);
    };

    //渲染列表
    renderListItem = list => {
        const listItem = [];
        list.forEach(item => {
            if (item) {
                if (item.child) {
                    listItem.push(
                        <div key={item.key} className={item.name}>
                            {this.renderListItem(item.child)}
                        </div>
                    );
                } else {
                    listItem.push(
                        <Item
                            key={item.key}
                            className={item.name || ''}
                            extra={item.extra || ''}
                            arrow={item.arrow || ''}
                            onClick={() => {
                                this.selectFun(item);
                            }}
                        >
                            <div className={`${item.subName}-box`}>
                                <span className={`icon ${item.subName}`}/>
                            </div>
                            {item.value}
                            {
                                item.moredes && <span className="moredes">{item.moredes}</span>
                            }
                        </Item>
                    );
                }
            }
        });
        return listItem;
    };

    //选择函数
    selectFun = item => {
        const {userInfo} = this.props;
        if (item.hybird) {
            this.bindingWeChat();
        } else if (item.param) {
            //判断是否有源头uid，locker_id状态为0则没有；需跳转到确认页面
            if (item.more && userInfo.locker_id === 0) {
                this.switchTo('/source?router=source');
            } else {
                this.switchTo(item.param);
            }
        }
    };

    //绑定微信
    bindingWeChat = () => {
        const {getUserInfo} = this.props;
        native('bindWxCallback', {'': ''}, (res) => {
            native('goH5');
            const data = res ? JSON.parse(res) : '';
            if (data.status === '0') {
                showInfo(Feedback.wxbind_Success);
                getUserInfo();
            } else {
                showInfo(data.message);
            }
        });
    };

    //页面跳转
    switchTo = arg => {
        appHistory.push(arg);
    };

    //登出账号
    signOut = () => {
        const {removeUserInfo, setUserToken, setUseType, delMyInfo, removebankInfo, removeNickNameInfo, removeAressInfo, removeRegionInfo, showConfirm} = this.props;
        showConfirm({
            title: '确定退出吗？',
            callbacks: [null, () => {
                if (process.env.NATIVE) {
                    //重定向到原生登录页
                    native('loginoutCallback');
                } else {
                    appHistory.push('/login');
                }
                //清除用户的身份类型
                setUseType('');
                //清除token，让其跳转到登陆页
                removeValue(LOCALSTORAGE.USER_TOKEN);
                setUserToken('');
                //清除当前页面redux
                removeUserInfo('');
                removebankInfo();
                removeNickNameInfo('');
                removeAressInfo();
                removeRegionInfo('');
                //清除我的页面redux
                delMyInfo();
            }]
        });
    };

    //改变头像
    changeTheAvatar = () => {
        if (process.env.NATIVE) {
            const arr = [];
            native('picCallback', {num: 1}, (res) => {
                const data = res ? JSON.parse(res) : '';
                if (data && data.status === '0') {
                    data.data.img.forEach(item => {
                        arr.push({imgB: item[0], imgS: item[1]});
                        this.updataImg(arr);
                    });
                }
            });
        }
    }

    //更换头像
    updataImg = (data) => {
        const {getUserInfo, getMyInfo} = this.props;
        this.fetch(urlCfg.changeAheAvatar, {data: {file: encodeURIComponent(data[0].imgB), filex: encodeURIComponent(data[0].imgS)}})
            .subscribe(res => {
                if (res && res.status === 0) {
                    getUserInfo();//设置页面
                    getMyInfo();//我的页面
                }
            });
    }

    //切换账号
    switchingAccounts = () => {
        appHistory.push('/account');
    }

    render() {
        const {userInfo} = this.props;
        return (
            <div data-component="edit" data-role="page" className="edit-add">
                <AppNavBar nativeGoBack title="设置"/>
                <div className="banner">
                    <div className="banner-center">
                        <img
                            src={userInfo && userInfo.avatarUrl}
                            alt=""
                            onClick={this.changeTheAvatar}
                            onError={(e) => { e.target.src = userInfo.defaultUrl }}
                        />
                        {/* <div className="my-name">{nickname}</div> ff说是将昵称去掉，自己先留着 */}
                        <div>UID:{userInfo && userInfo.no}</div>
                    </div>
                </div>
                <List className="my-list">{this.initListData()}</List>
                {/* <Button
                    className="logOut"
                    onClick={this.switchingAccounts}
                >
                    切换账号
                </Button> */}
                {window.isWX ? null : (
                    <Button
                        className="logOut"
                        onClick={this.signOut}
                    >
                    退出当前账号
                    </Button>
                )}
            </div>
        );
    }
}

const mapStateToProps = state => {
    const EditInfo = state.get('my');
    return {
        userInfo: EditInfo.get('userInfo')
    };
};

const mapDispatchToProps = {
    getUserInfo: actionCreator.getUserInfo,
    removeUserInfo: actionCreator.removeUserInfo,
    removebankInfo: actionCreator.removebankInfo,
    removeNickNameInfo: actionCreator.removeNickNameInfo,
    removeAressInfo: actionCreator.removeAressInfo,
    removeRegionInfo: actionCreator.removeRegionInfo,
    delMyInfo: actionCreator.delMyInfo,
    getMyInfo: actionCreator.getMyInfo,
    showConfirm: baseActionCreator.showConfirm,
    setUserToken: baseActionCreator.setUserToken,
    setUseType: baseActionCreator.setUseType
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Edit);
