import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from bulk_import import ApplicationImporter, get_import_template
import pandas as pd
from io import StringIO

def test_import_template():
    #Test the import template function
    print("Testing import template...")
    template = get_import_template()
    print(f"Template: {template}")
    print("✓ Import template test passed\n")

def test_csv_import():
    print("Testing CSV import...")
    
    # Sample CSV data
    csv_data = """company,position,status,applied_date,notes
Google,Software Engineer Co-op,Applied,2024-01-15,Applied through LinkedIn
Microsoft,Data Science Intern,Interviewing,2024-01-20,First round interview scheduled
Amazon,Frontend Developer Co-op,Offer,2024-01-25,Received offer letter"""
    
    # Create mock user ID
    user_id = 1
    
    # Test import
    importer = ApplicationImporter(user_id)
    result = importer.import_from_csv(csv_data)
    
    print(f"Successful imports: {len(result.successful_imports)}")
    print(f"Failed imports: {len(result.failed_imports)}")
    print(f"Total XP gained: {result.total_xp_gained}")
    print(f"Duplicates skipped: {result.duplicates_skipped}")
    
    if result.successful_imports:
        print("CSV import test passed\n")
    else:
        print("CSV import test failed\n")

def test_validation():
    #Test data validation
    print("Testing data validation...")
    
    # Test valid data
    valid_row = {
        'company': 'Test Company',
        'position': 'Test Position',
        'status': 'Applied',
        'applied_date': '2024-01-15',
        'notes': 'Test notes'
    }
    
    importer = ApplicationImporter(1)
    is_valid, errors = importer.validate_row(valid_row, 1)
    
    if is_valid and not errors:
        print("Valid data test passed")
    else:
        print(f"Valid data test failed: {errors}")
    
    # Test invalid data
    invalid_row = {
        'company': 'Test Company',
        'position': '',  # Missing required field
        'status': 'Invalid Status',  # Invalid status
        'applied_date': 'invalid-date',  # Invalid date
        'notes': 'Test notes'
    }
    
    is_valid, errors = importer.validate_row(invalid_row, 2)
    
    if not is_valid and len(errors) > 0:
        print("Invalid data test passed")
    else:
        print("Invalid data test failed")
    
    print("✓ Data validation test passed\n")

def test_date_parsing():
    #Test date parsing functionality
    print("Testing date parsing...")
    
    importer = ApplicationImporter(1)
    
    # Test various date formats
    test_dates = [
        ('2024-01-15', True),
        ('01/15/2024', True),
        ('01-15-2024', True),
        ('2024/01/15', True),
        ('invalid-date', False),
        ('', False),
        (None, False)
    ]
    
    for date_str, should_succeed in test_dates:
        parsed = importer.parse_date(date_str)
        success = parsed is not None
        
        if success == should_succeed:
            print(f"Date parsing: '{date_str}' -> {parsed}")
        else:
            print(f"Date parsing: '{date_str}' -> {parsed}")
    
    print("Date parsing test passed\n")

def test_status_validation():
    #Test status validation
    print("Testing status validation...")
    
    importer = ApplicationImporter(1)
    
    valid_statuses = ['Applied', 'Interviewing', 'Offer', 'Rejected', 'Ghosted', 'Withdrawn']
    invalid_statuses = ['Invalid', 'Pending', 'Accepted', '']
    
    # Test valid statuses
    for status in valid_statuses:
        if importer.validate_status(status):
            print(f"Valid status: {status}")
        else:
            print(f"Valid status failed: {status}")
    
    # Test invalid statuses
    for status in invalid_statuses:
        if not importer.validate_status(status):
            print(f"Invalid status correctly rejected: {status}")
        else:
            print(f"Invalid status incorrectly accepted: {status}")
    
    print("Status validation test passed\n")

if __name__ == "__main__":
    print("Running bulk import tests...\n")
    
    test_import_template()
    test_validation()
    test_date_parsing()
    test_status_validation()
    test_csv_import()
    
    print("All tests completed!")
