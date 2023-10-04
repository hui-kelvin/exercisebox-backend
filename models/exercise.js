class Exercise{
    constructor(name,difficulty,instructions) {
        this.name = name;
        this.difficulty = difficulty;
        this.instructions = instructions;
        this.completed = false;
    }
}

module.exports = Exercise;