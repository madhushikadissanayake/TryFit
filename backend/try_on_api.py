from flask import Flask, Response, request, jsonify
from flask_cors import CORS
import cv2
import mediapipe as mp # type: ignore
import numpy as np
import base64
import os
import json
from PIL import Image
import io
import threading

app = Flask(__name__)
CORS(app)  # Enable Cross-Origin Resource Sharing

# Initialize MediaPipe Pose
mp_pose = mp.solutions.pose
pose = mp_pose.Pose(
    static_image_mode=False,
    model_complexity=2,
    min_detection_confidence=0.7,
    min_tracking_confidence=0.7
)
mp_drawing = mp.solutions.drawing_utils

# Paths
BASE_FOLDER = "Resources"
ITEMS_FOLDER = os.path.join(BASE_FOLDER, "Items")

# Store active session data
sessions = {}

# Thread local storage to track current session
thread_local = threading.local()

# Global dictionary to track camera status
camera_status = {}

# Webcam feed endpoint
@app.route('/video_feed/<session_id>')
def video_feed(session_id):
    def generate_frames():
        try:
            cap = cv2.VideoCapture(0)
            cap.set(3, 1280)
            cap.set(4, 720)

            if session_id not in sessions:
                sessions[session_id] = {"selected_item": None, "selected_category": None, "show_debug": False}
            
            if session_id not in camera_status:
                camera_status[session_id] = True
            
            # Store session_id in thread local storage
            thread_local.session_id = session_id
            
            try:
                while True:
                    # Check if camera is turned off for this session
                    if not camera_status.get(session_id, True):
                        # Return a blank frame or message when camera is off
                        blank_frame = np.zeros((720, 1280, 3), np.uint8)
                        # Add text indicating camera is off
                        cv2.putText(blank_frame, "Camera Off", (540, 360), 
                                    cv2.FONT_HERSHEY_SIMPLEX, 1, (255, 255, 255), 2)
                        ret, buffer = cv2.imencode('.jpg', blank_frame)
                        frame_bytes = buffer.tobytes()
                        yield (b'--frame\r\n'
                               b'Content-Type: image/jpeg\r\n\r\n' + frame_bytes + b'\r\n')
                        # Slow down the frame rate when camera is off
                        import time
                        time.sleep(0.5)
                        continue
                    
                    success, frame = cap.read()
                    if not success:
                        break
                        
                    # Flip horizontally for mirror effect
                    frame = cv2.flip(frame, 1)
                    
                    # Process with MediaPipe
                    rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
                    results = pose.process(rgb_frame)
                    output_frame = frame.copy()
                    
                    if results.pose_landmarks:
                        landmarks = results.pose_landmarks.landmark
                        
                        # Show debug if enabled
                        if sessions[session_id]["show_debug"]:
                            mp_drawing.draw_landmarks(
                                output_frame,
                                results.pose_landmarks,
                                mp_pose.POSE_CONNECTIONS,
                                mp_drawing.DrawingSpec(color=(0, 255, 0), thickness=2, circle_radius=2),
                                mp_drawing.DrawingSpec(color=(0, 0, 255), thickness=2)
                            )
                        
                        # Overlay clothing item if selected
                        if sessions[session_id]["selected_item"] is not None:
                            try:
                                if sessions[session_id]["selected_category"] == "Kids":
                                    overlay_item_kids(output_frame, landmarks, sessions[session_id]["selected_item"], session_id)
                                else:
                                    overlay_item(output_frame, landmarks, sessions[session_id]["selected_item"], session_id)
                            except Exception as e:
                                print(f"Error overlaying item: {e}")
                    
                    # Convert frame to JPEG
                    ret, buffer = cv2.imencode('.jpg', output_frame)
                    frame_bytes = buffer.tobytes()
                    
                    # Yield the frame in multipart response
                    yield (b'--frame\r\n'
                           b'Content-Type: image/jpeg\r\n\r\n' + frame_bytes + b'\r\n')
            finally:
                cap.release()
        except Exception as e:
            print(f"Frame generation error: {e}")
            yield (b'--frame\r\n'
                   b'Content-Type: text/plain\r\n\r\n'
                   b'Error: Unable to access camera. Please check permissions.\r\n')
            
    return Response(generate_frames(), mimetype='multipart/x-mixed-replace; boundary=frame')

