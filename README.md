# 中品优购

## 项目介绍

移动端H5商城应用的开发。
react技术栈，主要应用 react + redux + immutable.js + rxjs 。
UI库，依赖antd-mobile。
编码规范，eslint。

### Install 

```shell
npm instal  #安装项目依赖
npm install -g json-server #全局安装json-server 本地数据请求测试服务器

npm install mockjs #模拟数据。
```

### Start & mock

~~~shell
npm run dev #运行开发代码
npm run mock #启动本地后端测试服务器
~~~

### Build

```sh
npm run test  # 打包测试版本
npm run prod  # 打包生产版本
```
## 目录结构
```
   src  ---------------开发源码目录
    ｜———— assets       // 静态资源————样式，图片， 第三方js库
    ｜———— components   // UI组件————项目组件，其他项目也会通用的组件，eg：加载组件，弹窗组件
    ｜———— configs      // 配置————项目参数配置 eg：请求接口api地址
    ｜———— constants    // 常量定义————项目常量定义 eg: 提示语
    ｜———— http         // http请求————统一数据请求封装
    ｜———— redux        // redux相关
    ｜———— utils        // 公共函数
    ｜———— views        // 视图
        ｜———— common   // 页面公用组件
        ｜———— routes   // 页面
    ｜———— index.ejs    // index.html 文件
    ｜———— main.ejs     // 应用入口js文件

目录命名规范: 小写字母 或者 中划线 eg: input, footer-bar
文件命名规范： 首字母大写+驼峰 eg: FooterBar
```


## 代码规范
### css 命名规范

统一格式： 中划线
  命名思想： BEM，eg: block-element-modifier

1. 变量，函数统一格式：驼峰
     eg: bannerRender

### jsx逻辑规范

1. render函数尽量避免处理逻辑，有需要直接写成方法处理；

2. 变量命名统一要ES6语法；

3. 纯组件不要继承BaseComponent

4. 函数与函数之间空一行

5. 使用ES6的class来定义有状态组件：有请求数据时extends BaseComponent；无请求数据时extends React.PureComponent

6. 将state写在构造函数外面

