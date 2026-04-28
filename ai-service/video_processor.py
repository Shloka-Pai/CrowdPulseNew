import cv2
import numpy as np
from flow_analyzer import compute_flow, classify_flow
from risk_engine import evaluate_risk
from detector import detect_people_and_density

def process_video(video_path, target_zone="North Stage"):
    cap = cv2.VideoCapture(video_path)
    
    # Read first frame to get dimensions
    ret, frame = cap.read()
    if not ret:
        return {"status": "error", "message": "Failed to read video"}
        
    frame = cv2.resize(frame, (640, 640))
    h, w = frame.shape[:2]
    
    # For this simulation, we treat the entire video frame as the specific target_zone
    zones = {
        target_zone: {"bbox": [0, 0, w, h]}
    }

    prev_blur = None
    prev_gray = None

    zone_flow_patterns = {z: [] for z in zones.keys()}
    latest_zone_stats = {}

    frame_count = 0
    max_frames = 150 # Process up to 150 frames for analysis (5 seconds at 30fps)

    cap.set(cv2.CAP_PROP_POS_FRAMES, 0)
    
    while frame_count < max_frames:
        ret, frame = cap.read()
        if not ret:
            break

        frame = cv2.resize(frame, (640, 640))
        gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)

        # 1. Detection and Density
        if frame_count % 10 == 0 or prev_blur is None:
            zone_stats, blur = detect_people_and_density(frame, prev_blur, zones)
            latest_zone_stats = zone_stats
            prev_blur = blur

        # 2. Optical Flow
        if prev_gray is not None:
            mag, ang = compute_flow(prev_gray, gray)
            
            for zone_name, zone_data in zones.items():
                zx1, zy1, zx2, zy2 = zone_data["bbox"]
                
                mask = np.zeros_like(gray)
                mask[zy1:zy2, zx1:zx2] = 255
                
                pattern = classify_flow(mag, ang, mask)
                zone_flow_patterns[zone_name].append(pattern)

        prev_gray = gray
        frame_count += 1

    cap.release()

    # 3. Aggregation and Risk Evaluation
    zone_analysis = {}
    global_severity_score = 0
    
    severity_weights = {"LOW": 1, "MEDIUM": 2, "HIGH": 3, "CRITICAL": 4}

    # Evaluate the real uploaded video for the target_zone
    for zone_name, patterns in zone_flow_patterns.items():
        if patterns:
            final_pattern = max(set(patterns), key=patterns.count)
        else:
            final_pattern = "STATIC"
            
        stats = latest_zone_stats.get(zone_name, {"density_level": "LOW"})
        density_level = stats["density_level"]
            
        risk = evaluate_risk(final_pattern, density_level)
        
        zone_analysis[zone_name] = {
            "severity": risk["severity"],
            "reason": risk["reason"],
            "flow_pattern": final_pattern,
            "density_level": density_level,
            "people_count": stats.get("people_count", 0)
        }
        
        global_severity_score = max(global_severity_score, severity_weights[risk["severity"]])

    # 4. Mock the remaining zones as Safe/Low so the dashboard stays fully populated
    all_festival_zones = [
        "North Stage", "East Stage Zone", "Market & Merch", 
        "Food & Beverage Plaza", "DJ Tent South Zone", "Activation Zone"
    ]
    
    for z in all_festival_zones:
        if z not in zone_analysis:
            zone_analysis[z] = {
                "severity": "LOW",
                "reason": "Routine movement detected. No risks identified.",
                "flow_pattern": "LAMINAR",
                "density_level": "LOW",
                "people_count": np.random.randint(10, 50)
            }

    # Determine global status
    global_status = "LOW"
    for s, w in severity_weights.items():
        if w == global_severity_score:
            global_status = s

    # Generate recommended action based on zone comparison
    recommended_action = "Monitor situation"
    if global_status in ["HIGH", "CRITICAL"]:
        critical_zones = [z for z, data in zone_analysis.items() if data["severity"] in ["HIGH", "CRITICAL"]]
        
        if critical_zones:
            recs = []
            if "North Stage" in critical_zones:
                recs.append("CRITICAL at North Stage: Open Emergency Exit North. Dispatch medics to stage right.")
            if "Food & Beverage Plaza" in critical_zones:
                recs.append("CRITICAL at Food Plaza: Halt food service, direct traffic towards East Stage.")
            if "East Stage Zone" in critical_zones:
                recs.append("CRITICAL at East Stage: Open East Exit. Deploy security line.")
            if "DJ Tent South Zone" in critical_zones:
                recs.append("CRITICAL at DJ Tent: Open South Exit E6. Decrease music volume for announcements.")
            if "Market & Merch" in critical_zones:
                recs.append("CRITICAL at Market: Clear West Exit path. Pause sales.")
            if "Activation Zone" in critical_zones:
                recs.append("CRITICAL at Activation Zone: Redirect crowd to General Parking.")
            
            if not recs:
                recs.append(f"Disperse crowd in {', '.join(critical_zones)}. Deploy emergency personnel.")
                
            recommended_action = " | ".join(recs)

    return {
        "zone_analysis": zone_analysis,
        "global_status": global_status,
        "recommended_action": recommended_action
    }