# Sistema de Gestão de Torneios TCG

Sistema gerenciador de torneios de Trading Card Games (TCG), focado na automatização de pareamentos, gestão de mesas e controle financeiro via PIX.

## 📋 Sobre o Projeto

Este projeto visa facilitar a organização de eventos de jogos de cartas em lojas locais (LGS), substituindo planilhas manuais e softwares obsoletos. A arquitetura é baseada em microsserviços containerizados, com foco inicial na robustez do banco de dados relacional.

### Funcionalidades Principais (Backend/DB)
* **Gestão de Usuários:** Controle de jogadores e administradores (Juízes/Staff).
* **Gestão de Torneios:** Criação de eventos com suporte a taxas de inscrição e formatos variados.
* **Financeiro (Integração PIX):** Tabela dedicada para controle de pagamentos e status de inscrição.
* **Gestão de Mesas:** Controle físico das mesas da loja e sua disponibilidade.
* **Pareamento (Matchmaking):** Estrutura pronta para suporte a WebSocket, com controle de tempo de rodada (`start_time`/`end_time`) e alocação automática de mesas.

## 🛠 Tecnologias

* **Banco de Dados:** PostgreSQL 16+
* **Infraestrutura:** Docker & Docker Compose
* **Modelagem:** DBeaver
* **Editor de Código:** VS Code

## 🚀 Configuração do Ambiente

### Pré-requisitos
* [Docker](https://www.docker.com/) instalado e rodando.
* [Git](https://git-scm.com/) instalado.

### 1. Clonar o Repositório

```bash
git init
# (Adicione a remote url se houver)

