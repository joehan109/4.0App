'use strict';

appIndexCtrl.$inject = ['$scope', '$rootScope', '$state', '$cordovaToast', 'Photogram', 'PhotoService', '$timeout', 'geoService', 'FetchData', '$ionicSlideBoxDelegate', '$interval', 'Storage'];
homeCtrl.$inject = ['$scope', '$rootScope', '$log', '$timeout', '$state', 'ngCart', '$ionicSlideBoxDelegate', 'Board', 'Items', 'FetchData', 'Categories'];
cateHomeCtrl.$inject = ['$scope', '$rootScope', '$log', '$timeout', '$state', '$ionicScrollDelegate', 'ngCart', 'Items', 'FetchData', 'Categories', '$ionicSlideBoxDelegate', '$http', 'ENV', 'Storage'];
introCtrl.$inject = ['$rootScope', '$scope', '$state', 'FetchData', '$ionicSlideBoxDelegate', 'Storage'];
exploreCtrl.$inject = ['$scope', '$rootScope', '$state', '$ionicPopover', 'Photogram', 'FetchData'];
notificationCtrl.$inject = ['$rootScope', '$scope', '$state', 'Notification'];
myPostsCtrl.$inject = ['$scope', '$rootScope', 'AuthService', 'Photogram'];
likePostsCtrl.$inject = ['$scope', '$rootScope', 'AuthService', 'Photogram'];
postDetailCtrl.$inject = ['$scope', '$rootScope', '$state', '$stateParams', 'Photogram', 'AuthService', '$ionicPopup', 'photoShare'];
userDetailCtrl.$inject = ['$scope', '$rootScope', '$state', 'FetchData', '$stateParams', 'AuthService', 'Photogram', 'User', '$ionicScrollDelegate'];
userListCtrl.$inject = ['$scope', '$rootScope', '$state', 'FetchData', '$stateParams', 'AuthService', 'User'];
tabsCtrl.$inject = ['$scope', '$rootScope', '$state', '$ionicModal', '$cordovaToast', 'Photogram', 'PhotoService', '$timeout', 'geoService', 'FetchData', '$cordovaBarcodeScanner'];
shopTabsCtrl.$inject = ['$scope', '$rootScope', '$state', '$cordovaToast', 'Photogram', 'PhotoService', '$timeout', 'geoService', 'FetchData'];
feedbackCtrl.$inject = ['$scope', 'FetchData', '$rootScope'];
csCtrl.$inject = ['$rootScope', '$scope'];
faqCtrl.$inject = ['$rootScope', '$scope'];
couponsCtrl.$inject = ['$rootScope', '$scope', 'AuthService'];
categoryCtrl.$inject = ['$rootScope', '$scope', 'FetchData', '$state'];
authCtrl.$inject = ['$rootScope', '$scope', 'FetchData', '$state', 'AuthService', '$ionicModal', '$cordovaFacebook', '$interval', '$http', 'ENV', 'Storage'];
signupCtrl.$inject = ['$rootScope', '$scope', 'AuthService', '$state', '$http', 'ENV'];
accountCtrl.$inject = ['$rootScope', '$scope', 'AuthService', 'User', 'Photogram', '$ionicScrollDelegate', 'Storage'];
profileCtrl.$inject = ['$scope', 'AuthService', '$state', '$rootScope', 'PhotoService', '$http', 'ENV', '$ionicPopup'];
bindEmailCtrl.$inject = ['$rootScope', '$scope', 'AuthService'];
forgotPWCtrl.$inject = ['$rootScope', '$scope', 'AuthService', '$http', 'ENV', '$interval'];
changePWCtrl.$inject = ['$rootScope', '$scope', '$http', 'ENV'];
changePhoneCtrl.$inject = ['$rootScope', '$scope', '$http', 'ENV', '$interval', 'Storage'];
settingsCtrl.$inject = ['$rootScope', '$scope', '$state', 'AuthService', '$ionicModal', 'Storage'];
paymentSuccessCtrl.$inject = ['$location', '$timeout'];
itemCtrl.$inject = ['$scope', '$rootScope', '$stateParams', 'FetchData', '$ionicSlideBoxDelegate', 'sheetShare', '$cordovaSocialSharing', '$ionicPopup'];
itemsCtrl.$inject = ['$rootScope', '$scope', 'Items', '$state', '$stateParams'];
boardCtrl.$inject = ['$scope', '$rootScope', '$stateParams', 'FetchData', '$state'];
favorCtrl.$inject = ['$rootScope', '$scope', 'FetchData', '$state', 'ngCart'];
ordersCtrl.$inject = ['$rootScope', '$scope', 'FetchData', 'ngCart', '$ionicPopup', 'orderOpt', '$stateParams', '$state'];
calculateCtrl.$inject = ['$rootScope', '$scope', '$location', 'FetchData'];
expressCtrl.$inject = ['$rootScope', '$scope', 'FetchData', 'ngCart', 'AuthService', '$state', 'expressList'];
expressItemAddCtrl.$inject = ['$rootScope', '$scope', 'expressList'];
orderDetailCtrl.$inject = ['$rootScope', '$scope', '$state', '$stateParams', 'FetchData', 'ngCart', '$ionicPopup', 'orderOpt'];
logisticsDetailCtrl.$inject = ['$rootScope', '$scope', '$stateParams', '$state', 'FetchData', 'ngCart', '$location', '$timeout'];
cartCtrl.$inject = ['FetchData', '$rootScope', '$scope', 'ngCart', 'Storage', '$ionicPopup'];
checkoutCtrl.$inject = ['$state', '$scope', '$rootScope', 'FetchData', 'ngCart'];
addressCtrl.$inject = ['$rootScope', '$state', '$scope', 'FetchData', 'ngCart', '$ionicPopup'];
aboutCtrl.$inject = ['$rootScope', '$scope', '$state', 'appUpdateService'];
scanCtrl.$inject = ['$scope', '$rootScope', '$state', '$cordovaToast', 'Photogram', '$ionicPopup', '$timeout', 'geoService', 'FetchData', '$cordovaBarcodeScanner'];
var controllersModule = angular.module('fourdotzero.controllers', [])

