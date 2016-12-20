class Creator {
	static countOfCoordinates: number = 0;
	static canvas: HTMLCanvasElement;
	static canvasCtx: CanvasRenderingContext2D;

	static inicialize():void {
		Creator.canvas = <HTMLCanvasElement>document.getElementById("canvas");
		Creator.canvasCtx = <CanvasRenderingContext2D> Creator.canvas.getContext("2d");
	}
	
	static getCoordinates(e: any): void {
		var x: number = e.clientX;
		var y: number = e.clientY;
		
		//alert("Coordinates: (x" + Creator.countOfCoordinates + ": " + x + ", y" + Creator.countOfCoordinates + ": " + y + ")");

		Creator.inicialize();
		
		if(Creator.countOfCoordinates > 0 && Creator.countOfCoordinates % 2 != 0) {
			Creator.canvasCtx.lineTo(x,y);
			Creator.canvasCtx.stroke();
		} else {
			Creator.canvasCtx.moveTo(x,y);
		}

		Creator.countOfCoordinates++;
	}
}
