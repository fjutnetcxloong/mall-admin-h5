/*
* 收货地址页面
* */
import {Button, List, InputItem, TextareaItem} from 'antd-mobile';
import {createForm} from 'rc-form';
import {connect} from 'react-redux';
import {baseActionCreator} from '../../../../../../redux/baseAction';
import {myActionCreator} from '../../../actions/index';
import Region from '../../../../../common/region/Region';
import AppNavBar from '../../../../../common/navbar/NavBar';
import './Address.less';

const {appHistory, showSuccess, getUrlParam, showInfo, validator} = Utils;
const {urlCfg} = Configs;
const {MESSAGE: {Feedback, Form}} = Constants;

class Address extends BaseComponent {
    state={
        edit: '', //路由状态
        defaultState: false, //设置为默认地址
        province: '', //省的名字
        city: '', //市辖区的名字
        county: '', //城市的名字
        town: '', //街道的名字
        addressArr: {}, //初始地址
        editStatus: true, //地址选择显示与否
        addressStatus: decodeURI(getUrlParam('status', encodeURI(this.props.location.search))), //编辑还是添加 1编辑2添加
        height: document.documentElement.clientHeight - (window.isWX ? window.rem * null : window.rem * 1.08) //扣除微信头部高度
    }

    componentDidMount() {
        const {addressList, getAddress, location: {search}} = this.props;
        const status = decodeURI(getUrlParam('status', encodeURI(search)));
        this.setState({
            edit: status
        }, () => {
            if (status === '1') {
                this.getList();
            } else if (!addressList) {
                getAddress();
            }
        });
    }

    //获取信息
    getList = () => {
        const id = decodeURI(getUrlParam('id', encodeURI(this.props.location.search)));
        if (id !== 'null') {
            this.fetch(urlCfg.editAddressOne, {data: {id}})
                .subscribe(res => {
                    if (res && res.status === 0) {
                        this.setState({
                            addressArr: res.data,
                            province: res.data.province[0],
                            city: res.data.city[0],
                            county: res.data.county[0],
                            town: res.data.town[0],
                            defaultState: !!Number(res.data.if_default)
                        });
                    }
                });
        }
    };

    //前往新增地址页面
    switchTo = () => {
        appHistory.push('/addAddress');
    };

    //删除地址
    deleteGoods = (id) => {
        const {showConfirm, getAddress} = this.props;
        showConfirm({
            title: '确定删除吗?',
            btnTexts: ['取消', '确定'],
            callbacks: [null, () => {
                this.fetch(urlCfg.deleteAddress, {data: {id}})
                    .subscribe(res => {
                        if (res && res.status === 0) {
                            showSuccess(Feedback.Del_Success);
                            getAddress();
                        }
                    });
            }]
        });
    }

    //编辑地址
    editAdree = (ev, data) => {
        appHistory.push(`/editAddress?id=${data ? data.id : ''}&status=${data ? '1' : '2'}`);//2是添加，1是编辑
        ev.stopPropagation();
    }

    //点击设置默认地址
    /*setDefault = (info) => {
        this.fetch(urlCfg.addedOrEditedAddress, {
            data: {
                id: info.id,
                linkname: info.linkname,
                linktel: info.linktel,
                pca: info.area,
                address: info.address,
                if_default: 1
            }
        })
            .subscribe(res => {
                if (res.status === 0) {
                    showSuccess(Feedback.Edit_Success);
                    const {getAddress} = this.props;
                    getAddress();
                }
            });
    }*/

    // //点击保存
    // saveData = () => {
    //     const {province, city, county} = this.state;
    //     const district = [];
    //     if (province) {
    //         district.push(province);
    //     }
    //     if (city) {
    //         district.push(city);
    //     }
    //     if (county) {
    //         district.push(county);
    //     }
    //     const account = this.props.form.getFieldsValue().account;
    //     const addressAll = this.props.form.getFieldsValue().addressAll;
    //     const id = decodeURI(getUrlParam('id', encodeURI(this.props.location.search)));
    //     const phone = this.props.form.getFieldsValue().phone;
    //     //表单验证
    //     if (!validator.checkRange(2, 20, account)) return showInfo(Form.No_Name);
    //     if (!phone) return showInfo(Form.No_Phone);
    //     if (!validator.checkPhone(validator.wipeOut(phone))) return showInfo(Form.Error_Phone);
    //     if (district.length < 3) return showInfo(Form.Error_Address);
    //     if (!addressAll) return showInfo(Form.Error_Address_Required);
    //     if (addressAll.length < 3) return showInfo(Form.Error_Address_Length);

