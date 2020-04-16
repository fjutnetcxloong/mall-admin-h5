/*
* 省市县区域选择
* */

import React from 'react';
import {Picker} from 'antd-mobile';
import './Region.less';

const {urlCfg} = Configs;

class Region extends BaseComponent {
    constructor(props, context) {
        super(props, context);
        this.state = {
            provinceData: [],
            provinceIndex: 0,
            cityData: [],
            cityIndex: 0,
            countyData: [],
            countyIndex: 0,
            judge1: !!props.cityValue,
            judge2: !!props.countyValue,
            judge3: !!props.street,
            propsData: props
        };
    }

    componentDidMount() {
        const {provinceValue, cityValue, countyValue, townValue, provinceId, cityId, countyId} = this.props;
        this.getProvince();
        this.setState({
            provinceValue: provinceValue || '请选择所在地区',
            cityValue: cityValue || '请选择所在地区',
            countyValue: countyValue || '请选择所在地区',
            townValue: townValue || '请选择所在街道'
        });
        //读取市数组
        if (provinceId) {
            this.getCity(provinceId);
        }
        //读取县数组
        if (cityId) {
            this.getCounty(cityId);
        }
        if (countyId) {
            this.getStreet(countyId);
        }
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.provinceId) {
            return {
                propsData: nextProps
            };
        }
        return null;
    }

    componentDidUpdate(prevProps, prevState) {
        const {provinceValue, propsData} = this.state;
        const {add, editStatus, editStatusChange} = prevState.propsData;
        if (editStatus && !add && provinceValue !== propsData.provinceValue) {
            // eslint-disable-next-line react/no-did-update-set-state
            this.setState({
                provinceValue: propsData.provinceValue,
                countyValue: propsData.countyValue,
                cityValue: propsData.cityValue,
                townValue: propsData.townValue,
                judge1: true,
                judge2: true
            });
            if (propsData.provinceId) {
                this.getCity(propsData.provinceId);
            }
            if (propsData.cityId) {
                this.getCounty(propsData.cityId);
            }
            if (propsData.countyId) {
                this.getStreet(propsData.countyId);
            }
            if (editStatusChange) {
                this.props.editStatusChange();
            }
        }
    }

    //省
    getProvince() {
        const {provinceId} = this.props;
        this.fetch(urlCfg.selectAddress, {data: {code: 0}}, true)
            .subscribe((res) => {
                if (res && res.status === 0) {
                    this.setState({
                        provinceData: res.data
                    });
                    if (provinceId) {
                        this.setState({
                            provinceIndex: this.getIndex(res.data[0], provinceId)
                        });
                    }
                }
            });
    }

    //省级选择
    provinceChange = (e) => {
        const {provinceData} = this.state;
        const {onSetProvince} = this.props;
        if (provinceData[0].length === 0) return;
        let provinceName = '';
        provinceData[0].forEach(item => {
            if (item.value === e[0]) {
                provinceName = item.label;
            }
        });
        this.setState({
            provinceValue: provinceName,
            cityValue: '请选择所在地区',
            countyValue: '',
            townValue: '',
            cityIndex: 0,
            countyIndex: 0,
            townIndex: 0,
            cityData: [],
            countyData: [],
            townData: []
        });
        onSetProvince(e[0]); //省名字
        this.getCity(e[0]);
    };

    //市级请求
    getCity(cityCode) {
        const {cityId} = this.props;
        this.fetch(urlCfg.selectAddress, {data: {code: cityCode}}, true)
            .subscribe((res) => {
                if (res && res.status === 0) {
                    this.setState({
                        cityData: res.data
                    }, () => {
                        this.setState({
                            judge1: true
                        });
                        if (cityId) {
                            this.setState({
                                cityIndex: this.getIndex(res.data[0], cityId)
                            });
                        }
                    });
                }
            });
    }

    //市级选择
    cityChange = (e) => {
        const {cityData} = this.state;
        const {onSetCity} = this.props;
        if (cityData[0].length === 0) return;
        let cityName = '';
        cityData[0].forEach(item => {
            if (item.value === e[0]) {
                cityName = item.label;
            }
        });
        this.setState({
            cityValue: cityName,
            countyValue: '请选择所在地区',
            townValue: '',
            countyIndex: 0,
            townIndex: 0,
            countyData: [],
            townData: []
        });
        onSetCity(e[0]); //市名字
        this.getCounty(e[0]);
    };

    //县请求
    getCounty(countyCode) {
        const {countyId} = this.props;
        this.fetch(urlCfg.selectAddress, {data: {code: countyCode}}, true)
            .subscribe((res) => {
                if (res && res.status === 0) {
                    this.setState({
                        countyData: res.data
                    }, () => {
                        this.setState({
                            judge2: true
                        });
                        if (countyId) {
                            this.setState({
                                countyIndex: this.getIndex(res.data[0], countyId)
                            });
                        }
                    });
                }
            });
    }

    //县级选择
    countyChange = (e) => {
        const {countyData} = this.state;
        const {onSetCounty} = this.props;
        if (countyData[0].length === 0) return;
        let countyName = '';
        countyData[0].forEach(item => {
            if (item.value === e[0]) {
                countyName = item.label;
            }
        });
        this.setState({
            countyValue: countyName
        });
        this.setState({
            countyValue: countyName,
            townValue: '请选择所在街道',
            townIndex: 0,
            townData: []
        });
        onSetCounty(e[0]); //县名字
        this.getStreet(e[0]);
    };

    //街道请求
    getStreet(streetCode) {
        const {townId} = this.props;
        this.fetch(urlCfg.selectAddress, {data: {code: streetCode}}, true)
            .subscribe((res) => {
                if (res && res.status === 0) {
                    this.setState({
                        townData: res.data
                    }, () => {
                        this.setState({
                            judge3: true
                        });
                        if (townId) {
                            this.setState({
                                townIndex: this.getIndex(res.data[0], townId)
                            });
                        }
                    });
                }
            });
    }

    //县级选择
    streetChange = (e) => {
        const {townData} = this.state;
        const {onSetStreet} = this.props;
        if (townData[0].length === 0) return;
        let townName = '';
        townData[0].forEach(item => {
            if (item.value === e[0]) {
                townName = item.label;
            }
        });
        this.setState({
            townValue: townName
        });
        onSetStreet(e[0]); //街道名字
    };

    //获取id
    getIndex = (ary, id) => {
        let data = '';
        if (ary && ary.length > 0) {
            ary.forEach(item => {
                if (item.code === id) {
                    data = id;
                }
            });
        }
        return data;
    };

    render() {
        const {
            provinceData, provinceValue, provinceIndex, cityData, cityValue, cityIndex, townValue,
            townIndex, townData,
            countyData, countyValue, countyIndex,
            judge1, judge2, judge3
        } = this.state;
        const {typeFour, textAlign} = this.props;
        return (
            <div className="regional" style={{textAlign: textAlign || 'right'}}>
                <div className={provinceValue === '请选择所在地区' ?  'picker-inline' : 'gray-3'}>
                    <Picker
                        onChange={this.provinceChange}
                        value={provinceIndex}
                        cascade={false}
                        data={provinceData}
                        cols={1}
                    >
                        <div>{provinceValue}</div>
                    </Picker>
                </div>
                {judge1 && (
                    <div className={cityValue === '请选择所在地区' ?  'picker-inline' : 'gray-3'}>
                        <Picker
                            onChange={this.cityChange}
                            value={cityIndex}
                            data={cityData}
                            cascade={false}
                        >
                            <div>{cityValue}</div>
                        </Picker>
                    </div>
                )}
                {judge2 && (
                    <div className={countyValue === '请选择所在地区' ? 'picker-inline' : 'gray-3'}>
                        <Picker
                            onChange={this.countyChange}
                            value={countyIndex}
                            cascade={false}
                            data={countyData}
                        >
                            <div>{countyValue}</div>
                        </Picker>
                    </div>
                )}
                {judge3 && typeFour && (
                    <div className={townValue === '请选择所在街道' ? 'picker-inline' : 'gray-3'}>
                        <Picker
                            onChange={this.streetChange}
                            value={townIndex}
                            cascade={false}
                            data={townData}
                        >
                            <div>{townValue}</div>
                        </Picker>
                    </div>
                )}
            </div>
        );
    }
}

export default Region;
