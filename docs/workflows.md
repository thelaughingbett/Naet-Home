# 🔄 Role-Based Workflows

> How each role moves through the system, one flowchart per domain.
> Diamonds are decision or approval gates.

> 🕒 Last updated: 2026-10-16

---

## 1. Student Lifecycle (cross-role, end to end)

The spine everything else hangs off: admission through graduation, with the
roles that touch each stage.

```mermaid
flowchart TD
    classDef student fill:#ffe3c2,stroke:#e08a2e,color:#000
    classDef staff fill:#cfe2ff,stroke:#4a7fd6,color:#000
    classDef decision fill:#fff3b0,stroke:#c9a300,color:#000
    classDef finance fill:#e0e0e0,stroke:#888,color:#000

    A["Application submitted"]:::student
    B{"Reviewed by<br/>Admissions"}:::decision
    C["Application accepted<br/>→ Student record created"]:::staff
    D["Reporting: check-in<br/>for the session"]:::student
    E["Enrollment per Curriculum<br/>(core / common auto-approved)"]:::student
    F{"Elective?"}:::decision
    G["HOD approves"]:::staff
    H["Fees billed to the<br/>student's account"]:::finance
    I["Payments, charges,<br/>refunds, scholarships"]:::finance
    J["Results accumulate<br/>for each unit"]:::staff
    K["Degree audit<br/>eligibility check"]:::staff
    L{"Eligible?"}:::decision
    M["Graduation → Diploma<br/>→ Convocation"]:::staff

    A --> B
    B -- rejected --> A
    B -- accepted --> C
    C --> D --> E --> F
    F -- no --> H
    F -- yes --> G --> H
    H --> I
    I --> J --> K --> L
    L -- not yet --> J
    L -- yes --> M
```

---

## 2. Academic Staffing & Approval

Lecturer → HOD: teaching assignment and elective enrollment approval.
Complaint handling has its own ladder, covered in §3.

```mermaid
flowchart TD
    classDef lecturer fill:#d3f2d3,stroke:#4caf50,color:#000
    classDef hod fill:#cfe2ff,stroke:#4a7fd6,color:#000

    A["Lecturer assigned<br/>to a Curriculum entry"]:::lecturer
    B["Shows up on the Timetable"]:::lecturer
    C["Each class session<br/>signed off"]:::lecturer
    D["Result entered<br/>per Enrollment"]:::lecturer

    E["HOD appointment<br/>for the department"]:::hod
    F["Approves department<br/>elective enrollments"]:::hod
    G["Staffs department courses<br/>on the Curriculum"]:::hod

    A --> B --> C --> D
    E --> F
    E --> G
```

---

## 3. Complaint / Grievance Lifecycle

Each category has its own escalation path and time limits. Levels whose seat
is vacant are skipped automatically. Staff-side handling is described in
[Case Handling](modules/casework/index.md).

### 3.1 Complaint Routing (entry level)

```mermaid
flowchart TB
    A[Student files complaint]
    A --> B{Category?}

    B -->|Results| R[Result entrant<br/>lecturer who recorded the score<br/>marks recorded, results put on hold]
    B -->|Academic| C[Programme liaison<br/>lecturer for the student's class]
    B -->|Harassment| D[Dean of Students<br/>direct — priority forced Critical]
    B -->|Facilities / Administrative /<br/>Catering / Other| E[School Rep<br/>Student Council]

    R -.->|seat vacant or no single<br/>result pinned| C
    E -.->|seat vacant| F[Next council seat<br/>in the chain]
```

### 3.2 Escalation Ladders & Time Limits

```mermaid
flowchart LR
    subgraph Results["Results track"]
        R1[Result entrant<br/>24h]
        R2[Liaison<br/>48h]
        R3[Department HOD<br/>72h]
        R4[School Dean<br/>72h]
        R5[Registrar Academic<br/>Division 120h]
        R6[Senate<br/>72h]
        R1 --> R2 --> R3 --> R4 --> R5 --> R6
    end

    subgraph Academic["Academic track"]
        A1[Liaison<br/>48h]
        A2[Department HOD<br/>72h]
        A3[School Dean<br/>72h]
        A4[Dean of Students<br/>72h]
        A5[Division<br/>72h]
        A6[Senate<br/>72h]
        A1 --> A2 --> A3 --> A4 --> A5 --> A6
    end

    subgraph Ops["Facilities / Administrative /<br/>Catering / Other track — 24h each"]
        B1[School Rep]
        B2[Secretary General]
        B3[Deputy Chairperson]
        B4[Chairperson]
        B5[Dean of Students]
        B6[Senate]
        B1 --> B2 --> B3 --> B4 --> B5 --> B6
    end

    subgraph Harassment["Harassment track — 12h each"]
        C1[Dean of Students<br/>direct entry]
        C2[Senate]
        C1 --> C2
    end
```

