var socket = io();
var params;
socket.on('connect', function () {
  console.log('Connected to server');
  params = jQuery.deparam(window.location.search);
  console.log(params)
  socket.emit('join', params, function (err) {
    if(err) {
      alert('Name and Room are required');
      window.location.href = '/';
    } else {

    }
  });
});

function scrollToBottom() {
    var messages = jQuery('#messages');
    var newMessage  = messages.children('li:last-child');

    var clientHeight = messages.prop('clientHeight');
    var scrollTop = messages.prop('scrollTop');
    var scrollHeight = messages.prop('scrollHeight');
    var newmessageHeight = newMessage.innerHeight();
    var lastmessageHeight = newMessage.prev().innerHeight();

    if(clientHeight + scrollTop + newmessageHeight + lastmessageHeight >= scrollHeight) {
      messages.scrollTop(scrollHeight);
    }
}

socket.on('disconnect', function () {
  console.log('Disconnected from server');
});

socket.on('updateUserList', function (userlist) {
  console.log(userlist);
  var ol = jQuery('<ol></ol>');
  userlist.forEach(function (user) {
    ol.append(jQuery('<li></li>').text(user));
  });
  jQuery('#users').html(ol);
});

socket.on('newMessage', function (message) {
  var formattedTime = moment(message.createdAt).format('h:mm a');
  var template = jQuery('#message-template').html();
  var html = Mustache.render(template, {
    text: message.text,
    from: message.from,
    createdAt: formattedTime
  });

  jQuery('#messages').append(html);
  scrollToBottom();
});

socket.on('newLocationMessage', function (message) {
  var formattedTime = moment(message.createdAt).format('h:mm a');
  var template = jQuery('#location-message-template').html();
  var html = Mustache.render(template, {
    from: message.from,
    url: message.url,
    createdAt: formattedTime
  });

  jQuery('#messages').append(html);
  scrollToBottom();
});

jQuery('#message-form').on('submit', function (e) {
  e.preventDefault();

  var messageTextbox = jQuery('[name=message]');

  socket.emit('createMessage', {
    from: params.name,
    text: messageTextbox.val()
  }, function () {
    messageTextbox.val('')
  });
});

var locationButton = jQuery('#send-location');
locationButton.on('click', function () {
  if (!navigator.geolocation) {
    return alert('Geolocation not supported by your browser.');
  }

  locationButton.attr('disabled', 'disabled').text('Sending location...');

  navigator.geolocation.getCurrentPosition(function (position) {
    locationButton.removeAttr('disabled').text('Send location');
    socket.emit('createLocationMessage', {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude
    });
  }, function () {
    locationButton.removeAttr('disabled').text('Send location');
    alert('Unable to fetch location.');
  });
});
