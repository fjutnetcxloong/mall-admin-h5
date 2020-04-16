/**
 * webpack config
 * 忽略 eslint 检查
 */
/* eslint-disable */
const path = require('path');
const webpack = require('webpack');
const autoprefixer = require('autoprefixer');
const pxtorem = require('postcss-pxtorem');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CleanPlugin = require('clean-webpack-plugin');
const IP = require('ip').address();
// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

/**
 * 引入配置文件
 */
const pkg = require('../package.json');

/**
 * 变量定义
 */

const ENTRYDIR = '../src/'; // 入口目录
const OUTPUTDIR = '../dist/'; // 打包目录

/* postcss 配置 */
const postcssConfig = {
    ident: 'postcss', // https://webpack.js.org/guides/migrating/#complex-options
    plugins: () => [
        autoprefixer({
            browsers: pkg.browserslist,
        }),
        pxtorem({rootValue: 100, propWhiteList: []})
    ],
};

/* svgo 配置 */
const svgoConfig = {
    plugins: [
        {removeTitle: true},
        {convertColors: {shorthex: true}},
        {convertPathData: true},
        {cleanupAttrs: true},
        {removeComments: true},
        {removeDesc: true},
        {removeUselessDefs: true},
        {removeEmptyAttrs: true},
        {removeHiddenElems: true},
        {removeEmptyText: true}
    ]
};


/**
 * 函数定义
 */

/* 环境变量类 */
class Environment {
    constructor(envObj) {
        this.env = envObj;
    }

    isDevServer() {
        return this.__chkEnv('devServer')
    }

    isDevEnv() {
        return this.__chkEnv('development');
    }

    isTestEnv() {
        return this.__chkEnv('test');
    }

    ispreProdEnv() {
        return this.__chkEnv('prev');
    }

    isProdEnv() {
        return this.__chkEnv('production')
    }

    path() {
        let name;
        Object.keys(this.env).forEach((item) => {
            if (/development|test|production|prev/g.test(item)) {
                name = item;
            }
        })
        return name;
    }

    __chkEnv(envName) {
        return this.env[envName];
    }
}

