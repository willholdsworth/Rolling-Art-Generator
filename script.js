window.addEventListener('DOMContentLoaded', (event) => {
    const cnv = document.getElementById('cnv');
    const ctx = cnv.getContext('2d');
    let fn = document.getElementById('fn').value, upImg, imgData;

    function drawCnv() {
        const cW = getNum('cW');
        const cH = getNum('cH');
        const fH1 = getNum('fH1');
        const fH2 = getNum('fH2');
        const fH3 = getNum('fH3');
        cnv.width = cW;
        cnv.height = cH;
        ctx.clearRect(0, 0, cW, cH);
        drawRect(0, fH1 + fH2, cW, fH3, 'grey');
        if (upImg) {
            drawImgPreview(upImg, cW, fH1 + fH2, fH3);
        }
        drawLn(cW, cH, [fH1, fH1 + fH2, fH1 + fH2 + fH3]);
        drawTxt(cW, cH);
    }

    function getNum(id) {
        return parseFloat(document.getElementById(id).value);
    }

    function drawRect(x, y, w, h, col) {
        ctx.fillStyle = col;
        ctx.fillRect(x, y, w, h);
    }

    function drawImgPreview(img, cW, y, h) {
        const scl = Math.max(cW / img.width, h / img.height);
        const sW = img.width * scl;
        const sH = img.height * scl;
        ctx.save();
        ctx.beginPath();
        ctx.rect(0, y, cW, h);
        ctx.clip();
        ctx.drawImage(img, (cW - sW) / 2, y + (h - sH) / 2, sW, sH);
        ctx.restore();
    }

    function drawLn(cW, cH, hs) {
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 1;
        ctx.strokeRect(0, 0, cW, cH);
        hs.forEach(h => {
            ctx.beginPath();
            ctx.moveTo(0, h);
            ctx.lineTo(cW, h);
            ctx.stroke();
        });
    }

    function drawTxt(cW, cH) {
        ctx.font = '2mm Arial';
        ctx.fillStyle = 'black';
        ctx.textAlign = 'center';
        ctx.fillText('WELD ZIP PROFILE HERE', cW / 2, 9);
        ctx.fillText('APPLY TUBE TO THIS FACE', cW / 2, cH - 2);
        ctx.textAlign = 'left';
        ctx.fillText(fn, 15, 9);
    }

    function genPDF() {
        const cW = getNum('cW');
        const cH = getNum('cH');
        const fH1 = getNum('fH1');
        const fH2 = getNum('fH2');
        const fH3 = getNum('fH3');
        fn = document.getElementById('fn').value || 'default_filename';
        const aFH2 = fH1 + fH2;
        const aH = fH1 + fH2 + fH3;

        const cWPoints = cW * 72 / 25.4;
        const cHPoints = cH * 72 / 25.4;

        const pdf = new jsPDF({
            orientation: cW > cH ? 'landscape' : 'portrait',
            unit: 'pt',
            format: [cWPoints, cHPoints]
        });

        if (upImg) {
            const scl = Math.max(cW / upImg.width, fH3 / upImg.height);
            const sW = upImg.width * scl;
            const sH = upImg.height * scl;
            const imgX = (cWPoints - sW * 72 / 25.4) / 2;
            const imgY = (aFH2 + fH3 / 2) * 72 / 25.4 - (sH * 72 / 25.4) / 2;

            pdf.addImage(upImg.src, 'PNG', imgX, imgY, sW * 72 / 25.4, sH * 72 / 25.4);
        }

        // Draw white rectangles
        pdf.setFillColor(255, 255, 255);
        pdf.rect(0, 0, cWPoints, (fH1 + fH2) * 72 / 25.4, 'F');
        pdf.rect(0, aH * 72 / 25.4, cWPoints, (cH - aH) * 72 / 25.4, 'F');

        pdf.setLineWidth(0.1 * 72 / 25.4);
        pdf.rect(0, 0, cWPoints, cHPoints);
        pdf.line(5 * 72 / 25.4, 0, 5 * 72 / 25.4, cHPoints);
        pdf.line((cW - 5) * 72 / 25.4, 0, (cW - 5) * 72 / 25.4, cHPoints);
        pdf.line(0, fH1 * 72 / 25.4, cWPoints, fH1 * 72 / 25.4);
        pdf.line(0, aFH2 * 72 / 25.4, cWPoints, aFH2 * 72 / 25.4);
        pdf.line(0, aH * 72 / 25.4, cWPoints, aH * 72 / 25.4);

        pdf.setFont("Helvetica", 2 * 72 / 25.4);
        pdf.text('WELD ZIP PROFILE HERE', cW / 2 * 72 / 25.4, 9 * 72 / 25.4, { align: 'center' });
        pdf.text('APPLY TUBE TO THIS FACE', cW / 2 * 72 / 25.4, (cH - 2) * 72 / 25.4, { align: 'center' });
        pdf.text(fn, 15 * 72 / 25.4, 9 * 72 / 25.4);

        pdf.save(`${fn}.pdf`);
    }

    function handleImgUp(event) {
        const rdr = new FileReader();
        rdr.onload = function(event) {
            upImg = new Image();
            upImg.onload = function() {
                drawCnv();
            };
            upImg.src = event.target.result;
        };
        rdr.readAsDataURL(event.target.files[0]);
    }

    function rmvImg() {
        upImg = null;
        imgData = null;
        drawCnv();
    }

    document.getElementById('fn').addEventListener('input', function() {
        fn = this.value;
        drawCnv();
    });

    ['cW', 'cH', 'fH1', 'fH2', 'fH3'].forEach(id => {
        document.getElementById(id).addEventListener('input', drawCnv);
    });

    document.getElementById('genBtn').addEventListener('click', genPDF);
    document.getElementById('imgLdr').addEventListener('change', handleImgUp);
    document.getElementById('upBtn').addEventListener('click', () => document.getElementById('imgLdr').click());
    document.getElementById('rmvBtn').addEventListener('click', rmvImg);

    drawCnv();
});
