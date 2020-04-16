/**
 * @desc Find页面，各个组件的使用展示
 */
import {connect} from 'react-redux';
import classNames from 'classnames';
import {Button, SearchBar, Icon as ATIcon, Accordion} from 'antd-mobile';
import {baseActionCreator as actionCreator} from '../../../redux/baseAction';
import {findActionCreator} from './actions/index';
import {IconFont} from '../../common/icon-font/IconFont';
import {FooterBar} from '../../common/foot-bar/FooterBar';
import {FindPopup} from '../../../components/modal';
import '../../../redux/reducers/baseReducer';
import './Find.less';

const {MESSAGE: {Form, Feedback}, TD_EVENT_ID, BASE_64: {LOCATION, CURRENT_LOCATION}} = Constants;


const Marker = new window.BMap.Icon(LOCATION, new window.BMap.Size(30, 30), {
    anchor: new window.BMap.Size(10, 25)
});

const {appHistory, showInfo, getUrlParam, TD, systemApi: {setValue, getValue}} = Utils;
const {urlCfg} = Configs;
class Find extends BaseComponent {
    state = {
        showPopup1: false,
        showPopup2: false,
        className: 'find-popup',
        toggle: false,
        longitude: 0,
        latitude: 0,
        pointArr: [],
        shops: [],
        shopName: '',
        nowLongitude: 0, //当前点击商店经纬度
        nowLatitude: 0,
        address: '', //搜索框地址信息
        addressLongitude: 0, //搜索地址的经纬度
        addressLatitude: 0,
        currentIndex: 0,
        addressInfo: '', //当前地址信息
        alpha: 0,
        close: false, //关闭按钮显示状态
        shopList: {}, //店铺列表
        searchLeft: '', //搜索按钮左边文字
        searchRight: '', //搜索按钮右边文字
        shopId: '' //商店id
    }

    componentDidMount() {
        TD.log(TD_EVENT_ID.FIND.ID, TD_EVENT_ID.FIND.LABEL.FIND_HOME);
        const longitude = decodeURI(getUrlParam('longitude', encodeURI(this.props.location.search)));
        const latitude = decodeURI(getUrlParam('latitude', encodeURI(this.props.location.search)));
        const {showMenu} = this.props;
        showMenu(false);
        this.setState({
            nowLongitude: longitude, //当前点击商店经纬度
            nowLatitude: latitude
        });
        const local = JSON.parse(getValue('local'));

        if (!local) {
            this.getLocation();
        } else {
            this.setState({
                longitude: local.lon,
                latitude: local.lat
            }, () => {
                this.renderMap();
                this.getShop(this.state.latitude, this.state.longitude);
            });
            const pt = new window.BMap.Point(local.lon, local.lat);
            this.addressGeoc(pt);
        }
    }

    componentWillUnmount() {
        super.componentWillUnmount();
        const {showMenu} = this.props;
        showMenu(true);
    }

    //获取搜索地址信息
    getAddress = (val) => {
        TD.log(TD_EVENT_ID.FIND.ID, TD_EVENT_ID.FIND.LABEL.STORE_STORE);
        this.setState({
            address: val
        });
    };

    //渲染地图
    renderMap = () => {
        const {longitude, latitude, shops} = this.state;
        // console.log(shops);
        const pointArr = [];
        shops.map(item => {
            pointArr.push({
                longitude: item.longitude,
                latitude: item.latitude,
                name: item.shopName,
                id: item.id
            });
        });
        this.map = new window.BMap.Map('map');
        const point = new window.BMap.Point(longitude, latitude);
        this.map.centerAndZoom(point, 13);
        this.createMarker(pointArr, shops);
        this.selfMarker(point);
    };

    //自定义标注
    createMarker = (points) => {
        points.forEach((item, index) => {
            const longitude = item.longitude;
            const latitude = item.latitude;
            const name = item.name;
            const id = item.id;
            const point = new window.BMap.Point(longitude.toString(), latitude.toString());
            const markers = new window.BMap.Marker(point, {icon: Marker});
            const label = new window.BMap.Label(name, {offset: new window.BMap.Size(20, -10)});
            markers.openInfoWindow();
            markers.setLabel(label);
            markers.addEventListener('click', () => {
                this.markerClick(item, markers, index, id);
            });
            label.addEventListener('click', () => {
                this.markerClick(item, markers, index, id);
            });
            this.map.addOverlay(markers);
        });
    };

