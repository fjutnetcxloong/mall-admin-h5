import {SearchBar, Picker, Flex, List, Icon} from 'antd-mobile';
import AppNavBar from '../../../../../common/navbar/NavBar';
import './SelfAddress.less';

export default class ReDetail extends BaseComponent {
    render() {
        const dataInfo = [
            {
                label: '福州',
                value: '1'
            },
            {
                label: '厦门',
                value: '2'
            }
        ];

        return (
            <div data-component="Self-address" data-role="page" className="Self-address">
                <AppNavBar rightShow title="自提门店"/>
                <div className="seek">
                    <Flex>
                        <Picker data={dataInfo} value="">
                            <List.Item>福州<Icon
                                type="down"
                            />
                            </List.Item>
                        </Picker>
                        <Flex.Item>
                            <SearchBar
                                placeholder="请输入地址选择周围门店"
                            />
                        </Flex.Item>
                    </Flex>
                    <div className="cancel">取消</div>
                </div>

                <div className="store">
                    <div className="common-stores">常用门店</div>
                    <div className="business">
                        <div className="business-left">
                            {/*<img src={require('../../../../../../assets/images/sheep.png')} alt=""/>*/}
                        </div>
                        <div className="business-right">
                            <div className="shop-name">
                                <div className="shop-name-left">
                                    <div className="appellation">欣欣美容会所 </div>
                                    <div className="time">自提时间8：00-23：00 </div>
                                </div>
                                <div className="shop-name-rght">600m</div>
                            </div>
                            <div className="location">
                                <div className="location-left icon"/>
                                <div className="location-right">福建省福州市仓山区上三路口山亚大厦B座1218</div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="store">
                    <div className="common-stores">其他门店</div>
                    <div className="business">
                        <div className="business-left">
                            {/*<img src={require('../../../../../../assets/images/sheep.png')} alt=""/>*/}
                        </div>
                        <div className="business-right">
                            <div className="shop-name">
                                <div className="shop-name-left">
                                    <div className="appellation">欣欣美容会所 </div>
                                    <div className="time">自提时间8：00-23：00 </div>
                                </div>
                                <div className="shop-name-rght">600m</div>
                            </div>
                            <div className="location">
                                <div className="location-left icon"/>
                                <div className="location-right">福建省福州市仓山区上三路口山亚大厦B座1218</div>
                            </div>
                        </div>
                    </div>
                    <div className="business">
                        <div className="business-left">
                            {/*<img src={require('../../../../../../assets/images/sheep.png')} alt=""/>*/}
                        </div>
                        <div className="business-right">
                            <div className="shop-name">
                                <div className="shop-name-left">
                                    <div className="appellation">欣欣美容会所 </div>
                                    <div className="time">自提时间8：00-23：00 </div>
                                </div>
                                <div className="shop-name-rght">600m</div>
                            </div>
                            <div className="location">
                                <div className="location-left icon"/>
                                <div className="location-right">福建省福州市仓山区上三路口山亚大厦B座1218</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
