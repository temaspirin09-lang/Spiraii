create extension if not exists "uuid-ossp";

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  provider text not null default 'google',
  name text,
  grade text,
  subjects text[] default '{}',
  goal text,
  intensity text,
  onboarding_completed boolean default false,
  xp integer default 0,
  level integer default 1,
  streak_current integer default 0,
  streak_best integer default 0,
  streak_freezes_available integer default 2,
  last_active_date date,
  subscription_status text default 'free',
  subscription_expires_at timestamptz,
  ai_tone text default 'balanced',
  language text default 'ru',
  created_at timestamptz default now()
);

create table if not exists public.subjects_catalog (
  id text primary key,
  name text not null,
  icon text,
  color_accent text
);

create table if not exists public.topics (
  id uuid primary key default uuid_generate_v4(),
  subject_id text references public.subjects_catalog(id),
  name text not null,
  section text,
  difficulty text,
  grade_hint text,
  prerequisite_topic_id uuid references public.topics(id)
);

create table if not exists public.user_topic_progress (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references public.profiles(id) on delete cascade,
  topic_id uuid references public.topics(id),
  mastery_percent integer default 0,
  status text default 'not_started',
  last_practiced_at timestamptz,
  unique (user_id, topic_id)
);

create table if not exists public.tasks (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references public.profiles(id) on delete cascade,
  subject_id text,
  topic_id uuid references public.topics(id),
  input_type text,
  recognized_text text,
  confidence numeric,
  task_type text,
  created_at timestamptz default now()
);

create table if not exists public.chat_messages (
  id uuid primary key default uuid_generate_v4(),
  task_id uuid references public.tasks(id) on delete cascade,
  user_id uuid references public.profiles(id) on delete cascade,
  role text not null,
  mode text,
  content text not null,
  created_at timestamptz default now()
);

create table if not exists public.error_patterns (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references public.profiles(id) on delete cascade,
  skill_tag text not null,
  subject_id text,
  occurrences integer default 1,
  last_seen_at timestamptz default now(),
  resolved boolean default false
);

create table if not exists public.personal_plan (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references public.profiles(id) on delete cascade,
  day_number integer not null,
  topic_id uuid references public.topics(id),
  status text default 'pending',
  scheduled_date date,
  created_at timestamptz default now()
);

create table if not exists public.achievements (
  id text primary key,
  name text not null,
  description text,
  icon text
);

create table if not exists public.user_achievements (
  user_id uuid references public.profiles(id) on delete cascade,
  achievement_id text references public.achievements(id),
  earned_at timestamptz default now(),
  primary key (user_id, achievement_id)
);

create table if not exists public.payments (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references public.profiles(id) on delete cascade,
  yookassa_payment_id text,
  amount_rub numeric,
  plan text,
  status text default 'pending',
  payment_method_id text,
  created_at timestamptz default now()
);

alter table public.profiles enable row level security;
alter table public.user_topic_progress enable row level security;
alter table public.tasks enable row level security;
alter table public.chat_messages enable row level security;
alter table public.error_patterns enable row level security;
alter table public.personal_plan enable row level security;
alter table public.user_achievements enable row level security;
alter table public.payments enable row level security;

create policy "own profile" on public.profiles for all using (auth.uid() = id) with check (auth.uid() = id);
create policy "own progress" on public.user_topic_progress for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "own tasks" on public.tasks for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "own messages" on public.chat_messages for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "own errors" on public.error_patterns for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "own plan" on public.personal_plan for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "own achievements" on public.user_achievements for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "own payments" on public.payments for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

insert into public.subjects_catalog (id, name, icon, color_accent) values
  ('math', 'Математика', 'sigma', '#5B5BFF'),
  ('physics', 'Физика', 'atom', '#5B5BFF'),
  ('chemistry', 'Химия', 'flask', '#5B5BFF'),
  ('biology', 'Биология', 'leaf', '#5B5BFF'),
  ('geography', 'География', 'globe', '#5B5BFF'),
  ('history', 'История', 'scroll', '#5B5BFF'),
  ('social_studies', 'Обществознание', 'balance', '#5B5BFF'),
  ('russian', 'Русский язык', 'pen', '#5B5BFF'),
  ('literature', 'Литература', 'book', '#5B5BFF'),
  ('english', 'Английский язык', 'languages', '#5B5BFF'),
  ('cs', 'Информатика', 'code', '#5B5BFF')
on conflict (id) do nothing;
