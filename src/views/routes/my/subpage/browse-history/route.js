import CacheRoute from 'react-router-cache-route';
import History from './History';

const BorwoseModal = () => (
    <CacheRoute cacheKey="History" path="/browseHistory" component={History} when="back"/>
);

export default BorwoseModal;
