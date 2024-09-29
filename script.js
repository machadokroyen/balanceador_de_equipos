document.addEventListener("DOMContentLoaded", () => {
    const jugadoresForm = document.getElementById('jugadoresForm');
    const jugadorInputs = document.querySelector('.jugador-inputs');
    const generarEquiposBtn = document.getElementById('generarEquipos');
    const mejorDiferenciaSpan = document.getElementById('mejorDiferencia');
    const opcionesEquiposDiv = document.getElementById('opcionesEquipos');

    // Generar campos de entrada para jugadores
    const jugadores = [];
    for (let i = 0; i < 8; i++) {
        const nameInput = document.createElement('input');
        nameInput.type = 'text';
        nameInput.placeholder = `Jugador ${i + 1} (Nombre)`;
        nameInput.classList.add('nombre');

        const eloInput = document.createElement('input');
        eloInput.type = 'number';
        eloInput.placeholder = `ELO Jugador ${i + 1}`;
        eloInput.classList.add('elo');

        jugadorInputs.appendChild(nameInput);
        jugadorInputs.appendChild(eloInput);
    }

    // Función para obtener combinaciones
    function getCombinations(array, size) {
        function helper(arr, size, start, result, current) {
            if (current.length === size) {
                result.push([...current]);
                return;
            }
            for (let i = start; i < arr.length; i++) {
                current.push(arr[i]);
                helper(arr, size, i + 1, result, current);
                current.pop();
            }
        }
        const result = [];
        helper(array, size, 0, result, []);
        return result;
    }

    // Función para calcular el total de ELO
    function calcularEloTotal(equipo) {
        return equipo.reduce((total, jugador) => total + jugador.elo, 0);
    }

    // Función para encontrar la mejor combinación de equipos
    function encontrarMejorCombinacion(jugadores) {
        const combinaciones = getCombinations(jugadores, 4);
        let mejorDiferencia = Infinity;
        let mejoresEquipos = [];

        combinaciones.forEach(equipo1 => {
            const equipo2 = jugadores.filter(jugador => !equipo1.includes(jugador));
            const diferencia = Math.abs(calcularEloTotal(equipo1) - calcularEloTotal(equipo2));

            if (diferencia < mejorDiferencia) {
                mejorDiferencia = diferencia;
                mejoresEquipos = [{ equipo1, equipo2 }];
            } else if (diferencia === mejorDiferencia) {
                mejoresEquipos.push({ equipo1, equipo2 });
            }
        });

        return { mejorDiferencia, mejoresEquipos };
    }

    // Manejar el clic en el botón "Generar Equipos"
    generarEquiposBtn.addEventListener('click', () => {
        jugadores.length = 0; // Limpiar el array de jugadores
        const nombreInputs = document.querySelectorAll('.nombre');
        const eloInputs = document.querySelectorAll('.elo');

        for (let i = 0; i < 8; i++) {
            const nombre = nombreInputs[i].value;
            const elo = parseInt(eloInputs[i].value);
            if (nombre && elo) {
                jugadores.push({ name: nombre, elo: elo });
            }
        }

        if (jugadores.length === 8) {
            const resultado = encontrarMejorCombinacion(jugadores);
            mejorDiferenciaSpan.textContent = resultado.mejorDiferencia;

            opcionesEquiposDiv.innerHTML = ''; // Limpiar resultados anteriores
            resultado.mejoresEquipos.forEach((equipos, index) => {
                const equipo1Nombres = equipos.equipo1.map(j => j.name).join(', ');
                const equipo2Nombres = equipos.equipo2.map(j => j.name).join(', ');
                const opcion = document.createElement('div');
                opcion.innerHTML = `<strong>Opción ${index + 1}:</strong><br>Equipo 1: ${equipo1Nombres}<br>Equipo 2: ${equipo2Nombres}`;
                opcionesEquiposDiv.appendChild(opcion);
            });
        } else {
            alert("Por favor, ingresa correctamente los 8 jugadores con su ELO.");
        }
    });
});