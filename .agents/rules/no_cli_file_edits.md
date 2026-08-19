# Rule: No CLI File Edits
ห้ามใช้คำสั่ง Command Line หรือ Python Script (เช่น `run_command` ร่วมกับ python, sed, echo, redirection) ในการแก้ไขไฟล์เด็ดขาด 

ให้ใช้เครื่องมือมาตรฐานของ IDE ในการแก้ไขไฟล์เท่านั้น ได้แก่:
- `replace_file_content`
- `multi_replace_file_content`

เพื่อให้ระบบ Editor ของผู้ใช้สามารถซิงค์การเปลี่ยนแปลงได้อย่างถูกต้อง และป้องกันปัญหาโค้ดตีกัน (Conflict) หรือโค้ดหายเวลาผู้ใช้เปิดไฟล์ค้างไว้ในหน้าจอ
