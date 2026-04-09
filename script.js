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

    // 1. Setup Background and Borders
    doc.setFillColor(255, 255, 255);
    doc.rect(0, 0, 210, 297, 'F');
    doc.setDrawColor(26, 35, 126);
    doc.setLineWidth(1.5);
    doc.rect(5, 5, 200, 287); // Main border

    // 2. Header Section
    const title = document.getElementById("title").value || "EVENT TITLE";
    const subtitle = document.getElementById("subtitle").value || "";
    doc.setFont("helvetica", "bold");
    doc.setTextColor(26, 35, 126);
    doc.setFontSize(22);
    doc.text(title.toUpperCase(), 105, 30, { align: "center" });
    
    doc.setFontSize(14);
    doc.setTextColor(80, 80, 80);
    doc.text(subtitle, 105, 40, { align: "center" });

    // 3. Guest Card Logic
    const g1Name = document.getElementById("guest1Name").value || "Guest 1";
    const g1Role = document.getElementById("guest1Role").value || "Speaker";
    const g2Name = document.getElementById("guest2Name").value || "Guest 2";
    const g2Role = document.getElementById("guest2Role").value || "Speaker";

    doc.setFillColor(30, 136, 229); // Blue for cards
    doc.roundedRect(20, 75, 80, 100, 5, 5, 'F');
    doc.roundedRect(110, 75, 80, 100, 5, 5, 'F');

    const g1File = document.getElementById("guest1Photo").files[0];
    if (g1File) {
        const b1 = await getBase64(g1File);
        doc.addImage(b1, 'JPEG', 30, 80, 60, 60); 
    }
    const g2File = document.getElementById("guest2Photo").files[0];
    if (g2File) {
        const b2 = await getBase64(g2File);
        doc.addImage(b2, 'JPEG', 120, 80, 60, 60);
    }

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(12);
    doc.text(g1Name.toUpperCase(), 60, 150, { align: "center" });
    doc.setFontSize(10);
    doc.text(g1Role, 60, 160, { align: "center" });

    doc.setFontSize(12);
    doc.text(g2Name.toUpperCase(), 150, 150, { align: "center" });
    doc.setFontSize(10);
    doc.text(g2Role, 150, 160, { align: "center" });

    // 4. Event Info Section
    const date = document.getElementById("date").value || "TBA";
    const time = document.getElementById("time").value || "TBA";
    const venue = document.getElementById("venue").value || "TBA";

    doc.setTextColor(0, 0, 0);
    doc.setFont("helvetica", "bold");
    doc.text(`Date: ${date}`, 30, 210);
    doc.text(`Time: ${time}`, 30, 220);
    doc.text(`Venue: ${venue}`, 30, 230);

    // 5. Smart QR Code
    const qrData = `EVENT: ${title}\nDATE: ${date}\nVENUE: ${venue}`;
    const qrDiv = document.createElement("div");
    new QRCode(qrDiv, { text: qrData, width: 128, height: 128 });

    setTimeout(() => {
        const canvas = qrDiv.querySelector("canvas");
        if (canvas) {
            const img = canvas.toDataURL("image/png");
            doc.addImage(img, 'PNG', 140, 200, 40, 40);
        }

        // 6. Coordinator Section
        const fac = document.getElementById("facultyName").value || "Faculty";
        const stu = document.getElementById("studentName").value || "Student";
        doc.setFillColor(149, 117, 205); // Purple
        doc.roundedRect(20, 255, 80, 25, 5, 5, 'F');
        doc.roundedRect(110, 255, 80, 25, 5, 5, 'F');
        doc.setTextColor(255, 255, 255);
        doc.text(fac, 60, 270, { align: "center" });
        doc.text(stu, 150, 270, { align: "center" });

        doc.save("VIT_Official_Invitation.pdf");
    }, 600);
};
