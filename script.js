// ==========================================
// CONFIGURAÇÕES E CONSTANTES
// ==========================================

// Lista de feriados nacionais (formato MM-DD)
const FERIADOS = [
  { data: "01-01", nome: "Confraternização Universal" },
  { data: "04-21", nome: "Tiradentes" },
  { data: "05-01", nome: "Dia do Trabalhador" },
  { data: "09-07", nome: "Independência do Brasil" },
  { data: "10-12", nome: "Nossa Senhora Aparecida" },
  { data: "11-02", nome: "Finados" },
  { data: "11-15", nome: "Proclamação da República" },
  { data: "12-25", nome: "Natal" },
]

// Feriados móveis (devem ser atualizados anualmente)
const FERIADOS_MOVEIS = [
  { data: "2024-02-12", nome: "Carnaval" },
  { data: "2024-02-13", nome: "Carnaval" },
  { data: "2024-03-29", nome: "Sexta-feira Santa" },
  { data: "2024-05-30", nome: "Corpus Christi" },
  { data: "2025-03-03", nome: "Carnaval" },
  { data: "2025-03-04", nome: "Carnaval" },
  { data: "2025-04-18", nome: "Sexta-feira Santa" },
  { data: "2025-06-19", nome: "Corpus Christi" },
]

// Horários de funcionamento
const HORARIOS_FUNCIONAMENTO = {
  inicio: "08:00",
  fim: "18:00",
  intervalo: { inicio: "12:00", fim: "14:00" },
}

// ==========================================
// FUNÇÕES UTILITÁRIAS
// ==========================================

function formatarData(data) {
  return new Date(data + "T00:00:00").toLocaleDateString("pt-BR")
}

function formatarDataISO(data) {
  const d = new Date(data)
  return d.toISOString().split("T")[0]
}

function isWeekend(data) {
  const dia = new Date(data + "T00:00:00").getDay()
  return dia === 0 // Domingo
}

function isFeriado(data) {
  const dataObj = new Date(data + "T00:00:00")
  const mes = String(dataObj.getMonth() + 1).padStart(2, "0")
  const dia = String(dataObj.getDate()).padStart(2, "0")
  const mmdd = `${mes}-${dia}`

  // Verifica feriados fixos
  const feriadoFixo = FERIADOS.some((feriado) => feriado.data === mmdd)

  // Verifica feriados móveis
  const feriadoMovel = FERIADOS_MOVEIS.some((feriado) => feriado.data === data)

  return feriadoFixo || feriadoMovel
}

function isEmFerias(data) {
  const ferias = JSON.parse(localStorage.getItem("ferias") || "[]")
  return ferias.some((periodo) => {
    return data >= periodo.inicio && data <= periodo.fim
  })
}

function isDiaFechado(data) {
  return isWeekend(data) || isFeriado(data) || isEmFerias(data)
}

function gerarId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2)
}

function mostrarMensagem(texto, tipo) {
  const mensagem = document.getElementById("mensagem")
  if (mensagem) {
    mensagem.textContent = texto
    mensagem.className = `mensagem ${tipo}`
    mensagem.style.display = "block"

    setTimeout(() => {
      mensagem.style.display = "none"
    }, 5000)
  }
}

function playNotificationSound() {
  const audio = document.getElementById("notificationSound")
  if (audio) {
    audio.play().catch((e) => console.log("Não foi possível reproduzir o som"))
  }
}

// ==========================================
// GERENCIAMENTO DE AGENDAMENTOS
// ==========================================

function salvarAgendamento(agendamento) {
  const agendamentos = JSON.parse(localStorage.getItem("agendamentos") || "[]")
  agendamento.id = gerarId()
  agendamento.status = "pendente"
  agendamento.dataHora = new Date().toISOString()

  agendamentos.push(agendamento)
  localStorage.setItem("agendamentos", JSON.stringify(agendamentos))

  // Notificar barbeiro se estiver na página
  if (window.location.pathname.includes("barbeiro.html")) {
    showNotification()
    playNotificationSound()
  }

  return agendamento
}

function obterAgendamentos(data = null) {
  const agendamentos = JSON.parse(localStorage.getItem("agendamentos") || "[]")

  if (data) {
    return agendamentos.filter((ag) => ag.data === data)
  }

  return agendamentos
}

function verificarHorarioDisponivel(data, hora) {
  const agendamentos = obterAgendamentos(data)
  return !agendamentos.some((ag) => ag.hora === hora && ag.status !== "recusado")
}

function aceitarAgendamento(id) {
  const agendamentos = JSON.parse(localStorage.getItem("agendamentos") || "[]")
  const index = agendamentos.findIndex((ag) => ag.id === id)

  if (index !== -1) {
    agendamentos[index].status = "aceito"
    localStorage.setItem("agendamentos", JSON.stringify(agendamentos))
    loadAgendamentos()
    mostrarMensagem("Agendamento aceito com sucesso!", "sucesso")
  }
}

