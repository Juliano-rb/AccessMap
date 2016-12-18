var control;
var mapMgr;
function inicializar() {
    control = new Controller();
    mapMgr = new MapMgr(control.canvas);
    control.view("debug");
    mapMgr.loadMap(mapa, 0);
    control.resizeCanvas();
}
