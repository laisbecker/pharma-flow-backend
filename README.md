# 💊 PharmaFlow 

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-18.x-green)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-3178C6)](https://www.typescriptlang.org/)

## 📖 Índice
- [Problema Solucionado](#-problema-solucionado)
- [Funcionalidades Principais](#-funcionalidades-principais)
- [Tecnologias Utilizadas](#-tecnologias-utilizadas)
- [Como Executar](#-como-executar)
- [Estrutura do Projeto](#-estrutura-do-projeto)
- [Melhorias Futuras](#melhorias-futuras)
- [Link](#link)

Sistema de gestão de estoque multi-filiais com rastreamento de movimentações e controle de motoristas

## 🎯 Problema Solucionado
O StockFlow Manager resolve os desafios de:
- Controle descentralizado de estoque entre múltiplas filiais
- Rastreamento inadequado de transferências entre unidades
- Comunicação ineficiente entre departamentos e motoristas
- Falta de visão em tempo real do status das movimentações

## ✨ Funcionalidades Principais
-  Autenticação de usuários com diferentes perfis (Admin, Filial, Motorista)
-  Controle de estoque em tempo real por filial
-  Rastreamento completo de movimentações (Pendente/Em Progresso/Concluído)
-  Dashboard de atividades e histórico de transações
-  Notificações de status para motoristas

## 🛠 Tecnologias Utilizadas

### Backend
![Node.js](https://img.shields.io/badge/-Node.js-339933?logo=node.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/-TypeScript-3178C6?logo=typescript&logoColor=white)
![TypeORM](https://img.shields.io/badge/-TypeORM-FE0909?logo=typeorm&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/-PostgreSQL-4169E1?logo=postgresql&logoColor=white)
![JWT](https://img.shields.io/badge/-JWT-000000?logo=json-web-tokens&logoColor=white)

### Ferramentas
![Git](https://img.shields.io/badge/-Git-F05032?logo=git&logoColor=white)

## 🚀 Como Executar

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
cp .env.example .env

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
CREATE DATABASE pharma-flow-project;

6. Executar migrações
npm run migration:run

7. Popular dados iniciais
npm run seed
```

## 📂 Estrutura do Projeto
```bash
stockflow-manager/
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

## Melhorias Futuras

- Implementar paginação das listagens de usuário, produtos e movimentação.

- Desenvolver módulo de relatórios PDF

## Link

- Vídeo:

      https://drive.google.com/file/d/160IinzUsrhHBj_ZbHCMNnTqOpMz1Qub_/view?usp=sharing

  
