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
      imageWidth: 200,
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
        $( `#${this.id_html}`).off( "mouseenter" );
    }
    GirarCarta(){
      var flip = $(`#${this.id_html}`).data("flip-model");
      $( `#${this.id_html}` ).flip(!flip.isFlipped)
    }
    ActivarEfecto()
    {
      if(this.playing){
        $("#"+this.id_html).flip({reverse: false,speed:200});
        $( "#"+this.id_html).hover(function(){$( this ).addClass( "pulsacion" );
          }, function() {
            $( this ).removeClass( "pulsacion" );
          })
      }
     
    }
  }

 class Baraja 
 {
    constructor(modo){ 
      this.listenerActivo = false;
      this.modo = modo;
      this.cantidadCartas = modo=="easy"? 2 : modo=="medium"? 3 : 4;
      this.nivel = 0;
      this.tiempo = this.cantidadDeTiempo(modo);
      this.intentos =  this.cantidadDeIntentos(modo);
      this.tablero = document.getElementById("tablero");//ahorramos busquedas...
      this.Cartas = [];
      this.CartasVector = []; //Contiene la informacion de las cartas creadas.
      this.ClickCarta = [];
      this.score = 0;
      this.MostrarIntentos();
      this.StartTime();
      this.intervalo;
      //intervalo
    }

    StartTime(){
      var t = this
      if(this.modo != "easy")
        this.intervalo = setInterval(function(){t.tiempo -= 1; t.MostrarTiempo();t.winOrLoseAction()},1000)
    }

    stopInterval(){
      var t = this
      if(this.modo != "easy"){

        clearInterval(t.intervalo);
        console.log("LO DETUVE")
      }
        
    }

    cantidadDeIntentos(modo){
      return modo == "easy"? -1 : modo=="medium"? 15 : 20;
    }

    AumentarScore(){
      if(this.modo != "easy"){
        return this.modo=="medium"? this.intentos*2 : this.intentos*4;
      }
      return 4;
     
    }

    cantidadDeTiempo(modo){
      return modo=="easy"? -1 : modo=="medium"? 40 : 35;
    }

    restablecerCantidadDeIntentos(){
      this.intentos = this.cantidadDeIntentos(this.modo);
      this.MostrarIntentos();
    }

    mostrarInformacion(){
      this.MostrarIntentos();
      this.MostrarNivel();
      this.MostrarScore();
      this.MostrarTiempo();
    }

    MostrarScore(){
      document.getElementById("score").innerHTML= parseInt(this.score);
    }

    MostrarTiempo(){
      if(this.modo == "easy"){
        document.getElementById("time").innerHTML='<i class="fas fa-infinity"></i>';
      }else{
        document.getElementById("time").innerHTML= parseInt(this.tiempo) + "s";
      }
      
    }

    MostrarIntentos()
    {
      if(this.modo == "easy"){
        document.getElementById("intentos").innerHTML='<i class="fas fa-infinity"></i>';
      }
      else{
        document.getElementById("intentos").innerHTML=this.intentos;
      }
    }

    MostrarNivel()
    {
      document.getElementById("nivel").innerHTML="Nivel actual: "+ parseInt(this.nivel+1);
    }

    disminuirIntentos()
    {
      if(this.modo != "easy"){
        this.intentos -= 1;
        this.MostrarIntentos();
      }
    }

    nivelMaximo(){

      if(this.modo == "easy"){
        return this.nivel == 3? 2:1; // nivel 3 porque empieza con 4 cartas y tiene maximo 10
      }
      else if(this.modo == "medium"){
        return this.nivel == 5? 2:1; // maximo 15 cartas empieza con 6
      }
      return this.nivel == 6? 2:1; // maximo 20 cartas empieza con 8
    }

    winOrLose()
    {
      
      if((this.intentos <= 0  || this.tiempo <= 0 )&& this.modo != "easy"){
        console.log("perdiste")
        return 0; //0 significa que perdio
        
      }
      else
      {
        for(var i = 0; i < this.Cartas.length;i++){
          if(this.Cartas[i].playing){
           
            return -1; //-1 significa que aun  no gana ni pierde
          }
        }
       
        return  this.nivelMaximo(); //1 significa que ganó.
      
      }
      
      
    }

    subirDeNivel(){
      this.vaciarBaraja();
      this.CargarCartasPredeterminadas();
      this.restablecerCantidadDeIntentos();
      this.activarListener();
      this.MostrarNivel();
    }

    winOrLoseAction(){
      var estadoDeLaPartida = this.winOrLose()
   
      if(estadoDeLaPartida != -1)
      {
        this.stopInterval()
        if( estadoDeLaPartida == 1)
        {
          this.nivel += 1;
          Swal.fire({
            title: 'Custom width, padding, background.',
            width: 600, title: '¡Felicidades!',
            text: `¡Has subido de nivel!. Nivel ${this.nivel +1}`,
            imageUrl: 'https://k30.kn3.net/taringa/4/8/9/1/6/3/4/k_v3dia/FD1.gif',
            imageWidth: 400,
            imageHeight: 200,
            imageAlt: 'Custom image',
            padding: '3em',
            backdrop: `
              rgba(0,0,0,1)
              url("https://sweetalert2.github.io/images/nyan-cat.gif")
              left top
              no-repeat
            `
          })
          this.subirDeNivel();
        }
        else if(estadoDeLaPartida == 2)
        {
          Swal.fire({
            title: 'Custom width, padding, background.',
            width: 600, title: '¡Felicidades!',
            text: `¡Pasaste el juego!`,
            imageUrl: 'https://comunidad.iebschool.com/iebs/files/2015/03/hacer-venta.gif',
            imageWidth: 400,
            imageHeight: 200,
            imageAlt: 'Custom image',
            padding: '3em',
            backdrop: `
              rgba(0,0,0,1)
              url("https://sweetalert2.github.io/images/nyan-cat.gif")
              left top
              no-repeat
            `
          }).then(function() {
            $( "#changeDificult" ).trigger( "click" );
          });;
          
        }
        else if(estadoDeLaPartida == 0){
          baraja.nivel = 0;
          Swal.fire({
            title: 'Custom width, padding, background.',
            width: 600, title: '¡Ups...!',
            text: '¡Has perdido, intentalo de nuevo!.',
            imageUrl: 'https://media.giphy.com/media/59d1zo8SUSaUU/giphy.gif',
            imageWidth: 400,
            imageHeight: 200,
            imageAlt: 'Custom image',
            padding: '3em',
            okOnConfirm: false,
            backdrop: `
              rgba(0,0,0,1)
              url("https://sweetalert2.github.io/images/nyan-cat.gif")
              left top
              no-repeat
            `
          }).then(function() {
            $( "#changeDificult" ).trigger( "click" );
          });
        }
        
      }

        
      }
    
    eventoCLickCarta(objCarta){
      
      if(this.ClickCarta < 1 && objCarta.playing){
        this.ClickCarta.push(objCarta);
      }
      else if(objCarta.playing && objCarta.Get_idHtml() != this.ClickCarta[0].Get_idHtml())
      {
          if(objCarta.Get_idCarta() == this.ClickCarta[0].Get_idCarta())
          {
            this.disminuirIntentos();
            this.score += this.AumentarScore();
            this.MostrarScore()
            console.log(this.score)
            objCarta.GirarCarta();
            objCarta.deshabilitarCarta();
            this.ClickCarta[0].deshabilitarCarta();
            this.ClickCarta.pop();
            objCarta.getImagen().activarMensaje();
            console.log("desabilitadas")
          }
          else{
            this.disminuirIntentos();
            var a =this.ClickCarta[0];
            //this.ClickCarta[0].playing = false; // Para que no le pueda hacer click
            //objCarta.playing = false; //Para que no le pueda hacer clik
            setTimeout(function(){objCarta.GirarCarta();
              a.GirarCarta();;},400)

            this.ClickCarta.pop();
          }
      }
      else
      {
        this.disminuirIntentos();
        this.ClickCarta.pop();
      }
      //this.MostrarIntentos();
    }

    CargarCartasPredeterminadas()
    {
      var cantidad = this.cantidadCartas + this.nivel;
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

      }while(Info_cartasJSon.length != 0 && id != cantidad)
          
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
      //this.Cartas = this.Cartas.splice(0, this.Cartas.length);
      this.stopInterval();
      this.Cartas = []
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
var baraja;

function jugar(){
  $("#game").hide(); 
  $("#playing").show();
  $("#GameInfo").show();
  var a = "d-flex flex-column bd-highlight mb-3"
  $("#GameInfo").removeClass().addClass("flotante").addClass("front " +modo+ " " + a)
  //baraja.modoDeJuego(modo);
  baraja.CargarCartasPredeterminadas();
  baraja.activarListener();
  baraja.mostrarInformacion();
}



$('#btn_easy').click(function() {
    modo ="easy"
    baraja = new Baraja(modo)
    jugar(modo);
});

$('#btn_medium').click(function() {
  modo="medium"
  baraja = new Baraja(modo)
  jugar(modo);
});

$('#btn_hard').click(function() {
  modo ="hard"
  baraja = new Baraja(modo)
  jugar(modo);
});


$('#changeDificult').click(function() {
  $("#game").show();
  tipoJuego="easy";
  $("#playing").hide();
  $("#GameInfo").hide();
  baraja.vaciarBaraja();
});


function Carta_operacion(id) {
  console.log(`Nivel: ${baraja.nivel}`)
  var carta = baraja.Cartas[id]

  if(carta.playing){
    carta.ActivarEfecto();
    baraja.eventoCLickCarta(carta);
    baraja.winOrLoseAction()
}}
