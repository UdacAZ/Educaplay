# EducaPlay 🎮

Site de jogos educativos interativos para crianças. Desenvolvido com HTML, CSS e JavaScript puro, com backend via Supabase.

## Jogos disponíveis

**Matemática**
- Memória Matemática
- Balança Mágica
- Caça ao Número
- Pizzaria da Divisão
- Mercado do Aluno

**Português**
- Corrida das Palavras
- Quebra-Cabeça de Palavras
- Labirinto das Letras
- Mestre das Trocas
- Fábrica de Palavras

## Estrutura do projeto

```
educaplay/
├── assets/
│   └── sprites/
│       └── labirinto-letras/   # Sprites do jogo de plataforma
├── imag/
│   ├── mascote/                # Imagens do mascote Mipo
│   └── *.png                   # Fundos dos jogos
├── jogos/                      # Páginas de cada jogo
├── supabase/
│   └── schema.sql              # Schema do banco de dados
├── index.html                  # Landing page
├── login.html                  # Login / cadastro
├── dashboard.html              # Painel de jogos
├── perfil.html                 # Perfil do usuário
├── style.css                   # Estilos globais
├── nipo.js                     # Mascote Mipo (feedback visual)
└── auth.js                     # Cliente Supabase + helpers de auth
```

## Configuração do backend (Supabase)

1. Crie um projeto em [supabase.com](https://supabase.com)
2. Vá em **SQL Editor → New Query**, cole o conteúdo de `supabase/schema.sql` e execute
3. Em `auth.js`, substitua as constantes:

```js
const SUPABASE_URL      = 'https://SEU-PROJETO.supabase.co';
const SUPABASE_ANON_KEY = 'sua-anon-key';
```

4. (Opcional) Para login com Google: Supabase → Authentication → Providers → Google

## Como rodar localmente

Por ser um site estático, basta abrir com um servidor local. Exemplo com VS Code: instale a extensão **Live Server** e clique em *Go Live*.

> Abrir `index.html` diretamente no navegador (via `file://`) não funciona com o Supabase devido a restrições de CORS.
