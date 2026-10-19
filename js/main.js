(function(){
  var c=document.getElementById('scene'),x=c.getContext('2d');
  var W,H,dpr,cars=[],still=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var cols=['#9AA6B5','#B7C0CC','#7F8B9B','#C9D0D9','#A58D7A','#8794A8'];
  function rnd(a,b){return a+Math.random()*(b-a)}
  function build(){
    var n=W<600?22:44; cars=[];
    var rows=[.14,.26,.38,.5], colsX=[.12,.34,.58,.82];
    for(var i=0;i<n;i++){
      var horiz=Math.random()<.65, lane=horiz?rows[i%rows.length]*H+rnd(-4,4):colsX[i%colsX.length]*W+rnd(-4,4);
      var dir=Math.random()<.5?1:-1, sp=rnd(.25,.7)*dir;
      cars.push({h:horiz,l:lane,p:rnd(0,horiz?W:H),s:sp,col:cols[i%cols.length],id:i+1,t:[],seen:true,miss:0,w:rnd(9,13)});
    }
  }
  function size(){
    dpr=Math.min(window.devicePixelRatio||1,2);
    W=c.clientWidth;H=c.clientHeight;c.width=W*dpr;c.height=H*dpr;x.setTransform(dpr,0,0,dpr,0,0);build();
  }
  function bg(){
    x.fillStyle='#232A33';x.fillRect(0,0,W,H);
    x.strokeStyle='rgba(255,255,255,.07)';x.lineWidth=14;
    [.14,.26,.38,.5].forEach(function(r){x.beginPath();x.moveTo(0,r*H);x.lineTo(W,r*H);x.stroke()});
    [.12,.34,.58,.82].forEach(function(r){x.beginPath();x.moveTo(r*W,0);x.lineTo(r*W,H);x.stroke()});
    x.strokeStyle='rgba(255,255,255,.06)';x.lineWidth=1;x.setLineDash([10,12]);
    [.14,.26,.38,.5].forEach(function(r){x.beginPath();x.moveTo(0,r*H);x.lineTo(W,r*H);x.stroke()});
    x.setLineDash([]);
  }
  function frame(){
    bg();
    cars.forEach(function(k){
      if(!still){k.p+=k.s}
      var lim=k.h?W:H; if(k.p>lim+20)k.p=-20; if(k.p<-20)k.p=lim+20;
      var cx=k.h?k.p:k.l, cy=k.h?k.l:k.p, w=k.h?k.w:k.w*.55, h=k.h?k.w*.55:k.w;
      if(!still){ if(k.miss>0)k.miss--; else if(Math.random()<.004)k.miss=40; }
      x.fillStyle=k.col;x.fillRect(cx-w/2,cy-h/2,w,h);
      k.t.push([cx,cy]); if(k.t.length>40)k.t.shift();
      if(k.miss>0){ x.strokeStyle='#FF5A36';x.lineWidth=1.2;x.setLineDash([3,3]);x.strokeRect(cx-w/2-3,cy-h/2-3,w+6,h+6);x.setLineDash([]);return }
      x.strokeStyle='rgba(124,147,255,.55)';x.lineWidth=1.5;x.beginPath();
      k.t.forEach(function(p,i){ if(i===0)x.moveTo(p[0],p[1]); else if(Math.abs(p[0]-k.t[i-1][0])+Math.abs(p[1]-k.t[i-1][1])<30)x.lineTo(p[0],p[1]); else x.moveTo(p[0],p[1]) });
      x.stroke();
      x.strokeStyle='#7C93FF';x.lineWidth=1.4;x.strokeRect(cx-w/2-3,cy-h/2-3,w+6,h+6);
      if(W>600){x.fillStyle='#7C93FF';x.font='500 9px sans-serif';x.fillText('car '+k.id,cx-w/2-3,cy-h/2-6)}
    });
    if(!still)requestAnimationFrame(frame);
  }
  size();frame();
  var rt;window.addEventListener('resize',function(){clearTimeout(rt);rt=setTimeout(function(){size();if(still)frame()},150)});
})();
