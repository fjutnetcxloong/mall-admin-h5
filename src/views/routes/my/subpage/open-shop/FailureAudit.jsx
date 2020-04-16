import React from 'react';
import AppNavBar from '../../../../common/navbar/NavBar';
import Nothing from '../../../../common/nothing/Nothing';


const {appHistory} = Utils;
const {FIELD} = Constants;

export default class FailureAudit extends BaseComponent {
    emptyGoTo = () => {
        // const {type} = this.props;
        // if (type === '1') {
        //     appHistory.replace(`/individual?type=${type}`);
        // } else {
        //     appHistory.replace(`/personal?type=${type}`);
        // }
        appHistory.replace('/selectType');
    };

    render() {
        return (
            <div className="audit">
                <AppNavBar title="审核失败"/>
                <Nothing
                    text={FIELD.Audit_Failure}
                    onClick={this.emptyGoTo}
                    title="修改"
                />
            </div>
        );
    }
}
