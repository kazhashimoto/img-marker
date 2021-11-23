(function(classname, init_options, process) {
  const CLASSNAME = classname;
  let options = {};

  const from_extension = (typeof chrome !== 'undefined' && chrome.extension);
  if (document.body.classList.contains(CLASSNAME)) {
    if (!from_extension) {
      const script_src = document.currentScript.src;
      const el = document.querySelectorAll(`script[src="${script_src}"]`);
      if (el.length) {
        const last = el[el.length - 1];
        last.remove();
      }
    }
    document.body.classList.toggle(`${CLASSNAME}-active`);
    if (!from_extension) {
      return;
    }
  }

  options.preset = true;
  init_options(options);
  if (from_extension) {
    chrome.storage.sync.get('options', function(result) {
      if ('options' in result) {
        options = Object.assign({}, result.options);
        options.preset = false;
      }
      start();
    });
  } else {
    start();
  }

  function start() {
    let active = true;
    if (document.body.classList.contains(CLASSNAME)) {
      if (!document.body.classList.contains(`${CLASSNAME}-active`)) {
        active = false;
      }
    } else {
      document.body.classList.add(CLASSNAME, `${CLASSNAME}-active`);
    }
    process(options, active);
  }

})('img-marker', // [1] <body>に追加するclass名
function(options) {
  // [2] オプションの初期値を設定するコードをここに書く ---
  options.items = {};
  options.colors = {};
  // --- ここまで [2]
},
function(options, active) {
  if (!active) { // アイコンの状態がOFFになって呼ばれた時
    document.querySelectorAll('iframe').forEach(e => {
      e.classList.remove('_img-marker-iframe');
    });
    return;
  }
  // [3] 機能を実装するコードの本体をここに書く ---
  document.querySelectorAll('body *').forEach(e => {
    let color;
    if (e.localName == 'img') {
      color = 'red'
    } else if (e.localName == 'iframe') {
        e.classList.add('_img-marker-iframe');
    } else {
      const style = window.getComputedStyle(e);
      if (style.backgroundImage.includes('url')) {
        color = 'blue';
      }
    }
    if (color) {
      e.style.outline = `2px solid ${color}`;
      e.style.outlineOffset = '-2px';
      e.classList.add('_img-marker-element');
    }
  });
  // --- ここまで [3]
}
);
