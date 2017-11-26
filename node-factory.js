
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

module.exports = {
    createIcon,
    createButton
}
