import {currentHref as href} from './hrefCfg';

export const urlCfg = {
    login: href.apiPath + '/login',  // 登录,
    homeBanner: href.apiPath + '/home-banner',  // 轮播图和首页的单张图
    homeSearch: href.apiPath + '/home-pr-search-key', //首页搜做
    homeGetCategoryOne: href.apiPath + '/home-get-category-one',  // 商品分类（首页使用）
    homeRecommendPr: href.apiPath + '/home-recommend-pr',  // 推荐商品
    homeRecommendSort: href.apiPath + '/home-recommend-sort',  // 推荐分类
    classify: href.apiPath + '/sort-get-category', // 分类
    showCateValue: href.apiPath + '/get-car-byuserid', //返货购物车列表
    deleteCartShop: href.apiPath + '/del-car-goods', //删除购物车商品
    addShopCart: href.apiPath + '/add-shopping-car', //添加商品到购物车
    updateCart: href.apiPath + '/update-car', //更新购物车数据
    getMyRecommend: href.apiPath + '/my-recom-list', //我的界面推荐列表
    CollectionList: href.apiPath + '/my-collect-list', //收藏
    GeneratingInvitationCode: href.apiPath + '/my-qrcode', //生成邀请码
    SelectInvitationCode: href.apiPath + '/my-qrpage', //选择邀请码背景图片
    getOriginalID: href.apiPath + '/my-set-ori-uid', //查看原始ID
    getCode: href.apiPath + '/vcode', //获取验证码
    getCategoryList: href.apiPath + '/home-pr-search ', //获取商品列表数据
    getGoodsDetail: href.apiPath + '/mall-pr-detail', // 商品详情
    getCartSku: href.apiPath + '/pr-sku', // 购物车SKU
    getMyMessage: href.apiPath + '/my-notice-list', //我的消息消息
    getMyMessageInfo: href.apiPath + '/my-notice-read', //我的消息详情（某一条）
    alreadyReadDelete: href.apiPath + '/my-notice-edit', //我的消息 标记为已读或者删除
    modifyNickname: href.apiPath + '/my-set-edit-name', //修改昵称
    personalCenter: href.apiPath + '/my-userinfo', //个人中心
    getRecomList: href.apiPath + '/my-recom-list', //我的-每日推荐列表
    getRecomDetail: href.apiPath + '/my-recom-detail', //我的-每日推荐列表详情
    getEvaluate: href.apiPath + '/sort-pr-appraiselist', //评论界面 全部评价
    getEvaDetail: href.apiPath + '/sort-pr-appraisedetail', //评论详情
    modifyLoginPassword: href.apiPath + '/modifyloginpwd', //更新登录密码
    getTheAuthenticationCode: href.apiPath + '/vcode', //获取短信验证码
    verificationVerificationCode: href.apiPath + '/check-vcode', //验证验证码正确性
    addressManagement: href.apiPath + '/my-set-get-receiving-address', //获取我的地址列表
    editAddressOne: href.apiPath + '/address-detail', //编辑地址，获取详情
    addedOrEditedAddress: href.apiPath + '/my-set-address-save', //新增或编辑地址
    deleteAddress: href.apiPath + '/my-set-del-address', //删除地址
    selectAddress: href.apiPath + '/pcat', //选择地址
    getTheBankCardList: href.apiPath + '/member-banklist', //获取银行卡列表
    addBankCard: href.apiPath + '/addbank', //添加绑定银行卡
    delBankInfo: href.apiPath + '/delbankinfo', //解绑银行卡
    getBank: href.apiPath + '/getbank', //获取银行信息
    messageSetupStatus: href.apiPath + '/my-set-notice-stu', //消息设置状态获取
    setMessageSetupStatus: href.apiPath + '/my-set-notice', //消息设置状态设置
    myDetailed: href.apiPath + '/asset-mana', //我的资产列表数据
    myListOfAssets: href.apiPath + '/trade-log', //我的资产列表
    reserveIncome: href.apiPath + '/reserve', //我的资产列表 -- 预备收益
    detailsOfAmount: href.apiPath + '/trade-log-detail', //我的资产列表 -- 每笔金额的详情
    dailyIncome: href.apiPath + '/gettaking', //我的资产列表 -- 每天的收入
    dailyIncomeAll: href.apiPath + '/taking-other', //我的资产列表 -- 每天的收入集合
    afterSalesRefundList: href.apiPath + '/notice-list', //售后/退款 列表
    selectAftersalestype: href.apiPath + '/select-aftersalestype', //售后/退款 申请选项
    jdRefundPage: href.apiPath + '/jd-refund-page', //售后/退款 申请页
    jdRefundApply: href.apiPath + '/jd-refund-apply', //售后/退款 申请保存
    jdCreateAfsApply: href.apiPath + '/jd-create-afs-apply', //售后/退款 申请保存后通知京东的接口
    originalQuantification: href.apiPath + '/invori', //原始定量
    commodityCollection: href.apiPath + '/my-collect-add-pr', //商品收藏
    updatePaymentPassword: href.apiPath + '/modifypaypwd', //更新支付密码
    settingPageData: href.apiPath + '/set-used', //设置页面数据请求
    // wechatPayment: href.apiPath + '/wx-app-pay', //微信支付
    // wechatPayment: href.apiPath + '/wxpay', //微信支付
    // alipayPayment: href.apiPath + '/alipay', //支付宝支付
    payAppPay: href.apiPath + '/app-pay', // 支付接口， 琦红，2019.3.9
    batchPayment: href.apiPath + '/nmrs-pay', //批量支付
    storeDetails: href.apiPath + '/shop-detail', //商店详情
    allGoodsInTheShop: href.apiPath + '/shop-pr-list', //商店内所有商品
    shopModel: href.apiPath + '/shop-model', //商店模板
    questionFeedback: href.apiPath + '/question-feedback', //问题反馈
    pictureUploadBase: href.apiPath + '/pic-save-base', //图片上传
    orderDetailInfo: href.apiPath + '/mall-shop-order-detail', //订单详情
    payRightInfo: href.apiPath + '/mall-shop-order-price', //立即购买详情信息
    mallOrder: href.apiPath + '/mall-order', //订单列表
    delMallOrder: href.apiPath + '/deal-mallorder', //取消/删除订单
    dealMallorderbyno: href.apiPath + '/deal-mallorderbyno', //付款页面，取消/删除订单
    remindOrder: href.apiPath + '/tip-deliver', //提醒发货
    confirmOrder: href.apiPath + '/chk-receive', //确认收货
    switchToClassFiy: href.apiPath + '/home-pr-search', //首页跳转搜索
    talkWithOther: href.apiPath + '/my-order-talk', //评论
    orderDetail: href.apiPath + '/mall-shop-order-detail', //订单详情页面
    addCollect: href.apiPath + '/car-to-collect', //添加商品收藏
    addCollectSingle: href.apiPath + '/my-collect-add-pr', //单个商品添加收藏
    addCollectShop: href.apiPath + '/my-collect-add-shop', //添加商店收藏
    cancelCollect: href.apiPath + '/my-collect-del', //取消收藏
    like: href.apiPath + '/sort-upvote', //点赞
    notLike: href.apiPath + '/sort-upvote-del', //取消点赞
    orderAppraise: href.apiPath + '/my-order-appra-page', //订单评价页面
    findShop: href.apiPath + '/discover-gps', //发现周围商家
    findForShopName: href.apiPath + '/discover-search-mall', //搜索商家
    publishAssess: href.apiPath + '/my-order-appra-mul', //发布评价
    picSave: href.apiPath + '/pic-save-bases', //上传图片
    submitOrder: href.apiPath + '/submit-order-page', //提交订单界面
    shopCartOrder: href.apiPath + '/submit-order', //提交购物车和订单
    applicationForRefund: href.apiPath + '/refund-apply', //退款，退货退款
    getTXImInfo: href.apiPath + '/tencent-im', //获取腾讯im的账号和密码
    myAppraiseList: href.apiPath + '/my-appraiselist', //我的评价列表
    refundDetail: href.apiPath + '/refund-detail', //售后详情
    refurefundOrderExpressndDetail: href.apiPath + '/refund-order-express', //京东物流填写
    rublishReview: href.apiPath + '/my-appra-add-page', //追评页面
    publishAReview: href.apiPath + '/my-order-add-appra', //追评评论
    personalAddress: href.apiPath + '/save-per-info', //个人所在区域管理
    changeAheAvatar: href.apiPath + '/uploadhead', //更换头像
    busiAppraiselist: href.apiPath + '/busi-appraiselist', //商家已评价列表
    busiMallOrder: href.apiPath + '/busi-mall-order', //商家待评价列表
    applyForRight: href.apiPath + '/shopinfo', //申请开店权限
    setparent: href.apiPath + '/sure-parent', //确认推荐人
    getCategory: href.apiPath + '/shopapply-sort', //获取行业
    postShopapply: href.apiPath + '/shopapply', //提交店铺信息
    orderSelf: href.apiPath + '/self-order-page', //自提
    orderSubmit: href.apiPath + '/submit-selftake-order', //自提提交订单
    selfOrderDetail: href.apiPath + '/self-order-detail', //自提订单详情
    mallSelfOrder: href.apiPath + '/mall-self-order', //线下订单列表
    sufficiencyCode: href.apiPath + '/get-whiteoff', //获取自提码
    peopleInformati0n: href.apiPath + '/shopapply-per', //获取开店人信息
    shopapplyBusi: href.apiPath + '/shopapply-busi',  //
    postIDcard: href.apiPath + '/shopapply-pic',  //上传身份证营业执照
    // orderSelf: href.apiPath + '/self-order-page', //自提
    getBankList: href.apiPath + '/bank-branch-list', //获取银行支行信息
    getShopSet: href.apiPath + '/get-shop-setting', //獲取店铺设置信息
    getPeople: href.apiPath + '/getmystaff', //获取我的员工列表
    shopCollectType: href.apiPath + '/shop-collect-type', //判斷是否已收藏
    bindBankCard: href.apiPath + '/addbank', //绑定银行卡，
    shopFinish: href.apiPath + '/shop-finish', //绑定银行卡之后调用的接口
    getShopJurisdiction: href.apiPath + '/home-to-sign', //获取开店签约权限
    getHomeGoods: href.apiPath + '/home-rs',  //获取首页好货接口
    getGoods: href.apiPath + '/home-rs-pr', //获取首页商品列表
    getHomeShops: href.apiPath + '/home-rs-shop', //获取首页店铺
    suggestCargo: href.apiPath + '/home-rs-pr', //推荐商品
    getAccountInfo: href.apiPath + '/getaccountinfo', //获取账户信息
    addAccountInfo: href.apiPath + '/addaccount ', //添加获取账户信息
    switchAccountInfo: href.apiPath + '/loginaccount ', //切换账户
    deleteAccount: href.apiPath + '/delaccount', //删除账户
    confirmationReferees: href.apiPath + '/sure-parent', //源头码，确认推荐人，和进行绑定
    getHistory: href.apiPath + '/my-browse-list', //获取浏览历史列表
    delHistory: href.apiPath + '/clear-browse', //删除或清空浏览历史
    myCustomer: href.apiPath + '/myguest', //我的客户列表
    regionalTota: href.apiPath + '/getguest', // 区域总量
    customerInfo: href.apiPath + '/getment-detail', //客户详情
    customerOrder: href.apiPath + '/getment-order', //客户订单量
    myBusiness: href.apiPath + '/getmentor', //我的业务列表
    entityBusinessInfo: href.apiPath + '/shopapply-busi ',  //个体工商信息
    withdraw: href.apiPath + '/withdraw', //我的->我的资产->CAM提现-DO收益提现
    income: href.apiPath + '/income', //我的->我的资产->CAM提现-GET收益提现-银行卡
    memberStatus: href.apiPath + '/member-status', //状态判断 是否设置过支付密码
    dfinfo: href.apiPath + '/dfinfo', //判断UID是否存在
    getRollout: href.apiPath + '/get-rollout', //最近转出记录列表
    userpay: href.apiPath + '/userpay', //用户消费，支付/CAM转出
    assetsDetail: href.apiPath + '/assets-detail', //我的资产-明细
    // bindBankCard: href.apiPath + '/shopapply-addbank', //绑定银行卡，
    refundMllOder: href.apiPath + '/refund-mall-order', //售后订单列表
    returnLogisticsTrack: href.apiPath + '/return-logistics-track', //售后物流接口
    revokeOrder: href.apiPath + '/discharges', //退款订单撤销申请
    returnOrderInfo: href.apiPath + '/return-order-info', //申请退款信息
    returnOrderEdit: href.apiPath + '/return-order-edit', //修改退款申请提交
    getShopInfo: href.apiPath + '/get-shop-return', //获取商家信息
    getLogisticsList: href.apiPath + '/get-express-list ', //获取物流信息
    setLogisticsList: href.apiPath + '/return-goods', //退货退款提交
    doComplain: href.apiPath + '/complaint', //投诉,
    campay: href.apiPath + '/campay', //CAM支付
    getShopMain: href.apiPath + '/get-shop-info', //获取商店电话和名称
    assetIncome: href.apiPath + '/menu-myincome', //我的资产，我的收入子菜单判断
    updateAudit: href.apiPath + '/shopapply-get',  //审核失败之后获取之前填过的数据
    getShopbank: href.apiPath + '/get-shopbank',   //开店第四步获取审核失败之后返回的数据
    orderViewHIstory: href.apiPath + '/order-search-history', //我的订单，搜索时的，浏览历史
    whiteList: href.apiPath + '/white-list', //获取核销订单
    whiteShop: href.apiPath + '/white-shop', //商家确认核销
    sureWhiteShop: href.apiPath + '/do-white',
    checkBank: href.apiPath + '/chk-money', //验证银行卡
    logisticsTrack: href.apiPath + '/logistics-track', //物流信息
    delayedReceipt: href.apiPath + '/delayed-receipt', //延长收货
    budgetaryRevenue: href.apiPath + '/dividend', //预算收益
    budgetaryRevenueOther: href.apiPath + '/dividend-other', //预算收益其他日期
    verifyPaymentPassword: href.apiPath + '/chk-pay-passwd', //验证支付密码
    getAgreeShop: href.apiPath + '/get-agreeshop',  //获取开店协议
    onlineSearch: href.apiPath + '/mall-order-search',  //线上订单搜索
    ondownSearch: href.apiPath + '/mall-self-order',  //线下订单搜索
    successfulPayment: href.apiPath + '/set-pay-type',  //支付成功后，将数据传给后端
    getMoreAccounts: href.apiPath + '/forgetpwd',  //获取更多账号
    getDfinfor: href.apiPath + '/give-info',  //用户消费，获取对方资料
    getShopIntro: href.apiPath + '/shop-intro',
    importSum: href.scan + '/importSum',  //扫一扫支付
    consumer: href.scan + '/consumer',  //扫一扫核销订单
    sourceBrowse: href.scan + '/sourceBrowse', //扫一扫确认源头码
    getQrCode: href.apiPath + '/wx-miniqr', //获取开店二维码
    protocolsCase: href.apiPath + '/clause-get', //协议接口
    getAgreement: href.apiPath + '/get-agreement', // 获取协议
    getCardList: href.apiPath + '/card-wallet-list', //获取卡券包列表
    cardDetail: href.apiPath + '/card-detail', //C享过来的商品红包详情
    getCoupon: href.apiPath + '/card-show', // 首页优惠券列表
    reciveCard: href.apiPath + '/card-receive',  // 领取红包
    cardUseList: href.apiPath + '/card-use-list'  // 领取红包
};
