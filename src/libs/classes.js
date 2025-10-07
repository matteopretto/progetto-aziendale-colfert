// ------------------------------------------------------------------------------------------------------------------------------------------------------------
// ------------------------------------------------------------------------------------------------------------------------------------------------------------ LocalStorage
// ------------------------------------------------------------------------------------------------------------------------------------------------------------

export class LocalStorage
{
  constructor() {  }

  Save(key, obj) 
  {
    localStorage.setItem(key, JSON.stringify(obj));
  }

  Load(key) 
  {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  }

  Clear() 
  {
    localStorage.clear();
  }

  Delete(key) 
  {
    localStorage.removeItem(key);
  }

	Key = function(val)
	{
		var res = null;
		res = localStorage.key(val);
		return res;
	}

	Length = function()
	{
		var res = null;
		res = localStorage.length;
		return res;
	}

	Keys = function()
	{
		var keys = new Array();
		for(var i = 0; i < localStorage.length; i++) keys.push(localStorage.key(i));
		return keys;
	}

	Exists = function(key)
	{
		var res = false;
		for(var i = 0; i < localStorage.length; i++)
		{
			if(localStorage.key(i) == key) res = true;
			break;
		}
		return res;
	}
}

const ls = new LocalStorage();
if (typeof globalThis !== 'undefined') { globalThis.ls = ls; }





// ------------------------------------------------------------------------------------------------------------------------------------------------------------
// ------------------------------------------------------------------------------------------------------------------------------------------------------------ Csv
// ------------------------------------------------------------------------------------------------------------------------------------------------------------

export class Csv
{
	constructor() 
	{
	}

	_download_csv(csv, filename) 
	{
		var csvFile;
		var downloadLink;
		csvFile = new Blob([csv], { type: "text/csv" });
		downloadLink = document.createElement("a");
		downloadLink.download = filename;
		downloadLink.href = window.URL.createObjectURL(csvFile);
		downloadLink.style.display = "none";
		document.body.appendChild(downloadLink);
		downloadLink.click();
	}

	Csv(id, filename) 
	{
		var csv = [];
		var rows = document.querySelectorAll("table#" + id + " tr");

		for (var i = 0; i < rows.length; i++) 
		{
			var row = [], cols = rows[i].querySelectorAll("td, th");
			for (var j = 0; j < cols.length; j++) row.push(cols[j].innerText);
			csv.push(row.join(";"));
		}

		this._download_csv(csv.join("\n"), filename);
	}

	_download_xls(xls, filename) 
	{
		var xlsFile;
		var downloadLink;

		xlsFile = new Blob([xls], { type: "text/xls" });
		downloadLink = document.createElement("a");
		downloadLink.download = filename;
		downloadLink.href = window.URL.createObjectURL(xlsFile);
		downloadLink.style.display = "none";
		document.body.appendChild(downloadLink);
		downloadLink.click();
	}

	Xls(id, filename) 
	{
		var xls = [];
		var rows = document.querySelectorAll("table#" + id + " tr");
		for (var i = 0; i < rows.length; i++) 
		{
			var row = [], cols = rows[i].querySelectorAll("td, th");
			for (var j = 0; j < cols.length; j++) row.push(cols[j].innerText);
			xls.push(row.join("\t"));
		}
		this._download_xls(xls.join("\n"), filename);
	}

  DownloadJson(obj, filename)
  {
    var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(obj));
    var downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href",     dataStr);
    downloadAnchorNode.setAttribute("download", filename + ".json");
    document.body.appendChild(downloadAnchorNode); // required for firefox
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  }  

	DownloadXls(array, filename) 
	{
		var xls = array;
		this._download_xls(xls.join("\n"), filename);
	}

}

const csv = new Csv();
if (typeof globalThis !== 'undefined') { globalThis.csv = csv; }





// ------------------------------------------------------------------------------------------------------------------------------------------------------------
// ------------------------------------------------------------------------------------------------------------------------------------------------------------ PageBuilder
// ------------------------------------------------------------------------------------------------------------------------------------------------------------

