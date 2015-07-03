/**
 * Welcome to Pebble.js!
 *
 * This is where you write your app.
 */

var UI = require('ui');
var Vector2 = require('vector2');
var Settings = require('settings');
var ajax = require('ajax');

var key = "30d975a09156941ebb4ec1b1655969ae";
var token = Settings.data('token');

var main = new UI.Card({
  title: 'Trello Connect',
  icon: 'images/menu_icon.png',
  subtitle: 'subtitle',
  body: 'Up for tasks'
});

main.show();

var showCard = function(data) {
  var card = new UI.Card({title: data.name, body: data.desc});
  card.show();
};

var createCards = function(data) {
  var items = [];
  for (var i = 0; i < data.length; i++) {
    if (data[i].closed) {
      continue;
    }
    console.log(data[i].name);
    items.push({title: data[i].name, id: data[i].id});
  }
  var menu = new UI.Menu({
    sections: [{
      items: items 
    }]
  });
  menu.on('select', function(e) {
    console.log('The item is titled "' + e.item.title + '"' + e.item.id);
    ajax(
      {
        url: 'https://api.trello.com/1/cards/'+e.item.id+'?key=' + key + '&token=' + token,
        type: 'json'
      },
      function(data, status, request) {
        showCard(data);
      },
      function(error, status, request) {
        console.log('The ajax request failed: ' + error);
      }
    );
  });
  menu.show();
};


var createLists = function(data) {
  var items = [];
  for (var i = 0; i < data.length; i++) {
    if (data[i].closed) {
      continue;
    }
    console.log(data[i].name);
    items.push({title: data[i].name, id: data[i].id});
  }
  var menu = new UI.Menu({
    highlightBackgroundColor: data.backgroundColor,
    sections: [{
      items: items 
    }]
  });
  menu.on('select', function(e) {
    console.log('The item is titled "' + e.item.title + '"' + e.item.id);
    ajax(
      {
        url: 'https://api.trello.com/1/lists/'+e.item.id+'/cards?key=' + key + '&token=' + token,
        type: 'json'
      },
      function(data, status, request) {
        createCards(data);
      },
      function(error, status, request) {
        console.log('The ajax request failed: ' + error);
      }
    );
  });
  menu.show();
};


var createBoards = function(data) {
  var items = [];
  for (var i = 0; i < data.length; i++) {
    if (data[i].closed) {
      continue;
    }
    console.log(data[i].name);
    items.push({title: data[i].name, id: data[i].id, backgroundColor: data[i].backgroundColor});
  }
  var menu = new UI.Menu({
    sections: [{
      items: items 
    }]
  });
  menu.on('select', function(e) {
    console.log('The item is titled "' + e.item.title + '"' + e.item.id);
    ajax(
      {
        url: 'https://api.trello.com/1/boards/'+e.item.id+'/lists?key=' + key + '&token=' + token,
        type: 'json'
      },
      function(data, status, request) {
        createLists(data);
      },
      function(error, status, request) {
        console.log('The ajax request failed: ' + error);
      }
    );
  });
  menu.show();
};

main.on('click', 'up', function(e) {
  ajax(
    {
      url: 'https://api.trello.com/1/members/me/boards?key=' + key + '&token=' + token,
      type: 'json'
    },
    function(data, status, request) {
      createBoards(data);
    },
    function(error, status, request) {
      console.log('The ajax request failed: ' + error);
    }
  );
});

main.on('click', 'select', function(e) {
  var wind = new UI.Window({
    fullscreen: true,
  });
  var textfield = new UI.Text({
    position: new Vector2(0, 65),
    size: new Vector2(144, 30),
    font: 'gothic-24-bold',
    text: 'Text Anywhere!',
    textAlign: 'center'
  });
  wind.add(textfield);
  wind.show();
});

main.on('click', 'down', function(e) {
  var card = new UI.Card();
  card.title('A Card');
  card.subtitle('Is a Window');
  card.body('The simplest window type in Pebble.js.');
  card.show();
});

Settings.config(
  { url: 'https://trello.com/1/authorize?response_type=token&key=' + key + '&return_url=pebblejs%3A%2F%2Fclose' },
  function(e) {
    Settings.data(e.options);
    token = Settings.data('token');
  }
);