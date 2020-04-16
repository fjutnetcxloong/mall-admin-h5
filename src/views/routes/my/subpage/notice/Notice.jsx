/**消息页面 */
import {Tabs, Checkbox, TabBar, NavBar, Icon, ListView, PullToRefresh} from 'antd-mobile';
import Infonew from './Info';
import Nothing from '../../../../common/nothing/Nothing';
import Animation from '../../../../common/animation/Animation';
import {ListFooter} from '../../../../common/list-footer';
import './Notice.less';

const {appHistory, showInfo, showSuccess, native} = Utils;
const {MESSAGE: {Form, Feedback}, FIELD} = Constants;
const {urlCfg} = Configs;

const CheckboxItem = Checkbox.CheckboxItem;
const tabs = [
    {title: '我的消息', key: 1},
    {title: '平台消息', key: 2}
];
export default class Notice extends BaseComponent {
    constructor() {
        super();
        const dataSource = new ListView.DataSource({
            rowHasChanged: (row1, row2) => row1 !== row2
        });
        const dataplatform = new ListView.DataSource({
            rowHasChanged: (row1, row2) => row1 !== row2
        });
        this.temp = {
            stackData: [],
            stackShopData: [],
            isLoading: true,
            pagesize: 15
        };
        this.state = {
            pageMu: 1, //我的消息的页数
            pagePlat: 1, //平台消息的页数
            dataSource, //我的消息的集合 listView
            dataplatform, //平台消息的集合 listView
            stateStutes: 1, //1 我的消息 2 平台消息
            rightName: '管理', //右上角的按钮文字
            tabKey: 0, //tab状态
            checkedAll: false, //全选状态
            editModal: '', //当前显示状态
            refreshing: false, //下拉内容是否显示
            pageCount: -1, //总页码
            rightStatus: 1, //右上角按钮的状态，1 为管理
            hasMore: false, //底部加载文字的显示
            height: document.documentElement.clientHeight - (window.isWX ? document.documentElement.clientWidth / 7.5 * 0.88 : document.documentElement.clientWidth / 7.5 * 2.3)
        };
    }

    componentDidMount() {
        this.getMessage(this.state.pageMu);
    }

    getMessage = (page, noLoading = false) => {
        const {stateStutes, tabKey} = this.state;
        this.temp.isLoading = true;
        this.setState({
            hasMore: true
        });
        this.fetch(urlCfg.getMyMessage, {data: {type: stateStutes, page, pagesize: this.temp.pagesize}}, noLoading)
            .subscribe((res) => {
                this.temp.isLoading = false;
                if (res && res.status === 0) {
                    res.data.forEach(item => {
                        item.checked = false;
                    });
                    if (tabKey === 0) {
                        if (page === 1) {
                            this.temp.stackData = res.data;
                        } else {
                            this.temp.stackData = this.temp.stackData.concat(res.data);
                        }
                        if (page <= res.page_count) {
                            this.setState({
                                hasMore: false
                            });
                        }
                        this.setState((prevState) => ({
                            dataSource: prevState.dataSource.cloneWithRows(this.temp.stackData),
                            pageCount: res.page_count,
                            refreshing: false
                        }));
                    } else {
                        if (page === 1) {
                            this.temp.stackShopData = res.data;
                        } else {
                            this.temp.stackShopData = this.temp.stackData.concat(res.data);
                        }
                        if (page <= res.page_count) {
                            this.setState({
                                hasMore: false
                            });
                        }
                        this.setState((prevState) => ({
                            dataplatform: prevState.dataSource.cloneWithRows(this.temp.stackShopData),
                            pageCount: res.page_count,
                            refreshing: false
                        }));
                    }
                }
            });
    }

    //下拉刷新
    onRefresh = () => {
        this.setState({
            refreshing: true
        });
        const {tabKey} = this.state;
        if (tabKey === 0) {
            this.setState({
                pageMu: 1
            }, () => {
                this.getMessage(this.state.pageMu, true);
            });
        } else {
            this.setState({
                pagePlat: 1
            }, () => {
                this.getMessage(this.state.pagePlat, true);
            });
        }
    };

    //点击tab栏右边的文字
    rightContent = (data) => {
        const {rightStatus} = this.state;
        //这里需要重新声明一个对象，以此来让dataSource察觉数据有变化，才会触发setState;
        const arr = this.temp.stackData.map(item => Object.assign({}, item));
        const arrPl = this.temp.stackShopData.map(item => Object.assign({}, item));
        if (rightStatus === 1) {
            this.setState((prevState) => ({
                rightName: '完成',
                dataSource: prevState.dataSource.cloneWithRows(arr),
                dataplatform: prevState.dataSource.cloneWithRows(arrPl),
                rightStatus: 2
            }));
        } else {
            this.setState((prevState) => ({
                rightName: '管理',
                dataSource: prevState.dataSource.cloneWithRows(arr),
                dataplatform: prevState.dataSource.cloneWithRows(arrPl),
                rightStatus: 1
            }));
        }
    }

