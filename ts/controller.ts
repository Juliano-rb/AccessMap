class Controller{
	private inicio:HTMLDivElement;
	private aviso:HTMLDivElement;
	private debug:HTMLDivElement;
	
	constructor(){
		console.log("Inicializando controller");
		this.inicio = <HTMLDivElement>document.getElementById("inicio");
		this.aviso = <HTMLDivElement>document.getElementById("aviso");
		this.debug = <HTMLDivElement>document.getElementById("debug");
		
		this.view("inicio");
		
		
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
}