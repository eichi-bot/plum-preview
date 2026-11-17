/* ===================================================================
   簡易パスワードゲート（安藤様向け 非公開プレビュー用）
   ※カジュアルな鍵です。本番公開時はこのファイルを読み込まない。
   合言葉はこの PW を書き換えるだけで変更できます。
=================================================================== */
(function () {
  "use strict";
  var PW = "plum2026";
  var KEY = "plum_gate_v1";
  var authed = false;
  try { authed = sessionStorage.getItem(KEY) === "1"; } catch (e) { authed = true; }
  var st = document.createElement("style");
  st.textContent =
    'html[data-gate="wait"] body{visibility:hidden!important}' +
    'html[data-gate="wait"] #plum-gate{visibility:visible!important}' +
    '#plum-gate{position:fixed;inset:0;z-index:2147483647;display:flex;align-items:center;justify-content:center;background:#F8F7F1;padding:1rem;font-family:"Zen Kaku Gothic New","Hiragino Sans","Yu Gothic",sans-serif}' +
    '#plum-gate .g-card{background:#fff;border:1px solid #D9D3C6;max-width:360px;width:100%;padding:2.2rem 1.6rem 1.8rem;text-align:center;color:#2A2521}' +
    '#plum-gate .mark{width:40px;height:40px;margin:0 auto 1rem;border-radius:50%;background:radial-gradient(circle at 35% 35%,#9A4D64,#6B2E42 60%,#3F1B28)}' +
    '#plum-gate h2{font-family:"Shippori Mincho","Yu Mincho",serif;font-weight:500;font-size:1.15rem;margin:0 0 .5rem;letter-spacing:.08em}' +
    '#plum-gate p{font-size:.8rem;color:#5E554D;margin:0 0 1.3rem;line-height:1.9}' +
    '#plum-gate input{width:100%;padding:.75rem .8rem;border:1px solid #D9D3C6;font-size:1rem;margin-bottom:.8rem;text-align:center;box-sizing:border-box}' +
    '#plum-gate input:focus{outline:2px solid #C9A3B0;border-color:#6B2E42}' +
    '#plum-gate button{width:100%;padding:.8rem;border:0;border-radius:999px;background:#6B2E42;color:#fff;font-size:1rem;cursor:pointer;letter-spacing:.1em}' +
    '#plum-gate button:hover{background:#3F1B28}' +
    '#plum-gate .err{color:#A8342C;font-size:.8rem;min-height:1.1em;margin-top:.5rem}' +
    '#plum-gate small{display:block;margin-top:1rem;font-size:.7rem;color:#9A8F84;letter-spacing:.1em}';
  (document.head || document.documentElement).appendChild(st);
  if (!authed) document.documentElement.setAttribute("data-gate", "wait");
  function reveal() {
    var g = document.getElementById("plum-gate");
    if (g && g.parentNode) g.parentNode.removeChild(g);
    document.documentElement.removeAttribute("data-gate");
  }
  document.addEventListener("DOMContentLoaded", function () {
    if (authed) { reveal(); return; }
    var g = document.createElement("div");
    g.id = "plum-gate";
    g.innerHTML =
      '<div class="g-card"><div class="mark" aria-hidden="true"></div>' +
      '<h2>株式会社プラム</h2>' +
      '<p>ホームページの<strong>試作（非公開プレビュー）</strong>です。<br>合言葉を入力してください。</p>' +
      '<input id="plum-gate-pw" type="password" autocomplete="off" placeholder="合言葉" aria-label="合言葉" />' +
      '<button id="plum-gate-go" type="button">見る</button>' +
      '<div class="err" id="plum-gate-err" role="alert"></div>' +
      '<small>Website by And One</small></div>';
    document.body.appendChild(g);
    var input = document.getElementById("plum-gate-pw");
    var err = document.getElementById("plum-gate-err");
    function submit() {
      if (input.value.trim() === PW) { try { sessionStorage.setItem(KEY, "1"); } catch (e) {} reveal(); }
      else { err.textContent = "合言葉が違います"; input.value = ""; input.focus(); }
    }
    document.getElementById("plum-gate-go").addEventListener("click", submit);
    input.addEventListener("keydown", function (e) { if (e.key === "Enter") submit(); });
    input.focus();
  });
})();
