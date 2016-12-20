var Creator = (function () {
    function Creator() {
    }
    Creator.inicialize = function () {
        Creator.canvas = document.getElementById("canvas");
        Creator.canvasCtx = Creator.canvas.getContext("2d");
    };
    Creator.getCoordinates = function (e) {
        var x = e.clientX;
        var y = e.clientY;
        Creator.inicialize();
        if (Creator.countOfCoordinates > 0 && Creator.countOfCoordinates % 2 != 0) {
            Creator.canvasCtx.lineTo(x, y);
            Creator.canvasCtx.stroke();
        }
        else {
            Creator.canvasCtx.moveTo(x, y);
        }
        Creator.countOfCoordinates++;
    };
    return Creator;
}());
Creator.countOfCoordinates = 0;
