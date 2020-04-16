/**我要开店---个体页面 */

import {List, InputItem, Picker, Flex} from 'antd-mobile';
import {createForm} from 'rc-form';
import AppNavBar from '../../../../../common/navbar/NavBar';
import Region from '../../../../../common/region/Region';
import './PersonalFour.less';

const {urlCfg} = Configs;
const {MESSAGE: {Form}} = Constants;
const {showInfo, validator} = Utils;

class PersonalFour extends BaseComponent {
    state ={
        files: [],
        multiple: false,
        value: 0,
        banks: [], //获取银行列表
        userName: '',
        bankCard: '', //银行卡号
        phone: '', //用户手机号
        province: '', //省的名字
        urban: '', //市辖区的名字
        county: '', //城市名字
        countyId: '', //城市id
        cValue: '',
        bankBranch: [],  //银行支行
        branchName: '',
        bankId: 0, //银行id
        bankKey: '', //所属银行
        pageStatus: '',
        id: '',
        bValue: [],
        selectBranch: '', //回传支行名称
        addressStatus: ''
    };

    componentDidMount = () => {
        this.getBank();
        this.getUpdateAudit();
    };

    onChange = (files) => {
        console.log(files);
        this.setState({
            files
        });
    };

    //审核失败获取填过的数据
    getUpdateAudit = () => {
        this.fetch(urlCfg.getShopbank, {data: {type: 4}}).subscribe(res => {
            if (res.status === 0 && res.data.length !== 0) {
                this.setState({
                    userName: res.data.realname,
                    bankCard: res.data.bankNo,
                    cValue: Array(res.data.bankId),
                    bankId: res.data.bankId,
                    phone: res.data.phone,
                    bankKey: res.data.bankArea,
                    province: res.data.area && res.data.area[0],
                    urban: res.data.area && res.data.area[1],
                    county: res.data.area && res.data.area[2],
                    provinceId: res.data.province_id,
                    cityId: res.data.city_id,
                    countyId: res.data.county_id,
                    id: res.data.id,
                    selectBranch: res.data.branches,
                    addressStatus: '1'
                }, () => {
                    this.getBankList();
                });
            }
        });
    };

    //获取银行
    getBank = () => {
        this.fetch(urlCfg.getBank).subscribe(res => {
            if (res) {
                if (res.status === 0) {
                    const arr = [];
                    res.data.forEach(item => {
                        arr.push({
                            label: item.name,
                            value: item.id
                        });
                    });
                    this.setState({
                        banks: arr
                    });
                }
            }
        });
    }

    //  省市县的赋值
    setProvince = str => {
        this.setState({
            province: str,
            urban: '',
            county: ''
        });
    };

   //设置城市
   setCity = str => {
       this.setState({
           urban: str,
           county: ''
       });
   };

   //设置市辖区
   setCounty = str => {
       this.setState({
           county: str
       });
   };

    //获取选中的银行
    getBankInfo = (val) => {
        const {banks} = this.state;
        const value = val.toString();
        const result = banks.find(item => item.value === value);
        this.setState({
            cValue: val,
            bankKey: result.label,
            bankId: result.value,
            bankBranch: [],
            bValue: []
            // branchName: ''
        });
    }

    //获取城市id
    setCountyId = (str) => {
        this.setState({
            countyId: str
        });
    };

    //获取支行列表
    getBankList = () => {
        const {countyId, bankKey} = this.state;
        if (countyId && bankKey) {
            this.fetch(urlCfg.getBankList, {data: {
                cityId: countyId,
                key: bankKey
            }}).subscribe(res => {
                if (res && res.status === 0) {
                    const arr = [];
                    res.data.forEach(item => {
                        arr.push({
                            label: item.bankBranchName,
                            value: item.code
                        });
                    });
                    this.setState({
                        bankBranch: arr
                    }, () => {
                        if (this.state.selectBranch) {
                            const {bankBranch, selectBranch} = this.state;
                            const num = bankBranch.find(item => item.label === selectBranch);
                            console.log(bankBranch, selectBranch, num);
                            this.setState({
                                bValue: num.value
                            });
                        }
                    });
                }
            });
        } else {
            showInfo('请先选择银行开户行和开户地', 2);
        }
    }

