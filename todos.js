

const todos = [
    {
        id: 1,
        text: 'Do something',
        done: false
    },
    {
        id: 2,
        text: 'Do something else',
        done: false
    },
    {
        id: 3,
        text: 'Eat',
        done: false
    },
    {
        id: 4,
        text: 'Sleep',
        done: true
    },
    {
        id: 5,
        text: 'Be awake',
        done: true
    },
    {
        id: 6,
        text: 'Run',
        done: false
    },
];

let id = 6;

function addTodo (todos, text) {

    const newTodo = {
        id: ++id,
        text: text,
        done: false
    }
    return todos.concat(newTodo);
    // return [...todos, newTodo];
}

function removeTodo (todos, id) {
    return todos.filter((todo) => todo.id !== id);
}

module.exports = {
    todos, addTodo, removeTodo
}

const renderApp = require('./renderApp');
const appData = require('./appData'); // Din "singleton" med data

const addTodo = createAction((todo) => {
    appData.myTodos.push(todo);
});

addTodo({id: 1, text: 'DO THIS'});

const createAction = (fn) => {
    return (...args) => {
        fn(...args);

        renderApp();
    };
};
