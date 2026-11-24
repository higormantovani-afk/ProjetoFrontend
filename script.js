// URL pública da API no Render (troque pela sua, sem barra no final)
const API_URL = "https://projeto-1bbu.onrender.com";

const lista = document.getElementById("lista-eventos");
const form = document.getElementById("form-evento");
const msg = document.getElementById("mensagem");

function mostrarMensagem(texto, tipo) {
  msg.textContent = texto;
  msg.className = tipo || "";
}

async function carregarEventos() {
  lista.innerHTML = '<li class="vazio">Carregando eventos…</li>';
  try {
    const resp = await fetch(`${API_URL}/eventos`);
    if (!resp.ok) throw new Error();
    const eventos = await resp.json();

    lista.innerHTML = "";
    if (eventos.length === 0) {
      lista.innerHTML = '<li class="vazio">Nenhum evento cadastrado ainda.</li>';
      return;
    }
    eventos.forEach((e) => {
      const li = document.createElement("li");
      li.className = "evento";

      const h3 = document.createElement("h3");
      h3.textContent = e.titulo;
      const meta = document.createElement("p");
      meta.className = "meta";
      meta.textContent = `${e.data_evento} – ${e.local}`;
      const desc = document.createElement("p");
      desc.textContent = e.descricao || "";

      li.append(h3, meta, desc);
      lista.appendChild(li);
    });
  } catch {
    lista.innerHTML =
      '<li class="vazio">Não foi possível carregar os eventos. Se a API estava inativa, aguarde cerca de um minuto e recarregue.</li>';
  }
}

form.addEventListener("submit", async (ev) => {
  ev.preventDefault();
  const dados = {
    titulo: document.getElementById("titulo").value.trim(),
    descricao: document.getElementById("descricao").value.trim(),
    data_evento: document.getElementById("data_evento").value.trim(),
    local: document.getElementById("local").value.trim(),
  };

  if (!dados.titulo || !dados.data_evento || !dados.local) {
    return mostrarMensagem("Preencha título, data e local.", "erro");
  }
  if (!/^\d{2}\/\d{2}\/\d{4}$/.test(dados.data_evento)) {
    return mostrarMensagem("Use a data no formato dd/mm/aaaa.", "erro");
  }

  const botao = form.querySelector("button");
  botao.disabled = true;
  try {
    const resp = await fetch(`${API_URL}/eventos`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dados),
    });
    const corpo = await resp.json();
    if (!resp.ok) throw new Error(corpo.erro || "Erro ao cadastrar.");
    form.reset();
    mostrarMensagem("Evento cadastrado.", "ok");
    carregarEventos();
  } catch (err) {
    mostrarMensagem(err.message || "Erro ao cadastrar.", "erro");
  } finally {
    botao.disabled = false;
  }
});

carregarEventos();
