"""
MindHaven Stress Trigger Detection Engine.
Identifies latent and explicit stress triggers across life domains
(Work, Relationships, Health/Sleep, Finances, Academics, Daily Life).
"""

from typing import List, Dict, Any
import re


class TriggerExtractor:
    """
    Extracts cognitive and situational stress triggers from personal narrative entries.
    """

    TRIGGER_TAXONOMY = {
        "work": {
            "category": "Work & Career",
            "keywords": [
                "deadline", "deadlines", "presentation", "meeting", "meetings",
                "boss", "manager", "workload", "overtime", "client", "clients",
                "interview", "interviews", "promotion", "job hunt", "layoff",
                "project", "coworker", "colleague", "deliverable", "deliverables",
                "emails", "slack", "standup", "sprint"
            ],
            "base_severity": "medium",
        },
        "health": {
            "category": "Sleep & Physical Health",
            "keywords": [
                "insomnia", "sleep", "sleepless", "nightmare", "headache", "migraine",
                "exhaustion", "exhausted", "pain", "fatigue", "sick", "illness",
                "caffeine", "nausea", "dizziness", "body ache", "stomach", "fever"
            ],
            "base_severity": "medium",
        },
        "relationships": {
            "category": "Social & Relationships",
            "keywords": [
                "argument", "fight", "conflict", "breakup", "partner", "spouse",
                "boyfriend", "girlfriend", "family", "parents", "mother", "father",
                "lonely", "loneliness", "isolated", "rejection", "jealousy",
                "criticism", "judged", "misunderstanding", "ignored"
            ],
            "base_severity": "high",
        },
        "finances": {
            "category": "Financial Pressures",
            "keywords": [
                "rent", "bills", "debt", "money", "expensive", "savings",
                "budget", "inflation", "cost", "bank account", "afford", "tuition"
            ],
            "base_severity": "medium",
        },
        "academics": {
            "category": "Academics & Study",
            "keywords": [
                "exam", "exams", "test", "finals", "grade", "grades",
                "assignment", "homework", "thesis", "dissertation", "study", "studying"
            ],
            "base_severity": "medium",
        },
        "daily_life": {
            "category": "Daily Routine & Overwhelm",
            "keywords": [
                "traffic", "commute", "late", "rushing", "chores", "errands",
                "clutter", "laundry", "procrastination", "schedule", "routine",
                "time management", "multitasking"
            ],
            "base_severity": "low",
        },
    }

    SEVERITY_BOOSTERS = [
        "overwhelmed by", "drowning in", "can't handle", "cannot stand",
        "ruined", "disaster", "nightmare", "panic about", "dreading",
        "terrified of", "extremely stressed", "so much"
    ]

    def extract_triggers(self, text: str) -> List[Dict[str, Any]]:
        """
        Extracts identified triggers with domain classification, frequency, and severity.
        """
        if not text or not text.strip():
            return []

        text_lower = text.lower()
        found_triggers = []
        seen_keys = set()

        # Split into sentences for context snippet extraction
        sentences = re.split(r"[.!?\n]+", text)

        for domain_key, domain_info in self.TRIGGER_TAXONOMY.items():
            category = domain_info["category"]
            base_sev = domain_info["base_severity"]

            for kw in domain_info["keywords"]:
                # Check regex word boundary for keyword
                pattern = rf"\b{re.escape(kw)}\b"
                matches = list(re.finditer(pattern, text_lower))

                if matches and kw not in seen_keys:
                    seen_keys.add(kw)
                    # Find snippet where keyword occurs
                    snippet = ""
                    for s in sentences:
                        if kw in s.lower():
                            snippet = s.strip()
                            break

                    # Evaluate severity
                    severity = base_sev
                    for booster in self.SEVERITY_BOOSTERS:
                        if booster in text_lower:
                            severity = "high"
                            break

                    found_triggers.append({
                        "trigger": kw.capitalize(),
                        "category": category,
                        "domain": domain_key,
                        "severity": severity,
                        "occurrences": len(matches),
                        "snippet": snippet if snippet else f"Mentioned: {kw}",
                    })

        # Sort by severity (high > medium > low) and occurrences
        severity_order = {"high": 3, "medium": 2, "low": 1}
        found_triggers.sort(
            key=lambda x: (severity_order.get(x["severity"], 1), x["occurrences"]),
            reverse=True
        )

        return found_triggers[:6]
