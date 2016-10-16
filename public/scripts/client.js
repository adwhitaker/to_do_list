$(function () {
    $('form').on('submit', addTodo);
    $('.tasks').on('click', '.delete', deleteTodo);
    $('.tasks').on('click', '.complete', completeTodo);

    getTodos();
  });

function getTodos() {
  $.get('/items')
    .then(function (toDoItems) {
      console.log(toDoItems);
      appendItems(toDoItems);
    })
    .catch(function () {
      console.log('no todos');
    });
};

function appendItems(toDoItems) {
  $('.todos').empty();
  $('.completedTodos').empty();
  toDoItems.forEach(function (item) {
    var id = item.id;
    var itemStuff = item.item;
    var complete = item.complete;

    var $itemDiv = $('<div class="itemDiv"></div>');

    if (complete === true) {
      var $completeButton = $('<button class="complete">Try Again?</button>');
      $completeButton.data({ id: id, complete: complete });
      $itemDiv.append($completeButton);
      $itemDiv.append('<p class="completeTask">' + itemStuff + '</p>');
    } else {
      var $completeButton = $('<button class="complete">COMPLETE</button>');
      $completeButton.data({ id: id, complete: complete });
      $itemDiv.append($completeButton);
      $itemDiv.append('<p>' + itemStuff + '</p>');
    }

    var $deleteButton = $('<button class="delete">DELETE</button>');
    $deleteButton.data('id', id);
    $itemDiv.append($deleteButton);

    if (complete === true) {
      $('.completedTodos').append($itemDiv);
    } else {
      $('.todos').append($itemDiv);
    }
  });
};

function addTodo(event) {
  event.preventDefault();
  var itemData = $(this).serialize();

  $.post('/items', itemData)
    .then(function (response) {
      getTodos();
    })
    .catch(function () {
      console.log('no todos');
    });

  $('input[type=text]').val('');
};

function deleteTodo() {
  var areYouSure = confirm('Are you sure you want to delete this task?');
  if (areYouSure === false) {
    return;
  } else {
    var id = $(this).data('id');

    $.ajax({
      type: 'DELETE',
      url: '/items/' + id,
      success: function () {
      },

      error: function () {
        console.log('no todos');
      },
    });

    $(this).closest('div').remove();

  }
}

function completeTodo() {
  var id = $(this).data('id');
  var complete = $(this).data('complete');

  if (complete === true) {
    complete = false;
  } else {
    complete = true;
  }

  completeData = { complete: complete };

  $.ajax({
    type: 'PUT',
    url: '/items/' + id,
    data: completeData,
    success: getTodos,
    error: function () {
      console.log('no todos');
    },
  });
}
