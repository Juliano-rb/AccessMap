var Character = (function () {
    function Character(screenPercentX, screenPercentY, mx, my, canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d");
        this.screenPercentX = screenPercentX;
        this.screenPercentY = screenPercentY;
        this.x = mx;
        this.y = my;
        this.size = 15;
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
        this.ctx.arc(this.canvasX, this.canvasY, this.size, 0, 2 * Math.PI);
        this.ctx.fill();
        this.ctx.stroke();
        this.ctx.restore();
        this.ctx.closePath();
        //console.log("Desenhando personagem " + this.canvasX + ":" + this.canvasY);
    };
    Character.prototype.ajustOnScreen = function () {
        this.canvasX = this.canvas.width * this.screenPercentX;
        this.canvasY = this.canvas.height * this.screenPercentY;
    };
    return Character;
}());
