import{M as n,P as r,V as s,Yb as p,a as o}from"./chunk-PNQM3SBP.js";var a={BASE_URL:"",USERS:"users"};var N=class t{urls=a;URLS={};config;static hasTrailingSlash(e){return(e+"").indexOf("/")===(e+"").length-1}static hasPrefixSlash(e){return(e+"").indexOf("/")===0}static removeTrailingSlash(e){return t.hasTrailingSlash(e)?(e+"").substring(0,(e+"").length-1):e}static removePrefixSlash(e){return t.hasPrefixSlash(e)?t.removePrefixSlash((e+"").substring(1,(e+"").length)):e}prepareUrls(){this.URLS.BASE_URL=t.removeTrailingSlash(this.config.BASE_URL);for(let e in this.urls)e!=="BASE_URL"&&Object.prototype.hasOwnProperty.call(this.urls,e)&&(this.URLS[e]=this.addBaseUrl(this.urls[e]));return this.URLS}addBaseUrl(e){return(this.config.CONFIG.EXTERNAL_PROTOCOLS??[]).some(S=>e.toLowerCase().indexOf(S)===0)?e:this.URLS.BASE_URL+"/"+t.removePrefixSlash(e)}setConfigService(e){this.config=e}static \u0275fac=function(i){return new(i||t)};static \u0275prov=r({token:t,factory:t.\u0275fac,providedIn:"root"})};var E={VERSION:"v0.0.1",BASE_ENVIRONMENT:"",ENVIRONMENTS_URLS:{},BASE_URL:"",API_VERSION:"",EXTERNAL_PROTOCOLS:["http","https"]};var f=class t{http=s(p);CONFIG=E;BASE_URL="";load(){return this.http.get("env/environment.json").pipe(n(e=>this.CONFIG=o(o({},this.CONFIG),e))).pipe(n(()=>this.prepareBaseUrl()))}prepareBaseUrl(){if(!Object.prototype.hasOwnProperty.call(this.CONFIG,"ENVIRONMENTS_URLS")||!Object.keys(this.CONFIG.ENVIRONMENTS_URLS).length)throw Error("There is no ENVIRONMENTS_URLS Property or empty provided inside resources/environment.json file Kindly check it");if(typeof this.CONFIG.BASE_ENVIRONMENT>"u")throw Error("there is no BASE_ENVIRONMENT_INDEX provided inside resources/environment.json file");if(typeof this.CONFIG.ENVIRONMENTS_URLS[this.CONFIG.BASE_ENVIRONMENT]>"u")throw Error("the provided BASE_ENVIRONMENT not exists inside ENVIRONMENTS_URLS array in resources/environment.json file");return this.BASE_URL=this.CONFIG.ENVIRONMENTS_URLS[this.CONFIG.BASE_ENVIRONMENT],Object.prototype.hasOwnProperty.call(this.CONFIG,"API_VERSION")&&this.CONFIG.API_VERSION&&(this.BASE_URL.lastIndexOf("/")!==this.BASE_URL.length-1&&(this.BASE_URL+="/"),this.BASE_URL+=this.CONFIG.API_VERSION),this.BASE_URL}static \u0275fac=function(i){return new(i||t)};static \u0275prov=r({token:t,factory:t.\u0275fac,providedIn:"root"})};export{f as a,N as b};