from django.contrib.auth import authenticate, get_user_model, login, logout
from django.db.models import Count
from django.views.decorators.csrf import ensure_csrf_cookie
from rest_framework import status, viewsets
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response

from .models import Category, Note
from .serializers import CategorySerializer, NoteSerializer, UserSerializer

User = get_user_model()


@api_view(["GET"])
@permission_classes([AllowAny])
def health(request):
    return Response({"status": "ok"})


@api_view(["POST"])
@permission_classes([AllowAny])
def register(request):
    email = (request.data.get("email") or "").strip().lower()
    password = request.data.get("password") or ""
    if not email or not password:
        return Response({"detail": "Email and password are required."}, status=status.HTTP_400_BAD_REQUEST)
    if User.objects.filter(email=email).exists():
        return Response({"detail": "An account with this email already exists."}, status=status.HTTP_400_BAD_REQUEST)
    user = User.objects.create_user(email=email, password=password)
    login(request, user)
    return Response(UserSerializer(user).data, status=status.HTTP_201_CREATED)


@api_view(["POST"])
@permission_classes([AllowAny])
def login_view(request):
    email = (request.data.get("email") or "").strip().lower()
    password = request.data.get("password") or ""
    user = authenticate(request, username=email, password=password)
    if user is None:
        return Response({"detail": "Invalid email or password."}, status=status.HTTP_401_UNAUTHORIZED)
    login(request, user)
    return Response(UserSerializer(user).data)


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def logout_view(request):
    logout(request)
    return Response(status=status.HTTP_204_NO_CONTENT)


@api_view(["GET"])
@ensure_csrf_cookie
@permission_classes([AllowAny])
def me(request):
    if not request.user.is_authenticated:
        return Response({"detail": "Not authenticated."}, status=status.HTTP_401_UNAUTHORIZED)
    return Response(UserSerializer(request.user).data)


class CategoryViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = CategorySerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return (
            Category.objects.filter(user=self.request.user)
            .annotate(note_count=Count("notes"))
            .order_by("name")
        )


class NoteViewSet(viewsets.ModelViewSet):
    serializer_class = NoteSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        qs = Note.objects.filter(user=self.request.user).select_related("category")
        category_id = self.request.query_params.get("category")
        if category_id:
            qs = qs.filter(category_id=category_id)
        return qs.order_by("-created_at")

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
