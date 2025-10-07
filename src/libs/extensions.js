//non serve installare niente
import crypto from 'crypto';

// ------------------------------------------------------------------------------------------------------------------------------------------------------------
// ------------------------------------------------------------------------------------------------------------------------------------------------------------ tipi e generici
// ------------------------------------------------------------------------------------------------------------------------------------------------------------

export function Md5(str) 
{
    return crypto.createHash('md5').update(str).digest('hex');
}
globalThis.Md5 = (str) => Md5(str);

export function Distance(x1, y1, x2, y2)
{
  let res = 0.0;
  res = Math.sqrt(((x1-x2)*(x1-x2))+((y1-y2)*(y1-y2)));
  return res;
}
globalThis.Distance = (x1, y1, x2, y2) => Distance(x1, y1, x2, y2);

export function IsInRange(x1, y1, x2, y2, range)
{
  let res = false;
  range = range * range;
  let dist = ((x1-x2)*(x1-x2))+((y1-y2)*(y1-y2));
  if(dist <= range) res = true;
  return res;
}
globalThis.IsInRange = (x1, y1, x2, y2, range) => IsInRange(x1, y1, x2, y2, range);

/*
export function log(...args) { console.log(...args); }
export function success(...args) { console.log("[" + (new Date()).ToTimeStamp() + "]", "[success]", ...args); }
export function warning(...args) { console.log("[" + (new Date()).ToTimeStamp() + "]", "[warning]", ...args); }
export function error  (...args) { console.log("[" + (new Date()).ToTimeStamp() + "]", "[error]", ...args); }
export function info   (...args) { console.log("[" + (new Date()).ToTimeStamp() + "]", "[info]", ...args); }
*/

export function Discount(...discounts)
{
  let res = 100 - discounts[0];
  for (let i = 1; i < discounts.length; i++) 
  {
    res = res * (100 - discounts[i]) / 100;
  }
  res = 100 - res;
  res = Number(res.toFixed(res,2));
  return res;
}
globalThis.Discount = (...discounts) => Discount(...discounts);

export function StringDiscount(discounts)
{
  let arrdiscounts = discounts.NumberSplit("+");
  let res = 100 - arrdiscounts[0];
  for (let i = 1; i < arrdiscounts.length; i++) 
  {
    res = res * (100 - arrdiscounts[i]) / 100;
  }
  res = 100 - res;
  res = Number(res.toFixed(res,2));
  return res;
}
globalThis.StringDiscount = (discounts) => StringDiscount(discounts);

export function Choose(...strings)
{
  let res = "";
  res = strings[0];
  if(res != "") return res;
  for (let i = 1; i < strings.length; i++) 
  {
    res = strings[i];
    if(res != "") return res;
  }
  return res;
}
globalThis.Choose = (...strings) => Choose(...strings);

export function TakeAll(...strings)
{
  let res = "";
  res = strings[0];
  for (let i = 1; i < strings.length; i++) 
  {
    if(strings[i] != "") res = res.AddToList(strings[i], ", ");
  }
  return res;
}
globalThis.TakeAll = (...strings) => TakeAll(...strings);

export function IsNumber (value) { return typeof value === 'number' && isFinite(value); }
globalThis.IsNumber = (value) => IsNumber(value);
export function IsString (value) { if(typeof value === 'string' || value instanceof String) return true; else return false; }
globalThis.IsString = (value) => IsString(value);
export function IsBool   (value) { return typeof myVariable === "boolean"; }
globalThis.IsBool = (value) => IsBool(value);
export function IsInt    (value) { return Number.isInteger(value); }
globalThis.IsInt = (value) => IsInt(value);
export function IsDate   (value) { return (value instanceof Date); }
globalThis.IsDate = (value) => IsDate(value);
export function IsArray  (value) { return Array.isArray(value); }
globalThis.IsArray = (value) => IsArray(value);
export function IsObject (value) { if( (typeof value === "object" || typeof value === 'function') && (value !== null) ) { return true; } else { return false; } }
globalThis.IsObject = (value) => IsObject(value);
export function IsFunction(value) { return typeof value === "function"; }
globalThis.IsFunction = (value) => IsFunction(value);

