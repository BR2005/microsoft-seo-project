import json
from typing import Any

import psycopg

from .config import get_settings


def save_run(run: dict[str, Any]) -> dict[str, str]:
    try:
        with psycopg.connect(get_settings().database_url, connect_timeout=3) as connection:
            with connection.cursor() as cursor:
                cursor.execute(
                    "CREATE TABLE IF NOT EXISTS workflow_runs (id text primary key, customer_id text, website_id text, payload jsonb)"
                )
                cursor.execute(
                    "INSERT INTO workflow_runs (id, customer_id, website_id, payload) VALUES (%s, %s, %s, %s) "
                    "ON CONFLICT (id) DO UPDATE SET payload = EXCLUDED.payload",
                    (run["run_id"], run["customer_id"], run["website_id"], json.dumps(run)),
                )
        return {"status": "persisted", "source": "postgres"}
    except (psycopg.Error, OSError):
        return {"status": "unavailable", "source": "postgres"}
