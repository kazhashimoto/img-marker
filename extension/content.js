(function(process) {
  const CLASSNAME = 'img-marker'; // [1] <body>に追加するclass名
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
    return;
  }

  init_options();
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

  function init_options() {
    // [2] オプションの初期値を設定するコードをここに書く ---
    options.items = {};
    options.colors = {};
    // --- ここまで [2]
    options.preset = true;
  }

  function start() {
    document.body.classList.add(CLASSNAME, `${CLASSNAME}-active`);
    process(options);
  }
})(function(options) {
  // [3] 機能を実装するコードの本体をここに書く ---
  document.querySelectorAll('body *').forEach((e) => {
    let color;
    if (e.localName == 'img') {
      color = 'red'
    } else if (e.localName == 'iframe') {
      e.style.opacity = 0.1;
    } else {
      const style = window.getComputedStyle(e);
      if (style.backgroundImage.includes('url')) {
        color = 'blue';
      }
    }
    if (color) {
      e.style.outline = `2px solid ${color}`;
      e.style.outlineOffset = '-2px'
      e.classList.add('_img-marker');
    }
  });
  // --- ここまで [3]
});
