const completedTopics = JSON.parse(
    localStorage.getItem("completedTopics") || "[]"
);
function completeTopic(topic) {
    if (!completedTopics.includes(topic)) {
        completedTopics.push(topic);
        localStorage.setItem(
            "completedTopics",
            JSON.stringify(completedTopics)
        );
    }
    updateProgress();
}
function updateProgress() {
    const totalTopics = 3;
    const completed = completedTopics.length;
    const percentage = (completed / totalTopics) * 100;
    document.getElementById("progressFill").style.width =
        percentage + "%";
    document.getElementById("progressText").textContent =
        percentage + "% Completed (" + completed + "/3)";
    document.querySelectorAll(".learning-section button").forEach(button => {
        const topic = button.getAttribute("onclick")
            .match(/'([^']+)'/)[1];
        if (completedTopics.includes(topic)) {
            button.textContent = "Completed ✓";
            button.disabled = true;
        }
    });
}
let tasks = JSON.parse(localStorage.getItem("tasks") || "[]");
const taskInput = document.getElementById("taskInput");
const addTaskBtn = document.getElementById("addTaskBtn");
const taskList = document.getElementById("taskList");
function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}
function renderTasks() {
    taskList.replaceChildren();
    tasks.forEach((task, index) => {
        const li = document.createElement("li");
        const taskText = document.createElement("span");
        taskText.textContent = task.text;
        taskText.className = "task-text";
        if (task.completed) {
            taskText.classList.add("completed");
        }
        const actions = document.createElement("div");
        actions.className = "task-actions";
        const completeBtn = document.createElement("button");
        completeBtn.textContent = task.completed ? "Undo" : "Complete";
        completeBtn.addEventListener("click", () => {
            tasks[index].completed = !tasks[index].completed;
            saveTasks();
            renderTasks();
        });
        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "Delete";
        deleteBtn.className = "delete-btn";
        deleteBtn.addEventListener("click", () => {
            tasks.splice(index, 1);
            saveTasks();
            renderTasks();
        });
        actions.append(completeBtn, deleteBtn);
        li.append(taskText, actions);
        taskList.appendChild(li);
    });
}
function addTask() {
    const taskValue = taskInput.value.trim();
    if (taskValue === "") {
        alert("Please enter a task!");
        return;
    }
    tasks.push({
        text: taskValue,
        completed: false
    });
    saveTasks();
    renderTasks();
    taskInput.value = "";
}
addTaskBtn.addEventListener("click", addTask);
taskInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        addTask();
    }
});
const quizQuestions = [
    {
        question: "Which HTML tag creates a hyperlink?",
        options: ["<link>", "<a>", "<href>", "<url>"],
        answer: "<a>"
    },
    {
        question: "Which CSS property changes text color?",
        options: ["background", "font-size", "color", "text-style"],
        answer: "color"
    },
    {
        question: "Which keyword declares a variable in JavaScript?",
        options: ["var", "let", "const", "All of these"],
        answer: "All of these"
    },
    {
        question: "Which method selects an element by its ID?",
        options: [
            "getElementById()",
            "getClass()",
            "getElement()",
            "selectID()"
        ],
        answer: "getElementById()"
    },
    {
        question: "Which CSS layout is useful for a one-dimensional layout?",
        options: ["Flexbox", "HTML", "Alert", "LocalStorage"],
        answer: "Flexbox"
    }
];
let currentQuestion = 0;
let quizScore = 0;
let answered = false;
const questionElement = document.getElementById("question");
const optionsElement = document.getElementById("options");
const quizFeedback = document.getElementById("quizFeedback");
const nextBtn = document.getElementById("nextBtn");
function loadQuestion() {
    answered = false;
    quizFeedback.textContent = "";
    nextBtn.disabled = true;
    const questionData = quizQuestions[currentQuestion];
    questionElement.textContent =
        (currentQuestion + 1) + ". " + questionData.question;
    optionsElement.replaceChildren();
    questionData.options.forEach(option => {
        const button = document.createElement("button");
        button.textContent = option;
        button.className = "option-btn";
        button.addEventListener("click", () => {
            checkAnswer(option, button);
        });
        optionsElement.appendChild(button);
    });
}
function checkAnswer(selectedOption, selectedButton) {
    if (answered) return;
    answered = true;
    const correctAnswer = quizQuestions[currentQuestion].answer;
    const buttons = optionsElement.querySelectorAll("button");
    buttons.forEach(button => {
        button.disabled = true;
    });
    if (selectedOption === correctAnswer) {
        quizScore++;
        quizFeedback.textContent = "Correct answer! 🎉";
        quizFeedback.style.color = "green";
    } else {
        quizFeedback.textContent =
            "Wrong answer! Correct answer: " + correctAnswer;
        quizFeedback.style.color = "red";
    }
    nextBtn.disabled = false;
}
nextBtn.addEventListener("click", () => {
    if (!answered) return;
    currentQuestion++;
    if (currentQuestion < quizQuestions.length) {
        loadQuestion();
    } else {
        questionElement.textContent =
            "Quiz Completed! Your score: " +
            quizScore + "/" + quizQuestions.length;
        optionsElement.replaceChildren();
        quizFeedback.textContent = "Great job! Keep practicing.";
        nextBtn.textContent = "Restart Quiz";
        nextBtn.disabled = false;
        nextBtn.onclick = restartQuiz;
    }
});
function restartQuiz() {
    currentQuestion = 0;
    quizScore = 0;
    nextBtn.textContent = "Next Question";
    nextBtn.onclick = null;
    loadQuestion();
}
nextBtn.onclick = null;
const notes = document.getElementById("notes");
const saveNotesBtn = document.getElementById("saveNotesBtn");
const notesMessage = document.getElementById("notesMessage");
notes.value = localStorage.getItem("myNotes") || "";
saveNotesBtn.addEventListener("click", () => {
    localStorage.setItem("myNotes", notes.value);
 notesMessage.textContent = "Notes saved successfully! ✓";
    notesMessage.style.color = "green";
});
updateProgress();
renderTasks();
loadQuestion();
