
/* ------------------------------------------------------------------------------------------------------------------------------------------------------------

strings

------------------------------------------------------------------------------------------------------------------------------------------------------------ */



String.prototype.CharAt      = function(index)            { return this.charAt(index)             ; }; //Ottiene il carattere in una posizione specifica "Hello".charAt(1) // 'e'
String.prototype.CharCodeAt  = function(index)            { return this.charCodeAt(index)         ; }; //Ottiene il codice ASCII/Unicode del carattere "Hello".charCodeAt(0) // 72
String.prototype.CodePointAt = function(index)            { return this.codePointAt(index)        ; }; //Ottiene il codice Unicode (supporta emoji e caratteri fuori BMP) "👋".codePointAt(0) // 128075
String.prototype.IndexOf     = function(substring)        { return this.indexOf(substring)        ; }; //Trova la prima posizione della sottostringa "Hello".indexOf('l') // 2
String.prototype.LastIndexOf = function(substring)        { return this.lastIndexOf(substring)    ; }; //Trova l'ultima posizione della sottostringa "Hello".lastIndexOf('l') // 3
String.prototype.Includes    = function(substring)        { return this.includes(substring)       ; }; //Verifica se la stringa contiene una sottostringa "Hello".includes('ll') // true
String.prototype.StartsWith  = function(substring)        { return this.startsWith(substring)     ; }; //Controlla se inizia con una sottostringa "Hello".startsWith('He') // true
String.prototype.EndsWith    = function(substring)        { return this.endsWith(substring)       ; }; //Controlla se termina con una sottostringa "Hello".endsWith('lo') // true
String.prototype.ToLower     = function()                 { return this.toLocaleLowerCase()       ; };
String.prototype.ToUpper     = function()                 { return this.toLocaleUpperCase()       ; };
String.prototype.Trim        = function()                 { return this.trim      ()              ; }; // Rimuove spazi iniziali e finali " Hello ".trim() // 'Hello'
String.prototype.TrimStart   = function()                 { return this.trimStart ()              ; }; // Rimuove solo gli spazi iniziali " Hello".trimStart() // 'Hello'
String.prototype.TrimEnd     = function()                 { return this.trimEnd   ()              ; }; // Rimuove solo gli spazi finali "Hello ".trimEnd() // 'Hello'
String.prototype.PadStart    = function(length, char)     { return this.padStart  (length, char)  ; }; // Aggiunge caratteri all'inizio fino a una lunghezza "42".padStart(5, '0') // '00042'
String.prototype.PadEnd      = function(length, char)     { return this.padEnd    (length, char)  ; }; // Aggiunge caratteri alla fine fino a una lunghezza "42".padEnd(5, '.') // '42...'
String.prototype.Repeat      = function(n)                { return this.repeat    (n)             ; }; // Ripete la stringa n volte "Ha".repeat(3) // 'HaHaHa'
String.prototype.ReplaceOne  = function(search, newStr)   { return this.replace   (search, newStr); }; // Sostituisce la prima occorrenza "Hello".replace('l', 'x') // 'Hexlo'
String.prototype.Replace     = function(search, newStr)   { return this.replaceAll(search, newStr); }; // Sostituisce tutte le occorrenze "Hello".replaceAll('l', 'x') // 'Hexxo'
String.prototype.Split       = function(separator)        { return this.split (separator)         ; }; // Divide la stringa in un array "A,B,C".split(',') // ['A', 'B', 'C']
String.prototype.SplitCr     = function(separator)        { return this.split (/\r?\n/)           ; }; // 
//String.prototype.Join        = function(separator)        { return this.join  (separator)         ; }; // Unisce elementi di un array in una stringa ['A', 'B', 'C'].join('-') // 'A-B-C'
String.prototype.Substring   = function(start, end)       { return this.slice(start, end)         ; }; // Estrae una parte della stringa (negativo = da fine) "Hello".slice(1, 4) // 'ell'
String.prototype.MatchOne    = function(regex)            { return this.match   (regex)           ; } // Trova corrispondenze con regex "abc123".match(/\d+/) // ['123']
String.prototype.MatchAll    = function(regex)            { return this.matchAll(regex)           ; } // Trova tutte le corrispondenze (iteratore) [... "abc123".matchAll(/\d/g)] // ['1', '2', '3']
String.prototype.Search      = function(regex)            { return this.search  (regex)           ; } // Trova l'indice della prima corrispondenza "abc123".search(/\d/) // 3
String.prototype.Concat      = function(...strings)       { return this.concat(...strings)        ; };
String.prototype.Substr      = function(start, length)    { return this.substring(start, start + length); };

String.prototype.AddToList = function(aggiunta, separatore)
{
  let res = this;
  if(separatore == undefined) separatore = ", ";
  if(aggiunta == "") return res;
  if(res != "") 
  {
    res = res + separatore + aggiunta;
  }else
  {
    res = aggiunta;
  }
  return res;
};

String.prototype.GetLeftOf = function(separatore)
{
  let res = "";
  if(this.indexOf(separatore) < 0)
  {
    res = this;
  }else
  {
    res = this.Substr(0, this.indexOf(separatore));
  }
  res = res.trim();
  return res;
};

String.prototype.GetRightOf = function(separatore)
{
  let res = "";
  let pos = this.indexOf(separatore);
  if(pos < 1) res = "";
  else res = this.Substr(pos + 1);
  return res.trim();
};

String.prototype.GetRightOfLast = function(separatore)
{
  let res = "";
  let pos = this.lastIndexOf(separatore);
  if(pos < 1) res = "";
  else res = this.Substr(pos + 1);
  return res.trim();
};

String.prototype.TriLeftOf = function(separatore)
{
  let str = this;
  let res = "";
  if(this.indexOf(separatore) < 0)
  {
    res = this;
  }else
  {
    res = this.Substr(0, this.indexOf(separatore));
  }
  res = res.trim();
  return res;
};

String.prototype.TriRightOf = function(separatore)
{
  let str = this;
  let res = "";
  let pos = str.lastIndexOf(separatore);
  if(pos < 1) res = "";
  else res = str.Substr(pos + separatore.length, str.length - pos - separatore.length);
  return res.trim();
};

String.prototype.TriCenterOf = function(separatore)
{
  let str = this;
  let res = "";
  let pos1 = str.indexOf(separatore);
  let pos2 = str.lastIndexOf(separatore);
  if(pos1 < 1) res = "";
  else if(pos1 == pos2) res = "";
  else res = str.Substr(pos1+ separatore.length,pos2-pos1-separatore.length);
  return res.trim();
};

String.prototype.Part = function(position, separatore = ',')
{
  let str = this;
  let res = "";
  let arr = str.TrimSplit(separatore);
  if(arr.length > position) res = arr[position];
  return res;
};

String.prototype.GetCode = function()
{
  let str = this;
  return this.GetLeftOf("-");
};

String.prototype.TrimSplit = function(separatore)
{
  if(separatore == undefined) separatore = ",";
  let arr = this.split(separatore)
  for (let i = 0; i < arr.length; i++)
  {
    arr[i] = arr[i].trim();
  }
  return arr;
};

String.prototype.NumberSplit = function(separatore)
{
  if(separatore == undefined) separatore = ",";
  let arr = this.split(separatore)
  for (let i = 0; i < arr.length; i++)
  {
    arr[i] = Number(arr[i]);
  }
  return arr;
};

String.prototype.FirstNumber = function() 
{
  // Modificata l'espressione regolare per catturare numeri con segno e decimali
  const match = this.match(/-?\d+([.,]\d+)?/);

  // Se trova un numero, lo converte in float (rispettando il punto come separatore)
  return match ? parseFloat(match[0].replace(',', '.')) : 0;
};

String.prototype.ToBool = function()
{
	let res = true;
	let s = this.toLowerCase();
	if(s == "0" || s == "0.0" || s == "false" || s == "n"  || s == "no" || s == "f" || s == "") res = false;
	return res;
};

String.prototype.ToDate = function()
{
  //  Convert a "dd/MM/yyyy" string into a Date object
  let d = this.split("/");
  let dat = new Date(d[2] + '/' + d[1] + '/' + d[0]);
  return dat;     
};

