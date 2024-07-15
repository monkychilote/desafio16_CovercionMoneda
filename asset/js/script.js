async function convertirMoneda() {
  const monto = document.getElementById("monto").value;
  const moneda = document.getElementById("moneda").value;
  const resultadoElemento = document.getElementById("resultado");
  const tituloResultado = document.getElementById("tituloResultado");

  if (!monto) {
    resultadoElemento.innerHTML = "Por favor, ingrese un monto válido.";
    return;
  }

  try {
    const respuesta = await fetch(`https://mindicador.cl/api/${moneda}`);
    if (!respuesta.ok) {
      throw new Error(`Error: ${respuesta.statusText}`);
    }
    const datos = await respuesta.json();
    const tasa = datos.serie[0].valor;
    const datosHistoricos = datos.serie.slice(0, 10);

    if (!Array.isArray(datosHistoricos) || datosHistoricos.length === 0) {
      throw new Error("Datos históricos no disponibles");
    }

    const montoConvertido = (monto / tasa).toFixed(2);
    tituloResultado.style.display = "block";
    resultadoElemento.innerHTML = `Resultado: $${montoConvertido}`;

    mostrarGrafico(datosHistoricos);
  } catch (error) {
    resultadoElemento.innerHTML = `<span class="error">Error: ${error.message}</span>`;
  }
}

let grafico = null;

function mostrarGrafico(datosHistoricos) {
  const etiquetas = datosHistoricos
    .map((item) => item.fecha.slice(0, 10))
    .reverse();
  const datos = datosHistoricos.map((item) => item.valor).reverse();

  const ctx = document.getElementById("miGrafico").getContext("2d");

  if (grafico) {
    grafico.destroy();
  }

  grafico = new Chart(ctx, {
    type: "line",
    data: {
      labels: etiquetas,
      datasets: [
        {
          label: "Historial últimos 10 días",
          data: datos,
          borderColor: "rgba(75, 192, 192, 1)",
          borderWidth: 1,
          fill: false,
        },
      ],
    },
    options: {
      scales: {
        x: {
          title: {
            display: true,
            text: "Fecha",
          },
        },
        y: {
          title: {
            display: true,
            text: "Valor",
          },
        },
      },
    },
  });
}