export function IsObjectEmpty(obj) { return Object.keys(obj).length === 0; }
globalThis.IsObjectEmpty = (obj) => IsObjectEmpty(obj);
export function bool  (data) { if(IsBool  (data)) return data; else return String(data.toString()).ToBool(); }
globalThis.bool = (data) => bool(data);
export function string(data) { if(data == null) return ""; if(IsString(data)) return data; else return data.toString(); }
globalThis.string = (data) => string(data);
export function number(data) { if(data == null)return 0; if(IsNumber(data)) return data; else return Number(data.toString()); }
globalThis.number = (data) => number(data);
export function int   (data) { if(IsNumber(data)) return data; else return String(data.toString()).ToInt(); }
globalThis.int = (data) => int(data);
export function date  (data) 
{ 
  if(IsDate  (data)) 
  {
    if(isNaN(data.getTime())) return getCurrentDateWithoutTime();
    else return data; 
  }
  else 
  {
    let newdata = String(data.toString()).ToDate();
    if(isNaN(newdata.getTime()))
    {
      return getCurrentDateWithoutTime();
    }
    else if(IsDate(newdata)) 
    {
      return newdata; 
    }
    else
    {
      return getCurrentDateWithoutTime();
    }
  }
}
globalThis.date = (data) => date(data);


// ------------------------------------------------------------------------------------------------------------------------------------------------------------
// ------------------------------------------------------------------------------------------------------------------------------------------------------------ DOM
// ------------------------------------------------------------------------------------------------------------------------------------------------------------



export function Find(id)   { return document.getElementById(id); }
globalThis.Find = (id) => Find(id);
export function Exists(id) { return (document.getElementById(id)) !== null; }
globalThis.Exists = (id) => Exists(id);

export function Peek(id) 
{ 
  let res = "";
  let element = document.getElementById(id);
  if(element == null) return res;
  if(element.type == "")

  if(element.type == "button"        ) res = element.value;
  if(element.type == "checkbox"      ) res = element.checked;
  if(element.type == "color"         ) res = element.value;
  if(element.type == "date"          ) res = element.value;
  if(element.type == "datetime-local") res = element.value;
  if(element.type == "email"         ) res = element.value;
  if(element.type == "file"          ) res = element.value;
  if(element.type == "hidden"        ) res = element.value;
  if(element.type == "month"         ) res = element.value;
  if(element.type == "number"        ) res = number(element.value);
  if(element.type == "password"      ) res = element.value;
  if(element.type == "radio"         ) res = element.checked;
  if(element.type == "range"         ) res = number(element.value);
  if(element.type == "search"        ) res = element.value;
  if(element.type == "tel"           ) res = element.value;
  if(element.type == "text"          ) res = element.value;
  if(element.type == "time"          ) res = element.value;
  if(element.type == "url"           ) res = element.value;
  if(element.type == "week"          ) res = element.value;

  if(element.type == "select-one"    ) res = element.value;
  if(element.type == "textarea"      ) res = element.value;

  if(res == null) res = "";
  if(element.type == "date"           && res != "") res = new Date(res);
  if(element.type == "datetime-local" && res != "") res = new Date(res);

  if(element.tagName === 'LABEL')      res = element.innerText;

  if(res == null) res = "";

  if(isString(res)) res = res.trim();
  return res;
}
globalThis.Peek = (id) => Peek(id);

export function Poke(id, value, active = false) 
{ 
  let element = document.getElementById(id);
  if(element != null)
  {
    if(element.type == "button"        ) element.value   = value;
    if(element.type == "checkbox"      ) element.checked = bool(value);
    if(element.type == "color"         ) element.value   = value;
    if(element.type == "date"          ) element.value   = value;
    if(element.type == "datetime-local") element.value   = value;
    if(element.type == "email"         ) element.value   = value;
    if(element.type == "file"          ) element.value   = value;
    if(element.type == "hidden"        ) element.value   = value;
    if(element.type == "month"         ) element.value   = value;
    if(element.type == "number"        ) element.value   = number(value);
    if(element.type == "password"      ) element.value   = value;
    if(element.type == "radio"         ) element.checked = bool(value);
    if(element.type == "range"         ) element.value   = number(value);
    if(element.type == "search"        ) element.value   = value;
    if(element.type == "tel"           ) element.value   = value;
    if(element.type == "text"          ) element.value   = value;
    if(element.type == "time"          ) element.value   = value;
    if(element.type == "url"           ) element.value   = value;
    if(element.type == "week"          ) element.value   = value;

    if(element.type == "select-one"    ) element.value   = value;
    if(element.type == "textarea"      ) element.value   = value;

    if(element.tagName === 'LABEL')      element.innerText = value;

    if(active) document.getElementById(id).dispatchEvent(new Event('input')); // trigger event input
  }
}
globalThis.Poke = (id, value, active = false) => Poke(id, value, active);