export class PageBuilder 
{
  // Funzione di accesso ai valori annidati
  static pick(obj, path) 
  {
    //console.log(obj, path);
    if (typeof path !== "string") return "value not found";

    const parts = path.match(/([^[.\]]+)|\[(\d+)\]/g);
    if (!parts) return "value not found";

    let result = obj;
    for (const part of parts) 
    {
      const key = part.startsWith("[") ? parseInt(part.slice(1, -1)) : part;
      if (result === undefined || result === null || !(key in result)) 
      {
        return "value not found";
      }
      result = result[key];
    }

    return result;
  }

  // Metodo di rendering del layout
  static render(html, header, lines) 
  {
    const rows = html.split("\n");
    let inBlock = false;
    let currentBlock = [];
    let blocks = [];

    // 1. Scomposizione in blocchi
    blocks = this.breakDown(rows);

    // 2. Costruzione output
    const output = [];

    for (const block of blocks) 
    {
      if (block.type === "static") 
      {
        // Blocchi header: sostituzione codici su singola linea
        const rendered = block.lines.map(line => PageBuilder.replaceAllCodes(line, header));
        output.push(...rendered);
      } 
      else if (block.type === "rowblock") 
      {
        // Blocchi righe: cicliamo sulle linee
        const contentLines = block.lines.slice(1, -1); // esclude #startrows# e #endrows#
        for (const row of lines) 
        {
          const rendered = contentLines.map(line => 
          {
/*
            let temp = PageBuilder.replaceAllCodes(line, row);
            temp = PageBuilder.replaceAllCodes(temp, header);
            return temp;
*/
            return PageBuilder.replaceAllCodes(line, row, header);
          });
          output.push(...rendered);
        }
      }
    }

    let res = output.join("\n");
    res = this._cleanup(res);
    return res;
  }


  static breakDown(rows) 
  {
    const blocks = [];
    let buffer = [];
    let inRowBlock = false;

    for (const line of rows) {
      const trimmed = line.trim();

      if (trimmed === "#startrows#") {
        if (inRowBlock) {
          throw new Error("Nested #startrows# not allowed");
        }

        // chiudo eventuale blocco statico prima
        if (buffer.length > 0) {
          blocks.push({ type: "static", lines: buffer });
          buffer = [];
        }

        inRowBlock = true;
        buffer.push(line); // include #startrows#

      } else if (trimmed === "#endrows#") {
        if (!inRowBlock) {
          throw new Error("#endrows# without matching #startrows#");
        }

        buffer.push(line); // include #endrows#
        blocks.push({ type: "rowblock", lines: buffer });
        buffer = [];
        inRowBlock = false;

      } else {
        buffer.push(line);
      }
    }

    // fine file: se c'è ancora qualcosa nel buffer, è statico
    if (buffer.length > 0) {
      const finalType = inRowBlock ? "rowblock" : "static";
      blocks.push({ type: finalType, lines: buffer });
    }

    //console.log(blocks);
    return blocks;
  }

  // Metodo per aprire una nuova finestra e mostrare l'output HTML
  static show(html, header, lines) 
  {
    const rendered = PageBuilder.render(html, header, lines);
    const win = window.open("about:blank", "");
    win.document.write(rendered);
    win.document.close();
  }


  static replaceAllCodes(line, ...sources) 
  {
    const codePattern = /\{\{([^}]+)\}\}/g;
    const matches = [...line.matchAll(codePattern)];
    let result = line;

    for (const match of matches) {
      const fullMatch = match[0];
      const inner = match[1];

      let op = "";
      let field = "";

      if (inner.includes("/")) {
        const splitIndex = inner.indexOf("/");
        op = inner.slice(0, splitIndex).trim();
        field = inner.slice(splitIndex + 1).trim();
      } else {
        op = "";
        field = inner.trim();
      }

      // Fallback tra tutte le sorgenti
      let rawValue = "value not found";
      for (const source of sources) {
        rawValue = PageBuilder.pick(source, field);
        if (rawValue !== "value not found") break;
      }

      let finalValue;
      try {
        finalValue = this.format(op, rawValue);
      } catch (err) {
        console.warn("Errore in format():", err);
        finalValue = "?? errore";
      }

      result = result.replace(fullMatch, String(finalValue));
    }

