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
