// Image preview functionality
const plantImageInput = document.getElementById('plantImage');
const previewImage = document.getElementById('preview-image');

plantImageInput.addEventListener('change', (event) => {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            previewImage.src = e.target.result;
            previewImage.style.display = 'block';
        };
        reader.readAsDataURL(file);
    }
});

// Form submission logic
const form = document.getElementById('predictForm');
const resultBox = document.getElementById('prediction-result');
const resultText = document.getElementById('result-text');

form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const formData = new FormData(form);
    resultBox.style.display = 'none'; // Hide previous results

    try {
        const response = await fetch('/predict', {
            method: 'POST',
            body: formData,
        });

        const data = await response.json();
        if (response.ok) {
            // Create result HTML with both treatment and fertilizer links
            let resultHTML = `<strong>Prediction:</strong> ${data.prediction} <br>
                              <strong>Description:</strong> ${data.description}`;

            // Add treatment link
            if (data.treatment_link) {
                resultHTML += `<br><a href="${data.treatment_link}">🔹 Treatment Details</a>`;
            }

            // Add fertilizer link
            if (data.fertilizer_link) {
                resultHTML += `<br><a href="${data.fertilizer_link}">🔸 Fertilizer Suggestions</a>`;
            }

            resultText.innerHTML = resultHTML;
            resultBox.style.display = 'block';
        } else {
            throw new Error(data.error || 'Prediction failed');
        }
    } catch (error) {
        resultText.textContent = `Error: ${error.message}`;
        resultBox.style.display = 'block';
    }
});
document.getElementById('predictForm').addEventListener('submit', async function(event) {
    event.preventDefault();

    const formData = new FormData(this);
    document.getElementById('prediction-result').style.display = 'none';

    try {
        const response = await fetch('/predict', {
            method: 'POST',
            body: formData
        });

        const data = await response.json();
        if (response.ok) {
            document.getElementById('prediction').textContent = data.prediction;
            document.getElementById('description').textContent = data.description;
            document.getElementById('treatment-link').href = data.treatment_link;
            document.getElementById('fertilizer-link').href = data.fertilizer_link;

            document.getElementById('prediction-result').style.display = 'block';
            storeTranslations(data);
        } else {
            alert("Error: " + data.error);
        }
    } catch (error) {
        alert("Error: " + error.message);
    }
});

const translations = {
    en: {},
    hi: {},
    gu: {}
};

