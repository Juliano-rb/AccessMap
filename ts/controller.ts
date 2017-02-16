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
	/*
		O controller precisa que existam divs com id's "inicio", "aviso" e "debug" para as telas que ele irá controlar, além disso precisa que o
		elemento canvas tenha como id "canvas".
	*/
	private inicio:HTMLDivElement;
	private aviso:HTMLDivElement;
	private debug:HTMLDivElement;
	
	private canvasElement:HTMLCanvasElement
	private canvasCtx:CanvasRenderingContext2D;
	
	public keyMap:any;
	
	constructor(){
		console.log("Inicializando controller");
		// Mapa das teclas pressionadas, toda vez que uma dessas teclas é pressionada sua posição no objeto abaixo é atualizada com true
		// e quando a tecla é solta esse valor muda para false, com isso é possível tratar o pressionamento de múltiplas teclas
		this.keyMap = {"ArrowRight":false, "ArrowLeft":false, "ArrowUp":false, "ArrowDown":false};
		
		this.inicio = <HTMLDivElement>document.getElementById("inicio");
		this.aviso = <HTMLDivElement>document.getElementById("aviso");
		this.debug = <HTMLDivElement>document.getElementById("debug");
		
		if(!this.inicio || !this.aviso || !this.debug){
			console.error("O jogo não funcionará corretamente, uma ou mais views não foram encontradas no arquivo HTML principal.");
			
			alert("Erro, uma ou mais views não foram encontradas, o jogo não funcionará corretamente");
		}
		this.canvasElement = <HTMLCanvasElement>document.getElementById("canvas");
		this.canvasCtx = <CanvasRenderingContext2D> this.canvas.getContext("2d");
		
		if(!this.inicio || !this.aviso || !this.debug)
		
		this.view("inicio");
		this.registerEvents();
	}
	/*
		Altera a tela atual para a que foi passada como parâmetro, "" = a principal do jogo (sem nenhuma janela de aviso ou opções)
	*/
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
	
	public addCreatorCoord(x0:number, y0:number, x1:number, y1:number){
		var textArea = document.getElementById('wallOutput');

		textArea.innerHTML += "<br>{ 'x0':" + x0 + ",'y0':" + y0 +", 'x1':" + x1 + ",'y1':" + y1 + " },";
	}
	public registerEvents(){
		window.onresize = this.resizeCanvas;
				
		/*onkeydown = onkeyup = function(evento){
			//Como dentro de um evento o escopo é outro (objeto Window) então para acessar a variável keyMap precisa-se referenciar o objeto control, talvez exista uma forma melhor de se fazer isso.
			var map = control.keyMap;
			//evento.key contém o nome da tecla i.e: 'ArrowDown'
			map[evento.key] = evento.type == 'keydown';
			
			// Verifica se as teclas para movimentar o mapa estão pressionadas e então atualiza aqs coordenadas do personagem
			//Teclas cima e Direita
			if(map["ArrowUp"] && map["ArrowRight"]){
				//Calcula o quando deve ser deslocado nos eixos x e y para que o movimento total do mapa seja o mesmo de mapMgr.speed, esta formula é derivada do clássico teorema de pitágoras h^2 = x^2 + y^2
				var move = mapMgr.moveSpeed*Math.sqrt(0.5);
				console.log("Cateto: " + move);
				
				mapMgr.moveLeft(move);
				mapMgr.moveDown(move);
				//mapMgr.update();
			}
			//Teclas Cima e Esquerda
			else if(map["ArrowUp"] && map["ArrowLeft"]){
				var move = mapMgr.moveSpeed*Math.sqrt(0.5);
				console.log("Cateto: " + move);
				
				mapMgr.moveDown(move);
				mapMgr.moveRight(move);
				//mapMgr.update();
			}
			//Teclas Baixo e Esquerda
			else if(map["ArrowDown"] && map["ArrowLeft"]){
				var move = mapMgr.moveSpeed*Math.sqrt(0.5);
				console.log("Cateto: " + move);
				
				mapMgr.moveUp(move);
				mapMgr.moveRight(move);
				//mapMgr.update();
			}
			//Teclas Baixo e Direita
			else if(map["ArrowDown"] && map["ArrowRight"]){
				var move = mapMgr.moveSpeed*Math.sqrt(0.5);
				
				mapMgr.moveUp(move);
				mapMgr.moveLeft(move);
				//mapMgr.update();
			}
			//Mover apenas para um lado apenas se não mover na diagonal, caso contrário o mapa seria movido mais de uma vez
			else{
				if(map["ArrowRight"]){
					mapMgr.moveLeft(mapMgr.moveSpeed);
					//mapMgr.update();
				}
				//Esquerda
				if(map["ArrowLeft"]){
					mapMgr.moveRight(mapMgr.moveSpeed);
					//mapMgr.update();
				}
				//Cima
				if(map["ArrowUp"]){
					mapMgr.moveDown(mapMgr.moveSpeed);
					//mapMgr.update();
				}
				//Baixo
				if(map["ArrowDown"]){
					mapMgr.moveUp(mapMgr.moveSpeed);
					//mapMgr.update();
				}
			}
		}*/
		//);
	}
	
	public resizeCanvas(){
		console.log("redmensionou");
		var canvas:HTMLCanvasElement = <HTMLCanvasElement>document.getElementById("canvas");
		canvas.width = window.innerWidth;
		canvas.height = window.innerHeight;
		
		//Pois quando o canvas é redmensionado ele é totalmente limpo, então é necessário ser redesenhado
		if(mapMgr.isReady)
			mapMgr.update();
	}
	get ctx():CanvasRenderingContext2D{
		return this.canvasCtx;
	}
	get canvas():HTMLCanvasElement{
		return this.canvasElement;
	}
}