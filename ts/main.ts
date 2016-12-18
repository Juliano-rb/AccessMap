var control:Controller;
var mapMgr:MapMgr;
//Inicialização depois do corpo da pagina ter carregado
function inicializar(){	
	control = new Controller();
	
	mapMgr = new MapMgr(control.canvas);
	
	control.view("debug");
	
	mapMgr.loadMap(mapa,0);
	
	//Ajusta o canvas ao tamanho da tela atual... E também já redesenha tudo chamando o metodo drawMap() de mapMgr
	control.resizeCanvas();
}