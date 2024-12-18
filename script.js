function analyzeReceipt() {
    const receiptText = document.getElementById('receipt').value;

    // مصفوفة لتخزين البيانات المستخرجة
    const rows = [];

    // تحليل النص بناءً على الأنماط
    const lines = receiptText.split('\n');

    lines.forEach(line => {
        const dateMatch = line.match(/في:([\d-: ]+)/); // لاستخراج التاريخ
        const amountMatch = line.match(/مبلغ:SAR ([\d.]+)/); // لاستخراج المبلغ
        const descriptionMatch = line.match(/(?:شراء|حوالة داخلية|مدفوعات وزارة الداخلية|خصم رسوم|حوالة محلية)/); // لاستخراج الوصف
        const notesMatch = line.match(/من:([\w\s]+)/) || line.match(/لدى:([\w\s]+)/); // ملاحظات إضافية

        if (dateMatch && amountMatch && descriptionMatch) {
            rows.push({
                date: dateMatch[1].trim(),
                description: descriptionMatch[0],
                amount: amountMatch[1],
                notes: notesMatch ? notesMatch[1].trim() : 'لا يوجد'
            });
        }
    });

    // تحديث الجدول
    const tableBody = document.getElementById('data-rows');
    tableBody.innerHTML = ''; // تفريغ الجدول السابق

    rows.forEach((row, index) => {
        const newRow = `
            <tr>
                <td>${row.date}</td>
                <td>${row.description}</td>
                <td>---</td>
                <td>${row.notes}</td>
                <td>${row.amount}</td>
            </tr>
        `;
        tableBody.insertAdjacentHTML('beforeend', newRow);
    });

    if (rows.length === 0) {
        alert("لم يتم العثور على بيانات صالحة!");
    } else {
        alert("تم تحليل الإيصال بنجاح!");
    }
}
