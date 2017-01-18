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
class MapMgr{
	private wallWidth=2;
	private wallColor="blue";
	private failColor="red";
	
	private andarAt:number;
	private ctx:CanvasRenderingContext2D;
	
	private walls:Array<{x0:number,y0:number,x1:number,y1:number}>;
	private fails:Array<{x:number,y:number,width:number,height:number}>;
	private andares:Array<{x:number,y:number}>;
	private bgImg:HTMLImageElement;
	
	public isReady:boolean;
	
	public spawX:number;
	public spawY:number;
	//Configurações do estado do mapa,proporção de zoom, posição
	//Largura/altura do mapa completo
	public width:number;
	public height:number;
	//zoom
	public proportion=4;
	//Posição base em que os elementos serão desenhados (a imagem de fundo é exatamente nesta posição)
	public posX=0;
	public posY=0;
	/*//Foco da 'câmera', indica qual local estará no centro da tela - Nao utilizado - Possível utilização: Caso se opite por possibilitar
	//O acesso ao controle de zoom para o usuario, pode ser usado para sempre ter salvo a localização anterior do centro
	public fX:number;
	public fY:number;*/
	//Velocidade de movimentção do mapa
	public moveSpeed=50;
	
	//Eu passo o contexto do canvas para o proprio mapamgr desenhar nele
	//Obs: quando uso private,public ou protected antes de um parametro, ele se torna atributo da classe automaticamente
	constructor(private canvas:HTMLCanvasElement){
		this.andarAt=0;
		this.ctx=this.canvas.getContext("2d");
	}
	
	public loadMap(map:any,andar?:number){
		console.log("Carregando mapa "+map[0].nome + "...");
		
		this.width = map[this.andarAt].largura;
		this.height = map[this.andarAt].altura;

		this.walls=map[this.andarAt].paredes;
		this.fails=map[this.andarAt].falhas;
		this.andares=map[this.andarAt].andares;
		this.spawX = map[this.andarAt].spaw.x;
		this.spawY = map[this.andarAt].spaw.y;
		this.bgImg = new Image();
		
		this.isReady = false;
		this.bgImg.src = map[0].fundo;
		//this.bgImg.width*=0.1;
		this.bgImg.onload=function(){
			//console.log("Terminou de carregar:"+this.src);
			//Usa-se o objeto da classe, pois dento de um evento o contexto é o do objeto que disparou o evento
			mapMgr.isReady = true;
			mapMgr.drawMap();
		}
		
		this.centerIn(this.spawX, this.spawY);
	}
	
