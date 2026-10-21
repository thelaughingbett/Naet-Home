#!/usr/bin/env python3
"""
Convert the seed command's "CREATED USER CREDENTIALS" text output to Markdown.

Usage:
    python manage.py <your_seed_command> > credentials.txt
    python credentials_to_md.py credentials.txt credentials.md

Lecturers are grouped by department, students by class. Column positions are
read from each table's header line, so it keeps working if widths change.
"""
import re
import sys
from collections import OrderedDict


def read_tables(lines):
    """Yield (title_line, header_line, [row, ...]) for each LOGINS block."""
    i = 0
    while i < len(lines):
        if lines[i].startswith("LOGINS (dev only)"):
            title, header = lines[i], lines[i + 1]
            rows, j = [], i + 3          # skip the dashes line
            while j < len(lines) and lines[j].strip():
                rows.append(lines[j])
                j += 1
            yield title, header, rows
            i = j
        else:
            i += 1


def cols(header, names):
    """Start offset of each named column in the fixed-width header."""
    return [header.index(n) for n in names]


def esc(s):
    return s.replace("|", "\\|")


def table(head, rows):
    out = ["| " + " | ".join(head) + " |",
           "|" + "|".join("---" for _ in head) + "|"]
    out += ["| " + " | ".join(esc(c) for c in r) + " |" for r in rows]
    return out


def lecturers(header, rows):
    d, n, r, e = cols(header, ["DEPARTMENT", "NAME", "ROLE", "LOGIN EMAIL"])
    groups = OrderedDict()
    for line in rows:
        dept, name, role = (line[d:n].strip(), line[n:r].strip(),
                            line[r:e].strip())
        email, pw, staff = line[e:].split()[:3]
        groups.setdefault(dept, []).append((name, role, email, pw, staff))
    out = ["## Lecturers", "",
           f"{sum(map(len, groups.values()))} lecturers in {len(groups)} "
           "departments. Login accepts the email or the staff number.", ""]
    for dept, items in groups.items():
        out += [f"### {dept}", ""]
        out += table(["Name", "Role", "Login email", "Password", "Staff no."],
                     items)
        out.append("")
    return out


def students(header, rows):
    c, n, r, e = cols(header, ["CLASS", "NAME", "ROLE", "LOGIN EMAIL"])
    groups = OrderedDict()
    for line in rows:
        cls, name, role = (line[c:n].strip(), line[n:r].strip(),
                           line[r:e].strip())
        # The NEW column sits between ROLE and LOGIN EMAIL; it is part of
        # `role` above, so keep only the REP marker.
        role = "REP" if "REP" in role.split() else ""
        email, pw, reg, school = line[e:].split()[:4]
        groups.setdefault(cls, []).append((name, role, email, pw, reg, school))
    out = ["## Students", "",
           f"{sum(map(len, groups.values()))} students in {len(groups)} "
           "classes. Login accepts the email, registration number or school "
           "email.", ""]
    for cls, items in groups.items():
        out += [f"### {cls} ({len(items)})", ""]
        out += table(["Name", "Role", "Login email", "Password", "Reg no.",
                      "School email"], items)
        out.append("")
    return out


def main(src, dst):
    with open(src, encoding="utf-8", errors="replace") as f:
        lines = f.read().splitlines()

    out = ["# Created user credentials", "",
           "> **Dev only.** Do not commit this file or use these passwords "
           "anywhere real.", ""]

    for title, header, rows in read_tables(lines):
        if header.lstrip().startswith("DEPARTMENT"):
            out += lecturers(header, rows)
        elif header.lstrip().startswith("CLASS"):
            out += students(header, rows)

    notes = [l for l in lines if l.startswith("Passwords shown")]
    if notes:
        out += ["---", "", notes[0], ""]

    with open(dst, "w", encoding="utf-8") as f:
        f.write("\n".join(out))
    print(f"Wrote {dst}")


if __name__ == "__main__":
    if len(sys.argv) != 3:
        sys.exit(__doc__)
    main(sys.argv[1], sys.argv[2])
