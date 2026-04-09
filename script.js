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

    // 1. HEADER LOGOS (Placeholder Text)
    doc.setFont("helvetica", "bold");
    doc.setTextColor(26, 35, 126);
    doc.setFontSize(22);
    doc.text("VIT", 105, 18, { align: "center" });
    doc.setFontSize(8);
    doc.text("Vellore Institute of Technology", 105, 22, { align: "center" });
    doc.setDrawColor(200, 200, 200);
    doc.line(15, 25, 195, 25);

    // 2. EVENT TITLES
    const title = document.getElementById("title").value || "CRICKET TALK";
    const subtitle = document.getElementById("subtitle").value || "CRICKET MEET STUDENTS";
    const desc = document.getElementById("description").value || "";

    doc.setFontSize(24);
    doc.text(title.toUpperCase(), 105, 40, { align: "center" });
    doc.setFontSize(14);
    doc.setTextColor(100, 100, 100);
    doc.text(subtitle, 105, 50, { align: "center" });

    // 3. GUEST CARDS
    doc.setFillColor(30, 136, 229);
    doc.roundedRect(25, 95, 75, 95, 8, 8, 'F');
    doc.roundedRect(110, 95, 75, 95, 8, 8, 'F');

    const g1 = document.getElementById("guest1Photo").files[0];
    if (g1) { doc.addImage(await getBase64(g1), 'JPEG', 32.5, 100, 60, 55); }
    const g2 = document.getElementById("guest2Photo").files[0];
    if (g2) { doc.addImage(await getBase64(g2), 'JPEG', 117.5, 100, 60, 55); }

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(11);
    doc.text((document.getElementById("guest1Name").value || "MS DHONI").toUpperCase(), 62.5, 170, { align: "center" });
    doc.text((document.getElementById("guest2Name").value || "VIRAT KOHLI").toUpperCase(), 147.5, 170, { align: "center" });
    doc.setFontSize(9);
    doc.text(document.getElementById("guest1Role").value || "CRICKETER", 62.5, 180, { align: "center" });
    doc.text(document.getElementById("guest2Role").value || "CRICKETER", 147.5, 180, { align: "center" });

    // 4. EVENT DETAILS
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(10);
    doc.text(`DATE  : ${document.getElementById("date").value || "11/6/2026"}`, 25, 215);
    doc.text(`TIME  : ${document.getElementById("time").value || "1.00 PM"}`, 25, 225);
    doc.text(`VENUE : ${document.getElementById("venue").value || "AMBEDKAR AUDITORIUM"}`, 25, 235);

    // 5. SMART QR CODE
    const qrData = `EVENT: ${title}\nVENUE: ${document.getElementById("venue").value}`;
    const qrDiv = document.createElement("div");
    new QRCode(qrDiv, { text: qrData, width: 128, height: 128 });

    setTimeout(() => {
        const canvas = qrDiv.querySelector("canvas");
        if (canvas) { doc.addImage(canvas.toDataURL("image/png"), 'PNG', 145, 205, 35, 35); }

        // 6. COORDINATORS (FIXED: Showing both Label and Name)
        const facName = document.getElementById("facultyName").value || "SURESH";
        const stuName = document.getElementById("studentName").value || "DHANUSH";

        doc.setFillColor(149, 117, 205);
        doc.roundedRect(25, 250, 75, 28, 10, 10, 'F'); // Faculty Box
        doc.roundedRect(110, 250, 75, 28, 10, 10, 'F'); // Student Box

        doc.setTextColor(255, 255, 255);
        doc.setFontSize(8);
        // Top Labels
        doc.text("FACULTY COORDINATOR", 62.5, 258, { align: "center" });
        doc.text("STUDENT COORDINATOR", 147.5, 258, { align: "center" });
        // Actual Names
        doc.setFontSize(11);
        doc.text(facName.toUpperCase(), 62.5, 266, { align: "center" });
        doc.text(stuName.toUpperCase(), 147.5, 266, { align: "center" });

        // 7. FOOTER BAR
        doc.setFillColor(30, 136, 229);
        doc.rect(0, 288, 210, 9, 'F');
        doc.setFontSize(8);
        doc.text("instagram: @vit_university", 20, 294);
        doc.text("email: events@vit.ac.in", 105, 294, { align: "center" });
        doc.text("linkedin: VIT-Vellore", 160, 294);

        doc.save("VIT_Official_Invitation.pdf");
    }, 600);
};
