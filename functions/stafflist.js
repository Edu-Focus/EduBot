const request = require('request-promise');

let staffList = null;
let fallbackOccurences = 0;
let doRequest = true;

module.exports = async () => {
    const key = require('../config/config.js').api_key

    return new Promise(function(resolve, reject) {
    if (doRequest) {
        request({
            uri: 'https://edu-focus.org/api/discord/staff',
            json: true,
            qs: {
                key: key,
            },
        }).then(function(response) {

            doRequest = false;
            fallbackOccurences = 0;
            setTimeout(function() {
                doRequest = true;
            }, 10000);

            if (response.status === 'success') {
                staffList = response.data.staff_members;

                resolve(staffList);
            }
            else if (staffList === null) {
                console.error('Error: The api refused to retrive data (reason: ' + response.message + '), unable to continue due to absence of cache.');
                reject('refused_then_no_cache');
            }
            else if (fallbackOccurences < 3) {
                console.warn('Warning: The api refused to retrive data (reason: ' + response.message + '), using cached datas to continue.');
                fallbackOccurences++;
                resolve(staffList);
            }
            else {
                console.error('Error: The api refused to retrive data (reason: ' + response.message + '), unable to continue due to outdated cache.');
                reject('refused_then_outdated_cache');
            }
        }).catch(function(err) {
            if (staffList === null) {
                console.error('Error: Failed to retreive datas, unable to continue due to absence of cache.\n', err);
                reject('fail_then_no_cache');
            }
            else if (fallbackOccurences < 3) {
                console.warn('Warning: Failed to retreive datas, using cached datas to continue.');
                fallbackOccurences++;
                resolve(staffList);
            }
            else {
                console.error('Error: Failed to retreive datas, unable to continue due to outdated cache.');
                reject('fail_then_outdated_cache');
            }
        });
    }
    else {
        resolve(staffList);
        return;
    }
})

}