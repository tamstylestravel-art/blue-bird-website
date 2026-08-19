# Rule: No Hardcoded Secrets
ห้ามฝัง (Hardcode) ข้อมูลความลับใดๆ ลงในซอร์สโค้ดโดยเด็ดขาด 

**ข้อมูลความลับที่ห้าม Hardcode รวมถึง (แต่ไม่จำกัดเพียง):**
- รหัสผ่าน (Passwords) หรือ รหัสผ่านฐานข้อมูล (Database Credentials)
- API Keys, Access Tokens, หรือ Secret Keys ต่างๆ
- ข้อมูลที่ใช้สำหรับการยืนยันตัวตน หรือข้อมูลเซิร์ฟเวอร์ที่สำคัญ

**แนวทางปฏิบัติที่ต้องทำ:**
- ให้เขียนโค้ดเพื่อดึงค่าความลับเหล่านี้จาก Environment Variables แทนเสมอ (เช่น ใช้ `process.env.API_KEY` ใน Node.js หรือ `os.environ.get('API_KEY')` ใน Python)
- หากจำเป็นต้องเพิ่มค่า Environment Variable ใหม่ ให้แนะนำผู้ใช้ให้เพิ่มลงในไฟล์ `.env` แต่ห้ามบันทึกไฟล์ `.env` ที่มีข้อมูลความลับจริงขึ้นระบบ Version Control (เช่น Git) เด็ดขาด
