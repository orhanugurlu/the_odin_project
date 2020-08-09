const LOCAL_STORAGE_KEY = 'the_odin_project_library'

function Book(title, author, pages, read) {
    this.title = title
    this.author = author
    this.pages = pages
    this.read = read
}

function createDelCell(index) {
    const delCell = document.createElement('td')
    const delBtn = document.createElement('button')
    delBtn.textContent = 'Delete'
    delBtn.addEventListener('click', deleteBookFromLibrary)
    delBtn.className = 'delete'
    delCell.appendChild(delBtn)
    return delCell
}

function toggleReadState(e) {
    const index = e.target.parentElement.parentElement.rowIndex - 1
    library[index].read = !library[index].read
    localStorage[LOCAL_STORAGE_KEY] = JSON.stringify(library)
    e.target.textContent = library[index].isRead()
}

Book.prototype.row = function() {
    const row = document.createElement('tr')
    Object.keys(this).forEach((key) => {
        const cell = document.createElement('td')
        if (key === 'read') {
            const readBtn = document.createElement('button')
            readBtn.className = 'read'
            readBtn.addEventListener('click', toggleReadState)
            readBtn.textContent = this.isRead()
            cell.appendChild(readBtn)
        } else {
            cell.textContent = this[key]
        }
        row.appendChild(cell)
    })
    row.append(createDelCell())
    return row
}

Book.prototype.header = function() {
    const row = document.createElement("tr")
    Object.keys(this).forEach((key) => {
        const col = document.createElement("th")
        col.textContent = key.charAt(0).toUpperCase() + key.substring(1)
        row.appendChild(col)
    })
    return row
}

Book.prototype.isRead = function() {
    return this.read ? 'Read' : 'Not Read'; 
}

let library = [
    new Book('Eloquent JavaScript', 'Marijn Haverbeke', 227, false),
    new Book('JavaScript: The Good Parts', 'Douglas Crockford', 174, false)
];

function addBookToLibrary(e) {
    e.preventDefault()
    const inputs = [...document.querySelectorAll('input')]
    const allInputValid = inputs
        .map((el) => el.checkValidity())
        .reduce((allValid, elmValid) => allValid && elmValid)
    if (allInputValid) {
        library.push(new Book(document.querySelector('#name').value,
                              document.querySelector('#author').value,
                              Number(document.querySelector('#pages').value),
                              false))
        localStorage[LOCAL_STORAGE_KEY] = JSON.stringify(library)
        renderLibrary()
        document.querySelector('#book-form').reset()
    }
}

function deleteBookFromLibrary(e) {
    const index = e.target.parentElement.parentElement.rowIndex - 1
    library.splice(index, 1)
    localStorage[LOCAL_STORAGE_KEY] = JSON.stringify(library)    
    renderLibrary()
}

function renderLibrary() {
    const listDiv = document.querySelector("#list");
    for (let i = 0; i < listDiv.children.length; i++) {
        listDiv.children[i].remove()
    }
    const table = document.createElement("table")
    table.appendChild(new Book().header())
    library.forEach((book) => {
        table.appendChild(book.row())
    })
    listDiv.appendChild(table)
}

document.querySelector('#book-form').addEventListener('submit', addBookToLibrary);
if (localStorage[LOCAL_STORAGE_KEY]) {
    library = JSON.parse(localStorage[LOCAL_STORAGE_KEY])
    library.forEach((book) => Object.setPrototypeOf(book, Book.prototype))
}
renderLibrary();
