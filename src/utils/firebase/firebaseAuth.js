const admin = require("../../utils/firebase/firebaseAdmin");
const AppResult = require("../../utils/appResult");


const firebaseVerifyToken =async (idToken) => {
    let firebaseId
    try {
        const decodedToken = await admin.auth().verifyIdToken(idToken)
        // firebaseId = decodedToken.uid
        console.log("decTOkn=>", decodedToken)
        return new AppResult.Ok( decodedToken)

    } catch (e) {
        return AppResult.Failure( e)

    }
}