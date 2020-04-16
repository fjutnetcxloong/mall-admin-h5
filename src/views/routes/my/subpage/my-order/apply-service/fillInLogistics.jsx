//京东填写物流
import {connect} from 'react-redux';
import {Picker, InputItem, Button, DatePickerView} from 'antd-mobile';
import {baseActionCreator as actionCreator} from '../../../../../../redux/baseAction';
import AppNavBar from '../../../../../common/navbar/NavBar';
import './ReturnGoods.less';


const {showInfo, appHistory, getUrlParam} = Utils;
const {urlCfg} = Configs;
class JDLogistics extends BaseComponent {
    //获取路由过来的信息
    getPropsData = (data) => (decodeURI(getUrlParam(data, encodeURI(this.props.location.search))) === 'null' ? '' : decodeURI(getUrlParam(data, encodeURI(this.props.location.search))))

    state = {
        applyTitle: '',
        tiemrGoodValue: '', //保存的时间的值
        logistArr: [], //物流集合
        timeValue: null, //发货时间的值
        timerSure: false, //是否选择了发货时间
        id: this.getPropsData('id'),
        shopperName: this.getPropsData('shopperName'), //店家姓名
        shopperPhone: this.getPropsData('shopperPhone'), //店家电话
        shopperArea: this.getPropsData('shopperArea') //店家地址
    };

    componentDidMount() {
        this.getLogisticsList();
    }

    //获取物流列表
    getLogisticsList = () => {
        this.fetch(urlCfg.getLogisticsList)
            .subscribe(res => {
                if (res && res.status === 0) {
                    res.data.forEach(item => {
                        item.label = item.cate2;
                        item.value = item.id;
                    });
                    this.setState({
                        logistArr: [res.data]
                    });
                }
            });
    }

    //物流切换
    provinceChange = (value) => {
        let str = '';
        this.state.logistArr[0].forEach(item => {
            if (item.id === value[0]) {
                str = item.label;
            }
        });
        this.setState({
            applyTitle: str,
            applyId: value[0]
        });
    }

    //物流单号填写
    inputChange = (value) => {
        this.setState({
            logistMain: value
        });
    }

    //提交申请
    submit = () => {
        const {applyTitle, logistMain, tiemrGoodValue, id} = this.state;
        let timer = tiemrGoodValue;
        if (!timer) { //没有选择发货时间，则默认处理
            timer = this.formatDate(new Date());
        }
        if (!applyTitle) {
            showInfo('请选择物流');
            return;
        }
        if (!logistMain) {
            showInfo('请填写物流单号');
            return;
        }
        if (logistMain.length < 8) {
            showInfo('请输入正确的物流单号');
            return;
        }
        this.fetch(urlCfg.refurefundOrderExpressndDetail, {data: {return_id: id, express_name: applyTitle, express_no: logistMain, date: timer}})
            .subscribe(res => {
                if (res && res.status === 0) {
                    showInfo('提交成功');
                    appHistory.replace(`/refundDetails?id=${id}`);
                }
            });
    }

    //时间戳转时间
    formatDate = (date) => {
        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        const day = date.getDate();
        const hour = date.getHours();
        const minute = date.getMinutes();
        const second = date.getSeconds();
        return year + '-' + (String(month).length > 1 ? month : '0' + month) + '-'
        + (String(day).length > 1 ? day : '0' + day) + ' ' + (String(hour).length > 1 ? hour : '0' + hour) + ':' + (String(minute).length > 1 ? minute : '0' + minute)
        + ':' + (String(second).length > 1 ? second : '0' + second);
    }

    //时间对象，组件的时间值
    onChange = (value) => {
        this.setState({timeValue: value});
    };

    //保存的 时间的值
    onValueChange = (...args) => {
        let str = '';
        const arr = [];
        args[0].forEach(item => {
            arr.push(this.addZero(Number(item)));
        });
        str = arr.slice(0, 3).join('-');
        str += ' ' + arr.slice(3).join(':') + ':00';
        this.setState({
            tiemrGoodValue: str
        });
    };

    //补零
    addZero = (num) => (num < 10 ? '0' + num : num)

    timerChooseSure = () => {
        this.setState((prevState) => ({
            timerSure: !prevState.timerSure
        }));
    }

    render() {
        const {applyTitle, logistArr, logistMain, timerSure, tiemrGoodValue, shopperName, shopperPhone, shopperArea} = this.state;
        return (
            <div data-component="JDLogistics" data-role="page" className="JDLogistics">
                <AppNavBar title="填写物流"/>
                <div className="address-box">
                    <div className="address">
                        <div className="shop-name-box">
                            <span className="shop-name">店家姓名</span>
                            <span>{shopperName}</span>
                            <span>{shopperPhone}</span>
                        </div>
                        <div className="position-box">
                            <span className="position">收货地址</span>
                            <span>{shopperArea}</span>
                        </div>
                        <p className="shop-info">商家已同意申请，请尽快寄出商品，同时填写相关的物流信息</p>
                    </div>
                </div>
                <div className="Apply-botton">
                    <div className="Apply-list">
                        {/* <div className="Apply-list-text">物流选择</div> */}
                        <div className="Apply-list-select">
                            <div className="Apply-picker">
                                <Picker
                                    onChange={this.provinceChange}
                                    cascade={false}
                                    data={logistArr}
                                    cols={1}
                                >
                                    <div>
                                        <span className={applyTitle ? 'Apply-texts activeShow' : 'Apply-texts'}>{applyTitle || '请选择物流公司'}</span>
                                        <span className="icon icon-Apply-tight"/>
                                    </div>
                                </Picker>
                            </div>
                        </div>
                    </div>
                    <div className="Apply-list">
                        <div className={logistMain ? 'Apply-list-select activeShow' : 'Apply-list-select'}>
                            <InputItem
                                clear
                                type="number"
                                onChange={this.inputChange}
                                placeholder="请输入物流单号"
                            />
                        </div>
                    </div>
                    <div className="Apply-list">
                        {/* <div className="Apply-list-text">物流选择</div> */}
                        <div className="Apply-list-select">
                            <div className="Apply-picker" onClick={this.timerChooseSure}>
                                <div>
                                    <span className={tiemrGoodValue ? 'Apply-texts activeShow' : 'Apply-texts'}>{tiemrGoodValue || '请选择发货的时间'}</span>
                                    <span className="icon icon-Apply-tight"/>
                                </div>
                            </div>
                        </div>
                    </div>
                    {
                        timerSure && (
                            <div className="time-cloose">
                                <DatePickerView
                                    value={this.state.timeValue}
                                    onChange={this.onChange}
                                    onValueChange={this.onValueChange}
                                />
                            </div>
                        )
                    }
                    <div className="button">
                        {!timerSure && <Button onClick={this.submit} className="large-button disable-button">提交</Button>}
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

export default connect(mapStateToProps, mapDispatchToProps)(JDLogistics);
