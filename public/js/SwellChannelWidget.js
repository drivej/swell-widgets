(function(){
  var API_URL = "/api/stories"; // https://stageapiv2gateway.swell.life/graphql
  var TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhbGlhcyI6bnVsbCwiZW1haWwiOiJ0ZXN0cGFzczEuNEBnbWFpbC5jb20iLCJ1c2VySWQiOiJVUnlPTEg4a3ZJRUQiLCJyb2xlcyI6bnVsbCwic2Vzc2lvbiI6IjE1ODg5NTM3MjU0NTIiLCJpYXQiOjE1ODg5NTM3MjUsImV4cCI6MTU5MjU1MzcyNX0.KeaCQASO4p0Lwn6qQTzQSqVLiJzFYCdG962FuYEZJbY";

  var $script = document.currentScript || document.querySelector("script[data-swellid]");
  var token = $script.dataset.token;
  var swellid = $script.dataset.swellid;
  var limit = parseInt($script.dataset.limit || 10);
  var height = $script.dataset.height || "100%";
  var width = $script.dataset.width || "100%";
  var $container = document.createElement("div");
  $container.className = "swell-widget swell-channel-widget";

  $script.parentNode.insertBefore($container, $script);

  var graph = `query{
    getSwellcast(limit: 10, offset: 0, id:"CRyI1L7CptpN"){
      id,
      name,
      description,
      image,
      author{
        id,
        image,
        audio{
          url,
          name,
          duration
        },
        alias,
        badge,
        swellcastId,
        followingCount
      },
      createdOn,
      swellCount,
      followState,
      followersCount,
      swells{
        id,
        audio{
          url,
          name,
          duration,
          wave
        },
        title,
        description,
        shareURL,
        tags,
        visibility,
        promotionScore,
        type
        articles{
          link,
          title,
          image
        },
        author{
          id,
          image,
          audio{
            url,
            name,
            duration
          },
          alias,
          badge,
          swellcastId
        },
        categories{
          id,
          name
        },
        repliesCount,
        replies{
          id,
          audio{
            url,
            name,
            duration
          },
          message,
          author{
            id,
            image,
            audio{
              url,
              name,
              duration
            },
            alias,
            badge,
            swellcastId
          },
          createdOn
        },
        reactions{
          reaction
          pressState,
          count
        },
        createdOn
      }
    }
  }`;

  // var reactions = {
  //   THUMBSUP: { emoji: "👍" },
  //   CLAP: { emoji: "👏" },
  //   LOL: { emoji: "🤣" },
  //   THANKYOU: { emoji: "🙏" },
  //   OH: { emoji: "😮" },
  // };

  // var isInViewport = function (elem) {
  //   var rect = elem.getBoundingClientRect();
  //   var h = window.innerHeight || document.documentElement.clientHeight;
  //   var w = window.innerWidth || document.documentElement.clientWidth;
  //   return rect.top >= 0 && rect.left >= 0 && rect.bottom <= h && rect.right <= w;
  // };

  // function injectCSS(href) {
  //   var link = document.createElement("link");
  //   link.href = href;
  //   link.type = "text/css";
  //   link.rel = "stylesheet";
  //   document.getElementsByTagName("head")[0].appendChild(link);
  // }

  function getStories() {
    var xhr = new XMLHttpRequest();
    xhr.onload = function (e) {
      renderStories(xhr.response);
    };
    //  + "?" + new Date().getTime()
    xhr.open("POST", API_URL, true);
    // xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.setRequestHeader("AuthToken", TOKEN);
    xhr.responseType = "json";
    xhr.send(graph);
  }

  function renderStories(data) {
    $container.innerHTML = "";

    var $header = document.createElement("div");
    $header.className = "swell-channel-header";
    $header.innerHTML = '\
        <div><div class="swell-avatar"></div></div>\
        <div class="swell-channel-header-info">\
            <div><h2>' + data.channel.name + "</h2></div>\
            <div><button>Vist My Channel</button></div>\
        </div>\
    ";
    $header.style.backgroundImage = "url(" + data.channel.image + ")";
    $container.appendChild($header);

    $header.querySelector(".swell-avatar").style.backgroundImage = "url(" + data.channel.owner.image + ")";

    var $stories = document.createElement("div");
    $stories.className = "swell-stories-list";
    $container.appendChild($stories);

    data.channel.items.forEach((item) => {
      if (item.itemType == "ANECDOTE") {
        $stories.appendChild(StoryRow(item));
      }
    });
  }

  function StoryRow(item) {
    var $story = document.createElement("div");
    $story.innerHTML =
      '\
    <div class="swell-story-row">\
        <div class="swell-play-btn-container">\
            <div class="play-btn">\
                <a href="#">\
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 26 26">\
                        <polygon class="play-btn__svg" points="9.33 6.69 9.33 19.39 19.3 13.04 9.33 6.69"/>\
                    </svg> \
                </a>\
            </div>\
        </div>\
        <div>\
            <h2></h2>\
            <p></p>\
            <div class="swell-reactions"></div>\
        </div>\
    </div>\
    ';
    $story.querySelector("h2").textContent = item.title;
    $story.querySelector("p").textContent = item.description;
    $story.querySelector(".swell-reactions").innerHTML = item.reactions.map((r) => {
        var htm = [];
        if(SwellWidgetUtils.reactions[r.type]){
            htm.push('<span class="swell-reaction">' + SwellWidgetUtils.reactions[r.type].emoji);
            if(r.count>1){
                htm.push('<span class="swell-reaction-count">'+r.count+'</span>');
            }
            htm.push('</span>');
        }
        return htm.join('');
    }).join(' ');

    return $story;
  }

  function checkViewport() {
    if (SwellWidgetUtils.isInViewport($container)) {
      SwellWidgetUtils.injectCSS("/css/swell-channel-widget-min.css");
      SwellWidgetUtils.injectCSS("https://fonts.googleapis.com/css?family=Roboto:400,500,700");
      SwellWidgetUtils.injectCSS("https://use.typekit.net/xyd2ebx.css");

      getStories();
      window.removeEventListener("scroll", checkViewport);
    }
  }

  window.addEventListener("scroll", checkViewport);
  checkViewport();
})();
