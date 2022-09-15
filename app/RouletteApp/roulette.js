﻿
var $inner = $('.inner'),
    $spin = $('#spin'),
    $data = $('.data'),
    $mask = $('.mask'),
    maskDefault = 'Place Your Bets',
    timer = 9000;

var red = [32,19,21,25,34,27,36,30,23,5,16,1,14,9,18,7,12,3];

$mask.text(maskDefault);

$spin.on('click',function() {
    spinWheel();
});

function spinWheelWithWinner(winner) {
    
}

function spinWheel() {

    // get a random number between 0 and 36 and apply it to the nth-child selector
    var  randomNumber = Math.floor(Math.random() * 34),
        color = null;
       
    $inner.attr('data-spinto', randomNumber).find('li:nth-child('+ randomNumber +') input').prop('checked','checked');
    // prevent repeated clicks on the spin button by hiding it
    //$(this).hide();
    $spin.addClass('disabled').prop('disabled', true);

    // disable the reset button until the ball has stopped spinning
    //$reset.addClass('disabled').prop('disabled','disabled').show();

    $('.placeholder').remove();

    setTimeout(function() {
        $mask.text('No More Bets');
    }, timer/2);

    setTimeout(function() {
        $mask.text(maskDefault);
    }, timer+500);

    // remove the disabled attribute when the ball has stopped
    setTimeout(function() {
        //$reset.removeClass('disabled').prop('disabled','');
        $spin.removeClass('disabled').prop('disabled', false);

        if($.inArray(randomNumber, red) !== -1){ color = 'red'} else { color = 'black'};
        if(randomNumber == 0){color = 'green'};

        $('.result-number').text(randomNumber);
        $('.result-color').text(color);
        $('.result').css({'background-color': ''+color+''});
        $data.addClass('reveal');
        $inner.addClass('rest');

        $thisResult = '<li class="previous-result color-'+ color +'"><span class="previous-number">'+ randomNumber +'</span><span class="previous-color">'+ color +'</span></li>';

        $('.previous-list').prepend($thisResult);

        // we can enable here
        $inner.attr('data-spinto','').removeClass('rest');
        $data.removeClass('reveal');
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

connection.on("SpinWithWinner", (number) => {
    spinWheelWithWinner(number);
});

