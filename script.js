function login() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    if (username && password) {
        alert("تم تسجيل الدخول بنجاح!");
        window.location.href = "home.html";
    } else {
        alert("الرجاء إدخال اسم المستخدم وكلمة المرور");
    }
}

function analyzeReceipt() {
    const receipt = document.getElementById('receipt').value;

    if (receipt) {
        alert("تم تحليل الإيصال!");
        // من هنا يمكن إضافة منطق التحليل
    } else {
        alert("الرجاء إدخال نص الإيصال.");
    }
}