String.prototype.ToInt = function()
{
  return parseInt(this, 10);
};

String.prototype.Capitalize = function() 
{
  return this.toLowerCase()
      .replace(/\b\w/g, char => char.toUpperCase());
};

String.prototype.ToLowerFirst = function() 
{
  return this.replace(/[A-Za-zÀ-ÿ]/, match => match.toLowerCase());
};

String.prototype.ToUpperFirst = function() 
{
  return this.replace(/[A-Za-zÀ-ÿ]/, match => match.toUpperCase());
};

String.prototype.Left = function(number)
{
  return this.substring(0, number);
};

String.prototype.Right = function(number)
{
  return this.slice(-number);
};


String.prototype.leftLess = function(number)
{
  let res = "";
  let str = this.toString();
  if(str == "") return "";
  if(str.length > number)
  {
    res = str.Substr(0, str.length-number);
  }
  return res;
};

String.prototype.rightLess = function(number)
{
  let res = "";
  let str = this.toString();
  if(this == null) return "";
  if(str.length > number)
  {
    res = str.Substr(number, str.length-number);
  }
  return res;
};

String.prototype.RightLess = function(n) 
{
  return this.slice(0, -n); // Prende la stringa fino a n caratteri dalla fine
};

String.prototype.LeftLess = function(n) 
{
  return this.slice(n); // Prende la stringa saltando i primi n caratteri
};

String.prototype.CleanAscii = function()
{
  let res = this;
  res = res.replace(/[^\x20-\x7F]/g, "");
  //res = res.replaceAll("'","");
  //res = res.replaceAll("\"","");
  return res;
};

String.prototype.CleanUtf8 = function()
{
  let res = this;
  res = res.replace(/[^\x20-\xFF]/g, "");
  res = res.replaceAll("\"","");
  return res;
};

String.prototype.CleanForFilename = function()
{
  let res = this.CleanAscii();
  res = res.replaceAll("<","");
  res = res.replaceAll(">","");
  res = res.replaceAll(":","");
  res = res.replaceAll("\"","");
  res = res.replaceAll("/","");
  res = res.replaceAll("\\","");
  res = res.replaceAll("|","");
  res = res.replaceAll("?","");
  res = res.replaceAll("*","");
  res = res.replaceAll(";","");
  res = res.replaceAll(",","");
  return res;
};

String.prototype.CleanReplacer = function()
{
  let res = this;
  res = res.replaceAll("®",   "");
  res = res.replaceAll("©",   "");
  res = res.replaceAll("ö",   "o");
  res = res.replaceAll("ë",   "e");
  res = res.replaceAll("ä",   "a");
  res = res.replaceAll("ü",   "u");
  res = res.replaceAll("ú",   "u");
  res = res.replaceAll("í",   "i");
  res = res.replaceAll("ï",   "i");
  res = res.replaceAll("™",   "(tm)");
  res = res.replaceAll("é",   "e");
  res = res.replaceAll("²",   "2");
  res = res.replaceAll("è",   "e");
  res = res.replaceAll("—",   "-");
  res = res.replaceAll("–",   "-");
  res = res.replaceAll("ó",   "o");
  res = res.replaceAll("•",   "*");
  res = res.replaceAll("…",   "...");
  res = res.replaceAll("ô",   "o");
  res = res.replaceAll("â",   "a");
  res = res.replaceAll("á",   "a");
  res = res.replaceAll("ê",   "e");
  res = res.replaceAll("è",   "e");
  res = res.replaceAll("’",   "'");
  res = res.replaceAll("‘",   "'");
  res = res.replaceAll("·",   ".");
  res = res.replaceAll("à",   "a");
  res = res.replaceAll("å",   "a");
  res = res.replaceAll("ã",   "a");
  res = res.replaceAll("â",   "a");
  res = res.replaceAll("a",   "a");
  res = res.replaceAll("ø",   "0");
  res = res.replaceAll("ñ",   "n");
  res = res.replaceAll("î",   "i");
  res = res.replaceAll("ç",   "c");
  res = res.replaceAll("Ç",   "C");
  res = res.replaceAll("Ã",   "A");
  res = res.replaceAll("”",   "");
  res = res.replaceAll("“",   "");
  res = res.replaceAll("Á",   "A");
  res = res.replaceAll("¢",   "c");
  res = res.replaceAll("Ã",   "A");
  res = res.replaceAll("Å",   "A");
  res = res.replaceAll("¶",   "");
  res = res.replaceAll("×",   "x");
  res = res.replaceAll("†",   "+");
  res = res.replaceAll("š",   "s");
  res = res.replaceAll("¤",   "");
  res = res.replaceAll("µ",   "");
  res = res.replaceAll("õ",   "o");
  res = res.replaceAll("€",   "eur");
  res = res.replaceAll("Õ",   "O");
  res = res.replaceAll("ð",   "d");
  res = res.replaceAll("Ò",   "O");
  res = res.replaceAll("¨",   "");
  res = res.replaceAll("º",   "r");
  res = res.replaceAll("°",   "r");
  res = res.replaceAll("ì",   "i");
  res = res.replaceAll("ƒ",   "f");
  res = res.replaceAll("ÿ",   "y");
  res = res.replaceAll("ß",   "ss");
  res = res.replaceAll("«",   "<<");
  res = res.replaceAll("»",   ">>");
  res = res.replaceAll("Æ",   "AE");
  res = res.replaceAll("¬",   "-");
  res = res.replaceAll("Ù",   "U");
  res = res.replaceAll("ý",   "y");
  res = res.replaceAll("û",   "u");
//  res = res.replace("|",   "");
  return res;
};

String.prototype.ToApprox2  = function()   { return Number(this).toFixed(2).toString(); }
String.prototype.ToApprox5  = function()   { return Number(this).toFixed(5).toString(); }
String.prototype.ToPrice    = function()   { return Number(this).ToApprox2() + " €"; }
String.prototype.ToQuantity = function(um) { return Number(this).ToApprox2() + " " + um; }
String.prototype.ToPercent  = function()   { return (Math.round(this)).toString() + "%"; }

String.prototype.KeepDigits = function()
{ 
  let res = this;
  res = res.replace(/[^\d,.()-]/g, '');
  res = res.replaceAll(",",".");
  return res;
};

String.prototype.EliminateLetters = function()
{ 
  let res = this;
  res = res.replace(/[A-Za-z]/g, '');
  return res;
};

String.prototype.Enquote = function()
{
  return "'" + this + "'";
};

String.prototype.Enline = function(options)
{
  if(options == undefined) options = {};
  if(options.simple == undefined) options.simple = true;

  let res = this;
  res = res.replaceAll("'"   , "<sinquo>"   );
  res = res.replaceAll("\t"  , "<tab>"      );
  res = res.replaceAll("\r\n", "<br>"       );
  res = res.replaceAll("\r"  , "<br>"       );
  res = res.replaceAll("\n"  , "<br>"       );
  if(! options.simple)
  {
    res = res.replaceAll("\""  , "<douquo>"   );
    res = res.replaceAll(","   , "<comma>"    );
    res = res.replaceAll(";"   , "<semicolon>");
  }
  return res;
};

String.prototype.Reline = function(options)
{
  let res = this;
  res = res.replace("<sinquo>"   , "'"   );
  res = res.replace("<douquo>"   , "\""  );
  res = res.replace("<tab>"      , "\t"  );
  res = res.replace("<comma>"    , ","   );
  res = res.replace("<semicolon>", ";"   );
  res = res.replace("<br>"       , "\r\n");
  return res;
};

String.prototype.ToSql = function(options)
{
  if(options == undefined) options = {};
  if(options.enquote == undefined) options.enquote = true;
  if(options.null    == undefined) options.null    = true;
  let res = this;
  if(options.type == undefined || options.type.trim().toLowerCase() == "s") 
  {
    res = res.replaceAll("'","''");
    res = res.replaceAll("\r\n","<rn>");
    res = res.replaceAll("\r","<rn>");
    res = res.replaceAll("\n","<rn>");
  } else
  if(options.type.trim().toLowerCase() == "n")
  {
    res = number(res);
    options.enquote = false;
  }
  if(options.enquote) res = "'" + res + "'";
  if(options.null)
  {
    if(res.toString().toLowerCase().trim() == "'null'") res = "NULL";
  }
  return res;
};

