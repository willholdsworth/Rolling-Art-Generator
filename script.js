const canvas = document.getElementById('myCanvas');
const ctx = canvas.getContext('2d');

let filename = 'Rolling Artwork';

function updateCanvasSize() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); 

    const canvasWidth = parseFloat(document.getElementById('canvasWidth').value);
    const canvasHeight = parseFloat(document.getElementById('canvasHeight').value);
    const foldHeight1 = parseFloat(document.getElementById('foldHeight1').value);
    const foldHeight2 = parseFloat(document.getElementById('foldHeight2').value);
    const foldHeight3 = parseFloat(document.getElementById('foldHeight3').value);

    const adjustedFoldHeight2 = foldHeight1 + foldHeight2;
    const artworkHeight = foldHeight1 + foldHeight2 + foldHeight3;

    canvas.width = canvasWidth;
    canvas.height = canvasHeight;

    // Draw the grey rectangle
    ctx.fillStyle = 'grey';
    ctx.fillRect(0, adjustedFoldHeight2, canvasWidth, foldHeight3);

    ctx.strokeStyle = 'black';
    ctx.lineWidth = 1;
    ctx.strokeRect(0, 0, canvasWidth, canvasHeight);

    ctx.beginPath();
    ctx.moveTo(5, 0);
    ctx.lineTo(5, canvasHeight);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(canvasWidth - 5, 0);
    ctx.lineTo(canvasWidth - 5, canvasHeight);
    ctx.stroke();

    ctx.strokeStyle = 'black';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, foldHeight1);
    ctx.lineTo(canvasWidth, foldHeight1);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(0, adjustedFoldHeight2);
    ctx.lineTo(canvasWidth, adjustedFoldHeight2);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(0, artworkHeight);
    ctx.lineTo(canvasWidth, artworkHeight);
    ctx.stroke();

    ctx.font = '2mm Arial';
    ctx.fillStyle = 'black';
    ctx.textAlign = 'center';
    ctx.fillText('WELD ZIP PROFILE HERE', canvasWidth / 2, 9);

    ctx.fillText('APPLY TUBE TO THIS FACE', canvasWidth / 2, canvasHeight - 2);

    ctx.font = '2mm Arial';
    ctx.fillStyle = 'black';
    ctx.textAlign = 'left'; 
    ctx.fillText(filename, 15, 9);
}

function updateFilename() {
    filename = document.getElementById('filename').value || 'Rolling Artwork';
    updateCanvasSize(); 
}

document.getElementById('filename').addEventListener('input', updateFilename);
document.getElementById('foldHeight1').addEventListener('input', updateCanvasSize); 
document.getElementById('foldHeight2').addEventListener('input', updateCanvasSize); 
document.getElementById('foldHeight3').addEventListener('input', updateCanvasSize); 
document.getElementById('canvasWidth').addEventListener('input', updateCanvasSize); 
document.getElementById('canvasHeight').addEventListener('input', updateCanvasSize); 

document.getElementById('generateButton').addEventListener('click', generateSVG);

function generateSVG() {
    const canvasWidth = parseFloat(document.getElementById('canvasWidth').value);
    const canvasHeight = parseFloat(document.getElementById('canvasHeight').value);
    const foldHeight1 = parseFloat(document.getElementById('foldHeight1').value);
    const foldHeight2 = parseFloat(document.getElementById('foldHeight2').value);
    const foldHeight3 = parseFloat(document.getElementById('foldHeight3').value);

    filename = document.getElementById('filename').value || 'default_filename';

    const adjustedFoldHeight2 = foldHeight1 + foldHeight2;
    const artworkHeight = foldHeight1 + foldHeight2 + foldHeight3;

    const svgContent = `
        <svg width="${canvasWidth}mm" height="${canvasHeight}mm" xmlns="http://www.w3.org/2000/svg">
            <!-- Draw the grey rectangle -->
            <rect x="0" y="${adjustedFoldHeight2}mm" width="${canvasWidth}mm" height="${foldHeight3}mm" fill="grey" />
            <!-- Draw canvas dimensions -->
            <rect x="0" y="0" width="${canvasWidth}mm" height="${canvasHeight}mm" fill="none" stroke="black" stroke-width="0.1" />
            <!-- Draw vertical lines -->
            <line x1="5mm" y1="0" x2="5mm" y2="${canvasHeight}mm" stroke="black" stroke-width="0.1" />
            <line x1="${canvasWidth - 5}mm" y1="0" x2="${canvasWidth - 5}mm" y2="${canvasHeight}mm" stroke="black" stroke-width="0.1" />
            <!-- Draw horizontal lines -->
            <line x1="0" y1="${foldHeight1}mm" x2="${canvasWidth}mm" y2="${foldHeight1}mm" stroke="black" stroke-width="0.1" />
            <line x1="0" y1="${adjustedFoldHeight2}mm" x2="${canvasWidth}mm" y2="${adjustedFoldHeight2}mm" stroke="black" stroke-width="0.1" />
            <!-- Draw a line at the Artwork Height -->
            <line x1="0" y1="${artworkHeight}mm" x2="${canvasWidth}mm" y2="${artworkHeight}mm" stroke="black" stroke-width="0.1" />
            <!-- Add text -->
            <text x="${canvasWidth / 2}mm" y="9mm" font-family="Arial" font-size="2mm" text-anchor="middle">WELD ZIP PROFILE HERE</text>
            <text x="${canvasWidth / 2}mm" y="${canvasHeight - 2}mm" font-family="Arial" font-size="2mm" text-anchor="middle">APPLY TUBE TO THIS FACE</text>
            <text x="15mm" y="9mm" font-family="Arial" font-size="2mm" text-anchor="left">${filename}</text>
        </svg>
    `;

    const blob = new Blob([svgContent], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = `${filename}.svg`;
    a.click();

    URL.revokeObjectURL(url);
}

updateCanvasSize();
