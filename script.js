let transactions = JSON.parse(localStorage.getItem("transactions")) || [];

// تحليل الإيصال
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
        if (line.includes("من:") || line.includes("الى:") || line.includes("لدى:")) {
            const matchNotes = line.match(/(?:من:|الى:|لدى:)(.+)/);
            if (matchNotes) notes = matchNotes[1].trim();
        }
        if (line.includes("شراء") || line.includes("حوالة") || line.includes("مدفوعات") || line.includes("خصم")) {
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

// حفظ البيانات وتحديث العرض
function saveAndRenderData() {
    localStorage.setItem("transactions", JSON.stringify(transactions));
    updateTable();
    updateTotals();
}

// تحديث الجدول
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
                <td>${row.amount.toFixed(2)}</td>
                <td>
                    <button onclick="deleteTransaction(${index})" class="delete-btn">حذف</button>
                </td>
            </tr>
        `;
        tableBody.insertAdjacentHTML('beforeend', newRow);
    });
}

// تحديث المجاميع
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

// حذف صف من الجدول
function deleteTransaction(index) {
    transactions.splice(index, 1);
    saveAndRenderData();
}

// تصدير البيانات إلى Excel
function exportToExcel() {
    const csvContent = "data:text/csv;charset=utf-8,"
        + "التاريخ,الفئة,الوصف,ملاحظات,المبلغ\n"
        + transactions.map(t => `${t.date},${t.category},${t.description},${t.notes},${t.amount}`).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "transactions.csv");
    document.body.appendChild(link);
    link.click();
}
