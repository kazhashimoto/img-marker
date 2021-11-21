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
  document.querySelectorAll('img').forEach((e) => {
    e.style.outline = '1px solid red';
  });
  // --- ここまで [3]
});
