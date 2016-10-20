(function() {
  // example of use:
  // totalScore({
  //  frames: [
  //    {roll1: 5, roll2: 5},
  //    more frames...
  //    {roll1: 7, roll2: 3, roll3: 5} // possible third roll on last frame
  //  ]
  //})

  window.totalScore = function(game) {
   return [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].reduce(function (acc, i) {
      return acc + (frameScore(game, i) || 0)
    }, 0)
  }

  window.frameScore = function(game, frameNumber) {
    var frames = game.frames,
        frame = frames[frameNumber],
        i = frameNumber,
        currentScore = 0;

    // null means not filled in yet.
    if (frame.roll1 === null) {
      return null;
    }

    currentScore += (frame.roll1 || 0) + (frame.roll2 || 0);
    if (currentScore >= 10) {
      // bonus ball from next frame for strike or spare
      currentScore += (i === 9) ? frame.roll3 : frames[i+1].roll1;
    }
    return currentScore;
  }
}())
