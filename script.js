//Definir stats.  De momento todo será más o menos aleatorio con valores máximos.

function crearPersonaje(nombre) {
    return {
      nombre: nombre,
      vida: Math.floor(Math.random() * (150 - 100 + 1)) + 100,
      escudo: 0,
      ataque: Math.floor(Math.random() * 50) + 1
    }
  }
  
//Crear nombre de personajes

  let jugador = crearPersonaje("Goku");
  let oponente = crearPersonaje("Vegeta");
  
// Pelea daños y escudo serán random. Quiero ver otra forma de hacer lo del escudo

while (jugador.vida > 0 && oponente.vida > 0) {
  let accion = prompt("¿Quieres 'atacar' o 'defender'?", "atacar/defender");

  if (accion.toLowerCase() === "atacar") {
    let danoJugador = Math.floor(Math.random() * jugador.ataque) + 1;
    let danoOponente = Math.floor(Math.random() * oponente.ataque) + 1;

    oponente.vida -= danoJugador;
    console.log(`Atacas a ${oponente.nombre} y le haces ${danoJugador} de daño. Vida restante del oponente: ${oponente.vida}`);

    if (oponente.vida > 0) {
      jugador.vida -= Math.max(danoOponente - jugador.escudo, 0);
      console.log(`${oponente.nombre} te ataca y te hace ${danoOponente} de daño. Tu vida restante: ${jugador.vida}`);
      jugador.escudo = 0; // Escudo se reinicia después de un turno
    }
  } else if (accion.toLowerCase() === "defender") {
    jugador.escudo = Math.floor(Math.random() * 50) + 1;
    console.log(`Te defiendes y generas un escudo de ${jugador.escudo} puntos.`);
  } else {
    alert("Acción no válida. Intenta de nuevo.");
  }
}
//Final

  if (jugador.vida <= 0) {
    console.log("¡Te derrotaron! Mejor suerte a la próxima");
  } else {
    console.log("¡Felicidades! ¡Ganaste el combate!");
  }
  