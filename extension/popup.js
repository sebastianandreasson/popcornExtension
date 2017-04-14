$(function () {
    console.log('popup onload');
    var connected = false;
    
    $('.connectButton').click(function () {
        console.log('clicked');
        if (!connected){
            chrome.extension.sendRequest({
                "function": "connect"
            });
        }
        else{
            alert('you are connected');
        }
    });
    
    chrome.extension.sendRequest({
        "function": "checkConnection"
    });
    
    chrome.extension.onRequest.addListener(function (msg, sender, respond) {
        if (msg.response){
            switch(msg.function) {
                case 'connect':
                    chrome.extension.sendRequest({
                        "function": "checkConnection"
                    });
                    break;
                case 'checkConnection':
                    if (msg.connected){
                        $('.instruction1').text('connected!');
                        connected = true;
                    }
                    else{
                        $('.instruction1').text('Looks like your not connected, start the popcornIMDB server and press connect');
                        connected = false;
                    }
                    break;
                default:
                    break;
            };
        }
    });
    
});