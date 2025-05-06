from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
from PIL import Image, ImageDraw, ImageFont
import io

app = Flask(__name__)
CORS(app)

def create_dummy_image(description):
    img = Image.new('RGB', (1024, 1024), color=(255, 255, 255))

    draw = ImageDraw.Draw(img)

    font = ImageFont.load_default()
    text = f"Outfit: {description}"
    text_size = draw.textsize(text, font=font)
    text_position = ((1024 - text_size[0]) // 2, (1024 - text_size[1]) // 2)

    draw.text(text_position, text, font=font, fill=(0, 0, 0))

    img_byte_arr = io.BytesIO()
    img.save(img_byte_arr, format='PNG')
    img_byte_arr.seek(0)

    return img_byte_arr

@app.route('/api/generate-outfit', methods=['POST'])
def generate_outfit():
    data = request.get_json()
    description = data.get('description')

    if not description:
        return jsonify({'error': 'Description is required'}), 400

    try:
        img = create_dummy_image(description)

        # Send the image as a response
        return send_file(img, mimetype='image/png', as_attachment=False, download_name="outfit.png")

    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
     app.run(debug=True, port=3005)