    //获取支行信息
    getBankBranchInfo = (val) => {
        const {bankBranch} = this.state;
        const result = bankBranch.find(item => item.value === val.toString());
        if (result) {
            this.setState({
                branchName: result.label,
                bValue: result.label
            });
        }
    }

    //检验是否选择区域
    checkArea = (rule, value, callback) => {
        const {province, urban, county} = this.state;
        const pca = [province, urban, county];
        if (!validator.isEmpty(pca, Form.No_pca, callback)) return;
        callback();
    };

    //驗證银行用户名
    checkUserName = (rule, value, callback) => {
        if (!validator.isEmpty(value, Form.No_cardHolderName, callback)) return;
        if (!validator.checkRange(2, 10, value)) {
            validator.showMessage(Form.Error_UserName, callback);
            return;
        }
        callback();
    };

    //验证银行卡号
    checkBankCard = (rule, value, callback) => {
        if (!value) {
            validator.showMessage(Form.Bank_Card_Num, callback);
            return;
        }
        if (!validator.isEmpty(value, Form.No_BankNumber, callback)) return;
        if (!validator.bankCard(value)) {
            validator.showMessage(Form.Error_Bank, callback);
            return;
        }
        callback();
    };

    //校验是否选择开户行
    checkBanks = (rule, value, callback) => {
        const {bankKey} = this.state;
        if (!validator.isEmpty(bankKey, Form.No_Bank, callback)) return;
        callback();
    };

     //校验负责人电话
     checkPhone = (rule, value, callback) => {
         if (!validator.isEmpty(value, Form.No_Phone, callback)) return;
         const myPhone = validator.wipeOut(value);
         if (!validator.checkPhone(myPhone)) {
             showInfo(Form.No_checkPhone, 1);
             return;
         }
         callback();
     };

     //是否选择银行支行
     checkBranchName = (rule, value, callback) => {
         const {branchName} = this.state;
         if (!validator.isEmpty(branchName, Form.No_branchBankName, callback)) return;
         callback();
     };

    //提交申请
    submit = () => {
        const {that} = this.props;
        const {form: {validateFields}} = this.props;
        const {bankId, bankKey, branchName, value, id, province, county, urban} = this.state;

        validateFields({first: true, force: true}, (error, val) => {
            if (!error) {
                console.log(val.branchName);
                this.fetch(urlCfg.bindBankCard, {data: {
                    id: id,
                    bank_id: bankId,
                    real_name: val.userName,
                    bank_name: bankKey,
                    pcat: [province, urban, county],
                    bank_number: val.bankCard,
                    branches: branchName,
                    userType: 2,
                    phone: validator.wipeOut(val.phone),
                    type: value + 1
                }}).subscribe(res => {
                    // that.getChildren('audits');
                    if (res.status === 0) {
                        this.fetch(urlCfg.shopFinish).subscribe(res2 => {
                            that.getChildren('audits');
                        });
                    }
                });
            }
        });
    };