String.prototype.ToB64 = function()
{
  let res = this;
  if(this != "") res = btoa(this);
  return res;
};

String.prototype.FromB64 = function()
{
  let res = this;
  if(this != "") res = atob(this);
  return res;
};

String.prototype.In = function(array, caseinsensitive = false)
{
  let term = this;
  let list = array;

  if(caseinsensitive)
  {
    term = this.toLowerCase();
    list = [];
    for(const s of array) { list.push(s.ToLower()); }
  }

  let res = false;
  if(list.includes(term)) res = true;
  return res;
};

String.prototype.Contains = function(text, caseinsensitive = false)
{
  let term = this.toString();
  if(caseinsensitive)
  {
    term = this.toLowerCase();
    text = text.toLowerCase();
  }
  let res = false;
  if(term.includes(text)) res = true;
  return res;
};

String.prototype.isIn = function(text)
{
  return text.Contains(this.toString(), true);
};

String.prototype.RemoveBracket = function(lft, rgt)
{
  let str = this;
  let res = str;
  let pos1 = -1, pos2 = -1;
  pos1 = str.indexOf(lft);
  pos2 = str.indexOf(rgt);
  if(pos1 >= 0 && pos2 > pos1)
  {
    res = str.Substr(0, pos1) + str.Substr(pos2 + rgt.length, str.length - pos2 - rgt.length);
  }
  return res;
}

String.prototype.GetBracket = function(lft, rgt)
{
  let str = this;
  let res = "";
  let pos1 = str.indexOf(lft);
  let pos2 = str.indexOf(rgt, Math.max(pos1,0));
  if(pos1 >= 0 && pos2 >= 0 && pos2 > pos1) res = str.Substr(pos1+lft.length, pos2 - pos1 - lft.length);
  return res;
}

String.prototype.RemoveAllBrackets = function(lft, rgt)
{
  let str = this;
  let res = str;
  let pos1 = -1, pos2 = -1;
  pos1 = res.indexOf(lft);
  pos2 = res.indexOf(rgt);
  while(pos1 > 0 && pos2 > pos1)
  {
    res = res.Substr(1,pos1-1) + res.Substr(pos2 + rgt.length,res.length);
    pos1 = res.indexOf(lft);
    pos2 = res.indexOf(rgt);
  }
  return res;
}

String.prototype.ReplaceFirstInsensitive = function(toreplace, withreplace)
{
  let searchMask = toreplace;
  let regEx = new RegExp(searchMask, "i");
  let replaceMask = withreplace;
  let res = this.replace(regEx, replaceMask);
  return res;
}

String.prototype.ReplaceAllInsensitive = function(toreplace, withreplace)
{
  let searchMask = toreplace;
  let regEx = new RegExp(searchMask, "ig");
  let replaceMask = withreplace;
  let res = this.replace(regEx, replaceMask);
  return res;
}

String.prototype.ReplaceLast = function (what, replacement) 
{
  let res = this;
  if(this.Contains(what))
  {
    let pcs = this.split(what);
    let lastPc = pcs.pop();
    res = pcs.join(what) + replacement + lastPc;
  }
  return res;
};

String.prototype.isComment = function()
{
  let res = false;
  let str = this.toString();
  if(str.startsWith("//")) res = true;
  if(str.startsWith("/*")) res = true;
  if(str.startsWith("--")) res = true;
  if(str.startsWith("#")) res = true;
  if(str == "") res = true;
  return res;
}

String.prototype.ApplyParms = function(parmarray)
{
  let res = this.toString();
  let l = "", r = "";
  for(const p of parmarray) 
  { 
    if(!p.Contains("=")) continue;
    l = p.GetLeftOf("=");
    r = p.GetRightOf("=");
    res = res.replace(l, r);
  }
  return res;
}

String.prototype.At = function(pos)
{
  let res = "";
  let source = this.toString();
  if(source.length > pos) res = source.Substr(pos, 1);
  return res;
}

String.prototype.CountInitialWhites = function()
{
  let res = 0;
  let s = this.toString();
  for(let i = 0; i < s.length; i++)
  {
    if(s.Substr(i,1) == " " || s.Substr(i,1) == "\t")
    {
      res++;
    }else
    {
      break;
    }
  }
  return res;
}

String.prototype.CountTabs = function()
{
  let res = 0;
  let s = this.toString();
  for(let i = 0; i < s.length; i++)
  {
    if(s.Substr(i,1) == "\t") res++;
  }
  return res;
}

String.prototype.Between = function(min, max)
{
  if(max < min) { let temp = min; min = max; max = temp; }
  let res = false;
  if(this >= min && this <= max) res = true;
  return res;
}

String.prototype.ToIntSequence = function(max = -1)
{
  let res = [];
  let parts = this.TrimSplit(',');
  if(this != "*") 
  {
    for(const part of parts) 
    {
      if(part.Contains("-"))
      {
        let start = Number(part.GetLeftOf ("-").trim()).ToInt();
        let end   = Number(part.GetRightOf("-").trim()).ToInt();
        if(start > end) { let temp = end; end = start; start = temp; }
        for(let i = start; i <= end; i++) { res.push(i); }
      } else
      {
        res.push(Number(part).ToInt());
      }
    }
  }
  if(this == "*") for(let i = 0; i < max; i++) res.push(i);
  res = res.SortAndUnique(true);
  return res;
}

String.prototype.ToStringSequence = function(max = -1)
{
  let res = [];
  let parts = this.TrimSplit(',');
  if(this != "*") 
  {
    for(const part of parts) 
    {
      if(part.Contains("-"))
      {
        let start = Number(part.GetLeftOf ("-").trim()).ToInt();
        let end   = Number(part.GetRightOf("-").trim()).ToInt();
        if(start > end) { let temp = end; end = start; start = temp; }
        for(let i = start; i <= end; i++) { res.push(i.toString()); }
      } else
      {
        res.push(part);
      }
    }
  }
  if(this == "*") for(let i = 0; i < max; i++) res.push(i.toString());
  res = res.SortAndUnique(false);
  return res;
}


Array.prototype.SortAndUnique = function() {
  return [...new Set(this)].sort((a, b) => (a > b ? 1 : -1));
};




/* ------------------------------------------------------------------------------------------------------------------------------------------------------------

numbers

------------------------------------------------------------------------------------------------------------------------------------------------------------ */




Number.prototype.ToFixed       = function(n)    { return this.toFixed      (n)   ; } //Arrotonda e mostra n decimali (ritorna una stringa)	(3.14159).toFixed(2) // "3.14"
Number.prototype.ToPrecision   = function(n)    { return this.toPrecision  (n)   ; } //Rappresenta il numero con n cifre significative	(123.456).toPrecision(4) // "123.5"
Number.prototype.ToString      = function(base) { return this.toString     (base); } //Converte un numero in stringa con una base	(255).toString(16) // "ff"
Number.prototype.ToExponential = function(n)    { return this.toExponential(n)   ; } //Converte il numero in notazione scientifica con n decimali	(12345).toExponential(2) // "1.23e+4"



Number.prototype.IsLeapYear = function()
{
    var res = false;
    if((this % 4) == 0) res = true;
    if((this % 100) == 0) res = false;
    if((this % 400) == 0) res = true;
    return res;
};

Number.prototype.Round = function()
{
  return Math.round(this);
};

Number.prototype.ToDate = function()
{
  return new Date(this);
};

Number.prototype.ToBool = function()
{
  if(this == 0) return false; else return true;
};

Number.prototype.IsEven = function()
{
  let res = false;
  if(this % 2 == 0) res = true;
  return res;
};

Number.prototype.IsOdd = function()
{
  let res = true;
  if(this % 2 == 0) res = false;
  return res;
};

Number.prototype.ToInt = function(mode)
{
  let res = this;
  if(mode == undefined) res = Math.round(this);
  else if(mode.ToLower().Left(1) == "r") res = Math.round(this);
  else if(mode.ToLower().Left(1) == "f") res = Math.floor(this);
  else if(mode.ToLower().Left(1) == "c") res = Math.ceil(this);
  return res;
};

