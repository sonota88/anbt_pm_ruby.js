function vLine(x){
  var line = document.createElement("div");
  line.style.width  = "0";  
  line.style.height = "100%";
  line.style.border = "solid red";
  line.style.borderWidth = "0 0 0 1px";
  line.style.position = "absolute";
  line.setAttribute( "class", "vline" );
  line.style.top  = "0";
  line.style.left = x + "px";
  document.body.appendChild( line );
}


function hLine(y){
  var line = document.createElement("div");
  line.style.width  = "100%";  
  line.style.height = "0";
  line.style.border = "solid red";
  line.style.borderWidth = "1px 0 0 0";
  line.style.position = "absolute";
  line.setAttribute( "class", "hline" );
  line.style.top  = y + "px";
  line.style.left = "0";
  document.body.appendChild( line );
}


function rectC( target, x,y,r){
  var obj = document.createElement("div");
  obj.style.width  = r*2 + "px";
  obj.style.height = r*2 + "px";
  obj.style.border = "solid red";
  obj.style.borderWidth = "1px";
  obj.style.position = "absolute";
  obj.setAttribute( "class", "hobj" );
  obj.style.top  = y-r;
  obj.style.left = x-r;
  target.appendChild( obj );
}


function timer(){
  timeBegin=new Date();

  for( var a=0; a<1; a++ ){
    pmruby();
  }
  
  var timeResult = document.createElement("p");
  
  //m.puts( "time: " + ((new Date()) - timeBegin) );
}


function Monitor(){
  this.lineNum = 0;
  this.elem = document.getElementById( "monitor" );
  this.puts = function(str){
    this.lineNum++;
    var temp = this.lineNum;
    temp += ': ';
    temp += str;
    temp += '\n';
    temp += this.elem.value;
    this.elem.value = temp;
  };
  this.init = function(){
    this.elem.value = '';
  };
}


function Ruby(fontSize){
  this.fontSize   = fontWidth;
  this.fontWidth  = fontWidth;
  this.fontHeight = fontWidth;
  this.rbFontSize   = fontSize * 0.6;
  this.rbFontWidth  = fontWidth * 0.6;
  this.rbFontHeight = this.rbFontWidth;
  this.rbMargin = this.rbFontHeight * 0.4;

  //console.log(" / " + rbFontWidth+ " / " +rbFontHeight+ " / " +rbMargin);
  this.rb = [];
  this.rt = [];
  this.rbElem = document.createElement('span');
  this.rtElem = document.createElement('span');
  this.rbW = null;
  this.rtW = null;
  this.rbSpace = 0;
  this.rtSpace = 0;
}
Ruby.prototype = {
  // 配列の入れ子を解消する
  flatten: function( fontW, rbFontW ){
    this.rb = this.rb[0];
    this.rt = this.rt[0];
  }
  
  // ルビ全体の幅
, width: function(){
    this.rbW = 0;
    for(var a in this.rb){
      this.rbW += getFontWidth(this.rb[a], this.fontSize);
    }
    this.rtW = 0;
    for(var a in this.rt){
      this.rtW += getFontWidth(this.rt[a], this.rbFontSize);
    }
    
    if( this.rbW < this.rtW ){
      return this.rtW;
    }else{
      return this.rbW;
    }
  }

, calc: function(){
    if( this.rbW < this.rtW ){
      this.rbSpace = 1.0 * ( this.rtW - this.rbW ) / ( this.rb.length + 1 )
    }else{
      this.rtSpace = 1.0 * ( this.rbW - this.rtW ) / ( this.rt.length + 1 )
    }
  }
  
, toHTML: function(originX, originY){
    this.calc();
    
    //---- rb ----
    var currentX = 0;
    currentX += this.rbSpace; // 左端
    
    var rbBox = document.createElement("div");
    rbBox.setAttribute("class", "rb_box");
    rbBox.style.display = "inline";
    rbBox.style.position = "absolute";
    //rbBox.style.border = "solid 1px red";
    rbBox.style.width = this.width();
    rbBox.style.height = this.fontWidth + this.rbFontHeight + this.rbMargin;
    rbBox.style.left = originX;
    rbBox.style.top = originY - this.fontHeight - this.rbFontHeight - this.rbMargin;
    
    //---- rb ----
    for( var a=0; a<this.rb.length; a++ ){
      var c = document.createElement("span");
      c.style.fontSize = this.fontSize + "px";
      c.style.position = "absolute";
      c.style.height = fontHeight;
      c.style.top  = this.rbFontHeight + this.rbMargin;
      c.style.left = currentX;
      c.setAttribute("class", "char rb" );
      c.innerHTML = this.rb[a];
      rbBox.appendChild( c );

      currentX += getFontWidth(this.rb[a], this.fontSize);
      currentX += this.rbSpace;
    }

    //---- rt ----
    currentX = 0;
    currentX += this.rtSpace; // 左端
    for( var a=0; a<this.rt.length; a++ ){
      var c = document.createElement("span");
      c.style.fontSize = this.rbFontWidth + "px";
      c.style.position = "absolute";
      c.style.height = this.rbFontHeight;
      c.style.top  = 0;
      c.style.left = currentX;
      c.setAttribute("class", "char rt" );
      c.innerHTML = this.rt[a];
      rbBox.appendChild( c );

      currentX += getFontWidth(this.rt[a], this.rbFontSize);
      currentX += this.rtSpace;
    }

    return rbBox;
  }
};


