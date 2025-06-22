document.addEventListener("DOMContentLoaded", function () {
    const btnSuporte = document.getElementById("btnSuporte");
    const modal = document.getElementById("modalSuporte");
    const voltar = document.getElementById("voltarBtn");
    const enviar = document.getElementById("enviarBtn");

    btnSuporte.addEventListener("click", () => {
        modal.style.display = "flex";
    });

    voltar.addEventListener("click", () => {
        modal.style.display = "none";
    });

    enviar.addEventListener("click", () => {
        const nome = document.getElementById("nome").value;
        const email = document.getElementById("email").value;
        const mensagem = document.getElementById("mensagem").value;

        const dados = {
            nome: nome,
            email: email,
            mensagem: mensagem
        };

        console.log("Mensagem enviada:", JSON.stringify(dados, null, 2));
        alert("Mensagem enviada com sucesso!");

        modal.style.display = "none";
    });
});
