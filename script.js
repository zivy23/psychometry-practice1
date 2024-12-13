// משתנים גלובליים
let questionsData = {}; // מאגר השאלות
let userPoints = 0; // ניקוד משתמש

// פונקציה לטעינת השאלות מקובץ JSON
async function loadQuestions() {
    const response = await fetch('questions.json');
    const data = await response.json();
    questionsData = data;
}

// קריאה לפונקציה שתטען את השאלות כשדף ייטען
window.onload = function() {
    loadQuestions();
};

// פונקציה שמחזירה שאלה אקראית מתוך נושא מסוים
function getRandomQuestion(topic, subTopic) {
    const topicData = questionsData[topic];
    if (!topicData) return null;

    // בחר נושא ותת-נושא אקראי (במקרה הזה, אנלוגיות לדוגמה)
    const subTopicData = topicData[subTopic];
    if (!subTopicData) return null;

    // בחר שאלה אקראית מתוך תת-הנושא
    const randomIndex = Math.floor(Math.random() * subTopicData.length);
    return subTopicData[randomIndex];
}

// דוגמה לשימוש בשאלה אקראית
const randomQuestion = getRandomQuestion('verbal', 'analogies');
if (randomQuestion) {
    console.log("שאלה: " + randomQuestion.question);
    randomQuestion.options.forEach(option => {
        console.log(option.answer);
    });
}

// משתנים גלובליים
let practiceHistory = JSON.parse(localStorage.getItem("practiceHistory")) || [];
let userPoints = 0;

// עדכון פרופיל משתמש
document.getElementById("userPointsProfile").textContent = userPoints;

// שמירת היסטוריית תרגול
function savePracticeToHistory(topic, subTopic, numQuestions, correctCount, incorrectCount, questions) {
    const practiceEntry = {
        date: new Date().toLocaleString(),
        topic,
        subTopic,
        numQuestions,
        correctCount,
        incorrectCount,
        questions,
    };

    practiceHistory.push(practiceEntry);
    localStorage.setItem("practiceHistory", JSON.stringify(practiceHistory));
    updatePracticeHistoryDisplay();
}

// הצגת היסטוריית תרגול
function updatePracticeHistoryDisplay() {
    const historyList = document.getElementById("practiceHistory");
    historyList.innerHTML = "";

    practiceHistory.forEach((entry, index) => {
        const listItem = document.createElement("li");
        listItem.innerHTML = `
            <strong>תאריך:</strong> ${entry.date} |
            <strong>נושא:</strong> ${entry.topic} |
            <strong>נכונות:</strong> ${entry.correctCount}/${entry.numQuestions}
            <button onclick="viewPracticeDetails(${index})">צפה בפרטים</button>
        `;
        historyList.appendChild(listItem);
    });
}

function viewPracticeDetails(index) {
    const entry = practiceHistory[index];
    alert(`פרטי תרגול:\n\nנושא: ${entry.topic}\nתאריך: ${entry.date}\nשאלות נכונות: ${entry.correctCount}`);
}

// סינון היסטוריה
document.getElementById("filterForm").addEventListener("submit", (event) => {
    event.preventDefault();

    const startDate = new Date(document.getElementById("startDate").value);
    const endDate = new Date(document.getElementById("endDate").value);
    const topic = document.getElementById("filterTopic").value;

    const filteredHistory = practiceHistory.filter((entry) => {
        const entryDate = new Date(entry.date);
        if (startDate && entryDate < startDate) return false;
        if (endDate && entryDate > endDate) return false;
        if (topic && entry.topic !== topic) return false;
        return true;
    });

    displayFilteredHistory(filteredHistory);
});

function displayFilteredHistory(filteredHistory) {
    const historyList = document.getElementById("practiceHistory");
    historyList.innerHTML = "";

    filteredHistory.forEach((entry) => {
        const listItem = document.createElement("li");
        listItem.innerHTML = `
            <strong>תאריך:</strong> ${entry.date} |
            <strong>נושא:</strong> ${entry.topic} |
            <strong>נכונות:</strong> ${entry.correctCount}/${entry.numQuestions}
        `;
        historyList.appendChild(listItem);
    });
}

// טעינה ראשונית
updatePracticeHistoryDisplay();
