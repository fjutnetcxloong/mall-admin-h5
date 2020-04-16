
export function ListFooter(hasMore) {
    return (
        <div style={{padding: 10, textAlign: 'center'}}>
            {hasMore ? '正在加载...' : '没有更多了'}
        </div>
    );
}