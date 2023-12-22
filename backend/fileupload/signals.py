from datetime import datetime
from inference import infer_categories
import pandas as pd
from django.db.models.signals import post_save
from django.db import transaction
from django.dispatch import receiver
from category.models import Category
from transaction.models import Transaction
from .models import FileUpload, Status
import logging


@receiver(post_save, sender=FileUpload)
def process_file(sender, instance, created, **kwargs):
    """
    Process file after upload
    """
    if not created:
        return
    print("processing file")
    logging.info("processing file")

    # TODO: Use Celery task to process file
    # read file
    try:
        with open(instance.file.name, "r", encoding="utf-8") as f:
            instance.status = Status.IN_PROGRESS
            df = pd.read_csv(f)
            # validate column names
            expected_columns = ["Date", "Description", "Amount", "Category", "Code"]
            missing_cols = [col for col in expected_columns if col not in df.columns]
            if missing_cols:
                error_msg = f"Missing columns: {', '.join(missing_cols)}"
                instance.status = Status.FAILED
                instance.message = error_msg
                instance.save()
                return
            df["Amount"] = df["Amount"].apply(
                lambda x: float(x.replace(",", "")) if isinstance(x, str) else x
            )
            df["Amount"] = df["Amount"].apply(lambda x: round(x, 2))
            # validate data types
            df["Date"] = pd.to_datetime(
                df["Date"], format="mixed", dayfirst=False
            ).dt.date
            # round to 2 decimal places
            # validate date
            today = datetime.today().date()
            future_dates = df[df["Date"] > today]
            if not future_dates.empty:
                error_msg = (
                    f"rows {future_dates.index.tolist()} have dates in the future"
                )
                instance.status = Status.FAILED
                instance.message = error_msg
                instance.save()
                return

            df["Code"] = df["Code"].apply(
                lambda x: str(x).strip() if not pd.isnull(x) else ""
            )
            df["Category"] = df["Category"].apply(
                lambda x: str(x).title().strip() if not pd.isnull(x) else ""
            )
            # convert nan descriptions to empty string
            df["Description"] = df["Description"].apply(
                lambda x: str(x).strip() if not pd.isnull(x) else ""
            )
            csv_categories = set(df["Category"])
            existing_categories = Category.objects.filter(user=instance.user)
            # validate category exists
            missing_categories = [
                category
                for category in csv_categories
                if category
                and not existing_categories.filter(category=category).exists()
            ]
            if missing_categories:
                error_msg = f"Missing categories: {', '.join(missing_categories)}"
                instance.status = Status.FAILED
                instance.message = error_msg
                instance.save()
                return

            categories = [c.category for c in existing_categories]
            df = infer_categories(df, categories)

            with transaction.atomic():
                for index, row in df.iterrows():
                    print("row", row)
                    category = Category.objects.get(
                        user=instance.user, category=row["Category"]
                    )
                    print("category", category)
                    Transaction.objects.create(
                        date=row["Date"],
                        description=row["Description"],
                        amount=row["Amount"],
                        category=category,
                        code=row["Code"],
                        file=instance,
                        inferred_category=row["Inferred_Category"],
                        user=instance.user,
                    )
                instance.status = Status.COMPLETED
                instance.save()
    except Exception as e:
        instance.status = Status.FAILED
        instance.message = str(e)
        instance.save()
        raise e
        return
