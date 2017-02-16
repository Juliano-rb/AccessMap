var Character = (function () {
    function Character(screenPercentX, screenPercentY, mx, my, canvas, radius) {
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d");
        this.screenPercentX = screenPercentX;
        this.screenPercentY = screenPercentY;
        this.x = mx;
        this.y = my;
        this.size = radius;
        //Calcula as coordenadas do personagem no canvas
        this.ajustOnScreen();
        this.update();
    }
    Character.prototype.update = function () {
        this.updateCoord();
        //console.log("Char: " + this.x + ","+this.y);
        //this.ajustOnScreen();
        this.draw();
    };
    Character.prototype.updateCoord = function () {
        var coord = mapMgr.canvasCoordToMap(this.canvasX, this.canvasY);
        this.x = coord.x;
        this.y = coord.y;
        //this.ajustOnScreen();
        //this.draw();
    };
    Character.prototype.draw = function () {
        this.ctx.save();
        this.ctx.fillStyle = 'green';
        this.ctx.lineWidth = 1;
        this.ctx.strokeStyle = "gray";
        this.ctx.beginPath();
        //console.log("Desenhando raio: " + this.rsize );
        this.ctx.arc(this.canvasX, this.canvasY, this.rsize, 0, 2 * Math.PI);
        this.ctx.fill();
        this.ctx.stroke();
        this.ctx.closePath();
        this.ctx.font = "15px Arial";
        this.ctx.fillText("( " + this.x.toFixed(2) + "," + this.y.toFixed(2) + " )", this.canvasX, this.canvasY - this.rsize);
        this.ctx.restore();
        //console.log("Desenhando personagem " + this.canvasX + ":" + this.canvasY);
    };
    Character.prototype.ajustOnScreen = function () {
        this.canvasX = this.canvas.width * this.screenPercentX;
        this.canvasY = this.canvas.height * this.screenPercentY;
    };
    Object.defineProperty(Character.prototype, "rsize", {
        get: function () {
            return this.size * config.proportion;
        },
        enumerable: true,
        configurable: true
    });
    return Character;
}());
var Colision = (function () {
    function Colision() {
    }
    Colision.checkColision = function (map) {
        //Verifica se colidiu com alguma parede (não com obsctáculos)
        var isColiding = false;
        for (var i = 0; i < map.walls.length; i++) {
            if (this.isColidingCharWall(map.character, map.walls[i], map.wallWidth)) {
                isColiding = true;
                break;
            }
        }
        if (isColiding) {
            return isColiding;
        }
        else {
            for (var i = 0; i < map.fails.length; i++) {
                if (this.RectCircleColliding(map.character, map.fails[i])) {
                    isColiding = true;
                    break;
                }
            }
        }
        if (isColiding) {
            control.view("aviso");
            return isColiding;
        }
        return isColiding;
    };
    Colision.isColidingCharWall = function (c, p, wallWidth) {
        var dist = this.distToSegment({ x: c.x, y: c.y }, { x: p.x0, y: p.y0 }, { x: p.x1, y: p.y1 });
        //console.log("O raio do personagem é:" + c.size);
        if (dist < (c.size + wallWidth / 2)) {
            return true;
        }
        else
            return false;
    };
    Colision.RectCircleColliding = function (c, rect) {
        var distX = Math.abs(c.x - rect.x - rect.width / 2);
        var distY = Math.abs(c.y - rect.y - rect.height / 2);
        if (distX > (rect.width / 2 + c.size)) {
            return false;
        }
        if (distY > (rect.height / 2 + c.size)) {
            return false;
        }
        if (distX <= (rect.width / 2)) {
            return true;
        }
        if (distY <= (rect.height / 2)) {
            return true;
        }
        var dx = distX - rect.width / 2;
        var dy = distY - rect.height / 2;
        return (dx * dx + dy * dy <= (c.size * c.size));
    };
    Colision.distToSegment = function (p, v, w) {
        return Math.sqrt(Colision.distToSegmentSquared(p, v, w));
    };
    Colision.sqr = function (x) { return x * x; };
    Colision.dist2 = function (v, w) {
        return Colision.sqr(v.x - w.x) + Colision.sqr(v.y - w.y);
    };
    //p:ponto, v:extremo 1 da reta, w:extremo 2 da reta (ambos pontos)
    Colision.distToSegmentSquared = function (p, v, w) {
        var l2 = Colision.dist2(v, w);
        if (l2 == 0)
            return Colision.dist2(p, v);
        var t = ((p.x - v.x) * (w.x - v.x) + (p.y - v.y) * (w.y - v.y)) / l2;
        t = Math.max(0, Math.min(1, t));
        return Colision.dist2(p, { x: v.x + t * (w.x - v.x),
            y: v.y + t * (w.y - v.y) });
    };
    return Colision;
}());
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
var Controller = (function () {
    function Controller() {
        console.log("Inicializando controller");
        // Mapa das teclas pressionadas, toda vez que uma dessas teclas é pressionada sua posição no objeto abaixo é atualizada com true
        // e quando a tecla é solta esse valor muda para false, com isso é possível tratar o pressionamento de múltiplas teclas
        this.keyMap = { "ArrowRight": false, "ArrowLeft": false, "ArrowUp": false, "ArrowDown": false };
        this.inicio = document.getElementById("inicio");
        this.aviso = document.getElementById("aviso");
        this.debug = document.getElementById("debug");
        if (!this.inicio || !this.aviso || !this.debug) {
            console.error("O jogo não funcionará corretamente, uma ou mais views não foram encontradas no arquivo HTML principal.");
            alert("Erro, uma ou mais views não foram encontradas, o jogo não funcionará corretamente");
        }
        this.canvasElement = document.getElementById("canvas");
        this.canvasCtx = this.canvas.getContext("2d");
        if (!this.inicio || !this.aviso || !this.debug)
            this.view("inicio");
        this.registerEvents();
    }
    /*
        Altera a tela atual para a que foi passada como parâmetro, "" = a principal do jogo (sem nenhuma janela de aviso ou opções)
    */
    Controller.prototype.view = function (nome) {
        console.log("mudando para tela: " + nome);
        switch (nome) {
            case "inicio":
                this.inicio.style.display = "block";
                this.aviso.style.display = "none";
                this.debug.style.display = "none";
                break;
            case "aviso":
                this.inicio.style.display = "none";
                this.aviso.style.display = "block";
                this.debug.style.display = "none";
                break;
            case "debug":
                this.inicio.style.display = "none";
                this.aviso.style.display = "none";
                this.debug.style.display = "block";
                break;
            case "":
                this.inicio.style.display = "none";
                this.aviso.style.display = "none";
                this.debug.style.display = "none";
                break;
        }
    };
    Controller.prototype.addCreatorCoord = function (x0, y0, x1, y1) {
        var textArea = document.getElementById('wallOutput');
        textArea.innerHTML += "<br>{ 'x0':" + x0 + ",'y0':" + y0 + ", 'x1':" + x1 + ",'y1':" + y1 + " },";
    };
    Controller.prototype.registerEvents = function () {
        window.onresize = this.resizeCanvas;
        /*onkeydown = onkeyup = function(evento){
            //Como dentro de um evento o escopo é outro (objeto Window) então para acessar a variável keyMap precisa-se referenciar o objeto control, talvez exista uma forma melhor de se fazer isso.
            var map = control.keyMap;
            //evento.key contém o nome da tecla i.e: 'ArrowDown'
            map[evento.key] = evento.type == 'keydown';
            
            // Verifica se as teclas para movimentar o mapa estão pressionadas e então atualiza aqs coordenadas do personagem
            //Teclas cima e Direita
            if(map["ArrowUp"] && map["ArrowRight"]){
                //Calcula o quando deve ser deslocado nos eixos x e y para que o movimento total do mapa seja o mesmo de mapMgr.speed, esta formula é derivada do clássico teorema de pitágoras h^2 = x^2 + y^2
                var move = mapMgr.moveSpeed*Math.sqrt(0.5);
                console.log("Cateto: " + move);
                
                mapMgr.moveLeft(move);
                mapMgr.moveDown(move);
                //mapMgr.update();
            }
            //Teclas Cima e Esquerda
            else if(map["ArrowUp"] && map["ArrowLeft"]){
                var move = mapMgr.moveSpeed*Math.sqrt(0.5);
                console.log("Cateto: " + move);
                
                mapMgr.moveDown(move);
                mapMgr.moveRight(move);
                //mapMgr.update();
            }
            //Teclas Baixo e Esquerda
            else if(map["ArrowDown"] && map["ArrowLeft"]){
                var move = mapMgr.moveSpeed*Math.sqrt(0.5);
                console.log("Cateto: " + move);
                
                mapMgr.moveUp(move);
                mapMgr.moveRight(move);
                //mapMgr.update();
            }
            //Teclas Baixo e Direita
            else if(map["ArrowDown"] && map["ArrowRight"]){
                var move = mapMgr.moveSpeed*Math.sqrt(0.5);
                
                mapMgr.moveUp(move);
                mapMgr.moveLeft(move);
                //mapMgr.update();
            }
            //Mover apenas para um lado apenas se não mover na diagonal, caso contrário o mapa seria movido mais de uma vez
            else{
                if(map["ArrowRight"]){
                    mapMgr.moveLeft(mapMgr.moveSpeed);
                    //mapMgr.update();
                }
                //Esquerda
                if(map["ArrowLeft"]){
                    mapMgr.moveRight(mapMgr.moveSpeed);
                    //mapMgr.update();
                }
                //Cima
                if(map["ArrowUp"]){
                    mapMgr.moveDown(mapMgr.moveSpeed);
                    //mapMgr.update();
                }
                //Baixo
                if(map["ArrowDown"]){
                    mapMgr.moveUp(mapMgr.moveSpeed);
                    //mapMgr.update();
                }
            }
        }*/
        //);
    };
    Controller.prototype.resizeCanvas = function () {
        console.log("redmensionou");
        var canvas = document.getElementById("canvas");
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        //Pois quando o canvas é redmensionado ele é totalmente limpo, então é necessário ser redesenhado
        if (mapMgr.isReady)
            mapMgr.update();
    };
    Object.defineProperty(Controller.prototype, "ctx", {
        get: function () {
            return this.canvasCtx;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Controller.prototype, "canvas", {
        get: function () {
            return this.canvasElement;
        },
        enumerable: true,
        configurable: true
    });
    return Controller;
}());
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
var Creator = (function () {
    function Creator() {
    }
    Creator.inicialize = function () {
        Creator.canvas = document.getElementById("canvas");
        Creator.canvasCtx = Creator.canvas.getContext("2d");
    };
    Creator.getCoordinates = function (e) {
        var x = e.clientX;
        var y = e.clientY;
        //alert("Coordinates: (x" + Creator.countOfCoordinates + ": " + x + ", y" + Creator.countOfCoordinates + ": " + y + ")");
        Creator.inicialize();
        if (Creator.countOfCoordinates > 0 && Creator.countOfCoordinates % 2 != 0) {
            var coord = mapMgr.canvasCoordToMap(x, y);
            //Por algum motivo que desconheço o método .toFixed retorna uma String, então é necessário converter o número de volta para number
            this.x1 = parseInt(coord.x.toFixed(4));
            this.y1 = parseInt(coord.y.toFixed(4));
            control.addCreatorCoord(this.x0, this.y0, this.x1, this.y1);
            Creator.canvasCtx.lineTo(x, y);
            Creator.canvasCtx.stroke();
        }
        else {
            var coord = mapMgr.canvasCoordToMap(x, y);
            this.x0 = coord.x;
            this.y0 = coord.y;
            Creator.canvasCtx.moveTo(x, y);
        }
        Creator.countOfCoordinates++;
    };
    return Creator;
}());
Creator.countOfCoordinates = 0;
var InputHandler = (function () {
    function InputHandler() {
    }
    InputHandler.pressKey = function (evento) {
        var key = evento.key;
        //console.log("Presssionou " + key);
        this.keys[key] = true;
    };
    InputHandler.releaseKey = function (evento) {
        var key = evento.key;
        //console.log("Soltou " + key);
        this.keys[key] = false;
    };
    InputHandler.registerEvents = function () {
        onkeydown = function (evento) {
            //console.log(InputHandler.keys);
            //if(InputHandler.keys[evento.key]){
            InputHandler.pressKey(evento);
            InputHandler.updateDirection();
            //}
        };
        onkeyup = function (evento) {
            //console.log(InputHandler.keys);
            //if(InputHandler.keys[evento.key]){
            InputHandler.releaseKey(evento);
            InputHandler.updateDirection();
            //}
        };
    };
    //Calcula um vetor que representa a direção de acordo com as teclas pressionadas
    InputHandler.updateDirection = function () {
        //Acha um vetor que representa a direção que o personagem tem q ir
        var deltax = 0, deltay = 0;
        if (this.keys.ArrowUp)
            deltay -= 1;
        if (this.keys.ArrowDown)
            deltay += 1;
        if (this.keys.ArrowLeft)
            deltax -= 1;
        if (this.keys.ArrowRight)
            deltax += 1;
        if ((deltax == 0) && (deltay == 0)) {
            this.dir.dx = 0;
            this.dir.dy = 0;
        }
        else {
            //Acha-se o modulo do vetor para calcular o seu vetor unitário em seguida
            var modulo = Math.sqrt(Math.pow(deltax, 2) + Math.pow(deltay, 2));
            //Calcula o vetor unitário que representa a direção que o inimigo deve seguir, assim, o comprimento do vetor não influencia quando for-se multiplicar as coordenadas, caso fosse colocado o vetor anterior seria o mesmo que já te ra velocidade imbutida
            deltax = (deltax / modulo);
            deltay = (deltay / modulo);
            this.dir.dx = deltax;
            this.dir.dy = deltay;
        }
        console.log("deltax: " + this.dir.dx + " deltay: " + this.dir.dy);
        this.drawDir();
    };
    InputHandler.drawDir = function () {
        var ctx = control.ctx;
        var posx = 500, posy = 500;
        ctx.save();
        ctx.strokeStyle = "red";
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.fillStyle = "white";
        ctx.arc(posx, posy, 100, 0, 2 * Math.PI);
        ctx.fill();
        ctx.stroke();
        ctx.closePath();
        ctx.beginPath();
        ctx.strokeStyle = "rebeccapurple";
        ctx.fillStyle = "rebeccapurple";
        ctx.arc(posx, posy, 15, 0, 2 * Math.PI);
        ctx.moveTo(posx, posy);
        ctx.lineTo(posx + (100 * this.dir.dx), posy + (100 * this.dir.dy));
        ctx.stroke();
        ctx.fill();
        ctx.restore();
        ctx.closePath();
    };
    return InputHandler;
}());
//Variável que vai conterá um mapa com todas as teclas que estão ou não pressionadas
InputHandler.keys = {};
InputHandler.dir = { dx: 0, dy: 0 };
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
var control;
var mapMgr;
var mainChar;
//Inicialização depois do corpo da pagina ter carregado
function inicializar() {
    control = new Controller();
    mapMgr = new MapMgr(control.canvas);
    control.view("debug");
    //Ajusta o canvas ao tamanho da tela atual... E também já redesenha tudo chamando o metodo drawMap() de mapMgr
    control.resizeCanvas();
    mainChar = new Character(0.5, 0.5, mapMgr.spawX, mapMgr.spawY, control.canvas, config.char_radius);
    mapMgr.setMainChar(mainChar);
    mapMgr.loadMap(mapa, 0);
    InputHandler.registerEvents();
    document.getElementById('info').innerHTML = "Largura do mapa " + mapMgr.width + "<br/> Altura:" + mapMgr.height;
    //gameLoop();
}
//Para controlar a velocidade de movimento
var anterior = new Date().getTime();
var atual;
var decorrido;
function gameLoop() {
    atual = new Date().getTime();
    decorrido = atual - anterior;
    //Move o mapa verificando a variação de x e y a ser movida (dx e dy), esta variação é retornada pelo InputHandler que verifica quais teclas direcionais estão pressionadas
    var dx = InputHandler.dir.dx;
    var dy = InputHandler.dir.dy;
    //O InputHandler retorna a direção a ser seguida pelo personagem, como quem se move é o mapa, então esta direção deve ser invertida invertendo os sinais de dx e dy
    mapMgr.posX += (mapMgr.moveSpeed * (-dx));
    mapMgr.posY += (mapMgr.moveSpeed * (-dy));
    mapMgr.update();
    anterior = atual;
    requestAnimationFrame(gameLoop);
}
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
var MapMgr = (function () {
    //Eu passo o contexto do canvas para o proprio mapamgr desenhar nele
    //Obs: quando uso private,public ou protected antes de um parametro, ele se torna atributo da classe automaticamente
    function MapMgr(canvas) {
        this.canvas = canvas;
        this.wallWidth = 2;
        this.wallColor = "#60E941";
        this.failColor = "red";
        //zoom
        //Posição base em que os elementos serão desenhados (a imagem de fundo é exatamente nesta posição)
        this._posX = 0;
        this._posY = 0;
        //Velocidade de movimentção do mapa em pixels por segundo
        this._moveSpeed = 15;
        this.andarAt = 0;
        this.ctx = this.canvas.getContext("2d");
    }
    MapMgr.prototype.loadMap = function (map, andar) {
        console.log("Carregando mapa " + map[0].nome + "...");
        this.width = map[this.andarAt].largura;
        this.height = map[this.andarAt].altura;
        this.walls = map[this.andarAt].paredes;
        this.fails = map[this.andarAt].falhas;
        this.andares = map[this.andarAt].andares;
        this.spawX = map[this.andarAt].spaw.x;
        this.spawY = map[this.andarAt].spaw.y;
        this.bgImg = new Image();
        this.isReady = false;
        this.bgImg.src = map[0].fundo;
        //this.bgImg.width*=0.1;
        this.bgImg.onload = function () {
            //console.log("Terminou de carregar:"+this.src);
            //Usa-se o objeto da classe, pois dento de um evento o contexto é o do objeto que disparou o evento
            mapMgr.isReady = true;
            mapMgr.update();
        };
        this.centerIn(this.spawX, this.spawY);
    };
    MapMgr.prototype.update = function () {
        //console.log("Update em tudo");
        this.drawMap();
        this.character.update();
        //this.character.draw();
    };
    MapMgr.prototype.setMainChar = function (c) {
        this.character = c;
    };
    MapMgr.prototype.drawMap = function () {
        //console.log("Redesenhando mapa...");
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        //Desenha o plano de fundo
        this.drawBg();
        //Desenha as paredes(Objetos de colisão)
        this.drawWalls();
        //Desenha as falhas de acessibilidade visíveis
        this.drawFails();
    };
    MapMgr.prototype.centerIn = function (Xw, Yw) {
        //PONTO INICIAL
        //Coordenadas do centro da tela (do canvas)
        var cCanvasX = this.canvas.width / 2;
        var cCanvasY = this.canvas.height / 2;
        //Adapta as coordenadas para o zoom atual
        Xw *= config.proportion;
        Yw *= config.proportion;
        //Coordenadas do ponto do mapa que se deseja focar com relação ao canvas, (a coordenada passada via parâmetro deve ser com relação ao mapa, uma media do mapa)
        //PONTO DE DESTINO
        var localPx = this._posX + Xw;
        var localPy = this._posY + Yw;
        //console.log("localPx: " + localPx + " localPy: " + localPy);
        //As distâncias Dx e Dy de PD ate CC
        var Dx = localPx - cCanvasX;
        var Dy = localPy - cCanvasY;
        //console.log("Dx: " + Dx + " Dy: " + Dy);
        //A diferença entre os dois pontos é eliminada subtraindo do ponto final essa diferença
        this._posX = (this._posX - Dx);
        this._posY = (this._posY - Dy);
        //console.log("_posX: " + this._posX + " _posY: " + this._posY);
        this.character.ajustOnScreen();
        this.update();
        this.showCenter();
    };
    MapMgr.prototype.drawBg = function () {
        this.ctx.beginPath();
        this.ctx.rect(this._posX, this._posY, this.width * config.proportion, this.height * config.proportion);
        this.ctx.stroke();
        this.ctx.drawImage(this.bgImg, this._posX, this._posY, this.width * config.proportion, this.height * config.proportion);
    };
    MapMgr.prototype.showCenter = function () {
        var cCanvasX = this.canvas.width / 2;
        var cCanvasY = this.canvas.height / 2;
        this.ctx.save();
        this.ctx.beginPath();
        this.ctx.strokeStyle = "red";
        this.ctx.arc(cCanvasX, cCanvasY, 30, 0, 2 * Math.PI);
        this.ctx.stroke();
        this.ctx.restore();
        //console.log("Center X: " + cCanvasX + " Y: " + cCanvasY);
    };
    MapMgr.prototype.drawWalls = function () {
        //Salva as configurações do contexto anterior...
        this.ctx.save();
        //console.log("Desenhando paredes...");
        this.ctx.strokeStyle = this.wallColor;
        this.ctx.lineWidth = this.wallWidth;
        var i = 0;
        while (this.walls[i]) {
            var relativeStart = this.getRelative([this.walls[i].x0, this.walls[i].y0]);
            var x0 = relativeStart[0];
            var y0 = relativeStart[1];
            var relativeEnd = this.getRelative([this.walls[i].x1, this.walls[i].y1]);
            var x1 = relativeEnd[0];
            var y1 = relativeEnd[1];
            this.ctx.beginPath();
            this.ctx.moveTo(x0, y0);
            this.ctx.lineTo(x1, y1);
            this.ctx.stroke();
            i++;
        }
        //restaura as configurações do contexto anterior...
        this.ctx.restore();
    };
    MapMgr.prototype.drawFails = function () {
        this.ctx.save();
        //console.log("Desenhando falhas...");
        this.ctx.fillStyle = this.failColor;
        this.ctx.lineWidth = this.wallWidth;
        var i = 0;
        while (this.fails[i]) {
            this.ctx.beginPath();
            var fail = this.fails[i];
            var relative = this.getRelative([fail.x, fail.y]);
            this.ctx.fillRect(relative[0], relative[1], fail.width * config.proportion, fail.height * config.proportion);
            this.ctx.fill();
            i++;
        }
        this.ctx.restore();
    };
    /*public zoomIn(percent:number){
        var centerMapX = (this.canvas.width/2) - this._posX;
        var centerMapY = (this.canvas.height/2) - this._posY;
        console.log("Parte centralizada: x:" + centerMapX + ", y:" + centerMapY);
        this.proportion+=percent;
        
        //Recentraliza novamente o mapa no ponto anteriormente no centro
        this.centerIn(centerMapX,centerMapY);
    }
    public zoomOut(percent:number){
        if((this.proportion - percent) <= 0.5){
            this.proportion = 0.5;
        }
        else{
            var centerMapX = (this.canvas.width/2) - this._posX;
            var centerMapY = (this.canvas.height/2) - this._posY;
            
            console.log("Parte centralizada: x:" + centerMapX + ", y:" + centerMapY);
            this.proportion-=percent;
            
            //Recentraliza novamente o mapa no ponto anteriormente no centro
            this.centerIn(centerMapX,centerMapY);
        }
        
    }*/
    MapMgr.prototype.moveRight = function (px) {
        this._posX += px;
        this.character.updateCoord();
        var colide = Colision.checkColision(this);
        console.log("Coliding: " + colide);
        if (colide) {
            this._posX -= px;
            this.update();
        }
        else
            this.update();
    };
    MapMgr.prototype.moveLeft = function (px) {
        this._posX -= px;
        this.character.updateCoord();
        var colide = Colision.checkColision(this);
        console.log("Coliding: " + colide);
        //Esta coliding caso este movimento seja feito, então volte
        if (colide) {
            this._posX += px;
            this.update();
        }
        else
            this.update();
    };
    MapMgr.prototype.moveUp = function (px) {
        this._posY -= px;
        this.character.updateCoord();
        var colide = Colision.checkColision(this);
        console.log("Coliding: " + colide);
        if (colide) {
            this._posY += px;
            this.update();
        }
        else
            this.update();
    };
    MapMgr.prototype.moveDown = function (px) {
        this._posY += px;
        this.character.updateCoord();
        var colide = Colision.checkColision(this);
        //console.log("Coliding: " + colide);
        if (colide) {
            this._posY -= px;
            this.update();
        }
        else
            this.update();
    };
    /*public checkColision():boolean{
        for(var i =0; i < this.walls.length; i++){
            if(Colision.isColidingCharWall(this.character,this.walls[i])){
                return true;
            }
        }
        return false;
    }*/
    //Converte ponto no mapa para ponto no canvas
    MapMgr.prototype.getRelative = function (coord) {
        var x = (coord[0] * config.proportion) + this._posX;
        var y = (coord[1] * config.proportion) + this._posY;
        var tuple;
        tuple = [x, y];
        return tuple;
    };
    //Converte ponto no canvas para ponto no mapa
    MapMgr.prototype.canvasCoordToMap = function (x, y) {
        var mapX = (x - this._posX) / config.proportion;
        var mapY = (y - this._posY) / config.proportion;
        var coord = { x: mapX, y: mapY };
        return coord;
    };
    Object.defineProperty(MapMgr.prototype, "bg", {
        /*public getCenteredPointInMap(Cx:number, Cy:number):[number,number]{
            //Coordenadas do centro da tela (do canvas)
            var cCanvasX = this.canvas.width/2;
            var cCanvasY = this.canvas.height/2;
            
            var tuple:[number,number];
            tuple = [x,y];
            return tuple;
        }*/
        /*private getInCanvasPoint(){
            
        }*/
        get: function () {
            return this.bgImg;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MapMgr.prototype, "posY", {
        get: function () {
            return this._posY;
        },
        set: function (y) {
            var valorAnt = this._posY;
            this._posY = y;
            this.character.updateCoord();
            var colide = Colision.checkColision(this);
            //console.log("Coliding: " + colide);
            if (colide) {
                this._posY = valorAnt;
                this.update();
            }
            else
                this.update();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MapMgr.prototype, "posX", {
        get: function () {
            return this._posX;
        },
        set: function (x) {
            var valorAnt = this._posX;
            this._posX = x;
            this.character.updateCoord();
            var colide = Colision.checkColision(this);
            //console.log("Coliding: " + colide);
            if (colide) {
                this._posX = valorAnt;
                this.update();
            }
            else
                this.update();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MapMgr.prototype, "moveSpeed", {
        get: function () {
            return ((this._moveSpeed * decorrido) / 1000) * config.proportion;
        },
        enumerable: true,
        configurable: true
    });
    return MapMgr;
}());
var config = {
    'proportion': 10,
    'char_radius': 1
};
