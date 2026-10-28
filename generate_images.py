import argparse
import base64
import json
import os
import sys
import urllib.request
import urllib.error
from dotenv import load_dotenv
from logger import get_logger, set_logging_level

logger = get_logger(__name__)

SCENES = [
  {
    "filename": "scene1-sickbed.png",
    "prompt": (
      "Historical Victorian London 1854, cinematic painterly style. In a cramped, dim attic tenement "
      "room with rough wooden floorboards and peeling walls, a sick teenage girl lies in a humble wooden "
      "bed under coarse woolen blankets, looking pale and feverish. Beside her bed, her older sister in a "
      "worn cotton textile mill dress stands looking down with deep worry. Gentle warm candlelight, "
      "grim Industrial Revolution atmosphere, 16:9 widescreen composition."
    ),
  },
  {
    "filename": "scene2-shift-dilemma.png",
    "prompt": (
      "Historical Victorian London 1854, cinematic painterly style. Inside a gloomy garret room, two young "
      "Victorian mill workers, a woman in an apron and her male coworker in a flat cap and soot-stained vest, "
      "stand speaking with anxious urgency by a dusty window. In the corner background, a bedridden girl rests. "
      "Atmospheric Dickensian interior, moody chiaroscuro lighting, 16:9 widescreen composition."
    ),
  },
  {
    "filename": "scene3-broad-street-pump.png",
    "prompt": (
      "Historical Victorian London 1854, cinematic painterly style. On a foggy cobblestone street in Soho London "
      "(Broad Street), surrounded by tall brick tenements, a young working-class woman in a shawl carries an old "
      "tin water pail toward the historic cast-iron street water pump. Coal smoke and London smog in the air, "
      "authentic 19th-century street scene, 16:9 widescreen composition."
    ),
  },
  {
    "filename": "scene4-cholera-warning.png",
    "prompt": (
      "Historical Victorian London 1854, dramatic cinematic painterly style. On the cobblestones of Broad Street "
      "beside the iron water pump, a young mill worker runs up in panic, urgently grabbing his female coworker's "
      "arm to stop her from pumping water. Distressed Londoners and distant horse carts in the misty background, "
      "intense dramatic tension, outbreak of the Blue Death cholera, 16:9 widescreen composition."
    ),
  },
]

def generate_image_with_gemini(api_key: str, prompt: str, output_path: str) -> bool:
  url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image:generateContent?key={api_key}"
  payload = {
    "contents": [{"parts": [{"text": prompt}]}]
  }
  req = urllib.request.Request(
    url,
    data=json.dumps(payload).encode("utf-8"),
    headers={"Content-Type": "application/json"}
  )
  try:
    logger.debug(f"Calling Gemini 2.5 Flash Image API for: {output_path}")
    with urllib.request.urlopen(req) as resp:
      result = json.loads(resp.read().decode("utf-8"))
      candidates = result.get("candidates", [])
      if not candidates:
        logger.error("No candidates returned from Gemini API")
        return False
      parts = candidates[0].get("content", {}).get("parts", [])
      for part in parts:
        if "inlineData" in part:
          img_bytes = base64.b64decode(part["inlineData"]["data"])
          with open(output_path, "wb") as f:
            f.write(img_bytes)
          logger.info(f"Generated image saved successfully: {output_path} ({len(img_bytes)} bytes)")
          return True
      logger.warning("No inlineData image found in API response parts")
      return False
  except urllib.error.HTTPError as e:
    err_body = e.read().decode("utf-8")
    logger.error(f"HTTP Error {e.code} during image generation: {err_body}")
    return False
  except Exception as e:
    logger.error(f"Failed to generate image: {e}")
    return False

def main():
  parser = argparse.ArgumentParser(description="Generate presentation scene images using Gemini 2.5 Flash Image")
  parser.add_argument("--debug", action="store_true", help="Enable debug level logging")
  parser.add_argument("--output-dir", default="images", help="Target output directory for images")
  args = parser.parse_args()

  set_logging_level(args.debug)
  load_dotenv()

  api_key = os.getenv("GOOGLE_API_KEY") or os.getenv("GEMINI_API_KEY")
  if not api_key:
    logger.error("No GOOGLE_API_KEY or GEMINI_API_KEY found in environment or .env file.")
    sys.exit(1)

  os.makedirs(args.output_dir, exist_ok=True)
  logger.info(f"Starting scene image generation for {len(SCENES)} scenes...")

  success_count = 0
  for idx, scene in enumerate(SCENES, start=1):
    out_file = os.path.join(args.output_dir, scene["filename"])
    logger.info(f"[{idx}/{len(SCENES)}] Generating {scene['filename']}...")
    ok = generate_image_with_gemini(api_key, scene["prompt"], out_file)
    if ok:
      success_count += 1
    else:
      logger.warning(f"Failed to generate {scene['filename']}")

  logger.info(f"Completed: {success_count}/{len(SCENES)} images generated.")
  if success_count < len(SCENES):
    sys.exit(1)

if __name__ == "__main__":
  main()
