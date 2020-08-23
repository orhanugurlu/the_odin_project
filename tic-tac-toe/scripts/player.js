function Player(name, role) {
    this.name = name;
    this.oldName = name;
    this.score = 0;
    this.role = role;
    this.active = false;
    this.element = document.querySelector(role === FIRST_PLAYER ? '#player1' : '#player2');
    this.element.querySelector('.name_input').textContent = this.name;
    this.element.querySelector('.score').textContent = `${this.score}`;
    this.element.querySelector('.symbol').textContent = `${this.role}`;
    this.element.querySelector('.name_input').addEventListener('input', (e) => {
        this.name = e.target.value;
        this.oldName = this.name;
    });
}

Player.prototype.setName = function(newName) {
    if (newName === 'Computer') {
        this.setEnabled(false)
    } else {
        this.setEnabled(true)
    }
    if (newName === '') {
        this.name = this.oldName;
    } else {
        this.name = newName;
    }
    this.element.querySelector('.name_input').value = `${this.name}`;
}

Player.prototype.setScore = function(newScore) {
    this.score = newScore;
    this.element.querySelector('.score').textContent = `${this.score}`;
}

Player.prototype.setActive = function(active) {
    this.element.style.borderColor = active ? 'salmon' : 'lightgray';
}

Player.prototype.setEnabled = function(enabled) {
    this.element.querySelector('.name_input').disabled = !enabled;
}