function Line(){
  this.X = 0;
  this.Y = 0;
  this.colCursor = 0;
  this.list = [];
}
Line.prototype = {
  push: function(e){
    this.list.push(e);
    this.colCursor += e.width();
  }
, pop: function(c, w){
    this.colCursor -= w;
    return this.list.pop();
  }
, adjust: function(boxW){
    residual = null;
    tempW = 0;
    for(var a=0; a<this.list.length; a++){
      tempW += this.list[a].width();
    }
  }
};


function getFontWidth(c, fontSize){
  var dd = document;
  var temp = dd.createElement("span");
  temp.style.fontSize = fontSize;
  temp.style.padding = 0;
  temp.style.visibility = "hidden";
  temp.innerHTML = c;
  
  dd.getElementsByTagName("body")[0].appendChild(temp);
  return temp.offsetWidth;
  dd.getElementsByTagName("body")[0].removeChild(temp);
}

function Char(c, fontSize){
  this.c = c;
  this.w = getFontWidth(c, fontSize);
}
Char.prototype = {
  width: function(){
    return this.w;
  }
, toHTML: function(originX, originY){
    var c = document.createElement("span");
    c.style.fontSize = fontWidth + "px";
    c.style.position = "absolute";
    //c.style.width  = 20;
    c.style.height = fontHeight;
    c.style.top = originY - fontHeight;
    //c.style.padding = "10";
    c.setAttribute("class", "char" );
    c.style.width  = this.width();
    c.innerHTML = this.c;
    c.style.left = originX;
    
    return c;
  }
}


