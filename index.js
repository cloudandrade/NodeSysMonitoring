const app = require('express')();
const os = require('os-utils');

function uptime() {
	const minutesTime = os.sysUptime() / 60 / 60;
	const hours = Math.floor(minutesTime);
	const minutes = (minutesTime - hours) * 60;
	return `${hours}h${Math.round(minutes)}m`;
}

function platform() {
	let plataforma = os.platform();
	switch (plataforma) {
		case 'win32':
			plataforma = 'windows';
			break;
		case 'darwin':
			plataforma = 'mac-os';
			break;
		case 'linux':
			plataforma = 'linux';
			break;
		default:
			break;
	}
	return plataforma;
}

function cpuUsage() {
	return new Promise(resolve => {
		os.cpuUsage(v => {
			let cpupercent = v.toString().split('.');
			cpupercent = cpupercent[1].substring(0, 2);
			resolve(`${cpupercent}%`);
		});
	});
}

function memoryUsage() {
	let freememory = os
		.freememPercentage()
		.toString()
		.split('.');
	freememory = freememory[1].substring(0, 2);
	const memoryUsage = 100 - freememory;
	return `${memoryUsage}%`;
}

function dateTime() {
	const dateTimeNow = new Date();
	return `${dateTimeNow.getHours()}h${dateTimeNow.getMinutes()}m${dateTimeNow.getSeconds()}s`;
}

app.get('/', (req, res) => {
	res.send('Server Monitoring online');
});

app.get('/stats', async (req, res) => {
	res.send({
		plataforma: platform(),
		horaAtual: dateTime(),
		tempoAtivo: uptime(),
		cpu: await cpuUsage(),
		memoria: memoryUsage(),
	});
});

app.listen(8000, () => {
	console.log(`server monitoring running on port 8000`);
});
