let imageBytes = null;
let imageFileName = "converted";
let originalImage = null;

document.getElementById("imageInput").addEventListener("change", async (e) => {
  const file = e.target.files[0];
  if (!file) return;
  if (file.size > 5 * 1024 * 1024) {
    alert("❗ Image too large. Max size supported is 5MB.");
    return;
  }

  imageFileName = file.name.split('.').slice(0, -1).join('.') || "converted";
  const reader = new FileReader();
  reader.onload = () => {
    imageBytes = new Uint8Array(reader.result);
    const imgURL = URL.createObjectURL(file);
    originalImage = imgURL;
    document.getElementById("previewContainer").innerHTML = `<img src="${imgURL}" alt="preview" id="previewImg" style="display:none" />`;
    document.getElementById("convertBtn").disabled = false;
    document.getElementById("viewBtn").disabled = false;
    document.getElementById("filterBtn").disabled = false;
    document.getElementById("downloadBtn").disabled = true;
  };
  reader.readAsArrayBuffer(file);
});

document.getElementById("viewBtn").addEventListener("click", () => {
  const img = document.getElementById("previewImg");
  if (img) img.style.display = img.style.display === "none" ? "block" : "none";
});

document.getElementById("filterBtn").addEventListener("click", () => {
  const img = document.getElementById("previewImg");
  if (!img) return;
  img.style.filter = "grayscale(1) contrast(1.4)";
  img.style.display = "block";
});

document.getElementById("convertBtn").addEventListener("click", async () => {
  if (!imageBytes) return;
  const btn = document.getElementById("convertBtn");
  btn.textContent = "🛠️ Converting...";
  btn.disabled = true;

  const pdfDoc = await PDFLib.PDFDocument.create();
  const img = await pdfDoc.embedJpg(imageBytes).catch(() => pdfDoc.embedPng(imageBytes));
  const page = pdfDoc.addPage([img.width, img.height]);
  page.drawImage(img, { x: 0, y: 0, width: img.width, height: img.height });

  const pdfBytes = await pdfDoc.save();
  const blob = new Blob([pdfBytes], { type: "application/pdf" });
  const url = URL.createObjectURL(blob);

  const downloadBtn = document.getElementById("downloadBtn");
  downloadBtn.disabled = false;
  downloadBtn.onclick = () => {
    const a = document.createElement("a");
    a.href = url;
    a.download = imageFileName + ".pdf";
    a.click();
  };
  btn.textContent = "Convert to PDF";
});

setTimeout(() => {
  const adTest = document.createElement("div");
  adTest.innerHTML = "&nbsp;";
  adTest.className = "adsbox";
  adTest.style.display = "none";
  document.body.appendChild(adTest);
  if (adTest.offsetHeight === 0) {
    document.getElementById("adblockNotice").classList.remove("hidden");
  }
  adTest.remove();
}, 1000);