(function ($) {
  'use strict';

  // NAVIGABLE TABLE CLASS DEFINITION
  // ================================

  //
  var NavigableTable = function (el) {
    var $table, $body;
    var keyboardShortcutsMetakey;
    var focusableSelector = '[name]:visible,a,[contenteditable]';
    var inputSelector = '[name]:visible,[contenteditable]';

    //
    //
    //
    function initialize() {
      $table = $(el);
      $body = $table.find('tbody');

      if (window.navigator.appVersion.indexOf('Mac') !== -1) {
        keyboardShortcutsMetakey = 'metaKey';
      } else {
        keyboardShortcutsMetakey = 'altKey';
      }

      $body.on('keydown', 'tr', handleKeyDown);
    }

    // Event handlers
    // --------------

    //
    //
    //
    function handleKeyDown( event ) {
      var input = event.target;
      var shiftKeyPressed = event.shiftKey;
      var keyCode = event.keyCode;

      if (!event[keyboardShortcutsMetakey]) return;

      return navigate(input, keyCode, shiftKeyPressed);
    }


    // Methods
    // -------

    function navigate (input, keyCode, shiftKeyPressed) {
      switch (keyCode) {
        case 37: // left
          return shiftKeyPressed ? true : jump('left', input);
        case 39: // right
          return shiftKeyPressed ? true : jump('right', input);
        case 38: // up
          return shiftKeyPressed ? moveUp(input) : jump('up', input);
        case 40: // down
          return shiftKeyPressed ? moveDown(input) : jump('down', input);
        case 68: // d (duplicate)
          return shiftKeyPressed ? duplicateUp(input) : duplicateDown(input);
        case 13: // enter (insert)
          return shiftKeyPressed ? insertUp(input) : insertDown(input);
        case 8: // del
          return shiftKeyPressed ? remove(input) : true;
      }
    }

    //
    function jump(direction, input) {
      var $input = $(input);
      var $targetInput = getJumpTargetInput(direction, $input);

      // workaround for:
      // https://github.com/gr2m/minutes.io/issues/67
      var value = $input.val();
      if ($input.is('select')) {
        setTimeout(function() {
          $input.val(value);
        });
      }

      if (! $targetInput.length) {
        $input.trigger('bump', [direction]);
        $input.trigger('bump:' + direction);
        return;
      }

      $targetInput.focus().select();
      return false;
    }

    //
    // moves current row up, by moving the above row down.
    //
    function moveUp (input) {
      var $row = $(input).closest('tr');
      var $prev = $row.prev();
      var index;
      var moveRows = true;

      if ($prev.length === 0) return false;

      function cancelMove() {
        moveRows = false;
      }
      index = $row.index();
      $row.trigger('before:move', ['up', index, cancelMove]);
      $row.trigger('before:move:up', [index, cancelMove]);

      if (!moveRows) return;

      $prev.insertAfter($row);
      index -= 1;
      $row.trigger('move', ['up', index]);
      $row.trigger('move:up', [index]);

      return false;
    }

    //
    // moves current row down, by moving the below row up.
    //
    function moveDown (input) {
      var $row = $(input).closest('tr');
      var $next = $row.next();
      var index;
      var moveRows = true;

      if ($next.length === 0) return false;

      function cancelMove() {
        moveRows = false;
      }
      index = $row.index();
      $row.trigger('before:move', ['down', index, cancelMove]);
      $row.trigger('before:move:down', [index, cancelMove]);

      if (!moveRows) return;
      $next.insertBefore($row);
      index += 1;
      $row.trigger('move', ['down', index]);
      $row.trigger('move:down', [index]);

      return false;
    }

    //
    function duplicateUp (input) {
      var $row = $(input).closest('tr');
      var $newRow = $row.clone();
      passSelecectValues($row, $newRow);
      $row.before($newRow);
      $row.trigger('duplicate', ['up', $newRow]);
      $row.trigger('duplicate:up', [$newRow]);
      jump('up', input);
      return false;
    }

    //
    function duplicateDown (input) {
      var $row = $(input).closest('tr');
      var $newRow = $row.clone();
      passSelecectValues($row, $newRow);
      $row.after($newRow);
      $row.trigger('duplicate', ['down', $newRow]);
      $row.trigger('duplicate:down', [$newRow]);
      jump('down', input);
      return false;
    }

    //
    function insertUp (input) {
      var $row = $(input).closest('tr');
      var $newRow = $row.clone();
      $newRow.find(inputSelector).val('');
      $row.before($newRow);
      $row.trigger('insert', ['up', $newRow]);
      $row.trigger('insert:up', [$newRow]);
      jump('up', input);
      return false;
    }

    //
    function insertDown (input) {
      var $row = $(input).closest('tr');
      var $newRow = $row.clone();
      $newRow.find(inputSelector).val('');
      $row.after($newRow);
      $row.trigger('insert', ['down', $newRow]);
      $row.trigger('insert:down', [$newRow]);
      jump('down', input);
      return false;
    }

    //
    function remove (input) {
      var $row = $(input).closest('tr');
      var $next = $row.next();
      // if there is a next row, and it's not the last one ...
      if ($next.length && ! $next.is(':last-child')) {
        jump('down', input);
      } else {
        jump('up', input);
      }
      $row.remove();
      return false;
    }

    //
    //
    //
    function getJumpTargetInput (direction, $input) {
      if (direction === 'up' || direction === 'down') {
        return getJumpTargetRowInput(direction, $input);
      }

      return getJumpTargetColumnInput(direction, $input);
    }

    //
    function getJumpTargetRowInput (direction, $input) {
      var $cell = $input.closest('td');
      var $inputsInCell = $cell.find(focusableSelector);
      var currentInputIndex = $inputsInCell.index($input);
      var $row = $cell.parent();
      var $targetRow = (direction === 'up') ? $row.prev() : $row.next();
      var $targetCell = $targetRow.children('td,th').eq( $cell.index() );

      return $targetCell.find(focusableSelector).eq(currentInputIndex);
    }

    //
    function getJumpTargetColumnInput (direction, $input) {
      var $cell = $input.closest('td');
      var $inputsInCell = $cell.find(focusableSelector);
      var currentInputIndex;
      var $targetCell;

      // if there are more than one inputs in the current cell,
      // jump to the one on the left/right, if any
      if ( $inputsInCell.length > 1 ) {
        currentInputIndex = $inputsInCell.index($input);
        if (direction === 'left' && currentInputIndex > 0) {
          return $inputsInCell.eq( currentInputIndex - 1);
        }
        if (direction === 'right' && currentInputIndex < $inputsInCell.length - 1) {
          return $inputsInCell.eq( currentInputIndex + 1);
        }
      }

      $targetCell = (direction === 'left') ? $cell.prev() : $cell.next();
      return $targetCell.find(focusableSelector).eq(0);
    }

    //
    // when cloning a DOM element, values of <select> elements
    // do not get cloned. We do it manually with this helper
    //
    function passSelecectValues($row, $newRow) {
      var $originalSelects = $row.find('select');
      var $newSelects = $newRow.find('select');

      $originalSelects.each( function(index) {
        $newSelects.eq(index).val( this.value );
      });
    }

    initialize();
  };


  // EDITABLE TABLE PLUGIN DEFINITION
  // ================================

  $.fn.navigableTable = function () {
    return this.each(function () {
      var $this = $(this);
      var api  = $this.data('bs.navigableTable');

      if (!api) {
        $this.data('bs.navigableTable', (api = new NavigableTable(this)));
      }
    });
  };

  $.fn.navigableTable.Constructor = NavigableTable;


  // EDITABLE TABLE DATA-API
  // =======================

  $(document).on('keydown.bs.navigableTable.data-api focus.bs.navigableTable.data-api', 'table[data-navigable-spy]', function(event) {
    var $table = $(event.currentTarget);

    event.preventDefault();
    event.stopImmediatePropagation();

    $table.removeAttr('data-navigable-spy');
    $table.navigableTable();
    $(event.target).trigger($.Event(event));
  });
})(jQuery);
