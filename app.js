const express = require('express');
const app = express();
const fetch = require('node-fetch');
const port = 80;
const packageName = "degem-rechev-wltp";
const vehicleRouter = require("./Routers/vehicle");

app.use("/vehicle", function(request, response, next) {
    request.options = {
        packageName: packageName
    };
    request.fetch = fetch;
    next();
}, vehicleRouter);

app.listen(port, function(error) {
    if(error) {
        console.error(error);
    } else {
        console.log(`Server listening on port ${port}`);
    }
});