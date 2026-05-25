# Auto-update your Netlify site when you change code

**Drag-and-drop does not auto-deploy.** Netlify only rebuilds automatically when the site is connected to **Git** (GitHub, GitLab, or Bitbucket).

After setup: edit files → **save** → **commit** → **push** → Netlify updates your live site in ~30–60 seconds.

---

## One-time setup

### 1. Create a GitHub repository

1. Go to [github.com/new](https://github.com/new)
2. Name it e.g. `still-website` (public or private)
3. **Do not** add README, .gitignore, or license (you already have a project)
4. Click **Create repository**
5. Copy the repo URL, e.g. `https://github.com/YOUR_USERNAME/still-website.git`

### 2. Push this folder to GitHub

Open PowerShell in `c:\STILL-website` and run (replace `YOUR_USERNAME` and repo name):

```powershell
cd c:\STILL-website

git add .
git commit -m "Add category landing and shop pages"

git remote add origin https://github.com/YOUR_USERNAME/still-website.git
git branch -M main
git push -u origin main
```

If Git asks you to sign in, use GitHub’s browser login or a [Personal Access Token](https://github.com/settings/tokens) as the password.

### 3. Connect Netlify to GitHub

1. Open [app.netlify.com](https://app.netlify.com) → your **STILL** site
2. **Site configuration** → **Build & deploy** → **Link repository** (or **Configure** next to Continuous deployment)
3. Choose **GitHub** → authorize Netlify → select your `still-website` repo
4. Build settings (must match this static site):

   | Setting | Value |
   |---------|--------|
   | Branch to deploy | `main` |
   | Build command | `echo Static site` *(or leave empty)* |
   | Publish directory | `.` |

5. Click **Deploy site**

Your existing domain and site stay the same; Netlify just starts building from Git instead of manual uploads.

---

## Every day (after setup)

```powershell
cd c:\STILL-website
git add .
git commit -m "Describe what you changed"
git push
```

Check **Deploys** in Netlify — when the latest deploy shows **Published**, the live site is updated.

---

## If you already used drag-and-drop on the same site

You do **not** need a new Netlify site. Use **Link repository** on the same site. The next Git deploy replaces the old manual deploy.

---

## Optional: deploy from Cursor terminal without remembering commands

After Git is connected, pushing is enough. You can also use the existing CLI script for a manual deploy anytime:

```powershell
powershell -ExecutionPolicy Bypass -File .\deploy-netlify-cli.ps1
```

That is only needed if you are **not** using Git, or you want to deploy before pushing.
