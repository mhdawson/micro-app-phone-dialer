# micro-app-phone-dialer

Simple phone dialer for cisco phones

![sample phone-dialer page](https://raw.githubusercontent.com/mhdawson/micro-app-phone-dialer/master/pictures/phone-dialer-window.jpg)

# Usage

After installation modify ../lib/config.json to match your configuration

You need to:

1.Change "your phone IP" to be the IP address of your phone.

2.Add entries in "dialOptions" in order to match the numbers you want to dial

Each entry in dialOption can either be an entry to dial a phone number or an entry to
send a key on the phone when the button is pressed.  For entries thare are to
dial they have the the following fields:

* title - title that will show up in the button to dial the number
* line - the line to be used when dialing the number
* dial - the number that will be dialed (ex 1-555-555-5555)
* afterdial - the digits that will be send once the number is dialed.  Most often you will
  need a delay before sending the digits.  You can add commas and a delay of 1 second will
  be added for each comma.  For example if you need to dial a conference number followed by
  a moderator pin you could use somethin like ",,,,,1234567#,,,,,,*123456#"

For entries that are to send a key to the phone they have the following fields:


* title - title that will show up in the button for the key
* key - name of the key that should be sent to the phone

The list of available keys is as documented in: [cisco programming guide](http://www.cisco.com/c/en/us/td/docs/voice_ip_comm/cuipph/all_models/xsi/6_0/english/programming/guide/XSIbook.pdf)


3.Optionally modify serverPort which is the port on which the server for the micro
   app will be listening

As an example the configuration file that comes with the install is:

<PRE>
{
  "serverPort": 3000,
  "phoneIP": "your phone IP",
  "dialOptions": [
                   { "title": "My Conference Number", "line": 1, "dial": "1-555-555-5555", "afterdial": ",,,,,1234567#,,,,,,*123456#" },
                   { "title": "Canada Conference Number", "line": 1, "dial": "1-555-555-5555" },
                   { "title": "General Conference Number", "line": 1, "dial": "1-555-555-5555" },
                   { "title": "HANG UP", "key": "speaker" },
                   { "title": "MUTE", "key": "mute" }
                 ]
}
</PRE>

#Running

To run the phone-dialer, add node.js to your path (currently requires 4.x or better) and
then run:

<PRE>
npm start
</PRE>

From the directory in which the micro-app-phone-dialer was installed.

Once the server is started. Point your browser at the host/port for the server.
If you have configured your browswer to allow javascript to close the current page
the original window will be closed and one with the correct size of the phone-dialer
will be created.

To dial any of the configured entries, simply click the button for that entry.

To dial additional digits, type those digits into the input box and hit the
SEND button beside the input box.

#Example

The following is the page shown for my configuration:

![sample phone-dialer page](https://raw.githubusercontent.com/mhdawson/micro-app-phone-dialer/master/pictures/phone-dialer-window.jpg)

# Phones tested

* Cisco SPA504G

#Key Depdencies

## micro-app-framework
As a micro-app the phone-dialer depends on the micro-app-framework:

* [micro-app-framework npm](https://www.npmjs.com/package/micro-app-framework)
* [micro-app-framework github](https://github.com/mhdawson/micro-app-framework)

See the documentation on the micro-app-framework for more information on general
configurtion options that are availble (ex using tls, authentication, serverPort, etc)

## node-cti

Used to send commands to the phone

* [node-cti npm](https://www.npmjs.com/package/node-cti)
* [node-cti github](https://github.com/mhdawson/node-cti)

# TODO

* Add more documentation
* Better support for multiple lines
* nicer page layout
