# CP02 - FIAP Kitchenet App

---

## SOBRE O PROJETO

### ⤷ Nome do app e função

O **FIAP Kitchenet** é um aplicativo mobile desenvolvido com React Native + Expo que digitaliza a experiência dos alunos na cantina da FIAP.

O app resolve problemas reais do dia a dia:

- Dúvida sobre qual andar tem determinado alimento
- Tempo perdido em filas sem saber o que tem disponível
- Falta de uma forma de favoritar itens e montar um pedido antes de descer

### ⤷ Funcionalidades implementadas

- Tela de Login com validação completa (e-mail, senha mín. 6 chars)
- Tela de Cadastro com validação (nome, e-mail, senha, confirmação de senha, telefone com máscara)
- Autenticação real com AsyncStorage (sem Firebase, sem libs externas)
- essão persistida: ao reabrir o app, usuário logado não precisa fazer login novamente
- Logout com limpeza de sessão
- Navegação protegida: rotas autenticadas inacessíveis sem login
- Tela Início com boas-vindas, destaques e filtro por andar
- Tela Cardápio com busca em tempo real e filtro por andar (FlatList)
- Tela Favoritos por usuário, persistida com AsyncStorage
- Tela Carrinho com controle de quantidade e total calculado
- Tela Perfil com dados do usuário e logout
- Tela Detalhes do item com botão de adicionar ao carrinho e favoritar
- Componentes reutilizáveis: `Input`, `Button`, `ItemCard`
- Feedback visual: erros inline, loading, lista vazia, badge no carrinho

---

## INTEGRANTES

### ⤷ Nome e RM:

Laís Krajner Lacerda, RM563182

---

## COMO RODAR O PROJETO

### ⤷ Pré-requisitos:

- Node.js
- Expo Go no celular ou emulador Android/iOS
- Expo SDK 51+

### ⤷ Passo a passo:

```bash
# Clone o repositório
git clone https://github.com/renjark/fiap-cpad-cp2-kitchenet-app.git

# Acesse a pasta
cd fiap-cpad-cp2-kitchenet-app/kitchenet-app

# Instale as dependências
npm install

# Inicie o projeto
npx expo start
```

Escaneie o QR Code com o Expo Go ou execute no emulador com a opção `a` (Android) ou `i` (iOS).

---

## DEMONSTRAÇÃO VISUAL

<img src="https://github.com/user-attachments/assets/1526e340-a4c9-4e4f-b17c-3ed01bcf3fe7" width="320" height="680" alt="gravacao-cp2">

---

## DECISÕES TÉCNICAS

### ⤷ Estrutura do projeto

```
kitchenet-app/
├── app/
│   ├── (auth)/          # Telas públicas (login, cadastro)
│   │   ├── _layout.jsx
│   │   ├── login.jsx
│   │   └── cadastro.jsx
│   ├── (tabs)/          # Telas autenticadas (bottom tabs)
│   │   ├── _layout.jsx
│   │   ├── index.jsx    # Início
│   │   ├── pesquisa.jsx # Cardápio
│   │   ├── favoritos.jsx
│   │   ├── carrinho.jsx
│   │   └── perfil.jsx
│   ├── _layout.jsx      # Root layout com providers e RouteGuard
│   └── details.jsx      # Detalhes do item
├── components/          # Componentes reutilizáveis
│   ├── Button.jsx
│   ├── Input.jsx
│   └── ItemCard.jsx
├── context/             # Contexts globais
│   ├── AuthContext.jsx
│   └── AppDataContext.jsx
└── constants/           # Cores, temas, dados
    ├── theme.js
    └── items.js
```

### ⤷ Contexts criados

**AuthContext** — gerencia autenticação:
- `user`: usuário logado (ou `null`)
- `loading`: estado de carregamento da sessão
- `login(email, password)`: valida contra AsyncStorage, persiste sessão
- `logout()`: limpa sessão do AsyncStorage
- `register(name, email, password)`: salva novo usuário, loga automaticamente

**AppDataContext** — gerencia dados do app:
- `favorites` / `toggleFavorite` / `isFavorite`: favoritos por usuário
- `cart` / `addToCart` / `removeFromCart` / `updateQty` / `clearCart`: carrinho
- `cartTotal` / `cartCount`: dados derivados do carrinho

### ⤷ Como a autenticação foi implementada

1. Ao cadastrar, o usuário é salvo em `@kitchenet:users` (array JSON no AsyncStorage)
2. Ao logar, as credenciais são validadas contra esse array
3. A sessão é persistida em `@kitchenet:session`
4. Ao abrir o app, o `AuthContext` lê a sessão e restaura o usuário logado
5. O `RouteGuard` no `_layout.jsx` redireciona conforme o estado de autenticação

### ⤷ Como o AsyncStorage foi utilizado

| Chave | Dados | Quando é gravado |
|---|---|---|
| `@kitchenet:users` | Array de usuários cadastrados | Cadastro |
| `@kitchenet:session` | Sessão do usuário logado | Login / Logout |
| `@kitchenet:favorites:{userId}` | Favoritos do usuário | Toggle de favorito |
| `@kitchenet:cart:{userId}` | Carrinho do usuário | Adicionar/remover/alterar qtd |

### ⤷ Como a navegação protegida foi implementada

O componente `RouteGuard` no `app/_layout.jsx` monitora `user` e `segments` com `useEffect`. Se o usuário não está logado e tenta acessar qualquer rota fora de `(auth)`, é redirecionado para `/login`. Se já está logado e acessa uma rota de auth, vai direto para `/(tabs)`.

---

## PRÓXIMOS PASSOS

- Integração com API real da cantina para cardápio atualizado em tempo real
- Notificações locais com Expo Notifications para lembrar o horário do almoço

- Upload de foto de perfil com Expo ImagePicker
- Histórico de pedidos por usuário
- Avaliação de itens com estrelas
