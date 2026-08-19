## Organização por camada técnica, com componentes agrupados por feature

```
src/
  components/
    CepSearchForm/   → CepSearchForm.tsx, .css, .feature, .steps.test.tsx
    Noticias/        → NoticiaForm.tsx, NoticiaList.tsx, NoticiaPage.tsx, Noticias.css
    Pagination/      → componente genérico, sem conhecimento de CEP ou Notícia
    Layout/          → casca de navegação (Outlet do React Router)
  hooks/             → useCepSearch.ts, useNoticias.ts
  services/          → um cliente HTTP por integração externa
  types/             → contratos TypeScript compartilhados
  utils/             → funções puras, sem estado
  test/              → infraestrutura de teste global (setup, mocks do msw)
```

O topo do projeto é organizado por **camada técnica** (`components`, `hooks`, `services`...), não por feature completa (não existe uma pasta `cep/` com componente+hook+service+tipo juntos). Para uma aplicação com duas telas, misturar as duas camadas geraria indireção sem ganho real — dá pra abrir `hooks/` e ver as duas fontes de estado do app numa olhada só. Se o projeto crescesse para dezenas de telas, o próximo passo natural seria migrar para feature folders (cada domínio com seu hook/service/tipo colocados juntos); a estrutura atual não impede essa migração, só não a antecipa sem necessidade.

## Componentes: cada pasta é uma feature autocontida

Dentro de `components/`, cada subpasta agrupa **tudo** que é específico daquela feature: o componente, o CSS, e — no caso de `CepSearchForm/` — a especificação BDD (`.feature`) e os steps do teste (`.steps.test.tsx`) também. A motivação é a mesma do backend para módulos de domínio: apagar a pasta remove a feature inteira, sem deixar arquivo órfão em outro lugar; e não há disputa de merge entre features que não se tocam.

## `services/`: um cliente HTTP por integração externa

`viaCephttpClient.ts` e `noticiaHttpClient.ts` são instâncias `axios.create()` separadas, cada uma com sua própria `baseURL`/timeout, em vez de um client HTTP genérico compartilhado. Isso isola a configuração de cada API (o ViaCEP e o backend de Notícias evoluem de forma independente, com contratos de erro diferentes) e torna trivial mockar uma sem afetar a outra nos testes.

## `hooks/`: estado e orquestração fora dos componentes

`useCepSearch` e `useNoticias` concentram loading/erro/estado e a chamada aos `services/`; os componentes (`CepSearchForm`, `NoticiaPage`) ficam responsáveis só por renderizar e capturar eventos de UI. Essa separação é o que permite testar o comportamento (via BDD, simulando digitação/clique) sem que a lógica de estado fique espalhada em `useEffect`s dentro do JSX.

## Configuração via `.env.example` + `vite-env.d.ts`

Mesmo padrão do backend: variáveis de ambiente documentadas em `.env.example` sem valor sensível real, tipadas em `vite-env.d.ts` para autocomplete/checagem, com fallback hardcoded no código caso a variável não esteja definida — a aplicação roda com os valores padrão mesmo sem `.env` configurado.

## Testes: BDD colado ao componente, infraestrutura compartilhada em `test/`

O `.feature` e o `.steps.test.tsx` da busca de CEP ficam ao lado do componente que testam (mesma lógica de descoberta do restante de `components/`). Já o que é **transversal** — setup do jsdom/jest-dom, handlers e servidor do `msw` — fica em `test/`, porque não pertence a nenhuma feature específica e será reaproveitado por qualquer teste futuro de componente.

## ESLint + Prettier com responsabilidades separadas

ESLint cuida de corretude (regras de hooks do React via `eslint-plugin-react-hooks`, regras de TypeScript via `typescript-eslint`); Prettier cuida só de formatação (aspas, vírgula final, etc.). `eslint-config-prettier` desliga qualquer regra de estilo do ESLint que possa conflitar com o Prettier, então as duas ferramentas nunca brigam pela mesma linha. O `.prettierrc` usa a mesma configuração do backend (`singleQuote`, `trailingComma: "all"`), mantendo um único padrão de formatação para quem trabalha nos dois repositórios.
