def evaluate_risk(flow_pattern, density_level="LOW"):
    # density_level: LOW, HIGH
    # severity logic:
    # LOW -> laminar flow
    # MEDIUM -> crossing/static dense
    # HIGH -> dense + unstable (crossing/turbulent)
    # CRITICAL -> turbulent or sudden surge
    
    if flow_pattern == "TURBULENT":
        return {
            "severity": "CRITICAL",
            "reason": "Chaotic crowd movement detected",
            "action": "Immediate intervention required. Disperse crowd."
        }

    if flow_pattern == "LAMINAR":
        return {
            "severity": "LOW",
            "reason": "Crowd moving in uniform direction",
            "action": "Monitor safely"
        }

    if flow_pattern == "CROSSING":
        if density_level == "HIGH":
            return {
                "severity": "HIGH",
                "reason": "Dense crowd crossing in multiple directions",
                "action": "Deploy volunteers to manage flow"
            }
        else:
            return {
                "severity": "MEDIUM",
                "reason": "Multiple crowd directions detected",
                "action": "Monitor and guide crowd"
            }

    if flow_pattern == "STATIC":
        if density_level == "HIGH":
            return {
                "severity": "MEDIUM",
                "reason": "Dense but static crowd",
                "action": "Monitor for potential surge"
            }
        else:
            return {
                "severity": "LOW",
                "reason": "Sparse static crowd",
                "action": "Safe"
            }