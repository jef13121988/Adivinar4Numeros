// Clase que corre el juego
class ElJuego {

    /* -------------------------------- Atributos ------------------------------- */

    constructor(){

        this.referencia; // Para los Event Listeners
        this.arregloNumeros = [ "0", "1", "2", "3", "4", "5", "6", "7", "8", "9" ]; // Arreglo conteniendo los valores que puede adoptar el sorteo
        this.numeroParaAdivinar = this.crearNumero(); // Corresponde a la variable que va a contener el número a deducir/adivinar
        this.intentoActual; // Variable que contiene el intento actual a analizar
        this.buenas; // Variable que contiene las buenas en el intento actual a analizar
        this.regulares; // Variable que contiene las regulares en el intento actual a analizar
        this.maximoIntentos = 0; // Variable a la que se asigna el número máximo de intentos
        this.maximoTiempo = 0; // Variable a la que se le asigna el tiempo máximo para adivinar el número
        // this.cantidadDeIntentos = 0; // Contador con el número de intentos
        this.intentos = []; // Arreglo que incorpora a los intentos
        this.resultadosIntentos = []; // Arreglo que incluye los resultados correspondientes a cada intento
        this.seccion = document.querySelector('#caja'); // Selecciono el contenedor que se va a modificar
        this.inputNumero; // Para el input de los 4 dígitos
        this.btnSubmitir; // Para el botón utilizado para submitir el intento
        this.cajaMensajes; // La caja donde aparecen los mensajes

        // Función para iniciar el juego
        this.iniciarJuego();

    }

    /* --------------------------------- Métodos -------------------------------- */
    
    // Función para dar inicio al juego
    iniciarJuego(){

        // Selecciono el botón
        const btnInicio = document.querySelector('#iniciarJuego');

        // Creo el Event Listener que levante si el jugador inicia el juego
        btnInicio.addEventListener('click', this.referencia = () => {

            // Remuevo el Event Listener
            btnInicio.removeEventListener('click', this.referencia);

            // Inicio la fórmula para colocar el layout del juego
            this.pantallaJuego();

        });

    }

    // Función que realiza el sorteo entre los elementos del array ingresado
    sorteo( arreglo ){

        const sorteo = Math.floor(Math.random() * arreglo.length);
        return arreglo[sorteo];

    }

    // Creo el número a adivinar
    crearNumero(){

        // Creo una copia del arreglo para eliminar los números que se vayan utilizando
        const nuevoArreglo = this.arregloNumeros;

        const digito1 = this.sorteo( nuevoArreglo ); // Sorteo el primer dígito
        let indice = nuevoArreglo.indexOf( digito1 ); // Busco el índice del dígito sorteado
        nuevoArreglo.splice(indice, 1); // Elimino el dígito sorteado del arreglo
        
        const digito2 = this.sorteo( nuevoArreglo ); // Sorteo el segundo dígito
        indice = nuevoArreglo.indexOf( digito2 ); // Busco el índice del dígito sorteado
        nuevoArreglo.splice(indice, 1); // Elimino el dígito sorteado del arreglo
        
        const digito3 = this.sorteo( nuevoArreglo ); // Sorteo el tercer dígito
        indice = nuevoArreglo.indexOf( digito3 ); // Busco el índice del dígito sorteado
        nuevoArreglo.splice(indice, 1); // Elimino el dígito sorteado del arreglo

        const digito4 = this.sorteo( nuevoArreglo ); // Sorteo el cuarto dígito
        
        // Uno los 4 dígitos
        return `${digito1}${digito2}${digito3}${digito4}`;

    }

    // Controla si el valor ingresado es un número
    controlNumero( variable ){

        const numero = Number( variable ); // Convierto el valor ingresado en número

        return !isNaN( numero ); // Controlo si el resultado es un número

    }

    // Controla si el valor ingresado tiene cuatro caracteres
    controlLargo( variable ){

        return variable.length === 4;    

    }

