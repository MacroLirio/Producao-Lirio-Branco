# Starter • Sistema de Projetos (GitHub Pages + Firebase)

Cores: **azul petróleo** (#0f4c5c), **preto** (#111), **cinza** (#f2f2f2).

## Como usar (passo a passo)
1. **Crie** um projeto no [Firebase Console] → Adicione um app Web → copie o objeto `firebaseConfig`.
2. Em **Firestore Database** → **Criar banco** (modo bloqueado).  
   Em **Regras**, cole o conteúdo de `firestore.rules` e **Publicar**.
3. Em **Authentication** → **Método de login** → habilite **E-mail/senha**.
4. No seu repositório do GitHub (Pages), **envie todos os arquivos** desta pasta para a **raiz**.
5. Edite `firebase-init.js` e **cole seu firebaseConfig**.
6. Abra `index.html` no seu site. Crie sua **conta** e faça **login**.
7. No Console do Firebase, em **Firestore → users**, edite o documento do seu UID e defina `role = "admin"` para ter acesso ao **Financeiro** (ou crie manualmente esse doc).
8. Vá para **Projetos** → crie um projeto → dentro do projeto edite **Geral**, **Atividades**, **Cronograma**, **Locais**. A aba **Financeiro** só aparece para **admin**.

## Importante de segurança
- O **Financeiro** fica inacessível para não-admins pelas **Regras do Firestore** (servidas no backend do Firebase). Mesmo que alguém inspeccione o código do site, o backend bloqueará a leitura/escrita.
- Controle quem pode criar conta: você pode **desabilitar cadastro público** e criar usuários manualmente no Console (Authentication → Usuários).

## Estrutura de dados (Firestore)
- `users/{uid} → { email, role }`
- `projects/{projectId} → { name, client, desc, ownerUid, createdAt }`
  - `activities/{doc}` → { title, owner, date, desc, createdAt }
  - `schedule/{doc}` → { milestone, start, end, createdAt }
  - `locations/{doc}` → { name, address, createdAt }
  - `finance/{doc}` → { kind: "budget" | "expense", desc, value, createdAt }  (Somente admin)

## Cores do tema
Definidas em `styles.css` via CSS variables. Para mudar, altere `--petroleo`, `--preto`, `--cinza`.
