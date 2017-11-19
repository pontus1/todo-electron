const { remote, ipcRenderer } = require('electron');
const path = require('path');
require('devtron').install(); // debug tool
const { createIcon, createButton } = require('./node-factory');
const currentWindow = remote.getCurrentWindow(); // active Window

/* DOM Nodes */
const title = document.querySelector('#title');
const todoList = document.querySelector('#todos');
const doneList = document.querySelector('#dones');
const createTodoBtn = document.querySelector('#create-new-todo');

// title.innerHTML = "What to do?";

//const { todos, addTodo, removeTodo } = require('./todos')

const todos = [
    { id: 1, text: 'Do something', done: false },
    { id: 2, text: 'Do something else', done: false },
    { id: 3, text: 'Eat', done: false },
    { id: 4, text: 'Sleep', done: true },
    { id: 5, text: 'Be awake', done: true },
    { id: 6, text: 'Run', done: false }
];

let id = 6;

function addTodo (text) {

    const newTodo = {
        id: ++id,
        text: text,
        done: false
    }
    todos.push(newTodo);
    renderTodos();
    // return [...todos, newTodo];
}

function toggleDone (id) {
    todos.map((todo) => {
        if (todo.id == id) {
            todo.done = !todo.done;
        }
    });
    renderTodos();
}

function removeTodo (id) {
    todos = todos.filter((todo) => todo.id !== id);
    renderTodos();
    // return todos.filter((todo) => todo.id !== id);
}


function emptyNode(node) {
    while(node.firstChild) {
        node.removeChild(node.firstChild);
    }
}

function renderTodos () {

    emptyNode(todoList);
    emptyNode(doneList);

    todos.map((todo) => {

        const toggleStatusBtn = createButton({
            icon: 'check',
            id: 'todo-' + todo.id,
            classes: ['btn', 'btn-round', 'btn-small', 'btn-primary'],
            clickHandler: function (e) {
                e.stopPropagation();
                toggleDone(e.target.id.match(/\d+/g).map(Number));
            }
        });

        var todoHeader = document.createElement('div');
        todoHeader.classList.add('header');

        todoHeader.innerHTML = todo.text;
        todoHeader.appendChild(toggleStatusBtn);

        var todoItem = document.createElement('li');
        todoItem.appendChild(todoHeader);

        todoItem.addEventListener('click', function () {
            toggleClass(this, 'expanded');
        });

        // var todoItem = document.createElement('li');
        // todoItem.innerHTML = todo.text;
        // todoItem.appendChild(toggleStatusBtn);
        //
        // todoItem.addEventListener('click', function () {
        //     toggleClass(this, 'expanded');
        // });

        if (todo.done) {
            doneList.appendChild(todoItem);
        } else {
            todoList.appendChild(todoItem);
        }
    });
}

renderTodos();

ipcRenderer.on('add-new-todo', (event, text) => {
    addTodo(text);
});

// createTodoBtn.addEventListener('click', () => {
//     ipcRenderer.send('open-add-todo-window');
// });
//
// const openRemoteWindowBtn = document.querySelector('#open-remote-window');

createTodoBtn.addEventListener('click', () => {
    let remoteWin = new remote.BrowserWindow({
        width: 520,
        height: 300,
        modal: true,
        backgroundColor: '#66CD00'
    });
    remoteWin.loadURL(path.join('file://', __dirname, 'create-todo-modal.html'));

    remoteWin.on('closed', function() {
      remoteWin = null;
    });
});

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