    return result;
  }




  static format(op, value)
  {
    //console.log(op, value);
    switch (op.trim().toLower()) 
    {
      case "upper"    : return String(value).toUpperCase();
      case "lower"    : return String(value).toLowerCase();
      case "money"    : parseFloat(value).toFixed(2);                  // $ money
      case "quantity" : return parseFloat(value).toFixed(2);           // 
      case "double"   : return parseFloat(value).toString();           // ^ double
      case "text"     : return value.toString();                       // # string
      case "int"      : return value.toString().toInt();               // | int
      case "date"     : return value.toString().toDate().toNormDate(); // ° date
      case "leftof"   : return string(value).getLeftOf("-");           // @ leftOf
      case "rightof"  : return string(value).getRightOf("-");          // § rightOf
      case "centerof" : return string(value).triCenterOf("-");         // & centerOf
      case "booleano" : return value.toString().toItaBool();           // £ booleano in italiano
      case "bool"     : return value.toString().toBool().toString();   // boolean
      case "codice"   : if(value != "") return "(" + avvolgibili[value.getLeftOf("-")].codart + ") " + value; else return ""  // boolean
      case "codice2"  : if(value != "") return "(" + avvolgibili[value.getLeftOf("=")].codart + ") " + value; else return ""  // boolean
      case "": return value;                                           // default
      default: return value;
    }    
  }

  static _cleanup(document)
  {
    let res = document.replaceAll("Invalid DateTime", " ");
    res = res.replaceAll("NaN", " ");
    res = res.replaceAll("undefined", " ");
    //res = res.replaceAll("value not found", " ");
    return res;
  }

}


const pb = new PageBuilder();
if (typeof globalThis !== 'undefined') { globalThis.pagebuilder = pb; }


// ------------------------------------------------------------------------------------------------------------------------------------------------------------
// ------------------------------------------------------------------------------------------------------------------------------------------------------------ Canvas
// ------------------------------------------------------------------------------------------------------------------------------------------------------------

export class Canvas
{
  constructor(id, settings)
  {
    this.id = id;
    this.element = dsi(id);
    if(this.element)
    {
      this.context = this.element.getContext('2d');
      this.width  = this.context.canvas.clientWidth;
      this.height = this.context.canvas.clientHeight;
    }
    this.settings = settings;
    this.immediate = true;
    this.started = false;
  }

  Set(id)
  {
    this.id = id;
    this.element = dsi(id);
    if(this.element)
    {
      this.context = element.getContext('2d');
    }
  }

  SetImmediate(value)
  {
    immediate = value;
  }

  Setting(settings)
  {
    if(settings.font        != null) this.settings.font        = settings.font;
    if(settings.direction   != null) this.settings.direction   = settings.direction;
    if(settings.align       != null) this.settings.align       = settings.align;
    if(settings.baseline    != null) this.settings.baseline    = settings.baseline;
    if(settings.fillstyle   != null) this.settings.fillstyle   = settings.fillstyle;
    if(settings.strokestyle != null) this.settings.strokestyle = settings.strokestyle;
    if(settings.linecap     != null) this.settings.linecap     = settings.linecap;
    if(settings.linejoin    != null) this.settings.linejoin    = settings.linejoin;
    if(settings.linewidth   != null) this.settings.linewidth   = settings.linewidth;
    if(settings.miterlimit  != null) this.settings.miterlimit  = settings.miterlimit;
  }

  _setStyle(linewidth, stroke, fill, font, align)
  {
    if(this.settings.font        != null) this.context.font         = this.settings.font;
    if(this.settings.direction   != null) this.context.direction    = this.settings.direction;
    if(this.settings.align       != null) this.context.textAlign    = this.settings.align;
    if(this.settings.baseline    != null) this.context.textBaseline = this.settings.baseline;
    if(this.settings.fillstyle   != null) this.context.fillStyle    = this.settings.fillstyle;
    if(this.settings.strokestyle != null) this.context.strokeStyle  = this.settings.strokestyle;
    if(this.settings.linecap     != null) this.context.lineCap      = this.settings.linecap;
    if(this.settings.linejoin    != null) this.context.lineJoin     = this.settings.linejoin;
    if(this.settings.linewidth   != null) this.context.lineWidth    = this.settings.linewidth;
    if(this.settings.miterlimit  != null) this.context.miterLimit   = this.settings.miterlimit;
    if(linewidth != null) this.context.lineWidth   = linewidth;
    if(stroke    != null) this.context.strokeStyle = stroke   ;
    if(fill      != null) this.context.fillStyle   = fill     ;
    if(font      != null) this.context.font        = font     ;
    if(align     != null) this.context.textAlign   = align    ;
  }

