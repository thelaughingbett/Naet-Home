# 🗺️ System Overview

> A high-level sketch of how everything in the system connects:
> who owns what, what flows where, and how the pieces fit together.
> Read this before diving into the details.

> 🕒 Last updated: 2026-10-16

---

## 1. Institutional hierarchy & access scope

Solid arrows are ownership; dashed arrows show which level each admin or
appointment is scoped to. `Institution` is the top-level scope only. It is
not an entity in the ER diagram.

```mermaid
flowchart TB
    classDef org fill:#cfe2ff,stroke:#4a7fd6,color:#000
    classDef admin fill:#d3f2d3,stroke:#4caf50,color:#000
    classDef people fill:#ffe3c2,stroke:#e08a2e,color:#000
    classDef scope fill:#e0e0e0,stroke:#888,color:#000

    INST["Institution<br/>(top-level scope)"]:::scope
    SCH["School"]:::org
    DEP["Department"]:::org
    PRG["Programme"]:::org
    CLS["Tclass<br/>(cohort)"]:::org
    CRS["Course"]:::org
    LEC["Lecturer"]:::people
    STU["Student"]:::people

    IA["Institution admin"]:::admin
    SA["School admin"]:::admin
    DA["Department admin"]:::admin
    APT["Academic appointments<br/>HOD / Dean / Exams Coordinator"]:::admin

    INST -->|contains| SCH
    SCH -->|contains| DEP
    DEP -->|offers| PRG
    PRG -->|has| CLS
    DEP -->|owns| CRS
    DEP -->|employs| LEC
    STU -->|belongs to| CLS

    IA -.->|sees all| INST
    SA -.->|scoped to| SCH
    DA -.->|scoped to| DEP
    APT -.->|school scope| SCH
    APT -.->|department scope| DEP
```

Every student traces back through class, programme, department and school.
This chain is what makes **scoped access** possible: a School Admin sees only
their school's data, a Department Admin only their department's. Admin roles
are assigned the matching permissions automatically when a user is created.

---

## 2. Session anchors the data

Almost everything time-bound hangs off a `Session`. Blue entities link to it
directly; grey ones reach it through the entity they hang off.

```mermaid
flowchart LR
    classDef hub fill:#fff3b0,stroke:#c9a300,color:#000
    classDef direct fill:#cfe2ff,stroke:#4a7fd6,color:#000
    classDef derived fill:#e0e0e0,stroke:#888,color:#000

    SES(["Session"]):::hub

    SES --> APP["Application"]:::direct
    SES --> CUR["Curriculum"]:::direct
    SES --> REP["Reporting"]:::direct
    SES -->|"deferred from /<br/>returning to"| DEF["Deferment"]:::direct
    SES --> FS["FeeStructure"]:::direct
    SES --> HA["HostelAllocation"]:::direct
    SES --> EC["ExamCard"]:::direct
    SES --> RW["RegistrationWindow"]:::direct
    SES --> RR["RegulatoryReport"]:::direct
    SES --> CB["ClubBudget"]:::direct

    CUR --> ENR["Enrollment"]:::derived
    CUR --> TT["Timetable"]:::derived
    CUR --> ES["ExamSession"]:::derived
    CUR --> EV["Course and lecturer<br/>evaluations"]:::derived
    ENR --> RES["Result"]:::derived
    FS --> SFA["StudentFeeAccount"]:::derived
```

There is only ever **one active session** institution-wide. When a session
rolls over, curriculum is cloned and the new session becomes the single
source of truth for new activity.

---

## 3. The student at the centre

