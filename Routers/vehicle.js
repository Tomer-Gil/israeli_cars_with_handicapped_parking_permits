const express = require('express');
const router = express.Router();

router.get("/:id", async function(request, response) {
    const packageName = request.headers.packageName;
    const fetch = request.fetch;
    /**
     * Fetch the cars modles dataset (aka package) from CKAN
     */


    /**
     * Look for the dataset out of all the datasets.
     */
    const packageSearchUrl = "https://data.gov.il/api/3/action/package_search";
     const packageSearchOptions = {
         method: "post",
         headers: {
             'Content-Type': 'application/json'
         },
         body: JSON.stringify({
             fq: `name:${packageName}`
         })
     };
     try {
         const packagesFetchObject = await fetch(packageSearchUrl, packageSearchOptions);
         if(packagesFetchObject.status === 200) {
             /**
              * Got all the datasets satisfying the search query.
              * Hopefully there is only one.
              * Implement a test in the future.
              */
             const packagesObject = await packagesFetchObject.json();
             if(packagesObject.success) {
 
                 /**
                  * Filter the right package out of all the packages found (again, hopefully one).
                  * To do this in the future.
                  */
                 const packageObject = packagesObject.result.results[0];
     
                 // In the future - filter the right resource from the above packageObject, rather than manually insreting it.
                 const resourceId = "c8b9f9c8-4612-4068-934f-d4acd2e3c06e";
 
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
             } else {
                 console.error("package_search responded with success: false");
             }
         } else {
             console.error("Status code from package_search is not 200.");
         }
     } catch(e) {
         console.error(e);
     }
});

module.exports = router;