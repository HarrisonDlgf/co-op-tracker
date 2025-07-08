import pytest
from app import app as flask_app
import json

def test_get_applications_empty():
    with flask_app.test_client() as client:
        resp = client.get('/applications')
        data = resp.get_json()
        assert resp.status_code == 200
        assert data['applications'] == []
        assert data['total_xp'] == 0
        assert data['level'] == 1

def test_add_application_and_xp():
    with flask_app.test_client() as client:
        payload = {
            "company": "Hogwarts & Co",
            "role": "Intern",
            "status": "Applied",
            "date_applied": "2004-09-07",
            "location": "Edinburgh, Scotland",
            "hybrid_support": "Remote",
            "hourly_wage": 30,
            "salary": 60000,
            "notes": "Test how to be a wizard",
            "potential_benefits": "None"
        }
        resp = client.post('/applications', data=json.dumps(payload), content_type='application/json')
        data = resp.get_json()
        assert resp.status_code == 201
        assert data['application']['company'] == "Hogwarts & Co"
        assert data['total_xp'] == 10  # applied = 10 XP
        assert data['level'] == 1

def test_update_application_status_and_xp():
    with flask_app.test_client() as client:
        # adding application here
        payload = {
            "company": "JediTraining",
            "role": "Jedi",
            "status": "Applied",
            "date_applied": "2024-01-02",
            "location": "Tatooine, EA",
            "hybrid_support": "In-Person",
            "hourly_wage": 100,
            "salary": 100000,
            "notes": "Testing how to be a Jedi",
            "potential_benefits": "The Force"
        }
        resp = client.post('/applications', data=json.dumps(payload), content_type='application/json')
        app_id = resp.get_json()['application']['id']
        # update status to offer 
        update_payload = payload.copy()
        update_payload['status'] = 'Offer'
        resp_2 = client.put(f'/applications/{app_id}', data=json.dumps(update_payload), content_type='application/json')
        data2 = resp_2.get_json()
        assert resp_2.status_code == 200
        assert data2['application']['status'] == 'Offer'
        assert data2['xp_change'] == 40

def test_user_profile_stats():
    with flask_app.test_client() as client:
        resp = client.get('/user/profile')
        data = resp.get_json()
        assert resp.status_code == 200
        assert 'user' in data
        assert 'stats' in data
        assert isinstance(data['user']['xp'], int)
        assert isinstance(data['user']['level'], int)
        assert isinstance(data['stats']['total_applications'], int) 