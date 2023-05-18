module.exports = {
    taskList: [],
    events: {
        login: "LOGIN",
        callConfig: "CALLCONFIG"
    },
    add: function(event, name, fun) {
        this.taskList && this.taskList.length || (this.taskList = []), this.taskList.push({
            event: event,
            name: name,
            fun: fun
        });
    },
    remove: function(event, name) {
        for (var i in this.taskList) this.taskList[i] && this.taskList[i].event === event && this.taskList[i].name === name && (this.taskList[i] = null);
    },
    run: function(event, fun, value) {
        for (var n in this.taskList) null != this.taskList[n] && this.taskList[n].event === event && ("function" == typeof this.taskList[n].fun && this.taskList[n].fun(value),
            this.taskList[n] = null);
        "function" == typeof fun && fun();
    }
};