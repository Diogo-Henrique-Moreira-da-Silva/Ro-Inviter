
module.exports = async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");

  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({
      success: false,
      error: "Método não permitido."
    });
  }

  const endpoint = process.env.GOOGLE_SCRIPT_URL;

  if (
    !endpoint ||
    !/^https:\/\/script\.google\.com\/macros\/s\/[^/]+\/exec$/.test(endpoint)
  ) {
    console.error("GOOGLE_SCRIPT_URL não configurada.");

    return res.status(500).json({
      success: false,
      error: "O serviço de confirmação não está configurado."
    });
  }

  try {
    const data =
      typeof req.body === "string"
        ? JSON.parse(req.body)
        : req.body;

    const nome =
      typeof data?.nome === "string"
        ? data.nome.trim()
        : "";

    const presenca = data?.presenca;

    const adultos =
      presenca === "nao" ? 0 : Number(data?.adultos);

    const criancas =
      presenca === "nao" ? 0 : Number(data?.criancas);

    if (
      !nome ||
      nome.length > 150 ||
      !["sim", "nao"].includes(presenca) ||
      !Number.isInteger(adultos) ||
      !Number.isInteger(criancas) ||
      (presenca === "sim" && (adultos < 1 || adultos > 30)) ||
      criancas < 0 ||
      criancas > 30
    ) {
      return res.status(400).json({
        success: false,
        error: "Confira os dados informados no formulário."
      });
    }

    const parametros = new URLSearchParams({
      nome,
      presenca,
      adultos: String(adultos),
      criancas: String(criancas)
    });

    const resposta = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type":
          "application/x-www-form-urlencoded;charset=UTF-8"
      },
      body: parametros.toString(),
      signal: AbortSignal.timeout(12000)
    });

    const texto = await resposta.text();

    if (!resposta.ok) {
      console.error(
        "Erro no Apps Script:",
        resposta.status,
        texto.slice(0, 250)
      );

      return res.status(502).json({
        success: false,
        error: "O Google não confirmou o recebimento."
      });
    }

    let retorno;

    try {
      retorno = JSON.parse(texto);
    } catch {
      retorno = null;
    }

    if (retorno?.success !== true) {
      console.error(
        "Resposta inesperada do Apps Script:",
        texto.slice(0, 250)
      );

      return res.status(502).json({
        success: false,
        error:
          "Não foi possível confirmar a gravação na planilha. Verifique antes de reenviar."
      });
    }

    return res.status(200).json({
      success: true
    });

  } catch (error) {
    console.error("Erro ao enviar confirmação:", error);

    return res.status(502).json({
      success: false,
      error:
        "Falha na comunicação com a planilha. Verifique antes de reenviar."
    });
  }
};
