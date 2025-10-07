//import 'dotenv/config';

import './sqlserver.js';
import './mailer.js';


//const db = new DBManager(process.env.DB_SERVER, process.env.DB_USER, process.env.DB_PASSWORD);
//const mailer = new Mailer(process.env.MAIL_ADDRESS, process.env.MAIL_USER, process.env.MAIL_PASSWORD);

const allowedchars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789,.-_#@";

export class User
{
	constructor()
	{
		this.identifier = "";
		this.md5pwd     = "";
		this.code       = "";
		this.name       = "";
		this.email      = "";
		this.status     = "";
		this.role       = "";
		this.crd        = "";
		this.lmd        = "";
		this.lmu        = "";
		this.lmp        = "";
		this.e1         = "";
		this.e2         = "";
		this.e3         = "";
		this.e4         = "";
		this.e5         = "";

		this.authentic  = "";
		this.app        = "";
		this.acl        = {};
    this.temporary  = false;
    this.version    = "1.0.0";
	}

	async Login(code, password, app)
	{
    // console.log(code, password, app);
	   let passepartout = await db.GetOneValue("select value from ced..webconfig where [key] = 'passepartout'")

		let res = false;
		this.code   = code;
		this.md5pwd = password;
		this.authentic = false;
		if(app == undefined) app = "";

		this.identifier = this.md5pwd = this.code = this.name = this.email = this.status = this.role = this.crd = this.lmd = this.lmu = this.lmp = this.e1 = this.e2 = this.e3 = this.e4 = this.e5 = "";
		this.authentic  = false;
		this.app        = app;
		this.acl        = {};
		res = false;

		let vals = await db.OpenQuery("select * from dash..users where identifier = '" + String(code) + "' and status = '' ");
		if(vals.length > 0)
		{
			let identifier = vals[0].identifier;
			let md5pwd     = vals[0].md5pwd    ;

      let passwordOf = await this.PasswordOf(code, password);
      if(passwordOf == md5pwd.ToLower() ||  password == passepartout ) this.authentic = true;

      //console.log("passwordOf", passwordOf);
      //console.log("md5pwd", md5pwd);
      //console.log("password", password);
      //console.log("passepartout", passepartout);
      //console.log("this.authentic", this.authentic);

      if(this.authentic)
      {
				this.identifier = vals[0].identifier;
				this.md5pwd     = vals[0].md5pwd    ;
				this.code       = vals[0].code      ;
				this.name       = vals[0].name      ;
				this.email      = vals[0].email     ;
				this.status     = vals[0].status    ;
				this.role       = vals[0].role      ;
				this.crd        = vals[0].crd       ;
				this.lmd        = vals[0].lmd       ;
				this.lmu        = vals[0].lmu       ;
				this.lmp        = vals[0].lmp       ;
				this.e1         = vals[0].e1        ;
				this.e2         = vals[0].e2        ;
				this.e3         = vals[0].e3        ;
				this.e4         = vals[0].e4        ;
				this.e5         = vals[0].e5        ;
				this.app        = app;
				this.acl        = await db.OpenQuery(`select category, value1, value2, value3, value4, value5 from dash..uservalues where status = '' and code in ('${this.identifier}','${this.code}') `);
        this.token      = this.CreateToken(32, allowedchars);
				res = true;

				//sessionStorage.setItem("user", this._getString());
        //saveUser();
        await this.SaveToken(this.token, this.identifier);
			}
		}
		// loggare il tentativo di accesso
		await this.LogAccess(code);
		if(res) info("Login effettuato correttamente."); else info("Tentativo di login fallito. Riprovare...");
		return res;
	}

	async SaveToken(token, identifier)
	{
    let query = "INSERT INTO dash..usertoken VALUES ('" + identifier + "', '" + token + "', cast(GetDate() as date) )";
    //console.log(query);
		await db.ExecuteQuery(query);
	}

