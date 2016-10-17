$(function () {
    $('form').on('submit', addTodo);
    $('.tasks').on('click', '.delete', deleteTodo);
    $('.tasks').on('click', '.complete', completeTodo);

    getTodos();
  });

// get request to get to do items from the server
function getTodos() {
  $.get('/items')
    .then(function (toDoItems) {
      console.log(toDoItems);
      appendItems(toDoItems);
    })
    .catch(function () {
      console.log('To dos were not retreived');
    });
};

// appends the information returned from the server to the DOM
function appendItems(toDoItems) {
  $('.todos').empty();
  $('.completedTodos').empty();
  toDoItems.forEach(function (item) {
    var id = item.id;
    var itemStuff = item.item;
    var complete = item.complete;

    var $itemDiv = $('<div class="itemDiv"></div>');

    // determines whether the to do item is completed or not
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

    // determines whether the to do item is completed or not
    if (complete === true) {
      $('.completedTodos').append($itemDiv);
    } else {
      $('.todos').append($itemDiv);
    }
  });
};

// funtion to add to do to the DOM
function addTodo(event) {
  event.preventDefault();
  var itemData = $(this).serialize();

  $.post('/items', itemData)
    .then(function (response) {
      getTodos();
    })
    .catch(function () {
      console.log('To do was not added');
    });

  $('input[type=text]').val('');
};

// function to delete an event from the DOM
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
        console.log('could not delete todo');
      },
    });

    $(this).closest('div').remove();

  }
}

// function to update the status of the completed item once complete is clicked
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
      console.log('To do could not be updated');
    },
  });
}
