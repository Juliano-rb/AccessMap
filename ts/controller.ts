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
			//
			if(evento.keyCode==39){
				mapMgr.drawPosX-=10;
				mapMgr.drawMap();
			}
			//
			else if(evento.keyCode==37){
				mapMgr.drawPosX+=10;
				mapMgr.drawMap();
			}
			//
			if(evento.keyCode==38){
				mapMgr.drawPosY+=10;
				mapMgr.drawMap();
			}
			//
			else if(evento.keyCode==40){
				mapMgr.drawPosY-=10;
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