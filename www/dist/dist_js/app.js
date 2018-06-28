// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('maybi', ['ionic', 'ionic.service.core', 'ngCordova',
    'angularMoment', 'templates', 'ionic-native-transitions',
    'ion-BottomSheet', 'ion-affix', 'ion-photo', 'ion-geo',
    'maybi.controllers', 'maybi.services', 'maybi.directives', 'maybi.photogram',
    'maybi.constants', 'maybi.filters', 'tag-select'
])

.run(['$ionicPlatform', '$rootScope', '$state', 'JPush', '$ionicHistory', '$ionicModal', '$ionicLoading', '$cordovaToast', 'amMoment', 'AuthService', 'ngCart', 'Storage', 'FetchData', '$ionicSlideBoxDelegate', '$cordovaBarcodeScanner', function($ionicPlatform, $rootScope, $state, JPush,
    $ionicHistory, $ionicModal, $ionicLoading, $cordovaToast,
    amMoment, AuthService, ngCart, Storage, FetchData, $ionicSlideBoxDelegate, $cordovaBarcodeScanner) {
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
    ngCart.init();
    FetchData.get('/mall/mashopping/getAll').then(function(data) {
        ngCart.$loadCart(data.data);
    }, function(err) {
        Storage.remove('user');
        $rootScope.authDialog.show();
    });

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
            } else if (next.loginRequired) {
                $rootScope.authDialog.show();
            }
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

    $rootScope.$on('alert', function(event, msg, options) {
      var o = options || {};
      angular.extend(o, {
          template: msg || '<ion-spinner icon="spiral"></ion-spinner>',
          duration: 1000,
      });

      $ionicLoading.show(o);
    });

    // if (Storage.get('introPage') !== 'alreadyShow') {
    //     $state.go('intro');
    // }
}])

