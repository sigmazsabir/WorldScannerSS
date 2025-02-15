// script.js

const uploadButton = document.getElementById('upload-btn');
const fileInput = document.getElementById('file-upload');
const imageDisplay = document.getElementById('uploaded-image');
const infoDisplay = document.getElementById('info-display');
const animalInfo = document.getElementById('animal-info');
const plantInfo = document.getElementById('plant-info');

// API anahtarını buraya yerleştir
const apiKey = 'AIzaSyBfHmWgzd8dMmHua0eB18c-JPYZfwh6V6s';

// Fotoğraf yükleme butonuna tıklanıldığında fotoğrafı al ve göster
uploadButton.addEventListener('click', () => {
  const file = fileInput.files[0];

  if (file) {
    const reader = new FileReader();
    reader.onload = function(e) {
      imageDisplay.src = e.target.result;
      analyzeImage(file);
    };
    reader.readAsDataURL(file);
  }
});

// Fotoğrafı Google Vision API'ye gönder
function analyzeImage(file) {
  const formData = new FormData();
  formData.append('image', file);

  fetch('https://vision.googleapis.com/v1/images:annotate?key=' + apiKey, {
    method: 'POST',
    body: JSON.stringify({
      requests: [
        {
          image: {
            content: fileToBase64(file)
          },
          features: [
            {
              type: 'LABEL_DETECTION',
              maxResults: 10
            }
          ]
        }
      ]
    })
  })
  .then(response => response.json())
  .then(data => {
    const labels = data.responses[0].labelAnnotations.map(item => item.description);
    displayResults(labels);
  })
  .catch(error => console.error('API hata:', error));
}

// Fotoğrafı base64 formatına dönüştür
function fileToBase64(file) {
  const reader = new FileReader();
  return new Promise((resolve, reject) => {
    reader.onloadend = () => resolve(reader.result.split(',')[1]);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

// Etiketlere göre hayvan ve bitki bilgilerini göster
function displayResults(labels) {
  // Hayvan ve bitki etiketlerini göster
  animalInfo.innerHTML = '';
  plantInfo.innerHTML = '';

  labels.forEach(label => {
    if (isAnimal(label)) {
      animalInfo.innerHTML += `<p><strong>Hayvan:</strong> ${label}</p>`;
    } else if (isPlant(label)) {
      plantInfo.innerHTML += `<p><strong>Bitki:</strong> ${label}</p>`;
    }
  });
}

// Etiketin hayvan olup olmadığını kontrol et
function isAnimal(label) {
  const animals = ['Aslan', 'Kaplan', 'Zebra'];  // Burada daha fazla hayvan ekleyebilirsin
  return animals.includes(label);
}

// Etiketin bitki olup olmadığını kontrol et
function isPlant(label) {
  const plants = ['Zehirli Ot', 'Gül', 'Çam'];  // Burada daha fazla bitki ekleyebilirsin
  return plants.includes(label);
}