    //     this.fetch(urlCfg.addedOrEditedAddress, {method: 'post', data: {id: id, linkname: account, linktel: validator.wipeOut(phone), pca: district, address: addressAll, if_default: this.state.defaultState ? '1' : '0'}})
    //         .subscribe(res => {
    //             if (res.status === 0) {
    //                 const {getAddress} = this.props;
    //                 getAddress();
    //                 showSuccess(Feedback.Edit_Success);
    //                 appHistory.goBack();
    //             }
    //         });
    //     return undefined;
    // };

    //保存地址信息
    saveAddress = async (val) => {
        if (this.props.location.search.includes('from')) {
            const {saveAddress} = this.props;
            await saveAddress(val);
            await appHistory.goBack();
        }
    }

    //底部结构
    bottomModal = (adreeArr) => adreeArr.map((item, index) => (
        <div className="location-box" key={item.id} onClick={() => { this.saveAddress(item) }}>
            <div className="list-detail">
                <div className="item-desc">
                    <div className="address-name">{item.area.join('') + item.address}</div>
                    <div className="user-name">
                        {item.if_default === '1' ? <span className="default-address">默认</span> : ''}
                        <span className="user-name-tel">{item.linkname}</span>
                        <span>{item.linktel}</span>
                    </div>
                </div>
                <div className="item-button">
                    <div className="button-inner" onClick={(ev) => this.editAdree(ev, item)}>编辑</div>
                </div>
            </div>
        </div>
    ))

    //默认列表结构
    dressList = (addressList) => (
        <div data-component="address-set" data-role="page" className={`address-set ${window.isWX ? 'WX-address' : ''}`}>
            {
                window.isWX ? null : (
                    <AppNavBar title="地址管理"/>
                )
            }
            <div className="add-list">
                {
                    (addressList && addressList.length > 0)
                        ? this.bottomModal(addressList)
                        : (
                            <div className="no-address">
                                <div>添加地址</div>
                            </div>
                        )
                }
            </div>
            <div className="new-address" onClick={(ev) => this.editAdree(ev)}>
                <Button><i className="add-icon icon"/>添加地址</Button>
            </div>
        </div>
    )


    //设置是否默认地址
    onChangeDefault = () => {
        this.setState((prevState) => ({
            defaultState: !prevState.defaultState
        }));
    };

    //点击保存
    saveData = () => {
        const {defaultState, addressStatus, addressArr} = this.state;
        const {form: {getFieldsValue}, location: {search}, getAddress} = this.props;
        const account = getFieldsValue().account;
        const addressAll = getFieldsValue().addressAll;
        const id = decodeURI(getUrlParam('id', encodeURI(search)));
        const phone = getFieldsValue().phone;
        const district = [addressArr.province_id, addressArr.city_id, addressArr.county_id, addressArr.town_id];
        //表单验证
        if (!validator.checkRange(2, 8, account)) {
            showInfo(Form.No_Name);
            return;
        }
        if (!phone) {
            showInfo(Form.No_Phone);
            return;
        }
        if (!validator.checkPhone(validator.wipeOut(phone))) {
            showInfo(Form.Error_Phone);
            return;
        }
        if (!district.every(item => item)) {
            showInfo(Form.Error_Address);
            return;
        }
        if (!addressAll) {
            showInfo(Form.Error_Address_Required);
            return;
        }
        if (addressAll.length < 3) {
            showInfo(Form.Error_Address_Length);
            return;
        }
        this.fetch(urlCfg.addedOrEditedAddress, {data: {id, linkname: account, linktel: validator.wipeOut(phone), pca: district, address: addressAll, if_default: defaultState ? '1' : '0'}})
            .subscribe(res => {
                if (res && res.status === 0) {
                    getAddress();
                    showSuccess(addressStatus === '1' ? Feedback.Edit_Success : Feedback.EditAdd_Success);
                    appHistory.goBack();
                }
            });
    };

    //父级数据变更
    editStatusChange = () => {
        this.setState({
            editStatus: false
        });
    };

    //  省市县的赋值
    setProvince = str => {
        const {addressArr} = this.state;
        addressArr.province_id = str;
        addressArr.city_id = '';
        addressArr.county_id = '';
        addressArr.town_id = '';
        this.setState({
            addressArr
        });
    };