    // Coloco el layout del juego
    pantallaJuego(){

        // Genero el código HTML
        this.seccion.innerHTML = // html
            `<div>
                <input type="text" id="submitir" placeholder="Ingrese un número de 4 dígitos">
                <button id="btnSubmitir" class="btnSubmitir"> Enviar </button>
            </div>
            <div class="d-flex justify-content-center">
                <p id="cajaMensajes" class="eventos"> Acá van a aparecer las respuestas una vez que se haya submitido una.
                </p>
            </div>`;

        // Asigno una variable a cada contenedor
        this.inputNumero = document.querySelector('#submitir');
        this.btnSubmitir = document.querySelector('#btnSubmitir');
        this.cajaMensajes = document.querySelector('#cajaMensajes');

        // Creo el Event Listener que levante si el jugador submitió un número
        this.btnSubmitir.addEventListener('click', this.referencia = () => {

            // Inicio la fórmula que levanta el input
            this.levantarSubmitir();

        });

    }

    // Fórmula que levanta el input submitido
    levantarSubmitir(){
        
        // Levanto el valor del input
        this.intentoActual = this.inputNumero.value;

        // Reviso si es un número de 4 dígitos
        this.controlInput( this.intentoActual );
        
    }

    // Fórmula que controla que el input sea un número de 4 dígitos
    controlInput( variable ){

        if ( this.controlNumero( variable ) && this.controlLargo( variable ) ){

            this.buenas = this.controlBuenas( this.intentoActual ); // Reviso las buenas del intento
            this.regulares = this.controlRegulares( this.intentoActual ); // Reviso las regulares del intento

            // Envío el resultado del intento al arreglo de intentos
            this.intentos.push ( {
                "valor": this.intentoActual,
                "buenas": this.buenas,
                "regulares": this.regulares
                } );

            // Genero el mensaje con los intentos
            let mensaje = this.generarMensaje();

            // Reviso si ganó
            if ( this.buenas === 4 ){

                mensaje += `¡Ganaste! <br>
                    El número a adivinar era ${this.numeroParaAdivinar} <br>
                    Lo sacaste en ${this.intentos.length} intentos`

                // Remuevo el event listener
                this.btnSubmitir.removeEventListener('click', this.referencia)

            }
            
            // Inserto el mensaje generado
            this.insertarMensaje( mensaje );      

        }
        
    }

    // Reviso cuántos dígitos son buenos
    controlBuenas( numero ){

        let buenas = 0; // Defino la variable para contar las buenas

        // Reviso los números con coincidencia
        for ( var i = 0 ; i < 4 ; i++ ) {
            if ( numero[i] === this.numeroParaAdivinar[i] ){
              buenas += 1;
            }

        }

        return buenas;

    }

    // Reviso cuántos dígitos son regulares
    controlRegulares( numero ){

        let regulares = 0; // Defino la variable para contar las buenas

        // Reviso los números con coincidencia
        for ( var i = 0 ; i < 4 ; i++ ) {
            for ( var j = 0 ; j < 4 ; j++ ) {
                if ( i != j ){
                    if ( numero[i] === this.numeroParaAdivinar[j] ){
                        regulares += 1;
                    }

                }

            }
        }

        return regulares;

    }

    // Genero el mensaje a mostrar
    generarMensaje(){
        
        let mensaje = "";

        this.intentos.forEach( intento => {
            mensaje += `${intento.valor}: Buenas: ${intento.buenas}. Regulares: ${intento.regulares}.<br>`
            
        });

        return mensaje;

    }

    // Inserto el mensaje indicado
    insertarMensaje( mensaje ){

        this.cajaMensajes.innerHTML = mensaje;

    }

    // Doy la opción de reiniciar el juego
    juegoFinalizado(){

        // Remuevo el Event Listener
        this.btnSubmitir.removeEventListener('click', this.referencia);

    }

}

// Creo una instancia del juego
const juego = new ElJuego();