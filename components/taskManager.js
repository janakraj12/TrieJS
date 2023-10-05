const fs = require('fs');

let tasks = [];

function loadTasks() {
    try {
        const data = fs.readFileSync('tasks.json', 'utf8');
        tasks = JSON.parse(data);
    } catch (error) {
        console.log('Error loading tasks:', error.message);
    }
}

function saveTasks() {
    try {
        fs.writeFileSync('tasks.json', JSON.stringify(tasks, null, 2));
        console.log('Tasks saved successfully.');
    } catch (error) {
        console.log('Error saving tasks:', error.message);
    }
}

function addTask() {
    process.stdout.write('Enter task description: ');
    process.stdin.once('data', (data) => {
        const taskName = data.toString().trim();
        process.stdout.write('Enter task priority (High, Medium, Low): ');
        process.stdin.once('data', (data) => {
            const priority = data.toString().trim();
            process.stdout.write('Enter due date (MM/DD/YYYY): ');
            process.stdin.once('data', (data) => {
                const dueDate = data.toString().trim();
                tasks.push({ name: taskName, priority: priority, dueDate: dueDate, completed: false });
                console.log('Task added successfully.');
                showMenu();
            });
        });
    });
}

function removeTask() {
    listTasks();
    process.stdout.write('Enter task number to remove: ');
    process.stdin.once('data', (data) => {
        const taskIndex = parseInt(data.toString().trim()) - 1;
        if (taskIndex >= 0 && taskIndex < tasks.length) {
            tasks.splice(taskIndex, 1);
            console.log('Task removed successfully.');
        } else {
            console.log('Error: Invalid task number.');
        }
        showMenu();
    });
}

function completeTask() {
    listTasks();
    process.stdout.write('Enter task number to mark as completed: ');
    process.stdin.once('data', (data) => {
        const taskIndex = parseInt(data.toString().trim()) - 1;
        if (taskIndex >= 0 && taskIndex < tasks.length) {
            tasks[taskIndex].completed = true;
            console.log('Task marked as completed.');
        } else {
            console.log('Error: Invalid task number.');
        }
        showMenu();
    });
}

function listTasks() {
    console.log('Tasks:');
    tasks.forEach((task, index) => {
        const status = task.completed ? 'Completed' : 'Incomplete';
        console.log(`${index + 1}. [${status}] ${task.name} - Priority: ${task.priority}, Due: ${task.dueDate}`);
    });
}

function showMenu() {
    console.log('\nTask Manager');
    console.log('1. Add Task');
    console.log('2. Remove Task');
    console.log('3. Mark Task as Completed');
    console.log('4. List Tasks');
    console.log('5. Save and Exit');
    process.stdout.write('Enter your choice: ');
    process.stdin.once('data', (data) => {
        const choice = data.toString().trim();
        switch (choice) {
            case '1':
                addTask();
                break;
            case '2':
                removeTask();
                break;
            case '3':
                completeTask();
                break;
            case '4':
                listTasks();
                showMenu();
                break;
            case '5':
                saveTasks();
                console.log('Exiting Task Manager. Goodbye!');
                process.exit();
            default:
                console.log('Invalid choice. Please try again.');
                showMenu();
        }
    });
}

function taskManager() {
    loadTasks();
    showMenu();
}

taskManager();
