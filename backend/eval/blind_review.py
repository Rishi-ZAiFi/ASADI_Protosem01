import os
import json
import random
import csv
import glob

def export_blind_review():
    # Find latest results json
    results_files = glob.glob("eval/results/*.json")
    if not results_files:
        print("No results found in eval/results/")
        return
        
    latest_file = max(results_files, key=os.path.getctime)
    print(f"Exporting from {latest_file}")
    
    with open(latest_file, "r") as f:
        results = json.load(f)
        
    csv_rows = []
    keys_rows = []
    
    for idx, r in enumerate(results):
        topic = r["topic"]
        b0_text = r["B0"]["caption"]
        b1_text = r["B1"]["caption"]
        real_text = r["REAL"]["caption"]
        
        # Shuffle them
        options = [
            ("B0 (Plain Gemini)", b0_text),
            ("B1 (Pipeline)", b1_text),
            ("REAL (Creator)", real_text)
        ]
        random.shuffle(options)
        
        row_id = f"POST_{idx+1}"
        
        # Save to CSV for human reviewer
        csv_rows.append({
            "Review_ID": row_id,
            "Topic": topic,
            "Option_A": options[0][1],
            "Option_B": options[1][1],
            "Option_C": options[2][1],
            "Rank_1_Best": "",
            "Rank_2": "",
            "Rank_3_Worst": "",
            "Comments": ""
        })
        
        # Save answer key
        keys_rows.append({
            "Review_ID": row_id,
            "Option_A_Identity": options[0][0],
            "Option_B_Identity": options[1][0],
            "Option_C_Identity": options[2][0]
        })
        
    out_csv = "eval/blind_review_form.csv"
    with open(out_csv, "w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=csv_rows[0].keys())
        writer.writeheader()
        writer.writerows(csv_rows)
        
    out_key = "eval/blind_review_key.csv"
    with open(out_key, "w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=keys_rows[0].keys())
        writer.writeheader()
        writer.writerows(keys_rows)
        
    print(f"Exported blind review form to {out_csv}")
    print(f"Exported answer key to {out_key} (Keep this hidden from reviewer!)")

if __name__ == "__main__":
    export_blind_review()
