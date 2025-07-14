# Bot de Discord para Daggerheart e RPG

![JavaScript](https://img.shields.io/badge/JavaScript-ES6%2B-F7DF1E?logo=javascript&logoColor=black)
![Node.js](https://img.shields.io/badge/Node.js-v20.x-339933?logo=node.js)
![discord.js](https://img.shields.io/badge/discord.js-v14-5865F2?logo=discord&logoColor=white)

### Um bot para Discord feito em discord.js para auxiliar em mesas de RPG, com foco no sistema Daggerheart, mas também com funcionalidades genéricas.

## Funcionalidades

- **/dh**: Rola os dados de dualidade (Esperança e Medo) de Daggerheart, com suporte a modificadores e rolagens críticas.
- **/rolar**: Um rolador de dados universal. Suporta o formato `XdY` (ex: `2d6`, `1d20`) e modificadores.
- **/fear**: Um rastreador para o nível de "Medo" da mesa, com dados salvos persistentemente em um arquivo `db.json`.
- **/ficha**: Um sistema de ficha de personagem simples onde jogadores podem salvar e consultar seus status (HP, Shield, Stress, Hope). Mestres podem editar a ficha de outros jogadores.

## Como Instalar e Rodar

Siga os passos abaixo para hospedar sua própria instância do bot.

1.  **Clone o Repositório**
    ```bash
    git clone [https://github.com/lhgomesdev/daggerheart-discord-bot](https://github.com/lhgomesdev/daggerheart-discord-bot)
    cd seu-repositorio
    ```

2.  **Instale as Dependências**
    É necessário ter o [Node.js](https://nodejs.org/) instalado.
    ```bash
    npm install
    ```

3.  **Configure as Variáveis de Ambiente**
    - Crie um arquivo chamado `.env` na pasta principal do projeto.
    - Se necessário utilize o arquivo `.env.example` como exemplo para a criação
    - Adicione as seguintes variáveis a ele, preenchendo com suas informações:
      ```
      DISCORD_TOKEN=O_TOKEN_SECRETO_DO_SEU_BOT
      CLIENT_ID=O_ID_DA_APLICAÇÃO_DO_SEU_BOT
      GUILD_ID=O_ID_DO_SEU_SERVIDOR_DE_TESTES
      ```
    - **Importante:** O arquivo `.gitignore` já está configurado para impedir que seu arquivo `.env` seja enviado para o GitHub, mantendo seu token seguro.

4.  **Registre os Comandos no Discord**
    Execute este comando **uma única vez** (ou sempre que adicionar/modificar um comando) para registrar os slash commands no seu servidor.
    ```bash
    node deploy-commands.js
    ```

5.  **Inicie o Bot**
    ```bash
    node index.js
    ```
    O bot deverá ficar online no seu servidor.

## Uso

- `/dh modificador: 1` - Rola os dados de Daggerheart com +1 de bônus.
- `/rolar dados: 3d8 modificador: -2` - Rola 3d8 e subtrai 2 do total.
- `/fear adicionar valor: 1` - Aumenta o Medo da mesa em 1.
- `/ficha definir hp: 12 shield: 5` - Define seus status de HP e Shield.
- `/ficha ver usuario: @Amigo` - Vê a ficha de outro jogador.

