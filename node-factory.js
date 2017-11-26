
// http://materializecss.com/icons.html
function createIcon (iconType) {
    const elem = document.createElement('i');
    elem.classList.add('material-icons');
    elem.innerHTML = iconType;
    return elem;
}

function createButton({ icon='', text='', id='', classes=['btn'], clickHandler }) {
    const btn = document.createElement('button');
    btn.id = id;
    btn.appendChild(createIcon(icon));
    text ? btn.innerHTML = text : '';
    for (className of classes) {
        btn.classList.add(className);
    }
    btn.addEventListener('click', clickHandler);

    return btn;
}

// TODO: Create file called todo-builder or something
// and put everything below there
function createHeader (title) {
    /* Chevron icon */
    const expandBtn = createButton({
        icon: 'expand_more',
        classes: ['btn', 'btn-round', 'btn-small', 'transparent']
    });

    /* header */
    var header = document.createElement('div');
    header.classList.add('header');
    header.innerHTML = title;
    header.appendChild(expandBtn);

    return header;
}

function createBody (todo) {
    var body = document.createElement('div');
    body.classList.add('body');
    body.innerHTML = todo.description ? todo.description : '¯\\_(ツ)_/¯';
    return body;
}

function createFooter (todo, removeTodo, toggleDone, editMode) {

    /* Edit button */
    const editBtn = createButton({
        icon: 'edit',
        id: 'edit-todo-' + todo.id,
        classes: ['btn', 'btn-round', 'btn-small', 'btn-primary']
        // TODO: add clickHandler
    });

    /* Delete button */
    const deleteBtn = createButton({
        icon: 'delete',
        id: 'delete-todo-' + todo.id,
        classes: ['btn', 'btn-round', 'btn-small', 'btn-primary'],
        clickHandler: function (e) {
            e.stopPropagation();
            removeTodo(e.target.id.match(/\d+/g).map(Number));
        }
    });

    /* Toggle done button */
    const toggleStatusBtn = createButton({
        icon: todo.done ? 'keyboard_return' : 'check',
        id: 'todo-' + todo.id,
        classes: ['btn', 'btn-round', 'btn-small', 'btn-primary'],
        clickHandler: function (e) {
            e.stopPropagation();
            toggleDone(e.target.id.match(/\d+/g).map(Number));
        }
    });

    const footer = document.createElement('div');
    footer.classList.add('footer');

    if (!editMode) {
        if (!todo.done) footer.appendChild(editBtn);
        footer.appendChild(deleteBtn);
        footer.appendChild(toggleStatusBtn);
    }

    return footer;
}

module.exports = {
    createIcon,
    createButton,
    createHeader,
    createBody,
    createFooter
}
