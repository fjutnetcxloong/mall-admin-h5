import React from 'react';
import './Animation.less';

class CircleLoading extends React.PureComponent {
    componentDidMount() {
        // console.log('渲染动画');
        this.draw();
    }

    componentWillUnmount() {
        // console.log('卸载组件');
        this.clear();
    }

    draw =(canvas = this.canvas) => {
        let number = 0;
        let speed = 0;
        if (!canvas) {
            // console.log('无canvas');
            return;
        }
        const ctx = canvas.getContext('2d');

        const height = canvas.height;
        const width = canvas.width;

        if (window.devicePixelRatio) {
            canvas.height = window.devicePixelRatio * height;
            canvas.width = window.devicePixelRatio * width;
            ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
        }

        const draw1 = (index, num) => {
            let color = 'rgb(217,217,217)';
            const x = 7;
            const y = 50;
            const r = 7;
            ctx.beginPath();
            if (index === num) {
                color = 'rgb(255,41,87)';
            }
            ctx.fillStyle = color;
            ctx.arc(x + num * 4 * r, y, r, 0, Math.PI * 2, true);
            ctx.fill();
            ctx.closePath();

            if (window.devicePixelRatio) {
                canvas.style.transform = 'scale(' + 1 / window.devicePixelRatio + ')';
                canvas.style.transformOrigin = 'left top';
            }
        };
        const circle = (index) => {
            ctx.clearRect(0, 0, 330, 330);
            for (let i = 0; i < 3; i++) {
                draw1(index, i);
            }
        };
        const animate = () => {
            if (speed % 10 === 0) {
                circle(number++);
                if (number === 3) {
                    number = 0;
                }
            }
            speed++;
            this.timer = requestAnimationFrame(animate);
        };
        animate();
    }

    // 清除动画缓存
    clear= () => {
        window.cancelAnimationFrame(this.timer);
        // console.log('清理');
    };

    render() {
        return (
            <div className="canvas-mask">
                <div className="canvas-contain">
                    <div className="canvas-load-contain" style={{width: '70px', height: '100px', overflow: 'hidden'}}>
                        <canvas
                            ref={(el) => { this.canvas = el }}
                            className="canvas-load"
                            width="70"
                            height="100"
                        />
                    </div>
                </div>
            </div>
        );
    }
}
export default CircleLoading;
