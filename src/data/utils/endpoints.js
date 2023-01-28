const configInit = require("./config");
const config = configInit();

module.exports = function (api, method, args, params) {
    let url = [];
    let queryString = [];

    url.push(config[api].endpoint);

    if (method) url.push(method);

    if (args) url.push(args.join("/"))

    url = url.join("/");

    if (params) {
        Object.keys(params).forEach((key) => {
            queryString.push(key + "=" + params[key]);
        })

        queryString = "?" + queryString.join("&");
    }

    return url + queryString;
};
