(function(){
  var API_URL = "/api/stories"; // https://stageapiv2gateway.swell.life/graphql
  var TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhbGlhcyI6bnVsbCwiZW1haWwiOiJ0ZXN0cGFzczEuNEBnbWFpbC5jb20iLCJ1c2VySWQiOiJVUnlPTEg4a3ZJRUQiLCJyb2xlcyI6bnVsbCwic2Vzc2lvbiI6IjE1ODg5NTM3MjU0NTIiLCJpYXQiOjE1ODg5NTM3MjUsImV4cCI6MTU5MjU1MzcyNX0.KeaCQASO4p0Lwn6qQTzQSqVLiJzFYCdG962FuYEZJbY";

  var $script = document.currentScript || document.getElementsByTagName('script')[document.getElementsByTagName('script').length - 1] || document.querySelector("script[data-swellid]");
  var token = $script.dataset.token;
  var swellid = $script.dataset.swellid;
  var limit = parseInt($script.dataset.limit || 10);
  var height = $script.dataset.height || "100%";
  var width = $script.dataset.width || "100%";
  var showHeader = $script.dataset.header=="0" ? false : true;
  var showFooter = $script.dataset.footer=="0" ? false : true;
  var scrollable = $script.dataset.scroll=="0" ? false : true;
  var $container = document.createElement("div");
  $container.style.height = height;
  $container.style.width = width;
  $container.innerHTML = '<h1>Loading...</h1>';

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
    $container.innerHTML = `
    <div class="swell-widget swell-channel-widget">
    <div class="swell-widget-header swell-channel-header">
      <div class="swell-channel-header-info ${showHeader ? '' : 'swell-hide'}">
        <div class="swell-user-horizontal">
          <div class="swell-avatar"></div>
          <h2>${data.channel.name}</h2>
        </div>
        <div><button class="swell-widget-button">Vist My Channel</button></div>
      </div>
    </div>
    <div class="swell-widget-body"><div class="swell-widget-body-content ${scrollable ? 'swell-widget-scrollable' : ''}"></div></div>
    <div class="swell-widget-footer ${showFooter ? '' : 'swell-hide'}"><div class="swell-logo"></div></div>\
    </div>
    `;

    $container.querySelector('.swell-channel-header').style.backgroundImage = "url(" + data.channel.image + ")";
    $container.querySelector(".swell-avatar").style.backgroundImage = "url(" + data.channel.owner.image + ")";

    var $stories = $container.querySelector('.swell-widget-body-content');

    data.channel.items.forEach((item) => {
      if (item.itemType == "ANECDOTE") {
        $stories.appendChild(StoryRow(item));
      }
    });
  }

  function StoryRow(item) {
    var $story = document.createElement("div");
    $story.innerHTML = `
    <div class="swell-story-row">
        <div class="swell-play-btn-container">
            <div class="play-btn">
                <a href="#">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 26 26">
                        <polygon class="play-btn__svg" points="9.33 6.69 9.33 19.39 19.3 13.04 9.33 6.69"/>
                    </svg> 
                </a>
            </div>
        </div>
        <div>
          <h2></h2>
          <p></p>
          <div class="swell-reactions"></div>
        </div>
    </div>
    `;
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
      window.removeEventListener("scroll", checkViewport);
      SwellWidgetUtils.injectCSS("/css/swell-channel-widget-min.css");
      SwellWidgetUtils.injectCSS("https://fonts.googleapis.com/css?family=Roboto:400,500,700");
      SwellWidgetUtils.injectCSS("https://use.typekit.net/xyd2ebx.css");
      getStories();
    }
  }

  window.addEventListener("scroll", checkViewport);
  setTimeout(checkViewport,1);
})();
