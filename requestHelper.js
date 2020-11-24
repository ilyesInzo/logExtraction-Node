const querystring = require('querystring');
const url = require('url');
const cf_api = process.env.VCAP_APPLICATION && JSON.parse(process.env.VCAP_APPLICATION).cf_api || "https://uaa.cf.us10.hana.ondemand.com"

_getCFRegionUrl = () =>{
//console.log(cf_api)
  return cf_api.match(/.cf(.[a-zA-Z]*)*/)[0];
}

exports.getUrlHost = (urli) => {

 return url.parse(urli,true).host

}

exports.getRequestParams = (urli, param=undefined) => {
 const urlParse = url.parse(urli,true);
 return param ? urlParse.query[param]: urlParse.query;
}

exports.uaaUrl = () => {

   return "https://cf:@"+ "uaa"+ _getCFRegionUrl();

}

exports.logUrl = () => {
    return "https://"+ "logs" + _getCFRegionUrl();
}