	public drawMap(){
		console.log("Redesenhando mapa...");
		this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height);
		//Desenha o plano de fundo
		this.drawBg();
		//Desenha as paredes(Objetos de colisão)
		this.drawWalls();
		//Desenha as falhas de acessibilidade visíveis
		this.drawFails();
		
	}
	
	public drawBg(){
		this.ctx.beginPath();
		this.ctx.rect(this.posX,this.posY,this.width*this.proportion,this.height*this.proportion);
		this.ctx.stroke();
		this.ctx.drawImage(this.bgImg,this.posX,this.posY,this.width*this.proportion,this.height*this.proportion);
	}

	public centerIn(Xw:number,Yw:number):void{
		//PONTO INICIAL
		//Coordenadas do centro da tela (do canvas)
		var cCanvasX = this.canvas.width/2;
		var cCanvasY = this.canvas.height/2;
		//Adapta as coordenadas para o zoom atual
		Xw*=this.proportion;
		Yw*=this.proportion;
		//Coordenadas do ponto do mapa que se deseja focar com relação ao canvas, (a coordenada passada via parâmetro deve ser com relação ao mapa, uma media do mapa)
		//PONTO DE DESTINO
		var localPx = this.posX + Xw;
		var localPy = this.posY + Yw;
		console.log("localPx: " + localPx + " localPy: " + localPy);
		//As distâncias Dx e Dy de PD ate CC
		var Dx = localPx - cCanvasX;
		var Dy = localPy - cCanvasY;
		
		console.log("Dx: " + Dx + " Dy: " + Dy);
		//A diferença entre os dois pontos é eliminada subtraindo do ponto final essa diferença
		this.posX=(this.posX-Dx);
		this.posY=(this.posY-Dy);
		
		console.log("posX: " + this.posX + " posY: " + this.posY);
		this.drawMap();
		
		this.showCenter();
	}
	public showCenter(){
		var cCanvasX = this.canvas.width/2;
		var cCanvasY = this.canvas.height/2;
		
		this.ctx.save();
		this.ctx.beginPath();
		this.ctx.strokeStyle = "red";
		this.ctx.arc(cCanvasX,cCanvasY,30,0,2*Math.PI);
		
		this.ctx.stroke();
		this.ctx.restore();
		console.log("Center X: " + cCanvasX + " Y: " + cCanvasY);
	}
	
	public drawWalls(){
		//Salva as configurações do contexto anterior...
		this.ctx.save();
		
		//console.log("Desenhando paredes...");
		
		this.ctx.strokeStyle=this.wallColor;
		
		this.ctx.lineWidth=this.wallWidth;
		
		var i=0;
		while(this.walls[i]){
			var relativeStart=this.getRelative([this.walls[i].x0, this.walls[i].y0]);
			var x0 = relativeStart[0];
			var y0 = relativeStart[1];
			
			var relativeEnd=this.getRelative([this.walls[i].x1, this.walls[i].y1]);
			var x1 = relativeEnd[0];
			var y1 = relativeEnd[1];
			
			this.ctx.beginPath();
			this.ctx.moveTo(x0,y0);
			this.ctx.lineTo(x1,y1);
			this.ctx.stroke();
			
			i++;
		}
		
		//restaura as configurações do contexto anterior...
		this.ctx.restore()
	}
	
	public drawFails(){
		this.ctx.save();
		
		//console.log("Desenhando falhas...");
		
		this.ctx.fillStyle=this.failColor;
		
		this.ctx.lineWidth=this.wallWidth;
		
		var i=0;
		while(this.fails[i]){
			this.ctx.beginPath();
			var fail = this.fails[i];
			var relative = this.getRelative([fail.x,fail.y]);
			
			this.ctx.fillRect(relative[0],relative[1],fail.width*this.proportion,fail.height*this.proportion);
			
			this.ctx.fill();
			
			i++;
		}
		
		this.ctx.restore()
	}
	
	/*public zoomIn(percent:number){
		var centerMapX = (this.canvas.width/2) - this.posX;
		var centerMapY = (this.canvas.height/2) - this.posY;
		console.log("Parte centralizada: x:" + centerMapX + ", y:" + centerMapY);
		this.proportion+=percent;
		
		//Recentraliza novamente o mapa no ponto anteriormente no centro
		this.centerIn(centerMapX,centerMapY);
	}
	public zoomOut(percent:number){
		if((this.proportion - percent) <= 0.5){
			this.proportion = 0.5;
		}
		else{
			var centerMapX = (this.canvas.width/2) - this.posX;
			var centerMapY = (this.canvas.height/2) - this.posY;
			
			console.log("Parte centralizada: x:" + centerMapX + ", y:" + centerMapY);
			this.proportion-=percent;
			
			//Recentraliza novamente o mapa no ponto anteriormente no centro
			this.centerIn(centerMapX,centerMapY);
		}
		
	}*/
	
	public moveRight(px:number){
		this.posX+=px;
	}
	public moveLeft(px:number){
		this.posX-=px;
	}
	public moveUp(px:number){
		this.posY-=px;
	}
	public moveDown(px:number){
		this.posY+=px;
	}
	//Metodo que calcula as coordenadas de um ponto dado com relação ao mapa, no canvas, levado em consideração a posição do mapa e a proporção de zoom
	private getRelative(coord:[number,number]):[number,number]{
		var x = (coord[0]*this.proportion)+this.posX;
		var y = (coord[1]*this.proportion)+this.posY;
		var tuple:[number,number];
		tuple = [x,y];
		return tuple;
	}
	/*public getCenteredPointInMap(Cx:number, Cy:number):[number,number]{
		//Coordenadas do centro da tela (do canvas)
		var cCanvasX = this.canvas.width/2;
		var cCanvasY = this.canvas.height/2;
		
		var tuple:[number,number];
		tuple = [x,y];
		return tuple;
	}*/
	/*private getInCanvasPoint(){
		
	}*/
	get bg():HTMLImageElement{
		return this.bgImg;
	}
}