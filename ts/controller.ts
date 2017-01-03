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
class Controller{
	private inicio:HTMLDivElement;
	private aviso:HTMLDivElement;
	private debug:HTMLDivElement;
	
	private canvasElement:HTMLCanvasElement
	private canvasCtx:CanvasRenderingContext2D;
	
	constructor(){
		console.log("Inicializando controller");
		this.inicio = <HTMLDivElement>document.getElementById("inicio");
		this.aviso = <HTMLDivElement>document.getElementById("aviso");
		this.debug = <HTMLDivElement>document.getElementById("debug");
		
		this.canvasElement = <HTMLCanvasElement>document.getElementById("canvas");
		this.canvasCtx = <CanvasRenderingContext2D> this.canvas.getContext("2d");
		
		this.view("inicio");
		this.registerEvents();
	}
	
	public view(nome:string){
		console.log("mudando para tela: " + nome);
		switch(nome){
			case "inicio":
				this.inicio.style.display="block";
				this.aviso.style.display="none";
				this.debug.style.display="none";
			  break;
			case "aviso":
				this.inicio.style.display="none";
				this.aviso.style.display="block";
				this.debug.style.display="none";
			  break;
			case "debug":
				this.inicio.style.display="none";
				this.aviso.style.display="none";
				this.debug.style.display="block";
			  break;
			case "":
				this.inicio.style.display="none";
				this.aviso.style.display="none";
				this.debug.style.display="none";
			  break;
				
		}
	}
	
	public registerEvents(){
		window.onresize = this.resizeCanvas;
		
		//Teclas para movimentar o mapa
		document.getElementById("body").addEventListener("keydown", function(evento){
			//Direita
			if(evento.keyCode==39){
				mapMgr.moveLeft(10);
				mapMgr.drawMap();
			}
			//Esquerda
			else if(evento.keyCode==37){
				mapMgr.moveRight(10);
				mapMgr.drawMap();
			}
			//Cima
			if(evento.keyCode==38){
				mapMgr.moveDown(10);
				mapMgr.drawMap();
			}
			//Baixo
			else if(evento.keyCode==40){
				mapMgr.moveUp(10);
				mapMgr.drawMap();
			}
		}
		);
	}
	
	public resizeCanvas(){
		console.log("redmensionou");
		var canvas:HTMLCanvasElement = <HTMLCanvasElement>document.getElementById("canvas");
		canvas.width = window.innerWidth;
		canvas.height = window.innerHeight;
		
		//Pois quando o canvas é redmensionado ele é totalmente limpo, então é necessário ser redesenhado
		mapMgr.drawMap();
	}
	get ctx():CanvasRenderingContext2D{
		return this.canvasCtx;
	}
	get canvas():HTMLCanvasElement{
		return this.canvasElement;
	}
}