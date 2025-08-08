#Test CSV import with user's file format
import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from bulk_import import ApplicationImporter

def test_csv_import():
    #Test CSV import with user's file format
    print("Testing CSV import with user's file format...")
    
    # Sample CSV data matching user's format
    csv_data = """Company,Position,Date Applied,status,Details,Applicant Portal
Rockstar,Data Analytics / Data Science (NY),9/19,Submitted,"on greenhouse, not NUWorks and had a CL",
Rockstar,Data Analytics / Data Science (Carlsbad),9/19/24,Submitted,CL submitted,
Rockstar,Data Analytics / Data Science (London),9/19/24,Submitted,CL submitted,
Boston Red Sox,Accounting Co-Op,9/24/24,Submitted,,
Boston Red Sox,Accounting Operations Co-Op,9/24/24,Submitted,,
Cisco,Software Engineer Co-Op,9/24/24,Submitted,,
TJX,HomeGoods Distribution Services - Prod & Fin,9/27/24,Interviewing,interviewing stage,
Wayfair,IT Engineering Co-Op,9/29/24,Submitted,,
MFS Investment,Distribution Sales Reporting Co-Op,9/30/24,Submitted,,
Dispatch Technologies,Software Engineer ,9/30/24,Submitted,,
Wayfair,Software Engineering Co-Op,9/30/24,Submitted,,
Coverys,Business Analytics Co-Op,10/1/24,Submitted,,
State Street,GTS - Software Developer Co-Op,10/1/24,Submitted,,https://statestreet.wd1.myworkdayjobs.com/en-US/Global/userHome
State Street,Alpha - Project Analyst Co-Op,10/1/24,Submitted,,https://statestreet.wd1.myworkdayjobs.com/en-US/Global/userHome
Parametric Portfolio Associates,Software Engineer Co-Op,10/2/24,Submitted,,
Arbella Mutual Insurance,Data Science Co-Op,10/2/24,Submitted,,
Keurig Dr. Pepper,Data Analyst Co-Op,10/2/24,Submitted,,
Keurig Dr. Pepper,"Digital Marketing, CRM Co-Op",10/2/24,Submitted,,
TJX,Financial Audit Co-Op,10/2/24,Submitted,,
Wayfair,Commerical Analyst Co-Op,10/3/24,Rejected,,
Wayfair,Operations Analyst Co-Op,10/3/24,Rejected,* rejected on Oct 7,
State Street,Alpha - Implementation Business Analyst ,10/5/24,Submitted,,https://statestreet.wd1.myworkdayjobs.com/en-US/Global/userHome
State Street,SSGA - CCG Business Analytics,10/5/24,Submitted,,https://statestreet.wd1.myworkdayjobs.com/en-US/Global/userHome
Boston Red Sox,CRM Business Analyst Co-Op,10/5/24,Interviewing,"Was final rounded, but ultimately rejected",
Symbotic,Data Analyics Intern,10/5/24,Rejected,,
Baltimore Orioles,Develop Co-Op,10/7/24,Accepted!,spoke with William and made a new resume,
Unilever,Supply Chain Co-Op,10/5/24,Submitted,,https://unilever.wd3.myworkdayjobs.com/en-US/Unilever_Early_Careers/userHome
Natixis Investment Managers,Internal Audit Co-Op,10/5/24,Submitted,,
Bimbo Bakeries,Little Bites Marketing Co-Op,10/5/24,Interviewing,,https://careers.bimbobakeriesusa.com/careerhub/my/jobs/applications
Scotiabank,Leveraged Finance Co-Op,10/5/24,Submitted,,
Contributor Development Partnership,Business Data & Analytics Co-Op,10/5/24,Submitted,,
TRC Advisory,Management / Strategy Consultant Co-Op,10/5/24,Interviewing,*used harrisoncdolgoff@gmail.com,https://jobs.ashbyhq.com/trcadvisory/3c02b0a4-0faf-43dc-910f-9b86d38c8129/application
Tiger Group,Financial Analyst Co-Op,10/6/24,Submitted,,
Verisk,Junior Software Developer Co-Op ,10/6/24,Submitted,,https://jobs.smartrecruiters.com/my-applications/Verisk/93612ba5-82f8-4095-91cc-e1924d6f7a9a?dcr_ci=Verisk
Pegasystems Inc.,Software Engineer Co-Op,10/6/24,Submitted,,
Boston Red Sox,Business Intelligence & Reporting Co-op,,In Progress,Need a cover letter,
"QuickBase, Inc.",Marketing Co-Op,10/6/24,Submitted,,
WHOOP,Business Development Co-Op,,In Progress,"Need a cover letter, also talk to Dan",
Alkali Partners LLC,Investment Banking Analyst,10/6/24,Rejected,Took an aptitude test,
TJX,Data Science Co-op,10/6/24,Submitted,,
"Smartleaf, Inc",Software Development Co-Op,10/6/24,Submitted,,
Kenvue,Supply Chain Manufacturing Co-Op,10/7/24,Submitted,,https://kenvue.taleo.net/careersection/careersection/2/mysubmissions.ftl?lang=en
Sparx Hockey,Entry Level Software Engineer,10/7/24,Submitted,,
Litify,Software Engineering Co-Op,10/7/24,Submitted,,
AEW,Infrastructure Co-Op,10/13,Submitted,,
Travelers,Engineering EDP Co-Op,10/16,Submitted,* saw at career fair * try to find CF guy,https://travelers.wd5.myworkdayjobs.com/en-US/External/userHome
GEICO Insurance,Development Program - Software Engineering,10/16,Rejected,,https://geico.wd1.myworkdayjobs.com/en-US/External/userHome
GEICO Insurance,Analyst Intern,10/16/24,Rejected,,
Symbotic,Financial Reporting,10/17/24,Accepted!,,
Atlanta Braves,Amateur Scouting Associate,10/18/24,Submitted,,
Claim,Software Engineer,10/21/24,Submitted,,
Wellington Management Company,Investment Platform Technology Co-Op,10/22/24,Submitted,"""
    
    # Create mock user ID
    user_id = 1
    
    # Test import
    importer = ApplicationImporter(user_id)
    result = importer.import_from_csv(csv_data)
    
    print(f"✓ CSV parsing successful")
    print(f"Successful imports: {len(result.successful_imports)}")
    print(f"Failed imports: {len(result.failed_imports)}")
    print(f"Total XP gained: {result.total_xp_gained}")
    print(f"Duplicates skipped: {result.duplicates_skipped}")
    
    if result.failed_imports:
        print("\nFailed imports:")
        for failed in result.failed_imports[:5]:  # Show first 5
            print(f"  Row {failed['row']}: {failed['errors']}")
    
    if result.successful_imports:
        print(f"\nFirst few successful imports:")
        for app in result.successful_imports[:3]:
            print(f"  {app['company']} - {app['position']} ({app['status']})")
    
    print("✓ CSV import test completed!")

if __name__ == "__main__":
    test_csv_import()
