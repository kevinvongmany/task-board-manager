
// Retrieve tasks and nextId from localStorage
let taskList = JSON.parse(localStorage.getItem("tasks"));
let nextId = JSON.parse(localStorage.getItem("nextId"));

function generateTaskId() {
    if (!nextId) {
        nextId = 1;
    } else {
        nextId++;
    }
    localStorage.setItem("nextId", JSON.stringify(nextId));
    return nextId;
}

function createTaskCard(task) {
    const taskCard = $("<div>").addClass("card text-center task-card mb-3 z-index-1").attr("id", task.id);
    const taskTitle = $("<h3>").addClass("card-header mb-3").text(task.title);
    const taskDescription = $("<p>").addClass("mb-2").text(task.description);
    const dueDate = $("<p>").addClass("mb-2").text(reformatDate(task.dueDate));
    const deleteDiv = $("<div>").addClass("text-center mb-2");
    const deleteButton = $("<button>").addClass("btn btn-danger border-white delete-task").text("Delete");
    deleteDiv.append(deleteButton);
    taskCard.append(taskTitle, taskDescription, dueDate, deleteDiv);
    $(`#${task.status}-cards`).append(taskCard);
    return taskCard;

}

function reformatDate(date) {
    return dayjs(date).format("DD/MM/YYYY")
}

function updateTaskCardColour(taskCard, date) {
    const today = dayjs();
    const dueDate = dayjs(date);
    const daysUntilDue = dueDate.diff(today, "day");
    if (daysUntilDue <= 0) {
        taskCard.addClass("bg-danger");
    } else if (daysUntilDue <= 3) {
        taskCard.addClass("bg-warning");
    }
}

function renderTaskList() {
    $("#todo-cards, #in-progress-cards, #done-cards").empty();
    if (taskList) {
        taskList.forEach(task => {
            let taskCard = createTaskCard(task);
            updateTaskCardColour(taskCard, task.dueDate);
            taskCard.draggable({
                revert: "invalid",
                cursor: "move",
                opacity: 0.9,
                zIndex: 3
                
            });  
        });
    }
}

function handleAddTask(event){
    event.preventDefault();
    const task = {
        id: generateTaskId(),
        title: $("#task-name").val(),
        dueDate: $("#task-due-date").val(),
        description: $("#task-description").val(),
        status: "todo"
    };
    if (!taskList) {
        taskList = [];
    }
    taskList.push(task);
    localStorage.setItem("tasks", JSON.stringify(taskList));
    $("#task-name").val("");
    $("#task-due-date").val("");
    $("#task-description").val("");
    $("#formModal").modal("hide");
    renderTaskList();

}


function handleDeleteTask(event){
    const taskId = $(this).closest(".task-card").attr("id");
    taskList = taskList.filter(task => task.id !== parseInt(taskId));
    localStorage.setItem("tasks", JSON.stringify(taskList));
    renderTaskList();

}

function handleDrop(event, ui) {
    event.preventDefault();
    const taskId = ui.draggable.attr("id");
    const status = $(this);
    const task = taskList.find(task => task.id === parseInt(taskId)); 
    task.status = this.dataset.status;
    localStorage.setItem("tasks", JSON.stringify(taskList));
    renderTaskList();

}

$(document).ready(function () {
    renderTaskList();
    $("#add-task").on("click", handleAddTask);
    $(document).on("click", ".delete-task", handleDeleteTask);
    $(".card-body").droppable({
        accept: ".task-card",
        drop: handleDrop
    });

});
