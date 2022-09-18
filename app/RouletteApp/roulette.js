
var $inner = $('.inner'),
    $spin = $('#spin'),
    $data = $('.data'),
    $mask = $('.mask'),
    competitors = Array.from(document.querySelectorAll(".competitors li input")),
    maskDefault = 'Place Your Bets',
    timer = 9000;

var red = [32, 19, 21, 25, 34, 27, 36, 30, 23, 5, 16, 1, 14, 9, 18, 7, 12, 3];

$mask.text(maskDefault);

$spin.on('click', function () {
    spinWheel();
});

function getWinningPlayer() {
    var spelers = competitors.filter((x) => x.value.length > 0);
   
    if (!spelers.length) {
        return null;
    }

    var random = Math.floor(Math.random() * spelers.length);
    return spelers[random];
}

function spinWheel() {
    $inner.attr('data-spinto', '');
    $mask.text('No More Bets');

    // Get the winning player
    const winningPlayer = getWinningPlayer();
    var numberOfWinningPlayer = null;
    if(winningPlayer){
        numberOfWinningPlayer = winningPlayer.attributes['data-value'].value;
    } else {
        numberOfWinningPlayer = Math.floor(Math.random() * 36);
    }
    

    setTimeout(() => {
        $inner.attr('data-spinto',numberOfWinningPlayer );
    }, 0);
    
    $spin.addClass('disabled').prop('disabled', true);

    $('.placeholder').remove();

    // remove the disabled attribute when the ball has stopped
    setTimeout(function () {
        $spin.removeClass('disabled').prop('disabled', false);
        color = null;
        if ($.inArray(numberOfWinningPlayer, red) !== -1) { color = 'red' } else { color = 'black' };
        if (numberOfWinningPlayer == 0) { color = 'green' };

        $('.result-number').text(numberOfWinningPlayer);
        $('.result-color').text(color);
        $('.result').css({ 'background-color': '' + color + '' });
        $data.addClass('reveal');
        $inner.addClass('rest');

        $thisResult = '<li class="previous-result color-' + color + '"><span class="previous-number">' + numberOfWinningPlayer + '</span><span class="previous-color">' + color + '</span></li>';

        $('.previous-list').prepend($thisResult);
        if(winningPlayer){
            $mask.text(`The winner is ${winningPlayer.value}`);
        } else {
            $mask.text(`The winning number: ${numberOfWinningPlayer}`);
        }
        

        // we can enable here
        $data.removeClass('reveal');
        $inner.removeClass('rest');

        //After 8 seconds, set the text back to the default
        setTimeout(() => {
            $mask.text(maskDefault);
        }, 8000);

    }, timer);


}

const connection = new signalR.HubConnectionBuilder()
    .withUrl("http://localhost:8080/vegasmachine")
    .configureLogging(signalR.LogLevel.Information)
    .build();

async function start() {
    try {
        await connection.start();
        console.log("SignalR Connected.");
    } catch (err) {
        console.log(err);
        setTimeout(start, 5000);
    }
};

connection.onclose(async () => {
    await start();
});

// Start the connection.
connection.start()

connection.on("Spin", (message) => {
    spinWheel();
});



