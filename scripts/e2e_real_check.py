#!/usr/bin/env python3
import os
import sys
import json
import time
import requests

BASE_URL = "http://localhost:8000"

results = []
project_id = None
generate_draft_id = None
graph_draft_id = None

def record(step, passed, reason):
    status = "PASS" if passed else "FAIL"
    results.append((status, step, reason))
    print(f"{status}: {step} - {reason}")

def check_env_flags():
    if os.environ.get("TEST_FAKE_LLM") or os.environ.get("TEST_FAKE_EMBEDDINGS"):
        record("env-check", False, "TEST_FAKE_LLM or TEST_FAKE_EMBEDDINGS is set in environment")
        return False
    record("env-check", True, "no fake flags set")
    return True

def check_health():
    try:
        r = requests.get(f"{BASE_URL}/api/health", timeout=10)
        if r.status_code != 200:
            record("health", False, f"GET /api/health returned {r.status_code}: {r.text}")
            return False
        record("health", True, f"GET /api/health returned 200 in {r.elapsed.total_seconds():.3f}s")
        return True
    except Exception as e:
        record("health", False, f"GET /api/health raised: {e}")
        return False

def create_project():
    global project_id
    try:
        payload = {"name": "e2e-real-check"}
        start = time.time()
        r = requests.post(f"{BASE_URL}/api/projects", json=payload, timeout=30)
        latency = time.time() - start
        if r.status_code != 200:
            record("create-project", False, f"POST /api/projects returned {r.status_code}: {r.text}")
            return False
        data = r.json()
        project_id = data.get("id")
        if not project_id:
            record("create-project", False, f"project id missing in response: {data}")
            return False
        record("create-project", True, f"project created with id={project_id} ({latency:.3f}s)")
        return True
    except Exception as e:
        record("create-project", False, f"POST /api/projects raised: {e}")
        return False

def import_posts():
    if not project_id:
        record("import-posts", False, "no project_id")
        return False
    try:
        with open("backend/sample_datasets/tech_creator.json", "r") as f:
            dataset = json.load(f)
        start = time.time()
        r = requests.post(f"{BASE_URL}/api/projects/{project_id}/posts/import", json=dataset, timeout=60)
        latency = time.time() - start
        if r.status_code != 200:
            record("import-posts", False, f"POST /api/projects/{project_id}/posts/import returned {r.status_code}: {r.text}")
            return False
        data = r.json()
        imported = data.get("imported_count")
        parse_errors = data.get("parse_errors")
        analysis_failures = data.get("analysis_failures")
        record("import-posts", True, f"imported_count={imported}, parse_errors={parse_errors}, analysis_failures={analysis_failures} ({latency:.3f}s)")
        return True
    except Exception as e:
        record("import-posts", False, f"POST /api/projects/{project_id}/posts/import raised: {e}")
        return False

def analyze_project():
    if not project_id:
        record("analyze", False, "no project_id")
        return False
    try:
        start = time.time()
        r = requests.post(f"{BASE_URL}/api/projects/{project_id}/analyze", timeout=60)
        latency = time.time() - start
        if r.status_code != 200:
            record("analyze", False, f"POST /api/projects/{project_id}/analyze returned {r.status_code}: {r.text}")
            return False
        data = r.json()
        required_fields = ["id", "project_id", "tone_scores", "caption_stats", "formatting_patterns",
                           "emoji_profile", "hashtag_profile", "cta_profile", "common_structures",
                           "vocabulary_profile", "visual_profile", "created_at", "updated_at"]
        missing = [f for f in required_fields if f not in data]
        if missing:
            record("analyze", False, f"style profile missing fields: {missing}")
            return False
        record("analyze", True, f"style profile returned with all required fields ({latency:.3f}s)")
        return True
    except Exception as e:
        record("analyze", False, f"POST /api/projects/{project_id}/analyze raised: {e}")
        return False

def generate_draft():
    if not project_id:
        record("generate", False, "no project_id")
        return False
    try:
        payload = {"topic": "5 essential tools for modern AI developers"}
        start = time.time()
        r = requests.post(f"{BASE_URL}/api/projects/{project_id}/generate", json=payload, timeout=120)
        latency = time.time() - start
        if r.status_code != 200:
            record("generate", False, f"POST /api/projects/{project_id}/generate returned {r.status_code}: {r.text}")
            return False
        data = r.json()
        print(json.dumps(data, indent=2))
        global generate_draft_id
        generate_draft_id = data.get("id")
        if not generate_draft_id:
            record("generate", False, "draft id missing in /generate response")
            return False
        for field in ["caption", "body", "hook", "cta"]:
            val = data.get(field, "")
            if not isinstance(val, str) or not val.strip():
                record("generate", False, f"field '{field}' is empty or missing")
                return False
        hook = data.get("hook", "")
        caption = data.get("caption", "")
        hook_count = caption.count(hook)
        if hook_count == 1:
            record("generate", True, f"hook appears exactly once in caption (count={hook_count}) ({latency:.3f}s)")
            return True
        else:
            record("generate", False, f"hook appears {hook_count} times in caption (expected exactly 1)")
            return False
    except Exception as e:
        record("generate", False, f"POST /api/projects/{project_id}/generate raised: {e}")
        return False

