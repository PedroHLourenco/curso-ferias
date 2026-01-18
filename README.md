# Sistema de Gestão de Torneios TCG

Sistema gerenciador de torneios de Trading Card Games (TCG), focado na automatização de pareamentos, gestão de mesas e controle financeiro via PIX.

## 📋 Sobre o Projeto

Este projeto visa facilitar a organização de eventos de jogos de cartas em lojas locais (LGS), substituindo planilhas manuais e softwares obsoletos. A arquitetura é baseada em microsserviços e módulos bem definidos, separando completamente o Backend (API RESTful) do Frontend (SPA).

### Funcionalidades Principais

- **Gestão de Usuários:** Controle de jogadores e administradores com criptografia de senhas.
- **Autenticação & Autorização:** Sistema completo de proteção de rotas (RBAC).
- **Gestão de Torneios:** Criação de eventos com suporte a taxas de inscrição e formatos variados.
- **Inscrições (Registrations):** Controle de vagas (`maxPlayers`), validação de duplicidade e vínculo financeiro.
- **Financeiro (Integração PIX):** Geração automática de QR Code e Copia e Cola via API do Mercado Pago.
- **Gestão de Partidas (Matches):** Pareamentos manuais, alocação de mesas e report de resultados.
- **Gestão de Mesas:** Controle físico das mesas da loja e sua disponibilidade.
- **Tempo Real (WebSocket):** Notificações instantâneas de atualização de vagas e resultados de partidas na interface.

---

## 🔐 Autenticação e Segurança (RBAC)

O sistema utiliza uma estratégia **Stateless** (sem sessão em memória) baseada em JWT (JSON Web Token) e **Guards** do NestJS para implementar RBAC (Role-Based Access Control).

### 1. Tecnologias de Segurança

- **Passport.js:** Gerencia as estratégias de autenticação.
  - `LocalStrategy`: Valida email/senha no login e devolve o Token.
  - `JwtStrategy`: Intercepta cada requisição, decodifica o Token `Bearer` e injeta o usuário no objeto `request`.
- **Bcrypt:** Hashing unidirecional de senhas antes da persistência no banco.

### 2. Sistema de Guards

A segurança não depende apenas de estar logado, mas de **quem** está logado.

1.  **Nível 1: `JwtAuthGuard`**
    - Verifica se o Token enviado no Header `Authorization` é válido e não expirou.
    - Se inválido, retorna `401 Unauthorized` instantaneamente.

2.  **Nível 2: `RolesGuard`**
    - Atua após a validação do token.
    - Utiliza o `Reflector` do NestJS para ler metadados gravados pelo decorator customizado `@Roles()`.
    - Compara o cargo do usuário (`request.user.role`) com o cargo exigido pela rota.
    - Se o usuário não tiver permissão, retorna `403 Forbidden`.

### 3. Mapa de Permissões

| Recurso           | Ação             | Rota         | Nível de Acesso | Explicação                                         |
| :---------------- | :--------------- | :----------- | :-------------- | :------------------------------------------------- |
| **Tournaments** | Ver Torneios     | `GET`        | 🔓 Público      | Marketing da loja (visitantes podem ver). |
|                   | Criar/Editar     | `POST/PATCH` | 🔒 **ADMIN** | Apenas a loja cria eventos. |
| **Matches** | Ver Chaveamento  | `GET`        | 🔓 Público      | Jogadores acompanham as rodadas.                   |
|                   | Definir Vencedor | `PATCH`      | 🔒 **ADMIN** | Apenas o organizador reporta o resultado. |
| **Registrations** | Inscrever-se     | `POST`       | 🔑 **Logado** | Qualquer usuário logado pode gerar PIX. |
| **Users** | Criar Conta      | `POST`       | 🔓 Público      | Cadastro aberto para novos jogadores. |

---

## 🏛 Arquitetura de Dados (Entidades)

O sistema cumpre o requisito de modelagem relacional robusta com **5 Entidades Principais**:

1.  **Users:** Atores do sistema (Jogadores e Admins).
2.  **Tournaments:** Os eventos gerenciados (Atributos: formato, data, preço, status).
3.  **GameTables:** Recursos físicos da loja.
4.  **Registrations:** Tabela pivô (N:N) com lógica de pagamento e status da inscrição.
5.  **Matches:** O coração do torneio, registrando o histórico de confrontos, rodadas e vencedores.

