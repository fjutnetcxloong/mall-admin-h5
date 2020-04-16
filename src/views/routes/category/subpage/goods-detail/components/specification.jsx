/**
 * 规格参数
 * 雷疆
 */

import {Flex} from 'antd-mobile';
import PropTypes from 'prop-types';
import './specification.less';

export default class Specification extends React.PureComponent {
    static propTypes = {
        Element: PropTypes.func.isRequired,
        Link: PropTypes.func.isRequired,
        specification: PropTypes.array.isRequired,
        specificationStatus: PropTypes.bool.isRequired,
        changeSpecification: PropTypes.func.isRequired
    }


    render() {
        const {Element, specification, specificationStatus, changeSpecification, Link} = this.props;
        return (
            <Element className="specification" name="specification">
                {/*商品详情*/}
                <div className="recommend-commodity-detail">
                    <div className="currency-detail">
                        <Flex className="currency-detail-title">
                            <Flex.Item className="title-border"/>
                            <Flex.Item className="title-center">
                                规格参数
                            </Flex.Item>
                            <Flex.Item className="title-border"/>
                        </Flex>
                    </div>
                </div>

                <div className="speci-container">
                    <div className="spci-title">主体</div>
                    <div className={specificationStatus ? 'speci-content peci-content-sort' : 'speci-content'}>
                        {
                            specification.length > 0 && specification.map((item, index) => (
                                <div className="speci-list" key={index.toString() + item.name}>
                                    <div className="list-left">{item.name}</div>
                                    <div className="list-right" dangerouslySetInnerHTML={{__html: item.value}}/>
                                </div>
                            ))
                        }
                    </div>
                </div>
                {
                    specificationStatus ? (<Link className="speci-footer" onClick={changeSpecification} to="specification" spy smooth duration={500} activeClass=" ">展示</Link>) : (<Link className="speci-footer-hide" onClick={changeSpecification} to="specification" spy smooth duration={500} activeClass=" ">隐藏</Link>)
                }


            </Element>
        );
    }
}