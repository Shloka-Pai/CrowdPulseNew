import cv2
import numpy as np

def compute_flow(prev_gray, curr_gray):
    flow = cv2.calcOpticalFlowFarneback(
        prev_gray, curr_gray,
        None,
        0.5, 3, 15, 3, 5, 1.2, 0
    )
    mag, ang = cv2.cartToPolar(flow[..., 0], flow[..., 1])
    return mag, ang

def classify_flow(mag, ang, mask=None):
    if mask is not None:
        mag = mag[mask > 0]
        ang = ang[mask > 0]

    # remove very small movements (noise)
    moving = mag > 1.5

    if np.sum(moving) < 50:
        return "STATIC"

    directions = ang[moving]
    
    if len(directions) == 0:
        return "STATIC"

    # how spread out directions are
    direction_variance = np.var(directions)

    # average speed
    avg_speed = np.mean(mag[moving])

    # 🔥 classification logic based on user requirements
    # low variance = LAMINAR (same direction)
    if direction_variance < 0.5:
        return "LAMINAR"
    # medium variance = CROSSING (multiple directions)
    elif direction_variance < 1.5:
        # Check if speed is very high despite variance
        if avg_speed > 5.0:
            return "TURBULENT"
        return "CROSSING"
    # high variance = TURBULENT (chaotic movement)
    else:
        return "TURBULENT"