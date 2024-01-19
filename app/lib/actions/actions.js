"use server";
import prisma from "@/prisma/client";
import * as bcrypt from "bcrypt";
import { compileActivationTemplate, compileResetPassTemplate, sendMail } from "../mail";
import { signJwt, verifyJwt } from "../jwt";


export async function registerUser(user) {
    const userExists = await prisma.user.findUnique({
      where: {
        email: user.email,
      },
    });
  
    if (userExists) {
      throw new Error("User with this email already exists");
    }
      const hashedPassword = await bcrypt.hash(user.password, 10);
    const result = await prisma.user.create({
      data: {
        ...user,
        password: hashedPassword,
      },
    });
      const jwtUserId = signJwt({
      id: result.id,
    });
  
    const activationURL = `${process.env.NEXTAUTH_URL}/auth/activation/${jwtUserId}`;
      const body = compileActivationTemplate(user.firstName, activationURL);
      await sendMail({ to: user.email, subject: "Activate your Account", body });
  }
export const activateUser = async (jwtUserId) => {
  const payload = verifyJwt(jwtUserId);
  const userId = payload.id;

  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });
  if (!user) return "userNotExist";
  if (user.emailVerified) return "alreadyactivated";
  const result = await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      emailVerified: new Date(),
    },
  });
  return "success";
};


export async function forgotPassword(email){
    const user = await prisma.user.findUnique({
        where:{
            email:email
        }
    })
    if(!user) throw new Error("The User Does not Exist")

    const jwtUserId = signJwt({
        id:user.id
    })

    const resetPasssURL = `${process.env.NEXTAUTH_URL}/auth/resetPass/${jwtUserId}`
    const body = compileResetPassTemplate(user.firstName,resetPasssURL);

    const sendResult =   await sendMail({ to: user.email, subject: "Reset Password", body });
    return sendResult;
}

export async function resetPassword(jwtUserId,password){
    const payload = verifyJwt(jwtUserId)
    if(!payload) return "userNotExist";

    const userId = payload.id;

    const user = await prisma.user.findUnique({
        where:{
            id:userId
        }
    })
    if(!user) return "userNotExist"

    const result = await prisma.user.update({
        where:{
            id:userId
        },
        data:{
            password: await bcrypt.hash(password,10)
        }
    })
    if(result) return "success"
    else throw new Error("Something Went Wrong!");
}
