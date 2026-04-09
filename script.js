// Function to convert image file to Base64 (needed for jsPDF)
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
    const w = 210; // Page width

    // 1. Get Form Values
    const title = document.getElementById("title").value || "EVENT TITLE";
    const subtitle = document.getElementById("subtitle").value || "SUBTITLE";
    const desc = document.getElementById("description").value || "";
    const date = document.getElementById("date").value || "Date";
    const time = document.getElementById("time").value || "Time";
    const venue = document.getElementById("venue").value || "Venue";
    const guest1Name = document.getElementById("guest1Name").value || "Guest 1";
    const guest1Role = document.getElementById("guest1Role").value || "Role";
    const guest2Name = document.getElementById("guest2Name").value || "Guest 2";
    const guest2Role = document.getElementById("guest2Role").value || "Role";
    const faculty = document.getElementById("facultyName").value || "Faculty Name";
    const student = document.getElementById("studentName").value || "Student Name";
    const qrLink = document.getElementById("eventLink").value || "https://vit.ac.in";

    // 2. Title Section
    doc.setFont("helvetica", "bold");
    doc.setTextColor(26, 35, 126); // Dark Blue
    doc.setFontSize(26);
    doc.text(title, w / 2, 40, { align: "center" });
    
    doc.setFontSize(16);
    doc.text(subtitle, w / 2, 50, { align: "center" });

    // 3. Description Section
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(60, 60, 60);
    const splitDesc = doc.splitTextToSize(desc, 160);
    doc.text(splitDesc, w / 2, 65, { align: "center" });

    // 4. Panel Members Section Title
    doc.setFontSize(14);
    doc.setTextColor(0, 0, 0);
    doc.text("Panel Members :", 30, 95);

    // 5. Guest Boxes and Images (The MS Dhoni/Virat Kohli Look)
    doc.setFillColor(30, 136, 229); // Royal Blue for guest boxes

    // Guest 1
    doc.roundedRect(30, 105, 70, 110, 10, 10, 'F');
    const g1PhotoFile = document.getElementById("guest1Photo").files[0];
    if (g1PhotoFile) {
        try {
            const g1PhotoBase64 = await getBase64(g1PhotoFile);
            doc.addImage(g1PhotoBase64, 'JPEG', 40, 115, 50, 50); // Image size 50x50
        } catch (e) { console.log("Guest 1 photo error"); }
    }
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(10);
    doc.text(guest1Name, 65, 175, { align: "center" });
    doc.setFontSize(8);
    doc.text(guest1Role, 65, 185, { align: "center" });

    // Guest 2
    doc.roundedRect(110, 105, 70, 110, 10, 10, 'F');
    const g2PhotoFile = document.getElementById("guest2Photo").files[0];
    if (g2PhotoFile) {
        try {
            const g2PhotoBase64 = await getBase64(g2PhotoFile);
            doc.addImage(g2PhotoBase64, 'JPEG', 120, 115, 50, 50);
        } catch (e) { console.log("Guest 2 photo error"); }
    }
    doc.text(guest2Name, 145, 175, { align: "center" });
    doc.text(guest2Role, 145, 185, { align: "center" });

    // 6. Event Details (Icons and Text)
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(10);
    doc.text(`📅 ${date}`, 30, 230);
    doc.text(`🕒 ${time}`, 30, 240);
    doc.text(`📍 ${venue}`, 30, 250);

    // 7. QR Code Section
    doc.setFontSize(8);
    doc.text("Scan for Event Details", 145, 220, { align: "center" });
    const qrDiv = document.createElement("div");
    new QRCode(qrDiv, qrLink);
    
    setTimeout(() => {
        const qrCanvas = qrDiv.querySelector("canvas");
        if (qrCanvas) {
            const qrData = qrCanvas.toDataURL("image/png");
            doc.addImage(qrData, 'PNG', 130, 225, 30, 30);
        }

        // 8. Coordinator Boxes (Purple/Blue rounded rectangles)
        doc.setFillColor(149, 117, 205);
        doc.roundedRect(30, 260, 70, 25, 10, 10, 'F'); // Faculty box
        doc.roundedRect(110, 260, 70, 25, 10, 10, 'F'); // Student box
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(8);
        doc.text("FACULTY COORDINATOR", 65, 268, { align: "center" });
        doc.text("STUDENT COORDINATOR", 145, 268, { align: "center" });
        doc.setFontSize(10);
        doc.text(faculty, 65, 278, { align: "center" });
        doc.text(student, 145, 278, { align: "center" });

        doc.save("VIT_Professional_Invitation.pdf");
    }, 500);
};