module.exports = (env = {}) => {

    const ENV = new Environment(env);

    console.log(ENV.path());
    let baseConfig = {
        devtool: ENV.isDevEnv() ? 'cheap-module-inline-source-map' : 'source-map',
        module: {
            rules: [
                /* Rules for svg */
                {
                    test: /\.(svg)$/i,
                    rules: [
                        {
                            include: require.resolve('antd-mobile').replace(/warn\.js$/, ''),
                            use: [{
                                loader: 'svg-sprite-loader'
                            }, {
                                loader: 'svgo-loader',
                                options: svgoConfig
                            }]
                        },
                        {
                            include: path.resolve(__dirname, ENTRYDIR),
                            exclude: path.resolve(__dirname, ENTRYDIR + '/components/toast/loading'),
                            use: [{
                                loader: 'url-loader?limit=8192&name=images/[name].[ext]',
                            }, {
                                loader: 'svgo-loader',
                                options: svgoConfig
                            }]
                        },
                        {
                            include: path.resolve(__dirname, ENTRYDIR + '/components/toast/loading'),
                            use: {
                                loader: 'raw-loader',
                            }
                        }
                    ]

                },
                /* Rules for js|jsx */
                {
                    test: /\.js|jsx$/,
                    rules: [
                        /* eslint */
                        {
                            include: path.resolve(__dirname, ENTRYDIR),
                            enforce: 'pre',
                            use: [{
                                loader: 'eslint-loader',
                                options: {
                                    formatter: require('eslint-friendly-formatter'),
                                    configFile: './.eslintrc'
                                }
                            }]
                        },
                        {
                            include: path.resolve(__dirname, ENTRYDIR),
                            use: [{
                                loader: 'babel-loader',
                                options: {
                                    babelrc: false,
                                    cacheDirectory: ENV.isDevEnv(),
                                    presets: [
                                        'es2015',
                                        'react',
                                        'stage-0'
                                    ],
                                    plugins: [
                                        ['import', {libraryName: 'antd-mobile', style: true}],
                                        'transform-object-assign',
                                        'transform-decorators-legacy',
                                        'react-hot-loader/babel',
                                        'react-hot-loader/babel'
                                    ]
                                }
                            }]
                        }
                    ],

                },
                /* Rules for Style Sheets */
                {
                    test: /\.(css|less|scss|sss)$/,
                    rules: [
                        // Process external/third-party styles
                        {
                            include: [/node_modules/],
                            use: ExtractTextPlugin.extract({
                                fallback: 'style-loader',
                                use: [
                                    {
                                        loader: 'css-loader',
                                        options: {
                                            sourceMap: ENV.isDevEnv(),
                                            minimize: !ENV.isDevEnv(),
                                            discardComments: {removeAll: true},
                                        }
                                    },
                                    {
                                        loader: 'postcss-loader',
                                        options: postcssConfig
                                    },
                                    {
                                        loader: 'less-loader',
                                        options: {modifyVars: pkg.theme}
                                    }
                                ]
                            }),

                        },

                        // Process internal/project styles (from src folder)
                        {
                            include: path.resolve(__dirname, ENTRYDIR),
                            use: ExtractTextPlugin.extract({
                                fallback: 'style-loader',
                                use: [
                                    {
                                        loader: 'css-loader',
                                        options: {
                                            // CSS Loader https://github.com/webpack/css-loader
                                            importLoaders: 1,
                                            sourceMap: ENV.isDevEnv(),
                                            // CSS Modules https://github.com/css-modules/css-modules
                                            modules: true,
                                            localIdentName: '[local]',
                                            // CSS Nano http://cssnano.co/options/
                                            minimize: !ENV.isDevEnv(),
                                            discardComments: {removeAll: true},
                                        }
                                    },
                                    {
                                        loader: 'postcss-loader',
                                        options: postcssConfig
                                    },
                                    {
                                        loader: 'less-loader'
                                    }
                                ]
                            }),
                        },
                    ],
                },
                /* Rules for images */
                {
                    test: /\.(png|jpg|jpeg|gif)$/,
                    exclude: /node_modules/,
                    use: {
                        loader: 'url-loader?limit=512&name=images/[name].[ext]',
                    }
                },
                /* Rules for ejs */
                {
                    test: /\.ejs$/,
                    use: {
                        loader: 'ejs-loader'
                    }
                }
            ],
            noParse: /Zepto/ // 不用解析和处理的模块
        },
        externals: { // 使用来自 JavaScript 运行环境提供的全局变量,不用打包进代码中。
            Zepto: 'Zepto'
        },
        node: {
            fs: 'empty'
        },
        resolve: {
            extensions: ['.web.js', '.jsx', '.js', '.json'],
            mainFields: ['jsnext:main', 'browser', 'main'], // 针对 Npm 中的第三方模块优先采用 jsnext:main 中指向的 ES6 模块化语法的文件
            alias: {
                '@assets': path.join(__dirname, ENTRYDIR + '/assets'), //设置公共样式别名，用绝对路径引入
                style: path.join(__dirname, ENTRYDIR + '/assets/style/index.less'), //设置公共样式别名，用绝对路径引入
                reboot: path.join(__dirname, ENTRYDIR + '/assets/style/reboot.less'), //设置公共样式别名，用绝对路径引入
                'react-dom': '@hot-loader/react-dom'
            }
        },
        plugins: [
            //定义全局变量
            new webpack.ProvidePlugin({
                React: 'react',
                Loadable: 'react-loadable',
                XHR: [path.resolve(__dirname, ENTRYDIR + '/http/rxios'), 'default'],
                Configs: [path.resolve(__dirname, ENTRYDIR + '/configs/index')],
                Constants: [path.resolve(__dirname, ENTRYDIR + '/constants/index')],
                Utils: [path.resolve(__dirname, ENTRYDIR + '/utils/index')],
                BaseComponent: [path.resolve(__dirname, ENTRYDIR + '/components/base/BaseComponent'), 'default']
            }),
            new HtmlWebpackPlugin({
                title: '',
                template: path.resolve(__dirname, ENTRYDIR + '/index.ejs'),
                filename: 'index.html',
                inject: false,
                hash: true,    // 打包文件添加hash
                env: ENV.path()
            }),
            new ExtractTextPlugin({
                filename: '[name].[hash:8].css',
                allChunks: true,
                disable: ENV.isDevEnv()
            }),
            new CleanPlugin(path.join(__dirname, OUTPUTDIR + ENV.path()),{
                "root": path.resolve(__dirname, '../'),
                "exclude": ['.svn', '.git', 'index.php', '.gitignore']
            }),
            new webpack.optimize.CommonsChunkPlugin({ // 提取 node_modules 中的文件
                names: 'vendor',
                minChunks: module => {
                    return /node_modules.*\.(js|jsx)$/.test(module.resource)
                }
            }),
            // new BundleAnalyzerPlugin(),
            /*new webpack.optimize.CommonsChunkPlugin({  // 将webpack引导程序逻辑提取到单独的文件中
                name: "manifest",
                minChunks: Infinity
            }),*/
            new webpack.DefinePlugin({
                /* 定义环境变量 NODE_ENV ，在开发代码中区分环境 */
                'process.env': {
                    NODE_ENV: JSON.stringify(ENV.path()),
                    WEIXIN: JSON.stringify(true),
                }
            }),
            ...(ENV.isDevEnv()
                ? [
                    new webpack.HotModuleReplacementPlugin(),   // 热更新插件
                    new webpack.NamedModulesPlugin(),  // 在热加载时直接返回更新文件名，而不是文件的id
                ]
                : []),
            ...((ENV.isProdEnv() || ENV.ispreProdEnv())
                ? [
                    new webpack.optimize.UglifyJsPlugin({
                        mangle: {
                            except: ['$super', '$', 'exports', 'require', 'module', '_']
                        },
                        compress: {
                            warnings: false,  // 在UglifyJs删除没有用到的代码时不输出警告
                            drop_debugger: true,
                            drop_console: true,  // 删除所有的 `console` 语句，可以兼容ie浏览器
                        },
                        output: {
                            beautify: false,  // 最紧凑的输出
                            comments: false,  // 删除所有的注释
                        }
                    })
                ]
                : [])

        ],
    };

    let clientConfig = Object.assign(baseConfig, {
        name: 'client',
        target: 'web',
        // context: path.resolve(__dirname, ENTRYDIR), // 默认为执行启动 Webpack 时所在的当前工作目录
        entry: {
            main: ['babel-polyfill', path.resolve(__dirname, ENTRYDIR + 'main.js')]
        },
        output: {
            path: path.join(__dirname, OUTPUTDIR + ENV.path()),
            filename: ENV.isDevEnv()
                ? 'js/[name].js'
                : 'js/[name].[hash:8].js',
            chunkFilename: ENV.isDevEnv()
                ? 'js/chunk/[name].chunk.js'
                : 'js/chunk/[name].[hash:8].chunk.js',
        },
    });

    ENV.isDevServer() && (clientConfig.devServer = {
        disableHostCheck: true,
        host: 'localhost',
        // host: '127.0.0.1',
        hot: true,  // 是否开启模块热替换功能
        inline: true,
        compress: true,  // 是否开启 gzip 压缩
        port: 80,
        open: true,
        openPage: '../index.html#/home'
    });

    return clientConfig;
}
