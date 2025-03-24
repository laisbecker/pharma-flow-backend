# 💊 PharmaFlow 

## Índice
- [Introdução](#introducao)
- [Funcionalidades Principais](#funcionalidades-principais)
- [Tecnologias Utilizadas](#tecnologias-utilizadas)
- [Rotas da API](#rotas-da-api)
- [Configuração e Execução do Projeto](#configuracao-e-execucao)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Melhorias Futuras](#melhorias-futuras)
- [Demonstração](#demonstracao)

## <a id="introducao"></a>1. Introdução
O PharmaFlow tem por objetivo realizer a gestão de movimentações de produtos entre as filiais de uma rede farmacêutica, garantindo controle de estoque em tempo real e rastreamento completo das operações.

##  <a id="funcionalidades-principais"></a>2. Funcionalidades Principais
-  Autenticação de usuários com diferentes perfis e permissões (Admin, Filial, Motorista)
-  Cadastro e transferência de produtos entre as filiais
-  Controle de estoque em tempo real por filial
-  Rastreamento completo das movimentações (Pendente/Em Progresso/Concluído)

## <a id="tecnologias-utilizadas"></a>3. Tecnologias Utilizadas

### Backend
![Node.js](https://img.shields.io/badge/-Node.js-339933?logo=node.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/-TypeScript-3178C6?logo=typescript&logoColor=white)
[![Express](https://img.shields.io/badge/-Express-000000?logo=express&logoColor=white)](https://expressjs.com/)
![TypeORM](https://img.shields.io/badge/-TypeORM-FE0909?logo=typeorm&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/-PostgreSQL-4169E1?logo=postgresql&logoColor=white)
![JWT](https://img.shields.io/badge/-JWT-000000?logo=json-web-tokens&logoColor=white)

### Ferramentas
![Git](https://img.shields.io/badge/-Git-F05032?logo=git&logoColor=white)

## <a id="rotas-da-api"></a>4. Rotas da API

### Autenticação
| Método | Endpoint       | Descrição                | Auth |
|--------|----------------|--------------------------|------|
| `POST` | `/login`       | Login de usuários        | -    |

### Usuários
| Método  | Endpoint            | Descrição                                  | Permissão             |
|---------|---------------------|--------------------------------------------|-----------------------|
| `POST`  | `/users`            | Cadastro de usuários                       | Admin                 |
| `GET`   | `/users`            | Listagem de usuários                       | Admin                 |
| `GET`   | `/users/:id`        | Listagem de usuário por ID                 | Admin/próprio usuário |
| `PUT`   | `/users/:id`        | Atualização de informações dos usuários    | Admin/próprio usuário |
| `PATCH` | `/users/:id/status` | Alterar status de usuários (ativo/inativo) | Admin                 |

### Produtos
| Método | Endpoint        | Descrição                | Permissão     |
|--------|-----------------|--------------------------|---------------|
| `POST` | `/products`     | Cadastrar novo produto   | Branch        |
| `GET`  | `/products`     | Listar todos produtos    | Branch        |

### Movimentações
| Método | Endpoint              | Descrição                  | Permissão               |
|--------|-----------------------|----------------------------|-------------------------|
| `POST` | `/movements`          | Cadastrar movimentação     | Branch                  |
| `GET`  | `/movements`          | Listar movimentações       | Branch (destino)/Driver |
| `PATCH`| `/movements/:id/start`| Iniciar Movimentação       | Driver                  |
| `PATCH`| `/movements/:id/end`  | Finalizar Movimentação     | Driver                  |

##  <a id="configuracao-e-execucao"></a>5. Configuração e Execução do Projeto

### Pré-requisitos
- Node.js
- PostgreSQL
- NPM

### Passo a Passo
```bash
1. Clonar repositório
git clone https://github.com/laisbecker/pharma-flow-backend.git

2. Instalar Dependências
npm install

3. Configurar ambiente
cp .env-example .env

4. Preencher o arquivo .env com as informações necessárias
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=(username_db)
DB_PASSWORD=(password_db)
DB_NAME=pharma-flow-project
NODE_ENV=development
JWT_SECRET=(senha_secreta)
PORT=3000

5. Criar Database com o nome pharma-flow-project
CREATE DATABASE pharma-flow-project

6. Executar migrações
npm run migration:run

7. Popular dados iniciais
npm run seed

8. Iniciar servidor
npm run start
```
|   |   |
|---|---|
| ⚠️ | Para testar o funcionamento do sistema, logue com o e-mail e senha que foram criados com o arquivo seed. E-mail: admin@email.com, Senha: 123456 |

## <a id="estrutura-do-projeto"></a>6. Estrutura do Projeto
```bash
pharma-flow-backend/
├── src/
│   ├── controllers/    # Lógica dos endpoints
│   ├── entities/       # Modelos do banco de dados
│   ├── middlewares/    # Autenticação e validações
│   ├── routes/         # Configuração das rotas
│   └── database/       # Configuração do TypeORM
│        └── migrations/         # Scripts de migração
├── .env.example        # Modelo de variáveis de ambiente
└── package.json        # Dependências e scripts
```

## <a id="melhorias-futuras"></a>7. Melhorias Futuras

- Implementar paginação das listagens de usuários, produtos e movimentações.

- Desenvolver módulo de relatórios PDF e dashboard

## <a id="demonstracao"></a>8. Demonstração

- Vídeo de demonstração de funcionamento do projeto:

      https://drive.google.com/file/d/1SzwRMJ3h3G_dPQnfGMpdi1xs2Opfs4xF/view?usp=drive_link

  
