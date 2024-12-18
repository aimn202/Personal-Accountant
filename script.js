function analyzeReceipt() {
    const receiptText = document.getElementById('receipt').value;

    // مصفوفة لتخزين البيانات المستخرجة
    const rows = [];

    // تقسيم النص بناءً على الإيصالات
    const lines = receiptText.split('\n');

    let date = "";
    let amount = "";
    let notes = "";
    let category = "";

    lines.forEach(line => {
        if (line.includes("مبلغ:SAR")) {
            const matchAmount = line.match(/مبلغ:SAR ([\d.]+)/);
            if (matchAmount) amount = matchAmount[1];
        }

        if (line.includes("في:")) {
            const matchDate = line.match(/في:([\d-: ]+)/);
            if (matchDate) date = matchDate[1];
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
        rows.push({
            date,
            category: category || "غير محدد",
            description: "---",
            notes: notes || "لا يوجد",
            amount
        });
    }

    // تحديث الجدول
    const tableBody = document.getElementById('data-rows');
    tableBody.innerHTML = ''; // تفريغ الجدول السابق

    rows.forEach((row, index) => {
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

    if (rows.length === 0) {
        alert("لم يتم العثور على بيانات صالحة في النص!");
    } else {
        alert("تم تحليل الإيصال وإضافة البيانات إلى الجدول!");
    }
}
