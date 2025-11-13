# GitHub Personal Access Token Guide

## Step 1: Create GitHub Personal Access Token

### Instructions:

1. **Go to GitHub Settings:**
   - Visit: https://github.com/settings/tokens
   - Or navigate: GitHub Profile → Settings → Developer settings → Personal access tokens → Tokens (classic)

2. **Click "Generate new token" → "Generate new token (classic)"**

3. **Configure the token:**
   - **Note:** Give it a name like "Capstone Management System"
   - **Expiration:** Choose your preferred expiration (90 days, 1 year, or no expiration)
   - **Select scopes:** Check these boxes:
     - ✅ `repo` (Full control of private repositories)
       - This includes: repo:status, repo_deployment, public_repo, repo:invite, security_events

4. **Click "Generate token"** at the bottom

5. **Copy the token immediately** (you won't see it again!)
   - It will look like: `ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`

6. **Save the token securely** - You'll need it to push your code

---

## Step 2: Push to GitHub

After creating your token, run these commands in your terminal:

```bash
# Set your GitHub username (replace with your actual username)
git config --global user.name "tanjiroakainu"

# Set your email (replace with your GitHub email)
git config --global user.email "your-email@example.com"

# Push to GitHub (you'll be prompted for password - use the token as password)
git push -u origin main
```

**Important:** When prompted for password, paste your Personal Access Token (not your GitHub password)

---

## Alternative: Using Token in URL (One-time setup)

If you prefer, you can add the token directly to the remote URL:

```bash
# Replace YOUR_TOKEN with your actual token
git remote set-url origin https://YOUR_TOKEN@github.com/tanjiroakainu/AI-Assistant-Capstone-Management-System.git

# Then push
git push -u origin main
```

---

## Quick Links:

- **Create Token:** https://github.com/settings/tokens
- **Your Repository:** https://github.com/tanjiroakainu/AI-Assistant-Capstone-Management-System

---

## After Pushing to GitHub:

Once your code is on GitHub, you can deploy to Vercel:

1. Go to https://vercel.com
2. Click "New Project"
3. Import your GitHub repository
4. Vercel will auto-detect the Vite framework
5. Click "Deploy"

The `vercel.json` file is already configured, so deployment will be automatic!

