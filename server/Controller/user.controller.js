const test = async (req, res) => {
    res.json({success: true, msg: "Api route test done"});
}

module.exports = {
    test
}