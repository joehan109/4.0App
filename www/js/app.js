// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('fourdotzero', ['ionic', 'ionic.service.core', 'ngCordova',
    'angularMoment', 'templates', 'ionic-native-transitions',
    'ion-BottomSheet', 'ion-affix', 'ion-photo', 'ion-geo',
    'fourdotzero.controllers', 'fourdotzero.services', 'fourdotzero.directives', 'fourdotzero.photogram',
    'fourdotzero.constants', 'fourdotzero.filters', 'tag-select', 'timer'
])

.run(function($ionicPlatform, $rootScope, $state, JPush,
    $ionicHistory, $ionicModal, $ionicLoading, $cordovaToast, $cordovaKeyboard,
    amMoment, AuthService, ngCart, Storage, FetchData, $location, $ionicPopup, $timeout, $http, ENV) {
    $ionicPlatform.ready(function() {
        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)
        if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
            cordova.plugins.Keyboard.disableScroll(true);

        }
        if (window.StatusBar) {
            // org.apache.cordova.statusbar required
            StatusBar.styleDefault();
        }
        // alert(cordova.plugins.AliPay,'Alipay')
        // Wechat.isInstalled(function (installed) {
        //     $rootScope.IsWechatInstalled = installed;
        // }, function (reason) {
        //     $rootScope.IsWechatInstalled = false;
        // });
        // YCQQ.checkClientInstalled(function(){
        //     $rootScope.IsQQInstalled = true;
        // },function(){
        //     $rootScope.IsQQInstalled = false;
        // });

        // plugins.jPushPlugin.init();
        // plugins.jPushPlugin.setApplicationIconBadgeNumber(0);
        //plugins.jPushPlugin.setDebugMode(ENV.debug);
        document.addEventListener("jpush.openNotification", JPush.onOpenNotification, false);
        document.addEventListener("jpush.receiveNotification", JPush.onReceiveNotification, false);
        document.addEventListener("jpush.receiveMessage", JPush.onReceiveMessage, false);

    });

    // 注册安卓返回键
    $ionicPlatform.registerBackButtonAction(function(e) {

        function showConfirm() {
            var confirmPopup = $ionicPopup.confirm({
                template: '你确定要退出应用吗?',
                cancelText: '取消',
                okText: '退出',
                okType: 'button-energized',
                cancelType: 'button-default'

            });

            confirmPopup.then(function(res) {
                if (res) {
                    Storage.set('user', null);
                    Storage.set('access_token', null);
                    // 清空购物车
                    Storage.set('cart', {
                        shipping: null,
                        taxRate: null,
                        tax: null,
                        items: [],
                        selectedItems: []
                    });
                    ionic.Platform.exitApp();
                } else {
                    // Don't close
                }
            });
        }

        // 如果有弹窗，先关闭弹窗
        var hasDialog = false;
        angular.forEach([
            $rootScope.addressModal,
            $rootScope.bindEmailDialog,
            $rootScope.signupDialog,
            $rootScope.forgotPWDialog,
            $rootScope.passwordDialog,
            $rootScope.setVIPModal,
            $rootScope.phoneDialog,
            $rootScope.authDialog
        ], function(item) {
            if (item && item._isShown && !hasDialog) {
                item.hide();
                hasDialog = true;
                return;
            }
        });
        // Is there a page to go back to?
        if (!hasDialog) {
            if ($ionicHistory.forwardView()) {
                // 解决有的机型扫一扫返回直接退出了
                if (!$rootScope.canExitFromScan && ($ionicHistory.forwardView().url === '/scan')) {
                    $rootScope.canExitFromScan = true;
                    $timeout(function() {
                        $rootScope.canExitFromScan = false;
                    }, 2000)
                    e.preventDefault();
                    return false;
                }
            }
            if ($location.path() == '/shopTab/account') {
                $state.go('shopTab.cateHome')
            } else if (($location.path() == '/shopTab/cateHome') || ($location.path() == '/home')) {
                $state.go('appIndex')
            } else if ($location.path() == '/appIndex') {
                showConfirm();
            } else if ($ionicHistory.backView()) {
                $rootScope.$ionicGoBack();
            } else {
                // This is the last page: Show confirmation popup
                showConfirm();
            }
        }
        e.preventDefault();

        return false;
    }, 201);
    // set moment locale
    amMoment.changeLocale('zh-cn');

    // ngCart
    $rootScope.$on('ngCart:change', function(event, msg) {
        ngCart.$save();
        $ionicLoading.show({
            template: msg,
            duration: 1000,
        });
    });

    $rootScope.$state = $state;


    // if (angular.isObject(Storage.get('cart'))) {
    //     ngCart.$restore(Storage.get('cart'));
    // } else {
    //     ngCart.init();
    //     FetchData.get('/mall/mashopping/getAll').then(function(data) {
    //         ngCart.$loadCart(data.data);
    //     });
    // }
    // ngCart.init();
    // 检测是否登录
    $http({
        method: "GET",
        url: ENV.SERVER_URL + '/mall/mashopping/getAll'
    }).success(function(res, status) {
        if (status === 200 && res.ret) {} else {
            if (res.data === 'login') {
                Storage.remove('user');
                Storage.remove('access_token');
                // 清空购物车
                Storage.set('cart', {
                    shipping: null,
                    taxRate: null,
                    tax: null,
                    items: [],
                    selectedItems: []
                });
            }
            $rootScope.authDialog.show();
        }
    });

    // 判断是否是iPhoneX
    if (window.device) {
        $rootScope.isIphoneX = ['iPhone10,3', 'iPhone10,6'].indexOf(device.model) >= 0
    }
    // 获取登录城市
    $http.jsonp('http://whois.pconline.com.cn/ipJson.jsp?callback=JSON_CALLBACK').success(function (data){
        $rootScope.cityInfo = data;
    })

    // $timeout(function() {
    //     if (!Storage.get('access_token')) {
    //         $rootScope.authDialog.show();
    //     }
    // }, 100);

    // // 初始化会员信息、登录信息
    // Storage.remove('user');
    // Storage.remove('access_token');

    $ionicModal.fromTemplateUrl('auth.html', {
        scope: $rootScope
    }).then(function(modal) {
        $rootScope.authDialog = modal;
    });

    $rootScope.showAuthBox = function() {
        $rootScope.authDialog.show();
    };

    $rootScope.closeAuthBox = function() {
        $rootScope.authDialog.hide();
    };

    $rootScope.$on('$stateChangeStart', function(event, next) {
        if (AuthService.isLoggedIn() === false) {
            var token = Storage.get('access_token');
            if (token) {
                // AuthService.authenticate(token)
                //     .then(function() {
                //
                //     }).catch(function() {
                //         Storage.remove('access_token');
                //     })
                // } else if (next.loginRequired) {
            } else {
                $rootScope.authDialog.show();
            }
        }
        // iphoneX优化
        var isX = window.device && (['iPhone10,3', 'iPhone10,6'].indexOf(device.model) >= 0);
        if (isX) {
            // var ele = document.getElementsByClassName('fourdotzero-tabs')[0].getElementsByClassName('tabs')[0]
            // ele.style.marginBottom = '10px';
        }

    });

    $rootScope.$on('alertStart', function(event, msg, options) {
        var o = options || {};
        angular.extend(o, {
            template: msg || '<ion-spinner icon="spiral"></ion-spinner>',
        });

        $ionicLoading.show(o);

    });
    $rootScope.$on('alertEnd', function(event) {
        $ionicLoading.hide()
    });

    $rootScope.$on('alert', function(event, msg, options, duration) {
        // if (window.cordova) {
        //     $cordovaToast.show(msg, 'short', 'center');
        // } else {
        var o = options || {};
        angular.extend(o, {
            template: msg || '<ion-spinner icon="spiral"></ion-spinner>',
            duration: duration || 1000,
        });

        $ionicLoading.show(o);
        // }
    });

    // if (Storage.get('introPage') !== 'alreadyShow') {
    //     $state.go('intro');
    // }
})

