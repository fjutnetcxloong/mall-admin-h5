/**
 * 高阶组件————创建body子元素组件
 */

import ReactDOM from 'react-dom';

export function LayeredComponentMixin(target) {
    return class LayeredMixin extends target {
        componentDidMount() {
            // Appending to the body is easier than managing the z-index of
            // everything on the page.  It's also better for accessibility and
            // makes stacking a snap (since components will stack in mount order).
            this._layer = document.createElement('div');
            document.body.appendChild(this._layer);
            this._renderLayer();
            super.componentDidMount && super.componentDidMount();
        }

        componentDidUpdate() {
            this._renderLayer();
            super.componentDidUpdate && super.componentDidUpdate();
        }

        componentWillUnmount() {
            this._unrenderLayer();
            document.body.removeChild(this._layer);
            super.componentWillUnmount && super.componentWillUnmount();
        }

        render() {
            return null;
        }

        _renderLayer() {
            // By calling this method in componentDidMount() and
            // componentDidUpdate(), you're effectively creating a "wormhole" that
            // funnels React's hierarchical updates through to a DOM node on an
            // entirely different part of the page.

            const layerElement = super.renderLayer();
            // Renders can return null, but React.render() doesn't like being asked
            // to render null. If we get null back from renderLayer(), just render
            // a noscript element, like React does when an element's render returns
            // null.
            if (layerElement === null) {
                ReactDOM.render(<noscript/>, this._layer);
            } else {
                ReactDOM.render(layerElement, this._layer);
            }
        }

        _unrenderLayer() {
            ReactDOM.unmountComponentAtNode(this._layer);
        }
    };
}