    //marker点击事件
    markerClick = (item, markers, index, id) => {
        const {longitude, latitude, currentIndex} = this.state;
        this.setState({
            shopName: item.name,
            searchLeft: '导航到店',
            searchRight: '店铺信息',
            currentIndex: index,
            close: true,
            nowLongitude: item.longitude,
            nowLatitude: item.latitude,
            toggle: true,
            shopId: id
        }, () => {
            this.fetch(urlCfg.findForShopName, {data: {title: this.state.shopName}})
                .subscribe((res) => {
                    if (res.status === 0 && res.data.length > 0) {
                        showInfo(Feedback.Search_Success);
                        this.setState({
                            shops: res.data
                        });
                    }
                });
        });

        const walk = new window.BMap.WalkingRoute(this.map, {});
        //在walk实例对象中获取点数组
        walk.setSearchCompleteCallback(() => {
            const pts = walk.getResults().getPlan(0).getRoute(0).getPath();
            this.polyline = new window.BMap.Polyline(pts, {
                strokeColor: '#ff2d51',
                strokeWeight: 3,
                strokeOpacity: 1,
                strokeStyle: 'solid',
                id: 'polyine'
            });
            this.map.addOverlay(this.polyline);
            if (currentIndex !== index) {
                this.map.removeOverlay(this.polyline);
                this.map.addOverlay(this.polyline);
            }
        });
        const start = new window.BMap.Point(longitude, latitude);
        const end = new window.BMap.Point(item.longitude, item.latitude);
        walk.search(start, end);
    };

    //自己位置的marker
    selfMarker = (point) => {
        const selfMarker = new window.BMap.Icon(CURRENT_LOCATION, new window.BMap.Size(30, 30), {
            anchor: new window.BMap.Size(15, 10)
        });
        const markers = new window.BMap.Marker(point, {icon: selfMarker});
        this.map.addOverlay(markers);
    };

    //获取定位当前位置周围的商店
    getShop = (lat, lng) => {
        this.fetch(urlCfg.findShop, {
            data: {
                latitude: lat,
                longitude: lng,
                limit: 100
            }
        }).subscribe((res) => {
            if (res.status === 0) {
                this.setState({
                    shops: res.data
                }, () => {
                    this.renderMap();
                });
            }
        });
    };

    //获取当前位置信息
    getLocation = () => {
        if (window.isWX) {
            window.wx.getLocation({
                type: 'wgs84', // 默认为wgs84的gps坐标，如果要返回直接给openLocation用的火星坐标，可传入'gcj02'
                success: (res) => {
                    const pt = new window.BMap.Point(res.longitude, res.latitude);
                    this.addressGeoc(pt);
                    this.setState({
                        latitude: res.latitude,
                        longitude: res.longitude,
                        shopTitle: res.longitude,
                        toggle: false
                    }, () => {
                        this.renderMap();
                        this.getShop(this.state.latitude, this.state.longitude);
                    });
                    setValue('local', JSON.stringify({lon: res.longitude, lat: res.latitude}));
                }
            });
        } else {
            const geolocation = new window.BMap.Geolocation();
            geolocation.getCurrentPosition((res) => {
                setValue('local', JSON.stringify({lon: res.longitude, lat: res.latitude}));
                const pt = res.point;
                this.addressGeoc(pt);
                this.setState({
                    latitude: res.latitude,
                    longitude: res.longitude
                }, () => {
                    this.renderMap();
                    this.getShop(this.state.latitude, this.state.longitude);
                });
            }, (error) => {
                showInfo(Form.Error_Position + error);
            });
        }
    };

    //导航到店
    goShop = () => {
        const {searchLeft, nowLongitude, nowLatitude, addressInfo, latitude, longitude, shopName} = this.state;
        const lat = Number(nowLatitude);
        const lon = Number(nowLongitude);
        if (searchLeft === '导航到店') {
            if (window.isWX) {
                window.wx.ready(() => {
                    window.wx.openLocation({
                        latitude: lat, // 纬度，浮点数，范围为90 ~ -90
                        longitude: lon, // 经度，浮点数，范围为180 ~ -180。
                        name: addressInfo, // 位置名
                        address: '', // 地址详情说明
                        scale: '' // 地图缩放级别,整形值,范围从1~28。默认为最大
                    });
                });
            }
        } else {
            appHistory.push(`/shop-list?latitude=${latitude}&longitude=${longitude}&title=${shopName}`);
        }
    };

