"""Generate realistic, seeded sample creator analytics data for Creator Analytics Copilot."""

import random
from datetime import datetime, timedelta
import pandas as pd
from pathlib import Path

def generate_sample_dataset(num_posts: int = 75, seed: int = 42) -> pd.DataFrame:
    random.seed(seed)
    base_date = datetime(2026, 6, 1, 10, 0, 0)
    
    formats = ["Shorts", "Longform Video", "Carousel", "Live Stream"]
    topics = [
        "Productivity Systems",
        "Coding with AI",
        "Creator Monetization",
        "Workflow Automation",
        "Tech Gear Review",
        "Audience Growth",
        "Design Systems",
    ]
    
    templates = [
        ("How I Built a {topic} in 24 Hours (Step by Step)", True, False),
        ("Why 99% of Creators Fail at {topic}", False, True),
        ("7 Game-Changing Tools for {topic}", True, False),
        ("Is {topic} Actually Dead in 2026?", False, True),
        ("My Honest Thoughts on {topic} After 5 Years", False, False),
        ("Stop Making This Big Mistake with {topic}", False, False),
        ("The Ultimate Beginner Guide to {topic}", False, False),
        ("3 Simple Tweaks to Double Your {topic} Results", True, False),
        ("Can Anyone Master {topic} in 30 Days?", False, True),
        ("Behind the Scenes: My Complete {topic} Blueprint", False, False),
    ]
    
    records = []
    
    for i in range(num_posts):
        # Stagger publication dates over the past 90 days
        days_offset = int((i / num_posts) * 88) + random.randint(0, 1)
        # Weight towards evening (18:00 - 21:00) or morning (08:00 - 11:00)
        is_evening = random.random() < 0.55
        if is_evening:
            hour = random.choice([18, 19, 20, 21])
        else:
            hour = random.choice([8, 9, 10, 11, 14, 15])
        minute = random.choice([0, 15, 30, 45])
        pub_dt = base_date + timedelta(days=days_offset, hours=hour, minutes=minute)
        
        # Pick format
        fmt = random.choices(formats, weights=[0.45, 0.35, 0.12, 0.08])[0]
        topic = random.choice(topics)
        template, has_number, has_question = random.choice(templates)
        title = template.format(topic=topic)
        
        # Duration based on format
        if fmt == "Shorts":
            duration_sec = random.randint(25, 58)
        elif fmt == "Longform Video":
            # 50% under 8 mins, 50% 8-22 mins
            duration_sec = random.choice([random.randint(300, 470), random.randint(600, 1320)])
        elif fmt == "Live Stream":
            duration_sec = random.randint(2400, 5400)
        else:
            duration_sec = 0  # Carousel
            
        # Realistic pattern multipliers:
        # 1. Evening posts perform ~1.8x to 2.4x better
        time_mult = 2.1 if (18 <= hour <= 21) else 1.0
        
        # 2. Shorter duration in longform (<480s / 8m) or Shorts perform ~1.9x better
        if fmt == "Shorts":
            dur_mult = 2.0
        elif fmt == "Longform Video" and duration_sec < 480:
            dur_mult = 1.75
        elif fmt == "Longform Video":
            dur_mult = 0.9
        else:
            dur_mult = 1.0
            
        # 3. Titles with numbers or questions have higher CTR
        title_mult = 1.0
        if has_number:
            title_mult += 0.35
        if has_question:
            title_mult += 0.30
            
        # Base views with log-normal distribution
        base_views = random.randint(1200, 4500)
        noise = random.uniform(0.7, 1.4)
        views = int(base_views * time_mult * dur_mult * title_mult * noise)
        
        # Engagement rate roughly 5% - 11%
        eng_rate = random.uniform(0.045, 0.115) * (1.15 if has_question else 1.0)
        likes = int(views * eng_rate * random.uniform(0.65, 0.85))
        comments = int(views * eng_rate * random.uniform(0.08, 0.20))
        shares = int(views * eng_rate * random.uniform(0.05, 0.15))
        
        # CTR: higher for question/numbers and evening
        ctr = round(random.uniform(4.5, 9.8) * (1.2 if (has_number or has_question) else 0.95), 1)
        
        # Watch time hours
        if duration_sec > 0:
            retention_rate = random.uniform(0.48, 0.76) if duration_sec < 480 else random.uniform(0.28, 0.45)
            watch_time_hours = round((views * duration_sec * retention_rate) / 3600.0, 2)
        else:
            watch_time_hours = 0.0
            
        records.append({
            "Content Title": title,
            "Publish Date": pub_dt.strftime("%Y-%m-%d %H:%M:%S"),
            "Format Type": fmt,
            "Duration (sec)": duration_sec,
            "Views": f"{views:,}",  # Realistic formatted string to test cleaning
            "Likes": f"{likes:,}",
            "Comments": comments,
            "Shares": shares,
            "Click-Through Rate (%)": f"{ctr}%",  # String with percentage sign
            "Watch Time (Hours)": watch_time_hours,
        })
        
    df = pd.DataFrame(records)
    return df

if __name__ == "__main__":
    out_path = Path("assets/sample_data.csv")
    out_path.parent.mkdir(parents=True, exist_ok=True)
    df = generate_sample_dataset()
    df.to_csv(out_path, index=False)
    print(f"Generated {len(df)} sample creator records to {out_path}")
