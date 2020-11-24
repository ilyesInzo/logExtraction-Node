var async = require('async');
var elk = require('./elk-search');
var fs = require('fs');

    (async () => {
        try {
            let endDate = new Date();
            let startDate = new Date(new Date().setDate(endDate.getDate() - 1));
            let msearchResponse = await elk.getLogs(undefined, startDate, endDate);
            //responses[0] depends if we sent only one tempalte query
            if(msearchResponse.responses[0].hits.total.value > 0)
            {
                var hits = msearchResponse.responses[0].hits.hits;
                for (let index = 0; index < hits.length; index++) {
                    const element = hits[index];
                    console.log(element._source)
                }
            }
        } catch (err) {
            console.log(err)
        }
    })();


