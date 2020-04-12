class Imagen{

  constructor(imagen_json){
    this.imagen_url = `images/Cartas/${imagen_json.url}`;
    this.titulo = imagen_json.titulo;
    this.descripcion = imagen_json.descripcion;
  }

  activarMensaje(){
    Swal.fire({
      title: this.titulo,
      text: this.descripcion,
      imageUrl: this.imagen_url,
      imageWidth: 400,
      imageHeight: 200,
      imageAlt: 'Custom image',
    })
  }
}

class Carta 
{ 
    playing = true;
    constructor(id_carta,id_html,imagen_json) {
      this.id_html = id_html;
      this.id_carta = id_carta;
      this.imagen_url = new Imagen(imagen_json);
     // this.playing = true;
      this.getElement = document.getElementById(this.id_carta);
    }
    Set_idCarta(id){
      this.id_figura = id;
    }
    getImagen(){
      return this.imagen_url;
    }
    Get_idCarta(){
      return this.id_carta;
    }
    Get_idHtml(){
      return this.id_html;
    }
    deshabilitarCarta()
    {
        this.playing = false;
        $(`#${this.id_html}`).off(".flip");
    }
    GirarCarta(){
      var flip = $(`#${this.id_html}`).data("flip-model");
      $( `#${this.id_html}` ).flip(!flip.isFlipped)
    }
    ActivarEfecto()
    {
      if(this.playing){
        $("#"+this.id_html).flip({reverse: false,speed:200});
      }
     
    }
  }

 class Baraja 
 {
    constructor(modo){ 
      this.listenerActivo = false;
      this.modo = modo;
      this.cantidadCartas = modo=="easy"? 3 : modo=="medium"? 5 : 7;
      this.nivel = 1;
      this.tiempo = modo=="easy"? -1 : modo=="medium"? 40 : 35;
      this.intentos = modo=="easy"? -1 : modo=="medium"? 15 : 20;
      this.tablero = document.getElementById("tablero");//ahorramos busquedas...
      this.Cartas = [];
      this.CartasVector = []; //Contiene la informacion de las cartas creadas.
      this.ClickCarta = [];
    }

    eventoCLickCarta(objCarta){
      
      if(this.ClickCarta < 1 && objCarta.playing){
        this.ClickCarta.push(objCarta);
      }
      else if(objCarta.playing && objCarta.Get_idHtml() != this.ClickCarta[0].Get_idHtml())
      {
          if(objCarta.Get_idCarta() == this.ClickCarta[0].Get_idCarta())
          {
            objCarta.GirarCarta();
            objCarta.deshabilitarCarta();
            this.ClickCarta[0].deshabilitarCarta();
            this.ClickCarta.pop();
            objCarta.getImagen().activarMensaje();
            console.log("desabilitadas")
          }
          else{
            console.log(this.ClickCarta[0])
            setTimeout(function(){objCarta.GirarCarta();
              this.ClickCarta[0].GirarCarta();
              this.ClickCarta.pop();},400)
          }
      }
      else{
        this.ClickCarta.pop();
      }
      
    }

    CargarCartasPredeterminadas(){
      var Info_cartasJSon = getInfo()["Imagen"];
      var Info_cartasJSonAux = getInfo()["Imagen"];
      var eliminado = [];
      let id_carta = [];
      let id = 0;
      let id_html = 0;

      //Fase 1, agrego elementos , y sean copia (mismo id_carta) y originales.
      do{
       let azar = Math.floor(Math.random() * (Info_cartasJSon.length));
       
       let nuevaOCopia = Math.floor(Math.random() * 3);

       if(eliminado.length > 0 && nuevaOCopia == 1)
       {
        this.generarCartas(id_carta[0],id_html,eliminado[0]);
        let Elemento = Info_cartasJSonAux.indexOf(eliminado[0]);
        Info_cartasJSonAux.splice(Elemento,1); //Como ya se agregó el elemento entonces, no se tiene quevolver a agregar en la segunda fase.
        id_carta.splice(0,1);
        eliminado.splice(0,1);
        console.log("if " + Info_cartasJSon.length)
       }
       else
       {
        this.generarCartas(id,id_html,Info_cartasJSon[azar]);
        eliminado.push(Info_cartasJSon[azar])
        id_carta.push(id);
        Info_cartasJSon.splice(azar,1)
        id++;
        console.log(Info_cartasJSon.length)
       }
       id_html += 1;

      }while(Info_cartasJSon.length != 0)
          
      eliminado.concat(Info_cartasJSonAux);
      console.log(`Elimindado: ${eliminado}`)
      //Fase 2, agrego elementos copia.
      while(eliminado.length > 0){
        let azar = Math.floor(Math.random() * (eliminado.length));
        this.generarCartas(id_carta[azar],id_html,eliminado[azar]);
        id_carta.splice( azar, 1 );
        eliminado.splice(azar,1);
        id_html += 1;
      }
    }

    vaciarBaraja(){
      this.Cartas = this.Cartas.splice(0, this.Cartas.length);
      this.tablero.innerHTML = "";
      this.listenerActivo = false;
    }

    nuevaCarta(id_html,id_carta,ImageJson)
    { 
      this.Cartas.push(new Carta(String(id_html),String(id_carta),ImageJson)); 
    }
    modoDeJuego(modo){
      this.modo = modo;
    }

    generarCartas(id_carta,id_html,json)
    {
        this.nuevaCarta(id_carta,id_html,json);
        this.tablero.innerHTML += '<div class="card-containers">  <div class="cardGame" id="'+ id_html +'" onclick="Carta_operacion('+"'"+id_html+"'"+')"> <div class="front '+ this.modo +'"> Memorama </div> <div class="back"><img src='+ 'images/cartas/'+ json.url +'> </div></div></div>'
    }

    activarListener()
    {
      if(!this.listenerActivo)
      {
        for(var i = 0;i < this.Cartas.length; i++)
          this.Cartas[String(i)].ActivarEfecto();
      }
        this.listenerActivo = true;
    }
 }


var rotation = 0;
var tipoJuego = "";
jQuery.fn.rotate = function(degrees) {
    $(this).css({'transform' : 'rotate('+ degrees +'deg)'});
    return $(this);
};

$('.vibrar').click(function() {
    rotation += 5;
    $(this).rotate(rotation);
});
const baraja = new Baraja("easy");

function jugar(modo){
  $("#game").hide(); 
  $("#playing").show();
  baraja.modoDeJuego(modo);
  baraja.CargarCartasPredeterminadas();
  baraja.activarListener();
}

$('#btn_easy').click(function() {
    jugar("easy");
});
$('#btn_medium').click(function() {
  jugar("medium");
});
$('#btn_hard').click(function() {
  jugar("hard");
});


$('#changeDificult').click(function() {
  $("#game").show();
  tipoJuego="easy";
  $("#playing").hide();
  baraja.vaciarBaraja();
});


function Carta_operacion(id) {
  var carta = baraja.Cartas[id]
  if(carta.playing){
    carta.ActivarEfecto();
    baraja.eventoCLickCarta(carta);
  }

}