/**
 * findAction 模块
 */

const findActionTypes = Utils.keyMirror({
    SET_SHOP_LIST: ''
});


function _setShopList(data) {
    return {
        type: findActionTypes.SET_SHOP_LIST,
        payload: {
            data
        }
    };
}


const findActionCreator = {
    setShopList: _setShopList
};


export {findActionTypes, findActionCreator};
