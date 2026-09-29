from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.config import settings
from app.models.project import Project

engine = create_engine(settings.DATABASE_URL)
Session = sessionmaker(bind=engine)
connection = engine.connect()
transaction = connection.begin()
session = Session(bind=connection)
session.begin_nested()

print("Before:", session.query(Project).count())
p = Project(id="tx-test-proj", name="tx")
session.add(p)
session.commit()
print("After commit inside test:", session.query(Project).count())

session.close()
transaction.rollback()
connection.close()

session2 = Session()
print("After rollback (new session):", session2.query(Project).count())
session2.close()
