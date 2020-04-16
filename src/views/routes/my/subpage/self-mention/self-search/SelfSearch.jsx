/**
 * @desc 线下订单的搜索页面
 */
import {InputItem, Button, Icon} from 'antd-mobile';
import './SelfSearch.less';

const {urlCfg} = Configs;
const {appHistory, native} = Utils;

export default class Search extends BaseComponent {
    componentDidMount() {
        this.searchList();
    }

    state = {
        history: null, //历史记录
        textStatus: false, //右边文字状态
        keywords: '' //搜索框搜索内容
    }

    //搜索框类型跳转 false返回上级 true 进行搜索跳转
    searchType = () => {
        const {textStatus, keywords} = this.state;
        if (textStatus) {
            native('closeKeyboard');
            const timer = setTimeout(() => {
                clearTimeout(timer);
                appHistory.push(`/self-list?&keywords=${encodeURI(keywords)}`);
            }, 100);
        } else {
            appHistory.goBack();
        }
    };

    //获取历史搜索
    searchList = () => {
        this.fetch(urlCfg.orderViewHIstory)
            .subscribe((res) => {
                if (res && res.status === 0) {
                    this.setState({
                        history: res.history
                    });
                }
            });
    };

    //热门搜索和历史搜索跳转
    switchTo = (val) => {
        appHistory.push(`/self-list?&keywords=${encodeURI(val)}`);
    };

    //获取输入框文字
    getKeyWords = (val) => {
        this.setState({
            keywords: val,
            textStatus: !!val.length
        });
    };

    // 键盘搜索键事件
    keyDown = (e) => {
        if (e.keyCode === 13) {
            const {textStatus, keywords} = this.state;
            if (textStatus) {
                if (keywords.length === 0) {
                    this.setState({
                        textStatus: false
                    });
                } else {
                    appHistory.push(`/self-list?&keywords=${encodeURI(keywords)}`);
                }
            }
        }
    }

    render() {
        const {history, textStatus} = this.state;
        return (
            <div data-component="search" data-role="page" className="self-search">
                <div className="search-box ">
                    <InputItem
                        className=""
                        type="text"
                        placeholder="请输入商品名称"
                        clear
                        onKeyDown={this.keyDown}
                        onChange={(val) => this.getKeyWords(val)}
                    >
                        <Icon type="search"/>
                    </InputItem>
                    <div
                        className="search-cancel"
                        onClick={() => this.searchType()}
                    >{textStatus ? '搜索' : '取消'}
                    </div>
                </div>
                {/* <div className="search-title">历史搜索</div> */}
                <div className="search-popular aroundBlank">
                    <div className="search-title">历史搜索</div>
                    <div className="search-popular-content">
                        {
                            history && history.map((item, index) => (
                                <Button
                                    className="auxiliary-button gray"
                                    activeStyle={false}
                                    key={index.toString()}
                                    onClick={() => this.switchTo(item.keyword)}
                                >{item.keyword}
                                </Button>
                            ))
                        }
                    </div>
                </div>
            </div>
        );
    }
}