export function Reset(id, active = false) 
{ 
  let element = document.getElementById(id);
  if(element != null)
  {
    if(element.type == "button"        ) element.value   = "";
    if(element.type == "checkbox"      ) element.checked = false;
    if(element.type == "color"         ) element.value   = "";
    if(element.type == "date"          ) element.value   = "";
    if(element.type == "datetime-local") element.value   = "";
    if(element.type == "email"         ) element.value   = "";
    if(element.type == "file"          ) element.value   = "";
    if(element.type == "hidden"        ) element.value   = "";
    if(element.type == "month"         ) element.value   = "";
    if(element.type == "number"        ) element.value   = 0;
    if(element.type == "password"      ) element.value   = "";
    if(element.type == "radio"         ) element.checked = false;
    if(element.type == "range"         ) element.value   = 0;
    if(element.type == "search"        ) element.value   = "";
    if(element.type == "tel"           ) element.value   = "";
    if(element.type == "text"          ) element.value   = "";
    if(element.type == "time"          ) element.value   = "";
    if(element.type == "url"           ) element.value   = "";
    if(element.type == "week"          ) element.value   = "";

    if(element.type == "select-one"    ) element.value   = "";
    if(element.type == "textarea"      ) element.value   = "";

    if(active) document.getElementById(id).dispatchEvent(new Event('input')); // trigger event input
  }
}
globalThis.Reset = (id, active = false) => Reset(id, active);

export function Html(id, value)
{
  let res = "";
  let element = document.getElementById(id);
  if(element == null) return res;
  element.innerHTML = value;
  return element;
}
globalThis.Html = (id, value) => Html(id, value);

// await waitForDOMUpdate();
async function waitForDOMUpdate() 
{
  return new Promise(resolve => requestAnimationFrame(resolve));
}
globalThis.waitForDOMUpdate = () => waitForDOMUpdate();

export function PeekByClass(id)                 { return document.getElementsByClassName(id); }
globalThis.PeekByClass = (id) => PeekByClass(id);

export function PeekByTag  (id)                 { return document.getElementsByTagName  (id); }
globalThis.PeekByTag = (id) => PeekByTag(id);

export function PeekByName (id)                 { return document.getElementsByName     (id); }
globalThis.PeekByName = (id) => PeekByName(id);

export function SelectAll  (id)                 { return document.querySelectorAll      (id); }
globalThis.SelectAll = (id) => SelectAll(id);

export function SelectOne  (id)                 { return document.querySelector         (id); }
globalThis.SelectOne = (id) => SelectOne(id);

export function Attribute  (id, attr)           { return document.getElementById(id).getAttribute(attr); }
globalThis.Attribute = (id, attr) => Attribute(id, attr);

export function SetCSSVariable(variable, value) { document.documentElement.style.setProperty(variable, value); }
globalThis.SetCSSVariable = (variable, value) => SetCSSVariable(variable, value);

export function GetCSSVariable(variable)        { return getComputedStyle(document.documentElement).getPropertyValue(variable); }
globalThis.GetCSSVariable = (variable) => GetCSSVariable(variable);


/*
validation:

1) nell'html sotto il campo metti un div class= "invalid-feedback"

2) se vuoi puoi fare lo stesso con class="valid-feedback"

<input id = "avvjdata" type="date" class="form-control">
<div class="invalid-feedback"> Il riferimento è obbligatorio. </div>
<div class="valid-feedback"> Il riferimento è va bene. </div>

3) devi aggiungere al campo la le classi o "is-valid" o "is-invalid"

$("#avvjdata").addClass("is-valid")
$("#avvjdata").removeClass("is-valid")
$("#avvjdata").addClass("is-invalid")
$("#avvjdata").removeClass("is-invalid")
*/
        
