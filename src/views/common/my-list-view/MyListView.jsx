/**
 * 长列表组件
 */
import {ListView, PullToRefresh} from 'antd-mobile';
import PropTypes from 'prop-types';
import Animation from '../animation/Animation';
import {ListFooter} from '../list-footer';
import './MyListView.less';

class MyListView extends React.PureComponent {
    //组件API类型
    static propTypes = {
        data: PropTypes.array, //数据源
        height: PropTypes.number, //滚动容器高度
        initSize: PropTypes.number, //首屏渲染行数
        size: PropTypes.number, //每次事件循环（每帧）渲染行数
        row: PropTypes.oneOfType([
            PropTypes.node,
            PropTypes.func
        ]), //每行渲染样式
        onEndReached: PropTypes.func, //滚动列表即将触底时调用
        loding: PropTypes.bool, //是否在上拉加载时显示提示
        more: PropTypes.bool, //是否还有数据可请求
        pullAble: PropTypes.bool, //下拉刷新功能是否可用
        refreshing: PropTypes.bool, //是否在下拉刷新时显示指示器
        onRefresh: PropTypes.func //下拉刷新列表回调
    }

    //组件API默认值
    static defaultProps = {
        data: [],
        height: 0,
        initSize: 0,
        size: 0,
        row: null,
        onEndReached() {},
        loding: false,
        more: false,
        pullAble: true,
        refreshing: false,
        onRefresh() {}
    }

    constructor(props) {
        super(props);
        //创建dataSource对象，rowHasChanged: prev和next不相等时更新row
        this.dataSource = new ListView.DataSource({
            rowHasChanged: (row1, row2) => row1 !== row2
        });
    }

    onEndReached = () => {
        this.props.onEndReached();
    }

    onRefresh = () => {
        this.props.onRefresh();
    }

    render() {
        const {data, height, initSize, size, row, pullAble, refreshing, more} = this.props;
        return (
            <ListView
                dataSource={this.dataSource.cloneWithRows(data)}//为dataSource赋值
                style={{height}}
                initialListSize={initSize}
                pageSize={size}
                renderRow={row}//从dataSource传入一行数据，返回用这行数据渲染的组件
                onEndReachedThreshold={50} //调用onEndReached之前的临界值，单位是像素
                onEndReached={this.onEndReached}
                renderFooter={() => ListFooter(more)}
                {...pullAble && {
                    pullToRefresh: <PullToRefresh
                        refreshing={refreshing}
                        onRefresh={this.onRefresh}
                        damping={70} //拉动距离限制
                        indicator={{
                            release: (
                                <Animation
                                    ref={ref => {
                                        this.Animation = ref;
                                    }}
                                />
                            )
                        }}
                    />
                }}
            />
        );
    }
}

export default MyListView;
