const express = require('express');
const router = express.Router();
const treeController = require('../controllers/treeController');

router.post('/insert', treeController.insertValue);
router.post('/delete', treeController.deleteValue);
router.post('/search', treeController.searchValue);
router.get('/tree/:treeType', treeController.getTree);
router.post('/reset', treeController.resetTree);
router.post('/export', treeController.exportTree);
router.post('/import', treeController.importTree);

module.exports = router;
