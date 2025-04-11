# 🌟 Child Activity Tracker

A simple, fun, and effective web app for tracking children's daily activities — built using **Next.js**, **TailwindCSS**, and localStorage for offline-first usage. Designed for parents or guardians to help motivate children with structured and visual progress.

---

## 📌 Features

- 🧒 Multiple children can be tracked individually
- 📝 Personalized activity lists for each child
- ✅ Check-off system to mark completed activities
- 🌸 Beautiful child-friendly UI with soft colors
- 🧠 LocalStorage used instead of Firebase or external databases
- 🚀 Fully responsive for mobile and desktop
- 🔒 No sign-in required — data is stored in browser

---

## 📁 Project Structure

/app /[child] editactivitypage.tsx # Page for editing activities for a child mainpage.tsx # List of children and navigation page.tsx # Landing page with background image & Start button

/public/asset front-page.jpeg # Main landing image

/utils ListDatabase.ts # LocalStorage handler for activity data


---

## 🛠️ Tech Stack

- [Next.js 14](https://nextjs.org/)
- [React 18](https://reactjs.org/)
- [TailwindCSS](https://tailwindcss.com/)
- [Shadcn-UI](https://ui.shadcn.com/) (planned or partially used)
- **No Firebase** — uses `localStorage` to keep things simple and free

---

## 🚧 Planned Enhancements

- [ ] Add calendar or streak tracker
- [ ] Add PWA support (offline-first experience)
- [ ] Export progress report or screenshots

---

## 📦 Installation & Usage

```bash
git clone https://github.com/your-username/child-activity-tracker.git
cd child-activity-tracker
npm install
npm run dev

Open http://localhost:3000 in your browser.

---

🙌 Acknowledgments

Inspired by parents who want to gently guide children with routines and activity-based learning.
Made with ❤️ using Next.js & TailwindCSS.