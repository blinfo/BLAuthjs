(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define([], factory);
    } else if (typeof module === 'object' && module.exports) {
        // Node. Does not work with strict CommonJS, but
        // only CommonJS-like environments that support module.exports,
        // like Node.
        module.exports = factory();
    } else {
        // Browser globals (root is window)
        root.BLAuth = factory();
    }
}(typeof self !== 'undefined' ? self : this, function () {
    'use strict';
    var root = (typeof window == 'object' && window.window === window && window);
    if (!root) {
        throw new Error('BLAuth needs the window as global context');
    }

    function getCookieValue(a) {
        var b = root.document.cookie.match('(^|;)\\s*' + a + '\\s*=\\s*([^;]+)');
        return b ? b.pop() : '';
    }
    function setCookie(name, value, days) {
        var expires = "";
        if (days) {
            var date = new Date();
            date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
            expires = "; expires=" + date.toUTCString();
        }
        root.document.cookie = name + "=" + (value || "") + expires + "; path=/";
    }
    // from https://stackoverflow.com/questions/901115/how-can-i-get-query-string-values-in-javascript
    function getParameterByName(name, url) {
        if (!url) url = window.location.href;
        name = name.replace(/[\[\]]/g, "\\$&");
        var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
            results = regex.exec(url);
        if (!results) return null;
        if (!results[2]) return '';
        return decodeURIComponent(results[2].replace(/\+/g, " "));
    }
    var BLAuth = {};
    var width, height, authURL, callback;
    BLAuth.init = function (options) {
        var urlStr, jwt;
        var clientId = encodeURI(options.clientId);
        var redirectURI = encodeURI(options.redirectURI);
        var scopes = 'USER_IDENTITY';
        if (options.scopes && options.scopes.length !== 0) {
            scopes = encodeURI(options.scopes.join(' '));
        }
        var returnURL = options.returnURL || '';
        returnURL = encodeURI(returnURL);
        width = options.width || 500;
        height = options.height || 700;
        var env = options.env ? options.env : '';
        authURL = "https://apigateway.blinfo.se/sso" + env + "/authz?" +
            "redirect_uri=" + redirectURI +
            "&client_id=" + clientId +
            "&scope=" + scopes +
            "&returnUrl=" + returnURL;
        root.addEventListener('message', function (e) {
            if (e.origin === redirectURI.split('/').slice(0, 3).join('/')) {
                var data = e.data;
                if (data.jwt) {
                    var token = data.jwt;
                    var base64Url = token.split('.')[1];
                    var base64 = base64Url.replace('-', '+').replace('_', '/');
                    var res = JSON.parse(window.atob(base64));
                    setCookie('blauth_loggedin', 'true', 1);
                    if (callback) {
                        callback({ name: res.name, firstName: res.firstname, lastName: res.lastname, email: res.email, username: res.username, authToken: token });
                    }
                    //remove blauthframe if exists
                    var blauthFrame = root.document.getElementById('blauthframe');
                    if (blauthFrame) {
                        blauthFrame.parentNode.removeChild(blauthFrame);
                    }
                }
            }
        });
        if (root.opener != null && !root.opener.closed) {
            urlStr = root.location.href;
            jwt = getParameterByName('jwt');
            root.opener.postMessage({ jwt: jwt }, urlStr.split('?')[0]);
            root.close();
        }
        if (root.top != null && !root.top.closed) {
            urlStr = root.location.href;
            jwt = getParameterByName('jwt');
            if (jwt) {
                root.top.postMessage({ jwt: jwt }, urlStr.split('?')[0]);
            }
        }
    };
    BLAuth.getLoginStatus = function (call) {
        callback = call;
        if (getCookieValue('blauth_loggedin')) {
            var iframe = root.document.createElement('iframe');
            iframe.setAttribute('id', 'blauthframe');
            iframe.style.display = "none";
            iframe.src = authURL;
            root.document.body.appendChild(iframe);
        }
    };
    BLAuth.login = function (call) {
        callback = call;
        root.open(authURL, "Björn Lundén Information AB - webbinlogg", "width=" + width + ",height=" + height);
    };
    BLAuth.logout = function (call) {
        setCookie('blauth_loggedin', '', 1);
        call.call();
    };

    return BLAuth;
}));