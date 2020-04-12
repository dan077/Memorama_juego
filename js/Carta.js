class Carta 
{
    constructor(id_html,id_carta,imagen_url) {
      this.id_html = id_html;
      this.id_carta = id_carta;
      this.imagen = imagen;
      this.imagen_url = false;
    }

    Get_idCarta(id){
      this.id_figura = id;
    }
    
    getElement(){
      return document.getElementById(this.numero);
    }

    deshabilitarCarta(){
        this.playing = true;
    }

    ActivarEfecto(){
        var card = getElement(this.id_html);
        console.log(this.id_html)
        card.addEventListener('click',function() {
            if(this.playing)
                return;
                
            this.playing = true;
            anime({
                targets: card,
                scale: [{value: 1}, {value: 1.4}, {value: 1, delay: 250}],
                rotateY: {value: '+=180', delay: 200},
                easing: 'easeInOutSine',
                duration: 400,
                complete: function(anim){
                    this.playing = false;
                }
            });
        });

    }
  }

  export  class Baraja {
    constructor(modo) {
      this.Cartas = [];
      this.listenerActivo = false;
      this.modo = modo;
      this.generarCartas = modo=="facil"? 3 : modo=="medio"? 5 : 7;
      this.nivel = 1;
      this.tiempo = modo=="facil"? -1 : modo=="medio"? 40 : 35;
      this.intentos = modo=="facil"? -1 : modo=="medio"? 15 : 20;
      this.tablero = document.getElementById("tablero");//ahorramos busquedas...
    }

    nuevaCarta(id_html,id_carta,imagen_url)
    { 
      this.Cartas.push(new Carta(id_html,id_carta,imagen_url)); 
    }

    generarCartas(imagen_url)
    {

      for(i = 0; i < this.generarCartas;i++){
        this.nuevaCarta(i,0,imagen_url);
        this.tablero.innerHTML += '<div class="card-containers">  <div class="cardGame" id='+ id_html +'" onclick="carta(' + id_html +')"> <div class="front '+ this.modo +'"> Memorama </div> <div class="back"><img src='+ imagen_url +'> </div></div></div>'
      }
    }

    activarListener()
    {
      if(!this.listenerActivo){
        for(i = 0;i < this.Cartas.length; i++)
          Cartas[String(i)].ActivarEfecto();
        }
        this.listenerActivo = true;
    }
  }
  
  export  function Carta_operacion(id) {
    console.log(Baraja[id])
  }