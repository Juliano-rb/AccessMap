var Controller = (function () {
    function Controller() {
        console.log("Inicializando controller");
        this.inicio = document.getElementById("inicio");
        this.aviso = document.getElementById("aviso");
        this.debug = document.getElementById("debug");
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
    };
    Controller.prototype.resizeCanvas = function () {
        console.log("redmensionou");
        var canvas = document.getElementById("canvas");
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    };
    return Controller;
}());