function recusarAgendamento(id) {
  const agendamentos = JSON.parse(localStorage.getItem("agendamentos") || "[]")
  const agendamento = agendamentos.find((ag) => ag.id === id)

  if (agendamento) {
    // Abrir WhatsApp com mensagem
    const mensagem = `Olá ${agendamento.nome}, infelizmente não conseguimos confirmar seu agendamento para ${formatarData(agendamento.data)} às ${agendamento.hora}. Entre em contato para reagendarmos. Obrigado!`
    const whatsappUrl = `https://wa.me/55${agendamento.telefone}?text=${encodeURIComponent(mensagem)}`
    window.open(whatsappUrl, "_blank")

    // Remover agendamento
    const novaLista = agendamentos.filter((ag) => ag.id !== id)
    localStorage.setItem("agendamentos", JSON.stringify(novaLista))
    loadAgendamentos()
    mostrarMensagem("Agendamento recusado e cliente notificado via WhatsApp", "sucesso")
  }
}

// ==========================================
// GERENCIAMENTO DE FÉRIAS
// ==========================================

function salvarFerias(inicio, fim) {
  const ferias = JSON.parse(localStorage.getItem("ferias") || "[]")
  const novoPeriodo = {
    id: gerarId(),
    inicio: inicio,
    fim: fim,
    descricao: `${formatarData(inicio)} até ${formatarData(fim)}`,
  }

  ferias.push(novoPeriodo)
  localStorage.setItem("ferias", JSON.stringify(ferias))
  loadFerias()
  mostrarMensagem("Período de férias adicionado com sucesso!", "sucesso")
}

function removerFerias(id) {
  const ferias = JSON.parse(localStorage.getItem("ferias") || "[]")
  const novaLista = ferias.filter((f) => f.id !== id)
  localStorage.setItem("ferias", JSON.stringify(novaLista))
  loadFerias()
  mostrarMensagem("Período de férias removido!", "sucesso")
}

// ==========================================
// VALIDAÇÕES
// ==========================================

function validarAgendamento(nome, telefone, data, hora) {
  const erros = []

  // Validar nome
  if (!nome || nome.trim().length < 2) {
    erros.push("Nome deve ter pelo menos 2 caracteres")
  }

  // Validar telefone
  const telefoneRegex = /^\d{10,11}$/
  if (!telefone || !telefoneRegex.test(telefone.replace(/\D/g, ""))) {
    erros.push("Telefone deve ter 10 ou 11 dígitos")
  }

  // Validar data
  const hoje = new Date()
  const dataAgendamento = new Date(data + "T00:00:00")

  if (dataAgendamento < hoje.setHours(0, 0, 0, 0)) {
    erros.push("Não é possível agendar para datas passadas")
  }

  if (isDiaFechado(data)) {
    erros.push("Data indisponível (feriado, domingo ou período de férias)")
  }

  // Validar hora
  if (!hora) {
    erros.push("Selecione um horário")
  }

  // Verificar disponibilidade
  if (!verificarHorarioDisponivel(data, hora)) {
    erros.push("Horário já ocupado")
  }

  return erros
}

// ==========================================
// INTERFACE - PÁGINA DO CLIENTE
// ==========================================

function initClientePage() {
  const form = document.getElementById("agendamentoForm")
  const dataInput = document.getElementById("data")

  // Definir data mínima como hoje
  const hoje = new Date()
  dataInput.min = formatarDataISO(hoje)

  // Definir data máxima como 3 meses à frente
  const maxData = new Date()
  maxData.setMonth(maxData.getMonth() + 3)
  dataInput.max = formatarDataISO(maxData)

  form.addEventListener("submit", (e) => {
    e.preventDefault()

    const nome = document.getElementById("nome").value.trim()
    const telefone = document.getElementById("telefone").value.replace(/\D/g, "")
    const data = document.getElementById("data").value
    const hora = document.getElementById("hora").value

    const erros = validarAgendamento(nome, telefone, data, hora)

    if (erros.length > 0) {
      mostrarMensagem(erros.join(". "), "erro")
      return
    }

    const agendamento = {
      nome: nome,
      telefone: telefone,
      data: data,
      hora: hora,
    }

    salvarAgendamento(agendamento)
    mostrarMensagem("Agendamento realizado com sucesso! Aguarde a confirmação.", "sucesso")
    form.reset()
  })

  // Atualizar horários disponíveis quando data mudar
  dataInput.addEventListener("change", () => {
    atualizarHorariosDisponiveis()
  })
}

function atualizarHorariosDisponiveis() {
  const data = document.getElementById("data").value
  const horaSelect = document.getElementById("hora")

  if (!data) return

  // Resetar opções
  Array.from(horaSelect.options).forEach((option, index) => {
    if (index > 0) {
      // Manter primeira opção
      option.disabled = false
      option.style.color = ""
    }
  })

  // Verificar disponibilidade de cada horário
  const agendamentos = obterAgendamentos(data)
  agendamentos.forEach((ag) => {
    if (ag.status !== "recusado") {
      const option = horaSelect.querySelector(`option[value="${ag.hora}"]`)
      if (option) {
        option.disabled = true
        option.style.color = "#ccc"
        option.textContent = `${ag.hora} - Ocupado`
      }
    }
  })
}