### 3.3 Escalation Trigger

```mermaid
flowchart TB
    A[Complaint sitting at<br/>current level<br/>time limit starts on entry]
    A --> B{Resolved before<br/>the time limit?}

    B -->|Yes| C[Closed<br/>written remarks required<br/>outcome: resolved or rejected]

    B -->|No| D[System escalates automatically]
    D --> E[Priority raised one tier]

    A --> F{Handler escalates early?}
    F -->|Yes| G[Handler escalates with a reason<br/>and may set the priority]

    E --> H{Last level<br/>in the ladder?}
    G --> H
    H -->|Yes, automatic| I[No move —<br/>priority raised only]
    H -->|No| J[Vacant seats are skipped<br/>and noted in the reason]
    J --> K[Escalation recorded<br/>status = Escalated<br/>new time limit starts]
```

### 3.4 Closure & Appeal

An appeal is allowed only on a closed case, within 14 days, with no appeal
pending, fewer than 2 earlier appeals, and only if the decision was not made
at the final level of the ladder. Grounds must be at least 30 characters.

```mermaid
flowchart TB
    A[Complaint closed<br/>outcome resolved / rejected]
    A --> B{Appeal<br/>allowed?}
    B -->|No| Z[Appeal blocked<br/>window closed / already pending /<br/>2 used / final level]
    B -->|Yes| C[Student lodges appeal<br/>grounds + optional evidence]

    C --> D[Original decision preserved<br/>level, outcome, remarks, date]
    D --> E[Case reopens at the next level<br/>escalation recorded<br/>remarks cleared, new time limit]
    E --> F[Disputed results put back on hold]
    F --> G[Reviewer at the higher level<br/>decides the appeal]
    G --> H{Upheld?}
    H -->|Yes| I[Appeal upheld<br/>case closed as resolved]
    H -->|No| J[Appeal dismissed<br/>case closed as rejected]
    I --> A
    J --> A
```

### 3.5 Results Dispute Side-Effects

```mermaid
flowchart TB
    A[Student files Results complaint<br/>must name their own unit registration]
    A --> B[Marks recorded as filed:<br/>CAT, exam, total, grade, time]
    B --> C[Published results on the unit<br/>or the one named result<br/>→ on hold]
    C --> D[Result entrant reviews<br/>24h limit]
    D --> E{Corrected?}
    E -->|Yes| F[Lecturer re-submits the score<br/>→ moderation and publishing, §14]
    E -->|No| G[Escalate up the Results ladder §3.2]
    F --> H[Case closed with remarks]
    G --> H
    H --> I[Hold lifted unless another<br/>dispute on the unit is open<br/>closing never changes marks]
```

---

## 4. Student Fee Billing & Payment

```mermaid
flowchart TD
    classDef finance fill:#e0e0e0,stroke:#888,color:#000
    classDef decision fill:#fff3b0,stroke:#c9a300,color:#000
    classDef gl fill:#d3c2ff,stroke:#6a3fd6,color:#000

    A["Fee structure + items<br/>per class and session"]:::finance
    B["Student fee account<br/>created for the student"]:::finance
    C["Payment initiated"]:::finance
    D{"Confirmed by<br/>the payment provider?"}:::decision
    E["Payment confirmed"]:::finance
    F["Journal entry<br/>Dr Cash · Cr Receivable"]:::gl
    G{"Overpaid?"}:::decision
    H["Refund approved<br/>→ completed"]:::finance
    I["Journal entry<br/>for the refund"]:::gl
    J["Charge added<br/>(fine / late fee)"]:::finance
    K["Scholarship disbursed"]:::finance
    L["Account balance updated<br/>(derived, not stored)"]:::finance

    A --> B --> C --> D
    D -- pending --> D
    D -- yes --> E --> F --> L
    B --> J --> L
    B --> K --> L
    L --> G
    G -- yes --> H --> I
    G -- no --> M["Account cleared"]:::finance
```

---

## 9. Exams — Coordinator to Director

