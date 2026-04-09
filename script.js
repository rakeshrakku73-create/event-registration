window.downloadPDF = async function () {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    
    const title = document.getElementById("title").value || "Event Invitation";
    const subtitle = document.getElementById("subtitle").value || "";
    const date = document.getElementById("date").value || "";
    const venue = document.getElementById("venue").value || "";
    const faculty = document.getElementById("facultyName").value || "";
    const student = document.getElementById("studentName").value || "";
    const qrLink = document.getElementById("eventLink").value || "https://vit.ac.in";

    // Header and Titles
    doc.setFont("helvetica", "bold");
    doc.setFontSize(24);
    doc.text(title, 105, 40, { align: "center" });
    
    doc.setFont("helvetica", "normal");
    doc.setFontSize(16);
    doc.text(subtitle, 105, 50, { align: "center" });

    // Details Section
    doc.setDrawColor(63, 81, 181); // Blue border line
    doc.line(20, 65, 190, 65);
    doc.setFontSize(12);
    doc.text(`Date: ${date}`, 20, 80);
    doc.text(`Venue: ${venue}`, 20, 90);

    // QR Code Logic
    const qrDiv = document.createElement("div");
    new QRCode(qrDiv, qrLink);
    const qrCanvas = qrDiv.querySelector("canvas");
    if (qrCanvas) {
        const qrData = qrCanvas.toDataURL("image/png");
        doc.addImage(qrData, 'PNG', 150, 75, 40, 40);
        doc.setFontSize(8);
        doc.text("Scan for Details", 170, 118, { align: "center" });
    }

    // Coordinators at the bottom
    doc.setFontSize(12);
    doc.text(`Faculty Coordinator: ${faculty}`, 20, 150);
    doc.text(`Student Coordinator: ${student}`, 20, 160);

    doc.save("VIT_Invitation.pdf");
};
