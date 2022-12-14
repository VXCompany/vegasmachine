var inner = document.getElementById("inner"),
  spin = document.getElementById("spin"),
  data = document.getElementById("data"),
  mask = document.getElementById("mask"),
  competitors = Array.from(document.querySelectorAll(".competitors li input")),
  maskDefault = "Place Your Bets",
  timer = 9000,
  confettiDuration = 4000;
winnerDurationMessage = 8000;

var red = [32, 19, 21, 25, 34, 27, 36, 30, 23, 5, 16, 1, 14, 9, 18, 7, 12, 3];

mask.innerHTML = maskDefault;

spin.onclick = function () {
  spinWheel();
};

function getWinningPlayer() {
  var spelers = competitors.filter((x) => x.value.length > 0);

  if (!spelers.length) {
    return null;
  }

  var random = Math.floor(Math.random() * spelers.length);
  return spelers[random];
}

function spinWheel() {
  inner.setAttribute("data-spinto", "");
  mask.innerHTML = "No More Bets";

  // Get the winning player
  const winningPlayer = getWinningPlayer();
  var numberOfWinningPlayer = null;
  if (winningPlayer) {
    numberOfWinningPlayer = parseInt(
      winningPlayer.attributes["data-value"].value
    );
  } else {
    numberOfWinningPlayer = Math.floor(Math.random() * 36);
  }

  setTimeout(() => {
    inner.setAttribute("data-spinto", numberOfWinningPlayer);
  }, 0);

  spin.classList.add("disabled");
  spin.disabled = true;

  // remove the disabled attribute when the ball has stopped
  setTimeout(function () {
    spin.classList.remove("disabled");
    spin.disabled = false;

    color = null;
    if (red.includes(numberOfWinningPlayer)) {
      color = "red";
    } else {
      color = "black";
    }
    if (numberOfWinningPlayer == 0) {
      color = "green";
    }

    document.querySelectorAll(".result-number").innerHTML =
      numberOfWinningPlayer;
    document.querySelectorAll(".result-color").innerHTML = color;
    document.querySelectorAll(".result")[0].style.backgroundColor = color;

    data.classList.add("reveal");
    inner.classList.add("rest");

    let thisResult = document.createElement("li");
    thisResult.classList.add("previous-result");
    thisResult.classList.add(`color-${color}`);
    let thisResultName = document.createElement("span");
    thisResultName.classList.add("previous-number");
    thisResultName.innerHTML = numberOfWinningPlayer;
    thisResult.appendChild(thisResultName);
    let thisResultColor = document.createElement("span");
    thisResultColor.classList.add("previous-color");
    thisResultColor.innerHTML = color;
    thisResult.appendChild(thisResultColor);
    console.log(thisResult);

    window.confettiful = new Confettiful(document.querySelector("body"));
    document.querySelectorAll(".previous-list")[0].prepend(thisResult);
    if (winningPlayer) {
      mask.innerHTML = `The winner is ${winningPlayer.value}`;
    } else {
      mask.innerHTML = `The winning number: ${numberOfWinningPlayer}`;
    }

    // we can enable here
    data.classList.remove("reveal");
    inner.classList.remove("rest");

    //After 8 seconds, set the text back to the default
    setTimeout(() => {
      mask.innerHTML = maskDefault;
    }, winnerDurationMessage);
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
}

connection.onclose(async () => {
  await start();
});

// Start the connection.
connection.start();

connection.on("Spin", (message) => {
  spinWheel();
});

/** Methods for the confetti */
const Confettiful = function (el) {
  this.el = el;
  this.containerEl = null;

  this.confettiFrequency = 100;
  this.confettiColors = ["#fce18a", "#ff726d", "#b48def", "#f4306d"];
  this.confettiAnimations = ["slow", "medium", "fast"];

  this._setupElements();
  this._renderConfetti();
};

Confettiful.prototype._setupElements = function () {
  const containerEl = document.createElement("confetti-element");
  const elPosition = this.el.style.position;

  if (elPosition !== "relative" || elPosition !== "absolute") {
    this.el.style.position = "relative";
  }

  containerEl.classList.add("confetti-container");

  this.el.appendChild(containerEl);

  this.containerEl = containerEl;

  setTimeout(() => {
    containerEl.remove();
  }, confettiDuration);
};

Confettiful.prototype._renderConfetti = function () {
  this.confettiInterval = setInterval(() => {
    const confettiEl = document.createElement("confetti-element");
    const confettiSize = Math.floor(Math.random() * 5) + 7 + "px";
    const confettiBackground =
      this.confettiColors[
        Math.floor(Math.random() * this.confettiColors.length)
      ];
    const confettiLeft = Math.floor(Math.random() * this.el.offsetWidth) + "px";
    const confettiAnimation =
      this.confettiAnimations[
        Math.floor(Math.random() * this.confettiAnimations.length)
      ];

    confettiEl.classList.add(
      "confetti",
      "confetti--animation-" + confettiAnimation
    );
    confettiEl.style.left = confettiLeft;
    confettiEl.style.width = confettiSize;
    confettiEl.style.height = confettiSize;
    confettiEl.style.backgroundColor = confettiBackground;

    this.containerEl.appendChild(confettiEl);
  }, 10);
};