.config(['$httpProvider', '$stateProvider', '$urlRouterProvider', '$ionicConfigProvider', '$ionicNativeTransitionsProvider', function($httpProvider, $stateProvider, $urlRouterProvider, $ionicConfigProvider,
    $ionicNativeTransitionsProvider) {

    //$ionicConfigProvider.scrolling.jsScrolling(false);
    $ionicConfigProvider.views.maxCache(5);

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
        .state('scan', {
            url: '/scan',
            controller: 'scanCtrl',
            templateUrl: 'scan.html',
            loginRequired: true,
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

    .state('tab.userDetail', {
            url: '/userDetail/:userID',
            views: {
                'tab-explore': {
                    templateUrl: 'userDetail.html',
                    controller: 'userDetailCtrl'
                }
            }
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
        }
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

    .state('tab.settings', {
        url: '/settings',
        views: {
            'tab-account@tab': {
                templateUrl: 'settings.html',
                controller: 'settingsCtrl'
            }
        }
    })

    .state('tab.profile', {
        url: '/account/profile',
        views: {
            'tab-account': {
                templateUrl: 'profile.html',
                controller: 'profileCtrl'
            }
        }
    })


    .state('tab.about', {
        url: '/about',
        views: {
            'tab-account@tab': {
                templateUrl: 'about.html',
                controller: 'aboutCtrl'
            }
        }
    })


    .state('cart', {
        url: '/cart',
        templateUrl: 'cart.html',
        controller: 'cartCtrl'
    })

    .state('checkout', {
        url: '/checkout',
        templateUrl: 'checkout.html',
        controller: 'checkoutCtrl'
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
        }
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

    .state('tab.item', {
        url: '/item/:id',
        views: {
            'tab-cateHome': {
                templateUrl: 'item.html',
                controller: 'itemCtrl',
            }
        }
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
        controller: 'addressCtrl'
    })

    .state('address_list', {
        url: '/address/list',
        cache: false,
        templateUrl: 'address_list.html',
        controller: 'addressCtrl'
    })

    .state('tab.orders', {
        url: '/orders',
        views: {
            'tab-account': {
                templateUrl: 'orders.html',
                controller: 'ordersCtrl'
            }
        }
    })

    .state('tab.order_detail', {
        url: '/order/:order_id',
        views: {
            'tab-account': {
                templateUrl: 'order.html',
                controller: 'orderDetailCtrl'
            }
        }
    })

    .state('tab.order_logistic', {
        url: '/order/logistics/:order_id',
        views: {
            'tab-account': {
                templateUrl: 'logistics.html',
                controller: 'logisticsDetailCtrl'
            }
        }
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
        }
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
        }
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
        controller: 'favorCtrl'
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

}]);

'use strict';

appIndexCtrl.$inject = ['$scope', '$rootScope', '$state', '$ionicModal', '$cordovaToast', 'Photogram', 'PhotoService', '$timeout', 'geoService', 'FetchData', '$ionicSlideBoxDelegate', '$interval', 'Storage'];
homeCtrl.$inject = ['$scope', '$rootScope', '$log', '$timeout', '$state', '$ionicModal', 'ngCart', '$ionicSlideBoxDelegate', 'Board', 'Items', 'FetchData', 'Categories'];
cateHomeCtrl.$inject = ['$scope', '$rootScope', '$log', '$timeout', '$state', '$ionicModal', '$ionicScrollDelegate', 'ngCart', 'Items', 'FetchData', 'Categories', '$ionicSlideBoxDelegate', '$http', 'ENV', 'Storage'];
introCtrl.$inject = ['$rootScope', '$scope', '$state', 'FetchData', '$ionicSlideBoxDelegate', 'Storage'];
exploreCtrl.$inject = ['$scope', '$rootScope', '$state', '$ionicModal', '$ionicPopover', 'Photogram', 'FetchData'];
notificationCtrl.$inject = ['$rootScope', '$scope', '$state', 'Notification'];
myPostsCtrl.$inject = ['$scope', '$rootScope', '$state', '$ionicModal', '$ionicPopover', 'AuthService', 'Photogram'];
likePostsCtrl.$inject = ['$scope', '$rootScope', '$state', '$ionicModal', '$ionicPopover', 'AuthService', 'Photogram'];
postDetailCtrl.$inject = ['$scope', '$rootScope', '$state', '$stateParams', 'Photogram', 'AuthService', '$ionicPopup', 'photoShare'];
userDetailCtrl.$inject = ['$scope', '$rootScope', '$state', 'FetchData', '$stateParams', 'AuthService', 'Photogram', 'User', '$ionicScrollDelegate'];
userListCtrl.$inject = ['$scope', '$rootScope', '$state', 'FetchData', '$stateParams', 'AuthService', 'User'];
tabsCtrl.$inject = ['$scope', '$rootScope', '$state', '$ionicModal', '$cordovaToast', 'Photogram', 'PhotoService', '$timeout', 'geoService', 'FetchData', '$cordovaBarcodeScanner'];
shopTabsCtrl.$inject = ['$scope', '$rootScope', '$state', '$ionicModal', '$cordovaToast', 'Photogram', 'PhotoService', '$timeout', 'geoService', 'FetchData'];
feedbackCtrl.$inject = ['$scope', 'FetchData', '$rootScope'];
csCtrl.$inject = ['$rootScope', '$scope'];
faqCtrl.$inject = ['$rootScope', '$scope'];
couponsCtrl.$inject = ['$rootScope', '$scope', 'AuthService'];
categoryCtrl.$inject = ['$rootScope', '$scope', 'FetchData', '$state'];
authCtrl.$inject = ['$rootScope', '$scope', 'FetchData', '$state', 'AuthService', '$ionicModal', '$cordovaFacebook', '$interval'];
signupCtrl.$inject = ['$rootScope', '$scope', 'AuthService', '$state'];
accountCtrl.$inject = ['$rootScope', '$scope', 'AuthService', 'User', 'Photogram', '$ionicScrollDelegate', 'Storage'];
profileCtrl.$inject = ['$scope', 'AuthService', '$state', '$rootScope', 'PhotoService', '$http', 'ENV', '$ionicPopup'];
bindEmailCtrl.$inject = ['$rootScope', '$scope', 'AuthService'];
forgotPWCtrl.$inject = ['$rootScope', '$scope', 'AuthService'];
settingsCtrl.$inject = ['$rootScope', '$scope', '$state', 'AuthService'];
paymentSuccessCtrl.$inject = ['$location', '$timeout'];
itemCtrl.$inject = ['$scope', '$rootScope', '$stateParams', 'FetchData', '$ionicModal', 'ngCart', '$ionicSlideBoxDelegate', 'sheetShare', '$cordovaSocialSharing', '$ionicPopup'];
itemsCtrl.$inject = ['$rootScope', '$scope', 'Items', '$state', '$stateParams'];
boardCtrl.$inject = ['$scope', '$rootScope', '$stateParams', 'FetchData', '$state'];
favorCtrl.$inject = ['$rootScope', '$scope', 'FetchData', '$state', 'ngCart'];
ordersCtrl.$inject = ['$rootScope', '$scope', 'FetchData', 'ngCart'];
calculateCtrl.$inject = ['$rootScope', '$scope', '$location', 'FetchData'];
expressCtrl.$inject = ['$rootScope', '$scope', 'FetchData', 'ngCart', 'AuthService', '$state', 'expressList'];
expressItemAddCtrl.$inject = ['$rootScope', '$scope', 'expressList'];
orderDetailCtrl.$inject = ['$rootScope', '$scope', '$state', '$stateParams', 'FetchData', 'ngCart', '$ionicPopup'];
logisticsDetailCtrl.$inject = ['$rootScope', '$scope', '$stateParams', '$state', 'FetchData', 'ngCart'];
cartCtrl.$inject = ['FetchData', '$rootScope', '$scope', 'ngCart', 'Storage'];
checkoutCtrl.$inject = ['$state', '$scope', '$rootScope', 'FetchData', 'ngCart'];
addressCtrl.$inject = ['$rootScope', '$state', '$scope', 'FetchData', 'ngCart'];
aboutCtrl.$inject = ['$rootScope', '$scope', '$state', 'appUpdateService'];
scanCtrl.$inject = ['$scope', '$rootScope', '$state', '$ionicModal', '$cordovaToast', 'Photogram', '$ionicPopup', '$timeout', 'geoService', 'FetchData', '$cordovaBarcodeScanner'];
var controllersModule = angular.module('maybi.controllers', [])

function appIndexCtrl($scope, $rootScope, $state, $ionicModal, $cordovaToast,
    Photogram, PhotoService, $timeout, geoService, FetchData, $ionicSlideBoxDelegate, $interval, Storage) {
    // 解决每次路由切换轮播停止
    $scope.$on('$ionicView.beforeEnter', function() {
        $ionicSlideBoxDelegate.start();
    });
    $scope.types = [
        { name: '扫一扫', url: 'scan', icon: 'search' },
        { name: '4.0 商城', url: 'shopTab.cateHome', icon: 'search' },
        { name: '4.0 拍卖', url: 'tab.home', icon: 'search' }
    ];
    $scope.goto = function(item) {
        if (item.url === 'shopTab.cateHome') {
            Storage.set('shopOrSell', 'shop');
            Storage.set('cateHomeOrigin', 'index');
        } else if (item.url === 'tab.home') {
            Storage.set('shopOrSell', 'sell')
        } else {}
        $state.go(item.url);
    }
    $scope.form = {
        title: '',
        location: '',
        primary_image: '',
        photos: [],
        tags: [],
        type: '',
        geo: null,
    };

    $scope.articles = [{ id: 0, avatar: 1, img: 2, title: 3, des: 4, see: 5 },
        { id: 1, avatar: 1, img: 2, title: 3, des: 4, see: 5 }
    ];
    //为了验证属性active-slide定义的模型，angularjs是mvc模式
    $scope.model = {
        activeIndex: 0
    };
    //滑动图片的点击事件
    $scope.coverFlowClick = function() {
            var index = $ionicSlideBoxDelegate.currentIndex();
            console.log("coverFlowClick index = ", index);
        }
        //此事件对应的是pager-click属性，当显示图片是有对应数量的小圆点，这是小圆点的点击事件
    $scope.pageClick = function(index) {
        //alert(index);
        console.log("pageClick index = ", index);
        $scope.model.activeIndex = index;
    };

    //当图片切换后，触发此事件，注意参数
    $scope.slideHasChanged = function($index) {
        //alert($index);
        // console.log("slideHasChanged index = ", $index);
    };
    //这是属性delegate-handle的验证使用的，其实没必要重定义，直接使用$ionicSlideBoxDelegate就可以
    $scope.delegateHandle = $ionicSlideBoxDelegate;
}

function shopTabsCtrl($scope, $rootScope, $state, $ionicModal, $cordovaToast,
    Photogram, PhotoService, $timeout, geoService, FetchData) {

    $scope.form = {
        title: '',
        location: '',
        primary_image: '',
        photos: [],
        tags: [],
        type: '',
        geo: null,
    };


}

function scanCtrl($scope, $rootScope, $state, $ionicModal, $cordovaToast,
    Photogram, $ionicPopup, $timeout, geoService, FetchData, $cordovaBarcodeScanner) {

    // 每次一进页面就调用照相机
    $scope.$on('$ionicView.beforeEnter', function() {
      $scope.showOpen = false;
      $scope.showCode = false;
      $scope.alreadyShow = false;

      $cordovaBarcodeScanner
          .scan()
          .then(function(barcodeData) {
            $scope.barcodeData = 1;
            FetchData.get('/mall/mascan/get?code=' + $scope.barcodeData).then(function(res) {
              if (res.ret) {
                $scope.data = res.data;
                $scope.imgUrl = res.data.proUrl;
                if (res.data.pwdFlag) {
                  $scope.showCode = true;
                  // $scope.alreadyShow = true;
                  $scope.openCode = res.data.sonPwd;
                } else {
                  $scope.showOpen = true;
                }
              } else {
                $scope.$emit("alert", res.errmsg);
              }
            });
          }, function(error) {
              alert('扫描失败，请稍后重试');
              $state.go('appIndex');
          });
    });

    $scope.getCode = function() {
        var confirmPopup = $ionicPopup.confirm({
            title: '是否需要开锁密码？',
            cancelText: '否', // String (默认: 'Cancel')。一个取消按钮的文字。
            cancelType: 'button-default', // String (默认: 'button-default')。取消按钮的类型。
            okText: '是', // String (默认: 'OK')。OK按钮的文字。
            okType: 'button-positive',
        });
        confirmPopup.then(function(res) {
            if (res) {
                $scope.scanStart();
            } else {
                console.log('You are not sure');
            }
        });

    };
    $scope.scanStart = function() {
      FetchData.get('/mall/mascan/getPwd?id=' + $scope.data.id).then(function(res) {
        if (res.ret) {
          $scope.openCode = res.data.split('');
          $scope.showOpen = false;
          $scope.showCode = true;
        } else {
          $scope.$emit("alert", res.errmsg);
        }
      });
    };


}

function tabsCtrl($scope, $rootScope, $state, $ionicModal, $cordovaToast,
    Photogram, PhotoService, $timeout, geoService, FetchData, $cordovaBarcodeScanner) {

    $scope.form = {
        title: '',
        location: '',
        primary_image: '',
        photos: [],
        tags: [],
        type: '',
        geo: null,
    };

    $scope.scanStart = function() {

        $cordovaBarcodeScanner
            .scan()
            .then(function(barcodeData) {
                alert(barcodeData);
                $scope.barcodeData = barcodeData;
                // Success! Barcode data is here
            }, function(error) {
                alert('失败')
                    // An error occurred
            });
    };
    geoService.getLocation().then(function(location) {
        var lat = location.coords.latitude;
        var lng = location.coords.longitude;
        $scope.form.geo = [lng, lat];
    });


    $rootScope.togglePhotoModal = function() {

        PhotoService.open({
            pieces: 1,
            allowFilter: true
        }).then(function(image) {
            PhotoService.filter(image, function(form) {
                $scope.form.primary_image = form.photo;
                $scope.form.tags = form.tags;
                $scope.form.type = form.type;
                $scope.modalPost.show();
            });
        }).catch(function() {
            console.warn('Deu erro');
        });
    };
    $scope.editImage = function() {
        $scope.togglePhotoModal();
    }
    $scope.editAdditionImage = function(index) {
        angular.forEach($scope.form.photos, function(p, i) {
            if (i == index) {
                $scope.form.photos.splice(i, 1);
            }
        });

    }

    $scope.increasePhotosModal = function() {
        PhotoService.open({
            pieces: 4 - $scope.form.photos.length,
            allowFilter: false
        }).then(function(images) {
            Array.prototype.push.apply($scope.form.photos, images);

        }).catch(function() {
            console.warn('Deu erro');
        });
    };

    $scope.getLocation = function() {
        $timeout(function() {
            angular.element(document.getElementById('ion-geo')).triggerHandler('click');
        });
    };

    $scope.setOption = function(tag) {
        // add or remove tag
        if (!getTagByName(tag)) {
            if ($scope.form.tags.length < 3) {
                $scope.form.tags.push(tag);
            } else {
                $cordovaToast.show('最多只能添加3个标签哦', 'short', 'center')
            }
        } else {
            removeTagByName(tag);
        }
    }

    var getTagByName = function(tag) {
        var found = null;
        angular.forEach($scope.form.tags, function(t) {
            if (t === tag) {
                found = tag;
            }
        });
        return found;
    }

    var removeTagByName = function(tag) {
        angular.forEach($scope.form.tags, function(t, index) {
            if (t == tag) {
                $scope.form.tags.splice(index, 1);
            }
        });
    }

    $scope.excludeTags = function(text) {
        var wordsToFilter = $scope.form.tags;
        for (var i = 0; i < wordsToFilter.length; i++) {
            if (text.indexOf(wordsToFilter[i]) !== -1) {
                return false;
            }
        }
        return true;
    };

    $ionicModal.fromTemplateUrl('photogram/postModal.html', {
        scope: $scope,
        focusFirstInput: true
    }).then(function(modal) {
        $scope.modalPost = modal;
    });

    $scope.togglePostModal = function() {
        $scope.modalPost.show();
    }

    $scope.closePost = function() {
        $scope.modalPost.hide();

    };

    $scope.submitPost = function(resp) {
        var form = angular.copy(resp);
        $rootScope.$broadcast('alertStart');
        Photogram
            .post(form)
            .then(function() {
                $scope.closePost();
                $rootScope.$broadcast('alertEnd');
            }).catch(function(error) {
                $rootScope.$broadcast('alertEnd');
                $rootScope.$broadcast('alert', error || '发送失败，请重试');
            });
    };
}

function postDetailCtrl($scope, $rootScope, $state, $stateParams, Photogram,
    AuthService, $ionicPopup, photoShare) {
    //商品详情
    //
    $scope.$on('$ionicView.beforeEnter', function() {
        $rootScope.hideTabs = 'tabs-item-hide';
    });

    Photogram.getDetail($stateParams.postID).then(function(data) {
        $scope.post = data.post;
        var images = [$scope.post.primary_image];
        angular.forEach($scope.post.images, function(img, i) {
            images.push(img);
        });
        $scope.images = images;
    });


    $scope.comment = function() {
        var user = AuthService.getUser();
        Photogram.addComment($scope.post.post_id, $scope.message)
            .then(function(data) {
                $scope.post.num_comments += 1;
                $scope.post.comments.push(data.comment);
                $scope.message = '';
            });
    };

    $scope.deleteComment = function(comment) {
        if (comment.user.name == AuthService.getUser().name) {
            var confirmPopup = $ionicPopup.confirm({
                title: '提示',
                cssClass: 'text-center',
                template: '确定删除该评论吗？',
                cancelText: '取消',
                okText: '删除',
                okType: 'button-default'
            })
            confirmPopup.then(function(res) {
                if (res) {
                    Photogram.deleteComment(comment.id, $scope.post.post_id)
                        .then(function(data) {
                            angular.forEach($scope.post.comments, function(c, index) {
                                if (c.id == comment.id) {
                                    $scope.post.comments.splice(index, 1);
                                }
                            });
                        })
                    $scope.post.num_comments -= 1;
                } else {
                    console.log('You are not sure');
                }
            });
        }
    };

    $scope.like = function() {
        var user = AuthService.getUser();

        if ($scope.post.is_liked) {
            $scope.post.is_liked = false;
            $scope.post.num_likes -= 1;

            Photogram.unlike($scope.post.post_id)
                .then(function(data) {
                    angular.forEach($scope.post.likes, function(l, index) {
                        if (l.user.name == user.name) {
                            $scope.post.likes.splice(index, 1);
                        }
                    });
                }).catch(function(error) {
                    $scope.post.is_liked = true;
                    $scope.post.num_likes += 1;
                });
        } else {
            $scope.post.is_liked = true;
            $scope.post.num_likes += 1;

            Photogram.like($scope.post.post_id)
                .then(function(data) {
                    $scope.post.likes.unshift(data.like);
                }).catch(function(error) {
                    $scope.post.is_liked = false;
                    $scope.post.num_likes -= 1;

                });
        }
    };


    $scope.goUser = function(user_id) {
        for (var name in $state.current.views) {
            var name = name;
        }

        if (name == "tab-explore") {
            $state.go('tab.userDetail', { userID: user_id });
        } else {
            $state.go('tab.accountUserDetail', { userID: user_id });
        }
    };

    $scope.zoom = function(url) {

        if (ionic.Platform.isAndroid()) {
            PhotoViewer.show(url, ''); //cordova photoviewer
        } else {
            ImageViewer.show(url); // cordova ImageViewer for IOS
        }
    };

    $scope.actions = function() {
        photoShare.popup($scope.post);
    };


}

function userDetailCtrl($scope, $rootScope, $state, FetchData, $stateParams, AuthService,
    Photogram, User, $ionicScrollDelegate) {
    $scope.$on('$ionicView.beforeEnter', function() {
        $rootScope.hideTabs = 'tabs-item-hide';
    });

    FetchData.get('/api/users/user_info/' + $stateParams.userID).then(function(data) {
        $scope.user = data.user;
    });

    $scope.onUserDetailContentScroll = onUserDetailContentScroll;

    function onUserDetailContentScroll() {
        var scrollDelegate = $ionicScrollDelegate.$getByHandle('userDetailContent');
        var scrollView = scrollDelegate.getScrollView();
        $scope.$broadcast('userDetailContent.scroll', scrollView);
    }

    $scope.gridStyle = 'list';
    $scope.switchListStyle = function(style) {
        $scope.gridStyle = style;
    }

    $scope.currentUserID = AuthService.getUser().id;

    $scope.follow = function() {
        var user = AuthService.getUser();

        if ($scope.user.is_following) {
            $scope.user.is_following = false;
            $scope.user.num_followers -= 1;

            User.unfollow($scope.user.id)
                .then(function(data) {
                    $scope.$emit('alert', "已取消关注");
                }).catch(function(error) {
                    $scope.user.is_following = true;
                    $scope.user.num_followers += 1;
                });
        } else {
            $scope.user.is_following = true;
            $scope.user.num_followers += 1;

            User.follow($scope.user.id)
                .then(function(data) {
                    $scope.$emit('alert', "关注成功");
                }).catch(function(error) {
                    $scope.user.is_following = false;
                    $scope.user.num_followers -= 1;

                });
        }
    };

    $scope.zoom = function(img) {
        if (ionic.Platform.isAndroid()) {
            PhotoViewer.show(img, ''); //cordova photoviewer
        } else {
            ImageViewer.show(img); // cordova ImageViewer for IOS
        }
    };
    $scope.posts = [];

    var userId = $stateParams.userID;
    var page = 0;

    Photogram.getUserPosts(userId, page).then(function(data) {
        $scope.posts = data.posts;
        page++;
    });

    $scope.doRefresh = function() {
        page = 0;
        Photogram.getUserPosts(userId, page).then(function(data) {
            $scope.posts = data.posts;
            page++;
        });
        $scope.$broadcast('scroll.refreshComplete');
    };

    $scope.loadMore = function() {
        Photogram.getUserPosts(userId, page).then(function(data) {
            $scope.posts = $scope.posts.concat(data.posts);
            $scope.$broadcast('scroll.infiniteScrollComplete');
            page++;
        });
    };

    $scope.moreDataCanBeLoaded = function() {
        return Photogram.hasNextPage();
    };

    $scope.isEmpty = function() {
        return Photogram.isEmpty();
    };

}

function userListCtrl($scope, $rootScope, $state, FetchData, $stateParams,
    AuthService, User) {

    $scope.$on('$ionicView.beforeEnter', function() {
        $rootScope.hideTabs = 'tabs-item-hide';
    });

    $scope.currentUserID = AuthService.getUser().id;

    $scope.follow = function(user) {
        var user = AuthService.getUser();

        if (user.is_following) {
            user.is_following = false;

            User.unfollow(user.id)
                .then(function(data) {
                    $scope.$emit('alert', "已取消关注");
                }).catch(function(error) {
                    user.is_following = true;
                });
        } else {
            user.is_following = true;

            User.follow(user.id)
                .then(function(data) {
                    $scope.$emit('alert', "关注成功");
                }).catch(function(error) {
                    user.is_following = false;

                });
        }
    };
    $scope.users = [];

    var userId = $stateParams.userID;
    var page = 0;

    if ($stateParams.userType == 'followers') {

        $scope.title = '粉丝列表'
        User.getFollowers(userId, page).then(function(data) {
            $scope.users = data.users;
            page++;
        });

        $scope.doRefresh = function() {
            page = 0;
            User.getFollowers(userId, page).then(function(data) {
                $scope.users = data.users;
                page++;
            });
            $scope.$broadcast('scroll.refreshComplete');
        };

        $scope.loadMore = function() {
            User.getFollowers(userId, page).then(function(data) {
                $scope.users = $scope.users.concat(data.users);
                $scope.$broadcast('scroll.infiniteScrollComplete');
                page++;
            });
        };

        $scope.moreDataCanBeLoaded = function() {
            return User.hasNextPage();
        };

        $scope.isEmpty = function() {
            return User.isEmpty();
        };

    } else if ($stateParams.userType == 'followings') {

        $scope.title = '关注列表'
        User.getFollowings(userId, page).then(function(data) {
            $scope.users = data.users;
            page++;
        });

        $scope.doRefresh = function() {
            page = 0;
            User.getFollowings(userId, page).then(function(data) {
                $scope.users = data.users;
                page++;
            });
            $scope.$broadcast('scroll.refreshComplete');
        };

        $scope.loadMore = function() {
            User.getFollowings(userId, page).then(function(data) {
                $scope.users = $scope.users.concat(data.users);
                $scope.$broadcast('scroll.infiniteScrollComplete');
                page++;
            });
        };

        $scope.moreDataCanBeLoaded = function() {
            return User.hasNextPage();
        };

        $scope.isEmpty = function() {
            return User.isEmpty();
        };

    } else {

        $scope.title = '点赞用户'
        User.getPostLikeUsers(userId, page).then(function(data) {
            $scope.users = data.users;
            page++;
        });

        $scope.doRefresh = function() {
            page = 0;
            User.getPostLikeUsers(userId, page).then(function(data) {
                $scope.users = data.users;
                page++;
            });
            $scope.$broadcast('scroll.refreshComplete');
        };

        $scope.loadMore = function() {
            User.getPostLikeUsers(userId, page).then(function(data) {
                $scope.users = $scope.users.concat(data.users);
                $scope.$broadcast('scroll.infiniteScrollComplete');
                page++;
            });
        };

        $scope.moreDataCanBeLoaded = function() {
            return User.hasNextPage();
        };

        $scope.isEmpty = function() {
            return User.isEmpty();
        };

    }


}

function cateHomeCtrl($scope, $rootScope, $log, $timeout, $state,
    $ionicModal, $ionicScrollDelegate, ngCart,
    Items, FetchData, Categories, $ionicSlideBoxDelegate, $http, ENV, Storage) {
    //登录
    $scope.$on('$ionicView.beforeEnter', function() {
        $rootScope.hideTabs = '';
        if (Storage.get('cateHomeOrigin') == 'index') {
            $scope.currentIndex = 0;
            Storage.remove('cateHomeOrigin');
        }
        $ionicSlideBoxDelegate.$getByHandle('delegateHandler2').start();
        // $scope.banners && $scope.changeTab($scope.banners[0],0);
    });
    $http.get(ENV.SERVER_URL + '/mall/syscode/app/get?codeType=ma_pro_one_type').success(function(r, status) {
        if (r.ret) {
            $scope.banners = r.data;
            $scope.changeTab($scope.banners[0], 0);
        }
    });

    FetchData.get('/mall/mapro/app/getAll').then(function(res) {
        $scope.tuijian = res.data;
        $ionicSlideBoxDelegate.$getByHandle('delegateHandler2').update();
    });

    $scope.ngCart = ngCart;

    $scope.redirectTo = function(banner) {
        if (banner.type == 'BOARD') {
            $state.go('tab.board', { 'boardID': banner.target })
        } else {
            window.open(banner.target, '_blank', 'location=no,toolbarposition=top,closebuttoncaption=关闭,keyboardDisplayRequiresUserAction=no')
        }
    };

    $scope.goItem = function(id) {
        $state.go('tab.item', { id: id });
    };

    $scope.slideHasChanged = function(index) {
        var nextTab = GetCate(index);
        $scope.changeTab(nextTab, index);
    }

    $scope.isFirst = true;
    $scope.currentIndex = 0;
    $scope.items = [];
    $scope.tuijian = [];
    $scope.currentTab = '';
    $scope.model = {
        activeIndex: 0
    };
    $scope.changeTab = function(tab, index) {
        $scope.items = [];
        $scope.currentTab = tab.codeKey;
        $scope.currentIndex = index;
        Items.setCurrentTab(tab.codeKey);
        Items.fetchTopItems().then(function(data) {
            $scope.isFirst = false;
            $scope.items = data;
            $ionicSlideBoxDelegate.$getByHandle('delegateHandler').update();
        });
        if (!index) {
            index = GetCateIndex($scope.currentTab);
        }
        setPosition(index);
    };

    $scope.searchItem = function(query) {
        $state.go('tab.search', { 'query': query });
    }

    /**
    $scope.swipe = function (direction) {
        var index = GetCateIndex($scope.currentTab);
        if (direction == 'left') {
            var nextTab = GetCate(index+1);
            if (nextTab == null) return;
            $scope.changeTab(nextTab, index+1);
        } else {
            var lastTab = GetCate(index-1);
            if (lastTab == null) return;
            $scope.changeTab(lastTab, index-1);

        }
    };
    **/

    function setPosition(index) {
        var iconsDiv = angular.element(document.querySelectorAll("#category-scroll"));
        var icons = iconsDiv.find("a");
        var scrollDiv = iconsDiv[0].querySelector(".scroll"); //div.scroll
        var wrap = iconsDiv[0].querySelector(".cate-scroll-row"); //div.cate-scroll-row
        var totalTabs = icons.length;

        var middle = iconsDiv[0].offsetWidth / 2;
        var curEl = angular.element(icons[index]);
        if (curEl && curEl.length) {
            var curElWidth = curEl[0].offsetWidth,
                curElLeft = curEl[0].offsetLeft;
            var leftStr = (middle - (curElLeft) - curElWidth / 2 + 5);
            //If tabs are reaching right end or left end
            if (leftStr > 0) {
                leftStr = 0;
            }
            //Use this scrollTo, so when scrolling tab manually will not flicker
            $ionicScrollDelegate.$getByHandle('cateScroll').scrollTo(Math.abs(leftStr), 0, true);
        }
    }

    function GetCateIndex(k) {
        var i = 0,
            key;
        for (key in $scope.banners) {
            if (k == key) {
                return i;
            }
            i++;
        }
        return null;
    }

    function GetCate(index) {
        return $scope.banners[index];
        // for (key in $scope.banners) {
        //     if (i == index) {
        //         return key;
        //     }
        //     i++;
        // }
        // return null;
    }

    // Items.fetchTopItems().then(function(data){
    //     $scope.items = data;
    // });

    $scope.doRefresh = function() {
        Items.fetchTopItems().then(function(data) {
            $scope.items = data;
        });
        $scope.$broadcast('scroll.refreshComplete');
    };

    $scope.loadMore = function() {
        if (!$scope.isFirst && Items.hasNextPage()) {
            Items.increaseNewItems().then(function(data) {
                $scope.items = $scope.items.concat(data);
                $scope.$broadcast('scroll.infiniteScrollComplete');
            });
        } else {
            $scope.$broadcast('scroll.infiniteScrollComplete');
            console.log($scope.isFirst, Items.hasNextPage())
        }
    };

    $scope.moreDataCanBeLoaded = function() {
        return Items.hasNextPage();
    };

    $scope.isEmpty = function() {
        return Items.isEmpty();
    };

}

function homeCtrl($scope, $rootScope, $log, $timeout, $state,
    $ionicModal, ngCart, $ionicSlideBoxDelegate, Board,
    Items, FetchData, Categories) {
    //登录
    $scope.$on('$ionicView.beforeEnter', function() {
        $rootScope.hideTabs = '';
    });

    FetchData.get('/api/banners').then(function(data) {
        $scope.banners = data.banners;
        $ionicSlideBoxDelegate.$getByHandle('image-viewer').update();
        $ionicSlideBoxDelegate.$getByHandle('image-viewer').loop(true);
    });

    $scope.ngCart = ngCart;

    $scope.redirectTo = function(banner) {
        if (banner.type == 'BOARD') {
            $state.go('tab.board', { 'boardID': banner.target })
        } else {
            window.open(banner.target, '_blank', 'location=no,toolbarposition=top,closebuttoncaption=关闭,keyboardDisplayRequiresUserAction=no')
        }
    };

    $scope.goBoard = function(board_id) {
        $state.go('tab.board', { 'boardID': board_id })
    }

    $scope.searchItem = function(query) {
        $state.go('tab.search', { 'query': query });
    }

    $scope.boards = [];
    var page = 0;

    Board.getBoards(page).then(function(data) {
        $scope.boards = data.boards;
        page++;
    });

    $scope.doRefresh = function() {
        page = 0;
        Board.getBoards(page).then(function(data) {
            $scope.boards = data.boards;
            page++;
        });
        $scope.$broadcast('scroll.refreshComplete');
    };

    $scope.loadMore = function() {
        Board.getBoards(page).then(function(data) {
            $scope.boards = $scope.boards.concat(data.boards);
            $scope.$broadcast('scroll.infiniteScrollComplete');
            page++;
        });
    };

    $scope.moreDataCanBeLoaded = function() {
        return Board.hasNextPage();
    };
    $scope.isEmpty = function() {
        return Board.isEmpty();
    }

}


function exploreCtrl($scope, $rootScope, $state, $ionicModal,
    $ionicPopover,
    Photogram, FetchData) {
    $scope.$on('$ionicView.beforeEnter', function() {
        $rootScope.hideTabs = '';
    });

    $scope.posts = [];
    $scope.currentTab = '';

    $ionicPopover.fromTemplateUrl('photogram/popover.html', {
        scope: $scope
    }).then(function(popover) {
        $scope.popover = popover;
    });

    $scope.openPopover = function($event) {
        $scope.popover.show($event);
    };

    $scope.changeTab = function(tab) {
        $scope.currentTab = tab;
        $scope.popover.hide();
        Photogram.setCurrentTab(tab);
        Photogram.fetchTopPosts().then(function(data) {
            $scope.posts = data.posts;
        });
    };

    Photogram.fetchTopPosts().then(function(data) {
        $scope.posts = data.posts;
    });

    $scope.doRefresh = function() {
        Photogram.fetchTopPosts().then(function(data) {
            $scope.posts = data.posts;
        });
        $scope.$broadcast('scroll.refreshComplete');
    };

    $scope.loadMore = function() {
        Photogram.increaseNewPosts().then(function(data) {
            $scope.posts = $scope.posts.concat(data.posts);
            $scope.$broadcast('scroll.infiniteScrollComplete');
        });
    };

    $scope.moreDataCanBeLoaded = function() {
        return Photogram.hasNextPage();
    };

    $scope.isEmpty = function() {
        return Photogram.isEmpty();
    };
}

function myPostsCtrl($scope, $rootScope, $state, $ionicModal,
    $ionicPopover, AuthService,
    Photogram) {
    $scope.$on('$ionicView.beforeEnter', function() {
        $rootScope.hideTabs = 'tabs-item-hide';
    });

    $scope.posts = [];

    var userId = AuthService.getUser().id;
    var page = 0;

    Photogram.getUserPosts(userId, page).then(function(data) {
        $scope.posts = data.posts;
        page++;
    });

    $scope.doRefresh = function() {
        page = 0;
        Photogram.getUserPosts(userId, page).then(function(data) {
            $scope.posts = data.posts;
            page++;
        });
        $scope.$broadcast('scroll.refreshComplete');
    };

    $scope.loadMore = function() {
        Photogram.getUserPosts(userId, page).then(function(data) {
            $scope.posts = $scope.posts.concat(data.posts);
            $scope.$broadcast('scroll.infiniteScrollComplete');
            page++;
        });
    };

    $scope.moreDataCanBeLoaded = function() {
        return Photogram.hasNextPage();
    };

    $scope.isEmpty = function() {
        return Photogram.isEmpty();
    };
}

function likePostsCtrl($scope, $rootScope, $state, $ionicModal,
    $ionicPopover, AuthService, Photogram) {
    $scope.$on('$ionicView.beforeEnter', function() {
        $rootScope.hideTabs = 'tabs-item-hide';
    });

    $scope.posts = [];

    var userId = AuthService.getUser().id;
    var page = 0;

    Photogram.getUserLikes(userId, page).then(function(data) {
        $scope.posts = data.posts;
        page++;
    });

    $scope.doRefresh = function() {
        page = 0;
        Photogram.getUserLikes(userId, page).then(function(data) {
            $scope.posts = data.posts;
            page++;
        });
        $scope.$broadcast('scroll.refreshComplete');
    };

    $scope.loadMore = function() {
        Photogram.getUserLikes(userId, page).then(function(data) {
            $scope.posts = $scope.posts.concat(data.posts);
            $scope.$broadcast('scroll.infiniteScrollComplete');
            page++;
        });
    };

    $scope.moreDataCanBeLoaded = function() {
        return Photogram.hasNextPage();
    };

    $scope.isEmpty = function() {
        return Photogram.isEmpty();
    };

}

function authCtrl($rootScope, $scope, FetchData, $state,
    AuthService, $ionicModal, $cordovaFacebook, $interval) {

    $scope.commonLogin = false;
    $scope.checkLogin = function(i) {
        $scope.commonLogin = !!i
    };
    $scope.validateTime = "获取验证码";
    $scope.sendStatus = false;
    $scope.timeout = null;
    $scope.getValidateCode = function() {
        var timeRemaining;
        if (!$scope.sendStatus) {
            timeRemaining = 10;
            $scope.sendStatus = true;
            $scope.timeout = $interval(function() {
                if (timeRemaining <= 1) {
                    $scope.sendStatus = false;
                    $scope.validateTime = "重新获取";
                    $interval.cancel($scope.timeout)
                } else {
                    timeRemaining--;
                    $scope.validateTime = timeRemaining + '  秒';
                }
            }, 1000)
        }
    };
    $scope.login = function() {
        $scope.error = false;
        $scope.disabled = true;
        AuthService.login($scope.email, $scope.password)
            .then(function() {
                $rootScope.authDialog.hide()
                $scope.$emit('alert', "登录成功");
            }).catch(function() {
                $scope.$emit('alert', "Invalid username and/or password");
                $scope.disabled = false;
            })
    };

    $scope.oauthLogin = function(platform) {

        function authLogin(platform, resp) {
            AuthService.oauth(platform, resp).
            then(function(data) {
                if (data.login == false) {
                    $rootScope.user_id = data.user_id;

                    $ionicModal.fromTemplateUrl('bindEmail.html', {
                        scope: $scope,
                        focusFirstInput: true,
                    }).then(function(modal) {
                        $scope.bindEmailDialog = modal;
                        $scope.bindEmailDialog.show();
                    });
                } else {
                    $rootScope.authDialog.hide();
                    $scope.$emit('alert', "登录成功");
                }
            })
        }

        function failCallback(reason) {
            $scope.$emit('alert', "Failed: " + reason);
        }

        if (platform == 'wechat_app') {
            var scope = "snsapi_userinfo";
            window.Wechat.auth(scope, function(response) {
                authLogin(platform, response)
            }, failCallback);
        } else if (platform == 'weibo_app') {
            window.YCWeibo.ssoLogin(function(args) {
                authLogin(platform, args)
            }, failCallback);
        } else if (platform == 'qq_app') {
            var checkClientIsInstalled = 1; //default is 0,only for iOS
            window.YCQQ.ssoLogin(function(args) {
                authLogin(platform, args)
            }, failCallback, checkClientIsInstalled);
        } else if (platform == 'facebook_app') {
            $cordovaFacebook.login(["public_profile", "email", "user_friends"])
                .then(function(response) {
                    if (response.authResponse) {
                        authLogin(platform, response.authResponse)
                    }
                }, function(error) {
                    $scope.$emit('alert', JSON.stringify(error));
                });
        }

    };

    //注册页面

    $scope.showSignupBox = function() {
        $ionicModal.fromTemplateUrl('signup.html', {
            scope: $scope,
            focusFirstInput: true,
        }).then(function(modal) {
            $scope.signupDialog = modal;
            $scope.signupDialog.show();
        });
    };

    $scope.closeSignupBox = function() {
        $scope.signupDialog.hide();
        $scope.signupDialog.remove();
    };

    $scope.$on('signupModal:hide', function(event) {
        $scope.signupDialog.hide();
        $scope.signupDialog.remove();
    })


    //绑定email页面

    $scope.closeBindEmailBox = function() {
        $scope.$emit('alert', "需绑定邮箱才能登录");
        $scope.bindEmailDialog.hide();
        $scope.bindEmailDialog.remove();
    };

    $scope.$on('bindEmailModal:hide', function(event) {
        $scope.bindEmailDialog.hide();
        $scope.bindEmailDialog.remove();
    })


    //忘记密码页面
    $scope.showForgotPWBox = function() {
        $ionicModal.fromTemplateUrl('forgotPassword.html', {
            scope: $scope,
            focusFirstInput: true,
        }).then(function(modal) {
            $scope.forgotPWDialog = modal;
            $scope.forgotPWDialog.show();
        });
    };

    $scope.closeForgotPWBox = function() {
        $scope.forgotPWDialog.hide();
        $scope.forgotPWDialog.remove();
    };

    $scope.$on('forgotPWModal:hide', function(event) {
        $scope.forgotPWDialog.hide();
        $scope.forgotPWDialog.remove();
    })

}

function accountCtrl($rootScope, $scope, AuthService, User, Photogram,
    $ionicScrollDelegate, Storage) {
    //个人页面
    //查看是在商城还是特卖
    $scope.$on('$ionicView.beforeEnter', function() {
        $scope.isShop = Storage.get('shopOrSell') === 'shop';
        $rootScope.hideTabs = '';
    });

    $scope.logout = function() {
        AuthService.logout();
    };
    $scope.user = AuthService;

    $scope.onUserDetailContentScroll = onUserDetailContentScroll;

    function onUserDetailContentScroll() {
        var scrollDelegate = $ionicScrollDelegate.$getByHandle('userDetailContent');
        var scrollView = scrollDelegate.getScrollView();
        $scope.$broadcast('userDetailContent.scroll', scrollView);
    }

    $scope.gridStyle = 'list';
    $scope.switchListStyle = function(style) {
        $scope.gridStyle = style;
    }


    $scope.zoom = function(img) {
        if (ionic.Platform.isAndroid()) {
            PhotoViewer.show(img, ''); //cordova photoviewer
        } else {
            ImageViewer.show(img); // cordova ImageViewer for IOS
        }
    };
    $scope.posts = [];

    var userId = AuthService.getUser().id;
    var page = 0;

    // Photogram.getUserPosts(userId, page).then(function(data){
    //     $scope.posts = data.posts;
    //     page++;
    // });

    // $scope.doRefresh = function() {
    //     page = 0;
    //     Photogram.getUserPosts(userId, page).then(function(data){
    //         $scope.posts = data.posts;
    //         page++;
    //     });
    //     $scope.$broadcast('scroll.refreshComplete');
    // };
    //
    // $scope.loadMore = function() {
    //     Photogram.getUserPosts(userId, page).then(function(data){
    //         $scope.posts = $scope.posts.concat(data.posts);
    //         $scope.$broadcast('scroll.infiniteScrollComplete');
    //         page++;
    //     });
    // };

    // $scope.moreDataCanBeLoaded = function() {
    //     return Photogram.hasNextPage();
    // };

    $scope.isEmpty = function() {
        return Photogram.isEmpty();
    };

}

function profileCtrl($scope, AuthService, $state, $rootScope,
    PhotoService, $http, ENV, $ionicPopup) {
    //个人页面
    //
    $scope.$on('$ionicView.beforeEnter', function() {
        $rootScope.hideTabs = 'tabs-item-hide';
    });

    $scope.user = AuthService;
    $scope.setUsername = function() {
        $ionicPopup.prompt({
            title: '修改昵称',
            inputType: 'text',
            defaultText: AuthService.getUser().name,
            maxLength: 16,
            cancelText: '取消',
            okText: '确定',
            okType: 'button-stable',
        }).then(function(res) {
            AuthService.setUsername(res).then(function(data) {
                $scope.$emit("alert", '修改成功');
                $rootScope.$ionicGoBack();
            });

        });
    };



    $scope.togglePhotoModal = function() {

        var filename = 'avatar/' + AuthService.getUser().id + '/' + new Date().getTime() + '.jpeg';

        PhotoService.open({
            pieces: 1,
            allowEdit: true
        }).then(function(image) {
            PhotoService.upload(image, filename,
                function(data) {
                    AuthService.updateAvatar(filename)
                        .then(function(data) {
                            $rootScope.$broadcast('alert', "头像上传成功");
                        }).catch(function(data) {
                            $rootScope.$broadcast('alert', data.error);
                        });
                },
                function(error) {
                    $rootScope.$broadcast('alert', "头像上传失败");
                });

        }).catch(function() {
            console.warn('Deu erro');
        });
    };
}

function bindEmailCtrl($rootScope, $scope, AuthService) {
    $scope.bind = function() {
        AuthService.bindEmail($scope.bindEmailForm.email, $rootScope.user_id)
            .then(function() {
                $rootScope.$broadcast('bindEmailModal:hide');
                $rootScope.authDialog.hide();
                $scope.$emit('alert', "绑定成功");
            }).catch(function(data) {
                if (data) {
                    $scope.$emit('alert', data.error);
                } else {
                    $scope.$emit('alert', 'Something went wrong..');
                }
            })
    };
}

function forgotPWCtrl($rootScope, $scope, AuthService) {
    $scope.submit = function() {
        AuthService.forgotPassword($scope.forgotPWForm.email)
            .then(function() {
                $rootScope.$broadcast('forgotPWModal:hide');
                $scope.$emit('alert', "邮件已发送至您的邮箱");
            }).catch(function(data) {
                if (data) {
                    $scope.$emit('alert', data.error);
                } else {
                    $scope.$emit('alert', 'Something went wrong..');
                }
            })
    };
}

function signupCtrl($rootScope, $scope, AuthService, $state) {
    $scope.signup = function() {
        // call register from service
        AuthService.register($scope.signupForm)
            // handle success
            .then(function() {
                $rootScope.$broadcast('signupModal:hide');
                $rootScope.authDialog.hide()
                $scope.$emit('alert', "注册成功");
                $state.go('appIndex')
            })
            .catch(function(data) {
                if (data) {
                    $scope.$emit('alert', data.error);
                } else {
                    $scope.$emit('alert', 'Something went wrong..');
                }
            });
    };

}

function settingsCtrl($rootScope, $scope, $state, AuthService) {
    //登出
    //
    $scope.$on('$ionicView.beforeEnter', function() {
        $rootScope.hideTabs = 'tabs-item-hide';
    });

    $scope.logout = function() {
        AuthService.logout()
            .then(function() {
                $state.go('tab.account');
            });
    };
}

function paymentSuccessCtrl($location, $timeout) {
    var order_id = $location.search().order_id;
    var order_type = $location.search().order_type;
    $timeout(function() {
        $location.url($location.path());
        if (order_type == 'TRANSFER') {
            $location.path('/order/transfer/' + order_id);
        } else {
            $location.path('/orders');
        }
    }, 2000);

}

function paymentCancelCtrl() {

}


function itemCtrl($scope, $rootScope, $stateParams, FetchData, $ionicModal, ngCart,
    $ionicSlideBoxDelegate, sheetShare, $cordovaSocialSharing, $ionicPopup) {
    //商品详情
    //
    $scope.$on('$ionicView.beforeEnter', function() {
        $rootScope.hideTabs = 'tabs-item-hide';
    });

    $scope.zoom = function(img) {
        if (ionic.Platform.isAndroid()) {
            PhotoViewer.show(img, ''); //cordova photoviewer
        } else {
            ImageViewer.show(img); // cordova ImageViewer for IOS
        }
    };
    /**
    $scope.updateSlider = function () {
        $ionicSlideBoxDelegate.update(); //or just return the function
    };
    **/

    // $scope.share = function(item){
    //     if ($rootScope.IsWechatInstalled && $rootScope.IsQQInstalled){
    //         sheetShare.popup(item);
    //     } else {
    //         var message = "分享图片",
    //             subject = '分享',
    //             file = item.url,
    //             link = "http://www.may.bi";
    //
    //         $cordovaSocialSharing
    //             .share(message, subject, file, link) // Share via native share sheet
    //             .then(function(result) {
    //                 console.log('result:' + result);
    //             }, function(err) {
    //                 $rootScope.$emit('alert', err);
    //             });
    //     }
    // };


    $scope.showSpecsBox = function() {
        $scope.specsDialog = $ionicPopup.show({
            templateUrl: 'specs-dialog.html',
            scope: $scope,
            cssClass: "itemCart"
        });
    };

    $scope.showSpecsBuy = function() {
        $scope.buyDialog = $ionicPopup.show({
            templateUrl: 'specsBuy-dialog.html',
            scope: $scope,
            cssClass: "itemCart"
        });
    };

    $scope.closeSpecsBox = function() {
        $scope.specsDialog.close();
    };

    $scope.closeSpecsBuy = function() {
        $scope.buyDialog.close();
    };

    $scope.$on('specsModal:hide', function(event) {
        $scope.specsDialog.close();
    })

    $scope.$on('specsBuyModal:hide', function(event) {
        $scope.buyDialog.close();
    })

    FetchData.get('/mall/mapro/app/get?id=' + $stateParams.id).then(function(data) {
        $scope.item = data.data;
        // $scope.specs = data.data.specs;
        // $scope.selectedSpec = data.data.specs[0];
        //
        // // 可选属性与属性列表组成的字典
        // $scope.attrChoices = {};
        // angular.forEach($scope.item.attributes_desc, function(key, value) {
        //     var attrChoices = [];
        //     angular.forEach($scope.specs, function(s){
        //         this.push(s.attributes[value]);
        //     }, attrChoices);
        //     $scope.attrChoices[value] = unique(attrChoices);
        // });
        //
        // var images = [];
        // angular.forEach($scope.item.specs, function (spec, index) {
        //     angular.forEach(spec.images, function (img, i) {
        //         images.push({url: img});
        //     });
        // });
        // $scope.images = images;
        $ionicSlideBoxDelegate.$getByHandle('image-viewer').update();
        $ionicSlideBoxDelegate.$getByHandle('image-viewer').loop(true);

    }, function() {
        // 接口出错，mock数据
        $scope.selectedSpec = { sku: $stateParams.id, price: 111 };
    });

    $scope.favor = function(item_id) {
        if (!$scope.item.collectFlag) {
            FetchData.post('/mall/macollect/save?maProId=' + item_id).then(function(data) {
                $scope.item.collectFlag = true;
            })
        } else {
            FetchData.get('/mall/macollect/delete?maProId=' + item_id).then(function(data) {
                $scope.item.collectFlag = false;
            })
        }
    };

    $scope.quantity = 1;
    $scope.setQuantity = function(quantity, relative) {
        var quantityInt = parseInt(quantity);
        if (quantityInt % 1 === 0) {
            if (relative === true) {
                $scope.quantity += quantityInt;
            } else {
                $scope.quantity = quantityInt;
            }
            if ($scope.quantity < 1) $scope.quantity = 1;
            // if ($scope.quantity >= 5) $scope.quantity = 5;

        } else {
            $scope.quantity = 1;
            $scope.$emit('Quantity must be an integer and was defaulted to 1');
        }
    };
    $scope.subTotal = function(price, quantity) {
        return parseFloat(price * quantity);
    }

    $scope.selectedAttr = {};
    $scope.setAttr = function(k, val) {
        $scope.selectedAttr[k] = val;
        $scope.selectedSpec = containsObj($scope.selectedAttr, $scope.specs);
        $scope.remainSpec = remainSpecs(k, val, $scope.specs);
        $scope.selectedSpecData = {
            'item': $scope.item,
            'spec': $scope.selectedSpec
        };
    };

    // 移除列表中重复的项
    function unique(arr) {
        for (var i = 0; i < arr.length; i++)
            for (var j = i + 1; j < arr.length; j++)
                if (arr[i] === arr[j]) {
                    arr.splice(j, 1);
                    j--;
                }
        return arr;
    }

    //  根据已选属性筛选出有效属性的选择
    var remainSpecs = function(k, val, list) {
        var keys = [];
        for (var i = 0; i < list.length; i++) {
            for (var kk in list[i].attributes) {
                if (kk != k && list[i].attributes[k] == val) {
                    keys.push(list[i].attributes[kk]);
                } else if (kk == k) {
                    keys.push(list[i].attributes[k]);
                }
            }
        }
        return unique(keys);
    };

    // 判断obj是否存在列表中，是则返回此对象，否则返回null
    var containsObj = function(obj, list) {
        for (var i = 0; i < list.length; i++) {
            if (angular.equals(list[i].attributes, obj)) {
                return list[i];
            }
        }
        return null;
    }


}

function boardCtrl($scope, $rootScope, $stateParams, FetchData, $state) {
    //专题详情
    $scope.$on('$ionicView.beforeEnter', function() {
        $rootScope.hideTabs = 'tabs-item-hide';
    });

    FetchData.get('/api/board/' + $stateParams.boardID).then(function(data) {
        $scope.board = data.board;
    });
    $scope.goItem = function(item_id) {
        $state.go('tab.item', { itemID: item_id });
    };

}

function itemsCtrl($rootScope, $scope, Items, $state, $stateParams) {
    //我的喜欢
    $scope.$on('$ionicView.beforeEnter', function() {
        $rootScope.hideTabs = 'tabs-item-hide';
    });

    $scope.goItem = function(item_id) {
        $state.go('tab.item', { id: item_id });
    };

    $scope.items = [];

    $scope.title = $stateParams.cn || $stateParams.query;

    var sub_cate = $stateParams.en || '';
    var query = $stateParams.query || '';

    var page = 0;

    Items.searchItems(query, sub_cate, page).then(function(data) {
        $scope.items = data;
        page++;
    });

    $scope.doRefresh = function() {
        page = 0;
        Items.searchItems(query, sub_cate, page).then(function(data) {
            $scope.items = data;
            page++;
        });
        $scope.$broadcast('scroll.refreshComplete');
    };

    $scope.loadMore = function() {
        Items.searchItems(query, sub_cate, page).then(function(data) {
            $scope.items = $scope.items.concat(data);
            $scope.$broadcast('scroll.infiniteScrollComplete');
            page++;
        });
    };

    $scope.moreDataCanBeLoaded = function() {
        return Items.hasNextPage();
    };
    $scope.isEmpty = function() {
        return Items.isEmpty();
    };
}

function favorCtrl($rootScope, $scope, FetchData, $state, ngCart) {
    //我的喜欢
    $scope.$on('$ionicView.beforeEnter', function() {
        $rootScope.hideTabs = 'tabs-item-hide';
        FetchData.get('/mall/macollect/getAll').then(function(data) {
            $scope.items = data.data;
        });
    });
    $scope.items = [];

    FetchData.get('/mall/macollect/getAll').then(function(data) {
        $scope.items = data.data;
    });

    $scope.unfavor = function(item) {
        FetchData.get('/mall/macollect/delete?maProId=' + item.id).then(function(data) {
            item.collectFlag = false;
        })
        $scope.items = $scope.items.map(function (child) {
          return child.id !== item.id
        })
    };
    $scope.addToCart = function(item) {
        ngCart.addItem(item.id, item.name, item.price, 1, item);
        // $scope.$emit("alert", "成功添加到购物车！");
    }
    $scope.goItem = function(id) {
        $state.go('tab.item', { id: id });
    };
}

function ordersCtrl($rootScope, $scope, FetchData, ngCart) {
    //订单列表
    //
    $scope.$on('$ionicView.beforeEnter', function() {
        $rootScope.hideTabs = 'tabs-item-hide';
        FetchData.get('/mall/maorder/query?code=&status=0').then(function(data) {
            $scope.orders = data.data.data;
        });
    });

    $scope.ngCart = ngCart;
    $scope.orderType = '0';
    $scope.setType = function(type) {
      if(type !== $scope.orderType) {
        $scope.orderType = type;
        FetchData.get('/mall/maorder/query?code=&status=' + type).then(function(data) {
            $scope.orders = data.data.data;
        });
      }
    };
    $scope.orderDone = function (order) {
      var confirmPopup = $ionicPopup.confirm({
          title: '确定已收到货?',
      });
      confirmPopup.then(function(res) {
          if (res) {
              FetchData.get('/mall/maorder/confirm?id=' + $order.code)
                  .then(function(data) {
                    if(data.res) {
                      $scope.$emit("alert", "交易成功！");
                      $state.go('tab.orders');
                    } else{
                      $scope.$emit("alert", data.errmsg || "订单操作出错，请稍后再试");
                    }
                  })
          } else {
              console.log('You are not sure');
          }
      });
    }
}

function orderDetailCtrl($rootScope, $scope, $state, $stateParams, FetchData, ngCart, $ionicPopup) {
    //订单详情
    //
    $scope.$on('$ionicView.beforeEnter', function() {
        $rootScope.hideTabs = 'tabs-item-hide';
    });

    $scope.ngCart = ngCart;

    FetchData.get('/mall/maorder/query?code='+$stateParams.order_id+'&status=').then(function(data) {
        $scope.order = data.data.data[0];
    });

    // A confirm dialog
    $scope.cancelOrder = function() {
        var confirmPopup = $ionicPopup.confirm({
            title: '确定取消订单?',
        });
        confirmPopup.then(function(res) {
            if (res) {
                FetchData.get('/mall/maorder/cancel?id=' + $scope.order.id)
                    .then(function(data) {
                      if(data.ret) {
                        $scope.$emit("alert", "订单已删除");
                        $state.go('tab.orders');
                      } else{
                        $scope.$emit("alert", data.errmsg || "订单删除出错，请稍后尝试");
                      }
                    })
            } else {
                console.log('You are not sure');
            }
        });
    };
}

function logisticsDetailCtrl($rootScope, $scope, $stateParams, $state, FetchData, ngCart) {
    //商品详情
    $scope.$on('$ionicView.beforeEnter', function() {
        $rootScope.hideTabs = 'tabs-item-hide';
    });

    $scope.allStatus = [];
    FetchData.get('/api/orders/get/' + $stateParams.order_id).then(function(data) {
        $scope.ngCart = ngCart;
        $scope.order = data.order;
        $scope.logistic = data.order.logistics[0];
        angular.forEach($scope.logistic.all_status, function(status, index) {
            $scope.allStatus.push(status.status);
        });
    });

    $scope.currTab = 0;
    $scope.goTab = function(index, lo) {
        $scope.currTab = index;
        $scope.logistic = lo;
        angular.forEach($scope.logistic.all_status, function(status, index) {
            $scope.allStatus.push(status.status);
        });

    }

    $scope.addr = ngCart.getAddress();
    $scope.gotoAddress = function() {
        $state.go('address');
    };
    $scope.fillTracking = function(entry) {
        FetchData.post('/api/orders/fill_shipping_info', {
            'entry_id': entry.id,
            'shipping_info': entry.shipping_info,
        }).then(function(data) {
            $scope.$emit("alert", "成功提交");
        });
    };
    // provider actions
    $scope.selectedProvider = null;
    $scope.providersShown = false;

    $scope.showProviderChoices = function() {
        if (ngCart.getAddress().id === undefined) {
            $scope.$emit('alert', "请先添加地址");
            return;
        }
        $scope.providersShown = !$scope.providersShown;
        FetchData.post('/api/logistic/transfer_provider_prices', {
            'order_id': $scope.order.id,
            'country': ngCart.getAddress().data.country,
        }).then(function(data) {
            $scope.provider_prices = data.logistics.providers;
            $scope.selectedProvider = data.logistics.providers[0];
        });
    };

    $scope.selectPartner = function(provider) {
        $scope.selectedProvider = provider;
        $scope.providersShown = !$scope.providersShown;
        ngCart.setExpress(provider);

        FetchData.post('/api/orders/cal_order_price', {
            'order_id': $scope.order.id,
            'address_id': ngCart.getAddress().id,
            'coupon_codes': [$scope.coupon_codes.code],
            'logistic_provider': $scope.selectedProvider.name,
        }).then(function(data) {
            $scope.order = data.order;
        });
    };

    // coupon actions
    $scope.coupon_codes = '';
    $scope.couponsShown = false;
    $scope.couponInputSelected = false;
    $scope.noCouponSelected = false;

    $scope.showCouponsChoices = function() {
        if (ngCart.getAddress().id === undefined) {
            $scope.$emit('alert', "请先添加地址");
            return;
        }
        if ($scope.selectedProvider == null) {
            $scope.$emit('alert', "请先选择运输方式");
            return;
        }
        $scope.couponsShown = !$scope.couponsShown;
        FetchData.post('/api/users/coupons/by_order', {
            'order_id': $scope.order.id,
        }).then(function(data) {
            $scope.availableCoupons = data.consumable_coupons;
            $scope.coupon_codes = '';
        });

    };
    $scope.noCoupon = function() {
        $scope.coupon_codes = '';
        $scope.couponInputSelected = false;
        $scope.noCouponSelected = true;
        $scope.couponsShown = !$scope.couponsShown;
        FetchData.post('/api/orders/cal_order_price', {
            'order_id': $scope.order.id,
            'address_id': ngCart.getAddress().id,
            'coupon_codes': [],
            'logistic_provider': $scope.selectedProvider.name,
        }).then(function(data) {
            $scope.order = data.order;
        });
    };
    $scope.selectCoupon = function(coupon) {
        $scope.coupon_codes = coupon;
        $scope.couponsShown = !$scope.couponsShown;
        $scope.couponInputSelected = false;
        $scope.noCouponSelected = false;
        FetchData.post('/api/orders/cal_order_price', {
            'order_id': $scope.order.id,
            'address_id': ngCart.getAddress().id,
            'coupon_codes': [$scope.coupon_codes.code],
            'logistic_provider': $scope.selectedProvider.name,
        }).then(function(data) {
            $scope.order = data.order;
        });
    };
    $scope.selectInputCoupon = function() {
        $scope.coupon_codes = '';
        $scope.couponInputSelected = true;
        $scope.noCouponSelected = false;
    };

    $scope.confirmCoupon = function() {
        $scope.couponInputSelected = true;
        FetchData.post('/api/orders/cal_order_price', {
            'order_id': $scope.order.id,
            'address_id': ngCart.getAddress().id,
            'coupon_codes': [$scope.couponInput],
            'logistic_provider': $scope.selectedProvider.name,
        }).then(function(data) {
            $scope.coupon_codes = {
                code: $scope.couponInput,
                description: $scope.couponInput,
            };
            if (data.order.discount.length === 0) {
                $scope.coupon_codes['saving'] = "无效折扣码";
            } else {
                $scope.coupon_codes['saving'] = data.order.discount[0].value;
                $scope.couponsShown = !$scope.couponsShown;
            };
            $scope.order = data.order;
        }).catch(function() {
            $scope.$emit("alert", "something wrong..");
        });
    };

    $scope.cancelOrder = function() {
        window.confirm('确定取消订单？') ?
            FetchData.get('/api/orders/' + $scope.order.id + '/delete').then(function(data) {
                $scope.$emit("alert", "订单已删除");
                $location.path('/orders');
            }) : void(0);
    };

}

function calculateCtrl($rootScope, $scope, $location, FetchData) {
    $scope.$on('$ionicView.beforeEnter', function() {
        $rootScope.hideTabs = 'tabs-item-hide';
    });

    FetchData.get('/api/address/hierarchy').then(function(data) {
        $scope.COUNTRIES = data.countries;
    });
    $scope.query = {};

    $scope.queryFee = function() {
        if (!$scope.query.country || !$scope.query.weight) {
            $scope.$emit("alert", "请填写完整信息");
            return;
        }
        FetchData.get('/api/logistic/cal_provider_prices', {
            'country': $scope.query.country,
            'weight': $scope.query.weight,
        }).then(function(data) {
            $scope.provider_prices = data.logistics.providers;
        });
    };
}

function expressCtrl($rootScope, $scope, FetchData, ngCart, AuthService, $state, expressList) {
    //待寄物品清单
    $scope.$on('$ionicView.beforeEnter', function() {
        $rootScope.hideTabs = 'tabs-item-hide';
    });

    $scope.ngCart = ngCart;
    $scope.STATUES = ['跟踪快递', '入库称重', '支付运费', '正在运送', '航班到港', '包裹签收'];

    $scope.addr = ngCart.getAddress();
    $scope.gotoAddress = function() {
        $state.go('address')
    };

    $scope.entries = expressList.get() || [];
    $scope.newEntry = {};
    $scope.addEntry = function() {
        $state.go('tab.express_add');
    };
    $scope.removeEntry = function(entry) {
        angular.forEach($scope.entries, function(ent, index) {
            if (ent === entry) {
                $scope.entries.splice(index, 1);
            }
        });
    };
    $scope.submit = function() {
        if ($scope.entries.length == 0) {
            $scope.$emit('alert', "您未添加商品");
            return;
        }
        if (AuthService.getUser() === {}) {
            $scope.$emit('alert', "请先登录");
        }
        if (ngCart.getAddress().id === undefined) {
            $scope.$emit('alert', "请添加地址");
            return;
        }

        $rootScope.$broadcast("alertStart", "正在处理，请稍等..");
        FetchData.post('/api/orders/create_transfer_order', {
            'entries': $scope.entries,
            'address_id': ngCart.getAddress().id,
            'coupon_codes': [],
            'logistic_provider': 'default',
        }).then(function(data) {
            $scope.order = data.order;
            $rootScope.$broadcast("alertEnd");
            $state.go('tab.order_transfer', { 'order_id': data.order_id });
            expressList.empty();
        }).catch(function() {
            $scope.$emit("alert", "系统出错..");
        });

    }
}

function expressItemAddCtrl($rootScope, $scope, expressList) {
    $scope.$on('$ionicView.beforeEnter', function() {
        $rootScope.hideTabs = 'tabs-item-hide';
    });
    $scope.expressList = expressList.get();
    $scope.item = {};
    $scope.addItem = function() {
        if (!$scope.item.title || !$scope.item.quantity || !$scope.item.amount || !$scope.item.remark) {
            $scope.$emit('alert', "请填写完整信息");
            return
        }
        if ($scope.item.main_category == true) {
            $scope.item.main_category = 'special';
        } else {
            $scope.item.main_category = 'normal';
        }
        expressList.add($scope.item);
        $scope.$ionicGoBack();
    }
}

function cartCtrl(FetchData, $rootScope, $scope, ngCart, Storage) {
    //购物车
    //
    $scope.$on('$ionicView.beforeEnter', function() {
        $rootScope.hideTabs = '';
        ngCart.init();
        FetchData.get('/mall/mashopping/getAll').then(function(data) {
            if (data.ret) {
                ngCart.$loadCart(data.data);
            } else {
                Storage.remove('user');
                alert('请先登录');
            }
        });
    });

    FetchData.get('/mall/mashopping/getAll').then(function(data) {
        ngCart.$loadCart(data.data);
    });
    $scope.ngCart = ngCart;
    $scope.editShown = false;
    $scope.toggleEditShown = function() {
        $scope.editShown = !$scope.editShown;
    };
    $scope.setQuantity = function(item, quantity, relative) {
        var quantityInt = parseInt(quantity);
        if (quantityInt % 1 === 0) {
            if (relative === true) {
                item.setQuantity(item.getQuantity() + quantityInt)
            } else {
                item.setQuantity(quantityInt)
            }
            if (item.getQuantity() < 1) item.setQuantity(1);
            // if (item.getQuantity() >= 5) item.setQuantity(5);

        } else {
            item.setQuantity(1)
            $scope.$emit('Quantity must be an integer and was defaulted to 1');
        }
        FetchData.post('/mall/mashopping/updateNum?id=' + item.getId() + '&num=' + item.getQuantity()).then(function(data) {

        });
    };
    $scope.$watch(function() {
        return ngCart.getSelectedItems()
    }, function(newVal) {
        if (newVal.length) {
            $scope.isSelectedAll = newVal.length === ngCart.getItems().length
        } else {
            $scope.isSelectedAll = false;
        }
    }, true)

    $scope.selectEntry = function(id) {
        if (ngCart.getSelectedItemById(id)) {
            ngCart.removeSelectedItemById(id);
        } else {
            ngCart.selectItem(id);
        }
    };

    $scope.selectAllEntries = function() {
        if ($scope.isSelectedAll === false) {
            angular.forEach(ngCart.getCart().items, function(item, index) {
                if (!ngCart.getSelectedItemById(item.getId())) {
                    ngCart.selectItem(item.getId());
                }
            });
        } else {
            ngCart.getCart().selectedItems = [];
        }
        $scope.isSelectedAll = !$scope.isSelectedAll;
    };
}


function checkoutCtrl($state, $scope, $rootScope, FetchData, ngCart) {
    // 结算
    //
    $scope.$on('$ionicView.beforeEnter', function() {
        $rootScope.hideTabs = 'tabs-item-hide';
        $scope.addr = ngCart.getAddress();
    });
    $scope.provider_prices = [{
        name: '普通快递',
        id:'0'
    }, {
        name: '同城闪送',
        id:'1'
    }];

    $scope.ngCart = ngCart;
    $scope.selectedProvider = {};
    $scope.clearSelectedCart = function() {
        ngCart.emptySelectedItems();
        $scope.$ionicGoBack();
    };
    $scope.gotoAddress = function() {
        $state.go('address');
    };

    FetchData.get('/mall/syscode/app/get?codeType=express_type').then(function(data) {
        $scope.provider_prices = data.data;

        // 设置购物车默认快递
        $scope.selectedProvider = data.data[0];
        ngCart.setExpress(data.data[0]);
    });

    // provider actions
    $scope.providersShown = false;

    $scope.showProviderChoices = function() {
        if (ngCart.getAddress().id === undefined) {
            $scope.$emit('alert', "请先添加地址");
            return;
        }
        $scope.providersShown = !$scope.providersShown;
        // FetchData.post('/api/logistic/channel_prices', {
        //     'entries': ngCart.selectedItemsObjects(),
        //     'country': $scope.addr.data.country,
        // }).then(function(data) {
        //     $scope.provider_prices = data.logistics.providers;
        //     $scope.selectedProvider = data.logistics.providers[0];
        // });
    };

    $scope.selectPartner = function(provider) {
        $scope.selectedProvider = provider;
        $scope.providersShown = !$scope.providersShown;
        ngCart.setExpress(provider);
        // FetchData.post('/api/orders/cal_entries_price', {
        //     'entries': ngCart.selectedItemsObjects(),
        //     'address_id': ngCart.getAddress().id,
        //     'coupon_codes': [$scope.coupon_codes.code],
        //     'logistic_provider': $scope.selectedProvider.name,
        // }).then(function(data) {
        //     $scope.order = data.order;
        // });
    };

    // coupon actions
    // $scope.coupon_codes = '';
    // $scope.couponsShown = false;
    // $scope.couponInputSelected = false;
    // $scope.noCouponSelected = false;
    // $scope.showCouponsChoices = function() {
    //     if (ngCart.getAddress().id === undefined) {
    //         $scope.$emit('alert', "请先添加地址");
    //         return;
    //     }
    //     if ($scope.selectedProvider == null) {
    //         $scope.$emit('alert', "请先选择运输方式");
    //         return;
    //     }
    //     $scope.couponsShown = !$scope.couponsShown;
    //     FetchData.post('/api/users/coupons/by_entries', {
    //         'entries': ngCart.selectedItemsObjects(),
    //     }).then(function(data) {
    //         $scope.availableCoupons = data.consumable_coupons;
    //         $scope.coupon_codes = '';
    //     });
    // };
    // $scope.noCoupon = function() {
    //     $scope.coupon_codes = '';
    //     $scope.couponInputSelected = false;
    //     $scope.noCouponSelected = true;
    //     $scope.couponsShown = !$scope.couponsShown;
    //     FetchData.post('/api/orders/cal_entries_price', {
    //         'entries': ngCart.selectedItemsObjects(),
    //         'address_id': ngCart.getAddress().id,
    //         'coupon_codes': [],
    //         'logistic_provider': $scope.selectedProvider.name,
    //     }).then(function(data) {
    //         $scope.order = data.order;
    //     });
    // };
    // $scope.selectCoupon = function(coupon) {
    //     $scope.coupon_codes = coupon;
    //     $scope.couponsShown = !$scope.couponsShown;
    //     $scope.couponInputSelected = false;
    //     $scope.noCouponSelected = false;
    //     FetchData.post('/api/orders/cal_entries_price', {
    //         'entries': ngCart.selectedItemsObjects(),
    //         'address_id': ngCart.getAddress().id,
    //         'coupon_codes': [$scope.coupon_codes.code],
    //         'logistic_provider': $scope.selectedProvider.name,
    //     }).then(function(data) {
    //         $scope.order = data.order;
    //     });
    // };
    // $scope.selectInputCoupon = function() {
    //     $scope.coupon_codes = '';
    //     $scope.couponInputSelected = true;
    //     $scope.noCouponSelected = false;
    // };
    //
    // $scope.confirmCoupon = function() {
    //     $scope.couponInputSelected = true;
    //     FetchData.post('/api/orders/cal_entries_price', {
    //         'entries': ngCart.selectedItemsObjects(),
    //         'address_id': ngCart.getAddress().id,
    //         'coupon_codes': [$scope.couponInput],
    //         'logistic_provider': $scope.selectedProvider.name,
    //     }).then(function(data) {
    //         $scope.coupon_codes = {
    //             code: $scope.couponInput,
    //             description: $scope.couponInput,
    //         };
    //         if (data.order.discount.length === 0) {
    //             $scope.coupon_codes['description'] = "无效折扣码";
    //         } else {
    //             $scope.coupon_codes['saving'] = data.order.discount[0].value;
    //             $scope.couponsShown = !$scope.couponsShown;
    //         };
    //         $scope.order = data.order;
    //
    //     }).catch(function() {
    //         $scope.$emit("alert", "something wrong..");
    //     });
    // };
}

function addressCtrl($rootScope, $state, $scope, FetchData, ngCart) {
    // 地址选择
    $scope.$on('$ionicView.beforeEnter', function() {
        $rootScope.hideTabs = 'tabs-item-hide';
    });

    FetchData.get('/mall/receipt/query').then(function(data) {
        $scope.addresses = data.data.data;
        // 根据购物车中的地址确定已选中地址
        if (ngCart.getAddress().id) {
          angular.forEach($scope.addresses, function(addr, index) {
              if (addr.id === ngCart.getAddress().id) {
                  addr.flag = 1;
              } else {
                  addr.flag = 0;
              }
          });
        }
  });
    $scope.editShown = false;
    $scope.toggleEditShown = function() {
        $scope.editShown = !$scope.editShown;
    };
    $scope.setDefault = function(addr_id) {
        FetchData.post('/mall/receipt/updateFlag?id=' + addr_id).then(function(data) {
            angular.forEach($scope.addresses, function(addr, index) {
                if (addr.id === addr_id) {
                    addr.flag = 1;
                } else {
                    addr.flag = 0;
                }
            });
        });
    };
    $scope.removeAddr = function(addr_id) {
        FetchData.get('/mall/receipt/delete?id=' + addr_id).then(function(data) {
            if (data.ret) {
                angular.forEach($scope.addresses, function(addr, index) {
                    if (addr.id === addr_id) {
                        $scope.addresses.splice(index, 1);
                    }
                });
            } else {
                $scope.$emit("alert", data.error);
            }
        });
    };
    $scope.addresses = [];
    $scope.ngCart = ngCart;
    $scope.selectedAddress = '';
    $scope.selectAddress = function(address) {
        $scope.selectedAddress = address;
        angular.forEach($scope.addresses, function(addr, index) {
            if (addr.id === address.id) {
                addr.flag = 1;
            } else {
                addr.flag = 0;
            }
        });
    };
    $scope.confirmAddress = function() {
        ngCart.setAddress($scope.selectedAddress);
        $rootScope.$ionicGoBack();
    };
}

function fourZeroFour_controller() {}

function feedbackCtrl($scope, FetchData, $rootScope) {
    $scope.feedback = function() {
        FetchData.post('/api/users/feedback', {
            'feedback': $scope.text
        }).then(function(data) {
            $scope.$emit('alert', "感谢您的反馈，我们会及时与您联系。");
        })
    };
}

function csCtrl($rootScope, $scope) {
    $scope.$on('$ionicView.beforeEnter', function() {
        $rootScope.hideTabs = 'tabs-item-hide';
    });
}

function faqCtrl($rootScope, $scope) {
    $scope.$on('$ionicView.beforeEnter', function() {
        $rootScope.hideTabs = 'tabs-item-hide';
    });
}

function categoryCtrl($rootScope, $scope, FetchData, $state) {
    $scope.$on('$ionicView.beforeEnter', function() {
        $rootScope.hideTabs = 'tabs-item-hide';
    });

    FetchData.get('/api/categories').then(function(data) {
        $scope.categories = data.categories;
    });
    $scope.goCategory = function(sub) {
        $state.go('tab.categories', { en: sub.en, cn: sub.cn });
    };

}

function couponsCtrl($rootScope, $scope, AuthService) {
    $scope.$on('$ionicView.beforeEnter', function() {
        $rootScope.hideTabs = 'tabs-item-hide';
    });

    $scope.user = AuthService;

}

function aboutCtrl($rootScope, $scope, $state, appUpdateService) {
    $scope.$on('$ionicView.beforeEnter', function() {
        $rootScope.hideTabs = 'tabs-item-hide';
    });

    $scope.platform = ionic.Platform;

    $scope.appUpdateService = appUpdateService;

}

function notificationCtrl($rootScope, $scope, $state, Notification) {
    $scope.$on('$ionicView.beforeEnter', function() {
        $rootScope.hideTabs = '';
    });

    $scope.zoom = function(url) {

        if (ionic.Platform.isAndroid()) {
            PhotoViewer.show(url, ''); //cordova photoviewer
        } else {
            ImageViewer.show(url); // cordova ImageViewer for IOS
        }
    };

    $scope.notices = [];
    var page = 0;

    Notification.getNotices(page).then(function(data) {
        $scope.notices = data.notices;
        page++;
    });

    $scope.doRefresh = function() {
        page = 0;
        Notification.getNotices(page).then(function(data) {
            $scope.notices = data.notices;
            page++;
        });
        $scope.$broadcast('scroll.refreshComplete');
    };

    $scope.loadMore = function() {
        Notification.getNotices(page).then(function(data) {
            $scope.notices = $scope.notices.concat(data.notices);
            $scope.$broadcast('scroll.infiniteScrollComplete');
            page++;
        });
    };

    $scope.moreDataCanBeLoaded = function() {
        return Notification.hasNextPage();
    };
    $scope.isEmpty = function() {
        return Notification.isEmpty();
    }

}

function introCtrl($rootScope, $scope, $state, FetchData, $ionicSlideBoxDelegate, Storage) {

    var currentPlatform = ionic.Platform.platform();
    $scope.slideIndex = 0;
    $scope.slideChanged = slideChanged;
    $scope.next = function() {
        $ionicSlideBoxDelegate.next();
    };
    $scope.previous = function() {
        $ionicSlideBoxDelegate.previous();
    };



    if (currentPlatform && currentPlatform == 'android') {
        $scope.device = 'android';
    } else {
        $scope.device = 'iphone';
    }

    $scope.slides = [{
        top: '专属轻社区，分享交流，互助互惠',
        img: 'img/intro/intro3.jpg'
    }, {
        top: '晒图卖萌刷心情，展现特别的你',
        img: 'img/intro/intro4.jpg'
    }, {
        top: '家乡特色，闪电发货，海外直邮',
        img: 'img/intro/intro1.jpg'
    }, {
        top: '私人包裹 & 寄出国，省心又省力',
        img: 'img/intro/intro2.jpg'
    }];

    function slideChanged(index) {
        $scope.slideIndex = index;
    }

    $scope.goHome = function() {
        $state.go('tab.explore');
        Storage.set('introPage', 'alreadyShow');
    };

}



controllersModule.controller('appIndexCtrl', appIndexCtrl);
controllersModule.controller('homeCtrl', homeCtrl);
controllersModule.controller('cateHomeCtrl', cateHomeCtrl);
controllersModule.controller('introCtrl', introCtrl);
controllersModule.controller('exploreCtrl', exploreCtrl);
controllersModule.controller('notificationCtrl', notificationCtrl);
controllersModule.controller('myPostsCtrl', myPostsCtrl);
controllersModule.controller('likePostsCtrl', likePostsCtrl);
controllersModule.controller('postDetailCtrl', postDetailCtrl);
controllersModule.controller('userDetailCtrl', userDetailCtrl);
controllersModule.controller('userListCtrl', userListCtrl);
controllersModule.controller('tabsCtrl', tabsCtrl);
controllersModule.controller('shopTabsCtrl', shopTabsCtrl);
controllersModule.controller('feedbackCtrl', feedbackCtrl);
controllersModule.controller('csCtrl', csCtrl);
controllersModule.controller('faqCtrl', faqCtrl);
controllersModule.controller('couponsCtrl', couponsCtrl);
controllersModule.controller('categoryCtrl', categoryCtrl);
controllersModule.controller('authCtrl', authCtrl);
controllersModule.controller('signupCtrl', signupCtrl);
controllersModule.controller('accountCtrl', accountCtrl);
controllersModule.controller('profileCtrl', profileCtrl);
controllersModule.controller('bindEmailCtrl', bindEmailCtrl);
controllersModule.controller('forgotPWCtrl', forgotPWCtrl);
controllersModule.controller('settingsCtrl', settingsCtrl);
controllersModule.controller('paymentSuccessCtrl', paymentSuccessCtrl);
controllersModule.controller('paymentCancelCtrl', paymentCancelCtrl);
controllersModule.controller('itemCtrl', itemCtrl);
controllersModule.controller('itemsCtrl', itemsCtrl);
controllersModule.controller('boardCtrl', boardCtrl);
controllersModule.controller('favorCtrl', favorCtrl);
controllersModule.controller('ordersCtrl', ordersCtrl);
controllersModule.controller('calculateCtrl', calculateCtrl);
controllersModule.controller('expressCtrl', expressCtrl);
controllersModule.controller('expressItemAddCtrl', expressItemAddCtrl);
controllersModule.controller('orderDetailCtrl', orderDetailCtrl);
controllersModule.controller('logisticsDetailCtrl', logisticsDetailCtrl);
controllersModule.controller('cartCtrl', cartCtrl);
controllersModule.controller('checkoutCtrl', checkoutCtrl);
controllersModule.controller('addressCtrl', addressCtrl);
controllersModule.controller('fourZeroFour_controller', fourZeroFour_controller);
controllersModule.controller('aboutCtrl', aboutCtrl);
controllersModule.controller('scanCtrl', scanCtrl);

"use strict";

angular.module('maybi.services', [])

    .factory('timeoutHttpIntercept', function() {
        return {
            'request': function(config) {
                config.timeout = 10000;
                return config;
            }
        };
    })
    .service('utils', ['$rootScope', function($rootScope) {
        return {
            formatGetParams: formatGetParams
        };

        function formatGetParams(obj) {
            var params = '?';
            for (var key in obj) {
                params += [key, '=', obj[key], '&'].join('')
            }
            return params.slice(0, -1)
        }
    }])
    .service('sheetShare', ['$rootScope', '$bottomSheet', function($rootScope, $bottomSheet) {
        this.popup = showSheet;

        function showSheet(item, share_type) {
            $bottomSheet.show({
                buttons: [
                    [{
                            btText: "微信好友",
                            btClass: "icon fa fa-weixin",
                            btId: "0",
                            hideOnClick: true
                        }, //hide the bottomSheet when click
                        {
                            btText: "朋友圈",
                            btClass: "icon pyq",
                            btId: "1"
                        },
                        {
                            btText: "微博",
                            btClass: "icon fa fa-weibo",
                            btId: "2"
                        },
                        {
                            btText: "QQ好友",
                            btClass: "icon fa fa-qq",
                            btId: "3"
                        }
                    ]
                ],
                titleText: '分享到',
                buttonClicked: function(button, scope) {
                    if (share_type == 'post') {
                        var title = item.title.substr(0, 24);
                        var description = "来自美比，比邻中国的海外生活。";
                        var url = "http://www.may.bi/";
                        var image = item.small_url;
                    } else {
                        var title = item.title.substr(0, 24);
                        var description = "来自美比，比邻中国的海外生活。";
                        var url = "http://may.bi/#/items/" + item.item_id;
                        var image = item.small_thumbnail;
                    }

                    var successCallback = function() {
                        $rootScope.$broadcast('alert', "分享成功");
                    };
                    var failCallback = function(reason) {
                        $rootScope.$broadcast('alert', reason);
                    };

                    if (button.btId == 0 || button.btId == 1) {
                        window.Wechat.share({
                            message: {
                                title: title,
                                description: description,
                                thumb: image,
                                media: {
                                    type: Wechat.Type.LINK,
                                    webpageUrl: url
                                }
                            },
                            scene: button.btId,
                        }, successCallback, failCallback);
                    } else if (button.btId == 2) {
                        var args = {};
                        args.url = url;
                        args.title = title;
                        args.description = description;
                        args.imageUrl = image;
                        args.defaultText = "";
                        window.YCWeibo.shareToWeibo(successCallback, failCallback, args);
                    } else if (button.btId == 3) {
                        var args = {};
                        args.url = url;
                        args.title = title;
                        args.description = description;
                        args.imageUrl = image;
                        args.appName = "美比客户端";
                        window.YCQQ.shareToQQ(function() {}, failCallback, args);
                    }
                }
            });
        }
    }])

    .service('share', ['$rootScope', '$ionicActionSheet', function($rootScope, $ionicActionSheet) {
        this.popup = showPopup;

        function showPopup(item) {
            var sheet = {};
            sheet.cancelText = '取消';
            sheet.buttonClicked = buttonClicked;
            sheet.buttons = [{
                text: '<i class="icon fa fa-weixin"></i> 发送给微信好友'
            }, {
                text: '<i class="icon fa fa-weixin"></i> 分享到朋友圈'
            }, {
                text: '<i class="icon fa fa-weibo"></i> 分享到微博'
            }, {
                text: '<i class="icon fa fa-qq"></i> 发送给QQ好友'
            }];

            $ionicActionSheet.show(sheet);

            function buttonClicked(index) {

                var title = item.title;
                var description = "美比，给您比邻中国的海外生活。";
                var url = "http://may.bi/#/items/" + item.item_id;
                var image = item.small_thumbnail;

                var successCallback = function() {
                    $rootScope.$broadcast('alert', "分享成功");
                };
                var failCallback = function(reason) {
                    $rootScope.$broadcast('alert', reason);
                };

                if (index == 0 || index == 1) {
                    window.Wechat.share({
                        message: {
                            title: title,
                            description: description,
                            thumb: image,
                            media: {
                                type: Wechat.Type.LINK,
                                webpageUrl: url
                            }
                        },
                        scene: index
                    }, successCallback, failCallback);
                } else if (index == 2) {
                    var args = {};
                    args.url = url;
                    args.title = title;
                    args.description = description;
                    args.imageUrl = image;
                    args.defaultText = "";
                    window.YCWeibo.shareToWeibo(successCallback, failCallback, args);
                } else if (index == 3) {
                    var args = {};
                    args.url = url;
                    args.title = title;
                    args.description = description;
                    args.imageUrl = image;
                    args.appName = "美比客户端";
                    window.YCQQ.shareToQQ(function() {}, failCallback, args);
                }

            }
        }
    }])

    .factory('Storage', function() {
        return {
            set: function(key, data) {
                return window.localStorage.setItem(key, window.JSON.stringify(data));
            },
            get: function(key) {

                return window.JSON.parse(window.localStorage.getItem(key));
            },
            remove: function(key) {
                return window.localStorage.removeItem(key);
            }
        };
    })
    .factory('AuthService', ['ENV', '$http', 'Storage', '$state', '$q', function(ENV, $http, Storage, $state, $q) {
        var isAuthenticated = false;
        var user = Storage.get('user') || {};
        return {
            isLoggedIn: function() {
                if (isAuthenticated) {
                    return true;
                } else {
                    return false;
                }
            },

            login: function(email, password) {
                var deferred = $q.defer();
                $http.post(ENV.SERVER_URL + '/mall/vip/login', {
                    name: email,
                    pwd: password
                }).success(function(data, status) {
                    if (status === 200 && data.ret) {
                        isAuthenticated = true;
                        $http.get(ENV.SERVER_URL + '/mall/vip/get').success(function(data) {
                            user = data.data;
                            Storage.set('user', data.data);
                            Storage.set('access_token', data.data.name);
                            // if (window.cordova && window.cordova.plugins) {
                            //     plugins.jPushPlugin.setAlias(data.user.id);
                            // }
                            deferred.resolve();
                            $state.go('appIndex')
                        })
                    } else {
                        isAuthenticated = false;
                        deferred.reject();
                    }
                }).error(function(data) {
                    isAuthenticated = false;
                    deferred.reject();
                });

                return deferred.promise;
            },

            setUsername: function(username) { //TODO 目前后台返回的data只有message，需要让后台返回新的user对象，然后前端Storage.set('user', data.user);
                var deferred = $q.defer();
                $http.post(ENV.SERVER_URL + '/mall/vip/updateName?name=' + username).success(function(data, status) {
                    if (status === 200 && data.ret) {
                        user = Storage.get('user');
                        user.name = username;
                        Storage.set('user', user);
                        deferred.resolve(data);
                    } else {
                        deferred.reject(data);
                    }
                }).error(function(data) {
                    deferred.reject(data);
                });

                return deferred.promise;
            },

            updateAvatar: function(filename) { //TODO 目前后台返回的data只有message，需要让后台返回新的user对象，然后前端Storage.set('user', data.user);
                var deferred = $q.defer();
                $http.post(ENV.SERVER_URL + '/api/users/update_avatar', {
                    avatar_url: filename,
                }).success(function(data, status) {
                    if (status === 200 && data.message == "OK") {
                        user = data.user;
                        Storage.set('user', data.user);
                        deferred.resolve(data);
                    } else {
                        deferred.reject(data);
                    }
                }).error(function(data) {
                    deferred.reject(data);
                });

                return deferred.promise;
            },


            bindEmail: function(email, user_id) {
                var deferred = $q.defer();
                $http.post(ENV.SERVER_URL + '/api/auth/bind_email', {
                    email: email,
                    user_id: user_id,
                }).success(function(data, status) {
                    if (status === 200 && data.message == "OK") {
                        isAuthenticated = true;
                        user = data.user;
                        Storage.set('user', data.user);
                        Storage.set('access_token', data.remember_token);
                        if (window.cordova && window.cordova.plugins) {
                            plugins.jPushPlugin.setAlias(data.user.id);
                        }
                        deferred.resolve();
                    } else {
                        isAuthenticated = false;
                        deferred.reject(data);
                    }
                }).error(function(data) {
                    isAuthenticated = false;
                    deferred.reject();
                });

                return deferred.promise;
            },

            forgotPassword: function(email) {
                var deferred = $q.defer();
                $http.post(ENV.SERVER_URL + '/api/auth/forgot_password', {
                    email: email,
                }).success(function(data, status) {
                    if (status === 200 && data.message == "OK") {
                        deferred.resolve();
                    } else {
                        isAuthenticated = false;
                        deferred.reject(data);
                    }
                }).error(function(data) {
                    isAuthenticated = false;
                    deferred.reject();
                });

                return deferred.promise;
            },

            logout: function() {
                var deferred = $q.defer();
                $http.get(ENV.SERVER_URL + '/mall/vip/logout').success(function(data) {
                    isAuthenticated = false;
                    user = {};
                    Storage.remove('user');
                    Storage.remove('access_token');
                    window.location.href = "#/appIndex";
                    deferred.resolve();
                }).error(function(data) {
                    isAuthenticated = false;
                    deferred.reject();
                });

                return deferred.promise;
            },

            authenticate: function(token) {
                var deferred = $q.defer();
                $http.post(ENV.SERVER_URL + '/api/auth/login_with_token', {
                    token: token,
                }).success(function(data, status) {
                    if (status === 200 && data.message == "OK") {
                        isAuthenticated = true;
                        user = data.user;
                        Storage.set('user', data.user);
                        Storage.set('access_token', data.remember_token);
                        if (window.cordova && window.cordova.plugins) {
                            plugins.jPushPlugin.setAlias(data.user.id);
                        }
                        deferred.resolve();
                    } else {
                        isAuthenticated = false;
                        deferred.reject();
                    }
                }).error(function(data) {
                    isAuthenticated = false;
                    deferred.reject();
                });

                return deferred.promise;
            },

            oauth: function(sitename, params) {
                var deferred = $q.defer();

                $http.get(ENV.SERVER_URL + '/api/auth/oauth/' + sitename, {
                    params: params
                }).success(function(data, status) {
                    if (data.message == "OK" && data.login === true) {
                        isAuthenticated = true;
                        user = data.user;
                        Storage.set('user', data.user);
                        Storage.set('access_token', data.remember_token);
                        if (window.cordova && window.cordova.plugins) {
                            plugins.jPushPlugin.setAlias(data.user.id);
                        }
                        deferred.resolve(data);
                    } else if (data.message == "OK" && data.login === false) {
                        isAuthenticated = false;
                        deferred.resolve(data);
                    }
                }).error(function(data) {
                    isAuthenticated = false;
                    deferred.reject();
                });
                return deferred.promise;
            },

            register: function(form) {
                var deferred = $q.defer();

                $http.post(ENV.SERVER_URL + '/mall/vip/app/save', {
                    email: form.email,
                    pwd: form.password,
                    name: form.name,
                    phone: form.phone
                }).success(function(data, status) {
                    if (status === 200 && data.ret) {
                        isAuthenticated = true;
                        $http.get(ENV.SERVER_URL + '/mall/vip/get').success(function(data) {
                            user = data.user;
                            Storage.set('user', data.user);
                            Storage.set('access_token', data.remember_token);
                            if (window.cordova && window.cordova.plugins) {
                                plugins.jPushPlugin.setAlias(data.user.id);
                            }
                            deferred.resolve();
                        });
                    } else {
                        isAuthenticated = false;
                        deferred.reject(data.errmsg);
                    }
                }).error(function(data) {
                    deferred.reject();
                });

                return deferred.promise;
            },
            getUser: function() {
                return user;
            },

        };
    }])
    .factory('User', ['ENV', '$http', '$state', '$q', function(ENV, $http, $state, $q) {

        var users = [];
        var hasNextPage = true;
        var isEmpty = false;
        var nextPage = 0;
        var perPage = 20;

        return {
            getFollowers: getFollowers,
            getFollowings: getFollowings,
            getPostLikeUsers: getPostLikeUsers,

            follow: follow,
            unfollow: unfollow,
            hasNextPage: function() {
                return hasNextPage;
            },
            isEmpty: function() {
                return isEmpty;
            },
        }

        function unfollow(user_id) {
            var deferred = $q.defer();
            $http.get(ENV.SERVER_URL + '/api/users/unfollow/' + user_id).success(function(data) {
                deferred.resolve();
            }).error(function(data) {
                deferred.reject();
            });
            return deferred.promise;
        }

        function follow(user_id) {
            var deferred = $q.defer();
            $http.get(ENV.SERVER_URL + '/api/users/follow/' + user_id).success(function(data) {
                deferred.resolve();
            }).error(function(data) {
                deferred.reject();
            });
            return deferred.promise;
        }

        function getFollowers(userId, page) {
            var deferred = $q.defer();
            hasNextPage = true;
            isEmpty = false;

            $http.get(ENV.SERVER_URL + '/api/users/followers', {
                params: {
                    page: page,
                    per_page: perPage,
                    user_id: userId,
                }
            }).success(function(r, status) {
                if (status === 200 && r.message == "OK") {
                    if (r.users.length < perPage) {
                        hasNextPage = false;
                    }
                    if (page == 0 && r.users.length === 0) {
                        isEmpty = true;
                    }
                    deferred.resolve(r);
                } else {
                    deferred.reject();
                }
            }).error(function(data) {
                deferred.reject();
            });
            return deferred.promise;
        }

        function getFollowings(userId, page) {
            var deferred = $q.defer();
            hasNextPage = true;
            isEmpty = false;

            $http.get(ENV.SERVER_URL + '/api/users/followings', {
                params: {
                    page: page,
                    per_page: perPage,
                    user_id: userId,
                }
            }).success(function(r, status) {
                if (status === 200 && r.message == "OK") {
                    if (r.users.length < perPage) {
                        hasNextPage = false;
                    }
                    if (page == 0 && r.users.length === 0) {
                        isEmpty = true;
                    }
                    deferred.resolve(r);
                } else {
                    deferred.reject();
                }
            }).error(function(data) {
                deferred.reject();
            });
            return deferred.promise;
        }

        function getPostLikeUsers(postId, page) {
            var deferred = $q.defer();
            hasNextPage = true;
            isEmpty = false;

            $http.get(ENV.SERVER_URL + '/api/post/' + postId + '/likes', {
                params: {
                    page: page,
                    per_page: perPage,
                }
            }).success(function(r, status) {
                if (status === 200 && r.message == "OK") {
                    if (r.users.length < perPage) {
                        hasNextPage = false;
                    }
                    if (page == 0 && r.users.length === 0) {
                        isEmpty = true;
                    }
                    deferred.resolve(r);
                } else {
                    deferred.reject();
                }
            }).error(function(data) {
                deferred.reject();
            });
            return deferred.promise;
        }

    }])

    .factory('Items', ['ENV', '$http', '$log', '$q', '$rootScope', 'Storage', function(ENV, $http, $log, $q, $rootScope, Storage) {
        // 用来存储话题类别的数据结构，包含了下一页、是否有下一页等属性
        var items = [];
        var currentTab = '';
        var hasNextPage = true;
        var nextPage = 0;
        var perPage = 2;
        var isEmpty = false;

        return {
            fetchTopItems: function() {
                var deferred = $q.defer();
                hasNextPage = true;
                isEmpty = false;
                currentTab && $http.get(ENV.SERVER_URL + '/mall/mapro/app/query', {
                    params: {
                        oneType: currentTab,
                        page: 0,
                        per_page: perPage,
                    }
                }).success(function(r, status) {
                    if (status === 200 && r.ret) {
                        if (r.data.data.length < perPage) {
                            hasNextPage = false;
                        }
                        nextPage = 1;
                        deferred.resolve(r.data.data);
                        if (r.data.data.length === 0) {
                            isEmpty = true;
                        }
                    } else {
                        deferred.reject();
                    }
                }).error(function(data) {
                    deferred.reject();
                });
                return deferred.promise;
            },

            searchItems: function(query, sub_category, page) {
                var deferred = $q.defer();
                hasNextPage = true;
                isEmpty = false;
                $http.get(ENV.SERVER_URL + '/mall/mapro/app/query', {
                    params: {
                        sub_category: sub_category,
                        page: page,
                        per_page: perPage,
                        title: query,
                    }
                }).success(function(r, status) {
                    if (status === 200 && r.ret) {
                        if (r.data.data.length < perPage) {
                            hasNextPage = false;
                        }
                        nextPage = 1;
                        deferred.resolve(r.data.data);
                        if (r.data.data.length === 0) {
                            isEmpty = true;
                        }
                    } else {
                        deferred.reject();
                    }
                }).error(function(data) {
                    deferred.reject();
                });
                return deferred.promise;

            },

            getItems: function() {
                return items;
            },

            setCurrentTab: function(tab) {
                currentTab = tab;
            },

            getCurrentTab: function() {
                return currentTab;
            },

            increaseNewItems: function() {
                var deferred = $q.defer();
                $http.get(ENV.SERVER_URL + '/mall/mapro/app/query', {
                    params: {
                        oneType: currentTab,
                        page: nextPage,
                        per_page: perPage,
                    }
                }).success(function(r, status) {
                    if (status === 200 && r.ret) {
                        if (r.data.data.length < perPage) {
                            hasNextPage = false;
                        }
                        nextPage += 1;
                        deferred.resolve(r.data.data);
                        if (r.data.data.length === 0) {
                            isEmpty = true;
                        }
                    } else {
                        deferred.reject();
                    }
                }).error(function(data) {
                    deferred.reject();
                });
                return deferred.promise;
            },

            hasNextPage: function() {
                return hasNextPage;
            },
            isEmpty: function() {
                return isEmpty;
            },

        };


    }])
    .factory('FetchData', ['$rootScope', '$http', '$q', 'ENV', '$ionicLoading', function($rootScope, $http, $q, ENV, $ionicLoading) {
        return {
            get: function(url, kargs) {
                var server_url = ENV.SERVER_URL + url;
                var d = $q.defer();
                /*
                $ionicLoading.show({
                  template: '<ion-spinner icon="spiral"></ion-spinner>',
                });
                */

                $http({
                    method: "GET",
                    url: server_url,
                    params: kargs,

                }).success(function(res, status) {
                    if (status === 200 && res.ret) {
                        //$ionicLoading.hide();
                        d.resolve(res);
                    } else {
                        if (status == 404 || status == 302 || !res.ret) {
                            $ionicLoading.show({
                                template: '请先登录',
                                duration: 1000,
                            });
                        } else {
                            $ionicLoading.show({
                                template: res.error || '出错了',
                                duration: 1000,
                            });
                        }
                        d.reject();
                    }
                }).error(function(data, status) {
                    //$ionicLoading.hide();
                    $ionicLoading.show({
                        template: "网络出错, " + status,
                        duration: 1000,
                    });
                    d.reject();
                });
                return d.promise;
            },
            post: function(url, kargs) {
                var server_url = ENV.SERVER_URL + url;
                var d = $q.defer();
                /*
                $ionicLoading.show({
                  template: '<ion-spinner icon="spiral"></ion-spinner>',
                });
                */

                $http({
                    method: "POST",
                    url: server_url,
                    data: kargs

                }).success(function(res, status) {
                    if (status === 200 && res.ret) {
                        //$ionicLoading.hide();
                        d.resolve(res);
                    } else {
                        if (status == 404 || status == 302) {
                            $ionicLoading.show({
                                template: '请先登录',
                                duration: 1000,
                            });
                        } else {
                            $ionicLoading.show({
                                template: res.error || '出错了',
                                duration: 1000,
                            });
                        }
                        d.reject();
                    }
                }).error(function(data, status) {
                    //$ionicLoading.hide();
                    $ionicLoading.show({
                        template: "网络出错, " + status,
                        duration: 1000,
                    });
                    d.reject();
                });
                return d.promise;
            }
        };
    }])
    .service('expressList', function() {

        var itemList = [];

        this.get = function() {
            return itemList;
        };
        this.add = function(data) {
            itemList.push(data);
        };
        this.empty = function() {
            itemList = [];
        }

    })
    .service('ngCart', ['$rootScope', '$http', 'ngCartItem', 'Storage', 'ENV', function($rootScope, $http, ngCartItem, Storage, ENV) {

        this.attrMap = {
            'size': "尺寸",
            'color': "颜色",
            'style': "样式"
        };

        this.init = function() {
            this.$cart = {
                shipping: null,
                taxRate: null,
                tax: null,
                items: [],
                selectedItems: [],
            };
            this.$addr = {
                id: undefined,
                data: {},
            };
            this.$express = {
                name: '普通快递',
                id:'0'
            }
        };

        this.setAddress = function(addr) {
            this.$addr.id = addr.id;
            this.$addr.data = addr;
        };

        this.getAddress = function() {
            var _self = this;

            if (this.$addr.id === undefined) {
                $http.get(ENV.SERVER_URL + '/mall/receipt/get').success(function(data) {
                    if (data.ret) {
                        _self.setAddress(data.data);
                    }
                });
            }
            return this.$addr;

        };
        this.setExpress = function(express) {
            this.$express = express;
            this.$cart.shipping = +express.codeDesc;
        };

        this.getExpress = function() {
            return this.$express;
        };

        this.addItem = function(id, name, price, quantity, data) {

            var _self = this;

            var item = this.getItemById(id);

            $http.post(ENV.SERVER_URL + '/mall/mashopping/save?maProId=' + id + '&num=' + quantity).success(function(res) {
                _self.$loadCart(res.data);
            }).error(function() {
                if (item) {
                    item._quantity += +quantity;
                } else {
                    _self.$cart.items.push(new ngCartItem(id, name, price, quantity, data));
                }
            }).finally(function() {
                $rootScope.$broadcast('specsModal:hide');
                $rootScope.$broadcast('ngCart:change', "商品已添加到购物车");
            });
        };

        this.selectItem = function(id) {
            // 查找cart已有的item,并加进selectedItems
            var inCart = this.getItemById(id);
            if (typeof inCart === 'object') {
                this.$cart.selectedItems.push(inCart);
            } else {
                console.log('irregular item');
            }
            this.$save();
        };
        this.buyRightNow = function(id, name, price, quantity, data) {
            // 商品详情页直接购买时使用，不影响到购物车其他商品
            // 清空购物车已选择物品，将当前商品作为唯一选择的商品
            this.$cart.selectedItems = [new ngCartItem(id, name, price, quantity, data)];
            this.$save();
        };
        this.getItemById = function(itemId) {
            var items = this.getCart().items;
            var build = false;

            angular.forEach(items, function(item) {
                if (item.getId() === itemId) {
                    build = item;
                }
            });
            return build;
        };

        this.getSelectedItemById = function(itemId) {
            var items = this.getCart().selectedItems;
            var build = false;

            angular.forEach(items, function(item) {
                if (item.getId() === itemId) {
                    build = item;
                }
            });
            return build;
        };

        this.setShipping = function(shipping) {
            this.$cart.shipping = shipping;
            return this.getShipping();
        };

        this.getShipping = function() {
            if (this.getCart().items.length === 0) return 0;
            return this.getCart().shipping;
        };

        this.setTaxRate = function(taxRate) {
            this.$cart.taxRate = +parseFloat(taxRate).toFixed(2);
            return this.getTaxRate();
        };

        this.getTaxRate = function() {
            return this.$cart.taxRate;
        };

        this.getTax = function() {
            return +parseFloat(((this.getSubTotal() / 100) * this.getCart().taxRate)).toFixed(2);
        };

        this.setCart = function(cart) {
            this.$cart = cart;
            return this.getCart();
        };

        this.getCart = function() {
            return this.$cart;
        };

        this.getItems = function() {
            return this.getCart().items;
        };

        this.getSelectedItems = function() {
            return this.getCart().selectedItems;
        };

        this.getTotalItems = function() {
            var count = 0;
            var items = this.getItems();
            angular.forEach(items, function(item) {
                count += item.getQuantity();
            });
            return count;
        };

        this.getTotalSelectedItems = function() {
            var count = 0;
            var items = this.getSelectedItems();
            angular.forEach(items, function(item) {
                count += item.getQuantity();
            });
            return count;
        };

        this.getTotalUniqueItems = function() {
            return this.getCart().items.length;
        };

        this.getSubTotal = function() {
            var total = 0;
            angular.forEach(this.getCart().selectedItems, function(item) {
                total += item.getTotal();
            });
            return +parseFloat(total).toFixed(2);
        };

        this.totalCost = function() {
            return +parseFloat(this.getSubTotal() + this.getShipping()).toFixed(2);
        };

        this.removeItemById = function(id) {
            var _self = this;
            var cart = this.getCart();
            angular.forEach(cart.items, function(item, index) {
                if (item.getId() === id) {
                    cart.items.splice(index, 1);
                }
            });
            $http.post(ENV.SERVER_URL + '/mall/mashopping/delete?id='+ id).success(function(data) {
                _self.$loadCart(res.cart);
            }).error(function() {

            }).finally(function() {
                this.$save();
                $rootScope.$broadcast('ngCart:change', "商品已从购物车清除");
            });
        };

        this.removeSelectedItemById = function(id) {
            var cart = this.getCart();
            angular.forEach(cart.selectedItems, function(item, index) {
                if (item.getId() === id) {
                    cart.selectedItems.splice(index, 1);
                }
            });
            this.$save();
        };

        this.emptySelectedItems = function() {
            this.$cart.selectedItems = [];
            this.$save();
        };
        this.empty = function() {

            $rootScope.$broadcast('ngCart:change', "已成功清空购物车");
            this.$cart.items = [];
            localStorage.removeItem('cart');
        };

        this.isEmpty = function() {

            return (this.$cart.items.length > 0 ? false : true);

        };

        this.selectedItemsObjects = function() {

            if (this.getSelectedItems().length === 0) return false;

            var selectedItems = [];
            angular.forEach(this.getSelectedItems(), function(item, index) {
                selectedItems.push({
                    'item_id': item._data.item.item_id,
                    'sku': item._id,
                    'quantity': item._quantity
                });
            });

            return selectedItems;

        };

        this.toObject = function() {

            if (this.getSelectedItems().length === 0) return false;

            var items = [];
            angular.forEach(this.getSelectedItems(), function(item) {
                items.push(item.toObject());
            });

            return {
                shipping: this.getShipping(),
                tax: this.getTax(),
                taxRate: this.getTaxRate(),
                subTotal: this.getSubTotal(),
                totalCost: this.totalCost(),
                items: items
            };
        };


        this.$restore = function(storedCart) {
            var _self = this;
            _self.init();
            angular.forEach(storedCart.items, function(item) {
                if (item.id) {
                    _self.$cart.items.push(new ngCartItem(item._id, item._name, item._price, item._quantity, item));
                }
            });
            this.$save();
        };

        this.$loadCart = function(cart) {
            var _self = this;
            _self.init();
            angular.forEach(cart, function(item) {
                _self.$cart.items.push(new ngCartItem(item.id, item.name, item.price, item.num, item));
            });
            this.$save();
        };

        this.$save = function() {
            return Storage.set('cart', this.getCart());
        };

    }])
    .service('ngCartItem', ['$rootScope', '$log', function($rootScope, $log) {

        var item = function(id, name, price, quantity, data) {
            this.setId(id);
            this.setName(name);
            this.setPrice(price);
            this.setQuantity(quantity);
            this.setData(data);
        };


        item.prototype.setId = function(id) {
            if (id) this._id = id;
            else {
                $log.error('An ID must be provided');
            }
        };

        item.prototype.getId = function() {
            return this._id;
        };


        item.prototype.setName = function(name) {
            if (name) this._name = name;
            else {
                $log.error('A name must be provided');
            }
        };
        item.prototype.getName = function() {
            return this._name;
        };

        item.prototype.setPrice = function(price) {
            var priceFloat = parseFloat(price);
            if (priceFloat) {
                if (priceFloat <= 0) {
                    $log.error('A price must be over 0');
                } else {
                    this._price = (priceFloat);
                }
            } else {
                $log.error('A price must be provided');
            }
        };
        item.prototype.getPrice = function() {
            return this._price;
        };


        item.prototype.setQuantity = function(quantity, relative) {

            var quantityInt = parseInt(quantity);
            if (quantityInt % 1 === 0) {
                if (relative === true) {
                    this._quantity += quantityInt;
                } else {
                    this._quantity = quantityInt;
                }
                if (this._quantity < 1) this._quantity = 1;
                // if (this._quantity >= 5) this._quantity = 5;

            } else {
                this._quantity = 1;
                $log.info('Quantity must be an integer and was defaulted to 1');
            }
            //$rootScope.$broadcast('ngCart:change', {});

        };

        item.prototype.getQuantity = function() {
            return this._quantity;
        };

        item.prototype.setData = function(data) {
            if (data) this._data = data;
        };

        item.prototype.getData = function() {
            if (this._data) return this._data;
            else $log.info('This item has no data');
        };


        item.prototype.getTotal = function() {
            return +parseFloat(this.getQuantity() * this.getPrice()).toFixed(2);
        };

        item.prototype.toObject = function() {
            return {
                id: this.getId(),
                name: this.getName(),
                price: this.getPrice(),
                quantity: this.getQuantity(),
                data: this.getData(),
                total: this.getTotal()
            };
        };
        return item;
    }])
    .service('fulfilmentProvider', ['ngCart', '$rootScope', '$ionicLoading', '$state', 'utils', '$http', 'ENV', function(ngCart, $rootScope, $ionicLoading,$state, utils, $http, ENV) {


        this.checkout = function(data,cb) {
          $http({
            method:'post',
            url:ENV.SERVER_URL + '/mall/maorder/save',
            data: JSON.stringify(data),
            headers : {
                'Content-Type': 'application/json;charset=utf-8;'
            },
            transformRequest: function(data){
              return data
            }
          }).then(function(res) {
            if (res.data.ret) {
              $ionicLoading.show({
                  template: '订单生成成功',
                  duration: 3000,
              });
              alipayCheckout(res.data.data);
            } else {
              $ionicLoading.show({
                  template: res.data.errmsg,
                  duration: 3000,
              });
            }
            $state.go('tab.orders');
          },function(err) {
            console.log(err);
            $ionicLoading.show({
                template: '订单生成失败，请咨询供应商',
                duration: 3000,
            });
          }).finally(function () {
            alipayCheckout();
          });
        };
        function alipayCheckout(){
          cordova.plugins.alipay.payment(payInfo,function success(e){},function error(e){});
          console.log(1)
           //e.resultStatus  状态代码  e.result  本次操作返回的结果数据 e.memo 提示信息
           //e.resultStatus  9000  订单支付成功 ;8000 正在处理中  调用function success
           //e.resultStatus  4000  订单支付失败 ;6001  用户中途取消 ;6002 网络连接出错  调用function error
           //当e.resultStatus为9000时，请去服务端验证支付结果
                      /**
                       * 同步返回的结果必须放置到服务端进行验证（验证的规则请看https://doc.open.alipay.com/doc2/
                       * detail.htm?spm=0.0.0.0.xdvAU6&treeId=59&articleId=103665&
                       * docType=1) 建议商户依赖异步通知
                       */
          }

    }])

    .service('fulfilmentNewOrder', ['$rootScope', '$http', 'ngCart', 'ENV', '$injector', function($rootScope, $http, ngCart, ENV, $injector) {

        this.checkout = function(service, settings) {

            $rootScope.$broadcast('alertStart', "正在处理，请稍等..");
            return $http.post(ENV.SERVER_URL + '/api/orders/create_order', {
                'entries': ngCart.selectedItemsObjects(),
                'address_id': ngCart.getAddress().id,
                'coupon_codes': settings.coupon ? [settings.coupon] : [],
                'logistic_provider': settings.logistic_provider,
            }).then(function(res) {
                var provider = $injector.get('fulfilment_' + service);
                provider.checkout(res.data);

            }, function() {
                $rootScope.$broadcast('alertEnd');
                $rootScope.$broadcast('alert', "sorry...something wrong(1)..");
            });
        };
    }])

    .service('fulfilmentExistedOrder', ['$rootScope', '$http', 'ngCart', 'ENV', '$injector', function($rootScope, $http, ngCart, ENV, $injector) {

        this.checkout = function(service, settings) {
            $rootScope.$broadcast('alertStart', "正在处理，请稍等..");

            var provider = $injector.get('fulfilment_' + service);
            return provider.checkout(settings);
        };
    }])

    .service('fulfilmentTransferOrder', ['$rootScope', '$http', 'ngCart', 'ENV', '$injector', function($rootScope, $http, ngCart, ENV, $injector) {

        this.checkout = function(service, settings) {

            $rootScope.$broadcast('alertStart', "正在处理，请稍等..");
            return $http.post(ENV.SERVER_URL + '/api/orders/update_transfer_order', {
                'order_id': settings.order_id,
                'address_id': ngCart.getAddress().id,
                'coupon_codes': settings.coupon ? [settings.coupon] : [],
                'logistic_provider': settings.logistic_provider,
            }).then(function(res) {
                var provider = $injector.get('fulfilment_' + service);
                provider.checkout(res.data);

            }, function() {
                $rootScope.$broadcast('alertEnd');
                $rootScope.$broadcast('alert', "sorry...something wrong(1)..");
            });
        };
    }])

    .service('fulfilment_paypal', ['$rootScope', '$http', 'PaypalService', 'ENV', '$state', '$timeout', function($rootScope, $http, PaypalService, ENV, $state, $timeout) {

        this.checkout = function(data) {
            $rootScope.$broadcast('alertEnd');
            var subject = "Maybi Order " + data.order.sid;
            PaypalService.initPaymentUI().then(function() {
                PaypalService.makePayment(data.order.final, subject)
                    .then(function(payment) {
                        $http.post(ENV.SERVER_URL + '/payment/paypal/notify', {
                            payment: payment,
                            order_id: data.order_id,
                        }).success(function(res) {
                            if (res.message == "OK") {
                                $rootScope.$broadcast('alert', "支付成功");
                                $timeout(function() {
                                    $state.go('tab.order_detail', {
                                        order_id: data.order_id
                                    }, {
                                        reload: true
                                    })
                                }, 1000);
                            } else {
                                $rootScope.$broadcast('alert', "支付失败");
                            }
                        }).error(function(error) {
                            $rootScope.$broadcast('alert', "系统好像出问题。。");
                        });

                    }).catch(function(error) {
                        $rootScope.$broadcast('alert', error);
                    })
            });


        };
    }])

    .service('fulfilment_wechat', ['$rootScope', '$http', 'ENV', '$state', '$timeout', function($rootScope, $http, ENV, $state, $timeout) {

        this.checkout = function(data) {

            $http.post(ENV.SERVER_URL + '/payment/checkout/sdk/' + data.order_id, {
                'payment_method': 'wechat',
            }).then(function(r) {
                $rootScope.$broadcast('alertEnd');
                var res = r.data.data;
                var params = {
                    mch_id: res.partnerid, // merchant id
                    prepay_id: res.prepayid, // prepay id
                    nonce: res.noncestr, // nonce
                    timestamp: res.timestamp, // timestamp
                    sign: res.sign, // signed string
                };

                Wechat.sendPaymentRequest(params, function() {
                    $rootScope.$broadcast('alert', "支付成功");
                    $timeout(function() {
                        $state.go('tab.order_detail', {
                            order_id: data.order_id
                        }, {
                            reload: true
                        })
                    }, 1000);
                }, function(reason) {
                    $rootScope.$broadcast('alert', "Failed: " + reason);
                });

            }, function() {
                $rootScope.$broadcast('alertEnd');
                $rootScope.$broadcast('alert', "oppps...something wrong(2)..");
            });

        };
    }])

    .factory('AlipayService', ['$q', '$ionicPlatform', 'paypalSettings', '$filter', '$timeout', function($q, $ionicPlatform, paypalSettings, $filter, $timeout) {

        var init_defer;
        /**
         * Service object
         * @type object
         */
        var service = {
            initPaymentUI: initPaymentUI,
            createPayment: createPayment,
            configuration: configuration,
            onPayPalMobileInit: onPayPalMobileInit,
            makePayment: makePayment
        };


        /**
         * @ngdoc method
         * @name initPaymentUI
         * @methodOf app.PaypalService
         * @description
         * Inits the payapl ui with certain envs.
         *
         *
         * @returns {object} Promise paypal ui init done
         */
        function initPaymentUI() {

            init_defer = $q.defer();
            $ionicPlatform.ready().then(function() {

                var clientIDs = {
                    "PayPalEnvironmentProduction": paypalSettings.PAYPAL_LIVE_CLIENT_ID,
                    "PayPalEnvironmentSandbox": paypalSettings.PAYPAL_SANDBOX_CLIENT_ID
                };
                PayPalMobile.init(clientIDs, onPayPalMobileInit);
            });

            return init_defer.promise;

        }


        /**
         * @ngdoc method
         * @name createPayment
         * @methodOf app.PaypalService
         * @param {string|number} total total sum. Pattern 12.23
         * @param {string} name name of the item in paypal
         * @description
         * Creates a paypal payment object
         *
         *
         * @returns {object} PayPalPaymentObject
         */
        function createPayment(total, name) {

            // "Sale  == >  immediate payment
            // "Auth" for payment authorization only, to be captured separately at a later time.
            // "Order" for taking an order, with authorization and capture to be done separately at a later time.
            var payment = new PayPalPayment("" + total, "USD", "" + name, "Sale");
            return payment;
        }

        /**
         * @ngdoc method
         * @name configuration
         * @methodOf app.PaypalService
         * @description
         * Helper to create a paypal configuration object
         *
         *
         * @returns {object} PayPal configuration
         */
        function configuration() {
            // for more options see `paypal-mobile-js-helper.js`
            var config = new PayPalConfiguration({
                merchantName: paypalSettings.ShopName,
                merchantPrivacyPolicyURL: paypalSettings.MerchantPrivacyPolicyURL,
                merchantUserAgreementURL: paypalSettings.MerchantUserAgreementURL
            });
            return config;
        }

        function onPayPalMobileInit() {
            $ionicPlatform.ready().then(function() {
                // must be called
                // use PayPalEnvironmentNoNetwork mode to get look and feel of the flow
                PayPalMobile.prepareToRender(paypalSettings.ENV, configuration(), function() {

                    $timeout(function() {
                        init_defer.resolve();
                    });

                });
            });
        }

        /**
         * @ngdoc method
         * @name makePayment
         * @methodOf app.PaypalService
         * @param {string|number} total total sum. Pattern 12.23
         * @param {string} name name of the item in paypal
         * @description
         * Performs a paypal single payment
         *
         *
         * @returns {object} Promise gets resolved on successful payment, rejected on error
         */
        function makePayment(total, name) {

            var defer = $q.defer();
            total = $filter('number')(total, 2);
            $ionicPlatform.ready().then(function() {
                PayPalMobile.renderSinglePaymentUI(createPayment(total, name), function(result) {
                    $timeout(function() {
                        defer.resolve(result);
                    });
                }, function(error) {
                    $timeout(function() {
                        defer.reject(error);
                    });
                });
            });

            return defer.promise;
        }

        return service;
    }])

    .factory("appUpdateService", ['$ionicPopup', '$timeout', '$ionicLoading', function($ionicPopup, $timeout, $ionicLoading) {
        var version;
        var deploy = new Ionic.Deploy();

        /**
         * 检查更新
         */
        function checkUpdate() {
            $ionicLoading.show({
                template: '正在检查更新...',
                animation: 'fade-in',
                showBackdrop: true,
                duration: 3000,
                showDelay: 0
            });

            deploy.check().then(function(hasUpdate) {

                if (hasUpdate) {
                    showUpdateConfirm();
                } else {
                    console.log('already nb');
                }
            }, function(err) {
                console.log(err);

            });
        }

        function showUpdateConfirm() {
            $ionicLoading.hide();
            var confirmPopup = $ionicPopup.confirm({
                title: '版本升级',
                cssClass: 'text-center',
                template: "有新的版本了,是否要升级?",
                cancelText: '取消',
                okText: '升级'
            });
            confirmPopup.then(function(res) {
                $ionicLoading.show({
                    template: '正在更新...',
                    animation: 'fade-in',
                    showBackdrop: true,
                    //duration: 2000,
                    showDelay: 0
                });

                if (res) {
                    deploy.update().then(function(res) {
                        $ionicLoading.hide();
                        $ionicLoading.show({
                            template: '更新成功!',
                            animation: 'fade-in',
                            showBackdrop: true,
                            duration: 2000,
                            showDelay: 0
                        });
                    }, function(err) {
                        $ionicLoading.hide();
                        $ionicLoading.show({
                            template: '更新失败!' + err,
                            animation: 'fade-in',
                            showBackdrop: true,
                            duration: 2000,
                            showDelay: 0
                        });
                    }, function(prog) {
                        $ionicLoading.show({
                            template: "已经下载：" + parseInt(prog) + "%"
                        });
                    });
                } else {
                    $ionicLoading.hide();
                }
            });
        };

        function getAppVersion() {

            deploy.info().then(function(data) {
                var binaryVersion = data.binary_version;
                var deployUuid = data.deploy_uuid;
                version = deployUuid != 'NO_DEPLOY_LABEL' ? deployUuid : binaryVersion;
            });
        }



        return {
            getVersions: function() {
                getAppVersion();
                return version;
            },
            checkUpdate: function() {
                checkUpdate();
            },

            update: function() {
                showUpdateConfirm();
            }
        }
    }])

    .factory('Notification', ['ENV', '$http', '$log', '$q', '$rootScope', 'Storage', function(ENV, $http, $log, $q, $rootScope, Storage) {
        // 用来存储话题类别的数据结构，包含了下一页、是否有下一页等属性
        var notices = [];
        var hasNextPage = true;
        var perPage = 20;
        var page = 0;
        var isEmpty = false;

        return {
            getNotices: function(page) {
                var deferred = $q.defer();
                hasNextPage = true;
                isEmpty = false;

                $http.get(ENV.SERVER_URL + '/api/post/activities', {
                    params: {
                        page: page,
                        per_page: perPage,
                    }
                }).success(function(r, status) {
                    if (status === 200 && r.message == "OK") {
                        if (r.notices.length < perPage) {
                            hasNextPage = false;
                        }
                        if (page == 0 && r.notices.length === 0) {
                            isEmpty = true;
                        }
                        deferred.resolve(r);
                    } else {
                        deferred.reject();
                    }
                }).error(function(data) {
                    deferred.reject();
                });
                return deferred.promise;
            },

            hasNextPage: function() {
                return hasNextPage;
            },

            isEmpty: function() {
                return isEmpty;
            },

        };
    }])

    .factory('Board', ['ENV', '$http', '$log', '$q', '$rootScope', 'Storage', function(ENV, $http, $log, $q, $rootScope, Storage) {
        // 用来存储话题类别的数据结构，包含了下一页、是否有下一页等属性
        var notices = [];
        var hasNextPage = true;
        var perPage = 5;
        var page = 0;
        var isEmpty = false;

        return {
            getBoards: function(page) {
                var deferred = $q.defer();
                hasNextPage = true;
                isEmpty = false;

                $http.get(ENV.SERVER_URL + '/api/boards', {
                    params: {
                        page: page,
                        per_page: perPage,
                    }
                }).success(function(r, status) {
                    if (status === 200 && r.message == "OK") {
                        if (r.boards.length < perPage) {
                            hasNextPage = false;
                        }
                        if (page == 0 && r.boards.length === 0) {
                            isEmpty = true;
                        }
                        deferred.resolve(r);
                    } else {
                        deferred.reject();
                    }
                }).error(function(data) {
                    deferred.reject();
                });
                return deferred.promise;
            },

            hasNextPage: function() {
                return hasNextPage;
            },

            isEmpty: function() {
                return isEmpty;
            },

        };
    }])

    .factory('JPush', ['ENV', '$http', '$log', '$q', '$rootScope', 'appUpdateService', function(ENV, $http, $log, $q, $rootScope, appUpdateService) {
        return {
            onOpenNotification: onOpenNotification,
            onReceiveNotification: onReceiveNotification,
            onReceiveMessage: onReceiveMessage
        }

        // push notification callback
        function onOpenNotification(event) {
            try {
                var alertContent;
                if (ionic.Platform.platform() == "Android") {
                    alertContent = window.plugins.jPushPlugin.openNotification.alert;
                } else {
                    alertContent = event.aps.alert;
                }
                console.log("open Notificaiton:" + alertContent);
            } catch (exception) {
                console.log("JPushPlugin:onOpenNotification" + exception);
            }
        }

        function onReceiveNotification(event) {
            try {
                var alertContent;
                if (ionic.Platform.platform() == "Android") {
                    alertContent = window.plugins.jPushPlugin.receiveNotification.alert;
                } else {
                    alertContent = event.aps.alert;
                }
                console.log("receive Notificaiton:" + alertContent);
            } catch (exeption) {
                console.log(exception)
            }
        }

        function onReceiveMessage(event) {
            try {
                var message;
                if (ionic.Platform.platform() == "Android") {
                    message = window.plugins.jPushPlugin.receiveMessage.message;
                } else {
                    message = event.content;
                }
                console.log("receive message:" + message);
                if (message == 'update') {
                    appUpdateService.checkUpdate();
                }
            } catch (exception) {
                console.log("JPushPlugin:onReceiveMessage-->" + exception);
            }
        }

    }])

"use strict";

angular.module('maybi.directives', [])

.directive('ngcartAddtocart', ['ngCart', function(ngCart){
    return {
        restrict : 'E',
        scope: {
            id:'@',
            name:'@',
            quantity:'@',
            quantityMax:'@',
            price:'@',
            data:'='
        },
        transclude: true,
        templateUrl: function(element, attrs) {
            if ( typeof attrs.templateUrl == 'undefined' ) {
                return 'ngCart/addtocart.html';
            } else {
                return attrs.templateUrl;
            }
        },
        link: function(scope, element, attrs){
            scope.ngCart = ngCart;
            scope.attrs = attrs;
            scope.inCart = function(){
                return  ngCart.getItemById(attrs.id);
            };

            if (scope.inCart()){
                scope.q = ngCart.getItemById(attrs.id).getQuantity();
            } else {
                scope.q = parseInt(scope.quantity);
            }

            scope.qtyOpt =  [];
            for (var i = 1; i <= scope.quantityMax; i++) {
                scope.qtyOpt.push(i);
            }

            scope.alertWarning = function() {
                scope.$emit('alert', '请选择有效商品');
            };
        }
    };
}])

.directive('ngcartBuyrightnow', ['ngCart', '$state', '$rootScope', function(ngCart, $state, $rootScope){
    return {
        restrict : 'E',
        scope: {
            id:'@',
            name:'@',
            quantity:'@',
            quantityMax:'@',
            price:'@',
            data:'='
        },
        transclude: true,
        templateUrl: function(element, attrs) {
            if ( typeof attrs.templateUrl == 'undefined' ) {
                return 'ngCart/buyrightnow.html';
            } else {
                return attrs.templateUrl;
            }
        },
        link: function(scope, element, attrs){
            scope.ngCart = ngCart;
            scope.attrs = attrs;
            scope.buyRightNow = function (id, name, price, quantity, data) {
              ngCart.buyRightNow(id, name, price, quantity, data);
              $rootScope.$broadcast('specsBuyModal:hide');
              $state.go('checkout');
            };
        }
    };
}])

.directive('ngcartSummary', ['ngCart', function(ngCart){
    return {
        restrict : 'E',
        link: function(scope, element, attrs){
            scope.ngCart = ngCart;
        },
        scope: {},
        transclude: true,
        templateUrl: function(element, attrs) {
            if ( typeof attrs.templateUrl == 'undefined' ) {
                return 'ngCart/summary.html';
            } else {
                return attrs.templateUrl;
            }
        }
    };
}])

.directive('ngcartCheckout', ['ngCart', 'fulfilmentProvider', '$timeout', '$ionicActionSheet', '$state', function(ngCart, fulfilmentProvider, $timeout, $ionicActionSheet, $state){
    return {
        restrict : 'E',
        link: function(scope, element, attrs){
            scope.ngCart = ngCart;


            scope.showPaymentMethods = function() {

              var sheet = {};
              sheet.buttonClicked = buttonClicked;
              sheet.buttons = [{
                text: '<i class="icon fa fa-paypal"></i> 支付宝支付$'
              }];
              sheet.cancelOnStateChange = true;

              $ionicActionSheet.show(sheet);

              function buttonClicked(index) {
                var service = { 0: 'alipay', 1: 'wechat'}
                var data = scope.ngCart.getAddress().data;
                var detailList = scope.ngCart.getSelectedItems().map(function (item) {
                  return {
                    maProId:item._id,
                    maProImg:item._data.mainUrl,
                    maProName:item._name,
                    num:item._quantity,
                    dealPrice:item._price
                  }
                });
                var order = {
                  detailList:detailList,
                  trackingType:scope.ngCart.getExpress().codeKey,
                  trackingAmount:+scope.ngCart.getExpress().codeDesc,
                  status:'0',
                  receiptId:data.id,
                  receiptName:data.name,
                  receiptPhone:data.phone,
                  receiptPostcode:data.postcode,
                  receiptDetail:data.detail
                }
                fulfilmentProvider.checkout(order, function(){
                  $ionicActionSheet.hide();
                })
              }
            };
        },
        scope: {
            settings:'=',
            show: '=',
        },
        replace: true,
        templateUrl: function(element, attrs) {
            if ( typeof attrs.templateUrl == 'undefined' ) {
                return 'ngCart/checkout.html';
            } else {
                return attrs.templateUrl;
            }
        }
    };
}])
.directive("zoomView", ['$compile', '$ionicModal', '$ionicPlatform', '$cordovaSocialSharing', function ($compile, $ionicModal, $ionicPlatform, $cordovaSocialSharing) {
    return {

      restrict: "A",

      link: function(scope, elem, attr) {

        $ionicPlatform.ready(function () {

          elem.attr("ng-click", "showZoomView()");
          elem.removeAttr("zoom-view");
          $compile(elem)(scope);

          var zoomViewTemplate = '<ion-modal-view class="zoom-view"><ion-header-bar>'+
              '<button ng-click="closeZoomView()" class="button button-clear button-light button-icon ion-ios-close-empty"></button></ion-header-bar>'+
              '<ion-content ng-click="closeZoomView()"><ion-scroll zooming="true" direction="xy" style="width: 100%; height: 100%; position: absolute; top: 0; bottom: 0; left: 0; right: 0; ">'+
              '<img ng-src="{{ngSrc}}" style="width: 100%!important; display:block; width: 100%; height: auto; max-width: 400px; max-height: 700px; margin: auto; padding: 10px; " />'+
              '</ion-scroll> </ion-content>'+
              '<ion-footer-bar><h1 class="title"></h1><button class="button button-light button-icon ion-ios-download-outline" ng-click="downloadFile()"></button></ion-footer-bar>'
              '</ion-modal-view>';

          scope.zoomViewModal = $ionicModal.fromTemplate(zoomViewTemplate, {
            scope: scope,
            animation: "slide-in-right"
          });

          scope.showZoomView = function () {
            scope.zoomViewModal.show();
            scope.ngSrc = attr.zoomSrc;
          };

          scope.closeZoomView = function () {
            scope.zoomViewModal.hide();
          };

          scope.downloadFile = function() {
            var message = "分享图片",
                subject = '分享',
                file = scope.ngSrc,
                link = "http://www.may.bi";

            $cordovaSocialSharing
              .share(message, subject, file, link) // Share via native share sheet
              .then(function(result) {
                console.log('result:' + result);
                // Success!
              }, function(err) {
                console.log('err:' + err);
                scope.broadcast('alert', err);
                // An error occured. Show a message to the user
              });
          }
        });
      }
    };
}])
.directive('showMore', ['$timeout', function($timeout){
    return {
        templateUrl: 'showMore.html',
        restrict: 'A',
        replace: true,
        scope: {
            'title': '=',
        },
        link: function(scope, element, attrs){

                var showMoreHeight = parseInt(attrs.showMore);

                scope.expanded = false;
                scope.expandable = false;

                $timeout(function(){
                    renderStyles();
                }, 300);
                scope.toggle = function(){
                    scope.expanded = !scope.expanded;

                };

                function renderStyles(){
                    var elementHeight = element.find('p')[0].offsetHeight;
                    if(elementHeight > showMoreHeight && scope.expanded === false){
                        scope.expandable = true;
                    }
                }

                scope.showLessStyle = {
                    'max-height': showMoreHeight + 'px',
                    'overflow': 'hidden',
                    'margin-bottom': '6px',
                };


        }
    };
}])

.directive('addressForm', ['$rootScope', '$ionicModal', 'FetchData', 'ngCart', '$state', 'utils', function($rootScope, $ionicModal, FetchData, ngCart, $state, utils){
    return {
        restrict : 'A',
        scope: {
            'addrId': '=',
            'addresses': '=',
        },
        link: function(scope, element, attrs){
            scope.ngCart = ngCart;
            scope.addr = {};

            var addr_id = scope.addrId;
            if (addr_id && scope.addresses) {
              scope.addresses.forEach(function(item){
                if (item.id === addr_id) {
                  scope.addr= item;
                }
              })
            }
            $ionicModal.fromTemplateUrl('add_address.html', {
                scope: scope,
                animation: 'slide-in-right'
            }).then(function (modal) {
                scope.addressModal = modal;
            });
            scope.closeModal = function(){
                scope.addressModal.hide();

            };

            element.bind('click', function(){
                scope.addressModal.show();
            })

            // FetchData.get('/api/address/hierarchy').then(function(data){
            //     scope.COUNTRIES= data.countries;
            // });
            // scope.$watch('addr["country"]', function(new_val) {
            //     FetchData.get('/api/address/hierarchy/'+scope.addr.country).then(function(data) {
            //         scope.REGIONS= data.regions;
            //     });
            // });

            scope.ngCart = ngCart;
            scope.saveAddress = function(){
                if (addr_id) {
                    FetchData.post('/mall/receipt/update'+utils.formatGetParams({
                      'id':addr_id,
                      'name': scope.addr.name,
                      'detail': scope.addr.detail,
                      'postcode': scope.addr.postcode,
                      'phone': scope.addr.phone,
                    })).then(function(data) {
                        scope.addressModal.hide();
                        $state.transitionTo($state.current, $state.$current.params, { reload: true, inherit: true, notify: true });
                    });
                } else {
                    FetchData.post('/mall/receipt/save'+utils.formatGetParams({
                      'flag': 0,
                      'name': scope.addr.name,
                      'detail': scope.addr.detail,
                      'postcode': scope.addr.postcode,
                      'phone': scope.addr.phone,
                    })).then(function(data) {
                        scope.addressModal.hide();
                        $state.transitionTo($state.current, $state.$current.params, { reload: true, inherit: true, notify: true });
                    });

                }
            }

        },
    };
}])

.directive('followBtn', ['User', 'AuthService', function(User, AuthService){
    return {
        restrict : 'E',
        scope: {
            user:'=',
        },
        transclude: true,
        templateUrl: 'user/followButton.html',
        link: function(scope, element, attrs){
            scope.currentUserID = AuthService.getUser().id;

            scope.follow = function(){
                var user = AuthService.getUser();

                if (scope.user.is_following){
                    scope.user.is_following= false;
                    scope.user.num_followers -= 1;

                    User.unfollow(scope.user.id)
                        .then(function(data){
                            scope.$emit('alert', "已取消关注");
                        }).catch(function(error){
                            scope.user.is_following= true;
                            scope.user.num_followers += 1;
                        });
                } else {
                    scope.user.is_following = true;
                    scope.user.num_followers += 1;

                    User.follow(scope.user.id)
                        .then(function(data){
                            scope.$emit('alert', "关注成功");
                        }).catch(function(error){
                            scope.user.is_following = false;
                            scope.user.num_followers -= 1;

                        });
                }
            };
        }
    };
}])

.directive('headerShrink', ['$document', function($document) {
    return {
        restrict: 'A',
        link: function($scope, $element, $attr) {
            var resizeFactor, blurFactor;
            var scrollContent = $element[0];
            var header = document.body.querySelector('.avatar-section');
            // $scope.$on('userDetailContent.scroll', function(event,scrollView) {
            //     var y = scrollView.__scrollTop;
            //     if (y >= 0) {
            //       header.style[ionic.CSS.TRANSFORM] = 'translate3d(0, -' + Math.min(148, y) + 'px, 0)';
            //       scrollContent.style.top = Math.max(64, 150 - y) + 'px';
            //     }
            // });
        }
    }
}])

.directive('itemCarousel', ['$state', function($state) {
    return {
        restrict: 'E',
        scope: {
            board: '='
        },
        templateUrl: 'itemCarousel.html',
        link: function (scope, elem, attrs) {
            scope.items = scope.board.items;

            scope.goItem = function(item_id) {
                $state.go('tab.item', {itemID: item_id});
            };

            scope.goBoard= function(item_id) {
                $state.go('tab.board', {'boardID': scope.board.id})
            };


        }
    };
}])

"use strict";

angular.module('maybi.constants', [])

.constant("$ionicLoadingConfig", {
    "template": "请求中..."
})
.constant("Categories", {
    '':"全部",
    'food':"食品",
    'home':"家居",
    'clothes':"服饰",
    'accessories': "配饰",
    'electronics': "数码",
    'office and school supplies': "办公文具",
    'sports': "休闲健身",
})
.constant("ENV", {
    "DEBUG": false,
    //"FIREBASE_URL": "http://sizzling-inferno-6138.firebaseIO.com/",
    //"SERVER_URL": "http://127.0.0.1:8890",
    "SERVER_URL": "http://39.106.199.108:8080",
})
.constant("paypalSettings", {
    "PAYPAL_LIVE_CLIENT_ID": "",
    "PAYPAL_SANDBOX_CLIENT_ID": "",
    "ENV": "PayPalEnvironmentProduction",// PayPalEnvironmentProduction, PayPalEnvironmentSandbox
    "ShopName": "Maybi Shop",
    "MerchantPrivacyPolicyURL": "",
    "MerchantUserAgreementURL": "",

})

"use strict";

angular.module('maybi.filters', [])

.filter('reverse', function() {
    return function(items) {
        if (!angular.isArray(items)) return false;
        return items.slice().reverse();
    };
})

.filter('nl2br', ['$sce', function($sce){
    return function(msg,is_xhtml) {
        var is_xhtml = is_xhtml || true;
        var breakTag = (is_xhtml) ? '<br />' : '<br>';
        var msg = (msg + '').replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, '$1'+ breakTag +'$2');
        return $sce.trustAsHtml(msg);
    }
}])

angular.module("templates", []).run(["$templateCache", function($templateCache) {$templateCache.put("about.html","<ion-view>\n  <div class=\"bar bar-header\">\n      <button class=\"button button-clear icon ion-ios-arrow-back\" ng-click=\"$ionicGoBack()\"></button>\n      <div class=\"title\">关于我们</div>\n  </div>\n  <ion-content class=\"has-header account\">\n    <ion-list>\n        <div class=\"about\">\n          <div class=\"logo\"></div>\n        </div>\n\n      <ion-item class=\"item item-icon-left\">\n          <i class=\"icon ion-ios-flag\"></i>\n          版本号\n          <span class=\"item-note\">\n              {{appUpdateService.getVersions()}}\n          </span>\n      </ion-item>\n      <ion-item class=\"item item-icon-left item-icon-right\" ng-click=\"$state.go(\'intro\')\">\n          <i class=\"icon ion-ios-information-empty\"></i>\n          介绍页\n          <i class=\"icon ion-ios-arrow-right\"></i>\n      </ion-item>\n      <ion-item class=\"item item-icon-left item-icon-right\"\n          onclick=\"window.open(\'http://may.bi/#/faq\', \'_blank\', \'location=no,toolbarposition=top,closebuttoncaption=关闭\')\">\n          <i class=\"icon ion-ios-help-outline\"></i>\n          常见问题\n          <i class=\"icon ion-ios-arrow-right\"></i>\n      </ion-item>\n      <ion-item class=\"item item-icon-left item-icon-right\"\n          onclick=\"window.open(\'http://may.bi/#/customer-service\', \'_blank\', \'location=no,toolbarposition=top,closebuttoncaption=关闭\')\">\n          <i class=\"icon ion-ios-chatboxes\"></i>\n          联系客服\n          <i class=\"icon ion-ios-arrow-right\"></i>\n      </ion-item>\n      <ion-item class=\"item item-icon-left item-icon-right\"\n          ng-click=\"$state.go(\'tab.feedback\')\">\n          <i class=\"icon ion-ios-compose-outline\"></i>\n          意见反馈\n          <i class=\"icon ion-ios-arrow-right\"></i>\n      </ion-item>\n      <ion-item class=\"item item-icon-left item-icon-right\"\n          onclick=\"window.open(\'itms-apps://itunes.apple.com/app/id1080870817\', \'_system\')\" ng-if=\"platform.isIOS()\">\n          <i class=\"icon ion-bag\"></i>\n          评分鼓励\n          <i class=\"icon ion-ios-arrow-right\"></i>\n      </ion-item>\n      <div class=\"copyright\">\n        <p>Copyright @ 2015</p>\n        <p>深圳市美比科技有限公司</p>\n\n      </div>\n    </ion-list>\n  </ion-content>\n</ion-view>\n");
$templateCache.put("account.html","<ion-view>\n    <div class=\"avatar-section\">\n        <div ng-if=\"user.getUser().name\" class=\"avatar-content\">\n            <div class=\"avatar-wrap\" ng-click=\"$state.go(\'tab.profile\')\">\n              <p><img class=\"avatar\" ng-src=\"{{user.getUser().image}}\" alt=\"\"></p>\n              <p ng-if=\"user.getUser().name\" class=\"user dark\">{{user.getUser().name}}</p>\n            </div>\n        </div>\n        <div ng-click=\"showAuthBox()\" ng-if=\"!user.getUser().name\" class=\"avatar-content\">\n          <div class=\"avatar-wrap\">\n            <p><img class=\"avatar\" ng-src=\"{{user.getUser().image}}\" alt=\"\"></p>\n            <p ng-if=\"!user.getUser().name\" class=\"login-btn\">登录</p>\n          </div>\n       </div>\n\n    </div>\n\n  <ion-content class=\"account-view\" style=\"top:150px\" overflow-scroll=\'false\' delegate-handle=\"userDetailContent\" on-scroll=\"onUserDetailContentScroll()\" header-shrink scroll-event-interval=\"5\">\n    <ion-list>\n      <div class=\"list\">\n\n        <a class=\"item item-icon-left item-icon-right\" href=\"#/favors\">\n          <i class=\"icon ion-ios-star-outline\"></i>\n          收藏\n          <i class=\"icon ion-ios-arrow-right\"></i>\n        </a>\n\n        <a class=\"item item-icon-left item-icon-right\" href=\"#/cart\">\n          <i class=\"icon icon ion-ios-cart-outline\"></i>\n          购物车\n          <i class=\"icon ion-ios-arrow-right\"></i>\n        </a>\n\n        <a class=\"item item-icon-left item-icon-right\" href=\"#/orders\">\n          <i class=\"icon ion-ios-list-outline\"></i>\n          我的订单\n          <i class=\"icon ion-ios-arrow-right\"></i>\n        </a>\n\n        <a class=\"item item-icon-left item-icon-right\" href=\"#/address/list\">\n          <i class=\"icon ion-pin\"> </i>\n          地址管理\n          <i class=\"icon ion-ios-arrow-right\"></i>\n        </a>\n\n        <a class=\"item item-icon-left item-icon-right\" href=\"#/setting\">\n          <i class=\"icon ion-ios-gear-outline\"></i>\n          设置\n          <i class=\"icon ion-ios-arrow-right\"></i>\n        </a>\n      </div>\n    </ion-list>\n    <div style=\"margin-top:50px;text-align:center\">\n      <button class=\"button button-assertive\"\n        style=\"padding:0 50px;\"\n        ng-click=\"logout()\"\n       >\n         退出当前账户\n       </button>\n    </div>\n  </ion-content>\n\n</ion-view>\n");
$templateCache.put("add_address.html","<!-- 添加地址 -->\n<ion-modal-view >\n  <div class=\"bar bar-header\">\n      <button class=\"button button-clear icon ion-ios-arrow-back\" ng-click=\"closeModal()\"></button>\n      <div class=\"title\">编辑地址</div>\n      <button class=\"button button-clear button-dark\" ng-click=\"saveAddress()\">\n          保存\n      </button>\n  </div>\n\n  <ion-content class=\"has-header\" style=\"overflow-y:hidden;\">\n\n<section>\n<form name=\"addressForm\" class=\"addressForm\">\n\n    <div class=\"list\">\n        <label class=\"item item-input\">\n            <div class=\"input-label\" ng-class=\"{\'warning\': addressForm.name.$error.required && !addressForm.name.$pristine}\">\n                收货人\n            </div>\n            <input type=\"text\" ng-model=\"addr.name\" name=\"name\" required />\n        </label>\n        <label class=\"item item-input\">\n            <div class=\"input-label\" ng-class=\"{\'warning\': addressForm.phone.$error.required && !addressForm.phone.$pristine}\">\n                联系方式\n            </div>\n            <input type=\"text\" ng-model=\"addr.phone\" name=\"phone\" required />\n        </label>\n        <label class=\"item item-input\">\n            <div class=\"input-label\" ng-class=\"{\'warning\': addressForm.detail.$error.required && !addressForm.detail.$pristine}\">\n                详细地址\n            </div>\n            <input type=\"text\" ng-model=\"addr.detail\" name=\"detail\" required />\n        </label>\n        <!-- <label class=\"item item-input item-select\">\n            <div class=\"input-label\" ng-class=\"addressForm.country.$error.required && !addressForm.country.$pristine\">\n                国家\n            </div>\n            <select ng-model=\"addr.country\" name=\"country\" required>\n                <option ng-selected=\"addr.country== k\" value=\"{{k}}\" ng-repeat=\"k in COUNTRIES\">{{k}}</option>\n            </select>\n        </label>\n        <label class=\"item item-input\">\n            <div class=\"input-label\" ng-class=\"{\'warning\': addressForm.detail.$error.required && !addressForm.detail.$pristine}\">\n                地址 1\n            </div>\n            <input type=\"text\" ng-model=\"addr.detail\" name=\"detail\" required />\n        </label>\n        <label class=\"item item-input\">\n            <div class=\"input-label\">\n                地址 2\n            </div>\n            <input type=\"text\" ng-model=\"addr.street2\" name=\"street2\" required />\n        </label>\n        <label class=\"item item-input\">\n            <div class=\"input-label\" ng-class=\"{\'warning\': addressForm.city.$error.required && !addressForm.city.$pristine}\">\n                城市\n            </div>\n            <input type=\"text\" ng-model=\"addr.city\" name=\"city\" required />\n        </label> -->\n        <!-- <label class=\"item item-input item-select\">\n            <div class=\"input-label\" ng-class=\"addressForm.state.$error.required && !addressForm.state.$pristine\">\n                州/省\n            </div>\n            <select ng-model=\"addr.state\" name=\"state\" required>\n                <option ng-selected=\"addr.state == k\" value=\"{{k}}\" ng-repeat=\"(k, v) in REGIONS\">{{v}}</option>\n            </select> -->\n        <!-- </label> -->\n        <label class=\"item item-input\">\n            <div class=\"input-label\" ng-class=\"{\'warning\': addressForm.postcode.$error.required && !addressForm.postcode.$pristine}\">\n                邮编\n            </div>\n            <input type=\"text\" ng-model=\"addr.postcode\" name=\"postcode\" required />\n        </label>\n    </div>\n</form>\n</section>\n\n  </ion-content>\n\n</ion-modal-view>\n");
$templateCache.put("address.html","<!-- 地址栏 -->\n<ion-view>\n  <div class=\"bar bar-header\">\n      <button class=\"button button-clear icon ion-ios-arrow-back\" ng-click=\"$ionicGoBack()\"></button>\n      <div class=\"title\">选择地址</div>\n      <button class=\"button button-clear button-dark icon\"\n          ng-class=\"editShown?\'ion-ios-color-wand-outline\': \'ion-ios-trash-outline\'\"\n          ng-click=\"toggleEditShown()\"></button>\n  </div>\n\n  <ion-content class=\"has-header\">\n<section>\n<div class=\"address-select-info\" ng-show=\"addresses.length != 0\">\n    <div class=\"address-row\"\n      ng-repeat=\"addr in addresses track by $index\"\n      ng-click=\"selectAddress(addr)\"\n      ng-class=\"addr.flag? \'address-selected\' : \'\'\">\n      <div class=\"address-info-1\">\n        <div class=\"row\">\n          <div class=\"col\">{{addr.name}}</div>\n          <div class=\"col\">{{addr.phone}}</div>\n        </div>\n        <div class=\"row\">\n          <div class=\"col\">{{addr.detail}}</div>\n        </div>\n      </div>\n      <div class=\"address-operate row\">\n        <div class=\"col col-60\">\n          <i class=\"icon ion-ios-circle-outline\" ng-if=\"!addr.flag\"></i>\n          <i class=\"icon ion-ios-checkmark-outline\" ng-if=\"addr.flag\"></i>\n          <span ng-if=\"addr.flag\">已选择</span>\n          <span ng-if=\"!addr.flag\">选择该地址</span>\n        </div>\n        <div class=\"col\">\n          <a href address-form addr-id=\"addr.id\" addresses=\"addresses\">修改地址</a>\n        </div>\n      </div>\n    </div>\n</div>\n</section>\n\n<section>\n<div class=\"address-select-info\" address-form addresses=\"addresses\">\n    <div class=\"address-row\">\n        <div style=\"padding:10px\">\n            <div class=\"\">新增收件地址</div>\n        </div>\n        <div class=\"go-add\">+</div>\n    </div>\n\n</div>\n</section>\n\n  </ion-content>\n\n    <ion-footer-bar class=\"bar-assertive footer-button\" ng-click=\"confirmAddress()\" >\n        <div class=\"title\" style=\"text-align:center\">确定</div>\n    </ion-footer-bar>\n</ion-view>\n");
$templateCache.put("address_list.html","<!-- 地址栏 -->\n<ion-view>\n  <div class=\"bar bar-header\">\n      <button class=\"button button-clear icon ion-ios-arrow-back\" ng-click=\"$ionicGoBack()\"></button>\n      <div class=\"title\">地址管理</div>\n      <button class=\"button button-clear button-dark icon\"\n          ng-class=\"editShown?\'ion-ios-color-wand-outline\': \'ion-ios-trash-outline\'\"\n          ng-click=\"toggleEditShown()\"></button>\n  </div>\n\n  <ion-content class=\"has-header\">\n\n    <section>\n    <div class=\"address-select-info\" ng-show=\"addresses.length != 0\">\n        <div class=\"address-row\"\n          ng-repeat=\"addr in addresses track by $index\"\n          ng-class=\"addr.flag? \'address-selected\' : \'\'\">\n            <div class=\"address-info-1\">\n              <div class=\"row\">\n                <div class=\"col\">{{addr.name}}</div>\n                <div class=\"col\">{{addr.phone}}</div>\n              </div>\n              <div class=\"row\">\n                <div class=\"col\">{{addr.detail}}</div>\n              </div>\n            </div>\n            <div class=\"address-operate row\">\n              <div class=\"col col-60\" ng-click=\"setDefault(addr.id)\">\n                <i class=\"icon ion-ios-circle-outline\" ng-if=\"!addr.flag\"></i>\n                <span ng-if=\"!addr.flag\">设为默认</span>\n                <i class=\"icon ion-ios-checkmark-outline\" ng-if=\"addr.flag\"></i>\n                <span ng-if=\"addr.flag\">默认地址</span>\n              </div>\n              <div class=\"col\">\n                <a href address-form addr-id=\"addr.id\" addresses=\"addresses\">修改地址</a>\n              </div>\n              <div class=\"col\">\n                <span ng-click=\"removeAddr(addr.id)\">删除</span>\n              </div>\n          </div>\n        </div>\n    </div>\n    </section>\n\n\n  </ion-content>\n  <ion-footer-bar class=\"bar-energized bar bar-footer\">\n    <div class=\"address-add-btn\" address-form  addresses=\"addresses\">\n      <div>新增收件地址</div>\n    </div>\n  </ion-footer-bar>\n</ion-view>\n");
$templateCache.put("appIndex.html","<ion-view class=\"appIndex\">\n  <div class=\"bar bar-header\">\n      <!-- <button class=\"button button-clear icon ion-ios-arrow-back\" ng-click=\"$ionicGoBack()\"></button> -->\n      <div class=\"title\">4.0</div>\n  </div>\n  <ion-content class=\"has-header content\">\n    <ion-slide-box\n      class=\"indexSlide\"\n      on-slide-changed=\"slideHasChanged($index)\"\n      auto-play=\"true\"\n      does-continue=\"true\"\n      slide-interval=2000\n      show-pager=\"true\"\n      pager-click=\"pageClick(index)\"\n      active-slide=\"model.activeIndex\"\n      delegate-handle=\"delegateHandler\"\n      ng-click=\"coverFlowClick()\">\n      <ion-slide>\n        <div class=\"box\">\n          <img src=\"http://www.guandongphoto.com/data/attachment/forum/201804/27/023630bpyfwaljwpwpenny.jpg\">\n        </div>\n      </ion-slide>\n      <ion-slide>\n        <div class=\"box\">\n          <img src=\"http://www.guandongphoto.com/data/attachment/forum/201804/27/023703sik4pwquiwqzzdwr.jpg\">\n        </div>\n      </ion-slide>\n      <ion-slide>\n        <div class=\"box\">\n          <img src=\"http://www.guandongphoto.com/data/attachment/forum/201804/27/023745mz4y3n6q36vkq3yh.jpg\">\n        </div>\n      </ion-slide>\n    </ion-slide-box>\n    <div class=\"chooseTypes\">\n      <div class=\"chooseType\" ng-click=\"goto(item)\" ng-repeat=\"item in types track by $index\">\n        <i class=\"icon placeholder-icon ion-{{item.icon}}\"></i>\n        <span>{{item.name}}</span>\n      </div>\n    </div>\n  </ion-content>\n</ion-view>\n");
$templateCache.put("auth.html","<ion-modal-view>\n  <ion-header-bar>\n    <button class=\"button button-clear icon ion-ios-close-empty\" ng-click=\"closeAuthBox()\"></button>\n    <div class=\"title\">登录</div>\n  </ion-header-bar>\n  <ion-content class=\"login-page overlay-content\" ng-controller=\"authCtrl\" >\n    <div class=\"loginTab\">\n      <div ng-class=\"{\'isSelected\': !commonLogin}\" class=\"loginTabName\" ng-click=\"checkLogin(0)\">\n        统一密码登录\n      </div>\n      <div ng-class=\"{\'isSelected\': commonLogin}\" class=\"loginTabName\" ng-click=\"checkLogin(1)\">\n        动态密码登录\n      </div>\n    </div>\n    <div class=\"list list-inset\" ng-show=\"!commonLogin\">\n      <label class=\"item item-input\">\n        <i class=\"icon ion-person placeholder-icon\"></i>\n        <input type=\"text\" placeholder=\"请输入用户名\" ng-model=\"email\">\n      </label>\n\n      <label class=\"item item-input\">\n        <i class=\"icon ion-android-lock placeholder-icon\"></i>\n        <input type=\"password\" placeholder=\"请输入密码\" ng-model=\"password\">\n      </label>\n    </div>\n    <div class=\"list list-inset\" ng-show=\"commonLogin\">\n      <label class=\"item item-input\">\n        <i class=\"icon ion-person placeholder-icon\"></i>\n        <input type=\"text\" placeholder=\"请输入用户名\" ng-model=\"email\">\n      </label>\n\n      <div class=\"item item-input-inset\">\n        <label class=\"item-input-wrapper\" style=\"font-size:16px;background-color:white\">\n          <i class=\"icon ion-android-lock placeholder-icon\"></i>\n          <input type=\"text\" placeholder=\"请输入验证码\" ng-model=\"password\">\n        </label>\n        <button class=\"button\" ng-click=\"getValidateCode()\" ng-disabled=\"sendStatus\">\n          {{validateTime}}\n        </button>\n      </div>\n    </div>\n\n    <button class=\"button button-block login-btn\" ng-click=\"login()\">\n        登录\n    </button>\n\n    <div class=\"list login-btn-group\">\n        <button class=\"button button-clear button-dark pull-right\" ng-click=\"showForgotPWBox()\">\n            忘记密码?\n        </button>\n        <button class=\"button button-clear button-dark pull-left\" ng-click=\"showSignupBox()\">\n            邮箱注册\n        </button>\n    </div>\n\n  </ion-content>\n</ion-modal-view>\n");
$templateCache.put("bindEmail.html","<ion-modal-view>\n  <ion-header-bar>\n    <div class=\"buttons\">\n      <button class=\"button button-clear icon ion-ios-arrow-back button-dark\" ng-click=\"closeBindEmailBox()\"></button>\n    </div>\n    <div class=\"title\">绑定邮箱</div>\n  </ion-header-bar>\n  <ion-content class=\"login-page overlay-content\" scroll=\"false\" ng-controller=\"bindEmailCtrl\">\n    <div class=\"list list-inset\">\n      <label class=\"item item-input\">\n        <input type=\"email\" placeholder=\"邮箱地址\" ng-model=\"bindEmailForm.email\">\n      </label>\n    </div>\n\n    <button class=\"button button-block login-btn\" ng-click=\"bind()\">绑定</button>\n\n  </ion-content>\n</ion-modal-view>\n");
$templateCache.put("board.html","<ion-view>\n    <div class=\"bar bar-header\">\n      <button class=\"button button-clear icon ion-ios-arrow-back\" ng-click=\"$ionicGoBack()\"></button>\n      <div class=\"title\">{{::board.title}}</div>\n    </div>\n\n    <ion-content class=\"has-header homepage\">\n        <div class=\"item item-banner-image\">\n            <img ng-src=\"{{::board.image}}\">\n        </div>\n\n        <ion-item class=\"item board-desc\" style=\"border-left: 3px solid #ea004f;\">\n            {{::board.desc}}\n        </ion-item>\n\n        <div class=\"col col-50 \"\n             style=\"display: inline-block\"\n             ng-repeat=\"item in board.items track by $index\" ng-click=\"goItem(item.item_id)\">\n            <div class=\"item item-image\">\n                <img ng-src=\"{{::item.thumbnail}}\" cache-src>\n            </div>\n            <div class=\"item item-text-wrap\" href=\"#\">\n                <h2 class=\"product-title\" style=\"overflow: hidden;\">{{::item.title}}</h2>\n                <p class=\"product-prices\">\n                    <span class=\"curr-price\">{{::item.price | currency}}</span>\n                    <del class=\"orig-price\">{{::item.orig_price | currency}}</del>\n                </p>\n            </div>\n        </div>\n\n\n\n\n    </ion-content>\n</ion-view>\n");
$templateCache.put("calFee.html","<!-- 运费估算 -->\n<ion-view>\n  <div class=\"bar bar-header\">\n      <button class=\"button button-clear icon ion-ios-arrow-back\" ng-click=\"$ionicGoBack()\"></button>\n      <div class=\"title\">运费估算</div>\n  </div>\n\n  <ion-content class=\"has-header\">\n\n<section>\n<form name=\"queryForm\" ng-submit=\"queryFee()\">\n    <div class=\"list\">\n        <label class=\"item item-input item-select\">\n           <div class=\"input-label\" ng-class=\"{\'warning\': queryForm.country.$error.required && !queryForm.country.$pristine}\">\n                国家\n            </div>\n            <select placeholder=\"请选择寄往国家\" ng-model=\"query.country\" name=\"country\"\n                ng-options=\"country for country in COUNTRIES\" required>\n            </select>\n        </label>\n        <label class=\"item item-input\">\n            <div class=\"input-label\" ng-class=\"{\'warning\': queryForm.weight.$error.required && !queryForm.weight.$pristine}\">\n               重量\n            </div>\n            <input style=\"margin-right: 12px\" class=\"text-right\" placeholder=\"请输入商品重量\" type=\"number\" ng-model=\"query.weight\" name=\"weight\" required /><span class=\"cal-unit\">克</span>\n       </label>\n    </div>\n    <div class=\"padding\">\n        <button class=\"button button-block button-assertive button-cart\">费用估算</button>\n    </div>\n</form>\n</section>\n\n<section>\n<div class=\"address-select-info\">\n    <div class=\"address-row\" ng-repeat=\"provider in provider_prices track by $index\">\n        <div class=\"address-info provider\">\n            <div class=\"info-header\">{{provider.name}}\n                ({{provider.service_intro.duration}})</div>\n            <div class=\"desc\">首重{{provider.init_weight}}g/${{provider.init_price}}，\n                续重{{provider.continued_weight}}g/${{provider.continued_price}}</div>\n            <div class=\"desc\">{{provider.rule_desc}}</div>\n        </div>\n        <div>\n            <span class=\"provider-price\">\n                {{provider.cn_shipping | currency }}\n            </span>\n        </div>\n    </div>\n</div>\n</section>\n\n  </ion-content>\n</ion-view>\n");
$templateCache.put("cart.html","<!-- 购物车 -->\n\n<ion-view>\n  <div class=\"bar bar-header\">\n      <button class=\"button button-clear button-dark icon ion-ios-arrow-back\"  ng-click=\"$ionicGoBack()\"></button>\n      <div class=\"title\">购物车</div>\n      <button class=\"button button-clear button-dark icon\" ng-class=\"editShown?\'ion-ios-color-wand-outline\': \'ion-ios-trash-outline\'\"  ng-click=\"toggleEditShown()\"></button>\n\n  </div>\n  <ion-content class=\"has-header has-footer has-subfooter\">\n\n    <div class=\"center-ico\"  ng-show=\"ngCart.getTotalItems() === 0\">\n        <i class=\"icon ion-ios-cart-outline\"></i>\n        <h1 >购物车为空\n        </h1>\n    </div>\n\n    <div ng-show=\"ngCart.getTotalItems() > 0\">\n\n        <table class=\"table ngCart cart-table\">\n            <thead>\n            <tr>\n                <td class=\"check-cell\" ng-click=\"selectAllEntries()\">\n                    <i class=\"icon select-icon\"\n                        ng-class=\" isSelectedAll? \'ion-ios-checkmark selected\':\'ion-ios-circle-outline\'\"\n                        ng-hide=\"editShown\">\n                    </i>\n                </td>\n\n                <td></td>\n                <td></td>\n                <td></td>\n            </tr>\n            </thead>\n\n            <tbody>\n            <tr ng-repeat=\"item in ngCart.getCart().items track by $index\">\n                <td class=\"check-cell\">\n                    <span class=\"close-icon\" ng-show=\"editShown\" ng-click=\"ngCart.removeItemById(item.getId())\">\n                    </span>\n                    <i class=\"icon select-icon\"\n                        ng-class=\" ngCart.getSelectedItemById(item.getId())? \'ion-ios-checkmark selected\':\'ion-ios-circle-outline\'\"\n                        ng-hide=\"editShown\"\n                        ng-click=\"selectEntry(item.getId())\">\n                    </i>\n\n                </td>\n\n                <td class=\"img-cell\">\n                    <div>\n                        <a ng-href=\"#/item/{{item.getId()}}\">\n                            <img ng-src=\"{{item.getData().mainUrl}}\">\n                        </a>\n                    </div>\n                </td>\n                <td class=\"info-cell\">\n                    <div>{{ item.getName() }}</div>\n                    <div>\n                        <span ng-repeat=\"(k, v) in item.getData().spec.attributes\">\n                            {{ngCart.attrMap[k]}}: {{v}}\n                        </span>\n                    </div>\n                    <div class=\"btn-group\">\n                        <button class=\"btn del-num\"\n                            ng-class=\"{\'disabled\':item.getQuantity()==1}\"\n                            ng-click=\"setQuantity(item, -1, true)\">-</button>\n                        <button class=\"btn num\">{{ item.getQuantity() | number }}</button>\n                        <button class=\"btn add-num\"\n                            ng-click=\"setQuantity(item, 1, true)\">+</button>\n                    </div>\n                </td>\n                <td class=\"price-cell\">{{ item.getTotal() | currency:\'￥\' }}</td>\n            </tr>\n            </tbody>\n            <tfoot>\n            <tr>\n                <td class=\"check-cell\">\n                </td>\n                <td></td>\n                <td colspan=\"2\" class=\"total\">商品总价: {{ ngCart.totalCost() | currency:\'￥\' }}</td>\n            </tr>\n            </tfoot>\n\n        </table>\n    </div>\n\n  </ion-content>\n    <div class=\"bar bar-subfooter bar-stable\" style=\"bottom:0\">\n        <a class=\"button button-clear\">\n            总价:  <span class=\"footer-price\"> {{ ngCart.totalCost() |currency:\'￥\'}}</span>\n        </a>\n        <button class=\"button button-assertive button-cart pull-right\" ng-click=\"$state.go(\'checkout\')\">\n            结算({{ngCart.getTotalSelectedItems()}})\n\n        </button>\n    </div>\n\n</ion-view>\n");
$templateCache.put("cateHome.html","<ion-view>\n    <form>\n        <div class=\"bar bar-header item-input-inset\">\n            <a href=\"#/appIndex\" class=\"button button-icon icon ion-ios-arrow-back\"></a>\n            <label class=\"item-input-wrapper\">\n        <i class=\"icon ion-ios-search placeholder-icon\" style=\"font-size:18px;\"></i>\n        <input type=\"search\" placeholder=\"搜索商品，种类\" ng-model=\"searchQuery\">\n        <input type=\"submit\" ng-click=\"searchItem(searchQuery)\" style=\"position: absolute; left: -9999px; width: 1px; height: 1px;\"/>\n      </label>\n            <span class=\"cart-num\">{{ ngCart.getTotalItems() }}</span>\n            <a href=\"#/cart\" class=\"button button-icon icon ion-ios-cart\"></a>\n        </div>\n    </form>\n    <div class=\"bar bar-subheader\">\n        <ion-scroll direction=\"x\" scrollbar-x=\"false\" id=\"category-scroll\" delegate-handle=\"cateScroll\">\n            <div class=\"cate-scroll-row\">\n\n                <a href class=\"main-cate-tab\" ng-repeat=\"v in banners track by $index\" ng-class=\"{\'active\': currentTab==v.codeKey}\" ng-click=\"changeTab(v, $index)\">{{v.codeVal}}</a>\n            </div>\n        </ion-scroll>\n    </div>\n\n    <ion-content class=\"has-header has-subheader homepage\" overflow-scroll=\"true\">\n        <ion-slide-box\n          class=\"cateHomeSlide\"\n          on-slide-changed=\"slideHasChanged2($index)\"\n          auto-play=\"true\"\n          does-continue=\"true\"\n          slide-interval=2000\n          show-pager=\"true\"\n          pager-click=\"pageClick(index)\"\n          active-slide=\"model.activeIndex\"\n          delegate-handle=\"delegateHandler2\">\n            <ion-slide ng-repeat=\"item in tuijian track by $index\">\n                <div class=\"box\" ng-click=\"goItem(item.maProId)\">\n                    <img ng-src=\"{{item.detailUrl}}\">\n                </div>\n            </ion-slide>\n        </ion-slide-box>\n\n        <!-- <ion-slide-box show-pager=\"false\" on-slide-changed=\"slideHasChanged($index)\" active-slide=\"currentIndex\" delegate-handle=\"delegateHandler\">\n        </ion-slide-box> -->\n        <div ng-repeat=\"v in banners\">\n            <div ng-if=\"currentIndex==v.codeKey\" style=\"width:100%\">\n                <!-- <ion-refresher\n                    pulling-text=\"下拉刷新...\"\n                    on-refresh=\"doRefresh()\"\n                    spinner=\"spiral\">\n                </ion-refresher> -->\n\n                <div class=\"col col-50 \" style=\"display: inline-block\" ng-repeat=\"item in items track by $index\" ng-click=\"goItem(item.id)\">\n                    <div class=\"item item-image\">\n                        <img ng-src=\"{{item.mainUrl}}\">\n                    </div>\n                    <div class=\"item item-text-wrap\" href=\"#\">\n                        <h2 class=\"product-title\" style=\"overflow: hidden;\">{{item.name}}</h2>\n                        <p class=\"product-prices\">\n                            <span class=\"curr-price\">{{::item.price | currency:\'￥\'}}</span>\n                        </p>\n                    </div>\n                </div>\n\n                <div class=\"center-ico\" ng-if=\"isEmpty()\">\n                    <i class=\"icon ion-ios-grid-view-outline\"></i>\n\n                    <h1>暂无此类商品</h1>\n                </div>\n\n                <ion-infinite-scroll ng-if=\"moreDataCanBeLoaded()\" on-infinite=\"loadMore()\" distance=\"1\" spinner=\'spiral\'>\n                </ion-infinite-scroll>\n\n            </div>\n            <!-- <div ng-if=\"currentTab!=v.codeKey\">\n                <div style=\"background:#f9f9f9;padding-top:100%;height:0\"></div>\n            </div> -->\n\n\n\n        </div>\n\n\n    </ion-content>\n</ion-view>\n");
$templateCache.put("category.html","<ion-view>\n  <div class=\"bar bar-header\">\n      <button class=\"button button-clear icon ion-ios-arrow-back\" ng-click=\"$ionicGoBack()\"></button>\n      <div class=\"title\">商品类目</div>\n  </div>\n  <ion-content class=\"has-header categories\">\n        <div class=\"cate-row\" ng-repeat=\"cate in categories\">\n            <ion-item class=\"main\">{{cate.cn}}</ion-item>\n            <div class=\"sub-list\">\n                <div class=\"sub\" ng-repeat=\"sub in cate.sub_list\">\n                    <a ng-href=\"#/category/{{sub.en}}/{{sub.cn}}\">{{sub.cn}}</a>\n                </div>\n            </div>\n        </div>\n  </ion-content>\n</ion-view>\n");
$templateCache.put("checkout.html","<!-- 购物车 -->\n<ion-view>\n  <div class=\"bar bar-header\">\n      <button class=\"button button-clear icon ion-ios-arrow-back button-dark\"\n          ng-click=\"clearSelectedCart()\"></button>\n\n      <div class=\"title\">结算</div>\n  </div>\n  <ion-content class=\"has-header has-footer\">\n\n<section>\n<div class=\"checkout-info\" ng-click=\"gotoAddress()\">\n    <div ng-show=\"addr.id\">\n        <div class=\"address-info-1\">\n          <div class=\"row\">\n            <div class=\"col\">收货人：{{addr.data.name}}</div>\n            <div class=\"col\" style=\"text-align:right\">{{addr.data.phone}}</div>\n          </div>\n          <div class=\"row\">\n            <div class=\"col\">收货地址：{{addr.data.detail}}</div>\n          </div>\n        </div>\n        <div class=\"select-arrow address\"></div>\n    </div>\n    <div ng-hide=\"addr.id\">\n        <div class=\"address-info-1\">\n            <div class=\"\">新增收件地址</div>\n        </div>\n        <div class=\"go-add\">+</div>\n    </div>\n</div>\n</section>\n\n<section class=\"clearfix\" ng-cloak>\n<div class=\"\" ng-show=\"ngCart.getTotalSelectedItems() > 0\">\n\n    <table class=\"table ngCart cart-table\">\n        <tbody>\n        <tr ng-repeat=\"item in ngCart.getCart().selectedItems track by $index\">\n            <td class=\"img-cell\">\n                <div>\n                    <a ng-href=\"#/item/{{item.getData().id}}\">\n                        <img ng-src=\"{{item.getData().mainUrl}}\">\n                    </a>\n                </div>\n            </td>\n            <td class=\"info-cell\">\n                <div>{{ item.getName() }}</div>\n            </td>\n            <td class=\"price-cell\">\n              {{ item.getPrice() | currency:\'￥\' }}\n              <div class=\"cart-btn\">\n                  <span style=\"color:#000\">x {{ item.getQuantity() | number }}</span>\n              </div>\n            </td>\n        </tr>\n        </tbody>\n    </table>\n</div>\n</section>\n\n<section>\n<div class=\"checkout-info\">\n    <div class=\"partner-info-1\" ng-click=\"showProviderChoices()\">\n\n        <div class=\"selected-partner\">请选择运输方式 ：</div>\n    </div>\n</div>\n<div class=\"checkout-choices\">\n    <div class=\"select-row row\" ng-repeat=\"provider in provider_prices\"\n        ng-click=\"selectPartner(provider)\">\n        <div class=\"checkout-choice col-80\">\n            {{provider.codeVal}} -（{{provider.codeDesc}}元）\n        </div>\n        <i class=\"icon col ion-ios-circle-outline\"\n         ng-if=\"selectedProvider.codeKey !== provider.codeKey\"></i>\n        <i class=\"icon col ion-ios-checkmark-outline selected\"\n          ng-if=\"selectedProvider.codeKey == provider.codeKey\"></i>\n    </div>\n</div>\n</section>\n\n<!-- <section>\n<div class=\"checkout-info\">\n    <div class=\"item-info-table\">\n        <dl class=\"item-info-field\">\n            <dt class=\"\">实付: </dt>\n            <dd class=\"detail-price\">{{item.getTotal() | currency:\'￥\' }}</dd>\n        </dl>\n        <dl class=\"item-info-field\">\n            <dt class=\"\">运费: </dt>\n            <dd class=\"detail-price\">{{order.cn_shipping | currency }}</dd>\n        </dl>\n        <dl class=\"item-info-field\">\n            <dt class=\"\">税费: </dt>\n            <dd class=\"detail-price\">0</dd>\n        </dl>\n    </div>\n\n</div>\n</section> -->\n  </ion-content>\n\n  <ion-footer-bar align-title=\"left\" class=\"bar-stable\">\n    <a class=\"button button-clear\">\n        总计: <span class=\"footer-price\"> {{ ngCart.totalCost() |currency:\'￥\'}}</span>\n    </a>\n    <h1 class=\"title\"></h1>\n    <ngcart-checkout settings=\"{ coupon: coupon_codes.code,\n                        logistic_provider: selectedProvider.name,\n                        order_type: \'new\'}\">\n                        去付款</ngcart-checkout>\n  </ion-footer-bar>\n</ion-view>\n");
$templateCache.put("coupons.html","<ion-view>\n    <ion-header-bar>\n        <button class=\"button button-clear icon ion-ios-arrow-back\" ng-click=\"$ionicGoBack()\"></button>\n        <div class=\"title\">折扣券</div>\n    </ion-header-bar>\n\n    <ion-content class=\"has-header has-footer\">\n\n        <ion-list>\n            <ion-item class=\"item\" ng-repeat=\"c in user.getUser().consumable_coupons\">\n                {{c.description}}  {{c.number}}张\n                <span class=\"item-note\">\n                    有效期 {{c.expire_date}}\n                </span>\n\n            </ion-item>\n        </ion-list>\n        <div class=\"center-ico\" ng-if=\"notices.==0\">\n            <i class=\"icon ion-ios-camera\"></i>\n\n            <h1 >暂无动态</h1>\n        </div>\n\n    </ion-content>\n</ion-view>\n");
$templateCache.put("explore.html","<ion-view view-title=\"Chats\">\n  <ion-content>\n    <ion-list>\n      <ion-item class=\"item-remove-animate item-avatar item-icon-right\" ng-repeat=\"chat in chats\" type=\"item-text-wrap\" href=\"#/tab/chats/{{chat.id}}\">\n        <img ng-src=\"{{chat.face}}\">\n        <h2>{{chat.name}}</h2>\n        <p>{{chat.lastText}}</p>\n        <i class=\"icon ion-chevron-right icon-accessory\"></i>\n\n        <ion-option-button class=\"button-assertive\" ng-click=\"remove(chat)\">\n          Delete\n        </ion-option-button>\n      </ion-item>\n    </ion-list>\n  </ion-content>\n</ion-view>\n");
$templateCache.put("expressForm.html","<!-- 代寄出国 -->\n<ion-view>\n    <div class=\"bar bar-header\">\n        <button class=\"button button-clear icon ion-ios-arrow-back\" ng-click=\"$state.go(\'tab.home\')\">首页</button>\n        <div class=\"title\">代寄出国</div>\n    </div>\n\n    <ion-content class=\"has-header\">\n        <div class=\"logistic-row\">\n            <ul class=\"progress-indicator\">\n                <li class=\"completed\">\n                    <span class=\"bubble\"></span>\n                    <div class=\"logistic-status\">核验清单</div>\n                </li>\n                <li ng-repeat=\"status in STATUES\">\n                    <span class=\"bubble\"></span>\n                    <div class=\"logistic-status\">{{status}}</div>\n                </li>\n            </ul>\n        </div>\n        <div class=\"checkout-info\" ng-click=\"gotoAddress()\">\n            <div ng-show=\"addr.id\">\n                <span class=\"addr-icon\"></span>\n                <div class=\"address-info\">\n                    <p class=\"addr-header\">寄往收货人信息: </p>\n                    <div class=\"\">{{addr.data.receiver}}</div>\n                    <div class=\"\">{{addr.data.street1}}</div>\n                    <div class=\"\">{{addr.data.street2}}</div>\n                    <div class=\"\">{{addr.data.city}}, {{addr.data.state}}</div>\n                    <div class=\"\">{{addr.data.country}}, {{addr.data.postcode}}</div>\n                </div>\n                <div class=\"select-arrow address\"></div>\n            </div>\n            <div ng-hide=\"addr.id\">\n                <span class=\"addr-icon\"></span>\n                <div class=\"address-info\">\n                    <div class=\"\">填写收件人信息</div>\n                </div>\n                <div class=\"go-add\">+</div>\n            </div>\n        </div>\n        <div class=\"\">\n            <table class=\"table ngCart cart-table express\">\n                <thead>\n                <tr>\n                    <td class=\"title\">\n                        <span>物品名称</span>\n                    </td>\n                    <td class=\"cate\">\n                        <span><a href=\"\" onclick=\"window.open(\'http://may.bi/#/limit\', \'_blank\', \'location=no,toolbarposition=top,closebuttoncaption=关闭\')\">敏感物品</a></span>\n                    </td>\n                    <td class=\"quantity\">\n                        <span>数量</span>\n                    </td>\n                    <td class=\"value\">\n                        <span>申报价值</span>\n                    </td>\n                    <td class=\"note\">\n                        <span>备注</span>\n                    </td>\n                    <td class=\"ico\"></td>\n                </tr>\n                </thead>\n\n                <tbody>\n                <tr ng-repeat=\"entry in entries track by $index\">\n                    <td class=\"title\">\n                        {{ entry.title }}\n                    </td>\n                    <td class=\"cate\">\n                        {{ entry.main_category==\'special\'? \'是\': \'否\' }}\n                    </td>\n                    <td class=\"quantity\">\n                        {{ entry.quantity }}\n                    </td>\n                    <td class=\"value\">\n                        ￥{{ entry.amount }}\n                    </td>\n                    <td class=\"note\">\n                        {{ entry.remark }}\n                    </td>\n                    <td class=\"ico\">\n                        <span class=\"close-icon\" ng-click=\"removeEntry(entry)\">\n                        </span>\n                    </td>\n                </tr>\n                </tbody>\n            </table>\n\n            <button class=\"button button-block\" ng-click=\"addEntry()\">\n                <i class=\"ion-ios-plus-outline\"></i>\n                添加代寄物品\n            </button>\n        </div>\n        <div class=\"express-noti\">\n\n            <p class=\"notice\">下单须知: </p>\n\n            <p>1. 提交清单后，美比工作人员会先核实，核实通过后订单进入“跟踪快递”。</p>\n\n            <p>2. “跟踪快递”状态后，用户把待寄物品寄到美比仓库收货地址，并尽快填写包裹的快递单号。</p>\n\n            <p>3. 包裹到达仓库之后，进入“入库称重”，用户根据称得重量，选择运输方式后交付运费。</p>\n\n            <p>4. 交付运费后，订单进入\"支付运费\"。仓库人员将24小时内提交运输。</p>\n\n        </div>\n    </ion-content>\n    <ion-footer-bar class=\"bar-stable item-button-right\">\n        <button class=\"button button-assertive button-cart\" ng-click=\"submit()\">提交清单</button>\n    </ion-footer-bar>\n</ion-view>\n");
$templateCache.put("expressItem_add.html","<!-- 添加代寄物品 -->\n<ion-view>\n    <div class=\"bar bar-header\">\n        <button class=\"button button-clear icon ion-ios-arrow-back\" ng-click=\"$ionicGoBack()\"></button>\n        <div class=\"title\">添加代寄物品</div>\n        <button class=\"button button-clear button-dark\" ng-click=\"addItem()\">保存</button>\n    </div>\n\n    <ion-content class=\"has-header\">\n        <div class=\"list\">\n            <label class=\"item item-input\">\n                <span class=\"input-label\">物品名称</span>\n                <input type=\"text\" ng-model=\"item.title\">\n            </label>\n            <label class=\"item item-toggle\">\n                敏感物品\n                <label class=\"toggle toggle-assertive\">\n                    <input type=\"checkbox\" ng-model=\"item.main_category\">\n                    <div class=\"track\">\n                        <div class=\"handle\"></div>\n                    </div>\n                </label>\n            </label>\n            <label class=\"item item-input\">\n                <span class=\"input-label\">数量</span>\n                <input type=\"number\" ng-model=\"item.quantity\">\n            </label>\n            <label class=\"item item-input\">\n                <span class=\"input-label\">申报价值(￥)</span>\n                <input type=\"number\" ng-model=\"item.amount\">\n            </label>\n            <label class=\"item item-input\">\n                <span class=\"input-label\">备注</span>\n                <input type=\"text\" placeholder=\"如颜色，尺寸\" ng-model=\"item.remark\">\n            </label>\n        </div>\n    </ion-content>\n</ion-view>\n");
$templateCache.put("favors.html","<!-- 商品列表 -->\n<ion-view>\n    <div class=\"bar bar-header\">\n      <button class=\"button button-clear icon ion-ios-arrow-back\" ng-click=\"$ionicGoBack()\"></button>\n      <div class=\"title\">收藏商品</div>\n    </div>\n    <ion-content class=\"has-header homepage\">\n        <div class=\"col col-50 animated fadeIn\"\n            collection-repeat=\"item in items\">\n            <div class=\"item item-image\" ng-click=\"goItem(item.id)\">\n                <img ng-src=\"{{item.mainUrl}}\" cache-src>\n            </div>\n            <div class=\"item item-text-wrap\" href=\"#\">\n                <h2 class=\"product-title\" style=\"overflow: hidden;\" ng-click=\"goItem(item.id)\">{{item.name}}</h2>\n                <p class=\"product-prices\">\n                    <span class=\"curr-price\">{{item.price | currency:\'￥\'}}</span>\n                    <span style=\"float:right;font-size:16px;\">\n                      <i class=\"icon ion-ios-heart\"\n                          ng-class=\"{\'like-icon energized\':item.collectFlag, \'light\':!item.collectFlag}\"\n                          ng-click=\"unfavor(item)\"></i>\n                      <i class=\"icon ion-ios-cart\"\n                        ng-click=\"addToCart(item)\"\n                        style=\"margin-left:5px;\"\n                        ></i>\n                    </span>\n              </p>\n            </div>\n        </div>\n    </ion-content>\n</ion-view>\n");
$templateCache.put("feedback.html","<!-- 意见反馈 -->\n<ion-view>\n    <div class=\"bar bar-header\">\n        <button class=\"button button-clear icon ion-ios-arrow-back\" ng-click=\"$ionicGoBack()\"></button>\n        <div class=\"title\">意见反馈</div>\n    </div>\n\n    <ion-content class=\"has-header\">\n        <div class=\"faq-row\">\n            <div class=\"faq-title\">\n                意见反馈:\n            </div>\n            <div class=\"faq-desc\">\n                <textarea ng-model=\"text\" class=\"ng-pristine ng-untouched ng-valid\"></textarea>\n                <button ng-click=\"feedback()\" class=\"button button-assertive pull-right button\">提交</button>\n            </div>\n        </div>\n    </ion-content>\n</ion-view>\n");
$templateCache.put("forgotPassword.html","<ion-modal-view>\n  <ion-header-bar>\n    <div class=\"buttons\">\n      <button class=\"button button-clear icon ion-ios-arrow-back button-dark\" ng-click=\"closeForgotPWBox()\"></button>\n    </div>\n    <div class=\"title\">忘记密码</div>\n  </ion-header-bar>\n  <ion-content class=\"login-page overlay-content\" scroll=\"false\" ng-controller=\"forgotPWCtrl\">\n    <div class=\"list list-inset\">\n      <label class=\"item item-input\">\n        <input type=\"email\" placeholder=\"邮箱地址\" ng-model=\"forgotPWForm.email\">\n      </label>\n    </div>\n\n    <button class=\"button button-block login-btn\" ng-click=\"submit()\">提交</button>\n\n  </ion-content>\n</ion-modal-view>\n");
$templateCache.put("home.html","<ion-view>\n    <form>\n    <div class=\"bar bar-header item-input-inset\">\n      <a href=\"#/cateHome\" class=\"button button-icon icon ion-grid\"></a>\n      <label class=\"item-input-wrapper\">\n        <i class=\"icon ion-ios-search placeholder-icon\"></i>\n        <input type=\"search\" placeholder=\"搜索商品，种类\" ng-model=\"searchQuery\">\n        <input type=\"submit\" ng-click=\"searchItem(searchQuery)\" style=\"position: absolute; left: -9999px; width: 1px; height: 1px;\"/>\n      </label>\n      <span class=\"cart-num\">{{ ngCart.getTotalItems() }}</span>\n      <a href=\"#/cart\" class=\"button button-icon icon ion-ios-cart\"></a>\n    </div>\n    </form>\n    <ion-content class=\"has-header homepage\"  overflow-scroll=\"true\">\n        <ion-slide-box delegate-handle=\"image-viewer\">\n            <!--ng-style=\"{\'height\':(banners?\'auto\':\'0px\'),\'padding-top\':(banners?\'0\':\'42.1875%\')}\">-->\n            <ion-slide ng-repeat=\"banner in banners track by $index\" >\n                <img ng-src=\"{{ ::banner.img }}\" ng-click=\"redirectTo(banner)\">\n            </ion-slide>\n        </ion-slide-box>\n\n        <div class=\"row intro-box\">\n            <div class=\"col col-25\">\n                <a href=\"#/categories\">\n                    <i class=\"icon category\"></i>\n                    <p>商品分类</p>\n                </a>\n\n            </div>\n            <div class=\"col col-25\">\n                <a href=\"#/calculate\">\n                    <i class=\"icon calculate\"></i>\n                    <p>运费估算</p>\n                </a>\n            </div>\n            <div class=\"col col-25\">\n                <a href=\"#/express\">\n                    <i class=\"icon send\"></i>\n                    <p>待寄出国</p>\n                </a>\n\n            </div>\n            <div class=\"col col-25\">\n                <a href=\"#/limit\">\n                    <i class=\"icon limit\"></i>\n                    <p>邮寄限制</p>\n                </a>\n            </div>\n        </div>\n\n        <ion-item class=\"item\" style=\"border-left: 3px solid #ea004f;\">\n            美周专题\n        </ion-item>\n\n\n        <ion-refresher\n            pulling-text=\"下拉刷新...\"\n            on-refresh=\"doRefresh()\"\n            spinner=\"spiral\">\n        </ion-refresher>\n\n        <div class=\"animated fadeIn\" ng-repeat=\"board in boards track by $index\" >\n            <div class=\"item item-banner-image\">\n                <div class=\"tri\"></div>\n                <img ng-src=\"{{ ::board.image }}\" ng-click=\"goBoard(board.id)\">\n            </div>\n            <item-carousel board=\"board\"></item-carousel>\n            <div class=\"item item-divider\"></div>\n        </div>\n        <ion-infinite-scroll\n            on-infinite=\"loadMore()\"\n            distance=\"1\"\n            spinner=\'spiral\'\n            ng-if=\"moreDataCanBeLoaded()\">\n        </ion-infinite-scroll>\n\n\n    </ion-content>\n</ion-view>\n");
$templateCache.put("intro.html","<ion-view class=\"view-intro\">\n\n    <ion-content scroll=\"false\">\n        <div class=\"intro-slider\">\n            <ion-slide-box active-slide=\"slideIndex\" show-pager=\"true\" on-slide-changed=\"slideChanged($index)\">\n\n                <ion-slide ng-repeat=\"item in slides\">\n\n                    <div class=\"content\" ng-if=\"$index == slideIndex\">\n                        <span class=\"top\"><h2>{{ item.top }}</h2></span>\n\n                        <div class=\"phone {{ device }}\">\n                            <img ng-src=\"{{ item.img }}\">\n                        </div>\n                    </div>\n\n                </ion-slide>\n\n                <ion-slide>\n                    <div class=\"content\" ng-if=\"slides.length == slideIndex\">\n\n                        <div class=\"last\">\n                            <div class=\"logo2 step1\">\n                                <img src=\"img/icon.jpg\">\n                                <span class=\"icon2-logo\"></span>\n                            </div>\n\n                            <p>比邻中国的海外生活</p>\n\n                            <button class=\"button button-block button-clear step2\" ui-sref=\"tab.explore\" ng-click=\"goHome()\">开始</button>\n                        </div>\n\n                    </div>\n                </ion-slide>\n            </ion-slide-box>\n\n        </div>\n\n        <!--\n        <button class=\"button button-positive button-fab left\" ng-if=\"slideIndex\" ng-click=\"previous()\"><i class=\"icon ion-ios-arrow-left\"></i></button>\n\n        <button class=\"button button-positive button-fab right\" ng-hide=\"slideIndex === slides.length\" ng-click=\"next()\"><i class=\"icon ion-ios-arrow-right\"></i></button>\n        -->\n    </ion-content>\n</ion-view>\n");
$templateCache.put("item.html","<!-- 商品详情 -->\n<ion-view>\n    <div class=\"buttons\">\n      <button class=\"button button-clear icon ion-ios-arrow-back item-header-button\" ng-click=\"$ionicGoBack()\"></button>\n    </div>\n\n  <ion-content class=\"item-page has-footer\">\n\n    <ion-slide-box delegate-handle=\"image-viewer\"\n        ng-style=\"{\'height\':(item.mainList.length?\'200px\':\'0px\'),\'padding-top\':(item.mainList.length?\'0\':\'100%\')}\">\n        <ion-slide ng-repeat=\"img in item.mainList track by $index\">\n            <img\n              ng-src=\"{{ img.imgUrl }}\"\n              ng-click=\"zoom(img.url)\"\n              />\n        </ion-slide>\n    </ion-slide-box>\n\n    <ion-item class=\"item item-details\">\n        <div class=\"item-title\" style=\"color:red\">\n            {{item.price | currency:\'￥\'}}\n        </div>\n        <div class=\"product-prices\">\n            <span class=\"curr-price\">{{ item.name }}</span>\n        </div>\n    </ion-item>\n    <!-- <ion-item class=\"item item-details\">\n        <div class=\"item-info\">\n            <div class=\"item-info-table\">\n                <dl class=\"item-info-field\">\n                    <dt class=\"item-info-key\">运费：</dt>\n                    <dd class=\"item-info-val\">满 $79 免运费</dd>\n                </dl>\n                <dl class=\"item-info-field\">\n                    <dt class=\"item-info-key\">商品编号：</dt>\n                    <dd class=\"item-info-val\">{{item.item_id}}</dd>\n                </dl>\n                <dl class=\"item-info-field\">\n                    <dt class=\"item-info-key\">商品重量：</dt>\n                    <dd class=\"item-info-val\">{{item.weight}}g</dd>\n                </dl>\n                <dl class=\"item-info-field\">\n                    <dt class=\"item-info-key\">库存所在地：</dt>\n                    <dd class=\"item-info-val\">中国</dd>\n                </dl>\n            </div>\n        </div>\n    </ion-item> -->\n    <ion-item class=\"item item-desc\">\n        <p class=\"info-header\">商品详情:</p>\n        {{item.name}}\n        <img ng-src=\'{{ img.imgUrl }}\' ng-repeat=\"img in item.detailList track by $index\" />\n        <div class=\"description\" ng-bind-html=\"item.detail\"></div>\n    </ion-item>\n  </ion-content>\n  <div class=\"bar bar-footer bar-light item-bottom-bar\">\n      <a ng-click=\"favor(item.id)\" class=\"only-btn\">\n        <i class=\"icon ion-ios-heart\" ng-class=\"{\'like-icon energized\':item.collectFlag, \'dark\':!item.collectFlag}\"></i>\n        <span>收藏</span>\n      </a>\n      <a href=\"#/cart\" class=\"only-btn\">\n        <i class=\"icon ion-ios-cart\"></i>\n        <span>购物车</span>\n      </a>\n      <a class=\"add-to-cart item-bar-icon\"\n          ng-click=\"showSpecsBox()\">\n          加入购物车\n      </a>\n      <a class=\"buy-rightnow item-bar-icon\"\n          ng-click=\"showSpecsBuy()\">\n          立即购买\n      </a>\n  </div>\n</ion-view>\n");
$templateCache.put("itemCarousel.html","<ion-scroll direction=\"x\" scrollbar-x=\"false\" class=\"wide-as-needed item-carousel\">\n    <div class=\"col col-33 \"\n         style=\"display: inline-block\"\n        ng-repeat=\"item in items\" ng-click=\"goItem(item.item_id)\">\n        <div class=\"item item-image\">\n            <img ng-src=\"{{::item.thumbnail}}\">\n        </div>\n        <div class=\"item item-text-wrap\" href=\"#\">\n            <p class=\"\">{{::item.title}}</p>\n            <p class=\"product-prices\">\n                <span class=\"curr-price\">{{::item.price | currency}}</span>\n            </p>\n        </div>\n    </div>\n    <div class=\"col col-33 \"\n         style=\"display: inline-block\"\n        ng-click=\"goBoard()\">\n        <div class=\"item item-image\">\n            <div class=\"item-image-text\">\n                <p>查看全部<p>\n                <p>See All<p>\n            </div>\n        </div>\n        <div class=\"item item-text-wrap\" style=\"background: transparent\">\n            <p class=\"\" style=\"color:transparent\">See </p>\n            <p class=\"\" style=\"color:transparent\">All </p>\n        </div>\n    </div>\n</ion-scroll>\n");
$templateCache.put("limit.html","<ion-view>\n    <div class=\"bar bar-header\">\n        <button class=\"button button-clear icon ion-ios-arrow-back\" ng-click=\"$ionicGoBack()\"></button>\n        <div class=\"title\">邮寄限制</div>\n    </div>\n\n\n    <ion-content class=\"has-header homepage\">\n<div class=\"faq-row\">\n    <div class=\"faq-title\">普通商品:</div>\n    <div class=\"faq-desc\">\n    衣物类、书箱、鞋帽类、围巾类、床上用品类、窗帘类、玩具类、各种背包、提包与行李箱类、女生用品（纸巾、卫生棉等）、文具类、餐具类、厨房用品类、各种石头类工艺品、画框类、电器及其它电子产品（不带电池）、其它不需要海关检验检疫的物品;\n    </div>\n</div>\n\n<div class=\"faq-row\">\n    <div class=\"faq-title\">敏感商品:</div>\n    <div class=\"faq-desc\">\n    地方小吃、干货、茶叶、各种零食饼干、常用药品（感冒药、消炎药、肠胃药、清火去湿及其它非精神类或带有麻醉性质的药品）、光碟、带有电池的电子产品、国际品牌的全新物品、化妆品等；\n    </div>\n</div>\n\n\n<div class=\"faq-row\">\n    <div class=\"faq-title\">禁运商品:</div>\n    <div class=\"faq-desc\">\n    液体类、粉末类、文物古玩类、来自疫区的食品药品、易燃易爆品、各种管制刀具（包括菜刀）、枪枝、鲜活类、毒品、化学品、色情及政治内容的阅读物、世界各国流通货币、有价证券、邮票等海关明令禁止运输的物品;\n    </div>\n</div>\n</section>\n\n    </ion-content>\n</ion-view>\n");
$templateCache.put("logistics.html","<ion-view>\n  <div class=\"bar bar-header\">\n      <button class=\"button button-clear icon ion-ios-arrow-back\" ng-click=\"$ionicGoBack()\"></button>\n      <div class=\"title\">物流详情</div>\n  </div>\n\n  <ion-content class=\"has-header\">\n\n<section class=\"clearfix\" ng-cloak>\n<div class=\"logistic-row\">\n    <span class=\"\">\n        包裹编号：{{logistic.partner_tracking_no}}\n    </span>\n    <span class=\"pull-right\">\n        <ul class=\"logistic-nav\">\n            <li class=\"\"\n                ng-repeat=\"lo in order.logistics track by $index\"\n                ng-if=\"order.logistics.length > 1\"\n                ng-class=\"{\'current\': currTab==$index}\"\n                ng-click=\"goTab($index, lo)\">\n                包裹{{$index+1}}</li>\n        </ul>\n    </span>\n</div>\n<div class=\"\">\n    <table class=\"table ngCart cart-table\">\n        <tbody>\n        <tr ng-repeat=\"entry in logistic.entries track by $index\">\n            <td class=\"img-cell\">\n                <div>\n                    <img ng-src=\"{{entry.spec.images[0]}}\">\n                </div>\n            </td>\n            <td class=\"info-cell\">\n                <div>{{ entry.item.title }}</div>\n                <div>\n                    <span ng-repeat=\"(k, v) in entry.spec.attributes\">\n                        {{ngCart.attrMap[k]}}: {{v}}\n                    </span>\n                </div>\n                <div class=\"btn-group cart-btn\">\n                    <span>数量: {{ entry.quantity | number }}</span>\n                </div>\n            </td>\n            <td class=\"price-cell\">{{ entry.amount_usd | currency }}</td>\n        </tr>\n    </table>\n</div>\n\n<div class=\"logistic-row\">\n    <ul class=\"progress-indicator\">\n        <li ng-class=\"{\'completed\': allStatus.indexOf(logistic.current_status) >= $index}\"\n             ng-repeat=\"status in logistic.all_status\">\n            <span class=\"bubble\"></span>\n            <div class=\"logistic-status\">{{status.desc}}</div>\n        </li>\n    </ul>\n</div>\n<div class=\"logistic-row\">\n    <ul class=\"tracking\">\n        <li ng-repeat=\"h in logistic.history | reverse\">\n            <div class=\"\">{{h.desc}}</div>\n            <div class=\"time\">{{h.time}}</div>\n        </li>\n    </ul>\n</div>\n</section>\n\n  </ion-content>\n</ion-view>\n");
$templateCache.put("notification.html","<ion-view class=\"view-post\">\n    <ion-header-bar>\n        <div class=\"title\">通知</div>\n    </ion-header-bar>\n\n    <ion-content class=\"has-header\">\n\n    <ion-refresher\n        pulling-text=\"下拉刷新...\"\n        on-refresh=\"doRefresh()\"\n        spinner=\"spiral\">\n    </ion-refresher>\n\n    <div class=\"list card notice\" ng-repeat=\"notice in notices track by $index\">\n        <div class=\"item item-avatar\">\n            <img  ng-src=\"{{::notice.user.avatar_thumb}}\" ng-click=\"zoom(notice.user.avatar_url)\">\n            <h2>{{::notice.user.name}}\n                <div class=\"post-type notice\">\n                    {{::notice.sub_title}}\n                </div>\n                <span class=\"item-note\">{{::notice.created_at | amTimeAgo}}</span>\n            </h2>\n            <p class=\"post-body\" ng-bind-html=\"notice.content | nl2br\">\n        </div>\n    </div>\n    <div class=\"center-ico\" ng-if=\"isEmpty()\">\n        <i class=\"icon ion-ios-camera\"></i>\n\n        <h1 >暂无动态</h1>\n    </div>\n    <ion-infinite-scroll\n        on-infinite=\"loadMore()\"\n        distance=\"1\"\n        spinner=\'spiral\'\n        ng-if=\"moreDataCanBeLoaded()\">\n    </ion-infinite-scroll>\n\n    </ion-content>\n</ion-view>\n");
$templateCache.put("order.html","<ion-view>\n  <div class=\"bar bar-header\">\n      <button class=\"button button-clear icon ion-ios-arrow-back\" ng-click=\"$state.go(\'tab.orders\')\"></button>\n      <div class=\"title\">订单详情</div>\n  </div>\n\n  <ion-content class=\"has-header\">\n\n<section class=\"orders\">\n<div class=\"checkout-info\">\n    <div class=\"address-info-1\">\n      <div class=\"row\">\n        <div class=\"col\">收货人：{{order.receiptName}}</div>\n        <div class=\"col\" style=\"text-align:right\">{{order.receiptPhone}}</div>\n      </div>\n      <div class=\"row\">\n        <div class=\"col\">收货地址：{{order.receiptDetail}}</div>\n      </div>\n    </div>\n</div>\n</section>\n\n<section class=\"clearfix\" ng-cloak>\n<div class=\"\">\n    <table class=\"table ngCart cart-table\">\n        <tbody>\n        <tr ng-repeat=\"entry in order.detailList track by $index\">\n            <td class=\"img-cell\">\n                <div>\n                    <img ng-src=\"{{entry.maProImg}}\">\n                </div>\n            </td>\n            <td class=\"info-cell\">\n                <div>{{ entry.maProName }}</div>\n                <div>\n                    <span ng-repeat=\"(k, v) in entry.spec.attributes\">\n                        {{ngCart.attrMap[k]}}: {{v}}\n                    </span>\n                </div>\n                <div class=\"btn-group cart-btn\">\n                    <span>数量: {{ entry.num | number }}</span>\n                </div>\n            </td>\n            <td class=\"price-cell\">{{ entry.dealPrice | currency:\"￥\" }}</td>\n        </tr>\n    </table>\n</div>\n</section>\n<section>\n<div class=\"checkout-info\">\n    <div class=\"partner-info\" style=\"margin-left: 8px;\">\n        <div class=\"selected-partner\">快递方式:{{order.trackingName}}\n            <span class=\"detail-price pull-right\">{{order.trackingAmount | currency:\'￥\' }}</span>\n        </div>\n    </div>\n</div>\n</section>\n\n<section>\n<div class=\"checkout-info\">\n    <div class=\"item-info-table\">\n        <dl class=\"item-info-field\">\n            <dt class=\"\">商品总价: </dt>\n            <dd class=\"detail-price\">{{order.totalAmount | currency:\'￥\' }}</dd>\n        </dl>\n        <dl class=\"item-info-field\">\n            <dt class=\"\">运费: </dt>\n            <dd class=\"detail-price\">{{order.trackingAmount | currency:\'￥\' }}</dd>\n        </dl>\n    </div>\n</div>\n<div class=\"order-bottom\">\n    <div class=\"\">\n        订单号：{{order.code}}\n    </div>\n    <div class=\"\">\n        创建时间: {{order.createTime}}\n    </div>\n</div>\n</section>\n  </ion-content>\n  <ion-footer-bar align-title=\"left\" class=\"bar-stable\">\n    <a class=\"button button-clear\">\n        总计: <span class=\"footer-price\"> {{ order.totalAmount |currency:\'￥\'}}</span>\n    </a>\n    <h1 class=\"title\"></h1>\n    <div class=\"buttons\">\n        <ngcart-checkout ng-if=\"order.status==\'0\'\" settings=\"{ order_id: order.id , order_type: \'existed\'}\">\n            去付款\n        </ngcart-checkout>\n        <button class=\"button button-clear\" ng-disabled=\"order.payment_status==\'PAID\'\"\n            ng-if=\"order.status==\'1\' || order.status==\'2\'\">\n            已付款\n        </button>\n        <button class=\"button button-default\"\n            ng-click=\"cancelOrder()\"\n            ng-if=\"order.status==\'0\'\">\n            取消订单\n        </button>\n    </div>\n  </ion-footer-bar>\n</ion-view>\n");
$templateCache.put("orders.html","<!-- 商品详情 -->\n<ion-view>\n  <div class=\"bar bar-header\">\n      <button class=\"button button-clear icon ion-ios-arrow-back\" ng-click=\"$ionicGoBack()\"></button>\n      <div class=\"title\">我的订单</div>\n  </div>\n\n  <ion-content class=\"has-header\">\n\n<section>\n<div class=\"order-btn-row\">\n    <div class=\"btn-group cart-btn row\">\n      <button class=\"btn order-btn col-25\"\n          ng-class=\"{\'active\': orderType == \'0\'}\"\n          ng-click=\"setType(\'0\')\">待付款</button>\n      <button class=\"btn order-btn col-25\"\n          ng-class=\"{\'active\': orderType == \'1\'}\"\n          ng-click=\"setType(\'1\')\">待收货</button>\n      <button class=\"btn order-btn col-25\"\n          ng-class=\"{\'active\': orderType == \'2\'}\"\n          ng-click=\"setType(\'2\')\">已完成</button>\n      <button class=\"btn order-btn col-25\"\n          ng-class=\"{\'active\': orderType == \'3\'}\"\n          ng-click=\"setType(\'3\')\">已取消</button>\n    </div>\n</div>\n<div class=\"order-detail\" ng-repeat=\"order in orders track by $index\">\n    <table class=\"table ngCart cart-table\">\n        <thead>\n        <tr>\n            <td class=\"first-cell\" colspan=\"2\">\n                <button class=\"button button-clear button-dark button-small\">\n                    订单号: {{order.code}}\n                </button>\n            </td>\n            <td class=\"detail-cell\">\n                <a class=\"button button-stable button-small\" ng-href=\"#/order/{{order.code}}\">详情 <i class=\"icon ion-ios-arrow-right\"></i></a>\n            </td>\n        </tr>\n        </thead>\n\n        <tbody>\n        <tr\n          ng-repeat=\"entry in order.detailList track by $index\"\n          style=\"border:0 none; background-color:#f9f9f9\">\n\n            <td class=\"img-cell\">\n                <div>\n                    <a ng-href=\"#/item/{{entry.maProId}}\">\n                        <img ng-src=\"{{entry.maProImg}}\">\n                    </a>\n                </div>\n            </td>\n            <td class=\"info-cell\">\n                <div>{{ entry.maProName }}</div>\n                <div>\n                    <span ng-repeat=\"(k, v) in entry.spec.attributes\">\n                        {{ngCart.attrMap[k]}}: {{v}}\n                    </span>\n                </div>\n                <div class=\"btn-group cart-btn\">\n                    <span>数量: {{ entry.num | number }}</span>\n                </div>\n            </td>\n            <td class=\"price-cell\">{{ entry.dealPrice | currency:\'￥\' }}</td>\n        </tr>\n        </tbody>\n\n        <tfoot>\n          <tr>\n            <td colspan=\"3\" class=\"fee-cell\">运费:\n                <span class=\"price-cell\">{{ order.trackingAmount | currency:\"￥\" }}</span>\n                总计:\n                <span class=\"price-cell\">{{ order.totalAmount | currency:\"￥\" }}</span>\n            </td>\n          </tr>\n          <tr style=\"height:40px\">\n            <td colspan=\"3\" class=\"status-cell\" style=\"text-align:right;padding-right:10px;\">\n                <a class=\"button button-default button-small\"\n                  ng-href=\"#/order/logistics/{{order.code}}\">\n                    查看物流\n                </a>\n                <a class=\"button button-energized button-small\"\n                  ng-if=\"order.status==\'0\'\"\n                  ng-href=\"#/order/{{order.code}}\">\n                    去付款\n                </a>\n                <a class=\"button button-energized button-small\"\n                  ng-if=\"order.status==\'1\' || order.status==\'2\'\"\n                  ng-click=\"orderDone(order)\">\n                    确认收货\n                </a>\n            </td>\n          </tr>\n        </tfoot>\n    </table>\n\n</div>\n</section>\n  </ion-content>\n</ion-view>\n");
$templateCache.put("profile.html","<ion-view>\n  <div class=\"bar bar-header\">\n      <button class=\"button button-clear icon ion-ios-arrow-back\" ng-click=\"$ionicGoBack()\"></button>\n      <div class=\"title\">个人资料</div>\n  </div>\n  <ion-content class=\"has-header account\">\n    <ion-list>\n\n      <ion-item class=\"item-divider\">\n      </ion-item>\n\n      <ion-item class=\"item item-icon-right\" ng-click=\"togglePhotoModal()\">\n          上传头像\n          <i class=\"icon ion-ios-arrow-right\"></i>\n      </ion-item>\n      <ion-item class=\"item item-icon-right\"  ng-click=\"setUsername()\">\n          用户名\n          <span class=\"item-note\">\n              {{user.getUser().name}}\n          </span>\n          <i class=\"icon ion-ios-arrow-right\"></i>\n      </ion-item>\n    </ion-list>\n  </ion-content>\n</ion-view>\n");
$templateCache.put("scan.html","<ion-view>\n    <div class=\"bar bar-header\">\n        <button class=\"button button-clear icon ion-ios-arrow-back\" ng-click=\"$ionicGoBack()\"></button>\n        <div class=\"title\">扫码开锁</div>\n    </div>\n    <ion-content class=\"has-header account\">\n        <div>\n            <img style=\"height:150px\" ng-src=\"{{imgUrl}}\" alt=\"\">\n        </div>\n        <div style=\"margin-top:50px;text-align:center\">\n            <button\n              class=\"button button-assertive\"\n              ng-if=\"showOpen\"\n              ng-click=\"getCode()\"\n              style=\"width:60%\">\n                获取开锁密码\n           </button>\n\n           <div ng-if=\"showCode\">\n             <p style=\"font-size:18px;letter-spacing:10px\">开锁密码</p>\n             <div>\n               <button class=\"button button-assertive\">{{openCode[0]}}</button>\n               <button class=\"button button-assertive\">{{openCode[1]}}</button>\n               <button class=\"button button-assertive\">{{openCode[2]}}</button>\n               <button class=\"button button-assertive\">{{openCode[3]}}</button>\n             </div>\n           </div>\n\n           <div ng-if=\"alreadyShow\">\n             <p>您已获取过开锁密码</p>\n             <p>开锁密码为：{{password}}</p>\n           </div>\n        </div>\n    </ion-content>\n</ion-view>\n");
$templateCache.put("settings.html","<ion-view>\n  <div class=\"bar bar-header\">\n      <button class=\"button button-clear icon ion-ios-arrow-back\" ng-click=\"$ionicGoBack()\"></button>\n      <div class=\"title\">设置</div>\n  </div>\n  <ion-content class=\"has-header account\">\n    <ion-list>\n      <ion-item class=\"item-divider\"></ion-item>\n      <ion-item class=\"item item-icon-left item-icon-right\" ng-click=\"$state.go(\'tab.like_posts\')\">\n          <i class=\"icon ion-ios-grid-view-outline\"></i>\n          赞过帖子\n          <i class=\"icon ion-ios-arrow-right\"></i>\n      </ion-item>\n      <ion-item class=\"item item-icon-left item-icon-right\" ng-click=\"$state.go(\'tab.favors\')\">\n          <i class=\"icon ion-ios-heart-outline\"></i>\n          收藏商品\n          <i class=\"icon ion-ios-arrow-right\"></i>\n      </ion-item>\n      <ion-item class=\"item-divider\"></ion-item>\n\n      <ion-item class=\"item item-icon-left item-icon-right\" ng-click=\"$state.go(\'tab.profile\')\">\n          <i class=\"icon ion-ios-person-outline\"></i>\n          个人资料\n          <i class=\"icon ion-ios-arrow-right\"></i>\n      </ion-item>\n\n      <ion-item class=\"item item-icon-left item-icon-right\" ng-click=\"$state.go(\'tab.address_list\')\">\n          <i class=\"icon ion-ios-location\"></i>\n          收货地址\n          <i class=\"icon ion-ios-arrow-right\"></i>\n      </ion-item>\n\n      <ion-item class=\"item-divider\"></ion-item>\n\n      <ion-item class=\"item item-icon-right\" ng-click=\"$state.go(\'tab.about\')\">\n          关于我们\n          <i class=\"icon ion-ios-arrow-right\"></i>\n      </ion-item>\n\n      <ion-item class=\"item-divider\">\n      </ion-item>\n\n      <ion-item class=\"item item-icon-right\" ng-click=\"logout()\">\n          登出\n          <i class=\"icon ion-ios-arrow-right\"></i>\n      </ion-item>\n      <ion-item class=\"item-divider\"></ion-item>\n    </ion-list>\n  </ion-content>\n</ion-view>\n");
$templateCache.put("shopTabs.html","<!--\nCreate tabs with an icon and label, using the tabs-positive style.\nEach tab\'s child <ion-nav-view> directive will have its own\nnavigation history that also transitions its views in and out.\n-->\n<ion-tabs class=\"maybi-tabs tabs-icon-top tabs-color-active-positive {{hideTabs}}\">\n\n  <!-- Explore Tab -->\n  <!-- <ion-tab title=\"美比\" icon-off=\"ion-aperture\" icon-on=\"ion-aperture\" href=\"#/explore\">\n    <ion-nav-view name=\"tab-explore\"></ion-nav-view>\n  </ion-tab> -->\n\n  <!-- Home Tab -->\n  <ion-tab title=\"首页\" icon-off=\"ion-ios-home-outline\" icon-on=\"ion-ios-home\" href=\"#/shopTab/cateHome\">\n    <ion-nav-view name=\"shopTab-cateHome\"></ion-nav-view>\n  </ion-tab>\n\n  <!-- Photo Tab -->\n  <!-- <ion-tab class=\"icon-center\" title=\"\" icon-off=\"icon-center\" icon-on=\"icon-center\" ng-click=\"togglePhotoModal()\">\n    <ion-nav-view name=\"tab-capture\"></ion-nav-view>\n  </ion-tab> -->\n\n  <!-- <ion-tab class=\"icon-center\" title=\"\" icon-off=\"icon-center\" icon-on=\"icon-center\" href=\"#/appIndex\">\n    <ion-nav-view name=\"tab-index\"></ion-nav-view>\n  </ion-tab> -->\n\n  <!-- Noti Tab -->\n  <ion-tab title=\"购物车\" icon-off=\"ion-ios-cart-outline\" icon-on=\"ion-ios-cart\" href=\"#/cart\">\n    <!-- <ion-view name=\"cart\"></ion-view> -->\n  </ion-tab>\n\n  <!-- Account Tab -->\n  <ion-tab title=\"我的\" icon-off=\"ion-ios-person-outline\" icon-on=\"ion-ios-person\" href=\"#/shopTab/account\">\n    <ion-nav-view name=\"shopTab-account\"></ion-nav-view>\n  </ion-tab>\n\n\n</ion-tabs>\n");
$templateCache.put("showMore.html","<div>\n    <div ng-style=\'expandable&&!expanded? showLessStyle : \"\"\'>\n        <p ng-bind-html=\"title||\'\' | nl2br\"></p>\n    </div>\n    <div ng-if=\"expandable\" class=\"expand-btn\">\n        <button class=\"button button-small button-clear button-dark \"\n           ng-click=\'$event.stopPropagation();toggle()\'>{{expanded? \'收起\':\'展开全文\'}}\n        </button>\n    </div>\n</div>\n");
$templateCache.put("signup.html","<ion-modal-view>\n  <ion-header-bar>\n    <div class=\"buttons\">\n      <button class=\"button button-clear icon ion-ios-arrow-back button-dark\" ng-click=\"closeSignupBox()\"></button>\n    </div>\n    <div class=\"title\">注册</div>\n  </ion-header-bar>\n  <ion-content class=\"signup-page overlay-content\" ng-controller=\"signupCtrl\">\n    <div class=\"list list-inset\">\n      <label class=\"item item-input\">\n        <input type=\"email\" placeholder=\"邮箱地址\" ng-model=\"signupForm.email\">\n      </label>\n\n      <label class=\"item item-input\">\n        <input type=\"text\" placeholder=\"手机号\" ng-model=\"signupForm.phone\">\n      </label>\n\n      <label class=\"item item-input\">\n        <input type=\"text\" placeholder=\"用户名\" ng-model=\"signupForm.name\">\n      </label>\n\n      <label class=\"item item-input\">\n        <input type=\"password\" placeholder=\"密码\" ng-model=\"signupForm.password\">\n      </label>\n\n    </div>\n\n    <button class=\"button button-block login-btn\" ng-click=\"signup()\">\n        注册\n    </button>\n\n\n    <!-- <div class=\"third-party-box\">\n        <p>使用第三方账号登陆</p>\n        <div ng-show=\"IsWechatInstalled\" ng-click=\"oauthLogin(\'wechat\')\" class=\"login-icon wechat\"></div>\n        <div ng-click=\"oauthLogin(\'weibo\')\" class=\"login-icon weibo\"></div>\n        <div ng-click=\"oauthLogin(\'qq\')\" class=\"login-icon qq\"></div>\n\n    </div> -->\n  </ion-content>\n</ion-modal-view>\n");
$templateCache.put("specs-dialog.html","<ion-view>\n  <ion-content class=\"topic-create\">\n    <ion-item class=\"item item-thumbnail-left\">\n        <img ng-src=\"{{item.mainUrl}}\">\n        <h2>{{item.title}}</h2>\n        <p>{{selectedSpec.price | currency}} x {{quantity}}</p>\n        <div class=\"footer-price\">{{subTotal(selectedSpec.price, quantity) | currency}}</div>\n        <i class=\"icon placeholder-icon ion-ios-close\"\n          style=\"position:absolute;right:20px;font-size:28px;top:36px\"\n          ng-click=\"closeSpecsBox()\">\n        </i>\n    </ion-item>\n    <ion-item class=\"spec-options\">\n        <div class=\"spec-options-table\">\n            <dl class=\"spec-info-field\" ng-repeat=\"(k, v) in item.attributes_desc\">\n                <dt class=\"spec-info-key\">{{v}}</dt>\n                <dd class=\"spec-info-val\">\n                <span class=\"spec-attr\"\n                    ng-class=\"{\'selected\': attr==selectedAttr[k],\n                            \'disabled\': remainSpec.indexOf(attr) == -1}\"\n                    ng-click=\"setAttr(k, attr)\"\n                    ng-repeat=\"attr in attrChoices[k]\">\n                        {{attr}}\n                    </span>\n                </dd>\n            </dl>\n            <dl class=\"spec-info-field\">\n                <dt class=\"spec-info-key\">数量：</dt>\n                <dd class=\"spec-info-val\">\n                    <div class=\"btn-group\">\n                        <button class=\"btn del-num\"\n                            ng-click=\"setQuantity(-1, true)\">-</button>\n                        <button class=\"btn num\">{{quantity}}</button>\n                        <button class=\"btn add-num\"\n                            ng-click=\"setQuantity(1, true)\">+</button>\n                    </div>\n                </dd>\n            </dl>\n        </div>\n    </ion-item>\n  </ion-content>\n\n    <ion-footer-bar  class=\"bar-assertive footer-button\" >\n      <ngcart-addtocart id=\"{{item.id}}\" name=\"{{item.title}}\" price=\"{{selectedSpec.price}}\" quantity=\"{{quantity}}\" quantity-max=\"5\" data=\"item\">加入 购物车</ngcart-addtocart>\n    </ion-footer-bar>\n\n</ion-view>\n");
$templateCache.put("specsBuy-dialog.html","<ion-view>\n  <ion-content class=\"topic-create\">\n    <ion-item class=\"item item-thumbnail-left\">\n        <img ng-src=\"{{item.mainUrl}}\">\n        <h2>{{item.title}}</h2>\n        <p>{{selectedSpec.price | currency}} x {{quantity}}</p>\n        <div class=\"footer-price\">{{subTotal(selectedSpec.price, quantity) | currency}}</div>\n        <i class=\"icon placeholder-icon ion-ios-close\"\n          style=\"position:absolute;right:20px;font-size:28px;top:36px\"\n          ng-click=\"closeSpecsBuy()\">\n        </i>\n    </ion-item>\n    <ion-item class=\"spec-options\">\n        <div class=\"spec-options-table\">\n            <dl class=\"spec-info-field\" ng-repeat=\"(k, v) in item.attributes_desc\">\n                <dt class=\"spec-info-key\">{{v}}</dt>\n                <dd class=\"spec-info-val\">\n                <span class=\"spec-attr\"\n                    ng-class=\"{\'selected\': attr==selectedAttr[k],\n                            \'disabled\': remainSpec.indexOf(attr) == -1}\"\n                    ng-click=\"setAttr(k, attr)\"\n                    ng-repeat=\"attr in attrChoices[k]\">\n                        {{attr}}\n                    </span>\n                </dd>\n            </dl>\n            <dl class=\"spec-info-field\">\n                <dt class=\"spec-info-key\">数量：</dt>\n                <dd class=\"spec-info-val\">\n                    <div class=\"btn-group\">\n                        <button class=\"btn del-num\"\n                            ng-click=\"setQuantity(-1, true)\">-</button>\n                        <button class=\"btn num\">{{quantity}}</button>\n                        <button class=\"btn add-num\"\n                            ng-click=\"setQuantity(1, true)\">+</button>\n                    </div>\n                </dd>\n            </dl>\n        </div>\n    </ion-item>\n  </ion-content>\n\n    <ion-footer-bar  class=\"bar-energized\" >\n      <ngcart-buyrightnow id=\"{{item.id}}\" name=\"{{item.name}}\" price=\"{{item.price}}\" quantity=\"{{quantity}}\" quantity-max=\"5\" data=\"item\">立即购买</ngcart-buyrightnow>\n    </ion-footer-bar>\n\n</ion-view>\n");
$templateCache.put("tabs.html","<!--\nCreate tabs with an icon and label, using the tabs-positive style.\nEach tab\'s child <ion-nav-view> directive will have its own\nnavigation history that also transitions its views in and out.\n-->\n<ion-tabs class=\"maybi-tabs tabs-icon-top tabs-color-active-positive {{hideTabs}}\">\n\n  <!-- Explore Tab -->\n  <!-- <ion-tab title=\"美比\" icon-off=\"ion-aperture\" icon-on=\"ion-aperture\" href=\"#/explore\">\n    <ion-nav-view name=\"tab-explore\"></ion-nav-view>\n  </ion-tab> -->\n\n  <!-- Home Tab -->\n  <ion-tab title=\"首页\" icon-off=\"ion-ios-cart-outline\" icon-on=\"ion-ios-cart\" href=\"#/shopTab/cateHome\">\n    <ion-nav-view name=\"tab-cateHome\"></ion-nav-view>\n  </ion-tab>\n\n  <!-- Photo Tab -->\n  <ion-tab class=\" ion-qr-scanner\" title=\"\" icon-off=\" ion-qr-scanner\" icon-on=\" ion-qr-scanner\" ng-click=\"scanStart()\">\n    <ion-nav-view name=\"tab-capture\"></ion-nav-view>\n  </ion-tab>\n\n  <!-- <ion-tab class=\"icon-center\" title=\"\" icon-off=\"icon-center\" icon-on=\"icon-center\" href=\"#/appIndex\">\n    <ion-nav-view name=\"tab-index\"></ion-nav-view>\n  </ion-tab> -->\n\n  <!-- Noti Tab -->\n  <ion-tab title=\"通知\" icon-off=\"ion-ios-bell-outline\" icon-on=\"ion-ios-bell\" href=\"#/notification\">\n    <ion-nav-view name=\"tab-noti\"></ion-nav-view>\n  </ion-tab>\n\n  <!-- Account Tab -->\n  <ion-tab title=\"我的\" icon-off=\"ion-ios-person-outline\" icon-on=\"ion-ios-person\" href=\"#/account\">\n    <ion-nav-view name=\"tab-account\"></ion-nav-view>\n  </ion-tab>\n\n\n</ion-tabs>\n");
$templateCache.put("transfer_logistics.html","<ion-view>\n  <div class=\"bar bar-header\">\n      <button class=\"button button-clear icon ion-ios-arrow-back\" ng-click=\"$state.go(\'tab.orders\')\"></button>\n      <div class=\"title\">物流详情</div>\n  </div>\n\n  <ion-content class=\"has-header\">\n\n\n<section ng-if=\"order.payment_status == \'PAID\'\">\n    <div class=\"checkout-info\">\n        <span class=\"addr-icon\"></span>\n        <div class=\"address-info\">\n            <p class=\"addr-header\">收货人信息: </p>\n            <div class=\"\">{{order.address.receiver}}</div>\n            <div class=\"\">{{order.address.street1}}</div>\n            <div class=\"\">{{order.address.street2}}</div>\n            <div class=\"\">{{order.address.city}}, {{order.address.state}}</div>\n            <div class=\"\">{{order.address.country}}, {{order.address.postcode}}</div>\n        </div>\n    </div>\n\n    <div class=\"checkout-info\">\n        <div class=\"icon partner-icon address\"></div>\n        <div class=\"partner-info\">\n            <div class=\"selected-partner\">{{order.provider.display_name}} ({{order.provider.desc}}):\n                <span class=\"detail-price pull-right\">{{order.cn_shipping | currency }}</span>\n            </div>\n        </div>\n    </div>\n\n    <div class=\"checkout-info\">\n        <div class=\"icon coupon-icon address\"></div>\n        <div class=\"coupon-info\">\n            <div ng-show=\"order.discount.length==1\" class=\"\">{{order.discount[0].desc}}\n                <span class=\"detail-price pull-right\">- {{order.discount[0].value | currency }}</span>\n            </div>\n            <div ng-show=\"order.discount.length==0\" class=\"\">\n                不使用\n            </div>\n        </div>\n    </div>\n</section>\n\n<section class=\"clearfix\" ng-if=\"order.status == \'WAREHOUSE_IN\'\">\n    <div class=\"checkout-info\" ng-click=\"gotoAddress()\">\n        <div ng-show=\"addr.id\">\n            <span class=\"addr-icon\"></span>\n            <div class=\"address-info\">\n                <p class=\"addr-header\">寄往收货人信息: </p>\n                <div class=\"\">{{addr.data.receiver}}</div>\n                <div class=\"\">{{addr.data.street1}}</div>\n                <div class=\"\">{{addr.data.street2}}</div>\n                <div class=\"\">{{addr.data.city}}, {{addr.data.state}}</div>\n                <div class=\"\">{{addr.data.country}}, {{addr.data.postcode}}</div>\n            </div>\n            <div class=\"select-arrow address\"></div>\n        </div>\n        <div ng-hide=\"addr.id\">\n            <span class=\"addr-icon\"></span>\n            <div class=\"address-info\">\n                <div class=\"\">填写收件人信息</div>\n            </div>\n            <div class=\"go-add\">+</div>\n        </div>\n    </div>\n\n    <div class=\"checkout-info\">\n        <div class=\"icon partner-icon address\"></div>\n        <div class=\"partner-info\" ng-click=\"showProviderChoices()\">\n            <div ng-show=\"selectedProvider\" class=\"selected-partner\">\n                {{selectedProvider.display_name}} ({{selectedProvider.service_intro.duration}}):\n                <span class=\"detail-price selectable\">{{selectedProvider.cn_shipping | currency }}</span>\n            </div>\n            <div ng-hide=\"selectedProvider\" class=\"selected-partner\">请选择运输方式</div>\n        </div>\n        <div class=\"select-arrow\" ng-class=\"{\'down-arrow\': providersShown}\"></div>\n    </div>\n    <div ng-show=\"providersShown\" class=\"checkout-choices\">\n        <div class=\"select-row\" ng-repeat=\"provider in provider_prices\"\n            ng-click=\"selectPartner(provider)\">\n            <span class=\"select-icon\"\n                ng-class=\"{\'selected\': selectedProvider.name == provider.name}\">\n            </span>\n            <div class=\"checkout-choice\">\n                {{provider.display_name}} ({{provider.service_intro.duration}})\n                <span class=\"detail-price selectable\">{{provider.cn_shipping | currency }}</span>\n            </div>\n        </div>\n    </div>\n\n    <div class=\"checkout-info\">\n        <div class=\"icon coupon-icon address\"></div>\n        <div class=\"coupon-info\" ng-click=\"showCouponsChoices()\">\n            <div ng-show=\"coupon_codes\" class=\"\">{{coupon_codes.description}}\n                <span class=\"detail-price selectable\">-{{coupon_codes.saving | currency }}</span>\n            </div>\n            <div ng-hide=\"coupon_codes\" class=\"\">使用折扣码/优惠券 </div>\n        </div>\n        <div class=\"select-arrow\" ng-class=\"{\'down-arrow\': couponsShown}\"></div>\n    </div>\n    <div ng-show=\"couponsShown\" class=\"checkout-choices\">\n        <div class=\"select-row\" ng-click=\"noCoupon()\">\n            <span class=\"select-icon\"\n                ng-class=\"{\'selected\': noCouponSelected == true}\">\n            </span>\n            <div class=\"checkout-choice\">\n                不使用\n            </div>\n        </div>\n        <div class=\"select-row\" ng-repeat=\"coupon in availableCoupons\"\n            ng-click=\"selectCoupon(coupon)\">\n            <span class=\"select-icon\"\n                ng-class=\"{\'selected\': coupon_codes.code == coupon.code}\">\n            </span>\n            <div class=\"checkout-choice\">\n                {{coupon.description}}\n                <span class=\"detail-price selectable\">-{{coupon.saving | currency }}</span>\n            </div>\n        </div>\n        <div class=\"select-row\">\n            <span class=\"select-icon\"\n                ng-click=\"selectInputCoupon()\"\n                ng-class=\"{\'selected\': couponInputSelected}\">\n            </span>\n            <div class=\"checkout-choice\">\n                折扣码 <input ng-model=\"couponInput\" type=\"text\" class=\"\" placeholder=\"输入折扣码\">\n                <span class=\"detail-price selectable\">-{{coupon_codes.saving}}</span>\n                <span ng-click=\"confirmCoupon()\" class=\"use-btn\">使用</span>\n            </div>\n        </div>\n    </div>\n</section>\n\n<section>\n    <div class=\"logistic-row\">\n        <span class=\"\">\n            包裹编号：{{logistic.partner_tracking_no}}\n        </span>\n        <span class=\"pull-right\">\n            <ul class=\"logistic-nav\">\n                <li class=\"\"\n                    ng-repeat=\"lo in order.logistics\"\n                    ng-if=\"order.logistics.length > 1\"\n                    ng-class=\"{\'current\': currTab==$index}\"\n                    ng-click=\"goTab($index, lo)\">\n                    包裹{{$index+1}}</li>\n            </ul>\n        </span>\n    </div>\n\n    <table class=\"table ngCart cart-table\">\n        <tbody>\n        <tr ng-repeat=\"entry in logistic.entries track by $index\">\n            <td class=\"img-cell\">\n                <div>\n                    <img ng-src=\"{{entry.item.primary_img}}\">\n                </div>\n            </td>\n            <td class=\"info-cell\">\n                <div>\n                    {{ entry.title }}\n                </div>\n                <div>\n                    <span>数量: {{ entry.quantity | number }}</span>\n                </div>\n                <div class=\"\">\n                    备注:{{ entry.remark }}\n                </div>\n                <div class=\"tracking-note\">\n                    <input type=\"text\" placeholder=\"请填写快递单号\"\n                        ng-model=\"entry.shipping_info.number\">\n                    <button class=\"button button-energized button-small\"\n                        ng-click=\"fillTracking(entry)\">\n                        保存\n                    </button>\n                </div>\n            </td>\n            <td class=\"price-cell\">￥{{ entry.amount }}</td>\n        </tr>\n    </table>\n\n    <div class=\"logistic-row\">\n        <ul class=\"progress-indicator\">\n            <li ng-class=\"{\'completed\': allStatus.indexOf(logistic.current_status) >= $index}\"\n                 ng-repeat=\"status in logistic.all_status\">\n                <span class=\"bubble\"></span>\n                <div class=\"logistic-status\">{{status.desc}}</div>\n            </li>\n        </ul>\n    </div>\n    <div class=\"logistic-row\">\n        <ul class=\"tracking\">\n            <li ng-repeat=\"h in logistic.history| reverse\">\n                <div class=\"\">{{h.desc}}</div>\n                <div class=\"time\">{{h.time}}</div>\n            </li>\n        </ul>\n    </div>\n</section>\n\n  </ion-content>\n\n  <ion-footer-bar align-title=\"left\" class=\"bar-stable\">\n    <a class=\"button button-clear\">\n        总计: <span class=\"footer-price\"> {{ order.final |currency}}</span>\n    </a>\n    <h1 class=\"title\"></h1>\n    <div class=\"buttons\">\n        <ngcart-checkout ng-if=\"order.status==\'WAREHOUSE_IN\'\" settings=\"{ order_id: order.id , order_type: \'existed\'}\">\n            去付款\n        </ngcart-checkout>\n        <button class=\"button button-default\"\n            ng-click=\"cancelOrder()\"\n            ng-if=\"order.payment_status==\'UNPAID\'\">\n            取消订单\n        </button>\n    </div>\n  </ion-footer-bar>\n\n</ion-view>\n");
$templateCache.put("userDetail.html","<!-- 用户详情 -->\n<ion-view>\n    <div class=\"buttons\">\n        <button class=\"button button-clear icon ion-ios-arrow-back account-setting-btn pull-left\" ng-click=\"$ionicGoBack()\"></button>\n    </div>\n    <div class=\"avatar-section\">\n        <a class=\"logo\"\n            style=\"background: url({{::user.avatar_url}}) center no-repeat; background-size: cover\">\n        </a>\n        <div class=\"avatar-wrap\">\n            <p><img class=\"avatar\" ng-src=\"{{::user.avatar_url}}\" alt=\"\"></p>\n            <p class=\"user\">{{::user.name}} <follow-btn user=\"user\"></p>\n        </div>\n        <div class=\"social-btns\">\n            <a ng-href=\"#/userList/{{::user.id}}/followers\">\n                <strong>{{user.num_followers}} </strong>粉丝\n            </a>\n            <a ng-href=\"#/userList/{{::user.id}}/followings\">\n                <strong>{{user.num_followings}} </strong>关注\n            </a>\n        </div>\n    </div>\n\n    <ion-content class=\"account-view\" overflow-scroll=\'false\' delegate-handle=\"userDetailContent\" on-scroll=\"onUserDetailContentScroll()\" header-shrink scroll-event-interval=\"5\">\n      <div class=\"button-bar bar-light switch-bar\">\n          <button class=\"button button-icon\" ng-click=\"switchListStyle(\'grid\')\"\n              ng-class=\"gridStyle==\'grid\'? \'active\': \'\'\">\n              <i class=\"icon ion-grid\"></i>\n          </button>\n          <button class=\"button button-icon\" ng-click=\"switchListStyle(\'list\')\"\n              ng-class=\"gridStyle==\'list\'? \'active\': \'\'\">\n              <i class=\"icon ion-navicon\"></i>\n          </button>\n      </div>\n\n      <div class=\"view-post\">\n        <ion-refresher\n            pulling-text=\"下拉刷新...\"\n            on-refresh=\"doRefresh()\"\n            spinner=\"spiral\">\n        </ion-refresher>\n        <div class=\"list card \" ng-if=\"gridStyle == \'list\'\"\n            ng-repeat=\"post in posts track by $index\">\n            <photo-list post=\"post\" with-affix=\"false\"></photo-list>\n        </div>\n        <div class=\"\" ng-if=\"gridStyle==\'grid\'\">\n            <div class=\"col col-33 grid-image\" ng-repeat=\"post in posts track by $index\">\n                <img ng-src=\"{{::post.small_url}}\" ng-click=\"zoom(post.primary_image)\">\n            </div>\n        </div>\n\n        <div class=\"center-ico\" ng-if=\"isEmpty()\">\n            <i class=\"icon ion-ios-camera\"></i>\n\n            <h1 >这人还没发布过</h1>\n        </div>\n\n        <ion-infinite-scroll\n            on-infinite=\"loadMore()\"\n            distance=\"1\"\n            spinner=\'spiral\'\n            ng-if=\"moreDataCanBeLoaded()\">\n        </ion-infinite-scroll>\n\n    </ion-content>\n</ion-view>\n");
$templateCache.put("userList.html","<ion-view class=\"view-post\">\n    <ion-header-bar>\n        <button class=\"button button-clear icon ion-ios-arrow-back\" ng-click=\"$ionicGoBack()\"></button>\n        <div class=\"title\">{{::title}}</div>\n    </ion-header-bar>\n\n    <ion-content class=\"has-header\">\n\n    <ion-refresher\n        pulling-text=\"下拉刷新...\"\n        on-refresh=\"doRefresh()\"\n        spinner=\"spiral\">\n    </ion-refresher>\n\n    <div class=\"list card notice\" ng-repeat=\"user in users track by $index\">\n        <div class=\"item item-avatar\">\n            <img  ng-src=\"{{::user.avatar_thumb}}\"\n                ng-click=\"zoom(user.avatar_url)\">\n            <h2>{{::user.name}}\n                <span class=\"item-note\">\n                <follow-btn user=\"user\"></follow-btn>\n                </span>\n            </h2>\n        </div>\n    </div>\n    <div class=\"center-ico\" ng-if=\"users.length==0\">\n        <h1 >暂无用户</h1>\n    </div>\n    <ion-infinite-scroll\n        on-infinite=\"loadMore()\"\n        distance=\"1\"\n        spinner=\'spiral\'\n        ng-if=\"moreDataCanBeLoaded()\">\n    </ion-infinite-scroll>\n\n    </ion-content>\n</ion-view>\n");
$templateCache.put("item/items.html","<!-- 商品列表 -->\n<ion-view>\n    <div class=\"bar bar-header\">\n      <button class=\"button button-clear icon ion-ios-arrow-back\" ng-click=\"$ionicGoBack()\"></button>\n      <div class=\"title\">#{{title}}</div>\n    </div>\n    <ion-content class=\"has-header homepage\">\n        <ion-refresher\n            pulling-text=\"下拉刷新...\"\n            on-refresh=\"doRefresh()\"\n            spinner=\"spiral\">\n        </ion-refresher>\n\n        <div class=\"col col-50 animated fadeIn\"\n            collection-repeat=\"item in items\" ng-click=\"goItem(item.id)\">\n            <div class=\"item item-image\">\n                <img ng-src=\"{{item.mainUrl}}\" cache-src>\n            </div>\n            <div class=\"item item-text-wrap\" href=\"#\">\n                <h2 class=\"product-title\" style=\"overflow: hidden;\">{{item.name}}</h2>\n                <p class=\"product-prices\">\n                    <span class=\"curr-price\">{{item.price | currency:\'￥\'}}</span>\n                </p>\n            </div>\n        </div>\n\n        <ion-infinite-scroll\n            on-infinite=\"loadMore()\"\n            distance=\"1\"\n            spinner=\'spiral\'\n            ng-if=\"moreDataCanBeLoaded()\">\n        </ion-infinite-scroll>\n\n        <div class=\"center-ico\" ng-if=\"isEmpty()\">\n            <i class=\"icon ion-ios-grid-view-outline\"></i>\n\n            <h1 >暂无此类商品</h1>\n        </div>\n\n    </ion-content>\n</ion-view>\n");
$templateCache.put("ngCart/addtocart.html","<div class=\"title\"\n       ng-click=\"ngCart.addItem(id, name, price, quantity, data)\"\n       ng-transclude>加入购物车</button>\n</div>\n");
$templateCache.put("ngCart/buyrightnow.html","<div class=\"title\"\n  ng-click=\"buyRightNow(id, name, price, quantity, data)\"\n  ng-transclude>确    定</button>\n</div>\n");
$templateCache.put("ngCart/checkout.html","<div class=\"buttons\">\n    <button class=\"button button-energized button-large pull-right\"  ng-click=\"showPaymentMethods()\">提交订单</button>\n</div>\n");
$templateCache.put("photogram/home.html","<ion-view class=\"view-post\">\n    <ion-header-bar class=\"bar bar-header\">\n        <button class=\"button button-clear button-dark icon ion-navicon\"\n              ng-click=\"openPopover($event)\"></button>\n        <div class=\"title\">美比</div>\n    </ion-header-bar>\n\n    <ion-content class=\"has-header\" overflow-scroll=\"false\" >\n        <ion-refresher\n            pulling-text=\"下拉刷新...\"\n            on-refresh=\"doRefresh()\"\n            spinner=\"spiral\">\n        </ion-refresher>\n        <div ng-repeat=\"post in posts track by $index\">\n            <photo-list post=\"post\"></photo-list>\n        </div>\n\n        <div class=\"center-ico\" ng-if=\"isEmpty()\">\n            <i class=\"icon ion-ios-camera\"></i>\n\n            <h1 >No photo</h1>\n        </div>\n\n        <ion-infinite-scroll\n            on-infinite=\"loadMore()\"\n            distance=\"1\"\n            spinner=\'spiral\'\n            ng-if=\"moreDataCanBeLoaded()\">\n        </ion-infinite-scroll>\n    </ion-content>\n</ion-view>\n");
$templateCache.put("photogram/ionCrop.html","<div>\n    <input type=\"file\" id=\"browseBtn\" image=\"image\" accept=\"image/*\" style=\"display: none\"/>\n</div>\n");
$templateCache.put("photogram/like_posts.html","<ion-view class=\"view-post\">\n    <ion-header-bar class=\"bar bar-header\">\n        <button class=\"button button-clear button-dark icon ion-ios-arrow-back\"\n              ng-click=\"$ionicGoBack()\"></button>\n        <div class=\"title\">赞过帖子</div>\n    </ion-header-bar>\n\n    <ion-content class=\"has-header\" overflow-scroll=\"false\">\n        <ion-refresher\n            pulling-text=\"下拉刷新...\"\n            on-refresh=\"doRefresh()\"\n            spinner=\"spiral\">\n        </ion-refresher>\n        <div class=\"list card \"\n            ng-repeat=\"post in posts track by $index\">\n            <photo-list post=\"post\"></photo-list>\n        </div>\n\n        <div class=\"center-ico\" ng-if=\"isEmpty()\">\n            <i class=\"icon ion-ios-camera\"></i>\n\n            <h1 >您还没赞过吧</h1>\n        </div>\n\n        <ion-infinite-scroll\n            on-infinite=\"loadMore()\"\n            distance=\"1\"\n            spinner=\'spiral\'\n            ng-if=\"moreDataCanBeLoaded()\">\n        </ion-infinite-scroll>\n    </ion-content>\n</ion-view>\n");
$templateCache.put("photogram/locationModal.html","<ion-modal-view id=\"ion-google-place-container\">\n    <form>\n    <div class=\"bar bar-header item-input-inset\">\n        <label class=\"item-input-wrapper\">\n            <i class=\"icon ion-ios-search placeholder-icon\"></i>\n            <input class=\"google-place-search\" type=\"search\" ng-model=\"searchQuery\"\n                placeholder=\"输入邮编或地址\">\n            <input type=\"submit\" ng-click=\"search(searchQuery)\" style=\"position: absolute; left: -9999px; width: 1px; height: 1px;\"/>\n        </label>\n        <button class=\"button button-clear\" ng-click=\"closeModal()\">\n            取消\n        </button>\n    </div></form>\n    <ion-content class=\"has-header has-header\">\n        <ion-list>\n            <ion-item type=\"item-text-wrap\" ng-click=\"setCurrentLocation()\" ng-if=\"displayCurrentLocation\">\n                <i class=\"icon ion-ios-location\"></i> 获取当前位置\n            </ion-item>\n            <ion-item ng-repeat=\"location in locations\" type=\"item-text-wrap\" ng-click=\"selectLocation(location)\">\n                {{location}}\n            </ion-item>\n        </ion-list>\n    </ion-content>\n</ion-modal-view>\n");
$templateCache.put("photogram/my_posts.html","<ion-view class=\"view-post\">\n    <ion-header-bar class=\"bar bar-header\">\n        <button class=\"button button-clear button-dark icon ion-ios-arrow-back\"\n              ng-click=\"$ionicGoBack()\"></button>\n        <div class=\"title\">我的发布</div>\n    </ion-header-bar>\n\n    <ion-content class=\"has-header\" overflow-scroll=\"false\">\n        <ion-refresher\n            pulling-text=\"下拉刷新...\"\n            on-refresh=\"doRefresh()\"\n            spinner=\"spiral\">\n        </ion-refresher>\n        <div class=\"list card \"\n            ng-repeat=\"post in posts track by $index\">\n            <photo-list post=\"post\"></photo-list>\n        </div>\n\n        <div class=\"center-ico\" ng-if=\"isEmpty()\">\n            <i class=\"icon ion-ios-camera\"></i>\n\n            <h1 >您还没发布过</h1>\n        </div>\n\n        <ion-infinite-scroll\n            on-infinite=\"loadMore()\"\n            distance=\"1\"\n            spinner=\'spiral\'\n            ng-if=\"moreDataCanBeLoaded()\">\n        </ion-infinite-scroll>\n        <!--<div ng-if=\"!moreDataCanBeLoaded()\" class=\"item item-divider no-more-data\">没有更多数据啦!</div>-->\n\n    </ion-content>\n</ion-view>\n");
$templateCache.put("photogram/photoFilter.html","<div>\n    <div class=\"capture-photo\">\n        <img ng-src=\"{{image}}\" id=\"original-image\" style=\"display:none\">\n        <div vin\n            filter=\"\'normal\'\"\n            class=\"image\"\n            ng-class=\"{disabled: loading}\"\n            name=\"vin-image\"\n            image=\"image\"></div>\n        <ion-spinner ng-show=\"loading\"></ion-spinner>\n    </div>\n</div>\n");
$templateCache.put("photogram/photoFilterCarousel.html","<ion-scroll direction=\"x\" scrollbar-x=\"false\" class=\"wide-as-needed  photo-carousel\">\n    <a ng-click=\"applyFilter(\'normal\')\" >\n        <div class=\"image\">\n            <img ng-src=\"img/vintage/normal.jpg\" id=\"normal\" >\n        </div>\n        <p>原图</p>\n    </a>\n    <a ng-repeat=\"(filter, cn) in filters\" ng-click=\"applyFilter(filter)\" >\n        <div class=\"image\">\n            <img ng-src=\"img/vintage/{{filter}}.jpg\" id=\"{{filter}}\" >\n        </div>\n        <p>{{ cn }}</p>\n    </a>\n</ion-scroll>\n");
$templateCache.put("photogram/photoList.html","<div class=\"list card\"  ng-click=\"goPost()\">\n    <div class=\"item item-avatar\" ion-affix data-affix-within-parent-with-class=\"card\">\n        <img  ng-src=\"{{post.user.avatar_thumb}}\" ng-click=\"$event.stopPropagation();goUser()\">\n        <h2>{{post.user.name}}\n            <div class=\"post-type\" ng-class=\"{{\'post.type.en\'}}\">\n                <i class=\"icon ion-bookmark\"></i> {{post.type.cn}}\n            </div>\n            <span class=\"item-note\">{{post.created_at | amTimeAgo}}</span>\n        </h2>\n    </div>\n\n    <div class=\"item item-image\" >\n        <img ng-src=\"{{post.large_url}}\"\n            ng-click=\"$event.stopPropagation();zoom()\">\n    </div>\n    <div class=\"item item-body\">\n        <p show-more=\'40\' class=\"post-body\" title=\"post.title\"></p>\n    </div>\n\n\n    <div class=\"item item-buttons\">\n        <div class=\"row\">\n            <div class=\"col col-50 text-left\">\n                <button ng-click=\"$event.stopPropagation();like()\"\n                    ng-class=\"post.is_liked ? \'ion-ios-heart\' : \'ion-ios-heart-outline\' \"\n                    class=\"button button-clear button-dark icon-left button-heart\">\n                    {{post.num_likes || \'喜欢\'}}\n                </button>\n                <button ng-click=\"\"\n                    class=\"button button-clear button-dark icon-left ion-ios-chatbubble-outline\">\n                    {{post.num_comments || \'评论\'}}\n                </button>\n                <button ng-click=\"$event.stopPropagation();actions()\"\n                    class=\"button button-clear button-dark icon-left ion-ios-more\" >\n                </button>\n            </div>\n            <div class=\"col col-50 text-left\">\n                <button ng-click=\"$event.stopPropagation();sameCity()\"\n                        ng-if=\"post.location\"\n                    class=\"button button-clear button-dark icon-left ion-ios-location\">\n                    <span>{{::post.location}}</span>\n                </button>\n            </div>\n        </div>\n    </div>\n    <div class=\"tag-row\" style=\"margin-left:12px\">\n        <button class=\"button button-small button-stable tag\"\n            ng-repeat=\"tag in post.tags track by $index\"\n            ng-click=\"$event.stopPropagation();searchTag(tag)\">\n            {{::tag}}\n        </button>\n    </div>\n    <div class=\"item item-divider\"></div>\n</div>\n");
$templateCache.put("photogram/photoListNoAffix.html","<div class=\"list card\"  ng-click=\"goPost()\">\n    <div class=\"item item-avatar\">\n        <img  ng-src=\"{{::post.user.avatar_thumb}}\" ng-click=\"$event.stopPropagation();goUser()\">\n        <h2>{{::post.user.name}}\n            <div class=\"post-type\" ng-class=\"{{\'post.type.en\'}}\">\n                <i class=\"icon ion-bookmark\"></i> {{::post.type.cn}}\n            </div>\n            <span class=\"item-note\">{{::post.created_at | amTimeAgo}}</span>\n        </h2>\n    </div>\n\n    <div class=\"item item-image\" >\n        <img ng-src=\"{{::post.large_url}}\"\n            ng-click=\"$event.stopPropagation();zoom()\">\n    </div>\n    <div class=\"item item-body\">\n        <p show-more=\'40\' class=\"post-body\" title=\"post.title\"></p>\n    </div>\n\n\n    <div class=\"item item-buttons\">\n        <div class=\"row\">\n            <div class=\"col col-50 text-left\">\n                <button ng-click=\"$event.stopPropagation();like()\"\n                    ng-class=\"post.is_liked ? \'ion-ios-heart\' : \'ion-ios-heart-outline\' \"\n                    class=\"button button-clear button-dark icon-left button-heart\">\n                    {{post.num_likes || \'喜欢\'}}\n                </button>\n                <button ng-click=\"\"\n                    class=\"button button-clear button-dark icon-left ion-ios-chatbubble-outline\">\n                    {{post.num_comments || \'评论\'}}\n                </button>\n                <button ng-click=\"$event.stopPropagation();actions()\"\n                    class=\"button button-clear button-dark icon-left ion-ios-more\" >\n                </button>\n            </div>\n            <div class=\"col col-50 text-left\">\n                <button ng-click=\"$event.stopPropagation();sameCity()\" ng-if=\"post.location\"\n                    class=\"button button-clear button-dark icon-left ion-ios-location\">\n                    <span>{{::post.location}}</span>\n                </button>\n            </div>\n        </div>\n    </div>\n    <div class=\"tag-row\" style=\"margin-left:12px\">\n        <button class=\"button button-small button-stable tag\"\n            ng-repeat=\"tag in post.tags track by $index\"\n            ng-click=\"$event.stopPropagation();searchTag(tag)\">\n            {{::tag}}\n        </button>\n    </div>\n    <div class=\"item item-divider\"></div>\n</div>\n");
$templateCache.put("photogram/photoTag.html","<div class=\"photo-tag\">\n    <div class=\"send\">\n        <div class=\"arrow\"></div>\n        选择下面一种标签..\n    </div>\n    <div class=\"row\">\n        <div class=\"col col-33\" ng-click=\"selectType(\'SERVICE\')\">\n            <div tag-select tag-type=\"SERVICE\" ng-model=\"tags\"\n                class=\"tag tag-service\"\n                ng-class=\"type==\'SERVICE\'? \'selected\':\'unselect\'\"></div>\n            <p ng-class=\"type==\'SERVICE\'? \'selected\':\'\'\">服务</p>\n        </div>\n        <div class=\"col col-33\" ng-click=\"selectType(\'SHOW\')\">\n            <div tag-select tag-type=\"SHOW\" ng-model=\"tags\"\n                class=\"tag tag-show\"\n                ng-class=\"type==\'SHOW\'? \'selected\':\'unselect\'\"></div>\n            <p ng-class=\"type==\'SHOW\'? \'selected\':\'\'\">心情</p>\n        </div>\n        <div class=\"col col-33\" ng-click=\"selectType(\'TRADE\')\">\n            <div tag-select tag-type=\"TRADE\" ng-model=\"tags\"\n                class=\"tag tag-trade\"\n                ng-class=\"type==\'TRADE\'? \'selected\':\'unselect\'\"></div>\n            <p ng-class=\"type==\'TRADE\'? \'selected\':\'\'\">买卖</p>\n        </div>\n\n    </div>\n</div>\n");
$templateCache.put("photogram/popover.html","<ion-popover-view class=\"photo-popover\">\n  <ion-content>\n\n    <ion-list>\n      <ion-item ng-click=\"changeTab(\'\')\">\n          全部\n      </ion-item>\n      <ion-item ng-click=\"changeTab(\'service\')\">\n          服务\n      </ion-item>\n      <ion-item ng-click=\"changeTab(\'trade\')\">\n          买卖\n      </ion-item>\n      <ion-item ng-click=\"changeTab(\'show\')\">\n          心情\n      </ion-item>\n    </ion-list>\n\n  </ion-content>\n</ion-popover-view>\n");
$templateCache.put("photogram/postDetail.html","<ion-view class=\"view-post\">\n    <ion-header-bar>\n        <button class=\"button button-clear button-dark icon ion-ios-arrow-back\"\n              ng-click=\"$ionicGoBack()\"></button>\n        <div class=\"title\">详情</div>\n        <button class=\"button button-clear button-dark icon ion-ios-more\"\n              ng-click=\"actions()\"></button>\n    </ion-header-bar>\n\n    <ion-content class=\"has-header has-footer\" overflow-scroll=\"false\" >\n\n\n    <div class=\"list card animated fadeIn\">\n        <div class=\"item item-avatar\">\n            <img  ng-src=\"{{::post.user.avatar_thumb}}\" ng-click=\"goUser(post.user.id)\">\n            <h2>{{::post.user.name}}\n                <div class=\"post-type\"\n                    ng-class=\"post.type?post.type.en:\'UNCLASSIFIED\'\" >\n                    <i class=\"icon ion-bookmark\"></i> {{::post.type.cn}}\n                </div>\n                <span class=\"item-note\">{{::post.created_at | amTimeAgo}}</span>\n            </h2>\n        </div>\n\n        <div class=\"item item-image full-height\"\n            ng-repeat=\"img in images\"\n            ng-click=\"zoom(img)\" >\n            <img ng-src=\"{{::img}}\">\n        </div>\n\n        <div class=\"item item-body\">\n            <p class=\"post-body\" ng-bind-html=\"post.title || \'\' | nl2br\">\n        </div>\n\n        <div class=\"item item-buttons\">\n            <div class=\"row\">\n                <div class=\"col col-60 text-left\">\n                    <button ng-click=\"sameCity()\" ng-if=\"post.location\"\n                        class=\"button button-clear button-dark icon-left ion-ios-location\">\n                        <span>{{::post.location}}</span>\n                    </button>\n                </div>\n                <div class=\"col col-40 text-right\">\n                    <button ng-click=\"like()\"\n                        ng-class=\"post.is_liked ? \'ion-ios-heart\' : \'ion-ios-heart-outline\' \"\n                        class=\"button button-clear button-dark icon-left button-heart\">\n                        {{post.num_likes || \'喜欢\'}}\n                    </button>\n                    <button\n                        class=\"button button-clear button-dark icon-left ion-ios-chatbubble-outline\">\n                        {{post.num_comments || \'评论\'}}\n                    </button>\n                </div>\n            </div>\n        </div>\n        <div class=\"tag-row\" style=\"margin-left:12px\">\n            <button class=\"button button-small button-stable tag\"\n                ng-repeat=\"tag in post.tags\"\n                ng-click=\"searchTag(tag)\">\n                {{::tag}}\n            </button>\n        </div>\n    </div>\n\n    <div class=\"list avatar-row\">\n        <div class=\"avatar-list\">\n            <div class=\"avatar-pic\" ng-repeat=\"like in post.likes|limitTo:7\">\n                <img ng-src=\"{{::like.user.avatar_thumb}}\" ng-click=\"goUser(like.user.id)\">\n            </div>\n        </div>\n        <div class=\"more\" >\n            <a ng-href=\"#/userList/{{::post.post_id}}/postLikes\">\n                <img src=\"img/icons/more.jpg\">\n            </a>\n        </div>\n    </div>\n\n    <div class=\"item item-divider\"></div>\n    <div class=\"list\">\n        <div class=\"item item-avatar\" ng-repeat=\"comment in post.comments\" ng-click=\"deleteComment(comment)\">\n            <img ng-src=\"{{::comment.user.avatar_thumb}}\" ng-click=\"goUser(comment.user.id)\">\n            <h2>{{::comment.user.name}}\n                <span class=\"item-note\">\n                    {{::comment.created_at | amTimeAgo}}\n                </span>\n\n            </h2>\n            <p>{{::comment.content}}</p>\n\n        </div>\n    </div>\n    </ion-content>\n\n    <ion-footer-bar keyboard-attach  class=\"bar bar-stable item-input-inset\">\n        <button ng-click=\"like()\"\n            ng-class=\"post.is_liked ? \'ion-ios-heart\' : \'ion-ios-heart-outline\' \"\n            class=\"button button-clear button-icon \">\n        </button>\n        <label class=\"item-input-wrapper\">\n          <input ng-model=\"message\" placeholder=\"说些什么\" type=\"text\"/>\n        </label>\n        <button class=\"button button-clear button-icon\" ng-click=\"comment()\">评论</button>\n    </ion-footer-bar>\n</ion-view>\n");
$templateCache.put("photogram/postModal.html","<ion-modal-view class=\"modal-post\">\n    <ion-header-bar>\n        <button class=\"button button-clear button-dark\" ng-click=\"closePost()\">取消</button>\n        <div class=\"title\">发布信息</div>\n    </ion-header-bar>\n    <ion-scroll direction=\"y\" style=\"right: 0;bottom: 0;left: 0;position: absolute;\"\n        class=\"has-header has-footer\">\n        <div class=\"list\">\n            <div class=\"item item-input post-textarea wide-as-needed primary_image\">\n                <a ng-click=\"editImage(form.primary_image)\" style=\"bottom: 16px;\">\n                    <div class=\"image\" style=\"background-image: url({{form.primary_image}});\n                                background-position: center;\n                                background-repeat: no-repeat;\n                                background-size: cover;\">\n                    </div>\n                </a>\n                <textarea ng-model=\"form.title\" autofocus placeholder=\"描述一下吧\"></textarea>\n            </div>\n            <div class=\"item item-divider\"></div>\n\n            <ion-item class=\"item item-icon-left item-icon-right\" ng-click=\"getLocation()\">\n                <i class=\"icon ion-ios-location\"></i>\n                发布于\n                <div class=\"item-note\">\n                    <ion-google-place placeholder=\"输入地址或邮编\"\n                        ng-model=\"form.location\"\n                        geocode=\"form.geo\"\n                        current-location=\"true\" ></ion-google-place>\n                </div>\n                <i class=\"icon ion-ios-arrow-right\"></i>\n            </ion-item>\n            <div class=\"item item-icon-left item-icon-right item-tag\" ng-model=\"form.tags\" tag-type=\"{{form.type}}\" tag-select>\n                <i class=\"icon ion-ios-pricetags energized\"></i>\n                标签\n                <div class=\"item-note\">\n                    添加\n                </div>\n                <i class=\"icon ion-ios-arrow-right\"></i>\n            </div>\n            <div class=\"tag-row\" style=\"margin-left:12px\">\n                <span class=\"tag selected\"\n                    ng-repeat=\"tag in form.tags\"\n                    ng-click=\"setOption(tag)\">\n                    {{tag}} <i class=\"ion-ios-close-empty\"></i>\n                </span>\n            </div>\n            <!--<div class=\"row tag-row\">\n                <div class=\"col col-20 tag-text\">推荐标签</div>\n                <div class=\"col col-80\">\n                    <ion-scroll direction=\"x\" scrollbar-x=\"false\">\n                        <div style=\"width:400px\">\n                            <span class=\"tag\"\n                                ng-repeat=\"tag in [\'买卖\',\'服务\',\'房屋\',\'心情\',\'晒\', \'约\']\"\n                                ng-click=\"setOption(tag)\">\n                                {{tag}} <i class=\"ion-ios-plus-empty\"></i>\n                            </span>\n                        </div>\n                    </ion-scroll>\n                </div>\n            </div>-->\n            <div class=\"item item-input item-stacked-label\">\n                <div class=\"input-label\">补充图片\n                    <div class=\"add-image\"\n                        ng-click=\"increasePhotosModal()\"\n                        ng-show=\"form.photos.length < 4\">\n                        <i class=\"icon ion-ios-plus-empty\"></i>\n                    </div>\n                </div>\n                <ion-scroll direction=\"x\" scrollbar-x=\"false\" class=\"wide-as-needed\">\n                    <a ng-repeat=\"photo in form.photos track by $index\">\n                       <i class=\"icon ion-ios-close\"\n                           ng-click=\"editAdditionImage($index)\" ></i>\n                        <div class=\"image add\" style=\"background-image: url({{photo}});\n                                    background-position: center;\n                                    background-repeat: no-repeat;\n                                    background-size: cover;\">\n                        </div>\n                    </a>\n                </ion-scroll>\n            </div>\n        </div>\n\n    </ion-scroll>\n    <ion-footer-bar class=\"bar-assertive footer-button\"\n        ng-click=\"submitPost(form)\" keyboard-attach >\n        <div class=\"title\">发表 <i class=\"icon ion-arrow-right-c\"></i></div>\n    </ion-footer-bar>\n</ion-modal-view>\n");
$templateCache.put("photogram/tagsModal.html"," <ion-modal-view class=\"tag-modal\">\n    <ion-header-bar>\n        <button class=\"button button-clear button-dark\" ng-click=\"closeModal()\">取消</button>\n        <div class=\"title\">添加标签</div>\n        <button class=\"button button-clear button-dark\" ng-click=\"confirmTags()\">确定</button>\n    </ion-header-bar>\n    <div class=\"bar bar-subheader item-input-inset\">\n        <label class=\"item-input-wrapper\">\n            <i class=\"icon ion-ios-search placeholder-icon\"></i>\n            <input type=\"search\" placeholder=\"搜索或添加新标签\" ng-model=\"ui.searchQuery\">\n        </label>\n        <button class=\"button button-clear button-icon icon ion-ios-close-empty\"\n            ng-click=\"clearSearch()\">\n        </button>\n    </div>\n\n    <ion-content class=\"has-subheader has-header has-footer\">\n        <div class=\"list\">\n            <ion-item ng-click=\"addNewTag()\" ng-if=\"ui.searchQuery\">\n                <i class=\"icon ion-ios-plus-empty\"></i> 添加新标签: {{ui.searchQuery}}\n            </ion-item>\n            <div class=\"item item-divider\">{{options.name}}</div>\n            <div class=\"item item-icon-right\"\n                ng-repeat=\"tag in options.tag_list | filter: ui.searchQuery\"\n                ng-click=\"setOption(tag)\">\n                {{tag}}\n                <i class=\"icon select-icon\"\n                    ng-class=\"compareValues(tag)? \'ion-ios-checkmark selected\':\'ion-ios-circle-outline\'\">\n                </i>\n            </div>\n        </div>\n    </ion-content>\n    <ion-footer-bar align-title=\"left\" class=\"bar bar-stable\">\n        <span class=\"button button-clear\">\n        已选：\n            <button class=\"button button-light icon-right ion-ios-close-empty tag\"\n                ng-repeat=\"tag in ui.checkedTags\"\n                ng-click=\"setOption(tag)\">\n                {{tag}}\n            </button>\n        </span>\n    </ion-footer-bar>\n\n</ion-modal-view>\n");
$templateCache.put("user/followButton.html","<div class=\"follow_btn\" ng-if=\"currentUserID != user.id\">\n    <button class=\"button button-small button-outline\"\n        ng-class=\"user.is_following?\'\' :\'button-energized\'\" ng-click=\"follow()\">{{user.is_following? \"已关注\":\"关注\"}}</button>\n\n</div>\n");}]);
'use strict';
PhotoService.$inject = ['$ionicActionSheet', 'ENV', '$jrCrop', '$rootScope', '$http', '$ionicModal', '$cordovaCamera', '$cordovaImagePicker', '$q'];
ionCropDirective.$inject = ['$jrCrop', '$ionicActionSheet'];
PhotoFilterFactory.$inject = ['$rootScope', '$q', '$ionicModal'];
vintageDirective.$inject = ['Vintage', '$timeout'];
photoFilterCarouselDirective.$inject = ['Vintage', '$timeout'];
Vintage.$inject = ['$q'];
angular
    .module('ion-photo', [
      'ionic',
      'ngCordova',
      'jrCrop'
    ])
    .factory('PhotoService', PhotoService)
    // Photo Crop
    .directive('ionCrop', ionCropDirective)
    // Photo Filter
    .factory('PhotoFilter', PhotoFilterFactory)
    .directive('vin', vintageDirective)
    .directive('photoFilter', photoFilterDirective)
    .directive('photoTag', photoTag)
    .directive('photoCarousel', photoFilterCarouselDirective)
    .factory('Vintage', Vintage);

function PhotoService($ionicActionSheet, ENV, $jrCrop, $rootScope, $http,
        $ionicModal, $cordovaCamera, $cordovaImagePicker, $q) {

    // Default Setting
    var setting = {
      jrCrop: false,
      quality: 80,
      allowEdit: false,
      correctOrientation: true,
      targetWidth: 800,
      targetHeight: 800,
      saveToPhotoAlbum: false,
      allowRotation: false,
      aspectRatio: 0
    };

    return {
      open: open,
      crop: cropModal,
      filter: filterModal,
      upload: uploadToS3,
    };

    function open(options) {
        var defer = $q.defer();
        var options = options || {};

        if (window.cordova) {
            capture(options)
                .then(function (image) {
                    console.log('resolved image');
                    defer.resolve(image);
                })
        } else {
            $rootScope.$broadcast('alert', "请到设置允许打开相机");
        }

        function capture(option) {
            var defer = $q.defer();

            // Primary Image
            if ((option.pieces === 1 && option.allowFilter === true) || option.allowEdit === true) {
                var options = {
                    quality: option.quality ? option.quality : setting.quality,
                    aspectRatio: option.aspectRatio ? option.aspectRatio : setting.aspectRatio,
                    allowRotation: option.allowRotation ? option.allowRotation : setting.allowRotation,
                    allowEdit: option.allowEdit ? option.allowEdit : setting.allowEdit,
                    correctOrientation: option.correctOrientation ? option.correctOrientation : setting.correctOrientation,
                    targetWidth: option.width ? option.width : setting.targetWidth,
                    targetHeight: option.height ? option.height : setting.targetHeight,
                    saveToPhotoAlbum: option.saveToPhotoAlbum ? option.saveToPhotoAlbum : setting.saveToPhotoAlbum,
                    destinationType: window.cordova ? Camera.DestinationType.DATA_URL : null,
                    encodingType: window.cordova ? Camera.EncodingType.JPEG : null,
                    popoverOptions: window.cordova ? CameraPopoverOptions : null,
                };
                options.sourceType = Camera.PictureSourceType.PHOTOLIBRARY;
                $cordovaCamera
                    .getPicture(options)
                    .then(function (imageData) {
                        defer.resolve('data:image/jpeg;base64,'+imageData);
                    }, function (err) {
                        defer.reject('Error When taking Photo:' + err);
                    });
            }
            // Multi Select
            if (option.allowFilter === false) {
                var options = {
                   maximumImagesCount: option.pieces,
                   width: option.width ? option.width : setting.targetWidth,
                   height: option.height ? option.height : setting.targetHeight,
                   quality: option.quality ? option.quality : setting.quality,
                   outputType: imagePicker.OutputType.BASE64_STRING,
                };

                if (ionic.Platform.isAndroid()) {
                    //options.outputType = imagePicker.OutputType.FILE_URI;
                } else {
                    options.outputType = imagePicker.OutputType.BASE64_STRING;
                }

                $cordovaImagePicker.getPictures(options)
                    .then(function (results) {
                        var imgs = [];
                        for (var i = 0; i < results.length; i++) {
                            imgs.push('data:image/jpeg;base64,'+results[i].replace(/(\r\n|\n|\r)/g, ""));
                        }
                        defer.resolve(imgs);
                    }, function(error) {
                        defer.reject('error when choosing photos: '+ error);
                    });
            }

            console.log('capture image', options);

            return defer.promise;
        }

        return defer.promise;
    }

    function cropModal(image, option) {
        var defer = $q.defer();
        $jrCrop.crop({
            url: image,
            aspectRatio: option.aspectRatio ? option.aspectRatio : false,
            allowRotation: option.allowRotation ? option.allowRotation : false,
            width: option.width ? option.width : setting.targetWidth,
            height: option.height ? option.height : setting.targetHeight,
            cancelText: '取消',
            chooseText: '确定'
        }).then(function(canvas) {
            defer.resolve(canvas);
        })

        return defer.promise;
    }

    function filterModal(image, callback) {
        //image = 'data:image/jpeg;base64,' + image;

        var template = '<ion-modal-view class="modal-capture"><ion-header-bar class="bar bar-header">'+
            '<button class="button button-clear button-icon ion-ios-arrow-back" ng-click="closeFilter()"></button><div class="title"></div>' +
            '<button class="button button-icon " ng-click="submitFilter()">下一步</button>' +
            '</ion-header-bar><ion-content class="has-header has-carousel"><photo-filter image="image" loading="loading"></photo-filter></ion-content>'+
            '<div class="bar bar-subfooter bar-carousel">'+
            '<photo-tag tags="form.tags" type="form.type" ng-if="currentTab==\'标签\'"></photo-tag>'+
            '<photo-carousel image="image" loading="loading" ng-if="currentTab==\'滤镜\'"></photo-carousel></div>'+
            '<div class="bar bar-footer">' +
            '<div class="bar-filter" ng-repeat="tab in [\'标签\', \'滤镜\']" ng-click="changeTab(tab)">'+
            '<div class="footer-tab" ng-class="{\'active\': currentTab==tab}" >{{tab}}</div>'+
            '</div></div>'+
            '</ion-modal-view>';
        var scope = $rootScope.$new(true);

        scope.image = image;
        scope.form = {
            photo: '',
            tags: [],
            type: '',
        };

        scope.submitFilter = function() {
            if (!scope.form.type){
                scope.$emit('alert', '请选择一个标签');
                return
            }
            var canvas = document.getElementById('vin-image'); //
            console.log('Submit Filter');
            scope.form.photo = canvas.src;
            callback(scope.form);
            scope.closeFilter();
        };

        scope.closeFilter = function(){
            console.log('Close Modal Filter');
            scope.modalFilter.hide();
            scope.modalFilter.remove();
        };

        scope.currentTab = '标签';
        scope.changeTab = function(tab){
            scope.currentTab = tab;
        };

        scope.modalFilter = $ionicModal.fromTemplate(template, {
            scope: scope
        });
        scope.modalFilter.show();
    }

    function dataURItoBlob(dataURI) {
	    var binary = atob(dataURI.split(',')[1]);
	    var array = [];
	    for (var i = 0; i < binary.length; i++) {
	        array.push(binary.charCodeAt(i));
	    }

	    var mimeString = 'image/jpeg';
	    return new Blob([new Uint8Array(array)], {
	        type: mimeString
	    });
	}

    function uploadToS3(imageData, filename, successCallback, failCallback) {
        var data = dataURItoBlob(imageData);
        var bucket = new AWS.S3({
            params: {
                Bucket: 'maybi-img'
            }
        });
        var params = {
            Key: filename,
            Body: data,
            ContentEncoding: 'base64',
            ContentType: 'image/jpeg',
            ACL: "public-read",
        };

        bucket.putObject(params, function(err, data) {
            if (err) {
                //console.log(JSON.stringify(err));
                failCallback(err);
            } else {
                //data.Location is your s3 image path
                //console.log(JSON.stringify(data));
                successCallback(data);
            }
        }).on('httpUploadProgress',function(progress) {
            // Log Progress Information
            console.log(Math.round(progress.loaded / progress.total * 100) + '% done');
        });
    }

    function uploadThumbnails(imageData, filename) {

        window.imageResizer.resizeImage(
            successCallback,
            function (error) {
                console.log("Error : \r\n" + error);
            }, imageData, 400, 400, {
                resizeType: ImageResizer.RESIZE_TYPE_MAX_PIXEL,
                imageDataType: ImageResizer.IMAGE_DATA_TYPE_BASE64,
                format: 'jpeg',
                quality: 100,
            }
        );

        function successCallback(data){
            var bucket = new AWS.S3({
                params: {
                    Bucket: 'maybi'
                }
            });
            var params = {
                Key: '400/'+filename,
                Body: data.imageData,
                ContentEncoding: 'base64',
                ContentType: 'image/jpeg',
                ACL: "public-read",
            };

            bucket.putObject(params, function(err, data) {
                if (err) {
                    //console.log(JSON.stringify(err));
                } else {
                    //data.Location is your s3 image path
                    //console.log(JSON.stringify(data));
                }
            }).on('httpUploadProgress',function(progress) {
                // Log Progress Information
                console.log(Math.round(progress.loaded / progress.total * 100) + '% done');
            });
        }


    }

}

// jrCrop
function ionCropDirective($jrCrop, $ionicActionSheet) {

    return {
        restrict: 'A',
        scope: {
            ngModel: '=',
            option: '=',
            cropSave: '&'
        },
        templateUrl: 'photogram/ionCrop.html',
        link: ionCropLink
    };

    function ionCropLink(scope, element) {

        // Triggered on a button click, or some other target
        scope.action = action;
        element.bind('click', getElem);
        scope.crop = crop;
        angular.element(document.getElementById('browseBtn'))
            .on('change', fileUpload);


        function getElem() {
            document.getElementById('browseBtn').click();
        }

        // Show the action sheet
        function action() {
            var buttons = [{
                text: '<i class="icon ion-camera"></i> 拍照'
            }, {
                text: '<i class="icon ion-images"></i> 相册'
            }];
            $ionicActionSheet.show({
              buttons: buttons,
              titleText: '裁剪',
              cancelText: '取消',
              buttonClicked: function (index) {

                if (index === 0) {
                  console.log('Photo Camera');
                }
                // Photo Album
                if (index === 1) {
                  document.getElementById('browseBtn')
                    .click();
                }
                return true;
              }
            });
        }

        function fileUpload(e) {

            var file = e.target.files[0];
            var reader = new FileReader();
            reader.readAsDataURL(file);

            reader.onload = function (event) {
              var image = event.target.result;
              scope.crop(image);
            };

            // Clear input file
            angular.element(document.getElementById('browseBtn'))
                .val('');

        }

        function crop(image) {

            console.log(scope.option);

            $jrCrop.crop({
                url: image,
                width: scope.option ? scope.option.width : 200,
                height: scope.option ? scope.option.height : 200,
                cancelText: 'Cancel',
                chooseText: 'Save'
            }).then(function (canvas) {
                var image = canvas.toDataURL();
                //            var name = $scope.option ? $scope.option.name : 'thumb';
                //            var filename = ($scope.option ? $scope.option.name : '') + '_' + name + window.Number(new window.Date() + '.jpg';

                //var file = base64ToBlob(image.replace('data:image/png;base64,', ''), 'image/jpeg');
                //            file.name = filename;

                //upload(file);
                console.log(image);
                scope.ngModel = image;
            });

        }
    }
}

// Photo Filter
function PhotoFilterFactory($rootScope, $q, $ionicModal) {

    return {
        load: modalFilter
    };

    function modalFilter(image, done) {
        var template =
            '<ion-modal-view class="modal-capture"><ion-header-bar>'+
            '<button class="button button-clear button-icon ion-ios-arrow-back" ng-click="closeCapture()"></button>'+
            '<div class="title"></div>' +
            '<button class="button button-icon " ng-click="submitCapture()">下一步</button>' +
            '</ion-header-bar><ion-content><photo-filter image="form.photo"></photo-filter></ion-content></ion-modal-view>';


        var image = image.toDataURL();

        var scope = $rootScope.$new(true);
        scope.closeCapture = closeModalCapture;
        scope.submitCapture = submitCapture;
        scope.form = {
            photo: image
        };

        scope.modal = $ionicModal.fromTemplate(template, {
            scope: scope
        });

        scope.modal.show();

        function submitCapture() {
            var canvas = document.getElementById('vin-image');
            var dataUrl = canvas.src;
            done(dataUrl);
            closeModalCapture();
        }

        function closeModalCapture() {
            scope.modal.hide();
            scope.modal.remove();
        }
    }
}

function photoFilterDirective() {
    return {
      restrict: 'E',
      scope: {
        image: '=',
        loading: '='
      },
      transclude: true,
      templateUrl: 'photogram/photoFilter.html'
    };
}

function photoFilterCarouselDirective(Vintage, $timeout) {
    return {
        restrict: 'E',
        scope: {
            image: '=',
            loading: '='
        },
        templateUrl: 'photogram/photoFilterCarousel.html',
        link: function (scope, elem, attrs) {
            scope.filters = Vintage.filters;
            scope.applyFilter = function(effect) {
                var originalImage = document.getElementById('original-image');
                var currImage = document.getElementById('vin-image');
                currImage.src = originalImage.src;
                scope.loading = true;
                if (effect == 'normal') {
                    scope.loading = false;
                } else {
                    Vintage.effect(effect).
                        then(function(resp){
                          scope.loading = false;
                        })
                }
            }
        }
    };
}

function photoTag() {
    return {
        restrict: 'E',
        scope: {
            tags: '=',
            type: '=',
        },
        templateUrl: 'photogram/photoTag.html',
        link: function (scope, elem, attrs) {
            scope.tags = [];
            scope.selectType = function(type){
                scope.type = type;
            }
        }
    };
}

function vintageDirective(Vintage, $timeout) {
    return {
      restrict: 'A',
      scope: {
        filter: '=',
        name: '@',
        image: '=',
        loading: '='
      },
      template: '<img ng-src="{{ image }}" id="{{ name }}">',
    };
}

function Vintage($q){
    var vintagePresetsCN = {
      'vintage': '葡萄',
      'sepia': '褐色',
      'greenish': '绿意',
      'reddish': '泛红',
      'random': '随机',
    };


    var vintagePresets = {
      /**
       * Basic vintage effect
       */
      vintage: {
        curves: (function() {
          var rgb = function (x) {
            return -12 * Math.sin( x * 2 * Math.PI / 255 ) + x;
          },
          r = function(x) {
            return -0.2 * Math.pow(255 * x, 0.5) * Math.sin(Math.PI * (-0.0000195 * Math.pow(x, 2) + 0.0125 * x ) ) + x;
          },
          g = function(x) {
            return -0.001045244139166791 * Math.pow(x,2) + 1.2665372554875318 * x;
          },
          b = function(x) {
            return 0.57254902 * x + 53;
          },
          c = {r:[],g:[],b:[]};
          for(var i=0;i<=255;++i) {
            c.r[i] = r( rgb(i) );
            c.g[i] = g( rgb(i) );
            c.b[i] = b( rgb(i) );
          }
          return c;
        })(),
        screen: {
          r: 227,
          g: 12,
          b: 169,
          a: 0.15
        },
        vignette: 0.7,
        viewFinder: false // or path to image 'img/viewfinder.jpg'
      },
      /**
       * Sepia effect
       */
      sepia: {
        curves: (function() {
          var rgb = function (x) {
            return -12 * Math.sin( x * 2 * Math.PI / 255 ) + x;
          },
          c = {r:[],g:[],b:[]};
          for(var i=0;i<=255;++i) {
            c.r[i] = rgb(i);
            c.g[i] = rgb(i);
            c.b[i] = rgb(i);
          }
          return c;
        })(),
        sepia: true
      },
      /**
       * Greenish effect
       */
      greenish: {
        curves: (function() {
          var rgb = function (x) {
            return -12 * Math.sin( x * 2 * Math.PI / 255 ) + x;
          },
          c = {r:[],g:[],b:[]};
          for(var i=0;i<=255;++i) {
            c.r[i] = rgb(i);
            c.g[i] = rgb(i);
            c.b[i] = rgb(i);
          }
          return c;
        })(),
        vignette: 0.6,
        lighten: 0.1,
        screen: {
          r: 255,
          g: 255,
          b: 0,
          a: 0.15
        }
      },
      /**
       * Reddish effect
       */
      reddish: {
        curves: (function() {
          var rgb = function (x) {
            return -12 * Math.sin( x * 2 * Math.PI / 255 ) + x;
          },
          c = {r:[],g:[],b:[]};
          for(var i=0;i<=255;++i) {
            c.r[i] = rgb(i);
            c.g[i] = rgb(i);
            c.b[i] = rgb(i);
          }
          return c;
        })(),
        vignette: 0.6,
        lighten: 0.1,
        screen: {
          r: 255,
          g: 0,
          b: 0,
          a: 0.15
        }
      },
      random: function () {
        var d = [!1, "assets/images/viewfinder.jpg"],
            g = 30 - Math.floor(60 * Math.random()),
            a = 30 - Math.floor(60 * Math.random()),
            h = function () {
                if (0.5 <= Math.random()) return !1;
                for (var a = 5 <= Math.random(), d = 5 <= Math.random() ? d : function (a) {
                    return a
                }, g = a ? g : function (a) {
                    return a
                }, h = a ? h : function (a) {
                    return a
                }, k = a ? k : function (a) {
                    return a
                }, a = {
                    r: [],
                    g: [],
                    b: []
                }, p = 0; 255 >= p; ++p) a.r[p] =
                g(d(p)),
                a.g[p] = h(d(p)),
                a.b[p] = k(d(p));
                return a
            }(),
            k;
        k = 0.5 <= Math.random() ? !1 : {
                r: Math.floor(255 * Math.random()),
                g: Math.floor(255 * Math.random()),
                b: Math.floor(255 * Math.random()),
                a: 0.4 * Math.random()
            };
        return {
                contrast: g,
                brightness: a,
                curves: h,
                screen: k,
                desaturate: Math.random(),
                vignette: Math.random(),
                lighten: 0.3 * Math.random(),
                noise: Math.floor(50 * Math.random()),
                viewFinder: false,
                sepia: 0.5 <= Math.random()
            }
        }
    };

    return {
      filters: vintagePresetsCN,
      effect: filter,
    };

    function filter(effect) {
        var defer = $q.defer();
        var image = document.getElementById('vin-image');

        var options = {
            onError: function() {
                alert('ERROR');
            },
            onStop: function() {
                defer.resolve(effect);
            }
        };
        var eff = effect!='random' ? vintagePresets[effect] : vintagePresets[effect]();

        new VintageJS(image, options, eff);

        return defer.promise;
    }
}

'use strict';

PhotogramFactory.$inject = ['FetchData', 'ENV', '$http', '$q', '$rootScope', 'Storage', 'PhotoService'];
photoList.$inject = ['Photogram', '$q', '$timeout', '$rootScope', '$state', 'photoShare'];
photoShare.$inject = ['$rootScope', 'Photogram', '$ionicActionSheet', '$cordovaSocialSharing', 'sheetShare', 'AuthService', '$ionicPopup'];
var photogramModule = angular.module('maybi.photogram', [])

photogramModule.factory('Photogram', PhotogramFactory);
photogramModule.directive('photoList', photoList);
photogramModule.service('photoShare', photoShare);

function PhotogramFactory(FetchData, ENV, $http, $q, $rootScope, Storage, PhotoService) {

    var posts = [];
    var currentTab = '';
    var hasNextPage = true;
    var isEmpty = false;
    var nextPage = 0;
    var perPage = 10;

    return {
        post: createPost,
        delPost: delPost,
        getDetail: getDetail,
        search: search,
        addComment: addComment,
        deleteComment: deleteComment,
        like: like,
        unlike: unlike,
        report: report,

        getUserPosts: getUserPosts,
        getUserLikes: getUserLikes,
        fetchTopPosts: fetchTopPosts,
        increaseNewPosts: increaseNewPosts,
        getPosts: function() {
            return posts;
        },
        setCurrentTab: function(tab) {
            currentTab = tab;
        },
        getCurrentTab: function() {
            return currentTab;
        },
        hasNextPage: function() {
            return hasNextPage;
        },
        isEmpty: function() {
            return isEmpty;
        },
    };

    function increaseNewPosts() {
        var deferred = $q.defer();
        $http.get(ENV.SERVER_URL + '/api/post/list', {
            params: {
                type: currentTab,
                page: nextPage,
                per_page: perPage,
            }
        }).success(function(r, status) {
            if (status === 200 && r.message == "OK"){
                if (r.posts.length < perPage) {
                    hasNextPage = false;
                }
                nextPage++;
                deferred.resolve(r);
            } else {
                deferred.reject();
            }
        }).error(function (data){
            deferred.reject();
        });
        return deferred.promise;
    }

    function fetchTopPosts() {
        var deferred = $q.defer();
        hasNextPage = true;
        isEmpty = false;

        $http.get(ENV.SERVER_URL + '/api/post/list', {
            params: {
                type: currentTab,
                page: 0,
                per_page: perPage,
            }
        }).success(function(r, status) {
            if (status === 200 && r.message == "OK"){
                if (r.posts.length < perPage) {
                    hasNextPage = false;
                }
                nextPage=1;
                if (r.posts.length === 0) {
                    isEmpty = true;
                }

                deferred.resolve(r);
            } else {
                deferred.reject();
            }
        }).error(function (data){
            deferred.reject();
        });
        return deferred.promise;
    }

    function getUserPosts(userId, page) {
        var deferred = $q.defer();
        hasNextPage = true;
        isEmpty = false;

        $http.get(ENV.SERVER_URL + '/api/post/list', {
            params: {
                page: page,
                per_page: perPage,
                user_id: userId,
            }
        }).success(function(r, status) {
            if (status === 200 && r.message == "OK"){
                if (r.posts.length < perPage) {
                    hasNextPage = false;
                }
                if (page == 0 && r.posts.length === 0) {
                    isEmpty = true;
                }
                deferred.resolve(r);
            } else {
                deferred.reject();
            }
        }).error(function (data){
            deferred.reject();
        });
        return deferred.promise;
    }

    function getUserLikes(userId, page) {
        var deferred = $q.defer();
        hasNextPage = true;
        isEmpty = false;

        $http.get(ENV.SERVER_URL + '/api/post/likes', {
            params: {
                page: page,
                per_page: perPage,
                user_id: userId,
            }
        }).success(function(r, status) {
            if (status === 200 && r.message == "OK"){
                if (r.posts.length < perPage) {
                    hasNextPage = false;
                }
                if (page == 0 && r.posts.length === 0) {
                    isEmpty = true;
                }
                deferred.resolve(r);
            } else {
                deferred.reject();
            }
        }).error(function (data){
            deferred.reject();
        });
        return deferred.promise;
    }

    function search(query) {
        var deferred = $q.defer();
        hasNextPage = true;
        isEmpty = false;

        $http.get(ENV.SERVER_URL + '/api/post/list', {
            params: {
                type: currentTab,
                page: 0,
                per_page: perPage,
                title: query,
            }
        }).success(function(r, status) {
            if (status === 200 && r.message == "OK"){
                if (r.posts.length < perPage) {
                    hasNextPage = false;
                }
                if (r.posts.length === 0) {
                    isEmpty = true;
                }
                nextPage = 1;
                deferred.resolve(r);
            } else {
                deferred.reject();
            }
        }).error(function (data){
            deferred.reject();
        });
        return deferred.promise;
    }

    function createPost(form) {
        var deferred = $q.defer();
        var primary_filename = 'primary/' + new Date().getTime() + ".jpeg";

        PhotoService.upload(form.primary_image, primary_filename,
            function(data){
                $http.post(ENV.SERVER_URL + '/api/post/image_uploaded', {
                    url: primary_filename,
                    type: 'primary_image',
                });
                $rootScope.$broadcast('alert', "发送成功");

            }, function(error){
                $rootScope.$broadcast('alert', "发送失败，请重试");
                deferred.reject(error);
                return deferred.promise;
            });

        form.primary_image = 'http://assets.maybi.cn/'+primary_filename;

        var photos = [];
        angular.forEach(form.photos, function(img, index){
            var filename = 'photo/'+index+'/' + new Date().getTime() + ".jpeg";
            PhotoService.upload(img, filename,
                function(data){
                    $http.post(ENV.SERVER_URL + '/api/post/image_uploaded', {
                        url: filename,
                        type: 'photos',
                    });

                }, function(error){
                    deferred.reject(error);
                    return deferred.promise;
                });

            photos.push('http://assets.maybi.cn/'+filename);

        });

        form.photos = photos;

        FetchData.post('/api/post/create', form)
            .then(function(r) {
                deferred.resolve(r);
            }).catch(function (error){
                deferred.reject(error);
            });

        return deferred.promise;

    }


    function delPost(postId) {
        var deferred = $q.defer();

        FetchData.post('/api/post/delete/'+ postId).then(function(r) {
            deferred.resolve(r);
        }).catch(function (error){
            deferred.reject(error);
        });

        return deferred.promise;
    }

    function getDetail(postId) {
        var deferred = $q.defer();

        FetchData.get('/api/post/detail/' + postId)
            .then(function(r) {
                deferred.resolve(r);
            }).catch(function (error){
                deferred.reject(error);
            });

        return deferred.promise;
    }

    function addComment(postId, text) {
        var deferred = $q.defer();

        FetchData.post('/api/post/comment/add', {
            post_id: postId,
            content: text,
        }).then(function(r) {
            deferred.resolve(r);
        }).catch(function (error){
            deferred.reject(error);
        });

        return deferred.promise;
    }

    function deleteComment(commentId, postId) {
        var deferred = $q.defer();

        FetchData.post('/api/post/comment/delete', {
            comment_id: commentId,
            post_id: postId,
        }).then(function(r) {
            deferred.resolve(r);
        }).catch(function (error){
            deferred.reject(error);
        });

        return deferred.promise;
    }

    function like(postId) {
        var deferred = $q.defer();

        FetchData.post('/api/post/like/'+postId)
            .then(function(r) {
                deferred.resolve(r);
            }).catch(function (error){
                deferred.reject(error);
            });

        return deferred.promise;
    }

    function unlike(postId) {
        var deferred = $q.defer();

        FetchData.post('/api/post/unlike/'+postId)
            .then(function(r) {
                deferred.resolve(r);
            }).catch(function (error){
                deferred.reject(error);
            });

        return deferred.promise;
    }

    function report(postId, subject) {
        var deferred = $q.defer();

        FetchData.post('/api/post/report', {
            post_id: postId,
            subject: subject
        }).then(function(r) {
            deferred.resolve(r);
        }).catch(function (error){
            deferred.reject(error);
        });

        return deferred.promise;
    }
}

function photoList(Photogram, $q, $timeout, $rootScope, $state, photoShare){
    return {
        restrict: 'E',
        scope: {
            post: '=',
            withAffix: '=',
        },
        replace: true,
        link: function(scope, elem, attrs) {
            scope.like = function(){
                if (scope.post.is_liked){
                    scope.post.is_liked = false;
                    scope.post.num_likes -= 1;
                    Photogram.unlike(scope.post.post_id)
                        .then(function(data){
                        }).catch(function(error){
                            scope.post.is_liked = true;
                            scope.post.num_likes += 1;
                        });
                } else {
                    scope.post.is_liked= true;
                    scope.post.num_likes += 1;
                    Photogram.like(scope.post.post_id)
                        .then(function(data){
                        }).catch(function(error){
                            scope.post.is_liked= false;
                            scope.post.num_likes -= 1;
                        });
                }
            };
            scope.goPost = function() {
                for(var name in $state.current.views) {
                    var name = name;
                }

                if (name=="tab-explore"){
                    $state.go('tab.postDetail', {postID: scope.post.post_id});
                } else {
                    $state.go('tab.myPostDetail', {postID: scope.post.post_id});
                }
            };
            scope.actions = function(){
                photoShare.popup(scope.post);
            }
            scope.zoom = function() {
                if (ionic.Platform.isAndroid()) {
                    PhotoViewer.show(scope.post.primary_image, ''); //cordova photoviewer
                } else {
                    ImageViewer.show(scope.post.primary_image);    // cordova ImageViewer for IOS
                }
            };

            scope.goUser = function(){
                $state.go('tab.userDetail', {userID: scope.post.user.id});
            };

            scope.searchTag = function(tag){

            };
        },


        templateUrl: function(element, attrs) {
            if ( typeof attrs.withAffix == 'undefined' ) {
                return 'photogram/photoList.html';
            } else {
                return 'photogram/photoListNoAffix.html';
            }
        },
    }

}

function photoShare($rootScope, Photogram, $ionicActionSheet, $cordovaSocialSharing,
        sheetShare, AuthService, $ionicPopup){

    this.popup = function(post) {
      var sheet = {};
      sheet.destructiveText = '<i class="icon fa fa-info-circle"></i> 举报';
      sheet.cancelText = '取消';
      sheet.buttonClicked = buttonClicked;
      sheet.destructiveButtonClicked = destructiveButtonClicked;
      sheet.cssClass = 'actions-menu';
      sheet.buttons = [{
        text: '<i class="icon fa fa-share-alt"></i> 分享'
      }];
      if (post.user.id == AuthService.getUser().id) {
          sheet.buttons.push({
            text: '<i class="icon fa fa-trash"></i> 删除'
          })
      }

      $ionicActionSheet.show(sheet);

      function destructiveButtonClicked(){
        var buttons = [
            { text: '垃圾广告' },
            { text: '虚假信息' },
            { text: '恶意攻击' },
            { text: '暴力色情' },
            { text: '触犯法规' },
            { text: '其他原因' },
        ];
        $ionicActionSheet.show({
            buttons: buttons,
            titleText: '举报原因',
            cssClass: 'actions-menu',
            cancelText: '取消',
            buttonClicked: function(index) {
                var subject = buttons[index].text;
                Photogram.report(post.post_id, subject).then(function(data){
                    $rootScope.$emit('alert', "已举报");
                });
                return true;
            }
        });
        return true;
      }

      function buttonClicked(index) {

        if (index == 0){
            if ($rootScope.IsWechatInstalled && $rootScope.IsQQInstalled){
                sheetShare.popup(post, 'post');
            } else {
                var message = "分享图片",
                    subject = '分享',
                    file = post.primary_image,
                    link = "http://www.may.bi";

                $cordovaSocialSharing
                    .share(message, subject, file, link) // Share via native share sheet
                    .then(function(result) {
                        console.log('result:' + result);
                    }, function(err) {
                        $rootScope.$emit('alert', err);
                    });
            }

        } else if (index == 1) {
            Photogram.delPost(post.post_id).then(function(data){
                $rootScope.$emit('alert', "删除成功");
            })

        }
        return true;

      }
    }


}

angular.module('ion-geo', [])
    .service('geoService', ['$ionicPlatform', '$q', '$cordovaGeolocation',
            function($ionicPlatform, $q, $cordovaGeolocation){
        this.getLocation = getLocation;

        function getLocation() {
            return $q(function (resolve, reject) {
                var posOptions = {timeout: 9000, enableHighAccuracy: false};
                $ionicPlatform.ready(function() {
                    $cordovaGeolocation.getCurrentPosition(posOptions)
                        .then(function (position) {
                            resolve(position);
                        }, function (error) {
                            error.from = 'getLocation';
                            reject(error);
                        });
                })
            });
        }

    }])
    .directive('ionGooglePlace', [
        '$ionicModal',
        '$ionicPlatform',
        '$http',
        '$q',
        '$timeout',
        '$rootScope',
        'geoService',
        function($ionicModal, $ionicPlatform, $http, $q, $timeout, $rootScope, geoService) {
            return {
                require: '?ngModel',
                restrict: 'E',
                template: '<input type="text" readonly="readonly" id="ion-geo" class="ion-google-place" autocomplete="off">',
                replace: true,
                scope: {
                    ngModel: '=?',
                    geocode: '=?',
                    currentLocation: '@',
                },
                link: function(scope, element, attrs, ngModel) {
                    var unbindBackButtonAction;

                    scope.locations = [];
                    var searchEventTimeout = undefined;

                    scope.displayCurrentLocation = false;
                    scope.currentLocation = scope.currentLocation === "true"? true:false;

                    if(!!navigator.geolocation && scope.currentLocation){
                        scope.displayCurrentLocation = true;
                    }

                    $ionicModal.fromTemplateUrl('photogram/locationModal.html', {
                        scope: scope,
                        focusFirstInput: true,
                        animation: 'slide-in-right',
                    }).then(function(modal){

                        scope.popup = modal;

                        scope.selectLocation = function(location){
                            ngModel.$setViewValue(location);
                            ngModel.$render();
                            scope.popup.hide();

                            if (unbindBackButtonAction) {
                                unbindBackButtonAction();
                                unbindBackButtonAction = null;
                            }
                            scope.$emit('ionGooglePlaceSetLocation',location);
                        };

                        scope.setCurrentLocation = function(){
                            var location = '正在获取位置...';
                            ngModel.$setViewValue(location);
                            ngModel.$render();
                            scope.popup.hide();
                            reverseGeocoding(scope.geocode)
                                .then(function(location){
                                    ngModel.$setViewValue(location);
                                    element.attr('value', location);
                                    ngModel.$render();
                                }).catch(function(error){
                                    console.log('erreur catch', JSON.stringify(error));
                                    var location = '获取当前位置失败';
                                    ngModel.$setViewValue(location);
                                    ngModel.$render();
                                    scope.popup.hide();
                                    $timeout(function(){
                                        ngModel.$setViewValue(null);
                                        ngModel.$render();
                                        scope.popup.hide();
                                    }, 2000);
                                });
                        };

                        scope.search = function(query){
                            if (searchEventTimeout) $timeout.cancel(searchEventTimeout);
                            searchEventTimeout = $timeout(function() {
                                if(!query) return;
                                //if(query.length < 3);

                                $http.get('https://maps.googleapis.com/maps/api/geocode/json', {
                                    params: {
                                        address: query,
                                        language: 'en',
                                        key: 'AIzaSyC57Wo22mMcQufa-9I0LHQl9XXr0Nu0IiU',
                                    }
                                }).success(function(res){
                                    var addresses = [];
                                    angular.forEach(res['results'], function(address){
                                        var formatted_addr = getAvailableAddress(address);
                                        if (formatted_addr) {
                                            addresses.push(formatted_addr);
                                        }
                                    })
                                    scope.locations = addresses;
                                }).catch(function(err){
                                    console.log(JSON.stringify(err));
                                });
                            }, 350); // we're throttling the input by 350ms to be nice to google's API
                        };

                        scope.closeModal = function(){

                        }

                        var onClick = function(e){
                            e.preventDefault();
                            e.stopPropagation();

                            unbindBackButtonAction = $ionicPlatform.registerBackButtonAction(closeOnBackButton, 250);

                            scope.popup.show();
                        };

                        scope.closeModal = function(){
                            scope.searchQuery = '';
                            scope.popup.hide();

                            if (unbindBackButtonAction){
                                unbindBackButtonAction();
                                unbindBackButtonAction = null;
                            }
                        };

                        closeOnBackButton = function(e){
                            e.preventDefault();

                            scope.popup.hide();

                            if (unbindBackButtonAction){
                                unbindBackButtonAction();
                                unbindBackButtonAction = null;
                            }
                        }

                        element.bind('click', onClick);
                        element.bind('touchend', onClick);
                    });

                    if(attrs.placeholder){
                        element.attr('placeholder', attrs.placeholder);
                    }

                    ngModel.$formatters.unshift(function (modelValue) {
                        if (!modelValue) return '';
                        return modelValue;
                    });

                    ngModel.$parsers.unshift(function (viewValue) {
                        return viewValue;
                    });

                    ngModel.$render = function(){
                        if(!ngModel.$viewValue){
                            element.val('');
                        } else {
                            element.val(ngModel.$viewValue || '');
                        }
                    };

                    scope.$on("$destroy", function(){
                        if (unbindBackButtonAction){
                            unbindBackButtonAction();
                            unbindBackButtonAction = null;
                        }
                    });

                    function reverseGeocoding(location) {
                        return $q(function (resolve, reject) {
                            var lat = location[1];
                            var lng = location[0];
                            $http.get('https://maps.googleapis.com/maps/api/geocode/json', {
                                params: {
                                    latlng: lat + ',' + lng,
                                    language: 'en',
                                    key: ''
                                }
                            }).success(function(res){
                                var results = res['results'];
                                if (res['status'] == 'OK') {
                                    if (results[1]) {
                                        var formatted_addr = getAvailableAddress(results[1]);
                                    } else {
                                        var formatted_addr = getAvailableAddress(results[0]);
                                    }
                                    resolve(formatted_addr);
                                } else {
                                    var error = {
                                        status: res['status'],
                                        from: 'reverseGeocoding'
                                    };
                                    reject(error);
                                }
                            }).catch(function(err){
                                console.log(JSON.stringify(err));
                                reject(error);
                            })
                        });
                    }

                    function getAvailableAddress(address) {
                        var elements = {};
                        var formatted_addr = null;
                        angular.forEach(address.address_components, function (address_component) {
                            elements[address_component.types[0]] = address_component.short_name;
                        });
                        if (elements.locality && elements.administrative_area_level_1) {
                            formatted_addr = [elements.locality,
                                elements.administrative_area_level_1,
                                elements.country].join(',');
                        }

                        return formatted_addr;
                    }
                }
            };
        }
    ]);

(function(){

angular.module('tag-select', [])
.directive('tagSelect', ['$ionicModal','$timeout', '$filter', '$cordovaToast', 'FetchData', function ($ionicModal, $timeout, $filter, $cordovaToast, FetchData) {
    return {
        restrict: 'A',
        require : 'ngModel',
        scope: {
            ngModel: '=?',
            tagType: '@',
        },
        link: function (scope, iElement, iAttrs, ngModelController) {

            scope.ui = {
                checkedTags: scope.ngModel,
                value: null,
                searchQuery: ''
            };

            // getting options template

            /*
            ngModelController.$render = function(){
                scope.ui.value = ngModelController.$viewValue;
            };
            */

            scope.confirmTags = function(){
                ngModelController.$setViewValue(scope.ui.checkedTags);
                ngModelController.$render();

                scope.modal.hide().then(function(){
                    scope.ui.searchQuery = '';
                });

            };
            scope.setOption = function(tag){
                // add or remove tag
                if (!getTagByName(tag)) {
                    if (scope.ui.checkedTags.length < 3){
                        scope.ui.checkedTags.push(tag);
                    } else {
                        $cordovaToast.show('最多只能添加3个标签哦', 'short', 'center')
                    }
                } else {
                    removeTagByName(tag);
                }
            }

            scope.compareValues = function(tag){
                return getTagByName(tag);
            };

            var getTagByName = function(tag){
                var found = null;
                angular.forEach(scope.ui.checkedTags, function (t) {
                    if  (t === tag) {
                        found = tag ;
                    }
                });
                return found;
            }

            var removeTagByName = function(tag){
                angular.forEach(scope.ui.checkedTags, function (t, index) {
                    if  (t == tag) {
                        scope.ui.checkedTags.splice(index, 1);
                    }
                });
            }

            scope.clearSearch = function(){
                scope.ui.searchQuery= '';
            };

            scope.closeModal = function(){
                scope.modal.hide();
            };

            scope.addNewTag = function(){
                var tag = scope.ui.searchQuery;
                scope.setOption(tag);
                scope.clearSearch();

            }

            //loading the modal
            $ionicModal.fromTemplateUrl('photogram/tagsModal.html', {
                scope: scope,
                animation: 'slide-in-right',
            }).then(function(modal){
                scope.modal = modal;
            });

            scope.$on('$destroy', function(){
                scope.modal.remove();
            });

            iElement.on('click', function(){
                scope.modal.show();
                FetchData.get('/api/post/tags/'+scope.tagType).then(function(data){
                    scope.options = data.tags_group;
                });

            });

            //#TODO ?: WRAP INTO $timeout?
            ngModelController.$render();

        }
    };
}])

})();
