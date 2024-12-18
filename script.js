// قائمة المستخدمين وكلمات المرور
const users = [
    { username: "admin", password: "1234" },
    { username: "user", password: "5678" },
    { username: "newuser", password: "mypassword" } // مستخدم جديد
];

// تسجيل الدخول
function login() {
    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();

    const user = users.find(u => u.username === username && u.password === password);

    if (user) {
        localStorage.setItem("loggedInUser", username); // تخزين المستخدم في LocalStorage
        window.location.href = "home.html"; // إعادة التوجيه للصفحة الرئيسية
    } else {
        document.getElementById("error-message").innerText = "اسم المستخدم أو كلمة المرور غير صحيحة!";
    }
}

// التحقق من تسجيل الدخول
function checkLogin() {
    const loggedInUser = localStorage.getItem("loggedInUser");
    if (!loggedInUser) {
        window.location.href = "login.html"; // إعادة التوجيه إلى صفحة تسجيل الدخول
    }
}

// تسجيل الخروج
function logout() {
    localStorage.removeItem("loggedInUser"); // حذف بيانات المستخدم
    window.location.href = "login.html"; // إعادة التوجيه إلى صفحة تسجيل الدخول
}

// تحليل الإيصال
const transactions = JSON.parse(localStorage.getItem("transactions")) || [];

function analyzeReceipt() {
    const receiptText = document.getElementById('receipt').value;

    let date = "";
    let amount = 0;
    let notes = "";
    let category = "";

    const lines = receiptText.split('\n');

    lines.forEach(line => {
        if (line.includes("مبلغ:SAR")) {
            const matchAmount = line.match(/مبلغ:SAR ([\d.]+)/);
            if (matchAmount) amount = parseFloat(matchAmount[1]);
        }
        if (line.includes("في:")) {
            const matchDate = line.match(/في:([\d-: ]+)/);
            if (matchDate) date = matchDate[1].trim();
        }
        if (line.includes("من:")) {
            notes = line.split("من:")[1].trim();
        }
        if (line.includes("شراء") || line.includes("حوالة")) {
            category = line.split(" ")[0];
        }
    });

    if (date && amount) {
        transactions.push({ date, category, description: "---", notes, amount });
        saveAndRenderData();
        document.getElementById('receipt').value = '';
    } else {
        alert("الرجاء إدخال بيانات صحيحة!");
    }
}

function saveAndRenderData() {
    localStorage.setItem("transactions", JSON.stringify(transactions));
    updateTable();
    updateTotals();
}

function updateTable() {
    const tableBody = document.getElementById('data-rows');
    tableBody.innerHTML = '';

    transactions.forEach((row, index) => {
        const newRow = `
            <tr>
                <td>${row.date}</td>
                <td>${row.category}</td>
                <td>${row.description}</td>
                <td>${row.notes}</td>
                <td>${row.amount}</td>
                <td><button class="delete-btn" onclick="deleteTransaction(${index})">حذف</button></td>
            </tr>
        `;
        tableBody.insertAdjacentHTML('beforeend', newRow);
    });
}

function updateTotals() {
    let totalIncome = 0, totalExpense = 0;
    transactions.forEach(row => row.category.includes("حوالة") ? totalIncome += row.amount : totalExpense += row.amount);
    document.getElementById("income-total").innerText = totalIncome.toFixed(2);
    document.getElementById("expense-total").innerText = totalExpense.toFixed(2);
}

function deleteTransaction(index) {
    transactions.splice(index, 1);
    saveAndRenderData();
}

function exportToExcel() {
    const csv = "data:text/csv;charset=utf-8," +
        "التاريخ,الفئة,الوصف,ملاحظات,المبلغ\n" +
        transactions.map(t => `${t.date},${t.category},${t.description},${t.notes},${t.amount}`).join("\n");

    const link = document.createElement("a");
    link.href = encodeURI(csv);
    link.download = "transactions.csv";
    link.click();
}
