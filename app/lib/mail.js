import nodemailer from "nodemailer"
import { activationTemplate } from "./emailTemplate/activation";
import Handlebars from "handlebars";
import { resetPasswordTemplate } from "./emailTemplate/reset";


export async function sendMail({to, subject ,body}){
    const {SMTP_EMAIL, SMTP_GMAIL_PASS,SMTP_USER,SMTP_PASS} = process.env
    // const transport = nodemailer.createTransport({
    //     service:"gmail",
    //     auth:{
    //         user:SMTP_EMAIL,
    //         pass:SMTP_GMAIL_PASS
    //     }
    // });
    var transport = nodemailer.createTransport({
        host: "sandbox.smtp.mailtrap.io",
        port: 2525,
        auth: {
          user: SMTP_USER,
          pass: SMTP_PASS
        }
      });
    try{
        const testResult=await transport.verify();
        console.log("first",testResult);

    }
    catch(error){
        console.log(error);
    }
    try{
        const sendResult = await transport.sendMail({
            from: SMTP_EMAIL,
            to,
            subject,
            html:body
        })
        console.log(sendResult);
    }
    catch(error){
        console.log(error);
    }
}

export function compileActivationTemplate(name, url){
    const template  = Handlebars.compile(activationTemplate);
    const htmlBody = template({
        name,
        url,
    })
    return  htmlBody;
}
export function compileResetPassTemplate(name, url){
    const template  = Handlebars.compile(resetPasswordTemplate);
    const htmlBody = template({
        name,
        url,
    })
    return  htmlBody;
}