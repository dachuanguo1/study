(function(){
  var T=String.fromCharCode(36);
  // 同时匹配 $$...$$（块级）和 $...$（行内）
  var RE=new RegExp('\\'+T+'\\'+T+'([\\s\\S]+?)\\'+T+'\\'+T+'|\\'+T+'([^\\'+T+'\\n]+?)\\'+T,'g');
  function walk(root){
    var w=document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    var nodes=[], n;
    while((n=w.nextNode())){ if(n.nodeValue.indexOf(T)>=0) nodes.push(n); }
    nodes.forEach(function(node){
      var txt=node.nodeValue;
      if(node.parentNode && node.parentNode.closest && node.parentNode.closest('code')) return;
      var frag=document.createDocumentFragment(), last=0, m;
      RE.lastIndex=0;
      while((m=RE.exec(txt))){
        if(m.index>last) frag.appendChild(document.createTextNode(txt.slice(last,m.index)));
        var disp=!!m[1];
        var tex=disp?m[1]:m[2];
        var sp=document.createElement(disp?'div':'span');
        try{ katex.render(tex.trim(), sp, {displayMode:disp, throwOnError:false, strict:false}); }
        catch(e){ sp.textContent=m[0]; }
        frag.appendChild(sp);
        last=m.index+m[0].length;
      }
      if(last===0) return;
      if(last<txt.length) frag.appendChild(document.createTextNode(txt.slice(last)));
      node.parentNode.replaceChild(frag, node);
    });
  }
  try{ walk(document.body); }catch(e){}
})();
