class Character{
    public canvas:HTMLCanvasElement;
	public ctx:CanvasRenderingContext2D;
    //Posição com relação a tela em porcentagem, onde o personagem ficará fixo. Usado para calcular a posição em que será desenhado
    public screenPercentX:number;
    public screenPercentY:number;
    public canvasX:number;
    public canvasY:number;
    //Posição do personagem com relação ao mapa, utilizada para verificar se o personagem está colidindo com algum objeto do mapa
    public x:number;
    public y:number;
	//O diametro da circuferencia que é a borda de colisão
	public size:number;

    constructor(screenPercentX:number, screenPercentY:number, mx:number, my:number, canvas:HTMLCanvasElement){
        this.canvas=canvas;
		this.ctx=canvas.getContext("2d");
        this.screenPercentX = screenPercentX;
        this.screenPercentY = screenPercentY;

        this.x = mx;
        this.y = my;
		
		this.size=15;
        //Calcula as coordenadas do personagem no canvas
        this.ajustOnScreen();
		this.update();
    }
    public update(){
        this.updateCoord();
        console.log("Char: " + this.x + ","+this.y);
		//this.ajustOnScreen();
        this.draw();
    }
	public updateCoord(){
        var coord = mapMgr.canvasCoordToMap(this.canvasX,this.canvasY);
        this.x=coord.x;
        this.y=coord.y;
		//this.ajustOnScreen();
        //this.draw();
    }
    public draw():void{
        
        this.ctx.save();
        this.ctx.fillStyle = 'green';
        this.ctx.lineWidth = 1;
        this.ctx.strokeStyle = "gray";
        this.ctx.beginPath();
		this.ctx.arc(this.canvasX,this.canvasY,this.size,0,2*Math.PI);
		
		this.ctx.fill();
        this.ctx.stroke();
		this.ctx.restore();
        this.ctx.closePath();
        //console.log("Desenhando personagem " + this.canvasX + ":" + this.canvasY);
    }
    public ajustOnScreen(){
        this.canvasX = this.canvas.width*this.screenPercentX;
        this.canvasY = this.canvas.height*this.screenPercentY;
    }
}