function storeTranslations(data) {
    translations.en = {
        prediction: data.prediction,
        description: data.description,
        treatment: "🔹 Treatment Details",
        fertilizer: "🔸 Fertilizer Suggestions"
    };

    const hindi = {
        "Apple___Apple_scab": "सेब की पपड़ी",
        "Apple___Black_rot": "काला सड़न",
        "Apple_Cedar___apple___rust": "देवदार-सेब जंग",
        "Apple___healthy": "पौधा स्वस्थ है!",
        "Apple scab is a fungal disease caused by Venturia inaequalis, leading to dark, scaly lesions on leaves and fruit. Infected leaves may become distorted and drop prematurely, reducing fruit yield. The disease thrives in cool, wet conditions, spreading through fungal spores. Proper pruning and fungicide application help control its spread.":
            "सेब का स्कैब एक फफूंद जनित रोग है जो पत्तियों और फलों पर काले, परतदार धब्बे बनाता है। संक्रमित पत्तियां विकृत हो सकती हैं और समय से पहले गिर सकती हैं, जिससे फसल उत्पादन प्रभावित होता है। यह रोग ठंडे और नम मौसम में फैलता है और फफूंद बीजाणुओं के माध्यम से फैलता है। उचित छंटाई और फफूंदनाशकों के उपयोग से इसे नियंत्रित किया जा सकता है।",
        "Black rot, caused by Botryosphaeria obtusa, affects apples by creating dark, sunken spots on fruit, which later turn into black, decayed areas. It also causes leaf blight, leading to yellowing and premature leaf drop. The disease spreads through infected plant debris and humid conditions. Removing infected branches and applying fungicides can help manage it.":
            "ब्लैक रॉट, जो *Botryosphaeria obtusa* के कारण होता है, सेब को प्रभावित करता है, जिससे गहरे, धंसे हुए धब्बे बनते हैं, जो बाद में सड़ने लगते हैं। यह पत्तों को पीला कर देता है और समय से पहले गिरने का कारण बनता है। यह रोग संक्रमित पौधों के अवशेषों और आर्द्र जलवायु में फैलता है। संक्रमित शाखाओं को हटाने और फफूंदनाशकों का उपयोग करने से इसे नियंत्रित किया जा सकता है।",
        "Cedar-apple rust is a fungal disease caused by Gymnosporangium juniperi-virginianae, which creates yellow-orange spots on apple leaves, sometimes leading to defoliation. It requires both apple and cedar trees to complete its life cycle. In severe cases, it can cause fruit deformities and yield reduction. Controlling nearby cedar trees and using resistant apple varieties can help prevent infection.":
            "देवदार-सेब जंग एक फफूंद रोग है जो *Gymnosporangium juniperi-virginianae* के कारण होता है, जिससे सेब के पत्तों पर पीले-नारंगी धब्बे बनते हैं। कभी-कभी यह पत्तियों के झड़ने का कारण बन सकता है। इस रोग को बढ़ने के लिए सेब और देवदार दोनों पेड़ों की आवश्यकता होती है। गंभीर मामलों में, यह फलों को भी विकृत कर सकता है और पैदावार को कम कर सकता है। पास के देवदार के पेड़ों को हटाकर और प्रतिरोधी सेब की किस्मों का उपयोग करके इसे रोका जा सकता है।",
        "This plant appears to be in good health, showing no signs of disease. Healthy apple trees have vibrant green leaves, smooth fruit, and strong branches. Regular monitoring, proper fertilization, and good watering practices ensure continued growth and resistance to diseases.   add this data in this formate.":
                    "यह पौधा स्वस्थ है! कोई रोग नहीं पाया गया। स्वस्थ सेब के पेड़ में हरी, चमकदार पत्तियां, बिना धब्बों वाले फल और मजबूत शाखाएं होती हैं। नियमित निरीक्षण, उचित उर्वरक उपयोग और सिंचाई से पौधे को स्वस्थ बनाए रखा जा सकता है और रोगों से बचाव किया जा सकता है।",
        "🔹 Treatment Details": "🔹 उपचार विवरण",
        "🔸 Fertilizer Suggestions": "🔸 उर्वरक सुझाव"
    };

    const gujarati = {
        "Apple___Apple_scab": "સેબ સ્કેબ",
        "Apple___Black_rot": "બ્લેક રોટ",
        "Apple_Cedar___apple___rust": "સીદાર-સેબ રસ્ટ",
        "Apple___healthy": "પૌધો સ્વસ્થ છે!",
        "Apple scab is a fungal disease caused by Venturia inaequalis, leading to dark, scaly lesions on leaves and fruit. Infected leaves may become distorted and drop prematurely, reducing fruit yield. The disease thrives in cool, wet conditions, spreading through fungal spores. Proper pruning and fungicide application help control its spread.":
            "સેબ સ્કેબ એ ફૂગજન્ય રોગ છે જે પાંદડા અને ફળ પર કાળા, પડડા જેવા ડાઘ પાડે છે. સંક્રમિત પાંદડાં વિકૃત થઈ શકે છે અને સમય પહેલાં પડી શકે છે, જેના કારણે ઉપજ ઘટે છે. આ રોગ ઠંડા અને ભીના વાતાવરણમાં ફેલાય છે અને ફૂગના બીજાણું દ્વારા પ્રસરે છે. યોગ્ય છટણી અને ફૂગનાશકોનો ઉપયોગ કરીને તેને નિયંત્રિત કરી શકાય છે.",
        "Black rot, caused by Botryosphaeria obtusa, affects apples by creating dark, sunken spots on fruit, which later turn into black, decayed areas. It also causes leaf blight, leading to yellowing and premature leaf drop. The disease spreads through infected plant debris and humid conditions. Removing infected branches and applying fungicides can help manage it.":
            "બ્લેક રોટ, જે *Botryosphaeria obtusa* ના કારણે થાય છે, સેબને અસર કરે છે, જેના કારણે કાળા, ડૂબેલા ડાઘ પડે છે, જે પછી કાળા, સડેલા વિસ્તારોમાં ફેરવાય છે. તે પાંદડાં સુકાઈ જાય છે અને સમય પહેલાં પડી જાય છે. આ રોગ સંક્રમિત છોડના અવશેષો અને ભીણા વાતાવરણ દ્વારા ફેલાય છે. સંક્રમિત શાખાઓ દૂર કરીને અને ફૂગનાશકો લગાવીને તેને નિયંત્રિત કરી શકાય છે.",
        "Cedar-apple rust is a fungal disease caused by Gymnosporangium juniperi-virginianae, which creates yellow-orange spots on apple leaves, sometimes leading to defoliation. It requires both apple and cedar trees to complete its life cycle. In severe cases, it can cause fruit deformities and yield reduction. Controlling nearby cedar trees and using resistant apple varieties can help prevent infection.":
            "સીદાર-સેબ રસ્ટ એ ફૂગજન્ય રોગ છે જે *Gymnosporangium juniperi-virginianae* ના કારણે થાય છે, જે સેબના પાંદડાં પર પીળા-નારંગી ડાઘ ઉભા કરે છે. કેટલીકવાર તે પાંદડાંના ઝડપનું કારણ બની શકે છે. આ રોગ વિકાસ માટે સેબ અને સીદાર બંને ઝાડની જરૂરિયાત હોય છે. ગંભીર કિસ્સાઓમાં, તે ફળોને વિકૃત કરી શકે છે અને ઉપજ ઘટાડે છે. નજીકના સીદાર ઝાડોને દૂર કરીને અને રોગપ્રતિકારક સેબની જાતો વાવીને તેને રોકી શકાય છે.",
        "This plant appears to be in good health, showing no signs of disease. Healthy apple trees have vibrant green leaves, smooth fruit, and strong branches. Regular monitoring, proper fertilization, and good watering practices ensure continued growth and resistance to diseases.   add this data in this formate.":
            "આ પૌધો સ્વસ્થ છે! કોઈ રોગ મળ્યો નથી. સ્વસ્થ સેબના વૃક્ષમાં લીલા, તેજસ્વી પાંદડા, ચીકણા ફળ અને મજબૂત શાખાઓ હોય છે. નિયમિત નિરીક્ષણ, યોગ્ય ખાતર ઉપયોગ અને સિંચાઈ દ્વારા છોડને સ્વસ્થ રાખી શકાય છે અને રોગોથી બચાવી શકાય છે.",
        "🔹 Treatment Details": "🔹 સારવાર વિગતો",
        "🔸 Fertilizer Suggestions": "🔸 ખાતર સૂચનો"
    };

    translations.hi = {
        prediction: hindi[data.prediction] || data.prediction,
        description: hindi[data.description] || data.description,
        treatment: hindi["🔹 Treatment Details"],
        fertilizer: hindi["🔸 Fertilizer Suggestions"]
    };

    translations.gu = {
        prediction: gujarati[data.prediction] || data.prediction,
        description: gujarati[data.description] || data.description,
        treatment: gujarati["🔹 Treatment Details"],
        fertilizer: gujarati["🔸 Fertilizer Suggestions"]
    };
}

function translateText(lang) {
    document.getElementById('prediction').textContent = translations[lang].prediction;
    document.getElementById('description').textContent = translations[lang].description;
    document.getElementById('treatment-link').textContent = translations[lang].treatment;
    document.getElementById('fertilizer-link').textContent = translations[lang].fertilizer;
}