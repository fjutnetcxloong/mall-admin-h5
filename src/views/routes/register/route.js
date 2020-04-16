import {Route} from 'react-router-dom';
// import BindPhone from './BindPhone';

const RegisterPage = Loadable({
    loader: () => import(/* webpackChunkName: 'register' */ './Register'),
    loading: () => null
});

const SetPassWordPage = Loadable({
    loader: () => import(/* webpackChunkName: 'register' */ './SetPassword'),
    loading: () => null
});

const Register = () => {
    const hybird = process.env.NATIVE;
    if (hybird) {
        return null;
    }
    return (
        <React.Fragment>
            <Route path="/login" component={RegisterPage}/>
            <Route path="/setpassword" component={SetPassWordPage}/>
            {/* <Route path="/bindPhone" component={BindPhone}/> */}
        </React.Fragment>
    );
};

export default Register;
