var control:Controller;

//Inicialização depois do corpo da pagina ter carregado
function inicializar(){	
	control = new Controller();
	
	control.view("debug");
}