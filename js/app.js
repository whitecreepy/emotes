let gCanvas = undefined;

symbols = ['.', ':', '#', String.fromCharCode(9607)];


Array.matrix = function(numrows, numcols, initial) {
    let arr = [];
    for (let i = 0; i < numrows; ++i) {
        let columns = [];
        for (let j = 0; j < numcols; ++j) {
            columns[j] = 0;
        }
        arr[i] = columns;
    }
    return arr;
};


function handleFileSelect(evt) {
    let file = evt.target.files[0];
    console.log(file.name);

    if (file) {
        let reader = new FileReader();
        reader.onload = function(e) {
            let img = new Image();
            img.src = e.target.result;

            img.onload = function () {
                console.log("LOADED");
                gCanvas = resizeImage(this, file);

                document.getElementById('preview').src = gCanvas.toDataURL(file.type);
            };

        };
        reader.readAsDataURL(file);
    }

}


document.getElementById('myFile').addEventListener('change', handleFileSelect, false);


function processRequest() {
    var ctx = gCanvas.getContext("2d");
    console.log(ctx);
    let imgData = ctx.getImageData(0, 0, gCanvas.width, gCanvas.height);

    makeItGray(imgData);

    ctx.putImageData(imgData, 0, 0);

    document.getElementById('preview2').src = gCanvas.toDataURL();

    let matr = getMatrixFromImageData(imgData);
    console.log(matr)

    // let pic = getCurrentPicture();
    // let ascii = getAsciiPictureRepresentation(pic);
    // drawTheResult(ascii)
}


function generateTextImage(dataArray) {
    let text = [];
    for (let i = 0; i < dataArray.length; i += 1) {
        text.push(symbols[dataArray[i]])
    }

    return text.join("")
}


function getMatrixFromImageData(imgData) {
    // let res = Array.matrix(50, 50, 0);
    // let res = new Array(5).fill(0).map(() => new Array(4).fill(0));
    let res = new Array(50*50).fill(0);
    // matrix [i][j] -> arr [ i*m + j ]

    for (let i = 0, j = 0; i < imgData.data.length; i += 4, j += 1) {
        // console.log(j, Math.floor(j / 50), j % 50);
        res[j] =
            imgData.data[i] +
            imgData.data[i + 1] +
            imgData.data[i + 2] +
            imgData.data[i + 3]
    }

    return res
}

function printResultToTextArea(str) {
    document.getElementById("pictext").value = str
}

function makeItGray(imageData) {
    for (var i = 0; i < imageData.data.length; i+=4) {
        imageData.data[i] = imageData.data[i+1] = imageData.data[i+2];
        imageData.data[i+3] = 255;
    }
}

function getCurrentPicture() {
    let img = document.getElementById("preview");
    console.log(img);
    return img
}

function getAsciiPictureRepresentation(pic) {
    var ctx = pic.getContext("2d");
    let imgData = ctx.getImageData(0, 0, pic.width, pic.height);
    console.log(imgData);
    return undefined;
}

function drawTheResult(asciiText) {
    alert(asciiText)
}

function resizeImage(img, file) {
    var canvas = document.createElement("canvas");
    var ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0);

    var MAX_WIDTH = 400;
    var MAX_HEIGHT = 400;
    var width = img.width;
    var height = img.height;

    if (width > height) {
        if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
        }
    } else {
        if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
        }
    }

    canvas.width = width;
    canvas.height = height;
    var ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0, width, height);

    // dataurl = canvas.toDataURL(file.type);

    return canvas;
}