7. 使用箭头函数创建组件内的方法，不需要使用bind绑定回调函数     [参考](https://react.docschina.org/docs/handling-events.html)

8. 使用函数来定义无状态组件

9. 函数功能是否职责单一

10. 函数不存在副作用，是否是纯函数

11. constructor不是必须的，有需要才构建，一旦有constructor，就必须要有super。

    [参考]: https://segmentfault.com/a/1190000008165717

12. react组件生命周期的函数按顺序写在最前面，然后在业务逻辑的代码

### url规范

1. URl结尾不应包含（/）
2. 正斜杠分隔符（/）必须用来指示层级关系
3. 应使用连字符（ - ）来提高URI的可读性
4. 不得在URI中使用下划线（_）
5. URI路径中全都使用小写字母

### 特殊的注释

**TODO: + 说明**：
如果代码中有该标识，说明在标识处有功能代码待编写，待实现的功能在说明中会简略说明。

**FIXME: + 说明**：（下面中的一种情况）

1、如果代码中有该标识，说明标识处代码虽然实现了功能，但是实现的方法有待商榷，希望将来能改进，要改进的地方会在说明中简略说明。

2、如果代码中有该标识，说明标识处代码需要修正，甚至代码是错误的，不能工作，需要修复，如何修正会在说明中简略说明。  




## 依赖库介绍

### react-loadable
A higher order component for loading components with promises
用于按需加载
[参考] https://github.com/jamiebuilds/react-loadable

### redux-immutable  react-immutable-proptypes prop-types
引入Immutable.js进行数据比较, 提高性能。
redux-immutable：Immutable.js与redux的结合
react-immutable-proptypes: Immutable对象属性的验证
prop-types: 属性的验证

### react-router-dom
BrowserRouter: 需要服务端配合前端做一些简单的修改，格式：'com/home/xxx'
HashRouter: 根据不同hashType来改变路由，格式：
            hashType: 'slash'     // 默认
            history.push('/home') // window.location.hash = '#/home'

            hashType: 'noslash'   // 去掉首斜杠
            history.push('/home') // window.location.hash = '#home'
    
            hashType: 'hashbang'  // Google's 旧款 AJAX URL 格式
            history.push('/home') // window.location.hash = '#!/home'

### react-router-redux 保持路由与应用状态（state）同步
本库允许你使用React Router库中的api，使用Redux库像平常一样去管理应用的状态state。
本库只是简单的加强了React Router库中history这个实例，以允许将history中接受到的变化反应到stae中去。

### DefinePlugin
new webpack.DefinePlugin(definitions)
允许你创建一个在编译时可以配置的全局常量。这可能会对开发模式和发布模式的构建允许不同的行为非常有用。
比如,你可能会用一个全局的常量来决定 log 在开发模式触发而不是发布模式。这仅仅是 DefinePlugin 提供的便利的一个场景。
```
new webpack.DefinePlugin({
    'process.env': {
        NODE_ENV: JSON.stringify(isProduction ? 'production': 'development')
    }
})
```

### HtmlWebpackPlugin 
https://www.cnblogs.com/wonyun/p/6030090.html
该插件的两个主要作用:
    1. 为html文件中引入的外部资源如script、link动态添加每次compile后的hash，防止引用缓存的外部文件问题
    2. 可以生成创建html入口文件，比如单页面可以生成一个html文件入口，配置N个html-webpack-plugin可以生成N个页面入口

### Mock
https://github.com/nuysoft/Mock/wiki
该插件的作用：生成随机数据,拦截Ajax 请求，模拟场景。
语法规范：
        1.数据模板定义规范
            数据模板中每个属性3部分组成：属性名，生成规则，属性值，属性名和生成规则间用 | 分隔。
            例如：'name|rule': value
            
        2.数据占位符定义规范
            占位符，只是在属性值字符串中占个位置，并不出现在最终的属性值中。格式为：@占位符或 或 @占位符(参数 [, 参数])
            例如：first: '@FIRST'
                 
            示例：http://mockjs.com/examples.html

Mock.mock():
        作用：根据数据模板生成模拟数据。
        方法：Mock.mock( rurl?, rtype?, template|function( options ) )
        参数：
            1.rurl：可选。表示需要拦截的 URL，可以是 URL 字符串或 URL 正则。
                    例如 /\/domain\/list\.json/、'/domian/list.json'。
              
            2.rtype：可选。表示需要拦截的 Ajax 请求类型。
                    例如 GET、POST、PUT、DELETE 等。
              
            3.template：可选。表示数据模板，可以是对象或字符串。
                    例如 { 'data|1-10':[{}] }、'@EMAIL'。
                
            4.function(options)：可选。表示用于生成响应数据的函数。
                    options指向本次请求的 Ajax 选项集，含有 url、type 和 body 三个属性，参见 XMLHttpRequest 规范。

Mock.Random:
        作用：是一个工具类，用于生成各种随机数据。
        Mock.Random 提供的完整方法（占位符）：
        Basic,Image,Color,Text,Name,Web,Address,Helper,Miscellaneous。
        Basic:
              1.Mock.Random.boolean() 返回一个随机的布尔值。
              
              2.Random.natural() 返回一个随机的自然数（大于等于 0 的整数）
              
              3.Random.integer()返回一个随机的整数。
              
              4.Random.float()返回一个随机的浮点数。
              
              5.Random.character()返回一个随机字符。
              
              6.Random.string()返回一个随机字符串
              
              7.Random.range( start?, stop, step? )返回一个整型数组。
               
        Color:
                Random.color():随机生成一个有吸引力的颜色，格式为 '#RRGGBB'。
        Image：
                Random.image( size?, background?, foreground?, format?, text? )：生成一个随机的图片地址。
        Text：
                1.Random.word( min, max )：随机生成一个单词。
                2.Random.cparagraph( min?, max? )：随机生成一段中文文本。
                3.Random.cword( pool?, min?, max? )：随机生成一个汉字。                  
Mock.setup:
        作用：配置拦截 Ajax 请求时的行为。
        方法：Mock.setup( settings )
                settings，必选，配置项集合。
                timeout,可选。指定被拦截的 Ajax 请求的响应时间，单位是毫秒。
                例如：Mock.setup({
                       timeout: 400
                   })
Mock.toJSONSchema():
         作用：把 Mock.js 风格的数据模板 template 转换成 JSON Schema。
         方法：Mock.toJSONSchema( template )                    
                
        
                        
                
               
                
                
                
