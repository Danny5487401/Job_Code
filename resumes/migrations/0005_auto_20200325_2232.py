# Generated by Django 2.2 on 2020-03-25 14:32

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('resumes', '0004_auto_20200325_2224'),
    ]

    operations = [
        migrations.DeleteModel(
            name='OperatorLog',
        ),
        migrations.RemoveField(
            model_name='tag',
            name='operator',
        ),
        migrations.RemoveField(
            model_name='tag',
            name='step',
        ),
    ]
