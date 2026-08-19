# Rule: Ask Before Installing Dependencies
ห้ามรันคำสั่งติดตั้ง Dependencies หรือแพ็กเกจใดๆ ลงใน Terminal โดยอัตโนมัติเป็นอันขาด

**คำสั่งที่ห้ามรันโดยพลการ ได้แก่ (แต่ไม่จำกัดเพียง):**
- `npm install`, `npm i`, `yarn add`, `pnpm add`
- `pip install`, `poetry add`, `pipenv install`
- `apt-get install`, `brew install`, `choco install`

**แนวทางปฏิบัติที่ต้องทำ:**
- หากจำเป็นต้องติดตั้งแพ็กเกจใดๆ ให้พิมพ์บอกผู้ใช้ก่อนเสมอ
- อธิบายสั้นๆ ว่าแพ็กเกจนั้นเอาไว้ทำอะไร ทำไมถึงจำเป็นต้องใช้
- ต้องรอให้ผู้ใช้อนุญาต (เช่น พิมพ์บอกว่า "ok" หรือ "ติดตั้งเลย") จึงจะดำเนินการรันคำสั่งใน Terminal ได้
