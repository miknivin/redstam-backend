import catchAsyncErrors from "../middlewares/catchAsyncErrors.js";
import order from "../models/order.js";
import Order from "../models/order.js";
import Products from "../models/product.js";
import { getResetPasswordTemplate } from "../utils/emailTemplate.js";
import ErrorHandler from "../utils/errorHandler.js";


// Create new order => /api/v1/order/new

export const newOrder = catchAsyncErrors(async (req,res,next)=>{
    const {
        orderItems,
        shippingInfo,
        itemsPrice,
        taxAmount,
        shippingAmount,
        totalAmount,
        paymentMethod,
        paymentInfo
    }=req.body

    const order = await Order.create({
        orderItems,
        shippingInfo,
        itemsPrice,
        taxAmount,
        shippingAmount,
        totalAmount,
        paymentMethod,
        paymentInfo,
        user:req.user._id
    });

    res.status(200).json({
        order
    })
});

// Get current user order => /api/v1/me/order
export const myOrders = catchAsyncErrors(async (req,res,next)=>{
    const orders = await Order.find({user:req.user._id});

    if (!orders) {
        return next(new ErrorHandler("No Order found with this Id",404))
    }

    res.status(200).json({
        orders
    })
});

// Get order details => /api/v1/orders/:id
export const getOrderDetails = catchAsyncErrors(async (req,res,next)=>{
    const order = await Order.findById(req.params.id).populate("user","name email");
    if (!order) {
        return next(new ErrorHandler("No Order found with this Id",404))
    }

    res.status(200).json({
        order
    })
});


// Get all orders details - ADMIN => /api/v1/admin/orders
export const allOrders = catchAsyncErrors(async (req,res,next)=>{
    const orders = await Order.find({user:req.user._id});

    if (!orders) {
        return next(new ErrorHandler("No Order found with this Id",404))
    }

    res.status(200).json({
        orders
    })
});

// Update Order details - ADMIN => /api/v1/admin/orders/:id
export const updateOrder = catchAsyncErrors(async (req,res,next)=>{
    const order = await Order.findById(req.params.id).populate("user","name email");
    if (!order) {
        return next(new ErrorHandler("No Order found with this Id",404))
    }

    if(order?.orderStatus === "Delivered"){
        return next(new ErrorHandler("You have already delivered this order",400))
    }

    order?.orderItems?.forEach(async (item)=>{
        const product = await Products.findById(item?.product?.toString());
        if(!product){
            return next(new ErrorHandler("No Product found with this ID",404));
        }
        product.stock -= item.quantity;
        await product.save({validateBeforeSave:false} );
    });

    order.orderStatus = req.body.status;
    order.deliveredAt = Date.now();

    await order.save()

    res.status(200).json({
        order
    })
});

// Delete order => /api/v1/orders/:id
export const deleteOrder = catchAsyncErrors(async (req,res,next)=>{
    const order = await Order.findById(req.params.id);

    if (!order) {
        return next(new ErrorHandler("No Order found with this Id",404))
    }

    await order.deleteOne()

    res.status(200).json({
        success:true
    })
});