  // immediate
  FillRect(x, y, width, height)
  {
    this.context.fillRect(x, y, width, height);
  }

  StrokeRect(x, y, width, height)
  {
    this.context.strokeRect(x, y, width, height);
  }

  ClearRect(x, y, width, height)
  {
    this.context.clearRect(x, y, width, height);
  }

  Clear()
  {
    this.ClearRect(0,0,this.width,this.height);
  }

  // path
  Begin()
  {
    this.context.beginPath();
    this.started = true;
  }

  Close()
  {
    this.context.closePath();
  }

  Stroke()
  {
    this.context.stroke();
    this.started = false;
  }

  MoveTo(x,y)
  {
    this.context.save();
    this.context.moveTo(x,y);
    this.context.restore();
  }

  Fill()
  {
    this.context.save();
    this.context.fill();
    this.context.restore();
  }

  FillPath(path)
  {
    this.context.save();
    this.context.fill(path);
    this.context.restore();
  }

  LineTo(x,y,lwidth,lstroke)
  {
    this.context.save();
    this._setStyle(lwidth,lstroke);
    this.context.lineTo(x2,y2);
    if(this.immediate) this.context.stroke();
    this.context.restore();
  }

  Line(x1,y1,x2,y2,lwidth,lstroke)
  {
    this.context.save();
    this._setStyle(lwidth,lstroke);
    this.context.moveTo(x1,y1);
    this.context.lineTo(x2,y2);
    if(this.immediate) this.context.stroke();
    this.context.restore();
  }
  
  Rectangle(x1,y1,x2,y2,lwidth,lstroke)
  {
    this.context.save();
    this._setStyle(lwidth,lstroke);
    let width = Math.abs(x2-x1);
    let height = Math.abs(y2-y1);
    let x = Math.min(x1,x2);
    let y = Math.min(y1,y2);
    this.context.rect(x,y,width,height);
    if(this.immediate) this.context.stroke();
    this.context.restore();
  }
  
  RectByDim(x,y,width,height,lwidth,lstroke)
  {
    this.context.save();
    this._setStyle(lwidth,lstroke);
    this.context.rect(x,y,width,height);
    if(this.immediate) this.context.stroke();
    this.context.restore();
  }
  
  Circle(x,y,r,lwidth,lstroke)
  {
    this.context.save();
    this._setStyle(lwidth,lstroke);
    if(! this.started) this.context.beginPath();
    this.context.arc(x, y, r, 0, 2 * Math.PI);
    if(this.immediate) this.context.stroke();
    this.context.restore();
  }
  
  Arc(x,y,r, start, end,lwidth,lstroke)
  {
    this.context.save();
    this._setStyle(lwidth,lstroke);
    if(! this.started) this.context.beginPath();
    this.context.arc(x, y, r, start, end);
    if(this.immediate) this.context.stroke();
    this.context.restore();
  }

  ArcTo(x0, y0, x1, y1, x2, y2, r,lwidth,lstroke)
  {
    this.context.save();
    this._setStyle(lwidth,lstroke);
    if(! this.started) this.context.beginPath();
    this.context.moveTo(x0,y0);
    this.context.arcTo(x1, y1, x2, y2, r);
    if(this.immediate) this.context.stroke();
    this.context.restore();
  }

  Bezier(x0, y0, x1, y1, x2, y2, x3, y3,lwidth,lstroke) // 0 = begin, 3 = end, 1&2 = weights
  {
    this.context.save();
    this._setStyle(lwidth,lstroke);
    if(! this.started) this.context.beginPath();
    this.context.moveTo(x0,y0);
    this.context.bezierCurveTo(x1, y1, x2, y2, x3, y3);
    if(this.immediate) this.context.stroke();
    this.context.restore();
  }

  Quadratic(x0, y0, x1, y1, x, y,lwidth,lstroke)
  {
    this.context.save();
    this._setStyle(lwidth,lstroke);
    if(! this.started) this.context.beginPath();
    this.context.moveTo(x0,y0);
    this.context.quadraticCurveTo(x1, y1, x, y);
    if(this.immediate) this.context.stroke();
    this.context.restore();
  }
  
