import uuid
from datetime import datetime
from sqlalchemy import Column, String, Integer, Text, DateTime, ForeignKey, Enum as SQLEnum
from sqlalchemy.orm import relationship
from .database import Base

class Scan(Base):
    __tablename__ = "scans"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    target_url = Column(String(512), nullable=False)
    github_repo = Column(String(256), nullable=True)
    status = Column(String(32), default="PENDING")  # PENDING, RUNNING, COMPLETED, FAILED
    scan_mode = Column(String(32), default="CHAOS_MONKEY")
    total_bugs = Column(Integer, default=0)
    healed_bugs = Column(Integer, default=0)
    summary = Column(Text, nullable=True)
    started_at = Column(DateTime, default=datetime.utcnow)
    completed_at = Column(DateTime, nullable=True)

    incidents = relationship("Incident", back_populates="scan", cascade="all, delete-orphan")
    logs = relationship("ScanLog", back_populates="scan", cascade="all, delete-orphan")

class Incident(Base):
    __tablename__ = "incidents"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    scan_id = Column(String(36), ForeignKey("scans.id"), nullable=False)
    bug_type = Column(String(64), nullable=False) # CONSOLE_ERROR, PAGE_ERROR, NETWORK_FAIL, DEAD_CLICK, LAYOUT_BLOCK
    severity = Column(String(32), default="HIGH") # CRITICAL, HIGH, MEDIUM, LOW
    message = Column(Text, nullable=False)
    stack_trace = Column(Text, nullable=True)
    url = Column(String(512), nullable=False)
    selector = Column(String(256), nullable=True)
    dom_context = Column(Text, nullable=True)
    screenshot_path = Column(String(512), nullable=True)
    screenshot_url = Column(String(512), nullable=True)
    
    # AI Healing details
    target_file = Column(String(256), nullable=True)
    original_code = Column(Text, nullable=True)
    fixed_code = Column(Text, nullable=True)
    diff = Column(Text, nullable=True)
    root_cause_en = Column(Text, nullable=True)
    root_cause_uz = Column(Text, nullable=True)
    
    # PR & Lifecycle
    pr_url = Column(String(512), nullable=True)
    pr_number = Column(Integer, nullable=True)
    status = Column(String(32), default="DETECTED") # DETECTED, HEALING, PATCHED, PR_CREATED, IGNORED
    created_at = Column(DateTime, default=datetime.utcnow)

    scan = relationship("Scan", back_populates="incidents")

class ScanLog(Base):
    __tablename__ = "scan_logs"

    id = Column(Integer, primary_key=True, autoincrement=True)
    scan_id = Column(String(36), ForeignKey("scans.id"), nullable=False)
    level = Column(String(16), default="INFO") # INFO, WARN, ERROR, HEAL, SUCCESS
    message = Column(Text, nullable=False)
    timestamp = Column(DateTime, default=datetime.utcnow)

    scan = relationship("Scan", back_populates="logs")
