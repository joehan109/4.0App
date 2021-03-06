"use strict";

angular.module('fourdotzero.directives', [])

.directive('scrollHeight', ['$window', function($window) {
    return {
        restrict: 'AE',
        scope: {
            rate: '@'
        },
        link: function(scope, element, attr) {
            var rate = scope.rate;
            if (rate.split('/')) {
                rate = scope.rate.split('/')[0] / scope.rate.split('/')[1]
            }
            // 根据屏幕宽度按比例设置高度
            element[0].style.height = ($window.innerWidth * +rate) + 'px';
        }
    }
}])

.directive('repeatDone', function () {
   return function (scope, element, attrs) {
     if (scope.$last) { // all are rendered
       scope.$eval(attrs.repeatDone);
     }
   }
})

.directive('ngcartAddtocart', ['ngCart', function(ngCart) {
    return {
        restrict: 'E',
        scope: {
            id: '@',
            name: '@',
            quantity: '@',
            quantityMax: '@',
            price: '@',
            data: '='
        },
        transclude: true,
        templateUrl: function(element, attrs) {
            if (typeof attrs.templateUrl == 'undefined') {
                return 'ngCart/addtocart.html';
            } else {
                return attrs.templateUrl;
            }
        },
        link: function(scope, element, attrs) {
            scope.ngCart = ngCart;
            scope.attrs = attrs;
            scope.inCart = function() {
                return ngCart.getItemById(attrs.id);
            };

            if (scope.inCart()) {
                scope.q = ngCart.getItemById(attrs.id).getQuantity();
            } else {
                scope.q = parseInt(scope.quantity);
            }

            scope.qtyOpt = [];
            for (var i = 1; i <= scope.quantityMax; i++) {
                scope.qtyOpt.push(i);
            }

            scope.alertWarning = function() {
                scope.$emit('alert', '请选择有效商品');
            };
        }
    };
}])

.directive('ngcartBuyrightnow', ['ngCart', '$state', '$rootScope', function(ngCart, $state, $rootScope) {
    return {
        restrict: 'E',
        scope: {
            id: '@',
            name: '@',
            quantity: '@',
            quantityMax: '@',
            price: '@',
            data: '='
        },
        transclude: true,
        templateUrl: function(element, attrs) {
            if (typeof attrs.templateUrl == 'undefined') {
                return 'ngCart/buyrightnow.html';
            } else {
                return attrs.templateUrl;
            }
        },
        link: function(scope, element, attrs) {
            scope.ngCart = ngCart;
            scope.attrs = attrs;
            scope.buyRightNow = function(id, name, price, quantity, data) {
                ngCart.buyRightNow(id, name, price, quantity, data);
                $rootScope.$broadcast('specsBuyModal:hide');
                $state.go('checkout');
            };
        }
    };
}])

.directive('ngcartSummary', ['ngCart', function(ngCart) {
    return {
        restrict: 'E',
        link: function(scope, element, attrs) {
            scope.ngCart = ngCart;
        },
        scope: {},
        transclude: true,
        templateUrl: function(element, attrs) {
            if (typeof attrs.templateUrl == 'undefined') {
                return 'ngCart/summary.html';
            } else {
                return attrs.templateUrl;
            }
        }
    };
}])

