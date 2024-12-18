// مصفوفة لتخزين جميع البيانات المدخلة
const transactions = [];

// تحليل الإيصال
function analyzeReceipt() {
    const receiptText = document.getElementById('receipt').value;

    let date = "";
    let amount = "";
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

        if (line.includes("من:") || line.includes("الى:") || line.includes("لدى:")) {
            const matchNotes = line.match(/(?:من:|الى:|لدى:)(.+)/);
            if (matchNotes) notes = matchNotes[1].trim();
        }

        if (line.includes("شراء") || line.includes("حوالة") || line.includes("مدفوعات") || line.includes("خصم")) {
            category = line.split(" ")[0];
        }
    });

    if (date && amount) {
        transactions.push({
            date,
            category: category || "غير محدد",
            description: "---",
            notes: notes || "لا يوجد",
            amount
        });

        updateTable(); // تحديث الجدول
        updateTotals(); // تحديث المجموع
        document.getElementById('receipt').value = ''; // تفريغ مربع النص
    } else {
        alert("الرجاء التحقق من صحة الإيصال!");
    }
}

// تحديث الجدول
function updateTable() {
    const tableBody = document.getElementById('data-rows');
    tableBody.innerHTML = ''; // تفريغ الجدول القديم

    transactions.forEach((row, index) => {
        const newRow = `
            <tr>
                <td>${row.date}</td>
                <td>${row.category}</td>
                <td>${row.description}</td>
                <td>${row.notes}</td>
                <td>${row.amount}</td>
            </tr>
        `;
        tableBody.insertAdjacentHTML('beforeend', newRow);
    });
}

// تحديث مجاميع الدخل والصرف الشهري
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

    document.getElementById('totals').innerHTML = `
        <p>مجموع الدخل الشهري: ${totalIncome.toFixed(2)} ريال</p>
        <p>مجموع المصروفات الشهرية: ${totalExpense.toFixed(2)} ريال</p>
    `;
}
