const jwt = require('jsonwebtoken');
const bcrypt = require("bcrypt");
const User = require('../models/User')

const handleErrors = (err) => {
  let errors = { email: '', password: '', name: '' };

  err.errors.forEach(el => {
    if (el.message.includes('user.name')) {
      errors.name = el.message.replace(/user.name/g, 'name')
    } else if (el.message.includes('user.email')) {
      errors.email = el.message.replace(/user.email/g, 'name')
    } else if (el.message.includes('user.password')) {
      errors.password = el.message.replace(/user.password/g, 'name')
    }
  })

  return errors;
}

// create json web token
const maxAge = 3 * 24 * 60 * 60;
const createToken = (email, id) => {
  return jwt.sign({ email, id }, process.env.BCRYPT_PRIVATE_KEY, {
    expiresIn: maxAge
  });
};

const validateUserForSignup = async ({ name, email, password, confirmPassword }) => {
  let error = { name: '', email: '', password: '', confirmPassword: '' }

  if (!name) {
    error.name = 'Name cannot be empty'
    return { error }
  }

  if (!email) {
    error.email = 'Email cannot be empty'
    return { error }
  }

  if (!password) {
    error.password = 'Password cannot be empty'
    return { error }
  }

  if (!confirmPassword) {
    error.confirmPassword = 'Confirm password cannot be empty'
    return { error }
  }

  try {
    const existingUser = await User.findAll({ where: { email: email } })
    if (existingUser[0]) {
      error.email = 'User already exist.'
      return { error }
    }

    if (password !== confirmPassword) {
      error.confirmPassword = 'Passwords do not match'
      return { error }
    }

    return {}
  }
  catch (err) {
    error.email = 'Something went wrong'
    return { error }
  }
}

module.exports.signup_post = async (req, res) => {
  const data = await validateUserForSignup(req.body)
  if (data.error) {
    res.status(400).json(data)
    return
  }

  try {
    const { email, password, name } = req.body
    const user = await User.create({ name, email, password })
    const token = createToken(user.email, user.id)
    res.status(200).json({ result: user, token })
  }
  catch (err) {
    const error = handleErrors(err)
    res.status(400).json({ error });
  }
}

const validateUserForSignin = async ({ email, password }) => {
  let error = { email: '', password: '' }

  if (!email) {
    error.email = 'Email is empty'
    return { error }
  }

  if (!password) {
    error.password = 'Password is empty'
    return { error }
  }

  try {
    const fetchedUsers = await User.findAll({ where: { email: email } })
    const existingUser = fetchedUsers[0]
    if (!existingUser) {
      error.email = 'User doesn\'t exist.'
      return { error }
    }

    const isPasswordCorrect = await bcrypt.compare(password, existingUser.password)
    if (!isPasswordCorrect) {
      error.password = 'Invalid credentials'
      return { error }
    }

    return { user: existingUser }
  }
  catch (err) {
    console.log(err)
    error.email = 'Something went wrong'
    return { error }
  }
}

module.exports.signin_post = async (req, res) => {
  const data = await validateUserForSignin(req.body)
  if (data.error) {
    res.status(400).json(data)
  } else {
    let user = data.user
    const token = createToken(user.email, user.id)
    res.status(200).json({ result: user, token })
  }
}