# New endpoint to toggle camera status
@app.route('/toggle_camera', methods=['POST'])
def toggle_camera():
    try:
        data = request.json
        session_id = data.get('session_id')
        camera_enabled = data.get('camera_enabled', False)

        if not session_id:
            return jsonify({"error": "Missing session_id"}), 400
            
        camera_status[session_id] = camera_enabled
        
        return jsonify({
            "status": "success", 
            "camera_enabled": camera_enabled,
            "message": f"Camera {'enabled' if camera_enabled else 'disabled'} for session {session_id}"
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Functions for overlaying items
def overlay_item(frame, landmarks, item_img, session_id):
    try:
        h, w, _ = frame.shape

        # Get key landmarks for item placement
        left_shoulder = (int(landmarks[mp_pose.PoseLandmark.LEFT_SHOULDER].x * w),
                        int(landmarks[mp_pose.PoseLandmark.LEFT_SHOULDER].y * h))
        right_shoulder = (int(landmarks[mp_pose.PoseLandmark.RIGHT_SHOULDER].x * w),
                          int(landmarks[mp_pose.PoseLandmark.RIGHT_SHOULDER].y * h))
        
        left_hip = (int(landmarks[mp_pose.PoseLandmark.LEFT_HIP].x * w),
                    int(landmarks[mp_pose.PoseLandmark.LEFT_HIP].y * h))
        right_hip = (int(landmarks[mp_pose.PoseLandmark.RIGHT_HIP].x * w),
                    int(landmarks[mp_pose.PoseLandmark.RIGHT_HIP].y * h))
        
        # Calculate important reference points
        shoulder_center_x = (left_shoulder[0] + right_shoulder[0]) // 2
        shoulder_center_y = (left_shoulder[1] + right_shoulder[1]) // 2
        
        hip_center_x = (left_hip[0] + right_hip[0]) // 2
        hip_center_y = (left_hip[1] + right_hip[1]) // 2
        
        # Calculate item dimensions based on body proportions
        shoulder_width = np.linalg.norm(np.array(left_shoulder) - np.array(right_shoulder))
        
        # Check category from the correct session
        current_category = sessions[session_id]["selected_category"]
        
        if current_category == "Womens":
            width_scale = 1.8
            height_scale = 1.25
            y_offset_factor = 0.2
        else:  # Men's
            width_scale = 1.7 
            height_scale = 1.2
            y_offset_factor = 0.2
            
        item_width = int(shoulder_width * width_scale)
        
        torso_height = np.linalg.norm(np.array([shoulder_center_x, shoulder_center_y]) - 
                                    np.array([hip_center_x, hip_center_y]))
        item_height = int(torso_height * height_scale)
        
        # Ensure minimum dimensions
        item_width = max(item_width, 100)
        item_height = max(item_height, 150)
        
        # Resize the item while maintaining aspect ratio
        original_aspect = item_img.shape[0] / item_img.shape[1]
        target_aspect = item_height / item_width
        
        if target_aspect > original_aspect:
            actual_height = item_height
            actual_width = int(item_height / original_aspect)
        else:
            actual_width = item_width
            actual_height = int(item_width * original_aspect)
        
        # Resize the item
        try:
            resized_item = cv2.resize(item_img, (actual_width, actual_height), 
                                      interpolation=cv2.INTER_AREA)
        except Exception as e:
            print(f"Resize error: {e} - Size: {actual_width}x{actual_height}")
            return
            
        # Calculate position to place the item
        x_offset = shoulder_center_x - actual_width // 2
        y_offset = shoulder_center_y - int(actual_height * y_offset_factor)
        
        # Check boundaries
        if x_offset < 0: x_offset = 0
        if y_offset < 0: y_offset = 0
        if x_offset + actual_width > w: x_offset = w - actual_width
        if y_offset + actual_height > h: y_offset = h - actual_height
        
        # Prepare region of interest
        roi = frame[y_offset:y_offset+actual_height, x_offset:x_offset+actual_width]
        
        # Check if ROI has valid dimensions
        if roi.shape[0] <= 0 or roi.shape[1] <= 0 or \
           roi.shape[0] != resized_item.shape[0] or roi.shape[1] != resized_item.shape[1]:
            return
            
        # Apply alpha blending for transparent item
        if resized_item.shape[2] == 4:  # With alpha channel
            alpha_s = resized_item[:, :, 3] / 255.0
            alpha_l = 1.0 - alpha_s
            
            # Apply blending for each color channel
            for c in range(3):
                roi[:, :, c] = (alpha_s * resized_item[:, :, c] + alpha_l * roi[:, :, c])
        else:
            # Just copy the resized item (no transparency)
            roi[:] = resized_item[:, :, :3]
    except Exception as e:
        print(f"Overlay error: {e}")

def overlay_item_kids(frame, landmarks, item_img, session_id):
    try:
        h, w, _ = frame.shape

        # Get key landmarks for item placement
        left_shoulder = (int(landmarks[mp_pose.PoseLandmark.LEFT_SHOULDER].x * w),
                       int(landmarks[mp_pose.PoseLandmark.LEFT_SHOULDER].y * h))
        right_shoulder = (int(landmarks[mp_pose.PoseLandmark.RIGHT_SHOULDER].x * w),
                        int(landmarks[mp_pose.PoseLandmark.RIGHT_SHOULDER].y * h))
        
        left_hip = (int(landmarks[mp_pose.PoseLandmark.LEFT_HIP].x * w),
                  int(landmarks[mp_pose.PoseLandmark.LEFT_HIP].y * h))
        right_hip = (int(landmarks[mp_pose.PoseLandmark.RIGHT_HIP].x * w),
                   int(landmarks[mp_pose.PoseLandmark.RIGHT_HIP].y * h))
        
        # Calculate reference points
        shoulder_center_x = (left_shoulder[0] + right_shoulder[0]) // 2
        shoulder_center_y = (left_shoulder[1] + right_shoulder[1]) // 2
        
        hip_center_x = (left_hip[0] + right_hip[0]) // 2
        hip_center_y = (left_hip[1] + right_hip[1]) // 2
        
        # Kids proportions need different scaling
        shoulder_width = np.linalg.norm(np.array(left_shoulder) - np.array(right_shoulder))
        item_width = int(shoulder_width * 1.9)  # Wider for kids clothes
        
        torso_height = np.linalg.norm(np.array([shoulder_center_x, shoulder_center_y]) - 
                                    np.array([hip_center_x, hip_center_y]))
        item_height = int(torso_height * 1.4)  # Taller for kids clothes
        
        # Ensure minimum dimensions
        item_width = max(item_width, 80)  # Smaller minimum for kids
        item_height = max(item_height, 120)  # Smaller minimum for kids
        
        # Resize the item while maintaining aspect ratio
        original_aspect = item_img.shape[0] / item_img.shape[1]
        target_aspect = item_height / item_width
        
        if target_aspect > original_aspect:
            actual_height = item_height
            actual_width = int(item_height / original_aspect)
        else:
            actual_width = item_width
            actual_height = int(item_width * original_aspect)
        
        # Resize the item
        try:
            resized_item = cv2.resize(item_img, (actual_width, actual_height), 
                                    interpolation=cv2.INTER_AREA)
        except Exception as e:
            print(f"Resize error: {e} - Size: {actual_width}x{actual_height}")
            return
            
        # Position for kids needs a higher placement
        x_offset = shoulder_center_x - actual_width // 2
        y_offset = shoulder_center_y - int(actual_height * 0.25)  # Higher placement for kids
        
        # Check boundaries
        if x_offset < 0: x_offset = 0
        if y_offset < 0: y_offset = 0
        if x_offset + actual_width > w: x_offset = w - actual_width
        if y_offset + actual_height > h: y_offset = h - actual_height
        
        # Prepare region of interest
        roi = frame[y_offset:y_offset+actual_height, x_offset:x_offset+actual_width]
        
        # Check if ROI has valid dimensions
        if roi.shape[0] <= 0 or roi.shape[1] <= 0 or \
           roi.shape[0] != resized_item.shape[0] or roi.shape[1] != resized_item.shape[1]:
            return
            
        # Apply alpha blending for transparent item
        if resized_item.shape[2] == 4:  # With alpha channel
            alpha_s = resized_item[:, :, 3] / 255.0
            alpha_l = 1.0 - alpha_s
            
            # Apply blending for each color channel
            for c in range(3):
                roi[:, :, c] = (alpha_s * resized_item[:, :, c] + alpha_l * roi[:, :, c])
        else:
            # Just copy the resized item (no transparency)
            roi[:] = resized_item[:, :, :3]
    except Exception as e:
        print(f"Overlay kids error: {e}")

# Endpoint to select a clothing item
@app.route('/select_item', methods=['POST'])
def select_item():
    try:
        data = request.json
        session_id = data.get('session_id')
        category = data.get('category')
        item_name = data.get('item_name')

        if not session_id or not category or not item_name:
            return jsonify({"error": "Missing required parameters"}), 400
        
        if session_id not in sessions:
            sessions[session_id] = {"selected_item": None, "selected_category": None, "show_debug": False}
        
        try:
            # Load the selected item
            item_path = os.path.join(ITEMS_FOLDER, category, item_name)
            if not os.path.exists(item_path):
                return jsonify({"error": f"Item not found: {item_path}"}), 404
            
            item_img = cv2.imread(item_path, cv2.IMREAD_UNCHANGED)
            if item_img is None:
                return jsonify({"error": "Failed to load item image"}), 500
            
            # Store in session
            sessions[session_id]["selected_item"] = item_img
            sessions[session_id]["selected_category"] = category
            
            return jsonify({"status": "success", "message": f"Selected {item_name} in {category}"})
        except Exception as e:
            return jsonify({"error": str(e), "details": "Error loading item"}), 500
    except Exception as e:
        return jsonify({"error": str(e), "details": "Error processing request"}), 500

# Endpoint to get available items
@app.route('/get_items/<category>')
def get_items(category):
    try:
        # Print for debugging
        print(f"Fetching items for category: {category}")
        
        category_path = os.path.join(ITEMS_FOLDER, category)
        print(f"Looking in path: {category_path}")

        if not os.path.exists(category_path):
            print(f"Category folder not found: {category_path}")
            return jsonify({"error": f"Category not found: {category}"}), 404
        
        try:
            # Get all items in the category
            items = sorted([f for f in os.listdir(category_path) if f.lower().endswith((".png", ".jpg", ".jpeg"))])
            print(f"Found {len(items)} items in {category}")
            
            # Create thumbnail data for each item
            items_data = []
            for item in items:
                item_path = os.path.join(category_path, item)
                
                try:
                    # Create a thumbnail
                    img = cv2.imread(item_path)
                    if img is not None:
                        img = cv2.resize(img, (120, 120))
                        _, buffer = cv2.imencode('.jpg', img)
                        img_base64 = base64.b64encode(buffer).decode('utf-8')
                        
                        items_data.append({
                            "name": item,
                            "thumbnail": f"data:image/jpeg;base64,{img_base64}"
                        })
                except Exception as e:
                    print(f"Error processing thumbnail for {item}: {e}")
            
            return jsonify({"items": items_data})
        except Exception as e:
            print(f"Error processing items: {str(e)}")
            return jsonify({"error": str(e), "details": "Error processing items"}), 500
    except Exception as e:
        print(f"General error in get_items: {str(e)}")
        return jsonify({"error": str(e), "details": "Error handling request"}), 500

# Toggle debug mode
@app.route('/toggle_debug', methods=['POST'])
def toggle_debug():
    try:
        data = request.json
        session_id = data.get('session_id')
        show_debug = data.get('show_debug')

        if not session_id:
            return jsonify({"error": "Missing session_id"}), 400
        
        if session_id not in sessions:
            sessions[session_id] = {"selected_item": None, "selected_category": None, "show_debug": False}
        
        sessions[session_id]["show_debug"] = show_debug
        
        return jsonify({"status": "success", "debug_mode": show_debug})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Create a new session
@app.route('/create_session', methods=['POST'])
def create_session():
    try:
        session_id = f"session_{len(sessions) + 1}"
        sessions[session_id] = {"selected_item": None, "selected_category": None, "show_debug": False}
        camera_status[session_id] = True  # Initialize camera as enabled
        return jsonify({"session_id": session_id})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# List available categories
@app.route('/get_categories')
def get_categories():
    try:
        categories = []
        for category in ["Mens", "Womens", "Kids"]:
            category_path = os.path.join(ITEMS_FOLDER, category)
            if os.path.exists(category_path):
                item_count = len([f for f in os.listdir(category_path) if f.lower().endswith((".png", ".jpg", ".jpeg"))])
                categories.append({
                    "name": category,
                    "item_count": item_count
                })
        
        return jsonify({"categories": categories})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Health check endpoint
@app.route('/health')
def health_check():
    return jsonify({
        "status": "healthy",
        "active_sessions": len(sessions),
        "camera_statuses": camera_status,
        "categories_available": os.path.exists(ITEMS_FOLDER) and len(os.listdir(ITEMS_FOLDER))
    })

# Route to check folder structure
@app.route('/debug/folder_structure')
def debug_folder_structure():
    try:
        structure = {}
        
        if os.path.exists(BASE_FOLDER):
            structure["base_folder"] = {
                "exists": True,
                "path": os.path.abspath(BASE_FOLDER)
            }
            
            if os.path.exists(ITEMS_FOLDER):
                structure["items_folder"] = {
                    "exists": True,
                    "path": os.path.abspath(ITEMS_FOLDER),
                    "contents": {}
                }
                
                for category in ["Mens", "Womens", "Kids"]:
                    category_path = os.path.join(ITEMS_FOLDER, category)
                    if os.path.exists(category_path):
                        files = [f for f in os.listdir(category_path) if f.lower().endswith((".png", ".jpg", ".jpeg"))]
                        structure["items_folder"]["contents"][category] = {
                            "exists": True,
                            "path": os.path.abspath(category_path),
                            "file_count": len(files),
                            "files": files[:5]  # Just show first 5 files
                        }
                    else:
                        structure["items_folder"]["contents"][category] = {
                            "exists": False,
                            "path": os.path.abspath(category_path)
                        }
            else:
                structure["items_folder"] = {
                    "exists": False,
                    "path": os.path.abspath(ITEMS_FOLDER)
                }
        else:
            structure["base_folder"] = {
                "exists": False,
                "path": os.path.abspath(BASE_FOLDER)
            }
            
        return jsonify(structure)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    try:
        # Ensure the Resources directory exists
        os.makedirs(ITEMS_FOLDER, exist_ok=True)

        # Create folders for categories if they don't exist
        for category in ["Mens", "Womens", "Kids"]:
            category_folder = os.path.join(ITEMS_FOLDER, category)
            os.makedirs(category_folder, exist_ok=True)
            print(f"Category folder created/verified: {category_folder}")
        
        # Try running without debug mode first
        print("Starting Flask server on port 5000...")
        print("Access the application at http://localhost:5000")
        print("Press Ctrl+C to stop the server")
        
        # Modified to avoid Windows-specific console errors
        app.run(debug=False, port=5000)
    except Exception as e:
        print(f"Error starting the application: {e}")