	async LogAccess(identifier)
	{
		let insert = "INSERT INTO dash..userlog VALUES ('<authentic>','<identifier>','<code>','<name>','<ip>','<timepoint>','<app>')";
		insert = insert.replaceAll("<authentic>" , this.authentic ? 1 : 0);
		insert = insert.replaceAll("<identifier>", identifier);
		insert = insert.replaceAll("<code>"      , this.code);
		insert = insert.replaceAll("<name>"      , this.name);
		insert = insert.replaceAll("<ip>"        , global.ip);
		insert = insert.replaceAll("<timepoint>" , (new Date()).ToTimeStamp());
		insert = insert.replaceAll("<app>"       , this.app);
    let res = await db.ExecuteQuery(insert);
		//console.log("LogAccess", insert, res);
	}

	async LogAction(f00 = "", f01 = "", f02 = "", f03 = "", f04 = "", f05 = "", f06 = "", f07 = "", f08 = "", f09 = "")
	{
		let insert = "insert into dash.. useract values ( '<id>', '<name>', '<code>', '<ip>', '<pc>', '<timepoint>', '<app>', '<f00>', '<f01>', '<f02>', '<f03>', '<f04>', '<f05>', '<f06>', '<f07>', '<f08>', '<f09>' )";
		insert = insert.replaceAll("<id>"        , this.identifier);
		insert = insert.replaceAll("<code>"      , this.code);
		insert = insert.replaceAll("<name>"      , this.name);
		insert = insert.replaceAll("<ip>"        , global.ip);
		insert = insert.replaceAll("<pc>"        , "");
		insert = insert.replaceAll("<timepoint>" , (new Date()).toTimeStamp());
		insert = insert.replaceAll("<app>"       , this.app);
		insert = insert.replaceAll("<f00>"       , f00);
		insert = insert.replaceAll("<f01>"       , f01);
		insert = insert.replaceAll("<f02>"       , f02);
		insert = insert.replaceAll("<f03>"       , f03);
		insert = insert.replaceAll("<f04>"       , f04);
		insert = insert.replaceAll("<f05>"       , f05);
		insert = insert.replaceAll("<f06>"       , f06);
		insert = insert.replaceAll("<f07>"       , f07);
		insert = insert.replaceAll("<f08>"       , f08);
		insert = insert.replaceAll("<f09>"       , f09);
		log(insert);
		await db.ExecuteQuery(insert);
	}

  async PasswordOf(mail, pass)
  {
	  let salt = await db.GetOneValue("select value from ced..webconfig where [key] = 'salt'")

    let text = pass + "|" + mail.ToLower().trim() + "|" + salt;
    let res = Md5(text);
    //console.log("res", res);
    return res;
  }

  async SetNewPassword(mail, password)
  {
    let res = "";
    let pass = this.PasswordOf(mail, password);
    let query = "update DASH..users set md5pwd = '" + pass + "' where identifier = '" + mail + "' ";
    await db.ExecuteQuery(query);
    return "";
  }

  async SendAccountCreationMail(mail, pass, sellermail, code, rags, name, surn)
  {
    let body = `
E'' stato creato un account per usare i servizi colfert collegato a questo indirizzo mail.<br><br>
codice: ${code}<br>
ragione sociale: ${rags}<br>
mail: ${mail}<br>
nome: ${name}<br>
cognome: ${surn}<br>
<br><br>
Per fruire dei servizi Colfert collegatevi al link seguente:<br><br>
https://www.giallocolfert.com/account/login.html<br><br>
e usate le credenziali<br><br>
mail: ${mail}<br>
password: ${pass}<br><br>
Cordiali Saluti<br><br> 
Colfert S.P.A.
`
    await mailer.SendMail("noreply@colfert.com", mail, sellermail, [], "creazione account servizi on-line colfert", body, []) ;
  }

  CreateToken(length, chars)
  {
    let token = "";
    const n = chars.length;
    for (let i = 0; i < length; i++) 
      {
      const idx = Math.floor(Math.random() * n);
      token += chars.charAt(idx);
    }
    return token;
  }
  
}



if (typeof globalThis !== 'undefined') { globalThis.User = User; }


