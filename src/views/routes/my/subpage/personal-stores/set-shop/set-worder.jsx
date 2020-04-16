import React from 'react';
import {ListView} from 'antd-mobile';
import AppNavBar from '../../../../../common/navbar/NavBar';
import './index.less';
import {showInfo} from '../../../../../../utils/mixin';

const {urlCfg} = Configs;

class SetWorder extends BaseComponent {
    constructor(props) {
        super(props);
        this.stackData = []; //数据堆，暂存客户列表
        this.dataSource = new ListView.DataSource({
            rowHasChanged: (row1, row2) => row1 !== row2
        });
    }

    componentDidMount() {
        this.getPeople();
    }

    state  = {
        showCode: false, //是否展示二维码
        data: [],
        datas: {},
        code: '', //二維碼
        page: 1,
        pageCount: -1
    }

       //获取员工列表
       getPeople = () => {
           const {page} = this.state;
           this.fetch(urlCfg.getPeople, {data: {
               pagesize: 6,
               page: page
           }}).subscribe(res => {
               if (res && res.status === 0) {
                   this.stackData = this.stackData.concat(res.data.data);
                   this.setState({
                       data: this.stackData,
                       datas: res.data,
                       pageCount: res.data.page_count
                   });
               }
           });
       }

    showCodeFn = (code) => {
        this.setState({
            showCode: true,
            code: code
        });
    }

    onEndReached = () => {
        const {pageCount, page} = this.state;
        // console.log(pageCount, 'ssssssssss', page);
        if (page >= pageCount) {
            showInfo('没有更多员工', 1);
            return;
        }
        this.setState(prevState => ({
            page: prevState.page + 1
        }), () => {
            this.getPeople();
        });
    }

    render() {
        const {showCode, data, datas, code} = this.state;
        const row = (item) => (
            <div className="list">
                <div className="list-left">
                    <div>
                        <span>UID:</span>
                        <span>{item.no}</span>
                        <span>{item.realname}</span>
                    </div>
                    <div>{item.status === 1 ? '开启' : '关闭'}</div>
                </div>
                <div className="list-right" onClick={() => this.showCodeFn(item.qrcode)}>二维码</div>
            </div>
        );
        const height = document.documentElement.clientHeight - (window.isWX ? window.rem * 3.7 : window.rem * 4.58);
        return (
            <div data-component="set-worder" className="set-worder">
                <AppNavBar goBackModal={this.props.goBack} title="我的员工"/>
                <div className="shop-main">
                    <div>
                        {
                            data && data.length > 0 ? (
                                <p className="no-worder">{datas.total}人</p>
                            ) : (
                                <p className="no-worder">暂无员工</p>
                            )
                        }
                        <p className="worder-num">员工数</p>
                    </div>
                </div>
                <ListView
                    dataSource={this.dataSource.cloneWithRows(data)}
                    initialListSize={10}
                    renderRow={row}
                    style={{
                        height
                    }}
                    pageSize={10}
                    onEndReachedThreshold={100}
                    onEndReached={this.onEndReached}
                    renderFooter={this.footer}
                />
                {
                    showCode &&  (
                        <div className="showCode">
                            <div className="showMain">
                                <span className="icon closeCode" onClick={() => this.setState({showCode: false})}/><img src={code}/>
                            </div>
                        </div>
                    )
                }

            </div>
        );
    }
}

export default SetWorder;
