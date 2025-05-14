This is a [Next.js](https://nextjs.org/) project bootstrapped with [`c3`](https://developers.cloudflare.com/pages/get-started/c3).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Cloudflare integration

Besides the `dev` script mentioned above `c3` has added a few extra scripts that allow you to integrate the application with the [Cloudflare Pages](https://pages.cloudflare.com/) environment, these are:
  - `pages:build` to build the application for Pages using the [`@cloudflare/next-on-pages`](https://github.com/cloudflare/next-on-pages) CLI
  - `preview` to locally preview your Pages application using the [Wrangler](https://developers.cloudflare.com/workers/wrangler/) CLI
  - `deploy` to deploy your Pages application using the [Wrangler](https://developers.cloudflare.com/workers/wrangler/) CLI

> __Note:__ while the `dev` script is optimal for local development you should preview your Pages application as well (periodically or before deployments) in order to make sure that it can properly work in the Pages environment (for more details see the [`@cloudflare/next-on-pages` recommended workflow](https://github.com/cloudflare/next-on-pages/blob/main/internal-packages/next-dev/README.md#recommended-development-workflow))

### Bindings

Cloudflare [Bindings](https://developers.cloudflare.com/pages/functions/bindings/) are what allows you to interact with resources available in the Cloudflare Platform.

You can use bindings during development, when previewing locally your application and of course in the deployed application:

- To use bindings in dev mode you need to define them in the `next.config.js` file under `setupDevBindings`, this mode uses the `next-dev` `@cloudflare/next-on-pages` submodule. For more details see its [documentation](https://github.com/cloudflare/next-on-pages/blob/05b6256/internal-packages/next-dev/README.md).

- To use bindings in the preview mode you need to add them to the `pages:preview` script accordingly to the `wrangler pages dev` command. For more details see its [documentation](https://developers.cloudflare.com/workers/wrangler/commands/#dev-1) or the [Pages Bindings documentation](https://developers.cloudflare.com/pages/functions/bindings/).

- To use bindings in the deployed application you will need to configure them in the Cloudflare [dashboard](https://dash.cloudflare.com/). For more details see the  [Pages Bindings documentation](https://developers.cloudflare.com/pages/functions/bindings/).

#### KV Example

`c3` has added for you an example showing how you can use a KV binding.

In order to enable the example:
- Search for javascript/typescript lines containing the following comment:
  ```ts
  // KV Example:
  ```
  and uncomment the commented lines below it (also uncomment the relevant imports).
- In the `wrangler.jsonc` file add the following configuration line:
  ```
  "kv_namespaces": [{ "binding": "MY_KV_NAMESPACE", "id": "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx" }],
  ```
- If you're using TypeScript run the `cf-typegen` script to update the `env.d.ts` file:
  ```bash
  npm run cf-typegen
  # or
  yarn cf-typegen
  # or
  pnpm cf-typegen
  # or
  bun cf-typegen
  ```

After doing this you can run the `dev` or `preview` script and visit the `/api/hello` route to see the example in action.

Finally, if you also want to see the example work in the deployed application make sure to add a `MY_KV_NAMESPACE` binding to your Pages application in its [dashboard kv bindings settings section](https://dash.cloudflare.com/?to=/:account/pages/view/:pages-project/settings/functions#kv_namespace_bindings_section). After having configured it make sure to re-deploy your application.

```
bash: /Users/shaswatraj/.bash_profile: line 3: unexpected EOF while looking for matching `"'
bash: /Users/shaswatraj/.bash_profile: line 4: syntax error: unexpected end of file
npx wrangler d1 create nextjs-d1-db

The default interactive shell is now zsh.
To update your account to use zsh, please run `chsh -s /bin/zsh`.
For more details, please visit https://support.apple.com/kb/HT208050.
Sh:nextjs-d1-pages shaswatraj$ npx wrangler d1 create nextjs-d1-db

 ⛅️ wrangler 4.14.4
-------------------

✅ Successfully created DB 'nextjs-d1-db' in region APAC
Created your new D1 database.

{
  "d1_databases": [
    {
      "binding": "DB",
      "database_name": "nextjs-d1-db",
      "database_id": "4ebfb826-3757-4e0d-90f7-41797196977d"
    }
  ]
}
Sh:nextjs-d1-pages shaswatraj$ 
Sh:nextjs-d1-pages shaswatraj$ npx wrangler types --env-interface CloudflareEnv ./env.d.ts

 ⛅️ wrangler 4.14.4
-------------------

Generating project types...

declare namespace Cloudflare {
        interface Env {
                DB: D1Database;
        }
}
interface CloudflareEnv extends Cloudflare.Env {}

Generating runtime types...

Runtime types generated.

────────────────────────────────────────────────────────────
✨ Types written to ./env.d.ts

📖 Read about runtime types
https://developers.cloudflare.com/workers/languages/typescript/#generate-types
📣 Remember to rerun 'wrangler types' after you change your wrangler.json file.

Sh:nextjs-d1-pages shaswatraj$ 
Sh:nextjs-d1-pages shaswatraj$ npx wrangler d1 execute nextjs-d1-db --local --file=./schema.sql

 ⛅️ wrangler 4.14.4
-------------------

🌀 Executing on local database nextjs-d1-db (4ebfb826-3757-4e0d-90f7-41797196977d) from .wrangler/state/v3/d1:
🌀 To execute on your remote database, add a --remote flag to your wrangler command.
🚣 6 commands executed successfully.
Sh:nextjs-d1-pages shaswatraj$ 
Sh:nextjs-d1-pages shaswatraj$ npx wrangler d1 execute nextjs-d1-db --remote --file=./schema.sql

 ⛅️ wrangler 4.14.4
-------------------

✔ ⚠️ This process may take some time, during which your D1 database will be unavailable to serve queries.
  Ok to proceed? … yes
🌀 Executing on remote database nextjs-d1-db (4ebfb826-3757-4e0d-90f7-41797196977d):
🌀 To execute on your local development database, remove the --remote flag from your wrangler command.
Note: if the execution fails to complete, your DB will return to its original state and you can safely retry.
├ 🌀 Uploading 4ebfb826-3757-4e0d-90f7-41797196977d.fe976ea40fd51a62
.sql
│ 🌀 Uploading complete.
│
🌀 Starting import...
🌀 Processed 6 queries.
🚣 Executed 6 queries in 0.00 seconds (9 rows read, 19 rows written)
   Database is currently at bookmark 00000000-0000000c-00004efe-e7259cab0dd3b4fefb15295a05b10d96.
┌────────────────────────┬───────────┬──────────────┬────────────────────┐
│ Total queries executed │ Rows read │ Rows written │ Database size (MB) │
├────────────────────────┼───────────┼──────────────┼────────────────────┤
│ 6                      │ 9         │ 19           │ 0.03               │
└────────────────────────┴───────────┴──────────────┴────────────────────┘
Sh:nextjs-d1-pages shaswatraj$ 
Sh:nextjs-d1-pages shaswatraj$ 
Sh:nextjs-d1-pages shaswatraj$ 
Sh:nextjs-d1-pages shaswatraj$ 
Sh:nextjs-d1-pages shaswatraj$ 
Sh:nextjs-d1-pages shaswatraj$ 
```