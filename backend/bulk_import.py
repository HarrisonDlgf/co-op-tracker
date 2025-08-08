import pandas as pd
import io
from datetime import datetime
from typing import List, Dict, Tuple, Optional
from models import Application, calculate_xp, get_level
from database import db


class BulkImportResult:
    def __init__(self):
        self.successful_imports: List[Dict] = []
        self.failed_imports: List[Dict] = []
        self.total_xp_gained: int = 0
        self.duplicates_skipped: int = 0

    def to_dict(self) -> Dict:
        return {
            'successful_imports': self.successful_imports,
            'failed_imports': self.failed_imports,
            'total_xp_gained': self.total_xp_gained,
            'duplicates_skipped': self.duplicates_skipped,
            'summary': {
                'total_processed': len(self.successful_imports) + len(self.failed_imports),
                'successful': len(self.successful_imports),
                'failed': len(self.failed_imports),
                'duplicates': self.duplicates_skipped
            }
        }


class ApplicationImporter:
    VALID_STATUSES = ['Applied', 'Interviewing', 'Offer', 'Rejected', 'Ghosted', 'Withdrawn']
    STATUS_MAPPING = {
        'applied': 'Applied',
        'submitted': 'Applied',
        'interviewing': 'Interviewing',
        'interview': 'Interviewing',
        'offer': 'Offer',
        'accepted': 'Offer',
        'accepted!': 'Offer',
        'rejected': 'Rejected',
        'ghosted': 'Ghosted',
        'withdrawn': 'Withdrawn',
        'in progress': 'Applied'
    }
    REQUIRED_FIELDS = ['company', 'position', 'status']
    OPTIONAL_FIELDS = ['applied_date', 'notes']
    
    def __init__(self, user_id: int):
        self.user_id = user_id
        self.result = BulkImportResult()
    
    def validate_status(self, status: str) -> bool:
        normalized_status = status.lower().strip()
        return normalized_status in self.STATUS_MAPPING or status in self.VALID_STATUSES
    
    def normalize_status(self, status: str) -> str:
        normalized_status = status.lower().strip()
        return self.STATUS_MAPPING.get(normalized_status, status)
    
    def parse_date(self, date_str: str) -> Optional[datetime]:
        if not date_str or pd.isna(date_str):
            return None
        try:
            for fmt in ['%Y-%m-%d', '%m/%d/%Y', '%m-%d-%Y', '%Y/%m/%d', '%m/%d', '%m/%d/%y']:
                try:
                    parsed = datetime.strptime(str(date_str).strip(), fmt)
                    if parsed.year == 1900:
                        current_year = datetime.now().year
                        test_date = parsed.replace(year=current_year)
                        if test_date > datetime.now():
                            parsed = parsed.replace(year=current_year - 1)
                        else:
                            parsed = parsed.replace(year=current_year)
                    return parsed
                except ValueError:
                    continue
            
            parsed = pd.to_datetime(date_str, errors='coerce')
            if pd.notna(parsed):
                return parsed.to_pydatetime()
            return None
        except Exception:
            return None
    
    def validate_row(self, row: Dict, row_index: int) -> Tuple[bool, List[str], List[str]]:
        errors = []
        warnings = []
        for field in self.REQUIRED_FIELDS:
            if field not in row or pd.isna(row[field]) or str(row[field]).strip() == '':
                errors.append(f"Missing required field: {field}")
        if 'status' in row and not pd.isna(row['status']):
            status = str(row['status']).strip()
            if not self.validate_status(status):
                errors.append(f"Invalid status: {status}. Must be one of: {', '.join(self.VALID_STATUSES)} or common variations like 'Submitted', 'Accepted', etc.")
        # Don't validate date format - just warn if invalid but don't fail the row
        if 'applied_date' in row and not pd.isna(row['applied_date']):
            parsed_date = self.parse_date(str(row['applied_date']))
            if parsed_date is None:
                warnings.append(f"Warning: Invalid date format '{row['applied_date']}' - date will be left blank")
        
        return len(errors) == 0, errors, warnings
    
    def check_duplicate(self, company: str, position: str, applied_date: Optional[datetime]) -> bool:
        """Check if application already exists"""
        # Normalize company and position names for comparison
        normalized_company = company.strip().lower()
        normalized_position = position.strip().lower()
        
        # Check for existing applications with same company and position
        existing_apps = Application.query.filter_by(
            user_id=self.user_id
        ).all()
        
        for app in existing_apps:
            # Compare normalized names
            if (app.company.strip().lower() == normalized_company and 
                app.position.strip().lower() == normalized_position):
                # If date is provided, check if it's the same date
                if applied_date and app.applied_date:
                    if app.applied_date.date() == applied_date.date():
                        return True
                # If no date provided or dates don't match, still consider it a duplicate
                # but allow it if the dates are different
                elif not applied_date and not app.applied_date:
                    return True
                elif applied_date and not app.applied_date:
                    return True
                elif not applied_date and app.applied_date:
                    return True
        
        return False
    
    def import_from_dataframe(self, df: pd.DataFrame) -> BulkImportResult:
        print(f"Processing DataFrame with shape: {df.shape}")
        print(f"Original columns: {list(df.columns)}")
        
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
        
        for index, row in df.iterrows():
            row_dict = row.to_dict()
            row_index = index + 2 
            
            # Clean the row_dict to handle NaN values
            cleaned_row_dict = {}
            for key, value in row_dict.items():
                if pd.isna(value):
                    cleaned_row_dict[key] = ''
                else:
                    cleaned_row_dict[key] = str(value)
            
            is_valid, errors, warnings = self.validate_row(cleaned_row_dict, row_index)
            
            if not is_valid:
                self.result.failed_imports.append({
                    'row': row_index,
                    'data': cleaned_row_dict,
                    'errors': errors
                })
                continue
            
            if warnings:
                print(f"Row {row_index} warnings: {warnings}")
            
            company = str(row_dict['company']).strip() if not pd.isna(row_dict['company']) else ''
            position = str(row_dict['position']).strip() if not pd.isna(row_dict['position']) else ''
            status = self.normalize_status(str(row_dict['status']).strip()) if not pd.isna(row_dict['status']) else ''
            applied_date = self.parse_date(row_dict.get('applied_date', ''))
            notes = str(row_dict.get('notes', '')).strip() if 'notes' in row_dict and not pd.isna(row_dict['notes']) else None
            
            if self.check_duplicate(company, position, applied_date):
                self.result.duplicates_skipped += 1
                self.result.failed_imports.append({
                    'row': row_index,
                    'data': cleaned_row_dict,
                    'errors': [f'Duplicate application found: {company} - {position}']
                })
                continue
            
            try:
                app = Application(
                    company=company,
                    position=position,
                    status=status,
                    applied_date=applied_date,
                    notes=notes,
                    user_id=self.user_id
                )
                
                db.session.add(app)
                db.session.flush()
                
                xp_gained = calculate_xp(status)
                self.result.total_xp_gained += xp_gained
                
                self.result.successful_imports.append({
                    'row': row_index,
                    'application_id': app.id,
                    'company': company,
                    'position': position,
                    'status': status,
                    'xp_gained': xp_gained
                })
                
            except Exception as e:
                db.session.rollback()
                self.result.failed_imports.append({
                    'row': row_index,
                    'data': cleaned_row_dict,
                    'errors': [f'Database error: {str(e)}']
                })
        
        return self.result
    
    def import_from_csv(self, csv_content: str) -> BulkImportResult:
        try:
            df = pd.read_csv(io.StringIO(csv_content))
            print(f"CSV parsed successfully. Shape: {df.shape}, Columns: {list(df.columns)}")
            return self.import_from_dataframe(df)
        except Exception as e:
            print(f"CSV parsing error: {str(e)}")
            self.result.failed_imports.append({
                'row': 1,
                'data': {},
                'errors': [f'CSV parsing error: {str(e)}']
            })
            return self.result
    
    def import_from_excel(self, excel_content: bytes) -> BulkImportResult:
        try:
            df = pd.read_excel(io.BytesIO(excel_content))
            return self.import_from_dataframe(df)
        except Exception as e:
            self.result.failed_imports.append({
                'row': 1,
                'data': {},
                'errors': [f'Excel parsing error: {str(e)}']
            })
            return self.result
    
    def import_from_json(self, applications: List[Dict]) -> BulkImportResult:
        df = pd.DataFrame(applications)
        return self.import_from_dataframe(df)


def get_import_template() -> Dict:
    return {
        'columns': {
            'company': 'Company name (required)',
            'position': 'Job position/title (required)',
            'status': f'Application status (required) - Options: {", ".join(ApplicationImporter.VALID_STATUSES)}',
            'applied_date': 'Date applied (optional) - Format: YYYY-MM-DD or MM/DD/YYYY',
            'notes': 'Additional notes (optional)'
        },
        'example_row': {
            'company': 'Google',
            'position': 'Software Engineer Co-op',
            'status': 'Applied',
            'applied_date': '2024-01-15',
            'notes': 'Applied through LinkedIn'
        },
        'supported_formats': ['CSV', 'Excel (.xlsx, .xls)', 'JSON'],
        'max_file_size': '10MB',
        'max_rows': 1000
    }
