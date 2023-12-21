# Generated by Django 5.0 on 2023-12-21 01:13

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('category', '0001_initial'),
        ('currency', '0002_insert_initial_data'),
        ('fileupload', '0001_initial'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Transaction',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('code', models.CharField(max_length=20)),
                ('amount', models.DecimalField(decimal_places=2, max_digits=10)),
                ('date', models.DateField()),
                ('description', models.CharField(blank=True, max_length=255, null=True)),
                ('inferred_category', models.BooleanField(default=False)),
                ('category', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, to='category.category')),
                ('currency', models.ForeignKey(default='CAD', on_delete=django.db.models.deletion.PROTECT, to='currency.currency')),
                ('file', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.PROTECT, to='fileupload.fileupload')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
    ]
