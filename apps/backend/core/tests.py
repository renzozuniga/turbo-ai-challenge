from django.test import TestCase
from django.urls import reverse

from core.models import Category, Note, User


class AuthFlowTests(TestCase):
    def test_register_seeds_categories_and_logs_in(self):
        response = self.client.post(
            reverse("register"),
            {"email": "new@example.com", "password": "testpass123"},
            content_type="application/json",
        )
        self.assertEqual(response.status_code, 201)
        user = User.objects.get(email="new@example.com")
        self.assertEqual(Category.objects.filter(user=user).count(), 4)

        me_response = self.client.get(reverse("me"))
        self.assertEqual(me_response.status_code, 200)
        self.assertEqual(me_response.json()["email"], "new@example.com")

    def test_register_duplicate_email_rejected(self):
        User.objects.create_user(email="dup@example.com", password="testpass123")
        response = self.client.post(
            reverse("register"),
            {"email": "dup@example.com", "password": "testpass123"},
            content_type="application/json",
        )
        self.assertEqual(response.status_code, 400)

    def test_login_and_logout(self):
        User.objects.create_user(email="login@example.com", password="testpass123")
        login_response = self.client.post(
            reverse("login"),
            {"email": "login@example.com", "password": "testpass123"},
            content_type="application/json",
        )
        self.assertEqual(login_response.status_code, 200)

        logout_response = self.client.post(reverse("logout"))
        self.assertEqual(logout_response.status_code, 204)

        me_response = self.client.get(reverse("me"))
        self.assertEqual(me_response.status_code, 401)

    def test_login_wrong_password_rejected(self):
        User.objects.create_user(email="wrong@example.com", password="testpass123")
        response = self.client.post(
            reverse("login"),
            {"email": "wrong@example.com", "password": "nope"},
            content_type="application/json",
        )
        self.assertEqual(response.status_code, 401)


class NotesScopingTests(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(email="owner@example.com", password="testpass123")
        self.other_user = User.objects.create_user(email="other@example.com", password="testpass123")
        self.category = Category.objects.get(user=self.user, name="School")
        self.other_category = Category.objects.get(user=self.other_user, name="School")
        self.client.force_login(self.user)

    def test_create_and_list_notes_scoped_to_user(self):
        create_response = self.client.post(
            "/api/notes/",
            {"title": "Mine", "content": "hello", "category_id": self.category.id},
            content_type="application/json",
        )
        self.assertEqual(create_response.status_code, 201)

        Note.objects.create(user=self.other_user, category=self.other_category, title="Not mine", content="x")

        list_response = self.client.get("/api/notes/")
        self.assertEqual(list_response.status_code, 200)
        titles = [n["title"] for n in list_response.json()]
        self.assertEqual(titles, ["Mine"])

    def test_cannot_assign_another_users_category(self):
        response = self.client.post(
            "/api/notes/",
            {"title": "Sneaky", "content": "x", "category_id": self.other_category.id},
            content_type="application/json",
        )
        self.assertEqual(response.status_code, 400)

    def test_category_filter(self):
        other_category = Category.objects.get(user=self.user, name="Personal")
        Note.objects.create(user=self.user, category=self.category, title="A", content="")
        Note.objects.create(user=self.user, category=other_category, title="B", content="")

        response = self.client.get(f"/api/notes/?category={self.category.id}")
        titles = [n["title"] for n in response.json()]
        self.assertEqual(titles, ["A"])

    def test_note_count_annotation(self):
        Note.objects.create(user=self.user, category=self.category, title="A", content="")
        response = self.client.get("/api/categories/")
        by_name = {c["name"]: c["note_count"] for c in response.json()}
        self.assertEqual(by_name["School"], 1)
        self.assertEqual(by_name["Personal"], 0)
