import {Route, Redirect} from 'react-router-dom';

const HomePage = Loadable({
    loader: () => import(/* webpackChunkName: 'Home' */ './Home'),
    loading: () => null
});

const searchPage = Loadable({
    loader: () => import(/* webpackChunkName: 'Home' */ './Search'),
    loading: () => null
});

const Home = () => (
    <React.Fragment>
        <Route exact path="/" component={() => <Redirect to="/home"/>}/>
        <Route path="/home" component={HomePage}/>
        <Route path="/search" component={searchPage}/>
    </React.Fragment>
);

export default Home;
