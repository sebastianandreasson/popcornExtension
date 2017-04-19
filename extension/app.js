$(function () {
    var infoString = $('.subtext').children(':first')[0].content
    var isMovie = (infoString && infoString.indexOf('TV') === -1)
    var tvInfo = $('.bp_heading').prop('innerHTML')

    var imdbID
    if (isMovie){
      imdbID = window.location.pathname.slice(7, window.location.pathname.length - 1)
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
    } else if (infoString){
      var idURL = $('.titleParent a').attr('href')
      imdbID = idURL.slice(7, idURL.indexOf('?'))

      // Season 1 <span class="ghost">|</span> Episode 1  <- format of season and episode to parse.
      var season = tvInfo.slice(tvInfo.indexOf('Season ') + 7, tvInfo.indexOf('<'))
      var episodeNumber = tvInfo.slice(tvInfo.indexOf('Episode ') + 8, tvInfo.length)

      season = parseInt(season)
      episodeNumber = parseInt(episodeNumber)

      $.ajax({
        url: 'https://tv-v2.api-fetch.website/show/' + imdbID,
        context: document.body
      }).done(function(data) {
        if (data && data.episodes){
          data.episodes.forEach(function(episode) {
            if (episode.season === season && episode.episode === episodeNumber && episode.torrents) {
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
