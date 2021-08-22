

module.exports = (services) => {
    
    return (req, res, next) => {
        const authHeader = req.headers.authorization;
        const token = authHeader && authHeader.split(' ')[1];
        if (token) {
            const uid = services.verifyToken(token)
            console.log('uid', uid)
            if (uid !== null) {
                req.uid = uid
                return next();
            }
        } 
        res.status(401).send('Unauthorized')
    }
}