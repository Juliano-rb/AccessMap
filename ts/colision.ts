class Colision{
	static isColidingCharWall(c:Character, p:{ x0:number,y0:number, x1:number,y1:number}):boolean{
		var dist = this.distToSegment({x:c.x,y:c.y},{x:p.x0,y:p.y0},{x:p.x1,y:p.y1});
		console.log("Distancia para linha é: " + dist);
		if(dist < (c.size)){
			return true;
		}
		else
			return false;
	}
	
	static distToSegment(p:{x:number,y:number}, v:{x:number,y:number}, w:{x:number,y:number}):number {
		return Math.sqrt(Colision.distToSegmentSquared(p, v, w)); 
	}
	static sqr(x:number):number { return x * x }
	static dist2(v:{x:number,y:number}, w:{x:number,y:number}):number{
		return Colision.sqr(v.x - w.x) + Colision.sqr(v.y - w.y)
	}
	//p:ponto, v:extremo 1 da reta, w:extremo 2 da reta (ambos pontos)
	static distToSegmentSquared(p:{x:number,y:number}, v:{x:number,y:number}, w:{x:number,y:number}):number {
	  var l2 = Colision.dist2(v, w);
	  if (l2 == 0) return Colision.dist2(p, v);
	  var t = ((p.x - v.x) * (w.x - v.x) + (p.y - v.y) * (w.y - v.y)) / l2;
	  t = Math.max(0, Math.min(1, t));
	  return Colision.dist2(p, { x: v.x + t * (w.x - v.x),
						y: v.y + t * (w.y - v.y) });
	}
}