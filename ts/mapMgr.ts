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
	public character:Character;
	public wallWidth=2;
	private wallColor="#60E941";
	private failColor="red";
	
	public andarAt:number;
	private ctx:CanvasRenderingContext2D;
	
	public walls:Array<{x0:number,y0:number,x1:number,y1:number}>;
	public fails:Array<{x:number,y:number,width:number,height:number}>;
	public andares:Array<{x:number,y:number}>;
	private bgImg:HTMLImageElement;
	
	public isReady:boolean;
	
	public spawX:number;
	public spawY:number;
	//Configurações do estado do mapa,proporção de zoom, posição
	//Largura/altura do mapa completo
	public width:number;
	public height:number;
	//zoom
	//Posição base em que os elementos serão desenhados (a imagem de fundo é exatamente nesta posição)
	private _posX=0;
	private _posY=0;
	//Velocidade de movimentção do mapa em pixels por segundo
	private _moveSpeed=15;
	
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
			mapMgr.update();
		}
		
		this.centerIn(this.spawX, this.spawY);
	}
	public update(){
		//console.log("Update em tudo");
		this.drawMap();
		this.character.update();
		//this.character.draw();
	}
	public setMainChar(c:Character){
		this.character = c;
	}
	public drawMap(){
		//console.log("Redesenhando mapa...");
		this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height);
		//Desenha o plano de fundo
		this.drawBg();
		//Desenha as paredes(Objetos de colisão)
		this.drawWalls();
		//Desenha as falhas de acessibilidade visíveis
		this.drawFails();
		
	}
	public centerIn(Xw:number,Yw:number):void{
		//PONTO INICIAL
		//Coordenadas do centro da tela (do canvas)
		var cCanvasX = this.canvas.width/2;
		var cCanvasY = this.canvas.height/2;
		//Adapta as coordenadas para o zoom atual
		Xw*=config.proportion;
		Yw*=config.proportion;
		//Coordenadas do ponto do mapa que se deseja focar com relação ao canvas, (a coordenada passada via parâmetro deve ser com relação ao mapa, uma media do mapa)
		//PONTO DE DESTINO
		var localPx = this._posX + Xw;
		var localPy = this._posY + Yw;
		//console.log("localPx: " + localPx + " localPy: " + localPy);
		//As distâncias Dx e Dy de PD ate CC
		var Dx = localPx - cCanvasX;
		var Dy = localPy - cCanvasY;
		
		//console.log("Dx: " + Dx + " Dy: " + Dy);
		//A diferença entre os dois pontos é eliminada subtraindo do ponto final essa diferença
		this._posX=(this._posX-Dx);
		this._posY=(this._posY-Dy);
		
		//console.log("_posX: " + this._posX + " _posY: " + this._posY);
		this.character.ajustOnScreen();
		this.update();
		
		this.showCenter();
	}
	public drawBg(){
		this.ctx.beginPath();
		this.ctx.rect(this._posX,this._posY,this.width*config.proportion,this.height*config.proportion);
		this.ctx.stroke();
		this.ctx.drawImage(this.bgImg,this._posX,this._posY,this.width*config.proportion,this.height*config.proportion);
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
		//console.log("Center X: " + cCanvasX + " Y: " + cCanvasY);
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
			
			this.ctx.fillRect(relative[0],relative[1],fail.width*config.proportion,fail.height*config.proportion);
			
			this.ctx.fill();
			
			i++;
		}
		
		this.ctx.restore()
	}
	
	/*public zoomIn(percent:number){
		var centerMapX = (this.canvas.width/2) - this._posX;
		var centerMapY = (this.canvas.height/2) - this._posY;
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
			var centerMapX = (this.canvas.width/2) - this._posX;
			var centerMapY = (this.canvas.height/2) - this._posY;
			
			console.log("Parte centralizada: x:" + centerMapX + ", y:" + centerMapY);
			this.proportion-=percent;
			
			//Recentraliza novamente o mapa no ponto anteriormente no centro
			this.centerIn(centerMapX,centerMapY);
		}
		
	}*/
	public moveRight(px:number){
		this._posX+=px;
		this.character.updateCoord();
		
		var colide = Colision.checkColision(this);
		console.log("Coliding: " + colide);
		if(colide){
			this._posX-=px;
			this.update();
		}
		else
			this.update();
		
	}
	public moveLeft(px:number){
		this._posX-=px;
		this.character.updateCoord();
		
		var colide = Colision.checkColision(this);
		console.log("Coliding: " + colide);
		//Esta coliding caso este movimento seja feito, então volte
		if(colide){
			this._posX+=px;
			this.update();
		}
		else
			this.update();
	}
	public moveUp(px:number){
		this._posY-=px;
		
		this.character.updateCoord();
		
		var colide = Colision.checkColision(this);
		console.log("Coliding: " + colide);
		if(colide){
			this._posY+=px;
			this.update();
		}
		else
			this.update();
	}
	public moveDown(px:number){
		this._posY+=px;
		
		this.character.updateCoord();
		
		var colide = Colision.checkColision(this);
		//console.log("Coliding: " + colide);
		if(colide){
			this._posY-=px;
			this.update();
		}
		else
			this.update();
	}
	/*public checkColision():boolean{
		for(var i =0; i < this.walls.length; i++){
			if(Colision.isColidingCharWall(this.character,this.walls[i])){
				return true;
			}
		}
		return false;
	}*/
	//Converte ponto no mapa para ponto no canvas
	private getRelative(coord:[number,number]):[number,number]{
		var x = (coord[0]*config.proportion)+this._posX;
		var y = (coord[1]*config.proportion)+this._posY;
		var tuple:[number,number];
		tuple = [x,y];
		return tuple;
	}
	//Converte ponto no canvas para ponto no mapa
	public canvasCoordToMap(x:number,y:number):{x:number,y:number}{
		var mapX = (x- this._posX)/config.proportion;
		var mapY = (y- this._posY)/config.proportion;

		var coord ={x:mapX, y:mapY};

		return coord;
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
	get posY():number{
		return this._posY;
	}
	set posY(y:number){
		var valorAnt = this._posY;
		this._posY=y;
		
		this.character.updateCoord();
		
		var colide = Colision.checkColision(this);
		//console.log("Coliding: " + colide);
		if(colide){
			this._posY=valorAnt;
			this.update();
		}
		else
			this.update();
	}
	set posX(x:number){
		var valorAnt = this._posX;
		this._posX=x;
		
		this.character.updateCoord();
		
		var colide = Colision.checkColision(this);
		//console.log("Coliding: " + colide);
		if(colide){
			this._posX=valorAnt;
			this.update();
		}
		else
			this.update();
	}
	get posX():number{
		return this._posX;
	}
	
	
	get moveSpeed(){
		return ((this._moveSpeed * decorrido) / 1000)*config.proportion;
	}
	
}