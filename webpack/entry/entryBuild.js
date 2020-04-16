/* eslint-disable */
const fs = require('fs');
const path = require('path');
const entry = require('./entry');
const deleteFile = require('./deleteFile');

const MULTI = '../../multi/'; // 入口目录
const entryBuildPath = path.resolve(__dirname, MULTI);

console.log('entryBuildPath', entryBuildPath);
deleteFile(entryBuildPath);
fs.mkdirSync(entryBuildPath);
console.log('entryBuildPath2', entryBuildPath);
const entryContent = (data) => {
    return (
`import React, {Fragment} from 'react';
import ReactDOM from 'react-dom';
import {HashRouter as Router} from 'react-router-dom';
import {Provider} from 'react-redux';
import {baseActionCreator} from '../src/redux/baseAction';
import {syncHistoryWithStore} from 'react-router-redux';
import {historyStore,store} from '../src/redux/store';
import BasePageHybrid from '../src/views/common/base/BasePageHybrid';
import {ViewRoutesHybrid} from '../src/views/${data.component}';
import '../src/views/${data.less}';

const {LOCALSTORAGE} = Constants;

const HomePage = () => (
    <Provider store={store}>
        <Router hashHistory={historyStore}>
            <Fragment>
                <BasePageHybrid/>
                <ViewRoutesHybrid/>
            </Fragment>
        </Router>
    </Provider>
);

//获取userToken
window.DsBridge.call('wxLoginCallback', (data) => {
    const obj = data ? JSON.parse(data) : '';
    if(obj && obj.status === '0'){
        window.localStorage.setItem(LOCALSTORAGE.USER_TOKEN,obj.data.usertoken);
        store.dispatch(baseActionCreator.setUserToken(obj.data.usertoken));
    }
    ReactDOM.render(
        <HomePage/>,
        document.getElementById('root')
    );
});
`
    )
};

/*生成webpack entry 入口文件*/
entry.map((data) => {
    fs.writeFile(entryBuildPath + '/' + data.name + '.js', entryContent(data), 'utf8', function (err) {
        console.log('entryBuildPath3', entryBuildPath);
        if (err) {
            return console.log(err);
        }
    });
});
