const { Router } = require('express');
const passwordEntityController = require('../controllers/passwordEntityController');

const router = Router();

router.get('/', passwordEntityController.get_all_for_user)
router.get('/:entityId', passwordEntityController.get_entity_encrypted)
router.get('/:entityId/:masterPassword',
  passwordEntityController.get_entity_decrypted)
router.post('/', passwordEntityController.post_for_user)
module.exports = router;