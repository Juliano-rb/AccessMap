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
        this.wallColor = "blue";
        this.failColor = "red";
        //Configurações do estado do mapa,proporção de zoom, posição
        this.proportion = 1;
        this.posX = 0;
        this.posY = 0;
        this.andarAt = 0;
        this.ctx = this.canvas.getContext("2d");
    }
    MapMgr.prototype.loadMap = function (map, andar) {
        console.log("Carregando mapa " + map[0].nome + "...");
        this.walls = map[this.andarAt].paredes;
        this.fails = map[this.andarAt].falhas;
        this.andares = map[this.andarAt].andares;
        this.bgImg = new Image();
        this.bgImg.src = map[0].fundo;
        //this.bgImg.width*=0.1;
        this.bgImg.onload = function () {
            console.log("Terminou de carregar:" + this.width + "x" + this.height);
        };
    };
    MapMgr.prototype.drawMap = function () {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        console.log("Desenhando imagem de fundo " + this.bgImg.src);
        this.ctx.drawImage(this.bgImg, this.posX, this.posY, this.bgImg.width * this.proportion, this.bgImg.height * this.proportion);
        this.drawWalls();
        this.drawFails();
    };
    MapMgr.prototype.drawWalls = function () {
        //Salva as configurações do contexto anterior...
        this.ctx.save();
        console.log("Desenhando paredes...");
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
        console.log("Desenhando falhas...");
        this.ctx.fillStyle = this.failColor;
        this.ctx.lineWidth = this.wallWidth;
        var i = 0;
        while (this.fails[i]) {
            this.ctx.beginPath();
            var fail = this.fails[i];
            var relative = this.getRelative([fail.x, fail.y]);
            this.ctx.fillRect(relative[0], relative[1], fail.width * this.proportion, fail.height * this.proportion);
            this.ctx.fill();
            i++;
        }
        this.ctx.restore();
    };
    MapMgr.prototype.zoomIn = function (percent) {
        var widthAnt = this.bgImg.width * this.proportion;
        var heigthAnt = this.bgImg.height * this.proportion;
        this.proportion += percent;
        var widthNew = this.bgImg.width * this.proportion;
        var heigthNew = this.bgImg.height * this.proportion;
        var toCentLeft = (widthNew - widthAnt) / 2;
        var toCentUp = (heigthNew - heigthAnt) / 2;
        this.moveLeft(toCentLeft);
        this.moveUp(toCentLeft);
    };
    MapMgr.prototype.zoomOut = function (percent) {
        var widthAnt = this.bgImg.width * this.proportion;
        var heigthAnt = this.bgImg.height * this.proportion;
        this.proportion -= percent;
        var widthNew = this.bgImg.width * this.proportion;
        var heigthNew = this.bgImg.height * this.proportion;
        var toCentLeft = (widthAnt - widthNew) / 2;
        var toCentUp = (heigthAnt - heigthNew) / 2;
        this.moveRight(toCentLeft);
        this.moveDown(toCentLeft);
    };
    MapMgr.prototype.moveRight = function (px) {
        this.posX += px;
    };
    MapMgr.prototype.moveLeft = function (px) {
        this.posX -= px;
    };
    MapMgr.prototype.moveUp = function (px) {
        this.posY -= px;
    };
    MapMgr.prototype.moveDown = function (px) {
        this.posY += px;
    };
    //Metodo que calcula as novas coordenadas para o canvas de acordo com o zoom e o local do mapa
    MapMgr.prototype.getRelative = function (coord) {
        var x = (coord[0] + this.posX) * this.proportion;
        var y = (coord[1] + this.posY) * this.proportion;
        var tuple;
        tuple = [x, y];
        return tuple;
    };
    Object.defineProperty(MapMgr.prototype, "bg", {
        get: function () {
            return this.bgImg;
        },
        enumerable: true,
        configurable: true
    });
    return MapMgr;
}());
