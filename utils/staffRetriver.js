const request = require('request-promise');

//TODO: creer un module a partir de ce code

var staffList = null;
var fallbackOccurences = 0;
var doRequest = true;

function retreiveStaffList(apiKey) {
    return new Promise(function(resolve, reject){
        if (doRequest) {
            request({
                uri: 'https://edu-focus.org/api/discord/staff',
                json: true,
                qs: {
                    key: apiKey
                }
            }).then(function (response) {

                doRequest = false;
                fallbackOccurences = 0;
                setTimeout(function(){
                    doRequest = true
                }, 10000);

                if (response.status === 'success') {
                    staffList = response.data.staff_members;

                    resolve(staffList);
                } else {
                    if (staffList === null) {
                        console.error('Error: The api refused to retrive data (reason: ' + response.message + '), unable to continue due to absence of cache.');
                        reject('refused_then_no_cache')
                    } else if (fallbackOccurences < 3) {
                        console.warn('Warning: The api refused to retrive data (reason: ' + response.message + '), using cached datas to continue.');
                        fallbackOccurences++;
                        resolve(staffList);
                    } else {
                        console.error('Error: The api refused to retrive data (reason: ' + response.message + '), unable to continue due to outdated cache.');
                        reject('refused_then_outdated_cache');
                    }
                }
            }).catch(function (err) {
                if (staffList === null) {
                    console.error('Error: Failed to retreive datas, unable to continue due to absence of cache.');
                    reject('fail_then_no_cache')
                } else if (fallbackOccurences < 3) {
                    console.warn('Warning: Failed to retreive datas, using cached datas to continue.');
                    fallbackOccurences++;
                    resolve(staffList);
                } else {
                    console.error('Error: Failed to retreive datas, unable to continue due to outdated cache.');
                    reject('fail_then_outdated_cache');
                }
            });
        } else {
            resolve(staffList);
            return;
        }
    });
}