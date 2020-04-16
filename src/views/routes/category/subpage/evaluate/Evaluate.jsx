/**
 *
 * 评价页面
 */
import {Carousel, InputItem, List} from 'antd-mobile';
import AppNavBar from '../../../../common/navbar/NavBar';
import Nothing from '../../../../common/nothing/Nothing';
import './Evaluate.less';

const {urlCfg} = Configs;
const {appHistory, getUrlParam, showInfo, showSuccess} = Utils;
const {MESSAGE: {Form, Feedback}, FIELD} = Constants;

export default class Evaluate extends BaseComponent {
    state = {
        count: [], //评论数
        evaContent: [], //评论内容
        add: {}, //追加评论
        inputStatus: false, //评论弹窗状态
        content: '', //评价内容
        maxLength: 500, //评论长度
        evaId: '', //评价id
        currentIndex: 0, // 当前index
        likeStatus: [], //点赞状态
        maskPic: [],
        maskStatus: false
    }

    componentDidMount() {
        this.getEvaluate();
    }

    switchTo = (id) => {
        appHistory.push(`/evaluateDetail?id=${id}`);
    };

    //  获取评论列表数据
    getEvaluate = (type) => {
        const id = decodeURI(getUrlParam('id', encodeURI(this.props.location.search)));
        this.fetch(urlCfg.getEvaluate, {
            data: {
                id: parseInt(id, 10),
                pagesize: 10,
                page: 1,
                types: type || 0
            }
        })
            .subscribe((res) => {
                if (res.status === 0) {
                    this.setState({
                        evaContent: res.data,
                        add: res.data.add,
                        count: res.pr_num
                    });
                }
            });
    };

    //评论显示类型
    evaluate = (index) => {
        this.setState({
            currentIndex: index
        }, () => {
            this.getEvaluate(index);
        });
    };

    //显示评论弹窗
    showEva = (item) => {
        this.setState((prevState) => ({
            inputStatus: !prevState.inputStatus,
            evaId: item.id
        }));
    };

    //和别人吹水
    talkWithOther = () => {
        const id = this.state.evaId;
        const {evaContent, content} = this.state;
        this.fetch(urlCfg.talkWithOther, {
            data: {
                pingjia_id: parseInt(id, 10),
                return_nickname: evaContent.nickname,
                content: content
            }
        }).subscribe((res) => {
            if (res) {
                if (res.status === 0) {
                    showSuccess(Feedback.Evaluate_Success);
                    this.getEvaluate();
                }
                this.setState({
                    content: '',
                    inputStatus: false
                });
            }
        });
    };

    //点赞和取消点赞
    evaLike = (item) => {
        const id = item.id;
        if (item.zan) {
            this.fetch(urlCfg.notLike, {
                data: {
                    like_id: parseInt(id, 10),
                    types: 1
                }
            }).subscribe((res) => {
                if (res && res.status === 0) {
                    this.getEvaluate();
                }
            });
        } else {
            this.fetch(urlCfg.like, {
                data: {
                    like_id: parseInt(id, 10),
                    types: 1
                }
            }).subscribe((res) => {
                if (res && res.status === 0) {
                    this.getEvaluate();
                }
            });
        }
    };

    //评价跳转

    //评论内容控制
    inputChange = (val) => {
        if (val.length >= 100) {
            showInfo(Form.Error_Evaluate_Length);
        }
        this.setState({
            content: val
        });
    };

    openMask = (pic) => {
        // console.log(item);
        this.setState({
            maskPic: pic,
            maskStatus: true
        });
    };

    //轮播图
    returnBanner = (arr) => (
        <Carousel
            autoplay={false}
            infinite
        >
            {arr.map((item, index) => (
                <div key={item}>
                    <img
                        src={item}
                        className="banner-img"
                        alt=""
                    />
                </div>
            ))}
        </Carousel>
    );

    maskClose = () => {
        this.setState({
            maskPic: [],
            maskStatus: false
        });
    };

