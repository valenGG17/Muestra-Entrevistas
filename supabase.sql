-- Ejecutar en Supabase > SQL Editor > New query > Run
create table if not exists public.respuestas_quiz (
  id          bigint generated always as identity primary key,
  created_at  timestamptz not null default now(),
  curso       smallint    not null check (curso between 1 and 7),
  nivel       text        not null check (nivel in ('taller','carrera','practicas')),
  respuestas  jsonb       not null,
  comentario  text        not null check (char_length(comentario) between 3 and 600),
  nombre      text        check (char_length(nombre) <= 60)
);

alter table public.respuestas_quiz enable row level security;

-- Los alumnos (clave anon) solo pueden ENVIAR respuestas.
grant insert on public.respuestas_quiz to anon;
create policy "alumnos pueden enviar" on public.respuestas_quiz
  for insert to anon with check (true);

-- No hay política de lectura: desde la web nadie puede leer los mensajes.
-- Vos los ves en Supabase > Table Editor > respuestas_quiz.
