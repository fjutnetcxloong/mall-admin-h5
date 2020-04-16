import {Route} from 'react-router-dom';
import ErrorPage from './Error';
import NetErrorPage from './NetError';
import ServerErrorPage from './ServerError';


const Error = () => (
    <React.Fragment>
        <Route path="/error" component={ErrorPage}/>
        <Route path="/network-error" component={NetErrorPage}/>
        <Route path="/server-error" component={ServerErrorPage}/>
    </React.Fragment>
);

export default Error;
