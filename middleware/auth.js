const jwt = require('jsonwebtoken');

const auth = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1]
    const decodedToken = jwt.verify(token, process.env.BCRYPT_PRIVATE_KEY)
    req.userId = decodedToken?.id

    next()
  } catch (error) {
    res.status(401).json({
      error: 'Request not authenticated'
    })
  }
}

module.exports = {
  auth
}