/*
* 商店列表
* */
import {connect} from 'react-redux';
import AppNavBar from '../../common/navbar/NavBar';
import './shopList.less';

const {appHistory, getUrlParam, goBackModal} = Utils;
const {urlCfg} = Configs;
class shopList extends BaseComponent {
    constructor(props, context) {
        super(props, context);
    }

    state = {
        shopListData: [],
        stars: []
    }
    // close_time;

    componentDidMount() {
        // const {shopListData} = this.props;
        // console.log(shopListData);
        // this.setState({
        //     shopListData: shopListData
        // });
        this.getList();
    }

    getList = () => {
        const latitude = decodeURI(getUrlParam('latitude', encodeURI(this.props.location.search)));
        const longitude = decodeURI(getUrlParam('longitude', encodeURI(this.props.location.search)));
        const title = decodeURI(getUrlParam('title', encodeURI(this.props.location.search)));
        this.fetch(urlCfg.findForShopName, {method: 'post', data: {latitude, longitude, title}})
            .subscribe(res => {
                if (res.status === 0) {
                    this.setState({
                        shopListData: res.data
                    });
                }
            });
    }

    renderStar = (num) => {
        const slot = num.split('.')[1];
        const value = Number(num);
        const arr = [];
        for (let i = 0; i < Math.floor(value); i++) {
            const star = <div className="icon icon-tiny" key={i}/>;
            arr.push(star);
        }
        if (slot >= 5) {
            const stars = <div className="icon icon-stars"/>;
            arr.push(stars);
        }
        return arr;
    }

    //跳转商店首页
    goShopHome = (id) => {
        appHistory.push(`/shopHome?id=${id}`);
    }

    render() {
        const {shopListData} = this.state;
        return (
            <div className="shop-list">
                <AppNavBar goBackModal={goBackModal} title="商店列表"/>

                <ul className="list-content">
                    {
                        shopListData.map(item => (
                            <li key={item.id} onClick={() => { this.goShopHome(item.id) }}>
                                <div className="work-time">营业时间{item.open_time}-{item.close_time}<span>{item.discount}km</span></div>
                                <div className="content-wrapper">
                                    <div className="awatar">
                                        <img
                                            src={item.picpath}
                                            alt=""
                                            onError={(e) => { e.target.src = item.df_logo }}
                                        />
                                    </div>
                                    <div className="right-content">
                                        {/* <div className="star-box">
                                            {this.renderStar(item.shop_mark)}
                                        </div>*/}
                                        <div className="list-title">
                                            <p>{item.shopName}</p>
                                            <p>人均消费 <span>￥{item.consume_per}</span></p>
                                        </div>
                                        <div className="address">
                                            <div className="icons">
                                                <div className="icon address-icon"/>
                                            </div>
                                            <span>{item.address}</span>
                                        </div>
                                    </div>
                                </div>
                            </li>
                        ))
                    }
                </ul>
            </div>
        );
    }
}
const mapStateToProps = state => {
    const find = state.get('find');
    return {
        shopListData: find.get('shopListData')
    };
};

export default connect(mapStateToProps, null)(shopList);
