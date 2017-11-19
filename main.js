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

    mainWindow.webContents.openDevTools();  // Open the DevTools.

    // IPC
    ipcMain.on('request-add-todo', (event, text) => {
        mainWindow.webContents.send('add-new-todo', text);
    });

    ipcMain.on('show-empty-input-dialog', (e) => {
        dialog.showErrorBox("Oops!", 'Did you forget the title?');
    });

    mainWindow.on('closed', () => {
        mainWindow = null
    });
}

app.on('ready', createWindow);

// Quit when all windows are closed.
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



// ipcRender.send('show-create-todo-modal') --->
// ipcMain.on('show-create-todo-modal', () => {
//     createTodoWindow.show();
// })
// ipcMain.on('request-add-todo', (event, text) => {
//     console.log('text inside main: ', text);
//     event.sender.send('add-new-todo', text);
//     secondWindow.webContents.send('add-new-todo', arg);
// });

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.


// app.on('ready', () => {
//     mainWindow = new BrowserWindow({
//         show: false,
//         useContentSize: true
//     });
//
//     mainWindow.loadURL(path.join('file://', __dirname, 'index.html'));
//
//     mainWindow.on('ready-to-show', () => {
//         mainWindow.show();
//     });
//
// });




// app.on('ready', () => {
//
//   // pass in show: false in order to let it fully
//   // render before showing anything
//   mainWindow = new BrowserWindow({
//     show: false
//   });
//
//   // load entry point
//   mainWindow.loadURL(path.join('file://', __dirname, 'index.html'));
//
//   // ready-to-show is like the DOM ready event
//   mainWindow.on('ready-to-show', () => {
//     mainWindow.show();
//
//   });
//   // createModalWindow();
//   setMainMenu(mainWindow);
// });