Number.prototype.MonthName = function()
{
  let res = "";
  if(this ==  1) res = "Gennaio";
  else if(this ==  2) res = "Febbraio";
  else if(this ==  3) res = "Marzo";
  else if(this ==  4) res = "Aprile";
  else if(this ==  5) res = "Maggio";
  else if(this ==  6) res = "Giugno";
  else if(this ==  7) res = "Luglio";
  else if(this ==  8) res = "Agosto";
  else if(this ==  9) res = "Settembre";
  else if(this == 10) res = "Ottobre";
  else if(this == 11) res = "Novembre";
  else if(this == 12) res = "Dicembre";
  return res;
};

Number.prototype.ApplyStringDiscount = function(discounts)
{
  let p = this;
  let disc = stringDiscount(discounts)
  let res = p - (p * disc / 100);
  return res;
};

Number.prototype.applyDiscount = function(...discounts)
{
  let p = this;
  let disc = discount(...discounts)
  let res = p - (p * disc / 100);
  return res;
};

Number.prototype.Abs    = function()  { return Math.abs(this)   ; };
Number.prototype.Sign   = function()  { return Math.sign(this)  ; };
Number.prototype.Cbrt   = function()  { return Math.cbrt(this)  ; };
Number.prototype.Sqrt   = function()  { return Math.sqrt(this)  ; };
Number.prototype.Pow    = function(y) { return Math.pow(this, y); };

Number.prototype.Acos   = function() { return Math.acos (this); };
Number.prototype.Acosh  = function() { return Math.acosh(this); };
Number.prototype.Asin   = function() { return Math.asin (this); };
Number.prototype.Asinh  = function() { return Math.asinh(this); };
Number.prototype.Atan   = function() { return Math.atan (this); };
Number.prototype.Atanh  = function() { return Math.atanh(this); };
Number.prototype.Cos    = function() { return Math.cos  (this); };
Number.prototype.Cosh   = function() { return Math.cosh (this); };
Number.prototype.Sin    = function() { return Math.sin  (this); };
Number.prototype.Sinh   = function() { return Math.sinh (this); };
Number.prototype.Tan    = function() { return Math.tan  (this); };
Number.prototype.Tanh   = function() { return Math.tanh (this); };

Number.prototype.Atan2  = function(y) { return Math.atan2(this, y); };

Number.prototype.Ceil   = function() { return Math.ceil  (this); };
Number.prototype.Floor  = function() { return Math.floor (this); };
Number.prototype.Fround = function() { return Math.fround(this); };
Number.prototype.Round  = function() { return Math.round (this); };
Number.prototype.Trunc  = function() { return Math.trunc (this); };

Number.prototype.Log   = function(y) { return Math.log  (this,y); };
Number.prototype.Log10 = function()  { return Math.log10(this); };
Number.prototype.Log1p = function()  { return Math.log1p(this); };
Number.prototype.Log2  = function()  { return Math.log2 (this); };
Number.prototype.Exp   = function()  { return Math.exp  (this); };
Number.prototype.Expm1 = function()  { return Math.expm1(this); };

Number.prototype.ToApprox2  = function()   { return this.toFixed(2); }
Number.prototype.ToApprox5  = function()   { return this.toFixed(5); }
Number.prototype.ToPrice    = function()   { return this.ToApprox2() + " €"; }
Number.prototype.ToQuantity = function(um) { return this.ToApprox2() + " " + um; }
Number.prototype.ToPercent  = function()   { return (Math.round(this)).toString() + "%"; }
Number.prototype.AddCommas  = function()   { let nStr = this + ''; let x = nStr.split('.'); let x1 = x[0]; let x2 = x.length > 1 ? '.' + x[1] : ''; var rgx = /(\d+)(\d{3})/; while (rgx.test(x1)) { x1 = x1.replace(rgx, '$1' + ',' + '$2'); } return x1 + x2; }
Number.prototype.ToLocal    = function()   { return this.toString().replaceAll(".", ","); }

Number.prototype.ToSql = function() 
{
  let res = String(this);
  res = res.replaceAll(",", ".");
  return res;
}

Number.prototype.ToroNext = function(max)
{
  let res = this + 1;
  if(res >= max) res = 0;
  return res;
}

Number.prototype.ToroPrev = function(max)
{
  let res = this-1;
  if(res < 0) res = max-1;
  return res;
}

Number.prototype.Between = function(min, max)
{
  if(max < min) { let temp = min; min = max; max = temp; }
  let res = false;
  if(this >= min && this <= max) res = true;
  return res;
}

Number.prototype.NotBetween = function(min, max)
{
  return ! this.Between(min, max);
}

Number.prototype.ToImporto = function() 
{
  return this.toLocaleString('it-IT', { style: 'decimal', minimumFractionDigits: 2, maximumFractionDigits: 2 });
}





Math.Cube = function(x) 
{
  return x * x * x;
};

Math.DegToRad = function(degrees) 
{
  return degrees * (Math.PI / 180);
};

Math.RadToDeg = function(radians) 
{
  return radians * (180 / Math.PI);
};

Math.Factorial = function(n) 
{
  if (n < 0) return undefined;
  if (n === 0) return 1;
  return n * Math.Factorial(n - 1);
};

const minuscole = ["a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z"];
const maiuscole = ["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z"];
const lettere   = ["a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z","A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z"];
const numeri    = ["0","1","2","3","4","5","6","7","8","9"];
const punti     = [".",",",";",":","-","+","*","!","$","%","&","(",")","[","]"];

Math.Between = function(min, max)
{
 let res = Math.floor(Math.random() * (Math.abs(max-min)+1)) + Math.min(min,max);
 return res;
};
  
Math.OneIn = function(array)
{
 return array[Math.Between(0, array.length-1)];
};
  
Math.OneOf = function(text)
{
  return text.slice(Math.Between(0, text.length - 1), Math.Between(0, text.length - 1) + 1);
};
  
Math.D4   = function(dices = 1) { return Math.Dices(  4, dices); }
Math.D6   = function(dices = 1) { return Math.Dices(  6, dices); }
Math.D8   = function(dices = 1) { return Math.Dices(  8, dices); }
Math.D10  = function(dices = 1) { return Math.Dices( 10, dices); }
Math.D12  = function(dices = 1) { return Math.Dices( 12, dices); }
Math.D20  = function(dices = 1) { return Math.Dices( 20, dices); }
Math.D100 = function(dices = 1) { return Math.Dices(100, dices); }

Math.Dices = function(faces, number)
{
  let res = 0;
  for(let i= 0; i < number; i++) res += Math.Between(1, faces);
  return res;
}

Math.BuildPassword = function(model)
{
 let t = "";
 let inblock = false;
 let output = "";
 for(let i = 0; i < model.length; i++)
 {
  t = model.slice(i, i + 1);
  if(t == "<") {inblock = true; continue;}
  if(t == ">") {inblock = false; continue;}
  if(inblock)  {output += t; continue;}
  if(t == "l") // lettera minuscola
  {
	  output += Math.OneIn(minuscole);
  }else
  if(t == "L") // lettera maiuscola
  {
	  output += Math.OneIn(maiuscole);
  }else
  if(t == "d") // cifra
  {
	  output += Math.OneIn(numeri);
  }else
  if(t == ".") // segni d'interpunzione
  {
	  output += Math.OneIn(punti);
  }else
  if(t == "a") // qualunque lettera minuscola o maiscola
  {
	  output += Math.OneIn(lettere);
  }else
  if(t == "c") // colore nella forma 0x000000
  {
	  output += "0x" + Math.Between(0,16777215).toString(16).ToLower();
  }else
  if(t == "C") // colore nella forma 0x000000
  {
	  output += "0X" + Math.Between(0,16777215).toString(16).toUpper();
  }else
  if(t == "h") // esadecimale
  {
	  output += "0x" + Math.Between(0,15).toString(16).ToLower();
  }else
  if(t == "H") // esadecimale
  {
	  output += "0X" + Math.Between(0,15).toString(16).toUpper();
  }else
  if(t == " ") // spazio
  {
	  output += t;
  }
 }
 return output;
}

