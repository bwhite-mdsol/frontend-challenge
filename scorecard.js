function Game() {
  this.frames = [];

  for (i=0; i<10; i++) {
    this.frames[i] = { roll1: null, roll2: null}
  }
  this.frames[9].roll3 = null;
}

var $modal = $('#scoring');
var $scoreCell = null;
var $scoreRow = null;
var $scoreCol = null;
var games = [new Game(), new Game(), new Game(), new Game()];

// complete HTML, hook score boxes on load
$(function() {
  // dup score boxes html
  var frames = $('tr.player td.frame');
  var scoreboxes = $(frames[0]).html();
  for (f=1; f<9; f++) {
    $(frames[f]).html(scoreboxes)
  }

  // dup player rows html
  for (r=2; r<5; r++) {
    var last_row = $('.scorecard tr:last');
    var next_row = $(last_row).clone(true);
    last_row.after(next_row.attr('id', r));
  }

  // Enter scores hook
  $('.score_box').click(function(){
    var $td = $(this).closest('td');
    var $tr = $td.parent();
    $scoreCol = $tr.children().index($td);
    $scoreRow = $tr.parent().children().index($tr);

    openModal($(this));
  });
});

function resetScore() {
  $('.score_entry span').removeClass('selected');
}

function openModal(cell) {
  resetScore();
  $modal.css('display', 'block');
  $('#submit').attr('disabled', true);
  $scoreCell = $(cell);
}

function resetModal() {
  $modal.css('display', 'none');
}

function keepScore(player, frame, roll, mark) {
  if (mark == 'X') {
    score = 10;
  } else if (mark == '/') {
    score = 10 - games[player].frames[frame].roll1;
  } else {
    score = parseInt(mark);
  }
  games[player].frames[frame][roll] = score;

  var playerRow = $('.player')[player];
  var $cells = $(playerRow).find('.frame');
  var cum = 0;
  for (i=0;i<10;i++) {
    var thisScore = frameScore(games[player], i);
    if (null != thisScore) {
      cum += thisScore;
      $($cells[i]).find('span').text(''+cum);
    }
  }
  $(playerRow).find('.score').text(''+cum);
}

// Enter player names
$('td.name').click(function() {
  var n = window.prompt('Enter player name', $(this).html());
  if (null != n) {
    $(this).html(n);
  }
});

// select score for frame
$('.score_entry span').click(function() {
  resetScore();
  $(this).addClass('selected');
  $('#submit').attr('disabled', false);
});

$('#submit').click(function(){
  var score = $('.score_entry span.selected').text();
  var roll = 'roll' + $scoreCell.attr('class').slice(-1);

  // show score in cell
  $scoreCell.text(score);
  //dismiss modal
  resetModal();

  // keep score
  keepScore($scoreRow - 1, $scoreCol - 1, roll, score);
});

// cancel score entry
$('#cancel').click(function(){
  resetModal();
});

// dismiss on outside click
$('.modal').click(function(){
  resetModal();
});

$('.modal .modal-content').click(function(e){
  e.stopPropagation();
});
