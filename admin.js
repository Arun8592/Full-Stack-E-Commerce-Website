const express = require('express');
const router = express.Router();
const { getAllUsers, getUserById, updateUser, deleteUser } = require('../controllers/adminController');
const { protect, admin } = require('../middleware/auth');

router.use(protect, admin);
router.route('/users').get(getAllUsers);
router.route('/users/:id').get(getUserById).put(updateUser).delete(deleteUser);

module.exports = router;
