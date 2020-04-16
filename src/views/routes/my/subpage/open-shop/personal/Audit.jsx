import React from 'react';
import AppNavBar from '../../../../../common/navbar/NavBar';
import Nothing from '../../../../../common/nothing/Nothing';
import {native} from '../../../../../../utils/native';

const {appHistory} = Utils;
const {FIELD} = Constants;
export default class Audit extends BaseComponent {
    emptyGoTo = () => {
        if (process.env.NATIVE) {
            native('goBack');
        } else {
            appHistory.replace('/my');
        }
    }

    render() {
        return (
            <div className="audit">
                <AppNavBar title="审核中" goBackModal={() => this.emptyGoTo()}/>
                <Nothing
                    text={FIELD.Await}
                    onClick={this.emptyGoTo}
                    title="确定"
                />
            </div>
        );
    }
}
