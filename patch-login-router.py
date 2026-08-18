import os

with open('src/app/[locale]/login/LoginForm.tsx', 'r', encoding='utf-8') as f:
    js = f.read()

js = js.replace('router.push("/dashboard");', 'router.push(/dashboard);')

with open('src/app/[locale]/login/LoginForm.tsx', 'w', encoding='utf-8') as f:
    f.write(js)
