var Colision = (function () {
    function Colision() {
    }
    Colision.isColidingCharWall = function (c, p) {
        var dist = this.distToSegment({ x: c.x, y: c.y }, { x: p.x0, y: p.y0 }, { x: p.x1, y: p.y1 });
        console.log("Distancia para linha é: " + dist);
        if (dist < (c.size)) {
            return true;
        }
        else
            return false;
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
