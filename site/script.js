const socket = io.connect("127.0.0.1:3000");

socket.on("connect", () => {
	console.log("Connected!");
});


// Variables
var sendStats = new Object();
var sendStats = {
	started: false,
	timer: false,
	timer_sec: 0,
	timer_mins: 0
};

// Sockets
socket.on("sending_done", (data) => {
	document.getElementById('send_statsp').innerHTML = 'Отправка: <i>выполнена</i>';
	clearInterval(sendStats.timer);
	sendStats.timer_sec = 0;
	sendStats.timer_mins = 0;
	sendStats.started = false;

	var statsp = document.getElementById('send_statsp');
	var timep = document.getElementById('send_time');
})

// Methods
function startSend(){
	var sender_name = document.getElementById('sender_name_input').value;
	var sender_pass = document.getElementById('sender_pass_input').value;
	var send_addrs = document.getElementById('adrrs_input').value;
	var send_text = document.getElementById('text_input').value;
	var statsp = document.getElementById('send_statsp');
	var timep = document.getElementById('send_time');

	if (sendStats.started == false){
		if (sender_name == "" || sender_pass == "" || send_addrs == "" || send_text == ""){
			statsp.innerHTML = 'Отправка: <i>Не заполнены некоторые поля</i>';

		} else if (sender_name != "" || sender_pass != "" || send_addrs != "" || send_text != ""){
			socket.emit('start_sending', {account: [sender_name, sender_pass], addrs: send_addrs.split(','), text: send_text});

			// Start timer
			timep.innerHTML = `Время: <i>0:0:0</i>`;
			sendStats.timer = setInterval(() => {
				sendStats.timer_sec += 1;

				if (sendStats.timer_sec == 60){
					sendStats.timer_sec = 0;
					sendStats.timer_mins += 1;

					if (sendStats.timer_mins < 10){
						timep.innerHTML = `Время: <i>0:0${sendStats.timer_sec}:0</i>`;
					} else {
						timep.innerHTML = `Время: <i>0:${sendStats.timer_sec}:0</i>`;
					}

				} else if (sendStats.timer_sec < 60){
					timep.innerHTML = `Время: <i>0:${sendStats.timer_mins}:${sendStats.timer_sec}</i>`;
				}

			}, 1000);
			statsp.innerHTML = 'Отправка: <i>начата</i>';
			sendStats.started = true;
		}

	} else if (sendStats.started == true){
		return;
	}
}

function stopSend(){
	document.getElementById('send_statsp').innerHTML = 'Отправка: <i>остановлена</i>';
	clearInterval(sendStats.timer);
	sendStats.timer_sec = 0;
	sendStats.timer_mins = 0;
	sendStats.started = false;
}