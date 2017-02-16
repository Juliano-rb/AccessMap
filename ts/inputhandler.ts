class InputHandler{
    //Variável que vai conterá um mapa com todas as teclas que estão ou não pressionadas
    public static keys:any = {};
    public static dir:{dx:number,dy:number} = {dx:0,dy:0};

    public static pressKey(evento: KeyboardEvent){
        var key = evento.key;
        //console.log("Presssionou " + key);
        this.keys[key] = true;
    }
    public static releaseKey(evento: KeyboardEvent){
        var key = evento.key;
        //console.log("Soltou " + key);
        this.keys[key] = false;
    }
    public static registerEvents(){
        onkeydown = function(evento){
            //console.log(InputHandler.keys);
            //if(InputHandler.keys[evento.key]){
                InputHandler.pressKey(evento);
                InputHandler.updateDirection();
            //}
        }

        onkeyup = function(evento){
            //console.log(InputHandler.keys);
            //if(InputHandler.keys[evento.key]){
                InputHandler.releaseKey(evento);
                InputHandler.updateDirection();
            //}
        }
    }

    //Calcula um vetor que representa a direção de acordo com as teclas pressionadas
    public static updateDirection(){
        //Acha um vetor que representa a direção que o personagem tem q ir
        var deltax:number = 0,deltay:number = 0;
        if(this.keys.ArrowUp)
            deltay-=1;
        if(this.keys.ArrowDown)
            deltay+=1;
        if(this.keys.ArrowLeft)
            deltax-=1;
        if(this.keys.ArrowRight)
            deltax+=1;
        
       

        if((deltax == 0) && (deltay == 0)){
            this.dir.dx = 0;
            this.dir.dy = 0;            
        }
        else{
            //Acha-se o modulo do vetor para calcular o seu vetor unitário em seguida
            var modulo = Math.sqrt( Math.pow(deltax,2) + Math.pow(deltay,2) );
            
            //Calcula o vetor unitário que representa a direção que o inimigo deve seguir, assim, o comprimento do vetor não influencia quando for-se multiplicar as coordenadas, caso fosse colocado o vetor anterior seria o mesmo que já te ra velocidade imbutida
            deltax = (deltax/modulo);
            deltay = (deltay/modulo);
            

            this.dir.dx = deltax;
            this.dir.dy = deltay;
        }
         console.log("deltax: " + this.dir.dx + " deltay: " + this.dir.dy);
         this.drawDir();
    }
    
    public static drawDir(){
        var ctx = control.ctx;
        var posx=500,posy=500;

        ctx.save();
        ctx.strokeStyle = "red";
        ctx.lineWidth = 3;

        ctx.beginPath();
		ctx.fillStyle = "white";
		ctx.arc(posx,posy,100,0,2*Math.PI);
		ctx.fill();
		ctx.stroke();
		ctx.closePath();
		
		ctx.beginPath();
		ctx.strokeStyle = "rebeccapurple";
		ctx.fillStyle = "rebeccapurple";
        ctx.arc(posx,posy,15,0,2*Math.PI);
        ctx.moveTo(posx,posy);
        ctx.lineTo(posx+(100*this.dir.dx), posy + (100*this.dir.dy));
		
        ctx.stroke();
		ctx.fill();
        ctx.restore();
		ctx.closePath();
    }
}