export function MakeValid(...ids)
{
  for (const id of ids) 
  { 
    let el = $("#" + id);
    if(el.length < 0) continue;
    el.addClass("is-valid");
  }
}
globalThis.MakeInvalid = (...ids) => MakeInvalid(...ids);

export function MakeInvalid(...ids)
{
  for (const id of ids) 
  { 
    let el = $("#" + id);
    if(el.length < 0) continue;
    el.addClass("is-invalid");
  }
}
globalThis.ClearValidation = (...ids) => ClearValidation(...ids);

export function ClearValidation(...ids)
{
  for (const id of ids) 
  { 
    let el = $("#" + id);
    if(el.length < 0) continue;
    el.removeClass("is-valid"); 
    el.removeClass("is-invalid"); 
  }
}
globalThis.ClearValidation = (...ids) => ClearValidation(...ids);

export function ShowFile(path)
{
  window.open(path, '_blank'); //.focus() ???
}
globalThis.ShowFile = (path) => ShowFile(path);

export function AssignChoice(id, value) 
{
  let element = document.getElementById(id);
  if (element) 
  {
    element.value = value;
    element.dispatchEvent(new Event('input', { bubbles: true }));
  }
}
globalThis.AssignChoice = (id, value) => AssignChoice(id, value);

export function AddClass(classe, ...ids) 
{
  for (const id of ids) 
  {
    let element = document.getElementById(id);
    if(element) 
    {
        element.classList.add(classe);
    }
  }
}
globalThis.AddClass = (classe, ...ids) => AddClass(classe, ...ids);

export function RemoveClass(classe, ...ids) 
{
  for (const id of ids) 
  {
    let element = document.getElementById(id);
    if(element) 
    {
      element.classList.remove(classe);
    }
  }
}
globalThis.RemoveClass = (classe, ...ids) => RemoveClass(classe, ...ids);

export function MakeReadOnly(mode, ...ids)
{
  for (const id of ids) 
  { 
    Find(id).readOnly = mode;
  }
  
}
globalThis.MakeReadOnly = (mode, ...ids) => MakeReadOnly(mode, ...ids);

export function Disable(mode, ...ids)
{
  for (const id of ids) 
  { 
    Find(id).disabled = mode;
  }
  
}
globalThis.Disable = (mode, ...ids) => Disable(mode, ...ids);

export function CreateDivAndAppend(identifier) 
{
  if(Exists(identifier)) return;
  const newDiv = document.createElement("div");
  newDiv.setAttribute("id", identifier);
  document.body.appendChild(newDiv);
}
globalThis.CreateDivAndAppend = (identifier) => CreateDivAndAppend(identifier);

export function RemoveElement(identifier) 
{
  const element = document.getElementById(identifier);
  if (element) 
  {
    const parentElement = element.parentNode;
    parentElement.removeChild(element);
  }
}
globalThis.RemoveElement = (identifier) => RemoveElement(identifier);

export function AddLastChild(id, htmlString)
{
  const parentElement = document.getElementById(id);
  parentElement.insertAdjacentHTML('beforeend', htmlString);
}
globalThis.AddLastChild = (id, htmlString) => AddLastChild(id, htmlString);

export function RemoveAllChildren(id)
{
  const parentElement = document.getElementById(id);
  // Remove all children
  while (parentElement.firstChild) 
  {
    parentElement.removeChild(parentElement.firstChild);
  }
  
}
globalThis.RemoveAllChildren = (id) => RemoveAllChildren(id);

export function CreateElementWithId(type, id) 
{
  if(! Exists(id) )
  {
    let container = document.createElement(type);
    container.setAttribute("id", id);
    document.body.appendChild(container); // ultimo elemento del body
  }
}
globalThis.CreateElementWithId = (type, id) => CreateElementWithId(type, id);











// ------------------------------------------------------------------------------------------------------------------------------------------------------------
// ------------------------------------------------------------------------------------------------------------------------------------------------------------ avanzate
// ------------------------------------------------------------------------------------------------------------------------------------------------------------


