
var fs = require('fs');

const logstash_index = JSON.stringify({ "index": "logstash-*", "ignore_unavailable": true, "preference": 1605253703666 });

_prepareQuery = (tempalteQueryFileName, componentID, startDate, endDate) => {

    var templateQuery = JSON.parse(fs.readFileSync(__dirname + "/templateQuery/" + tempalteQueryFileName, 'utf8'));

    templateQuery.query.bool.filter[1].range["@timestamp"].gte = startDate.toISOString();
    templateQuery.query.bool.filter[1].range["@timestamp"].lte = endDate.toISOString();

    if(componentID !== undefined){
        templateQuery.query.bool.filter.push({
          "match_phrase": {
            "component_id": {
              "query": componentID
            }
          }
        });

    }

    return JSON.stringify(templateQuery);
}

_getRequestQuery = (componentID, startDate, endDate) => {
    return _prepareQuery('request_query', componentID, startDate, endDate);
}

_getAppLogQuery = (componentID, startDate, endDate) => {
    return _prepareQuery('application_log_query', componentID, startDate, endDate);
}

exports.getKibanaRequest = (componentID, startDate, endDate, queryTempalte=undefined) => {
    var query = logstash_index + '\n';

    switch (queryTempalte) {
        case 1:
            query+=_getRequestQuery(componentID, startDate, endDate)+ '\n'
            break;
        case 2:
            query+=_getAppLogQuery(componentID, startDate, endDate)+ '\n'
            break;
        case 3:
             query+=_getRequestQuery(componentID, startDate, endDate)+ '\n'+ logstash_index + '\n'+ _getAppLogQuery(componentID, startDate, endDate)+ '\n'
            break;
        default:
            query+=_getAppLogQuery(componentID, startDate, endDate)+ '\n'
            break;
    }

    return query;
}

