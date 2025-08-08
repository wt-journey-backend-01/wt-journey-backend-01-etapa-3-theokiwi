Instruções para Rodar o Projeto

Este documento explica como configurar o banco de dados PostgreSQL usando Docker, executar as migrations para criar as tabelas e rodar as seeds para popular com os dados iniciais.

1. Subir o Banco de Dados com Docker

Certifique-se de ter o Docker instalado e em execução na sua máquina.

    Crie um arquivo .env na raiz do projeto com as seguintes variáveis de ambiente para o banco de dados:
    Code snippet

POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DB=policia_db

Crie um arquivo docker-compose.yml na raiz do projeto (ou utilize o existente). Ele deve conter a configuração do serviço do PostgreSQL, utilizando as variáveis definidas no arquivo .env.

Execute o comando para iniciar o container do banco de dados em modo detached (-d):
Bash

docker compose up -d

Verifique se o container está em execução com o comando:
Bash

    docker ps

2. Executar as Migrations

As migrations são responsáveis por criar a estrutura das tabelas no banco de dados.

    Certifique-se de que o container do banco de dados esteja em execução.

    No terminal, na raiz do projeto, execute o seguinte comando para aplicar todas as migrations pendentes:
    Bash

    npx knex migrate:latest

    Este comando criará as tabelas agentes e casos.

3. Rodar as Seeds

As seeds inserem dados iniciais nas tabelas para facilitar os testes e o desenvolvimento.

    Após a execução bem-sucedida das migrations, execute o comando abaixo para popular as tabelas:
    Bash

    npx knex seed:run

    Este comando irá popular as tabelas com pelo menos 2 agentes e 2 casos.

Observações Importantes

    IDs Automáticos: Não modifique manualmente os IDs ao inserir dados. O PostgreSQL gerencia a auto-incrementação dos IDs automaticamente.

    Resetar o Banco: Caso precise resetar as migrations e seeds, remova as tabelas de controle knex_migrations e knex_migrations_lock diretamente no banco de dados e delete os arquivos antigos das pastas db/migrations e db/seeds.

    Ordem de Execução: Siga sempre a ordem correta dos passos: 1. Subir o banco → 2. Rodar migrations → 3. Rodar seeds.