function appIndexCtrl($scope, $rootScope, $state, $cordovaToast,
    Photogram, PhotoService, $timeout, geoService, FetchData, $ionicSlideBoxDelegate, $interval, Storage) {
    // 解决每次路由切换轮播停止
    $scope.$on('$ionicView.beforeEnter', function() {
        $ionicSlideBoxDelegate.start();
    });
    $scope.types = [
        { name: '扫一扫', url: 'scan', icon: 'qr-scanner', pic: 'category' },
        { name: '4.0 商城', url: 'shopTab.cateHome', icon: 'ios-home-outline', pic: 'calculate' },
        { name: '4.0 拍卖', url: 'tab.home', icon: 'ios-timer-outline', pic: 'limit' }
    ];
    $scope.goto = function(item) {
        if (!Storage.get('access_token')) {
            $rootScope.showAuthBox();
            return;
        }
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

function shopTabsCtrl($scope, $rootScope, $state, $cordovaToast,
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

function scanCtrl($scope, $rootScope, $state, $cordovaToast,
    Photogram, $ionicPopup, $timeout, geoService, FetchData, $cordovaBarcodeScanner) {

    // 每次一进页面就调用照相机
    $scope.$on('$ionicView.beforeEnter', function() {
        $scope.showOpen = false;
        $scope.showCode = false;
        $scope.alreadyShow = false;
        scan();
    });
    $scope.getDetail = false;

    $scope.getCode = function() {
        var confirmPopup = $ionicPopup.confirm({
            template: '是否需要开锁密码？',
            cancelText: '否', // String (默认: 'Cancel')。一个取消按钮的文字。
            cancelType: 'button-default', // String (默认: 'button-default')。取消按钮的类型。
            okText: '是', // String (默认: 'OK')。OK按钮的文字。
            okType: 'button-energized'
        });
        confirmPopup.then(function(res) {
            if (res) {
                FetchData.get('/mall/mascan/getPwd?id=' + $scope.data.id).then(function(res) {
                    if (res.ret) {
                        $scope.openCode = res.data.sonPwd.split('');
                        $scope.num = res.data.num || 0;
                        $scope.showOpen = false;
                        $scope.showCode = true;
                    } else {
                        $scope.$emit("alert", res.errmsg);
                    }
                });
            } else {
                console.log('You are not sure');
            }
        });

    };
    $scope.scanStart = function() {
        scan();
    };

    function scan() {
        $cordovaBarcodeScanner
            .scan()
            .then(function(barcodeData) {
                $scope.barcodeData = barcodeData;
                if (barcodeData.text) {
                    FetchData.get('/mall/mascan/get?code=' + $scope.barcodeData.text).then(function(res) {
                        if (res.ret) {
                            console.log(res.data)
                            $scope.data = res.data;
                            $scope.imgUrl = res.data.proUrl;
                            $scope.getDetail = true;
                            if (res.data.pwdFlag) {
                                $scope.showCode = true;
                                $scope.openCode = res.data.sonPwd;
                                $scope.num = res.data.num || 0;
                            } else {
                                $scope.showOpen = true;
                            }
                        }
                    }, function(res) {
                        // 查询数据出错
                        $state.go('appIndex');
                        $scope.$emit("alert", '数据不存在，请重新扫码');
                    });
                } else {
                    // 未扫到码
                    $state.go('appIndex');
                }
            }, function(error) {
                // 扫码出现异常
                $state.go('appIndex');
            });

    }


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
    $ionicScrollDelegate, ngCart,
    Items, FetchData, Categories, $ionicSlideBoxDelegate, $http, ENV, Storage) {
    //登录
    $scope.$on('$ionicView.beforeEnter', function() {
        $rootScope.hideTabs = '';
        $scope.searchQuery = '';
        if (Storage.get('cateHomeOrigin') == 'index') {
            $scope.currentIndex = 0;
            Storage.remove('cateHomeOrigin');
            $scope.banners && $scope.changeTab($scope.banners[0], 0);
        }
        $ionicSlideBoxDelegate.$getByHandle('delegateHandler2').start();
    });
    $http.get(ENV.SERVER_URL + '/mall/syscode/app/get?codeType=ma_pro_one_type').success(function(r, status) {
        if (r.ret) {
            $scope.banners = r.data;
            $scope.changeTab($scope.banners[0], 0);
        }
    });

    FetchData.get('/mall/mapro/getAll').then(function(res) {
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
        var query = $scope.searchQuery ? { query: $scope.searchQuery } : '';
        Items.setCurrentTab(tab.codeKey);
        Items.fetchTopItems(query).then(function(data) {
            $scope.isFirst = false;
            $scope.items = data;
            // $ionicSlideBoxDelegate.$getByHandle('delegateHandler').update();
        });
        if (!index) {
            index = GetCateIndex($scope.currentTab);
        }
        setPosition(index);
    };

    $scope.searchItem = function(query) {
        // $state.go('tab.search', { 'query': query });
        Items.fetchTopItems({ 'query': query }).then(function(data) {
            $scope.isFirst = false;
            $scope.items = data;
            // $ionicSlideBoxDelegate.$getByHandle('delegateHandler').update();
        });

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

        Items.fetchTopItems($scope.searchQuery ? { query: $scope.searchQuery } : null).then(function(data) {
            $scope.items = data;
        });
        $scope.$broadcast('scroll.refreshComplete');
    };

    $scope.loadMore = function() {
        if (!$scope.isFirst && Items.hasNextPage()) {
            Items.increaseNewItems($scope.searchQuery ? { query: $scope.searchQuery } : null).then(function(data) {
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
    ngCart, $ionicSlideBoxDelegate, Board,
    Items, FetchData, Categories) {
    //登录
    $scope.$on('$ionicView.beforeEnter', function() {
        $scope.$emit('alert', '该功能正在开发，请以后版本尝试')
        $state.go('appIndex')
        $rootScope.hideTabs = '';
    });

    // FetchData.get('/api/banners').then(function(data) {
    //     $scope.banners = data.banners;
    //     $ionicSlideBoxDelegate.$getByHandle('image-viewer').update();
    //     $ionicSlideBoxDelegate.$getByHandle('image-viewer').loop(true);
    // });

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

    // Board.getBoards(page).then(function(data) {
    //     $scope.boards = data.boards;
    //     page++;
    // });

    $scope.doRefresh = function() {
        page = 0;
        Board.getBoards(page).then(function(data) {
            $scope.boards = data.boards;
            page++;
        });
        $scope.$broadcast('scroll.refreshComplete');
    };

    // $scope.loadMore = function() {
    //     Board.getBoards(page).then(function(data) {
    //         $scope.boards = $scope.boards.concat(data.boards);
    //         $scope.$broadcast('scroll.infiniteScrollComplete');
    //         page++;
    //     });
    // };

    $scope.moreDataCanBeLoaded = function() {
        return Board.hasNextPage();
    };
    $scope.isEmpty = function() {
        return Board.isEmpty();
    }

}


function exploreCtrl($scope, $rootScope, $state, $ionicPopover, Photogram, FetchData) {
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

function myPostsCtrl($scope, $rootScope, AuthService, Photogram) {
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

function likePostsCtrl($scope, $rootScope, AuthService, Photogram) {
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
    AuthService, $ionicModal, $cordovaFacebook, $interval, $http, ENV, Storage) {

    $scope.commonLogin = false;
    $scope.checkLogin = function(i) {
        $scope.commonLogin = !!i
    };
    $scope.validateTime = "获取验证码";
    $scope.sendStatus = false;
    $scope.timeout = null;
    $scope.savePW = true;
    $scope.autoLogin = true;

    $scope.$watch('email', function(newVal, oldVal) {
        if (newVal && $scope.savePW) {
            var pws = Storage.get('userPassword') || [];
            angular.forEach(pws, function(item) {
                if (item.name == newVal) {
                    $scope.password = item.pwd;
                }
            });
        }
    });
    $scope.getValidateCode = function() {
        if ($scope.phone) {
            $http.get(ENV.SERVER_URL + '/mall/vip/login/getCode?type=0&phone=' + $scope.phone).success(function(data) {
                if (data.ret) {
                    $scope.$emit('alert', "发送验证码成功");
                    var timeRemaining;
                    if (!$scope.sendStatus) {
                        timeRemaining = 60;
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
                } else {
                    $scope.$emit('alert', "验证码发送失败，请稍后再试");
                }
            })
        } else {
            $scope.$emit('alert', "请输入正确的手机号");
        }

    };
    $scope.login = function() {
        $scope.error = false;
        $scope.disabled = true;
        $scope.params = {};
        if (!$scope.commonLogin) {
            $scope.params.type = 'common';
            $scope.params.data = {
                'name': $scope.email,
                'pwd': $scope.password
            };
            $scope.params.savePW = $scope.savePW;
        } else {
            $scope.params.type = 'phone';
            $scope.params.data = {
                'phone': $scope.phone,
                'code': $scope.validateCode
            };
        }
        AuthService.login($scope.params)
            .then(function() {
                $rootScope.authDialog.hide()
                $scope.$emit('alert', "登录成功");
            }).catch(function() {
                $scope.$emit('alert', "请输入正确的用户名和密码");
                $scope.disabled = false;
            });

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
            $rootScope.signupDialog = modal;
            $rootScope.signupDialog.show();
        });
    };

    $scope.closeSignupBox = function() {
        $rootScope.signupDialog.hide();
        $rootScope.signupDialog.remove();
    };

    $scope.$on('signupModal:hide', function(event) {
        $rootScope.signupDialog.hide();
        $rootScope.signupDialog.remove();
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
            $rootScope.forgotPWDialog = modal;
            $rootScope.forgotPWDialog.show();
        });
    };

    $scope.closeForgotPWBox = function() {
        $rootScope.forgotPWDialog.hide();
        $rootScope.forgotPWDialog.remove();
    };

    $scope.$on('forgotPWModal:hide', function(event) {
        $rootScope.forgotPWDialog.hide();
        $rootScope.forgotPWDialog.remove();
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

    $scope.login = function() {
        AuthService.login();
    };

    $scope.logout = function() {
        AuthService.logout();
    };
    $scope.user = AuthService;

    // $scope.onUserDetailContentScroll = onUserDetailContentScroll;
    //
    // function onUserDetailContentScroll() {
    //     var scrollDelegate = $ionicScrollDelegate.$getByHandle('userDetailContent');
    //     var scrollView = scrollDelegate.getScrollView();
    //     $scope.$broadcast('userDetailContent.scroll', scrollView);
    // }

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


    /**
     * 将dataurl转为blob对象
     * @param dataurl
     * @returns {Blob}
     */
    function dataURLtoBlob(dataurl) {
        var arr = dataurl.split(','),
            mime = arr[0].match(/:(.*?);/)[1],
            bstr = atob(arr[1]),
            n = bstr.length,
            u8arr = new Uint8Array(n);
        while (n--) {
            u8arr[n] = bstr.charCodeAt(n);
        }
        return new Blob([u8arr], { type: mime });
    }

    $scope.togglePhotoModal = function() {

        var filename = 'avatar/' + AuthService.getUser().id + '/' + new Date().getTime() + '.jpeg';

        PhotoService.open({
            pieces: 1,
            allowEdit: true
        }).then(function(image) {
            var formData = new FormData();
            formData.append('img', image);
            $http({
                url: ENV.SERVER_URL + '/mall/vip/updateImg',
                method: "POST",
                headers: { 'Content-Type': undefined },
                data: formData,
                transformRequest: function() {
                    return formData;
                }
            }).then(function(response) {
                $scope.$emit('alert', "头像上传成功");
                AuthService.refreshUser().then(function() {
                    $state.go('shopTab.account')
                })
            }, function(e) {
                $scope.$emit('alert', "上传出错，请稍后重试");
            });
            // PhotoService.upload(image, filename,
            //     function(data) {
            //         AuthService.updateAvatar(filename)
            //             .then(function(data) {
            //                 $rootScope.$broadcast('alert', "头像上传成功");
            //             }).catch(function(data) {
            //                 $rootScope.$broadcast('alert', data.error);
            //             });
            //     },
            //     function(error) {
            //         $rootScope.$broadcast('alert', "头像上传失败");
            //     });
            //
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

function forgotPWCtrl($rootScope, $scope, AuthService, $http, ENV, $interval) {
    $scope.validateTime = "获取验证码";
    $scope.validateCode = '';
    $scope.sendStatus = false;
    $scope.timeout = null;
    $scope.getValidateCode = function() {
        if ($scope.phone) {
            $http.get(ENV.SERVER_URL + '/mall/vip/login/getCode?type=3&phone=' + $scope.phone).success(function(data) {
                if (data.ret) {
                    $scope.$emit('alert', "发送验证码成功");
                    var timeRemaining;
                    if (!$scope.sendStatus) {
                        timeRemaining = 60;
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
                } else {
                    $scope.$emit('alert', "验证码发送失败，请稍后再试");
                }
            })
        } else {
            $scope.$emit('alert', "请输入正确的手机号");
        }
    };
    $scope.submit = function() {
        if ($scope.password && ($scope.password === $scope.password1)) {
            $http.post(ENV.SERVER_URL + '/mall/vip/app/resetPwd?code=' +
                    $scope.validateCode + '&phone=' + $scope.phone + '&newPwd=' + $scope.password)
                .success(function(res) {
                    if (res.ret) {
                        $scope.$emit('alert', res.data || "修改成功，请重新登录");
                    } else {
                        $scope.$emit('alert', res.errmsg || "验证出错，请稍后再试");
                    }
                });
        } else {
            $scope.$emit('alert', '请两次密码保持一致');
        }
    };
    $scope.canSave = function() {
        return $scope.phone && $scope.validateCode && $scope.password && $scope.password1
    }
}

function signupCtrl($rootScope, $scope, AuthService, $state, $http, ENV) {
    $scope.signupForm = {
        password: '',
        name: '',
        phone: ''
    };
    $scope.form = {
        password: false,
        name: false,
        phone: false
    }
    $scope.canRe = function() {
        return !($scope.form.password && $scope.form.name && $scope.form.phone && $scope.signupForm.password1);
    };
    $scope.validate = function(type) {
        var url = ENV.SERVER_URL + '/mall/vip/app/check/' + type + "?" + type + '=';
        var reg = {
            // email: /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/,
            password: /^[a-zA-Z0-9_]{6,16}$/,
            phone: /^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/,
            name: /([A-Za-z0-9]{4,20})|([\u4e00-\u9fa5]{2,10})|([\u4e00-\u9fa5][\w\W]{2})/
        }[type];
        var name = {
            password: '密码，至少6位，只支持数字字母和下划线',
            phone: '手机号',
            name: '用户名，最少4位字符'
        }[type]
        if ($scope.signupForm[type]) {
            if (reg.test($scope.signupForm[type])) {
                if (type !== 'password') {
                    $http.get(url + $scope.signupForm[type]).success(function(res) {
                        if (!res.ret) {
                            $scope.$emit('alert', res.errmsg, {}, 3000);
                            $scope.form[type] = false;
                        } else {
                            $scope.form[type] = true;
                        }
                    })
                } else {
                    $scope.form[type] = true;
                }
            } else {
                $scope.$emit('alert', "请输入正确的" + name);
            }
        }
    };
    $scope.signup = function() {
        // call register from service
        if ($scope.signupForm.password !== $scope.signupForm.password1) {
            $scope.$emit('alert', "两次输入的密码需保持一致");
            return;
        }
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
                    $scope.$emit('alert', data);
                } else {
                    $scope.$emit('alert', 'Something went wrong..');
                }
            });
    };

}

function settingsCtrl($rootScope, $scope, $state, AuthService, $ionicModal, Storage) {
    //登出
    //
    $scope.$on('$ionicView.beforeEnter', function() {
        $rootScope.hideTabs = 'tabs-item-hide';
        $scope.defaultPhone = Storage.get('user').phone
    });
    $scope.user = AuthService;

    // 修改密码弹窗
    $scope.showPasswordModifyBox = function() {
        $ionicModal.fromTemplateUrl('passwordModify.html', {
            scope: $scope,
            focusFirstInput: true,
        }).then(function(modal) {
            $rootScope.passwordDialog = modal;
            $rootScope.passwordDialog.show();
        });
    };

    $scope.closePasswordModifyBox = function() {
        $rootScope.passwordDialog.hide();
        $rootScope.passwordDialog.remove();
        $scope.defaultPhone = Storage.get('user').phone
    };

    $scope.$on('changePWModal:hide', function(event) {
        $rootScope.passwordDialog.hide();
        $rootScope.passwordDialog.remove();
        $scope.defaultPhone = Storage.get('user').phone
    })

    // 修改手机号弹窗
    $scope.showPhoneModifyBox = function() {
        $ionicModal.fromTemplateUrl('phoneModify.html', {
            scope: $scope,
            focusFirstInput: true,
        }).then(function(modal) {
            $rootScope.phoneDialog = modal;
            $rootScope.phoneDialog.show();
        });
    };

    $scope.closePhoneModifyBox = function() {
        $rootScope.phoneDialog.hide();
        $rootScope.phoneDialog.remove();
    };

    $scope.$on('changePhoneModal:hide', function(event) {
        $rootScope.phoneDialog.hide();
        $rootScope.phoneDialog.remove();
    })


    // $scope.logout = function() {
    //     AuthService.logout()
    //         .then(function() {
    //             $state.go('tab.account');
    //         });
    // };
}

function changePWCtrl($rootScope, $scope, $http, ENV) {
    $scope.submit = function() {
        if ($scope.new1 !== $scope.new) {
            $scope.$emit('alert', "两次输入的新密码需保持一致");
            return;
        }
        $http.post(ENV.SERVER_URL + '/mall/vip/updatePwd?oldPwd=' + $scope.origin + '&newPwd=' + $scope.new)
            .success(function(res) {
                if (res.ret) {
                    $rootScope.$broadcast('changePWModal:hide');
                    $scope.$emit('alert', res.data || "修改密码成功");
                } else {
                    $scope.$emit('alert', res.errmsg || "系统出错，请稍后再试");
                }
            });
    }
}

function changePhoneCtrl($rootScope, $scope, $http, ENV, $interval, Storage) {
    $scope.validateTime = "获取验证码";
    $scope.validateCode = '';
    $scope.sendStatus = false;
    $scope.timeout = null;
    $scope.getValidateCode = function() {
        if ($scope.phone) {
            $http.get(ENV.SERVER_URL + '/mall/vip/login/getCode?type=1&phone=' + $scope.phone).success(function(data) {
                if (data.ret) {
                    $scope.$emit('alert', "发送验证码成功");
                    var timeRemaining;
                    if (!$scope.sendStatus) {
                        timeRemaining = 60;
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
                } else {
                    $scope.$emit('alert', "验证码发送失败，请稍后再试");
                }
            })
        } else {
            $scope.$emit('alert', "请输入正确的手机号");
        }
    };
    $scope.submit = function() {
        $http.post(ENV.SERVER_URL + '/mall/vip/updatePhone?code=' + $scope.validateCode + '&phone=' + $scope.phone)
            .success(function(res) {
                if (res.ret) {
                    var user = Storage.get('user');
                    user && (user.phone = $scope.phone);
                    Storage.set('user', user);
                    $rootScope.$broadcast('changePhoneModal:hide');
                    $scope.$emit('alert', res.data || "修改手机号成功");
                } else {
                    $scope.$emit('alert', res.errmsg || "系统出错，请稍后再试");
                }
            });
    };
    $scope.canSave = function() {
        return $scope.phone && $scope.validateCode
    }
}

function paymentSuccessCtrl($location, $timeout) {
    var order_id = $location.search().order_id;
    var order_type = $location.search().order_type;
    $timeout(function() {
        $location.url($location.path());
        if (order_type == 'TRANSFER') {
            $location.path('/order/transfer/' + order_id);
        } else {
            $location.path('/orders/3');
        }
    }, 2000);

}

function paymentCancelCtrl() {

}


function itemCtrl($scope, $rootScope, $stateParams, FetchData,
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
        $scope.quantity = 1;
        $scope.specsDialog.close();
    })

    $scope.$on('specsBuyModal:hide', function(event) {
        $scope.quantity = 1;
        $scope.buyDialog.close();
    })

    FetchData.get('/mall/mapro/get?id=' + $stateParams.id).then(function(data) {
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

    var page = 1;

    Items.searchItems(query, sub_cate, page).then(function(data) {
        $scope.items = data;
        page++;
    });

    $scope.doRefresh = function() {
        page = 1;
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
            FetchData.get('/mall/macollect/getAll').then(function(data) {
                $scope.items = data.data;
            });
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

function ordersCtrl($rootScope, $scope, FetchData, ngCart, $ionicPopup, orderOpt, $stateParams, $state) {
    //订单列表
    //
    $scope.$on('$ionicView.beforeEnter', function() {
        $scope.orders = [];
        $rootScope.hideTabs = 'tabs-item-hide';
        if ($stateParams.status_id) {
            $scope.orderType = $stateParams.status_id
        }
        FetchData.get('/mall/maorder/query?code=&status=' + $scope.orderType).then(function(data) {
            if ($scope.orderType == '0') {
                angular.forEach(data.data.data, function(item) {
                    item.endTime = (new Date(item.createTime).getTime()) + 30 * 60 * 1000
                })
            }
            $scope.orders = data.data.data;
        });
    });
    $scope.ngCart = ngCart;
    $scope.orderType = $stateParams.status_id || '0';
    $scope.finished = function(id) {
        $state.go('tab.orders', {
            status_id: 0
        });
    }
    $scope.setType = function(type) {
        if (type !== $scope.orderType) {
            $scope.orderType = type;
            FetchData.get('/mall/maorder/query?code=&status=' + type).then(function(data) {
                if (type == '0') {
                    angular.forEach(data.data.data, function(item) {
                        item.endTime = (new Date(item.createTime).getTime()) + 30 * 60 * 1000
                    })
                }
                $scope.orders = data.data.data;
            });
        }
    };
    $scope.orderDone = function(order) {
        var confirmPopup = $ionicPopup.confirm({
            template: '确定已收到货?',
            cancelText: '否',
            cancelType: 'button-default',
            okText: '是',
            okType: 'button-energized'
        });
        confirmPopup.then(function(res) {
            if (res) {
                orderOpt.done(order.id, $scope.orderType);
            } else {
                console.log('You are not sure');
            }
        });
    }
    $scope.orderDel = function(order) {
        var confirmPopup = $ionicPopup.confirm({
            template: '确定删除该订单?',
            cancelText: '否',
            cancelType: 'button-energized',
            okText: '是',
            okType: 'button-default'
        });
        confirmPopup.then(function(res) {
            if (res) {
                orderOpt.del(order.id, $scope.orderType);
            } else {
                console.log('You are not sure');
            }
        });
    };
    $scope.orderCancel = function(order) {
        var confirmPopup = $ionicPopup.confirm({
            template: '确定取消该订单?',
            cancelText: '否',
            cancelType: 'button-energized',
            okText: '是',
            okType: 'button-default'
        });
        confirmPopup.then(function(res) {
            if (res) {
                orderOpt.cancel(order.id, $scope.orderType);
            } else {
                console.log('You are not sure');
            }
        });
    };
    $scope.goTo = function() {
        $state.go('shopTab.account')
    };
}

function orderDetailCtrl($rootScope, $scope, $state, $stateParams, FetchData, ngCart, $ionicPopup, orderOpt) {
    //订单详情
    //
    $scope.$on('$ionicView.beforeEnter', function() {
        $rootScope.hideTabs = 'tabs-item-hide';
        $scope.statusId = $stateParams.status_id || '';
    });

    $scope.ngCart = ngCart;

    FetchData.get('/mall/maorder/query?code=' + $stateParams.order_id + '&status=').then(function(data) {
        $scope.order = data.data.data[0];
        if ($scope.order.status == '0') {
            $scope.order.endTime = (new Date($scope.order.createTime).getTime()) + 30 * 60 * 1000
        }
    });
    $scope.goTab = function() {
        if ($scope.statusId) {
            $state.go('tab.orders', {
                status_id: $scope.statusId
            });
        } else {
            $scope.$ionicGoBack();
        }
    };
    // A confirm dialog
    $scope.cancelOrder = function() {
        var confirmPopup = $ionicPopup.confirm({
            template: '确定取消订单?',
            cancelText: '否',
            cancelType: 'button-energized',
            okText: '是',
            okType: 'button-default'
        });
        confirmPopup.then(function(res) {
            if (res) {
                orderOpt.cancel($scope.order.id);
            } else {
                console.log('You are not sure');
            }
        });
    };
    $scope.delOrder = function() {
        var confirmPopup = $ionicPopup.confirm({
            template: '确定删除订单?',
            cancelText: '否',
            cancelType: 'button-energized',
            okText: '是',
            okType: 'button-default'
        });
        confirmPopup.then(function(res) {
            if (res) {
                orderOpt.del($scope.order.id, 3);
            } else {
                console.log('You are not sure');
            }
        });
    };
    $scope.doneOrder = function() {
        var confirmPopup = $ionicPopup.confirm({
            template: '确定已收到货?',
            cancelText: '否',
            cancelType: 'button-energized',
            okText: '是',
            okType: 'button-default'
        });
        confirmPopup.then(function(res) {
            if (res) {
                orderOpt.done($scope.order.id, 3);
            } else {
                console.log('You are not sure');
            }
        });
    };
}

function logisticsDetailCtrl($rootScope, $scope, $stateParams, $state, FetchData, ngCart, $location, $timeout) {
    //商品详情
    $scope.$on('$ionicView.beforeEnter', function() {
        $rootScope.hideTabs = 'tabs-item-hide';
        $scope.nodata = false;
        $scope.statusId = $stateParams.status_id || '';
    });

    FetchData.get('/mall/maorder/query?code=' + $stateParams.order_id + '&status=').then(function(res) {
        $scope.order = res.data.data[0];
        var url = '/mall/maorder/express/query?id'
        FetchData.get('/mall/maorder/express/query?id=' + $scope.order.id).then(function(res) {
            $scope.logistics = res.data.data;
            $scope.logisticDetail = res.data;
        }, function() {
            // $timeout(function() {
            //     $scope.goTab();
            // }, 3000)
        });
    });
    $scope.goTab = function() {
        if ($scope.statusId) {
            $state.go('tab.orders', {
                status_id: $scope.statusId
            });
        } else {
            $scope.$ionicGoBack();
        }
    };

    $scope.allStatus = [];
    // FetchData.get('/api/orders/get/' + $stateParams.order_id).then(function(data) {
    //     $scope.ngCart = ngCart;
    //     $scope.order = data.order;
    //     $scope.logistic = data.order.logistics[0];
    //     angular.forEach($scope.logistic.all_status, function(status, index) {
    //         $scope.allStatus.push(status.status);
    //     });
    // });

    $scope.currTab = 0;
    // $scope.goTab = function(index, lo) {
    //     $scope.currTab = index;
    //     $scope.logistic = lo;
    //     angular.forEach($scope.logistic.all_status, function(status, index) {
    //         $scope.allStatus.push(status.status);
    //     });

    // }

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
                $location.path('/orders/3');
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

function cartCtrl(FetchData, $rootScope, $scope, ngCart, Storage, $ionicPopup) {
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
    $scope.delete = function() {
        var confirmPopup = $ionicPopup.confirm({
            template: '确定删除已选中的项目?',
            cancelText: '否',
            cancelType: 'button-energized',
            okText: '是',
            okType: 'button-default'
        });
        confirmPopup.then(function(res) {
            if (res) {
                ngCart.getSelectedItems().forEach(function(item) {
                    ngCart.removeItemById(item._data.id);
                })
            } else {
                console.log('You are not sure');
            }
        });

    }
    $scope.selectAllEntries = function() {
        if ($scope.isSelectedAll === false) {
            angular.forEach(ngCart.getCart().items, function(item, index) {
                if (!ngCart.getSelectedItemById(item._data.id)) {
                    ngCart.selectItem(item._data.id);
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
        if ($rootScope.provider_prices) {
            ngCart.setExpress($rootScope.provider_prices[0]);
        }
    });
    $scope.provider_prices = [{
        name: '普通快递',
        id: '0'
    }, {
        name: '同城闪送',
        id: '1'
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
        // 全局保存
        $rootScope.provider_prices = data.data;

        // 设置购物车默认快递
        $scope.selectedProvider = data.data[0];
        ngCart.setExpress(data.data[0]);
    });

    // provider actions
    $scope.providersShown = false;

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
    };
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

function addressCtrl($rootScope, $state, $scope, FetchData, ngCart, $ionicPopup) {
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
        var confirmPopup = $ionicPopup.confirm({
            template: '确定删除已选中的项目?',
            cancelText: '否',
            cancelType: 'button-energized',
            okText: '是',
            okType: 'button-default'
        });
        confirmPopup.then(function(res) {
            if (res) {
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
            } else {
                console.log('You are not sure');
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
controllersModule.controller('changePWCtrl', changePWCtrl);
controllersModule.controller('changePhoneCtrl', changePhoneCtrl);
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