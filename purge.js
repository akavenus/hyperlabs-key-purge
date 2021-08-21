const got = require('got')
const colors = require('colors')
const fs = require("fs")
var purgeNumber = 0
var safeNumber = 0
var sk_key = '' //your sk key
var yourPageCount = 1 //replace 1 with the # of pages your dash has (total keys/20 = # of pages)
async function purgeKeys(){
    try {
        var purgeI = 1
        while (purgeI < yourPageCount){
            var purgeRequest = await got(`https://api.hyper.co/v4/licenses?page=${purgeI}`, {
            headers: {
                'Authorization': `Bearer ${sk_key}`
            }
            })
            console.log(JSON.parse(purgeRequest.body)['data'].length)
            var i = 0
            while (i < JSON.parse(purgeRequest.body)['data'].length){
                console.log('-----------------------------------------------------')
                //console.log(`User: ${JSON.parse(purgeRequest.body)['data'][i]['user']['username']}`.green)
                console.log(`Key: ${JSON.parse(purgeRequest.body)['data'][i]['key']}`.green)
                console.log('-----------------------------------------------------')
                if (JSON.parse(purgeRequest.body)['data'][i]['metadata']['hwid'] == null || JSON.parse(purgeRequest.body)['data'][i]['metadata']['hwid'] == ''){
                    purgeNumber++
                    var purgeRequest2 = await got(`https://api.hyper.co/v6/licenses/${JSON.parse(purgeRequest.body)['data'][i]['key']}`, {
                        method: 'DELETE',
                        headers: {
                            'Authorization': `Bearer ${sk_key}`
                        }
                    })
                    if (purgeRequest2.statusCode === 200 || purgeRequest2.statusCode === 201 || purgeRequest2.statusCode === 202){
                        console.log('Successfully purged a key')
                        try {
                            fs.appendFile(path.join(`purgedKeys.txt`), `${JSON.parse(purgeRequest.body)['data'][i]['user']['username']}:${JSON.parse(purgeRequest.body)['data'][i]['key']}:`,function(err){
                                if(err) throw err;
                                });
                        } catch (error){
                            fs.appendFile(path.join(`purgedKeys.txt`), `noUser:${JSON.parse(purgeRequest.body)['data'][i]['key']}:`,function(err){
                                if(err) throw err;
                                });
                        }
                    }
                    else {
                        console.log(`Failed to purged a key ${purgeRequest2.statusCode}`)
                    }
                }
                else {
                    safeNumber++
                }
                i++
            }
            purgeI++
        }
            console.log(`Purge Number: ${purgeNumber}`.red)
            console.log(`Safe Number: ${safeNumber}`.green)
            
    } catch(error){
        console.log(error)
    }
}
purgeKeys()