export function promisifyOne(fn) 
{
  return function (...args) 
  {
    return new Promise((resolve) => 
    {
      fn(...args, resolve);
    });
  };
}
globalThis.promisifyOne = (fn) => promisifyOne(fn);
/*
const loadData = (id, cb) => cb("User " + id);
const loadDataAsync = promisifyOne(loadData);

const res = await loadDataAsync(42); // ? "User 42"
*/
export function promisifyTwo(fn) 
{
  return function (...args) 
  {
    return new Promise((resolve, reject) => 
    {
      fn(...args, resolve, reject);
    });
  };
}
globalThis.promisifyTwo = (fn) => promisifyTwo(fn);
/*
const leggiUtente = (id, success, error) => {
  if (id === 1) success({ nome: "Mario" });
  else error("Utente non trovato");
};

const leggiUtenteAsync = promisifyTwo(leggiUtente);

try {
  const utente = await leggiUtenteAsync(1);
  console.log("OK:", utente);
} catch (err) {
  console.error("Errore:", err);
}
*/

/*
esempio fatto bene

function promisifyOne(fn) {
  return function (...args) {
    return new Promise((resolve) => {
      fn(...args, resolve);
    });
  };
}

// wrapper su setTimeout (tempo, callback)
const sleep = promisifyOne(setTimeout);

// uso con await
(async () => {
  console.log("Aspetto 1 secondo...");
  await sleep(1000);
  console.log("Finito!");
})();
*/

























// utils.js - Funzioni di utilità generiche per JavaScript

// ------------------- ARRAY & NUMERI -------------------

export function range(start, end, step = 1) {
  return Array.from(
    { length: Math.max(Math.ceil((end - start) / step), 0) },
    (_, i) => start + i * step
  );
}
globalThis.range = (start, end, step = 1) => range(start, end, step);

export function rangeFromZero(length) {
  return Array.from({ length }, (_, i) => i);
}
globalThis.rangeFromZero = (length) => rangeFromZero(length);

export function repeat(n, fn) {
  for (let i = 0; i < n; i++) {
    fn(i);
  }
}
globalThis.repeat = (n, fn) => repeat(n, fn);

export function shuffle(array) {
  return [...array].sort(() => Math.random() - 0.5);
}
globalThis.shuffle = (array) => shuffle(array);

export function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
globalThis.sleep = (ms) => sleep(ms);

export function chunk(array, size) {
  const result = [];
  for (let i = 0; i < array.length; i += size) {
    result.push(array.slice(i, i + size));
  }
  return result;
}
globalThis.chunk = (array, size) => chunk(array, size);

export function unique(array) {
  return [...new Set(array)];
}
globalThis.unique = (array) => unique(array);

export function flattenArray(array) {
  return array.flat(Infinity);
}
globalThis.flattenArray = (array) => flattenArray(array);

export function groupBy(array, fn) {
  return array.reduce((acc, val) => {
    const key = fn(val);
    (acc[key] = acc[key] || []).push(val);
    return acc;
  }, {});
}
globalThis.groupBy = (array, fn) => groupBy(array, fn);

export function shuffled(array) {
  return [...array].sort(() => Math.random() - 0.5);
}
globalThis.shuffled = (array) => shuffled(array);

export function intersection(arr1, arr2) {
  const set2 = new Set(arr2);
  return arr1.filter(item => set2.has(item));
}
globalThis.intersection = (arr1, arr2) => intersection(arr1, arr2);

export function difference(arr1, arr2) {
  const set2 = new Set(arr2);
  return arr1.filter(item => !set2.has(item));
}
globalThis.difference = (arr1, arr2) => difference(arr1, arr2);

export function union(arr1, arr2) {
  return [...new Set([...arr1, ...arr2])];
}
globalThis.union = (arr1, arr2) => union(arr1, arr2);

export function compact(array) {
  return array.filter(Boolean);
}
globalThis.compact = (array) => compact(array);

export function zip(...arrays) {
  const length = Math.min(...arrays.map(arr => arr.length));
  return Array.from({ length }, (_, i) => arrays.map(arr => arr[i]));
}
globalThis.zip = (...arrays) => zip(...arrays);

// ------------------- STRINGHE -------------------

export function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}
globalThis.capitalize = (str) => capitalize(str);

export function titleCase(str) {
  return str
    .toLowerCase()
    .split(/\s+/)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}
globalThis.titleCase = (str) => titleCase(str);

