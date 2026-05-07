/* ============================================================
   auth.example.js — MODELO de configuração do Supabase

   Copie este arquivo para auth.js e preencha suas credenciais:
   Supabase > Project Settings > API

   auth.js está no .gitignore e NUNCA deve ser commitado.
   ============================================================ */

const SUPABASE_URL      = 'https://SEU-PROJETO.supabase.co';
const SUPABASE_ANON_KEY = 'SUA_ANON_KEY_AQUI';

const db = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

/* Detecta se está dentro da pasta /jogos/ para ajustar caminhos */
const _inJogos = window.location.pathname.replace(/\\/g, '/').includes('/jogos/');
const _base    = _inJogos ? '../' : '';

/* ── Usuário ─────────────────────────────────────────────── */

async function getUser() {
  const { data: { user } } = await db.auth.getUser();
  return user;
}

async function getProfile(userId) {
  const { data } = await db
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();
  return data;
}

/* Redireciona para login se não autenticado. Retorna { user, profile } */
async function requireAuth() {
  const user = await getUser();
  if (!user) {
    window.location.href = _base + 'login.html';
    return null;
  }
  const profile = await getProfile(user.id);
  return { user, profile };
}

/* ── Autenticação ────────────────────────────────────────── */

async function signInEmail(email, password) {
  return db.auth.signInWithPassword({ email, password });
}

async function signUpEmail(email, password, nome) {
  return db.auth.signUp({
    email,
    password,
    options: { data: { nome } }
  });
}

async function signInGoogle() {
  return db.auth.signInWithOAuth({
    provider: 'google',
    options: { redirectTo: window.location.origin + '/dashboard.html' }
  });
}

async function signOut() {
  await db.auth.signOut();
  window.location.href = _base + 'login.html';
}

/* ── Perfil ──────────────────────────────────────────────── */

async function updateProfile(userId, fields) {
  return db.from('profiles').update(fields).eq('id', userId);
}

async function updatePassword(newPassword) {
  return db.auth.updateUser({ password: newPassword });
}

async function updateEmail(newEmail) {
  return db.auth.updateUser({ email: newEmail });
}

async function deleteAccount() {
  await db.auth.signOut();
  window.location.href = _base + 'index.html';
}

/* ── Pontuações ──────────────────────────────────────────── */

async function saveScore(jogo, pontuacao, estrelas) {
  const user = await getUser();
  if (!user) return false;
  const { error } = await db.from('game_scores').insert({
    user_id: user.id,
    jogo,
    pontuacao,
    estrelas: Math.min(3, Math.max(0, estrelas || 0))
  });
  return !error;
}

async function getBestScore(jogo) {
  const user = await getUser();
  if (!user) return null;
  const { data } = await db
    .from('game_scores')
    .select('pontuacao, estrelas')
    .eq('user_id', user.id)
    .eq('jogo', jogo)
    .order('pontuacao', { ascending: false })
    .limit(1)
    .single();
  return data;
}

async function getAllScores() {
  const user = await getUser();
  if (!user) return [];
  const { data } = await db
    .from('game_scores')
    .select('jogo, pontuacao, estrelas, played_at')
    .eq('user_id', user.id)
    .order('played_at', { ascending: false });
  return data || [];
}