    //根据商店名称搜索商店
    getShopName = (val) => {
        TD.log(TD_EVENT_ID.FIND.ID, TD_EVENT_ID.FIND.LABEL.STORE_STORE);
        this.setState({
            shopName: val
        });
    };

    // 弹出搜索框
    showPopup = (showPopup) => {
        setTimeout(() => {
            this.setState({
                [showPopup]: true
            });
        }, 500);
    };

    //地址逆解析
    addressGeoc = (pt) => {
        const geoc = new window.BMap.Geocoder();
        geoc.getLocation(pt, rs => {
            const addComp = rs.address;
            this.setState({
                addressInfo: addComp
            });
        });
    };

    //右侧导航按钮点击
    rightClick = () => {
        const {searchRight, shopId} = this.state;
        if (searchRight === '店铺信息') {
            appHistory.push(`/shopHome?id=${shopId}`);
        } else {
            this.getLocation();
        }
    }

    // 根据搜索框输入地址定位
    addressGoGeoc = (address) => {
        // 创建地址解析器实例
        const myGeo = new window.BMap.Geocoder();
        // 将地址解析结果显示在地图上，并调整地图视野
        myGeo.getPoint(address, (point) => {
            // console.log(point);
            if (point) {
                this.setState({
                    latitude: point.lat,
                    longitude: point.lng
                });
                this.map.clearOverlays();
                this.getShop(point.lat.toString(), point.lng.toString());
            }
        }, address);
    }

    //搜索商店
    hidePopup = (type) => {
        const {shopName, address, latitude, longitude} = this.state;
        if (type === 'shopName') {
            if (shopName.length === 0) {
                showInfo(Form.No_StoreName);
            } else {
                this.fetch(urlCfg.findForShopName, {data: {title: this.state.shopName, latitude: latitude, longitude: longitude}})
                    .subscribe((res) => {
                        if (res.status === 0 && res.data.length > 0) {
                            showInfo(Feedback.Search_Success);
                            const {setShopList} = this.props;
                            setShopList(res.data);
                            this.setState({
                                showPopup1: false,
                                showPopup2: false,
                                toggle: true,
                                shopList: res,
                                shops: res.data,
                                searchLeft: '店铺列表',
                                searchRight: '取消搜索'
                            }, () => {
                                this.renderMap();
                            });
                        } else {
                            showInfo(Form.No_Search_Shop);
                        }
                    });
            }
        } else if (type === 'address') {
            if (address.length === 0) {
                showInfo(Form.No_Search_Address);
            } else {
                this.addressGoGeoc(address);
                this.setState({
                    showPopup2: false
                });
            }
        }
    };

    //关闭弹窗
    close = (prop) => {
        this.setState({
            [prop]: false
        });
    };

    //返回地图渲染markers
    returnMapRender = () => {
        this.map.removeOverlay(this.polyline);
        this.setState({
            close: false,
            toggle: false
        }, () => {
            this.getLocation();
        });
    }

    //店铺名称点击
    shopNameClick = (item) => {
        console.log(item);
        const {longitude, latitude} = this.state;
        this.map.removeOverlay(this.polyline);
        const pt = new window.BMap.Point(item.longitude, item.latitude);
        this.map.centerAndZoom(pt, 13);
        this.setState({
            showPopup1: false,
            oldId: item.id,
            close: true,
            searchLeft: '导航到店',
            searchRight: '店铺信息',
            toggle: true,
            shopId: item.id
        });
        const walk = new window.BMap.WalkingRoute(this.map, {});
        const {oldId} = this.state;
        //在walk实例对象中获取点数组
        walk.setSearchCompleteCallback(() => {
            const pts = walk.getResults().getPlan(0).getRoute(0).getPath();
            const polylines = new window.BMap.Polyline(pts, {
                strokeColor: '#ff2d51',
                strokeWeight: 3,
                strokeOpacity: 1,
                strokeStyle: 'solid',
                id: 'polyine'
            });
            this.map.addOverlay(polylines);
            if (oldId !== item.id) {
                this.map.removeOverlay(polylines);
                this.map.addOverlay(polylines);
            }
        });
        const start = new window.BMap.Point(longitude, latitude);
        const end = new window.BMap.Point(item.longitude, item.latitude);
        walk.search(start, end);
    }

