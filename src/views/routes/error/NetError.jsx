/*
* 网络错误组件
* */
import AppNavBar from '../../common/navbar/NavBar';
import Nothing from '../../common/nothing/Nothing';

const {goBackModal} = Utils;
const {FIELD} = Constants;
const Error = () => (
    <React.Fragment>
        <AppNavBar title="网络异常"/>
        <Nothing
            text={FIELD.Net_Error}
            title="返回"
            onClick={goBackModal}
        />
    </React.Fragment>
);

export default class NetError extends React.PureComponent {
    render() {
        return <Error/>;
    }
}