.config(function($httpProvider, $stateProvider, $urlRouterProvider, $ionicConfigProvider,
    $ionicNativeTransitionsProvider) {

    //$ionicConfigProvider.scrolling.jsScrolling(false);
    $ionicConfigProvider.views.maxCache(5);
    $ionicConfigProvider.views.swipeBackEnabled(false);
    // Ionic uses AngularUI Router which uses the concept of states
    // Learn more here: https://github.com/angular-ui/ui-router
    // Set up the various states which the app can be in.
    // Each state's controller can be found in controllers.js
    $stateProvider

    // setup an abstract state for the tabs directive
        .state('tab', {
        url: '',
        abstract: true,
        templateUrl: 'tabs.html',
        controller: 'tabsCtrl',
    })

    .state('shopTab', {
        url: '/shopTab',
        abstract: true,
        templateUrl: 'shopTabs.html',
        controller: 'shopTabsCtrl',
    })

    // Each tab has its own nav history stack:
    .state('intro', {
        url: '/intro',
        templateUrl: 'intro.html',
        controller: 'introCtrl'
    })

    .state('appIndex', {
        url: '/appIndex',
        controller: 'appIndexCtrl',
        templateUrl: 'appIndex.html',
        loginRequired: true
    })

    .state('tab.home', {
        url: '/home',
        nativeTransitions: null,
        views: {
            'tab-cateHome': {
                controller: 'homeCtrl',
                templateUrl: 'home.html',
            }
        },
        loginRequired: true,
    })

    .state('tab.xspm', {
        url: '/xspm',
        nativeTransitions: null,
        views: {
            'tab-xspm': {
                controller: 'xspmCtrl',
                templateUrl: 'xspm.html',
            }
        },
        loginRequired: true,
    })

    .state('cpz', {
        url: '/cpz',
        controller: 'cpzCtrl',
        templateUrl: 'cpz.html',
        loginRequired: true
    })

    .state('tab.account', {
        url: '/account',
        nativeTransitions: null,
        views: {
            'tab-account': {
                controller: 'accountCtrl',
                templateUrl: 'account.html',
            }
        },
        loginRequired: true,
    })

    .state('scan', {
        url: '/scan',
        controller: 'scanCtrl',
        templateUrl: 'scan.html',
        loginRequired: true
    })

    .state('shopTab.cateHome', {
        url: '/cateHome',
        nativeTransitions: null,
        views: {
            'shopTab-cateHome': { //对应ion-view的name
                controller: 'cateHomeCtrl',
                templateUrl: 'cateHome.html',
            }
        },
        loginRequired: true,
    })

    .state('tab.noti', {
        url: '/notification',
        nativeTransitions: null,
        views: {
            'tab-noti': {
                controller: 'notificationCtrl',
                templateUrl: 'notification.html',
            }
        },
        loginRequired: true,
    })


    .state('logout', {
        url: "/logout",
        controller: 'logoutCtrl',
    })

    .state('tab.explore', {
        url: '/explore',
        nativeTransitions: null,
        views: {
            'tab-explore': {
                templateUrl: 'photogram/home.html',
                controller: 'exploreCtrl'
            }
        },
        loginRequired: true,
    })

    .state('tab.postDetail', {
        url: '/postDetail/:postID',
        views: {
            'tab-explore': {
                templateUrl: 'photogram/postDetail.html',
                controller: 'postDetailCtrl'
            }
        }
    })

    .state('userDetail', {
        url: '/userDetail',
        templateUrl: 'userDetail.html',
        controller: 'userDetailCtrl',
        loginRequired: true
    })

    .state('pointsDetail', {
        url: '/pointsDetail',
        templateUrl: 'pointsDetail.html',
        controller: 'pointsDetailCtrl',
        loginRequired: true
    })

    .state('vipCenter', {
        url: '/vipCenter',
        templateUrl: 'vipCenter.html',
        controller: 'vipCenterCtrl',
        loginRequired: true
    })

    .state('tab.accountUserDetail', {
        url: '/userDetail/:userID',
        views: {
            'tab-account': {
                templateUrl: 'userDetail.html',
                controller: 'userDetailCtrl'
            }
        }
    })

    .state('tab.userList', {
        url: '/userList/:userID/:userType',
        views: {
            'tab-explore': {
                templateUrl: 'userList.html',
                controller: 'userListCtrl'
            }
        }
    })

    .state('tab.myuserList', {
        url: '/myuserList/:userID/:userType',
        views: {
            'tab-account': {
                templateUrl: 'userList.html',
                controller: 'userListCtrl'
            }
        }
    })

    .state('shopTab.account', {
        url: '/account',
        views: {
            'shopTab-account': {
                templateUrl: 'account.html',
                controller: 'accountCtrl'
            }
        },
        loginRequired: true
    })

    .state('tab.coupons', {
        url: '/coupons',
        views: {
            'tab-account@tab': {
                templateUrl: 'coupons.html',
                controller: 'couponsCtrl'
            }
        }
    })

    .state('profile', {
        url: '/profile',
        templateUrl: 'profile.html',
        controller: 'profileCtrl',
        loginRequired: true
    })


    .state('about', {
        url: '/about',
        templateUrl: 'about.html',
        controller: 'aboutCtrl',
        loginRequired: true
    })

    .state('cart', {
        url: '/cart',
        templateUrl: 'cart.html',
        controller: 'cartCtrl',
        loginRequired: true
    })

    .state('checkout', {
        url: '/checkout',
        templateUrl: 'checkout.html',
        controller: 'checkoutCtrl',
        loginRequired: true
    })

    .state('tab.categories', {
        url: '/categories',
        views: {
            'tab-cateHome': {
                templateUrl: 'category.html',
                controller: 'categoryCtrl'
            }
        }
    })

    .state('tab.category', {
        url: '/category/:en/:cn',
        views: {
            'tab-cateHome': {
                templateUrl: 'item/items.html',
                controller: 'itemsCtrl'
            }
        }
    })

    .state('tab.search', {
        url: '/search/:query',
        views: {
            'tab-cateHome': {
                templateUrl: 'item/items.html',
                controller: 'itemsCtrl'
            }
        },
        loginRequired: true
    })

    .state('tab.payment.success', {
        url: '/payment/success',
        views: {
            'tab-cateHome': {
                controller: 'paymentSuccessCtrl'
            }
        }
    })

    .state('tab.payment.cancel', {
        url: '/payment/cancel',
        views: {
            'tab-cateHome': {
                controller: 'paymentCancelCtrl'
            }
        }
    })

    .state('item', {
        url: '/item/:id',
        templateUrl: 'item.html',
        controller: 'itemCtrl',
        loginRequired: true
    })

    .state('pitem', {
        url: '/pitem/:id',
        templateUrl: 'pitem.html',
        controller: 'pitemCtrl',
        loginRequired: true
    })

    .state('tab.board', {
        url: '/board/:boardID',
        views: {
            'tab-cateHome': {
                templateUrl: 'board.html',
                controller: 'boardCtrl'
            }
        }
    })

    .state('address', {
        url: '/address',
        cache: false,
        templateUrl: 'address.html',
        controller: 'addressCtrl',
        loginRequired: true
    })

    .state('settings', {
        url: '/settings',
        templateUrl: 'settings.html',
        controller: 'settingsCtrl',
        loginRequired: true
    })

    .state('address_list', {
        url: '/address/list',
        cache: false,
        templateUrl: 'address_list.html',
        controller: 'addressCtrl',
        loginRequired: true
    })

    .state('orders', {
        url: '/orders/:status_id',
        templateUrl: 'orders.html',
        controller: 'ordersCtrl',
        loginRequired: true
    })

    .state('order_detail', {
        url: '/order/:order_id?status_id',
        templateUrl: 'order.html',
        controller: 'orderDetailCtrl',
        loginRequired: true
    })

    .state('order_logistic', {
        url: '/order/logistics/:order_id?status_id',
        templateUrl: 'logistics.html',
        controller: 'logisticsDetailCtrl',
        loginRequired: true
    })

    .state('tab.order_transfer', {
        url: '/order/transfer/:order_id',
        views: {
            'tab-account': {
                templateUrl: 'transfer_logistics.html',
                controller: 'logisticsDetailCtrl'
            }
        }
    })

    .state('tab.express', {
        url: '/express',
        views: {
            'tab-cateHome': {
                templateUrl: 'expressForm.html',
                controller: 'expressCtrl'
            }
        },
        loginRequired: true
    })

    .state('tab.express_add', {
        url: '/express/add',
        views: {
            'tab-cateHome': {
                templateUrl: 'expressItem_add.html',
                controller: 'expressItemAddCtrl'
            }
        }
    })

    .state('tab.order_entry', {
        url: '/order/entry/:itemID',
        views: {
            'tab-account': {
                templateUrl: 'item.html',
                controller: 'itemCtrl',
            }
        },
        loginRequired: true
    })


    .state('tab.calculate', {
        url: '/calculate',
        views: {
            'tab-cateHome': {
                templateUrl: 'calFee.html',
                controller: 'calculateCtrl'
            }
        }
    })

    .state('favors', {
        url: '/favors',
        templateUrl: 'favors.html',
        controller: 'favorCtrl',
        loginRequired: true
    })

    .state('pfavors', {
        url: '/pfavors',
        templateUrl: 'pfavors.html',
        controller: 'pfavorCtrl',
        loginRequired: true
    })

    .state('precord', {
        url: '/precord',
        templateUrl: 'precord.html',
        controller: 'precordCtrl',
        loginRequired: true
    })

    .state('tab.like_posts', {
        url: '/like_posts',
        views: {
            'tab-account': {
                templateUrl: 'photogram/like_posts.html',
                controller: 'likePostsCtrl'
            }
        }
    })

    .state('tab.myPostDetail', {
        url: '/myPostDetail/:postID',
        views: {
            'tab-account': {
                templateUrl: 'photogram/postDetail.html',
                controller: 'postDetailCtrl'
            }
        }
    })

    .state('tab.my_posts', {
        url: '/my_posts',
        views: {
            'tab-account': {
                templateUrl: 'photogram/my_posts.html',
                controller: 'myPostsCtrl'
            }
        }
    })

    .state('tab.faq', {
        url: '/faq',
        views: {
            'tab-account': {
                templateUrl: 'faq.html',
                controller: 'faqCtrl'
            }
        }
    })

    .state('tab.limit', {
        url: '/limit',
        views: {
            'tab-cateHome': {
                templateUrl: 'limit.html',
                controller: 'faqCtrl'
            }
        }
    })

    .state('tab.cs', {
        url: '/customer-service',
        views: {
            'tab-account': {
                templateUrl: 'cs.html',
                controller: 'csCtrl'
            }
        }
    })

    .state('tab.feedback', {
        url: '/feedback',
        views: {
            'tab-account': {
                templateUrl: 'feedback.html',
                controller: 'feedbackCtrl'
            }
        }
    })

    ;

    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/appIndex');
    $httpProvider.interceptors.push('timeoutHttpIntercept');
    $httpProvider.defaults.withCredentials = true;
    $httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';
    $httpProvider.defaults.transformRequest.push(function(data) {
        var requestStr;
        if (data) {
            data = JSON.parse(data);
            for (var key in data) {
                if (requestStr) {
                    requestStr += "&" + key + "=" + data[key];
                } else {
                    requestStr = key + "=" + data[key];
                }
            }
        }
        return requestStr;
    });
    AWS.config.update({
        accessKeyId: 'AKIAI4JD55P3DQLOXQKQ',
        secretAccessKey: '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'
    });
    AWS.config.region = 'us-west-1';

});