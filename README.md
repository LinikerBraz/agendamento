# Sistema de Agendamento para Barbearia

Um sistema web simples e eficiente para gerenciamento de agendamentos de barbearia, desenvolvido com HTML, CSS e JavaScript vanilla, sem necessidade de banco de dados.

## 🚀 Funcionalidades

### Página do Cliente (index.html)
- **Formulário de Agendamento**: Campos para nome, telefone (WhatsApp), data e horário
- **Validações Inteligentes**: 
  - Impede agendamentos em feriados nacionais
  - Bloqueia domingos e períodos de férias do barbeiro
  - Verifica disponibilidade de horários em tempo real
  - Valida formato de telefone e dados obrigatórios
- **Interface Responsiva**: Adaptável para desktop e mobile
- **Feedback Visual**: Mensagens de sucesso e erro para o usuário

### Página do Barbeiro (barbeiro.html)
- **Gerenciamento de Agendamentos**:
  - Visualização por data selecionada
  - Botões para aceitar ou recusar agendamentos
  - Status visual (pendente/confirmado)
  - Integração automática com WhatsApp para recusas
- **Gerenciamento de Férias**:
  - Cadastro de períodos de férias
  - Remoção de períodos cadastrados
  - Bloqueio automático de agendamentos durante férias
- **Sistema de Notificações**:
  - Alerta visual quando novos agendamentos são feitos
  - Som de notificação (opcional)
  - Verificação automática a cada 30 segundos

## 🛠️ Tecnologias Utilizadas

- **HTML5**: Estrutura semântica e acessível
- **CSS3**: Design responsivo com Flexbox e Grid
- **JavaScript ES6+**: Lógica de negócio e manipulação do DOM
- **LocalStorage**: Armazenamento local dos dados
- **Web Audio API**: Notificações sonoras

## 📋 Estrutura do Projeto

\`\`\`
barbearia-agendamento/
├── index.html          # Página do cliente
├── barbeiro.html       # Página do barbeiro
├── styles.css          # Estilos responsivos
├── script.js           # Lógica JavaScript
└── README.md           # Documentação
\`\`\`

## 🔧 Configurações

### Horários de Funcionamento
O sistema está configurado para:
- **Funcionamento**: 8h às 18h
- **Intervalo**: 12h às 14h (almoço)
- **Fechado**: Domingos e feriados
- **Intervalos**: Agendamentos de 30 em 30 minutos

### Feriados Cadastrados
O sistema inclui todos os feriados nacionais brasileiros:
- Feriados fixos (Natal, Ano Novo, etc.)
- Feriados móveis (Carnaval, Páscoa, Corpus Christi)

### Validações Implementadas
1. **Data**: Não permite agendamentos no passado
2. **Horário**: Verifica disponibilidade em tempo real
3. **Telefone**: Valida formato brasileiro (10-11 dígitos)
4. **Duplicatas**: Impede agendamentos no mesmo horário
5. **Dias Fechados**: Bloqueia domingos, feriados e férias

## 💾 Armazenamento de Dados

O sistema utiliza o \`localStorage\` do navegador para persistir:

### Estrutura dos Agendamentos
\`\`\`javascript
{
  id: "unique_id",
  nome: "Nome do Cliente",
  telefone: "11999999999",
  data: "2024-12-25",
  hora: "14:30",
  status: "pendente|aceito|recusado",
  dataHora: "2024-12-20T10:30:00.000Z"
}
\`\`\`

### Estrutura das Férias
\`\`\`javascript
{
  id: "unique_id",
  inicio: "2024-12-20",
  fim: "2024-12-30",
  descricao: "20/12/2024 até 30/12/2024"
}
\`\`\`

## 🎯 Lógica de Negócio

### Fluxo de Agendamento
1. Cliente preenche formulário
2. Sistema valida dados e disponibilidade
3. Agendamento é salvo com status "pendente"
4. Barbeiro recebe notificação (se estiver online)
5. Barbeiro pode aceitar ou recusar
6. Se recusado, WhatsApp abre automaticamente com mensagem

### Sistema de Notificações
- Verificação automática a cada 30 segundos
- Notificação visual no canto superior direito
- Som de alerta (se suportado pelo navegador)
- Contador de novos agendamentos

### Integração WhatsApp
Quando um agendamento é recusado:
\`\`\`javascript
const mensagem = \`Olá \${nome}, infelizmente não conseguimos 
confirmar seu agendamento para \${data} às \${hora}. 
Entre em contato para reagendarmos. Obrigado!\`;

const whatsappUrl = \`https://wa.me/55\${telefone}?text=\${mensagem}\`;
\`\`\`

## 🚀 Como Usar

### Instalação Local
1. Faça o download dos arquivos
2. Abra \`index.html\` em um navegador
3. Para acessar a área do barbeiro, clique no link no rodapé

### Deploy na Vercel
1. Faça upload dos arquivos para um repositório Git
2. Conecte o repositório à Vercel
3. O deploy será automático (arquivos estáticos)

### Configuração Inicial
1. Acesse a página do barbeiro
2. Configure os períodos de férias na aba "Férias"
3. O sistema já vem com feriados nacionais pré-configurados

## 🔒 Segurança e Limitações

### Pontos Fortes
- Validação client-side robusta
- Dados armazenados localmente (privacidade)
- Não requer servidor ou banco de dados
- Interface intuitiva e responsiva

### Limitações
- Dados ficam no navegador (não sincronizam entre dispositivos)
- Sem autenticação (qualquer um pode acessar área do barbeiro)
- Feriados móveis precisam ser atualizados anualmente
- Dependente de JavaScript habilitado

## 🎨 Personalização

### Cores e Tema
As cores principais podem ser alteradas no arquivo \`styles.css\`:
\`\`\`css
:root {
  --primary-color: #667eea;
  --secondary-color: #764ba2;
  --success-color: #28a745;
  --danger-color: #dc3545;
}
\`\`\`

### Horários de Funcionamento
Edite a constante no \`script.js\`:
\`\`\`javascript
const HORARIOS_FUNCIONAMENTO = {
    inicio: '08:00',
    fim: '18:00',
    intervalo: { inicio: '12:00', fim: '14:00' }
};
\`\`\`

### Feriados Personalizados
Adicione feriados locais na constante \`FERIADOS\`:
\`\`\`javascript
const FERIADOS = [
    { data: '01-25', nome: 'Aniversário da Cidade' },
    // ... outros feriados
];
\`\`\`

## 📱 Responsividade

O sistema é totalmente responsivo com breakpoints:
- **Desktop**: \> 768px - Layout em duas colunas
- **Tablet**: 768px - Layout adaptativo
- **Mobile**: \< 480px - Layout em coluna única

## 🔧 Manutenção

### Limpeza de Dados
Para limpar todos os dados armazenados:
\`\`\`javascript
localStorage.removeItem('agendamentos');
localStorage.removeItem('ferias');
\`\`\`

### Backup de Dados
Para fazer backup dos agendamentos:
\`\`\`javascript
const backup = {
  agendamentos: localStorage.getItem('agendamentos'),
  ferias: localStorage.getItem('ferias')
};
console.log(JSON.stringify(backup));
\`\`\`

## 📞 Suporte

Para dúvidas ou sugestões sobre o sistema, consulte a documentação ou entre em contato através dos canais de suporte disponíveis.

---

**Desenvolvido com ❤️ para facilitar o dia a dia das barbearias brasileiras**
