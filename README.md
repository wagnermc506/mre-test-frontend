## Descrição

Frontend desenvolvido em [React](https://react.dev/) + TypeScript + [Vite](https://vite.dev/) para o teste técnico do processo seletivo do Itamaraty. Consome a API pública [ViaCEP](https://viacep.com.br/) para busca de endereços por CEP e o CRUD de **Notícias** exposto pelo backend ([`mre-test-backend`](../mre-test-backend)), com paginação, roteamento entre as duas telas, testes em estilo BDD (Gherkin) e ambiente containerizado com Docker.

**Stack:** React · TypeScript · Vite · React Router · Axios · CSS puro · Vitest · Testing Library · vitest-cucumber · msw · Docker

## Pré-requisitos

- [Node.js](https://nodejs.org/) 24+ e [Yarn](https://yarnpkg.com/)
- [Docker](https://www.docker.com/) e Docker Compose (`docker compose`) — necessário só para rodar via container
- Backend rodando em `http://localhost:3000` para a tela de **Notícias** funcionar — veja o README do [`mre-test-backend`](../mre-test-backend/README.md). A tela de **Busca de CEP** não depende do backend, só da API pública do ViaCEP.

## Configuração

1. Copie o arquivo de variáveis de ambiente de exemplo:

   ```bash
   cp .env.example .env

   ```

2. Ajuste os valores em .env se necessário:

| Variável              | Padrão                   | Descrição                          |
| --------------------- | ------------------------ | ---------------------------------- |
| VITE_VIACEP_URL       | https://viacep.com.br/ws | Base da API do ViaCEP              |
| VITE_NOTICIAS_API_URL | http://localhost:3000    | Base da API do backend de Notícias |

2. Ambas têm fallback no código caso a variável não esteja definida, então o .env é opcional para rodar com os valores padrão.

Executando localmente

1. Instale as dependências:

yarn install 2. Inicie o servidor de desenvolvimento:

yarn dev 3. Acesse http://localhost:5173. A aplicação tem duas rotas:

- /cep — busca de endereço por CEP
- /noticias — CRUD de notícias (precisa do backend rodando em http://localhost:3000)

Executando com Docker

O Dockerfile/docker-compose.yaml atuais sobem a aplicação em modo de desenvolvimento, com hot reload (o código do host é montado dentro do container via volume).

docker compose up --build

Acesse http://localhost:5173 normalmente. Alterações nos arquivos do host refletem no container em tempo real, assim como rodando yarn dev fora do Docker.

▎ Um build de produção containerizado (multi-stage, servindo os arquivos estáticos via Nginx) será adicionado depois, junto com o restante do setup de produção.

Testes

# roda a suíte uma vez

yarn test

# modo watch

yarn test:watch

O teste da busca de CEP segue metodologia BDD: o comportamento é especificado em Gherkin em src/components/CepSearchForm/CepSearchForm.feature (cenários de sucesso, CEP inexistente, formato inválido e falha de conexão), executado via vitest-cucumber com os steps implementados em CepSearchForm.steps.test.tsx. As chamadas ao ViaCEP são mockadas com msw, sem dependência de rede real durante os testes.

Build de produção

yarn build # gera os arquivos estáticos em dist/
yarn preview # serve o build gerado localmente, para conferência

Lint

yarn lint
