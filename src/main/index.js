import { app, BrowserWindow, Menu } from 'electron';
import path from 'path';

let mainWindow;

function createMainWindow() {
	const window = new BrowserWindow({
		titleBarStyle: 'hidden',
		width: 1200,
		height: 800,
		minWidth: 800,
		minHeight: 600,
		resizable: true,
		icon: path.join(__dirname, 'assets/64x64.png'),
		webPreferences: {
			nodeIntegration: false
		}
	});

	window.loadURL('http://cosynk.com/');
	window.setMenu(null);
	window.webContents.on('did-finish-load', function() {
		window.webContents.insertCSS(
			'.App-header{-webkit-app-region:drag;-webkit-user-select: none;}'
		);
	});
	window.on('closed', () => {
		mainWindow = null;
	});

	const template = [
		{
			label: 'Cosynk',
			submenu: [
				{
					label: 'Exit',
					click() {
						app.quit();
					}
				}
			]
		},
		{
			label: 'View',
			submenu: [{ role: 'reload' }, { role: 'togglefullscreen' }]
		},
		{ label: 'Window', submenu: [{ role: 'minimize' }, { role: 'close' }] },
		{
			label: 'Help',
			submenu: [
				{
					label: "Cosynk's website",
					click() {
						require('electron').shell.openExternal('http://cosynk.com/');
					}
				}
			]
		}
	];
	const menu = Menu.buildFromTemplate(template);
	Menu.setApplicationMenu(menu);

	if (process.env.NODE_ENV !== 'production') {
		window.webContents.openDevTools();
	}

	window.webContents.on('devtools-opened', () => {
		window.focus();
		setImmediate(() => {
			window.focus();
		});
	});

	return window;
}

app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') {
		app.quit();
	}
});

app.on('activate', () => {
	if (mainWindow === null) {
		mainWindow = createMainWindow();
	}
});

app.on('ready', () => {
	mainWindow = createMainWindow();
});
