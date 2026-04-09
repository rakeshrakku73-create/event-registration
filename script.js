window.downloadPDF = async function () {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    // 1. Add Background Color to the PDF
    doc.setFillColor(245, 247, 251); // Light grey-blue background
    doc.rect(0, 0, 210, 297, 'F');

    // 2. Add a Decorative Border
    doc.setDrawColor(26, 35, 126); // Dark blue
    doc.setLineWidth(2);
    doc.rect(10, 10, 190, 277); // Outer border

    const title = document.getElementById("title").value || "Event Invitation";
    const date = document.getElementById("date").value || "";
    const venue = document.getElementById("venue").value || "";

    // 3. Header Styling
    doc.setFont("times", "bolditalic");
    doc.setTextColor(26, 35, 126);
    doc.setFontSize(28);
    doc.text(title, 105, 50, { align: "center" });

    // 4. Content
    doc.setTextColor(0, 0, 0);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(14);
    doc.text("You are cordially invited to attend", 105, 70, { align: "center" });
    
    doc.setFontSize(16);
    doc.text(`${date} | ${venue}`, 105, 90, { align: "center" });

    // 5. QR Code
    const qrLink = document.getElementById("eventLink").value || "https://vit.ac.in";
    const qrDiv = document.createElement("div");
    new QRCode(qrDiv, qrLink);
    setTimeout(() => {
        const qrCanvas = qrDiv.querySelector("canvas");
        if (qrCanvas) {
            const qrData = qrCanvas.toDataURL("image/png");
            doc.addImage(qrData, 'PNG', 85, 110, 40, 40);
        }
        doc.save("Official_Invitation.pdf");
    }, 500);
};
