import os

with open('src/components/dashboard/AuthGuard.tsx', 'r', encoding='utf-8') as f:
    js = f.read()

old_code = "router.replace(\"/login\");"
new_code = "router.replace(/login);"

js = js.replace(old_code, new_code)

with open('src/components/dashboard/AuthGuard.tsx', 'w', encoding='utf-8') as f:
    f.write(js)
