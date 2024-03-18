import express from 'express';
import { registerUser, loginUser, logoutUser, forgotPassword, resetPassword, getUserProfile, updatePassword, updateProfile, allUsers, getUserDetails, updateUser, deleteUser } from '../controllers/authControllers.js';
import { authorizeRoles, isAuthenticateUser } from '../middlewares/auth.js';


const router = express.Router();

router.route('/register').post(registerUser);
router.route('/login').post(loginUser);
router.route('/logout').get(logoutUser);
router.route('/password/forgot').post(forgotPassword);
router.route('/password/reset/:token').put(resetPassword);
router.route('/me').get(isAuthenticateUser, getUserProfile);
router.route('/me/update').put(isAuthenticateUser, updateProfile);
router.route('/password/update').put(isAuthenticateUser, updatePassword);
router.route('/admin/users').get(isAuthenticateUser, authorizeRoles("admin"), allUsers);
router
    .route('/admin/users/:id')
    .get(isAuthenticateUser, authorizeRoles("admin"), getUserDetails)
    .put(isAuthenticateUser,authorizeRoles("admin"),updateUser)
    .delete(isAuthenticateUser, authorizeRoles("admin"),deleteUser)
    ;
export default router;