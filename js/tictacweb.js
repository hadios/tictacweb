$(document).ready(function() {
  main();
});


function main() {
  var INTERVAL_ID;

  var maxHeight;
  var maxWidth;

  var boxSizeX;
  var boxSizeY;

  var circleImg = new Image();
  var crossImg = new Image();

  var floor = [0, 0, 0, 0, 0, 0, 0, 0, 0];
  var markCount = 0;
  var win = false;
  var winner = false;

  function init() {
    var canvas = document.getElementById('canvas');

    maxHeight = canvas.width;
    maxWidth = canvas.height;

    boxSizeX = maxHeight / 3;
    boxSizeY = maxWidth / 3;

    // console.log("Width: " + maxWidth);
    // console.log("Height: " + maxHeight);
    //
    // console.log("Box width: " + boxSizeX);
    // console.log("Box height: " + boxSizeY);
    // Prepare

    $('#canvas').click(function(e) {
      if (win) {
        return;
      }

      var boxIndex = detectInput(e, canvas);
      var playerMark = updateGrid(boxIndex);

      win = checkWin();
      if (win) {
        winner = true;
        showResult();
        return;
      }

      if (playerMark && markCount < 9) {
        aiTurns();
        win = checkWin();

        if (win) {
          showResult();
        }
      }
    });

    $('#restart').click(function(e) {
      resetGame();
    });

    var isAiTurn = randomNumberInRange(0, 1) % 2 == 0 ? true : false;

    if (isAiTurn) {
      aiTurns();
    }
  }

  function detectInput(e, canvas) {
    var x = e.clientX;
    var y = e.clientY;

    var pointX = x - canvas.getBoundingClientRect().left;
    var pointY = y - canvas.getBoundingClientRect().top;

    var row = Math.floor(pointY / boxSizeY);
    var col = Math.floor(pointX / boxSizeX);

    var boxIndex = row * 3 + col;
    return boxIndex;
  }

  function updateGrid(boxIndex) {
    if (floor[boxIndex] != 0) {
      return false;
    }

    floor[boxIndex] = 1;
    markCount++;

    return true;
  }

  function randomNumberInRange(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  function aiTurns() {
    // Randomly choosing tiles
    var min = 0;
    var max = 8;
    var chosenIndex;

    do {
      chosenIndex = randomNumberInRange(min, max);
    } while (floor[chosenIndex] != 0);

    floor[chosenIndex] = 2;
    markCount++;
  }

  function checkWin() {
    // Check for horizontal
    for (var i = 0; i < 3; i++) {
      var win = floor[i * 3];

      for (var j = 1; j < 3; j++) {
        if (win != floor[i * 3 + j]) {
          win = -1;
        }
      }

      if (win > 0) {
        return true;
      }
    }

    // Check for vertical
    for (var i = 0; i < 3; i++) {
      var win = floor[i];

      for (var j = 1; j < 3; j++) {
        if (win != floor[j * 3 + i]) {
          win = -1;
        }
      }

      if (win > 0) {
        return true;
      }
    }

    // Check for diagonal
    if (floor[0] > 0 && floor[0] == floor[4] && floor[0] == floor[8]) {
      return true;
    }

    if (floor[2] > 0 && floor[2] == floor[4] && floor[2] == floor[6]) {
      return true;
    }

    return false;
  }

  function showResult() {
    if (winner) {
      $('#result').css('color', 'green');
      $('#result').text('Good job!');
    } else {
      $('#result').css('color', 'red');
      $('#result').text('Better luck next time!');
    }
  }

  function beginRender() {
    crossImg.onload = function() {
      INTERVAL_ID = setInterval(render, 10);
    }

    circleImg.src = 'img/o.png';
    crossImg.src = 'img/x.png';
  }

  function resetGame() {
    floor = [0, 0, 0, 0, 0, 0, 0, 0];
  }

  function getContext() {
    var canvas = document.getElementById('canvas');
    if (!canvas) {
      return null;
    }

    var ctx = canvas.getContext('2d');
    if (!ctx) {
      return null;
    }

    return ctx;
  }

  function drawImageInBox(ctx, imageToDraw) {
    ctx.save();
    ctx.drawImage(imageToDraw, boxSizeX * 0.1, boxSizeX * 0.1, boxSizeX * 0.8, boxSizeY * 0.8);
    ctx.restore();
  }

  function drawX(ctx) {
    drawImageInBox(ctx, crossImg);
  }

  function drawO(ctx) {
    drawImageInBox(ctx, circleImg);
  }

  function drawGrid(ctx) {
    ctx.save();

    ctx.beginPath();

    for (var i = 0; i < 2; i++) {
      ctx.moveTo((i + 1) * boxSizeX, 0);
      ctx.lineTo((i + 1) * boxSizeX, maxHeight);
    }

    for (var i = 0; i < 2; i++) {
      ctx.moveTo(0, (i + 1) * boxSizeY);
      ctx.lineTo(maxWidth, (i + 1) * boxSizeY);
    }
    ctx.stroke();

    ctx.restore();
  }

  function render() {
    var ctx = getContext();
    if (!ctx) return;

    drawGrid(ctx);

    for (var i = 0; i < 3; i++) {
      for (var j = 0; j < 3; j++) {
        var isCircle = (i + j) % 2 == 0 ? true : false;

        ctx.save();
        ctx.translate(j * boxSizeX, i * boxSizeY);

        var currentIndex = i * 3 + j;
        switch (floor[currentIndex]) {
          case 0:
            break;

          case 1:
            drawO(ctx);
            break;

          case 2:
            drawX(ctx);
            break;
        }

        ctx.restore();
      }
    }

    if (win) {
      clearInterval(INTERVAL_ID);
    }
  }

  init();
  beginRender();
}