export function stringDiscount(discounts)
{
  let arrdiscounts = discounts.NumberSplit("+");
  let res = 100 - arrdiscounts[0];
  for (let i = 1; i < arrdiscounts.length; i++) 
  {
    res = res * (100 - arrdiscounts[i]) / 100;
  }
  res = 100 - res;
  res = Number(res.toFixed(2));
  return res;
}

export function discount(...discounts)
{
  let res = 100 - discounts[0];
  for (let i = 1; i < discounts.length; i++) 
  {
    res = res * (100 - discounts[i]) / 100;
  }
  res = 100 - res;
  res = Number(res.toFixed(2));
  return res;
}












/* ------------------------------------------------------------------------------------------------------------------------------------------------------------

bools

------------------------------------------------------------------------------------------------------------------------------------------------------------ */






Boolean.prototype.Invert = function() 
{
  return !this.valueOf();
};

Boolean.prototype.ToSql = function() 
{
  let res = "";
  if(this) res = "'1'"; else res = "'0'";
  return res;
};





/* ------------------------------------------------------------------------------------------------------------------------------------------------------------

dates

------------------------------------------------------------------------------------------------------------------------------------------------------------ */




Date.prototype.Now       = function()    { return Date.now()         ; } 

Date.prototype.Year           = function() { return this.getFullYear      (); } //Restituisce l'anno (4 cifre)	date.getFullYear() // 2024
Date.prototype.Month          = function() { return this.getMonth       ()+1; } //Restituisce il mese (0-11, gennaio = 0)	date.getMonth() // 0 (Gennaio)
Date.prototype.Day            = function() { return this.getDate          (); } //Restituisce il giorno del mese (1-31)	date.getDate() // 15
Date.prototype.WeekDay        = function() { return this.getDay           (); } //Restituisce il giorno della settimana (0=Dom, 6=Sab)	date.getDay() // 2 (Martedì)
Date.prototype.Hour           = function() { return this.getHours         (); } //Restituisce l'ora (0-23)	date.getHours() // 14
Date.prototype.Minute         = function() { return this.getMinutes       (); } //Restituisce i minuti (0-59)	date.getMinutes() // 45
Date.prototype.Second         = function() { return this.getSeconds       (); } //Restituisce i secondi (0-59)	date.getSeconds() // 30
Date.prototype.Millisecond    = function() { return this.getMilliseconds  (); } //Restituisce i millisecondi (0-999)	date.getMilliseconds() // 123
Date.prototype.Time           = function() { return this.getTime          (); } //Restituisce il timestamp in millisecondi	date.getTime() // 1700000000000
Date.prototype.TimezoneOffset = function() { return this.getTimezoneOffset(); } //Restituisce il fuso orario in minuti (UTC)	date.getTimezoneOffset() // -60

Date.prototype.SetYear         = function(anno)      { return this.setFullYear    (anno)     ; } // Imposta l'anno	date.setFullYear(2025)
Date.prototype.SetMonth        = function(mese)      { return this.setMonth       (mese)     ; } // Imposta il mese (0-11)	date.setMonth(11) (Dicembre)
Date.prototype.SetDate         = function(giorno)    { return this.setDate        (giorno)   ; } // Imposta il giorno del mese	date.setDate(10)
Date.prototype.SetHour         = function(ore)       { return this.setHours       (ore)      ; } // Imposta l'ora (0-23)	date.setHours(18)
Date.prototype.SetMinute       = function(minuti)    { return this.setMinutes     (minuti)   ; } // Imposta i minuti	date.setMinutes(30)
Date.prototype.SetSecond       = function(secondi)   { return this.setSeconds     (secondi)  ; } // Imposta i secondi	date.setSeconds(45)
Date.prototype.SetMillisecond  = function(ms)        { return this.setMilliseconds(ms)       ; } // Imposta i millisecondi	date.setMilliseconds(500)
Date.prototype.SetTime         = function(timestamp) { return this.setTime        (timestamp); } // Imposta la data usando un timestamp	date.setTime(1700000000000)

Date.prototype.ToNormalDateTime = function(locale, opzioni) { return this.toLocaleString    (locale, opzioni); } // Formatta la data in base alla lingua	date.toLocaleString('it-IT') // "14/02/2024, 12:30:00"
Date.prototype.ToNormalDate     = function(locale, opzioni) { return this.toLocaleDateString(locale, opzioni); } // Restituisce solo la data locale	date.toLocaleDateString('it-IT') // "14/02/2024"
Date.prototype.ToNormalTime     = function(locale, opzioni) { return this.toLocaleTimeString(locale, opzioni); } // Restituisce solo l'ora locale	date.toLocaleTimeString('it-IT') // "12:30:00"



Date.prototype.IsLeapYear = function()
{
  return this.getFullYear().IsLeapYear();
};

Date.prototype.ToSql = function(enquote = false)
{
  let res = "";
  res = this.getFullYear().toString().padStart(4, '0') + (this.getMonth()+1).toString().padStart(2, '0') + this.getDate().toString().padStart(2, '0');
  if(enquote) res = "'" + res + "'";
  return res;
}

Date.prototype.ToTimeStamp = function()
{
  //return String(this.Year()) + String(this.Month()) + String(this.Day()) + " " + String(this.Hour()) + String(this.Minute()) + String(this.Second()) + " " + String(this.Millisecond());
  return (
    String(this.Year()).padStart(4, '0') +
    String(this.Month()).padStart(2, '0') +
    String(this.Day()).padStart(2, '0') + " " +
    String(this.Hour()).padStart(2, '0') +
    String(this.Minute()).padStart(2, '0') +
    String(this.Second()).padStart(2, '0') + " " +
    String(this.Millisecond()).padStart(3, '0') // 3 cifre per i ms
  );
}

Date.prototype.ToFullDate = function()
{
  return this.ToNormalDate() + " " + this.ToNormalTime();
};

Date.prototype.MonthLength = function() 
{
  let date = this;
  return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
};

Date.prototype.YearLength = function(year)
{
  return ((year % 4 === 0 && year % 100 > 0) || year %400 == 0) ? 366 : 365;
}

Date.prototype.GetWeekNumber = function() 
{
  let date = this;
  // Copia la data per evitare modifiche
  const d = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  // Imposta la data al giovedì della settimana corrente
  d.setDate(d.getDate() + 4 - (d.getDay() || 7));
  // Calcola il primo giorno dell'anno
  const startOfYear = new Date(d.getFullYear(), 0, 1);
  // Calcola il numero di giorni trascorsi dall'inizio dell'anno
  const daysPassed = Math.floor((d - startOfYear) / (1000 * 60 * 60 * 24));
  // Calcola il numero di settimana (dividendo per 7 e arrotondando)
  return Math.ceil((daysPassed + 1) / 7);
}

Date.prototype.StartOfYear = function() 
{
  let date = this;
  return new Date(date.getFullYear(), 0, 1);
}

