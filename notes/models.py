from django.db import models
from django.contrib.auth.models import User
import uuid
# Create your models here.
class Note(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    note_id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    note_title = models.CharField(max_length=255)
    note_content = models.TextField()
    last_update = models.DateTimeField(auto_now=True)
    created_on = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.note_title} by {self.user.username}"