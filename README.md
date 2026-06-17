# Vessel — setup guide

A companion app whose "brain" runs on 0G's decentralized AI network instead of a normal company server. This guide gets it live on the internet, step by step, all doable from your phone.

## What's in this folder

- `index.html` — the whole app: the glowing companion, the name/personality setup, the chat screen. Open this file in a text editor if you want to change colors, fonts, or wording — they're all near the top in one place.
- `api/chat.js` — the one piece of "backend." It quietly forwards your chat messages to 0G's network and sends the reply back. You never have to touch this unless you want to change which AI model it uses.
- `package.json` — a small file Vercel needs to recognize the project. Leave it as is.

## Step 1 — Get a 0G Compute key

1. On your phone, go to **pc.0g.ai**
2. Sign in with Google or X (this gives you a wallet automatically — no app to install)
3. Find the faucet/testnet token option and claim some free 0G test tokens
4. Deposit a small amount into the Router (this is what pays for each AI reply)
5. Go to **Dashboard → API Keys**, create a new key with the **inference** permission
6. Copy the key — it starts with `sk-`. Save it somewhere safe; it's only shown once.

## Step 2 — Put the code on GitHub

1. Go to **github.com** and create a new repository (name it something like `vessel`)
2. Open the repo, tap **Add file → Upload files**
3. Upload `index.html`, `package.json`, and the whole `api` folder (keep `chat.js` inside a folder named `api`)
4. Commit the upload

## Step 3 — Deploy on Vercel

1. Go to **vercel.com**, log in, tap **Add New → Project**
2. Import the `vessel` repo you just created
3. Before deploying, open **Environment Variables** and add one:
   - Name: `ZG_ROUTER_API_KEY`
   - Value: the `sk-...` key from Step 1
4. Tap **Deploy**

That's it — Vercel gives you a live link. Open it, type a name for your companion, pick a temperament, and tap **Awaken**.

## If something doesn't reply

- Double-check the environment variable name is exactly `ZG_ROUTER_API_KEY` and redeploy after adding it (Vercel only picks up new variables on a fresh deploy)
- Check your balance hasn't run out at pc.0g.ai and top up a little more testnet 0G
- The model used by default is `zai-org/GLM-5-FP8`. If that ever goes offline, change it by adding another environment variable named `ZG_MODEL` with a different model name from the catalog at docs.0g.ai

## What to build next (for later rounds)

The judges are explicitly told the contest rewards real use of 0G's stack, not just "AI" in the name. Right now Vessel proves the **Compute** piece. Two strong next moves, in order of effort:

1. **Memory that survives a refresh** — store each companion's name, personality, and conversation history on **0G Storage** instead of just in the browser tab. This is the single most convincing upgrade for judges, because right now the companion forgets everything on reload.
2. **True ownership** — mint each companion as an **Intelligent NFT (ERC-7857)**, so the personality and memory live on-chain with the token, not on this website. This is the headline "why 0G and not just any chatbot" story for the pitch video.

Both are real, documented 0G features — worth saying that explicitly in the submission, even before they're built, so judges see the direction.