    render() {
        const {banks, cValue, bankBranch, phone, userName, bankCard, provinceId, cityId, addressStatus, province, urban, county, bValue} = this.state;
        const {getFieldDecorator} = this.props.form;
        const steps = ['填写店铺信息', '填写开店人信息', '填写工商信息', '绑定银行卡'];
        return (
            <div data-component="personal-four" data-role="page" className="personal-four">
                <AppNavBar title="店铺信息" goBackModal={() => this.props.goBack('three')}/>
                <div className={`step-box ${window.isWX ? 'step-box-clear' : ''}`}>
                    {steps.map((item, index) => (
                        <div className="step" key={item}>
                            <span>{index + 1}</span>
                            <span>{item}</span>
                        </div>
                    ))}
                    <Flex className="dotted"><Flex.Item/><Flex.Item/><Flex.Item/></Flex>
                </div>
                <div className="backdrop">
                    <div className="list-content">
                        <div className="margin">
                            <List>
                                {
                                    getFieldDecorator('userName', {
                                        initialValue: userName,
                                        rules: [
                                            {validator: this.checkUserName}
                                        ],
                                        validateTrigger: 'submit'//校验值的时机
                                    })(
                                        <InputItem
                                            clear
                                            placeholder="请输入卡主名称"
                                            maxLength="10"
                                            type="text"
                                        >卡主姓名
                                        </InputItem>
                                    )
                                }
                                {
                                    getFieldDecorator('bankCard', {
                                        initialValue: bankCard,
                                        rules: [
                                            {validator: this.checkBankCard}
                                        ],
                                        validateTrigger: 'submit'//校验值的时机
                                    })(
                                        <InputItem
                                            // value={bankCard}
                                            clear
                                            maxLength="20"
                                            type="number"
                                            placeholder="请输入银行卡号"
                                        >银行卡号
                                        </InputItem>
                                    )
                                }

                                {
                                    getFieldDecorator('banks', {
                                        initialValue: cValue,
                                        rules: [
                                            {validator: this.checkBanks}
                                        ],
                                        validateTrigger: 'submit'//校
                                    })(
                                        <Picker
                                            data={banks}
                                            cols={1}
                                            onOk={val => this.getBankInfo(val)}
                                        >
                                            <List.Item arrow="horizontal" onClick={this.onClick}>开户银行</List.Item>
                                        </Picker>
                                    )
                                }
                                <List.Item className="branches area" arrow="horizontal">
                                    <span>开户地区</span>
                                    {
                                        getFieldDecorator('area', {
                                            // initialValue: '',
                                            rules: [
                                                {validator: this.checkArea}
                                            ],
                                            validateTrigger: 'onSubmit'
                                        })(
                                            <div className="region-select">
                                                {
                                                    addressStatus === '1' && (
                                                        <Region
                                                            onSetProvince={this.setProvince}
                                                            onSetCity={this.setCity}
                                                            onSetCounty={this.setCounty}
                                                            onCountyId={this.setCountyId}
                                                            provinceValue={province}
                                                            cityValue={urban}
                                                            countyValue={county}
                                                            provinceId={provinceId}
                                                            cityId={cityId}
                                                        />
                                                    )
                                                }
                                                {
                                                    addressStatus === '' && (
                                                        <Region
                                                            provinceValue={province}
                                                            cityValue={urban}
                                                            countyValue={county}
                                                            onSetProvince={this.setProvince}
                                                            onSetCity={this.setCity}
                                                            onSetCounty={this.setCounty}
                                                            onCountyId={this.setCountyId}
                                                            add
                                                        />
                                                    )
                                                }
                                            </div>
                                        )
                                    }
                                </List.Item>
                                {
                                    getFieldDecorator('branchName', {
                                        initialValue: Array(bValue),
                                        rules: [
                                            {validator: this.checkBranchName}
                                        ],
                                        validateTrigger: 'submit'//校
                                    })(
                                        <Picker
                                            data={bankBranch}
                                            cols={1}
                                            onOk={val => this.getBankBranchInfo(val)}
                                        >
                                            <List.Item
                                                arrow="horizontal"
                                                onClick={this.getBankList}
                                            >开户支行
                                            </List.Item>
                                        </Picker>
                                    )
                                }
                                {
                                    getFieldDecorator('phone', {
                                        initialValue: phone,
                                        rules: [
                                            {validator: this.checkPhone}
                                        ],
                                        validateTrigger: 'submit'//校
                                    })(
                                        <InputItem
                                            clear
                                            type="phone"
                                            placeholder="请输入手机号码"
                                        >银行预留手机号
                                        </InputItem>
                                    )
                                }
                                <List.Item className="remark">请填写与开店人信息一致的所属人银行卡信息</List.Item>
                            </List>
                        </div>
                    </div>
                    <div className="button">
                        <div className="large-button important" onClick={this.submit}>提交申请</div>
                    </div>
                </div>
            </div>
        );
    }
}

export default createForm()(PersonalFour);
