
# WeAre – Professional Restaurant Operations Platform

![WeAre Dashboard](https://github.com/harleysederholm-alt/WeAre/raw/main/docs/assets/dashboard.png)

**WeAre** is an enterprise-grade Operations Support System (OSS) designed specifically for high-volume restaurant groups. It replaces fragmented spreadsheets and legacy back-office tools with a unified, event-sourced truth for Daily Logs, Tips, Inventory, Shifts, and Reporting.

**Version:** 0.4 (Feature Complete Beta)
**Live Demo:** [https://we-are-web-omega.vercel.app](https://we-are-web-omega.vercel.app)

---

## 🚀 Key Features

*   **Daily Journal (Päiväkirja):**
    *   Unified view of Sales, Tips, Vouchers, and Staff Shifts.
    *   **Automated Z-Report Import** triggers automatic accounting entries.
    *   **EOD Lock & PDF Generation:** Secure end-of-day commits with audit trails.

*   **Advanced Tips System:**
    *   **€20 Rule Enforcement:** Intelligent validation for cash payouts in multiples of 20€.
    *   **Full Settlement Mode:** Manager overrides for finalizing staff balances.
    *   **Transparent Pooling:** Algorithmically distributed tips based on verified hours.

*   **Inventory & Waste:**
    *   **Template-Based Counting:** Validates submissions against required items to prevent partial counts.
    *   **Purchase Order Integration:** Ingests email orders and updates theoretical stock automatically.
    *   **Waste Tracking:** Granular logging with reason codes (Spoilage, Drops, etc.).

*   **Enterprise Architecture:**
    *   **Event Sourcing (Ledger Truth):** Every action is an immutable event in the `EventEntity` table.
    *   **Role-Based Access Control (RBAC):** Strict separation between STAFF and MANAGER actions.
    *   **Multi-Tenancy:** Single instance supports multiple restaurant units securely.

---

## 🛠 Tech Stack

**Frontend:**
*   **Framework:** Next.js 15 (App Router, Turbopack)
*   **Language:** TypeScript
*   **Styling:** Tailwind CSS (Custom "White Glass" Theme)
*   **Grids:** AG Grid Enterprise (v35+)
*   **State:** React Context + SWR

**Backend:**
*   **Framework:** NestJS (Modular Monolith)
*   **Database:** PostgreSQL (with TypeORM)
*   **Architecture:** CQRS + Event Sourcing
*   **PDF Generation:** PDFMake

---

## 🏗 Architecture Overview

WeAre uses a strict **Event Sourcing** pattern. We do not store "current state" as the primary source of truth; we store **events**.

1.  **Command:** User initiates an action (e.g., `SubmitInventory`).
2.  **Validator:** Service checks business rules (e.g., Template Compliance).
3.  **Event Store:** Valid events are appended to the `ledger_events` stream.
4.  **Projectors:** Background workers replay events to update Read Models (e.g., `InventoryStock`).

This ensures full auditability, time-travel debugging, and accurate historical reporting.

---

## 📦 Getting Started

### Prerequisites
*   Node.js 20+
*   PostgreSQL 16+

### Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/harleysederholm-alt/WeAre.git
    cd WeAre
    ```

2.  **Install Dependencies**
    ```bash
    npm install
    ```

3.  **Setup Environment**
    Copy `.env.example` to `.env` and configure DB credentials.

4.  **Run Development Server**
    ```bash
    # Starts Frontend (3000) and Backend (3001)
    npm run dev
    ```

---

© 2026 mAI-Verce Oy. All Rights Reserved.