function pmRubyBook(boxW, boxH, fontWidth, textareaId){

  const kinsokuBegin = ", )]｝、〕〉》」』】ヽヾーァィゥェォッャュョヮヵヶぁぃぅぇぉっゃゅょゎゕゖ々’”»‐–〜?!・:;。.";
  const kinsokuEnd = "([｛〔〈《「『【‘“«—…‥〳〴〵";
  
  
  function checkKinsokuBegin(c){
    if(kinsokuBegin.indexOf(c, 0) >= 0){
      //console.log("begin: "+c);
      return true;
    }
  }
  function checkKinsokuEnd(c){
    if(kinsokuEnd.indexOf(c, 0) >= 0){
      //console.log("end: "+c);
      return true;
    }
  }


  this.parseRuby = function(){
    var str = document.getElementById(textareaId).value;
    if(str == null){
      return null;
    }
  
    var result = new Array();
    var buf = new Array();
  
    var ruby = new Ruby(fontWidth);
  
    var arr = str.split( "" );
    for( a=0; a<arr.length; a++ ){
      if(       arr[a] == "[" ){
        for(var b=0; b<buf.length; b++){
          result.push( new Char(buf[b], fontWidth) );
        }
        buf = [];
        var ruby = new Ruby(fontWidth);
      }else if( arr[a] == "/" ){
        ruby.rb.push( buf );
        buf = [];
      }else if( arr[a] == "]" ){
        ruby.rt.push( buf );
        ruby.flatten(); // 配列の入れ子を解消
        result.push( ruby );
        buf = [];
      }else{
        buf.push( arr[a] );
      }
    }
    
    if( buf.length != 0 ){
      for(var b=0; b<buf.length; b++){
        result.push( new Char(buf[b], fontWidth) );
      }
    }
    
    parsed = result;
  }
  
  
  this.parseLines = function(){
    var line = new Line();
    var buf = [];
    var tempW = null;
    var result = [];
    
    var a;
    var test = 0;
    for( var a=0; a< parsed.length; a++ ){
      var e = parsed[a];
  
      if( w < line.colCursor + e.width() ){ // when overflow
        result.push( line );
        // result.push( '__BR__' ); // 改行
        line = new Line();
        line.push(e);
      }else{
        line.push(e)
      }
    }
    
    if( line ){
      result.push( line );
    }
    
    lines = result;
  };


  // ページ内に収まるようにn行ごとに分け、pageList にセット
  this.setPageList = function(n){
    var count = 0;
    var pageCount = 0;
    
    while( count < lines.length ){
      for(var a=0; a<n; a++ ){
        if( lines[count] != null ){
          if(a==0){ pageList[pageCount] = []; }
          pageList[pageCount].push( lines[count] );
        }
        count++;
      }
      pageCount++;
    }
  }


  this.adjustLines = function(){
    //console.log(pageList.length);
    for(var a=0; a<pageList.length; a++){
      var p = pageList[a];
      for(var b=0; b< p.length; b++){
        //console.log(p[b]);
        p[b].adjust(boxW);
      }
    }
  }


  this.makeBoxList = function(){
    for(var page=0; page<pageList.length; page++){
      var box = document.createElement("div");
      box.setAttribute("class", "box");
      box.style.backGroundColor = "#fff";
      box.style.width  = w + "px";
      box.style.height = h + "px";
      //box.style.position = "relative";
      box.style.position = "fixed";
      box.id = "page_"+ page;
      
      
      var currentX = 0;
      var currentY = lineHeight;
      
      for( var a=0; a<pageList[page].length; a++ ){ // 行ごと
        var line = pageList[page][a];
        if(DEBUG) hLine( currentY );
    
        for( var b=0; b<line.list.length; b++ ){ // 行内の要素ごと
          var e = line.list[b];
          if(DEBUG) rectC( box, currentX, currentY, 1 ); // 起点

          box.appendChild( e.toHTML(currentX, currentY) );
          currentX += e.width();
        }
        
        // line break
        currentX = 0;
        currentY += lineHeight;
      }
      
      delete pageList[page];
      
      boxList.push(box);
      if(page==0){
        ;
      }else if(page == pageList.length - 1){
        boxList[page - 1].style.display = "none";
        boxList[page].style.display = "none";
      }else{
        boxList[page - 1].style.display = "none";
      }
      
      document.getElementsByTagName("body")[0].appendChild(box);
      mon.puts( "making box: " + (page+1) + " / " + pageList.length);
    }
  }

  
  this.display = function(diff){
    pageN = currentPage + diff;
    
    if( pageN < 0){
      pageN = 0
    }else if(pageN >= boxList.length ){
      pageN = boxList.length - 1;
    }
    //mon.puts(currentPage + " to " + pageN);
    
    document.getElementById("page_monitor").innerHTML = (pageN + 1) + " / " + pageList.length ;
    
    boxList[currentPage].style.display = "none";
    boxList[pageN].style.display = "block";
    
    currentPage = pageN;
  };
  
  
  this.refresh = function(){
    pageList = [];
    boxList = [];
  
    // ルビとそれ以外を分けて配列に
    this.parseRuby();
    this.parseLines();
    // ページ内に収まるようにn行ごとに分け、Bookのプロパティにセット
    this.setPageList(lineNumInPage);
    this.adjustLines();
    this.makeBoxList();

    currentPage = 0;
    this.display(0);
  }

  
  var self = this;
  function keyOperation(event){
    if(event.keyCode == 74){ // j
      self.display(1);
    }else if(event.keyCode == 75){ // k
      self.display(-1);
    }else if(event.keyCode == 85){ // u
      self.display(5);
    }else if(event.keyCode == 73){ // i
      self.display(-5);
    }
  }
  
  
  // init -----------------------------------------------------------
  var w = boxW;
  var h = boxH;
  var fontWidth = fontWidth;
  var rbFontWidth = fontWidth * 0.5;
  var rbFontHeight = rbFontWidth;
  var rbMargin = rbFontHeight * 0.4;
  var lineHeight = fontHeight + rbFontHeight*4;
  var lineNumInPage = w / lineHeight - 1;
  
  var src = document.getElementById(textareaId).value;
  var parsed = null;
  var pageList = [];
  var boxList = [];
  var currentPage = 0;
  
  var mon = new Monitor();
  
  this.refresh();

  window.addEventListener( "keydown", keyOperation, true );
}
