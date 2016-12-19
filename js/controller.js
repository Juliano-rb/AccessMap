var Controller = (function () {
    function Controller() {
        console.log("Inicializando controller");
        this.inicio = document.getElementById("inicio");
        this.aviso = document.getElementById("aviso");
        this.debug = document.getElementById("debug");
        this.canvasElement = document.getElementById("canvas");
        this.canvasCtx = this.canvas.getContext("2d");
        this.view("inicio");
        this.registerEvents();
    }
    Controller.prototype.view = function (nome) {
        console.log("mudando para tela: " + nome);
        switch (nome) {
            case "inicio":
                this.inicio.style.display = "block";
                this.aviso.style.display = "none";
                this.debug.style.display = "none";
                break;
            case "aviso":
                this.inicio.style.display = "none";
                this.aviso.style.display = "block";
                this.debug.style.display = "none";
                break;
            case "debug":
                this.inicio.style.display = "none";
                this.aviso.style.display = "none";
                this.debug.style.display = "block";
                break;
            case "":
                this.inicio.style.display = "none";
                this.aviso.style.display = "none";
                this.debug.style.display = "none";
                break;
        }
    };
    Controller.prototype.registerEvents = function () {
        window.onresize = this.resizeCanvas;
        document.getElementById("body").addEventListener("keydown", function (evento) {
            if (evento.keyCode == 39) {
                mapMgr.moveLeft(10);
                mapMgr.drawMap();
            }
            else if (evento.keyCode == 37) {
                mapMgr.moveRight(10);
                mapMgr.drawMap();
            }
            if (evento.keyCode == 38) {
                mapMgr.moveDown(10);
                mapMgr.drawMap();
            }
            else if (evento.keyCode == 40) {
                mapMgr.moveUp(10);
                mapMgr.drawMap();
            }
        });
    };
    Controller.prototype.resizeCanvas = function () {
        console.log("redmensionou");
        var canvas = document.getElementById("canvas");
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        mapMgr.drawMap();
    };
    Object.defineProperty(Controller.prototype, "ctx", {
        get: function () {
            return this.canvasCtx;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Controller.prototype, "canvas", {
        get: function () {
            return this.canvasElement;
        },
        enumerable: true,
        configurable: true
    });
    return Controller;
}());
