# LeadPulse AI

MVP SaaS de prospecção e qualificação de leads com Next.js App Router, Supabase, Tailwind CSS e IA BYOK.

## Rodando localmente

1. Instale as dependências: `npm install`
2. Copie `.env.example` para `.env.local` e preencha as credenciais públicas do Supabase.
3. Execute [`supabase/schema.sql`](./supabase/schema.sql) no SQL Editor do projeto Supabase.
4. Inicie: `npm run dev`

Sem as variáveis do Supabase, a interface abre em modo de demonstração para avaliação visual. Persistência, autenticação e APIs externas exigem a configuração real.

## Deploy na Netlify

Em **Project configuration > Environment variables**, adicione para todos os contextos:

```env
NEXT_PUBLIC_SUPABASE_URL=https://SEU-PROJETO.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_ou_anon_key
```

Use apenas a chave pública `Publishable`/`anon`, nunca `service_role`. Como variáveis `NEXT_PUBLIC_*` são incorporadas durante o build, faça um novo deploy depois de salvá-las. No Supabase, configure o domínio de produção em **Authentication > URL Configuration**.

## Segurança BYOK

As chaves ficam em `user_integrations`, protegidas por RLS com `auth.uid() = user_id`. Elas são lidas somente nas Route Handlers do servidor; respostas ao cliente retornam apenas versões mascaradas. Em produção com requisitos de compliance, recomenda-se adicionar Supabase Vault ou criptografia de aplicação com KMS.

## Estrutura principal

```text
app/
  (app)/dashboard, extrator, pipeline, leads/[id], configuracoes/integracoes
  api/extract, qualify, leads, integrations
  auth/
components/        # UI, shell, formulários e Kanban
lib/supabase/      # clientes SSR e browser
supabase/schema.sql
types/database.ts
```
