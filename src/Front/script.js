const opcaoSim = document.getElementById("sim");
const opcaoNao = document.getElementById("nao");

const areaAcompanhantes =
    document.getElementById("area-acompanhantes");

const acompanhantes =
    document.getElementById("acompanhantes");


opcaoSim.addEventListener("change", function () {

    areaAcompanhantes.classList.remove("escondido");

});


opcaoNao.addEventListener("change", function () {

    areaAcompanhantes.classList.add("escondido");

    acompanhantes.value = "";

});

const formulario =
    document.getElementById("form-confirmacao");


    formulario.addEventListener("submit", async function (event) {

    event.preventDefault();


    const dados = new FormData(formulario);

    try {
        
    await fetch(
        "https://script.google.com/macros/s/AKfycbx1k-6MgW5A4UhjuKKJTnBVqM2b_tYvanPUCi7mntjThjAf-XYn2yxcsbp8qo6na8Ea_g/exec",
        {
            method: "POST",
            body: dados
        }
    );


    alert("Resposta enviada com sucesso! Tem q manter segredo hein, se não... 💀");
    location.reload();
    
    } catch (error) {
        console.error("Erro ao enviar a resposta:", error);
        alert("Ocorreu um erro ao enviar a resposta. Por favor, tente novamente.");
    }

});