    //单选
    onChangeOne = (data, value) => {
        const {tabKey} = this.state;
        if (tabKey === 0) {
            this.temp.stackData.forEach(num => {
                if (num.id === value) {
                    num.checked = data.target.checked;
                }
            });
            const arr = this.temp.stackData.map(item => Object.assign({}, item));
            this.setState((prevState) => ({
                dataSource: prevState.dataSource.cloneWithRows(arr)
            }));
        } else {
            this.temp.stackShopData.forEach(num => {
                if (num.id === value) {
                    num.checked = data.target.checked;
                }
            });
            const arr = this.temp.stackShopData.map(item => Object.assign({}, item));
            this.setState((prevState) => ({
                dataplatform: prevState.dataplatform.cloneWithRows(arr)
            }));
        }
    }

    //全选
    onChangeAll = (data) => {
        const onOff = data.target.checked;
        const {tabKey} = this.state;
        if (tabKey === 1) {
            this.temp.stackShopData.forEach(item => {
                item.checked = onOff;
            });
            const arr = this.temp.stackShopData.map(item => Object.assign({}, item));
            this.setState((prevState) => ({
                checkedAll: onOff,
                dataplatform: prevState.dataplatform.cloneWithRows(arr)
            }));
        } else {
            this.temp.stackData.forEach(item => {
                item.checked = onOff;
            });
            const arr = this.temp.stackData.map(item => Object.assign({}, item));
            this.setState((prevState) => ({
                checkedAll: onOff,
                dataSource: prevState.dataSource.cloneWithRows(arr)
            }));
        }
    }

    //标记为已读
    aleadyRead = (data) => {
        this.readADelete(1);
    }

    //删除
    deleteData = (data) => {
        this.readADelete(2);
    }

    //删除和标记已读
    readADelete = (data) => {
        //操作数据，不请求列表接口
        const {tabKey} = this.state;
        const arr = [];
        if (tabKey === 0) {
            this.temp.stackData.forEach(item => {
                if (item.checked) {
                    arr.push(item.id);
                }
            });
        } else if (tabKey === 1) {
            this.temp.stackShopData.forEach(item => {
                if (item.checked) {
                    arr.push(item.id);
                }
            });
        }
        if (arr.length) {
            this.fetch(urlCfg.alreadyReadDelete, {method: 'post', data: {type: data, ids: arr}})
                .subscribe((res) => {
                    if (res.status === 0) {
                        showSuccess(Feedback.Handle_Success);
                        if (tabKey === 0) {
                            let arr3 = [];
                            //data === 1设置已读
                            if (data === 1) {
                                this.temp.stackData.forEach(item => {
                                    arr.forEach(value => {
                                        if (value === item.id) {
                                            item.if_read = '1';
                                            item.checked = false;
                                        }
                                    });
                                });
                                arr3 = this.temp.stackData.map(item => Object.assign({}, item));
                                this.setState((proveState) => ({
                                    dataSource: proveState.dataSource.cloneWithRows(arr3)
                                }));
                            } else {
                                //设置删除
                                for (let i = 0; i < this.temp.stackData.length; i++) {
                                    for (let j = 0; j < arr.length; j++) {
                                        if (arr[j] === this.temp.stackData[i].id) {
                                            this.temp.stackData.splice(i, 1);
                                        }
                                    }
                                }
                                this.setState((proveState) => ({
                                    dataSource: proveState.dataSource.cloneWithRows(this.temp.stackData)
                                }));
                            }
                        } else if (tabKey === 1) {
                            let arr4 = [];
                            if (data === 1) {
                                this.temp.stackShopData.forEach(item => {
                                    arr.forEach(value => {
                                        if (value === item.id) {
                                            item.if_read = '1';
                                            item.checked = false;
                                        }
                                    });
                                });
                                arr4 = this.temp.stackShopData.map(item => Object.assign({}, item));
                                this.setState((proveState) => ({
                                    dataplatform: proveState.dataplatform.cloneWithRows(arr4)
                                }));
                            } else {
                                for (let i = 0; i < this.temp.stackShopData.length; i++) {
                                    for (let j = 0; j < arr.length; j++) {
                                        if (arr[j] === this.temp.stackShopData[i].id) {
                                            this.temp.stackShopData.splice(i, 1);
                                        }
                                    }
                                }
                                this.setState((proveState) => ({
                                    dataplatform: proveState.dataplatform.cloneWithRows(this.temp.stackShopData)
                                }));
                            }
                        }
                    }
                });
        } else {
            showInfo(Form.No_Data);
        }
    }