  BezierTo(x1, y1, x2, y2, x, y,lwidth,lstroke)
  {
    this.context.save();
    this._setStyle(lwidth,lstroke);
    if(! this.started) this.context.beginPath();
    this.context.bezierCurveTo(x1, y1, x2, y2, x, y);
    if(this.immediate) this.context.stroke();
    this.context.restore();
  }

  QuadraticTo(x1, y1, x, y,lwidth,lstroke)
  {
    this.context.save();
    this._setStyle(lwidth,lstroke);
    if(! this.started) this.context.beginPath();
    this.context.quadraticCurveTo(x1, y1, x, y);
    if(this.immediate) this.context.stroke();
    this.context.restore();
  }
  
  // align is: "left" "right" "center" "start" "end"
  Text(x, y, text, align, fill, font)
  {
    this.context.save();
    this._setStyle(null,null,fill,font,align);
    this.context.fillText(text, x, y); 
    this.context.restore();
  }
  
  Outline(x, y, text, align, stroke, font)
  {
    this.context.save();
    this._setStyle(null,stroke,null,font,align);
    this.context.strokeText(text, x, y); 
    this.context.restore();
  }

  Translate(OffsetX, OffsetY)
  {
    if(OffsetY == null) OffsetY = OffsetX;
    this.context.translate(OffsetX, OffsetY);
  }
  
  Scale(ScaleX, ScaleY)
  {
    if(ScaleY == null) ScaleY = ScaleX;
    this.context.scale(ScaleX, ScaleY);
  }
  
  Rotate(Radians)
  {
    this.context.rotate(Radians);
  }
  
  RotateByDegree(degrees)
  {
    this.context.rotate((degrees * Math.PI) / 180);
  }
  
  ResetTransformation()
  {
    this.context.setTransform(1, 0, 0, 1, 0, 0);
  }  

  Transform(OffsetX, OffsetY, ScaleX, ScaleY, Degree)
  {
    if(OffsetX != null) this.Translate(OffsetX, OffsetY);
    if(ScaleX  != null) this.Scale(ScaleX, ScaleY);
    if(Degree  != null) this.RotateByDegree(Degree);
  }  

}


if (typeof globalThis !== 'undefined') { globalThis.Canvas = Canvas; }



// ------------------------------------------------------------------------------------------------------------------------------------------------------------
// ------------------------------------------------------------------------------------------------------------------------------------------------------------ Media
// ------------------------------------------------------------------------------------------------------------------------------------------------------------




export class Media
{
	constructor(media, timer)
	{
		this.media = media;
		this.timer = timer;
	}

	playAudio(src)
	{
		this.media = new Media(src, function() {}, function(){log("error playing audio");});
		this.media.play();
		/*
		// Update this.media position every second
		if (this.timer == null)
		{
			this.timer = setInterval(function()
			{
				// get this.media position
				media.getCurrentPosition(
	            // success callback
				function(position)
				{
					if (position > -1) {setAudioPosition((position) + " sec");}
				},
				// error callback
				function(e)
				{
					console.log("Error getting pos=" + e);
					setAudioPosition("Error: " + e);
				});
			}, 1000);
		}
		*/
    if (this.media) {this.media.release();}
	}

	releaseAudio()
	{
		if (this.media) {this.media.release();}
	}

	getCurrentPosition(elem)
	{
		this.media.getCurrentPosition( function(position)
		{
			if (position > -1) {$("#"+elem).text("" + (position) + " sec");}
		}, function(e)
		{
			log("Error: " + e);
			$("#" + elem).text("Error: " + e);
		});
	}

	play()
	{
		if (this.media) {this.media.play();}
	}

	pause()
	{
		if (this.media) {this.media.pause();}
	}

	stop()
	{
		if (this.media) { this.media.stop();}
	//	clearInterval(this.timer);
	//	this.timer = null;
	}

	getDuration()
	{
		return this.media.getDuration();
	}

	goTo(milliseconds)
	{
		if (this.media) {this.media.seekTo(milliseconds);}
	}

	playAudio(path)
	{
		var audio = new Audio("sounds/" + path + ".mp3");
		audio.play();
	}
}


if (typeof globalThis !== 'undefined') { globalThis.Media = Media; }







// ------------------------------------------------------------------------------------------------------------------------------------------------------------
// ------------------------------------------------------------------------------------------------------------------------------------------------------------ Field Manager
// ------------------------------------------------------------------------------------------------------------------------------------------------------------








