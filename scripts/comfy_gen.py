import json, urllib.request, urllib.parse, time, random, sys, os

HOST = "http://127.0.0.1:8188"
CKPT = "epicrealismXL_pureFix.safetensors"

def generate(pos, neg, w, h, outpath, steps=30, cfg=6.5):
    seed = random.randint(1, 2**31)
    wf = {
        "3": {"class_type": "KSampler", "inputs": {"seed": seed, "steps": steps, "cfg": cfg,
              "sampler_name": "dpmpp_2m", "scheduler": "karras", "denoise": 1.0,
              "model": ["4", 0], "positive": ["6", 0], "negative": ["7", 0], "latent_image": ["5", 0]}},
        "4": {"class_type": "CheckpointLoaderSimple", "inputs": {"ckpt_name": CKPT}},
        "5": {"class_type": "EmptyLatentImage", "inputs": {"width": w, "height": h, "batch_size": 1}},
        "6": {"class_type": "CLIPTextEncode", "inputs": {"text": pos, "clip": ["4", 1]}},
        "7": {"class_type": "CLIPTextEncode", "inputs": {"text": neg, "clip": ["4", 1]}},
        "8": {"class_type": "VAEDecode", "inputs": {"samples": ["3", 0], "vae": ["4", 2]}},
        "9": {"class_type": "SaveImage", "inputs": {"filename_prefix": "yubokumin", "images": ["8", 0]}},
    }
    cid = "ycli" + str(seed)
    data = json.dumps({"prompt": wf, "client_id": cid}).encode()
    r = urllib.request.urlopen(urllib.request.Request(HOST + "/prompt", data=data,
        headers={"Content-Type": "application/json"}), timeout=30)
    pid = json.loads(r.read())["prompt_id"]
    print("queued", pid, "seed", seed)
    for _ in range(180):
        time.sleep(2)
        try:
            h2 = json.loads(urllib.request.urlopen(HOST + "/history/" + pid, timeout=10).read())
        except Exception:
            continue
        if pid in h2:
            outs = h2[pid]["outputs"]
            imgs = outs.get("9", {}).get("images", [])
            if imgs:
                im = imgs[0]
                q = urllib.parse.urlencode({"filename": im["filename"], "subfolder": im.get("subfolder", ""), "type": im.get("type", "output")})
                blob = urllib.request.urlopen(HOST + "/view?" + q, timeout=30).read()
                os.makedirs(os.path.dirname(outpath), exist_ok=True)
                open(outpath, "wb").write(blob)
                print("SAVED", outpath, len(blob), "bytes")
                return True
    print("TIMEOUT")
    return False

POS = ("cinematic 16:9 hero plate at first light over a Maldives lagoon, calm turquoise water stretching to the horizon, "
       "a single distant overwater bungalow silhouette far on the right edge, soft pale sandbar in the foreground, "
       "sky a smooth gradient from warm blush peach at the horizon through soft coral to powder turquoise at zenith, "
       "gentle ripples catching dawn light, faint low mist over the water, golden hour, long soft reflections, "
       "photorealistic editorial resort photography, Aman Resort aesthetic, museum print quality, shot on 35mm f5.6, "
       "generous clean negative space in the center, subtle medium-format film grain, lifted blacks, soft contrast")
NEG = ("seal, seals, animals, jewelry, ring, people, person, text, words, letters, logo, watermark, "
       "harsh lens flare, oversaturation, neon, fisheye, HDR halo, plastic, 3d render, cartoon, "
       "ai smoothing, low resolution, blurry, deformed, ugly, jpeg artifacts")

out = r"C:\ClaudeCode\260620_yubokumin-lab-site\assets\banners\hero-bg.png"
generate(POS, NEG, 1344, 768, out)
