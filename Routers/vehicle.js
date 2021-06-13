const express = require('express');
const router = express.Router();
const fetchResourceId = require('../fetchResourceId')

router.get("/:id", async function(request, response) {
    const packageName = request.options.packageName;
    const fetch = request.fetch;
    try {
        const resourceId = await fetchResourceId(packageName);
        /**
        * QUERY THE RESOURCE HERE!
        * Fetching the car models with the corresponding car model from the resource whose id was found earlier.
        */
        const vehicleId = request.params.id;
        const url = "https://data.gov.il/api/3/action/datastore_search";
        const filters = {};
        filters["MISPAR RECHEV"] = vehicleId;
        const options = {
                method: "post",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    resource_id: resourceId,
                    filters: filters,
                    include_total: true
                })
        };
        const carFetchObject = await fetch(url, options);
        if(carFetchObject.status === 200) {
            const carObject = await carFetchObject.json();
            if(carObject.success) {
                const recordsLength = carObject.result.records.length;
                if(recordsLength === 0) {
                    response.status(404);
                    response.send("Cars wasn't found.");
                } else if(recordsLength === 1) {
                    response.json(carObject.result.records[0]);
                } else {
                    response.status(500);
                    response.send("Invalid numbers of cars found - not 0 or 1.");
                }
            } else {
                console.error("data_store responded with success: false.");
            }
        } else {
            console.error("Status code from data_store is not 200.");
        }
    } catch(e) {
        console.error(e);
        console.error(e.stack);
    }
});

module.exports = router;