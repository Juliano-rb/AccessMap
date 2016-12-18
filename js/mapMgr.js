var MapMgr = (function () {
    function MapMgr(canvas) {
        this.canvas = canvas;
        this.wallWidth = 2;
        this.wallColor = "blue";
        this.failColor = "red";
        this.proportion = 1;
        this.drawPosX = 0;
        this.drawPosY = 0;
        this.andarAt = 0;
        this.ctx = this.canvas.getContext("2d");
    }
    MapMgr.prototype.loadMap = function (map, andar) {
        console.log("Carregando mapa " + map[0].nome + "...");
        this.walls = map[this.andarAt].paredes;
        this.fails = map[this.andarAt].falhas;
        this.andares = map[this.andarAt].andares;
        this.bgImg = new Image();
        this.bgImg.src = map[0].fundo;
        this.bgImg.onload = function () {
            console.log("Terminou de carregar:" + this.width + "x" + this.height);
        };
    };
    MapMgr.prototype.drawMap = function () {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        console.log("Desenhando imagem de fundo " + this.bgImg.src);
        this.ctx.drawImage(this.bgImg, this.drawPosX, this.drawPosY, this.bgImg.width * this.proportion, this.bgImg.height * this.proportion);
        this.drawWalls();
        this.drawFails();
    };
    MapMgr.prototype.drawWalls = function () {
        this.ctx.save();
        console.log("Desenhando paredes...");
        this.ctx.strokeStyle = this.wallColor;
        this.ctx.lineWidth = this.wallWidth;
        var i = 0;
        while (this.walls[i]) {
            this.ctx.beginPath();
            this.ctx.moveTo(this.walls[i].x0, this.walls[i].y0);
            this.ctx.lineTo(this.walls[i].x1, this.walls[i].y1);
            this.ctx.stroke();
            i++;
        }
        this.ctx.restore();
    };
    MapMgr.prototype.drawFails = function () {
        this.ctx.save();
        console.log("Desenhando falhas...");
        this.ctx.fillStyle = this.failColor;
        this.ctx.lineWidth = this.wallWidth;
        var i = 0;
        while (this.fails[i]) {
            this.ctx.beginPath();
            var fail = this.fails[i];
            this.ctx.fillRect(fail.x, fail.y, fail.width, fail.height);
            this.ctx.fill();
            i++;
        }
        this.ctx.restore();
    };
    Object.defineProperty(MapMgr.prototype, "bg", {
        get: function () {
            return this.bgImg;
        },
        enumerable: true,
        configurable: true
    });
    return MapMgr;
}());