def generate_graph():
    if not project_id:
        record("generate-graph", False, "no project_id")
        return False
    try:
        payload = {"topic": "5 essential tools for modern AI developers", "n_candidates": 2, "max_iterations": 1}
        start = time.time()
        r = requests.post(f"{BASE_URL}/api/projects/{project_id}/generate/graph", json=payload, timeout=120)
        latency = time.time() - start
        if r.status_code != 200:
            record("generate-graph", False, f"POST /api/projects/{project_id}/generate/graph returned {r.status_code}: {r.text}")
            return False
        data = r.json()
        print(json.dumps(data, indent=2))
        global graph_draft_id
        graph_draft_id = data.get("id")
        if not graph_draft_id:
            record("generate-graph", False, "draft id missing in /generate/graph response")
            return False
        if "warnings" not in data:
            record("generate-graph", False, "'warnings' key missing from response")
            return False
        if not isinstance(data["warnings"], list):
            record("generate-graph", False, "'warnings' is not a list")
            return False
        caption = data.get("caption", "")
        if not isinstance(caption, str) or not caption.strip():
            record("generate-graph", False, "caption is empty")
            return False
        record("generate-graph", True, f"warnings present (len={len(data['warnings'])}), caption non-empty ({latency:.3f}s)")
        return True
    except Exception as e:
        record("generate-graph", False, f"POST /api/projects/{project_id}/generate/graph raised: {e}")
        return False

def check_drafts():
    if not project_id:
        record("drafts", False, "no project_id")
        return False
    if not generate_draft_id:
        record("drafts", False, "generate_draft_id not set (generate_draft step failed)")
        return False
    if not graph_draft_id:
        record("drafts", False, "graph_draft_id not set (generate_graph step failed)")
        return False
    try:
        start = time.time()
        r = requests.get(f"{BASE_URL}/api/projects/{project_id}/drafts", timeout=30)
        latency = time.time() - start
        if r.status_code != 200:
            record("drafts", False, f"GET /api/projects/{project_id}/drafts returned {r.status_code}: {r.text}")
            return False
        drafts = r.json()
        if not isinstance(drafts, list):
            record("drafts", False, "drafts response is not a list")
            return False
        gen_draft = None
        graph_draft = None
        for d in drafts:
            if d.get("id") == generate_draft_id:
                gen_draft = d
            elif d.get("id") == graph_draft_id:
                graph_draft = d
        if not gen_draft:
            record("drafts", False, f"/generate draft (id={generate_draft_id}) not found in drafts list")
            return False
        if not graph_draft:
            record("drafts", False, f"/generate/graph draft (id={graph_draft_id}) not found in drafts list")
            return False
        body = gen_draft.get("body", "")
        if not isinstance(body, str) or not body.strip():
            record("drafts", False, "/generate draft body is empty")
            return False
        record("drafts", True, f"drafts list includes both generated drafts, /generate draft has non-empty body ({latency:.3f}s)")
        return True
    except Exception as e:
        record("drafts", False, f"GET /api/projects/{project_id}/drafts raised: {e}")
        return False

def delete_project():
    if not project_id:
        record("delete-project", False, "no project_id to delete")
        return False
    try:
        start = time.time()
        r = requests.delete(f"{BASE_URL}/api/projects/{project_id}", timeout=30)
        latency = time.time() - start
        if r.status_code != 200:
            record("delete-project", False, f"DELETE /api/projects/{project_id} returned {r.status_code}: {r.text}")
            return False
        record("delete-project", True, f"project deleted successfully ({latency:.3f}s)")
        return True
    except Exception as e:
        record("delete-project", False, f"DELETE /api/projects/{project_id} raised: {e}")
        return False

def main():
    global project_id
    try:
        check_env_flags()
        check_health()
        create_project()
        import_posts()
        analyze_project()
        generate_draft()
        generate_graph()
        check_drafts()
    finally:
        delete_project()
    print("\n=== SUMMARY ===")
    any_fail = False
    for status, step, reason in results:
        print(f"{status}: {step} - {reason}")
        if status == "FAIL":
            any_fail = True
    sys.exit(1 if any_fail else 0)

if __name__ == "__main__":
    main()