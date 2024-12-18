// مصفوفة لتخزين العمليات المُدخلة
const transactions = [];

// تحليل الإيصال وإضافة البيانات إلى الجدول
function analyzeReceipt() {
    const receiptText = document.getElementById('receipt').value;

    // متغيرات لحفظ البيانات المُستخرجة
    let date = "";
    let amount = 0;
    let notes = "";
    let category = "";

    // تقسيم النص إلى أسطر
    const lines = receiptText.split('\n');

    // تحليل كل سطر للعثور على البيانات
    lines.forEach(line => {
        if (line.includes("مبلغ:SAR")) {
            const matchAmount = line.match(/مبلغ:SAR ([\d.]+)/);
            if (matchAmount) amount = parseFloat(matchAmount[1]);
        }
        if (line.includes("في:")) {
            const matchDate = line.match(/في:([\d-: ]+)/);
            if (matchDate) date = matchDate[1].trim();
        }
        if (line.includes("من:") || line.includes("الى:") || line.includes("لدى:")) {
            const matchNotes = line.match(/(?:من:|الى:|لدى:)(.+)/);
            if (matchNotes) notes = matchNotes[1].trim();
        }
        if (line.includes("شراء") || line.includes("حوالة") || line.includes("مدفوعات") || line.includes("خصم")) {
            category = line.split(" ")[0];
        }
    });

    // إضافة البيانات إلى المصفوفة إذا كانت كاملة
    if (date && amount) {
        transactions.push({
            date,
            category: category || "غير محدد",
            description: "---",
            notes: notes || "لا يوجد",
            amount
        });

        updateTable();
        updateTotals();

        // تفريغ مربع النص
        document.getElementById('receipt').value = '';
    } else {
        alert("الرجاء التحقق من صحة البيانات في الإيصال.");
    }
}

// تحديث الجدول بالبيانات الجديدة
function updateTable() {
    const tableBody = document.getElementById('data-rows');
    tableBody.innerHTML = ''; // تفريغ الجدول القديم

    transactions.forEach(row => {
        const newRow = `
            <tr>
                <td>${row.date}</td>
                <td>${row.category}</td>
                <td>${row.description}</td>
                <td>${row.notes}</td>
                <td>${row.amount.toFixed(2)}</td>
            </tr>
        `;
        tableBody.insertAdjacentHTML('beforeend', newRow);
    });
}

// تحديث مجاميع الدخل والمصروف
function updateTotals() {
    let totalIncome = 0;
    let totalExpense = 0;

    transactions.forEach(row => {
        if (row.category.includes("حوالة") || row.category.includes("دخل")) {
            totalIncome += row.amount;
        } else {
            totalExpense += row.amount;
        }
    });

    document.getElementById('income-total').innerText = totalIncome.toFixed(2);
    document.getElementById('expense-total').innerText = totalExpense.toFixed(2);
}
