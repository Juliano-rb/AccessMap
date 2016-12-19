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
	
	//Configurações do estado do mapa,proporção de zoom, posição
	public proportion=1;
	public posX=0;
	public posY=0;
	
	//Eu passo o contexto do canvas para o proprio mapamgr desenhar nele
	//Obs: quando uso private,public ou protected antes de um parametro, ele se torna atributo da classe automaticamente
	constructor(private canvas:HTMLCanvasElement){
		this.andarAt=0;
		this.ctx=this.canvas.getContext("2d");
	}
	
	public loadMap(map:any,andar?:number){
		console.log("Carregando mapa "+map[0].nome + "...");

		this.walls=map[this.andarAt].paredes;
		this.fails=map[this.andarAt].falhas;
		this.andares=map[this.andarAt].andares;
		
		this.bgImg = new Image();
		
		this.bgImg.src = map[0].fundo;
		//this.bgImg.width*=0.1;
		this.bgImg.onload=function(){
			console.log("Terminou de carregar:"+this.width + "x" + this.height);
		}
	}
	
	public drawMap(){
		this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height);
		
		console.log("Desenhando imagem de fundo "+this.bgImg.src);
		this.ctx.drawImage(this.bgImg,this.posX,this.posY,this.bgImg.width*this.proportion,this.bgImg.height*this.proportion);
		
		this.drawWalls();
		this.drawFails();
		
	}
	
	public drawWalls(){
		//Salva as configurações do contexto anterior...
		this.ctx.save();
		
		console.log("Desenhando paredes...");
		
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
		
		console.log("Desenhando falhas...");
		
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
	public zoomIn(percent:number){
		var widthAnt=this.bgImg.width*this.proportion;
		var heigthAnt=this.bgImg.height*this.proportion;
		
		this.proportion+=percent;
		
		var widthNew=this.bgImg.width*this.proportion;
		var heigthNew=this.bgImg.height*this.proportion;
		
		var toCentLeft = (widthNew-widthAnt)/2;
		var toCentUp = (heigthNew-heigthAnt)/2;
		
		this.moveLeft(toCentLeft);
		this.moveUp(toCentLeft);
	}
	public zoomOut(percent:number){
		var widthAnt=this.bgImg.width*this.proportion;
		var heigthAnt=this.bgImg.height*this.proportion;
		
		this.proportion-=percent;
		
		var widthNew=this.bgImg.width*this.proportion;
		var heigthNew=this.bgImg.height*this.proportion;
		
		var toCentLeft = (widthAnt-widthNew)/2;
		var toCentUp = (heigthAnt-heigthNew)/2;
		
		this.moveRight(toCentLeft);
		this.moveDown(toCentLeft);
	}
	
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
	//Metodo que calcula as novas coordenadas para o canvas de acordo com o zoom e o local do mapa
	private getRelative(coord:[number,number]):[number,number]{
		var x = (coord[0]+this.posX)*this.proportion;
		var y = (coord[1]+this.posY)*this.proportion;
		var tuple:[number,number];
		tuple = [x,y];
		return tuple;
	}
	get bg():HTMLImageElement{
		return this.bgImg;
	}
	
}