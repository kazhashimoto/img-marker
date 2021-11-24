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

})('img-marker',
function(options) {
  options.items = {item1: true};
  options.colors = {color1: '#ff0000', color2: '#0000ff'};
},
function(options, active) {
  if (!active) {
    document.querySelectorAll('iframe').forEach(e => {
      if (e.classList.contains('_img-marker-iframe')) {
          e.classList.remove('_img-marker-iframe');
      }
    });
    return;
  }
  document.querySelectorAll('body *').forEach(e => {
    let color;
    if (e.localName == 'img') {
      color = options.colors.color1
    } else if (e.localName == 'iframe' && options.items.item1) {
        e.classList.add('_img-marker-iframe');
    } else {
      const style = window.getComputedStyle(e);
      if (style.backgroundImage.includes('url')) {
        color = options.colors.color2;
      }
    }
    if (color) {
      e.style.outline = `2px solid ${color}`;
      e.style.outlineOffset = '-2px';
      e.classList.add('_img-marker-element');
    }
  });
});
