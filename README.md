<div align="center">
  <h1>🚀 OpenPages - The Complete Landing Page Pack</h1>
  <p><strong>A premium collection of fully-coded Next.js landing pages, dynamically sold through a highly customized storefront.</strong></p>
</div>

---

## 📖 Overview
**OpenPages** is a turnkey digital commerce platform built to sell a curated bundle of Next.js landing pages. Combining a modern frontend storefront with a robust automated deployment pipeline, OpenPages handles everything from the presentation of the digital goods to integrated checkout and secure bundle delivery.

Whether you're looking to launch your own products or study the architecture of a Next.js digital downloads platform, OpenPages provides a seamless end-to-end template.

---

## 🌟 Features
- **The "Complete Pack"**: Buyers get instant access to over 25+ unique, production-ready Next.js + Vanilla CSS landing pages.
- **Dynamic Storefront**: A sleek, high-conversion marketing site featuring animated UI, responsive components, and an automated presentation grid.
- **Dodo Payments Integration**: Seamlessly handles checkout processing, dynamically creating digital products via the Dodo Payments Node API and spawning secure checkout web sessions.
- **Automated Delivery**: Implements a dedicated verification routing (`/download`) that securely authenticates a buyer's checkout session and unlocks the downloadable ZIP bundle.
- **Agentic Pipeline (Background)**: Contains an active Next.js agent generation pipeline (powered by OpenClaw) creating code, deploying to Vercel, zipping bundles (`openpages-zipper`), and pushing the finished payload to GitHub.

---

## 🛠 Tech Stack
| Category | Technologies Used |
| :--- | :--- |
| **Framework** | Next.js 14, React |
| **Styling** | Vanilla CSS (Responsive, Modern Animations, Glassmorphism) |
| **Payments** | [Dodo Payments SDK](https://dodopayments.com/) |
| **Deployments** | Vercel (Storefront and Individual Landing Pages) |
| **Orchestration** | OpenClaw AI Agents (Site Generation & Zipline Bundling) |

---

## 🛍️ How the Storefront Works

1. **Browsing**: Users visit the root URL (`https://openpages.zetalabs.in`) and are greeted by a sleek modern UI showcasing the available landing pages via a responsive pagination grid.
2. **Checkout**: Clicking "Buy Now" queries our internal Next API Route (`/api/checkout`), strictly conforming to the Dodo Payments API to guarantee the "Complete Pack" product exists and then returning a hosted secure checkout link.
3. **Delivery**: Upon successful payment, Dodo redirects the user to the `/download` success page on our site where the ZIP bundle (continuously maintained by the `openpages-zipper` background agent) is instantly available.

---

## 🚀 Running the Storefront Locally

### 1. Prerequisites
Ensure you have the following installed:
- Node.js (v18+)
- npm or yarn
- A **Dodo Payments API Key** (Set your environment variable)

### 2. Installation
Navigate into the storefront and install dependencies:
```bash
cd storefront
npm install
```

### 3. Environment Config
Create a `.env` file in the root of the storefront directory:
```env
DODO_PAYMENTS_API_KEY=your_test_key_here
NODE_ENV=development
```

### 4. Run Development Server
```bash
npm run dev
```
Open **[http://localhost:3000](http://localhost:3000)** (or the port specified) in your browser. Navigating checkout will utilize the Dodo Test Mode as long as `NODE_ENV` is not `production`.

---

## 📦 For Buyers: Using Your Downloaded Pack
If you have purchased the Complete Pack:
1. Extract `sites-bundle.zip`.
2. Inside, you will find independent, distinct Next.js project directories (e.g. `site-1`, `site-2`).
3. Simply `cd` into your desired template folder.
4. Run `npm install`, followed by `npm run dev`.
5. Customize the text, deploy to Vercel, and launch your business!

---

<div align="center">
  <p>Built with 🩵 by the OpenPages AI Engineering Team.</p>
</div>
