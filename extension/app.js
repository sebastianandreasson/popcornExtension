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
          var torrents = json.data.movies[0].torrents.map(function(torrent) {
            var slug = torrent.slug
            torrent.magnetURL = 'magnet:?xt=urn:btih:' + torrent.hash + '&dn=' + slug + '&tr=http://track.one:1234/announce&tr=udp://track.two:80'
            return torrent
          }).reverse()
          addButton(torrents)
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
              var torrents = Object.keys(episode.torrents).map(function(key) {
                return {
                  quality: key,
                  magnetURL: episode.torrents[key].url
                }
              }).reverse()
              addButton(torrents)
            }
          })
        }
      })
    }

    function addButton(torrents){
      var magnetURL = torrents[0].magnetURL
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

      $('.title_wrapper').css('padding-bottom', '40px');
      $('.title_wrapper').css('position', 'relative');

      var select = $('<select/>', {
        id: 'qualitySelect',
      })
      torrents.forEach(function(torrent) {
       select.append(
         $("<option>")
         .attr('value', torrent.magnetURL)
         .text(torrent.quality)
       )
      })
      select.css('position', 'absolute')
      select.css('right', '0')
      select.css('margin-top', '25px')

      select.appendTo('.title_wrapper')

      $('#qualitySelect').on('change', function(event) {
        magnetURL = event.target.value
      })

      $('#watchButton').click(function () {
        chrome.extension.sendRequest({
          function: 'torrent',
          magnet: magnetURL
        })
      })
    }
})
