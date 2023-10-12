class WorkoutWeek{
    constructor(creator) {
        this.creator = creator;
        this.week = {
            sun:{exercises:[],completed:false},
            mon:{exercises:[],completed:false},
            tues:{exercises:[],completed:false},
            wed:{exercises:[],completed:false},
            thurs:{exercises:[],completed:false},
            fri:{exercises:[],completed:false},
            sat:{exercises:[],completed:false}
        };
        this.completed = false;
    }
}

module.exports = WorkoutWeek;