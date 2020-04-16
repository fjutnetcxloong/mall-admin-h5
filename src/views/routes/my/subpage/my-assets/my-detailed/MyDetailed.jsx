/**
 * CAM明细
 */
import {Picker} from 'antd-mobile';
import AppNavBar from '../../../../../common/navbar/NavBar';
import Nothing from '../../../../../common/nothing/Nothing';
import './MyDetailed.less';

const {FIELD} = Constants;
const {urlCfg} = Configs;

export default class MyDetailed extends BaseComponent {
    state = {
        year: '', //当前年份
        month: '', //当前月份
        income: '', //每月收入
        expend: '', //每月支出
        seasons: [], //月份选择数组
        definiteList: [] //明细列表
    };

    componentDidMount() {
        this.gainList();
    }

    //获取列表信息
    gainList = (date) => {
        this.fetch(urlCfg.assetsDetail, {data: {date}})
            .subscribe((res) => {
                if (res && res.status === 0) {
                    this.setState(prevState => ({
                        year: prevState.year || res.now.year,
                        month: prevState.month || res.now.month,
                        income: res.total.income,
                        expend: res.total.expend,
                        seasons: res.year,
                        definiteList: res.data
                    }));
                }
            });
    }

    //获取选择的月份
    detailedTimer = (data) => {
        this.setState({
            year: data[0],
            month: data[1]
        }, () => {
            this.gainList(`${data[0]}-${data[1]}`);
        });
    }

    render() {
        const {year, month, seasons, definiteList, income, expend} = this.state;
        return (
            <div className="my-detailed">
                <AppNavBar title="明细"/>
                <div className="detailed-top">
                    <div className="detailed-top-left">
                        <Picker
                            data={seasons}
                            cascade={false}
                            title="选择月份"
                            onChange={data => this.detailedTimer(data)}
                            cols={2}
                        >
                            <p className="picker-timer">
                                <div className="timer-year">{year} 年</div>
                                <div className="timer-month-bot"><span className="timer-month">{month}</span>月<span className="icon icon-right"/></div>
                            </p>
                        </Picker>
                    </div>
                    <div className="detailed-top-right">
                        <div className="collections">
                            <div className="revenue-expend">收入</div>
                            <div>+<span className="revenue-money">{income || 0}</span></div>
                        </div>
                        <div className="collections expend-collections">
                            <div className="revenue-expend">支出</div>
                            <div>-<span className="revenue-money">{expend || 0}</span></div>
                        </div>
                    </div>
                </div>
                <div className="detailed-wrap">
                    {definiteList && definiteList.length > 0 ? (
                        <div className="detailed-bottom">
                            {definiteList.map(item => (
                                <div className="detailed-list" key={item.id}>
                                    <div className="list-left">
                                        <div className="list-text">{item.desc}</div>
                                        <div className="list-timer">{item.crtdate}</div>
                                    </div>
                                    <div className="list-right">
                                        <div className="list-text">{item.types === '1' ? '+' : '-'}{item.scalar}</div>
                                        <div className="list-timer">余额：{item.remain}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="detailed-bottom">
                            <Nothing text={FIELD.No_News}/>
                        </div>
                    )}
                </div>
            </div>
        );
    }
}
