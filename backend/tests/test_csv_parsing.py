import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

import pandas as pd
from io import StringIO
from bulk_import import ApplicationImporter

def test_csv_parsing():
    #Test CSV parsing and column mapping
    print("Testing CSV parsing and column mapping...")
    
    # Sample CSV data matching user's format
    csv_data = """Company,Position,Date Applied,status,Details,Applicant Portal
Rockstar,Data Analytics / Data Science (NY),9/19,Submitted,"on greenhouse, not NUWorks and had a CL",
Rockstar,Data Analytics / Data Science (Carlsbad),9/19/24,Submitted,CL submitted,
Boston Red Sox,Accounting Co-Op,9/24/24,Submitted,,
TJX,HomeGoods Distribution Services - Prod & Fin,9/27/24,Interviewing,interviewing stage,
Wayfair,Commerical Analyst Co-Op,10/3/24,Rejected,,
Baltimore Orioles,Develop Co-Op,10/7/24,Accepted!,spoke with William and made a new resume,
Boston Red Sox,Business Intelligence & Reporting Co-op,,In Progress,Need a cover letter,"""
    
    try:
        # Parse CSV
        df = pd.read_csv(StringIO(csv_data))
        print(f"CSV loaded successfully with {len(df)} rows")
        print(f"Original columns: {list(df.columns)}")
        
        # Test column mapping
        importer = ApplicationImporter(user_id=1)
        
        # Apply column mapping manually
        column_mapping = {
            'company': ['company', 'company name', 'employer'],
            'position': ['position', 'position title', 'job title', 'role', 'title'],
            'status': ['status', 'application status', 'state'],
            'applied_date': ['applied_date', 'date applied', 'application date', 'date'],
            'notes': ['notes', 'details', 'comments', 'description']
        }
        
        # Normalize column names to lowercase and strip whitespace
        df.columns = [col.strip().lower() for col in df.columns]
        print(f"Normalized columns: {list(df.columns)}")
        
        # Map column names to standard format
        for standard_name, variations in column_mapping.items():
            for col in df.columns:
                if col in variations:
                    df = df.rename(columns={col: standard_name})
                    break
        
        print(f"Mapped columns: {list(df.columns)}")
        
        # Test status mapping
        print("\nTesting status mapping:")
        for status in ['Submitted', 'Interviewing', 'Rejected', 'Accepted!', 'In Progress']:
            normalized = importer.normalize_status(status)
            print(f"  '{status}' -> '{normalized}'")
        
        # Test date parsing
        print("\nTesting date parsing:")
        test_dates = ['9/19', '9/19/24', '10/5/24', '']
        for date_str in test_dates:
            parsed = importer.parse_date(date_str)
            print(f"  '{date_str}' -> {parsed}")
        
        # Test row validation
        print("\nTesting row validation:")
        for index, row in df.iterrows():
            row_dict = row.to_dict()
            is_valid, errors = importer.validate_row(row_dict, index + 2)
            print(f"  Row {index + 2}: {'✓ Valid' if is_valid else '✗ Invalid'}")
            if not is_valid:
                for error in errors:
                    print(f"    - {error}")
        
        print("\nCSV parsing test completed successfully!")
        
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    test_csv_parsing()
