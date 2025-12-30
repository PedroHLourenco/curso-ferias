# Sistema de Gestão de Torneios TCG

Sistema gerenciador de torneios de Trading Card Games (TCG), focado na automatização de pareamentos, gestão de mesas e controle financeiro via PIX.

## Sobre o Projeto

Este projeto visa facilitar a organização de eventos de jogos de cartas em lojas locais (LGS), substituindo planilhas manuais e softwares obsoletos. A arquitetura é baseada em microsserviços e módulos bem definidos, utilizando uma stack moderna e robusta.

### Funcionalidades Principais

- **Gestão de Usuários:** Controle de jogadores e administradores com criptografia de senhas.
- **Autenticação Segura:** Login via Token JWT (Stateless) e proteção de rotas por cargo (RBAC).
- **Gestão de Torneios:** Criação de eventos com suporte a taxas de inscrição e formatos variados.
- **Inscrições & Vagas (Registrations):** - Controle automático de capacidade do torneio (`maxPlayers`).
  - Prevenção de inscrições duplicadas.
  - Relacionamento N:N (Muitos Jogadores em Muitos Torneios).
- **Financeiro (Integração PIX):** - Geração automática de QR Code e código "Copia e Cola" via **API do Mercado Pago**.
  - Persistência de IDs de transação externa e status de pagamento.
- **Gestão de Mesas:** Controle físico das mesas da loja e sua disponibilidade.

## Módulo de Autenticação (Decisões Arquiteturais)

O sistema de segurança foi projetado para ser modular e escalável, evitando sessões em servidor (stateless).

- **Passport.js (@nestjs/passport):** Escolhido pela modularidade. Permite implementar "Estratégias" isoladas:
  - **Local Strategy:** Validação de email/senha.
  - **JWT Strategy:** Proteção de rotas privadas via Header `Authorization`.
- **Bcrypt:** Hashing de senhas antes da persistência.

## Módulo de Pagamentos (Integração Externa)

A aplicação se comunica diretamente com gateways de pagamento para automatizar a cobrança de inscrições.

- **Provedor:** Mercado Pago (API v1).
- **Tecnologia:** `Axios` para requisições HTTP e tratamento de respostas externas.
- **Fluxo:** Ao criar uma inscrição (`POST /registrations`), o backend:
  1. Valida regras de negócio (vagas, existência do usuário).
  2. Solicita um pagamento PIX à API do Mercado Pago.
  3. Retorna o QR Code e o Código Copia e Cola diretamente para o Frontend.
- **Segurança:** As credenciais (`ACCESS_TOKEN`) são gerenciadas via variáveis de ambiente, nunca expostas no código.

## Tecnologias

### Banco de Dados

- **PostgreSQL 16+** (via Docker)
- **DBeaver** (Modelagem e Scripts)

### Backend (API)

- **Framework:** NestJS (Node.js)
- **Linguagem:** TypeScript
- **ORM:** TypeORM (Database First / Relational Mapping)
- **Segurança:** Passport.js, JWT, Bcrypt
- **HTTP Client:** Axios (Integrações Externas)
- **Configuração:** `@nestjs/config` (Dotenv)

## Configuração do Ambiente

### Pré-requisitos

- [Docker](https://www.docker.com/) instalado e rodando.
- [Node.js](https://nodejs.org/) (v18+) instalado.
- [NestJS CLI](https://docs.nestjs.com/) instalado globalmente (`npm i -g @nestjs/cli`).

### 1. Banco de Dados (Docker)

Suba o container do banco de dados com as credenciais configuradas:

```bash
docker run --name projeto-db \
  -e POSTGRES_USER=docker \
  -e POSTGRES_PASSWORD=docker \
  -e POSTGRES_DB=reservas_db \
  -p 5432:5432 \
  -d postgres
```
