const { remote, ipcRenderer } = require('electron');
const path = require('path');
require('devtron').install(); // debug tool
const {
    createIcon,
    createButton,
    // createHeader,
    // createBody,
    // createFooter
} = require('./node-factory');
const { emptyNode } = require('./utils');
const { loadTodos, saveTodos } = require('./todos-dao'); // persistance
const currentWindow = remote.getCurrentWindow(); // active Window

/* DOM Nodes */
const title = document.querySelector('#title');
const todoList = document.querySelector('#todos');
const doneList = document.querySelector('#dones');
const createTodoBtn = document.querySelector('#create-new-todo');


const todos = loadTodos();
let id = todos.length > 0 ? todos[todos.length -1].id : 1;

function addTodo (title, description) {
    const newTodo = {
        id: ++id,
        title: title, // TODO: change key to title
        description: description,
        done: false
    }
    todos.push(newTodo);
    saveTodos(todos);
    renderTodos();
}

function toggleDone (id) {
    todos.map((todo) => {
        if (todo.id == id) {
            todo.done = !todo.done;
        }
    });
    saveTodos(todos);
    renderTodos();
}

function removeTodo (id) {
    todos.map((todo, index) => {
        if (todo.id == id) {
            todos.splice(index, 1);
        }
    });
    saveTodos(todos);
    renderTodos();
}

function updateTodo (id, title, description) {
    todos.map((todo, index) => {
        if (todo.id === id) {
            todo.title = title,
            todo.description = description
        }
    });
    saveTodos(todos);
    renderTodos();
}


function renderTodos () {

    emptyNode(todoList);
    emptyNode(doneList);

    todos.map((todo) => {

        /* Header */
        const todoHeader = createHeader(todo.title);

        /* Todo item */
        const todoItem = document.createElement('li');
        todoItem.appendChild(todoHeader);


        todoHeader.addEventListener('click', function () {
            // toggleClass(this, 'expanded');
            if (this.parentNode.classList.contains('expanded')) {
                this.parentNode.classList.remove('expanded');
                removeTodoBody(this.parentNode);
                removeTodoFooter(this.parentNode);
                this.children[0].children[0].innerHTML = 'expand_more';
            } else {
                this.parentNode.classList.add('expanded');
                const that = this;
                /* Timeout to match css transition */
                setTimeout(() => {
                    addTodoBody(that.parentNode, todo);
                    addTodoFooter(that.parentNode, todo);
                }, 150);

                this.children[0].children[0].innerHTML = 'expand_less';
            }

        });

        if (todo.done) {
            doneList.appendChild(todoItem);
        } else {
            todoList.appendChild(todoItem);
        }
    });
}

function addTodoBody (todoItem, todo, editMode) {
    removeTodoBody(todoItem);
    const todoBody = createBody(todoItem, todo, editMode);
    todoItem.appendChild(todoBody);
    if (editMode) todoItem.getElementsByTagName('input')[0].focus();
}

function addTodoFooter (todoItem, todo, editMode) {
    removeTodoFooter(todoItem);
    const todoFooter = createFooter(todoItem, todo, editMode);
    todoItem.appendChild(todoFooter);
}

function removeTodoBody (todoItem) {
    const elems = todoItem.getElementsByClassName('body');
    if (elems.length > 0) todoItem.removeChild(elems[0]);
}
function removeTodoFooter (todoItem) {
    const elems = todoItem.getElementsByClassName('footer');
    if (elems.length > 0) todoItem.removeChild(elems[0]);
}

function createHeader (title) {
    /* Chevron icon */
    const expandBtn = createButton({
        icon: 'expand_more',
        classes: ['btn', 'btn-round', 'btn-small', 'transparent']
    });

    /* header */
    const header = document.createElement('div');
    header.classList.add('header');
    header.innerHTML = title;
    header.appendChild(expandBtn);

    return header;
}

