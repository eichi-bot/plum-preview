// ヘッダーの切り替え・メニュー・ふわっと表示・産地マップ
(function(){
  var header=document.querySelector('.header');
  function onScroll(){ if(header) header.classList.toggle('scrolled', window.scrollY>40); }
  window.addEventListener('scroll',onScroll,{passive:true}); onScroll();

  var btn=document.querySelector('.menu-btn');
  if(btn){
    btn.addEventListener('click',function(){
      var open=document.body.classList.toggle('menu-open');
      btn.textContent=open?'CLOSE':'MENU';
      btn.setAttribute('aria-expanded',open);
    });
    document.querySelectorAll('.nav a').forEach(function(a){
      a.addEventListener('click',function(){document.body.classList.remove('menu-open');btn.textContent='MENU';});
    });
  }

  // 飾りのコーヒー豆：大きさ・向き・色をばらばらに、余白の端へ少しだけ置く
  (function(){
    var seed=20261117;
    function rnd(){ seed=(seed*16807)%2147483647; return (seed-1)/2147483646; }
    var COLORS=['#5E3519','#7A4724','#94603A','#A9784E','#6B3E1F'];
    function bean(c){
      return '<svg viewBox="0 0 40 56" aria-hidden="true"><ellipse cx="20" cy="28" rx="16" ry="25" fill="'+c+'"/>'+
             '<path d="M21 5 C 12 17, 28 38, 19 51" fill="none" stroke="var(--bean-gap,#F8F7F1)" stroke-width="3.6" stroke-linecap="round"/></svg>';
    }
    document.querySelectorAll('[data-beans]').forEach(function(sec){
      var n=parseInt(sec.getAttribute('data-beans'),10)||2;
      if(getComputedStyle(sec).position==='static') sec.style.position='relative';
      sec.style.overflow='hidden';
      // 文字に重ならないよう、セクションの上下の余白の中だけに置く
      var cs=getComputedStyle(sec);
      var padT=parseFloat(cs.paddingTop)||0, padB=parseFloat(cs.paddingBottom)||0;
      var mobile=window.innerWidth<=860;
      for(var i=0;i<n;i++){
        var b=document.createElement('span'); b.className='bean'+(i>=2?' bean-extra':'');
        var size=mobile? 14+Math.round(rnd()*12) : 16+Math.round(rnd()*30);
        var atTop=(i%2===0);
        var pad=atTop?padT:padB;
        var room=pad-size*1.4-18;            // 回転しても収まる高さ
        if(room<4){ rnd();rnd();rnd(); continue; }
        var y=10+rnd()*room;
        var left=(i%2===0)? (4+rnd()*36) : (58+rnd()*36);
        b.style.cssText='width:'+size+'px;left:'+left+'%;'+(atTop?'top:':'bottom:')+y+'px;transform:rotate('+Math.round(rnd()*360)+'deg);opacity:'+(0.55+rnd()*0.35).toFixed(2);
        b.innerHTML=bean(COLORS[Math.floor(rnd()*COLORS.length)]);
        sec.appendChild(b);
      }
    });
  })();

  // 写真の帯：同じ並びを2回つなげて、切れ目なく流す
  document.querySelectorAll('.marquee-track').forEach(function(t){ t.innerHTML+=t.innerHTML; });

  // 写真は画面に近づいてから読み込む（スマホの最初の表示を速くする）
  function loadBg(el){ var u=el.getAttribute('data-bg'); if(u){ el.style.backgroundImage='url('+u+')'; el.removeAttribute('data-bg'); } }
  var lazyTargets=[].slice.call(document.querySelectorAll('.marquee')).concat([].slice.call(document.querySelectorAll('[data-bg]')).filter(function(el){return !el.closest('.marquee');}));
  if('IntersectionObserver' in window){
    var lio=new IntersectionObserver(function(es){
      es.forEach(function(e){ if(!e.isIntersecting) return;
        var t=e.target; if(t.classList.contains('marquee')) t.querySelectorAll('[data-bg]').forEach(loadBg); else loadBg(t);
        lio.unobserve(t); });
    },{rootMargin:'500px 0px'});
    lazyTargets.forEach(function(el){lio.observe(el);});
  } else { document.querySelectorAll('[data-bg]').forEach(loadBg); }
  // 念のため：ページの読み込みが終わって少したったら、残りの写真も読み込んでおく
  window.addEventListener('load',function(){ setTimeout(function(){ document.querySelectorAll('[data-bg]').forEach(loadBg); },4000); });

  // ページの上へ戻るボタン
  var top=document.createElement('a');
  top.href='#'; top.className='to-top'; top.setAttribute('aria-label','ページの上へ'); top.innerHTML='<i></i>';
  top.addEventListener('click',function(e){ e.preventDefault(); window.scrollTo({top:0,behavior:'smooth'}); });
  document.body.appendChild(top);
  window.addEventListener('scroll',function(){ top.classList.toggle('show', window.scrollY>window.innerHeight*1.2); },{passive:true});

  var els=document.querySelectorAll('.fade');
  if('IntersectionObserver' in window){
    var io=new IntersectionObserver(function(es){
      es.forEach(function(e){ if(e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target);} });
    },{threshold:.12});
    els.forEach(function(el){io.observe(el);});
  } else { els.forEach(function(el){el.classList.add('in');}); }

  // 産地マップ（安藤様 2026-11-17 LINE の情報）
  var REGIONS={
    sumatra:{en:'SUMATRA',ja:'スマトラ',season:'<small>ロブスタ</small>通年<br><small>アラビカ（ガヨ）</small>10月〜2月<br><small>エクセルサ・リベリカ</small>5月〜8月',kinds:['ロブスタ','アラビカ（ガヨ）','エクセルサ','リベリカ'],note:'ガヨはスマトラ北部・アチェ州の高原にあるアラビカの産地です。'},
    wjava:{en:'WEST JAVA',ja:'西ジャワ',season:'5月〜9月',kinds:['アラビカ','ロブスタ'],note:'代表が視察した農園：スメダン県（標高1,300〜1,600m）'},
    cjava:{en:'CENTRAL JAVA',ja:'中部ジャワ',season:'5月〜9月',kinds:['アラビカ','ロブスタ']},
    ejava:{en:'EAST JAVA',ja:'東ジャワ',season:'4月〜10月',kinds:['ロブスタ','アラビカ','エクセルサ']}
  };
  var card=document.querySelector('.region-card');
  if(!card) return;

  // スマホ：選んだ産地のまわりだけを拡大して見せる（地図の表示範囲を動かす）
  var svg=document.querySelector('.atlas-map svg');
  var FULL=[0,0,940,370];
  // スマホの地図枠（縦横比 約1.5）に合わせた拡大範囲
  var VIEW={sumatra:[-10,12,420,276],wjava:[132,218,232,152],cjava:[188,203,232,152],ejava:[262,238,232,152]};
  var cur=FULL.slice(), anim=null, first=true;
  function setVB(v){ svg.setAttribute('viewBox',v.map(function(n){return n.toFixed(1);}).join(' ')); }
  function zoomTo(t){
    if(!svg||!t) return;
    var from=cur.slice(), t0=null; cancelAnimationFrame(anim);
    function step(ts){
      if(t0===null) t0=ts; var p=Math.min(1,(ts-t0)/650), e=1-Math.pow(1-p,3);
      cur=from.map(function(f,i){return f+(t[i]-f)*e;}); setVB(cur);
      if(p<1) anim=requestAnimationFrame(step);
    }
    anim=requestAnimationFrame(step);
    var wrap=document.querySelector('.atlas-map'); if(wrap) wrap.classList.toggle('zoomed', t!==FULL);
  }
  var reset=document.createElement('button');
  reset.type='button'; reset.className='map-reset'; reset.textContent='全体を見る';
  reset.addEventListener('click',function(){ zoomTo(FULL); });
  var mapWrap=document.querySelector('.atlas-map'); if(mapWrap){ mapWrap.style.position='relative'; mapWrap.appendChild(reset); }
  window.addEventListener('resize',function(){ if(window.innerWidth>860 && cur!==FULL){ cur=FULL.slice(); setVB(FULL); if(mapWrap) mapWrap.classList.remove('zoomed'); } });
  function show(key){
    var r=REGIONS[key]; if(!r) return;
    card.querySelector('.en').textContent=r.en;
    card.querySelector('h3').textContent=r.ja;
    card.querySelector('.season').innerHTML=r.season;
    card.querySelector('.kinds').innerHTML=r.kinds.map(function(k){return '<span class="tag">'+k+'</span>';}).join('');
    var mp=document.querySelector('.atlas-map'); if(mp) mp.setAttribute('data-active',key);
    if(!first && window.innerWidth<=860) zoomTo(VIEW[key]);
    var nt=card.querySelector('.note'); if(nt){ nt.textContent=r.note||'このほかの農園も、ご希望に合わせてお探しします。'; }
    document.querySelectorAll('[data-region]').forEach(function(el){ el.classList.toggle('active', el.dataset.region===key); });
    document.querySelectorAll('.calv [data-r]').forEach(function(el){ el.classList.toggle('hl', el.dataset.r.split(' ').indexOf(key)>-1); });
    document.querySelectorAll('.cal tr[data-r]').forEach(function(tr){ tr.classList.toggle('hl', tr.dataset.r.split(' ').indexOf(key)>-1); });
  }
  document.querySelectorAll('[data-region]').forEach(function(el){
    el.addEventListener('click',function(){show(el.dataset.region);});
    el.addEventListener('keydown',function(e){ if(e.key==='Enter'||e.key===' '){e.preventDefault();show(el.dataset.region);} });
  });
  show('wjava'); first=false;
})();
