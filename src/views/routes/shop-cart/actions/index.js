/**
 * demoAction 模块
 */

const shopCartActionTypes = Utils.keyMirror({
    SET_SHOP_CART_ORDER_INFO: '',
    SET_SHOP_CART_IDS: ''
});


function _setOrder(arr) {
    return {
        type: shopCartActionTypes.SET_SHOP_CART_ORDER_INFO,
        payload: {
            arr
        }
    };
}

function _setIds(ids) {
    return {
        type: shopCartActionTypes.SET_SHOP_CART_IDS,
        payload: {
            ids
        }
    };
}

const shopCartActionCreator = {
    setOrder: _setOrder,
    setIds: _setIds
};


export {shopCartActionTypes, shopCartActionCreator};
