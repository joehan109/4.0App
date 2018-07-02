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
    .service('utils', function($rootScope) {
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
    })
    .service('sheetShare', function($rootScope, $bottomSheet) {
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
    })

    .service('share', function($rootScope, $ionicActionSheet) {
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
    })

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
    .factory('AuthService', function(ENV, $http, Storage, $state, $q) {
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

            login: function(data) {
                var deferred = $q.defer();
                var url = {
                  'common':ENV.SERVER_URL + '/mall/vip/login',
                  'phone':ENV.SERVER_URL + '/mall/vip/login/phone'
                }[data.type];
                $http.post(url, data.data).success(function(data, status) {
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
    })
    .factory('User', function(ENV, $http, $state, $q) {

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

    })

    .factory('Items', function(ENV, $http, $log, $q, $rootScope, Storage) {
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


    })
    .factory('FetchData', function($rootScope, $http, $q, ENV, $ionicLoading) {
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
                                template: res.errmsg || '请先登录',
                                duration: 1000
                            });
                        } else {
                            $ionicLoading.show({
                                template: res.errmsg || '出错了',
                                duration: 1000
                            });
                        }
                        d.reject();
                    }
                }).error(function(data, status) {
                    //$ionicLoading.hide();
                    $ionicLoading.show({
                        template: "网络出错, " + status,
                        duration: 1000
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
                                template: res.errmsg || '请先登录',
                                duration: 1000
                            });
                        } else {
                            $ionicLoading.show({
                                template: res.errmsg || '出错了',
                                duration: 1000
                            });
                        }
                        d.reject();
                    }
                }).error(function(data, status) {
                    //$ionicLoading.hide();
                    $ionicLoading.show({
                        template: "网络出错, " + status,
                        duration: 1000
                    });
                    d.reject();
                });
                return d.promise;
            }
        };
    })
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
    .service('orderOpt', function($rootScope, $http, FetchData, Storage, ENV) {
        return {
          cancel:cancel,
          del:del,
          done:done
        };

        function cancel(id) {
          FetchData.get('/mall/maorder/cancel?id=' + id).then(function(data) {
            if(data.ret) {
              $scope.$emit("alert", "订单已删除");
              $state.go('tab.orders',{
                  status_id: 3
              }, {
                  reload: true
              });
            } else{
              $scope.$emit("alert", data.errmsg || "订单删除出错，请稍后尝试");
            }
          })
        }
        function del(id) {
          FetchData.get('/mall/maorder/delete?id=' + id)
              .then(function(data) {
                if(data.res) {
                  $scope.$emit("alert", "订单删除成功！");
                  $state.go('tab.orders');
                } else{
                  $scope.$emit("alert", data.errmsg || "订单操作出错，请稍后再试");
                }
              })
        }
        function done(id) {
          FetchData.get('/mall/maorder/confirm?id=' + id)
              .then(function(data) {
                if(data.res) {
                  $scope.$emit("alert", "交易成功！");
                  $state.go('tab.orders',{
                      status_id: 2
                  }, {
                      reload: true
                  });
                } else{
                  $scope.$emit("alert", data.errmsg || "订单操作出错，请稍后再试");
                }
              })
        }
    })
    .service('ngCart', function($rootScope, $http, ngCartItem, Storage, ENV) {

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

    })
    .service('ngCartItem', function($rootScope, $log) {

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
    })
    .service('fulfilmentProvider', ['ngCart', '$rootScope', '$ionicLoading','$state', 'utils', '$http', 'ENV',function(ngCart, $rootScope, $ionicLoading,$state, utils, $http, ENV) {


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
            $state.go('tab.orders',{
                status_id: 0
            }, {
                reload: true
            });
          },function(err) {
            console.log(err);
            $ionicLoading.show({
                template: '订单生成失败，请咨询供应商',
                duration: 3000,
            });
          });
        };
        function alipayCheckout(data){
          var payInfo = data;
          cordova.plugins.alipay.payment(payInfo,function success(e){
            if (e.status == 9000) {
              $ionicLoading.show({
                  template: '订单支付成功',
                  duration: 3000,
              });
              $state.go('tab.orders',{
                  status_id: 2
              }, {
                  reload: true
              });
            }
          },function error(e){});
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

    .service('fulfilmentNewOrder', function($rootScope, $http, ngCart, ENV, $injector) {

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
    })

    .service('fulfilmentExistedOrder', function($rootScope, $http, ngCart, ENV, $injector) {

        this.checkout = function(service, settings) {
            $rootScope.$broadcast('alertStart', "正在处理，请稍等..");

            var provider = $injector.get('fulfilment_' + service);
            return provider.checkout(settings);
        };
    })

    .service('fulfilmentTransferOrder', function($rootScope, $http, ngCart, ENV, $injector) {

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
    })

    .service('fulfilment_paypal', function($rootScope, $http, PaypalService, ENV, $state, $timeout) {

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
    })

    .service('fulfilment_wechat', function($rootScope, $http, ENV, $state, $timeout) {

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
    })

    .factory('AlipayService', function($q, $ionicPlatform, paypalSettings, $filter, $timeout) {

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
    })

    .factory("appUpdateService", function($ionicPopup, $timeout, $ionicLoading) {
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
    })

    .factory('Notification', function(ENV, $http, $log, $q, $rootScope, Storage) {
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
    })

    .factory('Board', function(ENV, $http, $log, $q, $rootScope, Storage) {
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
    })

    .factory('JPush', function(ENV, $http, $log, $q, $rootScope, appUpdateService) {
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

    })
