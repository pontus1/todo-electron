const fs = require('fs');

// TODO: This should write to users home folder instead of project root

const saveTodos = (todos) => {

    JSONTodos = JSON.stringify(todos);

    fs.writeFile('todos.JSON', JSONTodos, (err) => {
        if (err) throw err; // TODO: handle with try catch
    });



}

const loadTodos = () => {

    try {
        var data = fs.readFileSync('todos.JSON', 'utf8');
    } catch(e) {
        console.log('Error:', e.stack);  // TODO: handle properly
    }

    return data ? JSON.parse(data) : [];
}

module.exports = {
    saveTodos,
    loadTodos
}


// [{"id":1,"text":"Do something","description":"dfgkdjhgf djhfkh ghdgjfhgk kdfhjgdfh dfgd","done":false},{"id":2,"text":"Do something else","description":"dfdsh","done":false},{"id":3,"text":"Eat","description":"fdjghkjhkjdhfgkj dkjfhkdjfhgkjdhfg kdjfhgkdhfgj dkgjhdfkgdgk dkfjhkghdfkjhg ghghg dkgh dhgghd dkfjghdkhg ","done":false},{"id":4,"text":"Sleep","description":"dfgfhgfdgjgjfhkgj xfghgj fgjgjh","done":true},{"id":5,"text":"Be awake","description":"","done":true},{"id":6,"text":"Run","description":"gfhfghfgh fghfghfghghfghh fdfksgs 93486 sdjdjgsfhf hdjh","done":false},{"id":7,"text":"dfgbdfbdfb","done":false},{"id":7,"text":"Gå ut och gå","done":false}]
// todos.JSON
