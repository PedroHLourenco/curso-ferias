# Sistema de Gestão de Torneios TCG

Sistema gerenciador de torneios de Trading Card Games (TCG), focado na automatização de pareamentos, gestão de mesas e controle financeiro via PIX.

## 📋 Sobre o Projeto

Este projeto visa facilitar a organização de eventos de jogos de cartas em lojas locais (LGS), substituindo planilhas manuais e softwares obsoletos. A arquitetura é baseada em microsserviços e módulos bem definidos, utilizando uma stack moderna e robusta.

### Funcionalidades Principais

- **Gestão de Usuários:** Controle de jogadores e administradores com criptografia de senhas.
- **Autenticação Segura:** Login via Token JWT (Stateless) e proteção de rotas por cargo (RBAC).
- **Gestão de Torneios:** Criação de eventos com suporte a taxas de inscrição e formatos variados.
- **Inscrições (Registrations):** Controle de vagas (`maxPlayers`), validação de duplicidade e vínculo financeiro.
- **Financeiro (Integração PIX):** Geração automática de QR Code e Copia e Cola via API do Mercado Pago.
- **Gestão de Partidas (Matches):**
  - Definição de pareamentos (Jogador 1 vs Jogador 2).
  - Alocação de mesas (`GameTables`).
  - Report de resultados (Vencedor/Empate) com validação de participantes.
- **Gestão de Mesas:** Controle físico das mesas da loja e sua disponibilidade.

## 🏛 Arquitetura de Dados (Entidades)

O sistema cumpre o requisito de modelagem relacional robusta com **5 Entidades Principais**:

1. **Users:** Atores do sistema (Jogadores e Admins).
2. **Tournaments:** Os eventos gerenciados.
3. **GameTables:** Recursos físicos da loja.
4. **Registrations:** Tabela pivô (N:N) com lógica de pagamento.
5. **Matches:** O coração do torneio, registrando o histórico de confrontos.

## 🔐 Módulo de Autenticação

O sistema de segurança foi projetado para ser modular e escalável:

- **Passport.js + JWT:** Estratégia _Stateless_ para proteção de rotas.
- **Bcrypt:** Hashing unidirecional de senhas.

## 💳 Módulo de Pagamentos (Externo)

Integração direta com o **Mercado Pago API (v1)**:

- Geração de cobranças PIX em tempo real.
- Uso de ambiente Sandbox (Testes) configurável via `.env`.

## 🛠 Tecnologias

### Banco de Dados

- **PostgreSQL 16+** (Docker)
- **TypeORM** (Gerenciamento de Entidades e Relacionamentos)

### Backend (API)

- **Framework:** NestJS (Node.js)
- **Linguagem:** TypeScript
- **Validação:** `class-validator` (DTOs)
- **HTTP Client:** Axios

## 🚀 Configuração do Ambiente

### Pré-requisitos

- [Docker](https://www.docker.com/) e [Node.js](https://nodejs.org/) (v18+).

### 1. Banco de Dados (Docker)

```bash
docker run --name projeto-db \
  -e POSTGRES_USER=docker \
  -e POSTGRES_PASSWORD=docker \
  -e POSTGRES_DB=reservas_db \
  -p 5432:5432 \
  -d postgres
```
