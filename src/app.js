/**
 * Welcome to Pebble.js!
 *
 * This is where you write your app.
 */

var UI = require('ui');
var TimeAgo = require('timeago');
var Vector2 = require('vector2');
var Settings = require('settings');
var ajax = require('ajax');

var key = "30d975a09156941ebb4ec1b1655969ae";
var token = Settings.data('token');

var main = new UI.Card({
  fullscreen: true,
  title: 'Trello Connect',
  icon: 'images/menu_icon.png',
  subtitle: 'subtitle',
  body: 'Up for tasks'
});

main.show();

var showComments = function(data) {
  var comments = "";
  for (var i = 0; i < data.length; i++) {
    console.log(data[i].data.text);
    console.log(data[i].date);
    var date = new Date(data[i].date);
    comments += TimeAgo.asString(date);
    comments += "\n";
    comments += data[i].data.text;
    comments += "\n\n";
  }
  var card = new UI.Card({fullscreen: true, title: 'Comments', body: comments, scrollable: true, style:'small'});
  card.show();
};

var showCard = function(data) {
  var desc = data.desc;
  if (data.due !== null) {
    desc = data.due + "\n" + desc;
  }
  var card = new UI.Card({fullscreen: true, title: data.name, body: desc, scrollable: true, style:'small'});
  card.on('click','select', function(e) {
    var url = 'https://api.trello.com/1/card/'+data.id+'/actions?filter=commentCard&key=' + key + '&token=' + token;
    console.log(url);
    ajax(
      {
        url: url,
        type: 'json'
      },
      function(data, status, request) {
        showComments(data);
      },
      function(error, status, request) {
        console.log('The ajax request failed: ' + error);
      }
    );
  });
  card.show();
};

var createMenuList = function(data, thing, nextThing, callback) {
  var items = [];
  for (var i = 0; i < data.length; i++) {
    if (data[i].closed) {
      continue;
    }
    console.log(data[i].name);
    items.push({title: data[i].name, id: data[i].id});
  }
  var menu = new UI.Menu({
    //highlightBackgroundColor: data.backgroundColor,
    fullscreen: true, 
    sections: [{
      items: items 
    }]
  });
  menu.on('select', function(e) {
    console.log('The ' + thing + ' is titled "' + e.item.title + '" - ' + e.item.id);
    var url = 'https://api.trello.com/1/' + thing + '/'+e.item.id+'/' + nextThing +'?key=' + key + '&token=' + token;
    console.log(url);
    ajax(
      {
        url: url,
        type: 'json'
      },
      function(data, status, request) {
        callback(data);
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
      createMenuList(data, 'boards', 'lists', function(d){createMenuList(d,'lists','cards',function(e){createMenuList(e,'cards','',showCard);});});
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
new UI.Menu({
  backgroundColor: 'black',
  textColor: 'blue',
  highlightBackgroundColor: 'blue',
  highlightTextColor: 'black',
  sections: [{
    title: 'First section',
    items: [{
      title: 'First Item',
      subtitle: 'Some subtitle',
      icon: 'images/item_icon.png'
    }, {
      title: 'Second item'
    }]
  }]
}).show();
});

Settings.config(
  { url: 'https://trello.com/1/authorize?response_type=token&key=' + key + '&return_url=pebblejs%3A%2F%2Fclose' },
  function(e) {
    Settings.data(e.options);
    token = Settings.data('token');
  }
);