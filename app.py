"""captioncraft backend. Default: ollama (fully local, no key). Optional: gemini, anthropic."""
import json, os, re, time
import requests
from dotenv import load_dotenv
from flask import Flask, jsonify, request, send_from_directory

load_dotenv()
app = Flask(__name__, static_folder="static", static_url_path="")
PROVIDER = os.getenv("PROVIDER", "ollama").lower()
FALLBACK = os.getenv("FALLBACK_PROVIDER", "").lower()
TIMEOUT = 120


def build_prompt(desc, o, has_image):
    fmt = o.get("fmt", "Photo post")
    extra = {
        "Reel": 'For "extra" give an on-screen text hook for the first 3 seconds plus a short audio suggestion.',
        "Carousel": 'For "extra" give a slide-1 headline and a one-line slide order.',
    }.get(fmt, 'For "extra" give a short posting tip.')
    return f"""You are an expert Instagram copywriter who knows how the 2026 algorithm rewards saves, DM shares, watch time and caption SEO.
Write 4 DISTINCT Instagram captions for a {fmt}.
{"An image is attached; ground the captions in what is actually visible." if has_image else ""}
{"Post description: " + desc if desc else ""}
Tone: {", ".join(o.get("tone") or []) or "natural"}. Vibe: {o.get("vibe")}. Hook style: {o.get("hook")}. Main goal: {o.get("goal")}. Niche: {o.get("niche") or "general"}. Language: {o.get("lang")}. Body length: {o.get("len")}.
Rules: line 1 (hook) is a real hook under 125 characters, never a plain description of the photo. One idea per caption. Write like a person talks. {"Work 1-2 plain search keywords into the hook or first sentence. " if o.get("seo") else ""}{'End with exactly ONE specific CTA that fits the goal (a direct question beats "thoughts?"). ' if o.get("cta") else "Set cta to an empty string. "}{"Use emojis sparingly (max 3). " if o.get("emo") else "Use no emojis. "}{"Give 3-5 relevant hashtags (no # sign), mixing niche and medium-size tags. " if o.get("hsh") else "hashtags must be an empty array. "}Make the 4 takes differ in angle, not just wording. {extra}
Also pick the ONE variant most likely to earn reach for the stated goal (0-based index) and explain why in one sentence.
Return ONLY JSON, no markdown: {{"recommended":0,"recommendReason":"","variants":[{{"label":"2-3 word angle name","hook":"","body":"","cta":"","hashtags":[],"keywords":[],"altText":"one-sentence alt text","why":"one sentence on the reach signal it targets","extra":""}}]}}"""


def post_retry(url, tries=3, **kw):
    """Retry temporary 503 overload errors with a short wait."""
    for i in range(tries):
        r = requests.post(url, **kw)
        if r.status_code != 503 or i == tries - 1:
            return r
        time.sleep(2 * (i + 1))


def call_gemini(prompt, image):
    key = os.getenv("GEMINI_API_KEY")
    if not key:
        raise RuntimeError("GEMINI_API_KEY is missing in .env")
    model = os.getenv("GEMINI_MODEL", "gemini-3.8-flash")
    parts = [{"text": prompt}]
    if image:
        parts.append({"inline_data": {"mime_type": image["mime"], "data": image["data"]}})
    for attempt in range(3):
        r = _gemini_post(key, model, parts)
        if r.status_code not in (500, 503):
            break
        time.sleep(2 * (attempt + 1))
    if False:
        pass
    r0 = r
    return _gemini_finish(r0)


def _gemini_post(key, model, parts):
    return requests.post(
        f"https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent",
        headers={"x-goog-api-key": key, "Content-Type": "application/json"},
        json={"contents": [{"role": "user", "parts": parts}],
              "generationConfig": {"responseMimeType": "application/json", "temperature": 1.0}},
        timeout=TIMEOUT)


def _gemini_finish(r):
    if r.status_code == 429:
        raise RuntimeError("Gemini rate limit reached. Wait a minute or check your free-tier quota in AI Studio.")
    r.raise_for_status()
    return r.json()["candidates"][0]["content"]["parts"][0]["text"]


def call_ollama(prompt, image):
    host = os.getenv("OLLAMA_HOST", "http://localhost:11434")
    model = os.getenv("OLLAMA_MODEL", "gemma3:4b")  # must be a vision model to read photos
    msg = {"role": "user", "content": prompt}
    if image:
        msg["images"] = [image["data"]]
    try:
        r = requests.post(f"{host}/api/chat", json={"model": model, "messages": [msg], "stream": False, "format": "json", "keep_alive": "10m", "options": {"temperature": 0.9}}, timeout=300)
    except requests.ConnectionError:
        raise RuntimeError("Cannot reach Ollama. Install it, run `ollama serve`, and `ollama pull " + model + "`.")
    if r.status_code == 404:
        raise RuntimeError(f"Model '{model}' is not installed. Run: ollama pull {model}")
    if r.status_code == 400 and image:
        raise RuntimeError(f"'{model}' cannot read images. Use a vision model such as gemma3:4b, or describe the post in text instead.")
    r.raise_for_status()
    return r.json()["message"]["content"]


def call_anthropic(prompt, image):
    key = os.getenv("ANTHROPIC_API_KEY")
    if not key:
        raise RuntimeError("ANTHROPIC_API_KEY is missing in .env")
    content = []
    if image:
        content.append({"type": "image", "source": {"type": "base64", "media_type": image["mime"], "data": image["data"]}})
    content.append({"type": "text", "text": prompt})
    r = requests.post(
        "https://api.anthropic.com/v1/messages",
        headers={"x-api-key": key, "anthropic-version": "2023-06-01", "content-type": "application/json"},
        json={"model": os.getenv("ANTHROPIC_MODEL", "claude-haiku-4-5-20251001"), "max_tokens": 2000, "messages": [{"role": "user", "content": content}]},
        timeout=TIMEOUT)
    r.raise_for_status()
    return r.json()["content"][0]["text"]