    //tab切换的时候
    tabChange = (data) => {
        const {platfoOn, pagePlat} = this.state;
        const onOff = this.temp.stackData.every(item => item.checked === true);
        const onOff2 = this.temp.stackShopData.every(item => item.checked === true);
        // this.temp.stackData = [];
        if (data.key === 1) {
            if (this.temp.stackData.length && onOff) {
                this.setState({
                    checkedAll: true
                });
            } else {
                this.setState({
                    checkedAll: false
                });
            }
            this.setState({
                tabKey: 0,
                stateStutes: 1,
                rightName: '管理'
            });
        } else {
            if (this.temp.stackShopData.length && onOff2) {
                this.setState({
                    checkedAll: true
                });
            } else {
                this.setState({
                    checkedAll: false
                });
            }
            this.setState({
                tabKey: 1,
                stateStutes: 2,
                rightName: '管理'
            }, () => {
                if (!platfoOn) {
                    this.setState({
                        platfoOn: true
                    }, () => {
                        this.setState({
                            hasMore: false
                        });
                        this.getMessage(pagePlat);
                    });
                }
            });
        }
    }

    //单击某条信息
    newInfo = (id) => {
        const {tabKey} = this.state;
        //这里的判断是，点击哪个，将哪个设置为已读
        if (tabKey === 0) {
            this.temp.stackData.forEach(item => {
                if (item.id === id) {
                    item.if_read = '1';
                }
            });
            const arr = this.temp.stackData.map(item => Object.assign({}, item));
            this.setState((prevState) => ({
                dataSource: prevState.dataSource.cloneWithRows(arr)
            }));
        } else {
            this.temp.stackShopData.forEach(item => {
                if (item.id === id) {
                    item.if_read = '1';
                }
            });
            const arr = this.temp.stackShopData.map(item => Object.assign({}, item));
            this.setState((prevState) => ({
                dataplatform: prevState.dataplatform.cloneWithRows(arr)
            }));
        }
        this.setState({
            editModal: 'info',
            infoId: id
        });
    }

    //子页面的回调
    goBackModal = () => {
        this.setState({
            editModal: ''
        });
    }

    goBack = () => {
        if (process.env.NATIVE) {
            native('goBack');
        } else {
            appHistory.goBack();
        }
    }

    //上拉加载
    onEndReached = (event) => {
        const {pageCount, pageMu, pagePlat, tabKey} = this.state;
        if (this.temp.isLoading) return;
        if (tabKey === 0) {
            if (pageMu >= pageCount) {
                this.setState({
                    showBottomBar: true,
                    checkedAll: false
                }, () => {
                    this.temp.isLoading = false;
                });
            } else {
                this.setState((pervState) => ({
                    pageMu: pervState.pageMu + 1,
                    checkedAll: false
                }), () => {
                    this.getMessage(this.state.pageMu);
                });
            }
        } else if (tabKey === 1) {
            if (pagePlat >= pageCount) {
                this.setState({
                    showBottomBar: true,
                    checkedAll: false
                }, () => {
                    this.temp.isLoading = false;
                });
            } else {
                this.setState((pervState) => ({
                    pagePlat: pervState.pagePlat + 1,
                    checkedAll: false
                }), () => {
                    this.getMessage(this.state.pagePlat);
                });
            }
        }
    };

    //页面的主体内容
    messageModule = (row) => {
        const {dataSource, height, refreshing, dataplatform, tabKey, hasMore} = this.state;
        let blockModal = <div/>;
        if (tabKey === 0) {
            blockModal = dataSource.getRowCount() > 0 ? (
                <ListView
                    dataSource={dataSource}
                    initialListSize={this.temp.stackData.pagesize}
                    // renderBodyComponent={() => <ListBody/>}
                    renderRow={row}
                    style={{
                        height: height
                    }}
                    pageSize={this.temp.stackData.pagesize}
                    onEndReachedThreshold={20}
                    onEndReached={this.onEndReached}
                    renderFooter={() => ListFooter(hasMore)}
                    pullToRefresh={(
                        <PullToRefresh
                            refreshing={refreshing}
                            onRefresh={this.onRefresh}
                            damping={70}
                            indicator={{
                                // activate: <Animation ref={ref => { this.Animation = ref }}/>,
                                // deactivate: ' ',
                                release: <Animation ref={ref => { this.Animation = ref }}/>
                                // finish: <Animation ref={ref => { this.Animation = ref }}/>
                            }}
                        />
                    )}
                />
            ) : <Nothing text={FIELD.No_News} title=""/>;
        } else if (tabKey === 1) {
            blockModal = dataplatform.getRowCount() > 0 ? (
                <ListView
                    dataSource={dataplatform}
                    initialListSize={this.temp.pagesize}
                    // renderBodyComponent={() => <ListBody/>}
                    renderRow={row}
                    style={{
                        height: height
                    }}
                    pageSize={this.temp.pagesize}
                    onEndReachedThreshold={20}
                    onEndReached={this.onEndReached}
                    renderFooter={() => ListFooter(hasMore)}
                    pullToRefresh={(
                        <PullToRefresh
                            refreshing={refreshing}
                            onRefresh={this.onRefresh}
                            damping={70}
                            indicator={{
                                release: <Animation ref={ref => { this.Animation = ref }}/>
                            }}
                        />
                    )}
                />
            ) : <Nothing text={FIELD.No_News} title=""/>;
        }
        return blockModal;
    };

