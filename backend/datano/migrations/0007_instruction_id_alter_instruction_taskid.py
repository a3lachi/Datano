# Generated by Django 4.1.7 on 2023-03-05 12:56

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('datano', '0006_rename_askid_instruction_taskid'),
    ]

    operations = [
        migrations.AddField(
            model_name='instruction',
            name='id',
            field=models.BigAutoField(auto_created=True, default='lkjhg', primary_key=True, serialize=False, verbose_name='ID'),
            preserve_default=False,
        ),
        migrations.AlterField(
            model_name='instruction',
            name='taskId',
            field=models.TextField(unique=True),
        ),
    ]