```mermaid
flowchart TD
    classDef coord fill:#d3f2d3,stroke:#4caf50,color:#000
    classDef director fill:#b3c7f7,stroke:#2f56b0,color:#000
    classDef decision fill:#fff3b0,stroke:#c9a300,color:#000

    A["Exams Coordinator<br/>(department-scoped appointment)"]:::coord
    B["Exam sitting prepared<br/>per Curriculum"]:::coord
    C["Invigilators nominated"]:::coord
    D["Director of Examinations<br/>(institution-wide)"]:::director
    E["Consolidated timetable<br/>approved"]:::director
    F["Clash check<br/>across all sittings"]:::director
    G{"Clash<br/>found?"}:::decision
    H["Clash resolved"]:::director
    I["Venues and invigilators<br/>staffed"]:::director
    J["Exam cards issued<br/>to students"]:::director

    A --> B --> C --> D --> E --> F --> G
    G -- yes --> H --> F
    G -- no --> I --> J
```

---

## 10. Clubs — Membership to Event

```mermaid
flowchart TD
    classDef student fill:#ffe3c2,stroke:#e08a2e,color:#000
    classDef exec fill:#d3f2d3,stroke:#4caf50,color:#000
    classDef patron fill:#cfe2ff,stroke:#4a7fd6,color:#000
    classDef decision fill:#fff3b0,stroke:#c9a300,color:#000

    A["Student applies via<br/>a recruitment drive"]:::student
    B["Membership<br/>pending"]:::student
    C{"Club exec<br/>approves?"}:::decision
    D["Membership approved"]:::exec
    D2["Membership rejected"]:::exec
    E["Leadership position<br/>held by an active member"]:::exec
    F["Event created"]:::exec
    G["Submitted for approval"]:::exec
    H{"Dean of Students<br/>approves?"}:::patron
    I["Event approved"]:::patron
    J["Attendance tracked"]:::exec
    K["Transactions recorded<br/>against the club budget"]:::exec
    L["Activity report<br/>submitted"]:::exec

    A --> B --> C
    C -- no --> D2
    C -- yes --> D --> E
    E --> F --> G --> H
    H -- no --> G
    H -- yes --> I --> J
    F --> K --> L
```

---

## 11. Student Council — Election to Governance

```mermaid
flowchart TD
    classDef council fill:#ffe3c2,stroke:#e08a2e,color:#000
    classDef decision fill:#fff3b0,stroke:#c9a300,color:#000

    A["Election created<br/>for a council term"]:::council
    B["Positions defined<br/>per seat"]:::council
    C["Candidate nominated"]:::council
    D{"Vetted &<br/>approved?"}:::decision
    E["Voting opens"]:::council
    F["Vote cast<br/>(one per student per seat)"]:::council
    G["Winners declared"]:::council
    H["Council positions<br/>installed"]:::council
    I["Proposal tabled<br/>by a position holder"]:::council
    J["Supporting signatures<br/>collected"]:::council
    K{"Decision-maker<br/>approves?"}:::decision
    L["Grievance submitted<br/>by a student"]:::council
    M["Assigned to the relevant<br/>portfolio (e.g. Welfare Sec)"]:::council
    N["Updates logged<br/>until resolved"]:::council

    A --> B --> C --> D
    D -- rejected --> C
    D -- approved --> E --> F --> G --> H
    H --> I --> J --> K
    K -- rejected --> I
    L --> M --> N
```

---

## 12. Hostel Allocation

```mermaid
flowchart TD
    classDef student fill:#ffe3c2,stroke:#e08a2e,color:#000
    classDef warden fill:#cfe2ff,stroke:#4a7fd6,color:#000
    classDef decision fill:#fff3b0,stroke:#c9a300,color:#000

    A["Student requests<br/>a hostel room"]:::student
    B{"Room capacity<br/>available?"}:::decision
    C["Room allocated"]:::warden
    D["Waitlisted"]:::warden
    E["Session ends"]:::student
    F["Hostel evaluation<br/>submitted"]:::student
    G["Warden reviews<br/>feedback"]:::warden

    A --> B
    B -- no --> D
    B -- yes --> C --> E --> F --> G
```

---

## 13. Enrollment

```mermaid
flowchart TB
    subgraph Student["🧑 Student"]
        A[Reports to school<br/>for the session]
        D[Sees electives<br/>offered for the programme]
        E[Registers for<br/>an elective]
    end

    subgraph System["⚙️ System"]
        B[Auto-enrolls into Core /<br/>Common units for their year<br/>based on the syllabus]
        C[Publishes the elective list<br/>for programme + year]
        F[Registration created<br/>as pending]
    end

    subgraph Reviewer["🎓 HOD / Course Lecturer"]
        G[Reviews the elective<br/>registration request]
        H{Approve?}
        I[Registration approved<br/>manually]
        J[Registration rejected]
    end

    A --> B
    B --> C
    C --> D
    D --> E
    E --> F
    F --> G
    G --> H
    H -->|Yes| I
    H -->|No| J
```

