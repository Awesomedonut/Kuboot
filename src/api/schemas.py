from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

class UserBase(BaseModel):
    username: str
    email: str
    name: str
    bio: Optional[str] = None

class GoogleUserInfo(BaseModel):
    id: str
    email: str
    name: str
    picture: Optional[str] = None

class User(UserBase):
    id: int
    google_id: str
    picture: Optional[str] = None
    created_at: datetime
    
    class Config:
        from_attributes = True

class WorkBase(BaseModel):
    title: str
    summary: Optional[str] = None
    content: str
    tags: Optional[str] = None
    content_warnings: Optional[str] = None

class WorkCreate(WorkBase):
    pass

class WorkUpdate(BaseModel):
    title: Optional[str] = None
    summary: Optional[str] = None
    content: Optional[str] = None
    tags: Optional[str] = None
    content_warnings: Optional[str] = None
    is_published: Optional[bool] = None

class Work(WorkBase):
    id: int
    author_id: int
    is_published: bool
    word_count: int
    created_at: datetime
    updated_at: Optional[datetime]
    published_at: Optional[datetime]
    author: User
    
    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str