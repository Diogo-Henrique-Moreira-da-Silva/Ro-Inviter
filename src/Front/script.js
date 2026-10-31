
const opcaoSim = document.getElementById("sim");
const opcaoNao = document.getElementById("nao");

const areaQuantidades =
  document.getElementById("area-quantidades");

const adultos = document.getElementById("adultos");
const criancas = document.getElementById("criancas");

opcaoSim.addEventListener("change", function () {
  areaQuantidades.classList.remove("escondido");

  adultos.disabled = false;
  criancas.disabled = false;
});

opcaoNao.addEventListener("change", function () {
  areaQuantidades.classList.add("escondido");

  adultos.value = "1";
  criancas.value = "0";

  adultos.disabled = true;
  criancas.disabled = true;
});

const botaoEnviar = document.getElementById("btn-enviar");
const formulario =
  document.getElementById("form-confirmacao");

let enviando = false;

formulario.addEventListener("submit", async function (event) {
  event.preventDefault();

  if (enviando) return;

  enviando = true;
  botaoEnviar.disabled = true;
  botaoEnviar.textContent = "Enviando...";

  const dados = new FormData(formulario);

  if (opcaoNao.checked) {
    dados.set("adultos", "0");
    dados.set("criancas", "0");
  }

  try {
    const resposta = await fetch("/api/confirmar", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(
        Object.fromEntries(dados.entries())
      )
    });

    const resultado = await resposta.json();

    if (!resposta.ok || resultado.success !== true) {
      throw new Error(
        resultado.error || "Não foi possível confirmar o registro."
      );
    }

    alert(
      "Resposta enviada com sucesso! Tem que manter segredo ein... se não... 💀"
    );

    location.reload();

  } catch (error) {
    console.error("Erro ao enviar a resposta:", error);

    alert(
      error.message ||
      "Ocorreu um erro ao enviar a resposta."
    );

    enviando = false;
    botaoEnviar.disabled = false;
    botaoEnviar.textContent = "Confirmar";
  }
});
