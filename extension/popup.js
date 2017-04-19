$(function () {
  $('.connectButton').click(function () {
    $('.instruction1').text('connecting...');
    chrome.extension.sendRequest({
      function: 'connect'
    })
    setTimeout(function() {
      chrome.extension.sendRequest({
        function: 'checkConnection'
      })
    }, 500)
  })

  chrome.extension.sendRequest({
    function: 'checkConnection'
  })

  chrome.extension.onRequest.addListener(function (msg, sender, respond) {
    if (msg.response) {
      switch(msg.function) {
        case 'connect':
          chrome.extension.sendRequest({
            function: 'checkConnection'
          });
          break
        case 'checkConnection':
          if (msg.connected) {
            $('.instruction1').text('connected');
          } else {
            $('.instruction1').text('Looks like your not connected, start the popcornIMDB server and press connect');
          }
          break
        default:
            break
      };
    }
  });

});
