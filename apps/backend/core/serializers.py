from rest_framework import serializers

from .models import Category, Note


class UserSerializer(serializers.Serializer):
    id = serializers.IntegerField(read_only=True)
    email = serializers.EmailField(read_only=True)


class CategorySerializer(serializers.ModelSerializer):
    note_count = serializers.IntegerField(read_only=True, default=0)

    class Meta:
        model = Category
        fields = ["id", "name", "color", "note_count"]


class NoteSerializer(serializers.ModelSerializer):
    category = CategorySerializer(read_only=True)
    category_id = serializers.PrimaryKeyRelatedField(
        source="category", queryset=Category.objects.none(), write_only=True
    )

    class Meta:
        model = Note
        fields = ["id", "title", "content", "category", "category_id", "created_at", "updated_at"]
        read_only_fields = ["created_at", "updated_at"]

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        request = self.context.get("request")
        if request is not None:
            self.fields["category_id"].queryset = Category.objects.filter(user=request.user)
