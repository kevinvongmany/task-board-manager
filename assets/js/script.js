
// Retrieve tasks and nextId from localStorage
let taskList = JSON.parse(localStorage.getItem("tasks"));
let nextId = JSON.parse(localStorage.getItem("nextId"));

// Todo: create a function to generate a unique task id
function generateTaskId() {
    if (!nextId) {
        nextId = 1;
    } else {
        nextId++;
    }
    localStorage.setItem("nextId", JSON.stringify(nextId));
    return nextId;
}

// Todo: create a function to create a task card
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

function updateTaskCardColour(taskCard, date) {
    const today = dayjs();
    const dueDate = dayjs(date);
    const daysUntilDue = dueDate.diff(today, "day");
    console.log(daysUntilDue);
    if (daysUntilDue <= 0) {
        taskCard.addClass("bg-danger");
    } else if (daysUntilDue <= 3) {
        taskCard.addClass("bg-warning");
    }
}

// Todo: create a function to render the task list and make cards draggable
function renderTaskList() {
    $("#todo-cards, #in-progress-cards, #done-cards").empty();
    if (taskList) {
        taskList.forEach(task => {
            let taskCard = createTaskCard(task);
            updateTaskCardColour(taskCard, task.dueDate);
            taskCard.draggable(
                {
                    revert: "invalid",
                    cursor: "move",
                    opacity: 0.9,
                    zIndex: 3
                }
            );
            
        });
    }
}

// Todo: create a function to handle adding a new task
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

function reformatDate(date) {
    return dayjs(date).format("DD/MM/YYYY")
}

// Todo: create a function to handle deleting a task
function handleDeleteTask(event){
    const taskId = $(this).closest(".task-card").attr("id");
    console.log(taskId);
    taskList = taskList.filter(task => task.id !== parseInt(taskId));
    console.log(taskList);
    localStorage.setItem("tasks", JSON.stringify(taskList));
    renderTaskList();

}

// Todo: create a function to handle dropping a task into a new status lane
function handleDrop(event, ui) {
    event.preventDefault();
    console.log(ui);
    const taskId = ui.draggable.attr("id");
    console.log(taskId);
    const status = $(this);
    console.log(this.dataset.status);
    const task = taskList.find(task => task.id === parseInt(taskId)); 
    task.status = this.dataset.status;
    localStorage.setItem("tasks", JSON.stringify(taskList));
    renderTaskList();

}

// Todo: when the page loads, render the task list, add event listeners, make lanes droppable, and make the due date field a date picker
$(document).ready(function () {
    renderTaskList();
    $("#add-task").on("click", handleAddTask);
    $(document).on("click", ".delete-task", handleDeleteTask);
    $(".card-body").droppable({
        accept: ".task-card",
        drop: handleDrop
    });

});
