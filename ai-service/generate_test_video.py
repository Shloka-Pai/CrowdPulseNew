import cv2
import numpy as np
import os

# Output file
output_path = "test_video.mp4"
fps = 30
duration = 2 # seconds
frames = fps * duration

# Video writer
fourcc = cv2.VideoWriter_fourcc(*'mp4v')
out = cv2.VideoWriter(output_path, fourcc, fps, (640, 640))

print("Generating dummy test video...")

# Create frames
for i in range(frames):
    # Create a simple frame with moving shapes
    frame = np.zeros((640, 640, 3), dtype=np.uint8)
    
    # Static background
    cv2.rectangle(frame, (0, 0), (640, 640), (50, 50, 50), -1)
    
    # Moving object (simulates Laminar flow)
    x = int((i / frames) * 640)
    cv2.circle(frame, (x, 320), 50, (0, 255, 0), -1)
    
    # Another moving object
    y = int((i / frames) * 640)
    cv2.circle(frame, (320, y), 30, (0, 0, 255), -1)

    out.write(frame)

out.release()
print(f"Created {output_path} successfully!")
