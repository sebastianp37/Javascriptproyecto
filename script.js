// Reemplazar el array de pokemones por una variable vacía
let pokemones = [];
let jugador = null;
let oponente = null;
let proteccionUsada = false;
let estadisticas = {
    victorias: 0,
    derrotas: 0,
    ultimoPokemon: null,
    batallasJugadas: 0
};

// Agregar función para cargar los datos del JSON
async function cargarPokemones() {
  try {
    const response = await fetch('./data/pokemones.json');
    const data = await response.json();
    pokemones = data.pokemones;
    mostrarPokemones();
  } catch (error) {
    console.error('Error al cargar los pokemones:', error);
    document.getElementById('pokemon-seleccion').innerHTML = 
      '<p style="color: red;">Error al cargar los pokémones. Por favor, recarga la página.</p>';
  }
}

// Modificar la función mostrarPokemones para incluir más información
function mostrarPokemones(pokemonesAMostrar = pokemones) {
  const contenedor = document.getElementById("pokemon-seleccion");
  contenedor.innerHTML = "";
  pokemonesAMostrar.forEach((pokemon) => {
    const div = document.createElement("div");
    div.className = "pokemon-seleccion-item";
    div.innerHTML = `
      <img src="${pokemon.img}" alt="${pokemon.nombre}" class="pokemon-miniatura">
      <div class="pokemon-info">
        <div class="pokemon-nombre">${pokemon.nombre}</div>
        <div class="pokemon-tipo">${pokemon.tipo}</div>
        <div class="pokemon-stats">HP: ${pokemon.vida}</div>
      </div>
    `;
    div.onclick = () => seleccionarPokemon(pokemon.id - 1);
    contenedor.appendChild(div);
  });
}

// Modificar el buscador para incluir búsqueda por tipo
document.getElementById("buscador").addEventListener("input", (e) => {
  const busqueda = e.target.value.toLowerCase();
  const filtrados = pokemones.filter(pokemon => 
    pokemon.nombre.toLowerCase().includes(busqueda) ||
    pokemon.tipo.toLowerCase().includes(busqueda)
  );
  mostrarPokemones(filtrados);
});

// Modificar la inicialización para cargar los datos
document.addEventListener('DOMContentLoaded', () => {
  cargarPokemones();
  cargarEstadisticas();
});

// Seleccionar Pokémon
function seleccionarPokemon(index) {
  if (!jugador) {
    jugador = { ...pokemones[index] };
    document.getElementById("img-jugador").src = jugador.img;
    document.getElementById("vida-jugador").style.display = "block"; // Mostrar vida del jugador
    estadisticas.ultimoPokemon = jugador.nombre; // Guardar último Pokémon
    guardarEstadisticas();
    alert(`Seleccionaste a ${jugador.nombre}. Ahora selecciona al oponente.`);
  } else if (!oponente) {
    oponente = { ...pokemones[index] };
    document.getElementById("img-oponente").src = oponente.img;
    document.getElementById("vida-oponente").style.display = "block"; // Mostrar vida del oponente
    alert(`Tu oponente será ${oponente.nombre}. ¡Que comience la batalla!`);
    inicializarBatalla();
  }
}
// Inicializar batalla
function inicializarBatalla() {
  // Ocultar los botones de selección
  document.getElementById("pokemon-seleccion").style.display = "none";
  
  // Hacer las imágenes más grandes
  document.getElementById("img-jugador").classList.add("en-batalla");
  document.getElementById("img-oponente").classList.add("en-batalla");
  // Mostrar los botones de ataque
  document.getElementById("ataques-container").style.display = "flex"; 

  // Establecer los nombres de los ataques
  document.getElementById("ataque-1").textContent = jugador.movimientos[0];
  document.getElementById("ataque-2").textContent = jugador.movimientos[1];
  document.getElementById("ataque-3").textContent = jugador.movimientos[2];
  document.getElementById("ataque-4").textContent = jugador.movimientos[3];

  // Asignar las funciones a los botones de ataque
  document.getElementById("ataques-container").onclick = (e) => {
    const id = e.target.id;
    if (id === "ataque-4" && proteccionUsada) {
      alert("¡No puedes usar Protección dos veces seguidas!");
      return;
    }
    if (id.startsWith("ataque")) {
      const index = parseInt(id.split("-")[1]) - 1;
      ejecutarMovimiento(index);
    }
  };
}

