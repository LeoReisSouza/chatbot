from fastapi.testclient import TestClient
from ..app.main import app

client = TestClient(app)

def test_register_user():
    response = client.post("/api/auth/register", json={"username": "testuser", "password": "testpass"})
    assert response.status_code == 200
    assert "access_token" in response.json()

def test_login_user():
    response = client.post("/api/auth/login", json={"username": "testuser", "password": "testpass"})
    assert response.status_code == 200
    assert "access_token" in response.json()

def test_chat_with_bot():
    response = client.post("/api/chat", json={"user_message": "Hello", "user": {"username": "testuser"}})
    assert response.status_code == 200
    assert "message" in response.json()
    assert "response" in response.json()