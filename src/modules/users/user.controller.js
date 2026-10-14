import { Router } from "express";
import * as US from "./user.service.js"
import { authentication } from "../../common/middleware/authentication.js";
import { authorization } from "../../common/middleware/authorization.js";
import { RoleEnum } from "../../common/enum/user.enum.js";
import { Validation } from "../../common/middleware/validation.js";
import { signInSchema, signUpSchema } from "./user.validation.js";
//import { multerLocal } from "../../common/middleware/multer.js";
const userRouter = Router();


userRouter.post("/signUp", Validation(signUpSchema), US.signUp);

userRouter.post("/signUp/gmail", US.signUpWithGmail);

userRouter.post("/signIn", Validation(signInSchema), US.signIn);

userRouter.get("/profile", authentication, authorization([RoleEnum.user]), US.getProfile);



export default userRouter;

//,multerLocal("users",["image.jpg","image.jpeg"]).single("attachment")