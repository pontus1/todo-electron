const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const url = require('url');

let mainWindow;

function createWindow() {

    mainWindow = new BrowserWindow({
        width: 800,
        height: 600
    });

    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'index.html'),
        protocol: 'file:',
        slashes: true
    }));

    // mainWindow.webContents.openDevTools();  // Open the DevTools.

    /* IPC */
    ipcMain.on('request-add-todo', (event, todo) => {
        mainWindow.webContents.send('add-new-todo', todo);
    });

    ipcMain.on('show-empty-input-dialog', (e) => {
        dialog.showErrorBox("Oops!", 'Did you forget the title?');
    });

    mainWindow.on('closed', () => {
        mainWindow = null
    });
}

app.on('ready', createWindow);

/* Quit when all windows are closed */
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (mainWindow === null) {
        createWindow();
    }
});
