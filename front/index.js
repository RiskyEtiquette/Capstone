let taskList = JSON.parse(localStorage.getItem("tasks")) || [];
let nextId = parseInt(localStorage.getItem("nextId"), 10) || 1;


function generateTaskId() {
    localStorage.setItem("nextId", nextId + 1);
    return nextId++;
}

function createTaskCard(task) {
    const card = $("<div>").addClass("task-card").attr("id", "task-" + task.id);
    const title = $("<h3>").text(task.title);
    const description = $("<p>").text(task.description);
    const dueDate = dayjs(task.dueDate).format("YYYY-MM-DD");
    const today = dayjs();
    const daysUntilDue = dayjs(dueDate).diff(today, 'day');

    card.append(title, description, $("<p>").text(`Due Date: ${dueDate}`));
    const deleteButton = $("<button>")
    .text("Delete")
    .addClass("btn btn-delete-task") // Add Bootstrap and custom classes
    .html('<i class="fas fa-trash"></i> Delete') // Using Font Awesome icon
    .click(() => handleDeleteTask(task.id));
    card.append(deleteButton);
    return card;
}


function handleAddTask(event) {
    event.preventDefault();
    const formData = {
       
        title: $("#taskName").val(),
        description: $("#taskDescription").val(),
        dueDate: $("#taskDueDate").val(),
        priority: $("#taskPriority").val(),
        assignee: $("#taskAssignee").val(),
        status: $("#taskStatus").val(),
    };

    
    $.ajax({
        url: 'http://localhost:3000/api/tasks',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(formData),
        success: function(task) {
            console.log("Task added successfully", task);
            taskList.push(task); 
            localStorage.setItem("tasks", JSON.stringify(taskList));
            renderTaskList();
            $('#formModal').modal('hide');
        },
        error: function(xhr, status, error) {
            console.error("Error adding task to server:", xhr.status, error);
            alert("Failed to add task: " + error);
        }
    });
}


function handleDeleteTask(taskId) {
    
    $.ajax({
        url: 'http://localhost:3000/api/tasks/' + taskId,
        type: 'DELETE',
        success: function(result) {
            console.log("Task deleted successfully");
            
            $('#task-' + taskId).remove();
            
            taskList = taskList.filter(task => task.id !== taskId);
            localStorage.setItem("tasks", JSON.stringify(taskList));
        },
        error: function(xhr, status, error) {
            console.error("Error deleting task from server:", xhr.status, error);
        }
    });
    
    
}


function renderTaskList() {
    $("#to-do-cards, #in-progress-cards, #done-cards").empty();
    taskList.forEach(task => {
        const card = createTaskCard(task);
        const targetDiv = `#${task.status}-cards`;
        $(targetDiv).append(card);
    });
    makeTasksDraggable();
}

function makeTasksDraggable() {
    $(".task-card").draggable({
        revert: "invalid",
        containment: "document",
        start: function() {
            $(this).addClass("dragging");
        },
        stop: function() {
            $(this).removeClass("dragging");
        }
    });
}


function setupDroppableLanes() {
    $(".lane").droppable({
        accept: ".task-card",
        drop: function(event, ui) {
            const cardId = ui.draggable.attr('id');
            const taskId = parseInt(cardId.replace('task-', ''), 10);
            const newStatus = $(this).attr('id').replace('-cards', '');

            
            updateTaskStatus(taskId, newStatus);

            const task = taskList.find(task => task.id === taskId);
            if (task) {
                task.status = newStatus;
                localStorage.setItem('tasks', JSON.stringify(taskList));
                renderTaskList(); 
            }
        },
        hoverClass: "lane-hover"
    });
}
function updateTaskStatus(taskId, newStatus) {
    $.ajax({
        url: `http://localhost:3000/api/tasks/${taskId}`,
        type: 'PUT',
        contentType: 'application/json',
        data: JSON.stringify({ status: newStatus }),
        success: function(response) {
            console.log("Task status updated successfully");
        },
        error: function(xhr, status, error) {
            console.error("Error updating task status:", xhr.status, error);
        }
    });
}
async function getAllTasks() {
    try {
        const response = await fetch('http://localhost:3000/api/tasks');
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        taskList = await response.json();
        localStorage.setItem("tasks", JSON.stringify(taskList));
        renderTaskList();
    } catch (error) {
        console.error("Failed to fetch tasks:", error);
    }
}
$(document).ready(function () {
    getAllTasks(); 
    setupEventHandlers();
});

function getAllTasks() {
    fetch('http://localhost:3000/api/tasks')
    .then(response => {
        if (!response.ok) throw new Error('Failed to fetch tasks');
        return response.json();
    })
    .then(tasks => {
        taskList = tasks;
        localStorage.setItem("tasks", JSON.stringify(taskList)); 
        renderTaskList();
    })
    .catch(error => {
        console.error("Failed to fetch tasks:", error);
    });
}

function setupEventHandlers() {
    $("#add-task-form").on("submit", handleAddTask);
    $("#taskDueDate").datepicker({ dateFormat: "yy-mm-dd" });
    setupDroppableLanes();
}

