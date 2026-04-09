const getBase64 = (file) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
    });
};

window.downloadPDF = async function () {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    const w = 210;
    const h = 297;

    doc.setFillColor(253, 253, 255);
    doc.rect(0, 0, w, h, 'F');
    doc.setDrawColor(26, 35, 126);
    doc.setLineWidth(1.5);
    doc.rect(5, 5, w - 10, h - 10);
    doc.setLineWidth(0.5);
    doc.rect(7, 7, w - 14, h - 14);

    const title = document.getElementById("title").value || "EVENT TITLE";
    const subtitle = document.getElementById("subtitle").value || "SUBTITLE";
    const desc = document.getElementById("description").value || "";
    const date = document.getElementById("date").value || "TBA";
    const time = document.getElementById("time").value || "TBA";
    const venue = document.getElementById("venue").value || "TBA";
    const guest1Name = document.getElementById("guest1Name").value || "";
    const guest1Role = document.getElementById("guest1Role").value || "";
    const guest2Name = document.getElementById("guest2Name").value || "";
    const guest2Role = document.getElementById("guest2Role").value || "";
    const faculty = document.getElementById("facultyName").value || "Faculty";
    const student = document.getElementById("studentName").value || "Student";

    doc.setFont("helvetica", "bold");
    doc.setTextColor(26, 35, 126);
    doc.setFontSize(26);
    doc.text(title.toUpperCase(), w / 2, 40, { align: "center" });
    doc.setFontSize(14);
    doc.setTextColor(100, 100, 100);
    doc.text(subtitle, w / 2, 50, { align: "center" });

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    const splitDesc = doc.splitTextToSize(desc, 160);
    doc.text(splitDesc, w / 2, 65, { align: "center" });

    doc.setFillColor(30, 136, 229);
    doc.roundedRect(25, 100, 75, 85, 8, 8, 'F');
    doc.roundedRect(110, 100, 75, 85, 8, 8, 'F');

    const g1Photo = document.getElementById("guest1Photo").files[0];
    if (g1Photo) {
        const b64 = await getBase64(g1Photo);
        doc.addImage(b64, 'JPEG', 35, 105, 55, 45);
    }
    const g2Photo = document.getElementById("guest2Photo").files[0];
    if (g2Photo) {
        const b64 = await getBase64(g2Photo);
        doc.addImage(b64, 'JPEG', 120, 105, 55, 45);
    }

    doc.setTextColor(255, 255, 255);
    doc.text(guest1Name, 62.5, 165, { align: "center" });
    doc.text(guest1Role, 62.5, 175, { align: "center" });
    doc.text(guest2Name, 147.5, 165, { align: "center" });
    doc.text(guest2Role, 147.5, 175, { align: "center" });

    doc.setTextColor(40, 40, 40);
    doc.setFont("helvetica", "bold");
    doc.text(`DATE    : ${date}`, 30, 210);
    doc.text(`TIME    : ${time}`, 30, 220);
    doc.text(`VENUE : ${venue}`, 30, 230);

    const qrData = `EVENT: ${title}\nDATE: ${date}\nVENUE: ${venue}`;
    const qrDiv = document.createElement("div");
    new QRCode(qrDiv, { text: qrData, width: 128, height: 128 });

    setTimeout(() => {
        const canvas = qrDiv.querySelector("canvas");
        if (canvas) {
            const img = canvas.toDataURL("image/png");
            doc.addImage(img, 'PNG', 150, 200, 35, 35);
            doc.setTextColor(100, 100, 100);
            doc.setFontSize(7);
            doc.text("SCAN FOR DETAILS", 167.5, 240, { align: "center" });
        }

        doc.setFillColor(149, 117, 205);
        doc.roundedRect(25, 255, 75, 22, 5, 5, 'F');
        doc.roundedRect(110, 255, 75, 22, 5, 5, 'F');
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(8);
        doc.text("FACULTY COORDINATOR", 62.5, 263, { align: "center" });
        doc.text("STUDENT COORDINATOR", 147.5, 263, { align: "center" });
        doc.setFontSize(10);
        doc.text(faculty, 62.5, 272, { align: "center" });
        doc.text(student, 147.5, 272, { align: "center" });

        doc.save("VIT_Invitation.pdf");
    }, 600);
};
