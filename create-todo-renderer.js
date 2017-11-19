const { remote, ipcRenderer } = require('electron');

const titleInput = document.querySelector('#title-input');
const addBtn = document.querySelector('#add-new-todo');
const cancelBtn = document.querySelector('#cancel-new-todo');

addBtn.addEventListener('click', () => {

    if (titleInput.value) {

        ipcRenderer.send('request-add-todo', titleInput.value);
        remote.getCurrentWindow().close();

    } else {
        ipcRenderer.send('show-empty-input-dialog');
        // inform user that title needs to have some content
    }

});

cancelBtn.addEventListener('click', () => {
    // ipcRenderer.send('close-create-todo-window');
    var window = remote.getCurrentWindow();
       window.close();
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
