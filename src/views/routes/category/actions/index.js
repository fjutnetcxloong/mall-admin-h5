/**
 * demoAction 模块
 */

const categoryActionTypes = Utils.keyMirror({
    SET_CATEGORY: '',
    SET_INDEX: '',
    SET_REFRESH: ''
});


function _setCategory(data) {
    return {
        type: categoryActionTypes.SET_CATEGORY,
        playload: {
            data
        }
    };
}

function _setIndex(index) {
    return {
        type: categoryActionTypes.SET_INDEX,
        playload: {
            currentIndex: index
        }
    };
}

function _setFresh(flag) {
    return {
        type: categoryActionTypes.SET_REFRESH,
        playload: {
            freshing: flag
        }
    };
}

const categoryActionCreator = {
    setCategory: _setCategory,
    setIndex: _setIndex,
    setFresh: _setFresh
};


export {categoryActionTypes, categoryActionCreator};
