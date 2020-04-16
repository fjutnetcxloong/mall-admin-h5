/**
 * 店铺商家信息
 */
import {connect} from 'react-redux';
import {Carousel} from 'antd-mobile';
import {baseActionCreator as actionCreator} from '../../../../../../redux/baseAction';
import AppNavBar from '../../../../../common/navbar/NavBar';
import './ShopHomeDetail.less';

const {native, goBackModal} = Utils;
const {urlCfg} = Configs;

class ShopHomeDetail extends BaseComponent {
    state = {
        shopInfo: [],
        lat: '',
        lon: ''
    };

    componentDidMount() {
        // this.renderMap();
        this.getList();
    }

    getList = () => {
        const id = this.props.id;
        this.fetch(urlCfg.storeDetails, {data: {id}})
            .subscribe(res => {
                if (res && res.status === 0) {
                    this.setState({
                        shopInfo: res.data
                    });
                }
            });
    };

    //滑动查看
    start = (ev) => {
        const scrollEle = document.getElementsByClassName('scroll')[0];
        const telephoneide = document.getElementsByClassName('telephone-hide')[0];
        const offX = ev.targetTouches[0].pageX;
        scrollEle.ontouchmove = function (event) {
            const pageX = event.targetTouches[0].pageX;
            const ownLeft = scrollEle.getBoundingClientRect().left;
            const tepLeft = telephoneide.getBoundingClientRect().left;
            const ownRight = scrollEle.getBoundingClientRect().right;
            const tepRight = telephoneide.getBoundingClientRect().right;
            event.stopPropagation();
            if (pageX - offX > 0 &&  ownLeft >= tepLeft  &&  ownRight < tepRight) {
                scrollEle.style.left = pageX - offX + 'px';
            }
            scrollEle.ontouchend = function () {
                const telephoneShow = document.getElementsByClassName('telephone-show')[0];
                const rightMax = telephoneide.getBoundingClientRect().right;
                const ownMax = scrollEle.getBoundingClientRect().right;
                if (rightMax - 3 < ownMax) {
                    telephoneide.style.display = 'none';
                    telephoneShow.style.display = 'block';
                } else {
                    scrollEle.style.left = 0;
                }
            };
        };
        ev.stopPropagation();
    }

    //渲染地图
    renderMap = () => {
        const {lat, lon} = this.props;
        this.map = new window.BMap.Map('map');
        const point = new window.BMap.Point(lon, lat);
        this.map.centerAndZoom(point, 15);
        const marker = new window.BMap.Marker(point);
        this.map.addOverlay(marker);
    };

    //拨打电话
    callPhone = (tel) => {
        if (process.env.NATIVE) {
            native('callTel', {phoneNum: tel});
        }
    }

    goBackModal = () => {
        this.props.setshoppingId('');
        goBackModal();
    }

    render() {
        const {shopInfo} = this.state;
        return (
            <div data-component="shophomeDetail" data-role="page" className="shophomeDetail">
                <AppNavBar title="商家信息" goBackModal={this.goBackModal}/>
                <div className="daty-box">
                    <div className="datyBox">
                        {/*店名位置*/}
                        <div className="address" style={{border: '1px solid #e5e5e5'}}>
                            <img
                                src={shopInfo.picpath}
                                onError={(e) => { e.target.src = shopInfo.df_logo }}
                                alt=""
                            />
                            <div className="address-l">
                                <div className="store-name-t">{shopInfo.shopName}</div>
                                {
                                    shopInfo.open_time && <div className="store-name-t">营业时间{shopInfo.open_time}</div>
                                }
                                <div className="store-name-b">{shopInfo.addre + ' ' + shopInfo.address}</div>
                            </div>
                        </div>
                        {/*滑动查看电话*/}
                        <div className="telephone-hide" style={{border: '1px solid #e5e5e5'}}>
                            <span className="telephone-hl">滑动查看商家电话</span>
                            {/* <div className="scroll" onTouchStart={this.start} onTouchMove={this.move} onTouchEnd={this.end}> */}
                            <div className="wrapScroll">
                                <div className="scroll" onTouchStart={this.start}>
                                    <div>
                                        <span className="icon telephone-hr"/>
                                        <span className="icon telephone-hr"/>
                                        <span className="icon telephone-hr"/>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="telephone-show" style={{border: '1px solid #e5e5e5'}}>
                            <span className="number">
                                <span className="telephone-sl">电话</span>
                                <span className="telephone-number">{shopInfo.phone}</span>
                            </span>
                            {
                                window.isWX ? (
                                    <div className="telephone-sr">
                                        <a href={`tel:${shopInfo.phone}`}>立即拨打</a>
                                    </div>
                                ) : (<span className="telephone-sr" onClick={() => this.callPhone(shopInfo.phone)}>立即拨打</span>)
                            }
                        </div>
                        {/*图册*/}
                        <div className="Atlas">
                            <div className="Atlas-n">商家图册</div>
                            <div className="shop-img-more">
                                <Carousel>
                                    {
                                        shopInfo.album_pic && shopInfo.album_pic.length > 0 ? shopInfo.album_pic.map(item => <img key={item} src={item} alt=""/>) : <div className="period"/>
                                    }
                                </Carousel>
                            </div>
                            {/*<img src={require('../../../../assets/images/Atlas.png')} alt=""/>*/}
                        </div>
                        {/*地址*/}
                        {/* <div className="business-address">
                            <div className="Atlas-n">商家地址</div>
                            <div id="map" style={{height: '500px', marginBottom: '100px'}}/>
                        </div> */}
                    </div>
                </div>
            </div>
        );
    }
}


const mapDispatchToProps = {
    setshoppingId: actionCreator.setshoppingId
};

export default connect(null, mapDispatchToProps)(ShopHomeDetail);
