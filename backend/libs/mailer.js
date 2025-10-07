//import 'dotenv/config';

// ------------------------------------------------------------------------------------------------------------------------------------------------------------
// ------------------------------------------------------------------------------------------------------------------------------------------------------------ Mailer
// ------------------------------------------------------------------------------------------------------------------------------------------------------------


// mode | address | user | password | domain | ssl | port | async
//(string da, string a, string cc, string bcc, string obj, string body, string attach)
 
//npm install nodemailer

import nodemailer from 'nodemailer';



export class Mailer 
{
  constructor(address, user, password, domain = '', ssl = false, port = 587) 
  {
      //const nodemailer = require('nodemailer');
      this.transporter = nodemailer.createTransport({
          host: address,
          port: port,
          secure: ssl,
          auth: { user, pass: password },
          tls: { ciphers: 'SSLv3' }
      });
  }

  async SendMail(from, to, cc = [], bcc = [], object, body, attachment = []) 
  {
      try 
      {
          const mailOptions = 
          {
              from: from,
              to: Array.isArray(to) ? to.join(', ') : to,
              cc: Array.isArray(cc) ? cc.join(', ') : cc,
              bcc: Array.isArray(bcc) ? bcc.join(', ') : bcc,
              subject: object,
              //text: body,
              html: body,
              attachments: Array.isArray(attachment) ? attachment.map(file => ({ path: file })) : [{ path: attachment }]
          };

          let info = await this.transporter.sendMail(mailOptions);

          return { ok: true, message: `Email inviata con successo a ${info.accepted.join(', ')}` };
      } catch (error) 
      {
          return { ok: false, message: `Errore durante l'invio: ${error.message}` };
      }
  }



  SendAsyncMail(from, to, cc = [], bcc = [], object, body, attachment = []) 
  {
    const mailOptions = 
    {
        from: from,
        to: Array.isArray(to) ? to.join(', ') : to,
        cc: Array.isArray(cc) ? cc.join(', ') : cc,
        bcc: Array.isArray(bcc) ? bcc.join(', ') : bcc,
        subject: object,
        //text: body,
        html: body,
        attachments: Array.isArray(attachment) ? attachment.map(file => ({ path: file })) : [{ path: attachment }]
    };

    this.transporter.sendMail(mailOptions, (error, info) => 
    {
        if (error) 
        {
            console.error(`Errore durante l'invio della mail: ${error.message}`);
        } else 
        {
            console.log(`Email inviata con successo a: ${info.accepted.join(', ')}`);
        }
    });
  }


}


const mailer = new Mailer(process.env.MAIL_ADDRESS, process.env.MAIL_USER, process.env.MAIL_PASSWORD);
if (typeof globalThis !== 'undefined') { globalThis.mailer = mailer; }


