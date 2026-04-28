import requests
import sys

# URL of your AI service
url = "http://127.0.0.1:8000/analyze-video"

# Path to the video file you want to test
video_path = "test_video.mp4" 

# Allow passing zone as an argument: py test_upload.py "DJ Tent South Zone"
target_zone = sys.argv[1] if len(sys.argv) > 1 else "North Stage"

try:
    with open(video_path, "rb") as file:
        files = {"file": ("test_video.mp4", file, "video/mp4")}
        data = {"target_zone": target_zone}
        
        print(f"Sending video to {url} specifically for zone: {target_zone}...")
        response = requests.post(url, files=files, data=data)
        
        print("\nResponse Status Code:", response.status_code)
        try:
            print("Response JSON:", response.json())
        except:
            print("Response Text:", response.text)
except FileNotFoundError:
    print(f"Error: Could not find the video file at {video_path}")
    print("Please update the 'video_path' variable in this script with a real path.")
