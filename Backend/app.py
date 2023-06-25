from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import time
import threading

app = Flask(__name__)

# allow all origins
CORS(app, resources={r"/*": {"origins": "*"}})




@app.route('/api/text', methods=['GET'])
def getText():
    remote_addr = request.remote_addr
    file_path = f'./text/{remote_addr}.txt'
    if os.path.exists(file_path):
        with open(file_path, 'r') as txt_file:
            text = txt_file.read()
        return jsonify({'text': text})
    else:
        return jsonify({'text': ''})

@app.route('/api/text', methods=['POST'])
def setText():
    text = request.get_json()['text']
    remote_addr = request.remote_addr
    file_path = f'./text/{remote_addr}.txt'
    with open(file_path, 'w+') as txt_file:
        txt_file.write(text)
    
    # Start a thread to delete the file after 30 minutes
    delete_thread = threading.Thread(target=delete_file, args=(file_path,))
    delete_thread.start()
    return 'added text'

def delete_file(file_path):
    time.sleep(10)  # Delay for 30 minutes
    try:
        os.remove(file_path)  # Delete the file
        print(f"File {file_path} deleted successfully.")
    except Exception as e:
        print(f"Error deleting file: {e}")


if __name__ == "__main__":
    app.run(debug=True, host='0.0.0.0')