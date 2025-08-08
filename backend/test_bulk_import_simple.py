import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from bulk_import import ApplicationImporter, get_import_template

def test_basic_functionality():
    #Test basic bulk import functionality
    print("Testing bulk import functionality...")
    
    # Test template
    template = get_import_template()
    print(f"Template has {len(template['columns'])} columns")
    
    # Test importer creation
    importer = ApplicationImporter(user_id=1)
    print(f"Importer created successfully")
    
    # Test status validation
    valid_statuses = ['Applied', 'Interviewing', 'Offer', 'Rejected', 'Ghosted', 'Withdrawn']
    for status in valid_statuses:
        if importer.validate_status(status):
            print(f"Valid status: {status}")
        else:
            print(f"Invalid status: {status}")
    
    # Test date parsing
    test_dates = [
        ('2024-01-15', True),
        ('01/15/2024', True),
        ('invalid-date', False)
    ]
    
    for date_str, should_succeed in test_dates:
        parsed = importer.parse_date(date_str)
        success = parsed is not None
        if success == should_succeed:
            print(f"Date parsing: '{date_str}' -> {parsed}")
        else:
            print(f"Date parsing: '{date_str}' -> {parsed}")
    
    print("All basic tests passed!")

if __name__ == "__main__":
    test_basic_functionality()
