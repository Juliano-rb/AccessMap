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
	
	public proportion=1;
	public drawPosX=0;
	public drawPosY=0;
	
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
		this.ctx.drawImage(this.bgImg,this.drawPosX,this.drawPosY,this.bgImg.width*this.proportion,this.bgImg.height*this.proportion);
		
		this.drawWalls();
		this.drawFails();
		
	}
	
	public drawWalls(){
		this.ctx.save();
		
		console.log("Desenhando paredes...");
		
		this.ctx.strokeStyle=this.wallColor;
		
		this.ctx.lineWidth=this.wallWidth;
		
		var i=0;
		while(this.walls[i]){
			this.ctx.beginPath();
			this.ctx.moveTo(this.walls[i].x0,this.walls[i].y0);
			this.ctx.lineTo(this.walls[i].x1,this.walls[i].y1);
			this.ctx.stroke();
			
			i++;
		}
		
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
			
			this.ctx.fillRect(fail.x,fail.y,fail.width,fail.height);
			
			this.ctx.fill();
			
			i++;
		}
		
		this.ctx.restore()
	}
	
	get bg():HTMLImageElement{
		return this.bgImg;
	}
	
}