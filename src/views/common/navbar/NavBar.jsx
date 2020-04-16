import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {baseActionCreator as actionCreator} from '../../../redux/baseAction';
import {navColorO} from '../../../constants';

import './NavBar.less';

const {appHistory, native, showInfo, navColor} = Utils;
const {navColorF, navColorR} = Constants;
// const hashs = window.location.hash;
// const str = hashs.substring(hashs.length - 8);
// const hash = str;
// FIXME: 从新优化
//已优化
class NavBar extends React.PureComponent {
    static propTypes = {
        goBackModal: PropTypes.func,
        goSearch: PropTypes.func,
        nativeGoBack: PropTypes.bool,
        title: PropTypes.string,
        rightShow: PropTypes.bool,
        redBackground: PropTypes.bool,
        rightSearch: PropTypes.bool,
        rightExplain: PropTypes.bool,
        rightEdit: PropTypes.bool,
        search: PropTypes.bool,
        isEdit: PropTypes.bool,
        changeNavRight: PropTypes.oneOfType([PropTypes.bool, PropTypes.func]),
        goToSearch: PropTypes.func,
        style: PropTypes.object,
        backgroundColor: PropTypes.string,
        rightExplainClick: PropTypes.func,
        show: PropTypes.bool,
        status: PropTypes.string,
        setshoppingId: PropTypes.func
    };

    static defaultProps = {
        goBackModal: null,
        nativeGoBack: false,
        title: '',
        rightShow: false,
        redBackground: false,
        rightSearch: false,
        rightExplain: false,
        rightEdit: false,
        search: false,
        isEdit: false,
        changeNavRight: false,
        goToSearch: null,
        style: {},
        show: true,
        backgroundColor: '',
        rightExplainClick: () => {},
        // color: '',
        status: '1',
        goSearch: () => {},
        setshoppingId: () => {}
    };

    constructor(props) {
        super(props);
        this.state = {}; //初始化需要
    }

    static getDerivedStateFromProps(nextProps) {
        if (process.env.NATIVE) {
            const value = navColor(window.location.hash);
            if (value) {
                native('setNavColor', {
                    color: value === 1 ? navColorR : navColorO
                });
            } else {
                native('setNavColor', {color: navColorF});
            }
        }
        // 否则，对于state不进行任何操作
        return null;
    }

    //左边按钮图标点击样式
    backAway = () => {
        const {nativeGoBack, goBackModal} = this.props;
        this.doSomeing();
        if (process.env.NATIVE) {
            //app状态下
            if (goBackModal) {
                //如果是有返回处理函数，则执行这个函数
                goBackModal();
            } else if (nativeGoBack || appHistory.length() === 0) {
                //如果没又返回处理函数，而是有 nativeGoBack 这个原生直接下级页面的标识，则返回时走原生方法
                native('goBack');
            } else {
                //其他情况则走返回
                appHistory.goBack();
            }
        } else if (goBackModal) {
            //非原生情况，有返回执行函数就执行该函数
            goBackModal();
        } else {
            //否则就执行返回
            appHistory.goBack();
        }
    };

    //在点击返回的时候可以根据页面的不同做一些处理
    doSomeing = () => {
        const {setshoppingId} = this.props;
        const href = window.location.href;
        if (href.includes('shopHome')) { //我的店铺退出的时候，清除掉一个店铺id，为了，优惠券到分类页面的时候的判断，
            setshoppingId('');
        } else if (href.includes('listDetail')) {
            native('setNavColor', {color: navColorR});
        }
    };

    //浏览历史点击右上角回调
    changeButtonTitle = () => {
        const {isEdit} = this.props;
        this.props.changeNavRight(!isEdit);
    };

    //点击搜索图标
    goToSearch = () => {
        this.props.goToSearch();
    };

    goToIm = () => {
        if (process.env.NATIVE) {
            native('goToIm', {'': ''});
        } else {
            showInfo('im');
        }
    };

    rightExplainClick = () => {
        const {rightExplainClick} = this.props;
        rightExplainClick();
    };

    render() {
        const {
            title,
            rightShow,
            redBackground,
            goSearch,
            rightSearch,
            show,
            rightExplain,
            rightEdit,
            search,
            isEdit,
            backgroundColor,
            status
        } = this.props;
        if (window.isWX) {
            if (title) {
                document.title = title;
            }
            // return null;
        }
        return window.isWX && status === '1' ? null : (
            <div className="wrapTabNav">
                <div
                    className="navbar"
                    style={{background: backgroundColor || '@white'}}
                >
                    {redBackground ? ( //红底
                        <div>
                            {show && (
                                <div
                                    className="nav-left"
                                    onClick={this.backAway}
                                >
                                    <div className="icon-left icon"/>
                                </div>
                            )}
                            <span className="nav-title">{title}</span>
                            {rightShow && ( //是否展示 im图标
                                <div className="nav-right">
                                    <div
                                        className="icon-right icon"
                                        onClick={this.goToIm}
                                    />
                                </div>
                            )}
                            {search && ( //是否展示 搜索图标
                                <div
                                    className="nav-search"
                                    onClick={this.goToSearch}
                                >
                                    <div className="icon-search icon"/>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div>
                            {show && (
                                <div
                                    className="blackNav-left"
                                    onClick={this.backAway}
                                    style={this.props.style}
                                >
                                    <div className="icon-left icon"/>
                                </div>
                            )}
                            <span className="blackNav-title">{title}</span>
                            {rightShow && ( //是否展示 im图标
                                <div className="blackNav-right">
                                    <div
                                        className="icon-right icon"
                                        onClick={this.goToIm}
                                    />
                                </div>
                            )}
                            {rightSearch && ( //是否展示 搜索图标
                                <div className="rightSearch">
                                    <div
                                        className="icon-rightSearch icon"
                                        onClick={goSearch}
                                    />
                                </div>
                            )}
                            {rightExplain && (
                                <div
                                    className="rightExplain"
                                    onClick={this.rightExplainClick}
                                >
                                    相关说明
                                </div>
                            )}
                            {/* 浏览历史导航右侧编辑功能 */}
                            {rightEdit && (
                                <div
                                    className="right-edit"
                                    onClick={this.changeButtonTitle}
                                >
                                    {isEdit ? '完成' : '编辑'}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        );
    }
}

const mapDispatchToProps = {
    setshoppingId: actionCreator.setshoppingId
};
export default connect(null, mapDispatchToProps)(NavBar);
