1. สร้างโปรเจค Care Team

อ่านฟีเจอร์ที่เขียนไว้ที่ 
/Users/marosdeeuma/care-team-nextjs/prompt/FEATURE.md

โดยทุกครั้งที่สร้าง page.tsx ต้องทำตาม rule ที่เขียนไว้ที่ /Users/marosdeeuma/care-team-nextjs/prompt/CREATE_PAGE_PATTERN.md

ออกแบบ Master Data และ Static data สำหรับโปรเจค (Static data จะเรียกใช้ผ่าน Repo)

ตามหลัก SOLID Clean

2. เริ่มพัฒนาโปรเจคอันดับแรกเลย ต้องสร้างหน้า MainLayout พร้อม Header Footer และใส่ Theme Toggle เพื่อทำ dark mode

MainLayout ต้องให้ออกแบบอารมณ์ ตามภาพนี้ /Users/marosdeeuma/care-team-nextjs/prompt/Screenshot 2569-03-13 at 11.55.35.png

ให้ใช้ tailwindcss สำหรับทำ style ที่ /Users/marosdeeuma/care-team-nextjs/public/styles/index.css

ใช้ font Noto_Sans_Thai จาก  'next/font/google'

3. ออกแบบ Reuse Component ของ MainLayout

ตกแหน่ง component ด้วย animation ด้วย react-spring เช่น ทำ component แบบ สามารถ interact ด้วย mouse hover หรือ mouse click (ห้ามใช้ useTrail)

4. จากนั้นสร้างหน้าแรก ให้สวยงาม

5. สร้างหน้าอื่นๆให้ครบ

6. อ่าน /Users/marosdeeuma/care-team-nextjs/prompt/COMPANY.md

แล้วทำหน้า ลงทะเบียน

โดยใช้ db ด้วย turso + drizzle orm สำหรับทำแบบฟอร์มลงทะเบียนด้วยคับ

โดยต้องออกแบบ โครงสร้างโค้ดนการจัดการ database ด้วย turso ให้เหมือนโปรเจค /Users/marosdeeuma/social-poster-nextjs

key สำหรับเชื่อมต่อ turso ผมจะใส่ทีหลัง ถ้าไม่มี key ให้ fallback ไป sqlite แทน