---

## 14. Results

How scores become grades is covered in [Grading & Results](modules/academics/index.md).

```mermaid
flowchart TB
    subgraph Lecturer["👨‍🏫 Lecturer"]
        A[Enters CAT / Assignment /<br/>Quiz score]
        B[Enters Practical /<br/>Exam score]
        Q[Reviews disputed result<br/>re-submits score]
    end

    subgraph ExamDept["🏢 Exam Department"]
        C[Enters exam score<br/>via exam portal]
    end

    subgraph System["⚙️ System"]
        D[Auto-publishes the result]
        Emod[Routes the result to<br/>the moderation queue]
        F[Notifies the student<br/>result available / updated]
    end

    subgraph Approver["🎓 Dean / HOD / Exam Dept"]
        G[Reviews & moderates<br/>the score]
        H{Approve?}
        I[Marks the result<br/>published]
        J[Sends back to the lecturer<br/>marked disputed]
        M[Receives the student's<br/>dispute]
        N{Resolve directly?}
        O[Resolves the dispute &<br/>updates the result]
        P[Forwards the dispute to<br/>the lecturer for review]
    end

    subgraph Student["🧑 Student"]
        K[Views the published result]
        L[Files Results complaint §3]
    end

    A --> D --> F
    B --> Emod
    C --> Emod
    Emod --> G --> H
    H -->|Yes| I --> F
    H -->|No| J --> B

    F --> K --> L --> M
    M --> N
    N -->|Yes, resolves it| O --> F
    N -->|No, needs lecturer input| P --> Q --> Emod
```

The dispute path in this diagram is driven by a results complaint. See §3.5
for the hold and the recorded marks, and §3.2 for who reviews at each level.

---

## 15. Graduation Track

```mermaid
flowchart TB
    subgraph System["⚙️ System"]
        A[Result published]
        B[Recalculates degree audit:<br/>credits completed and GPA]
        C{Credits completed ≥<br/>the programme requirement?}
        D[Audit stays<br/>on track / deficient]
        E[Audit marked eligible]
        F[Graduation nomination<br/>created or updated]
    end

    subgraph HOD["🎓 Dean / HOD"]
        G[Reviews the nomination]
        H{Verify?}
        I[Nomination verified]
        J[Returns the nomination<br/>for correction]
    end

    subgraph Registrar["🏛️ Registrar"]
        K[Reviews the verified nomination]
        L{Approve?}
        M[Graduation approved]
        N[Sends back to the HOD<br/>with remarks]
    end

    A --> B --> C
    C -->|No| D
    C -->|Yes| E --> F --> G
    G --> H
    H -->|Yes| I --> K
    H -->|No| J --> F
    K --> L
    L -->|Yes| M
    L -->|No| N --> G
```

---

## 16. Exam

```mermaid
flowchart TB
    subgraph PaperSetting["📝 Lecturer / Examiner"]
        A[Question paper drafted]
        B[Paper submitted]
    end

    subgraph Moderation["🔍 Moderator"]
        C[Paper reviewed<br/>with comments]
        D{Approved?}
        E[Paper moderated]
        F[Paper rejected<br/>returned to the setter]
    end

    subgraph ExamDay["🏫 Exam Day — Invigilator"]
        G[Student sits the exam]
        H[Attendance recorded]
        I{Status}
        J[Present]
        K[Absent]
        L[Malpractice reported]
    end

    subgraph Grading["📊 Grading — Lecturer / System"]
        M[Result entered per type<br/>CAT / Exam / Assignment...]
        N[Result published]
        O[Unit grade finalised<br/>and frozen with pass / fail]
    end

    subgraph Reval["⚖️ Revaluation — Student / Exam Dept"]
        P[Student files a<br/>revaluation request]
        Q[Under review]
        R{Marks changed?}
        S[Marks changed<br/>grade regraded]
        T[Marks unchanged]
    end

    subgraph Backlog["🔁 Backlog — Student"]
        U{Unit passed?}
        V[Backlog registration<br/>attempt count increases]
    end

    subgraph Registrar["🏛️ Registrar"]
        W[Grade card generated<br/>SGPA / CGPA]
        X[Transcript request<br/>requested → processing → issued]
        Y[Certificate issued<br/>bonafide / provisional / ...]
    end

    A --> B --> C --> D
    D -->|Yes| E
    D -->|No| F --> A
    E --> G

    G --> H --> I
    I --> J --> M
    I --> K
    I --> L

    M --> N --> O
    O --> U
    U -->|No| V --> G
    U -->|Yes| W

    N --> P
    P --> Q --> R
    R -->|Yes| S --> O
    R -->|No| T

    W --> X
    W --> Y
```

