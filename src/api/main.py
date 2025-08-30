from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from datetime import datetime, timedelta
from typing import List
import models
import schemas
import auth
from database import engine, get_db

models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="Kuboot API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"message": "Welcome to Kuboot API"}

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

@app.post("/auth/google", response_model=schemas.Token)
async def google_auth(token_data: dict, db: Session = Depends(get_db)):
    google_token = token_data.get("token")
    if not google_token:
        raise HTTPException(
            status_code=400,
            detail="Google token is required"
        )
    
    user_info = auth.verify_google_token(google_token)
    if not user_info:
        raise HTTPException(
            status_code=401,
            detail="Invalid Google token"
        )
    
    user = auth.create_or_get_user(db, user_info)
    
    access_token_expires = timedelta(minutes=auth.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = auth.create_access_token(
        data={"sub": str(user.id)}, expires_delta=access_token_expires
    )
    
    return {"access_token": access_token, "token_type": "bearer"}

@app.get("/auth/me", response_model=schemas.User)
async def get_current_user_info(current_user: models.User = Depends(auth.get_current_user)):
    return current_user

# Work endpoints
@app.post("/works", response_model=schemas.Work)
async def create_work(
    work: schemas.WorkCreate,
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(get_db)
):
    # Calculate word count (basic implementation)
    word_count = len(work.content.split()) if work.content else 0
    
    db_work = models.Work(
        **work.dict(),
        author_id=current_user.id,
        word_count=word_count
    )
    db.add(db_work)
    db.commit()
    db.refresh(db_work)
    return db_work

@app.get("/works", response_model=List[schemas.Work])
async def get_works(skip: int = 0, limit: int = 10, db: Session = Depends(get_db)):
    works = db.query(models.Work).filter(models.Work.is_published == True).offset(skip).limit(limit).all()
    return works

@app.get("/works/{work_id}", response_model=schemas.Work)
async def get_work(work_id: int, db: Session = Depends(get_db)):
    work = db.query(models.Work).filter(models.Work.id == work_id).first()
    if not work:
        raise HTTPException(status_code=404, detail="Work not found")
    return work

@app.put("/works/{work_id}", response_model=schemas.Work)
async def update_work(
    work_id: int,
    work_update: schemas.WorkUpdate,
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(get_db)
):
    work = db.query(models.Work).filter(models.Work.id == work_id).first()
    if not work:
        raise HTTPException(status_code=404, detail="Work not found")
    if work.author_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to edit this work")
    
    update_data = work_update.dict(exclude_unset=True)
    
    # Update word count if content changed
    if "content" in update_data:
        update_data["word_count"] = len(update_data["content"].split())
    
    # Set published_at when publishing
    if update_data.get("is_published") and not work.published_at:
        update_data["published_at"] = datetime.utcnow()
    
    for field, value in update_data.items():
        setattr(work, field, value)
    
    db.commit()
    db.refresh(work)
    return work

@app.get("/users/{user_id}/works", response_model=List[schemas.Work])
async def get_user_works(user_id: int, db: Session = Depends(get_db)):
    works = db.query(models.Work).filter(
        models.Work.author_id == user_id,
        models.Work.is_published == True
    ).all()
    return works

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)