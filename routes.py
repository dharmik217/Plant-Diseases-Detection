from flask import render_template, request, jsonify, url_for
from werkzeug.utils import secure_filename
from PIL import Image
import os
import numpy as np
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing import image

# Load pre-trained model
try:
    model = load_model("my_model.keras")
except Exception as e:
    print(f"Error loading model: {e}")
    model = None

ALLOWED_EXTENSIONS = {"jpg", "jpeg", "png", "gif"}
UPLOAD_FOLDER = "uploads"

def allowed_file(filename):
    return "." in filename and filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS

def setup_routes(app):
    """Set up all routes for the Flask application."""

    # Ensure the upload folder exists
    os.makedirs(UPLOAD_FOLDER, exist_ok=True)
    app.config["UPLOAD_FOLDER"] = UPLOAD_FOLDER

    @app.route("/")
    def home():
        return render_template("index.html")

    @app.route('/services')
    def services():
        return render_template('service.html')

    @app.route("/about")
    def about():
        return render_template("about.html")

    @app.route("/contact")
    def contact():
        return render_template("contact.html")

    @app.route('/predict', methods=['GET'])
    def predict():
        return render_template('predict.html')

    @app.route('/fertilizer')
    def fertilizer():
        return render_template('fertilizer.html')

    @app.route('/treatment', methods=['GET'])
    def treatment():
        return render_template('treatment.html')

    @app.route('/black', methods=['GET'])
    def black():
        return render_template('treatments/black.html')
    
    @app.route('/scab')
    def scab():
        return render_template('treatments/scab.html')  

    @app.route('/cedar')
    def cedar():
        return render_template('treatments/cedar.html')  
    
    @app.route('/CommonRust')
    def CommonRust():
        return render_template('treatments/CommonRust.html')

    @app.route('/NorthernLeaf')
    def NorthernLeaf():
        return render_template('treatments/NorthernLeaf.html')   
    
    @app.route('/CornHealthy')
    def CornHealthy():
        return render_template('treatments/CornHealthy.html')
    
    @app.route('/GrapeBlackRot')
    def GrapeBlackRot():
        return render_template('treatments/GrapeBlackRot.html')
    
    @app.route('/GrapeEsca')
    def GrapeEsca():
        return render_template('treatments/GrapeEsca.html')
    
    @app.route('/GrapeBlight')
    def GrapeBlight():
        return render_template('treatments/GrapeBlight.html')
    
    @app.route('/GrapeHealthy')
    def GrapeHealthy():
        return render_template('treatments/GrapeHealthy.html')
    
    @app.route('/TomatoBacterial')
    def TomatoBacterial():
        return render_template('treatments/TomatoBacterial.html')
    
    @app.route('/TomatoEarlyBlight')
    def TomatoEarlyBlight():
        return render_template('treatments/TomatoEarlyBlight.html')
    
    @app.route('/TomatoLateBlight')
    def TomatoLateBlight():
        return render_template('treatments/TomatoLateBlight.html')
    
    @app.route('/TomatoLeafMold')
    def TomatoLeafMold():
        return render_template('treatments/TomatoLeafMold.html')
    
    @app.route('/TomatoSeptoriaLeaf')
    def TomatoSeptoriaLeaf():
        return render_template('treatments/TomatoSeptoriaLeaf.html')
    
    @app.route('/TomatoSpiderMites')
    def TomatoSpiderMites():
        return render_template('treatments/TomatoSpiderMites.html')
    
    @app.route('/TomatoTargetSpot')
    def TomatoTargetSpot():
        return render_template('treatments/TomatoTargetSpot.html')
    
    @app.route('/TomatoYellowLeaf')
    def TomatoYellowLeaf():
        return render_template('treatments/TomatoYellowLeaf.html')
    
    @app.route('/TomatoMosaicVirus')
    def TomatoMosaicVirus():
        return render_template('treatments/TomatoMosaicVirus.html')
    
    @app.route('/TomatoHealthy')
    def TomatoHealthy():
        return render_template('treatments/TomatoHealthy.html')
    
    @app.route('/PeachBacterial')
    def PeachBacterial():
        return render_template('treatments/PeachBacterial.html')

    @app.route('/PeachHealthy')
    def PeachHealthy():
        return render_template('treatments/PeachHealthy.html')
    
    @app.route('/PepperBacterial')
    def PepperBacterial():
        return render_template('treatments/PepperBacterial.html')
    
    @app.route('/PepperHealthy')
    def PepperHealthy():
        return render_template('treatments/PepperHealthy.html')
    
    @app.route('/PotatoEarlyBlight')
    def PotatoEarlyBlight():
        return render_template('treatments/PotatoEarlyBlight.html')
    
    @app.route('/PotatoLateBlight')
    def PotatoLateBlight():
        return render_template('treatments/PotatoLateBlight.html')
    
    @app.route('/PotatoHealthy')
    def PotatoHealthy():
        return render_template('treatments/PotatoHealthy.html')
    
    @app.route('/StrawberryLeafScorch')
    def StrawberryLeafScorch():
        return render_template('treatments/StrawberryLeafScorch.html')
    
    @app.route('/StrawberryHealthy')
    def StrawberryHealthy():
        return render_template('treatments/StrawberryHealthy.html')

    @app.route('/Grayleaf')
    def Grayleaf():
        return render_template('treatments/Grayleaf.html') 

    @app.route("/predict", methods=["POST"])
    def predict_post():
        global model  # Ensure we're using the global model variable

        if not model:
            return jsonify({"error": "Model not loaded. Contact administrator."}), 500

        if "plantImage" not in request.files:
            return jsonify({"error": "No file part"}), 400

        file = request.files["plantImage"]

        if file.filename == "":
            return jsonify({"error": "No selected file"}), 400

        if not allowed_file(file.filename):
            return jsonify({"error": "File type not allowed"}), 400

        filename = secure_filename(file.filename)
        filepath = os.path.join(app.config["UPLOAD_FOLDER"], filename)

        try:
            # Save the uploaded file
            file.save(filepath)

            # Process the image
            img = Image.open(filepath)
            img = img.resize((256, 256))
            img_array = image.img_to_array(img)
            img_array = np.expand_dims(img_array, axis=0)
            img_array = img_array / 255.0

            # Make prediction
            prediction = model.predict(img_array)
            predicted_class = np.argmax(prediction, axis=1)

            # Define disease labels, descriptions, and dynamic links
            disease_info = {
                'Apple___Apple_scab': {
                    "description": "Apple scab is a fungal disease caused by Venturia inaequalis, leading to dark, scaly lesions on leaves and fruit. Infected leaves may become distorted and drop prematurely, reducing fruit yield. The disease thrives in cool, wet conditions, spreading through fungal spores. Proper pruning and fungicide application help control its spread.",
                },
                'Apple___Black_rot': {
                    "description": "Black rot, caused by Botryosphaeria obtusa, affects apples by creating dark, sunken spots on fruit, which later turn into black, decayed areas. It also causes leaf blight, leading to yellowing and premature leaf drop. The disease spreads through infected plant debris and humid conditions. Removing infected branches and applying fungicides can help manage it.",
                },
                'Apple_Cedar___apple___rust': {
                    "description": "Cedar-apple rust is a fungal disease caused by Gymnosporangium juniperi-virginianae, which creates yellow-orange spots on apple leaves, sometimes leading to defoliation. It requires both apple and cedar trees to complete its life cycle. In severe cases, it can cause fruit deformities and yield reduction. Controlling nearby cedar trees and using resistant apple varieties can help prevent infection.",
                },
                'Apple___healthy': {
                    "description": "This plant appears to be in good health, showing no signs of disease. Healthy apple trees have vibrant green leaves, smooth fruit, and strong branches. Regular monitoring, proper fertilization, and good watering practices ensure continued growth and resistance to diseases.",
                },      
                'Grape___Black_rot': {
                 "description": "Black rot of grape, caused by the fungus Guignardia bidwellii, appears as small, round, brownish-black spots on leaves, shoots, and berries. The infected berries shrivel into hard, black mummies. Warm, humid weather favors its spread. Pruning, removing mummified berries, and applying fungicides are effective control measures.",
                },
                'Grape___Esca_(Black_Measles)': {
                    "description": "Esca, also known as Black Measles, is a complex grapevine disease caused by several fungi. Symptoms include tiger-stripe patterns on leaves, berry spotting, and internal wood decay. It spreads through pruning wounds. Preventative pruning techniques and avoiding stress on vines are key management strategies.",
                },
                'Grape___Leaf_blight_(Isariopsis_Leaf_Spot)': {
                    "description": "Leaf blight in grapes, caused by Isariopsis clavispora, presents as angular, brown to black spots on leaves, leading to premature defoliation. Severe infections reduce fruit yield and quality. It thrives in moist environments. Control includes canopy management and fungicide sprays.",
                },
                'Grape___healthy': {
                    "description": "This grape plant appears healthy, with clean, green leaves and plump, unblemished fruit. A healthy grapevine is free of spots, mold, or shriveling. Regular pruning, proper irrigation, and disease monitoring help maintain vigor and yield.",
                },
                'Tomato___Bacterial_spot': {
                    "description": "Bacterial spot on tomato is caused by Xanthomonas species, resulting in dark, water-soaked lesions on leaves, stems, and fruit. It reduces marketability and plant health. Spread is enhanced by rain and wind. Copper-based sprays and crop rotation can help control it.",
                },
                'Tomato___Early_blight': {
                    "description": "Early blight, caused by Alternaria solani, leads to brown spots with concentric rings on lower leaves and stem lesions. It weakens the plant and affects yield. Moist, warm conditions favor its development. Crop rotation and fungicides help manage it.",
                },
                'Tomato___Late_blight': {
                    "description": "Late blight is a severe disease caused by Phytophthora infestans, leading to large, dark lesions on leaves and fruit, with white fungal growth under humid conditions. It spreads rapidly and destroys crops. Resistant varieties and fungicide applications are essential.",
                },
                'Tomato___Leaf_Mold': {
                    "description": "Leaf mold, caused by Passalora fulva, appears as pale green to yellow spots on the upper leaf surface and olive-green mold underneath. It thrives in warm, humid greenhouses. Good ventilation and fungicides help manage outbreaks.",
                },
                'Tomato___Seporia_leaf_spot': {
                    "description": "Septoria leaf spot is caused by Septoria lycopersici and results in small, circular spots with dark borders and gray centers. It begins on lower leaves and can cause significant defoliation. Remove infected foliage and apply fungicides to control.",
                },
                'Tomato___Spider_mites_Two-spotted_spider_mite': {
                    "description": "Two-spotted spider mites cause stippling and bronzing of tomato leaves, which may curl and drop. Fine webbing is often visible. They thrive in hot, dry conditions. Mite control includes insecticidal soap and predatory mites.",
                },
                'Tomato___Target_Spot': {
                    "description": "Target spot, caused by Corynespora cassiicola, forms round lesions with concentric rings on leaves, stems, and fruit. It leads to defoliation and fruit drop. Warm, humid environments promote the disease. Cultural controls and fungicides help reduce spread.",
                },
                'Tomato___Tomato_Yellow_Leaf_Curl_Virus': {
                    "description": "This viral disease is transmitted by whiteflies and causes yellowing, upward curling leaves, stunted growth, and reduced fruit production. Controlling whiteflies and planting resistant varieties are key preventive measures.",
                },
                'Tomato___Tomato_mosaic_virus': {
                    "description": "Tomato mosaic virus causes mottled, discolored leaves, distorted growth, and reduced yield. It spreads through contact with infected tools or hands. Sanitation and resistant varieties help manage the disease.",
                },
                'Tomato___healthy': {
                    "description": "This tomato plant shows no signs of disease. Leaves are lush and green, stems are strong, and fruits are well-formed. Regular watering, fertilization, and monitoring promote healthy growth.",
                },
                'Peach___Bacterial_spot': {
                    "description": "Bacterial spot in peaches, caused by Xanthomonas arboricola pv. pruni, leads to dark lesions on leaves, twigs, and fruit. Fruit spots may crack and deform. Warm, wet weather promotes spread. Use resistant varieties and copper sprays to manage.",
                },
                'Peach___healthy': {
                    "description": "This peach tree appears healthy with full, green foliage and smooth, spot-free fruit. Strong growth and good flowering indicate no signs of bacterial or fungal infections. Regular care and observation keep it disease-free.",
                },
                'Pepper_bell___Bacterial_spot': {
                    "description": "Bacterial spot in bell peppers causes dark, greasy lesions on leaves and fruit, leading to leaf drop and fruit blemishes. It spreads through water splash and infected seeds. Copper sprays and resistant varieties are effective control methods.",
                },
                'Pepper_bell___healthy': {
                    "description": "This bell pepper plant is healthy, displaying vibrant green leaves and well-formed fruits. No signs of bacterial or fungal issues are present. Good irrigation, spacing, and monitoring promote continued health.",
                },
                'Potato___Early_blight': {
                    "description": "Early blight in potatoes, caused by Alternaria solani, presents as dark spots with concentric rings on older leaves. It can reduce tuber quality and yield. Moisture management and fungicide application are key control methods.",
                },
                'Potato___Late_blight': {
                    "description": "Late blight, caused by Phytophthora infestans, causes dark, water-soaked lesions on leaves and stems, often with a white fringe under humid conditions. It spreads quickly and can destroy crops. Use certified seed, remove infected plants, and apply fungicides.",
                },
                'Potato___healthy': {
                    "description": "This potato plant is healthy, with full green leaves and no signs of disease or stress. Proper spacing, hilling, and monitoring ensure good tuber development and plant vitality.",
                }

            }

            # Get disease details
            disease_name = list(disease_info.keys())[predicted_class[0]]
            disease_description = disease_info[disease_name]["description"]

            # Generate dynamic links
            treatment_link = url_for('treatment')
            fertilizer_link = url_for('fertilizer')

            return jsonify({
                "prediction": disease_name,
                "description": disease_description,
                "treatment_link": treatment_link,
                "fertilizer_link": fertilizer_link
            })

        except Exception as e:
            import traceback
            traceback.print_exc()
            return jsonify({"error": "An error occurred during prediction."}), 500
