const express = require('express');
const router = express.Router();
const db = require('../config/database');
const PasswordEntityRoutes = require('../models/PasswordEntity');
const Sequelize = require('sequelize');
const PasswordEntity = require('../models/PasswordEntity')
const { decryptPasswordEntity, encryptPasswordEntity } = require('../utils/security');
const bcrypt = require('bcrypt');
const Op = Sequelize.Op;
const User = require('../models/User')

module.exports.get_all_for_user = async (req, res) => {
  const userId = req.userId

  if (!userId) {
    res.status(400).json('Error: UserId cannot be empty')
  }

  PasswordEntityRoutes.findAll({
    where: {
      userId: userId
    }
  })
  .then(result => res.json(result))
  .catch(err => res.status(400).json('Error: ' + err))
}

const validate_post_for_user = async (req) => {
  let error = { pageUrl: '', password: '', masterPassword: '' }
  const body = req.body
  const userId = req.userId

  if (!userId) {
    error.masterPassword = 'User id cannot be empty'
  }

  if (!body.pageUrl) {
    error.pageUrl = 'Page URL cannot be empty'
    return { error }
  }

  if (!body.password) {
    error.password = 'Password cannot be empty'
    return { error }
  }

  if (!body.masterPassword) {
    error.masterPassword = 'Master password cannot be empty'
    return { error }
  }

  const existingUser = await User.findOne({
    where: {
      id: userId
    }
  })

  const isMasterPasswordCorrect = await bcrypt.compare(body.masterPassword,
    existingUser.masterPassword)
  if (!isMasterPasswordCorrect) {
    error.masterPassword = 'Invalid master password'
    return { error }
  }

  return {}
}

module.exports.post_for_user = async (req, res) => {
  const result = await validate_post_for_user(req)

  if (result.error) {
    res.status(400).json(result)
    return
  }

  const userId = req.userId

  try {
    const { pageUrl, password, masterPassword } = req.body
    const passwordEntity = await PasswordEntity.build({ pageUrl, password, userId })
    await encryptPasswordEntity(passwordEntity, masterPassword)
    await passwordEntity.save()
    res.status(200).json(passwordEntity)
  }
  catch (err) {
    console.log(err)
    res.status(400).json({ error: 'Unable to create password entity' })
  }
}

module.exports.get_entity_encrypted = async (req, res) => {
  const entityId = req.params.entityId
  const userId = req.userId

  PasswordEntityRoutes.findOne({
    where: {
      userId: userId,
      id: entityId
    }
  })
  .then(result => res.json({ id: result.id, pageUrl: result.pageUrl, password: result.password }))
  .catch(err => res.status(400).json('Error: ' + err))
}

const validate_get_entity_decrypted = async (data) => {
  const { masterPassword, userId, entityId } = data
  let error = { masterPassword: '', userId: '', entityId: '' }

  if (!masterPassword) {
    error.masterPassword = 'Master password cannot be empty'
    return { error }
  }

  if (!userId) {
    error.userId = 'User id cannot be empty'
    return { error }
  }

  if (!entityId) {
    error.entityId = 'Entity id cannot be empty'
    return { error }
  }

  const existingUser = await User.findOne({
    where: {
      id: userId
    }
  })

  const isMasterPasswordCorrect = await bcrypt.compare(masterPassword, existingUser.masterPassword)
  if (!isMasterPasswordCorrect) {
    error.masterPassword = 'Invalid master password'
    return { error }
  }

  return {}
}

module.exports.get_entity_decrypted = async (req, res) => {
  const { entityId, masterPassword } = req.params
  const userId = req.userId
  const result = await validate_get_entity_decrypted({ userId, entityId, masterPassword })

  if (result.error) {
    res.status(400).json(result)
    return
  }

  PasswordEntityRoutes.findOne({
    where: {
      userId: userId,
      id: entityId
    },
    raw: true,
  })
  .then(result => {
    if (result) {
      decryptPasswordEntity(result, masterPassword)
    }
    res.json({ id: result.id, pageUrl: result.pageUrl, password: result.password })
  })
  .catch(err => res.status(400).json('Error: ' + err))
}