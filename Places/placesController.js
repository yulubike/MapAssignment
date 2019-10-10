
function dummy(apiVersion, req, res, next) {
    res.send(apiVersion);
}

module.exports = {
    dummy
}