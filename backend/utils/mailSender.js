const nodemailer = require("nodemailer")

const mailSender = async (email,title,body) => {
  try {
    //transporter
    let transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      auth: {
        user: process.env.MAIL_USER,
        password: process.env.MAIL_PASS
      }
    });

    //send mail by using this transporter object defined above
    let info = await transporter.sendMail({
      from: 'StudyNotion || Codehelp - by Babbar',
      to: `${email}`,
      subject: `${title}`,
      html: `${body}`
    })

    console.log("INFO: ",info);
    return info;
  } 
  catch (error) {
    console.log(error)
  }
}

module.exports = mailSender;