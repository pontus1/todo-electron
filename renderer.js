const { remote, ipcRenderer } = require('electron');
const path = require('path');
require('devtron').install(); // debug tool
const {
    createIcon,
    createButton,
    createHeader,
    createBody,
    createFooter
} = require('./node-factory');
const { emptyNode } = require('./utils');
const currentWindow = remote.getCurrentWindow(); // active Window

/* DOM Nodes */
const title = document.querySelector('#title');
const todoList = document.querySelector('#todos');
const doneList = document.querySelector('#dones');
const createTodoBtn = document.querySelector('#create-new-todo');

// title.innerHTML = "What to do?";

//const { todos, addTodo, removeTodo } = require('./todos')

const todos = [
    { id: 1, text: 'Do something', description: 'dfgkdjhgf djhfkh ghdgjfhgk kdfhjgdfh dfgd', done: false },
    { id: 2, text: 'Do something else', description: 'dfdsh', done: false },
    { id: 3, text: 'Eat', description: 'fdjghkjhkjdhfgkj dkjfhkdjfhgkjdhfg kdjfhgkdhfgj dkgjhdfkgdgk dkfjhkghdfkjhg ghghg dkgh dhgghd dkfjghdkhg ', done: false },
    { id: 4, text: 'Sleep', description: 'dfgfhgfdgjgjfhkgj xfghgj fgjgjh', done: true },
    { id: 5, text: 'Be awake', description: '', done: true },
    { id: 6, text: 'Run', description: 'gfhfghfgh fghfghfghghfghh fdfksgs 93486 sdjdjgsfhf hdjh', done: false }
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
    todos.map((todo, index) => {
        if (todo.id == id) {
            todos.splice(index, 1);
        }
    });
    renderTodos();
}


function renderTodos () {

    emptyNode(todoList);
    emptyNode(doneList);

    todos.map((todo) => {

        /* Header */
        const todoHeader = createHeader(todo.text);

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

function addTodoBody (todoItem, todo) {
    const todoBody = createBody(todo);
    todoItem.appendChild(todoBody);
}

function addTodoFooter (todoItem, todo) {
    const todoFooter = createFooter(todo, removeTodo, toggleDone);
    todoItem.appendChild(todoFooter);
}

function removeTodoBody (todoItem) {
    const elems = todoItem.getElementsByClassName('body');
    todoItem.removeChild(elems[0]);
}
function removeTodoFooter (todoItem) {
    const elems = todoItem.getElementsByClassName('footer');
    todoItem.removeChild(elems[0]);
}

/* Render Todos on init */
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