.directive('ngcartCheckout', ['ngCart', 'fulfilmentProvider', '$timeout', '$ionicActionSheet', '$state', '$http', 'ENV', 'AlipayService', 'WechatService', 'Storage', function(ngCart, fulfilmentProvider, $timeout, $ionicActionSheet, $state, $http, ENV, AlipayService,WechatService,Storage) {
    return {
        restrict: 'E',
        link: function(scope, element, attrs) {
            scope.ngCart = ngCart;
            scope.isShop = Storage.get('shopOrSell') === 'shop';

            scope.payInfo = attrs.ordertype == 'new' ? '提交订单' : '现在支付';

            scope.showPaymentMethods = function() {
                
                //没有收获地址时先填写收货地址
                $http.get(ENV.SERVER_URL + '/mall/receipt/get').success(function(data) {
                    if (data.data) {
                        // 没有选择地址，则将改地址设为默认地址
                        if(!scope.ngCart.getAddress().id) {
                            scope.ngCart.setAddress(data.data)
                        }
                        var sheet = {};
                        sheet.buttonClicked = buttonClicked;
                        sheet.buttons = [{
                            text: '<i class="icon"><img class="aliIcon" src="./img/ali.png" /></i> 支付宝支付'
                        },{
                            text: '<i class="icon"><img class="wxIcon" src="./img/wechat.png" /></i> 微信支付'
                        }];
                        sheet.cancelOnStateChange = true;

                        $ionicActionSheet.show(sheet);
                    } else {
                        scope.$emit('alert', '请先填写收货地址');
                    }
                });


                function buttonClicked(index) {
                    var service = { 0: AlipayService, 1: WechatService }
                    var isShop = Storage.get('shopOrSell') === 'shop';
                    var data = scope.ngCart.getAddress().data;
                    var detailList = scope.ngCart.getSelectedItems().map(function(item) {
                        return {
                            maProId: item._data.maProId || item._id,
                            maProImg: item._data.mainUrl,
                            maProName: item._name,
                            num: item._quantity,
                            dealPrice: item._price
                        }
                    });
                    var order = {
                        detailList: detailList,
                        trackingType: scope.ngCart.getExpress().codeKey,
                        trackingAmount: +scope.ngCart.getExpress().codeDesc,
                        status: '0',
                        receiptId: data.id,
                        receiptName: data.name,
                        receiptPhone: data.phone,
                        receiptPostcode: data.postcode,
                        receiptDetail: data.detail,
                        integral: scope.ngCart.getVipPoints()
                    }
                    if (attrs.ordertype == 'new') {
                        // 商城从购物车新建订单
                        if (!order.receiptId) {
                            scope.$emit('alert', '请选择收货地址');
                            return;
                        }
                        fulfilmentProvider.checkout(order, function() {
                            $ionicActionSheet.hide();
                        }, index)
                    } else if (attrs.ordertype == 'existed') {
                        // 已有商城订单或者竞品订单支付
                        // 直接掉支付接口
                        var url = [
                            isShop ? '/mall/alipay/maorder/pay?ids=' : '/mall/alipay/auorder/pay?ids=',
                            isShop ? '/mall/weixin/maorder/pay?ids=' : '/mall/weixin/auorder/pay?ids='
                        ][index]
                        var params = url + attrs.orderid + (isShop ? '' : '&type='+order.trackingType+'&money='+order.trackingAmount+'&reId='+ order.receiptId);
                        $http.post(ENV.SERVER_URL + params).success(function(r, status) {
                            if (r.ret) {
                                service[index].checkout(r.data)
                            }
                        });
                    }
                }
            };
        },
        scope: {
            settings: '=',
            show: '=',
        },
        replace: true,
        templateUrl: function(element, attrs) {
            if (typeof attrs.templateUrl == 'undefined') {
                return 'ngCart/checkout.html';
            } else {
                return attrs.templateUrl;
            }
        }
    };
}])

