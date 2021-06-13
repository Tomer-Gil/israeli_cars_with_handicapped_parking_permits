/**
 * Get the ID of the most recent updated, with active datastore resource of a CKAN dataset (aka package) with a given name.
 */
const fetch = require('node-fetch');

const fetchResourceId = async function(datasetName) {
    /**
     * Look for the dataset out of all the datasets.
     */
    const datasetSearchUrl = "https://data.gov.il/api/3/action/package_search";
    let datasetSearchOptions = {
        method: "post",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            fq: `name:${datasetName}`
        })
    };

    let datasetsFetchObject = await fetch(datasetSearchUrl, datasetSearchOptions);
    // Error thrown from here by promise rejection will be catched by the wrapping try...catch in the outer file.

    if(datasetsFetchObject.status === 200) {
        let datasetsObject = await datasetsFetchObject.json();
        /**
         * Got all the datasets satisfying the search query.
         * Hopefully there is only one.
         */
        if(datasetsObject.success) {
            /**
             * Make sure only one dataset has been found.
             */
            let numOfDatasets = datasetsObject.result.results.length;
            if(numOfDatasets === 0) {
                return Promise.reject(new Error("No packages found."));
            } else if(numOfDatasets === 1) {
                let datasetObject = datasetsObject.result.results[0];
                let resources = datasetObject.resources;

                // Filter resources with active data*STORE*.
                resources = resources.filter(function(resource) {
                    return resource.datastore_active;
                });

                // Get the most recent resource.
                let latestResource = resources.reduce(function(currentLatest, currentDate){
                    return (currentLatest.last_modified > currentDate.last_modified ? currentLatest : currentDate);
                });
                let resourceId = latestResource.id;
    
                return resourceId;
            } else {
                return Promise.reject(new Error("Invalid number of packages found - not 0 nor 1."));
            }
        } else {
            return Promise.reject(new Error("package_search responded with success: false"));
        }
    } else {
        return Promise.reject(new Error("Status code from package_search is not 200."));
    }
};

module.exports = fetchResourceId;