# Verde Árido — Execução Local

Este README descreve como instalar dependências, executar em modo desenvolvimento, construir para produção e solucionar problemas comuns.

Pré-requisitos
- Node.js 18+ (recomendado)
- npm 8+ ou yarn

Passos rápidos (copie e cole no terminal)

```bash
cd /home/Bernardo/Documents/GitHub/teste_ia/verde-arido
# instalar dependências (recomendado em ambiente de desenvolvimento)
npm ci
# ou, se preferir instalar normalmente
# npm install

# rodar servidor de desenvolvimento (Vite)
npm run dev

# abrir no navegador (alternativa: pressione 'o' no terminal onde o Vite está rodando)
# Navegue para: http://localhost:5173/

# build para produção
npm run build

# checagem TypeScript (apenas para devs)
# usar npx para evitar problemas de permissão:
npx tsc --noEmit
```

Solução de problemas conhecidos

- Problema: `./node_modules/.bin/tsc: Permission denied` ao executar `./node_modules/.bin/tsc --noEmit`
  - Causa: binários locais podem não ter permissão de execução no seu sistema.
  - Solução recomendada:

```bash
# Tentar usar npx (não precisa de permissão no arquivo binário local)
npx tsc --noEmit

# Ou ajustar permissão do binário (use com cuidado):
chmod +x ./node_modules/.bin/tsc || true
# Em seguida, rode:
./node_modules/.bin/tsc --noEmit
```

- Problema: HMR não reflete alterações
  - Certifique-se de que o servidor Vite está rodando com `npm run dev`.
  - Tente reiniciar com `r` no terminal do Vite ou reinicie o processo.

Notas sobre a aplicação
- A rota principal do dev server é `http://localhost:5173/`.
- A aba "Central Educacional" está em `/educacional` e contém vídeos, dicas e um card "Parceiros e Cursos" que redireciona para `/parceiros?services=consultoria,cursos`.
- A página de parceiros suporta o parâmetro `services` (ex.: `?services=consultoria,cursos`) e quando presente exibe uma lista plana de empresas que oferecem esses serviços.

Editar código e testes
- Para formatar/lintear, use os comandos do projeto se existirem (ex.: `npm run lint`).
- Para rodar checagens TypeScript e corrigir erros, use `npx tsc --noEmit` e corrija os erros indicados.

Se quiser, eu posso:
- Abrir a URL do Vite no navegador agora.
- Rodar `npx tsc --noEmit` e coletar os erros (se você autorizar executar comandos no ambiente).

Arquivo atualizado: README.md
# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