// Lógica del combate, los movimientos de momento tendrán un daño aleatorio
function ejecutarMovimiento(index) {
  if (index === 3) {
    alert(`${jugador.nombre} usó Protección. El ataque del oponente se anuló.`);
    proteccionUsada = true;
    return;
  }

  proteccionUsada = false;
  const critico = Math.random() < 0.05;
  const danoJugador = Math.floor(Math.random() * 30) + 1 * (critico ? 2 : 1);
  oponente.vida -= danoJugador;

  alert(`${jugador.nombre} usó ${jugador.movimientos[index]} y causó ${danoJugador}${critico ? " (CRÍTICO)" : ""} de daño. Vida de ${oponente.nombre}: ${oponente.vida}`);

  // Barra o indicador de vida oponente
  document.getElementById("vida-oponente").textContent = `Vida: ${oponente.vida}`;

  // Comprobar si el oponente ha sido derrotado
  if (oponente.vida <= 0) {
    mostrarResultado("¡Felicitaciones, lo lograste!");
    return;
  }

  // Ataque del oponente
  const danoOponente = Math.floor(Math.random() * 30) + 1;
  jugador.vida -= danoOponente;

  alert(`${oponente.nombre} contraataca y causa ${danoOponente} de daño. Vida de ${jugador.nombre}: ${jugador.vida}`);

  // Barra o indicador de vida jugador
  document.getElementById("vida-jugador").textContent = `Vida: ${jugador.vida}`;

  // Comprobar si el jugador ha sido derrotado
  if (jugador.vida <= 0) {
    mostrarResultado("Mejor suerte a la próxima.");
  }
}

// Mostrar mensaje de resultado y reemplazar Pokémon con el resultado
function mostrarResultado(mensaje) {
  // Ocultar los Pokémon
  document.getElementById("img-jugador").style.display = "none";
  document.getElementById("img-oponente").style.display = "none";

  // Ocultar los textos de vida
  document.getElementById("vida-jugador").style.display = "none";
  document.getElementById("vida-oponente").style.display = "none";

  // Ocultar los botones de ataque
  document.getElementById("ataques-container").style.display = "none"; // Agregar esta línea

  // Mostrar el mensaje de victoria o derrota en el centro de la pantalla
  document.getElementById("resultado").textContent = mensaje;

  // Crear y agregar el botón de "Luchar otra vez"
  const lucharOtraVezBtn = document.createElement("button");
  lucharOtraVezBtn.textContent = "Luchar otra vez";
  lucharOtraVezBtn.onclick = reiniciarBatalla;

  // Asegúrate de que el botón se coloque después del mensaje
  document.getElementById("resultado").appendChild(lucharOtraVezBtn);

  // Actualizar estadísticas
  estadisticas.batallasJugadas++;
  if (mensaje.includes("Felicitaciones")) {
    estadisticas.victorias++;
  } else {
    estadisticas.derrotas++;
  }
  guardarEstadisticas();
  mostrarEstadisticas();
}
// Reiniciar la batalla
function reiniciarBatalla() {
  // Restaurar los Pokémon a sus estados iniciales
  jugador = null;
  oponente = null;
  proteccionUsada = false;

  // Mostrar los botones de selección de Pokémon
  document.getElementById("pokemon-seleccion").style.display = "flex";

  // Limpiar el resultado y la imagen de batalla
  document.getElementById("resultado").textContent = "";
  
  // Mostrar los Pokémon nuevamente
  document.getElementById("img-jugador").style.display = "block";
  document.getElementById("img-oponente").style.display = "block";

  // Volver a mostrar los textos de vida
  document.getElementById("vida-jugador").style.display = "block";
  document.getElementById("vida-oponente").style.display = "block";

  // Limpiar las vidas
  document.getElementById("vida-jugador").textContent = "Vida: 100";
  document.getElementById("vida-oponente").textContent = "Vida: 100";

  // Eliminar el botón de "Luchar otra vez"
  const lucharOtraVezBtn = document.querySelector("button");
  if (lucharOtraVezBtn) {
    lucharOtraVezBtn.remove();
  }

  // Mostrar de nuevo los Pokémon para que el jugador elija
  mostrarPokemones();
}

// Función para cargar estadísticas del localStorage
function cargarEstadisticas() {
    const statsGuardadas = localStorage.getItem('pokemonEstadisticas');
    if (statsGuardadas) {
        estadisticas = JSON.parse(statsGuardadas);
        mostrarEstadisticas();
    }
}

// Función para guardar estadísticas
function guardarEstadisticas() {
    localStorage.setItem('pokemonEstadisticas', JSON.stringify(estadisticas));
}

// Función para mostrar estadísticas
function mostrarEstadisticas() {
    const contenedor = document.getElementById("buscador-container");
    const statsDiv = document.createElement("div");
    statsDiv.className = "estadisticas";
    statsDiv.innerHTML = `
        <h3>Estadísticas de Batalla</h3>
        <p>Victorias: ${estadisticas.victorias}</p>
        <p>Derrotas: ${estadisticas.derrotas}</p>
        <p>Batallas jugadas: ${estadisticas.batallasJugadas}</p>
        ${estadisticas.ultimoPokemon ? `<p>Último Pokémon: ${estadisticas.ultimoPokemon}</p>` : ''}
    `;
    
    // Remover estadísticas anteriores si existen
    const statsAnterior = document.querySelector(".estadisticas");
    if (statsAnterior) {
        statsAnterior.remove();
    }
    
    contenedor.insertBefore(statsDiv, contenedor.firstChild);
}


