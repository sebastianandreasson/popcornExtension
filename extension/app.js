$(function () {
    var infoString = $('.infobar').prop('innerHTML')
    console.log('infoString', infoString)
    var isMovie = (!infoString || infoString.indexOf('TV Episode') !== -1)
    var tvInfo = $('.tv_header span').prop('innerHTML')

    var imdbID
    if (isMovie){
      imdbID = window.location.pathname.slice(7, window.location.pathname.length - 1)
      console.log(imdbID)
      $.ajax({
        url: 'https://yts.ag/api/v2/list_movies.json?query_term=' + imdbID,
        context: document.body
      }).done(function(json) {
        if (json && json.data && json.data.movies){
          var torrent = json.data.movies[0].torrents[0]
          var slug = json.data.movies[0].slug
          var magnetURL = 'magnet:?xt=urn:btih:' + torrent.hash + '&dn=' + slug + '&tr=http://track.one:1234/announce&tr=udp://track.two:80'
          addButton(magnetURL)
        }
      });
    } else if(infoString){
      var idURL = $('.tv_header a').attr('href')
      imdbID = idURL.slice(7, idURL.indexOf('/?'))

      // Season 1, Episode 1  <- format of season and episode to parse.
      var seasonCheck = tvInfo.slice(0, tvInfo.indexOf(','))
      var length = seasonCheck.length > 'Season x'.length ? 2 : 1
      var season = tvInfo.slice(tvInfo.indexOf(',')-length, tvInfo.indexOf(','))
      var episode = tvInfo.slice(tvInfo.indexOf('Episode ')+8, tvInfo.length)

      season = parseInt(season)
      episode = parseInt(episode)

      $.ajax({
        url: 'http://eztvapi.re/show/' + imdbID,
        context: document.body
      }).done(function(data) {
        if (data && data.episodes){
          data.episodes.forEach(function(episode) {
            if (episode.season == season && episode.episode == episode && episode.torrents) {
              addButton(episode.torrents['0'].url)
            }
          })
        }
      })
    }

    function addButton(magnetURL){
      var button = $('<a/>', {
        id: 'watchButton',
        class: 'btn2 btn2_text_on',
      })

      var imgURL = chrome.extension.getURL("icon48.png")
      $('<img class="btnIcon" src=' + imgURL + '>').appendTo(button)
      $('<span class="btn2_text">Watch</span>').appendTo(button)

      button.appendTo('.title_wrapper')
      button.css('position', 'absolute')
      button.css('right', '0')

      $('.title_wrapper').css('padding-bottom', '20px');
      $('.title_wrapper').css('position', 'relative');

      $('#watchButton').click(function () {
        chrome.extension.sendRequest({
          function: 'torrent',
          magnet: magnetURL
        })
      })
    }
})
