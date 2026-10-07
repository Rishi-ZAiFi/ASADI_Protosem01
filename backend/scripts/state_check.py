import os
import sys
import subprocess
from sqlalchemy import create_engine, text
from app.config import settings

def run_cmd(cmd: str) -> str:
    try:
        # Clear specific env vars
        env = os.environ.copy()
        env.pop('PYTHONPATH', None)
        env.pop('AMENT_PREFIX_PATH', None)
        # Add pytest flags to ignore ROS plugins
        if 'pytest' in cmd:
            cmd = cmd.replace('pytest', 'pytest -p no:launch_testing_ros_pytest_entrypoint -p no:launch_testing -p no:launch_testing_ros')
        result = subprocess.run(cmd, shell=True, env=env, capture_output=True, text=True, check=True)
        return result.stdout.strip()
    except subprocess.CalledProcessError as e:
        return f"COMMAND FAILED: {cmd}\nSTDOUT: {e.stdout}\nSTDERR: {e.stderr}"

def check_db():
    print("=== DB CHECK ===")
    engine = create_engine(settings.DATABASE_URL)
    with engine.connect() as conn:
        print(f"Dialect: {engine.dialect.name}")
        if engine.dialect.name == 'postgresql':
            res = conn.execute(text("SELECT extname FROM pg_extension WHERE extname = 'vector'")).fetchone()
            print(f"pgvector installed: {res is not None}")
        
        print("\n=== POST COUNTS ===")
        projects = conn.execute(text("SELECT id FROM projects")).fetchall()
        
        total_posts = conn.execute(text("SELECT COUNT(*) FROM posts")).scalar()
        print(f"Total posts across all projects: {total_posts}")
        
        for (pid,) in projects:
            count = conn.execute(text("SELECT COUNT(*) FROM posts WHERE project_id = :pid"), {"pid": pid}).scalar()
            failed = conn.execute(text("SELECT COUNT(*) FROM posts WHERE project_id = :pid AND analysis_status = 'failed'"), {"pid": pid}).scalar()
            null_date = conn.execute(text("SELECT COUNT(*) FROM posts WHERE project_id = :pid AND published_at IS NULL"), {"pid": pid}).scalar()
            print(f"Project ID: {pid}")
            print(f"  Post Count: {count}")
            print(f"  Failed Count: {failed}")
            print(f"  NULL Date Count: {null_date}")
            print()

def check_alembic():
    print("=== ALEMBIC ===")
    out = run_cmd("alembic current")
    print("Current:", out)
    out2 = run_cmd("alembic heads")
    print("Heads:", out2)

def check_versions():
    print("=== VERSIONS ===")
    import importlib.metadata
    try:
        ver = importlib.metadata.version("langgraph")
        print(f"langgraph installed version: {ver}")
    except importlib.metadata.PackageNotFoundError:
        print("langgraph NOT INSTALLED")
        
    try:
        ver = importlib.metadata.version("langchain-core")
        print(f"langchain-core installed version: {ver}")
    except importlib.metadata.PackageNotFoundError:
        print("langchain-core NOT INSTALLED")
        
    reqs = open("requirements.txt").read()
    print("\nRequirements file pins:")
    for line in reqs.splitlines():
        if "langgraph" in line or "langchain-core" in line:
            print(line)

def check_gemini():
    print("\n=== GEMINI ===")
    model = os.environ.get("GEMINI_MODEL", settings.GEMINI_MODEL)
    print(f"Configured Model: {model}")
    api_key = settings.LLM_API_KEY
    if api_key:
        import httpx
        url = f"https://generativelanguage.googleapis.com/v1beta/models?key={api_key}"
        res = httpx.get(url, timeout=10.0)
        if res.status_code == 200:
            models = [m.get("name") for m in res.json().get("models", [])]
            mpath = f"models/{model}" if not model.startswith("models/") else model
            print(f"Model in models.list: {mpath in models}")
        else:
            print("Failed to fetch models.list")
    else:
        print("NO API KEY")

def check_git():
    print("\n=== GIT STATUS ===")
    print(run_cmd("git status --short"))

def check_pytest():
    print("\n=== PYTEST RUN ===")
    out = run_cmd("pytest tests/test_graph_smoke.py")
    lines = out.strip().split('\n')
    if lines:
        for line in reversed(lines):
            if "======" in line:
                print(line)
                break
        else:
            print(lines[-1])
    else:
        print("NO PYTEST OUTPUT")

if __name__ == "__main__":
    try:
        check_db()
        print()
        check_alembic()
        print()
        check_versions()
        print()
        check_gemini()
        print()
        check_git()
        print()
        check_pytest()
    except Exception as e:
        print(f"FAIL: {e}")
