var mqtt = require('mqtt')
var client  = mqtt.connect('mqtt://localhost')

var doorOpen = false;
 
client.on('connect', function () {
  client.subscribe('zigbee2mqtt/door_sensor');
})
 
client.on('message', function (topic, message) {
  var message_json;
  try {
    message_json = JSON.parse(message.toString());
  }
  catch (e) {
    console.log('Unable to parse message: '+ message.toString());
  }

  if (topic === 'zigbee2mqtt/door_sensor') {
    doorOpen = !message_json.contact;

    setLightsAccordingToDoorStatus();

    // Do it again for the next 5 seconds in case the Peanut plugs didn't respond after
    // a quick door close/open the first time
    for (let i = 1; i < 5; i++) {
      setTimeout(setLightsAccordingToDoorStatus, i * 1000);
    }
  }
})

function setLightsAccordingToDoorStatus() {
    client.publish('zigbee2mqtt/lamps/set', JSON.stringify({state: doorOpen ? 'ON' : 'OFF'}));
}
