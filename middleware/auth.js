const config = require("config");
const jwt = require("jsonwebtoken");




function auth(req,res,next) {
const token = req.header("x-auth-token")
if (!token) return res.status(401).json({msg :"no token"})

	try {
	const decoded = jwt.verify(token,config.get("jwtsecret"));

    req.user = decoded;
    next();
	} catch (e) {
		res.status(400).json({msg:"token is not valid"})
	}



}


module.exports = auth;