export class FieldManager
{
	constructor(fieldlist)
	{
		this.FieldList = fieldlist;
    this.Guard = false;
	};

  SetFields(fieldlist)
  {
		this.FieldList = fieldlist;
  }

  CollectIds()
  {
    let inputIds = [];

    document.querySelectorAll('input, textarea, select').forEach(input => 
    {
        const id = input.getAttribute('id');
        if (id) 
        {
            inputIds.push(id);
        }
    }); 
		this.FieldList = inputIds; 
  }

  static CheckIds()
  {
    const elementsWithId = document.querySelectorAll('[id]');
    const idCounts = {};
    
    elementsWithId.forEach(element => {
      const id = element.id;
      if (idCounts[id]) {
        idCounts[id] += 1;
      } else {
        idCounts[id] = 1;
      }
    });
    
    const duplicateIds = Object.entries(idCounts).filter(([id, count]) => count > 1);

    return duplicateIds;
  }
  
  CreatePropertiesVector()
  {
    let list = this.FieldList.map(id => 
    {
      const element = document.getElementById(id);
      if (!element) 
      {
          return null;
      }

      const obj = { id: id };
      
      // Itera su tutti gli attributi dell'elemento
      for (let attr of element.attributes) 
      {
          if (attr.name.startsWith('data-')) 
          {
              const propName = attr.name.slice(5); // Rimuove "data-" dall'attributo
              obj[propName] = attr.value;
          }
      }

      return obj;
    }).filter(item => item !== null); // Rimuovi eventuali elementi null

    let res = [];
    for (var i = 0; i < list.length; i++) { res[list[i].id] = list[i] }
    return res;
  }  

  Collect()
  {
    let res = {};
    let fields = this.FieldList;
  
    for(let element of fields)
    {
      let el = Find(element);
      if(el == null) continue;
      res[element] = Peek(element);

      if(el.type == "radio")
      {
        res[el.name] = dqs1('input[name="' + el.name + '"]:checked').value || "";
      }

    };
    return res
  };

  CollectWithProps()
  {
    let res = this.CreatePropertiesVector();
    let c = this.Collect();
    for (const key in res) 
    {  
      if (res.hasOwnProperty(key)) 
      {
        res[key].value = c[key];
      }      
    }
    return res;
  }

  Apply(data)
  {
    let fields = this.FieldList;
    for(let element of fields)
    {
      let el = dsi(element);
      if(el == null) continue;
      poke(element, data[element]);
    };
  };

  CleanStarting(lead)
  {
    let fields = this.FieldList;
  
    for(let element of fields)
    {
      if(lead.length > 0)
      {
        if(element.startsWith(lead))
        {
          this.CleanOneElement(element);
        }
      }else
      {
        this.CleanOneElement(element);
      }
    };
  };

  CleanFrom(start)
  {
    if(this.Guard) return;
    this.Guard = true;
    let fields = this.FieldList;
    let ok = false;
  
    for(let element of fields)
    {
      //console.log(ok, element);
      if(ok)
      {
        this.CleanOneElement(element);
      }
      if(element == start) ok = true;
    };
    this.Guard = false;
  };
  
  Clean()
  {
    for(let element of this.FieldList)
    {
      this.CleanOneElement(element);
    };
  };

  CleanFields(fields)
  {
    for(let element of fields)
    {
      this.CleanOneElement(element);
    };
  };

  CleanOneElement(element)
  {
    let el = dsi(element);
    if(el == null) return;
    Reset(element, true);
  };
}



const fm = new FieldManager();
if (typeof globalThis !== 'undefined') { globalThis.fm = fm; }


  





// ------------------------------------------------------------------------------------------------------------------------------------------------------------
// ------------------------------------------------------------------------------------------------------------------------------------------------------------ Client Sql (api)
// ------------------------------------------------------------------------------------------------------------------------------------------------------------



export class ApiSqlClient 
{
  constructor(apiKey = '123456', baseUrl = 'https://www.giallocolfert.com:3000/api/sql/', format = 'json') {
    this.apiKey = "pippopippo";
    this.baseUrl = baseUrl.endsWith('/') ? baseUrl : baseUrl + '/';
    this.format = format.toLowerCase(); // 'json' o 'html'
  }

  setApiKey(key) {
    this.apiKey = key;
  }

