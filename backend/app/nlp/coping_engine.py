"""
MindHaven AI Coping Strategy Engine & Cognitive Reframing System.
Generates personalized, empathetic evidence-based mindfulness exercises (CBT, Somatic, Grounding).
"""

from typing import List, Dict, Any, Optional
import re


class CopingEngine:
    """
    Synthesizes psychological interventions (CBT, Somatic regulation, ACT)
    based on real-time NLP emotion and trigger profiles.
    """

    COGNITIVE_DISTORTIONS = [
        {
            "name": "Catastrophizing",
            "regex": r"\b(ruined|disaster|worst|terrible|end of the world|never going to work|unbearable)\b",
            "reframe_guidance": "Ask yourself: What is the most realistic outcome, and what is one small step I can take if things don't go perfectly?",
        },
        {
            "name": "All-or-Nothing Thinking",
            "regex": r"\b(always|never|completely|total failure|useless|nothing goes right|everyone)\b",
            "reframe_guidance": "Recognize that life rarely operates in extremes. Look for the gray areas: what went even slightly well?",
        },
        {
            "name": "Should Statements",
            "regex": r"\b(should have|must|ought to|have to be perfect|should be able to)\b",
            "reframe_guidance": "Notice unrealistic demands on yourself. Replace 'I should' with 'I would prefer to, and I am doing my best right now.'",
        },
        {
            "name": "Overgeneralization",
            "regex": r"\b(nothing ever|nobody cares|I always fail|every time I try)\b",
            "reframe_guidance": "A single difficult event is not an eternal pattern. Recall a previous time you navigated a similar bump.",
        },
        {
            "name": "Emotional Reasoning",
            "regex": r"\b(feel like a failure|feels hopeless|feel doomed|feel like I'm losing)\b",
            "reframe_guidance": "Remind yourself: Feelings are important indicators of your state, but they are not cold facts about reality.",
        },
    ]

    def get_strategies(
        self,
        dominant_emotion: str,
        triggers: List[Dict[str, Any]],
        wellness_score: int
    ) -> List[Dict[str, Any]]:
        """
        Generates 2 to 4 personalized coping interventions customized to the user's emotional state.
        """
        strategies = []
        trigger_names = [t["trigger"].lower() for t in triggers] if triggers else []

        # 1. Primary Somatic / Regulation Exercise based on emotion
        if dominant_emotion in ["anxiety", "frustration", "fatigue"]:
            if dominant_emotion == "anxiety":
                strategies.append({
                    "id": "breathing_478",
                    "title": "4-7-8 Calming Breath",
                    "category": "Somatic Regulation",
                    "type": "breathing",
                    "icon": "wind",
                    "duration": "3 mins",
                    "tag": "Instant Relief",
                    "accent": "pastel-blue",
                    "summary": "Stimulates the vagus nerve and activates your parasympathetic nervous system to lower heart rate and soothe mental turbulence.",
                    "steps": [
                        "Exhale completely through your mouth with a soft whoosh.",
                        "Inhale quietly through your nose for 4 seconds.",
                        "Hold your breath gently for 7 seconds.",
                        "Exhale slowly and steadily for 8 seconds.",
                        "Repeat for 4 full cycles."
                    ],
                })
                strategies.append({
                    "id": "grounding_54321",
                    "title": "5-4-3-2-1 Sensory Grounding",
                    "category": "Mindfulness",
                    "type": "grounding",
                    "icon": "eye",
                    "duration": "4 mins",
                    "tag": "De-escalation",
                    "accent": "pastel-mint",
                    "summary": "Pulls your attention away from racing thoughts back into the physical present through sensory anchors.",
                    "steps": [
                        "Acknowledge 5 things you can see around you.",
                        "Touch 4 distinct textures nearby (desk, sweater, phone).",
                        "Listen for 3 distinct ambient sounds.",
                        "Notice 2 things you can smell or breathe in.",
                        "Identify 1 taste or swallow slowly."
                    ],
                })
            elif dominant_emotion == "frustration":
                strategies.append({
                    "id": "cbt_reframing",
                    "title": "Cognitive Thought Challenger",
                    "category": "CBT Reflection",
                    "type": "reframing",
                    "icon": "sparkles",
                    "duration": "5 mins",
                    "tag": "Mental Shift",
                    "accent": "pastel-peach",
                    "summary": "Examines automatic thoughts, separates facts from interpretations, and reframes frustration into constructive boundary action.",
                    "steps": [
                        "Write out the exact thought that triggered your anger.",
                        "Identify if you're holding others to an unspoken expectation.",
                        "Ask: Will this matter to me in 6 months?",
                        "Formulate one assertively calm statement to regain your agency."
                    ],
                })
                strategies.append({
                    "id": "somatic_release",
                    "title": "Somatic Shake & Muscle Release",
                    "category": "Physical Release",
                    "type": "somatic",
                    "icon": "activity",
                    "duration": "2 mins",
                    "tag": "Energy Reset",
                    "accent": "pastel-lavender",
                    "summary": "Releases built-up adrenaline and muscular constriction stored in the shoulders and jaw.",
                    "steps": [
                        "Drop your shoulders away from your ears and unclench your jaw.",
                        "Gently shake your wrists and hands for 20 seconds.",
                        "Take 3 deep belly sighs, letting out an audible breath."
                    ],
                })
            else: # fatigue
                strategies.append({
                    "id": "micro_rest",
                    "title": "10-Minute Sensory Micro-Rest",
                    "category": "Restoration",
                    "type": "rest",
                    "icon": "coffee",
                    "duration": "10 mins",
                    "tag": "Recharge",
                    "accent": "pastel-lavender",
                    "summary": "Gives your prefrontal cortex an intentional pause without screen stimulation.",
                    "steps": [
                        "Turn your screen off or look away toward an open window.",
                        "Close your eyes and let your breathing settle without forcing it.",
                        "Rest hands in your lap and allow nothing to demand your focus for 10 minutes."
                    ],
                })

        elif dominant_emotion == "sadness":
            strategies.append({
                "id": "self_compassion",
                "title": "Self-Compassion Pause",
                "category": "Compassion Focused",
                "type": "compassion",
                "icon": "heart",
                "duration": "4 mins",
                "tag": "Gentle Care",
                "accent": "pastel-rose",
                "summary": "Counteracts harsh self-judgment by offering the same warmth and kindness you'd give to a dear friend in pain.",
                "steps": [
                    "Place one warm hand over your heart or on your arm.",
                    "Silently affirm: 'This is a moment of hurt. It is okay to feel this way.'",
                    "Remember that sorrow and struggle are part of the shared human condition.",
                    "Ask: 'What kind, soothing thing do I need most right now?'"
                ],
            })
            strategies.append({
                "id": "gentle_movement",
                "title": "Gentle Mindful Walk",
                "category": "Behavioral Activation",
                "type": "action",
                "icon": "compass",
                "duration": "8 mins",
                "tag": "Dopamine Boost",
                "accent": "pastel-mint",
                "summary": "Low-pressure physical movement outside or around your room to shift stagnation.",
                "steps": [
                    "Step away from your desk or bed.",
                    "Walk slowly for 5-10 minutes, paying attention to the soles of your feet.",
                    "Notice the sky or light around you."
                ],
            })

        else: # joy, calm, gratitude
            strategies.append({
                "id": "savoring_anchor",
                "title": "Savoring & Joy Anchoring",
                "category": "Positive Psychology",
                "type": "gratitude",
                "icon": "sun",
                "duration": "3 mins",
                "tag": "Savoring",
                "accent": "pastel-peach",
                "summary": "Deepens the neural imprint of positive experiences through mindful savoring.",
                "steps": [
                    "Pause and mentally replay the moment that brought you joy or calm.",
                    "Notice where you feel warmth or lightness in your body.",
                    "Take three grateful breaths, allowing this pleasant memory to settle in."
                ],
            })

        # 2. Context-Specific Trigger Interventions
        if any("deadline" in t or "workload" in t or "meeting" in t for t in trigger_names):
            strategies.append({
                "id": "work_boundary",
                "title": "Eisenhower Micro-Triaging",
                "category": "Cognitive Clarity",
                "type": "productivity",
                "icon": "check-circle",
                "duration": "5 mins",
                "tag": "Focus",
                "accent": "pastel-blue",
                "summary": "Disentangles urgency from true importance so you can focus on just ONE key task.",
                "steps": [
                    "Write down everything on your mental radar.",
                    "Pick ONE thing that moves the needle today.",
                    "Explicitly push non-critical items to tomorrow without guilt."
                ],
            })

        if any("insomnia" in t or "sleep" in t for t in trigger_names):
            strategies.append({
                "id": "sleep_winddown",
                "title": "Digital Sun-Downing Routine",
                "category": "Sleep Hygiene",
                "type": "rest",
                "icon": "moon",
                "duration": "15 mins",
                "tag": "Sleep Support",
                "accent": "pastel-lavender",
                "summary": "Prepares circadian rhythms for restorative sleep.",
                "steps": [
                    "Dim bright blue-toned lights 45 minutes before sleep.",
                    "Jot down your 'worry list' on paper to get it out of your head.",
                    "Sip warm water or chamomile tea in dim light."
                ],
            })

        return strategies[:3]

    def reframe_thought(self, negative_thought: str, emotion: str) -> Dict[str, Any]:
        """
        Interactive CBT Thought Reframer:
        Identifies distortions and generates balanced alternatives.
        """
        thought_clean = negative_thought.strip()
        matched_distortion = None

        for dist in self.COGNITIVE_DISTORTIONS:
            if re.search(dist["regex"], thought_clean, re.IGNORECASE):
                matched_distortion = dist
                break

        if not matched_distortion:
            distortion_name = "Subjective Over-identification"
            guidance = "Separate your present emotional state from your long-term capability. You are experiencing a challenge, but this challenge does not define your worth."
        else:
            distortion_name = matched_distortion["name"]
            guidance = matched_distortion["reframe_guidance"]

        # Generate constructive reframe suggestions
        reframe_options = [
            f"Even though I feel {emotion or 'overwhelmed'} right now, I have weathered difficult times before and can take this one step at a time.",
            f"This feeling is uncomfortable, but it is temporary. I don't need to have all the answers right this minute.",
            f"What would I tell my closest friend if they shared this thought with me? I would offer them patience and compassion."
        ]

        return {
            "original_thought": thought_clean,
            "detected_distortion": distortion_name,
            "reframing_guidance": guidance,
            "constructive_reframes": reframe_options,
            "action_affirmation": "I am allowed to be a work in progress and treat myself gently today."
        }
