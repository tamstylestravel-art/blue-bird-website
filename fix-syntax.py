import os

# Fix AuthGuard.tsx
with open('src/components/dashboard/AuthGuard.tsx', 'r', encoding='utf-8') as f:
    js = f.read()
js = js.replace('router.replace(/login);', 'router.replace(`/login${window.location.search}`);')
with open('src/components/dashboard/AuthGuard.tsx', 'w', encoding='utf-8') as f:
    f.write(js)

# Fix LoginForm.tsx
with open('src/app/[locale]/login/LoginForm.tsx', 'r', encoding='utf-8') as f:
    js = f.read()
js = js.replace('router.push(/dashboard);', 'router.push(`/dashboard${window.location.search}`);')
with open('src/app/[locale]/login/LoginForm.tsx', 'w', encoding='utf-8') as f:
    f.write(js)

# Fix DashboardOverview.tsx
with open('src/app/[locale]/dashboard/DashboardOverview.tsx', 'r', encoding='utf-8') as f:
    js = f.read()
js = js.replace('fetch(http://localhost:/callback?idToken=)', 'fetch(`http://localhost:${appPort}/callback?idToken=${token}`)')
with open('src/app/[locale]/dashboard/DashboardOverview.tsx', 'w', encoding='utf-8') as f:
    f.write(js)
