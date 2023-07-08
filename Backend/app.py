from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import os
import time
import threading
from werkzeug.utils import secure_filename

app = Flask(__name__)

# allow all origins
CORS(app, resources={r"/*": {"origins": "*"}})


@app.route('/api/ip', methods=['GET'])
def getIp():
    forwarded_ips = request.headers.get('X-Forwarded-For', '').split(',')
    remote_addr = forwarded_ips[0].strip() if forwarded_ips else request.remote_addr
    return jsonify({'ip': remote_addr})

@app.route('/api/text', methods=['GET'])
def getText():
    forwarded_ips = request.headers.get('X-Forwarded-For', '').split(',')
    remote_addr = forwarded_ips[0].strip() if forwarded_ips else request.remote_addr
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

    forwarded_ips = request.headers.get('X-Forwarded-For', '').split(',')
    remote_addr = forwarded_ips[0].strip() if forwarded_ips else request.remote_addr

    file_path = f'./text/{remote_addr}.txt'
    if not os.path.exists('./text'):
        os.makedirs('./text')
    with open(file_path, 'w+') as txt_file:
        txt_file.write(text)
    
    # Start a thread to delete the file after 30 minutes
    delete_thread = threading.Thread(target=delete_file, args=(file_path,))
    delete_thread.start()
    return 'added text'

def delete_file(file_path):
    time.sleep(60)  # Delay for 30 minutes
    try:
        os.remove(file_path)  # Delete the file
        print(f"File {file_path} deleted successfully.")
    except Exception as e:
        print(f"Error deleting file: {e}")


@app.route('/api/files', methods=['POST'])
def uploadFiles():
    # get files from the form data
    file = request.files.get('file')
    print(file)
    # forwarded_ips = request.headers.get('X-Forwarded-For', '').split(',')
    # remote_addr = forwarded_ips[0].strip() if forwarded_ips else request.remote_addr
    remote_addr = request.remote_addr
    print(remote_addr)
    if not os.path.exists(f'./uploads/{remote_addr}'):
        os.makedirs(f'./uploads/{remote_addr}')

    file_path = os.path.join(f'./uploads/{remote_addr}', secure_filename(file.filename))
    file.save(file_path)

    return 'uploaded files'

@app.route('/api/files', methods=['GET'])
def getFiles():
    # forwarded_ips = request.headers.get('X-Forwarded-For', '').split(',')
    # remote_addr = forwarded_ips[0].strip() if forwarded_ips else request.remote_addr
    remote_addr = request.remote_addr
    print(remote_addr)
    if not os.path.exists(f'./uploads/{remote_addr}'):
        return jsonify({'files': []})
    #send files size and name
    files = []
    for file in os.listdir(f'./uploads/{remote_addr}'):
        files.append({
            'name': file,
            'size': os.path.getsize(f'./uploads/{remote_addr}/{file}')}),
    return jsonify({'files': files})


@app.route('/api/files/<filename>', methods=['GET'])
def downloadFile(filename):
    # forwarded_ips = request.headers.get('X-Forwarded-For', '').split(',')
    # remote_addr = forwarded_ips[0].strip() if forwarded_ips else request.remote_addr
    remote_addr = request.remote_addr
    print(remote_addr)
    if not os.path.exists(f'./uploads/{remote_addr}'):
        return jsonify({'files': []})
    #send files size and name
    files = []
    for file in os.listdir(f'./uploads/{remote_addr}'):
        if file == filename:
            return send_from_directory(f'./uploads/{remote_addr}', filename)
    return jsonify({'files': []})

if __name__ == "__main__":
    app.run(debug=True, host='0.0.0.0')



