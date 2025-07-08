from dataclasses import dataclass, field
from typing import Optional, List
from datetime import datetime

@dataclass
class Application:
    id: int
    company: str
    role: str
    status: str  # e.g., Applied, Interviewing, Offer (potentially an enum)
    date_applied: str
    location: str # can be hybrid, remote, in-person
    hybrid_support: str # can be partial, full, none
    hourly_wage: int
    salary: int
    notes: str
    potential_benefits: Optional[str] = None
    xp: int = 0  # XP earned for this application

@dataclass
class User:
    id: int
    name: str
    email: str
    applications: List[Application] = field(default_factory=list)
    xp: int = 0
    level: int = 1
    joined: Optional[datetime] = None
    achievements: List['Achievement'] = field(default_factory=list)

@dataclass
class Achievement:
    id: int
    name: str
    description: str
    icon: str
    condition_met: bool = False

@dataclass
class OfferFeedPost:
    id: int
    user_id: int
    company: str
    role: str
    date_posted: datetime
    message: str
    xp_awarded: int
    
def calculate_xp(status: str) -> int:
    """Calculate XP based on application status"""
    xp_map = {
        'Applied': 10,
        'Interviewing': 20,
        'Offer': 50,
        'Rejected': 5,  # Small XP for effort
        'Ghosted': 10,   # feels bad
        'Withdrawn': 0
    }
    return xp_map.get(status, 0)

def get_level(xp: int) -> int:
    """Calculate user level based on total XP"""
    return (xp // 100) + 1 