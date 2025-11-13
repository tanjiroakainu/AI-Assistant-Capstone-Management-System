# 🚀 Deployment Steps - Capstone Management System

## ✅ Step 1: Create GitHub Personal Access Token (DO THIS FIRST!)

### Visual Guide:

1. **Open this link in your browser:**
   ```
   https://github.com/settings/tokens
   ```

2. **Click the green button:**
   - "Generate new token" → "Generate new token (classic)"

3. **Fill in the form:**
   ```
   Note: Capstone Management System
   Expiration: 90 days (or your choice)
   
   ✅ Check this box:
   [x] repo (Full control of private repositories)
   ```

4. **Scroll down and click:**
   - "Generate token" (green button at bottom)

5. **COPY THE TOKEN IMMEDIATELY!**
   - It looks like: `ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`
   - ⚠️ You can only see it once!

---

## ✅ Step 2: Configure Git (One-time setup)

Open your terminal in the project folder and run:

```bash
# Set your name
git config --global user.name "tanjiroakainu"

# Set your email (use your GitHub email)
git config --global user.email "your-github-email@example.com"
```

---

## ✅ Step 3: Push to GitHub

Run this command in your terminal:

```bash
git push -u origin main
```

**When prompted:**
- **Username:** `tanjiroakainu`
- **Password:** Paste your Personal Access Token (the `ghp_xxxxx` token you copied)

---

## ✅ Step 4: Deploy to Vercel

After your code is on GitHub:

1. Go to: https://vercel.com
2. Sign in with GitHub
3. Click "Add New..." → "Project"
4. Find your repository: `AI-Assistant-Capstone-Management-System`
5. Click "Import"
6. Vercel will auto-detect Vite and use `vercel.json`
7. Click "Deploy"

**That's it!** Your app will be live in minutes! 🎉

---

## 🔗 Quick Links:

- **Create Token:** https://github.com/settings/tokens
- **Your Repo:** https://github.com/tanjiroakainu/AI-Assistant-Capstone-Management-System
- **Vercel:** https://vercel.com

---

## 📝 Current Status:

✅ Git repository initialized  
✅ All files committed  
✅ Remote repository configured  
✅ vercel.json ready for deployment  
⏳ **Waiting for:** GitHub token creation and push

