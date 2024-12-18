const users = [
    { username: "admin", password: "1234" },
    { username: "user", password: "5678" }
];

const transactions = JSON.parse(localStorage.getItem("transactions")) || [];

// تسجيل الدخول
function login() {
    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();

    const user = users.find(u => u.username === username && u.password === password);

    if (user) {
        localStorage.setItem("loggedInUser", username);
        window.location.href = "home.html";
    } else {
        document.getElementById("error-message").innerText = "اسم المستخدم أو كلمة المرور غير صحيحة!";
    }
}

// التحقق من تسجيل الدخول
function checkLogin() {
    const loggedInUser = localStorage.getItem("loggedInUser");
    if (!loggedInUser) {
        window.location.href = "login.html";
    }
}

// تسجيل الخروج
function logout() {
    localStorage.removeItem("loggedInUser");
    window.location.href = "login.html";
}

// تحليل الإيصال
function analyzeReceipt() {
    const receiptText = document.get
