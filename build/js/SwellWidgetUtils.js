var SwellWidgetUtils = (function () {
  var reactions = {
    THUMBSUP: { emoji: "👍" },
    CLAP: { emoji: "👏" },
    LOL: { emoji: "🤣" },
    THANKYOU: { emoji: "🙏" },
    OH: { emoji: "😮" },
  };

  var isInViewport = function (elem) {
    var rect = elem.getBoundingClientRect();
    var h = window.innerHeight || document.documentElement.clientHeight;
    var w = window.innerWidth || document.documentElement.clientWidth;
    return rect.top >= 0 || rect.bottom <= h;
    // return rect.top >= 0 && rect.left >= 0 && rect.bottom <= h && rect.right <= w;
  };

  function injectCSS(href) {
    var link = document.createElement("link");
    link.href = href;
    link.type = "text/css";
    link.rel = "stylesheet";
    document.getElementsByTagName("head")[0].appendChild(link);
  }

  return {
    isInViewport: isInViewport,
    injectCSS: injectCSS,
    reactions: reactions,
  };
})();
