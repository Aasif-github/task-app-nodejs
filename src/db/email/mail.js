
const nodemailer = require('nodemailer');
const Mailgen = require('mailgen');

// For Testing
const sendMail = async (req, res) => {
    console.log('testing');
    
    let testAccount = await nodemailer.createTestAccount();
  
    const transporter = nodemailer.createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        secure: false,
        auth: {
            user: testAccount.user,
            pass: testAccount.pass,
        }
      });

    let message = {
        from: '"Aasif "aasif.github@gmail.com', // sender address
        to: "aasif.github@gmail.com", // list of receivers
        subject: "Hello ✔", // Subject line
        text: "Hello world?", // plain text body
        html: "<b>Hello world?</b>",
    };

    transporter.sendMail(message).then((info)=> {
        return res.status(201)
        .json({
            message: "you should receive an email!",
            info: info.messageId,
            preview: nodemailer.getTestMessageUrl(info)
        });

    }).catch( error => {
        return res.status(500).json({error});
    })
}

   
    // user: 'johndeo8789@gmail.com',
    // pass: 'app password',
    
    // How to Generate App Password in Gmail/Google Workspace?
    // https://www.youtube.com/watch?v=lSURGX0JHbA

    // https://myaccount.google.com/apppasswords?utm_source=google-account&utm_medium=myaccountsecurity&utm_campaign=tsv-settings&rapt=AEjHL4NYaQdPzk10TP3cO0lgTVwgX3s4KCWlY7na7UYiYBbJDakAfguf-JrIXI1E0ObBbPfgvKuH_VHgkhN3jpM9XS91uh6wzbHuS2pgtVWlYkeBZ5YhB5I

    // https://www.npmjs.com/package/mailgen

const welcomeMail = async (req, res) => {
    
    let config = {
        service: 'gmail',
        auth : {
            user: 'johndeo8789@gmail.com', // please put a gmail id
            pass: 'mmkn lhgm rycm uejt'    // please create an app password for gmail id and put here
        }
    }
    
    let transporter = nodemailer.createTransport(config);
    
    let MailGenerator = new Mailgen({
        theme: "salted",
        product: {
            name: 'Task Manager App',
            link: 'https://mailgen.js/'
        }
    });

    let response = {
        body: {
            name: 'Aasif',
            intro: 'Welcome to Task-App! We\'re very excited to have you on board.',
            action: {
                instructions: 'To get started with Task-Manager-App, please click here:',
                button: {
                    color: '#48cfad', // Optional action button color
                    text: 'Confirm your account',
                    link: 'https://mailgen.js/confirm?s=d9729feb74992cc3482b350163a1a010'
                }
            },
            outro: 'Need help, or have questions? Just reply to this email, we\'d love to help.'
        }
    }

    let mail = MailGenerator.generate(response)

    let message = {
            from : 'johndeo8789@gmail.com', // Give your email address
            to : 'aasif.github@gmail.com', // give an email id 
            subject: "Welcome Mail",
            html: mail
    }

    transporter.sendMail(message).then(() => {
            return res.status(201).json({
                msg: "you should receive an email"
            })
    }).catch(error => {
            return res.status(500).json({ error })
    })

}

module.exports = {
    sendMail,
    welcomeMail
}