Re-evaluation requests are also handled through academic requisitions, see §17.

---

## 17. Academic Requisitions

Resit, supplementary, special sit-in, missing-marks and re-evaluation
requests. All types go through the same two-stage review (HOD recommendation,
then Registrar decision), followed by optional scheduling and a fee gate
before completion.

### 17.1 Requisition Lifecycle

```mermaid
flowchart TB
    classDef student fill:#ffe3c2,stroke:#e08a2e,color:#000
    classDef hod fill:#cfe2ff,stroke:#4a7fd6,color:#000
    classDef registrar fill:#b3c7f7,stroke:#2f56b0,color:#000
    classDef exams fill:#d3f2d3,stroke:#4caf50,color:#000
    classDef decision fill:#fff3b0,stroke:#c9a300,color:#000
    classDef finance fill:#e0e0e0,stroke:#888,color:#000

    A["Student files a requisition<br/>type + own unit registration + reason<br/>optional supporting documents"]:::student
    B{"Open request already exists?<br/>same student, unit and type"}:::decision
    Z["Blocked: duplicate"]:::student
    C["Pending"]:::student

    D["HOD reviews"]:::hod
    E{"HOD recommends?"}:::decision
    F["Recommended by HOD"]:::hod

    G["Registrar reviews<br/>sets the fee if one applies"]:::registrar
    H{"Registrar approves?"}:::decision
    I["Approved"]:::registrar

    X["Rejected<br/>a written reason is required"]:::decision

    J["Scheduled by the exams office<br/>date, time slot, venue"]:::exams
    K{"Fee required?"}:::decision
    L["Fee cleared"]:::finance
    M["Outcome recorded<br/>against the request type"]:::exams
    N["Completed"]:::exams

    A --> B
    B -- yes --> Z
    B -- no --> C --> D --> E
    E -- no --> X
    E -- yes --> F --> G --> H
    H -- no --> X
    H -- yes --> I
    I --> J --> K
    I --> K
    K -- yes --> L --> M
    K -- no --> M
    M --> N
```

### 17.2 What each type does

| Type          | Needs                                                                                                  | Outcome on completion                                                          |
| ------------- | ------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------ |
| Resit         | Optionally registered against a formal exam sitting                                                    | The result of the new attempt is recorded as the outcome and tagged as a resit |
| Supplementary | Optionally registered against a formal exam sitting                                                    | Same as a resit, tagged as supplementary                                       |
| Special exam  | Nothing extra; scheduled ad hoc                                                                        | The sitting result is recorded and tagged as a special exam                    |
| Re-evaluation | The specific result being remarked, which must belong to the unit and be published or already disputed | The corrected result is recorded, and the request notes whether marks changed  |
| Missing marks | Nothing extra                                                                                          | The investigation closes; any recovered result is recorded as the outcome      |

Rules that apply to every request:

- A student can only file against their own unit registration.
- Only a re-evaluation names a specific result.
- Only resits and supplementaries register against a formal exam sitting.
- A student can have only one open request of the same type per unit.
- A rejection must carry a written reason.
- If a fee applies, an approved request needs the fee amount set, and completion needs the fee cleared.

### 17.3 Planned review routing

Review will later follow the same level-based model as complaints, so that the
result entrant and programme liaison can look at remarking and missing-marks
requests first. See [Case Handling](modules/casework/index.md).

```mermaid
flowchart LR
    subgraph Remark["Re-evaluation"]
        R1[Result entrant] --> R2[Liaison] --> R3[Department] --> R4[Division]
    end
    subgraph Missing["Missing marks"]
        M1[Result entrant] --> M2[Liaison] --> M3[Department]
    end
    subgraph Exams["Resit / supplementary / special exam"]
        E1[Department] --> E2[Division]
    end
```

---

> 🔗 Back to [ER Diagram](./er-diagram.md)
> 🔗 Back to [Project Index](../README.md)