```mermaid
flowchart LR
    classDef student fill:#ffe3c2,stroke:#e08a2e,color:#000
    classDef academic fill:#cfe2ff,stroke:#4a7fd6,color:#000
    classDef finance fill:#e0e0e0,stroke:#888,color:#000
    classDef life fill:#d3f2d3,stroke:#4caf50,color:#000
    classDef done fill:#d3c2ff,stroke:#6a3fd6,color:#000

    STU(["Student"]):::student

    subgraph ADM["Admissions"]
        APP["Application"]:::life
    end

    subgraph ACAD["Academic"]
        ENR["Enrollment"]:::academic
        CUR["Curriculum"]:::academic
        RES["Result"]:::academic
        REQ["AcademicRequisition"]:::academic
    end

    subgraph FIN["Finance"]
        ACC["StudentFeeAccount"]:::finance
        PAY["Payment"]:::finance
    end

    subgraph LIFE["Student life"]
        REP["Reporting"]:::life
        DEF["Deferment"]:::life
        HOS["HostelAllocation"]:::life
        CLB["ClubMembership"]:::life
    end

    subgraph SUP["Support & records"]
        CMP["Complaint"]:::life
        STA["StatusChangeRequest"]:::life
        MED["StudentMedicalProfile"]:::life
        IDC["IDCard"]:::life
    end

    subgraph COMP["Completion"]
        AUD["DegreeAudit"]:::done
        GRA["Graduation"]:::done
        DIP["Diploma"]:::done
    end

    APP -->|"promoted when<br/>enrolled"| STU
    STU -->|requests| ENR
    ENR -->|"for a"| CUR
    ENR -->|generates| RES
    STU -->|files| REQ
    REQ -->|concerns| ENR
    STU -->|holds| ACC
    ACC -->|"cleared by"| PAY
    STU --> REP
    STU --> DEF
    STU --> HOS
    STU --> CLB
    STU -->|files| CMP
    STU --> STA
    STU --> MED
    STU --> IDC
    STU -->|evaluated by| AUD
    STU -->|candidacy| GRA
    GRA -->|issues| DIP
```

**📋 Enrollment**: an explicit `Enrollment` record links a `Student` to a
`Curriculum` entry (course + class + session). Core and Common units are
enrolled automatically on registration; electives are registered manually and
need HOD or lecturer approval.

**🎯 Results**: scores become grades through one set of rules. See
[Grading & Results](modules/academics/index.md).

**💰 Fees**: see §4.

**🎓 Completion**: published results feed degree audit; an eligible student
moves to graduation, then diploma and convocation.

---

## 4. Fee flow

```mermaid
flowchart LR
    classDef setup fill:#cfe2ff,stroke:#4a7fd6,color:#000
    classDef ledger fill:#e0e0e0,stroke:#888,color:#000
    classDef gl fill:#d3c2ff,stroke:#6a3fd6,color:#000
    classDef student fill:#ffe3c2,stroke:#e08a2e,color:#000

    TC["Tclass"]:::setup --> FS
    SES["Session"]:::setup --> FS["FeeStructure<br/>+ items"]:::setup
    FS -->|governs| ACC["StudentFeeAccount<br/>balance derived, not stored"]:::ledger
    STU["Student"]:::student -->|holds| ACC

    PAY["Payment<br/>confirmed by the provider"]:::ledger -->|clears| ACC
    CHG["Charge<br/>fine / late fee"]:::ledger --> ACC
    SCH["Scholarship award<br/>disbursed"]:::ledger --> ACC
    ACC -->|overpaid| REF["Refund<br/>approved → completed"]:::ledger

    PAY --> JE1["Journal entry<br/>for the payment"]:::gl
    REF --> JE2["Journal entry<br/>for the refund"]:::gl
```

What a student owes is derived from their **class** and the session, never
hardcoded. The balance is computed from payments, charges, awards and refunds.

---

## 🔗 Where to Go Next

| Topic                         | Document                                                     |
| ----------------------------- | ------------------------------------------------------------ |
| 🏗️ Layers & runtime           | [Architecture Overview](architecture.md)                     |
| 🗃️ Full database schema       | [ER Diagram](er-diagram.md)                                  |
| 🔄 Role-based flows           | [Workflows](workflows.md)                                    |
| 🎯 How marks become grades    | [Grading & Results](modules/academics/index.md)              |
| 🗂️ How staff handle cases     | [Case Handling](modules/casework/index.md)                   |
| 🔌 Connecting to an ERP       | [ERP Integration](modules/erp/index.md)                      |
| 👥 Who can access what        | [Actors & Access Matrix](actors.md)                          |
| 🎓 Enrollment deep dive       | [Enrollment Module](modules/enrollment/index.md)             |
| 💰 Fee processing deep dive   | [Fees Module](modules/fees/index.md)                         |
| 🔄 Session rollover deep dive | [Session Rollover Module](modules/session-rollover/index.md) |

---

> 🔗 Back to [Documentation Index](README.md)
