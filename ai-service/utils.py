import cv2

# 🔥 Resize frame (fixed size is better for ML consistency)
def resize_frame(frame, size=(640, 640)):
    return cv2.resize(frame, size)


# 🔥 Convert to grayscale (needed for optical flow)
def to_gray(frame):
    return cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)


# 🔥 Validate video file
def is_video_file(filename):
    allowed = [".mp4", ".avi", ".mov", ".mkv"]
    return any(filename.lower().endswith(ext) for ext in allowed)


# 🔥 Draw bounding box (debugging only)
def draw_box(frame, x1, y1, x2, y2, label="person"):
    cv2.rectangle(frame, (x1, y1), (x2, y2), (0, 255, 0), 2)
    cv2.putText(
        frame,
        label,
        (x1, y1 - 10),
        cv2.FONT_HERSHEY_SIMPLEX,
        0.5,
        (0, 255, 0),
        2
    )
    return frame