export function titleCaseSmart(str) {
  const minorWords = new Set([
    'a', 'an', 'and', 'as', 'at', 'but', 'by', 'for', 'in', 'nor', 'of', 'on', 'or', 'so', 'the', 'to', 'up', 'yet', 'with'
  ]);

  return str
    .toLowerCase()
    .split(/\s+/)
    .map((word, index) => {
      if (index === 0 || !minorWords.has(word)) {
        return word.charAt(0).toUpperCase() + word.slice(1);
      }
      return word;
    })
    .join(' ');
}
globalThis.titleCaseSmart = (str) => titleCaseSmart(str);

export function slugify(str) {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}
globalThis.slugify = (str) => slugify(str);

export function toCamelCase(str) {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]+(.)/g, (_, chr) => chr.toUpperCase());
}
globalThis.toCamelCase = (str) => toCamelCase(str);

export function fromCamelCase(str) {
  return str
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/^\w/, c => c.toUpperCase())
    .toLowerCase();
}
globalThis.fromCamelCase = (str) => fromCamelCase(str);

export function reverseString(str) {
  return str.split('').reverse().join('');
}
globalThis.reverseString = (str) => reverseString(str);

export function isPalindrome(str) {
  const clean = str.toLowerCase().replace(/[^a-z0-9]/g, '');
  return clean === clean.split('').reverse().join('');
}
globalThis.isPalindrome = (str) => isPalindrome(str);

// ------------------- DATE & TEMPO -------------------

export function formatDate(date, locale = 'it-IT') {
  return new Date(date).toLocaleDateString(locale);
}
globalThis.formatDate = (date, locale = 'it-IT') => formatDate(date, locale);

