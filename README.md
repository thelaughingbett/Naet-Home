# 🏫 Naet

> A full-featured institutional management system built with Django,
> designed for Kenyan higher education institutions. 🇰🇪
>
> Handles everything from student enrollment and academic session management
> to fee collection, timetabling, and role-based access control.
> A student's portal that doesn't make you want to drop out.
>
> Built out of genuine frustration with Kenyan university portals —
> the kind that require a specific browser, a stable connection, and apparently
> a blood offering to load your fee balance.

---

## ✨ Features

### 🎓 Academic Management

- 🏛️ Multi-level institutional hierarchy — Institution → School → Department → Programme → Class
- 🗓️ Academic session and semester management with automated rollover
- 📚 Curriculum management with course enrollment (core, elective, and common units)
- ⚡ Automatic enrollment of students into core courses on registration
- 🕐 Timetable management with venue and lecturer clash detection
- 📝 Exam scheduling with cross-programme clash detection

### 👤 Student Management

- 📋 Comprehensive student profiles (personal, family, emergency contacts, academic)
- ✅ Student reporting per session (online and physical)
- ⏸️ Deferral and graduation tracking
- 🪟 Proxy model views: Resident Students, Deferred Students, Graduated Students

### 💰 Fee Management (under consideration to be moved to financial erp's)

- 🧾 Per-class fee structures with itemised breakdowns (tuition, registration, hostel, etc.)
- 📊 Per-student fee accounts with real-time balance tracking
- 💳 Payment recording (M-Pesa, bank transfer, cash)
- ⚠️ Overdraft detection and carry-forward to next session or refund flagging

### 🔐 User & Access Management

- 👥 Custom user model with role-based access (Student, Staff, Admin)
- 🏛️ Role hierarchy: Institution Admin → School Admin → Dept Admin → Lecturer → Student
- 🔒 Scoped Django admin — each role sees only the data within their jurisdiction
- ⚡ Automatic group and permission assignment on user creation

### 📊 Results

- 📝 CAT and exam result recording per student per course

---

## 🛠️ Tech Stack

| Layer         | Technology                                       |
| ------------- | ------------------------------------------------ |
| 🐍 Backend    | Python, Django                                   |
| 🧑‍💻 Frontend   | HTML,CSS,JS                                      |
| 🗄️ Database   | PostgreSQL                                       |
| 🔐 Auth       | Django AbstractBaseUser + custom UserManager     |
| ⚡ Automation | Django signals for enrollment and session events |

---

## 🔐 Admin Access

Role-based access is enforced automatically:

| Role                 | Access                                        |
| -------------------- | --------------------------------------------- |
| 🏛️ Institution Admin | Full access to everything                     |
| 🏫 School Admin      | Own school's departments, students, lecturers |
| 🏢 Dept Admin        | Own department's students and lecturers       |
| 👨‍🏫 Lecturer          | View-only access to students                  |

---

## 💡 Key Design Decisions

- 🔑 **UUID primary keys** on all models for security and portability
- 🗓️ **Session is institution-wide** — one active session at a time, referenced by all academic and financial records

- 🪟 **Proxy models** — `DeferredStudent`, `ResidentStudent`, and `GraduatedStudent` provide filtered admin views of the same student table without duplicating data
- ⚡ **Signal-driven enrollment** — students are automatically enrolled in core and common unit courses when Reported

---

## 🗺️ Roadmap

- [ ] 📅 Attendance tracking (per timetable slot)
- [x] 📝 Exam scheduling and invigilation assignment
- [x] 📱 SMS notifications
- [ ] 🌐 REST API (Django REST Framework)
- [ ] 🌾 IoT sensor integration for smart campus monitoring

---

## [📚 Documentation](./docs/README.md)

> Everything you need to understand how this system is built and why.

### 🗺️ Where to Start

