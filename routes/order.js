import express from 'express';
import { authorizeRoles, isAuthenticateUser } from '../middlewares/auth.js';
import { allOrders, deleteOrder, getOrderDetails, myOrders, newOrder, updateOrder } from '../controllers/orderControllers.js';
const router = express.Router();

router.route('/order/new').post(isAuthenticateUser,newOrder);
router.route('/order/:id').get(isAuthenticateUser,getOrderDetails);
router.route('/me/orders').get(isAuthenticateUser,myOrders);
router.route('/admin/orders').get(isAuthenticateUser,authorizeRoles("admin"),allOrders);
router.route('/admin/orders/:id').put(isAuthenticateUser,authorizeRoles("admin"),updateOrder);
router.route('/admin/orders/:id').delete(isAuthenticateUser,authorizeRoles("admin"),deleteOrder);
export default router