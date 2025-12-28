# Sistema de Gestão de Torneios TCG

Sistema gerenciador de torneios de Trading Card Games (TCG), focado na automatização de pareamentos, gestão de mesas e controle financeiro via PIX.

## 📋 Sobre o Projeto

Este projeto visa facilitar a organização de eventos de jogos de cartas em lojas locais (LGS), substituindo planilhas manuais e softwares obsoletos. A arquitetura é baseada em microsserviços e módulos bem definidos, utilizando uma stack moderna e robusta.

### Funcionalidades Principais

- **Gestão de Usuários:** Controle de jogadores e administradores com criptografia de senhas.
- **Autenticação Segura:** Login via Token JWT (Stateless) e proteção de rotas por cargo (RBAC).
- **Gestão de Torneios:** Criação de eventos com suporte a taxas de inscrição e formatos variados.
- **Financeiro (Integração PIX):** Controle de pagamentos e status de inscrição.
- **Gestão de Mesas:** Controle físico das mesas da loja e sua disponibilidade.
- **Pareamento (Matchmaking):** Estrutura preparada para WebSocket e alocação automática.

## 🔐 Módulo de Autenticação (Decisões Arquiteturais)

O sistema de segurança foi projetado para ser modular e escalável, evitando sessões em servidor (stateless).

- **Passport.js (@nestjs/passport):** Escolhido pela modularidade. Permite implementar "Estratégias" isoladas. São utilizadas:
  - **Local Strategy:** Para validar email/senha no momento do login.
  - **JWT Strategy:** Para proteger rotas privadas, validando o token no Header `Authorization`.
- **JWT (JSON Web Token):** Garante que o backend não precise armazenar sessões em memória, facilitando a comunicação futura com o frontend.
- **Bcrypt:** Utilizado para hashing unidirecional de senhas antes da persistência no banco. Nenhuma senha é salva em texto puro.

## 🛠 Tecnologias

### Banco de Dados

- **PostgreSQL 16+** (via Docker)
- **DBeaver** (Modelagem e Scripts)

### Backend (API)

- **Framework:** NestJS (Node.js)
- **Linguagem:** TypeScript
- **ORM:** TypeORM (Abordagem _Database First_)
- **Segurança:** Passport.js, JWT, Bcrypt
- **Gerenciador de Pacotes:** npm
- **Configuração:** `@nestjs/config` (Variáveis de ambiente)

## 🚀 Configuração do Ambiente

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
