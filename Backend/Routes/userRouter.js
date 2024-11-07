const express = require('express');
const { uploadData, getUser, getPolicyInfo, getAllPoliciesInfo } = require('../Controllers/User-Controllers');
const { uploads } = require('../Utils/multer');

const router = express.Router();

router.post('/api/upload/', uploads, uploadData);
router.get('/api/username/', getUser);
router.get('/api/userpolicyinfo/', getPolicyInfo);
router.get('/api/alluserpoliciesinfo/', getAllPoliciesInfo);

module.exports = router;
