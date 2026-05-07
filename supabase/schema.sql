-- ============================================================
-- EducaPlay — Schema Supabase
-- Cole este SQL no painel: Supabase > SQL Editor > New Query
-- ============================================================

-- 1. Tabela de perfis (estende auth.users)
create table if not exists profiles (
  id        uuid references auth.users(id) on delete cascade primary key,
  nome      text not null,
  avatar    text default '👦',
  ano_escolar text default '3º ano',
  created_at timestamptz default now()
);

-- 2. Tabela de pontuações por jogo
create table if not exists game_scores (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid references auth.users(id) on delete cascade not null,
  jogo       text not null,
  pontuacao  integer not null,
  estrelas   integer default 0 check (estrelas between 0 and 3),
  played_at  timestamptz default now()
);

-- 3. Row Level Security
alter table profiles    enable row level security;
alter table game_scores enable row level security;

-- Políticas: cada usuário só vê/edita os próprios dados
create policy "profiles: leitura própria"  on profiles for select using (auth.uid() = id);
create policy "profiles: edição própria"   on profiles for update using (auth.uid() = id);
create policy "profiles: inserção própria" on profiles for insert with check (auth.uid() = id);

create policy "scores: leitura própria"  on game_scores for select using (auth.uid() = user_id);
create policy "scores: inserção própria" on game_scores for insert with check (auth.uid() = user_id);

-- 4. Trigger: cria perfil automaticamente ao cadastrar
create or replace function handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into profiles (id, nome)
  values (
    new.id,
    coalesce(
      new.raw_user_meta_data->>'nome',
      new.raw_user_meta_data->>'full_name',
      split_part(new.email, '@', 1)
    )
  );
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();
