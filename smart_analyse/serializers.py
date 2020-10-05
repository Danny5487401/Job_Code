from rest_framework import serializers

from .models import ExpectArea

class ExpectAreaSerializer(serializers.ModelSerializer):
    class Meta:
        model = ExpectArea
        fields = (
            'resume',
            'area',
        )
