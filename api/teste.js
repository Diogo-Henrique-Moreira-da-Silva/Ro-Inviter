
module.exports = function handler(req, res) {
  return res.status(200).json({
    success: true,
    mensagem: "API da Vercel funcionando!"
  });
};
