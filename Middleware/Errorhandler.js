const ErrorHandler = ( err, req, res, next) => {
    console.log("middleware Error Handling");
    const errStatus = err.statusCode || 500;
    const errMessage = err.message || "something went wrong" ;
    res.status(errStatus).json({
        success: false,
        status: errStatus,
        message: errMessage,
        stack: process.env.NODE_ENV === "development" ? err.stack : {},
    });

};

module.exports = ErrorHandler