var Colision = (function () {
    function Colision() {
    }
    Colision.checkColision = function (map) {
        //Verifica se colidiu com alguma parede (não com obsctáculos)
        var isColiding = false;
        for (var i = 0; i < map.walls.length; i++) {
            if (this.isColidingCharWall(map.character, map.walls[i])) {
                isColiding = true;
                break;
            }
        }
        if (isColiding) {
            return isColiding;
        }
        else {
            for (var i = 0; i < map.fails.length; i++) {
                if (this.RectCircleColliding(map.character, map.fails[i])) {
                    isColiding = true;
                    break;
                }
            }
        }
        if (isColiding) {
            control.view("aviso");
            return isColiding;
        }
        return isColiding;
    };
    Colision.isColidingCharWall = function (c, p) {
        var dist = this.distToSegment({ x: c.x, y: c.y }, { x: p.x0, y: p.y0 }, { x: p.x1, y: p.y1 });
        console.log("O raio do personagem é:" + c.size);
        if (dist < (c.size)) {
            return true;
        }
        else
            return false;
    };
    Colision.RectCircleColliding = function (c, rect) {
        var distX = Math.abs(c.x - rect.x - rect.width / 2);
        var distY = Math.abs(c.y - rect.y - rect.height / 2);
        if (distX > (rect.width / 2 + c.size)) {
            return false;
        }
        if (distY > (rect.height / 2 + c.size)) {
            return false;
        }
        if (distX <= (rect.width / 2)) {
            return true;
        }
        if (distY <= (rect.height / 2)) {
            return true;
        }
        var dx = distX - rect.width / 2;
        var dy = distY - rect.height / 2;
        return (dx * dx + dy * dy <= (c.size * c.size));
    };
    Colision.isColidingOnFail = function () {
    };
    Colision.distToSegment = function (p, v, w) {
        return Math.sqrt(Colision.distToSegmentSquared(p, v, w));
    };
    Colision.sqr = function (x) { return x * x; };
    Colision.dist2 = function (v, w) {
        return Colision.sqr(v.x - w.x) + Colision.sqr(v.y - w.y);
    };
    //p:ponto, v:extremo 1 da reta, w:extremo 2 da reta (ambos pontos)
    Colision.distToSegmentSquared = function (p, v, w) {
        var l2 = Colision.dist2(v, w);
        if (l2 == 0)
            return Colision.dist2(p, v);
        var t = ((p.x - v.x) * (w.x - v.x) + (p.y - v.y) * (w.y - v.y)) / l2;
        t = Math.max(0, Math.min(1, t));
        return Colision.dist2(p, { x: v.x + t * (w.x - v.x),
            y: v.y + t * (w.y - v.y) });
    };
    return Colision;
}());