PROVIDERS = {"gemini": call_gemini, "ollama": call_ollama, "anthropic": call_anthropic}


def parse_json(text):
    text = re.sub(r"^```(?:json)?|```$", "", text.strip(), flags=re.M).strip()
    try:
        return json.loads(text)
    except json.JSONDecodeError:
        m = re.search(r"\{.*\}", text, re.S)
        if not m:
            raise ValueError("The model did not return valid JSON. Try again.")
        return json.loads(m.group(0))


def checklist(v):
    txt = f"{v.get('hook','')} {v.get('body','')} {v.get('cta','')}"
    tags = v.get("hashtags") or []
    emo = len(re.findall(r"[\U0001F300-\U0001FAFF\u2600-\u27BF]", txt))
    kws = [str(k).lower() for k in (v.get("keywords") or [])]
    return sum([
        0 < len(v.get("hook", "")) <= 125,
        len(v.get("cta", "") or "") > 3,
        bool(re.search(r"save|share|send|tag|bookmark|for later|dm", txt, re.I)),
        1 <= len(tags) <= 5,
        any(k in txt.lower() for k in kws),
        emo <= 4,
    ])


def normalise(result):
    """Small local models are sloppy: clean fields and guarantee a recommendation."""
    vs = [v for v in result.get("variants", []) if isinstance(v, dict) and v.get("hook")]
    for v in vs:
        for k in ("hook", "body", "cta", "label", "why", "extra", "altText"):
            v[k] = str(v.get(k) or "").strip()
        v["hashtags"] = [str(h).lstrip("#").strip() for h in (v.get("hashtags") or []) if str(h).strip()][:5]
        v["keywords"] = [str(k) for k in (v.get("keywords") or [])]
    if len(vs) < 2:
        raise ValueError("The model returned too few captions. Try again or use a larger model.")
    vs = vs[:4]
    scores = [checklist(v) for v in vs]
    rec = result.get("recommended")
    reason = str(result.get("recommendReason") or "").strip()
    if not isinstance(rec, int) or not 0 <= rec < len(vs):
        rec = scores.index(max(scores))
        reason = ""
    if not reason:
        reason = f"It hits {scores[rec]} of 6 reach signals (hook length, CTA, save/share trigger, hashtags, keywords, emoji balance)."
    return {"recommended": rec, "recommendReason": reason, "variants": vs}


def heuristic_pick(variants):
    """Fallback recommendation when a small local model skips or botches its own pick."""
    def pts(v):
        txt = f'{v.get("hook","")} {v.get("body","")} {v.get("cta","")}'.lower()
        tags = v.get("hashtags") or []
        return ((0 < len(v.get("hook", "")) <= 125) + bool(v.get("cta")) + (1 <= len(tags) <= 5)
                + any(str(k).lower() in txt for k in v.get("keywords") or [])
                + bool(re.search(r"save|share|send|tag|bookmark|for later|dm", txt)))
    return max(range(len(variants)), key=lambda i: (pts(variants[i]), -i))


def normalize(result):
    vs = [v for v in result.get("variants", []) if isinstance(v, dict) and (v.get("hook") or v.get("body"))][:4]
    if not vs:
        raise ValueError("The model returned no usable captions. Try again.")
    for v in vs:
        v["hashtags"] = [str(h) for h in (v.get("hashtags") or [])][:5]
        v["keywords"] = [str(k) for k in (v.get("keywords") or [])]
    rec = result.get("recommended")
    reason = (result.get("recommendReason") or "").strip()
    if not isinstance(rec, int) or not 0 <= rec < len(vs) or not reason:
        rec = heuristic_pick(vs)
        reason = "It has the strongest mix of a tight hook, a clear CTA, relevant keywords and a save/share trigger for your goal."
    return {"recommended": rec, "recommendReason": reason, "variants": vs}


def run(provider, prompt, image, attempts=2):
    last = None
    for _ in range(attempts):  # small local models sometimes return broken JSON
        try:
            return normalize(parse_json(PROVIDERS[provider](prompt, image)))
        except (ValueError, KeyError, json.JSONDecodeError) as e:
            last = e
    raise ValueError(f"The model returned unreadable output ({last}). Try again, or use a larger model.")


@app.post("/api/captions")
def captions():
    data = request.get_json(silent=True) or {}
    desc, opts, image = (data.get("desc") or "").strip(), data.get("opts") or {}, data.get("image")
    if not desc and not image:
        return jsonify(error="Send a description or an image."), 400
    if PROVIDER not in PROVIDERS:
        return jsonify(error=f"Unknown PROVIDER '{PROVIDER}'. Use ollama, gemini or anthropic."), 500
    prompt = build_prompt(desc, opts, bool(image))
    chain = [PROVIDER] + ([FALLBACK] if FALLBACK in PROVIDERS and FALLBACK != PROVIDER else [])
    err = ""
    for p in chain:
        try:
            return jsonify(run(p, prompt, image))
        except requests.HTTPError as e:
            err = f"{p} returned {e.response.status_code}: {e.response.text[:200]}"
        except Exception as e:
            err = str(e)
    return jsonify(error=err), 502


@app.get("/")
def home():
    return send_from_directory("static", "index.html")


if __name__ == "__main__":
    print(f"captioncraft running with provider: {PROVIDER}")
    app.run(debug=True, port=int(os.getenv("PORT", 5000)))
