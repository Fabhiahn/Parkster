from flask import Flask, jsonify
from flask_cors import CORS
import requests
from flask_jwt_extended import JWTManager, jwt_required, get_jwt_identity
from prometheus_flask_exporter import PrometheusMetrics
import os
import logging

app = Flask(__name__)
app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY', 'default_secret_key')
jwt = JWTManager(app)
metrics = PrometheusMetrics(app)
CORS(app)

# Configure logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

# Route to fetch Amsterdam parking data
@app.route("/parking", methods=["GET"])
@jwt_required()
def get_parking_data():
    try:
        current_user = get_jwt_identity()
        app.logger.info(f"Current user: {current_user}")

        # Fetch data from Amsterdam API
        amsterdam_api_url = "https://p-info.vorin-amsterdam.nl/v1/ParkingLocation.json"
        response = requests.get(amsterdam_api_url)
        parking_data = response.json()

        # Process the data (extract useful fields)
        processed_data = [
            {
                "id": feature["Id"],
                "name": feature["properties"]["Name"],
                "shortCapacity": int(feature["properties"]["ShortCapacity"]) if feature["properties"]["ShortCapacity"] else 0,
                "freeSpaceShort": int(feature["properties"]["FreeSpaceShort"]) if feature["properties"]["FreeSpaceShort"] else 0,
                "longCapacity": int(feature["properties"]["LongCapacity"]) if feature["properties"]["LongCapacity"] else 0,
                "freeSpaceLong": int(feature["properties"]["FreeSpaceLong"]) if feature["properties"]["FreeSpaceLong"] else 0,
                "latitude": feature["geometry"]["coordinates"][1],
                "longitude": feature["geometry"]["coordinates"][0],
            }
            for feature in parking_data["features"]
            if feature["properties"]["State"] != "error" and
               not (
                   (feature["properties"]["ShortCapacity"] in ["0", ""] and
                    feature["properties"]["LongCapacity"] in ["0", ""]) or
                   feature["properties"]["Status"] == "GESLOTEN"
               )

        ]

        return jsonify(processed_data)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/health/liveness", methods=["GET"])
def liveness():
    """Liveness check to ensure the application is running."""
    return jsonify({"status": "alive"}), 200

@app.route("/health/readiness", methods=["GET"])
def readiness():
    """Readiness check to ensure the application is ready to serve traffic."""
    try:
        # Optionally check connectivity to the Amsterdam API
        amsterdam_api_url = "https://p-info.vorin-amsterdam.nl/v1/ParkingLocation.json"
        response = requests.get(amsterdam_api_url)
        if response.status_code != 200:
            raise Exception("Amsterdam API not reachable")
        
        return jsonify({"status": "ready"}), 200
    except Exception as e:
        app.logger.error(f"Readiness check failed: {str(e)}")
        return jsonify({"status": "not ready", "error": str(e)}), 503
