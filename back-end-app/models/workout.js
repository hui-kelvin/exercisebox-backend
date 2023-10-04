class WorkoutWeek{
    constructor(creator) {
        this.creator = creator;
        this.week = {
            mon:{exercises:[],completed:false},
            tues:{exercises:[],completed:false},
            wed:{exercises:[],completed:false},
            thurs:{exercises:[],completed:false},
            fri:{exercises:[],completed:false},
            sat:{exercises:[],completed:false},
            sun:{exercises:[],completed:false}
        };
        this.completed = false;
    }
}

module.exports = WorkoutWeek;