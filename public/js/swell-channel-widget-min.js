"use strict";

(function () {
  var API_URL = "/api/stories"; // https://stageapiv2gateway.swell.life/graphql

  var TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhbGlhcyI6bnVsbCwiZW1haWwiOiJ0ZXN0cGFzczEuNEBnbWFpbC5jb20iLCJ1c2VySWQiOiJVUnlPTEg4a3ZJRUQiLCJyb2xlcyI6bnVsbCwic2Vzc2lvbiI6IjE1ODg5NTM3MjU0NTIiLCJpYXQiOjE1ODg5NTM3MjUsImV4cCI6MTU5MjU1MzcyNX0.KeaCQASO4p0Lwn6qQTzQSqVLiJzFYCdG962FuYEZJbY";
  var $script = document.currentScript || document.getElementsByTagName('script')[document.getElementsByTagName('script').length - 1] || document.querySelector("script[data-swellid]");
  var token = $script.dataset.token;
  var swellid = $script.dataset.swellid;
  var limit = parseInt($script.dataset.limit || 10);
  var height = $script.dataset.height || "100%";
  var width = $script.dataset.width || "100%";
  var showHeader = $script.dataset.header == "0" ? false : true;
  var showFooter = $script.dataset.footer == "0" ? false : true;
  var scrollable = $script.dataset.scroll == "0" ? false : true;
  var $container = document.createElement("div");
  $container.style.height = height;
  $container.style.width = width;
  $container.innerHTML = '<h1>Loading...</h1>';
  $script.parentNode.insertBefore($container, $script);
  var graph = "query{\n    getSwellcast(limit: 10, offset: 0, id:\"CRyI1L7CptpN\"){\n      id,\n      name,\n      description,\n      image,\n      author{\n        id,\n        image,\n        audio{\n          url,\n          name,\n          duration\n        },\n        alias,\n        badge,\n        swellcastId,\n        followingCount\n      },\n      createdOn,\n      swellCount,\n      followState,\n      followersCount,\n      swells{\n        id,\n        audio{\n          url,\n          name,\n          duration,\n          wave\n        },\n        title,\n        description,\n        shareURL,\n        tags,\n        visibility,\n        promotionScore,\n        type\n        articles{\n          link,\n          title,\n          image\n        },\n        author{\n          id,\n          image,\n          audio{\n            url,\n            name,\n            duration\n          },\n          alias,\n          badge,\n          swellcastId\n        },\n        categories{\n          id,\n          name\n        },\n        repliesCount,\n        replies{\n          id,\n          audio{\n            url,\n            name,\n            duration\n          },\n          message,\n          author{\n            id,\n            image,\n            audio{\n              url,\n              name,\n              duration\n            },\n            alias,\n            badge,\n            swellcastId\n          },\n          createdOn\n        },\n        reactions{\n          reaction\n          pressState,\n          count\n        },\n        createdOn\n      }\n    }\n  }";

  function getStories() {
    var xhr = new XMLHttpRequest();

    xhr.onload = function (e) {
      renderStories(xhr.response);
    };

    xhr.open("POST", API_URL, true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.setRequestHeader("AuthToken", TOKEN);
    xhr.responseType = "json";
    xhr.send(graph);
  }

  function renderStories(data) {
    $container.innerHTML = "\n    <div class=\"swell-widget swell-channel-widget\">\n    <div class=\"swell-widget-header swell-channel-header\">\n      <div class=\"swell-channel-header-info ".concat(showHeader ? '' : 'swell-hide', "\">\n        <div class=\"swell-user-horizontal\">\n          <div class=\"swell-avatar\"></div>\n          <div>\n            <h2>").concat(data.channel.name, "</h2>\n            <p>").concat(data.channel.description, "</p>\n          </div>\n        </div>\n        <div><button class=\"swell-widget-button\">Vist My Channel</button></div>\n      </div>\n    </div>\n    <div class=\"swell-widget-body\"><div class=\"swell-widget-body-content ").concat(scrollable ? 'swell-widget-scrollable' : '', "\"></div></div>\n    <div class=\"swell-widget-footer ").concat(showFooter ? '' : 'swell-hide', "\"><div class=\"swell-logo\"></div></div>    </div>\n    ");
    $container.querySelector('.swell-channel-header').style.backgroundImage = "url(" + data.channel.image + ")";
    $container.querySelector(".swell-avatar").style.backgroundImage = "url(" + data.channel.owner.image + ")";
    var $stories = $container.querySelector('.swell-widget-body-content');
    data.channel.items.forEach(function (item) {
      if (item.itemType == "ANECDOTE") {
        $stories.appendChild(StoryRow(item));
      }
    });
  }

  function StoryRow(item) {
    var $story = document.createElement("div");
    $story.innerHTML = "\n    <div class=\"swell-story-row\">\n        <div class=\"swell-play-btn-container\">\n            <div class=\"play-btn\">\n                <a href=\"#\">\n                    <svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 26 26\">\n                        <polygon class=\"play-btn__svg\" points=\"9.33 6.69 9.33 19.39 19.3 13.04 9.33 6.69\"/>\n                    </svg> \n                </a>\n            </div>\n        </div>\n        <div>\n          <h2></h2>\n          <p></p>\n          <div class=\"swell-reactions\"></div>\n        </div>\n    </div>\n    ";
    $story.querySelector("h2").textContent = item.title;
    $story.querySelector("p").textContent = item.description;
    $story.querySelector(".swell-reactions").innerHTML = item.reactions.map(function (r) {
      var htm = [];

      if (SwellWidgetUtils.reactions[r.type]) {
        htm.push('<span class="swell-reaction">' + SwellWidgetUtils.reactions[r.type].emoji);

        if (r.count > 1) {
          htm.push('<span class="swell-reaction-count">' + r.count + '</span>');
        }

        htm.push('</span>');
      }

      return htm.join('');
    }).join(' ');
    return $story;
  }

  function checkViewport() {
    if (SwellWidgetUtils.isInViewport($container)) {
      window.removeEventListener("scroll", checkViewport);
      SwellWidgetUtils.injectCSS("/css/swell-channel-widget-min.css");
      SwellWidgetUtils.injectCSS("https://fonts.googleapis.com/css?family=Roboto:400,500,700");
      SwellWidgetUtils.injectCSS("https://use.typekit.net/xyd2ebx.css");
      getStories();
    }
  }

  window.addEventListener("scroll", checkViewport);
  setTimeout(checkViewport, 1);
})();
"use strict";

var SwellWidgetUtils = function () {
  var reactions = {
    THUMBSUP: {
      emoji: "👍"
    },
    CLAP: {
      emoji: "👏"
    },
    LOL: {
      emoji: "🤣"
    },
    THANKYOU: {
      emoji: "🙏"
    },
    OH: {
      emoji: "😮"
    }
  };

  var isInViewport = function isInViewport(elem) {
    var rect = elem.getBoundingClientRect();
    var h = window.innerHeight || document.documentElement.clientHeight;
    var w = window.innerWidth || document.documentElement.clientWidth;
    return rect.top >= 0 || rect.bottom <= h; // return rect.top >= 0 && rect.left >= 0 && rect.bottom <= h && rect.right <= w;
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
    reactions: reactions
  };
}();