Date.prototype.StartOfMonth = function() 
{
  let date = this;
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

Date.prototype.StartOfWeek = function() 
{
  let date = this;
  const d = new Date(date);
  const day = d.getDay() || 7; // Se è domenica (0), lo settiamo a 7 per partire dal lunedì
  d.setDate(d.getDate() - (day - 1));
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

Date.prototype.EndOfYear = function() 
{
  let date = this;
  return new Date(date.getFullYear(), 11, 31, 23, 59, 59, 999);
}

Date.prototype.EndOfMonth = function() 
{
  let date = this;
  return new Date(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59, 999);
}

Date.prototype.EndOfWeek = function() 
{
  let date = this;
  const d = new Date(date);
  const day = d.getDay() || 7;
  d.setDate(d.getDate() + (7 - day));
  return new Date(d.getFullYear(), d.getMonth(), d.getDate(), 23, 59, 59, 999);
}

Date.prototype.AddYears = function(years) 
{
  const newDate = new Date(this);
  newDate.setFullYear(newDate.getFullYear() + years);
  return newDate;
};

Date.prototype.AddMonths = function(months) 
{
  const newDate = new Date(this);
  newDate.setMonth(newDate.getMonth() + months);
  return newDate;
};

Date.prototype.AddWeeks = function(weeks) 
{
  const newDate = new Date(this);
  newDate.setDate(newDate.getDate() + (weeks * 7));
  return newDate;
};

Date.prototype.AddDays = function(days) 
{
  const newDate = new Date(this);
  newDate.setDate(newDate.getDate() + days);
  return newDate;
};

Date.prototype.AddHours = function(hours) 
{
  const newDate = new Date(this);
  newDate.setHours(newDate.getHours() + hours);
  return newDate;
};

Date.prototype.AddMinutes = function(minutes) 
{
  const newDate = new Date(this);
  newDate.setMinutes(newDate.getMinutes() + minutes);
  return newDate;
};

Date.prototype.AddSeconds = function(seconds) 
{
  const newDate = new Date(this);
  newDate.setSeconds(newDate.getSeconds() + seconds);
  return newDate;
};

//Funziona per qualsiasi giorno della settimana (0 = Domenica, 1 = Lunedì, etc.)
Date.prototype.GetFirstWeekdayOfYear = function(weekday) 
{
  const date = new Date(this.getFullYear(), 0, 1); // 1° gennaio dell'anno
  while (date.getDay() !== weekday) 
  {
    date.setDate(date.getDate() + 1);
  }
  return date;
};

Date.prototype.GetFirstWeekdayOfMonth = function(weekday) 
{
  const date = new Date(this.getFullYear(), this.getMonth(), 1); // 1° giorno del mese
  while (date.getDay() !== weekday) 
  {
    date.setDate(date.getDate() + 1);
  }
  return date;
};

Date.prototype.GetFirstWeekdayOfWeek = function(weekday) 
{
  const date = new Date(this);
  date.setDate(date.getDate() - date.getDay() + (date.getDay() === 0 ? -6 : 1)); // Lunedì della settimana corrente
  while (date.getDay() !== weekday) 
  {
    date.setDate(date.getDate() + 1);
  }
  return date;
};

Date.prototype.GetLastWeekdayOfYear = function(weekday) 
{
  const date = new Date(this.getFullYear(), 11, 31); // 31 dicembre dell'anno
  while (date.getDay() !== weekday) 
  {
    date.setDate(date.getDate() - 1);
  }
  return date;
};

Date.prototype.GetLastWeekdayOfMonth = function(weekday) 
{
  const date = new Date(this.getFullYear(), this.getMonth() + 1, 0); // Ultimo giorno del mese
  while (date.getDay() !== weekday) 
  {
    date.setDate(date.getDate() - 1);
  }
  return date;
};

Date.prototype.GetLastWeekdayOfWeek = function(weekday) 
{
  const date = new Date(this);
  date.setDate(date.getDate() + (7 - date.getDay())); // Domenica della settimana corrente
  while (date.getDay() !== weekday) 
  {
    date.setDate(date.getDate() - 1);
  }
  return date;
};

Date.prototype.GetDateFromWeekNumberAndWeekday = function(weekNumber, weekday) 
{
  // Ottieni il primo giorno dell'anno della data su cui viene chiamata la funzione
  const firstDayOfYear = new Date(this.getFullYear(), 0, 1);
  // Trova il primo lunedì dell'anno (o altro primo giorno desiderato)
  const firstTargetDay = firstDayOfYear.GetFirstWeekdayOfYear(weekday);
  // Calcola la data della settimana desiderata
  const resultDate = new Date(firstTargetDay);
  resultDate.setDate(firstTargetDay.getDate() + (weekNumber - 1) * 7);
  return resultDate;
};

Date.prototype.IsSaturday = function() 
{
  return this.getDay() === 6; // 6 = Sabato
};

Date.prototype.IsSunday = function() 
{
  return this.getDay() === 0; // 0 = Domenica
};

Date.prototype.IsHoliday = function()
{
  let year  = this.getFullYear()
  let month = this.getMonth()+1;
  let day   = this.getDate();
  let res  = false;
  if(year == 1950 && month == 4 && day == 9 ) res = true;
  if(year == 1951 && month == 3 && day == 25) res = true;
  if(year == 1952 && month == 4 && day == 13) res = true;
  if(year == 1953 && month == 4 && day == 5 ) res = true;
  if(year == 1954 && month == 4 && day == 18) res = true;
  if(year == 1955 && month == 4 && day == 10) res = true;
  if(year == 1956 && month == 4 && day == 1 ) res = true;
  if(year == 1957 && month == 4 && day == 21) res = true;
  if(year == 1958 && month == 4 && day == 6 ) res = true;
  if(year == 1959 && month == 3 && day == 29) res = true;
  if(year == 1960 && month == 4 && day == 17) res = true;
  if(year == 1961 && month == 4 && day == 2 ) res = true;
  if(year == 1962 && month == 4 && day == 22) res = true;
  if(year == 1963 && month == 4 && day == 14) res = true;
  if(year == 1964 && month == 3 && day == 29) res = true;
  if(year == 1965 && month == 4 && day == 18) res = true;
  if(year == 1966 && month == 4 && day == 10) res = true;
  if(year == 1967 && month == 3 && day == 26) res = true;
  if(year == 1968 && month == 4 && day == 14) res = true;
  if(year == 1969 && month == 4 && day == 6 ) res = true;
  if(year == 1970 && month == 3 && day == 29) res = true;
  if(year == 1971 && month == 4 && day == 11) res = true;
  if(year == 1972 && month == 4 && day == 2 ) res = true;
  if(year == 1973 && month == 4 && day == 22) res = true;
  if(year == 1974 && month == 4 && day == 14) res = true;
  if(year == 1975 && month == 3 && day == 30) res = true;
  if(year == 1976 && month == 4 && day == 18) res = true;
  if(year == 1977 && month == 4 && day == 10) res = true;
  if(year == 1978 && month == 3 && day == 26) res = true;
  if(year == 1979 && month == 4 && day == 15) res = true;
  if(year == 1980 && month == 4 && day == 6 ) res = true;
  if(year == 1981 && month == 4 && day == 19) res = true;
  if(year == 1982 && month == 4 && day == 11) res = true;
  if(year == 1983 && month == 4 && day == 3 ) res = true;
  if(year == 1984 && month == 4 && day == 22) res = true;
  if(year == 1985 && month == 4 && day == 7 ) res = true;
  if(year == 1986 && month == 3 && day == 30) res = true;
  if(year == 1987 && month == 4 && day == 19) res = true;
  if(year == 1988 && month == 4 && day == 3 ) res = true;
  if(year == 1989 && month == 3 && day == 26) res = true;
  if(year == 1990 && month == 4 && day == 15) res = true;
  if(year == 1991 && month == 3 && day == 31) res = true;
  if(year == 1992 && month == 4 && day == 19) res = true;
  if(year == 1993 && month == 4 && day == 11) res = true;
  if(year == 1994 && month == 4 && day == 3 ) res = true;
  if(year == 1995 && month == 4 && day == 16) res = true;
  if(year == 1996 && month == 4 && day == 7 ) res = true;
  if(year == 1997 && month == 3 && day == 30) res = true;
  if(year == 1998 && month == 4 && day == 12) res = true;
  if(year == 1999 && month == 4 && day == 4 ) res = true;
  if(year == 2000 && month == 4 && day == 23) res = true;
  if(year == 2001 && month == 4 && day == 15) res = true;
  if(year == 2002 && month == 3 && day == 31) res = true;
  if(year == 2003 && month == 4 && day == 20) res = true;
  if(year == 2004 && month == 4 && day == 11) res = true;
  if(year == 2005 && month == 3 && day == 27) res = true;
  if(year == 2006 && month == 4 && day == 16) res = true;
  if(year == 2007 && month == 4 && day == 8 ) res = true;
  if(year == 2008 && month == 3 && day == 23) res = true;
  if(year == 2009 && month == 4 && day == 12) res = true;
  if(year == 2010 && month == 4 && day == 4 ) res = true;
  if(year == 2011 && month == 4 && day == 24) res = true;
  if(year == 2012 && month == 4 && day == 8 ) res = true;
  if(year == 2013 && month == 3 && day == 31) res = true;
  if(year == 2014 && month == 4 && day == 20) res = true;
  if(year == 2015 && month == 4 && day == 5 ) res = true;
  if(year == 2016 && month == 3 && day == 27) res = true;
  if(year == 2017 && month == 4 && day == 16) res = true;
  if(year == 2018 && month == 4 && day == 1 ) res = true;
  if(year == 2019 && month == 4 && day == 21) res = true;
  if(year == 2020 && month == 4 && day == 12) res = true;
  if(year == 2021 && month == 4 && day == 4 ) res = true;
  if(year == 2022 && month == 4 && day == 17) res = true;
  if(year == 2023 && month == 4 && day == 9 ) res = true;
  if(year == 2024 && month == 3 && day == 31) res = true;
  if(year == 2025 && month == 4 && day == 20) res = true;
  if(year == 2026 && month == 4 && day == 5 ) res = true;
  if(year == 2027 && month == 3 && day == 28) res = true;
  if(year == 2028 && month == 4 && day == 16) res = true;
  if(year == 2029 && month == 4 && day == 1 ) res = true;
  if(year == 2030 && month == 4 && day == 21) res = true;
  if(year == 2031 && month == 4 && day == 13) res = true;
  if(year == 2032 && month == 3 && day == 28) res = true;
  if(year == 2033 && month == 4 && day == 17) res = true;
  if(year == 2034 && month == 4 && day == 9 ) res = true;
  if(year == 2035 && month == 3 && day == 25) res = true;
  if(year == 2036 && month == 4 && day == 13) res = true;
  if(year == 2037 && month == 4 && day == 5 ) res = true;
  if(year == 2038 && month == 4 && day == 25) res = true;
  if(year == 2039 && month == 4 && day == 10) res = true;
  if(year == 2040 && month == 4 && day == 1 ) res = true;
  if(year == 2041 && month == 4 && day == 21) res = true;
  if(year == 2042 && month == 4 && day == 6 ) res = true;
  if(year == 2043 && month == 3 && day == 29) res = true;
  if(year == 2044 && month == 4 && day == 17) res = true;
  if(year == 2045 && month == 4 && day == 9 ) res = true;
  if(year == 2046 && month == 3 && day == 25) res = true;
  if(year == 2047 && month == 4 && day == 14) res = true;
  if(year == 2048 && month == 4 && day == 5 ) res = true;
  if(year == 2049 && month == 4 && day == 18) res = true;
  if(year == 2050 && month == 4 && day == 10) res = true;
  if(month ==  1 && day ==  1) res = true;
  if(month ==  1 && day ==  6) res = true;
  if(month ==  4 && day == 25) res = true;
  if(month ==  5 && day ==  1) res = true;
  if(month ==  6 && day ==  2) res = true;
  if(month ==  8 && day == 15) res = true;
  if(month == 11 && day ==  1) res = true;
  if(month == 12 && day ==  8) res = true;
  if(month == 12 && day == 25) res = true;
  if(month == 12 && day == 26) res = true;
  return res;
}

Date.prototype.Between = function(min, max) 
{
  if (max < min) [min, max] = [max, min]; // Swap più elegante con destrutturazione
  return this >= min && this <= max;
};

Date.prototype.GetPrevWorkDate = function () 
{
  let previousDay = new Date(this);
  do 
  {
      previousDay.setDate(previousDay.getDate() - 1);
      if (previousDay.getFullYear() < 1970) break; // Evita cicli infiniti
  } while (previousDay.getDay() === 0 || previousDay.getDay() === 6 || previousDay.IsHoliday());
  return previousDay;
};

Date.prototype.GetNextWorkDate = function () 
{
  let nextDay = new Date(this);
  do 
  {
      nextDay.setDate(nextDay.getDate() + 1);
      if (nextDay.getFullYear() > 3000) break; // Evita cicli infiniti
  } while (nextDay.getDay() === 0 || nextDay.getDay() === 6 || nextDay.IsHoliday());
  return nextDay;
};

Date.prototype.Format = function(template) 
{
  const map = 
  {
      'yyyy': this.getFullYear(),
      'yy': String(this.getFullYear()).slice(-2),
      'mm': String(this.getMonth() + 1).padStart(2, '0'),
      'm': this.getMonth() + 1,
      'dd': String(this.getDate()).padStart(2, '0'),
      'd': this.getDate(),
      'hh': String(this.getHours()).padStart(2, '0'),
      'h': this.getHours(),
      'MM': String(this.getMinutes()).padStart(2, '0'),
      'M': this.getMinutes(),
      'ss': String(this.getSeconds()).padStart(2, '0'),
      's': this.getSeconds()
  };

  return template.replace(/yyyy|yy|mm|m|dd|d|hh|h|MM|M|ss|s/g, match => map[match]);
};

Date.prototype.CurrentDateWithoutTime = function() 
{
  this.setHours(0, 0, 0, 0); // Set time to midnight
  return this;
}










/* ------------------------------------------------------------------------------------------------------------------------------------------------------------

arrays

------------------------------------------------------------------------------------------------------------------------------------------------------------ */



Array.prototype.ToString    = function()      { return this.toString   ()     ; }; // Converte un array in stringa	[1,2,3].toString() // "1,2,3"
Array.prototype.Includes    = function(value) { return this.includes   (value); }; // Controlla se value è presente	[1,2,3].includes(2) // true
Array.prototype.IndexOf     = function(value) { return this.indexOf    (value); }; // Restituisce il primo indice di value, o -1 se non trovato	[1,2,3].indexOf(2) // 1
Array.prototype.LastIndexOf = function(value) { return this.lastIndexOf(value); }; // Restituisce l'ultimo indice di value	[1,2,2,3].lastIndexOf(2) // 2

Array.prototype.ToSqlInFilter = function () 
{
  let res = "";
  for(const s of this) 
  { 
    res = res.AddToList(s.ToSql(), ",");
  }
  res = "(" + res + ")";
  return res;
};

Array.prototype.AddSmart = function (text) 
{
  if(text != "") this.push(text);
};

Array.prototype.Sum = function() 
{
  let res = 0;
  this.forEach((x, i) => {if(IsNumber(x)) res += x; } );
  return res;
};

Array.prototype.Min = function() 
{
  let res = this[0];
  this.forEach((x, i) => 
  {
    if(IsNumber(x))
    {
      if(x < res) res = x;
    } 
  });
  return res;
};

Array.prototype.Max = function() 
{
  let res = this[0];
  this.forEach((x, i) => 
  {
    if(IsNumber(x))
    {
      if(x > res) res = x;
    } 
  });
  return res;
};

Array.prototype.Ave = function() 
{
  let sum = this.Sum();
  let res = sum / this.length;
  return res;
};

Array.prototype.Var = function() 
{
  let sum = this.Sum();
  let ave = this.Ave();
  let tot = 0;
  this.forEach((x, i) => 
  {
    if(IsNumber(x))
    {
      tot += x - ave;
    } 
  });
  let res = tot / this.length;
  return res;
};

Array.prototype.Unique = function() 
{
  return [...new Set(this)];
};


Array.prototype.SortTrue = function() // Rimuove i duplicati e ordina l'array
{
  return [...new Set(this)].sort((a, b) => (a > b ? 1 : -1));
};

Array.prototype.Replace = function(oldval, newval, caseinsensitive = false) 
{
  let res = [];
  for(let i = 0; i < this.length; i++)
  {
    if(caseinsensitive)
    {
      if(this[i] != undefined) res[i] = this[i].ReplaceAllInsensitive(oldval, newval); else res[i] = "";
    }else
    {
      if(this[i] != undefined) res[i] = this[i].replaceAll(oldval, newval); else res[i] = "";
    }
  }
return res;
};

Array.prototype.Add = function(val) 
{
  this.push(val);
  return this;
};

Array.prototype.Top = function() 
{
  return this.at(-1);
};

Array.prototype.InsertAt = function(index, item) 
{
  this.splice(index, 0, item);
  return this;
};

Array.prototype.InsertRangeAt = function(index, values) 
{
  return this.slice( 0, index ).concat( values ).concat( this.slice( index ) );
};

Array.prototype.Clear = function() 
{
  this.splice(0, this.length);
};

Array.prototype.Contains = function(item, caseinsensitive = false) 
{
  if(caseinsensitive)
  {
    let arr = this.ToLower();
    return arr.includes(item.ToLower());
  }else
  {
    return this.includes(item);
  }
};

Array.prototype.Exists = function(item, caseinsensitive = false) 
{
  let res = true;
  if(caseinsensitive)
  {
    let arr = this.ToLower();
    let index = arr.indexOf(item.ToLower());
    if(index == -1) res = false;
  }else
  {
    let index = this.indexOf(item);
    if(index == -1) res = false;
  }
  return res;
};

Array.prototype.CopyTo = function(array) 
{
  array.splice(0, array.length, ...this);
};

Array.prototype.Copy = function() 
{
  return this.slice();
  //return [...this];
};

Array.prototype.Clone = function() 
{
  //return this.slice();
  return [...this];
};

Array.prototype.Remove = function(item, caseinsensitive = false) 
{
  if(caseinsensitive)
  {
    let index = this.CiIndexOf(item);
    if(index > -1) this.splice(index, 1);
  }else
  {
    let index = this.indexOf(item);
    if(index > -1) this.splice(index, 1);
  }
  return this;
};

Array.prototype.RemoveAll = function(item, caseinsensitive = false) 
{
  if(caseinsensitive)
  {
    let index = this.CiIndexOf(item);
    while(index > -1) 
    {
      this.splice(index, 1);
      index = this.CiIndexOf(item);
    }
  }else
  {
    let index = this.indexOf(item);
    while(index > -1) 
    {
      this.splice(index, 1);
      index = this.indexOf(item);
    }
  }
  return this;
};

Array.prototype.RemoveAt = function(index)
{
  if(index > -1) this.splice(index, 1);
};

Array.prototype.RemoveRange = function(start, quantity) 
{
  this.splice(start, quantity);
};

Array.prototype.AddFirst = function(item)
{
  this.unshift(item);
};

Array.prototype.Enqueue = function(item)
{
  this.push(item);
};

Array.prototype.Dequeue = function()
{
  return this.shift();
};

Array.prototype.IsEmpty = function()
{
  let res = false;
  if(this.length == 0) res = true;
  return res;
};

Array.prototype.Get = function(index)
{
  return this.at(index);
};

Array.prototype.GetFirst = function()
{
  return this.at(0);
};

Array.prototype.GetLast = function()
{
  return this.at(-1);
};

Array.prototype.ToLines = function()
{
  return this.join("\r\n");
};

Array.prototype.ToLine = function(separator)
{
  if(separator == undefined) return this.join();
  else return this.join(separator);
};

Array.prototype.Swap = function(index1, index2)
{
  let temp = this[index1];
  this[index1] = this[index2];
  this[index2] = temp;
};

Array.prototype.AddTo = function(array)
{
//  array.splice(array.length, 0, ...this);
  array.splice(array.length, 0, this);
};

Array.prototype.ToLower = function()
{
  let res = [];
  for(let i = 0; i < this.length; i++)
  {
    if(this[i] != undefined) res.push(this[i].toLowerCase());
  }
  return res;
};

Array.prototype.ToUpper = function()
{
  let res = [];
  for(let i = 0; i < this.length; i++)
  {
    if(this[i] != undefined) res.push(this[i].toUpperCase());
  }
  return res;
};

Array.prototype.CiIndexOf = function(term)
{
  //let res = -1;
  let lowterm = term.toLowerCase();
  let arr = this.ToLower();
  return arr.indexOf(lowterm);
}

Array.prototype.CiLastIndexOf = function(term)
{
  //let res = -1;
  let lowterm = term.toLowerCase();
  let arr = this.ToLower();
  return arr.lastIndexOf(lowterm);
}





//const risultato = vettore.filterByPrefixes(["app", "ban"]);
Array.prototype.FilterByPrefixes = function(prefissi) 
{
  // Filtra il vettore per includere solo le stringhe che iniziano con uno dei prefissi specificati
  return this.filter(str => prefissi.some(prefisso => str.startsWith(prefisso)));
};

Array.prototype.filterStringArrayByPrefixes = function(stringArray) 
{
  const filteredObjArray = {};

  for (let key in this) 
  {
      if (this.hasOwnProperty(key)) 
      {
          for (let str of stringArray) 
          {
              if (key.startsWith(str)) 
              {
                  filteredObjArray[key] = this[key];
                  break; // Una volta trovata una corrispondenza, passa al prossimo oggetto
              }
          }
      }
  }

  return filteredObjArray;
};









/* ------------------------------------------------------------------------------------------------------------------------------------------------------------

objects

------------------------------------------------------------------------------------------------------------------------------------------------------------ */



export function flatten(obj) 
{
  const result = {};
  const visited = new Set();
  const stack = [obj];

  while (stack.length > 0) 
  {
    const current = stack.pop();

    if (visited.has(current)) continue;
    visited.add(current);

    for (const [key, value] of Object.entries(current)) 
    {
      if (typeof value === 'object' && value !== null) 
      {
        if (isDate(value)) 
        {
          result[key] = value;
        } else 
        {
          stack.push(value);
        }
      } else 
      {
        result[key] = value;
      }
    }
  }

  return result;
}
globalThis.flatten = (obj) => flatten(obj);

export function DeepClone(obj) // non funziona con gli oggetti delle classi, si perde i metodi
{
  return JSON.parse(JSON.stringify(obj));
}
globalThis.DeepClone = (obj) => DeepClone(obj);

export function deepClone(obj) 
{
  // Controlla se il valore passato è un oggetto o un array
  if (obj === null || typeof obj !== "object") 
  {
      return obj; // Se non è un oggetto o è null, restituiscilo direttamente
  }

  // Crea una copia dell'oggetto o dell'array
  let clone = Array.isArray(obj) ? [] : {};

  // Itera su tutte le proprietà dell'oggetto
  for (let key in obj) 
  {
      if (obj.hasOwnProperty(key)) 
      {
          // Richiama deepClone ricorsivamente per fare una copia profonda
          clone[key] = deepClone(obj[key]);
      }
  }

  return clone;
}
globalThis.deepClone = (obj) => deepClone(obj);


export function ToJason(obj)
{
	return JSON.stringify(obj);
}
globalThis.ToJason = (obj) => ToJason(obj);


export function FromJason(str)
{
	return JSON.parse(str);
}
globalThis.FromJason = (str) => FromJason(str);


export function ToObject(str)
{
	return JSON.parse(str);
}
globalThis.ToObject = (str) => ToObject(str);


export function FromUtf8(s)
{
	return encodeURIComponent(s);
}
globalThis.FromUtf8 = (s) => FromUtf8(s);


export function ToUtf8(s)
{
	return decodeURIComponent(s);
}
globalThis.ToUtf8 = (s) => ToUtf8(s);


export function Transfer(src, dest)
{
	var s = src.prototype;
	var d = dest.prototype;
	for(var i in src) if(! IsFunction(src[i])) dest[i] = src[i];
}
globalThis.Transfer = (src, dest) => Transfer(src, dest);


export function Methods(src, dest)
{
	var s = new src();
	for(var i in s) if(IsFunction(s[i])) dest[i] = s[i];
}
globalThis.Methods = (src, dest) => Methods(src, dest);

export function MergeAndSumProperties(oggetto1, oggetto2) 
{
  for (let key in oggetto2) 
  {
      if (oggetto2.hasOwnProperty(key)) 
      {
          // Verifica se il valore della proprietà è un numero
          if (typeof oggetto2[key] === 'number') 
          {
              if (oggetto1.hasOwnProperty(key)) 
              {
                  // Somma i valori se la proprietà esiste già in oggetto1
                  oggetto1[key] += oggetto2[key];
              } else 
              {
                  // Aggiungi la proprietà se non esiste in oggetto1
                  oggetto1[key] = oggetto2[key];
              }
          }
      }
  }
  return oggetto1;
}
globalThis.MergeAndSumProperties = (oggetto1, oggetto2) => MergeAndSumProperties(oggetto1, oggetto2);


export function ToLowerKeys(obj) 
{
  return Object.keys(obj).reduce((accumulator, key) => 
  {
    accumulator[key.toLowerCase()] = obj[key];
    return accumulator;
  }, {});
}
globalThis.ToLowerKeys = (obj) => ToLowerKeys(obj);










/* ------------------------------------------------------------------------------------------------------------------------------------------------------------

end

------------------------------------------------------------------------------------------------------------------------------------------------------------ */


