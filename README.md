# Sistema de Gestão de Torneios TCG

Sistema gerenciador de torneios de Trading Card Games (TCG), focado na automatização de pareamentos, gestão de mesas e controle financeiro via PIX.

## 📋 Sobre o Projeto

Este projeto visa facilitar a organização de eventos de jogos de cartas em lojas locais (LGS), substituindo planilhas manuais e softwares obsoletos. A arquitetura é baseada em microsserviços e módulos bem definidos, utilizando uma stack moderna e robusta em Node.js.

### Funcionalidades Principais

- **Gestão de Usuários:** Controle de jogadores e administradores com criptografia de senhas.
- **Autenticação & Autorização:** Sistema completo de proteção de rotas (RBAC).
- **Gestão de Torneios:** Criação de eventos com suporte a taxas de inscrição e formatos variados.
- **Inscrições (Registrations):** Controle de vagas (`maxPlayers`), validação de duplicidade e vínculo financeiro.
- **Financeiro (Integração PIX):** Geração automática de QR Code e Copia e Cola via API do Mercado Pago.
- **Gestão de Partidas (Matches):** Pareamentos, alocação de mesas e report de resultados.
- **Gestão de Mesas:** Controle físico das mesas da loja e sua disponibilidade.

---

## 🔐 Autenticação e Segurança (RBAC)

O sistema utiliza uma estratégia **Stateless** (sem sessão em memória) baseada em JWT (JSON Web Token) e **Guards** do NestJS para implementar RBAC (Role-Based Access Control).

### 1. Tecnologias de Segurança

- **Passport.js:** Gerencia as estratégias de autenticação.
  - `LocalStrategy`: Valida email/senha no login e devolve o Token.
  - `JwtStrategy`: Intercepta cada requisição, decodifica o Token `Bearer` e injeta o usuário no objeto `request`.
- **Bcrypt:** Hashing unidirecional de senhas antes da persistência no banco.

### 2. Sistema de Guards (Como o código funciona)

A segurança não depende apenas de estar logado, mas de **quem** está logado. Implementamos dois níveis de blindagem:

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
| **Tournaments**   | Ver Torneios     | `GET`        | 🔓 Público      | Marketing da loja (visitantes podem ver).          |
|                   | Criar/Editar     | `POST/PATCH` | 🔒 **ADMIN**    | Apenas a loja cria eventos.                        |
| **Matches**       | Ver Chaveamento  | `GET`        | 🔓 Público      | Jogadores acompanham as rodadas.                   |
|                   | Definir Vencedor | `PATCH`      | 🔒 **ADMIN**    | Apenas o organizador reporta o resultado.          |
| **Registrations** | Inscrever-se     | `POST`       | 🔑 **Logado**   | Qualquer usuário logado pode gerar PIX.            |
| **Users**         | Criar Conta      | `POST`       | 🔓 Público      | Cadastro aberto para novos jogadores.              |
|                   | Editar Perfil    | `PATCH`      | 🛡️ **Híbrido**  | Usuário edita a si mesmo; Admin edita qualquer um. |

---

## 🏛 Arquitetura de Dados (Entidades)

O sistema cumpre o requisito de modelagem relacional robusta com **5 Entidades Principais**:

1.  **Users:** Atores do sistema (Jogadores e Admins).
2.  **Tournaments:** Os eventos gerenciados.
3.  **GameTables:** Recursos físicos da loja.
4.  **Registrations:** Tabela pivô (N:N) com lógica de pagamento.
5.  **Matches:** O coração do torneio, registrando o histórico de confrontos.

---

## 💳 Módulo de Pagamentos (Externo)

Integração direta com o **Mercado Pago API (v1)**:

- **Tecnologia:** `Axios` para comunicação HTTP.
- **Fluxo:** O backend valida a inscrição -> Solicita pagamento ao Mercado Pago -> Retorna QR Code ao Frontend.
- **Segurança:** Credenciais gerenciadas via `.env` (Ambiente Sandbox/Teste).

---

## 🛠 Tecnologias e Ferramentas

### Banco de Dados

- **PostgreSQL 16+** (Docker)
- **TypeORM** (Abordagem Database First / Repository Pattern)
- **DBeaver** (Modelagem e Scripts SQL)

### Backend (API)

- **Framework:** NestJS (Node.js)
- **Linguagem:** TypeScript
- **Validação:** `class-validator` (DTOs) e `Pipes`
- **Configuração:** `@nestjs/config` (Variáveis de ambiente)

---

## 🚀 Como Rodar o Projeto

### Pré-requisitos

- [Docker](https://www.docker.com/) e [Node.js](https://nodejs.org/) (v18+).

### 1. Banco de Dados

```bash
docker run --name projeto-db \
  -e POSTGRES_USER=docker \
  -e POSTGRES_PASSWORD=docker \
  -e POSTGRES_DB=reservas_db \
  -p 5432:5432 \
  -d postgres
```
