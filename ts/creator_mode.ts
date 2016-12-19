class Creator {
	static countOfCoordinates: number = 0;
	static canvas: HTMLElement = document.getElementById("canvas");
	
	static getCoordinates(e: any): void {
		public x: number = e.clientX;
		public y: number = e.clientY;
		
		alert("Coordinates: (x" + Creator.countOfCoordinates + ": " + this.x + ", y" + Creator.countOfCoordinates + ": " + this.y + ")");
		
		if(Creator.countOfCoordinates > 0 && Creator.countOfCoordinates % 2 != 0) {
			Creator.canvas.getContext("2d");
			Creator.canvas.moveTo(0,0);
			Creator.canvas.lineTo(150,75);
			Creator.canvas.stroke();
			
			Creator.countOfCoordinates++;
		}
	}
}