export function timeAgo(date) {
  const now = new Date();
  const past = new Date(date);
  const diff = Math.floor((now - past) / 1000);

  if (diff < 60) return 'adesso';
  if (diff < 3600) return `${Math.floor(diff / 60)} minuti fa`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} ore fa`;
  if (diff < 172800) return 'ieri';
  return `${Math.floor(diff / 86400)} giorni fa`;
}
globalThis.timeAgo = (date) => timeAgo(date);

export function addDays(date, days) {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}
globalThis.addDays = (date, days) => addDays(date, days);

export function diffDays(date1, date2) {
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  const diff = Math.abs(d1 - d2);
  return Math.floor(diff / (1000 * 60 * 60 * 24));
}
globalThis.diffDays = (date1, date2) => diffDays(date1, date2);

// ------------------- OGGETTI -------------------

export function deepCloneJson(obj) {
  return JSON.parse(JSON.stringify(obj));
}
globalThis.deepCloneJson = (obj) => deepCloneJson(obj);

export function deepEqual(obj1, obj2) {
  return JSON.stringify(obj1) === JSON.stringify(obj2);
}
globalThis.deepEqual = (obj1, obj2) => deepEqual(obj1, obj2);

export function mergeDeep(target, source) {
  const isObject = obj => obj && typeof obj === 'object';
  const output = { ...target };
  if (isObject(target) && isObject(source)) {
    Object.keys(source).forEach(key => {
      if (isObject(source[key])) {
        if (!(key in target)) Object.assign(output, { [key]: source[key] });
        else output[key] = mergeDeep(target[key], source[key]);
      } else {
        Object.assign(output, { [key]: source[key] });
      }
    });
  }
  return output;
}
globalThis.mergeDeep = (target, source) => mergeDeep(target, source);

export function pick(obj, keys) {
  return keys.reduce((acc, key) => {
    if (key in obj) acc[key] = obj[key];
    return acc;
  }, {});
}
globalThis.pick = (obj, keys) => pick(obj, keys);

export function omit(obj, keys) {
  return Object.keys(obj).reduce((acc, key) => {
    if (!keys.includes(key)) acc[key] = obj[key];
    return acc;
  }, {});
}
globalThis.omit = (obj, keys) => omit(obj, keys);

export function mapValues(obj, fn) {
  return Object.fromEntries(Object.entries(obj).map(([k, v]) => [k, fn(v)]));
}
globalThis.mapValues = (obj, fn) => mapValues(obj, fn);

export function isEmptyObject(obj) {
  return obj && Object.keys(obj).length === 0 && obj.constructor === Object;
}
globalThis.isEmptyObject = (obj) => isEmptyObject(obj);

// ------------------- FUNZIONI -------------------

export function debounce(fn, delay) {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => fn(...args), delay);
  };
}
globalThis.debounce = (fn, delay) => debounce(fn, delay);

export function throttle(fn, limit) {
  let inThrottle;
  return (...args) => {
    if (!inThrottle) {
      fn(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}
globalThis.throttle = (fn, limit) => throttle(fn, limit);

export function once(fn) {
  let called = false;
  let result;
  return (...args) => {
    if (!called) {
      called = true;
      result = fn(...args);
    }
    return result;
  };
}
globalThis.once = (fn) => once(fn);

export function memoize(fn) {
  const cache = new Map();
  return (...args) => {
    const key = JSON.stringify(args);
    if (cache.has(key)) return cache.get(key);
    const result = fn(...args);
    cache.set(key, result);
    return result;
  };
}
globalThis.memoize = (fn) => memoize(fn);

export function compose(...fns) {
  return (x) => fns.reduceRight((v, f) => f(v), x);
}
globalThis.compose = (...fns) => compose(...fns);

export function pipe(...fns) {
  return (x) => fns.reduce((v, f) => f(v), x);
}
globalThis.pipe = (...fns) => pipe(...fns);

export function delay(fn, ms) {
  return (...args) => setTimeout(() => fn(...args), ms);
}
globalThis.delay = (fn, ms) => delay(fn, ms);

export function wrap(fn, wrapper) {
  return (...args) => wrapper(fn, ...args);
}
globalThis.wrap = (fn, wrapper) => wrap(fn, wrapper);

export function jsonToHtml(data) 
{
  if (data === null || data === undefined) {
    return `<pre>null</pre>`;
  }

  // Primitivi
  if (typeof data === 'string' || typeof data === 'number' || typeof data === 'boolean') {
    return `<pre>${escapeHtml(data.toString())}</pre>`;
  }

  // Array di primitivi
  if (Array.isArray(data) && data.every(x => typeof x !== 'object')) {
    return `<ul>${data.map(item => `<li>${escapeHtml(item.toString())}</li>`).join('')}</ul>`;
  }

  // Array di oggetti (tabella)
  if (Array.isArray(data) && data.every(x => typeof x === 'object' && x !== null)) {
    const headers = Object.keys(data[0] ?? {});
    const thead = `<thead><tr>${headers.map(h => `<th>${escapeHtml(h)}</th>`).join('')}</tr></thead>`;
    const rows = data.map(row => {
      return `<tr>${headers.map(h => `<td>${escapeHtml((row[h] ?? '').toString())}</td>`).join('')}</tr>`;
    }).join('');
    return `<table border="1" cellpadding="4" cellspacing="0">${thead}<tbody>${rows}</tbody></table>`;
  }

  // Oggetto semplice
  if (typeof data === 'object') {
    return `<dl>${Object.entries(data).map(([k, v]) => `
      <dt>${escapeHtml(k)}</dt><dd>${escapeHtml((v ?? '').toString())}</dd>`).join('')}</dl>`;
  }

  // Qualsiasi altra cosa
  return `<pre>${escapeHtml(JSON.stringify(data, null, 2))}</pre>`;
}
globalThis.jsonToHtml = (data) => jsonToHtml(data);

// Escape HTML
export function escapeHtml(str) 
{
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
globalThis.escapeHtml = (str) => escapeHtml(str);



// ------------------------------------------------------------------------------------------------------------------------------------------------------------
// ------------------------------------------------------------------------------------------------------------------------------------------------------------ localizzazione
// ------------------------------------------------------------------------------------------------------------------------------------------------------------



async function MyLocalization() 
{
  try {
    const res = await fetch('https://api.db-ip.com/v2/free/self');
    const data = await res.json();
    global.localization = data;
    return data;
  } catch (err) {
    console.error('Errore in MyLocalization:', err);
    throw err;
  }
}
globalThis.MyLocalization = () => MyLocalization();

async function MyIP() 
{
  try {
    const res = await fetch('https://api.db-ip.com/v2/free/self');
    const data = await res.json();
    global.ip = data.ipAddress;
    return data.ipAddress;
  } catch (err) {
    console.error('Errore in MyIP:', err);
    throw err;
  }
}
globalThis.MyIP = () => MyIP();


/*
await MyUtils.MyLocalization();
console.log(global.localization);

const ip = await MyUtils.MyIP();
console.log(ip, global.ip);
*/


