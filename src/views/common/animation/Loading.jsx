/*
* 页面加载动画
* */
import './Animation.less';
// import DetailSkelon from '../skelon/DetailSkelon';
// import ListSkelon from '../skelon/ListSkelon';
// import ShopListSkelon from '../skelon/ShopListSkelon';

const {getPixelRatio} = Utils;
class Loading extends React.PureComponent {
    componentDidMount() {
        // console.log('渲染动画');
        this.draw();
    }

    componentWillUnmount() {
        // console.log('卸载组件');
        this.clear();
    }

    // canvas绘制动画
    draw = (canvas = this.canvas) => {
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        const width = canvas.width;
        const height = canvas.height;
        let x0 = 0;   //x轴的计数
        let y0 = 0;  //y轴的计数
        let initW = 0;  //截取原始图片的 x坐标
        let initH = 0;  //截取原始图片的 y坐标
        const imgWidth = 80; //截取原始图片的 宽度
        const imgHeight = 80;  //截取原始图片的 高度
        let speed = 0;
        //加载图片
        const img = new Image();
        img.src = require('../../../../src/assets/images/animate-img.png');
        img.onload = () => {
            const ratio = getPixelRatio(ctx) > 2 ? 2 : getPixelRatio(ctx);
            const animate = () => {
                speed++;
                //绘制精灵图片
                if (speed % 1 === 0) {
                    //清除 之前的 图片墨迹
                    ctx.clearRect(0, 0, width, height);
                    initW = imgWidth * x0;
                    initH = imgHeight * y0;
                    ctx.drawImage(
                        img,
                        initW,
                        initH,
                        imgWidth,
                        imgHeight,
                        0,
                        0,
                        imgWidth / ratio,  //在画布上等比例绘制图片的宽度
                        imgHeight / ratio   //在画布上等比例绘制图片的高度
                    );
                    if (x0 < 8) {
                        x0++;
                    } else {
                        x0 = 0;
                        y0++;
                    }
                    if (y0 > 7) {
                        x0 = 0;
                        y0 = 0;
                    }
                }
                this.timer = requestAnimationFrame(animate);
            };
            animate();
        };
    };

    // 清除动画缓存
    clear= () => {
        window.cancelAnimationFrame(this.timer);
        // console.log('清理');
    };

    render() {
        return (
            <div className="canvas-mask">
                <canvas
                    ref={(el) => { this.canvas = el }}
                    className="canvas-load"
                    width="40"
                    height="40"
                />
                {/* <div className="skelon">
                    {
                        window.location.href.includes('goodsDetail') && <DetailSkelon/>
                    }
                    {
                        (window.location.href.includes('browseHistory') || window.location.href.includes('collect') || window.location.href.includes('shopCart')) && <ShopListSkelon/>
                    }
                    {
                        !window.location.href.includes('goodsDetail') && !(window.location.href.includes('browseHistory') || window.location.href.includes('collect') || window.location.href.includes('shopCart')) && <ListSkelon/>
                    }
                </div> */}
            </div>
        );
    }
}

export default Loading;
