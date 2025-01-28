from flask import Flask, request, jsonify
import subprocess
from flask_cors import CORS
import logging

app = Flask(__name__)
CORS(app)

# Set up logging
logging.basicConfig(level=logging.DEBUG)

@app.route('/chat', methods=['POST'])
def chat():
    user_message = request.json.get('message')
    app.logger.debug(f"Received message: {user_message}")

    try:
        # Run the Ollama command and capture the output
        process = subprocess.Popen(
            ["ollama", "run", "deepseek-r1:8b"],
            stdin=subprocess.PIPE,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True  # Ensure text mode is used to handle encoding
        )
        
        # Communicate with the subprocess and handle input/output correctly
        stdout, stderr = process.communicate(input=user_message)

        if process.returncode != 0:
            app.logger.error(f"Error running command: {stderr}")
            return jsonify({"error": stderr}), 500

        # Prepare a response message ensuring it's UTF-8 encoded
        response_message = f"Hello! You sent: {stdout.strip()}"  # Modify as needed for your application

        # Ensure the output response is sent as UTF-8 encoded JSON
        response = jsonify({"response": response_message})  
        response.headers['Content-Type'] = 'application/json; charset=utf-8'  # Ensure UTF-8 content
        return response
    
    except Exception as e:
        app.logger.error(f"Error processing message: {e}")
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0')  # Allow external access if needed
