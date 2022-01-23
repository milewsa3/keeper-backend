const { Router } = require('express');
const passwordEntityController = require('../controllers/passwordEntityController');

const router = Router();

router.get('/', passwordEntityController.get_all);
router.get('/:userId', passwordEntityController.get_all_for_user)
router.get('/:userId/:entityId/encrypted', passwordEntityController.get_entity_encrypted)
router.get('/:userId/:entityId/:masterPassword/decrypted',
  passwordEntityController.get_entity_decrypted)
router.post('/:userId', passwordEntityController.post_for_user)
module.exports = router;