    //右上角的按钮
    navButton = () => {
        const {tabKey, dataplatform, dataSource, rightName} = this.state;
        if (tabKey === 1) {
            return dataplatform.getRowCount() > 0 && <span onClick={this.rightContent}>{rightName}</span>;
        }
        return dataSource.getRowCount() > 0 && <span onClick={this.rightContent}>{rightName}</span>;
    }

    render() {
        const {editModal, rightStatus} = this.state;
        const row = item => {
            if (rightStatus === 2) {
                return (
                    <CheckboxItem checked={item.checked} onChange={(data) => this.onChangeOne(data, item.id, item)}>
                        <div className="text frontier">
                            <div onClick={() => this.newInfo(item.id)} className={item.if_read !== '0' ? 'titleRead' : 'title-nomal'}>{item.intro}</div>
                            <div className={item.if_read === '0' ? 'date' : 'dateRead'}>{item.crtdate}</div>
                        </div>
                    </CheckboxItem>
                );
            } if (rightStatus === 1) {
                return  (
                    <div className="text message">
                        {item.if_read === '0' ? <span/> : ''}
                        <div onClick={() => this.newInfo(item.id)} className={item.if_read === '0'  ? 'title-nomal' : 'title-read'}>{item.intro}</div>
                        <div className={item.if_read === '0' ? 'date' : 'dateRead'}>{item.crtdate}</div>
                    </div>
                );
            }
            return null;
        };
        return (
            <React.Fragment>
                {
                    editModal === 'info' && <Infonew goBackModal={this.goBackModal} {...this.state}/>
                }
                {
                    !editModal && (
                        <div data-component="notice" data-role="page" className={`notice ${window.isWX ? 'WX-clear' : ''}`}>
                            {/* <AppNavBar goBackModal="native" title="消息中心"/> */}
                            {
                                window.isWX ? null : (
                                    <NavBar
                                        icon={<Icon type="left" size="lg" onClick={() => { this.goBack() }}/>}
                                        rightContent={this.navButton()}
                                    >
                                    消息中心
                                    </NavBar>
                                )
                            }
                            <Tabs
                                tabs={tabs}
                                // className={window.isWX ? 'clear' : ''}
                                initialPage={this.state.tabKey}
                                className="clear"
                                onChange={this.tabChange}
                            >
                                <div style={{backgroundColor: '@white'}}>
                                    <div className={`text-content ${rightStatus === 2 ? 'complete' : ''}`}>
                                        {this.messageModule(row)}
                                    </div>
                                </div>
                            </Tabs>
                            {
                                rightStatus === 2
                            && (
                                <div className="footer-bar">
                                    <TabBar
                                        unselectedTintColor="#595959"
                                        tintColor="@darker-black"
                                        barTintColor="white"
                                        hidden={false}
                                        tabBarPosition="bottom"
                                    >
                                        <TabBar.Item
                                            title={(
                                                <CheckboxItem checked={this.state.checkedAll} onChange={(data) => this.onChangeAll(data)} style={{marginLeft: '-32px'}}> 全选
                                                </CheckboxItem>
                                            )}
                                            key="home"
                                            icon={<i/>}
                                        />
                                        <TabBar.Item
                                            title={<span onClick={this.aleadyRead} style={{fontSize: '14px'}}>标记为已读</span>}
                                            key="category"
                                            icon={<i/>}
                                        />
                                        <TabBar.Item
                                            title={<span onClick={this.deleteData} style={{fontSize: '14px'}}>删除</span>}
                                            key="find"
                                            icon={<i/>}
                                        />
                                    </TabBar>
                                </div>
                            )
                            }
                        </div>
                    )
                }
            </React.Fragment>
        );
    }
}
