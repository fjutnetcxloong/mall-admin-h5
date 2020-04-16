/* 立即核销页面*/

import './Inspect.less';
import {InputItem} from 'antd-mobile';
import AppNavBar from '../../../../common/navbar/NavBar';

const {urlCfg} = Configs;

const {appHistory, showInfo, native, getUrlParam} = Utils;
export default class Inspect extends BaseComponent {
    state = {
        value: '',  //核销码
        id: decodeURI(getUrlParam('id', encodeURI(this.props.location.search))) || -1
    }

    // //核销订单
    sureOrder = () => {
        const {value, id} = this.state;
        if (value.length === 0) {
            showInfo('请输入核销码');
            return;
        }
        this.fetch(urlCfg.whiteShop, {data: {
            white_off: value,
            order_id: Number(id)
        }}).subscribe(res => {
            if (res && res.status === 0) {
                appHistory.push(`/consumer?val=${value}`);
            }
        });
    }

    onChange = (val) => {
        this.setState({
            value: val
        });
    }

  //点击扫一扫
  sureSaoCode = () => {
      if (process.env.NATIVE) {
          native('qrCodeScanCallback', {
              pay: urlCfg.importSum,
              write: urlCfg.consumer,
              source: urlCfg.sourceBrowse
          });
      }
  }

  render() {
      return (
          <div className="inspect">
              <AppNavBar rightShow title="立即核销"/>
              <InputItem
                  clear
                  placeholder="请输入对方核销码"
                  onChange={val => this.onChange(val)}
              >
                    验证码核销
              </InputItem>
              <div className="scan">
                  <div>扫码核销</div>
                  <div onClick={this.sureSaoCode} className="icon icon-scan"/>
                  <div className="pushbutton" onClick={this.sureOrder}>确认</div>
              </div>
          </div>
      );
  }
}
