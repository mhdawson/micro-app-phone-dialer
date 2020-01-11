// Copyright 2014-2015 the project authors as listed in the AUTHORS file.
// All rights reserved. Use of this source code is governed by the
// license that can be found in the LICENSE file.

var socketio = require('socket.io');
var nodecti = require('node-cti');

const HEIGHT_PER_ENTRY = 30;
const PAGE_WIDTH = 300;
var dialerOptions = new Array();

var Server = function() {
}

Server.getDefaults = function() {
  return { 'title': 'Phone Dialer' };
}

Server.getTemplateReplacments = function() {
  // setup the dialer entries
  var height = 0;
  for (i = 0; i < Server.config.dialOptions.length; i++) {
    var phone_request = 'dial_request';
    if (Server.config.dialOptions[i].key !== undefined) {
      phone_request = 'key_request'
    }
    dialerOptions[i] = '<tr><td colspan="2"><button style="width:100%" onclick="startRequest(\'' + phone_request + '\',' + i + ')">' + Server.config.dialOptions[i].title  + '</button></td></tr>';
    height = height + HEIGHT_PER_ENTRY;
  }
  dialerOptions[Server.config.dialOptions.length] = '<tr><td><input style="width:100%" id="digits" type="text"></td><td style="width:20%"><button style="width:100%" onclick="sendDigits()">SEND</button></td></tr>';
  dialerOptions[Server.config.dialOptions.length + 1] = '<tr><td  colspan="2" id="status">Done</td></tr>';
  height = height + 2 * HEIGHT_PER_ENTRY;

  var replacements = [{ 'key': '<TITLE>', 'value': Server.config.title },
                      { 'key': '<DIALER_OPTIONS>', 'value': dialerOptions.join("") },
                      { 'key': '<PAGE_WIDTH>', 'value': PAGE_WIDTH },
                      { 'key': '<PAGE_HEIGHT>', 'value': height }];

  return replacements;
}


Server.startServer = function(server) {
  var phoneOptions = {'hostname': Server.config.phoneIP};
  if (Server.config.basicAuth) {
    phoneOptions.basicAuth = Server.config.basicAuth;
  }
  var phone = new nodecti(phoneOptions);
  var eventSocket = socketio.listen(server);

  eventSocket.on('connection', function(client) {
    client.on('dial_request', function(event) {
      try {
        // do the dialing here
        eventSocket.emit('status', 'Dialing:' + Server.config.dialOptions[event].dial);
        var line = Server.config.dialOptions[event].line;
        if (line === undefined) {
          line = 1;
        }
        phone.line(Server.config.dialOptions[event].line, function(response) {
          if (response.statusCode === 200) {
            phone.dial(Server.config.dialOptions[event].dial, function(response) {
              if (response.statusCode === 200) {
                if (Server.config.dialOptions[event].afterdial !== undefined) {
                  eventSocket.emit('status', 'Post Dial');
                  phone.sendDigits(Server.config.dialOptions[event].afterdial, function(response) {
                    if (response.statusCode === 200) {
                      eventSocket.emit('status', 'Done');
                    } else {
                      throw(resonse.statusCode);
                    };
                  });
                } else {
                  setTimeout(() => eventSocket.emit('status', 'Done'),2000);
                }
              } else {
                throw(resonse.statusCode);
              };
            });
          } else {
            throw(resonse.statusCode);
          }
        });
      } catch (error) {
        eventSocket.emit('status', 'Error:' + error);
      }
    });

    client.on('key_request', function(event) {
      try {
        eventSocket.emit('status', 'Sending key:' + Server.config.dialOptions[event].key);
        phone.sendKey(Server.config.dialOptions[event].key, function(response) {
          if (response.statusCode === 200) {
            setTimeout(() => eventSocket.emit('status', 'Done'),1000);
          } else {
            throw(resonse.statusCode);
          }
        });
      } catch (error) {
        eventSocket.emit('status', 'Error:' + error);
      }
    });

    client.on('digits_request', function(event) {
      eventSocket.emit('status', 'Sending:' + event);
      phone.sendDigits(event, function(response) {
        if (response.statusCode === 200) {
            setTimeout(() => eventSocket.emit('status', 'Done'),1000);
        }
        else {
          eventSocket.emit('status', 'Error:' + response.statusCode);
        }
      });
    });
  });
}

if (require.main === module) {
  var path = require('path');
  var microAppFramework = require('micro-app-framework');
  microAppFramework(path.join(__dirname), Server);
}

module.exports = Server;
