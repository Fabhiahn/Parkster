from flask import Flask, jsonify
from flask_cors import CORS
import requests
from flask_jwt_extended import JWTManager, jwt_required, get_jwt_identity
import os

app = Flask(__name__)
app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY', 'default_secret_key')
jwt = JWTManager(app)
CORS(app)

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