function createBody (todoItem, todo, editMode) {
    const body = document.createElement('div');
    body.classList.add('body');

    if (editMode) {

        const titleInput = document.createElement('input');
        titleInput.setAttribute('type', 'text');
        titleInput.value = todo.title;
        const descriptionInput = document.createElement('textarea');
        descriptionInput.value = todo.description ? todo.description : '';
        body.classList.add('edit-mode');
        body.appendChild(titleInput);
        body.appendChild(descriptionInput);

    } else {

        // const title = document.createElement('h3');
        const description = document.createElement('p');
        // title.innerHTML = todo.title;
        description.innerHTML = todo.description ? todo.description : '¯\\_(ツ)_/¯';
        // body.appendChild(title);
        body.appendChild(description);
    }

    return body;
}

function createFooter (todoItem, todo, editMode) {

    /* Edit button */
    const editBtn = createButton({
        icon: 'edit',
        id: 'edit-todo-' + todo.id,
        classes: ['btn', 'btn-round', 'btn-small', 'btn-primary', 'btn-shadow'],
        clickHandler: function (e) {
            e.stopPropagation();
            addTodoBody(todoItem, todo, true);
            addTodoFooter (todoItem, todo, true);
        }
    });

    /* Delete button */
    const deleteBtn = createButton({
        icon: 'delete',
        id: 'delete-todo-' + todo.id,
        classes: ['btn', 'btn-round', 'btn-small', 'btn-primary', 'btn-shadow'],
        clickHandler: function (e) {
            e.stopPropagation();
            removeTodo(e.target.id.match(/\d+/g).map(Number));
        }
    });

    /* Toggle done button */
    const toggleStatusBtn = createButton({
        icon: todo.done ? 'keyboard_return' : 'check',
        id: 'todo-' + todo.id,
        classes: ['btn', 'btn-round', 'btn-small', 'btn-primary', 'btn-shadow'],
        clickHandler: function (e) {
            e.stopPropagation();
            toggleDone(e.target.id.match(/\d+/g).map(Number));
        }
    });

    /****************
        EDIT MODE
    *****************/

    /* Save edit btn */
    const saveEditBtn = createButton({
        text: 'save',
        id: 'save-edit-todo-' + todo.id,
        classes: ['btn', 'btn-secondary', 'btn-shadow'],
        clickHandler: function (e) {
            e.stopPropagation();
            const title = todoItem.getElementsByTagName('input')[0].value;
            const description = todoItem.getElementsByTagName('textarea')[0].value;
            updateTodo(todo.id, title, description);
        }
    });

    const cancelEditBtn = createButton({
        text: 'cancel',
        id: 'cancel-edit-todo-' + todo.id,
        classes: ['btn', 'btn-primary', 'btn-shadow'],
        clickHandler: function (e) {
            e.stopPropagation();
            addTodoBody(todoItem, todo);
            addTodoFooter (todoItem, todo);
        }
    });

    const footer = document.createElement('div');
    footer.classList.add('footer');

    if (!editMode) {
        if (!todo.done) footer.appendChild(editBtn);
        footer.appendChild(deleteBtn);
        footer.appendChild(toggleStatusBtn);
    } else {
        footer.appendChild(saveEditBtn);
        footer.appendChild(cancelEditBtn);
    }

    return footer;
}

/* Render Todos on init */
renderTodos();

ipcRenderer.on('add-new-todo', (event, todo) => {
    addTodo(todo.title, todo.description);
});

// createTodoBtn.addEventListener('click', () => {
//     ipcRenderer.send('open-add-todo-window');
// });
//
// const openRemoteWindowBtn = document.querySelector('#open-remote-window');

createTodoBtn.addEventListener('click', () => {
    let remoteWin = new remote.BrowserWindow({
        width: 600,
        height: 600,
        modal: true
    });
    remoteWin.loadURL(path.join('file://', __dirname, 'create-todo-modal.html'));

    remoteWin.on('closed', function() {
      remoteWin = null;
    });
});

function createAddBtn () {

}

// TODO: put in helper class
function toggleClass(element, cls) {
    if (element.classList.contains(cls)) {
        element.classList.remove(cls);
    } else {
        element.classList.add(cls);
    }
}

// const remoteWin = new remote.BrowserWindow({
//     width: 520,
//     height: 300,
//     modal: true
// });
// remoteWin.loadURL(path.join('file://', __dirname, 'create-todo-modal.html'));


// ipcRender.send('show-create-todo-modal') --->
// ipcMain.on('show-create-todo-modal', () => {
//     createTodoWindow.show();
// })
