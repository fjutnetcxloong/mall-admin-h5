import './AnimationSphere.less';


const {getPixelRatio} = Utils;

//圆形数据
const circleData = [
    {
        locationX: 30,
        locationY: 50,
        moveToX: 60,
        moveToY: 30,
        radius: 7.5,
        direction: true
    },
    {
        locationX: 90,
        locationY: 40,
        moveToX: 120,
        moveToY: 60,
        radius: 12,
        direction: true
    },
    {
        locationX: 190,
        locationY: 60,
        moveToX: 235,
        moveToY: 20,
        radius: 2.5,
        direction: true
    },
    {
        locationX: 220,
        locationY: 35,
        moveToX: 270,
        moveToY: 20,
        radius: 15,
        direction: true
    },
    {
        locationX: 280,
        locationY: 45,
        moveToX: 320,
        moveToY: 60,
        radius: 6.5,
        direction: true
    }
];

//创建小球
class Circle {
    constructor(config = {}, context) {
        this.ctx = context;
        this.x0 = config.x0 || 0;
        this.y0 = config.y0 || 0;
        this.radius = config.r || 0;
        this.fillStyle = this.getCircleColor(this.x0, this.y0, this.radius);
        this.shadowColor = config.shadowColor || '#debded';
        this.shadowBlur = config.shadowBlur || 10;
        this.shadowOffsetX = 0;
        this.shadowOffsetY = this.radius;
        this.moveToY = config.moveToY || this.y0;
        this.direction = true;
        // canvas 参数
    }

    //  圆的渐变填充色
    getCircleColor(x0, y0, r) {
        const lineargradient = this.ctx.createLinearGradient(x0 + r, y0 - r, x0 - r, y0 + r);
        lineargradient.addColorStop(0, '#df71ac');
        lineargradient.addColorStop(1, '#8845e9');
        return lineargradient;
    }

    render() {
        this.ctx.shadowColor = this.shadowColor;
        this.ctx.shadowBlur = this.shadowBlur;
        this.ctx.shadowOffsetX = this.shadowOffsetX;
        this.ctx.shadowOffsetY = this.shadowOffsetY;
        this.ctx.fillStyle = this.fillStyle;
        this.ctx.save();
        this.ctx.beginPath();
        this.ctx.arc(this.x0, this.y0, this.radius, 0, 2 * Math.PI);
        this.ctx.fill();
        this.ctx.restore();
    }
}

export default class AnimationSphere extends React.PureComponent {
    constructor() {
        super();
        // 小球容器
        this.circleList = [];
        // 创建画布
    }

    componentDidMount() {
        this.ctx = this.canvasCon.getContext('2d');
        const ratio = getPixelRatio(this.ctx);
        this.init();
        this.draw();
        this.timer = setInterval(() => {
            this.ctx.clearRect(0, 0, this.canvasCon.width * ratio, this.canvasCon.height * ratio);
            this.draw();
        }, 100);
    }

    componentWillUnmount() {
        window.clearInterval(this.timer);
    }

    init() {
        //创建五个圆放到数组中
        circleData.forEach(item => {
            const circle = new Circle({
                x0: item.locationX,
                y0: item.locationY,
                r: item.radius,
                moveToY: item.moveToY
            }, this.ctx);
            this.circleList.push(circle);
        });
    }

    draw() {
        //小球动画效果
        this.circleList.forEach((item, index) => {
            item.render();
            if (item.direction) {
                item.y0 -= 2;
            } else {
                item.y0 += 2;
            }
            if ((circleData[index].locationY > circleData[index].moveToY && item.y0 <= circleData[index].moveToY)
                || (circleData[index].locationY < circleData[index].moveToY && item.y0 <= circleData[index].locationY)) {
                item.direction = false;
            }
            //第二个和最后一个locationY<moveToY
            if ((circleData[index].locationY > circleData[index].moveToY && item.y0 >= circleData[index].locationY)
                || (circleData[index].locationY < circleData[index].moveToY && item.y0 >= circleData[index].moveToY)) {
                item.direction = true;
            }
            //小球颜色坐标实时更新
            item.fillStyle = item.getCircleColor(item.x0 + item.radius, item.y0 - item.radius, item.x0 - item.radius, item.y0 + item.radius);
        });
    }

    render() {
        return (
            <canvas ref={ref => { this.canvasCon = ref }} className="canvas-contain"/>
        );
    }
}
