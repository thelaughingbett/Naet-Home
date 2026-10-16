# 🗃️ Database Schema

> The full entity relationship diagram for Naet
> Every table, every relationship, all in one place.

> 🕒 Last updated: 2026-10-16

---

## 📊 ER Diagram

## 1. Core identity & staff

`User` is the single account table. Every specialised staff role is its own
profile hanging off `User`, with no shared staff base table.

```mermaid
erDiagram
  direction TB
  User ||--o| Student : "extends"
  User ||--o| Lecturer : "extends"
  User ||--o| DeptAdmin : "extends"
  User ||--o| SchoolAdmin : "extends"
  User ||--o| InstitutionAdmin : "extends"
  User ||--o| Staff : "extends"
```

## 2. Institutional hierarchy

```mermaid
erDiagram
  direction TB
  School ||--o{ Department : "contains"
  Department ||--o{ Programme : "offers"
  Programme ||--o{ Tclass : "Belongs"
  School ||--o{ SchoolAdmin : "managed by"
  Department ||--o{ DeptAdmin : "managed by"
  Department ||--o{ Lecturer : "employs"
  Lecturer ||--o{ Tclass : "liaison for"
  HostelWarden ||--o{ Hostel : "manages"
```

## 3. Admissions pipeline

The stage before a `Student` record exists. An `Application` is promoted into
a `Student` once it is marked enrolled.

```mermaid
erDiagram
  direction TB
  Programme ||--o{ Application : "receives"
  Session ||--o{ Application : "term applied"
  Application ||--o{ ApplicationDocument : "attaches"
  Application ||--o{ TransferCreditEvaluation : "reviews"
  Course ||--o{ TransferCreditEvaluation : "maps to (nullable)"
  Application ||--o| Student : "creates on enrollment"
  User ||--o{ Application : "reviewed by"
  User ||--o{ ApplicationDocument : "verified by"
  User ||--o{ TransferCreditEvaluation : "evaluated by"
```

## 4. Academic — curriculum, enrollment, results & evaluations

```mermaid
erDiagram
  direction TB
  Course }o--|| Department : "belongs to"
  Course }o--o{ Course : "prerequisites"
  Syllabus }o--|| Programme : "has"
  Syllabus }o--|| Course : "runs"

  Tclass }o--|| Programme : "cohort of"
  Curriculum }o--|| Tclass : "for class"
  Curriculum }o--|| Syllabus : "covers"
  Curriculum }o--|| Session : "in session"
  Curriculum }o--o{ Lecturer : "taught by"
  Curriculum ||--o{ Enrollment : "receives"
  Student ||--o{ Enrollment : "requests"
  Enrollment ||--o{ Result : "generates"
  Curriculum ||--o{ CourseEvaluation : "rated by"
  Student ||--o{ CourseEvaluation : "submits"
  Curriculum ||--o{ LecturerEvaluation : "rated by"
  Lecturer ||--o{ LecturerEvaluation : "rated"
  Student ||--o{ LecturerEvaluation : "submits"
```

## 5. Sessions, reporting & deferment

```mermaid
erDiagram
  direction TB
  Session ||--o{ Reporting : "logs"
  Student ||--o{ Reporting : "checks in via"
  Student ||--o{ Deferment : "requests"
  Session ||--o{ Deferment : "deferred from"
  Session ||--o{ Deferment : "returning to (nullable)"
  User ||--o{ Deferment : "approved by"
```

## 6. Student profile extensions

```mermaid
erDiagram
  direction TB
  Student ||--o{ ParentGuardian : "has"
  Student ||--o{ EmergencyContact : "has"
  Student ||--|| IDCard : "holds"
  Student ||--|| StudentMedicalProfile : "has"
  StudentMedicalProfile ||--o{ ClinicEncounter : "logs"
  User ||--o{ ClinicEncounter : "attends as clinician"
```

## 7. Complaints, appeals & status changes

A results dispute links the complaint to the unit registration (and
optionally one specific result) being challenged. Other categories carry no
result reference. An escalation made by the system rather than a person has
no escalating user.

```mermaid
erDiagram
  direction TB
  Student ||--o{ Complaint : "files"
  User ||--o{ Complaint : "assigned to (nullable)"
  Enrollment ||--o{ Complaint : "challenged (Results only, nullable)"
  Result ||--o{ Complaint : "disputed component (nullable)"
  Complaint ||--o{ ComplaintDocument : "attaches"
  Complaint ||--o{ ComplaintEscalationHistory : "escalates"
  Complaint ||--o{ ComplaintNote : "annotated by"
  Complaint ||--o{ ComplaintAppeal : "appealed via"
  ComplaintAppeal ||--o{ ComplaintDocument : "evidenced by (nullable)"
  User ||--o{ ComplaintDocument : "uploaded by"
  User ||--o{ ComplaintEscalationHistory : "escalated by (null = automatic)"
  User ||--o{ ComplaintNote : "authors"
  User ||--o{ ComplaintAppeal : "lodged by"
  User ||--o{ ComplaintAppeal : "decided by (nullable)"
  Student ||--o{ StatusChangeRequest : "requests"
  User ||--o{ StatusChangeRequest : "processed by"
```