    //  市辖区赋值
    setCity = str => {
        const {addressArr} = this.state;
        addressArr.city_id = str;
        addressArr.county_id = '';
        addressArr.town_id = '';
        this.setState({
            addressArr
        });
    };

    //  城市赋值
    setCounty = str => {
        const {addressArr} = this.state;
        addressArr.county_id = str;
        addressArr.town_id = '';
        this.setState({
            addressArr
        });
    };

    //  街道赋值
    setStreet = str => {
        const {addressArr} = this.state;
        addressArr.town_id = str;
        this.setState({
            addressArr
        });
    };

    //地址删除
    deleteData = () => {
        const {showConfirm, getAddress, location: {search}} = this.props;
        showConfirm({
            title: '确定删除吗?',
            btnTexts: ['取消', '确定'],
            callbacks: [null, () => {
                const id = decodeURI(getUrlParam('id', encodeURI(search)));
                this.fetch(urlCfg.deleteAddress, {data: {id}})
                    .subscribe(res => {
                        if (res && res.status === 0) {
                            showSuccess(Feedback.Del_Success);
                            getAddress();
                            appHistory.goBack();
                        }
                    });
            }]
        });
    };

    //编辑结构
    editDress = () => {
        const {getFieldProps, getFieldError} = this.props.form;
        const {province, city, county, town, addressArr, editStatus, addressStatus, height, defaultState} = this.state;
        return (
            <div data-component="add-address" data-role="page" className="add-address">
                <AppNavBar title="地址管理"/>
                <form style={{height: height}} className="location-list">
                    <List>
                        <div className="consignee">
                            <InputItem
                                {...getFieldProps('account', {initialValue: addressArr.linkname})}
                                clear
                                error={!!getFieldError('account')}
                                onErrorClick={() => {}}
                                placeholder="请输入您的收件人姓名"
                                className="add-input"
                            />
                        </div>
                        <InputItem
                            className="add-input"
                            {...getFieldProps('phone', {initialValue: addressArr.linktel})}
                            placeholder="请输入电话号码"
                            type="phone"
                        />
                        <div className="receiving-address">
                            <InputItem>
                                {
                                    addressStatus === '1' ? (//为1是编辑，否则是添加
                                        <Region
                                            onSetProvince={this.setProvince}
                                            onSetCity={this.setCity}
                                            onSetCounty={this.setCounty}
                                            onSetStreet={this.setStreet}
                                            provinceValue={province}
                                            cityValue={city}
                                            countyValue={county}
                                            townValue={town}
                                            provinceId={addressArr.province_id}
                                            cityId={addressArr.city_id}
                                            countyId={addressArr.county_id}
                                            townId={addressArr.town_id}
                                            editStatus={editStatus}
                                            editStatusChange={this.editStatusChange}
                                            typeFour
                                            textAlign
                                        />
                                    ) : (
                                        <Region
                                            onSetProvince={this.setProvince}
                                            onSetCity={this.setCity}
                                            onSetCounty={this.setCounty}
                                            onSetStreet={this.setStreet}
                                            add
                                            typeFour
                                            textAlign
                                        />
                                    )
                                }
                            </InputItem>
                        </div>
                        <TextareaItem
                            {...getFieldProps('addressAll', {initialValue: addressArr.address})}
                            placeholder="请输入详细地址"
                            // autoHeight
                            count={100}
                        />
                        <div className="default">
                            {/*  <CheckboxItem onChange={(data) => this.onChangeDefault(data)} checked={defaultState}>
                                {'设为默认地址'}
                            </CheckboxItem>*/}
                            <div onClick={this.onChangeDefault} className={`icon default-icon ${defaultState ? 'default-red' : ''}`}>设为默认地址</div>
                        </div>
                        <Button className="save" onClick={this.saveData}>保存</Button>
                        {addressStatus === '1' && <Button className="delete" onClick={this.deleteData}>删除</Button>}
                    </List>
                </form>
            </div>
        );
    }

    render() {
        const {addressList} = this.props;
        const {edit} = this.state;
        if (edit === '1' || edit === '2') {
            return this.editDress();
        }
        return this.dressList(addressList);
    }
}

const mapStateToProps = state => {
    const my = state.get('my');
    return {
        addressList: my.get('addressList')
    };
};

const mapDispatchToProps = {
    showConfirm: baseActionCreator.showConfirm,
    getAddress: myActionCreator.getAddress,
    saveAddress: myActionCreator.saveAddress
};

export default connect(mapStateToProps, mapDispatchToProps)(createForm()(Address));
