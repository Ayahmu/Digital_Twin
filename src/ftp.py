from flask import Flask, jsonify, request

app = Flask(__name__)


@app.route('/api/data', methods=['POST'])
def get_data():
    data = {'message': 'Hello from Flask'}
    print(request.json)
    return jsonify(data)


if __name__ == '__main__':
    app.run(host='192.168.0.174', port='8003', debug=True)
