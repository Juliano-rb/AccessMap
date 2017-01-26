var Character = (function () {
    function Character(screenPercentX, screenPercentY, mx, my, canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d");
        this.screenPercentX = screenPercentX;
        this.screenPercentY = screenPercentY;
        this.x = mx;
        this.y = my;
        this.size = 2;
        //Calcula as coordenadas do personagem no canvas
        this.ajustOnScreen();
        this.update();
    }
    Character.prototype.update = function () {
        this.updateCoord();
        console.log("Char: " + this.x + "," + this.y);
        //this.ajustOnScreen();
        this.draw();
    };
    Character.prototype.updateCoord = function () {
        var coord = mapMgr.canvasCoordToMap(this.canvasX, this.canvasY);
        this.x = coord.x;
        this.y = coord.y;
        //this.ajustOnScreen();
        //this.draw();
    };
    Character.prototype.draw = function () {
        this.ctx.save();
        this.ctx.fillStyle = 'green';
        this.ctx.lineWidth = 1;
        this.ctx.strokeStyle = "gray";
        this.ctx.beginPath();
        console.log("Desenhando raio: " + this.rsize);
        this.ctx.arc(this.canvasX, this.canvasY, this.rsize, 0, 2 * Math.PI);
        this.ctx.fill();
        this.ctx.stroke();
        this.ctx.closePath();
        this.ctx.font = "15px Arial";
        this.ctx.fillText("( " + this.x.toFixed(2) + "," + this.y.toFixed(2) + " )", this.canvasX, this.canvasY - this.rsize);
        this.ctx.restore();
        //console.log("Desenhando personagem " + this.canvasX + ":" + this.canvasY);
    };
    Character.prototype.ajustOnScreen = function () {
        this.canvasX = this.canvas.width * this.screenPercentX;
        this.canvasY = this.canvas.height * this.screenPercentY;
    };
    Object.defineProperty(Character.prototype, "rsize", {
        get: function () {
            return this.size * config.proportion;
        },
        enumerable: true,
        configurable: true
    });
    return Character;
}());
