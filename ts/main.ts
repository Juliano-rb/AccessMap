/*
	Copyright 2016-2017 Coletivo EIDI
  
	This file is part of AccessMap, that is a software for mapping accessibility failures in public places.
  
	AccessMap is free software: you can redistribute it and/or modify
	it under the terms of the GNU General Public License as published by
	the Free Software Foundation, either version 3 of the License, or
	(at your option) any later version.
   
	This program is distributed in the hope that it will be useful,
	but WITHOUT ANY WARRANTY; without even the implied warranty of
	MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
	GNU General Public License for more details.
	
	You should have received a copy of the GNU General Public License
	along with AccessMap. 
	If not, see <http://www.gnu.org/licenses/>.

	Contact: rocha.juliano.b@gmail.com and silvio.santos@arapiraca.ufal.br
	This project and its developers are part of the 'Coletivo Eidi' group <http://sites.google.com/site/eidicoletivo/>.
*/
var control:Controller;
var mapMgr:MapMgr;

//Inicialização depois do corpo da pagina ter carregado
function inicializar(){
	control = new Controller();
	mapMgr = new MapMgr(control.canvas);
	
	control.view("debug");
	//Ajusta o canvas ao tamanho da tela atual... E também já redesenha tudo chamando o metodo drawMap() de mapMgr
	control.resizeCanvas();
	
	mapMgr.loadMap(mapa,0);
	
	document.getElementById('info').innerHTML = "Largura do mapa " + mapMgr.width + "<br/> Altura:" + mapMgr.height;
}

function loop(){
	
}