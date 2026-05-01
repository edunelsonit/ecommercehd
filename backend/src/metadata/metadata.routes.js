const express = require('express');
const router = express.Router();
const metadataController = require('./metadata.controller');

router.get('/categories', metadataController.getCategories);
router.get('/states/:countryId', metadataController.getStates);
router.get('/lgas/:stateId', metadataController.getLGAs);

module.exports = router;