    render() {
        const {count, evaContent, inputStatus, content, maxLength, currentIndex, maskPic, maskStatus} = this.state;
        const titleList = ['全部', '好评', '中评', '差评', '有图', '追评'];
        return (
            <div data-component="Evaluate" data-role="page" className="evaluate-page">
                {/*商品评价*/}
                <AppNavBar title="商品评价"/>
                {
                    evaContent.length > 0 ? (
                        <div className="eva-content">
                            {/*评价条数*/}
                            <div className="evaluation-strip">
                                <div className="evaluate">
                                    {
                                        titleList.map((item, index) => (
                                            <span
                                                onClick={() => this.evaluate(index)}
                                                className={index === currentIndex ? 'selected' : null}
                                                key={item}
                                            >{item}({count[index]})
                                            </span>
                                        ))
                                    }
                                </div>
                            </div>
                            {/* 用户评论*/}
                            <div className="user-reviews">
                                {
                                    evaContent.map((item) => (
                                        <div className="user-reviews-box" key={item.id}>
                                            <div className="user">
                                                <div className="user-top">
                                                    <div className="logo">
                                                        <img src={item.avatarUrl} alt=""/>
                                                    </div>
                                                    <div className="name">
                                                        <div className="user-name">{item.nickname}</div>
                                                        <div className="time">{item.crtdate}</div>
                                                    </div>
                                                    <div className="logo-left">
                                                        {item.zan_num}点赞
                                                        <span
                                                            className={`icon support ${item.zan === 1 ? 'suport-color' : ''}`}
                                                            onClick={() => this.evaLike(item)}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="frames">
                                                    <div className="word" onClick={() => this.switchTo(item.id)}>{item.content}</div>
                                                    <div className="picture">
                                                        <ul>
                                                            {
                                                                item.pics ? item.pics.map((pic, index) => (
                                                                    <li
                                                                        key={index.toString()}
                                                                        onClick={() => this.openMask(item.pics)}
                                                                    >
                                                                        <img src={pic}/>
                                                                    </li>
                                                                )) : null
                                                            }
                                                        </ul>
                                                    </div>
                                                    {item.add && (<div className="review">追评</div>)}
                                                    {/*<div className="comment-bar">{item.add.content}</div>*/}
                                                    {
                                                        item.add && (
                                                            <React.Fragment>
                                                                <div className="word">{item.add.content}</div>
                                                                <div className="picture">
                                                                    <ul>
                                                                        {
                                                                            item.add.pics ? item.add.pics.map((pic, index) => (
                                                                                <li
                                                                                    key={index.toString()}
                                                                                    onClick={() => this.openMask(item.add.pics)}
                                                                                >
                                                                                    <img src={pic}/>
                                                                                </li>
                                                                            )) : null
                                                                        }
                                                                    </ul>
                                                                </div>
                                                            </React.Fragment>
                                                        )
                                                    }
                                                    <div className="chat-box">
                                                        {
                                                            item.return_content && (<div className="chat">商家回复：{item.return_content}</div>)
                                                        }
                                                        <div
                                                            className="chat see"
                                                            onClick={() => this.switchTo(item.id)}
                                                        >查看
                                                        </div>
                                                    </div>
                                                    <div className="frequency">
                                                        <div className="frequency-l">浏览: {item.hits}</div>
                                                        <div className="frequency-r" onClick={() => this.showEva(item)}>
                                                            <span className="news-eva">评价 </span>
                                                            <span className="icon information-box"/>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                }
                            </div>
                        </div>
                    ) : (
                        <Nothing text={FIELD.No_Comment} title=""/>
                    )
                }
                {/*评论弹窗*/}
                {inputStatus && (
                    <div className="eva-input">
                        <List>
                            <InputItem
                                clear
                                placeholder="请输入您的评价"
                                value={content}
                                maxLength={maxLength}
                                onChange={(val) => this.inputChange(val)}
                            />
                            <span className="send-out" onClick={this.talkWithOther}>发送</span>
                        </List>
                    </div>
                )}
                {
                    maskStatus && (
                        <div className="picMask" onClick={this.maskClose}>
                            {this.returnBanner(maskPic)}
                        </div>
                    )
                }
            </div>
        );
    }
}