  setBaseUrl(url) {
    this.baseUrl = url.endsWith('/') ? url : url + '/';
  }

  setFormat(format) {
    this.format = format.toLowerCase(); // accetta 'json' o 'html'
  }

  async call(action, body = {}) {
    const url = this.baseUrl + this.format + '/' + action.toLowerCase();

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + this.apiKey
      },
      body: JSON.stringify(body)
    });

    if (!response.ok) {
      const isHtml = this.format === 'html';
      const err = isHtml ? await response.text() : await response.json();
      throw new Error(err.error || err || 'Errore generico');
    }

    return this.format === 'html'
      ? await response.text()
      : (await response.json()).result;
  }

  // Metodi disponibili
  async rowCount(query) {
    return this.call('RowCount', { query });
  }

  async colCount(query) {
    return this.call('ColCount', { query });
  }

  async existsValue(query) {
    return this.call('ExistsValue', { query });
  }

  async getOneValue(query) {
    return this.call('GetOneValue', { query });
  }

  async openQuery(query) {
    return this.call('OpenQuery', { query });
  }

  async valueList(query, column = 0) {
    return this.call('ValueList', { query, column });
  }

  async horizontalValueList(query, row = 0) {
    return this.call('HorizontalValueList', { query, row });
  }

  async createDictionary(query) {
    return this.call('CreateDictionary', { query });
  }

  async addToQueries(query) {
    return this.call('AddToQueries', { query });
  }

  async getQueries() {
    return this.call('GetQueries');
  }

  async clearQueries() {
    return this.call('ClearQueries');
  }

  async executeQueries() {
    return this.call('ExecuteQueries');
  }

  async executeTransaction() {
    return this.call('ExecuteTransaction');
  }

  async executeQuery(query) {
    return this.call('ExecuteQuery', { query });
  }
}




// Opzionale per ambiente browser
// window.ApiSqlClient = ApiSqlClient;

// Opzionale per Node.js / module
//export { ApiSqlClient };

const sql = new ApiSqlClient();
if (typeof globalThis !== 'undefined') { globalThis.sql = sql; }














/*
const API_BASE = 'http://localhost:3000/api/sql/json/';
const API_KEY = '123456'; // puoi eventualmente impostarla via setApiKey()

export const apiSql = {
  apiKey: API_KEY,

  setApiKey(key) {
    this.apiKey = key;
  },

  async call(action, body = {}) {
    const response = await fetch(API_BASE + action.toLowerCase(), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + this.apiKey
      },
      body: JSON.stringify(body)
    });

    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.error || 'Errore generico');
    }

    const data = await response.json();
    return data.result;
  },

  // Wrapper utili
  async rowCount(query) {
    return this.call('RowCount', { query });
  },

  async getOneValue(query) {
    return this.call('GetOneValue', { query });
  },

  async openQuery(query) {
    return this.call('OpenQuery', { query });
  },

  async valueList(query, column = 0) {
    return this.call('ValueList', { query, column });
  },

  async horizontalValueList(query, row = 0) {
    return this.call('HorizontalValueList', { query, row });
  },

  async createDictionary(query) {
    return this.call('CreateDictionary', { query });
  },

  async addToQueries(query) {
    return this.call('AddToQueries', { query });
  },

  async getQueries() {
    return this.call('GetQueries');
  },

  async clearQueries() {
    return this.call('ClearQueries');
  },

  async executeQueries() {
    return this.call('ExecuteQueries');
  },

  async executeTransaction() {
    return this.call('ExecuteTransaction');
  },

  async executeQuery(query) {
    return this.call('ExecuteQuery', { query });
  },

  async colCount(query) {
    return this.call('ColCount', { query });
  },

  async existsValue(query) {
    return this.call('ExistsValue', { query });
  }
};
*/



/*

async function fetchRowCount() {
  const response = await fetch('http://localhost:3000/api/sql/json/rowcount', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer 123456' // o da una variabile globale
    },
    body: JSON.stringify({
      query: 'SELECT * FROM colfer..anagraficacf'
    })
  });

  const data = await response.json();
  console.log('Risultato rowcount:', data.result);
}



*/


/*
si usa così:

import { apiSql } from './apiSqlClient.js';

async function test() {
  const clienti = await apiSql.openQuery("SELECT * FROM colfer..anagraficacf");
  console.log(clienti);
}


*/




