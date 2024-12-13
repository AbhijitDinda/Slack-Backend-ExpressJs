import nodemailer from 'nodemailer';
import {MAIL_ID,MAIL_PASSWORD} from  './serverConfig.js'

export default nodemailer.createTransport({
    service: "Gmail",
    host: "smtp.ethereal.email",
    port: 587,
    secure: true, 
    auth: {
      user: MAIL_ID,
      pass: MAIL_PASSWORD,
    },
  });