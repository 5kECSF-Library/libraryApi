

const catchAsync = require("../../utils/catchAsync");
const User = require("../users/userModel");
const AppError = require("../../utils/appError");
const {sendResponseWithToken} = require("../../utils/success_response");
const {getAuth} = require("firebase-admin");

// admin.initializeApp({ // Firebase admin credentials
//     credential: admin.credential.cert("path/to/cert-file.json"),
//     databaseURL: "https://yourapphere.firebaseio.com"
// });
const { getStorage } = require('firebase-admin/storage');

const admin = require("../../utils/firebaseAdmin")



const PhoneRegister = catchAsync(async (req, res, next)=>{

    const {firstname, lastname,  phone, password, idToken}= req.body;
    console.log("req.body==>",req.body)



    let firebaseId
    try{
        const decodedToken = await admin.auth().verifyIdToken(idToken)
        firebaseId = decodedToken.uid
        console.log("decTOkn=>", decodedToken)

    }catch (e){
        return next(
            new AppError("verification error", 401)
        );
    }


    const user = await User.findOne({ phone })
    if (user){
        sendResponseWithToken(200, user, res);
        return
    }

    const newUser = await User.create({ firstname, lastname, phone , firebaseId, password});
    newUser.password = undefined
    newUser.__v = undefined
    sendResponseWithToken(200, newUser, res);
    // sendResponse(200, newUser, res);

})


const PhoneChangePwd = catchAsync(async (req, res, next)=>{

    const { phone, newPassword, idToken }= req.body;


    let firebaseId
    try{
        const decodedToken = await admin.auth().verifyIdToken(idToken)
        firebaseId = decodedToken.uid

    }catch (e){
        return next(
            new AppError("verification error", 401)
        );
    }

    const user = await User.findOne({ phone }).select('+password');

    if (!user){
        const newUser = await User.create({ phone , firebaseId});
        newUser.password = undefined
        newUser.__v = undefined
    }
    user.password = newPassword;
    await user.save();
    sendResponseWithToken(200, newUser, res);
    // sendResponse(200, newUser, res);

})

const passwordLessWithPhone = catchAsync(async (req, res, next)=>{

    const { phone, idToken}= req.body;
    let firebaseId
    try{
        const decodedToken = await admin.auth().verifyIdToken(idToken)
        firebaseId = decodedToken.uid

    }catch (e){
        return next(
            new AppError("verification error", 401)
        );
    }




    const user = await User.findOne({ phone })
    if (user){
        sendResponseWithToken(200, user, res);
        return
    }



    const newUser = await User.create({ phone , firebaseId});
    newUser.password = undefined
    newUser.__v = undefined
    sendResponseWithToken(200, newUser, res);
    // sendResponse(200, newUser, res);

})
const verifyToken= async (idToken) => {


    try {
        const decodedToken = await admin.auth().verifyIdToken(idToken)


        return decodedToken.uid
    } catch (e) {
        throw new Error("verification Failed")
    }
}


exports.PhoneForgetPwd= PhoneChangePwd
exports.PhoneRegister=PhoneRegister
exports.passwordLessWithPhone=passwordLessWithPhone