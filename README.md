
## 快速开始

    $ sudo npm install -g cordova ionic

    $ git clone https://github.com/joehan109/4.0App.git


    $ cd 4.0App
    $ ionic platform add ios
    $ ionic platform add android


```bash
npm install
bower install

cordova plugin add com.ionic.keyboard
cordova plugin add cordova-plugin-console
cordova plugin add cordova-plugin-whitelist
cordova plugin add cordova-plugin-device
cordova plugin add cordova-plugin-statusbar
cordova plugin add cordova-plugin-splashscreen
cordova plugin add cordova-plugin-camera
cordova plugin add cordova-plugin-dialogs
cordova plugin add https://git.oschina.net/seasonstar/ImagePicker.git
cordova plugin add cordova-plugin-geolocation
cordova plugin add cordova-plugin-file
cordova plugin add cordova-plugin-file-transfer
cordova plugin add cordova-plugin-x-toast
cordova plugin add cordova-plugin-x-socialsharing
cordova plugin add ionic-plugin-deploy

cordova plugin add https://github.com/RaananW/PhoneGap-Image-Resizer
cordova plugin add https://github.com/Telerik-Verified-Plugins/NativePageTransitions#0.6.2
cordova plugin add cordova-plugin-wkwebview
cordova plugin add com-sarriaroman-photoviewer
cordova plugin add https://github.com/dsolimando/ImageViewer
cordova plugin add http://git.oschina.net/seasonstar/PayPal-Cordova-Plugin
cordova plugin add cordova-plugin-wechat --variable wechatappid=########
cordova plugin add https://github.com/iVanPan/cordova_weibo.git --variable WEIBO_APP_ID=#######
cordova plugin add https://github.com/iVanPan/Cordova_QQ.git --variable QQ_APP_ID=#####
cordova plugin add  https://github.com/jpush/jpush-phonegap-plugin.git --variable API_KEY=######
cordova -d plugin add path/to/add/phonegap-facebook-plugin --variable APP_ID="####" --variable APP_NAME="####"

# Note： 以上所有的--variable请改为自己申请的ID
```


#### 浏览器
    $  ionic serve
    $  gulp watch
#### ios
    $  ionic build ios
    $  ionic run ios
#### android
    $  ionic build android
    $  ionic run android