---

## 💳 Módulo de Pagamentos (Externo)

Integração direta com o **Mercado Pago API (v1)**:

- **Tecnologia:** SDK Oficial `mercadopago` (Backend) e exibição de QR Code Base64 (Frontend).
- **Fluxo:** O backend valida a inscrição -> Solicita pagamento ao Mercado Pago -> Retorna QR Code ao Frontend -> Frontend exibe modal de pagamento.
- **Segurança:** Credenciais gerenciadas via `.env` (Ambiente Sandbox/Teste) para evitar cobranças reais durante o desenvolvimento.

---

## 📡 Notificações em Tempo Real (WebSocket)

O sistema implementa um **Gateway WebSocket** (via `Socket.io`) para garantir interatividade em tempo real, persistindo os dados críticos no banco antes de emitir os eventos para os clientes conectados.

### Eventos Disponíveis

1.  **`tournament_status`**
    - **Gatilho:** Disparado sempre que uma nova inscrição é realizada (`POST /registrations`).
    - **Payload:** ID do torneio, número atual de inscritos e status de lotação (`isFull`).
    - **Uso no Frontend:** Atualiza a barra de progresso de vagas na Home sem recarregar a página.

2.  **`match_status`**
    - **Gatilho:** Disparado quando o Admin define o vencedor de uma partida (`PATCH /matches/:id`).
    - **Payload:** ID da partida e ID do vencedor.
    - **Uso no Frontend:** Atualiza o card da partida na tela de gestão admin instantaneamente, destacando o vencedor em verde.

---

## 💻 Frontend (Interface do Usuário)

A interface foi construída como uma **Single Page Application (SPA)** moderna, focada em performance e experiência do usuário (UX), utilizando o padrão "Dark Mode" para se adequar à estética gamer/TCG.

### Estrutura e Módulos

O Frontend é dividido em duas áreas distintas protegidas por rotas condicionais (`AdminLayout`):

#### A. Área Pública (Jogadores)
Focada na visualização e conversão (inscrição).
- **Home (`Home.tsx`):** Listagem de torneios em cards com atualização em tempo real.
- **Detalhes (`TournamentDetails.tsx`):** Informações profundas do evento e Call-to-Action para inscrição.
- **Modal de Pagamento (`PaymentModal.tsx`):** Gerencia o fluxo de checkout, exibindo o QR Code do Pix e botão de "Copia e Cola".
- **Auth (`Login.tsx` / `Register.tsx`):** Formulários validados para acesso à plataforma.

#### B. Área Administrativa (Loja)
Focada em gestão e dados. Acesso restrito via verificação de role JWT.
- **Dashboard (`AdminDashboard.tsx`):** KPIs em tempo real (Faturamento mensal, Torneios ativos, Total de inscritos).
- **Gestão de Torneios (`ManageTournaments.tsx`):** O centro operacional do sistema. Possui abas para:
    1.  **Inscritos:** Lista de jogadores, status de pagamento e validação manual.
    2.  **Partidas:** Interface para criar pareamentos manuais, visualizar a rodada atual e definir vencedores.
- **CRUDs:** Telas para Criar (`CreateTournament`) e Editar (`EditTournament`) eventos.

---

## 🛠 Stack Tecnológica Completa

### Banco de Dados
- **PostgreSQL 16+** (Docker).
- **TypeORM** (Abordagem Database First / Repository Pattern).
- **DBeaver** (Modelagem e Scripts SQL).

### Backend (API)
- **Framework:** NestJS (Node.js).
- **Linguagem:** TypeScript.
- **Real-time:** Socket.io (WebSocket Gateway).
- **Validação:** `class-validator` (DTOs) e `Pipes`.
- **Configuração:** `@nestjs/config` (Variáveis de ambiente).

### Frontend (SPA)
- **Framework:** React 18 (Vite).
- **Linguagem:** TypeScript.
- **Estilização:** Tailwind CSS (Utility-first) + Shadcn/UI (Componentes Acessíveis).
- **Ícones:** Lucide React.
- **HTTP Client:** Axios (Configurado com Interceptors).
- **Real-time Client:** Socket.io Client (Hook customizado `useSocket`).
- **Feedback:** Sonner (Toasts para notificações).