## 8. Degree audit & graduation

```mermaid
erDiagram
  direction TB
  Student ||--|| DegreeAudit : "evaluated by"
  Student ||--|| Graduation : "candidacy"
  Tclass ||--o{ Graduation : "cohort graduates"
  Graduation ||--|| Diploma : "issues"
  Graduation }o--o{ Convocation : "seated at"
```

## 9. Finance — fees & payments

```mermaid
erDiagram
  direction TB
  Tclass ||--o{ FeeStructure : "billed per class"
  Session ||--o{ FeeStructure : "billed per session"
  FeeStructure ||--o{ StudentFeeAccount : "governs"
  Student ||--o{ StudentFeeAccount : "holds"
  StudentFeeAccount ||--o{ Payment : "cleared by"
```

## 10. Campus infrastructure & class scheduling

```mermaid
erDiagram
  direction TB
  Building ||--o{ Venue : "contains"
  Curriculum ||--o{ Timetable : "scheduled as"
  Venue ||--o{ Timetable : "hosts"
  Timetable ||--o{ DailyClassExecution : "executed as"
  Student ||--o{ DailyClassExecution : "confirmed by (class rep)"
  User ||--o{ DailyClassExecution : "rescheduled by"
  Venue ||--o{ DailyClassExecution : "rescheduled to (nullable)"
```

## 11. Examinations & invigilation

```mermaid
erDiagram
  direction TB
  Curriculum ||--o{ ExamSession : "sits as"
  ExamSession ||--o{ ExamVenue : "held at"
  Venue ||--o{ ExamVenue : "hosts"
  Lecturer ||--o{ ExamVenue : "invigilated by"
  ExamVenue ||--o{ ExamInvigilatorAssignment : "staffed by"
  Lecturer ||--o{ ExamInvigilatorAssignment : "assigned to"
  ExamSession ||--o{ ExamClash : "conflicts as A"
  ExamSession ||--o{ ExamClash : "conflicts as B"
  Student ||--o{ ExamClash : "affects"
  Student ||--o{ ExamCard : "issued"
  Session ||--o{ ExamCard : "valid for"
```

## 12. Hostels & housing

`HostelListing` is a student-facing off-campus housing directory. It has no
relationship to the on-campus `Hostel` / `Room` / `HostelAllocation` chain,
so it's drawn standalone.

```mermaid
erDiagram
  direction TB
  Hostel ||--o{ Room : "contains"
  Room ||--o{ HostelAllocation : "assigned via"
  Student ||--o{ HostelAllocation : "occupies"
  Session ||--o{ HostelAllocation : "in session"
  HostelAllocation ||--|| HostelEvaluation : "rated by"
  HostelWarden ||--o{ Hostel : "manages"

  HostelListing
```

## 13. Clubs & societies

```mermaid
erDiagram
  direction TB
  Club ||--|| ClubPatron : "overseen by"
  Lecturer ||--o{ ClubPatron : "serves as"
  Club ||--o{ ClubRecruitmentDrive : "runs"
  Club ||--o{ ClubMembership : "hosts"
  Student ||--o{ ClubMembership : "joins"
  ClubRecruitmentDrive ||--o{ ClubMembership : "sources (nullable)"
  ClubMembership ||--o{ ClubLeadershipPosition : "holds"
  Club ||--o{ ClubEvent : "organises"
  ClubEvent ||--o{ ClubEventAttendance : "tracks"
  Student ||--o{ ClubEventAttendance : "attends"
  Club ||--o{ ClubActivityReport : "submits"
  User ||--o{ ClubActivityReport : "submitted by"
  Club ||--|| ClubBudget : "allocated"
  Session ||--o{ ClubBudget : "budgeted per"
  ClubBudget ||--o{ ClubTransaction : "records"
  User ||--o{ ClubTransaction : "recorded by"
```

## 14. Student council & governance

```mermaid
erDiagram
  direction TB
  CouncilTerm ||--o{ CouncilPosition : "contains"
  School ||--o{ CouncilPosition : "school_rep seat (nullable)"
  Student ||--o{ CouncilPosition : "occupies (nullable = vacant)"
  CouncilTerm ||--o{ Election : "runs"
  Election ||--o{ ElectionPosition : "contests"
  ElectionPosition ||--o{ Candidate : "nominates"
  Student ||--o{ Candidate : "runs as"
  Student ||--o{ Vote : "casts"
  ElectionPosition ||--o{ Vote : "tallies"
  Candidate ||--o{ Vote : "receives"
  CouncilPosition ||--o{ CouncilProposal : "tables"
  CouncilProposal ||--o{ ProposalSupport : "collects"
  Student ||--o{ ProposalSupport : "signs"
  CouncilTerm ||--o{ CouncilMeeting : "schedules"
  CouncilMeeting ||--o{ CouncilMeetingAttendance : "tracks"
  Student ||--o{ CouncilMeetingAttendance : "attends"
  Student ||--o{ Grievance : "submits"
  Grievance ||--o{ GrievanceUpdate : "logs"
  User ||--o{ GrievanceUpdate : "updated by"
```