| Document                                      | What's inside                                           |
| --------------------------------------------- | ------------------------------------------------------- |
| [🗺️ System Overview](docs/system-overview.md) | High-level sketch of the whole system — read this first |
| [🏗️ Architecture](docs/architecture.md)       | Big picture — how the layers fit together               |
| [🗃️ Database Schema](docs/er-diagram.md)      | Every model and their relationships                     |
| [📋 Models Reference](docs/models.md)         | Field-by-field model breakdown                          |
| [🔐 Admin & Permissions](docs/admin.md)       | Who can see and do what                                 |

---

## 📦 Module Breakdown

| Module                                                        | Description                                   |
| ------------------------------------------------------------- | --------------------------------------------- |
| [📧 Email Generation](docs/modules/email_generation/index.md) | Automated email creation and delivery         |
| [🏢 ERP](docs/modules/erp/index.md)                           | Enterprise resource planning integration      |
| [📅 Events](docs/modules/events/index.md)                     | Event scheduling and management               |
| [📰 News](docs/modules/news/index.md)                         | News publishing and feed management           |
| [🔔 Notifications](docs/modules/notifications/index.md)       | Email and SMS delivery via pluggable backends |
| [💳 Payments](docs/modules/payments/index.md)                 | Payment processing and transaction logic      |
| [📊 Results](docs/modules/results/index.md)                   | Academic results and grade management         |
| [🕐 Timetabling](docs/modules/timetabling/index.md)           | Schedule management and clash detection       |

---

## 📜 Other Legal Obligations

Beyond data protection, institutions deploying this system have obligations under:

| Law                                       | Relevance                                         |
| ----------------------------------------- | ------------------------------------------------- |
| Computer Misuse and Cybercrimes Act, 2018 | Unauthorized access, credential security          |
| Universities Act, 2012 (CUE)              | Academic records retention, CUE audit readiness   |
| Kenya Revenue Authority                   | 7-year financial record retention, fee receipting |
| HELB                                      | Semester enrollment verification exports          |
| Persons with Disabilities Act             | Portal accessibility — WCAG 2.1 AA                |

Full details in [LEGAL.md](LEGAL.md) ⚖️

## 🔄 ERP Integration

Generic, event-driven synchronisation of any model to any external ERP system.

### Architecture

```
Something happens anywhere in the system
└── dispatch_erp_event(instance, event)
    └── transaction.on_commit → erp_sync.delay()

Celery task
└── resolves instance from DB
└── looks up event in ERPRegistry
└── runs each registered handler independently
└── logs every attempt to ERPSyncLog

Retry schedule (exponential backoff, per handler)
├── attempt 1 → 60s
├── attempt 2 → 120s
├── attempt 3 → 240s
├── attempt 4 → 480s
└── attempt 5 → exhausted → notify admin
```

### Event naming convention

```
model.action

payment.confirmed       enrollment.approved
payment.failed          deferment.created
reporting.submitted     result.published
student.graduated
```

### Adding a new ERP system

Implement `AbstractERPTask`, register it — nothing else changes:

```python
class MyTask(AbstractERPTask):
    event         = 'payment.confirmed'
    model         = 'Payment'
    max_retries   = 5
    retry_backoff = 120

    def sync(self, instance) -> ERPSyncResult:
        # instance is a Payment object
        ...
```

### Dispatching from anywhere

```python
from erp.dispatch import dispatch_erp_event

dispatch_erp_event(payment,    'payment.confirmed')
dispatch_erp_event(enrollment, 'enrollment.approved')
dispatch_erp_event(reporting,  'reporting.submitted')
dispatch_erp_event(deferment,  'deferment.created')
```

---

## 🚀 Live Demo

[ → Live Demo ](https://naet-tat2.onrender.com/)

[→ Credentials](./credentials.txt)

> Demo data is non-persistent

🇰🇪 **Built for the Kenyan institutional context** — by someone who suffered through the alternative

---

## 👨‍💻 Author

Built by Emmanuel Bett . 🇰🇪

[GitHub](https://github.com/thelaughingbett) ·
