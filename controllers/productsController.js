import products from '../models/product.js'
import ErrorHandler from '../utils/errorHandler.js';
import catchAsyncErrors from '../middlewares/catchAsyncErrors.js';
import APIFilters from '../utils/apiFilters.js';

export const getProducts = catchAsyncErrors(async (req, res, next) => {
    const resPerPage = req.query.resPerPage || 4;
    const apiFilters = new APIFilters(products, req.query).search().filter();;
  
    let filteredProducts = await apiFilters.query;
    let filteredProductsCount = filteredProducts.length;
  
    apiFilters.pagination(resPerPage);
    filteredProducts = await apiFilters.query.clone();
  
    res.setHeader("Content-Type", "application/json");
  
    res.status(200).json({
      resPerPage,
      filteredProductsCount,
      filteredProducts,
    });
  });

//create a new product
export const newProduct = catchAsyncErrors( async (req,res,next)=>{

   req.body.user = req.user._id;
   const product = await products.create(req.body)

   res.status(200).json({
    product
   })
}
);

//to fetch a product details by id 
export const getProductById = catchAsyncErrors( async (req,res,next)=>{
    
    const productById = await products.findById(req?.params?.id)

    if(!productById){
        return next(new ErrorHandler("Product not found",404))
    }

    res.status(200).json({
        productById
    })
}
);
//to update a particular product
export const updateProductById = catchAsyncErrors( async (req,res)=>{
    
    let productById = await products.findById(req?.params?.id)

    if(!productById){
        return next(new ErrorHandler("Product not found",404))
    }

    productById = await products.findByIdAndUpdate(req?.params?.id, req.body, {new:true})

    res.status(200).json({
        productById
    })
});

//to Delete a particular product
export const deleteProductById = catchAsyncErrors( async (req,res)=>{
    
    const productById = await products.findById(req?.params?.id)

    if(!productById){
        return next(new ErrorHandler("Product not found",404))
    }

 await productById.deleteOne()

    res.status(200).json({
        message:'Product Deleted'
    })
}
);

//Create/update product review => api/v1/reviews
export const createProductReview = catchAsyncErrors( async (req,res,next)=>{
    
    const {rating, comment, productId } = req.body;

    const review = {
        user: req?.user?._id,
        rating: Number(rating),
        comment
    }

    const product = await products.findById(productId)

    if(!product){
        return next(new ErrorHandler("Product not found",404))
    }

    const isReviewed = product?.reviews?.find(
        (r) => r.user.toString() === req?.user?._id.toString()
    )

    if(isReviewed) {
        product.reviews.forEach((review)=>{
            if (review?.user?.toString()===req?.user?._id.toString()) {
                review.comment = comment;
                review.ratings = Number(rating);
            }
        })
    }else{
        product.reviews.push(review);
        product.numOfReviews = product.reviews.length
    }

    product.ratings = 
        product.reviews.reduce((acc, item)=> item.ratings+acc,0)/
        product.reviews.length;

    await product.save({validateBeforeSave: false})

    res.status(200).json({
        success:true
    })
}
);

//get product reviews => /api/v1/reviews
export const getProductReview = catchAsyncErrors( async (req,res,next)=>{
    const product = await products.findById(req.query.id)
    
    if(!product){
        return next(new ErrorHandler("Product not found",404))
    }

    res.status(200).json({
        reviews:product.reviews
    })

});



//delete product review => api/v1/reviews
export const deleteReview = catchAsyncErrors( async (req,res,next)=>{
    

    let product = await products.findById(req.query.productId)

    if(!product){
        return next(new ErrorHandler("Product not found",404))
    }

    const reviews = product?.reviews?.filter(
        (review)=> review._id.toString() !== req?.query?.id.toString()
    )

    const numOfReviews = reviews.length;

    const ratings = 
        numOfReviews ===0
        ? 0:
        product.reviews.reduce((acc, item)=> item.ratings+acc,0)/
        numOfReviews;

    product = await products.findByIdAndUpdate(
        req.query.productId,
        {reviews, numOfReviews, ratings},
        {new:true})

    res.status(200).json({
        success:true,
        product
    })
}
);