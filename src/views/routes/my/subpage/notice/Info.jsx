import React from 'react';
import AppNavBar from '../../../../common/navbar/NavBar';
import './Notice.less';


const {urlCfg} = Configs;
export default class Info extends BaseComponent {
    constructor() {
        super();
        this.state = {
            infoData: []
        };
    }

    componentDidMount() {
        this.getMessage(this.props.infoId);
    }

    getMessage = (id) => {
        this.fetch(urlCfg.getMyMessageInfo, {method: 'post', data: {id: id}})
            .subscribe((res) => {
                if (res.status === 0) {
                    this.setState({
                        infoData: res.data
                    });
                }
            });
    }


    render() {
        let BlockModal = <div/>;
        switch (this.state.editModal) {
        default:
            BlockModal = (
                <div data-component="notice" data-role="page" className="notice">
                    <AppNavBar title="我的消息" goBackModal={this.props.goBackModal}/>
                    <div className="info">
                        <div>
                            <p>{this.state.infoData.title}</p>
                            <span>{this.state.infoData.crtdate}</span>
                        </div>
                        <p>{this.state.infoData.intro}</p>
                    </div>
                </div>
            );
        }
        return BlockModal;
    }
}