.directive("zoomView", ['$compile', '$ionicModal', '$ionicPlatform', '$cordovaSocialSharing', function($compile, $ionicModal, $ionicPlatform, $cordovaSocialSharing) {
    return {

        restrict: "A",

        link: function(scope, elem, attr) {

            $ionicPlatform.ready(function() {

                elem.attr("ng-click", "showZoomView()");
                elem.removeAttr("zoom-view");
                $compile(elem)(scope);

                var zoomViewTemplate = '<ion-modal-view class="zoom-view"><ion-header-bar>' +
                    '<button ng-click="closeZoomView()" class="button button-clear button-light button-icon ion-ios-close-empty"></button></ion-header-bar>' +
                    '<ion-content ng-click="closeZoomView()"><ion-scroll zooming="true" direction="xy" style="width: 100%; height: 100%; position: absolute; top: 0; bottom: 0; left: 0; right: 0; ">' +
                    '<img ng-src="{{ngSrc}}" style="width: 100%!important; display:block; width: 100%; height: auto; max-width: 400px; max-height: 700px; margin: auto; padding: 10px; " />' +
                    '</ion-scroll> </ion-content>' +
                    '<ion-footer-bar><h1 class="title"></h1><button class="button button-light button-icon ion-ios-download-outline" ng-click="downloadFile()"></button></ion-footer-bar>'
                '</ion-modal-view>';

                scope.zoomViewModal = $ionicModal.fromTemplate(zoomViewTemplate, {
                    scope: scope,
                    animation: "slide-in-right"
                });

                scope.showZoomView = function() {
                    scope.zoomViewModal.show();
                    scope.ngSrc = attr.zoomSrc;
                };

                scope.closeZoomView = function() {
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

.directive('showMore', ['$timeout', function($timeout) {
    return {
        templateUrl: 'showMore.html',
        restrict: 'A',
        replace: true,
        scope: {
            'title': '=',
        },
        link: function(scope, element, attrs) {

            var showMoreHeight = parseInt(attrs.showMore);

            scope.expanded = false;
            scope.expandable = false;

            $timeout(function() {
                renderStyles();
            }, 300);
            scope.toggle = function() {
                scope.expanded = !scope.expanded;

            };

            function renderStyles() {
                var elementHeight = element.find('p')[0].offsetHeight;
                if (elementHeight > showMoreHeight && scope.expanded === false) {
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

.directive('addressForm', ['$rootScope', '$ionicModal', 'FetchData', 'ngCart', '$state', 'utils', function($rootScope, $ionicModal, FetchData, ngCart, $state, utils) {
    return {
        restrict: 'A',
        scope: {
            'addrId': '=',
            'addresses': '=',
        },
        link: function(scope, element, attrs) {
            scope.ngCart = ngCart;
            scope.addr = {};
            var addr_id = scope.addrId;
            if (addr_id && scope.addresses) {
                scope.addresses.forEach(function(item) {
                    if (item.id === addr_id) {
                        scope.addr = item;
                    }
                })
            }
            var isFisrt = !scope.addresses.length;
            scope.closeModal = function() {
                $rootScope.addressModal.hide();

            };

            element.bind('click', function() {
                $ionicModal.fromTemplateUrl('add_address.html', {
                    scope: scope,
                    animation: 'slide-in-right'
                }).then(function(modal) {
                    $rootScope.addressModal = modal;
                }).then(function() {
                    $rootScope.addressModal.show();
                });
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
            scope.saveAddress = function() {
                if (!validate()) {
                    return;
                }
                if (addr_id) {
                    FetchData.post('/mall/receipt/update' + utils.formatGetParams({
                        'id': addr_id,
                        'name': scope.addr.name,
                        'detail': scope.addr.detail,
                        'postcode': scope.addr.postcode,
                        'phone': scope.addr.phone,
                    })).then(function(data) {
                        $rootScope.addressModal.hide();
                        $state.transitionTo($state.current, $state.$current.params, { reload: true, inherit: true, notify: true });
                    });
                } else {
                    FetchData.post('/mall/receipt/save' + utils.formatGetParams({
                        'flag': isFisrt ? 1 : 0,
                        'name': scope.addr.name,
                        'detail': scope.addr.detail,
                        'postcode': scope.addr.postcode,
                        'phone': scope.addr.phone,
                    })).then(function(data) {
                        $rootScope.addressModal.hide();
                        $state.transitionTo($state.current, $state.$current.params, { reload: true, inherit: true, notify: true });
                    });

                }
            }

            function validate() {
                var reg = {
                    phone: /^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/,
                    postcode: /[0-9]{6}/
                };
                if (!scope.addr.name) {
                    $rootScope.$emit('alert', "请填写收货人");
                    return false
                } else if (!reg.phone.test(scope.addr.phone)) {
                    $rootScope.$emit('alert', "请输入正确的联系方式");
                    return false
                } else if (!scope.addr.detail) {
                    $rootScope.$emit('alert', "请填写收货地址");
                    return false
                } else if (!reg.postcode.test(scope.addr.postcode)) {
                    $rootScope.$emit('alert', "请输入正确的邮编");
                    return false
                } else {
                    return true
                }
            }
        },
    };
}])

.directive('followBtn', ['User', 'AuthService', function(User, AuthService) {
    return {
        restrict: 'E',
        scope: {
            user: '=',
        },
        transclude: true,
        templateUrl: 'user/followButton.html',
        link: function(scope, element, attrs) {
            scope.currentUserID = AuthService.getUser().id;

            scope.follow = function() {
                var user = AuthService.getUser();

                if (scope.user.is_following) {
                    scope.user.is_following = false;
                    scope.user.num_followers -= 1;

                    User.unfollow(scope.user.id)
                        .then(function(data) {
                            scope.$emit('alert', "已取消关注");
                        }).catch(function(error) {
                            scope.user.is_following = true;
                            scope.user.num_followers += 1;
                        });
                } else {
                    scope.user.is_following = true;
                    scope.user.num_followers += 1;

                    User.follow(scope.user.id)
                        .then(function(data) {
                            scope.$emit('alert', "关注成功");
                        }).catch(function(error) {
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
        link: function(scope, elem, attrs) {
            scope.items = scope.board.items;

            scope.goItem = function(item_id) {
                $state.go('item', { itemID: item_id });
            };

            scope.goBoard = function(item_id) {
                $state.go('tab.board', { 'boardID': scope.board.id })
            };


        }
    };
}])