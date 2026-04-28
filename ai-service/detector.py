import cv2
import numpy as np
from ultralytics import YOLO

model = YOLO("yolov8m.pt")

def detect_people_and_density(frame, prev_frame=None, zones=None):
    # zones: dict {"Zone A": {"bbox": [x1, y1, x2, y2]}, ...}
    
    results = model(frame, verbose=False)
    
    # Store detected people bounding boxes
    people_boxes = []
    for r in results:
        for box in r.boxes:
            cls = int(box.cls[0])
            conf = float(box.conf[0])
            if cls == 0 and conf > 0.25:
                # box.xyxy is a tensor of [x1, y1, x2, y2]
                x1, y1, x2, y2 = box.xyxy[0].cpu().numpy()
                people_boxes.append((int(x1), int(y1), int(x2), int(y2)))

    # 🔥 MOTION + DENSITY fallback
    gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
    blur = cv2.GaussianBlur(gray, (15, 15), 0)

    motion_thresh = None
    if prev_frame is not None:
        diff = cv2.absdiff(prev_frame, blur)
        _, motion_thresh = cv2.threshold(diff, 25, 255, cv2.THRESH_BINARY)

    zone_stats = {}
    
    # If no zones defined, treat the whole frame as one zone called "Global"
    if not zones:
        h, w = frame.shape[:2]
        zones = {"Global": {"bbox": [0, 0, w, h]}}

    for zone_name, zone_data in zones.items():
        zx1, zy1, zx2, zy2 = zone_data["bbox"]
        
        # Count people in this zone (center of bbox is inside zone)
        people_count = 0
        for px1, py1, px2, py2 in people_boxes:
            cx, cy = (px1 + px2) // 2, (py1 + py2) // 2
            if zx1 <= cx <= zx2 and zy1 <= cy <= zy2:
                people_count += 1
                
        # Calculate motion score in this zone
        motion_score = 0
        if motion_thresh is not None:
            zone_motion = motion_thresh[zy1:zy2, zx1:zx2]
            area = (zx2 - zx1) * (zy2 - zy1)
            if area > 0:
                motion_score = np.sum(zone_motion) / area

        # Density approximation
        density_level = "LOW"
        area = (zx2 - zx1) * (zy2 - zy1)
        # Assume each person takes roughly 50x150 pixels = 7500 area
        # This is an approximation
        if area > 0:
            density_ratio = (people_count * 7500) / area
            if density_ratio > 0.4:
                density_level = "HIGH"

        zone_stats[zone_name] = {
            "people_count": people_count,
            "motion_score": motion_score,
            "density_level": density_level,
            "bbox": [zx1, zy1, zx2, zy2]
        }

    return zone_stats, blur