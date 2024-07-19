
const listVoucher = require('../adapter/out/siebelRest');
const listVoucherResponse = require('../utils/listVoucherResponse');
const listVoucherRequest = require('../utils/listVoucherRequest'); 
const { initLogger } = require("../utils/utils");

const logic = async (event) => {
    let body;
    if(event.body) {
        body = JSON.parse(event.body)
    } else {
        body = {}
    }

    if(body.debug) {
        process.env.LOGGER_LEVEL = 'debug';
    }
    let logger = await initLogger();
    
    try {
        logger.warn('parameters', event);
        let siebelRequests =  listVoucherRequest.transform(body);
        let siebelResponses = [];

        const  voucherPromises = siebelRequests.map(async (sr, idx) => {
            console.debug("Request Siebel: ", JSON.stringify(sr));
            let siebelResponse = await  listVoucher.siebelRest(sr); 
            siebelResponses.push(siebelResponse); 
        });
    
        await Promise.all(voucherPromises);

        return listVoucherResponse.transform(siebelResponses);

    } catch (error) {
      logger.error(error);
      throw error
    }
};

module.exports = {logic};