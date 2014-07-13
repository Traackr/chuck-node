/**
 * routes.js
 * Traackr: chuck node
 * https://bitbucket.com/traackr/chuck-node
 *
 * Copyright (c) 2013 Traackr
 * Developed By: Paul Kist paul@traackr.com
 *
 * ExpressJs Routes Setup
 */
$(document).ready(function() {

  // Bind Like / Dislike
  $(".up").bind('click', handleLike);
  $(".down").bind('click', handleDislike);

  // Setup custom tag inputs
  $('#tags').tagsInput({
    'height': '60px',
    'width': '280px'
  });

  // Rating Handlers
  function handleLike(e) {
    rate('likes');
    disable();
  }

  function handleDislike(e) {
    rate('dislikes');
    disable();
  }

  function disable() {
    $(".up").off('click')
    $(".down").off('click')
  }
  /**
   * Rate Function makes an AJAX POST call to the Chuck-Node API
   */
  function rate(rateType) {
    $.post('/api/1/facts/' + $(".up").attr('data-id') + "/rate", {
      rateType: rateType
    }, function(data) {
      $("#" + rateType).text(parseInt($("#" + rateType).text()) + 1)
      $("#score").text(parseInt($("#likes").text()) - parseInt($("#dislikes").text()))
      window.location = '/';
    });
  }
});