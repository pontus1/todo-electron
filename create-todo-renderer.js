const { remote, ipcRenderer } = require('electron');

const titleInput = document.querySelector('#title-input');
const descriptionInput = document.querySelector('#description-input');
const addBtn = document.querySelector('#add-new-todo');
const cancelBtn = document.querySelector('#cancel-new-todo');

addBtn.addEventListener('click', () => {

    if (titleInput.value) {
        console.log(descriptionInput.value);
        ipcRenderer.send('request-add-todo', { title: titleInput.value, description: descriptionInput.value });
        remote.getCurrentWindow().close();

    } else {
        ipcRenderer.send('show-empty-input-dialog');
    }

});
s
cancelBtn.addEventListener('click', () => {
    var window = remote.getCurrentWindow();
       window.close();
});

titleInput.focus();
