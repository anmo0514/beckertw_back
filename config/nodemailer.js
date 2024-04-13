const nodemailer = require("nodemailer");

function sendEmail() {
    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        auth: {
            user: "shinderr0125@gmail.com",
            pass: "ltbriuhwuueodavi",
        },
    });

    transporter
        .sendMail({
            from: "shinderr0125@gmail.com",
            to: "shinderr0125@gmail.com",
            subject: "shuyoung舒營 重設密碼認證信",
            html: `<h1>捷進貝克 重設密碼</h1><p>重設密碼連結：</p><a href="http://localhost:3777/shuyoung/join">點我</a>`,
        })
        .then((info) => {
            console.log({ info });
        })
        .catch(console.error);
}

sendEmail();
