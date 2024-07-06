//read the below one first
//using promises

const asyncHandler = (requestHandler) => {
  (req, res, next) => {
    Promise.resolve(requestHandler(req, res, next)).catch((err) => next(err));
  };
};

//create a method ad export
//it is a higher order function
//to execute this fn and then execute code of asyncHandler
// or to pass fn further

//  const asyncHandler=(fn)=>{()=>{
//     }}
//or follow next line
// const asyncHandler = (fn) => ()=>{};

// const asyncHandler=(fn)=>async(req,res,next)=>{
//     try{
//         await fn(req,res,next)
//     }catch(err){
//         res.status(err.code||500).json({
//             success:false,
//             message:err.message
//         })
//         //err.code is send by user
//     }
// }

 export { asyncHandler };
