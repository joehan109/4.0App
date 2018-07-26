"use strict";

angular.module('fourdotzero.filters', [])

.filter('reverse', function() {
    return function(items) {
        if (!angular.isArray(items)) return false;
        return items.slice().reverse();
    };
})

.filter('nl2br', function($sce) {
        return function(msg, is_xhtml) {
            var is_xhtml = is_xhtml || true;
            var breakTag = (is_xhtml) ? '<br />' : '<br>';
            var msg = (msg + '').replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, '$1' + breakTag + '$2');
            return $sce.trustAsHtml(msg);
        }
    })
    .filter('express', function() {
        return function(input) {
            return {
                'tiantian': '天天快递',
                'yunda': '韵达快递',
                'huitongkuaidi': '百世汇通',
                'ems': 'EMS',
                'guotongkuaidi': '国通快递',
                'huitongkuaidi': '汇通快运',
                'quanfengkuaidi': '全峰快递',
                'rufengda': '如风达快递',
                'shentong': '申通快递',
                'shunfeng': '顺丰快递',
                'wanxiangwuliu': '万象物流',
                'yuantong': '圆通快递',
                'zhongtong': '中通速递',
                'zhaijisong': '宅急送',
                'zhongsukuaidi': '中速快件'
            }[input]
        }
    })