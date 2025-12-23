# Sistema de Gestão de Torneios TCG

Sistema gerenciador de torneios de Trading Card Games (TCG), focado na automatização de pareamentos, gestão de mesas e controle financeiro via PIX.

## 📋 Sobre o Projeto

Este projeto visa facilitar a organização de eventos de jogos de cartas em lojas locais (LGS), substituindo planilhas manuais e softwares obsoletos. A arquitetura é baseada em microsserviços e módulos bem definidos, utilizando uma stack moderna e robusta.

### Funcionalidades Principais
* **Gestão de Usuários:** Controle de jogadores e administradores (Juízes/Staff).
* **Gestão de Torneios:** Criação de eventos com suporte a taxas de inscrição e formatos variados.
* **Financeiro (Integração PIX):** Controle de pagamentos e status de inscrição.
* **Gestão de Mesas:** Controle físico das mesas da loja e sua disponibilidade.
* **Pareamento (Matchmaking):** Estrutura preparada para WebSocket e alocação automática.

## 🛠 Tecnologias

### Banco de Dados
* **PostgreSQL 16+** (via Docker)
* **DBeaver** (Modelagem e Scripts)

### Backend (API)
* **Framework:** NestJS (Node.js)
* **Linguagem:** TypeScript
* **ORM:** TypeORM (Abordagem *Database First*)
* **Gerenciador de Pacotes:** npm
* **Segurança:** Variáveis de ambiente com `@nestjs/config`

## 🚀 Configuração do Ambiente

### Pré-requisitos
* [Docker](https://www.docker.com/) instalado e rodando.
* [Node.js](https://nodejs.org/) (v18+) instalado.
* [NestJS CLI](https://docs.nestjs.com/) instalado globalmente (`npm i -g @nestjs/cli`).

### 1. Banco de Dados (Docker)

Suba o container do banco de dados com as credenciais configuradas:

```bash
docker run --name projeto-db \
  -e POSTGRES_USER=docker \
  -e POSTGRES_PASSWORD=docker \
  -e POSTGRES_DB=reservas_db \
  -p 5432:5432 \
  -d postgres