    renderPopup1 = () => {
        const {showPopup1, className, shops} = this.state;
        const pop = {
            visible: showPopup1,
            className: className
        };
        return (
            <FindPopup {...pop}>
                <div className="find-popup1">
                    <div className="find-popup1-icon">
                        <ATIcon type="cross-circle" onClick={() => this.close('showPopup1')}/>
                    </div>
                    <div className="find-popup1-fence">
                        <SearchBar placeholder="请输入您要搜索的商家" onChange={(val) => this.getShopName(val)} onBlur={this.bure}/>
                    </div>
                    <div className="find-popup1-nearby">
                        <p>附近商家</p>
                        {
                            shops.map(item => (
                                <Button className="auxiliary-button gray" key={item.id} onClick={() => this.shopNameClick(item)}>{item.shopName}</Button>
                            ))
                        }
                    </div>
                    <div className="find-popup1-button">
                        <Button
                            type="primary"
                            onClick={() => this.hidePopup('shopName')}
                            className="medium-button important"
                        >搜索
                        </Button>
                    </div>
                </div>
            </FindPopup>
        );
    };

    // ios页面回弹
    bure = () => {
        window.scroll(0, 0);
    }

    renderPopup2 = () => {
        const {showPopup2, className} = this.state;
        const pop = {
            visible: showPopup2,
            className: className
        };
        return (
            <FindPopup {...pop}>
                <div className="find-popup1">
                    <div className="find-popup1-icon">
                        <ATIcon type="cross-circle" onClick={() => { this.close('showPopup2') }}/>
                    </div>
                    <div className="find-popup1-fence">
                        <SearchBar placeholder="请输入您想搜索的地址" onChange={(val) => this.getAddress(val)} onBlur={this.bure}/>
                    </div>
                    <div className="find-popup1-button">
                        <Button
                            type="primary"
                            onClick={() => this.hidePopup('address')}
                            className="medium-button important"
                        >搜索
                        </Button>
                    </div>
                </div>
            </FindPopup>
        );
    };

    render() {
        const {toggle, addressInfo, close, searchLeft, searchRight} = this.state;
        return (
            <div data-component="find" data-role="page" className={classNames('find', {WX: window.isWX})}>
                {
                    window.isWX ? null : (
                        <div className="find-header">发现</div>
                    )
                }
                <Accordion className="address address-WX">
                    {/*<span id="alpha">{alpha}</span><br/>*/}
                    <Accordion.Panel>当前位置：{addressInfo}</Accordion.Panel>
                </Accordion>
                {
                    window.isWX ? (<div style={{height: '92vh'}} id="map"/>) : (<div style={{height: '86vh'}} id="map"/>)
                }
                <div className="icon-container">
                    <div className="public edging" onClick={(e) => this.showPopup('showPopup2', e)}>
                        <IconFont iconText="iconzhu-weizhi"/>
                        <div className="public-img">切换位置</div>
                    </div>
                    <div className="public" onClick={() => this.getLocation()}>
                        <IconFont iconText="iconzhu-dingwei"/>
                        <div className="isThis">定位</div>
                    </div>
                </div>
                {
                    close ? (
                        <div className="out" onClick={this.returnMapRender}>
                            <IconFont iconText="iconzhu-dianpu"/>
                            <div>返回</div>
                        </div>
                    ) : null
                }
                {
                    toggle
                        ? (
                            <div className="button-box">
                                <div className="button1" onClick={this.goShop}>{searchLeft}</div>
                                <div className="button2" onClick={() => this.rightClick()}>{searchRight}</div>
                            </div>
                        )
                        : null
                }
                <Button
                    type="warning"
                    onClick={(e) => { this.showPopup('showPopup1', e) }}
                    className="large-button general"
                ><span className="icon icon-search"/>
                </Button>
                {this.renderPopup1()}
                {this.renderPopup2()}
                <FooterBar active="find"/>
            </div>
        );
    }
}

const mapStateToProps = state => {
    // console.log(state, 'sdfsdsvsdvfdvdfvdsv');
    const find = state.get('find');
    return {
        shopListData: find.get('shopListData')
    };
};

const mapDispatchToProps = {
    showMenu: actionCreator.showMenu,
    setShopList: findActionCreator.setShopList
};

export default connect(mapStateToProps, mapDispatchToProps)(Find);