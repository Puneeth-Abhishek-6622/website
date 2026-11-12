const modelCategories = [
  {
    name: "Analog Radio Channels",
    models: [
      {
        name: "Jakes Multipath Fading",
        description: "Reflections make a moving radio signal fade in and out, changing the voice volume.",
        configurable: "Carrier frequency and vehicle speed are required arguments; number of paths defaults to 20. This sample uses 150 MHz, 40 km/h, and 20 paths.",
        fixed: "No other channel settings are exposed.",
        file: "samples/jakes_40kmh.wav"
      },
      {
        name: "Watterson HF Ionospheric Model",
        description: "A delayed reflection and changing signal strength approximate long-distance HF radio.",
        configurable: "Choose Quiet, Moderate, or Disturbed. This sample uses Moderate.",
        fixed: "Each profile's delay and Doppler spread are set in the implementation: Quiet 0.5 ms / 0.1 Hz; Moderate 1 ms / 0.5 Hz; Disturbed 2 ms / 1 Hz.",
        file: "samples/watterson_moderate.wav"
      },
      {
        name: "Additive White Gaussian Noise (AWGN)",
        description: "Adds background hiss to speech; lower signal-to-noise ratio (SNR) means more noise.",
        configurable: "SNR in dB is an argument to the function. This sample uses 15 dB.",
        fixed: "No other noise settings are exposed.",
        file: "samples/awgn_15db.wav"
      }
    ]
  },
  {
    name: "Digital Handheld Radio",
    models: [
      {
        name: "Band-Limiting Filter",
        description: "Removes higher speech frequencies, making consonants and fine details less clear.",
        configurable: "Cutoff frequency and filter order are function arguments. This sample uses 3.4 kHz and order 10.",
        fixed: "The filter type is a Butterworth low-pass filter.",
        file: "samples/band_limit_3400hz.wav"
      },
      {
        name: "GSM Full-Rate Vocoder",
        description: "Compresses speech at a low bitrate, which can make it sound less natural or slightly metallic.",
        configurable: "No codec options are exposed by the function.",
        fixed: "GSM Full Rate (13 kbit/s) and its 8 kHz codec rate are fixed in the implementation.",
        file: "samples/gsm_codec.wav"
      }
    ]
  },
  {
    name: "Network Channels",
    models: [
      {
        name: "Burst Packet Loss",
        description: "Lost voice packets are replaced with a fading repeat of the previous packet, creating skips or stutters.",
        configurable: "Packet-loss and recovery probabilities are function arguments. This sample uses 0.05 and 0.5.",
        fixed: "Frame duration defaults to 20 ms in the simulator constructor; concealment repeats the previous packet at 0.8 gain.",
        file: "samples/packet_loss_5pct.wav"
      }
    ]
  }
];

const recipes = [
  {
    title: "VHF Mobile",
    description: "A moving police radio fades between reflections, then picks up receiver noise.",
    file: "samples/recipe_vhf_mobile_police.wav",
    stages: ["Jakes fading", "AWGN"]
  },
  {
    title: "HF Aviation",
    description: "An aircraft-to-ground HF signal passes through a moderate ionospheric channel and noise.",
    file: "samples/recipe_hf_aviation.wav",
    stages: ["Watterson (Moderate)", "AWGN"]
  },
  {
    title: "Digital Tactical Radio",
    description: "A narrowband radio filters speech, encodes it with GSM, then adds noise.",
    file: "samples/recipe_digital_tactical_radio.wav",
    stages: ["Band limiting", "GSM codec", "AWGN"]
  },
  {
    title: "VoIP",
    description: "An office voice call loses packets in bursts, with the previous frame repeated and faded.",
    file: "samples/recipe_voip_office.wav",
    stages: ["Burst packet loss"]
  },
  {
    title: "Extreme Arctic Operations",
    description: "A disturbed HF signal passes through a speech codec and a lossy network.",
    file: "samples/recipe_extreme_arctic_operations.wav",
    stages: ["Watterson (Disturbed)", "GSM codec", "Burst packet loss"]
  }
];

function audioComparison(degradedFile, degradedLabel) {
  return `
    <div class="audio-comparison">
      <div class="audio-item">
        <span>Clean Original Audio</span>
        <audio controls preload="none" src="samples/clean.wav" aria-label="Play clean original audio"></audio>
      </div>
      <div class="audio-item">
        <span>${degradedLabel}</span>
        <audio controls preload="none" src="${degradedFile}" aria-label="Play ${degradedLabel.toLowerCase()}"></audio>
      </div>
    </div>
  `;
}

function modelCard(model) {
  return `
    <article class="card">
      <h3>${model.name}</h3>
      <p>${model.description}</p>
      <dl class="parameters">
        <div><dt>Can be changed</dt><dd>${model.configurable}</dd></div>
        <div><dt>Fixed in implementation</dt><dd>${model.fixed}</dd></div>
      </dl>
      ${audioComparison(model.file, "Degraded Audio")}
    </article>
  `;
}

function recipeCard(recipe) {
  return `
    <article class="card recipe-card">
      <h3>${recipe.title}</h3>
      <p>${recipe.description}</p>
      <p class="sequence"><strong>Sequence:</strong> ${recipe.stages.join(" → ")}</p>
      ${audioComparison(recipe.file, "Final Degraded Audio")}
    </article>
  `;
}

document.querySelector("#model-categories").innerHTML = modelCategories.map(category => `
  <section class="model-category">
    <h2>${category.name}</h2>
    <div class="card-grid">${category.models.map(modelCard).join("")}</div>
  </section>
`).join("");

document.querySelector("#recipe-grid").innerHTML = recipes.map(recipeCard).join("");
