import { Injectable } from '@angular/core';
import { URLSearchParams } from '@angular/http';
import { Headers } from '@angular/http';

declare var oauthSignature: any;
var headers = new Headers();
headers.append('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');

@Injectable()
export class Config {
    
    url: any = 'http://example.com';
    consumerKey: any = 'ck_bf87b818dfd31ddsfdgfdbcd82cb5f3b07e';
    consumerSecret: any = 'cs_11f6613b7eedgfsdgf14058b67cda9c5';
    oneSignalAppId: any = '2916e1f4-b655-47b4-8ac8-4edsfdsfd6c';
    googleProjectId: any = '5743546549046';
    language: any = 'english';
    appDir: any = 'ltr';


    oauth: any;
    signedUrl: any;
    randomString: any;
    oauth_nonce: any;
    oauth_signature_method: any;
    encodedSignature: any;
    searchParams: any;
    customer_id: any;
    params: any;
    options: any = {};
    constructor() {

        this.url = 'http://130.211.141.170/wordpress-demo';
        this.consumerKey = 'ck_bf87b818dfd31d3a05257b4766bcd82cb5f3b07e';
        this.consumerSecret = 'cs_11f6613b7eeeff10e797d34ac814058b67cda9c5';

        this.options.withCredentials = true;
        this.options.headers = headers;
        this.oauth = oauthSignature;
        this.oauth_signature_method = 'HMAC-SHA1';
        this.searchParams = new URLSearchParams();
        this.params = {};
        this.params.oauth_consumer_key = this.consumerKey;
        this.params.oauth_signature_method = 'HMAC-SHA1';
        this.params.oauth_version = '1.0';
    }
    setOauthNonce(length, chars) {
        var result = '';
        for (var i = length; i > 0; --i) result += chars[Math.round(Math.random() * (chars.length - 1))];
        return result;
    }
    setUrl(method, endpoint, filter) {
        var key;
        var unordered = {};
        var ordered = {};
        if (this.url.indexOf('https') >= 0) {
            unordered = {};
            if (filter) {
                for (key in filter) {
                    unordered[key] = filter[key];
                }
            }
            unordered['consumer_key'] = this.consumerKey;
            unordered['consumer_secret'] = this.consumerSecret;
            Object.keys(unordered).sort().forEach(function(key) {
                ordered[key] = unordered[key];
            });
            this.searchParams = new URLSearchParams();
            for (key in ordered) {
                this.searchParams.set(key, ordered[key]);
            }
            return this.url + endpoint + this.searchParams.toString();
        }
        else {
            var url = this.url + endpoint;
            this.params['oauth_consumer_key'] = this.consumerKey;
            this.params['oauth_nonce'] = this.setOauthNonce(32, '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ');
            this.params['oauth_timestamp'] = new Date().getTime() / 1000;
            for (key in this.params) {
                unordered[key] = this.params[key];
            }
            if (filter) {
                for (key in filter) {
                    unordered[key] = filter[key];
                }
            }
            Object.keys(unordered).sort().forEach(function(key) {
                ordered[key] = unordered[key];
            });
            this.searchParams = new URLSearchParams();
            for (key in ordered) {
                this.searchParams.set(key, ordered[key]);
            }
            this.encodedSignature = this.oauth.generate(method, url, this.searchParams.toString(), this.consumerSecret);
            return this.url + endpoint + this.searchParams.toString() + '&oauth_signature=' + this.encodedSignature;
        }
    }
}