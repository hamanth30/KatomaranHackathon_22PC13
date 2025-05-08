import re
import datetime
from typing import List, Dict, Optional, Tuple

def parse_registration_data(text: str) -> List[Dict]:
    """Parse registration data from text format into structured data"""
    registrations = []
    
    # Split the text into individual registration records
    records = re.split(r'\n\n+', text.strip())
    
    for record in records:
        if not record.strip() or 'ID:' not in record:
            continue
            
        registration = {}
        lines = record.strip().split('\n')
        
        # Skip the header line if present
        start_idx = 0
        if 'Registration Records' in lines[0]:
            start_idx = 1
            
        for line in lines[start_idx:]:
            if ':' in line:
                key, value = line.split(':', 1)
                registration[key.strip()] = value.strip()
                
        if registration:
            registrations.append(registration)
            
    return registrations

def get_active_registrations(registrations: List[Dict]) -> List[Dict]:
    """Filter and return only active registrations"""
    return [reg for reg in registrations if reg.get('Status') == 'Active']

def get_inactive_registrations(registrations: List[Dict]) -> List[Dict]:
    """Filter and return only inactive registrations"""
    return [reg for reg in registrations if reg.get('Status') == 'Inactive']

def count_registrations(registrations: List[Dict], status: Optional[str] = None) -> int:
    """Count registrations, optionally filtered by status"""
    if status:
        return len([reg for reg in registrations if reg.get('Status') == status])
    return len(registrations)

def get_latest_registration(registrations: List[Dict]) -> Optional[Dict]:
    """Get the most recent registration based on registration date"""
    if not registrations:
        return None
        
    # Sort by registration date (most recent first)
    sorted_regs = sorted(
        registrations,
        key=lambda x: datetime.datetime.strptime(x.get('Registration Date', '1900-01-01'), '%Y-%m-%d'),
        reverse=True
    )
    
    return sorted_regs[0] if sorted_regs else None

def find_registration_by_name(registrations: List[Dict], name: str) -> Optional[Dict]:
    """Find a registration by name (case-insensitive partial match)"""
    name = name.lower()
    for reg in registrations:
        if name in reg.get('Name', '').lower():
            return reg
    return None

def get_registration_date_range(registrations: List[Dict]) -> Tuple[str, str]:
    """Get the earliest and latest registration dates"""
    if not registrations:
        return ('', '')
        
    dates = [reg.get('Registration Date', '1900-01-01') for reg in registrations]
    dates = [d for d in dates if d]
    
    if not dates:
        return ('', '')
        
    # Parse dates for comparison
    parsed_dates = [datetime.datetime.strptime(d, '%Y-%m-%d') for d in dates]
    
    # Get min and max dates
    min_date = min(parsed_dates).strftime('%Y-%m-%d')
    max_date = max(parsed_dates).strftime('%Y-%m-%d')
    
    return (min_date, max_date)

def generate_registration_summary(registrations: List[Dict]) -> str:
    """Generate a summary of registration data"""
    if not registrations:
        return "No registration data available."
        
    active_count = count_registrations(registrations, 'Active')
    inactive_count = count_registrations(registrations, 'Inactive')
    total_count = len(registrations)
    
    latest_reg = get_latest_registration(registrations)
    latest_name = latest_reg.get('Name', 'Unknown') if latest_reg else 'Unknown'
    latest_date = latest_reg.get('Registration Date', 'Unknown') if latest_reg else 'Unknown'
    
    date_range = get_registration_date_range(registrations)
    
    summary = f"""Registration Summary:
- Total Registrations: {total_count}
- Active Registrations: {active_count}
- Inactive Registrations: {inactive_count}
- Registration Period: {date_range[0]} to {date_range[1]}
- Latest Registration: {latest_name} on {latest_date}
"""
    
    return summary