## 15. Compliance & regulatory

`ComplianceCalendarEvent` is a derived calendar view over the three
deadline-bearing tables below. It is always built from them, never entered
by hand.

```mermaid
erDiagram
  direction TB
  Programme ||--o{ Accreditation : "requires (nullable = institution-wide)"
  Accreditation ||--o{ AccreditationDocument : "evidenced by"
  Accreditation ||--o{ RegulatoryReport : "supports (nullable)"
  Session ||--o{ RegulatoryReport : "for session (nullable)"
  RegulatoryReport ||--o{ RegulatoryReportDocument : "evidenced by"
  Session ||--o{ RegistrationWindow : "governs"
  Programme ||--o{ RegistrationWindow : "scoped to (nullable)"
  Accreditation ||--o{ ComplianceCalendarEvent : "projects"
  RegulatoryReport ||--o{ ComplianceCalendarEvent : "projects"
  RegistrationWindow ||--o{ ComplianceCalendarEvent : "projects"
```

## 16. Communications & broadcast

```mermaid
erDiagram
  direction TB
  User ||--o{ Announcement : "publishes"
  Curriculum ||--o{ Announcement : "scoped to (nullable)"
  Announcement ||--o{ AnnouncementDocument : "attaches"

  NewsItem
  EventItem
  ERPSyncLog
```

`NewsItem`, `EventItem` and `ERPSyncLog` are standalone. They hold card data
synced from an external CMS or ERP, and have no internal relationships.

## 17. Academic requisitions (resit, supplementary, remark, special exam)

Student-initiated requests against a single unit registration. A request names
a specific result only when it is a re-evaluation, and registers against a
formal exam sitting only when it is a resit or supplementary. Once completed,
a request points at the result that reflects its final outcome.

```mermaid
erDiagram
  direction TB
  Student ||--o{ AcademicRequisition : "files"
  Enrollment ||--o{ AcademicRequisition : "concerns"
  Result ||--o{ AcademicRequisition : "disputed (re-evaluation only, nullable)"
  Result ||--o{ AcademicRequisition : "outcome (nullable)"
  ExamSession ||--o{ AcademicRequisition : "registered for (resit/supp only, nullable)"
  Venue ||--o{ AcademicRequisition : "ad-hoc sitting at (nullable)"
  User ||--o{ AcademicRequisition : "HOD reviewed (nullable)"
  User ||--o{ AcademicRequisition : "registrar decided (nullable)"
  AcademicRequisition ||--o{ RequisitionDocument : "attaches"
  User ||--o{ RequisitionDocument : "uploaded by"
```

Request types: resit, supplementary, missing marks, special exam, re-evaluation.

---

## 🔑 Key Relationships Explained

**👤 User → Profiles**
Every user has exactly one profile depending on role. A student user gets a
`Student` profile, a staff user becomes a `Lecturer`, `ItStaff`,
`FinanceStaff` and so on, and an admin user becomes a `DeptAdmin`,
`SchoolAdmin` or `InstitutionAdmin`.

**🎓 Student → Class → Programme → Department → School**
The full academic hierarchy. A student belongs to a class, which belongs to a
programme, which belongs to a department, which belongs to a school.

**📋 Curriculum is the hub, not Course/Tclass directly**
Enrollment, Result, Timetable, ExamSession and both evaluation models all hang
off `Curriculum` (the course + class + session junction) rather than off
`Course` or `Tclass`. This is what lets the same course carry different
lecturers, schedules and results per class per session. `AcademicRequisition`
hangs off `Enrollment`, so it always refers to one student's registration for
one unit.

**💰 Fee flow**
`FeeStructure` defines what a class owes per session →
`StudentFeeAccount` is the per-student ledger →
`Payment` records individual transactions.

**⚖️ Complaints reach into results**
A results complaint points at the enrollment (and optionally one result) being
challenged, which is how a dispute can hold marks and show reviewers exactly
what was contested.

**🏛️ Clubs vs. Council**
Both are student-organisation trees with the same shape (membership →
leadership → events → budget), but they're independent hierarchies. `Club` is
opt-in and per-society, while `CouncilTerm` is the single campus-wide
governing body elected via `Election`.

---

> 🔗 Back to [Project Index](../README.md)
> 🔗 Back to [Documentation Index](./README.md)
