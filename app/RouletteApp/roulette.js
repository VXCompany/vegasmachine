
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

function spinWheelWithWinner(winner) {
    
}

function getRandomNumber() {
    var spelers = competitors.filter((x) => x.value.length > 0).map(x => x.attributes['data-value'].value);
   
    if (!spelers.length) {
        return Math.floor(Math.random() * 34)
    } else {
        var random = Math.floor(Math.random() * spelers.length);
        return parseInt(spelers[random]);
    }
}

function spinWheel() {
    $inner.attr('data-spinto', '');

    // get a random number between 0 and 36 and apply it to the nth-child selector
    var randomNumber = getRandomNumber(),
        color = null;

    setTimeout(() => {
        $inner.attr('data-spinto', randomNumber);
    }, 0);
    
    $spin.addClass('disabled').prop('disabled', true);

    $('.placeholder').remove();

    setTimeout(function () {
        $mask.text('No More Bets');
    }, timer / 2);

    setTimeout(function () {
        $mask.text(maskDefault);
    }, timer + 500);

    // remove the disabled attribute when the ball has stopped
    setTimeout(function () {
        $spin.removeClass('disabled').prop('disabled', false);

        if ($.inArray(randomNumber, red) !== -1) { color = 'red' } else { color = 'black' };
        if (randomNumber == 0) { color = 'green' };

        $('.result-number').text(randomNumber);
        $('.result-color').text(color);
        $('.result').css({ 'background-color': '' + color + '' });
        $data.addClass('reveal');
        $inner.addClass('rest');

        $thisResult = '<li class="previous-result color-' + color + '"><span class="previous-number">' + randomNumber + '</span><span class="previous-color">' + color + '</span></li>';

        $('.previous-list').prepend($thisResult);

        // we can enable here
        $data.removeClass('reveal');
        $inner.removeClass('rest');
    }, timer);
}

/*const connection = new signalR.HubConnectionBuilder()
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
});*/

// Start the connection.
//connection.start()

/*
connection.on("Spin", (message) => {
    spinWheel();
});

connection.on("SpinWithWinner", (number) => {
    spinWheelWithWinner(number);
});
*/


