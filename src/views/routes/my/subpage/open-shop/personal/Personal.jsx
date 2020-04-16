/**我要开店---个体页面 */


import React from 'react';
import './PersonalOne.less';
import {connect} from 'react-redux';

import {createForm} from 'rc-form';
import PersonalThree from  './PersonalThree';
import PersonalFour from './PersonalFour';
import Audit from  './Audit';
import PersonalTwo from  './PersonalTwo';
import PersonalOne from  './PersonalOne';

const {getUrlParam} = Utils;

class Personal extends BaseComponent {
    state = {
        editModal: '',
        urlParams: ''
    };

    componentWillMount() {
        const type = decodeURI(getUrlParam('type', encodeURI(this.props.location.search)));
        if (window.location.href.includes('auditStatus')) {
            const auditStatus = decodeURI(getUrlParam('auditStatus', encodeURI(this.props.location.search)));
            this.setState({
                editModal: auditStatus
            });
        }
        const shopType = decodeURI(getUrlParam('shopType', encodeURI(this.props.location.search)));
        this.setState({
            urlParams: type || shopType
        });
    }

    goBack = (edit = '') => {
        this.setState({
            editModal: edit
        });
    };

    getChildren = (res) => {
        this.setState({
            editModal: res
        });
    };

    render() {
        const {editModal, urlParams} = this.state;
        return (
            <div data-component="personal" data-role="page" className="personal">
                {
                    !editModal && <PersonalOne goBack={this.goBack} that={this}/>
                }
                {
                    editModal === 'two' && <PersonalTwo goBack={this.goBack} that={this}/>
                }
                {
                    editModal === 'three' && <PersonalThree goBack={this.goBack} that={this} urlParams={urlParams}/>
                }
                {
                    editModal === 'four' && <PersonalFour goBack={this.goBack} that={this}/>
                }  {
                    editModal === 'audits' && <Audit/>
                }
            </div>
        );
    }
}

const openShop = state => {
    const my = state.get('my');
    return {
        editModal: my.get('editModal')
    };
};

export default connect(openShop, null)(createForm()(Personal));
