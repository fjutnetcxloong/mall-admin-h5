/**
 *
 * 评价详情
 */
import {InputItem, List} from 'antd-mobile';
import AppNavBar from '../../../../common/navbar/NavBar';
import './EvaluateDetail.less';

const {urlCfg} = Configs;
const {getUrlParam, showInfo} = Utils;
const {MESSAGE: {Form, Feedback}} = Constants;

export default class EvaluateDetail extends BaseComponent {
    state = {
        evaDetail: [],
        res: {}, //全数据
        appraise: {},
        pics: [],
        add: {},
        inputStatus: false, //底部评论框状态
        content: '', //评价内容
        maxLength: 50, //评论长度
        maskPic: '',
        maskStatus: false
    }

    componentDidMount() {
        this.getEvaDetail();
    }

    //显示评论弹窗
    showEva = (item) => {
        this.setState(prevState => (
            {
                inputStatus: !prevState.inputStatus,
                evaId: item.id
            }
        ));
    };

    inputChange = (val) => {
        if (val.length >= 50) {
            showInfo(Form.Error_Evaluate_Length);
        }
        this.setState({
            content: val
        });
    };

    //点赞
    evaLike = (item) => {
        const id = item.id;
        if (item.zan) {
            this.fetch(urlCfg.notLike, {
                data: {
                    like_id: parseInt(id, 10),
                    types: 2
                }
            }).subscribe((res) => {
                if (res && res.status === 0) {
                    showInfo(Feedback.Cancel_Success);
                    this.getEvaDetail();
                }
            });
        } else {
            this.fetch(urlCfg.like, {
                data: {
                    like_id: parseInt(id, 10),
                    types: 2
                }
            }).subscribe((res) => {
                if (res && res.status === 0) {
                    showInfo(Feedback.Like_Success);
                    this.getEvaDetail();
                }
            });
        }
    };

    //当前商品评价
    goodsEva = () => {
        const {appraise} = this.state;
        const id = decodeURI(getUrlParam('id', encodeURI(this.props.location.search)));
        if (appraise.zan) {
            this.fetch(urlCfg.notLike, {
                data: {
                    like_id: id,
                    types: 1
                }
            }).subscribe((res) => {
                if (res && res.status === 0) {
                    this.getEvaDetail();
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
                    this.getEvaDetail();
                }
            });
        }
    };

    //发送评论
    talkWithOther = () => {
        const id = decodeURI(getUrlParam('id', encodeURI(this.props.location.search)));
        const {content} = this.state;
        if (content.length === 0) {
            showInfo(Form.No_Content);
            return;
        }
        this.fetch(urlCfg.talkWithOther, {
            data: {
                pingjia_id: parseInt(id, 10),
                content: content
            }
        }).subscribe(res => {
            if (res && res.status === 0) {
                showInfo(Feedback.Evaluate_Success);
                this.getEvaDetail();
                this.setState({
                    content: ''
                });
                this.closeEav();
                document.documentElement.scrollTop = 0;
            }
        });
    };

    //关闭评价输入框
    closeEav = () => {
        this.setState({
            inputStatus: false
        });
    };

    //图片放大
    openMask = (pic) => {
        this.setState({
            maskPic: pic,
            maskStatus: true
        });
    };

    maskClose = () => {
        this.setState({
            maskPic: '',
            maskStatus: false
        });
    };

    getEvaDetail = () => {
        const id = decodeURI(getUrlParam('id', encodeURI(this.props.location.search)));
        this.fetch(urlCfg.getEvaDetail, {data: {page: 1, pagesize: 10, id: id}})
            .subscribe((res) => {
                if (res.status === 0) {
                    this.setState({
                        evaDetail: res.data,
                        res: res,
                        appraise: res.appraise,
                        pics: res.appraise.pics,
                        add: res.add
                    });
                }
            });
    };

    render() {
        const {appraise, pics, add, evaDetail, res, inputStatus, content, maxLength, maskPic, maskStatus} = this.state;
        return (
            <div data-component="EvaluateDetail" data-role="page" className="evaluate-detail">
                {/*商品评价*/}
                <AppNavBar title="商品评价"/>
                {/* 用户评论*/}
                <div className="comment-box">
                    <div className="user-reviews">
                        <div className="user bottom">
                            <div className="user-top">
                                <div className="logo">
                                    <img src={appraise.avatarUrl} alt=""/>
                                </div>
                                <div className="name">
                                    <div className="user-name">{appraise.nickname}</div>
                                    <div className="time">{appraise.crtdate}
                                        <div className="frequency-l">浏览:{appraise.hits}</div>
                                    </div>
                                </div>
                                <div className="logo-left">
                                    {appraise.zan_num} <span
                                        className={`icon support ${appraise.zan === 1 ? 'active-color' : ''}`}
                                    />
                                </div>
                            </div>
                            <div className="frames">
                                <div className="word">{appraise.content}</div>
                                <div className="picture">
                                    <ul>
                                        {
                                            pics && pics.map(pic => (
                                                <li onClick={() => this.openMask(pic)}><img src={pic} alt=""/></li>
                                            ))
                                        }
                                    </ul>
                                </div>
                                <div className="review">追评</div>
                                {/* <div className="comment-bar">{add.content}</div> */}
                                {
                                    add && (
                                        <React.Fragment>
                                            <div className="word">{add.content}</div>
                                            <div className="picture">
                                                <ul>
                                                    {
                                                        add.pics ? add.pics.map((pic, index) => (
                                                            <li
                                                                key={index.toString()}
                                                                onClick={() => this.openMask(pic)}
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
                                {
                                    appraise.return_content && (
                                        <div className="chat-box">
                                            <div className="chat">商家回复：{appraise.return_content}</div>
                                        </div>
                                    )
                                }
                            </div>
                        </div>
                    </div>
                    <div className="all-comments">
                        <h1 className="title">全部评论({res.num})</h1>
                        {
                            evaDetail.map(item => (
                                <div className="user user-reviews margin" key={item.id}>
                                    <div className="user-top">
                                        <div className="logo">
                                            <img src={item.avatarUrl} alt=""/>
                                        </div>
                                        <div className="name">
                                            <div className="user-name">{item.nickname}</div>
                                            <div className="time">{item.crtdate}</div>
                                        </div>
                                        <div className="logo-left">{item.zan_num}点赞 <span
                                            className={`icon support ${item.zan === 1 ? 'active-color' : ''}`}
                                            onClick={() => this.evaLike(item)}
                                        />
                                        </div>
                                    </div>
                                    <div className="word frame">{item.content}</div>
                                </div>
                            ))
                        }
                    </div>
                    <div className="click-button">
                        <div className="click-button-left" onClick={this.showEva}>
                            <span className="icon logo-left"/>
                            <span>评论</span>
                        </div>
                        <div onClick={this.goodsEva} className={appraise.zan === 1 ? 'active-color click-button-right' : 'click-button-right'}>
                            <span className="icon logo-right"/>
                            <span>点赞</span>
                        </div>
                    </div>
                    {
                        inputStatus ? (
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
                        ) : null
                    }
                </div>
                {
                    maskStatus && (
                        <div className="picMask" onClick={this.maskClose}>
                            <img src={maskPic} alt=""/>
                        </div>
                    )
                }
            </div>
        );
    }
}
