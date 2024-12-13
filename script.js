// משתנים גלובליים
let questionsData = {};  // מאגר השאלות
let userPoints = 0;  // ניקוד משתמש

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

// פונקציה שמחזירה שאלה אקראית מתוך נושא ותת-נושא
function getRandomQuestion(topic, subTopic) {
    const topicData = questionsData[topic];
    if (!topicData) return null;

    const subTopicData = topicData[subTopic];
    if (!subTopicData) return null;

    // בחר שאלה אקראית מתוך תת-הנושא
    const randomIndex = Math.floor(Math.random() * subTopicData.length);
    return subTopicData[randomIndex];
}

// הצגת שאלה והאפשרויות
function displayQuestion(question) {
    const questionText = document.getElementById("questionText");
    const optionsList = document.getElementById("optionsList");

    questionText.textContent = question.question;

    // ריקון האפשרויות הקודמות
    optionsList.innerHTML = "";

    // הצגת האפשרויות
    question.options.forEach(option => {
        const listItem = document.createElement("li");
        listItem.textContent = option.answer;
        listItem.onclick = () => handleAnswer(option.isCorrect, question);
        optionsList.appendChild(listItem);
    });
}

// פונקציה לטיפול בתשובות
function handleAnswer(isCorrect, question) {
    if (isCorrect) {
        userPoints += 2;  // להוסיף ניקוד על תשובה נכונה
        alert("תשובה נכונה! הניקוד שלך: " + userPoints);
    } else {
        alert("תשובה שגויה.");
    }

    // עדכון הניקוד על הדף
    document.getElementById("score").textContent = userPoints;

    // שמירה להיסטוריית תרגולים
    saveToHistory(question, isCorrect);

    // אחרי תשובה, בחר שאלה חדשה
    const nextQuestion = getRandomQuestion(
        document.getElementById("topic").value, 
        document.getElementById("subTopic").value
    );
    if (nextQuestion) {
        displayQuestion(nextQuestion);
    }
}

// שמירת היסטוריית תרגולים ב-localStorage
function saveToHistory(question, isCorrect) {
    let history = JSON.parse(localStorage.getItem('history')) || [];
    history.push({
        question: question.question,
        correct: isCorrect
    });
    localStorage.setItem('history', JSON.stringify(history));
}

// הצגת היסטוריית תרגולים
function showHistory() {
    const history = JSON.parse(localStorage.getItem('history')) || [];
    history.forEach(item => {
        console.log(item.question, item.correct ? "נכון" : "שגוי");
    });
}

// תחילת תרגול - הצגת שאלה לאחר שינוי נושא/תת-נושא
document.getElementById("subTopic").addEventListener("change", function() {
    const topic = document.getElementById("topic").value;
    const subTopic = document.getElementById("subTopic").value;
    
    const question = getRandomQuestion(topic, subTopic);
    if (question) {
        displayQuestion(question);
    }
});
