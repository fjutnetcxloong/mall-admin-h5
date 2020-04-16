import {Route} from 'react-router-dom';
import searchPage from './Search';

// const searchPage = Loadable({
//     loader: () => import(/* webpackChunkName: 'Home' */ './Search'),
//     loading: () => null
// });

const Home = () => (
    <Route path="/search" component={searchPage}/>
);

export default Home;