// ==========================================
// INTERFACE - PÁGINA DO BARBEIRO
// ==========================================

function initBarbeiroPage() {
  // Definir data de hoje por padrão
  const dataConsulta = document.getElementById("dataConsulta")
  dataConsulta.value = formatarDataISO(new Date())

  // Carregar agendamentos do dia
  loadAgendamentos()

  // Carregar férias
  loadFerias()

  // Carregar feriados
  loadFeriados()

  // Event listeners
  document.getElementById("feriasForm").addEventListener("submit", function (e) {
    e.preventDefault()

    const inicio = document.getElementById("inicioFerias").value
    const fim = document.getElementById("fimFerias").value

    if (inicio && fim && inicio <= fim) {
      salvarFerias(inicio, fim)
      this.reset()
    } else {
      mostrarMensagem("Datas inválidas para o período de férias", "erro")
    }
  })

  // Verificar novos agendamentos periodicamente
  setInterval(checkNewAgendamentos, 30000) // A cada 30 segundos
}

function loadAgendamentos() {
  const data = document.getElementById("dataConsulta").value
  const container = document.getElementById("agendamentos-lista")
  const agendamentos = obterAgendamentos(data)

  if (agendamentos.length === 0) {
    container.innerHTML =
      '<p style="text-align: center; color: #666; padding: 40px;">Nenhum agendamento para esta data.</p>'
    return
  }

  // Ordenar por horário
  agendamentos.sort((a, b) => a.hora.localeCompare(b.hora))

  container.innerHTML = agendamentos
    .map(
      (ag) => `
        <div class="agendamento-card ${ag.status === "aceito" ? "aceito" : ""}">
            <div class="agendamento-info">
                <h4>${ag.nome}</h4>
                <p><strong>Horário:</strong> ${ag.hora}</p>
                <p><strong>Telefone:</strong> ${ag.telefone}</p>
                <p><strong>Status:</strong> ${ag.status === "aceito" ? "Confirmado" : "Pendente"}</p>
            </div>
            <div class="agendamento-actions">
                ${
                  ag.status === "pendente"
                    ? `
                    <button class="btn-success" onclick="aceitarAgendamento('${ag.id}')">Aceitar</button>
                    <button class="btn-danger" onclick="recusarAgendamento('${ag.id}')">Recusar</button>
                `
                    : '<span style="color: #28a745; font-weight: bold;">✓ Confirmado</span>'
                }
            </div>
        </div>
    `,
    )
    .join("")
}

function loadFerias() {
  const container = document.getElementById("ferias-lista")
  const ferias = JSON.parse(localStorage.getItem("ferias") || "[]")

  if (ferias.length === 0) {
    container.innerHTML =
      '<p style="text-align: center; color: #666; padding: 20px;">Nenhum período de férias cadastrado.</p>'
    return
  }

  container.innerHTML = ferias
    .map(
      (f) => `
        <div class="ferias-item">
            <span>${f.descricao}</span>
            <button class="btn-danger" onclick="removerFerias('${f.id}')">Remover</button>
        </div>
    `,
    )
    .join("")
}

function loadFeriados() {
  const container = document.getElementById("feriados-lista")
  const todosFeriados = [...FERIADOS, ...FERIADOS_MOVEIS]

  container.innerHTML = todosFeriados
    .map(
      (f) => `
        <div class="feriado-item">
            <strong>${f.nome}</strong><br>
            <small>${f.data}</small>
        </div>
    `,
    )
    .join("")
}

function showTab(tabName) {
  // Remover classe active de todas as tabs
  document.querySelectorAll(".tab-btn").forEach((btn) => btn.classList.remove("active"))
  document.querySelectorAll(".tab-content").forEach((content) => content.classList.remove("active"))

  // Adicionar classe active na tab selecionada
  event.target.classList.add("active")
  document.getElementById(tabName + "-tab").classList.add("active")
}

function showNotification() {
  const notificacao = document.getElementById("notificacao")
  if (notificacao) {
    notificacao.classList.remove("hidden")
    setTimeout(() => {
      notificacao.classList.add("hidden")
    }, 5000)
  }
}

function hideNotification() {
  document.getElementById("notificacao").classList.add("hidden")
}

let lastAgendamentoCount = 0

function checkNewAgendamentos() {
  const agendamentos = JSON.parse(localStorage.getItem("agendamentos") || "[]")
  const currentCount = agendamentos.length

  if (lastAgendamentoCount > 0 && currentCount > lastAgendamentoCount) {
    showNotification()
    playNotificationSound()

    // Recarregar agendamentos se estiver na aba correta
    const activeTab = document.querySelector(".tab-content.active")
    if (activeTab && activeTab.id === "agendamentos-tab") {
      loadAgendamentos()
    }
  }

  lastAgendamentoCount = currentCount
}

// Inicializar contador na primeira carga
document.addEventListener("DOMContentLoaded", () => {
  const agendamentos = JSON.parse(localStorage.getItem("agendamentos") || "[]")
  lastAgendamentoCount = agendamentos.length
})
