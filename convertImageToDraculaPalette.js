$(document).ready(function () {
    $('#convertButton').on('click', function() {
        convertImageToDraculaPalette();
    });

    const draculaPalette = [
        [40, 42, 54],   // Dark
        [68, 71, 90],   // Mid
        [248, 248, 242] // White
    ];

    const $imageInput = $("#imageInput");
    const $canvas = $("#imageCanvas");
    const ctx = $canvas[0].getContext("2d");

    $imageInput.on("change", function (event) {
        const file = event.target.files[0];
        if (file) {
            const img = new Image();
            img.onload = function () {
                $canvas.attr("width", img.width);
                $canvas.attr("height", img.height);
                ctx.drawImage(img, 0, 0);
                $('#convertButton').prop('disabled', false).text("Convert to Dracula Palette");
            };
            img.src = URL.createObjectURL(file);
        }
    });

    function RGBToGrayScale(red,green,blue){
        // return red * 0.2126 + green * 0.7152 + blue * 0.0722;
        return (red * 6966 + green * 23436 + blue * 2366) >> 15;
    }

    function colorize(imageData, black = [40, 42, 54], white = [248, 248, 242], mid = [68, 71, 90]) {
        const pixels = imageData.data;
    
        for (let i = 0; i < pixels.length; i += 4) {
            const grayscale = pixels[i];
    
            let color;
            if (grayscale < 128) {
                const ratio = grayscale / 128;
                color = black.map((c, idx) => Math.round(c + ratio * (mid[idx] - c)));
            } else {
                const ratio = (grayscale - 128) / 127;
                color = mid.map((c, idx) => Math.round(c + ratio * (white[idx] - c)));
            }
    
            pixels[i] = color[0];     // Red
            pixels[i + 1] = color[1]; // Green
            pixels[i + 2] = color[2]; // Blue
            // Alpha channel remains unchanged
        }
    
        return imageData;
    }

    function convertImageToDraculaPalette() {
        const imageData = ctx.getImageData(0, 0, $canvas.attr("width"), $canvas.attr("height"));
        const pixels = imageData.data;
        
        // Convert to grayscale
        for (var i = 0; i < pixels.length; i += 4) {
            const red = pixels[i];
            const green = pixels[i + 1];
            const blue = pixels[i + 2];
            const grayscale = RGBToGrayScale(red, green, blue)
            pixels[i] = grayscale;
            pixels[i + 1] = grayscale;
            pixels[i + 2] = grayscale;
        }

        // Apply Dracula palette
        const coloredImageData = colorize(imageData, [40, 42, 54], [248, 248, 242], [68, 71, 90]);

        ctx.putImageData(imageData, 0, 0);
        $('#convertButton').prop('disabled', true).text("Converted :)");
    }
});
