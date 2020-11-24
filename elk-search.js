const request = require('request');
const async = require('async');
const { getKibanaRequest } = require('./kibanaQuery');
const reqHelper = require("./requestHelper");

const username = process.env.CF_USER || "ilyes.mansour@focus-corporation.com";
const password = process.env.CF_PASSWORD || "xxx";

const kbnVersion = '7.4.2';

const uaaURL = reqHelper.uaaUrl();
const logsUrl = reqHelper.logUrl();

var queryTempalte, minuteRange;

_getTokenAccess2 = (callback) => {

    request.post({
        url: xsuaa + "/oauth/token",
        form: {
            client_id: clientId,
            client_secret: clientSecret,
            "grant_type": "client_credentials",
            response_type: "token"
        },
        timeout: 10000
    }, function (error, response, body) {
        console.log("**********************1st req************************");
        console.log('statusCode: ', response.statusCode);
        if (response.statusCode === 200) {
            callback(null, request.jar(), JSON.parse(body).access_token)
        } else {
            callback(new Error("Error when getting token - status : " + response.statusCode))
        }

    });

}


_getTokenAccess = (callback) => {

    request.post({
        url: uaaURL + "/oauth/token",
        form: {
            username: username,
            password: password,
            client_id: "cf",
            "grant_type": "password",
            response_type: "token"
        },
        timeout: 10000
    }, function (error, response, body) {
        console.log("**********************1st req************************");
        console.log('statusCode: ', response.statusCode);
        if (response.statusCode === 200) {
            callback(null, request.jar(), JSON.parse(body).access_token)
        } else {
            callback(new Error("Error when getting token - status : " + response.statusCode))
        }

    });

}

_getKibanaState = (requestJar, token, callback) => {
    requesturl = logsUrl + "/app/kibana#/discover";
    request.get({
        url: requesturl,
        jar: requestJar,
        followRedirect: false
    }, function (error, response, body) {
        console.log("**********************2rd req************************");
        console.log('statusCode: ', response.statusCode);
        const query = reqHelper.getRequestParams(response.headers.location);
        if (query["state"] && query["client_id"]) {
            callback(null, requestJar, token, query["state"], query["client_id"]);
        } else {
            callback(new Error("Error state or client_id not found - status : " + response.statusCode))
        }
        

    });

}

_validateAuth = (requestJar, token, state, client_id, callback) => {
    requesturl = uaaURL + "/oauth/authorize?grant_type=authorization_code&client_id=" + client_id + "&response_type=code&state=" + state + "&redirect_uri=" + encodeURIComponent(logsUrl + "/authorization");
    request.get({
        url: requesturl,
        jar: requestJar,
        headers: {
            Authorization: "bearer " + token
        }
    }, function (error, response, body) {
        console.log("**********************3rd***********************");
        console.log('statusCode: ', response.statusCode);
        if (response.statusCode === 200) {
            callback(null, requestJar)
        } else {
            callback(new Error("Authentification faild - status : " + response.statusCode))
        }

    });

}

_sendKibanaQuery = (requestJar, callback) => {
    request.post({
        url: logsUrl + "/elasticsearch/_msearch",
        jar: requestJar,
        followRedirect: false,
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'kbn-xsrf': true,
            'kbn-version': kbnVersion
        },
        body: getKibanaRequest(component_id, startDate, endDate, queryTempalte)
    }, function (error, response, body) {
        console.log("**********************response***********************");
        console.log('statusCode: ', response.statusCode);
        if (response.statusCode === 200) {
            callback(null, JSON.parse(response.body))
        } else {
            callback(new Error("Kibana request faild - status : " + response.statusCode))
        }

    });

}

exports.getLogs = function (componentID = undefined, startDateValue, endDateValue, queryTempalteValue=undefined) {

    queryTempalte = queryTempalteValue;
    startDate = startDateValue;
    endDate = endDateValue;
    component_id = componentID;

    return new Promise((resolve, reject) => {

        async.waterfall([
            _getTokenAccess,
            _getKibanaState,
            _validateAuth,
            _sendKibanaQuery
        ], function (err, result) {
            if (!err) {
                resolve(result);
            } else {
                reject(err)
            }
        })

    })


}












